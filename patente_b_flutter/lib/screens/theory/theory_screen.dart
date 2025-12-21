import 'package:flutter/material.dart';

import '../../models/theory_chapter.dart';
import '../../services/theory_service.dart';

import 'theory_detail_screen.dart';

/// Main theory screen with signal categories and theory chapters
class TheoryScreen extends StatefulWidget {
  const TheoryScreen({super.key});

  @override
  State<TheoryScreen> createState() => _TheoryScreenState();
}

class _TheoryScreenState extends State<TheoryScreen> {
  final TheoryService _theoryService = TheoryService();
  List<TheoryChapter> _pdfLessons = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadLessons();
  }

  Future<void> _loadLessons() async {
    await _theoryService.loadTheory();
    setState(() {
      _pdfLessons = _theoryService.getAllChapters();
      _isLoading = false;
    });
  }

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
                      const SizedBox(height: 8),

                      // Theory lessons header
                      Padding(
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        child: Row(
                          children: [
                            const Text('📖', style: TextStyle(fontSize: 24)),
                            const SizedBox(width: 8),
                            const Text(
                              'Manuale di Teoria Completo',
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const Spacer(),
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 8,
                                vertical: 4,
                              ),
                              decoration: BoxDecoration(
                                color: Colors.white.withOpacity(0.2),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Text(
                                '${_pdfLessons.length} lezioni',
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontSize: 12,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),

                      // Loading or PDF lessons list
                      if (_isLoading)
                        const Center(
                          child: Padding(
                            padding: EdgeInsets.all(32),
                            child: CircularProgressIndicator(
                              color: Colors.white,
                            ),
                          ),
                        )
                      else
                        GridView.builder(
                          shrinkWrap: true,
                          physics: const NeverScrollableScrollPhysics(),
                          gridDelegate:
                              const SliverGridDelegateWithFixedCrossAxisCount(
                                crossAxisCount: 2,
                                crossAxisSpacing: 12,
                                mainAxisSpacing: 12,
                                childAspectRatio: 0.95,
                              ),
                          itemCount: _pdfLessons.length,
                          itemBuilder: (context, index) {
                            final lesson = _pdfLessons[index];
                            return _LessonGridCard(
                              lessonNumber: index + 1,
                              title: lesson.title,
                              sectionsCount: lesson.sections.length,
                              onTap: () => _navigateToLesson(context, lesson),
                            );
                          },
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

  void _navigateToLesson(BuildContext context, TheoryChapter lesson) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => TheoryDetailScreen(chapter: lesson),
      ),
    );
  }
}

class _SignalCategoryCard extends StatefulWidget {
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
  State<_SignalCategoryCard> createState() => _SignalCategoryCardState();
}

class _SignalCategoryCardState extends State<_SignalCategoryCard>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;
  bool _isPressed = false;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 150),
      vsync: this,
    );
    _scaleAnimation = Tween<double>(
      begin: 1.0,
      end: 0.95,
    ).animate(CurvedAnimation(parent: _controller, curve: Curves.easeInOut));
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _onTapDown(TapDownDetails details) {
    setState(() => _isPressed = true);
    _controller.forward();
  }

  void _onTapUp(TapUpDetails details) {
    setState(() => _isPressed = false);
    _controller.reverse();
    widget.onTap();
  }

  void _onTapCancel() {
    setState(() => _isPressed = false);
    _controller.reverse();
  }

  @override
  Widget build(BuildContext context) {
    return ScaleTransition(
      scale: _scaleAnimation,
      child: GestureDetector(
        onTapDown: _onTapDown,
        onTapUp: _onTapUp,
        onTapCancel: _onTapCancel,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          padding: EdgeInsets.all(widget.fullWidth ? 20 : 16),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                widget.color.withOpacity(_isPressed ? 0.8 : 0.6),
                widget.color.withOpacity(_isPressed ? 0.5 : 0.3),
              ],
            ),
            borderRadius: BorderRadius.circular(28),
            border: Border.all(
              color: Colors.white.withOpacity(_isPressed ? 0.4 : 0.25),
              width: 1.5,
            ),
            boxShadow: [
              BoxShadow(
                color: widget.color.withOpacity(0.3),
                blurRadius: _isPressed ? 8 : 16,
                offset: Offset(0, _isPressed ? 2 : 6),
                spreadRadius: _isPressed ? 0 : 2,
              ),
              BoxShadow(
                color: Colors.white.withOpacity(0.1),
                blurRadius: 1,
                offset: const Offset(0, -1),
              ),
            ],
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                padding: EdgeInsets.all(widget.fullWidth ? 16 : 12),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.15),
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.1),
                      blurRadius: 8,
                      offset: const Offset(0, 2),
                    ),
                  ],
                ),
                child: Icon(
                  widget.icon,
                  color: Colors.white,
                  size: widget.fullWidth ? 32 : 28,
                ),
              ),
              const SizedBox(height: 14),
              Text(
                widget.title,
                style: TextStyle(
                  color: Colors.white,
                  fontSize: widget.fullWidth ? 16 : 13,
                  fontWeight: FontWeight.w700,
                  letterSpacing: 0.3,
                  shadows: [
                    Shadow(
                      color: Colors.black.withOpacity(0.3),
                      blurRadius: 4,
                      offset: const Offset(0, 1),
                    ),
                  ],
                ),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

/// Card for PDF lessons list - Modern animated version
class _PdfLessonCard extends StatefulWidget {
  final int lessonNumber;
  final String title;
  final int sectionsCount;
  final VoidCallback onTap;

  const _PdfLessonCard({
    required this.lessonNumber,
    required this.title,
    required this.sectionsCount,
    required this.onTap,
  });

  @override
  State<_PdfLessonCard> createState() => _PdfLessonCardState();
}

class _PdfLessonCardState extends State<_PdfLessonCard>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;
  bool _isPressed = false;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 120),
      vsync: this,
    );
    _scaleAnimation = Tween<double>(
      begin: 1.0,
      end: 0.97,
    ).animate(CurvedAnimation(parent: _controller, curve: Curves.easeInOut));
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _onTapDown(TapDownDetails details) {
    setState(() => _isPressed = true);
    _controller.forward();
  }

  void _onTapUp(TapUpDetails details) {
    setState(() => _isPressed = false);
    _controller.reverse();
    widget.onTap();
  }

  void _onTapCancel() {
    setState(() => _isPressed = false);
    _controller.reverse();
  }

  // Get icon based on lesson content
  IconData _getIcon() {
    final lowerTitle = widget.title.toLowerCase();
    if (lowerTitle.contains('segnali') || lowerTitle.contains('segnaletica')) {
      return Icons.signpost;
    } else if (lowerTitle.contains('velocità') ||
        lowerTitle.contains('limiti')) {
      return Icons.speed;
    } else if (lowerTitle.contains('distanza')) {
      return Icons.social_distance;
    } else if (lowerTitle.contains('precedenza') ||
        lowerTitle.contains('incroci')) {
      return Icons.call_split;
    } else if (lowerTitle.contains('sorpasso')) {
      return Icons.swap_horiz;
    } else if (lowerTitle.contains('fermata') || lowerTitle.contains('sosta')) {
      return Icons.local_parking;
    } else if (lowerTitle.contains('autostrada') ||
        lowerTitle.contains('extraurban')) {
      return Icons.add_road;
    } else if (lowerTitle.contains('luci') || lowerTitle.contains('clacson')) {
      return Icons.wb_twilight;
    } else if (lowerTitle.contains('spie')) {
      return Icons.warning_amber;
    } else if (lowerTitle.contains('cintur') ||
        lowerTitle.contains('casco') ||
        lowerTitle.contains('airbag')) {
      return Icons.health_and_safety;
    } else if (lowerTitle.contains('trasporto') ||
        lowerTitle.contains('carico')) {
      return Icons.local_shipping;
    } else if (lowerTitle.contains('patente') ||
        lowerTitle.contains('document')) {
      return Icons.badge;
    } else if (lowerTitle.contains('incidenti') ||
        lowerTitle.contains('responsabil')) {
      return Icons.car_crash;
    } else if (lowerTitle.contains('alcol') ||
        lowerTitle.contains('droga') ||
        lowerTitle.contains('soccorso')) {
      return Icons.medical_services;
    } else if (lowerTitle.contains('inquinamento') ||
        lowerTitle.contains('consum') ||
        lowerTitle.contains('ambiente')) {
      return Icons.eco;
    } else if (lowerTitle.contains('veicolo') ||
        lowerTitle.contains('pneumatici') ||
        lowerTitle.contains('freni')) {
      return Icons.build;
    } else if (lowerTitle.contains('stabilit')) {
      return Icons.trending_flat;
    } else if (lowerTitle.contains('semafori') ||
        lowerTitle.contains('agenti')) {
      return Icons.traffic;
    } else if (lowerTitle.contains('definizion')) {
      return Icons.menu_book;
    } else if (lowerTitle.contains('posizione') ||
        lowerTitle.contains('svolta') ||
        lowerTitle.contains('corsia')) {
      return Icons.directions;
    } else if (lowerTitle.contains('ingombro') ||
        lowerTitle.contains('fermo')) {
      return Icons.warning;
    } else if (lowerTitle.contains('funzionari') ||
        lowerTitle.contains('occhiali')) {
      return Icons.visibility;
    } else {
      return Icons.book;
    }
  }

  // Get gradient colors based on lesson number
  List<Color> _getGradientColors() {
    if (widget.lessonNumber <= 11) {
      return [
        Colors.orange.withOpacity(_isPressed ? 0.7 : 0.5),
        Colors.deepOrange.withOpacity(_isPressed ? 0.5 : 0.3),
      ];
    } else if (widget.lessonNumber <= 18) {
      return [
        Colors.blue.withOpacity(_isPressed ? 0.7 : 0.5),
        Colors.indigo.withOpacity(_isPressed ? 0.5 : 0.3),
      ];
    } else if (widget.lessonNumber <= 24) {
      return [
        Colors.purple.withOpacity(_isPressed ? 0.7 : 0.5),
        Colors.deepPurple.withOpacity(_isPressed ? 0.5 : 0.3),
      ];
    } else {
      return [
        Colors.teal.withOpacity(_isPressed ? 0.7 : 0.5),
        Colors.cyan.withOpacity(_isPressed ? 0.5 : 0.3),
      ];
    }
  }

  Color _getShadowColor() {
    if (widget.lessonNumber <= 11) return Colors.orange;
    if (widget.lessonNumber <= 18) return Colors.blue;
    if (widget.lessonNumber <= 24) return Colors.purple;
    return Colors.teal;
  }

  @override
  Widget build(BuildContext context) {
    return ScaleTransition(
      scale: _scaleAnimation,
      child: GestureDetector(
        onTapDown: _onTapDown,
        onTapUp: _onTapUp,
        onTapCancel: _onTapCancel,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 150),
          margin: const EdgeInsets.only(bottom: 14),
          padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 16),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: _getGradientColors(),
            ),
            borderRadius: BorderRadius.circular(22),
            border: Border.all(
              color: Colors.white.withOpacity(_isPressed ? 0.35 : 0.2),
              width: 1.5,
            ),
            boxShadow: [
              BoxShadow(
                color: _getShadowColor().withOpacity(0.25),
                blurRadius: _isPressed ? 6 : 12,
                offset: Offset(0, _isPressed ? 2 : 5),
                spreadRadius: _isPressed ? 0 : 1,
              ),
            ],
          ),
          child: Row(
            children: [
              // Lesson number badge
              Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.18),
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: Colors.white.withOpacity(0.15)),
                ),
                child: Center(
                  child: Text(
                    '${widget.lessonNumber}',
                    style: TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                      fontSize: 18,
                      shadows: [
                        Shadow(
                          color: Colors.black.withOpacity(0.2),
                          blurRadius: 4,
                        ),
                      ],
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 14),
              // Lesson info
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      widget.title.replaceFirst(RegExp(r'^\d+\.\s*'), ''),
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 15,
                        fontWeight: FontWeight.w700,
                        letterSpacing: 0.2,
                        shadows: [
                          Shadow(
                            color: Colors.black.withOpacity(0.25),
                            blurRadius: 3,
                          ),
                        ],
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 5),
                    Text(
                      '${widget.sectionsCount} sezioni',
                      style: TextStyle(
                        color: Colors.white.withOpacity(0.75),
                        fontSize: 12,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ],
                ),
              ),
              // Icon container
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.12),
                  shape: BoxShape.circle,
                ),
                child: Icon(_getIcon(), color: Colors.white, size: 24),
              ),
              const SizedBox(width: 6),
              Icon(
                Icons.chevron_right_rounded,
                color: Colors.white.withOpacity(0.7),
                size: 26,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

/// Grid card for lessons - 2x2 layout with modern animated style
class _LessonGridCard extends StatefulWidget {
  final int lessonNumber;
  final String title;
  final int sectionsCount;
  final VoidCallback onTap;

  const _LessonGridCard({
    required this.lessonNumber,
    required this.title,
    required this.sectionsCount,
    required this.onTap,
  });

  @override
  State<_LessonGridCard> createState() => _LessonGridCardState();
}

class _LessonGridCardState extends State<_LessonGridCard>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;
  bool _isPressed = false;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 120),
      vsync: this,
    );
    _scaleAnimation = Tween<double>(
      begin: 1.0,
      end: 0.95,
    ).animate(CurvedAnimation(parent: _controller, curve: Curves.easeInOut));
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _onTapDown(TapDownDetails details) {
    setState(() => _isPressed = true);
    _controller.forward();
  }

  void _onTapUp(TapUpDetails details) {
    setState(() => _isPressed = false);
    _controller.reverse();
    widget.onTap();
  }

  void _onTapCancel() {
    setState(() => _isPressed = false);
    _controller.reverse();
  }

  IconData _getIcon() {
    final lowerTitle = widget.title.toLowerCase();
    if (lowerTitle.contains('pericolo')) return Icons.warning_amber_rounded;
    if (lowerTitle.contains('precedenza')) return Icons.arrow_upward_rounded;
    if (lowerTitle.contains('divieto')) return Icons.block_rounded;
    if (lowerTitle.contains('obbligo')) return Icons.arrow_circle_right_rounded;
    if (lowerTitle.contains('indicazione')) return Icons.info_outline_rounded;
    if (lowerTitle.contains('velocità')) return Icons.speed_rounded;
    if (lowerTitle.contains('distanza')) return Icons.social_distance_rounded;
    if (lowerTitle.contains('sorpasso')) return Icons.swap_horiz_rounded;
    if (lowerTitle.contains('sosta')) return Icons.local_parking_rounded;
    if (lowerTitle.contains('semafori')) return Icons.traffic_rounded;
    if (lowerTitle.contains('luci')) return Icons.wb_twilight_rounded;
    if (lowerTitle.contains('definizion')) return Icons.menu_book_rounded;
    if (lowerTitle.contains('patente')) return Icons.badge_rounded;
    if (lowerTitle.contains('incidenti')) return Icons.car_crash_rounded;
    if (lowerTitle.contains('alcol')) return Icons.medical_services_rounded;
    if (lowerTitle.contains('ambiente')) return Icons.eco_rounded;
    return Icons.auto_stories_rounded;
  }

  List<Color> _getGradientColors() {
    final n = widget.lessonNumber;
    if (n <= 6) {
      return [
        Colors.red.withOpacity(_isPressed ? 0.8 : 0.6),
        Colors.red.shade700.withOpacity(_isPressed ? 0.6 : 0.4),
      ];
    } else if (n <= 12) {
      return [
        Colors.amber.withOpacity(_isPressed ? 0.85 : 0.65),
        Colors.orange.withOpacity(_isPressed ? 0.65 : 0.45),
      ];
    } else if (n <= 18) {
      return [
        Colors.blue.withOpacity(_isPressed ? 0.8 : 0.6),
        Colors.indigo.withOpacity(_isPressed ? 0.6 : 0.4),
      ];
    } else if (n <= 24) {
      return [
        Colors.green.withOpacity(_isPressed ? 0.8 : 0.6),
        Colors.teal.withOpacity(_isPressed ? 0.6 : 0.4),
      ];
    } else {
      return [
        Colors.purple.withOpacity(_isPressed ? 0.8 : 0.6),
        Colors.deepPurple.withOpacity(_isPressed ? 0.6 : 0.4),
      ];
    }
  }

  Color _getShadowColor() {
    final n = widget.lessonNumber;
    if (n <= 6) return Colors.red;
    if (n <= 12) return Colors.orange;
    if (n <= 18) return Colors.blue;
    if (n <= 24) return Colors.green;
    return Colors.purple;
  }

  @override
  Widget build(BuildContext context) {
    return ScaleTransition(
      scale: _scaleAnimation,
      child: GestureDetector(
        onTapDown: _onTapDown,
        onTapUp: _onTapUp,
        onTapCancel: _onTapCancel,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 150),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: _getGradientColors(),
            ),
            borderRadius: BorderRadius.circular(24),
            border: Border.all(
              color: Colors.white.withOpacity(_isPressed ? 0.4 : 0.25),
              width: 1.5,
            ),
            boxShadow: [
              BoxShadow(
                color: _getShadowColor().withOpacity(0.3),
                blurRadius: _isPressed ? 6 : 14,
                offset: Offset(0, _isPressed ? 2 : 6),
                spreadRadius: _isPressed ? 0 : 2,
              ),
            ],
          ),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.18),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(_getIcon(), color: Colors.white, size: 32),
                ),
                const SizedBox(height: 10),
                Text(
                  widget.title.replaceFirst(RegExp(r'Lezione \d+:\s*'), ''),
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 13,
                    fontWeight: FontWeight.w700,
                    shadows: [
                      Shadow(
                        color: Colors.black.withOpacity(0.3),
                        blurRadius: 4,
                      ),
                    ],
                  ),
                  textAlign: TextAlign.center,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 6),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 10,
                    vertical: 4,
                  ),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.15),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    '${widget.sectionsCount} sezioni',
                    style: TextStyle(
                      color: Colors.white.withOpacity(0.85),
                      fontSize: 11,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
