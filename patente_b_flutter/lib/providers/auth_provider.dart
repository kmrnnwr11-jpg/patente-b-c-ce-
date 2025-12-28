import 'dart:async';
import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../services/auth_service.dart';
import '../services/session_monitor.dart';
import '../models/user_model.dart';

/// Provider per gestire lo stato di autenticazione nell'app
class AuthProvider extends ChangeNotifier {
  final AuthService _authService = AuthService();
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  User? _firebaseUser;
  AppUser? _appUser;
  bool _isLoading = true;
  String? _error;
  StreamSubscription<User?>? _authSubscription;

  // Getters
  User? get firebaseUser => _firebaseUser;
  AppUser? get appUser => _appUser;
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get isLoggedIn => _firebaseUser != null && !_firebaseUser!.isAnonymous;
  bool get isAnonymous => _firebaseUser?.isAnonymous ?? false;
  bool get isPremium => _appUser?.isPremiumActive ?? false;
  bool get isAdmin => _appUser?.role == 'admin';
  bool get isCreator => _appUser?.role == 'creator';
  String get userRole => _appUser?.role ?? 'user';
  String get displayName =>
      _appUser?.displayName ?? _firebaseUser?.displayName ?? 'Ospite';

  AuthProvider() {
    _init();
  }

  /// Inizializza il listener per lo stato di autenticazione
  void _init() {
    _authSubscription = _authService.authStateChanges.listen(
      _onAuthStateChanged,
    );
  }

  /// Avvia il monitoraggio della sessione con il contesto
  void startSessionMonitoring(BuildContext context) {
    if (isLoggedIn) {
      SessionMonitor().startMonitoring(context);
    }
  }

  /// Callback quando lo stato di autenticazione cambia
  Future<void> _onAuthStateChanged(User? user) async {
    _firebaseUser = user;

    if (user != null && !user.isAnonymous) {
      // Carica dati utente da Firestore
      await _loadUserData(user.uid);
    } else {
      _appUser = null;
      SessionMonitor().stopMonitoring();
    }

    _isLoading = false;
    notifyListeners();
  }

  /// Carica i dati utente da Firestore
  Future<void> _loadUserData(String uid) async {
    try {
      final doc = await _firestore.collection('users').doc(uid).get();
      if (doc.exists) {
        _appUser = AppUser.fromFirestore(doc);
      }
    } catch (e) {
      debugPrint('❌ Failed to load user data: $e');
    }
  }

  /// Ricarica i dati utente
  Future<void> refreshUserData() async {
    if (_firebaseUser != null) {
      await _loadUserData(_firebaseUser!.uid);
      notifyListeners();
    }
  }

  /// Login con Email e Password
  Future<bool> signInWithEmailPassword(String email, String password) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      await _authService.signInWithEmailPassword(email, password);
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  /// Registrazione con Email e Password
  Future<bool> signUpWithEmailPassword({
    required String email,
    required String password,
    required String displayName,
    String? referralCode,
    String? promoCode,
  }) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      await _authService.signUpWithEmailPassword(
        email: email,
        password: password,
        displayName: displayName,
        referralCode: referralCode,
        promoCode: promoCode,
      );
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  /// Login con Google
  Future<bool> signInWithGoogle() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final result = await _authService.signInWithGoogle();
      _isLoading = false;
      notifyListeners();
      return result != null;
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  /// Invia email per reset password
  Future<bool> sendPasswordResetEmail(String email) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      await _authService.sendPasswordResetEmail(email);
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  /// Accesso anonimo (guest mode)
  Future<bool> signInAnonymously() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      await _authService.signInAnonymously();
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  /// Logout
  Future<void> signOut() async {
    _isLoading = true;
    notifyListeners();

    try {
      await _authService.signOut();
      _appUser = null;
    } catch (e) {
      _error = e.toString();
    }

    _isLoading = false;
    notifyListeners();
  }

  /// Pulisce l'errore corrente
  void clearError() {
    _error = null;
    notifyListeners();
  }

  @override
  void dispose() {
    _authSubscription?.cancel();
    super.dispose();
  }
}
