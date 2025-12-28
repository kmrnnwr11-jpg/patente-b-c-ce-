import 'package:flutter/foundation.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:firebase_auth/firebase_auth.dart';
import '../models/subscription_model.dart';
import '../models/promo_code_model.dart';

/// Service per gestire abbonamenti e pagamenti
class SubscriptionService {
  static final SubscriptionService _instance = SubscriptionService._internal();
  factory SubscriptionService() => _instance;
  SubscriptionService._internal();

  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  // URL del backend per Stripe
  // Dopo il deploy, questo sarà: https://us-central1-YOUR-PROJECT.cloudfunctions.net
  // O se usi Firebase Hosting con rewrites: https://patenteapp.com/api
  static const String _backendUrl =
      'https://us-central1-patente-b-quiz.cloudfunctions.net';

  // Prezzo predefinito per l'abbonamento Premium
  static const double defaultPremiumPrice = 20.00;

  // Stripe Price ID per abbonamento Premium (da Stripe Dashboard)
  static const String stripePriceId = 'price_XXXXXXX'; // TODO: Sostituire

  /// Ottiene lo stato dell'abbonamento per un utente
  Future<Subscription?> getSubscription(String userId) async {
    try {
      final querySnapshot = await _firestore
          .collection('subscriptions')
          .where('userId', isEqualTo: userId)
          .where('status', isEqualTo: 'active')
          .orderBy('createdAt', descending: true)
          .limit(1)
          .get();

      if (querySnapshot.docs.isEmpty) {
        return null;
      }

      return Subscription.fromFirestore(querySnapshot.docs.first);
    } catch (e) {
      debugPrint('❌ Error getting subscription: $e');
      return null;
    }
  }

  /// Controlla se l'utente ha un abbonamento attivo
  Future<bool> hasActiveSubscription(String userId) async {
    final subscription = await getSubscription(userId);
    return subscription?.isActive ?? false;
  }

  /// Crea una sessione di checkout Stripe
  /// Richiede un backend per la sicurezza
  Future<Map<String, dynamic>?> createCheckoutSession({
    required String userId,
    required String email,
    String? promoCode,
    String? referralCode,
  }) async {
    try {
      final token = await FirebaseAuth.instance.currentUser?.getIdToken();

      final response = await http.post(
        Uri.parse('$_backendUrl/createCheckoutSession'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode({
          'email': email,
          'priceId': stripePriceId,
          'promoCode': promoCode,
          'referralCode': referralCode,
        }),
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        debugPrint('❌ Error creating checkout session: ${response.body}');
        return null;
      }
    } catch (e) {
      debugPrint('❌ Error creating checkout session: $e');
      return null;
    }
  }

  /// Annulla un abbonamento
  Future<bool> cancelSubscription(String subscriptionId) async {
    try {
      final token = await FirebaseAuth.instance.currentUser?.getIdToken();

      final response = await http.post(
        Uri.parse('$_backendUrl/cancelSubscription'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode({'subscriptionId': subscriptionId}),
      );

      return response.statusCode == 200;
    } catch (e) {
      debugPrint('❌ Error canceling subscription: $e');
      return false;
    }
  }

  /// Riattiva un abbonamento cancellato (prima della scadenza)
  Future<bool> reactivateSubscription(String subscriptionId) async {
    try {
      final response = await http.post(
        Uri.parse('$_backendUrl/reactivate-subscription'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'subscriptionId': subscriptionId}),
      );

      return response.statusCode == 200;
    } catch (e) {
      debugPrint('❌ Error reactivating subscription: $e');
      return false;
    }
  }

  /// Valida un codice promozionale
  Future<PromoCode?> validatePromoCode(String code, String userId) async {
    try {
      final querySnapshot = await _firestore
          .collection('promocodes')
          .where('code', isEqualTo: code.toUpperCase())
          .limit(1)
          .get();

      if (querySnapshot.docs.isEmpty) {
        return null;
      }

      final promoCode = PromoCode.fromFirestore(querySnapshot.docs.first);

      if (!promoCode.isValidForUser(userId)) {
        return null;
      }

      return promoCode;
    } catch (e) {
      debugPrint('❌ Error validating promo code: $e');
      return null;
    }
  }

  /// Ottiene i dettagli di un codice promo (anche se non valido)
  Future<PromoCode?> getPromoCodeDetails(String code) async {
    try {
      final querySnapshot = await _firestore
          .collection('promocodes')
          .where('code', isEqualTo: code.toUpperCase())
          .limit(1)
          .get();

      if (querySnapshot.docs.isEmpty) {
        return null;
      }

      return PromoCode.fromFirestore(querySnapshot.docs.first);
    } catch (e) {
      debugPrint('❌ Error getting promo code: $e');
      return null;
    }
  }

  /// Calcola il prezzo finale con eventuale sconto
  double calculateFinalPrice({
    required double originalPrice,
    PromoCode? promoCode,
    bool hasReferral = false,
  }) {
    double price = originalPrice;

    // Applica sconto referral (20% primo mese)
    if (hasReferral) {
      price *= 0.80;
    }

    // Applica codice promo
    if (promoCode != null) {
      price = promoCode.applyDiscount(price);
    }

    return price;
  }

  /// Stream delle sottoscrizioni per un utente
  Stream<List<Subscription>> subscriptionsStream(String userId) {
    return _firestore
        .collection('subscriptions')
        .where('userId', isEqualTo: userId)
        .orderBy('createdAt', descending: true)
        .snapshots()
        .map(
          (snapshot) => snapshot.docs
              .map((doc) => Subscription.fromFirestore(doc))
              .toList(),
        );
  }
}
