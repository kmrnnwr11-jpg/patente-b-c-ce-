import 'package:flutter/material.dart';
import 'package:youtube_player_flutter/youtube_player_flutter.dart';
import '../../models/translation.dart';
import '../../models/ai_tutor_model.dart';
// import 'package:flutter/services.dart'; // For landscape if needed

class TutorLessonScreen extends StatefulWidget {
  final AppLanguage language;
  final List<AiTutorSection> sections;
  final String chapterTitle;

  const TutorLessonScreen({
    super.key,
    required this.language,
    required this.sections,
    required this.chapterTitle,
  });

  @override
  State<TutorLessonScreen> createState() => _TutorLessonScreenState();
}

class _TutorLessonScreenState extends State<TutorLessonScreen> {
  int _currentIndex = 0;
  YoutubePlayerController? _controller;
  bool _isVideoInitialized = false;

  @override
  void initState() {
    super.initState();
    _initializeLesson(_currentIndex);
  }

  @override
  void deactivate() {
    _controller?.pause();
    super.deactivate();
  }

  @override
  void dispose() {
    _controller?.dispose();
    super.dispose();
  }

  Future<void> _initializeLesson(int index) async {
    // Dipose previous controller if exists
    final oldController = _controller;
    if (oldController != null) {
      oldController.dispose();
    }

    setState(() {
      _isVideoInitialized = false;
      _controller = null;
    });

    final section = widget.sections[index];
    final videoId = section.aiExplanation?.getVideoId(widget.language);

    print(
      'DEBUG: checking video for section ${section.id}, language ${widget.language.code}',
    );
    print('DEBUG: found videoId: $videoId');
    print('DEBUG: all videoIds: ${section.aiExplanation?.videoIds}');

    if (videoId != null && videoId.isNotEmpty) {
      _controller = YoutubePlayerController(
        initialVideoId: videoId,
        flags: const YoutubePlayerFlags(
          autoPlay: true,
          mute: false,
          enableCaption: false,
        ),
      );
      setState(() {
        _isVideoInitialized = true;
      });
    }
  }

  void _nextLesson() {
    if (_currentIndex < widget.sections.length - 1) {
      setState(() => _currentIndex++);
      _initializeLesson(_currentIndex);
    }
  }

  void _previousLesson() {
    if (_currentIndex > 0) {
      setState(() => _currentIndex--);
      _initializeLesson(_currentIndex);
    }
  }

  @override
  Widget build(BuildContext context) {
    final section = widget.sections[_currentIndex];
    final explanation = section.aiExplanation;
    final translatedText =
        explanation?.getTranslation(widget.language) ??
        'Nessuna spiegazione disponibile in questa lingua.';

    return Scaffold(
      appBar: AppBar(
        title: Text(widget.chapterTitle),
        actions: [
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Center(
              child: Text(
                '${_currentIndex + 1}/${widget.sections.length}',
                style: const TextStyle(fontWeight: FontWeight.bold),
              ),
            ),
          ),
        ],
      ),
      body: Column(
        children: [
          // Video Player Area
          Container(
            constraints: BoxConstraints(
              maxHeight: MediaQuery.of(context).size.height * 0.4,
            ),
            child: AspectRatio(
              aspectRatio: 16 / 9,
              child: Container(
                color: Colors.black,
                child: _isVideoInitialized && _controller != null
                    ? YoutubePlayer(
                        controller: _controller!,
                        showVideoProgressIndicator: true,
                        progressIndicatorColor: Theme.of(context).primaryColor,
                        onReady: () {
                          // _controller.addListener(listener);
                        },
                      )
                    : GestureDetector(
                        onTap: () {
                          showDialog(
                            context: context,
                            builder: (context) => AlertDialog(
                              title: const Text('🚧 Coming Soon'),
                              content: const Text(
                                'Il video per questa sezione sarà disponibile a breve.\n\nStiamo lavorando per portare tutti i contenuti il prima possibile!',
                              ),
                              actions: [
                                TextButton(
                                  onPressed: () => Navigator.pop(context),
                                  child: const Text('OK'),
                                ),
                              ],
                            ),
                          );
                        },
                        child: Stack(
                          alignment: Alignment.center,
                          children: [
                            if (section.image != null)
                              Opacity(
                                opacity: 0.5,
                                child: Image.asset(
                                  section.image!,
                                  fit: BoxFit.cover,
                                  width: double.infinity,
                                ),
                              ),
                            const Icon(
                              Icons
                                  .lock_clock, // Changed icon to indicate waiting/coming soon
                              color: Colors.white,
                              size: 64,
                            ),
                            Positioned(
                              bottom: 20,
                              child: Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 12,
                                  vertical: 6,
                                ),
                                decoration: BoxDecoration(
                                  color: Colors.black.withOpacity(0.7),
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: const Text(
                                  'Video in arrivo... Clicca qui',
                                  style: TextStyle(
                                    color: Colors.white,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
              ),
            ),
          ),

          // Content Area
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    section.title,
                    style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Tabs for Original vs Simplified Text
                  DefaultTabController(
                    length: 2,
                    child: Column(
                      children: [
                        const TabBar(
                          tabs: [
                            Tab(text: 'Spiegazione AI'),
                            Tab(text: 'Teoria'),
                          ],
                        ),
                        SizedBox(
                          height: 300, // Fixed height for scrolling content
                          child: TabBarView(
                            children: [
                              // AI Explanation Tab
                              ListView(
                                padding: const EdgeInsets.only(top: 16),
                                children: [
                                  Text(
                                    translatedText,
                                    style: const TextStyle(
                                      fontSize: 16,
                                      height: 1.5,
                                    ),
                                  ),
                                ],
                              ),
                              // Official Text Tab
                              ListView(
                                padding: const EdgeInsets.only(top: 16),
                                children: [
                                  Text(
                                    section.content,
                                    style: TextStyle(
                                      fontSize: 16,
                                      height: 1.5,
                                      color: Colors.grey[700],
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Navigation Bar
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
            decoration: BoxDecoration(
              color: Colors.white,
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.05),
                  blurRadius: 10,
                  offset: const Offset(0, -4),
                ),
              ],
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                ElevatedButton.icon(
                  onPressed: _currentIndex > 0 ? _previousLesson : null,
                  icon: const Icon(Icons.arrow_back),
                  label: const Text('Indietro'),
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 20,
                      vertical: 12,
                    ),
                  ),
                ),
                ElevatedButton.icon(
                  onPressed: _currentIndex < widget.sections.length - 1
                      ? _nextLesson
                      : null,
                  icon: const Icon(Icons.arrow_forward),
                  label: const Text('Avanti'),
                  iconAlignment: IconAlignment.end, // New Fluxter/Dart feature
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 20,
                      vertical: 12,
                    ),
                    backgroundColor: Theme.of(context).primaryColor,
                    foregroundColor: Colors.white,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
