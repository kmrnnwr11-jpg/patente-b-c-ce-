import 'package:cloud_firestore/cloud_firestore.dart';

/// Stati possibili di un abbonamento
enum SubscriptionStatus { active, pastDue, canceled, incomplete, trialing }

/// Modello per gli abbonamenti utente
class Subscription {
  final String id;
  final String userId;
  final String stripeSubscriptionId;
  final String stripeCustomerId;
  final SubscriptionStatus status;
  final double amount;
  final String currency;
  final DateTime currentPeriodStart;
  final DateTime currentPeriodEnd;
  final bool cancelAtPeriodEnd;
  final DateTime? canceledAt;
  final String? promoCodeUsed;
  final String? referralCodeUsed;
  final DateTime createdAt;
  final DateTime updatedAt;

  Subscription({
    required this.id,
    required this.userId,
    required this.stripeSubscriptionId,
    required this.stripeCustomerId,
    required this.status,
    required this.amount,
    required this.currency,
    required this.currentPeriodStart,
    required this.currentPeriodEnd,
    this.cancelAtPeriodEnd = false,
    this.canceledAt,
    this.promoCodeUsed,
    this.referralCodeUsed,
    required this.createdAt,
    required this.updatedAt,
  });

  /// Crea Subscription da Firestore document
  factory Subscription.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    return Subscription(
      id: doc.id,
      userId: data['userId'] ?? '',
      stripeSubscriptionId: data['stripeSubscriptionId'] ?? '',
      stripeCustomerId: data['stripeCustomerId'] ?? '',
      status: _parseStatus(data['status']),
      amount: (data['amount'] ?? 0).toDouble(),
      currency: data['currency'] ?? 'EUR',
      currentPeriodStart: data['currentPeriodStart'] != null
          ? (data['currentPeriodStart'] as Timestamp).toDate()
          : DateTime.now(),
      currentPeriodEnd: data['currentPeriodEnd'] != null
          ? (data['currentPeriodEnd'] as Timestamp).toDate()
          : DateTime.now(),
      cancelAtPeriodEnd: data['cancelAtPeriodEnd'] ?? false,
      canceledAt: data['canceledAt'] != null
          ? (data['canceledAt'] as Timestamp).toDate()
          : null,
      promoCodeUsed: data['promoCodeUsed'],
      referralCodeUsed: data['referralCodeUsed'],
      createdAt: data['createdAt'] != null
          ? (data['createdAt'] as Timestamp).toDate()
          : DateTime.now(),
      updatedAt: data['updatedAt'] != null
          ? (data['updatedAt'] as Timestamp).toDate()
          : DateTime.now(),
    );
  }

  /// Converte Subscription in Map per Firestore
  Map<String, dynamic> toFirestore() {
    return {
      'userId': userId,
      'stripeSubscriptionId': stripeSubscriptionId,
      'stripeCustomerId': stripeCustomerId,
      'status': status.name,
      'amount': amount,
      'currency': currency,
      'currentPeriodStart': Timestamp.fromDate(currentPeriodStart),
      'currentPeriodEnd': Timestamp.fromDate(currentPeriodEnd),
      'cancelAtPeriodEnd': cancelAtPeriodEnd,
      'canceledAt': canceledAt != null ? Timestamp.fromDate(canceledAt!) : null,
      'promoCodeUsed': promoCodeUsed,
      'referralCodeUsed': referralCodeUsed,
      'createdAt': Timestamp.fromDate(createdAt),
      'updatedAt': Timestamp.fromDate(updatedAt),
    };
  }

  /// Controlla se l'abbonamento è attualmente attivo
  bool get isActive {
    return status == SubscriptionStatus.active &&
        currentPeriodEnd.isAfter(DateTime.now());
  }

  /// Giorni rimanenti nell'abbonamento
  int get daysRemaining {
    final diff = currentPeriodEnd.difference(DateTime.now());
    return diff.isNegative ? 0 : diff.inDays;
  }

  /// Parse lo status da stringa
  static SubscriptionStatus _parseStatus(String? status) {
    switch (status?.toLowerCase()) {
      case 'active':
        return SubscriptionStatus.active;
      case 'past_due':
      case 'pastdue':
        return SubscriptionStatus.pastDue;
      case 'canceled':
        return SubscriptionStatus.canceled;
      case 'incomplete':
        return SubscriptionStatus.incomplete;
      case 'trialing':
        return SubscriptionStatus.trialing;
      default:
        return SubscriptionStatus.incomplete;
    }
  }

  /// Ritorna stringa leggibile dello status
  String get statusText {
    switch (status) {
      case SubscriptionStatus.active:
        return 'Attivo';
      case SubscriptionStatus.pastDue:
        return 'Pagamento in ritardo';
      case SubscriptionStatus.canceled:
        return 'Cancellato';
      case SubscriptionStatus.incomplete:
        return 'Incompleto';
      case SubscriptionStatus.trialing:
        return 'Periodo di prova';
    }
  }
}

/// Piano di abbonamento disponibile
class SubscriptionPlan {
  final String id;
  final String name;
  final String description;
  final double price;
  final String currency;
  final String interval; // month, year
  final List<String> features;
  final String stripePriceId;
  final bool isPopular;

  const SubscriptionPlan({
    required this.id,
    required this.name,
    required this.description,
    required this.price,
    this.currency = 'EUR',
    required this.interval,
    required this.features,
    required this.stripePriceId,
    this.isPopular = false,
  });

  /// Piano Premium mensile predefinito
  static const SubscriptionPlan premiumMonthly = SubscriptionPlan(
    id: 'premium_monthly',
    name: 'Premium',
    description: 'Accesso completo a tutte le funzionalità',
    price: 20.00,
    currency: 'EUR',
    interval: 'month',
    stripePriceId: 'price_XXXXXXX', // Da sostituire con ID reale
    isPopular: true,
    features: [
      'Quiz illimitati',
      'Tutte le lezioni di teoria',
      'Simulazioni esame complete',
      'Statistiche avanzate',
      'Supporto prioritario',
      'Nessuna pubblicità',
      'Modalità offline',
      'Audio in più lingue',
    ],
  );

  String get priceText =>
      '€${price.toStringAsFixed(2)}/${interval == 'month' ? 'mese' : 'anno'}';
}
