import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

/// Modello dati autoscuola
class SchoolInfo {
  final String id;
  final String name;
  final String schoolCode;
  final String? logoUrl;
  final String primaryColor;
  final String plan;
  final String planStatus;
  final String? instructorName;

  SchoolInfo({
    required this.id,
    required this.name,
    required this.schoolCode,
    this.logoUrl,
    this.primaryColor = '#4F46E5',
    this.plan = 'pro',
    this.planStatus = 'active',
    this.instructorName,
  });

  factory SchoolInfo.fromJson(Map<String, dynamic> json) {
    return SchoolInfo(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      schoolCode: json['schoolCode'] ?? '',
      logoUrl: json['logoUrl'],
      primaryColor: json['primaryColor'] ?? '#4F46E5',
      plan: json['plan'] ?? 'pro',
      planStatus: json['planStatus'] ?? 'active',
      instructorName: json['instructorName'],
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'schoolCode': schoolCode,
    'logoUrl': logoUrl,
    'primaryColor': primaryColor,
    'plan': plan,
    'planStatus': planStatus,
    'instructorName': instructorName,
  };
}

/// Servizio per gestire l'iscrizione all'autoscuola
class SchoolService extends ChangeNotifier {
  static const String _cacheKey = 'school_info';
  static const String _baseUrl =
      'https://us-central1-YOUR_PROJECT.cloudfunctions.net';

  SchoolInfo? _schoolInfo;
  bool _isLoading = false;
  String? _error;

  SchoolInfo? get schoolInfo => _schoolInfo;
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get isEnrolledInSchool => _schoolInfo != null;

  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  final FirebaseAuth _auth = FirebaseAuth.instance;

  /// Inizializza il servizio caricando i dati cached
  Future<void> initialize() async {
    await _loadCachedSchoolInfo();
    if (_auth.currentUser != null) {
      await refreshSchoolInfo();
    }
  }

  /// Carica info scuola dalla cache
  Future<void> _loadCachedSchoolInfo() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final cached = prefs.getString(_cacheKey);
      if (cached != null) {
        _schoolInfo = SchoolInfo.fromJson(json.decode(cached));
        notifyListeners();
      }
    } catch (e) {
      debugPrint('Error loading cached school info: $e');
    }
  }

  /// Salva info scuola in cache
  Future<void> _cacheSchoolInfo(SchoolInfo? info) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      if (info != null) {
        await prefs.setString(_cacheKey, json.encode(info.toJson()));
      } else {
        await prefs.remove(_cacheKey);
      }
    } catch (e) {
      debugPrint('Error caching school info: $e');
    }
  }

  /// Aggiorna info scuola da Firestore
  Future<void> refreshSchoolInfo() async {
    final user = _auth.currentUser;
    if (user == null) return;

    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      // Leggi dati utente
      final userDoc = await _firestore.collection('users').doc(user.uid).get();
      final userData = userDoc.data();

      if (userData == null || userData['schoolId'] == null) {
        _schoolInfo = null;
        await _cacheSchoolInfo(null);
        return;
      }

      final schoolId = userData['schoolId'] as String;

      // Leggi dati scuola
      final schoolDoc = await _firestore
          .collection('driving_schools')
          .doc(schoolId)
          .get();

      if (!schoolDoc.exists) {
        _schoolInfo = null;
        await _cacheSchoolInfo(null);
        return;
      }

      final schoolData = schoolDoc.data()!;

      // Trova istruttore assegnato
      String? instructorName;
      if (userData['schoolStudentId'] != null) {
        final studentDoc = await _firestore
            .collection('driving_schools')
            .doc(schoolId)
            .collection('school_students')
            .doc(userData['schoolStudentId'])
            .get();

        if (studentDoc.exists) {
          final studentData = studentDoc.data()!;
          if (studentData['assignedInstructorId'] != null) {
            final instructorDoc = await _firestore
                .collection('driving_schools')
                .doc(schoolId)
                .collection('school_instructors')
                .doc(studentData['assignedInstructorId'])
                .get();

            if (instructorDoc.exists) {
              instructorName = instructorDoc.data()!['name'];
            }
          }
        }
      }

      _schoolInfo = SchoolInfo(
        id: schoolId,
        name: schoolData['name'] ?? '',
        schoolCode: schoolData['schoolCode'] ?? '',
        logoUrl: schoolData['logoUrl'],
        primaryColor: schoolData['primaryColor'] ?? '#4F46E5',
        plan: schoolData['plan'] ?? 'pro',
        planStatus: schoolData['planStatus'] ?? 'active',
        instructorName: instructorName,
      );

      await _cacheSchoolInfo(_schoolInfo);
    } catch (e) {
      _error = 'Errore nel caricamento dati scuola: $e';
      debugPrint(_error);
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  /// Iscrive lo studente a un'autoscuola tramite codice
  Future<Map<String, dynamic>> joinSchool(String code) async {
    final user = _auth.currentUser;
    if (user == null) {
      return {'success': false, 'error': 'Devi effettuare il login'};
    }

    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final token = await user.getIdToken();

      final response = await http.post(
        Uri.parse('$_baseUrl/joinSchool'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: json.encode({'code': code}),
      );

      final data = json.decode(response.body);

      if (response.statusCode == 200 && data['success'] == true) {
        // Aggiorna info locali
        _schoolInfo = SchoolInfo(
          id: data['schoolId'],
          name: data['schoolName'],
          logoUrl: data['logoUrl'],
          primaryColor: data['primaryColor'] ?? '#4F46E5',
          schoolCode: code.toUpperCase(),
        );

        await _cacheSchoolInfo(_schoolInfo);

        return {
          'success': true,
          'school': _schoolInfo,
          'message': data['message'] ?? 'Iscrizione completata!',
        };
      } else {
        _error = data['error'] ?? 'Errore sconosciuto';
        return {'success': false, 'error': _error};
      }
    } catch (e) {
      _error = 'Errore di connessione: $e';
      return {'success': false, 'error': _error};
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  /// Lascia l'autoscuola corrente
  Future<bool> leaveSchool() async {
    final user = _auth.currentUser;
    if (user == null || _schoolInfo == null) return false;

    _isLoading = true;
    notifyListeners();

    try {
      // Rimuovi collegamento dall'utente
      await _firestore.collection('users').doc(user.uid).update({
        'schoolId': FieldValue.delete(),
        'schoolStudentId': FieldValue.delete(),
        'enrolledViaSchool': false,
        'isPremium': false, // Rimuove premium se era via scuola
        'premiumSource': FieldValue.delete(),
        'updatedAt': FieldValue.serverTimestamp(),
      });

      _schoolInfo = null;
      await _cacheSchoolInfo(null);

      return true;
    } catch (e) {
      _error = 'Errore: $e';
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  /// Pulisce i dati (chiamato al logout)
  void clear() {
    _schoolInfo = null;
    _error = null;
    _isLoading = false;
    _cacheSchoolInfo(null);
    notifyListeners();
  }
}
