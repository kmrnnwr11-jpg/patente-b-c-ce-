import 'dart:convert';
import 'package:flutter/material.dart';
import '../../services/quiz_service.dart';
import '../../theme/app_theme.dart';
import 'quiz_screen.dart';

/// Screen for selecting quiz topic
class TopicSelectionScreen extends StatefulWidget {
  const TopicSelectionScreen({super.key});

  @override
  State<TopicSelectionScreen> createState() => _TopicSelectionScreenState();
}

class _TopicSelectionScreenState extends State<TopicSelectionScreen> {
  final QuizService _quizService = QuizService();
  List<String> _topics = [];
  Map<String, String> _topicImages = {}; // Map topic name to image path
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    await _quizService.loadQuestions();

    // Load theory images to map them to topics
    try {
      final String theoryString = await DefaultAssetBundle.of(
        context,
      ).loadString('assets/data/theory-pdf-lessons.json');
      final Map<String, dynamic> theoryJson = json.decode(theoryString);
      final List<dynamic> chapters = theoryJson['chapters'];

      for (var chapter in chapters) {
        final String title = chapter['title'];
        final List<dynamic> sections = chapter['sections'];
        // Find first section with an image
        String? imagePath;
        for (var section in sections) {
          if (section['image'] != null &&
              section['image'].toString().isNotEmpty) {
            imagePath = section['image'];
            break;
          }
        }

        if (imagePath != null) {
          // Normalizing keys to match quiz topics which might be slightly different
          // We'll store the exact title and maybe some variations if needed
          _topicImages[title] = imagePath;

          // Heuristic: If quiz topic contains part of the chapter title, we might match it
          // But for now, let's rely on string matching or 'contains' in the UI builder
        }
      }
    } catch (e) {
      debugPrint('Error loading theory images: $e');
    }

    setState(() {
      _topics = _quizService.getTopics();
      _isLoading = false;
    });
  }

  // Manual overrides for specific quiz topics
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

    // 0. Manual Override Check
    if (_manualTopicImages.containsKey(lowerTopic)) {
      return _manualTopicImages[lowerTopic];
    }
    // Also check if the key is contained in the topic (for safety)
    for (var key in _manualTopicImages.keys) {
      if (lowerTopic.contains(key)) return _manualTopicImages[key];
    }

    // 1. Direct match (try loose matching)
    for (var key in _topicImages.keys) {
      if (key.toLowerCase() == lowerTopic) {
        return _topicImages[key];
      }
    }

    // 2. Partial match (Theory title contains quiz topic or vice versa)
    for (var key in _topicImages.keys) {
      final lowerKey = key.toLowerCase();
      if (lowerKey.contains(lowerTopic) || lowerTopic.contains(lowerKey)) {
        return _topicImages[key];
      }
    }

    // 3. Fallback keywords
    if (lowerTopic.contains('definizioni')) {
      return _topicImages.values.firstWhere(
        (e) => e.contains('introduzione') || e.contains('strada'),
        orElse: () => '',
      );
    }
    // Try to match "Segnali" specifically
    if (lowerTopic.contains('segnali')) {
      // Try to find a chapter with "Segnali" in title and return its image
      for (var key in _topicImages.keys) {
        if (key.toLowerCase().contains('segnali')) return _topicImages[key];
      }
    }

    return null;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Scegli Argomento')),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: _topics.length,
              itemBuilder: (context, index) {
                final topic = _topics[index];
                final questionCount = _quizService.getByTopic(topic).length;
                final imagePath = _findImageForTopic(topic);

                return Padding(
                  padding: const EdgeInsets.only(bottom: 12),
                  child: Material(
                    color: AppTheme.surfaceColor,
                    borderRadius: BorderRadius.circular(16),
                    child: InkWell(
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) =>
                                QuizScreen(mode: QuizMode.topic, topic: topic),
                          ),
                        );
                      },
                      borderRadius: BorderRadius.circular(16),
                      child: Container(
                        padding: const EdgeInsets.all(
                          12,
                        ), // Reduced padding slightly
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(
                            color: AppTheme.cardColor,
                            width: 1,
                          ),
                        ),
                        child: Row(
                          children: [
                            // IMAGE CONTAINER replacing the Number Container
                            Container(
                              width: 80, // Larger width for image
                              height: 60,
                              decoration: BoxDecoration(
                                color: AppTheme.primaryColor.withOpacity(0.1),
                                borderRadius: BorderRadius.circular(12),
                                image: imagePath != null && imagePath.isNotEmpty
                                    ? DecorationImage(
                                        image: AssetImage(imagePath),
                                        fit: BoxFit.cover,
                                      )
                                    : null,
                              ),
                              child: imagePath == null || imagePath.isEmpty
                                  ? Center(
                                      child: Text(
                                        '${index + 1}',
                                        style: const TextStyle(
                                          color: AppTheme.primaryLight,
                                          fontWeight: FontWeight.bold,
                                          fontSize: 18,
                                        ),
                                      ),
                                    )
                                  : null,
                            ),
                            const SizedBox(width: 16),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    topic,
                                    style: const TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.w600,
                                    ),
                                    maxLines: 2,
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    '$questionCount domande',
                                    style: const TextStyle(
                                      fontSize: 13,
                                      color: AppTheme.textSecondary,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            const Icon(
                              Icons.arrow_forward_ios,
                              color: AppTheme.textSecondary,
                              size: 16,
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                );
              },
            ),
    );
  }
}
