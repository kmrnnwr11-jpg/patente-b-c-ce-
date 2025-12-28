import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// Provider for managing app theme (Day/Night mode)
class ThemeProvider with ChangeNotifier {
  static const String _themeKey = 'theme_mode';
  ThemeMode _themeMode = ThemeMode.system;

  ThemeMode get themeMode => _themeMode;

  bool get isDarkMode => _themeMode == ThemeMode.dark;

  ThemeProvider() {
    _loadTheme();
  }

  Future<void> _loadTheme() async {
    final prefs = await SharedPreferences.getInstance();
    final String? themeStr = prefs.getString(_themeKey);

    if (themeStr == 'light') {
      _themeMode = ThemeMode.light;
    } else if (themeStr == 'dark') {
      _themeMode = ThemeMode.dark;
    } else {
      _themeMode = ThemeMode.system;
    }

    notifyListeners();
  }

  Future<void> toggleTheme() async {
    if (_themeMode == ThemeMode.light) {
      await setTheme(ThemeMode.dark);
    } else {
      await setTheme(ThemeMode.light);
    }
  }

  Future<void> setTheme(ThemeMode mode) async {
    _themeMode = mode;
    final prefs = await SharedPreferences.getInstance();

    String value;
    switch (mode) {
      case ThemeMode.light:
        value = 'light';
        break;
      case ThemeMode.dark:
        value = 'dark';
        break;
      default:
        value = 'system';
    }

    await prefs.setString(_themeKey, value);
    notifyListeners();
  }
}
