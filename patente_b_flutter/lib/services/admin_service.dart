import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'package:firebase_auth/firebase_auth.dart';

/// Service per le operazioni Admin
class AdminService {
  static final AdminService _instance = AdminService._internal();
  factory AdminService() => _instance;
  AdminService._internal();

  static const String _backendUrl =
      'https://us-central1-patente-b-quiz.cloudfunctions.net';

  /// Ottiene il token di autenticazione
  Future<String?> _getAuthToken() async {
    return await FirebaseAuth.instance.currentUser?.getIdToken();
  }

  /// Header standard per le richieste admin
  Future<Map<String, String>> _getHeaders() async {
    final token = await _getAuthToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer $token',
    };
  }

  /// Promuove un utente a Creator
  Future<Map<String, dynamic>?> promoteToCreator({
    required String userId,
    required String referralCode,
    Map<String, String>? socialLinks,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$_backendUrl/promoteToCreator'),
        headers: await _getHeaders(),
        body: jsonEncode({
          'userId': userId,
          'referralCode': referralCode,
          'socialLinks': socialLinks ?? {},
        }),
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        final error = jsonDecode(response.body);
        throw Exception(error['error'] ?? 'Failed to promote user');
      }
    } catch (e) {
      debugPrint('❌ Error promoting to creator: $e');
      rethrow;
    }
  }

  /// Ottiene la lista di tutti i Creator
  Future<List<Map<String, dynamic>>> getCreators() async {
    try {
      final response = await http.get(
        Uri.parse('$_backendUrl/getCreators'),
        headers: await _getHeaders(),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return List<Map<String, dynamic>>.from(data['creators'] ?? []);
      } else {
        throw Exception('Failed to get creators');
      }
    } catch (e) {
      debugPrint('❌ Error getting creators: $e');
      return [];
    }
  }

  /// Revoca il ruolo Creator
  Future<bool> revokeCreator(String creatorId) async {
    try {
      final response = await http.post(
        Uri.parse('$_backendUrl/revokeCreator'),
        headers: await _getHeaders(),
        body: jsonEncode({'creatorId': creatorId}),
      );

      return response.statusCode == 200;
    } catch (e) {
      debugPrint('❌ Error revoking creator: $e');
      return false;
    }
  }

  /// Crea un nuovo Promo Code
  Future<Map<String, dynamic>?> createPromoCode({
    required String code,
    required String discountType,
    required double discountValue,
    int? maxUses,
    DateTime? expiresAt,
    String? description,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$_backendUrl/createPromoCode'),
        headers: await _getHeaders(),
        body: jsonEncode({
          'code': code,
          'discountType': discountType,
          'discountValue': discountValue,
          'maxUses': maxUses,
          'expiresAt': expiresAt?.toIso8601String(),
          'description': description,
        }),
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        final error = jsonDecode(response.body);
        throw Exception(error['error'] ?? 'Failed to create promo code');
      }
    } catch (e) {
      debugPrint('❌ Error creating promo code: $e');
      rethrow;
    }
  }

  /// Ottiene le statistiche Admin
  Future<Map<String, dynamic>> getAdminStats() async {
    try {
      final response = await http.get(
        Uri.parse('$_backendUrl/getAdminStats'),
        headers: await _getHeaders(),
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        throw Exception('Failed to get admin stats');
      }
    } catch (e) {
      debugPrint('❌ Error getting admin stats: $e');
      return {};
    }
  }
}
