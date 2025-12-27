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
    );
  }
}
