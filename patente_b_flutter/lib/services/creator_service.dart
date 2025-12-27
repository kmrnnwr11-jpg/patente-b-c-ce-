import 'dart:math';
import 'package:flutter/foundation.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/creator_model.dart';
import '../models/referral_model.dart';

/// Service per gestire il sistema Creator/Referral
class CreatorService {
  static final CreatorService _instance = CreatorService._internal();
  factory CreatorService() => _instance;
  CreatorService._internal();

  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  // Chiave per salvare referral code pendente in local storage
  static const String _pendingReferralKey = 'pending_referral_code';

  /// Genera un codice referral univoco
  String generateReferralCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    final random = Random.secure();
    return String.fromCharCodes(
      Iterable.generate(
        6,
        (_) => chars.codeUnitAt(random.nextInt(chars.length)),
      ),
    );
  }

  /// Registra un nuovo creator
  Future<Creator?> registerAsCreator({
    required String userId,
    required Map<String, String?> socialLinks,
  }) async {
    try {
      // Verifica se l'utente è già un creator
      final existingCreator = await getCreatorByUserId(userId);
      if (existingCreator != null) {
        return existingCreator;
      }

      // Genera codice univoco
      String referralCode;
      bool isUnique = false;
      do {
        referralCode = generateReferralCode();
        final existing = await getCreatorByReferralCode(referralCode);
        isUnique = existing == null;
      } while (!isUnique);

      // Crea documento creator
      final creator = Creator(
        id: '',
        userId: userId,
        referralCode: referralCode,
        socialLinks: socialLinks,
        createdAt: DateTime.now(),
      );

      final docRef = await _firestore
          .collection('creators')
          .add(creator.toFirestore());

      debugPrint('✅ Creator registered: $referralCode');

      return Creator(
        id: docRef.id,
        userId: userId,
        referralCode: referralCode,
        socialLinks: socialLinks,
        createdAt: DateTime.now(),
      );
    } catch (e) {
      debugPrint('❌ Error registering creator: $e');
      return null;
    }
  }

  /// Ottiene un creator dal suo userId
  Future<Creator?> getCreatorByUserId(String userId) async {
    try {
      final querySnapshot = await _firestore
          .collection('creators')
          .where('userId', isEqualTo: userId)
          .limit(1)
          .get();

      if (querySnapshot.docs.isEmpty) {
        return null;
      }

      return Creator.fromFirestore(querySnapshot.docs.first);
    } catch (e) {
      debugPrint('❌ Error getting creator: $e');
      return null;
    }
  }

  /// Ottiene un creator dal codice referral
  Future<Creator?> getCreatorByReferralCode(String code) async {
    try {
      final querySnapshot = await _firestore
          .collection('creators')
          .where('referralCode', isEqualTo: code.toUpperCase())
          .limit(1)
          .get();

      if (querySnapshot.docs.isEmpty) {
        return null;
      }

      return Creator.fromFirestore(querySnapshot.docs.first);
    } catch (e) {
      debugPrint('❌ Error getting creator by code: $e');
      return null;
    }
  }

  /// Valida un codice referral
  Future<bool> validateReferralCode(String code) async {
    final creator = await getCreatorByReferralCode(code);
    return creator != null && creator.isActive;
  }

  /// Salva un codice referral pendente (da deep link)
  Future<void> savePendingReferralCode(String code) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(_pendingReferralKey, code.toUpperCase());
      debugPrint('✅ Saved pending referral code: $code');
    } catch (e) {
      debugPrint('❌ Error saving pending referral: $e');
    }
  }

  /// Recupera il codice referral pendente
  Future<String?> getPendingReferralCode() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      return prefs.getString(_pendingReferralKey);
    } catch (e) {
      debugPrint('❌ Error getting pending referral: $e');
      return null;
    }
  }

  /// Pulisce il codice referral pendente
  Future<void> clearPendingReferralCode() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.remove(_pendingReferralKey);
    } catch (e) {
      debugPrint('❌ Error clearing pending referral: $e');
    }
  }

  /// Traccia un nuovo referral quando un utente si registra con un codice
  Future<Referral?> trackReferral({
    required String referralCode,
    required String userId,
  }) async {
    try {
      final creator = await getCreatorByReferralCode(referralCode);
      if (creator == null || !creator.isActive) {
        return null;
      }

      // Verifica che l'utente non sia già stato referenziato
      final existingReferral = await _firestore
          .collection('referrals')
          .where('userId', isEqualTo: userId)
          .limit(1)
          .get();

      if (existingReferral.docs.isNotEmpty) {
        return null;
      }

      // Crea il referral
      final referral = Referral(
        id: '',
        creatorId: creator.id,
        userId: userId,
        referralCode: referralCode,
        status: ReferralStatus.pending,
        dateReferred: DateTime.now(),
      );

      final docRef = await _firestore
          .collection('referrals')
          .add(referral.toFirestore());

      // Aggiorna contatore del creator
      await _firestore.collection('creators').doc(creator.id).update({
        'totalReferrals': FieldValue.increment(1),
      });

      debugPrint('✅ Referral tracked: $userId -> $referralCode');

      // Pulisci il codice pendente
      await clearPendingReferralCode();

      return Referral(
        id: docRef.id,
        creatorId: creator.id,
        userId: userId,
        referralCode: referralCode,
        status: ReferralStatus.pending,
        dateReferred: DateTime.now(),
      );
    } catch (e) {
      debugPrint('❌ Error tracking referral: $e');
      return null;
    }
  }

  /// Ottiene tutti i referral di un creator
  Future<List<Referral>> getCreatorReferrals(String creatorId) async {
    try {
      final querySnapshot = await _firestore
          .collection('referrals')
          .where('creatorId', isEqualTo: creatorId)
          .orderBy('dateReferred', descending: true)
          .get();

      return querySnapshot.docs
          .map((doc) => Referral.fromFirestore(doc))
          .toList();
    } catch (e) {
      debugPrint('❌ Error getting referrals: $e');
      return [];
    }
  }

  /// Stream dei referral per un creator
  Stream<List<Referral>> referralsStream(String creatorId) {
    return _firestore
        .collection('referrals')
        .where('creatorId', isEqualTo: creatorId)
        .orderBy('dateReferred', descending: true)
        .snapshots()
        .map(
          (snapshot) =>
              snapshot.docs.map((doc) => Referral.fromFirestore(doc)).toList(),
        );
  }

  /// Stream del profilo creator
  Stream<Creator?> creatorStream(String userId) {
    return _firestore
        .collection('creators')
        .where('userId', isEqualTo: userId)
        .limit(1)
        .snapshots()
        .map((snapshot) {
          if (snapshot.docs.isEmpty) return null;
          return Creator.fromFirestore(snapshot.docs.first);
        });
  }

  /// Richiedi payout (solo se >= €50)
  Future<bool> requestPayout(String creatorId) async {
    try {
      final creatorDoc = await _firestore
          .collection('creators')
          .doc(creatorId)
          .get();
      if (!creatorDoc.exists) return false;

      final creator = Creator.fromFirestore(creatorDoc);
      if (!creator.canRequestPayout) return false;

      // Crea richiesta di payout
      await _firestore.collection('payoutRequests').add({
        'creatorId': creatorId,
        'amount': creator.pendingPayout,
        'status': 'pending',
        'requestedAt': FieldValue.serverTimestamp(),
      });

      // Reset pending payout
      await _firestore.collection('creators').doc(creatorId).update({
        'pendingPayout': 0,
        'paidOut': FieldValue.increment(creator.pendingPayout),
        'lastPayoutDate': FieldValue.serverTimestamp(),
      });

      debugPrint('✅ Payout requested: €${creator.pendingPayout}');
      return true;
    } catch (e) {
      debugPrint('❌ Error requesting payout: $e');
      return false;
    }
  }
}
