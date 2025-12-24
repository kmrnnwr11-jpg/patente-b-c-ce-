import 'package:flutter/material.dart';
import 'package:flutter_tts/flutter_tts.dart';
import 'package:audioplayers/audioplayers.dart';
import '../../models/translation.dart';
import '../../services/google_cloud_tts_service.dart';

/// Service for text-to-speech functionality
/// Uses Google Cloud TTS for Urdu/Punjabi (high quality), native TTS for Italian/English
class TtsService {
  static final TtsService _instance = TtsService._internal();
  factory TtsService() => _instance;
  TtsService._internal();

  final FlutterTts _flutterTts = FlutterTts();
  final AudioPlayer _audioPlayer = AudioPlayer();
  final GoogleCloudTtsService _cloudTts = GoogleCloudTtsService();
  bool _isInitialized = false;
  bool _isSpeaking = false;

  /// Languages that should use Google Cloud TTS (better quality for these)
  static const List<String> _cloudTtsLanguages = ['ur', 'pa', 'hi'];

  /// Language code mappings for native iOS TTS
  static const Map<String, String> _nativeLanguageMap = {
    'it': 'it-IT',
    'en': 'en-US',
  };

  /// Initialize TTS engine
  Future<void> init() async {
    if (_isInitialized) return;

    try {
      // Initialize native TTS
      await _flutterTts.setSharedInstance(true);
      await _flutterTts.setIosAudioCategory(
        IosTextToSpeechAudioCategory.playback,
        [
          IosTextToSpeechAudioCategoryOptions.defaultToSpeaker,
          IosTextToSpeechAudioCategoryOptions.allowBluetooth,
          IosTextToSpeechAudioCategoryOptions.allowBluetoothA2DP,
        ],
        IosTextToSpeechAudioMode.defaultMode,
      );

      await _flutterTts.setSpeechRate(0.45);
      await _flutterTts.setVolume(1.0);
      await _flutterTts.setPitch(1.0);

      _flutterTts.setStartHandler(() {
        _isSpeaking = true;
        print('🔊 TTS: Started speaking');
      });

      _flutterTts.setCompletionHandler(() {
        _isSpeaking = false;
        print('🔊 TTS: Completed');
      });

      _flutterTts.setCancelHandler(() {
        _isSpeaking = false;
      });

      _flutterTts.setErrorHandler((msg) {
        _isSpeaking = false;
        print('🔊 TTS Error: $msg');
      });

      // Initialize Google Cloud TTS
      await _cloudTts.init();

      // Initialize audio player
      _audioPlayer.onPlayerComplete.listen((_) {
        _isSpeaking = false;
        print('🔊 Cloud TTS: Completed');
      });

      _isInitialized = true;
      print('🔊 TTS: Initialized with Google Cloud TTS support');
    } catch (e) {
      print('🔊 TTS Init Error: $e');
    }
  }

  /// Speak text in the specified language
  /// Uses Google Cloud TTS for Urdu/Punjabi/Hindi, native TTS for Italian/English
  /// If audioUrl is provided for Urdu/Punjabi, plays from URL instead of generating
  Future<void> speak(
    String text, {
    AppLanguage language = AppLanguage.italian,
    String? audioUrl,
  }) async {
    print(
      '🔊 TTS: speak() called with text: "$text", language: ${language.code}, audioUrl: $audioUrl',
    );

    if (!_isInitialized) {
      print('🔊 TTS: Not initialized, calling init()...');
      await init();
    }

    try {
      // Stop any current speech
      await stop();

      // Check if this language should use Google Cloud TTS
      if (_cloudTtsLanguages.contains(language.code)) {
        await _speakWithCloudTts(text, language, audioUrl: audioUrl);
      } else {
        await _speakWithNativeTts(text, language);
      }
    } catch (e) {
      print('🔊 TTS Speak Error: $e');
    }
  }

  /// Speak using Google Cloud TTS (for Urdu, Punjabi, Hindi)
  /// If audioUrl is provided, plays from URL instead of generating
  Future<void> _speakWithCloudTts(
    String text,
    AppLanguage language, {
    String? audioUrl,
  }) async {
    _isSpeaking = true;

    // If audio URL is provided, play from URL
    if (audioUrl != null && audioUrl.isNotEmpty) {
      try {
        print('🔊 Playing pre-recorded audio from URL: $audioUrl');
        // Set source first, then play (works better cross-platform)
        await _audioPlayer.setSourceUrl(audioUrl);
        await _audioPlayer.resume();
        return;
      } catch (e) {
        print('🔊 Error playing from URL: $e, falling back to TTS generation');
        // Fall through to generate audio
      }
    }

    // Fall back to real-time generation
    print('🔊 Using Google Cloud TTS for ${language.code}...');
    final audioPath = await _cloudTts.synthesize(text, language);
    if (audioPath != null) {
      print(
        '🔊 Playing audio from: ${audioPath.substring(0, audioPath.length > 50 ? 50 : audioPath.length)}...',
      );

      if (audioPath.startsWith('data:')) {
        // Play from Data URI (Web)
        await _audioPlayer.play(UrlSource(audioPath));
      } else {
        // Play from Local File (Mobile)
        await _audioPlayer.play(DeviceFileSource(audioPath));
      }
    } else {
      print('🔊 Cloud TTS failed, audio not available');
      _isSpeaking = false;
    }
  }

  /// Speak using native iOS TTS (for Italian, English)
  Future<void> _speakWithNativeTts(String text, AppLanguage language) async {
    final langCode = _nativeLanguageMap[language.code] ?? 'it-IT';
    print('🔊 Using native TTS with language: $langCode');

    await _flutterTts.setLanguage(langCode);
    await _flutterTts.speak(text);
  }

  /// Stop speaking
  Future<void> stop() async {
    try {
      await _flutterTts.stop();
      await _audioPlayer.stop();
      _isSpeaking = false;
    } catch (e) {
      print('TTS Stop Error: $e');
    }
  }

  /// Check if currently speaking
  bool get isSpeaking => _isSpeaking;

  /// Get available languages
  Future<List<String>> getLanguages() async {
    try {
      final languages = await _flutterTts.getLanguages;
      return List<String>.from(languages);
    } catch (e) {
      return [];
    }
  }

  /// Check if a language is available
  Future<bool> isLanguageAvailable(String langCode) async {
    // Cloud TTS languages are always available
    if (_cloudTtsLanguages.contains(langCode)) return true;
    try {
      final result = await _flutterTts.isLanguageAvailable(langCode);
      return result == 1;
    } catch (e) {
      return false;
    }
  }
}

/// Audio button widget for text-to-speech
class AudioButton extends StatefulWidget {
  final String text;
  final AppLanguage language;
  final double size;
  final Color? color;
  final Color? playingColor;
  final String? audioUrl;

  const AudioButton({
    super.key,
    required this.text,
    this.language = AppLanguage.italian,
    this.size = 40,
    this.color,
    this.playingColor,
    this.audioUrl,
  });

  @override
  State<AudioButton> createState() => _AudioButtonState();
}

class _AudioButtonState extends State<AudioButton>
    with SingleTickerProviderStateMixin {
  final TtsService _ttsService = TtsService();
  bool _isPlaying = false;
  late AnimationController _animationController;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      duration: const Duration(milliseconds: 1000),
      vsync: this,
    );
    _ttsService.init();
  }

  @override
  void dispose() {
    _ttsService.stop(); // Stop audio when leaving page
    _animationController.dispose();
    super.dispose();
  }

  Future<void> _togglePlay() async {
    if (_isPlaying) {
      await _ttsService.stop();
      _animationController.stop();
      _animationController.reset();
      setState(() => _isPlaying = false);
    } else {
      setState(() => _isPlaying = true);
      _animationController.repeat();
      await _ttsService.speak(
        widget.text,
        language: widget.language,
        audioUrl: widget.audioUrl,
      );
      // Wait a moment then check if still speaking
      await Future.delayed(const Duration(milliseconds: 500));
      if (!_ttsService.isSpeaking) {
        _animationController.stop();
        _animationController.reset();
        setState(() => _isPlaying = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final defaultColor = widget.color ?? Colors.blue.shade400;
    final playingColor = widget.playingColor ?? Colors.green.shade400;

    return GestureDetector(
      onTap: _togglePlay,
      child: AnimatedBuilder(
        animation: _animationController,
        builder: (context, child) {
          return Container(
            width: widget.size,
            height: widget.size,
            decoration: BoxDecoration(
              color: _isPlaying
                  ? playingColor.withOpacity(0.2)
                  : defaultColor.withOpacity(0.15),
              shape: BoxShape.circle,
              border: Border.all(
                color: _isPlaying ? playingColor : defaultColor,
                width: 2,
              ),
              boxShadow: _isPlaying
                  ? [
                      BoxShadow(
                        color: playingColor.withOpacity(
                          0.3 + 0.2 * _animationController.value,
                        ),
                        blurRadius: 8 + 4 * _animationController.value,
                        spreadRadius: 2 * _animationController.value,
                      ),
                    ]
                  : null,
            ),
            child: Icon(
              _isPlaying ? Icons.stop : Icons.volume_up,
              color: _isPlaying ? playingColor : defaultColor,
              size: widget.size * 0.5,
            ),
          );
        },
      ),
    );
  }
}

/// Compact inline audio button
class InlineAudioButton extends StatefulWidget {
  final String text;
  final AppLanguage language;
  final String? audioUrl;
  final IconData? icon;
  final Color? color;

  const InlineAudioButton({
    super.key,
    required this.text,
    this.language = AppLanguage.italian,
    this.audioUrl,
    this.icon,
    this.color,
  });

  @override
  State<InlineAudioButton> createState() => _InlineAudioButtonState();
}

class _InlineAudioButtonState extends State<InlineAudioButton> {
  final TtsService _ttsService = TtsService();
  bool _isPlaying = false;

  @override
  void initState() {
    super.initState();
    _ttsService.init();
  }

  @override
  void dispose() {
    _ttsService.stop(); // Stop audio when leaving page
    super.dispose();
  }

  Future<void> _togglePlay() async {
    // If already playing, stop it
    if (_isPlaying) {
      await _ttsService.stop();
      if (mounted) {
        setState(() => _isPlaying = false);
      }
      return;
    }

    setState(() => _isPlaying = true);
    await _ttsService.speak(
      widget.text,
      language: widget.language,
      audioUrl: widget.audioUrl,
    );

    // Auto-reset after speaking
    await Future.delayed(const Duration(seconds: 3));
    if (mounted) {
      setState(() => _isPlaying = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final defaultIcon = widget.icon ?? Icons.volume_up_outlined;
    final defaultColor = widget.color ?? Colors.blue.shade400;

    return IconButton(
      onPressed: _togglePlay,
      icon: Icon(
        _isPlaying ? Icons.volume_up : defaultIcon,
        color: _isPlaying ? Colors.green : defaultColor,
      ),
      iconSize: 20,
      padding: EdgeInsets.zero,
      constraints: const BoxConstraints(minWidth: 32, minHeight: 32),
    );
  }
}

/// Audio button that first fetches translation then speaks it
/// This ensures the TRANSLATED text is spoken, not the original Italian
class TranslationAudioButton extends StatefulWidget {
  final int questionId;
  final String italianText;
  final AppLanguage targetLanguage;
  final String? audioUrl;
  final IconData? icon;
  final Color? color;
  final Future<String?> Function(
    int questionId,
    String italianText,
    AppLanguage language,
  )
  getTranslation;

  const TranslationAudioButton({
    super.key,
    required this.questionId,
    required this.italianText,
    required this.targetLanguage,
    required this.getTranslation,
    this.audioUrl,
    this.icon,
    this.color,
  });

  @override
  State<TranslationAudioButton> createState() => _TranslationAudioButtonState();
}

class _TranslationAudioButtonState extends State<TranslationAudioButton> {
  final TtsService _ttsService = TtsService();
  bool _isPlaying = false;
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _ttsService.init();
  }

  @override
  void dispose() {
    // Stop audio when leaving the page
    _ttsService.stop();
    super.dispose();
  }

  Future<void> _togglePlay() async {
    // If already playing, stop it
    if (_isPlaying) {
      await _ttsService.stop();
      if (mounted) {
        setState(() => _isPlaying = false);
      }
      return;
    }

    if (_isLoading) return;

    setState(() => _isLoading = true);

    try {
      // First get the translation
      final translation = await widget.getTranslation(
        widget.questionId,
        widget.italianText,
        widget.targetLanguage,
      );

      if (translation != null && translation.isNotEmpty) {
        setState(() {
          _isLoading = false;
          _isPlaying = true;
        });

        print(
          '🔊 Playing TRANSLATED text: "${translation.substring(0, translation.length > 30 ? 30 : translation.length)}..."',
        );

        // Speak the TRANSLATED text
        await _ttsService.speak(
          translation,
          language: widget.targetLanguage,
          audioUrl: widget.audioUrl,
        );
      } else {
        print('⚠️ No translation available, falling back to Italian TTS');
        setState(() {
          _isLoading = false;
          _isPlaying = true;
        });

        // Fallback: speak Italian if no translation
        await _ttsService.speak(
          widget.italianText,
          language: widget.targetLanguage,
        );
      }
    } catch (e) {
      print('❌ Translation audio error: $e');
    }

    // Auto-reset after speaking
    await Future.delayed(const Duration(seconds: 3));
    if (mounted) {
      setState(() => _isPlaying = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final defaultIcon = widget.icon ?? Icons.translate;
    final defaultColor = widget.color ?? Colors.blue.shade400;

    if (_isLoading) {
      return SizedBox(
        width: 32,
        height: 32,
        child: Padding(
          padding: const EdgeInsets.all(6),
          child: CircularProgressIndicator(
            strokeWidth: 2,
            valueColor: AlwaysStoppedAnimation(defaultColor),
          ),
        ),
      );
    }

    return IconButton(
      onPressed: _togglePlay,
      icon: Icon(
        _isPlaying ? Icons.volume_up : defaultIcon,
        color: _isPlaying ? Colors.green : defaultColor,
      ),
      iconSize: 20,
      padding: EdgeInsets.zero,
      constraints: const BoxConstraints(minWidth: 32, minHeight: 32),
    );
  }
}
