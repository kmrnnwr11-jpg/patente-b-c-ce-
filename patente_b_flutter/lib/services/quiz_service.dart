import 'dart:convert';
import 'package:flutter/services.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/quiz_question.dart';

/// Service for loading and managing quiz data
class QuizService {
  List<QuizQuestion> _questions = [];
  Set<int> _wrongQuestionIds = {};
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
      
      await _loadWrongAnswers();
      _isLoaded = true;
    } catch (e) {
      print('Error loading quiz questions: $e');
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
      _wrongQuestionIds.map((e) => e.toString()).toList()
    );
  }

  Future<void> removeError(int questionId) async {
    if (_wrongQuestionIds.contains(questionId)) {
      _wrongQuestionIds.remove(questionId);
      final prefs = await SharedPreferences.getInstance();
      await prefs.setStringList(
        'wrong_answers', 
        _wrongQuestionIds.map((e) => e.toString()).toList()
      );
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
