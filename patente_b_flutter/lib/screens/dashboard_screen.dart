import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../services/language_preference_service.dart';
import '../services/course_service.dart';
import '../models/translation.dart';
import '../theme/app_theme.dart';
import '../theme/apple_glass_theme.dart';
import '../widgets/glass/glass_card.dart';
import '../widgets/glass/progress_ring.dart';
// Removed: import '../widgets/core/progress_circle.dart';
import 'quiz/quiz_screen.dart';
import 'quiz/topic_selection_screen.dart';
import 'theory/theory_screen.dart';
import 'theory/signals_screen.dart';
import 'settings/settings_screen.dart';
import 'documents/documents_screen.dart';
import 'ai_tutor/tutor_topic_screen.dart';
import 'stats/stats_screen.dart';
import 'license_selection_screen.dart';

/// Dashboard principale con design Duolingo-style
/// Gamificazione, progresso visivo, accesso rapido alle funzioni
class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  final LanguagePreferenceService _languageService =
      LanguagePreferenceService();
  AppLanguage _selectedLanguage = AppLanguage.italian;

  // Mock progress data (in real app, from StatsService)
  final double _overallProgress = 0.42;
  final int _streak = 3;
  final int _quizCompleted = 12;
  final int _totalQuiz = 30;

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
    // theme variable removed as we use AppleGlassTheme

    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(gradient: AppleGlassTheme.bgGradient),
        child: SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildHeader(context),
                const SizedBox(height: 24),
                _buildProgressSection(context),
                const SizedBox(height: 24),
                _buildQuickActions(context),
                const SizedBox(height: 24),
                _buildStudySection(context),
                const SizedBox(height: 24),
                _buildWeakTopicsSection(context),
              ],
            ),
          ),
        ),
      ),
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // HEADER con saluto e streak
  // ═══════════════════════════════════════════════════════════════════════════
  Widget _buildHeader(BuildContext context) {
    // final theme = Theme.of(context); // Not needed with AppleGlassTheme
    final courseService = context.watch<CourseService>();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // License badge with change button
        GlassCard(
          borderRadius: AppleGlassTheme.radiusLg,
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
          accentColor: courseService.licenseColor,
          onTap: () => _showChangeLicenseDialog(context),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                courseService.licenseIcon,
                style: const TextStyle(fontSize: 18),
              ),
              const SizedBox(width: 8),
              Text(
                courseService.licenseName,
                style: AppleGlassTheme.labelSmall.copyWith(
                  color: courseService.licenseColor,
                  fontSize: 14,
                ),
              ),
              const SizedBox(width: 8),
              Icon(
                Icons.swap_horiz,
                size: 18,
                color: courseService.licenseColor,
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),
        // Main header row
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Ciao! 👋', style: AppleGlassTheme.bodyMedium),
                Text('Pronto per studiare?', style: AppleGlassTheme.titleLarge),
              ],
            ),
            // Streak badge
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              decoration:
                  AppleGlassTheme.glassDecoration(
                    radius: AppleGlassTheme.radiusLg,
                  ).copyWith(
                    border: Border.all(
                      color: AppTheme.streakOrange,
                      width: 1.5,
                    ),
                    color: AppTheme.streakOrange.withValues(alpha: 0.15),
                  ),
              child: Row(
                children: [
                  const Text('🔥', style: TextStyle(fontSize: 20)),
                  const SizedBox(width: 6),
                  Text(
                    '$_streak',
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.streakOrange,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ],
    );
  }

  void _showChangeLicenseDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: AppleGlassTheme.bgSecondary,
        title: const Text(
          'Cambia Patente',
          style: TextStyle(color: Colors.white),
        ),
        content: const Text(
          'Vuoi cambiare la patente selezionata?',
          style: TextStyle(color: Colors.white70),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Annulla'),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: AppleGlassTheme.accentBlue,
            ),
            onPressed: () {
              Navigator.pop(context);
              Navigator.of(context).pushReplacement(
                MaterialPageRoute(
                  builder: (_) => const LicenseSelectionScreen(),
                ),
              );
            },
            child: const Text('Cambia', style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PROGRESSO con cerchio animato
  // ═══════════════════════════════════════════════════════════════════════════
  Widget _buildProgressSection(BuildContext context) {
    // final theme = Theme.of(context);

    return GlassCard(
      child: Padding(
        padding: const EdgeInsets.all(
          4,
        ), // GlassCard has padding, adding nice internal spacing
        child: Row(
          children: [
            // Progress Circle using new ProgressRing
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: ProgressRing(
                progress: _overallProgress,
                size: 90,
                strokeWidth: 8,
                color: AppleGlassTheme.accentBlue,
              ),
            ),
            const SizedBox(width: 16),
            // Stats
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Il Tuo Progresso', style: AppleGlassTheme.titleMedium),
                  const SizedBox(height: 8),
                  _buildStatRow(
                    '📝',
                    'Quiz completati',
                    '$_quizCompleted/$_totalQuiz',
                  ),
                  const SizedBox(height: 4),
                  _buildStatRow('🎯', 'Precisione', '78%'),
                  const SizedBox(height: 4),
                  _buildStatRow('📚', 'Teoria letta', '65%'),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatRow(String emoji, String label, String value) {
    return Row(
      children: [
        Text(emoji, style: const TextStyle(fontSize: 16)),
        const SizedBox(width: 8),
        Expanded(child: Text(label, style: AppleGlassTheme.statLabel)),
        Text(value, style: AppleGlassTheme.statValue),
      ],
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // AZIONI RAPIDE - Pulsanti grandi
  // ═══════════════════════════════════════════════════════════════════════════
  Widget _buildQuickActions(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: _ActionCard(
            icon: Icons.play_arrow_rounded,
            title: 'Inizia Quiz',
            subtitle: 'Esercitati!',
            color: AppleGlassTheme.accentBlue,
            onTap: () => Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => const TopicSelectionScreen()),
            ),
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: _ActionCard(
            icon: Icons.school_rounded,
            title: 'Simulazione',
            subtitle: '30 domande',
            color: AppleGlassTheme.success,
            onTap: () => Navigator.push(
              context,
              MaterialPageRoute(
                builder: (_) => const QuizScreen(mode: QuizMode.exam),
              ),
            ),
          ),
        ),
      ],
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SEZIONE STUDIO
  // ═══════════════════════════════════════════════════════════════════════════
  Widget _buildStudySection(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Studia', style: AppleGlassTheme.titleLarge),
        const SizedBox(height: 12),
        // Video Lezioni - Full Width
        _StudyCard(
          icon: '🎬',
          title: 'Video Lezioni',
          subtitle: 'Tutorial in ${_selectedLanguage.name}',
          color: AppleGlassTheme.accentPurple,
          onTap: () => Navigator.push(
            context,
            MaterialPageRoute(
              builder: (_) => TutorTopicScreen(language: _selectedLanguage),
            ),
          ),
        ),
        const SizedBox(height: 10),
        // Grid buttons
        Row(
          children: [
            Expanded(
              child: _StudyCard(
                icon: '📖',
                title: 'Teoria',
                subtitle: '30 capitoli',
                color: AppleGlassTheme.accentBlue,
                onTap: () => Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => const TheoryScreen()),
                ),
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: _StudyCard(
                icon: '⚠️',
                title: 'Segnali',
                subtitle: '81 segnali',
                color: AppleGlassTheme.warning,
                onTap: () => Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) => const SignalsScreen(
                      category: 'pericolo',
                      title: 'Segnali di Pericolo',
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 10),
        Row(
          children: [
            Expanded(
              child: _StudyCard(
                icon: '🔄',
                title: 'Ripasso Errori',
                subtitle: 'Rivedi gli errori',
                color: AppleGlassTheme.error,
                onTap: () => Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => const StatsScreen()),
                ),
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: _StudyCard(
                icon: '📋',
                title: 'Documenti',
                subtitle: 'Info utili',
                color: AppleGlassTheme.success,
                onTap: () => Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => const DocumentsScreen()),
                ),
              ),
            ),
          ],
        ),
      ],
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // ARGOMENTI DEBOLI
  // ═══════════════════════════════════════════════════════════════════════════
  Widget _buildWeakTopicsSection(BuildContext context) {
    // Mock data - in real app from StatsService
    final weakTopics = [
      {'name': 'Precedenza', 'accuracy': 45},
      {'name': 'Distanza di Sicurezza', 'accuracy': 52},
      {'name': 'Limiti di Velocità', 'accuracy': 58},
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text('⚡ Da Ripassare', style: AppleGlassTheme.titleLarge),
            TextButton(
              onPressed: () {},
              child: const Text(
                'Vedi tutti',
                style: TextStyle(color: AppleGlassTheme.accentBlue),
              ),
            ),
          ],
        ),
        const SizedBox(height: 8),
        ...weakTopics.map(
          (topic) => Padding(
            padding: const EdgeInsets.only(bottom: 8),
            child: _WeakTopicItem(
              name: topic['name'] as String,
              accuracy: topic['accuracy'] as int,
              onTap: () {
                // Navigate to specific topic quiz
              },
            ),
          ),
        ),
      ],
    );
  }

  void _openSettings(BuildContext context) {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (_) => const SettingsScreen()),
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// WIDGET HELPER
// ═══════════════════════════════════════════════════════════════════════════

/// Card azione principale con gradiente e glass
class _ActionCard extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  final Color color;
  final VoidCallback onTap;

  const _ActionCard({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GlassCard(
      onTap: onTap,
      accentColor: color,
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: color,
              borderRadius: BorderRadius.circular(12),
              boxShadow: AppleGlassTheme.glowShadow(color),
            ),
            child: Icon(icon, color: Colors.white, size: 24),
          ),
          const SizedBox(height: 16),
          Text(
            title,
            style: const TextStyle(
              color: AppleGlassTheme.textPrimary,
              fontWeight: FontWeight.bold,
              fontSize: 16,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            subtitle,
            style: TextStyle(
              color: AppleGlassTheme.textSecondary,
              fontSize: 12,
            ),
          ),
        ],
      ),
    );
  }
}

/// Card studio glass
class _StudyCard extends StatelessWidget {
  final String icon;
  final String title;
  final String subtitle;
  final Color color;
  final VoidCallback onTap;

  const _StudyCard({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GlassCardLight(
      onTap: onTap,
      accentColor: color, // Light accent for border/glow interaction
      padding: const EdgeInsets.all(14),
      child: Row(
        children: [
          Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(
              color: color.withValues(alpha: 0.15),
              borderRadius: BorderRadius.circular(10),
              border: Border.all(color: color.withValues(alpha: 0.3)),
            ),
            child: Center(
              child: Text(icon, style: const TextStyle(fontSize: 22)),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 14,
                    color: AppleGlassTheme.textPrimary,
                  ),
                ),
                Text(
                  subtitle,
                  style: TextStyle(
                    fontSize: 12,
                    color: AppleGlassTheme.textSecondary,
                  ),
                ),
              ],
            ),
          ),
          Icon(Icons.chevron_right, color: AppleGlassTheme.textTertiary),
        ],
      ),
    );
  }
}

/// Item argomento debole Glass
class _WeakTopicItem extends StatelessWidget {
  final String name;
  final int accuracy;
  final VoidCallback onTap;

  const _WeakTopicItem({
    required this.name,
    required this.accuracy,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final color = accuracy < 50
        ? AppleGlassTheme.error
        : AppleGlassTheme.warning;

    return GlassCardLight(
      onTap: onTap,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      borderRadius: AppleGlassTheme.radiusMd,
      child: Row(
        children: [
          Icon(Icons.warning_amber_rounded, color: color, size: 24),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              name,
              style: AppleGlassTheme.bodyLarge.copyWith(fontSize: 14),
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              color: color,
              borderRadius: BorderRadius.circular(20),
              boxShadow: AppleGlassTheme.glowShadow(color),
            ),
            child: Text(
              '$accuracy%',
              style: const TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
                fontSize: 12,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
