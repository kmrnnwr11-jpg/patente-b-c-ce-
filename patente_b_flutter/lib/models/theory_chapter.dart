/// Model for a theory chapter with sections
class TheoryChapter {
  final String id;
  final String title;
  final String? description;
  final String? icon;
  final List<TheorySection> sections;

  TheoryChapter({
    required this.id,
    required this.title,
    this.description,
    this.icon,
    required this.sections,
  });

  factory TheoryChapter.fromJson(Map<String, dynamic> json) {
    return TheoryChapter(
      id: json['id'] ?? '',
      title: json['title'] ?? json['name'] ?? '',
      description: json['description'],
      icon: json['icon'],
      sections:
          (json['sections'] as List<dynamic>?)
              ?.map((s) => TheorySection.fromJson(s))
              .toList() ??
          [],
    );
  }
}

/// Model for a section within a theory chapter
class TheorySection {
  final String id;
  final String title;
  final String content;
  final String? image;
  final List<String>? images;
  final List<String>? simpleSummary;
  final String? icon;

  TheorySection({
    required this.id,
    required this.title,
    required this.content,
    this.image,
    this.images,
    this.simpleSummary,
    this.icon,
  });

  factory TheorySection.fromJson(Map<String, dynamic> json) {
    return TheorySection(
      id: json['id']?.toString() ?? '',
      title: json['title'] ?? json['name'] ?? '',
      content: json['content'] ?? json['description'] ?? '',
      image: json['image'],
      images: (json['images'] as List<dynamic>?)?.cast<String>(),
      simpleSummary: json['simple_summary'] != null
          ? List<String>.from(json['simple_summary'])
          : null,
      icon: json['icon'],
    );
  }
}
