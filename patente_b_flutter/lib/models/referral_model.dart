import 'package:cloud_firestore/cloud_firestore.dart';

/// Stati possibili di un referral
enum ReferralStatus {
  pending, // Utente si è registrato ma non ha ancora pagato
  active, // Utente ha un abbonamento attivo
  canceled, // Utente ha cancellato l'abbonamento
  completed, // 12 mesi di commissioni completati
}

/// Modello per tracciare i referral dei creator
class Referral {
  final String id;
  final String creatorId;
  final String userId;
  final String referralCode;
  final String? subscriptionId;
  final ReferralStatus status;
  final DateTime dateReferred;
  final DateTime? dateConverted;
  final DateTime? dateCanceled;
  final double monthlyCommission; // Tipicamente €6
  final double totalPaid;
  final int monthsPaid; // 0-12
  final bool isPaidThisMonth;

  Referral({
    required this.id,
    required this.creatorId,
    required this.userId,
    required this.referralCode,
    this.subscriptionId,
    required this.status,
    required this.dateReferred,
    this.dateConverted,
    this.dateCanceled,
    this.monthlyCommission = 6.0,
    this.totalPaid = 0,
    this.monthsPaid = 0,
    this.isPaidThisMonth = false,
  });

  /// Crea Referral da Firestore document
  factory Referral.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    return Referral(
      id: doc.id,
      creatorId: data['creatorId'] ?? '',
      userId: data['userId'] ?? '',
      referralCode: data['referralCode'] ?? '',
      subscriptionId: data['subscriptionId'],
      status: _parseStatus(data['status']),
      dateReferred: data['dateReferred'] != null
          ? (data['dateReferred'] as Timestamp).toDate()
          : DateTime.now(),
      dateConverted: data['dateConverted'] != null
          ? (data['dateConverted'] as Timestamp).toDate()
          : null,
      dateCanceled: data['dateCanceled'] != null
          ? (data['dateCanceled'] as Timestamp).toDate()
          : null,
      monthlyCommission: (data['monthlyCommission'] ?? 6.0).toDouble(),
      totalPaid: (data['totalPaid'] ?? 0).toDouble(),
      monthsPaid: data['monthsPaid'] ?? 0,
      isPaidThisMonth: data['isPaidThisMonth'] ?? false,
    );
  }

  /// Converte Referral in Map per Firestore
  Map<String, dynamic> toFirestore() {
    return {
      'creatorId': creatorId,
      'userId': userId,
      'referralCode': referralCode,
      'subscriptionId': subscriptionId,
      'status': status.name,
      'dateReferred': Timestamp.fromDate(dateReferred),
      'dateConverted': dateConverted != null
          ? Timestamp.fromDate(dateConverted!)
          : null,
      'dateCanceled': dateCanceled != null
          ? Timestamp.fromDate(dateCanceled!)
          : null,
      'monthlyCommission': monthlyCommission,
      'totalPaid': totalPaid,
      'monthsPaid': monthsPaid,
      'isPaidThisMonth': isPaidThisMonth,
    };
  }

  /// Parse lo status da stringa
  static ReferralStatus _parseStatus(String? status) {
    switch (status?.toLowerCase()) {
      case 'pending':
        return ReferralStatus.pending;
      case 'active':
        return ReferralStatus.active;
      case 'canceled':
        return ReferralStatus.canceled;
      case 'completed':
        return ReferralStatus.completed;
      default:
        return ReferralStatus.pending;
    }
  }

  /// Controlla se il referral è attivo
  bool get isActive => status == ReferralStatus.active;

  /// Controlla se il referral genera ancora commissioni
  bool get isEarning {
    return status == ReferralStatus.active && monthsPaid < 12;
  }

  /// Mesi rimanenti di commissioni
  int get monthsRemaining => 12 - monthsPaid;

  /// Guadagni potenziali rimanenti
  double get potentialEarnings => monthsRemaining * monthlyCommission;

  /// Testo dello status
  String get statusText {
    switch (status) {
      case ReferralStatus.pending:
        return 'In attesa';
      case ReferralStatus.active:
        return 'Attivo';
      case ReferralStatus.canceled:
        return 'Cancellato';
      case ReferralStatus.completed:
        return 'Completato';
    }
  }

  /// Colore dello status
  String get statusColor {
    switch (status) {
      case ReferralStatus.pending:
        return 'orange';
      case ReferralStatus.active:
        return 'green';
      case ReferralStatus.canceled:
        return 'red';
      case ReferralStatus.completed:
        return 'blue';
    }
  }
}
