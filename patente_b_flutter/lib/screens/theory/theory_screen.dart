import 'package:flutter/material.dart';

import 'signals_screen.dart';

/// Main theory screen with signal categories and theory chapters
class TheoryScreen extends StatelessWidget {
  const TheoryScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [Color(0xFF5FB894), Color(0xFF4AA9D0), Color(0xFF3B9ED9)],
          ),
        ),
        child: SafeArea(
          child: Column(
            children: [
              // Header
              Padding(
                padding: const EdgeInsets.all(16),
                child: Row(
                  children: [
                    IconButton(
                      onPressed: () => Navigator.pop(context),
                      icon: const Icon(Icons.arrow_back, color: Colors.white),
                    ),
                    const Expanded(
                      child: Column(
                        children: [
                          Text(
                            'Teoria e Segnali',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          SizedBox(height: 4),
                          Text(
                            'Studia la teoria per argomento',
                            style: TextStyle(
                              color: Colors.white70,
                              fontSize: 14,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 48),
                  ],
                ),
              ),

              // Content
              Expanded(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Signal categories header
                      const Padding(
                        padding: EdgeInsets.symmetric(vertical: 16),
                        child: Row(
                          children: [
                            Text('🚦', style: TextStyle(fontSize: 24)),
                            SizedBox(width: 8),
                            Text(
                              'Segnali Stradali',
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                      ),

                      // Signal category cards
                      GridView.count(
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        crossAxisCount: 2,
                        crossAxisSpacing: 12,
                        mainAxisSpacing: 12,
                        childAspectRatio: 1.1,
                        children: [
                          _SignalCategoryCard(
                            title: 'Segnali di Pericolo',
                            icon: Icons.warning_amber_rounded,
                            color: Colors.red.withOpacity(0.3),
                            onTap: () => _navigateToSignals(
                              context,
                              'pericolo',
                              'Segnali di Pericolo',
                            ),
                          ),
                          _SignalCategoryCard(
                            title: 'Segnali di Precedenza',
                            icon: Icons.arrow_upward_rounded,
                            color: Colors.yellow.withOpacity(0.3),
                            onTap: () => _navigateToSignals(
                              context,
                              'precedenza',
                              'Segnali di Precedenza',
                            ),
                          ),
                          _SignalCategoryCard(
                            title: 'Segnali di Divieto',
                            icon: Icons.block_rounded,
                            color: Colors.red.shade700.withOpacity(0.3),
                            onTap: () => _navigateToSignals(
                              context,
                              'divieto',
                              'Segnali di Divieto',
                            ),
                          ),
                          _SignalCategoryCard(
                            title: 'Segnali di Obbligo',
                            icon: Icons.arrow_circle_right_rounded,
                            color: Colors.blue.withOpacity(0.3),
                            onTap: () => _navigateToSignals(
                              context,
                              'obbligo',
                              'Segnali di Obbligo',
                            ),
                          ),
                        ],
                      ),

                      const SizedBox(height: 8),

                      // Indicazione full width
                      _SignalCategoryCard(
                        title: 'Segnali di Indicazione',
                        icon: Icons.info_outline,
                        color: Colors.green.withOpacity(0.3),
                        fullWidth: true,
                        onTap: () => _navigateToSignals(
                          context,
                          'indicazione',
                          'Segnali di Indicazione',
                        ),
                      ),

                      const SizedBox(height: 24),

                      // Theory chapters header
                      const Padding(
                        padding: EdgeInsets.symmetric(vertical: 16),
                        child: Row(
                          children: [
                            Text('📚', style: TextStyle(fontSize: 24)),
                            SizedBox(width: 8),
                            Text(
                              'Lezioni di Teoria',
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                      ),

                      // Theory chapters grid
                      GridView.count(
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        crossAxisCount: 2,
                        crossAxisSpacing: 12,
                        mainAxisSpacing: 12,
                        childAspectRatio: 1.1,
                        children: [
                          _TheoryChapterCard(
                            title: 'Definizioni Stradali',
                            icon: Icons.route,
                            color: Colors.teal.withOpacity(0.3),
                            onTap: () {
                              // TODO: Navigate to chapter
                            },
                          ),
                          _TheoryChapterCard(
                            title: 'Limiti di Velocità',
                            icon: Icons.speed,
                            color: Colors.cyan.withOpacity(0.3),
                            onTap: () {
                              // TODO: Navigate to chapter
                            },
                          ),
                          _TheoryChapterCard(
                            title: 'Distanza di Sicurezza',
                            icon: Icons.social_distance,
                            color: Colors.blue.withOpacity(0.3),
                            onTap: () {
                              // TODO: Navigate to chapter
                            },
                          ),
                          _TheoryChapterCard(
                            title: 'Norme di Circolazione',
                            icon: Icons.directions_car,
                            color: Colors.purple.withOpacity(0.3),
                            onTap: () {
                              // TODO: Navigate to chapter
                            },
                          ),
                          _TheoryChapterCard(
                            title: 'Precedenza Incroci',
                            icon: Icons.call_split,
                            color: Colors.indigo.withOpacity(0.3),
                            onTap: () {
                              // TODO: Navigate to chapter
                            },
                          ),
                          _TheoryChapterCard(
                            title: 'Fermata e Sosta',
                            icon: Icons.local_parking,
                            color: Colors.orange.withOpacity(0.3),
                            onTap: () {
                              // TODO: Navigate to chapter
                            },
                          ),
                          _TheoryChapterCard(
                            title: 'Sorpasso',
                            icon: Icons.swap_horiz,
                            color: Colors.pink.withOpacity(0.3),
                            onTap: () {
                              // TODO: Navigate to chapter
                            },
                          ),
                          _TheoryChapterCard(
                            title: 'Alcool e Droga',
                            icon: Icons.no_drinks,
                            color: Colors.red.withOpacity(0.3),
                            onTap: () {
                              // TODO: Navigate to chapter
                            },
                          ),
                        ],
                      ),

                      const SizedBox(height: 100), // Bottom padding
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _navigateToSignals(BuildContext context, String category, String title) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => SignalsScreen(category: category, title: title),
      ),
    );
  }
}

class _SignalCategoryCard extends StatelessWidget {
  final String title;
  final IconData icon;
  final Color color;
  final VoidCallback onTap;
  final bool fullWidth;

  const _SignalCategoryCard({
    required this.title,
    required this.icon,
    required this.color,
    required this.onTap,
    this.fullWidth = false,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: color,
          borderRadius: BorderRadius.circular(24),
          border: Border.all(color: Colors.white.withOpacity(0.2)),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, color: Colors.white, size: fullWidth ? 48 : 40),
            const SizedBox(height: 12),
            Text(
              title,
              style: TextStyle(
                color: Colors.white,
                fontSize: fullWidth ? 16 : 14,
                fontWeight: FontWeight.w600,
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
}

class _TheoryChapterCard extends StatelessWidget {
  final String title;
  final IconData icon;
  final Color color;
  final VoidCallback onTap;

  const _TheoryChapterCard({
    required this.title,
    required this.icon,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: color,
          borderRadius: BorderRadius.circular(24),
          border: Border.all(color: Colors.white.withOpacity(0.2)),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, color: Colors.white, size: 36),
            const SizedBox(height: 8),
            Text(
              title,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 12,
                fontWeight: FontWeight.w600,
              ),
              textAlign: TextAlign.center,
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
          ],
        ),
      ),
    );
  }
}
