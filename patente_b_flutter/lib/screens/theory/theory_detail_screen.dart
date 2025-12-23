import 'package:flutter/material.dart';
import '../../models/theory_chapter.dart';
import '../../models/translation.dart';
import '../quiz/quiz_screen.dart';
import '../../services/translation_service.dart';
import '../../services/language_preference_service.dart';
import '../../widgets/translation/language_selector.dart';
import '../../widgets/translation/hover_translation_text.dart';
import '../../widgets/audio/audio_button.dart';

class TheoryDetailScreen extends StatefulWidget {
  final TheoryChapter chapter;
  final List<TheoryChapter> allChapters;

  const TheoryDetailScreen({
    super.key,
    required this.chapter,
    this.allChapters = const [],
  });

  @override
  State<TheoryDetailScreen> createState() => _TheoryDetailScreenState();
}

class _TheoryDetailScreenState extends State<TheoryDetailScreen> {
  final TranslationService _translationService = TranslationService();
  final LanguagePreferenceService _languageService =
      LanguagePreferenceService();
  late AppLanguage _selectedLanguage;

  @override
  void initState() {
    super.initState();
    _selectedLanguage = _languageService.preferredLanguage;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[50],
      body: CustomScrollView(
        slivers: [
          // Premium Sliver Header
          SliverAppBar(
            expandedHeight: 140.0,
            floating: false,
            pinned: true,
            elevation: 0,
            // Gradient Background
            flexibleSpace: Container(
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    Color(0xFF2E3192), // Deep Blue
                    Color(0xFF1BFFFF), // Cyan Accent
                  ],
                ),
              ),
              child: FlexibleSpaceBar(
                centerTitle: true,
                titlePadding: const EdgeInsets.only(
                  bottom: 16,
                  left: 50,
                  right: 50,
                ),
                title: Text(
                  widget.chapter.title,
                  textAlign: TextAlign.center,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    shadows: [
                      Shadow(
                        offset: Offset(0, 1),
                        blurRadius: 3.0,
                        color: Colors.black45,
                      ),
                    ],
                  ),
                ),
                background: Stack(
                  fit: StackFit.expand,
                  children: [
                    // Decorative patterns could go here
                    Opacity(
                      opacity: 0.1,
                      child: CustomPaint(painter: _PatternPainter()),
                    ),
                  ],
                ),
              ),
            ),
            // Leading Back Button
            leading: IconButton(
              icon: const Icon(Icons.arrow_back_ios_new, color: Colors.white),
              onPressed: () => Navigator.of(context).pop(),
            ),
            // Language Selector Action
            actions: [
              // Quiz Button (Restored)
              Container(
                margin: const EdgeInsets.only(right: 8),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.2),
                  shape: BoxShape.circle,
                ),
                child: IconButton(
                  icon: const Icon(Icons.school_rounded, color: Colors.white),
                  tooltip: 'Quiz su questo argomento',
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => QuizScreen(
                          mode: QuizMode.topic,
                          topic: widget.chapter.title,
                        ),
                      ),
                    );
                  },
                ),
              ),
              // Language Selector Action
              Container(
                margin: const EdgeInsets.only(right: 16),
                padding: const EdgeInsets.symmetric(
                  horizontal: 12,
                  vertical: 4,
                ),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: DropdownButtonHideUnderline(
                  child: DropdownButton<AppLanguage>(
                    value: _selectedLanguage,
                    dropdownColor: Colors.blue.shade900,
                    icon: const Icon(
                      Icons.language,
                      color: Colors.white,
                      size: 20,
                    ),
                    alignment: Alignment.centerRight,
                    isDense: true,
                    items: AppLanguage.values.map((lang) {
                      return DropdownMenuItem(
                        value: lang,
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Text(
                              lang.flag,
                              style: const TextStyle(fontSize: 18),
                            ),
                            const SizedBox(width: 8),
                            Text(
                              lang.name,
                              style: const TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.w600,
                                fontSize: 13,
                              ),
                            ),
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
            ],
          ),

          // Content List
          SliverPadding(
            padding: const EdgeInsets.only(
              left: 16,
              right: 16,
              top: 24,
              bottom: 100, // Space for bottom bar
            ),
            sliver: SliverList(
              delegate: SliverChildBuilderDelegate((context, index) {
                final section = widget.chapter.sections[index];
                return Container(
                  margin: const EdgeInsets.only(bottom: 24),
                  decoration: BoxDecoration(
                    color: const Color(0xFF1E2235), // Dark card background
                    borderRadius: BorderRadius.circular(24),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.2),
                        blurRadius: 20,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Section Header / Title Strip
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.symmetric(
                          horizontal: 20,
                          vertical: 16,
                        ),
                        decoration: BoxDecoration(
                          color: const Color(
                            0xFF232742,
                          ), // Slightly lighter dark
                          borderRadius: const BorderRadius.only(
                            topLeft: Radius.circular(24),
                            topRight: Radius.circular(24),
                          ),
                          border: Border(
                            bottom: BorderSide(
                              color: Colors.white.withOpacity(0.05),
                            ),
                          ),
                        ),
                        child: Text(
                          section.title,
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.w700,
                            color: Colors.white, // White text for visibility
                            letterSpacing: -0.5,
                          ),
                        ),
                      ),

                      Padding(
                        padding: const EdgeInsets.all(20),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            // Single Image
                            if (section.image != null &&
                                section.image!.isNotEmpty) ...[
                              Center(
                                child: Container(
                                  constraints: const BoxConstraints(
                                    maxWidth: 300,
                                    maxHeight: 250,
                                  ),
                                  decoration: BoxDecoration(
                                    borderRadius: BorderRadius.circular(16),
                                    boxShadow: [
                                      BoxShadow(
                                        color: Colors.black.withOpacity(0.1),
                                        blurRadius: 10,
                                        offset: const Offset(0, 4),
                                      ),
                                    ],
                                  ),
                                  child: ClipRRect(
                                    borderRadius: BorderRadius.circular(16),
                                    child: Image.asset(
                                      section.image!,
                                      fit: BoxFit.contain,
                                      errorBuilder: (context, error, stackTrace) {
                                        debugPrint(
                                          '❌ Image load error: ${section.image}',
                                        );
                                        debugPrint('   Error: $error');
                                        return Container(
                                          padding: const EdgeInsets.all(16),
                                          color: Colors.red.shade100,
                                          child: Text(
                                            'Errore immagine:\n${section.image}',
                                            style: const TextStyle(
                                              color: Colors.red,
                                              fontSize: 10,
                                            ),
                                          ),
                                        );
                                      },
                                    ),
                                  ),
                                ),
                              ),
                              const SizedBox(height: 24),
                            ],

                            // Multiple Images
                            if (section.images != null &&
                                section.images!.isNotEmpty) ...[
                              SizedBox(
                                height: 160,
                                child: ListView.separated(
                                  scrollDirection: Axis.horizontal,
                                  itemCount: section.images!.length,
                                  separatorBuilder: (_, __) =>
                                      const SizedBox(width: 16),
                                  itemBuilder: (context, imgIndex) {
                                    final imagePath = section.images![imgIndex];
                                    return Container(
                                      width: 160,
                                      decoration: BoxDecoration(
                                        color: Colors.white,
                                        borderRadius: BorderRadius.circular(16),
                                        boxShadow: [
                                          BoxShadow(
                                            color: Colors.black.withOpacity(
                                              0.08,
                                            ),
                                            blurRadius: 8,
                                            offset: const Offset(0, 2),
                                          ),
                                        ],
                                        border: Border.all(
                                          color: Colors.grey.shade100,
                                        ),
                                      ),
                                      child: ClipRRect(
                                        borderRadius: BorderRadius.circular(16),
                                        child: Image.asset(
                                          imagePath,
                                          fit: BoxFit.contain,
                                          errorBuilder: (_, __, ___) =>
                                              const Icon(Icons.image),
                                        ),
                                      ),
                                    );
                                  },
                                ),
                              ),
                              const SizedBox(height: 24),
                            ],

                            // Content Text & Controls
                            Row(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      // 1. Icon & Title (for visual anchor)
                                      if (section.icon != null) ...[
                                        Row(
                                          children: [
                                            Text(
                                              section.icon!,
                                              style: const TextStyle(
                                                fontSize: 32,
                                              ),
                                            ),
                                            const SizedBox(width: 12),
                                            Expanded(
                                              child: Text(
                                                section.title,
                                                style: TextStyle(
                                                  fontSize: 22,
                                                  fontWeight: FontWeight.bold,
                                                  color: Colors.blue.shade900,
                                                ),
                                              ),
                                            ),
                                          ],
                                        ),
                                        const SizedBox(height: 16),
                                      ],

                                      // 2. "Easy Mode" Card (Green)
                                      if (section.simpleSummary != null &&
                                          section
                                              .simpleSummary!
                                              .isNotEmpty) ...[
                                        Container(
                                          padding: const EdgeInsets.all(16),
                                          decoration: BoxDecoration(
                                            color: const Color(
                                              0xFF132F2B,
                                            ), // Dark Green background
                                            borderRadius: BorderRadius.circular(
                                              16,
                                            ),
                                            border: Border.all(
                                              color: const Color(0xFF00E676)
                                                  .withOpacity(
                                                    0.3,
                                                  ), // Bright Green accent
                                            ),
                                          ),
                                          child: Column(
                                            crossAxisAlignment:
                                                CrossAxisAlignment.start,
                                            children: [
                                              Row(
                                                children: [
                                                  const Icon(
                                                    Icons.emoji_objects_rounded,
                                                    color: Color(
                                                      0xFF00E676,
                                                    ), // Bright Green
                                                    size: 22,
                                                  ),
                                                  const SizedBox(width: 8),
                                                  const Text(
                                                    "IN BREVE",
                                                    style: TextStyle(
                                                      fontWeight:
                                                          FontWeight.bold,
                                                      fontSize: 14,
                                                      letterSpacing: 1.0,
                                                      color: Color(
                                                        0xFF69F0AE,
                                                      ), // Light Green text
                                                    ),
                                                  ),
                                                ],
                                              ),
                                              const SizedBox(height: 12),
                                              ...section.simpleSummary!.map(
                                                (point) => Padding(
                                                  padding:
                                                      const EdgeInsets.only(
                                                        bottom: 10,
                                                      ),
                                                  child: Row(
                                                    crossAxisAlignment:
                                                        CrossAxisAlignment
                                                            .start,
                                                    children: [
                                                      Container(
                                                        margin:
                                                            const EdgeInsets.only(
                                                              top: 8,
                                                            ),
                                                        width: 6,
                                                        height: 6,
                                                        decoration:
                                                            const BoxDecoration(
                                                              color: Color(
                                                                0xFF00E676,
                                                              ),
                                                              shape: BoxShape
                                                                  .circle,
                                                            ),
                                                      ),
                                                      const SizedBox(width: 12),
                                                      Expanded(
                                                        child: Text(
                                                          point,
                                                          style: TextStyle(
                                                            fontSize: 18,
                                                            height: 1.4,
                                                            color: Colors
                                                                .grey
                                                                .shade100, // Light text
                                                            fontWeight:
                                                                FontWeight.w500,
                                                          ),
                                                        ),
                                                      ),
                                                    ],
                                                  ),
                                                ),
                                              ),
                                            ],
                                          ),
                                        ),
                                        const SizedBox(height: 24),

                                        // Divider "Dettagli completi"
                                        Row(
                                          children: [
                                            Expanded(
                                              child: Divider(
                                                color: Colors.white.withOpacity(
                                                  0.1,
                                                ),
                                              ),
                                            ),
                                            Padding(
                                              padding:
                                                  const EdgeInsets.symmetric(
                                                    horizontal: 12,
                                                  ),
                                              child: Text(
                                                "DESCRIZIONE COMPLETA",
                                                style: TextStyle(
                                                  fontSize: 12,
                                                  color: Colors.white
                                                      .withOpacity(0.5),
                                                  fontWeight: FontWeight.bold,
                                                ),
                                              ),
                                            ),
                                            Expanded(
                                              child: Divider(
                                                color: Colors.white.withOpacity(
                                                  0.1,
                                                ),
                                              ),
                                            ),
                                          ],
                                        ),
                                        const SizedBox(height: 16),
                                      ],

                                      // 3. Original Content (Dimmed if summary exists)
                                      _selectedLanguage == AppLanguage.italian
                                          ? Text(
                                              section.content,
                                              style: TextStyle(
                                                fontSize: 16,
                                                height: 1.6,
                                                color:
                                                    section.simpleSummary !=
                                                        null
                                                    ? Colors.grey.shade400
                                                    : Colors.grey.shade300,
                                                fontWeight: FontWeight.w400,
                                              ),
                                            )
                                          : InteractiveTranslationText(
                                              text: section.content,
                                              targetLanguage: _selectedLanguage,
                                              style: TextStyle(
                                                fontSize: 16,
                                                height: 1.6,
                                                color:
                                                    section.simpleSummary !=
                                                        null
                                                    ? Colors.grey.shade400
                                                    : Colors.grey.shade300,
                                                fontWeight: FontWeight.w400,
                                              ),
                                            ),
                                    ],
                                  ),
                                ),
                                const SizedBox(width: 16),
                                // Floating Audio Controls
                                Container(
                                  padding: const EdgeInsets.symmetric(
                                    vertical: 8,
                                    horizontal: 6,
                                  ),
                                  decoration: BoxDecoration(
                                    color: Colors.grey.shade50,
                                    borderRadius: BorderRadius.circular(30),
                                    border: Border.all(
                                      color: Colors.grey.shade200,
                                    ),
                                  ),
                                  child: Column(
                                    children: [
                                      Tooltip(
                                        message: 'Ascolta in Italiano',
                                        child: InlineAudioButton(
                                          text: section.content,
                                          language: AppLanguage.italian,
                                          icon: Icons.volume_up_rounded,
                                          color: const Color(0xFF2E3192),
                                        ),
                                      ),
                                      if (_selectedLanguage !=
                                          AppLanguage.italian) ...[
                                        Container(
                                          height: 1,
                                          width: 20,
                                          color: Colors.grey.shade300,
                                          margin: const EdgeInsets.symmetric(
                                            vertical: 6,
                                          ),
                                        ),
                                        Tooltip(
                                          message: 'Ascolta traduzione',
                                          child: TranslationAudioButton(
                                            questionId: section.id.hashCode,
                                            italianText: section.content,
                                            targetLanguage: _selectedLanguage,
                                            getTranslation: (id, text, lang) =>
                                                _translationService
                                                    .getTranslationWithFallback(
                                                      id,
                                                      text,
                                                      lang,
                                                    ),
                                            icon: Icons.translate_rounded,
                                            color: const Color(0xFF1BFFFF)
                                                .withOpacity(
                                                  0.8,
                                                ), // Cyan-ish for translation
                                          ),
                                        ),
                                      ],
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                );
              }, childCount: widget.chapter.sections.length),
            ),
          ),
        ],
      ),
      bottomNavigationBar: _buildBottomNavigation(context),
    );
  }

  // Stylish Bottom Navigation Bar for Chapter Traversal
  Widget _buildBottomNavigation(BuildContext context) {
    if (widget.allChapters.isEmpty) return const SizedBox.shrink();

    final currentIndex = widget.allChapters.indexOf(widget.chapter);
    if (currentIndex == -1) return const SizedBox.shrink();

    final hasPrevious = currentIndex > 0;
    final hasNext = currentIndex < widget.allChapters.length - 1;

    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, -5),
          ),
        ],
      ),
      child: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          child: Row(
            children: [
              // Previous Button
              if (hasPrevious)
                Expanded(
                  child: ElevatedButton(
                    onPressed: () {
                      Navigator.pushReplacement(
                        context,
                        PageRouteBuilder(
                          pageBuilder: (_, __, ___) => TheoryDetailScreen(
                            chapter: widget.allChapters[currentIndex - 1],
                            allChapters: widget.allChapters,
                          ),
                          transitionsBuilder: (_, animation, __, child) {
                            return FadeTransition(
                              opacity: animation,
                              child: child,
                            );
                          },
                        ),
                      );
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.white,
                      foregroundColor: Colors.blueGrey.shade700,
                      surfaceTintColor: Colors.white,
                      elevation: 0,
                      side: BorderSide(color: Colors.grey.shade300),
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                    ),
                    child: const Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.arrow_back_rounded, size: 20),
                        SizedBox(width: 8),
                        Text(
                          'Precedente',
                          style: TextStyle(fontWeight: FontWeight.w600),
                        ),
                      ],
                    ),
                  ),
                )
              else
                const Expanded(child: SizedBox.shrink()),

              const SizedBox(width: 16),

              // Next Button (Hero Style)
              if (hasNext)
                Expanded(
                  child: ElevatedButton(
                    onPressed: () {
                      Navigator.pushReplacement(
                        context,
                        PageRouteBuilder(
                          pageBuilder: (_, __, ___) => TheoryDetailScreen(
                            chapter: widget.allChapters[currentIndex + 1],
                            allChapters: widget.allChapters,
                          ),
                          transitionsBuilder: (_, animation, __, child) {
                            return FadeTransition(
                              opacity: animation,
                              child: child,
                            );
                          },
                        ),
                      );
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(
                        0xFF2E3192,
                      ), // Deep Blue brand color
                      foregroundColor: Colors.white,
                      elevation: 4,
                      shadowColor: const Color(0xFF2E3192).withOpacity(0.4),
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                    ),
                    child: const Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          'Successivo',
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 16,
                          ),
                        ),
                        SizedBox(width: 8),
                        Icon(Icons.arrow_forward_rounded, size: 20),
                      ],
                    ),
                  ),
                )
              else
                const Expanded(child: SizedBox.shrink()),
            ],
          ),
        ),
      ),
    );
  }
}

// Minimal background pattern painter
class _PatternPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.white
      ..strokeWidth = 1.5
      ..style = PaintingStyle.stroke;

    final path = Path();
    for (double i = -50; i < size.width + 50; i += 30) {
      path.moveTo(i, 0);
      path.lineTo(i + 50, size.height);
    }

    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
