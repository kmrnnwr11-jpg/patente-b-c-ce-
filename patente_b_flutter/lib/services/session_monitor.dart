import 'dart:async';
import 'package:flutter/material.dart';
import 'auth_service.dart';
import 'security_service.dart';

class SessionMonitor {
  static final SessionMonitor _instance = SessionMonitor._internal();
  factory SessionMonitor() => _instance;
  SessionMonitor._internal();

  Timer? _timer;
  final AuthService _authService = AuthService();
  final SecurityService _securityService = SecurityService();
  BuildContext? _context;

  /// Avvia il monitoraggio della sessione
  void startMonitoring(BuildContext context) {
    _context = context;
    _timer?.cancel();

    // Controlla ogni 60 secondi
    _timer = Timer.periodic(const Duration(seconds: 60), (_) async {
      await _checkSession();
    });
  }

  /// Ferma il monitoraggio
  void stopMonitoring() {
    _timer?.cancel();
    _timer = null;
  }

  Future<void> _checkSession() async {
    if (!_authService.isLoggedIn) return;

    try {
      final token = await _authService.currentUser?.getIdToken();
      if (token == null) return;

      final fingerprint = await _securityService.getCurrentFingerprint();
      final isValid = await _securityService.isSessionValid(token, fingerprint);

      if (!isValid) {
        _handleInvalidSession();
      }
    } catch (e) {
      debugPrint('Session check error: $e');
    }
  }

  void _handleInvalidSession() {
    if (_context == null) return;

    stopMonitoring();
    _authService.signOut();

    showDialog(
      context: _context!,
      barrierDismissible: false,
      builder: (context) => AlertDialog(
        title: const Text('Accesso da altro dispositivo'),
        content: const Text(
          'Sei stato disconnesso perché è stato effettuato l\'accesso da un altro dispositivo. '
          'Puoi usare l\'app su un solo telefono alla volta.',
        ),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.of(
                context,
              ).pushNamedAndRemoveUntil('/login', (route) => false);
            },
            child: const Text('Accedi di nuovo'),
          ),
        ],
      ),
    );
  }
}
