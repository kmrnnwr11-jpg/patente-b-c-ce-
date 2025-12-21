import 'dart:convert';
import 'package:flutter/services.dart';
import '../models/quiz_question.dart';

/// Service for loading and managing quiz data
class QuizService {
  List<QuizQuestion> _questions = [];
  bool _isLoaded = false;

  List<QuizQuestion> get questions => _questions;
  List<QuizQuestion> get allQuestions => _questions;
  bool get isLoaded => _isLoaded;

  /// Load quiz questions from JSON asset
  Future<void> loadQuestions() async {
    if (_isLoaded) return;

    try {
      final String jsonString = await rootBundle.loadString(
        'assets/data/quiz.json',
      );
      final List<dynamic> jsonList = json.decode(jsonString) as List<dynamic>;

      _questions = jsonList
          .map((json) => QuizQuestion.fromJson(json as Map<String, dynamic>))
          .toList();
      _isLoaded = true;
    } catch (e) {
      print('Error loading quiz questions: $e');
      _questions = [];
    }
  }

  /// Get questions by topic (argomento)
  List<QuizQuestion> getByTopic(String topic) {
    return _questions.where((q) => q.argomento == topic).toList();
  }

  /// Get all unique topics
  List<String> getTopics() {
    return _questions.map((q) => q.argomento).toSet().toList();
  }

  /// Get random questions for quick quiz
  List<QuizQuestion> getRandomQuestions(int count) {
    final shuffled = List<QuizQuestion>.from(_questions)..shuffle();
    return shuffled.take(count).toList();
  }

  /// Get 30 random questions (exam simulation - official Italian exam)
  List<QuizQuestion> getExamQuestions() {
    return getRandomQuestions(30);
  }
}
