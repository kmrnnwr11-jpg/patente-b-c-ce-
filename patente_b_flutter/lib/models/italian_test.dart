class ItalianTest {
  final String level;
  final String section;
  final String title;
  final String description;
  final int duration;
  final int totalQuestions;
  final int passThreshold;
  final String? note;
  final List<ItalianTestExercise> exercises;

  ItalianTest({
    required this.level,
    required this.section,
    required this.title,
    required this.description,
    required this.duration,
    required this.totalQuestions,
    required this.passThreshold,
    this.note,
    required this.exercises,
  });

  factory ItalianTest.fromJson(Map<String, dynamic> json) {
    // Handling both 'texts' (reading) and 'exercises' (listening) keys
    final exercisesList = (json['texts'] ?? json['exercises'] ?? []) as List;

    return ItalianTest(
      level: json['level'] ?? '',
      section: json['section'] ?? '',
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      duration: json['duration'] ?? 0,
      totalQuestions: json['totalQuestions'] ?? 0,
      passThreshold: json['passThreshold'] ?? 0,
      note: json['note'],
      exercises: exercisesList
          .map((e) => ItalianTestExercise.fromJson(e))
          .toList(),
    );
  }
}

class ItalianTestExercise {
  final String id;
  final String type;
  final String title;
  final String? content;
  final String? audioFile;
  final String? transcript;
  final List<ItalianTestQuestion> questions;

  ItalianTestExercise({
    required this.id,
    required this.type,
    required this.title,
    this.content,
    this.audioFile,
    this.transcript,
    required this.questions,
  });

  factory ItalianTestExercise.fromJson(Map<String, dynamic> json) {
    return ItalianTestExercise(
      id: json['id'] ?? '',
      type: json['type'] ?? '',
      title: json['title'] ?? '',
      content: json['content'],
      audioFile: json['audioFile'],
      transcript: json['transcript'],
      questions: (json['questions'] as List? ?? [])
          .map((q) => ItalianTestQuestion.fromJson(q))
          .toList(),
    );
  }
}

class ItalianTestQuestion {
  final int id;
  final String question;
  final List<String> options;
  final int answer;

  ItalianTestQuestion({
    required this.id,
    required this.question,
    required this.options,
    required this.answer,
  });

  factory ItalianTestQuestion.fromJson(Map<String, dynamic> json) {
    return ItalianTestQuestion(
      id: json['id'] ?? 0,
      question: json['question'] ?? '',
      options: List<String>.from(json['options'] ?? []),
      answer: json['answer'] ?? 0,
    );
  }
}
