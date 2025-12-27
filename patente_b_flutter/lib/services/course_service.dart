import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

enum CourseType { patente, italiano }

/// Tipo di licenza per patente e CQC
enum LicenseType {
  b, // 🚗 Patente B - Auto
  c, // 🚛 Patente C - Camion
  ce, // 🚚 Patente CE - Camion + Rimorchio
  cqcMerci, // 📦 CQC Trasporto Merci
  cqcPersone, // 🚌 CQC Trasporto Persone
}

/// Configurazione esame per ogni licenza
class ExamConfig {
  final int totalQuestions;
  final int timeMinutes;
  final int maxErrors;
  final Map<String, int>? questionDistribution;

  const ExamConfig({
    required this.totalQuestions,
    required this.timeMinutes,
    required this.maxErrors,
    this.questionDistribution,
  });
}

/// Configurazioni esame per ogni licenza
const Map<LicenseType, ExamConfig> examConfigs = {
  LicenseType.b: ExamConfig(totalQuestions: 40, timeMinutes: 30, maxErrors: 4),
  LicenseType.c: ExamConfig(totalQuestions: 40, timeMinutes: 40, maxErrors: 4),
  LicenseType.ce: ExamConfig(totalQuestions: 40, timeMinutes: 40, maxErrors: 4),
  LicenseType.cqcMerci: ExamConfig(
    totalQuestions: 70,
    timeMinutes: 90,
    maxErrors: 7,
    questionDistribution: {'comune': 40, 'specifica': 30},
  ),
  LicenseType.cqcPersone: ExamConfig(
    totalQuestions: 70,
    timeMinutes: 90,
    maxErrors: 7,
    questionDistribution: {'comune': 40, 'specifica': 30},
  ),
};

/// Esame estensione CQC (se già hai un'altra CQC)
const ExamConfig cqcExtensionConfig = ExamConfig(
  totalQuestions: 30,
  timeMinutes: 40,
  maxErrors: 3,
);

class CourseService extends ChangeNotifier {
  static const String _prefsKey = 'selected_course';
  static const String _licenseKey = 'selected_license';

  CourseType _currentCourse = CourseType.patente;
  LicenseType _currentLicense = LicenseType.b;
  bool _isLoaded = false;
  bool _hasSelectedCourse = false;
  bool _hasSelectedLicense = false;

  CourseType get currentCourse => _currentCourse;
  LicenseType get currentLicense => _currentLicense;
  bool get isLoaded => _isLoaded;
  bool get hasSelectedCourse => _hasSelectedCourse;
  bool get hasSelectedLicense => _hasSelectedLicense;

  /// Verifica se è una licenza CQC
  bool get isCQC =>
      _currentLicense == LicenseType.cqcMerci ||
      _currentLicense == LicenseType.cqcPersone;

  /// Configurazione esame corrente
  ExamConfig get examConfig => examConfigs[_currentLicense]!;

  /// Colore tema per licenza corrente
  Color get licenseColor {
    switch (_currentLicense) {
      case LicenseType.b:
        return const Color(0xFF3B82F6); // Blue
      case LicenseType.c:
        return const Color(0xFFF97316); // Orange
      case LicenseType.ce:
        return const Color(0xFFEF4444); // Red
      case LicenseType.cqcMerci:
        return const Color(0xFF8B5CF6); // Purple
      case LicenseType.cqcPersone:
        return const Color(0xFF06B6D4); // Cyan
    }
  }

  /// Nome licenza corrente
  String get licenseName {
    switch (_currentLicense) {
      case LicenseType.b:
        return 'Patente B';
      case LicenseType.c:
        return 'Patente C';
      case LicenseType.ce:
        return 'Patente CE';
      case LicenseType.cqcMerci:
        return 'CQC Merci';
      case LicenseType.cqcPersone:
        return 'CQC Persone';
    }
  }

  /// Icona licenza corrente
  String get licenseIcon {
    switch (_currentLicense) {
      case LicenseType.b:
        return '🚗';
      case LicenseType.c:
        return '🚛';
      case LicenseType.ce:
        return '🚚';
      case LicenseType.cqcMerci:
        return '📦';
      case LicenseType.cqcPersone:
        return '🚌';
    }
  }

  /// Codice licenza per filtro quiz
  String get licenseCode {
    switch (_currentLicense) {
      case LicenseType.b:
        return 'B';
      case LicenseType.c:
        return 'C';
      case LicenseType.ce:
        return 'CE';
      case LicenseType.cqcMerci:
        return 'CQC_M';
      case LicenseType.cqcPersone:
        return 'CQC_P';
    }
  }

  /// Descrizione breve per UI
  String get licenseDescription {
    switch (_currentLicense) {
      case LicenseType.b:
        return 'Auto fino a 3.5t';
      case LicenseType.c:
        return 'Camion oltre 3.5t';
      case LicenseType.ce:
        return 'Camion + Rimorchio';
      case LicenseType.cqcMerci:
        return 'Autista Camion';
      case LicenseType.cqcPersone:
        return 'Autista Autobus';
    }
  }

  /// Numero quiz disponibili
  int get quizCount {
    switch (_currentLicense) {
      case LicenseType.b:
        return 7194;
      case LicenseType.c:
      case LicenseType.ce:
        return 3493;
      case LicenseType.cqcMerci:
        return 3389;
      case LicenseType.cqcPersone:
        return 3200;
    }
  }

  CourseService();

  Future<void> initialize() async {
    final prefs = await SharedPreferences.getInstance();
    final courseIndex = prefs.getInt(_prefsKey);
    final licenseIndex = prefs.getInt(_licenseKey);

    if (courseIndex != null &&
        courseIndex >= 0 &&
        courseIndex < CourseType.values.length) {
      _currentCourse = CourseType.values[courseIndex];
      _hasSelectedCourse = true;
    } else {
      _hasSelectedCourse = false;
    }

    if (licenseIndex != null &&
        licenseIndex >= 0 &&
        licenseIndex < LicenseType.values.length) {
      _currentLicense = LicenseType.values[licenseIndex];
      _hasSelectedLicense = true;
    } else {
      _hasSelectedLicense = false;
    }

    _isLoaded = true;
    notifyListeners();
  }

  Future<void> setCourse(CourseType course) async {
    _currentCourse = course;
    _hasSelectedCourse = true;
    notifyListeners();

    final prefs = await SharedPreferences.getInstance();
    await prefs.setInt(_prefsKey, course.index);
  }

  /// Imposta la licenza selezionata
  Future<void> setLicense(LicenseType license) async {
    _currentLicense = license;
    _hasSelectedLicense = true;
    notifyListeners();

    final prefs = await SharedPreferences.getInstance();
    await prefs.setInt(_licenseKey, license.index);
  }

  /// Imposta la licenza da stringa (B, C, CE, CQC_M, CQC_P)
  Future<void> setSelectedLicense(String licenseCode) async {
    LicenseType license;
    switch (licenseCode.toUpperCase()) {
      case 'C':
        license = LicenseType.c;
        break;
      case 'CE':
        license = LicenseType.ce;
        break;
      case 'CQC_M':
        license = LicenseType.cqcMerci;
        break;
      case 'CQC_P':
        license = LicenseType.cqcPersone;
        break;
      default:
        license = LicenseType.b;
    }
    await setLicense(license);
  }

  String getCourseName(CourseType type) {
    switch (type) {
      case CourseType.patente:
        return 'Patente B';
      case CourseType.italiano:
        return 'Italiano';
    }
  }

  /// Lista delle licenze filtrate per quiz (es. ['A', 'B'] o ['C', 'CE'])
  List<String> get quizLicenseFilter {
    switch (_currentLicense) {
      case LicenseType.b:
        return ['A', 'B'];
      case LicenseType.c:
        return ['C', 'C1', 'C1E'];
      case LicenseType.ce:
        return ['C', 'CE', 'C1', 'C1E'];
      case LicenseType.cqcMerci:
        return ['CQC_COMUNE', 'CQC_MERCI'];
      case LicenseType.cqcPersone:
        return ['CQC_COMUNE', 'CQC_PERSONE'];
    }
  }
}
