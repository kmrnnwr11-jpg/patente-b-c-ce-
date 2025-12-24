import 'package:flutter/material.dart';

import '../services/language_preference_service.dart';
import '../models/translation.dart';
import '../theme/app_theme.dart';
import 'quiz/quiz_screen.dart';
import 'quiz/topic_selection_screen.dart';
import 'theory/theory_screen.dart';
import 'theory/signals_screen.dart';
import 'settings/settings_screen.dart';
import 'documents/documents_screen.dart';
import 'ai_tutor/tutor_topic_screen.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  final LanguagePreferenceService _languageService =
      LanguagePreferenceService();
  AppLanguage _selectedLanguage = AppLanguage.italian;

  @override
  void initState() {
    super.initState();
    _loadLanguagePreference();
  }

  Future<void> _loadLanguagePreference() async {
    await _languageService.loadPreference();
    setState(() {
      _selectedLanguage = _languageService.preferredLanguage;
    });
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildHeader(context),
              const SizedBox(height: 24),
              _buildPreparationBar(context),
              const SizedBox(height: 24),
              _buildMainActions(context),
              const SizedBox(height: 16),
              _buildAiTutorAction(context),
              const SizedBox(height: 24),
              _buildGridActions(context),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHeader(BuildContext context) {
    final theme = Theme.of(context);
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Bentornato,',
              style: theme.textTheme.bodyMedium?.copyWith(
                color: theme.colorScheme.onSurface.withOpacity(0.6),
              ),
            ),
            Text(
              'Studente',
              style: theme.textTheme.headlineSmall?.copyWith(
                fontWeight: FontWeight.bold,
                color: theme.colorScheme.onSurface,
              ),
            ),
          ],
        ),
        Row(
          children: [
            // Language selector dropdown
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: theme.cardColor,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: theme.dividerColor),
              ),
              child: DropdownButtonHideUnderline(
                child: DropdownButton<AppLanguage>(
                  value: _selectedLanguage,
                  icon: const Icon(Icons.keyboard_arrow_down, size: 20),
                  isDense: true,
                  items: AppLanguage.values.map((lang) {
                    return DropdownMenuItem(
                      value: lang,
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text(lang.flag, style: const TextStyle(fontSize: 18)),
                          const SizedBox(width: 6),
                          Text(lang.name, style: const TextStyle(fontSize: 12)),
                        ],
                      ),
                    );
                  }).toList(),
                  onChanged: (lang) {
                    if (lang != null) {
                      setState(() => _selectedLanguage = lang);
                      _languageService.setPreferredLanguage(lang);
                    }
                  },
                ),
              ),
            ),
            const SizedBox(width: 8),
            // Settings button
            Container(
              decoration: BoxDecoration(
                color: theme.cardColor,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: theme.dividerColor),
              ),
              child: IconButton(
                icon: Icon(
                  Icons.settings_outlined,
                  color: theme.colorScheme.onSurface,
                ),
                onPressed: () => _openSettings(context),
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildPreparationBar(BuildContext context) {
    // Mock calculation based on stats or just random for now
    // In real app, pull from StatsService
    const double preparation = 0.35; // 35% ready
    final theme = Theme.of(context);

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: theme.cardColor,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Preparazione Esame',
                style: theme.textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
              ),
              Text(
                '${(preparation * 100).toInt()}%',
                style: theme.textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.bold,
                  color: theme.primaryColor,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          ClipRRect(
            borderRadius: BorderRadius.circular(10),
            child: LinearProgressIndicator(
              value: preparation,
              minHeight: 12,
              backgroundColor: theme.dividerColor.withOpacity(0.3),
              valueColor: AlwaysStoppedAnimation<Color>(theme.primaryColor),
            ),
          ),
          const SizedBox(height: 12),
          Text(
            'Continua così! Completa più quiz per aumentare la tua probabilità di successo.',
            style: theme.textTheme.bodySmall?.copyWith(
              color: theme.colorScheme.onSurface.withOpacity(0.6),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMainActions(BuildContext context) {
    final theme = Theme.of(context);
    return Row(
      children: [
        Expanded(
          child: _buildLargeCard(
            context,
            icon: Icons.play_circle_fill,
            title: 'Simulazione\nEsame',
            subtitle: '30 Domande',
            color: theme.primaryColor,
            onTap: () => _startExamSimulation(context),
          ),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: _buildLargeCard(
            context,
            icon: Icons.school,
            title: 'Quiz per\nArgomento',
            subtitle: 'Esercitati',
            color: AppTheme
                .accentPurple, // Need to make sure this exists or use replacement
            onTap: () => _openTopicSelection(context),
          ),
        ),
      ],
    );
  }

  Widget _buildAiTutorAction(BuildContext context) {
    return GestureDetector(
      onTap: () => _openAiTutor(context),
      child: Container(
        height: 100,
        width: double.infinity,
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [Colors.indigo.shade800, Colors.indigo.shade500],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
          borderRadius: BorderRadius.circular(24),
          boxShadow: [
            BoxShadow(
              color: Colors.indigo.withOpacity(0.4),
              blurRadius: 12,
              offset: const Offset(0, 6),
            ),
          ],
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.2),
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.play_circle_fill,
                color: Colors.white,
                size: 32,
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Text(
                    'Ascolta Lezione Video',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Tutorial audiovisivi per imparare meglio',
                    style: TextStyle(
                      fontSize: 12,
                      color: Colors.white.withOpacity(0.8),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildGridActions(BuildContext context) {
    // Grid of 4 items
    return GridView.count(
      crossAxisCount: 4,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      mainAxisSpacing: 16,
      crossAxisSpacing: 16,
      childAspectRatio: 0.8,
      children: [
        _buildGridIcon(
          context,
          icon: Icons.menu_book_rounded,
          label: 'Teoria',
          color: Colors.orange,
          onTap: () => _openTheory(context),
        ),
        _buildGridIcon(
          context,
          icon: Icons.warning_rounded,
          label: 'Segnali',
          color: Colors.amber,
          onTap: () => _openSignals(context),
        ),
        _buildGridIcon(
          context,
          icon: Icons.refresh_rounded,
          label: 'Ripasso\nErrori',
          color: AppTheme.accentRed,
          onTap: () => _startErrorsQuiz(context),
        ),
        _buildGridIcon(
          context,
          icon: Icons.folder_special,
          label: 'Documenti',
          color: AppTheme.accentGreen,
          onTap: () => _openDocuments(context),
        ),
      ],
    );
  }

  Widget _buildLargeCard(
    BuildContext context, {
    required IconData icon,
    required String title,
    required String subtitle,
    required Color color,
    required VoidCallback onTap,
    bool fullWidth = false,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        height: 160,
        width: fullWidth ? double.infinity : null,
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: color,
          borderRadius: BorderRadius.circular(24),
          boxShadow: [
            BoxShadow(
              color: color.withOpacity(0.4),
              blurRadius: 12,
              offset: const Offset(0, 6),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.25),
                shape: BoxShape.circle,
              ),
              child: Icon(icon, color: Colors.white, size: 28),
            ),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                    height: 1.2,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  subtitle,
                  style: TextStyle(
                    fontSize: 12,
                    color: Colors.white.withOpacity(0.8),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildGridIcon(
    BuildContext context, {
    required IconData icon,
    required String label,
    required Color color,
    required VoidCallback onTap,
  }) {
    final theme = Theme.of(context);
    return GestureDetector(
      onTap: onTap,
      child: Column(
        children: [
          Container(
            width: 56,
            height: 56,
            decoration: BoxDecoration(
              color: theme.cardColor,
              borderRadius: BorderRadius.circular(16),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.05),
                  blurRadius: 8,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: Icon(icon, color: color, size: 26),
          ),
          const SizedBox(height: 8),
          Text(
            label,
            textAlign: TextAlign.center,
            style: theme.textTheme.bodySmall?.copyWith(
              fontWeight: FontWeight.w500,
              fontSize: 11,
            ),
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }

  void _startExamSimulation(BuildContext context) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => const QuizScreen(mode: QuizMode.exam),
      ),
    );
  }

  void _openTopicSelection(BuildContext context) {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => const TopicSelectionScreen()),
    );
  }

  void _openTheory(BuildContext context) {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => const TheoryScreen()),
    );
  }

  void _openSignals(BuildContext context) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => const SignalsScreen(
          category: 'pericolo',
          title: 'Segnali Stradali',
        ),
      ),
    );
  }

  void _startErrorsQuiz(BuildContext context) {
    // This assumes QuizMode or QuizService supports 'errors'
    // If not, we fall back to quick quiz but with specific params
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => const QuizScreen(mode: QuizMode.errors),
      ),
    );
  }

  void _openDocuments(BuildContext context) {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => const DocumentsScreen()),
    );
  }

  void _openSettings(BuildContext context) {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => const SettingsScreen()),
    );
  }

  void _openAiTutor(BuildContext context) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => TutorTopicScreen(language: _selectedLanguage),
      ),
    );
  }
}

// Add these extension/constants if needed or just rely on Material Colors
// The previous file had AccentPurple, let's substitute if missing
extension AppThemeColors on AppTheme {
  static const Color accentPurple = Color(0xFF8B5CF6);
}
