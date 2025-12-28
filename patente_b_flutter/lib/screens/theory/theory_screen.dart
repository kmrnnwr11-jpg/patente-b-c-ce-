import 'package:flutter/material.dart';

import '../../models/theory_chapter.dart';
import '../../services/theory_service.dart';
import '../../theme/apple_glass_theme.dart';
import '../../widgets/glass/glass_card.dart';

import 'theory_detail_screen.dart';
import '../../providers/theme_provider.dart';
import 'package:provider/provider.dart';
import '../../widgets/common/theme_toggle_button.dart';

/// Main theory screen with "Neo-Glass Academy" redesign
class TheoryScreen extends StatefulWidget {
  const TheoryScreen({super.key});

  @override
  State<TheoryScreen> createState() => _TheoryScreenState();
}

class _TheoryScreenState extends State<TheoryScreen>
    with SingleTickerProviderStateMixin {
  final TheoryService _theoryService = TheoryService();
  List<TheoryChapter> _allLessons = [];
  bool _isLoading = true;

  // Scroll Controller for sticky headers effects
  late ScrollController _scrollController;

  @override
  void initState() {
    super.initState();
    _scrollController = ScrollController();
    _loadLessons();
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  Future<void> _loadLessons() async {
    await _theoryService.loadTheory();
    setState(() {
      _allLessons = _theoryService.getAllChapters();
      _isLoading = false;
    });
  }

  void _navigateToLesson(TheoryChapter lesson) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) =>
            TheoryDetailScreen(chapter: lesson, allChapters: _allLessons),
      ),
    );
  }

  List<TheoryChapter> _getLessonsForModule(int start, int end) {
    if (_allLessons.isEmpty) return [];
    // Ensure indices are within bounds
    final s = (start - 1).clamp(0, _allLessons.length);
    final e = end.clamp(0, _allLessons.length);
    return _allLessons.sublist(s, e);
  }

  @override
  Widget build(BuildContext context) {
    // Determine gradient based on theme mode (light/dark) logic
    final themeProvider = context.watch<ThemeProvider>();
    final isDarkMode = themeProvider.isDarkMode;
    final isLightMode = !isDarkMode;

    final backgroundGradient = isDarkMode
        ? AppleGlassTheme.bgGradient
        : AppleGlassTheme.bgGradientLight;

    return Scaffold(
      extendBodyBehindAppBar: true,
      body: Container(
        decoration: BoxDecoration(gradient: backgroundGradient),
        child: SafeArea(
          bottom: false,
          child: _isLoading
              ? const Center(child: CircularProgressIndicator())
              : CustomScrollView(
                  controller: _scrollController,
                  slivers: [
                    // 1. Custom Hero Header (App Bar + Progress)
                    SliverAppBar(
                      expandedHeight: 280,
                      backgroundColor:
                          Colors.transparent, // Glass handled by background
                      elevation: 0,
                      pinned: true,
                      stretch: true,
                      leading: Container(
                        margin: const EdgeInsets.all(8),
                        child: GlassCard(
                          isDarkMode: !isLightMode,
                          borderRadius: 12,
                          padding: EdgeInsets.zero,
                          child: IconButton(
                            onPressed: () => Navigator.pop(context),
                            icon: Icon(
                              Icons.arrow_back,
                              color: isLightMode
                                  ? AppleGlassTheme.textPrimaryDark
                                  : Colors.white,
                            ),
                          ),
                        ),
                      ),
                      actions: [
                        Container(
                          margin: const EdgeInsets.all(8),
                          child: GlassCard(
                            isDarkMode: !isLightMode,
                            borderRadius: 12,
                            padding: EdgeInsets.zero,
                            child: ThemeToggleButton(
                              size: 20,
                              color: isLightMode
                                  ? AppleGlassTheme.textPrimaryDark
                                  : Colors.white,
                            ),
                          ),
                        ),
                      ],
                      flexibleSpace: FlexibleSpaceBar(
                        background: _HeroDashboard(
                          nextLesson: _allLessons.isNotEmpty
                              ? _allLessons[0]
                              : null, // Logic for next lesson
                          isLightMode: isLightMode,
                          onContinue: () {
                            if (_allLessons.isNotEmpty) {
                              _navigateToLesson(_allLessons[0]);
                            }
                          },
                        ),
                      ),
                    ),

                    // 2. Search Bar Integration (Floating)
                    // _TheorySearchBar(),
                    const SliverToBoxAdapter(child: SizedBox(height: 24)),

                    // 3. Module 1: Segnali Stradali (1-10)
                    _buildModuleHeader(
                      "Segnali Stradali",
                      "Lezioni 1-10",
                      Icons.traffic_rounded,
                      Colors.orange,
                      isLightMode,
                    ),
                    _buildLessonList(_getLessonsForModule(1, 10), isLightMode),

                    const SliverToBoxAdapter(child: SizedBox(height: 32)),

                    // 4. Module 2: Norme di Circolazione (11-18)
                    _buildModuleHeader(
                      "Norme di Circolazione",
                      "Lezioni 11-18",
                      Icons.menu_book_rounded,
                      Colors.blue,
                      isLightMode,
                    ),
                    _buildLessonList(_getLessonsForModule(11, 18), isLightMode),

                    const SliverToBoxAdapter(child: SizedBox(height: 32)),

                    // 5. Module 3: Il Veicolo e Sicurezza (19-25+)
                    _buildModuleHeader(
                      "Veicolo e Sicurezza",
                      "Lezioni 19-30",
                      Icons.car_crash_rounded,
                      Colors.pink,
                      isLightMode,
                    ),
                    _buildLessonList(_getLessonsForModule(19, 30), isLightMode),

                    const SliverToBoxAdapter(child: SizedBox(height: 100)),
                  ],
                ),
        ),
      ),
    );
  }

  Widget _buildModuleHeader(
    String title,
    String subtitle,
    IconData icon,
    Color color,
    bool isLightMode,
  ) {
    return SliverToBoxAdapter(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: color.withOpacity(0.15),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(icon, color: color, size: 24),
            ),
            const SizedBox(width: 12),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: isLightMode
                        ? AppleGlassTheme.textPrimaryDark
                        : Colors.white,
                  ),
                ),
                Text(
                  subtitle,
                  style: TextStyle(
                    fontSize: 13,
                    color: isLightMode
                        ? AppleGlassTheme.textSecondaryDark
                        : Colors.white70,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildLessonList(List<TheoryChapter> lessons, bool isLightMode) {
    return SliverList(
      delegate: SliverChildBuilderDelegate((context, index) {
        final lesson = lessons[index];
        // Calculate original index to display correct lesson number
        final originalIndex = _allLessons.indexOf(lesson) + 1;

        return Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
          child: _NeoGlassLessonCard(
            lessonNumber: originalIndex,
            title: lesson.title,
            sectionsCount: lesson.sections.length,
            isLightMode: isLightMode,
            onTap: () => _navigateToLesson(lesson),
          ),
        );
      }, childCount: lessons.length),
    );
  }
}

class _HeroDashboard extends StatelessWidget {
  final TheoryChapter? nextLesson;
  final bool isLightMode;
  final VoidCallback onContinue;

  const _HeroDashboard({
    this.nextLesson,
    required this.isLightMode,
    required this.onContinue,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 60, 20, 0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    "Bentornato!",
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: isLightMode
                          ? AppleGlassTheme.textSecondaryDark
                          : Colors.white70,
                      letterSpacing: 0.5,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    "Theory Academy",
                    style: TextStyle(
                      fontSize: 28,
                      fontWeight: FontWeight.bold,
                      color: isLightMode
                          ? AppleGlassTheme.textPrimaryDark
                          : Colors.white,
                      height: 1.1,
                    ),
                  ),
                ],
              ),
              // Progress Ring
              Stack(
                alignment: Alignment.center,
                children: [
                  SizedBox(
                    width: 50,
                    height: 50,
                    child: CircularProgressIndicator(
                      value: 0.24, // Mock 24%
                      backgroundColor: isLightMode
                          ? Colors.grey.withOpacity(0.2)
                          : Colors.white12,
                      valueColor: const AlwaysStoppedAnimation(
                        AppleGlassTheme.accentBlue,
                      ),
                      strokeWidth: 5,
                    ),
                  ),
                  Text(
                    "24%",
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                      color: isLightMode
                          ? AppleGlassTheme.textPrimaryDark
                          : Colors.white,
                    ),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 20),
          // Continue Lesson Card
          GestureDetector(
            onTap: onContinue,
            child: GlassCard(
              isDarkMode: !isLightMode,
              borderRadius: 24,
              padding: const EdgeInsets.all(20),
              child: Row(
                children: [
                  Container(
                    width: 48,
                    height: 48,
                    decoration: BoxDecoration(
                      color: AppleGlassTheme.accentBlue.withOpacity(0.2),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(
                      Icons.play_arrow_rounded,
                      color: AppleGlassTheme.accentBlue,
                      size: 32,
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          "Continua a studiare",
                          style: TextStyle(
                            fontSize: 12,
                            color: isLightMode
                                ? AppleGlassTheme.textSecondaryDark
                                : Colors.white70,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          nextLesson != null
                              // Remove "1. " from title
                              ? nextLesson!.title.replaceFirst(
                                  RegExp(r'^\d+\.\s*'),
                                  '',
                                )
                              : "Caricamento...",
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: isLightMode
                                ? AppleGlassTheme.textPrimaryDark
                                : Colors.white,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _NeoGlassLessonCard extends StatefulWidget {
  final int lessonNumber;
  final String title;
  final int sectionsCount;
  final bool isLightMode;
  final VoidCallback onTap;

  const _NeoGlassLessonCard({
    required this.lessonNumber,
    required this.title,
    required this.sectionsCount,
    required this.isLightMode,
    required this.onTap,
  });

  @override
  State<_NeoGlassLessonCard> createState() => _NeoGlassLessonCardState();
}

class _NeoGlassLessonCardState extends State<_NeoGlassLessonCard>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 100),
      vsync: this,
    );
    _scaleAnimation = Tween<double>(
      begin: 1.0,
      end: 0.96,
    ).animate(CurvedAnimation(parent: _controller, curve: Curves.easeInOut));
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  IconData _getIcon() {
    // Simple mock logic for icon
    return Icons.auto_stories_rounded;
  }

  Color _getModuleColor() {
    if (widget.lessonNumber <= 10) return Colors.orange;
    if (widget.lessonNumber <= 18) return Colors.blue;
    return Colors.pink;
  }

  @override
  Widget build(BuildContext context) {
    final cleanTitle = widget.title.replaceFirst(RegExp(r'^\d+\.\s*'), '');
    final color = _getModuleColor();

    return ScaleTransition(
      scale: _scaleAnimation,
      child: GestureDetector(
        onTapDown: (_) => _controller.forward(),
        onTapUp: (_) {
          _controller.reverse();
          widget.onTap();
        },
        onTapCancel: () => _controller.reverse(),
        child: GlassCard(
          isDarkMode: !widget.isLightMode,
          borderRadius: 20,
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
          child: Row(
            children: [
              // 1. Icon Container
              // 1. Icon Container
              Container(
                width: 56,
                height: 56,
                decoration: BoxDecoration(
                  color: color.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: color.withOpacity(0.3), width: 1.5),
                ),
                clipBehavior: Clip.antiAlias,
                child: Image.asset(
                  'assets/images/theory/thumbnails/lesson_${widget.lessonNumber}.png',
                  fit: BoxFit.cover,
                  errorBuilder: (context, error, stackTrace) {
                    return Center(
                      child: Text(
                        "${widget.lessonNumber}",
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.w800,
                          color: color,
                        ),
                      ),
                    );
                  },
                ),
              ),
              const SizedBox(width: 16),

              // 2. Info
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      cleanTitle,
                      style: TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.w600,
                        color: widget.isLightMode
                            ? AppleGlassTheme.textPrimaryDark
                            : Colors.white,
                        letterSpacing: -0.2,
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 4),
                    Text(
                      "${widget.sectionsCount} argomenti",
                      style: TextStyle(
                        fontSize: 12,
                        color: widget.isLightMode
                            ? AppleGlassTheme.textSecondaryDark
                            : Colors.white60,
                      ),
                    ),
                  ],
                ),
              ),

              // 3. Action Icon
              Icon(
                Icons.chevron_right_rounded,
                color: widget.isLightMode
                    ? AppleGlassTheme.textSecondaryDark.withOpacity(0.5)
                    : Colors.white38,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
