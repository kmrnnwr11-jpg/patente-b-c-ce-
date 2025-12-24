import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/translation.dart';

/// Service for managing user's preferred language globally
/// Saves preference to SharedPreferences and provides it to all screens
class LanguagePreferenceService {
  // Singleton pattern
  static final LanguagePreferenceService _instance =
      LanguagePreferenceService._internal();
  factory LanguagePreferenceService() => _instance;
  LanguagePreferenceService._internal();

  static const String _prefKey = 'preferred_language';

  // Current preferred language (cached in memory)
  AppLanguage _preferredLanguage = AppLanguage.italian;
  bool _isLoaded = false;

  /// Get current preferred language
  AppLanguage get preferredLanguage => _preferredLanguage;

  /// Check if language preferences have been loaded
  bool get isLoaded => _isLoaded;

  /// Load preferred language from storage
  Future<void> loadPreference() async {
    if (_isLoaded) return;

    try {
      final prefs = await SharedPreferences.getInstance();
      final savedCode = prefs.getString(_prefKey);

      if (savedCode != null) {
        _preferredLanguage = _languageFromCode(savedCode);
        debugPrint('🌐 Loaded preferred language: ${_preferredLanguage.name}');
      } else {
        debugPrint('🌐 No saved language preference, using Italian as default');
      }
      _isLoaded = true;
    } catch (e) {
      debugPrint('Error loading language preference: $e');
      _isLoaded = true;
    }
  }

  /// Save preferred language to storage
  Future<void> setPreferredLanguage(AppLanguage language) async {
    _preferredLanguage = language;

    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(_prefKey, language.code);
      debugPrint('🌐 Saved preferred language: ${language.name}');
    } catch (e) {
      debugPrint('Error saving language preference: $e');
    }
  }

  /// Convert language code back to AppLanguage
  AppLanguage _languageFromCode(String code) {
    switch (code) {
      case 'ur':
        return AppLanguage.urdu;
      case 'pa':
        return AppLanguage.punjabi;
      case 'hi':
        return AppLanguage.hindi;
      case 'en':
        return AppLanguage.english;
      case 'it':
      default:
        return AppLanguage.italian;
    }
  }
}
