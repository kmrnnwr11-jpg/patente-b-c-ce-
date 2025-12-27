import 'package:flutter/material.dart';
import '../models/translation.dart';
import '../services/language_preference_service.dart';
import '../theme/app_theme.dart';
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
    return Scaffold(
      body: IndexedStack(index: _currentIndex, children: _pages),
      // Bottom Navigation Bar con 4 icone
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: Theme.of(context).scaffoldBackgroundColor,
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.1),
              blurRadius: 10,
              offset: const Offset(0, -2),
            ),
          ],
        ),
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _buildNavItem(0, Icons.home_rounded, 'Home'),
                _buildNavItem(1, Icons.quiz_rounded, 'Quiz'),
                _buildNavItem(2, Icons.menu_book_rounded, 'Teoria'),
                _buildNavItem(3, Icons.person_rounded, 'Profilo'),
              ],
            ),
          ),
        ),
      ),
      // FAB traduzione sempre visibile
      floatingActionButton: TranslationFAB(
        currentLanguage: _currentLanguage,
        onPressed: _showLanguageSelector,
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.endFloat,
    );
  }

  Widget _buildNavItem(int index, IconData icon, String label) {
    final isSelected = _currentIndex == index;
    final theme = Theme.of(context);

    return InkWell(
      onTap: () => setState(() => _currentIndex = index),
      borderRadius: BorderRadius.circular(16),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
        decoration: BoxDecoration(
          color: isSelected
              ? AppTheme.primaryColor.withValues(alpha: 0.15)
              : Colors.transparent,
          borderRadius: BorderRadius.circular(16),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              icon,
              size: 26,
              color: isSelected
                  ? AppTheme.primaryColor
                  : theme.colorScheme.onSurface.withValues(alpha: 0.5),
            ),
            const SizedBox(height: 4),
            Text(
              label,
              style: TextStyle(
                fontSize: 12,
                fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                color: isSelected
                    ? AppTheme.primaryColor
                    : theme.colorScheme.onSurface.withValues(alpha: 0.5),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
