import 'package:cloud_firestore/cloud_firestore.dart';

/// Tipo di sconto del codice promo
enum DiscountType { percentage, fixed }

/// Modello per i codici promozionali
class PromoCode {
  final String id;
  final String code;
  final DiscountType discountType;
  final double discountValue;
  final int maxUses;
  final int currentUses;
  final DateTime validFrom;
  final DateTime validUntil;
  final bool isActive;
  final String? creatorId;
  final String? description;
  final DateTime createdAt;
  final List<String> usedByUserIds;

  PromoCode({
    required this.id,
    required this.code,
    required this.discountType,
    required this.discountValue,
    required this.maxUses,
    required this.currentUses,
    required this.validFrom,
    required this.validUntil,
    required this.isActive,
    this.creatorId,
    this.description,
    required this.createdAt,
    required this.usedByUserIds,
  });

  /// Crea PromoCode da Firestore document
  factory PromoCode.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    return PromoCode(
      id: doc.id,
      code: data['code'] ?? '',
      discountType: data['discountType'] == 'percentage'
          ? DiscountType.percentage
          : DiscountType.fixed,
      discountValue: (data['discountValue'] ?? 0).toDouble(),
      maxUses: data['maxUses'] ?? 0,
      currentUses: data['currentUses'] ?? 0,
      validFrom: data['validFrom'] != null
          ? (data['validFrom'] as Timestamp).toDate()
          : DateTime.now(),
      validUntil: data['validUntil'] != null
          ? (data['validUntil'] as Timestamp).toDate()
          : DateTime.now().add(const Duration(days: 365)),
      isActive: data['isActive'] ?? false,
      creatorId: data['creatorId'],
      description: data['description'],
      createdAt: data['createdAt'] != null
          ? (data['createdAt'] as Timestamp).toDate()
          : DateTime.now(),
      usedByUserIds: List<String>.from(data['usedByUserIds'] ?? []),
    );
  }

  /// Converte PromoCode in Map per Firestore
  Map<String, dynamic> toFirestore() {
    return {
      'code': code,
      'discountType': discountType == DiscountType.percentage
          ? 'percentage'
          : 'fixed',
      'discountValue': discountValue,
      'maxUses': maxUses,
      'currentUses': currentUses,
      'validFrom': Timestamp.fromDate(validFrom),
      'validUntil': Timestamp.fromDate(validUntil),
      'isActive': isActive,
      'creatorId': creatorId,
      'description': description,
      'createdAt': Timestamp.fromDate(createdAt),
      'usedByUserIds': usedByUserIds,
    };
  }

  /// Verifica se il codice è valido per l'utente
  bool isValidForUser(String userId) {
    final now = DateTime.now();

    // Codice non attivo
    if (!isActive) return false;

    // Limite utilizzi raggiunto
    if (currentUses >= maxUses) return false;

    // Non ancora valido
    if (now.isBefore(validFrom)) return false;

    // Scaduto
    if (now.isAfter(validUntil)) return false;

    // Utente ha già usato questo codice
    if (usedByUserIds.contains(userId)) return false;

    return true;
  }

  /// Calcola il prezzo scontato
  double applyDiscount(double originalPrice) {
    if (discountType == DiscountType.percentage) {
      return originalPrice * (1 - discountValue / 100);
    } else {
      return (originalPrice - discountValue).clamp(0, originalPrice);
    }
  }

  /// Ritorna il testo dello sconto
  String get discountText {
    if (discountType == DiscountType.percentage) {
      return '${discountValue.toStringAsFixed(0)}% di sconto';
    } else {
      return '€${discountValue.toStringAsFixed(2)} di sconto';
    }
  }

  /// Ritorna il motivo per cui il codice non è valido
  String? getInvalidReason(String userId) {
    if (!isActive) return 'Codice non attivo';
    if (currentUses >= maxUses) return 'Codice esaurito';
    if (DateTime.now().isBefore(validFrom)) return 'Codice non ancora valido';
    if (DateTime.now().isAfter(validUntil)) return 'Codice scaduto';
    if (usedByUserIds.contains(userId)) return 'Hai già usato questo codice';
    return null;
  }
}
