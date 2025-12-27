import 'package:cloud_firestore/cloud_firestore.dart';

/// Modello per i Creator (affiliati/influencer)
class Creator {
  final String id;
  final String userId;
  final String referralCode;
  final int commissionPercent; // Tipicamente 30%
  final int totalReferrals;
  final int activeSubscriptions;
  final double totalEarnings;
  final double pendingPayout;
  final double paidOut;
  final Map<String, String?> socialLinks;
  final bool isActive;
  final DateTime createdAt;
  final DateTime? lastPayoutDate;

  Creator({
    required this.id,
    required this.userId,
    required this.referralCode,
    this.commissionPercent = 30,
    this.totalReferrals = 0,
    this.activeSubscriptions = 0,
    this.totalEarnings = 0,
    this.pendingPayout = 0,
    this.paidOut = 0,
    required this.socialLinks,
    this.isActive = true,
    required this.createdAt,
    this.lastPayoutDate,
  });

  /// Crea Creator da Firestore document
  factory Creator.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    return Creator(
      id: doc.id,
      userId: data['userId'] ?? '',
      referralCode: data['referralCode'] ?? '',
      commissionPercent: data['commissionPercent'] ?? 30,
      totalReferrals: data['totalReferrals'] ?? 0,
      activeSubscriptions: data['activeSubscriptions'] ?? 0,
      totalEarnings: (data['totalEarnings'] ?? 0).toDouble(),
      pendingPayout: (data['pendingPayout'] ?? 0).toDouble(),
      paidOut: (data['paidOut'] ?? 0).toDouble(),
      socialLinks: Map<String, String?>.from(data['socialLinks'] ?? {}),
      isActive: data['isActive'] ?? true,
      createdAt: data['createdAt'] != null
          ? (data['createdAt'] as Timestamp).toDate()
          : DateTime.now(),
      lastPayoutDate: data['lastPayoutDate'] != null
          ? (data['lastPayoutDate'] as Timestamp).toDate()
          : null,
    );
  }

  /// Converte Creator in Map per Firestore
  Map<String, dynamic> toFirestore() {
    return {
      'userId': userId,
      'referralCode': referralCode,
      'commissionPercent': commissionPercent,
      'totalReferrals': totalReferrals,
      'activeSubscriptions': activeSubscriptions,
      'totalEarnings': totalEarnings,
      'pendingPayout': pendingPayout,
      'paidOut': paidOut,
      'socialLinks': socialLinks,
      'isActive': isActive,
      'createdAt': Timestamp.fromDate(createdAt),
      'lastPayoutDate': lastPayoutDate != null
          ? Timestamp.fromDate(lastPayoutDate!)
          : null,
    };
  }

  /// Calcola la commissione mensile per singolo abbonato
  double get monthlyCommission => 20.0 * commissionPercent / 100; // €6 se 30%

  /// Controlla se può richiedere un payout (minimo €50)
  bool get canRequestPayout => pendingPayout >= 50.0;

  /// Link referral completo
  String get referralLink => 'https://patenteapp.com/ref/$referralCode';
}
