import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import 'quiz/quiz_screen.dart';
import 'quiz/topic_selection_screen.dart';
import 'theory/theory_screen.dart';
import 'theory/signals_screen.dart';
import 'bookmarks/bookmarked_questions_screen.dart';
import 'stats/stats_screen.dart';
import 'settings/settings_screen.dart';
import 'course_selection_screen.dart';

/// Main dashboard screen - home page of the app
class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  int _selectedIndex = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: IndexedStack(
          index: _selectedIndex,
          children: [
            // Home Tab
            CustomScrollView(
              slivers: [
                SliverToBoxAdapter(
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    child: Column(
                      children: [
                        _buildHeader(context),
                        Row(
                          children: [
                            Expanded(
                              child: _buildLargeCard(
                                context,
                                icon: Icons.play_circle_fill,
                                title: 'Quiz Veloce',
                                subtitle: '10 domande',
                                color: const Color(0xFF3B82F6),
                                onTap: () => _startQuickQuiz(context),
                              ),
                            ),
                            const SizedBox(width: 16),
                            Expanded(
                              child: _buildLargeCard(
                                context,
                                icon: Icons.assignment,
                                title: 'Esame',
                                subtitle: 'Simulazione',
                                color: const Color(0xFF10B981),
                                onTap: () => _startExamSimulation(context),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
                SliverPadding(
                  padding: const EdgeInsets.all(16),
                  sliver: SliverGrid(
                    gridDelegate:
                        const SliverGridDelegateWithFixedCrossAxisCount(
                          crossAxisCount: 3,
                          mainAxisSpacing: 16,
                          crossAxisSpacing: 12,
                          childAspectRatio: 0.8,
                        ),
                    delegate: SliverChildListDelegate([
                      _buildGridCard(
                        context,
                        icon: Icons.category,
                        title: 'Argomenti',
                        subtitle: 'Per tema',
                        color: const Color(0xFF8B5CF6),
                        onTap: () => _openTopicSelection(context),
                      ),
                      _buildGridCard(
                        context,
                        icon: Icons.menu_book,
                        title: 'Teoria',
                        subtitle: 'Studia',
                        color: const Color(0xFFF59E0B),
                        onTap: () => _openTheory(context),
                      ),
                      _buildGridCard(
                        context,
                        icon: Icons.traffic,
                        title: 'Segnali',
                        subtitle: 'Stradali',
                        color: const Color(0xFFEF4444),
                        onTap: () => _openSignals(context),
                      ),
                      _buildGridCard(
                        context,
                        icon: Icons.error_outline,
                        title: 'Errori',
                        subtitle: 'Ripeti',
                        color: const Color(0xFFEC4899),
                        onTap: () => _startErrorsQuiz(context),
                      ),
                      _buildGridCard(
                        context,
                        icon: Icons.bookmark,
                        title: 'Salvate',
                        subtitle: 'Segnalibri',
                        color: const Color(0xFF6366F1),
                        onTap: () => _openBookmarks(context),
                      ),
                      _buildGridCard(
                        context,
                        icon: Icons.bar_chart,
                        title: 'Statistiche',
                        subtitle: 'Progressi',
                        color: const Color(0xFF14B8A6),
                        onTap: () => _openStats(context),
                      ),
                    ]),
                  ),
                ),
              ],
            ),
            // Placeholder for other tabs if we wanted real content
            Container(), // Corsi handled by onTap
            Container(), // Settings handled by onTap or real tab
          ],
        ),
      ),
      bottomNavigationBar: BottomNavigationBar(
        backgroundColor: AppTheme.cardColor,
        selectedItemColor: AppTheme.primaryColor,
        unselectedItemColor: Colors.grey,
        currentIndex: _selectedIndex,
        onTap: (index) {
          if (index == 1) {
            // Corsi - Navigate to selection
            Navigator.of(context).pushReplacement(
              MaterialPageRoute(
                builder: (context) => const CourseSelectionScreen(),
              ),
            );
            return;
          }
          if (index == 2) {
            // Settings - Navigate
            _openSettings(context);
            return;
          }
          setState(() {
            _selectedIndex = index;
          });
        },
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Home'),
          BottomNavigationBarItem(icon: Icon(Icons.swap_horiz), label: 'Corsi'),
          BottomNavigationBarItem(
            icon: Icon(Icons.settings),
            label: 'Impostazioni',
          ),
        ],
      ),
    );
  }

  Widget _buildHeader(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 60,
                height: 60,
                decoration: BoxDecoration(
                  gradient: AppTheme.primaryGradient,
                  borderRadius: BorderRadius.circular(16),
                ),
                child: const Icon(
                  Icons.directions_car,
                  color: Colors.white,
                  size: 32,
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Patente B',
                      style: Theme.of(context).textTheme.headlineSmall
                          ?.copyWith(fontWeight: FontWeight.bold),
                    ),
                    Text(
                      'Preparazione esame',
                      style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        color: AppTheme.textSecondary,
                      ),
                    ),
                  ],
                ),
              ),
              IconButton(
                icon: const Icon(Icons.settings_outlined),
                onPressed: () => _openSettings(context),
              ),
            ],
          ),
          const SizedBox(height: 24),
          // Stats row
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppTheme.surfaceColor,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppTheme.cardColor, width: 1),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _buildStatItem('1.742', 'Domande'),
                _buildDivider(),
                _buildStatItem('30+', 'Argomenti'),
                _buildDivider(),
                _buildStatItem('∞', 'Tentativi'),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatItem(String value, String label) {
    return Column(
      children: [
        Text(
          value,
          style: const TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.bold,
            color: AppTheme.primaryLight,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          label,
          style: const TextStyle(fontSize: 12, color: AppTheme.textSecondary),
        ),
      ],
    );
  }

  Widget _buildDivider() {
    return Container(width: 1, height: 40, color: AppTheme.cardColor);
  }

  Widget _buildLargeCard(
    BuildContext context, {
    required IconData icon,
    required String title,
    required String subtitle,
    required Color color,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        height: 120, // Taller card
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [color, color.withOpacity(0.8)],
          ),
          borderRadius: BorderRadius.circular(20),
          boxShadow: [
            BoxShadow(
              color: color.withOpacity(0.4),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.2),
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
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  /// Build iOS-style app icon with name below
  Widget _buildGridCard(
    BuildContext context, {
    required IconData icon,
    required String title,
    required String subtitle, // kept for compatibility but not displayed
    required Color color,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        mainAxisSize: MainAxisSize.min,
        children: [
          // iOS-style app icon
          Container(
            width: 56,
            height: 56,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [color, color.withValues(alpha: 0.7)],
              ),
              borderRadius: BorderRadius.circular(14),
              boxShadow: [
                BoxShadow(
                  color: color.withValues(alpha: 0.4),
                  blurRadius: 8,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Icon(icon, color: Colors.white, size: 28),
          ),
          const SizedBox(height: 8),
          // App name
          Text(
            title,
            style: const TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w500,
              color: Colors.white,
            ),
            textAlign: TextAlign.center,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }

  void _startQuickQuiz(BuildContext context) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => const QuizScreen(mode: QuizMode.quick),
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

  void _openBookmarks(BuildContext context) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => const BookmarkedQuestionsScreen(),
      ),
    );
  }

  void _openStats(BuildContext context) {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => const StatsScreen()),
    );
  }

  void _openSettings(BuildContext context) {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => const SettingsScreen()),
    );
  }

  void _startErrorsQuiz(BuildContext context) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => const QuizScreen(mode: QuizMode.quick),
      ),
    );
  }
}
