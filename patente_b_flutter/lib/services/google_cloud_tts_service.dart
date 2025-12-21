import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:path_provider/path_provider.dart';
import '../models/translation.dart';

/// Google Cloud Text-to-Speech Service
/// Provides high-quality TTS for languages not well supported by iOS native TTS
class GoogleCloudTtsService {
  static final GoogleCloudTtsService _instance =
      GoogleCloudTtsService._internal();
  factory GoogleCloudTtsService() => _instance;
  GoogleCloudTtsService._internal();

  // Google Cloud API Key
  static const String _apiKey = 'AIzaSyCGqV9OwqRKx4DDpo9qqz-vaRkTle1sw6g';
  static const String _baseUrl =
      'https://texttospeech.googleapis.com/v1/text:synthesize';

  // Voice configurations for different languages
  // Using Wavenet voices for best quality
  static const Map<String, Map<String, String>> _voiceConfig = {
    'ur': {
      'languageCode': 'ur-IN', // Urdu India (not ur-PK!)
      'name': 'ur-IN-Wavenet-A', // Female Urdu voice
      'ssmlGender': 'FEMALE',
    },
    'pa': {
      'languageCode': 'pa-IN',
      'name': 'pa-IN-Wavenet-A', // Female Punjabi voice
      'ssmlGender': 'FEMALE',
    },
    'hi': {
      'languageCode': 'hi-IN',
      'name': 'hi-IN-Wavenet-A', // Female Hindi voice
      'ssmlGender': 'FEMALE',
    },
    'it': {
      'languageCode': 'it-IT',
      'name': 'it-IT-Wavenet-A', // Female Italian voice
      'ssmlGender': 'FEMALE',
    },
    'en': {
      'languageCode': 'en-US',
      'name': 'en-US-Wavenet-F', // Female English voice
      'ssmlGender': 'FEMALE',
    },
  };

  // Cache directory for audio files
  Directory? _cacheDir;

  /// Initialize the service
  Future<void> init() async {
    try {
      final appDir = await getApplicationDocumentsDirectory();
      _cacheDir = Directory('${appDir.path}/tts_cache');
      if (!await _cacheDir!.exists()) {
        await _cacheDir!.create(recursive: true);
      }
      print('🔊 Google Cloud TTS: Initialized, cache at ${_cacheDir!.path}');
    } catch (e) {
      print('🔊 Google Cloud TTS Init Error: $e');
    }
  }

  /// Check if this service supports the given language
  bool supportsLanguage(AppLanguage language) {
    return _voiceConfig.containsKey(language.code);
  }

  /// Synthesize speech and return the audio file path
  Future<String?> synthesize(String text, AppLanguage language) async {
    if (text.isEmpty) return null;

    final langCode = language.code;
    final voiceConfig = _voiceConfig[langCode];

    if (voiceConfig == null) {
      print('🔊 Google Cloud TTS: Language $langCode not supported');
      return null;
    }

    // Check cache first
    final cacheKey = _getCacheKey(text, langCode);
    final cachedFile = await _getCachedFile(cacheKey);
    if (cachedFile != null) {
      print('🔊 Google Cloud TTS: Using cached audio');
      return cachedFile;
    }

    try {
      print('🔊 Google Cloud TTS: Synthesizing for $langCode...');

      final requestBody = {
        'input': {'text': text},
        'voice': {
          'languageCode': voiceConfig['languageCode'],
          'name': voiceConfig['name'],
          'ssmlGender': voiceConfig['ssmlGender'],
        },
        'audioConfig': {
          'audioEncoding': 'MP3',
          'speakingRate': 0.9, // Slightly slower for clarity
          'pitch': 0.0,
          'volumeGainDb': 0.0,
        },
      };

      final response = await http.post(
        Uri.parse('$_baseUrl?key=$_apiKey'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(requestBody),
      );

      if (response.statusCode == 200) {
        final responseData = jsonDecode(response.body);
        final audioContent = responseData['audioContent'] as String;

        // Decode base64 audio and save to file
        final audioBytes = base64Decode(audioContent);
        final filePath = await _saveToCache(cacheKey, audioBytes);

        print('🔊 Google Cloud TTS: Audio saved to $filePath');
        return filePath;
      } else {
        print(
          '🔊 Google Cloud TTS Error: ${response.statusCode} - ${response.body}',
        );

        // If Wavenet voice fails, try Standard voice
        if (voiceConfig['name']!.contains('Wavenet')) {
          print('🔊 Google Cloud TTS: Trying Standard voice...');
          return _synthesizeWithStandardVoice(text, language);
        }
        return null;
      }
    } catch (e) {
      print('🔊 Google Cloud TTS Error: $e');
      return null;
    }
  }

  /// Fallback to standard voice if Wavenet fails
  Future<String?> _synthesizeWithStandardVoice(
    String text,
    AppLanguage language,
  ) async {
    final langCode = language.code;
    final voiceConfig = _voiceConfig[langCode];
    if (voiceConfig == null) return null;

    // Replace Wavenet with Standard
    final standardVoiceName = voiceConfig['name']!.replaceAll(
      'Wavenet',
      'Standard',
    );

    try {
      final requestBody = {
        'input': {'text': text},
        'voice': {
          'languageCode': voiceConfig['languageCode'],
          'name': standardVoiceName,
          'ssmlGender': voiceConfig['ssmlGender'],
        },
        'audioConfig': {
          'audioEncoding': 'MP3',
          'speakingRate': 0.9,
          'pitch': 0.0,
        },
      };

      final response = await http.post(
        Uri.parse('$_baseUrl?key=$_apiKey'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(requestBody),
      );

      if (response.statusCode == 200) {
        final responseData = jsonDecode(response.body);
        final audioContent = responseData['audioContent'] as String;
        final audioBytes = base64Decode(audioContent);

        final cacheKey = _getCacheKey(text, langCode);
        return await _saveToCache(cacheKey, audioBytes);
      }
    } catch (e) {
      print('🔊 Google Cloud TTS Standard Voice Error: $e');
    }
    return null;
  }

  /// Get cache key for a text+language combination
  String _getCacheKey(String text, String langCode) {
    // Create a simple hash of the text
    final hash = text.hashCode.abs().toString();
    return '${langCode}_$hash';
  }

  /// Get cached file if exists
  Future<String?> _getCachedFile(String cacheKey) async {
    if (_cacheDir == null) await init();

    final file = File('${_cacheDir!.path}/$cacheKey.mp3');
    if (await file.exists()) {
      return file.path;
    }
    return null;
  }

  /// Save audio to cache
  Future<String> _saveToCache(String cacheKey, List<int> audioBytes) async {
    if (_cacheDir == null) await init();

    final file = File('${_cacheDir!.path}/$cacheKey.mp3');
    await file.writeAsBytes(audioBytes);
    return file.path;
  }

  /// Clear the audio cache
  Future<void> clearCache() async {
    if (_cacheDir == null) return;

    try {
      if (await _cacheDir!.exists()) {
        await _cacheDir!.delete(recursive: true);
        await _cacheDir!.create(recursive: true);
        print('🔊 Google Cloud TTS: Cache cleared');
      }
    } catch (e) {
      print('🔊 Google Cloud TTS Clear Cache Error: $e');
    }
  }

  /// List available voices for debugging
  Future<List<dynamic>> listVoices() async {
    try {
      final response = await http.get(
        Uri.parse('https://texttospeech.googleapis.com/v1/voices?key=$_apiKey'),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final voices = data['voices'] as List<dynamic>;

        // Filter for Urdu and Punjabi
        final relevantVoices = voices
            .where(
              (v) =>
                  v['languageCodes'].toString().contains('ur') ||
                  v['languageCodes'].toString().contains('pa') ||
                  v['languageCodes'].toString().contains('hi'),
            )
            .toList();

        print('🔊 Available voices for UR/PA/HI:');
        for (var voice in relevantVoices) {
          print(
            '   ${voice['name']} (${voice['languageCodes']}) - ${voice['ssmlGender']}',
          );
        }
        return relevantVoices;
      }
    } catch (e) {
      print('🔊 List Voices Error: $e');
    }
    return [];
  }
}
