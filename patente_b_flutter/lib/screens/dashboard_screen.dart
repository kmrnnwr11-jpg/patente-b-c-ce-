import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:provider/provider.dart';

import '../services/language_preference_service.dart';
import '../services/course_service.dart';
import '../services/stats_service.dart';
import '../models/translation.dart';
import '../theme/app_theme.dart';
import '../theme/apple_glass_theme.dart';
import '../widgets/glass/glass_card.dart';
import '../widgets/glass/progress_ring.dart';
// Removed: import '../widgets/core/progress_circle.dart';
import '../providers/theme_provider.dart';
import '../providers/auth_provider.dart';
import '../widgets/common/theme_toggle_button.dart';
import '../widgets/user_avatar_widget.dart';
import 'quiz/quiz_screen.dart';
import 'quiz/topic_selection_screen.dart';
import 'theory/theory_screen.dart';
import 'theory/signals_screen.dart';
import 'settings/settings_screen.dart';
import 'documents/documents_screen.dart';
import 'ai_tutor/tutor_topic_screen.dart';
import 'stats/stats_screen.dart';
import 'license_selection_screen.dart';
import 'profile/profile_screen.dart';

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

  // Stats are now fetched from StatsService via Provider

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
    final themeProvider = context.watch<ThemeProvider>();
    final authProvider = context.watch<AuthProvider>();
    final isDarkMode = themeProvider.isDarkMode;

    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: isDarkMode
              ? AppleGlassTheme.bgGradient
              : AppleGlassTheme.bgGradientLight,
        ),
        child: SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildHeader(context, isDarkMode),
                const SizedBox(height: 24),
                _buildProgressSection(context, isDarkMode),
                const SizedBox(height: 24),
                _buildQuickActions(
                  context,
                ), // Actions usually have their own colored cards, check text inside
                if (authProvider.isAdmin) ...[
                  const SizedBox(height: 24),
                  _buildExternalLinks(context, isDarkMode),
                ],
                const SizedBox(height: 24),
                _buildStudySection(context, isDarkMode),
                const SizedBox(height: 24),
                _buildWeakTopicsSection(context, isDarkMode),
              ],
            ),
          ),
        ),
      ),
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // HEADER con saluto e streak
  // HEADER con saluto e streak
  // ═══════════════════════════════════════════════════════════════════════════
  Widget _buildHeader(BuildContext context, bool isDarkMode) {
    final courseService = context.watch<CourseService>();
    final statsService = context.watch<StatsService>();
    final stats = statsService.stats;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // License badge with change button
        GlassCard(
          isDarkMode: isDarkMode,
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
                Text(
                  'Ciao! 👋',
                  style: isDarkMode
                      ? AppleGlassTheme.bodyMedium
                      : AppleGlassTheme.bodyMedium.copyWith(
                          color: AppleGlassTheme.textSecondaryDark,
                        ),
                ),
                Text(
                  'Pronto per studiare?',
                  style: isDarkMode
                      ? AppleGlassTheme.titleLarge
                      : AppleGlassTheme.titleLarge.copyWith(
                          color: AppleGlassTheme.textPrimaryDark,
                        ),
                ),
              ],
            ),
            // Right side: Avatar, Streak, Theme toggle
            Row(
              children: [
                // User Avatar (cliccabile per andare al profilo)
                GestureDetector(
                  onTap: () => Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => const ProfileScreen()),
                  ),
                  child: const UserAvatarWidget(size: 40),
                ),
                const SizedBox(width: 12),
                // Streak badge
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 12,
                    vertical: 8,
                  ),
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
                        '${stats.currentStreak}',
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.streakOrange,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 12),
                ThemeToggleButton(
                  color: isDarkMode
                      ? Colors.white
                      : AppleGlassTheme.textPrimaryDark,
                ),
              ],
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
  // PROGRESSO con cerchio animato
  // ═══════════════════════════════════════════════════════════════════════════
  Widget _buildProgressSection(BuildContext context, bool isDarkMode) {
    final statsService = context.watch<StatsService>();
    final stats = statsService.stats;

    // Accuracy usually 0-100, normalize to 0-1 for progress ring
    // Or use quiz completion as progress?
    // Let's use quiz completed ratio if available, otherwise accuracy
    // Assuming 500 questions total for now roughly? No, let's use accuracy/100 as proxy for skill mastery
    // Or just 0 if new.
    final double uiProgress = stats.totalQuizzes > 0
        ? (stats.correctAnswers /
              (stats.totalQuestions > 0 ? stats.totalQuestions : 1))
        : 0.0;

    return GlassCard(
      isDarkMode: isDarkMode,
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
                progress: uiProgress,
                size: 90,
                strokeWidth: 8,
                color: AppleGlassTheme.accentBlue,
                textColor: isDarkMode
                    ? AppleGlassTheme.textPrimary
                    : Colors.black,
              ),
            ),
            const SizedBox(width: 16),
            // Stats
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Il Tuo Progresso',
                    style: isDarkMode
                        ? AppleGlassTheme.titleMedium
                        : AppleGlassTheme.titleMedium.copyWith(
                            color: AppleGlassTheme.textPrimaryDark,
                          ),
                  ),
                  const SizedBox(height: 8),
                  _buildStatRowWithIcon(
                    Icons.edit_note_rounded,
                    'Quiz completati',
                    '${stats.totalQuizzes}',
                    isDarkMode,
                    AppleGlassTheme.accentBlue,
                  ),
                  const SizedBox(height: 4),
                  _buildStatRowWithIcon(
                    Icons.gps_fixed_rounded,
                    'Precisione',
                    '${stats.accuracy.toStringAsFixed(1)}%',
                    isDarkMode,
                    AppleGlassTheme.success,
                  ),
                  const SizedBox(height: 4),
                  _buildStatRowWithIcon(
                    Icons.menu_book_rounded,
                    'Teoria letta',
                    '0%',
                    isDarkMode,
                    AppleGlassTheme.accentPurple,
                  ), // Placeholder
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatRowWithIcon(
    IconData icon,
    String label,
    String value,
    bool isDarkMode,
    Color iconColor,
  ) {
    return Row(
      children: [
        Icon(icon, size: 18, color: iconColor),
        const SizedBox(width: 8),
        Expanded(
          child: Text(
            label,
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w400,
              color: isDarkMode
                  ? Colors.white70
                  : AppleGlassTheme.textSecondaryDark,
            ),
          ),
        ),
        Text(
          value,
          style: TextStyle(
            fontSize: 15,
            fontWeight: FontWeight.w600,
            color: isDarkMode ? Colors.white : AppleGlassTheme.textPrimaryDark,
          ),
        ),
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
            assetPath: 'assets/images/dashboard/quiz_start.png',
            fallbackIcon: Icons.play_arrow_rounded,
            title: 'Inizia Quiz',
            subtitle: 'Esercitati!',
            color: AppleGlassTheme.accentBlue,
            isDarkMode:
                true, // Always dark mode style for action cards as they have colored backgrounds
            onTap: () => Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => const TopicSelectionScreen()),
            ),
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: _ActionCard(
            assetPath: 'assets/images/dashboard/simulation.png',
            fallbackIcon: Icons.school_rounded,
            title: 'Simulazione',
            subtitle: '30 domande',
            color: AppleGlassTheme.success,
            isDarkMode: true, // Always dark mode style for action cards
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
  // LINK ESTERNI
  // ═══════════════════════════════════════════════════════════════════════════
  Widget _buildExternalLinks(BuildContext context, bool isDarkMode) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Web Dashboard',
          style: isDarkMode
              ? AppleGlassTheme.titleLarge
              : AppleGlassTheme.titleLarge.copyWith(
                  color: AppleGlassTheme.textPrimaryDark,
                ),
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            Expanded(
              child: _StudyCard(
                assetPath: 'assets/images/dashboard/school.png',
                fallbackEmoji: '🏫',
                title: 'School',
                subtitle: 'Dashboard',
                color: Colors.indigo,
                isDarkMode: isDarkMode,
                onTap: () => _launchUrl('http://localhost:3001'),
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: _StudyCard(
                assetPath: 'assets/images/dashboard/admin.png',
                fallbackEmoji: '🔧',
                title: 'Admin',
                subtitle: 'Pannello',
                color: Colors.deepPurple,
                isDarkMode: isDarkMode,
                onTap: () => _launchUrl('http://localhost:3000'),
              ),
            ),
          ],
        ),
      ],
    );
  }

  Future<void> _launchUrl(String url) async {
    final uri = Uri.parse(url);
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    } else {
      if (mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('Impossibile aprire: $url')));
      }
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SEZIONE STUDIO
  // ═══════════════════════════════════════════════════════════════════════════
  Widget _buildStudySection(BuildContext context, bool isDarkMode) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Studia',
          style: isDarkMode
              ? AppleGlassTheme.titleLarge
              : AppleGlassTheme.titleLarge.copyWith(
                  color: AppleGlassTheme.textPrimaryDark,
                ),
        ),
        const SizedBox(height: 12),
        // Video Lezioni - Full Width
        _StudyCard(
          assetPath: 'assets/images/dashboard/video_lessons.png',
          fallbackEmoji: '🎬',
          title: 'Video Lezioni',
          subtitle: 'Tutorial in ${_selectedLanguage.name}',
          color: AppleGlassTheme.accentPurple,
          isDarkMode: isDarkMode,
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
                assetPath: 'assets/images/dashboard/theory_book.png',
                fallbackEmoji: '📖',
                title: 'Teoria',
                subtitle: '30 capitoli',
                color: AppleGlassTheme.accentBlue,
                isDarkMode: isDarkMode,
                onTap: () => Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => const TheoryScreen()),
                ),
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: _StudyCard(
                assetPath: 'assets/images/dashboard/signals.png',
                fallbackEmoji: '⚠️',
                title: 'Segnali',
                subtitle: '81 segnali',
                color: AppleGlassTheme.warning,
                isDarkMode: isDarkMode,
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
                assetPath: 'assets/images/dashboard/review_errors.png',
                fallbackEmoji: '🔄',
                title: 'Ripasso Errori',
                subtitle: 'Rivedi gli errori',
                color: AppleGlassTheme.error,
                isDarkMode: isDarkMode,
                onTap: () => Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => const StatsScreen()),
                ),
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: _StudyCard(
                assetPath: 'assets/images/dashboard/documents.png',
                fallbackEmoji: '📋',
                title: 'Documenti',
                subtitle: 'Info utili',
                color: AppleGlassTheme.success,
                isDarkMode: isDarkMode,
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
  Widget _buildWeakTopicsSection(BuildContext context, bool isDarkMode) {
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
            Text(
              '⚡ Da Ripassare',
              style: isDarkMode
                  ? AppleGlassTheme.titleLarge
                  : AppleGlassTheme.titleLarge.copyWith(
                      color: AppleGlassTheme.textPrimaryDark,
                    ),
            ),
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
              isDarkMode: isDarkMode,
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

/// Card azione principale - iOS style with solid gradient background
class _ActionCard extends StatelessWidget {
  final String assetPath;
  final IconData fallbackIcon;
  final String title;
  final String subtitle;
  final Color color;
  final bool isDarkMode;
  final VoidCallback onTap;

  const _ActionCard({
    required this.assetPath,
    required this.fallbackIcon,
    required this.title,
    required this.subtitle,
    required this.color,
    required this.isDarkMode,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    // Create a gradient from the accent color
    final gradient = LinearGradient(
      begin: Alignment.topLeft,
      end: Alignment.bottomRight,
      colors: [color, color.withValues(alpha: 0.8)],
    );

    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(20),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 150),
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            gradient: gradient,
            borderRadius: BorderRadius.circular(20),
            boxShadow: [
              BoxShadow(
                color: color.withValues(alpha: 0.3),
                blurRadius: 16,
                offset: const Offset(0, 6),
              ),
              BoxShadow(
                color: color.withValues(alpha: 0.2),
                blurRadius: 6,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: 0.2),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: SizedBox(
                  width: 24,
                  height: 24,
                  child: Icon(fallbackIcon, color: Colors.white, size: 28),
                ),
              ),
              const SizedBox(height: 16),
              Text(
                title,
                style: const TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                  fontSize: 16,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                subtitle,
                style: TextStyle(
                  color: Colors.white.withValues(alpha: 0.8),
                  fontSize: 12,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

/// Card studio glass
class _StudyCard extends StatelessWidget {
  final String assetPath;
  final String fallbackEmoji;
  final String title;
  final String subtitle;
  final Color color;
  final bool isDarkMode;
  final VoidCallback onTap;

  const _StudyCard({
    required this.assetPath,
    required this.fallbackEmoji,
    required this.title,
    required this.subtitle,
    required this.color,
    required this.isDarkMode,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GlassCardLight(
      isDarkMode: isDarkMode,
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
            padding: const EdgeInsets.all(4), // Padding for the image
            child: Center(
              child: Image.asset(
                assetPath,
                fit: BoxFit.contain,
                errorBuilder: (context, error, stackTrace) {
                  return Text(
                    fallbackEmoji,
                    style: const TextStyle(fontSize: 22),
                  );
                },
              ),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 14,
                    color: isDarkMode
                        ? AppleGlassTheme.textPrimary
                        : AppleGlassTheme.textPrimaryDark,
                  ),
                ),
                Text(
                  subtitle,
                  style: TextStyle(
                    fontSize: 12,
                    color: isDarkMode
                        ? AppleGlassTheme.textSecondary
                        : AppleGlassTheme.textSecondaryDark,
                  ),
                ),
              ],
            ),
          ),
          Icon(
            Icons.chevron_right,
            color: isDarkMode
                ? AppleGlassTheme.textTertiary
                : AppleGlassTheme.textSecondaryDark,
          ),
        ],
      ),
    );
  }
}

/// Item argomento debole Glass
class _WeakTopicItem extends StatelessWidget {
  final String name;
  final int accuracy;
  final bool isDarkMode;
  final VoidCallback onTap;

  const _WeakTopicItem({
    required this.name,
    required this.accuracy,
    required this.isDarkMode,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final color = accuracy < 50
        ? AppleGlassTheme.error
        : AppleGlassTheme.warning;

    return GlassCardLight(
      isDarkMode: isDarkMode,
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
              style: isDarkMode
                  ? AppleGlassTheme.bodyLarge.copyWith(fontSize: 14)
                  : AppleGlassTheme.bodyLarge.copyWith(
                      fontSize: 14,
                      color: AppleGlassTheme.textPrimaryDark,
                    ),
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
