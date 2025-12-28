import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'dart:ui' as ui;

/// Schermata per iscriversi a un'autoscuola tramite codice
/// Lo studente inserisce il codice e ottiene accesso Premium gratuito
class JoinSchoolScreen extends StatefulWidget {
  const JoinSchoolScreen({super.key});

  @override
  State<JoinSchoolScreen> createState() => _JoinSchoolScreenState();
}

class _JoinSchoolScreenState extends State<JoinSchoolScreen> {
  final _codeController = TextEditingController();
  final _formKey = GlobalKey<FormState>();

  bool _isLoading = false;
  String? _error;
  Map<String, dynamic>? _schoolData;

  @override
  void dispose() {
    _codeController.dispose();
    super.dispose();
  }

  Future<void> _joinSchool() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final code = _codeController.text.trim().toUpperCase();

      // Cerca autoscuola con questo codice
      final schoolQuery = await FirebaseFirestore.instance
          .collection('driving_schools')
          .where('schoolCode', isEqualTo: code)
          .where('isActive', isEqualTo: true)
          .limit(1)
          .get();

      if (schoolQuery.docs.isEmpty) {
        // Prova a cercare per invite code studente
        final studentQuery = await FirebaseFirestore.instance
            .collectionGroup('school_students')
            .where('inviteCode', isEqualTo: code)
            .limit(1)
            .get();

        if (studentQuery.docs.isEmpty) {
          setState(() {
            _error = 'Codice non valido. Verifica con la tua autoscuola.';
            _isLoading = false;
          });
          return;
        }

        // Trovato studente con invite code
        final studentDoc = studentQuery.docs.first;
        final schoolId = studentDoc.reference.parent.parent!.id;

        // Ottieni dati autoscuola
        final schoolDoc = await FirebaseFirestore.instance
            .collection('driving_schools')
            .doc(schoolId)
            .get();

        if (!schoolDoc.exists) {
          setState(() {
            _error = 'Autoscuola non trovata.';
            _isLoading = false;
          });
          return;
        }

        await _linkStudentToSchool(schoolDoc.data()!, studentDoc.id, schoolId);
        return;
      }

      // Trovata autoscuola con codice scuola
      final schoolDoc = schoolQuery.docs.first;
      await _linkStudentToSchool(schoolDoc.data(), null, schoolDoc.id);
    } catch (e) {
      setState(() {
        _error = 'Errore di connessione. Riprova.';
        _isLoading = false;
      });
    }
  }

  Future<void> _linkStudentToSchool(
    Map<String, dynamic> schoolData,
    String? existingStudentId,
    String schoolId,
  ) async {
    final user = FirebaseAuth.instance.currentUser;
    if (user == null) {
      setState(() {
        _error = 'Devi effettuare il login prima.';
        _isLoading = false;
      });
      return;
    }

    // Verifica piano autoscuola
    final planStatus = schoolData['planStatus'] ?? 'expired';
    if (planStatus == 'expired' || planStatus == 'cancelled') {
      setState(() {
        _error = 'L\'abbonamento dell\'autoscuola non è attivo.';
        _isLoading = false;
      });
      return;
    }

    // Verifica limite studenti
    final maxStudents = schoolData['maxStudents'] ?? 30;
    final currentStudents = schoolData['currentStudents'] ?? 0;
    if (maxStudents != -1 && currentStudents >= maxStudents) {
      setState(() {
        _error = 'L\'autoscuola ha raggiunto il limite massimo di studenti.';
        _isLoading = false;
      });
      return;
    }

    final batch = FirebaseFirestore.instance.batch();

    String studentId = existingStudentId ?? '';

    if (existingStudentId != null) {
      // Aggiorna studente esistente
      final studentRef = FirebaseFirestore.instance
          .collection('driving_schools')
          .doc(schoolId)
          .collection('school_students')
          .doc(existingStudentId);

      batch.update(studentRef, {
        'userId': user.uid,
        'inviteAcceptedAt': FieldValue.serverTimestamp(),
        'updatedAt': FieldValue.serverTimestamp(),
      });
    } else {
      // Crea nuovo studente
      final studentRef = FirebaseFirestore.instance
          .collection('driving_schools')
          .doc(schoolId)
          .collection('school_students')
          .doc();

      studentId = studentRef.id;

      batch.set(studentRef, {
        'userId': user.uid,
        'name': user.displayName ?? 'Studente',
        'email': user.email,
        'enrollmentStatus': 'active',
        'enrollmentDate': FieldValue.serverTimestamp(),
        'targetScore': 80,
        'isReadyForExam': false,
        'flaggedForReview': false,
        'createdAt': FieldValue.serverTimestamp(),
        'updatedAt': FieldValue.serverTimestamp(),
      });

      // Incrementa contatore studenti
      batch.update(
        FirebaseFirestore.instance.collection('driving_schools').doc(schoolId),
        {'currentStudents': FieldValue.increment(1)},
      );
    }

    // Aggiorna utente con collegamento autoscuola e Premium
    batch.update(FirebaseFirestore.instance.collection('users').doc(user.uid), {
      'schoolId': schoolId,
      'schoolStudentId': studentId,
      'enrolledViaSchool': true,
      'isPremium': true,
      'premiumSource': 'school',
      'updatedAt': FieldValue.serverTimestamp(),
    });

    await batch.commit();

    // Mostra successo
    setState(() {
      _schoolData = schoolData;
      _isLoading = false;
    });

    if (mounted) {
      _showSuccessDialog(schoolData);
    }
  }

  void _showSuccessDialog(Map<String, dynamic> school) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => Dialog(
        backgroundColor: Colors.transparent,
        child: Container(
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            color: Theme.of(context).brightness == Brightness.dark
                ? const Color(0xFF1A1A2E)
                : Colors.white,
            borderRadius: BorderRadius.circular(24),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Logo autoscuola
              if (school['logoUrl'] != null)
                ClipRRect(
                  borderRadius: BorderRadius.circular(16),
                  child: Image.network(
                    school['logoUrl'],
                    height: 80,
                    width: 80,
                    fit: BoxFit.cover,
                    errorBuilder: (_, __, ___) => Container(
                      height: 80,
                      width: 80,
                      decoration: BoxDecoration(
                        color: Color(
                          int.parse(
                            (school['primaryColor'] ?? '#4F46E5').replaceFirst(
                              '#',
                              '0xFF',
                            ),
                          ),
                        ).withOpacity(0.2),
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: Icon(
                        Icons.school,
                        size: 40,
                        color: Color(
                          int.parse(
                            (school['primaryColor'] ?? '#4F46E5').replaceFirst(
                              '#',
                              '0xFF',
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                )
              else
                Container(
                  height: 80,
                  width: 80,
                  decoration: BoxDecoration(
                    color: Colors.indigo.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: const Icon(
                    Icons.school,
                    size: 40,
                    color: Colors.indigo,
                  ),
                ),

              const SizedBox(height: 20),

              // Check icon
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.green.withOpacity(0.1),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.check, color: Colors.green, size: 48),
              ),

              const SizedBox(height: 20),

              // Titolo
              const Text(
                'Benvenuto!',
                style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
              ),

              const SizedBox(height: 12),

              // Nome autoscuola
              Text(
                'Sei iscritto a',
                style: TextStyle(color: Colors.grey.shade600),
              ),
              const SizedBox(height: 4),
              Text(
                school['name'] ?? 'Autoscuola',
                style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w600,
                ),
                textAlign: TextAlign.center,
              ),

              const SizedBox(height: 20),

              // Premium badge
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 12,
                ),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFF667eea), Color(0xFF764ba2)],
                  ),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: const [
                    Icon(Icons.star, color: Colors.white, size: 20),
                    SizedBox(width: 8),
                    Text(
                      'Accesso Premium GRATUITO!',
                      style: TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 8),

              Text(
                'Pagato dalla tua autoscuola',
                style: TextStyle(color: Colors.grey.shade500, fontSize: 12),
              ),

              const SizedBox(height: 24),

              // Pulsante continua
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () {
                    Navigator.of(context).pop();
                    Navigator.of(
                      context,
                    ).pushNamedAndRemoveUntil('/home', (route) => false);
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.indigo,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  child: const Text(
                    'Inizia a Studiare',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Iscrizione Autoscuola'),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: isDark
                ? [const Color(0xFF0A0A15), const Color(0xFF1A1A2E)]
                : [Colors.grey.shade50, Colors.white],
          ),
        ),
        child: SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: Form(
              key: _formKey,
              child: Column(
                children: [
                  const SizedBox(height: 40),

                  // Icon
                  Container(
                    padding: const EdgeInsets.all(24),
                    decoration: BoxDecoration(
                      color: Colors.indigo.withOpacity(0.1),
                      shape: BoxShape.circle,
                    ),
                    child: Icon(
                      Icons.school,
                      size: 64,
                      color: Colors.indigo.shade400,
                    ),
                  ),

                  const SizedBox(height: 32),

                  // Titolo
                  Text(
                    'Hai un codice autoscuola?',
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: isDark ? Colors.white : Colors.grey.shade900,
                    ),
                    textAlign: TextAlign.center,
                  ),

                  const SizedBox(height: 12),

                  // Sottotitolo
                  Text(
                    'Inserisci il codice fornito dalla tua autoscuola per accedere GRATIS a tutte le funzionalità Premium',
                    style: TextStyle(
                      fontSize: 16,
                      color: Colors.grey.shade500,
                      height: 1.5,
                    ),
                    textAlign: TextAlign.center,
                  ),

                  const SizedBox(height: 40),

                  // Campo codice
                  TextFormField(
                    controller: _codeController,
                    textCapitalization: TextCapitalization.characters,
                    textAlign: TextAlign.center,
                    style: const TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.w600,
                      letterSpacing: 2,
                    ),
                    inputFormatters: [UpperCaseTextFormatter()],
                    decoration: InputDecoration(
                      hintText: 'AUTO-ROMA-A1B2C3',
                      hintStyle: TextStyle(
                        color: Colors.grey.shade400,
                        letterSpacing: 2,
                      ),
                      prefixIcon: Icon(
                        Icons.qr_code,
                        color: Colors.grey.shade400,
                      ),
                      filled: true,
                      fillColor: isDark
                          ? Colors.white.withOpacity(0.05)
                          : Colors.grey.shade100,
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(16),
                        borderSide: BorderSide.none,
                      ),
                      enabledBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(16),
                        borderSide: BorderSide(
                          color: Colors.grey.shade300,
                          width: 1,
                        ),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(16),
                        borderSide: const BorderSide(
                          color: Colors.indigo,
                          width: 2,
                        ),
                      ),
                      errorBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(16),
                        borderSide: const BorderSide(
                          color: Colors.red,
                          width: 1,
                        ),
                      ),
                    ),
                    validator: (value) {
                      if (value == null || value.trim().isEmpty) {
                        return 'Inserisci il codice autoscuola';
                      }
                      if (value.trim().length < 6) {
                        return 'Il codice deve avere almeno 6 caratteri';
                      }
                      return null;
                    },
                  ),

                  // Errore
                  if (_error != null) ...[
                    const SizedBox(height: 16),
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: Colors.red.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Row(
                        children: [
                          const Icon(
                            Icons.error_outline,
                            color: Colors.red,
                            size: 20,
                          ),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Text(
                              _error!,
                              style: const TextStyle(color: Colors.red),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],

                  const SizedBox(height: 24),

                  // Pulsante iscriviti
                  SizedBox(
                    width: double.infinity,
                    height: 56,
                    child: ElevatedButton(
                      onPressed: _isLoading ? null : _joinSchool,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.indigo,
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16),
                        ),
                        elevation: 0,
                      ),
                      child: _isLoading
                          ? const SizedBox(
                              width: 24,
                              height: 24,
                              child: CircularProgressIndicator(
                                color: Colors.white,
                                strokeWidth: 2,
                              ),
                            )
                          : const Text(
                              'Iscriviti',
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                    ),
                  ),

                  const SizedBox(height: 24),

                  // Link per saltare
                  TextButton(
                    onPressed: () => Navigator.of(context).pop(),
                    child: Text(
                      'Non ho un codice, continua senza',
                      style: TextStyle(
                        color: Colors.grey.shade500,
                        fontSize: 14,
                      ),
                    ),
                  ),

                  const SizedBox(height: 40),

                  // Info
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.blue.withOpacity(0.05),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: Colors.blue.withOpacity(0.2)),
                    ),
                    child: Row(
                      children: [
                        Icon(Icons.info_outline, color: Colors.blue.shade400),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Text(
                            'Il codice ti viene fornito dalla tua autoscuola. Se non lo hai, chiedi al tuo istruttore.',
                            style: TextStyle(
                              color: Colors.blue.shade700,
                              fontSize: 13,
                              height: 1.4,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/// Formatter per convertire testo in maiuscolo
class UpperCaseTextFormatter extends TextInputFormatter {
  @override
  TextEditingValue formatEditUpdate(
    TextEditingValue oldValue,
    TextEditingValue newValue,
  ) {
    return TextEditingValue(
      text: newValue.text.toUpperCase(),
      selection: newValue.selection,
    );
  }
}
