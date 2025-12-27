import 'dart:async';
import 'package:flutter/material.dart';
import '../models/subscription_model.dart';
import '../models/promo_code_model.dart';
import '../services/subscription_service.dart';

/// Provider per gestire lo stato degli abbonamenti
class SubscriptionProvider extends ChangeNotifier {
  final SubscriptionService _subscriptionService = SubscriptionService();

  Subscription? _subscription;
  PromoCode? _appliedPromoCode;
  bool _isLoading = false;
  String? _error;
  bool _hasReferral = false;
  String? _referralCode;

  // Getters
  Subscription? get subscription => _subscription;
  PromoCode? get appliedPromoCode => _appliedPromoCode;
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get isPremium => _subscription?.isActive ?? false;
  bool get hasReferral => _hasReferral;
  String? get referralCode => _referralCode;

  int get daysRemaining => _subscription?.daysRemaining ?? 0;
  bool get willCancel => _subscription?.cancelAtPeriodEnd ?? false;

  /// Carica lo stato dell'abbonamento per un utente
  Future<void> loadSubscription(String userId) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      _subscription = await _subscriptionService.getSubscription(userId);
    } catch (e) {
      _error = 'Errore nel caricamento dell\'abbonamento';
      debugPrint('❌ Error loading subscription: $e');
    }

    _isLoading = false;
    notifyListeners();
  }

  /// Valida e applica un codice promozionale
  Future<bool> applyPromoCode(String code, String userId) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final promoCode = await _subscriptionService.validatePromoCode(
        code,
        userId,
      );

      if (promoCode != null) {
        _appliedPromoCode = promoCode;
        _isLoading = false;
        notifyListeners();
        return true;
      } else {
        // Ottieni dettagli per messaggio di errore specifico
        final details = await _subscriptionService.getPromoCodeDetails(code);
        if (details == null) {
          _error = 'Codice non trovato';
        } else {
          _error = details.getInvalidReason(userId) ?? 'Codice non valido';
        }
        _isLoading = false;
        notifyListeners();
        return false;
      }
    } catch (e) {
      _error = 'Errore nella validazione del codice';
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  /// Rimuove il codice promozionale applicato
  void removePromoCode() {
    _appliedPromoCode = null;
    notifyListeners();
  }

  /// Imposta il codice referral
  void setReferralCode(String? code) {
    _referralCode = code;
    _hasReferral = code != null && code.isNotEmpty;
    notifyListeners();
  }

  /// Calcola il prezzo finale
  double calculateFinalPrice() {
    const originalPrice = 20.00; // Prezzo Premium mensile
    return _subscriptionService.calculateFinalPrice(
      originalPrice: originalPrice,
      promoCode: _appliedPromoCode,
      hasReferral: _hasReferral,
    );
  }

  /// Inizia il processo di checkout
  Future<Map<String, dynamic>?> startCheckout({
    required String userId,
    required String email,
  }) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final result = await _subscriptionService.createCheckoutSession(
        userId: userId,
        email: email,
        promoCode: _appliedPromoCode?.code,
        referralCode: _referralCode,
      );

      _isLoading = false;
      notifyListeners();
      return result;
    } catch (e) {
      _error = 'Errore nell\'avvio del pagamento';
      _isLoading = false;
      notifyListeners();
      return null;
    }
  }

  /// Annulla l'abbonamento
  Future<bool> cancelSubscription() async {
    if (_subscription == null) return false;

    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final success = await _subscriptionService.cancelSubscription(
        _subscription!.stripeSubscriptionId,
      );

      if (success) {
        // Aggiorna localmente (il webhook aggiornerà Firestore)
        _subscription = Subscription(
          id: _subscription!.id,
          userId: _subscription!.userId,
          stripeSubscriptionId: _subscription!.stripeSubscriptionId,
          stripeCustomerId: _subscription!.stripeCustomerId,
          status: _subscription!.status,
          amount: _subscription!.amount,
          currency: _subscription!.currency,
          currentPeriodStart: _subscription!.currentPeriodStart,
          currentPeriodEnd: _subscription!.currentPeriodEnd,
          cancelAtPeriodEnd: true,
          canceledAt: DateTime.now(),
          promoCodeUsed: _subscription!.promoCodeUsed,
          referralCodeUsed: _subscription!.referralCodeUsed,
          createdAt: _subscription!.createdAt,
          updatedAt: DateTime.now(),
        );
      } else {
        _error = 'Errore nella cancellazione';
      }

      _isLoading = false;
      notifyListeners();
      return success;
    } catch (e) {
      _error = 'Errore nella cancellazione dell\'abbonamento';
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  /// Pulisce l'errore corrente
  void clearError() {
    _error = null;
    notifyListeners();
  }

  /// Reset completo dello stato
  void reset() {
    _subscription = null;
    _appliedPromoCode = null;
    _hasReferral = false;
    _referralCode = null;
    _error = null;
    _isLoading = false;
    notifyListeners();
  }
}
