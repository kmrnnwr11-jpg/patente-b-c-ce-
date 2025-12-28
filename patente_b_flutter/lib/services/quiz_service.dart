import 'package:flutter/foundation.dart';
import 'dart:convert';
import 'package:flutter/services.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:patente_b_flutter/services/course_service.dart';
import '../models/quiz_question.dart';

/// Service for loading and managing quiz data
class QuizService {
  List<QuizQuestion> _questions = [];
  Set<int> _wrongQuestionIds = {};
  bool _isLoaded = false;
  LicenseType? _loadedLicense;

  List<QuizQuestion> get questions => _questions;
  List<QuizQuestion> get allQuestions => _questions;
  bool get isLoaded => _isLoaded;
  LicenseType? get loadedLicense => _loadedLicense;

  /// Load quiz questions from JSON asset based on LicenseType
  Future<void> loadQuestions({
    LicenseType license = LicenseType.b,
    bool forceReload = false,
  }) async {
    // If already loaded for this license, skip unless forced
    if (_isLoaded && _loadedLicense == license && !forceReload) return;

    // Determine which file to load based on license
    String assetPath;
    switch (license) {
      case LicenseType.c:
      case LicenseType.ce:
        assetPath = 'assets/data/quiz_c.json';
        break;
      case LicenseType.b:
      default:
        assetPath = 'assets/data/quiz.json';
        break;
    }

    try {
      debugPrint('Loading quiz data from: $assetPath');
      final String jsonString = await rootBundle.loadString(assetPath);
      final List<dynamic> jsonList = json.decode(jsonString) as List<dynamic>;

      _questions = jsonList
          .map((json) => QuizQuestion.fromJson(json as Map<String, dynamic>))
          .toList();

      await _loadWrongAnswers();
      _isLoaded = true;
      _loadedLicense = license;
      debugPrint(
        'Loaded ${_questions.length} questions for license: ${license.name}',
      );
    } catch (e) {
      debugPrint('Error loading quiz questions for $assetPath: $e');
      _questions = [];
    }
  }

  Future<void> _loadWrongAnswers() async {
    final prefs = await SharedPreferences.getInstance();
    final List<String>? stored = prefs.getStringList('wrong_answers');
    if (stored != null) {
      _wrongQuestionIds = stored.map((e) => int.parse(e)).toSet();
    }
  }

  Future<void> addError(int questionId) async {
    _wrongQuestionIds.add(questionId);
    final prefs = await SharedPreferences.getInstance();
    await prefs.setStringList(
      'wrong_answers',
      _wrongQuestionIds.map((e) => e.toString()).toList(),
    );
  }

  Future<void> removeError(int questionId) async {
    if (_wrongQuestionIds.contains(questionId)) {
      _wrongQuestionIds.remove(questionId);
      final prefs = await SharedPreferences.getInstance();
      await prefs.setStringList(
        'wrong_answers',
        _wrongQuestionIds.map((e) => e.toString()).toList(),
      );
    }
  }

  /// Get questions by topic (argomento)
  List<QuizQuestion> getByTopic(String topic) {
    return _questions.where((q) => q.argomento == topic).toList();
  }

  /// Get random questions by topic (shuffled, limited to count for exam-like experience)
  List<QuizQuestion> getRandomByTopic(String topic, {int count = 30}) {
    final topicQuestions = _questions
        .where((q) => q.argomento == topic)
        .toList();
    if (topicQuestions.isEmpty) return [];
    topicQuestions.shuffle();
    return topicQuestions.take(count).toList();
  }

  /// Get all unique topics
  List<String> getTopics() {
    return _questions.map((q) => q.argomento).toSet().toList();
  }

  /// Get random questions for quick quiz
  List<QuizQuestion> getRandomQuestions(int count) {
    if (_questions.isEmpty) return [];
    final shuffled = List<QuizQuestion>.from(_questions)..shuffle();
    return shuffled.take(count).toList();
  }

  /// Get 30 random questions (exam simulation - official Italian exam)
  List<QuizQuestion> getExamQuestions() {
    return getRandomQuestions(30);
  }

  /// Get up to 20 questions from the error list
  List<QuizQuestion> getErrorQuestions() {
    if (_questions.isEmpty || _wrongQuestionIds.isEmpty) return [];
    final errorQuestions = _questions
        .where((q) => _wrongQuestionIds.contains(q.id))
        .toList();

    // If we have more than 20, just take 20 random ones from errors
    if (errorQuestions.length > 20) {
      errorQuestions.shuffle();
      return errorQuestions.take(20).toList();
    }
    return errorQuestions;
  }
}
