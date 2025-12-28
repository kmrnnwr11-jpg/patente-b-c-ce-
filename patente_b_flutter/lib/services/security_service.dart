import 'dart:convert';
import 'dart:io';
import 'package:crypto/crypto.dart';
import 'package:flutter/services.dart';
import 'package:http/http.dart' as http;
import 'package:package_info_plus/package_info_plus.dart';
import '../models/security_status.dart';

class SecurityService {
  static const _channel = MethodChannel(
    'com.patenteb.patente_b_flutter/security',
  );
  static const String _backendUrl =
      'https://us-central1-patente-b-quiz.cloudfunctions.net';

  // Singleton
  static final SecurityService _instance = SecurityService._internal();
  factory SecurityService() => _instance;
  SecurityService._internal();

  /// Esegue i controlli di sicurezza all'avvio dell'app
  Future<SecurityStatus> performAppStartCheck(
    String userId,
    String token,
  ) async {
    try {
      // 1. Ottieni informazioni dal plugin nativo
      final String apkSignature = await _channel.invokeMethod(
        'getApkSignature',
      );
      final bool isRooted = await _channel.invokeMethod('checkRoot');
      final bool isEmulator = await _channel.invokeMethod('checkEmulator');
      final Map<dynamic, dynamic> nativeDeviceInfo = await _channel
          .invokeMethod('getDeviceInfo');

      // 2. Genera Fingerprint
      final String deviceFingerprint = _generateFingerprint(nativeDeviceInfo);

      // 3. Ottieni info pacchetto
      final packageInfo = await PackageInfo.fromPlatform();

      // 4. Chiama il Backend
      final response = await http.post(
        Uri.parse('$_backendUrl/appStartSecurityCheck'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
        body: json.encode({
          'deviceFingerprint': deviceFingerprint,
          'deviceModel': nativeDeviceInfo['model'],
          'osVersion':
              nativeDeviceInfo['osVersion'] ?? Platform.operatingSystemVersion,
          'appVersion': packageInfo.version,
          'apkSignature': apkSignature,
          'isRooted': isRooted,
          'isEmulator': isEmulator,
        }),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        return SecurityStatus(
          allowed: data['allowed'] ?? false,
          reason: data['reason'],
          isRooted: isRooted,
          isEmulator: isEmulator,
          apkSignature: apkSignature,
          deviceFingerprint: deviceFingerprint,
          serverTime: data['serverTime'] != null
              ? DateTime.parse(data['serverTime'])
              : null,
        );
      } else if (response.statusCode == 403) {
        final data = json.decode(response.body);
        return SecurityStatus(
          allowed: false,
          reason: data['reason'] ?? 'forbidden',
          isRooted: isRooted,
          isEmulator: isEmulator,
        );
      }

      return SecurityStatus(
        allowed: true,
      ); // Fallback se il server non è raggiungibile?
      // In produzione forse meglio block se non risponde.
    } catch (e) {
      print('Security check error: $e');
      return SecurityStatus(allowed: true); // Fallback conservativo
    }
  }

  /// Verifica se la sessione è ancora valida (Single-Device)
  Future<bool> isSessionValid(String token, String deviceFingerprint) async {
    try {
      final response = await http.get(
        Uri.parse(
          '$_backendUrl/checkSession?deviceFingerprint=$deviceFingerprint',
        ),
        headers: {'Authorization': 'Bearer $token'},
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        return data['valid'] ?? false;
      }
      return false;
    } catch (e) {
      return true; // Se c'è errore di rete, non buttiamo fuori l'utente
    }
  }

  /// Genera un hash unico per il dispositivo
  String _generateFingerprint(Map<dynamic, dynamic> info) {
    final String raw =
        '${info['androidId']}-${info['model']}-${info['manufacturer']}';
    final bytes = utf8.encode(raw);
    return sha256.convert(bytes).toString();
  }

  /// Ottiene il fingerprint corrente
  Future<String> getCurrentFingerprint() async {
    final Map<dynamic, dynamic> nativeDeviceInfo = await _channel.invokeMethod(
      'getDeviceInfo',
    );
    return _generateFingerprint(nativeDeviceInfo);
  }
}
