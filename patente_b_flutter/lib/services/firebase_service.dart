import 'package:firebase_core/firebase_core.dart';
import '../firebase_options.dart';

/// Service to initialize and manage Firebase
class FirebaseService {
  static final FirebaseService _instance = FirebaseService._internal();
  factory FirebaseService() => _instance;
  FirebaseService._internal();

  bool _initialized = false;
  bool get isInitialized => _initialized;

  /// Initialize Firebase with the current platform's configuration
  Future<void> initialize() async {
    if (_initialized) return;

    try {
      await Firebase.initializeApp(
        options: DefaultFirebaseOptions.currentPlatform,
      );
      _initialized = true;
      print('✅ Firebase initialized successfully');
    } catch (e) {
      print('❌ Firebase initialization failed: $e');
      rethrow;
    }
  }
}
