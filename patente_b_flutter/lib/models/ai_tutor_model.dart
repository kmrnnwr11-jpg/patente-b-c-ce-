import 'translation.dart';

class AiTutorSection {
  final String id;
  final String title;
  final String content;
  final String? image;
  final String? icon;
  final AiExplanation? aiExplanation;

  AiTutorSection({
    required this.id,
    required this.title,
    required this.content,
    this.image,
    this.icon,
    this.aiExplanation,
  });

  factory AiTutorSection.fromJson(Map<String, dynamic> json) {
    return AiTutorSection(
      id: json['id'] ?? '',
      title: json['title'] ?? '',
      content: json['content'] ?? '',
      image: json['image'],
      icon: json['icon'],
      aiExplanation: json['ai_explanation'] != null
          ? AiExplanation.fromJson(json['ai_explanation'])
          : null,
    );
  }
}

class AiExplanation {
  final String originalText;
  final Map<String, String> videoIds;
  final Map<String, String> translations;

  AiExplanation({
    required this.originalText,
    required this.videoIds,
    required this.translations,
  });

  factory AiExplanation.fromJson(Map<String, dynamic> json) {
    return AiExplanation(
      originalText: json['original_text'] ?? '',
      videoIds: Map<String, String>.from(json['video_ids'] ?? {}),
      translations: Map<String, String>.from(json['translations'] ?? {}),
    );
  }

  String? getVideoId(AppLanguage language) {
    return videoIds[language.code];
  }

  String? getTranslation(AppLanguage language) {
    if (language == AppLanguage.italian) return originalText;
    return translations[language.code];
  }
}
