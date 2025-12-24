import 'dart:convert';
import 'package:flutter/material.dart';
import '../../models/translation.dart';
import '../../models/ai_tutor_model.dart';
import 'tutor_lesson_screen.dart';

class TutorTopicScreen extends StatefulWidget {
  final AppLanguage language;

  const TutorTopicScreen({super.key, required this.language});

  @override
  State<TutorTopicScreen> createState() => _TutorTopicScreenState();
}

class _TutorTopicScreenState extends State<TutorTopicScreen> {
  List<Map<String, dynamic>> _chapters = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadChapters();
  }

  Future<void> _loadChapters() async {
    try {
      final String data = await DefaultAssetBundle.of(
        context,
      ).loadString('assets/data/theory-pdf-lessons.json');
      final Map<String, dynamic> jsonData = json.decode(data);

      setState(() {
        _chapters = List<Map<String, dynamic>>.from(jsonData['chapters']);
        _isLoading = false;
      });
    } catch (e) {
      debugPrint('Error loading chapters: $e');
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('${widget.language.flag} Video Lezioni')),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: _chapters.length,
              itemBuilder: (context, index) {
                final chapter = _chapters[index];
                return Card(
                  elevation: 2,
                  margin: const EdgeInsets.only(bottom: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: ListTile(
                    contentPadding: const EdgeInsets.all(16),
                    leading: Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: Theme.of(context).primaryColor.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        chapter['icon'] ?? '📚',
                        style: const TextStyle(fontSize: 24),
                      ),
                    ),
                    title: Text(
                      chapter['title'] ?? 'Capitolo ${index + 1}',
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                      ),
                    ),
                    subtitle: Text(
                      '${(chapter['sections'] as List).length} Video tutorial disponibili',
                    ),
                    trailing: const Icon(Icons.play_circle_fill, size: 32),
                    onTap: () {
                      _startChapter(chapter);
                    },
                  ),
                );
              },
            ),
    );
  }

  void _startChapter(Map<String, dynamic> chapter) {
    // Convert JSON sections to AiTutorSection objects
    final sections = (chapter['sections'] as List)
        .map((s) => AiTutorSection.fromJson(s))
        .toList();

    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => TutorLessonScreen(
          language: widget.language,
          sections: sections,
          chapterTitle: chapter['title'],
        ),
      ),
    );
  }
}
