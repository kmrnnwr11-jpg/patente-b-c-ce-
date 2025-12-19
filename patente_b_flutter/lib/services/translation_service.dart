import 'dart:convert';
import 'package:flutter/services.dart';
import '../models/translation.dart';

/// Service for managing translations
class TranslationService {
  Map<int, TranslatedQuestion> _translationsEn = {};
  bool _isLoaded = false;
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

  /// Get translated question by ID
  TranslatedQuestion? getTranslation(int questionId) {
    return _translationsEn[questionId];
  }

  /// Get question text in current language
  String getQuestionText(int questionId, String originalText) {
    if (_currentLanguage == AppLanguage.italian) {
      return originalText;
    }

    final translation = _translationsEn[questionId];
    if (translation != null && translation.domandaEn.isNotEmpty) {
      return translation.domandaEn;
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

  /// Check if translations are loaded
  bool get isLoaded => _isLoaded;

  /// Get number of available translations
  int get translationCount => _translationsEn.length;
}
