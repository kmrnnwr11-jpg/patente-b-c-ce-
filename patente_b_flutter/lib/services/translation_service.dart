import 'dart:convert';
import 'package:flutter/services.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/translation.dart';
import 'google_translate_service.dart';

/// Service for managing translations
class TranslationService {
  final Map<int, TranslatedQuestion> _translationsEn = {};
  // Text-based maps for Firebase translations (key = Italian text)
  final Map<String, String> _translationsUrByText = {}; // Urdu
  final Map<String, String> _translationsPaByText = {}; // Punjabi
  // ID-based maps for Firebase translations (key = question ID)
  final Map<int, String> _translationsUrById = {}; // Urdu by ID
  final Map<int, String> _translationsPaById = {}; // Punjabi by ID

  bool _isLoaded = false;
  bool _firestoreLoaded = false;
  AppLanguage _currentLanguage = AppLanguage.italian;

  /// Get current language
  AppLanguage get currentLanguage => _currentLanguage;

  /// Set current language
  void setLanguage(AppLanguage language) {
    _currentLanguage = language;
  }

  /// Load English translations from JSON
  Future<void> loadTranslations() async {
    if (_isLoaded) return;

    try {
      final String jsonString = await rootBundle.loadString(
        'assets/data/questions-en.json',
      );
      final List<dynamic> jsonList = json.decode(jsonString);

      for (final json in jsonList) {
        final question = TranslatedQuestion.fromJson(json);
        _translationsEn[question.id] = question;
      }

      _isLoaded = true;
      print('Loaded ${_translationsEn.length} translations');
    } catch (e) {
      print('Error loading translations: $e');
    }
  }

  /// Load translations from Firebase Firestore
  /// Structure: translations/{base64Id} → { it: "...", ur: "...", pa: "..." }
  Future<void> loadFromFirestore() async {
    if (_firestoreLoaded) return;

    try {
      final firestore = FirebaseFirestore.instance;

      // Load all translations from flat collection
      final snapshot = await firestore.collection('translations').get();

      int urCount = 0, paCount = 0;

      for (final doc in snapshot.docs) {
        final data = doc.data();
        final docId = doc.id; // Document ID might match question ID
        final italianText = data['it']?.toString() ?? '';
        if (italianText.isEmpty) continue;

        // Try to parse doc ID as int for ID-based lookup
        final int? numericId = int.tryParse(docId);

        // Urdu
        if (data.containsKey('ur') &&
            data['ur'] != null &&
            data['ur'].toString().isNotEmpty) {
          final urTranslation = data['ur'].toString();
          _translationsUrByText[italianText.trim()] = urTranslation;
          // Also store by ID if numeric
          if (numericId != null) {
            _translationsUrById[numericId] = urTranslation;
          }
          urCount++;
        }

        // Punjabi
        if (data.containsKey('pa') &&
            data['pa'] != null &&
            data['pa'].toString().isNotEmpty) {
          final paTranslation = data['pa'].toString();
          _translationsPaByText[italianText.trim()] = paTranslation;
          // Also store by ID if numeric
          if (numericId != null) {
            _translationsPaById[numericId] = paTranslation;
          }
          paCount++;
        }
      }

      print('📚 Firestore translations: Urdu=$urCount, Punjabi=$paCount');
      print(
        '📚 ID-based translations: Urdu=${_translationsUrById.length}, Punjabi=${_translationsPaById.length}',
      );
      _firestoreLoaded = true;
    } catch (e) {
      print('Error loading Firestore translations: $e');
    }
  }

  /// Get translated question by ID
  TranslatedQuestion? getTranslation(int questionId) {
    return _translationsEn[questionId];
  }

  /// Get question text in current language
  String getQuestionText(int questionId, String originalText) {
    if (_currentLanguage == AppLanguage.italian) {
      return originalText;
    }

    switch (_currentLanguage) {
      case AppLanguage.english:
        final translation = _translationsEn[questionId];
        if (translation != null && translation.domandaEn.isNotEmpty) {
          return translation.domandaEn;
        }
        break;
      case AppLanguage.hindi:
        // Hindi not available yet
        break;
      case AppLanguage.urdu:
        final text = _translationsUrByText[originalText.trim()];
        if (text != null && text.isNotEmpty) return text;
        break;
      case AppLanguage.punjabi:
        final text = _translationsPaByText[originalText.trim()];
        if (text != null && text.isNotEmpty) return text;
        break;
      default:
        break;
    }

    return originalText;
  }

  /// Get topic text in current language
  String getTopicText(int questionId, String originalTopic) {
    if (_currentLanguage == AppLanguage.italian) {
      return originalTopic;
    }

    final translation = _translationsEn[questionId];
    if (translation != null && translation.argomentoEn != null) {
      return translation.argomentoEn!;
    }

    return originalTopic;
  }

  /// Get translation for a specific language
  String? getSpecificTranslation(
    int questionId,
    String originalText,
    AppLanguage language,
  ) {
    final key = originalText.trim();
    final normalizedKey = _normalizeText(key);

    switch (language) {
      case AppLanguage.english:
        final translation = _translationsEn[questionId];
        return (translation != null && translation.domandaEn.isNotEmpty)
            ? translation.domandaEn
            : null;
      case AppLanguage.urdu:
        // 1. Try ID-based lookup first (most reliable)
        var result = _translationsUrById[questionId];
        if (result != null) {
          print('✅ Found UR translation by ID: $questionId');
          return result;
        }

        // 2. Try exact text match
        result = _translationsUrByText[key];
        result ??= _findByNormalizedKey(_translationsUrByText, normalizedKey);
        result ??= _findBySubstring(_translationsUrByText, key);
        if (result == null && _translationsUrByText.isNotEmpty) {
          print('🔍 UR full-question lookup failed (ID: $questionId)');
          print(
            '   Search key: "${key.substring(0, key.length > 50 ? 50 : key.length)}..."',
          );
        }
        return result;
      case AppLanguage.punjabi:
        // 1. Try ID-based lookup first
        var result = _translationsPaById[questionId];
        if (result != null) {
          print('✅ Found PA translation by ID: $questionId');
          return result;
        }

        // 2. Try text-based lookups
        result = _translationsPaByText[key];
        result ??= _findByNormalizedKey(_translationsPaByText, normalizedKey);
        result ??= _findBySubstring(_translationsPaByText, key);
        return result;
      default:
        return null;
    }
  }

  /// Normalize text for comparison
  String _normalizeText(String text) {
    return text.toLowerCase().replaceAll(RegExp(r'\s+'), ' ').trim();
  }

  /// Find by normalized key
  String? _findByNormalizedKey(Map<String, String> map, String normalizedKey) {
    for (final entry in map.entries) {
      if (_normalizeText(entry.key) == normalizedKey) {
        return entry.value;
      }
    }
    return null;
  }

  /// Find by substring match (for partial text matches)
  String? _findBySubstring(Map<String, String> map, String searchText) {
    final normalizedSearch = _normalizeText(searchText);

    // Try to find a key that contains the search text (or vice versa)
    for (final entry in map.entries) {
      final normalizedKey = _normalizeText(entry.key);

      // Check if key contains search text OR search text contains key
      if (normalizedKey.contains(normalizedSearch) ||
          normalizedSearch.contains(normalizedKey)) {
        print('   🔎 Found via substring match!');
        return entry.value;
      }

      // Also check first 30 chars match (for long questions)
      if (normalizedKey.length > 30 && normalizedSearch.length > 30) {
        if (normalizedKey.substring(0, 30) ==
            normalizedSearch.substring(0, 30)) {
          print('   🔎 Found via prefix match!');
          return entry.value;
        }
      }
    }
    return null;
  }

  /// Check if translations are loaded
  bool get isLoaded => _isLoaded;

  /// Get number of available translations
  int get translationCount => _translationsEn.length;

  /// Get translation with Google Translate API fallback (async version)
  /// Use this when Firebase translation is not found
  Future<String?> getTranslationWithFallback(
    int questionId,
    String originalText,
    AppLanguage language,
  ) async {
    // 1. Try Firebase lookup first
    final firebaseResult = getSpecificTranslation(
      questionId,
      originalText,
      language,
    );
    if (firebaseResult != null) {
      return firebaseResult;
    }

    // 2. Skip Italian - no translation needed
    if (language == AppLanguage.italian) {
      return originalText;
    }

    // 3. Fallback to Google Translate API
    print(
      '🌐 Using Google Translate fallback for: ${originalText.substring(0, originalText.length > 30 ? 30 : originalText.length)}...',
    );
    final googleResult = await GoogleTranslateService().translate(
      originalText,
      language,
    );

    return googleResult;
  }
}
