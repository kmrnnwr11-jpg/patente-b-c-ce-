/// Quiz question model for Patente B app
class QuizQuestion {
  final int id;
  final String domanda;
  final bool risposta;
  final String? immagine;
  final String argomento;
  final String? sottoArgomento;
  final String difficulty;

  QuizQuestion({
    required this.id,
    required this.domanda,
    required this.risposta,
    this.immagine,
    required this.argomento,
    this.sottoArgomento,
    this.difficulty = 'medium',
  });

  factory QuizQuestion.fromJson(Map<String, dynamic> json) {
    return QuizQuestion(
      id: json['id'] as int,
      domanda: json['domanda'] as String,
      risposta: json['risposta'] as bool,
      immagine: json['immagine'] as String?,
      argomento: json['argomento'] as String,
      sottoArgomento: json['sottoArgomento'] as String?,
      difficulty: json['difficulty'] as String? ?? 'medium',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'domanda': domanda,
      'risposta': risposta,
      'immagine': immagine,
      'argomento': argomento,
      'sottoArgomento': sottoArgomento,
      'difficulty': difficulty,
    };
  }
}
