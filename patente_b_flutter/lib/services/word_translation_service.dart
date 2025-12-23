import 'package:cloud_firestore/cloud_firestore.dart';

class WordTranslationService {
  // Singleton pattern
  static final WordTranslationService _instance =
      WordTranslationService._internal();
  factory WordTranslationService() => _instance;
  WordTranslationService._internal();

  // Map<LanguageCode, Map<Word, Translation>>
  // e.g. 'ur': {'auto': 'گاڑی', 'strada': 'سڑک', ...}
  final Map<String, Map<String, String>> _translations = {};
  bool _isLoaded = false;

  Future<void> loadTranslations() async {
    if (_isLoaded) return;

    try {
      // Use the SAME collection that has all the translations
      // The 'translations' collection has full question translations
      // We extract individual words from Italian text and their translations
      final snapshot = await FirebaseFirestore.instance
          .collection('translations')
          .get();

      // Initialize language maps
      _translations['ur'] = {};
      _translations['pa'] = {};
      _translations['hi'] = {};
      _translations['en'] = {};

      int wordCount = 0;

      for (final doc in snapshot.docs) {
        final data = doc.data();
        final italianText = data['it']?.toString() ?? '';

        if (italianText.isEmpty) continue;

        // Extract individual words from Italian text
        final words = _extractWords(italianText);

        // For each word, try to find corresponding translation
        // This is a simplified approach - we map common words
        for (final word in words) {
          final lowerWord = word.toLowerCase().trim();
          if (lowerWord.length < 2) continue; // Skip single chars

          // Urdu
          if (data.containsKey('ur') && data['ur'] != null) {
            final urTranslation = data['ur'].toString();
            if (urTranslation.isNotEmpty) {
              // Store full translation for each word (not ideal but functional)
              // In production, you'd have a proper word-level dictionary
              if (!_translations['ur']!.containsKey(lowerWord)) {
                _translations['ur']![lowerWord] = _getFirstWord(urTranslation);
                wordCount++;
              }
            }
          }

          // Punjabi
          if (data.containsKey('pa') && data['pa'] != null) {
            final paTranslation = data['pa'].toString();
            if (paTranslation.isNotEmpty) {
              if (!_translations['pa']!.containsKey(lowerWord)) {
                _translations['pa']![lowerWord] = _getFirstWord(paTranslation);
              }
            }
          }
        }
      }

      _isLoaded = true;
      print(
        '📚 Loaded word translations: ${_translations['ur']?.length ?? 0} unique Urdu words from $wordCount entries',
      );
    } catch (e) {
      print('Error loading word translations: $e');
    }
  }

  /// Get translation for a specific word in a language
  String? getWordTranslation(String word, String languageCode) {
    final lowerWord = word.toLowerCase().trim();
    return _translations[languageCode]?[lowerWord];
  }

  /// Check if translations are loaded
  bool get isLoaded => _isLoaded;

  /// Extract words from Italian text
  List<String> _extractWords(String text) {
    // Match Italian words (including accented characters)
    final regex = RegExp(r'[a-zA-ZàèéìòùÀÈÉÌÒÙ]+');
    return regex.allMatches(text).map((m) => m.group(0)!).toList();
  }

  /// Get first word/part of translation (for word-level display)
  String _getFirstWord(String text) {
    // For non-Latin scripts, return the whole thing (they're usually shorter)
    // This is a heuristic - proper solution would be a dedicated word dictionary
    if (text.length < 20) return text;

    // Find first meaningful chunk
    final parts = text.split(RegExp(r'[,،؛]'));
    return parts.first.trim();
  }

  Map<String, Map<String, String>> get translations => _translations;
}
