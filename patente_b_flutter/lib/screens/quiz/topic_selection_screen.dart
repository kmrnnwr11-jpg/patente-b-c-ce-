import 'dart:convert';
import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../../services/course_service.dart';
import '../../services/quiz_service.dart';
import '../../services/stats_service.dart';
import '../../theme/apple_glass_theme.dart';
import 'quiz_screen.dart';

/// Screen for selecting quiz topic with Apple Glassmorphism design
class TopicSelectionScreen extends StatefulWidget {
  const TopicSelectionScreen({super.key});

  @override
  State<TopicSelectionScreen> createState() => _TopicSelectionScreenState();
}

class _TopicSelectionScreenState extends State<TopicSelectionScreen> {
  late QuizService _quizService;
  List<String> _topics = [];
  final Map<String, String> _topicImages = {};
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _loadData();
    });
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _quizService = context.read<QuizService>();
  }

  Future<void> _loadData() async {
    final courseService = context.read<CourseService>();
    await _quizService.loadQuestions(license: courseService.currentLicense);

    try {
      final String theoryString = await DefaultAssetBundle.of(
        context,
      ).loadString('assets/data/theory-pdf-lessons.json');
      final Map<String, dynamic> theoryJson = json.decode(theoryString);
      final List<dynamic> chapters = theoryJson['chapters'];

      for (var chapter in chapters) {
        final String title = chapter['title'];
        final List<dynamic> sections = chapter['sections'];
        String? imagePath;
        for (var section in sections) {
          if (section['image'] != null &&
              section['image'].toString().isNotEmpty) {
            imagePath = section['image'];
            break;
          }
        }
        if (imagePath != null) {
          _topicImages[title] = imagePath;
        }
      }
    } catch (e) {
      debugPrint('Error loading theory images: $e');
    }

    if (mounted) {
      setState(() {
        _topics = _quizService.getTopics();
        _isLoading = false;
      });
    }
  }

  final Map<String, String> _manualTopicImages = {
    'segnaletica-orizzontale-ostacoli':
        'assets/images/quiz/segnaletica_orizzontale.png',
    'semafori-vigili': 'assets/images/quiz/semafori_vigili.png',
    'limiti-di-velocita': 'assets/images/quiz/limiti_velocita.png',
    'distanza-di-sicurezza': 'assets/images/quiz/distanza_sicurezza.png',
    'norme-di-circolazione': 'assets/images/quiz/norme_circolazione.png',
    'precedenza-incroci': 'assets/images/quiz/precedenza_incroci.png',
    'sorpasso': 'assets/images/quiz/sorpasso.png',
    'fermata-sosta-arresto': 'assets/images/quiz/fermata_sosta.png',
    'norme-varie-autostrade-pannelli': 'assets/images/quiz/autostrade.png',
    'luci-dispositivi-acustici': 'assets/images/quiz/luci_acustici.png',
    'cinture-casco-sicurezza': 'assets/images/quiz/sicurezza_passiva.png',
    'patente-punti-documenti': 'assets/images/quiz/patente_documenti.png',
    'incidenti-stradali-comportamenti': 'assets/images/quiz/incidenti.png',
    'alcool-droga-primo-soccorso': 'assets/images/quiz/primo_soccorso.png',
    'responsabilita-civile-penale-e-assicurazione':
        'assets/images/quiz/assicurazione.png',
  };

  String? _findImageForTopic(String topic) {
    final lowerTopic = topic.toLowerCase();

    if (_manualTopicImages.containsKey(lowerTopic)) {
      return _manualTopicImages[lowerTopic];
    }
    for (var key in _manualTopicImages.keys) {
      if (lowerTopic.contains(key)) return _manualTopicImages[key];
    }

    for (var key in _topicImages.keys) {
      if (key.toLowerCase() == lowerTopic) {
        return _topicImages[key];
      }
    }

    for (var key in _topicImages.keys) {
      final lowerKey = key.toLowerCase();
      if (lowerKey.contains(lowerTopic) || lowerTopic.contains(lowerKey)) {
        return _topicImages[key];
      }
    }

    if (lowerTopic.contains('definizioni')) {
      return _topicImages.values.firstWhere(
        (e) => e.contains('introduzione') || e.contains('strada'),
        orElse: () => '',
      );
    }
    if (lowerTopic.contains('segnali')) {
      for (var key in _topicImages.keys) {
        if (key.toLowerCase().contains('segnali')) return _topicImages[key];
      }
    }

    return null;
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: Text(
          'Scegli Argomento',
          style: GoogleFonts.poppins(
            color: isDark
                ? Colors.white
                : const Color(0xFF006064), // Adaptive title
            fontWeight: FontWeight.bold,
            fontSize: 20,
          ),
        ),
        iconTheme: IconThemeData(
          color: isDark ? Colors.white : const Color(0xFF006064),
        ), // Adaptive icons
      ),
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: isDark
                ? AppleGlassTheme.bgGradient.colors
                : AppleGlassTheme.bgGradientLight.colors,
          ),
        ),
        child: SafeArea(
          child: _isLoading
              ? const Center(
                  child: CircularProgressIndicator(color: Colors.white),
                )
              : ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: _topics.length,
                  itemBuilder: (context, index) {
                    final topic = _topics[index];
                    final questionCount = _quizService.getByTopic(topic).length;
                    final imagePath = _findImageForTopic(topic);

                    return _buildGlassCard(
                      context,
                      topic: topic,
                      questionCount: questionCount,
                      imagePath: imagePath,
                      isDark: isDark,
                    );
                  },
                ),
        ),
      ),
    );
  }

  Widget _buildGlassCard(
    BuildContext context, {
    required String topic,
    required int questionCount,
    required String? imagePath,
    required bool isDark,
  }) {
    final statsService = context.watch<StatsService>();
    final topicStats = statsService.stats.topicStats[topic];
    final answered = topicStats?.attempts ?? 0;
    final correct = topicStats?.correct ?? 0;
    final accuracy = topicStats?.accuracy ?? 0.0;
    final progressPercent = questionCount > 0
        ? (answered / questionCount).clamp(0.0, 1.0)
        : 0.0;

    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(20),
        child: BackdropFilter(
          filter: ImageFilter.blur(
            sigmaX: isDark ? 15 : 10,
            sigmaY: isDark ? 15 : 10,
          ),
          child: GestureDetector(
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) =>
                      QuizScreen(mode: QuizMode.topic, topic: topic),
                ),
              );
            },
            child: Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                // Dark Mode: Dark Glass | Light Mode: Water Blue Glass
                color: isDark
                    ? Colors.white.withOpacity(0.10)
                    : const Color(0xFFE0F7FA).withOpacity(0.50), // Water Glass
                borderRadius: BorderRadius.circular(20),
                border: Border.all(
                  color: isDark
                      ? Colors.white.withOpacity(0.25)
                      : Colors.white.withOpacity(0.60),
                  width: 1.5,
                ),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.1),
                    blurRadius: 20,
                    offset: const Offset(0, 8),
                  ),
                ],
              ),
              child: Row(
                children: [
                  // Image icon 60x60 with borderRadius 12
                  ClipRRect(
                    borderRadius: BorderRadius.circular(12),
                    child: Container(
                      width: 60,
                      height: 60,
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.2),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: imagePath != null && imagePath.isNotEmpty
                          ? Image.asset(
                              imagePath,
                              fit: BoxFit.cover,
                              errorBuilder: (_, __, ___) => Icon(
                                Icons.quiz,
                                color: isDark
                                    ? Colors.white70
                                    : const Color(0xFF006064),
                                size: 30,
                              ),
                            )
                          : Icon(
                              Icons.quiz,
                              color: isDark
                                  ? Colors.white70
                                  : const Color(0xFF006064),
                              size: 30,
                            ),
                    ),
                  ),
                  const SizedBox(width: 16),
                  // Content
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Title - fontSize 16, w600, white
                        Text(
                          topic,
                          style: GoogleFonts.poppins(
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                            // Dark: White | Light: Dark Blue/Cyan for Water theme
                            color: isDark
                                ? Colors.white
                                : const Color(0xFF006064),
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                        const SizedBox(height: 4),
                        // Subtitle - fontSize 14, w400, white70
                        Row(
                          children: [
                            Text(
                              '$questionCount domande',
                              style: GoogleFonts.poppins(
                                fontSize: 14,
                                fontWeight: FontWeight.w400,
                                color: isDark
                                    ? Colors.white70
                                    : AppleGlassTheme.textSecondaryDark,
                              ),
                            ),
                            if (answered > 0) ...[
                              const SizedBox(width: 8),
                              const Icon(
                                Icons.check_circle,
                                size: 14,
                                color: Color(0xFF4CD964), // Apple green
                              ),
                              const SizedBox(width: 2),
                              Text(
                                '$correct',
                                style: GoogleFonts.poppins(
                                  fontSize: 12,
                                  fontWeight: FontWeight.w600,
                                  color: const Color(0xFF4CD964),
                                ),
                              ),
                              const SizedBox(width: 6),
                              Icon(
                                Icons.cancel,
                                size: 14,
                                color: Colors.red.shade400,
                              ),
                              const SizedBox(width: 2),
                              Text(
                                '${answered - correct}',
                                style: GoogleFonts.poppins(
                                  fontSize: 12,
                                  fontWeight: FontWeight.w600,
                                  color: Colors.red.shade400,
                                ),
                              ),
                            ],
                          ],
                        ),
                        const SizedBox(height: 8),
                        // Apple-style progress bar - height 6, borderRadius 8
                        Container(
                          height: 6,
                          decoration: BoxDecoration(
                            color: Colors.white.withOpacity(0.2),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: FractionallySizedBox(
                            alignment: Alignment.centerLeft,
                            widthFactor: progressPercent > 0
                                ? progressPercent
                                : 0.02,
                            child: Container(
                              decoration: BoxDecoration(
                                color: const Color(0xFF4CD964), // Apple green
                                borderRadius: BorderRadius.circular(8),
                              ),
                            ),
                          ),
                        ),
                        if (answered > 0)
                          Padding(
                            padding: const EdgeInsets.only(top: 4),
                            child: Text(
                              '${accuracy.toStringAsFixed(0)}% corretto',
                              style: GoogleFonts.poppins(
                                fontSize: 11,
                                fontWeight: FontWeight.w500,
                                color: const Color(0xFF4CD964),
                              ),
                            ),
                          ),
                      ],
                    ),
                  ),
                  // Chevron - adaptive color
                  Icon(
                    Icons.chevron_right,
                    color: isDark
                        ? Colors.white70
                        : const Color(0xFF006064).withOpacity(0.7),
                    size: 24,
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
