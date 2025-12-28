import 'package:flutter/material.dart';
import '../../models/translation.dart';
import '../../services/language_preference_service.dart';
import 'tutor_topic_screen.dart';

class AiTutorLandingScreen extends StatefulWidget {
  const AiTutorLandingScreen({super.key});

  @override
  State<AiTutorLandingScreen> createState() => _AiTutorLandingScreenState();
}

class _AiTutorLandingScreenState extends State<AiTutorLandingScreen> {
  final LanguagePreferenceService _languageService =
      LanguagePreferenceService();
  AppLanguage _selectedLanguage = AppLanguage.italian;

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
    return Scaffold(
      appBar: AppBar(
        title: const Text('AI Tutor Multilingua'),
        backgroundColor: Colors.transparent,
        elevation: 0,
        foregroundColor: Colors.black,
      ),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Scegli la lingua per i video tutorial',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Text(
              'Guarda clip video generati dall\'AI che spiegano la teoria nella tua lingua.',
              style: TextStyle(fontSize: 16, color: Colors.grey[600]),
            ),
            const SizedBox(height: 32),
            Expanded(
              child: GridView.builder(
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  crossAxisSpacing: 16,
                  mainAxisSpacing: 16,
                  childAspectRatio: 1.1,
                ),
                itemCount: AppLanguage.values.length,
                itemBuilder: (context, index) {
                  final language = AppLanguage.values[index];
                  final isSelected = language == _selectedLanguage;

                  return InkWell(
                    onTap: () async {
                      setState(() => _selectedLanguage = language);
                      await _languageService.setPreferredLanguage(language);
                      if (context.mounted) {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) =>
                                TutorTopicScreen(language: language),
                          ),
                        );
                      }
                    },
                    child: Container(
                      decoration: BoxDecoration(
                        color: isSelected
                            ? Theme.of(context).primaryColor
                            : Colors.white,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(
                          color: isSelected
                              ? Theme.of(context).primaryColor
                              : Colors.grey.shade300,
                          width: 2,
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.05),
                            blurRadius: 10,
                            offset: const Offset(0, 4),
                          ),
                        ],
                      ),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(
                            language.flag,
                            style: const TextStyle(fontSize: 48),
                          ),
                          const SizedBox(height: 12),
                          Text(
                            language.name,
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                              color: isSelected ? Colors.white : Colors.black87,
                            ),
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
