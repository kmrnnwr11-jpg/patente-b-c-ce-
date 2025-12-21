import 'package:translator/translator.dart';
import '../models/translation.dart';

/// Service for translating text using Google Translate API as fallback
class GoogleTranslateService {
  static final GoogleTranslateService _instance =
      GoogleTranslateService._internal();
  factory GoogleTranslateService() => _instance;
  GoogleTranslateService._internal();

  final GoogleTranslator _translator = GoogleTranslator();

  // Cache to avoid repeated API calls
  final Map<String, String> _cache = {};

  /// Translate text from Italian to target language
  Future<String?> translate(String text, AppLanguage targetLanguage) async {
    if (text.isEmpty) return null;

    // Get language code for Google Translate
    final targetCode = _getLanguageCode(targetLanguage);
    if (targetCode == null) return null;

    // Check cache first
    final cacheKey = '${text}_$targetCode';
    if (_cache.containsKey(cacheKey)) {
      print(
        '📦 Google Translate cache hit for: ${text.substring(0, text.length > 20 ? 20 : text.length)}...',
      );
      return _cache[cacheKey];
    }

    try {
      print('🌐 Calling Google Translate API: IT → $targetCode');
      final translation = await _translator.translate(
        text,
        from: 'it',
        to: targetCode,
      );

      final translatedText = translation.text;

      // Cache the result
      _cache[cacheKey] = translatedText;

      print(
        '✅ Google Translate result: ${translatedText.substring(0, translatedText.length > 30 ? 30 : translatedText.length)}...',
      );
      return translatedText;
    } catch (e) {
      print('❌ Google Translate error: $e');
      return null;
    }
  }

  /// Get Google Translate language code
  String? _getLanguageCode(AppLanguage language) {
    switch (language) {
      case AppLanguage.urdu:
        return 'ur';
      case AppLanguage.punjabi:
        return 'pa';
      case AppLanguage.hindi:
        return 'hi';
      case AppLanguage.english:
        return 'en';
      default:
        return null;
    }
  }

  /// Clear cache
  void clearCache() {
    _cache.clear();
  }
}
