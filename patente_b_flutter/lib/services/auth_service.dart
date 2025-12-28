import 'package:flutter/foundation.dart';
import 'dart:async';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'security_service.dart';

/// Service to handle Firebase Authentication
class AuthService {
  static final AuthService _instance = AuthService._internal();
  factory AuthService() => _instance;
  AuthService._internal();

  final FirebaseAuth _auth = FirebaseAuth.instance;
  final GoogleSignIn _googleSignIn = GoogleSignIn();
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  final SecurityService _securityService = SecurityService();

  String? _deviceFingerprint;
  String? get deviceFingerprint => _deviceFingerprint;

  /// Stream of authentication state changes
  Stream<User?> get authStateChanges => _auth.authStateChanges();

  /// Get current user
  User? get currentUser => _auth.currentUser;

  /// Check if user is logged in
  bool get isLoggedIn => currentUser != null;

  /// Sign in with Email and Password
  Future<UserCredential> signInWithEmailPassword(
    String email,
    String password,
  ) async {
    try {
      final userCredential = await _auth.signInWithEmailAndPassword(
        email: email.trim(),
        password: password,
      );

      // Controllo Sicurezza post-login
      await _performSecurityPostLogin(userCredential.user!.uid);

      debugPrint('✅ Signed in as: ${userCredential.user?.email}');

      // Update last login
      await _updateLastLogin(userCredential.user!.uid);

      return userCredential;
    } on FirebaseAuthException catch (e) {
      debugPrint('❌ Email sign in failed: ${e.code}');
      throw _getReadableError(e.code);
    }
  }

  /// Esegue i controlli di sicurezza post-login
  Future<void> _performSecurityPostLogin(String userId) async {
    final token = await currentUser!.getIdToken();
    final status = await _securityService.performAppStartCheck(userId, token!);

    if (!status.allowed) {
      await signOut();
      throw status.reason ?? 'security_blocked';
    }

    _deviceFingerprint = status.deviceFingerprint;
  }

  /// Sign up with Email and Password
  Future<UserCredential> signUpWithEmailPassword({
    required String email,
    required String password,
    required String displayName,
    String? referralCode,
    String? promoCode,
  }) async {
    try {
      final userCredential = await _auth.createUserWithEmailAndPassword(
        email: email.trim(),
        password: password,
      );

      // Update display name
      await userCredential.user?.updateDisplayName(displayName);
      await userCredential.user?.reload();

      // Create user document in Firestore
      await _createUserDocument(
        userCredential.user!,
        displayName: displayName,
        referralCode: referralCode,
        promoCode: promoCode,
      );

      debugPrint('✅ Created account for: $displayName');
      return userCredential;
    } on FirebaseAuthException catch (e) {
      debugPrint('❌ Sign up failed: ${e.code}');
      throw _getReadableError(e.code);
    }
  }

  /// Send password reset email
  Future<void> sendPasswordResetEmail(String email) async {
    try {
      await _auth.sendPasswordResetEmail(email: email.trim());
      debugPrint('✅ Password reset email sent to: $email');
    } on FirebaseAuthException catch (e) {
      debugPrint('❌ Password reset failed: ${e.code}');
      throw _getReadableError(e.code);
    }
  }

  /// Update user profile
  Future<void> updateUserProfile({
    String? displayName,
    String? photoURL,
  }) async {
    try {
      if (displayName != null) {
        await currentUser?.updateDisplayName(displayName);
      }
      if (photoURL != null) {
        await currentUser?.updatePhotoURL(photoURL);
      }
      await currentUser?.reload();
      debugPrint('✅ Profile updated');
    } catch (e) {
      debugPrint('❌ Profile update failed: $e');
      rethrow;
    }
  }

  /// Sign in with Google
  Future<UserCredential?> signInWithGoogle() async {
    try {
      // Trigger the Google Sign In flow
      final GoogleSignInAccount? googleUser = await _googleSignIn.signIn();

      if (googleUser == null) {
        // User cancelled sign in
        return null;
      }

      // Obtain auth details from the request
      final GoogleSignInAuthentication googleAuth =
          await googleUser.authentication;

      // Create a new credential
      final credential = GoogleAuthProvider.credential(
        accessToken: googleAuth.accessToken,
        idToken: googleAuth.idToken,
      );

      // Sign in to Firebase with the Google credential
      final userCredential = await _auth.signInWithCredential(credential);
      debugPrint('✅ Signed in as: ${userCredential.user?.displayName}');

      // Create or update user document
      await _createUserDocument(userCredential.user!);

      return userCredential;
    } catch (e) {
      debugPrint('❌ Google sign in failed: $e');
      rethrow;
    }
  }

  /// Sign in anonymously (Guest mode)
  Future<UserCredential> signInAnonymously() async {
    try {
      final userCredential = await _auth.signInAnonymously();
      debugPrint('✅ Signed in anonymously');
      return userCredential;
    } catch (e) {
      debugPrint('❌ Anonymous sign in failed: $e');
      rethrow;
    }
  }

  /// Sign out
  Future<void> signOut() async {
    try {
      await Future.wait([_auth.signOut(), _googleSignIn.signOut()]);
      debugPrint('✅ Signed out successfully');
    } catch (e) {
      debugPrint('❌ Sign out failed: $e');
      rethrow;
    }
  }

  /// Get user display name
  String get displayName => currentUser?.displayName ?? 'Ospite';

  /// Get user email
  String? get email => currentUser?.email;

  /// Get user photo URL
  String? get photoURL => currentUser?.photoURL;

  /// Check if user is anonymous
  bool get isAnonymous => currentUser?.isAnonymous ?? false;

  // ===== PRIVATE HELPER METHODS =====

  /// Create or update user document in Firestore
  Future<void> _createUserDocument(
    User user, {
    String? displayName,
    String? referralCode,
    String? promoCode,
  }) async {
    final userDoc = _firestore.collection('users').doc(user.uid);
    final docSnapshot = await userDoc.get();

    if (!docSnapshot.exists) {
      // Create new user document
      await userDoc.set({
        'uid': user.uid,
        'email': user.email,
        'displayName': displayName ?? user.displayName ?? 'Utente',
        'photoUrl': user.photoURL,
        'createdAt': FieldValue.serverTimestamp(),
        'lastLogin': FieldValue.serverTimestamp(),
        'isPremium': false,
        'premiumExpiresAt': null,
        'referredBy': referralCode,
        'usedPromoCode': promoCode,
        'stripeCustomerId': null,
        'stripeSubscriptionId': null,
      });
      debugPrint('✅ Created user document for: ${user.uid}');
    } else {
      // Update last login
      await _updateLastLogin(user.uid);
    }
  }

  /// Update last login timestamp
  Future<void> _updateLastLogin(String uid) async {
    await _firestore.collection('users').doc(uid).update({
      'lastLogin': FieldValue.serverTimestamp(),
    });
  }

  /// Convert Firebase error codes to Italian messages
  String _getReadableError(String code) {
    switch (code) {
      case 'invalid-email':
        return 'Formato email non valido';
      case 'user-disabled':
        return 'Questo account è stato disabilitato';
      case 'user-not-found':
        return 'Nessun account trovato con questa email';
      case 'wrong-password':
        return 'Password non corretta';
      case 'email-already-in-use':
        return 'Esiste già un account con questa email';
      case 'weak-password':
        return 'La password deve avere almeno 6 caratteri';
      case 'operation-not-allowed':
        return 'Operazione non consentita';
      case 'too-many-requests':
        return 'Troppi tentativi. Riprova tra qualche minuto';
      case 'invalid-credential':
        return 'Credenziali non valide';
      default:
        return 'Si è verificato un errore. Riprova';
    }
  }
}
