/// Available languages for translation
enum AppLanguage {
  italian('it', 'Italiano', '🇮🇹'),
  english('en', 'English', '🇬🇧'),
  hindi('hi', 'हिन्दी', '🇮🇳'),
  urdu('ur', 'اردو', '🇵🇰'),
  punjabi('pa', 'ਪੰਜਾਬੀ', '🇮🇳'),
  pashto('ps', 'پښتو', '🇦🇫'),
  bengali('bn', 'বাংলা', '🇧🇩'),
  arabic('ar', 'العربية', '🇸🇦');

  final String code;
  final String name;
  final String flag;

  const AppLanguage(this.code, this.name, this.flag);

  static AppLanguage fromCode(String code) {
    return AppLanguage.values.firstWhere(
      (lang) => lang.code == code,
      orElse: () => AppLanguage.italian,
    );
  }
}

/// Model for a translated question
class TranslatedQuestion {
  final int id;
  final String domanda;
  final String domandaEn;
  final bool risposta;
  final String? immagine;
  final String argomento;
  final String? argomentoEn;
  final String? urAudio;
  final String? paAudio;
  final String? psAudio; // Pashto
  final String? bnAudio; // Bengali
  final String? arAudio; // Arabic

  TranslatedQuestion({
    required this.id,
    required this.domanda,
    required this.domandaEn,
    required this.risposta,
    this.immagine,
    required this.argomento,
    this.argomentoEn,
    this.urAudio,
    this.paAudio,
    this.psAudio,
    this.bnAudio,
    this.arAudio,
  });

  factory TranslatedQuestion.fromJson(Map<String, dynamic> json) {
    return TranslatedQuestion(
      id: json['id'] ?? 0,
      domanda: json['domanda'] ?? '',
      domandaEn: json['domanda_en'] ?? json['domanda'] ?? '',
      risposta: json['risposta'] ?? false,
      immagine: json['immagine'],
      argomento: json['argomento'] ?? '',
      argomentoEn: json['argomento_en'],
      urAudio: json['ur_audio'],
      paAudio: json['pa_audio'],
      psAudio: json['ps_audio'],
      bnAudio: json['bn_audio'],
      arAudio: json['ar_audio'],
    );
  }

  /// Get the question text in the specified language
  String getQuestion(AppLanguage language) {
    switch (language) {
      case AppLanguage.english:
        return domandaEn.isNotEmpty ? domandaEn : domanda;
      default:
        return domanda;
    }
  }

  /// Get the topic in the specified language
  String getTopic(AppLanguage language) {
    switch (language) {
      case AppLanguage.english:
        return argomentoEn ?? argomento;
      default:
        return argomento;
    }
  }

  /// Get the audio URL for the specified language
  String? getAudioUrl(AppLanguage language) {
    switch (language) {
      case AppLanguage.urdu:
        return urAudio;
      case AppLanguage.punjabi:
        return paAudio;
      case AppLanguage.pashto:
        return psAudio;
      case AppLanguage.bengali:
        return bnAudio;
      case AppLanguage.arabic:
        return arAudio;
      default:
        return null;
    }
  }
}
