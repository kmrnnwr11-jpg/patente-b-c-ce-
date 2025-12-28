import 'package:flutter/material.dart';
import 'dart:ui';
import 'package:provider/provider.dart';
import '../models/translation.dart';
import '../services/language_preference_service.dart';
import '../theme/apple_glass_theme.dart';
import '../providers/theme_provider.dart';
import '../widgets/core/translation_fab.dart';
import 'dashboard_screen.dart';
import 'quiz/topic_selection_screen.dart';
import 'theory/theory_screen.dart';
import 'settings/settings_screen.dart';

/// Schermata principale con Bottom Navigation Bar
/// 4 tab: Home, Quiz, Teoria, Profilo
class MainNavigationScreen extends StatefulWidget {
  const MainNavigationScreen({super.key});

  @override
  State<MainNavigationScreen> createState() => _MainNavigationScreenState();
}

class _MainNavigationScreenState extends State<MainNavigationScreen> {
  int _currentIndex = 0;
  final LanguagePreferenceService _languageService =
      LanguagePreferenceService();
  AppLanguage _currentLanguage = AppLanguage.italian;

  // Pagine per ogni tab
  late final List<Widget> _pages;

  @override
  void initState() {
    super.initState();
    _loadLanguage();
    _pages = [
      const DashboardScreen(),
      const TopicSelectionScreen(),
      const TheoryScreen(),
      const SettingsScreen(),
    ];
  }

  Future<void> _loadLanguage() async {
    await _languageService.loadPreference();
    setState(() {
      _currentLanguage = _languageService.preferredLanguage;
    });
  }

  void _onLanguageChanged(AppLanguage language) {
    setState(() {
      _currentLanguage = language;
    });
    _languageService.setPreferredLanguage(language);
  }

  void _showLanguageSelector() {
    LanguageSelectorSheet.show(
      context,
      currentLanguage: _currentLanguage,
      onLanguageSelected: _onLanguageChanged,
    );
  }

  @override
  Widget build(BuildContext context) {
    final themeProvider = context.watch<ThemeProvider>();
    final isDarkMode = themeProvider.isDarkMode;

    return Scaffold(
      extendBody: true, // Allow body to go behind the glass navbar
      body: IndexedStack(index: _currentIndex, children: _pages),
      bottomNavigationBar: Container(
        margin: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
        decoration: BoxDecoration(
          color: isDarkMode
              ? AppleGlassTheme.glassBgActive
              : AppleGlassTheme.glassDecorationLight().color?.withOpacity(0.85),
          borderRadius: BorderRadius.circular(32),
          border: Border.all(
            color: isDarkMode
                ? AppleGlassTheme.glassBorder
                : AppleGlassTheme.glassDecorationLight().border!.top.color,
            width: 1,
          ),
          boxShadow: isDarkMode
              ? AppleGlassTheme.shadowLg
              : [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.1),
                    blurRadius: 20,
                    offset: const Offset(0, 10),
                  ),
                ],
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(32),
          child: BackdropFilter(
            filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 12),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  _buildNavItem(0, Icons.home_rounded, 'Home', isDarkMode),
                  _buildNavItem(1, Icons.quiz_rounded, 'Quiz', isDarkMode),
                  _buildNavItem(
                    2,
                    Icons.menu_book_rounded,
                    'Teoria',
                    isDarkMode,
                  ),
                  _buildNavItem(3, Icons.person_rounded, 'Profilo', isDarkMode),
                ],
              ),
            ),
          ),
        ),
      ),
      floatingActionButton: TranslationFAB(
        currentLanguage: _currentLanguage,
        onPressed: _showLanguageSelector,
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.endFloat,
    );
  }

  Widget _buildNavItem(
    int index,
    IconData icon,
    String label,
    bool isDarkMode,
  ) {
    final isSelected = _currentIndex == index;

    // Active color: Accent Blue
    // Inactive color: White/Dark Grey depending on theme
    final activeColor = AppleGlassTheme.accentBlue;
    final inactiveColor = isDarkMode
        ? AppleGlassTheme.textTertiary
        : AppleGlassTheme.textTertiaryDark;

    return InkWell(
      onTap: () => setState(() => _currentIndex = index),
      borderRadius: BorderRadius.circular(20),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
        decoration: BoxDecoration(
          color: isSelected
              ? activeColor.withOpacity(0.15)
              : Colors.transparent,
          borderRadius: BorderRadius.circular(20),
        ),
        child: Row(
          // Changed to Row for pill shape if desired, or Column
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              icon,
              size: 24,
              color: isSelected ? activeColor : inactiveColor,
            ),
            if (isSelected) ...[
              const SizedBox(width: 8),
              Text(
                label,
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                  color: activeColor,
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
