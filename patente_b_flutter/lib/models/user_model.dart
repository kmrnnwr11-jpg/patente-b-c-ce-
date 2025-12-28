import 'package:cloud_firestore/cloud_firestore.dart';

/// Modello utente per l'app Patente B
class AppUser {
  final String uid;
  final String email;
  final String? displayName;
  final String? photoUrl;
  final bool isPremium;
  final DateTime? premiumExpiresAt;
  final String? referredBy;
  final String? usedPromoCode;
  final String? stripeCustomerId;
  final String? stripeSubscriptionId;
  final DateTime createdAt;
  final DateTime lastLogin;
  final String role; // 'user', 'creator', 'admin'

  // Gamification Fields
  final int totalXp;
  final int currentLevel;
  final int currentStreak;
  final int longestStreak;
  final DateTime? lastActivityDate;
  final int streakFreezeAvailable;

  // Referral Fields
  final String? referralCode;
  final int referralCount;
  final int referralRewardsEarned; // Giorni premium guadagnati

  AppUser({
    required this.uid,
    required this.email,
    this.displayName,
    this.photoUrl,
    this.isPremium = false,
    this.premiumExpiresAt,
    this.referredBy,
    this.usedPromoCode,
    this.stripeCustomerId,
    this.stripeSubscriptionId,
    required this.createdAt,
    required this.lastLogin,
    this.role = 'user',

    // Defaults
    this.totalXp = 0,
    this.currentLevel = 1,
    this.currentStreak = 0,
    this.longestStreak = 0,
    this.lastActivityDate,
    this.streakFreezeAvailable = 0,
    this.referralCode,
    this.referralCount = 0,
    this.referralRewardsEarned = 0,
  });

  /// Crea AppUser da Firestore document
  factory AppUser.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    return AppUser(
      uid: data['uid'] ?? doc.id,
      email: data['email'] ?? '',
      displayName: data['displayName'],
      photoUrl: data['photoUrl'],
      isPremium: data['isPremium'] ?? false,
      premiumExpiresAt: data['premiumExpiresAt'] != null
          ? (data['premiumExpiresAt'] as Timestamp).toDate()
          : null,
      referredBy: data['referredBy'],
      usedPromoCode: data['usedPromoCode'],
      stripeCustomerId: data['stripeCustomerId'],
      stripeSubscriptionId: data['stripeSubscriptionId'],
      createdAt: data['createdAt'] != null
          ? (data['createdAt'] as Timestamp).toDate()
          : DateTime.now(),
      lastLogin: data['lastLogin'] != null
          ? (data['lastLogin'] as Timestamp).toDate()
          : DateTime.now(),
      role: data['role'] ?? 'user',

      // Load Gamification
      totalXp: data['totalXp'] ?? 0,
      currentLevel: data['currentLevel'] ?? 1,
      currentStreak: data['currentStreak'] ?? 0,
      longestStreak: data['longestStreak'] ?? 0,
      lastActivityDate: data['lastActivityDate'] != null
          ? (data['lastActivityDate'] as Timestamp).toDate()
          : null,
      streakFreezeAvailable: data['streakFreezeAvailable'] ?? 0,
      referralCode: data['referralCode'],
      referralCount: data['referralCount'] ?? 0,
      referralRewardsEarned: data['referralRewardsEarned'] ?? 0,
    );
  }

  /// Converte AppUser in Map per Firestore
  Map<String, dynamic> toFirestore() {
    return {
      'uid': uid,
      'email': email,
      'displayName': displayName,
      'photoUrl': photoUrl,
      'isPremium': isPremium,
      'premiumExpiresAt': premiumExpiresAt != null
          ? Timestamp.fromDate(premiumExpiresAt!)
          : null,
      'referredBy': referredBy,
      'usedPromoCode': usedPromoCode,
      'stripeCustomerId': stripeCustomerId,
      'stripeSubscriptionId': stripeSubscriptionId,
      'createdAt': Timestamp.fromDate(createdAt),
      'lastLogin': Timestamp.fromDate(lastLogin),
      'role': role,

      // Save Gamification
      'totalXp': totalXp,
      'currentLevel': currentLevel,
      'currentStreak': currentStreak,
      'longestStreak': longestStreak,
      'lastActivityDate': lastActivityDate != null
          ? Timestamp.fromDate(lastActivityDate!)
          : null,
      'streakFreezeAvailable': streakFreezeAvailable,
      'referralCode': referralCode,
      'referralCount': referralCount,
      'referralRewardsEarned': referralRewardsEarned,
    };
  }

  /// Controlla se l'abbonamento premium è ancora valido
  bool get isPremiumActive {
    if (!isPremium) return false;
    if (premiumExpiresAt == null) return false;
    return premiumExpiresAt!.isAfter(DateTime.now());
  }

  /// Copia con modifiche
  AppUser copyWith({
    String? uid,
    String? email,
    String? displayName,
    String? photoUrl,
    bool? isPremium,
    DateTime? premiumExpiresAt,
    String? referredBy,
    String? usedPromoCode,
    String? stripeCustomerId,
    String? stripeSubscriptionId,
    DateTime? createdAt,
    DateTime? lastLogin,
    String? role,

    // Gamification
    int? totalXp,
    int? currentLevel,
    int? currentStreak,
    int? longestStreak,
    DateTime? lastActivityDate,
    int? streakFreezeAvailable,
    String? referralCode,
    int? referralCount,
    int? referralRewardsEarned,
  }) {
    return AppUser(
      uid: uid ?? this.uid,
      email: email ?? this.email,
      displayName: displayName ?? this.displayName,
      photoUrl: photoUrl ?? this.photoUrl,
      isPremium: isPremium ?? this.isPremium,
      premiumExpiresAt: premiumExpiresAt ?? this.premiumExpiresAt,
      referredBy: referredBy ?? this.referredBy,
      usedPromoCode: usedPromoCode ?? this.usedPromoCode,
      stripeCustomerId: stripeCustomerId ?? this.stripeCustomerId,
      stripeSubscriptionId: stripeSubscriptionId ?? this.stripeSubscriptionId,
      createdAt: createdAt ?? this.createdAt,
      lastLogin: lastLogin ?? this.lastLogin,
      role: role ?? this.role,

      // Gamification
      totalXp: totalXp ?? this.totalXp,
      currentLevel: currentLevel ?? this.currentLevel,
      currentStreak: currentStreak ?? this.currentStreak,
      longestStreak: longestStreak ?? this.longestStreak,
      lastActivityDate: lastActivityDate ?? this.lastActivityDate,
      streakFreezeAvailable:
          streakFreezeAvailable ?? this.streakFreezeAvailable,
      referralCode: referralCode ?? this.referralCode,
      referralCount: referralCount ?? this.referralCount,
      referralRewardsEarned:
          referralRewardsEarned ?? this.referralRewardsEarned,
    );
  }
}
