import 'package:flutter/material.dart';
import 'package:flutter_tts/flutter_tts.dart';
import '../../models/translation.dart';

/// Service for text-to-speech functionality
class TtsService {
  static final TtsService _instance = TtsService._internal();
  factory TtsService() => _instance;
  TtsService._internal();

  final FlutterTts _flutterTts = FlutterTts();
  bool _isInitialized = false;
  bool _isSpeaking = false;

  /// Language code mappings for TTS
  static const Map<String, String> _languageMap = {
    'it': 'it-IT',
    'en': 'en-US',
    'hi': 'hi-IN',
    'ur': 'ur-PK',
    'pa': 'pa-IN',
  };

  /// Initialize TTS engine
  Future<void> init() async {
    if (_isInitialized) return;

    try {
      await _flutterTts.setSharedInstance(true);
      await _flutterTts.setSpeechRate(0.45);
      await _flutterTts.setVolume(1.0);
      await _flutterTts.setPitch(1.0);

      _flutterTts.setStartHandler(() {
        _isSpeaking = true;
      });

      _flutterTts.setCompletionHandler(() {
        _isSpeaking = false;
      });

      _flutterTts.setCancelHandler(() {
        _isSpeaking = false;
      });

      _flutterTts.setErrorHandler((msg) {
        _isSpeaking = false;
        print('TTS Error: $msg');
      });

      _isInitialized = true;
    } catch (e) {
      print('TTS Init Error: $e');
    }
  }

  /// Speak text in the specified language
  Future<void> speak(
    String text, {
    AppLanguage language = AppLanguage.italian,
  }) async {
    if (!_isInitialized) await init();

    try {
      // Stop any current speech
      await stop();

      // Set language
      final langCode = _languageMap[language.code] ?? 'it-IT';
      await _flutterTts.setLanguage(langCode);

      // Speak
      await _flutterTts.speak(text);
    } catch (e) {
      print('TTS Speak Error: $e');
    }
  }

  /// Stop speaking
  Future<void> stop() async {
    try {
      await _flutterTts.stop();
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

  const AudioButton({
    super.key,
    required this.text,
    this.language = AppLanguage.italian,
    this.size = 40,
    this.color,
    this.playingColor,
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
      await _ttsService.speak(widget.text, language: widget.language);
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

  const InlineAudioButton({
    super.key,
    required this.text,
    this.language = AppLanguage.italian,
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

  Future<void> _play() async {
    if (_isPlaying) return;

    setState(() => _isPlaying = true);
    await _ttsService.speak(widget.text, language: widget.language);

    // Auto-reset after speaking
    await Future.delayed(const Duration(seconds: 3));
    if (mounted) {
      setState(() => _isPlaying = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return IconButton(
      onPressed: _play,
      icon: Icon(
        _isPlaying ? Icons.volume_up : Icons.volume_up_outlined,
        color: _isPlaying ? Colors.green : Colors.blue.shade400,
      ),
      iconSize: 20,
      padding: EdgeInsets.zero,
      constraints: const BoxConstraints(minWidth: 32, minHeight: 32),
    );
  }
}
