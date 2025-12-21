/// Model for a traffic signal
class Signal {
  final String id;
  final String name;
  final String category;
  final String description;
  final String image;
  final String? descriptionEn;
  final String? behavior;

  Signal({
    required this.id,
    required this.name,
    required this.category,
    required this.description,
    required this.image,
    this.descriptionEn,
    this.behavior,
  });

  factory Signal.fromJson(Map<String, dynamic> json) {
    return Signal(
      id: json['id']?.toString() ?? '',
      name: json['name'] ?? json['nome'] ?? '',
      category: json['category'] ?? json['categoria'] ?? '',
      description: json['description'] ?? json['descrizione'] ?? '',
      image: json['image'] ?? json['immagine'] ?? '',
      descriptionEn: json['description_en'],
      behavior: json['comportamento'],
    );
  }

  /// Get the asset path for the signal image
  String get imagePath {
    // Handle different image path formats
    if (image.startsWith('/')) {
      return 'assets$image';
    } else if (image.startsWith('assets/')) {
      return image;
    } else {
      return 'assets/images/segnali/$image';
    }
  }
}

/// Categories of traffic signals
enum SignalCategory {
  pericolo('Segnali di Pericolo', 'pericolo'),
  divieto('Segnali di Divieto', 'divieto'),
  obbligo('Segnali di Obbligo', 'obbligo'),
  precedenza('Segnali di Precedenza', 'precedenza'),
  indicazione('Segnali di Indicazione', 'indicazione');

  final String displayName;
  final String id;

  const SignalCategory(this.displayName, this.id);
}
