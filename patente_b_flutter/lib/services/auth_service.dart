import 'dart:async';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:google_sign_in/google_sign_in.dart';

/// Service to handle Firebase Authentication
class AuthService {
  static final AuthService _instance = AuthService._internal();
  factory AuthService() => _instance;
  AuthService._internal();

  final FirebaseAuth _auth = FirebaseAuth.instance;
  final GoogleSignIn _googleSignIn = GoogleSignIn();

  /// Stream of authentication state changes
  Stream<User?> get authStateChanges => _auth.authStateChanges();

  /// Get current user
  User? get currentUser => _auth.currentUser;

  /// Check if user is logged in
  bool get isLoggedIn => currentUser != null;

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
      print('✅ Signed in as: ${userCredential.user?.displayName}');

      return userCredential;
    } catch (e) {
      print('❌ Google sign in failed: $e');
      rethrow;
    }
  }

  /// Sign in anonymously (Guest mode)
  Future<UserCredential> signInAnonymously() async {
    try {
      final userCredential = await _auth.signInAnonymously();
      print('✅ Signed in anonymously');
      return userCredential;
    } catch (e) {
      print('❌ Anonymous sign in failed: $e');
      rethrow;
    }
  }

  /// Sign out
  Future<void> signOut() async {
    try {
      await Future.wait([_auth.signOut(), _googleSignIn.signOut()]);
      print('✅ Signed out successfully');
    } catch (e) {
      print('❌ Sign out failed: $e');
      rethrow;
    }
  }

  /// Get user display name
  String get displayName => currentUser?.displayName ?? 'Guest';

  /// Get user email
  String? get email => currentUser?.email;

  /// Get user photo URL
  String? get photoURL => currentUser?.photoURL;

  /// Check if user is anonymous
  bool get isAnonymous => currentUser?.isAnonymous ?? false;
}
