import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';

/// Model for a bookmarked question with stats
class BookmarkedQuestion {
  final int questionId;
  final String question;
  final String topic;
  final DateTime savedAt;
  int attempts;
  int correct;

  BookmarkedQuestion({
    required this.questionId,
    required this.question,
    required this.topic,
    required this.savedAt,
    this.attempts = 0,
    this.correct = 0,
  });

  /// Success rate for this question
  double get successRate => attempts > 0 ? correct / attempts : 0;

  /// Check if this is a weak question (< 50% success)
  bool get isWeak => attempts >= 2 && successRate < 0.5;

  Map<String, dynamic> toJson() => {
    'questionId': questionId,
    'question': question,
    'topic': topic,
    'savedAt': savedAt.toIso8601String(),
    'attempts': attempts,
    'correct': correct,
  };

  factory BookmarkedQuestion.fromJson(Map<String, dynamic> json) {
    return BookmarkedQuestion(
      questionId: json['questionId'],
      question: json['question'],
      topic: json['topic'],
      savedAt: DateTime.parse(json['savedAt']),
      attempts: json['attempts'] ?? 0,
      correct: json['correct'] ?? 0,
    );
  }
}

/// Service for managing bookmarked questions
class BookmarkService {
  static const String _storageKey = 'bookmarked_questions';

  final Map<int, BookmarkedQuestion> _bookmarks = {};
  bool _isLoaded = false;

  /// Load bookmarks from storage
  Future<void> load() async {
    if (_isLoaded) return;

    try {
      final prefs = await SharedPreferences.getInstance();
      final jsonString = prefs.getString(_storageKey);

      if (jsonString != null) {
        final List<dynamic> jsonList = json.decode(jsonString);
        for (final item in jsonList) {
          final bookmark = BookmarkedQuestion.fromJson(item);
          _bookmarks[bookmark.questionId] = bookmark;
        }
      }
      _isLoaded = true;
    } catch (e) {
      print('Error loading bookmarks: $e');
    }
  }

  /// Save bookmarks to storage
  Future<void> _save() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final jsonList = _bookmarks.values.map((b) => b.toJson()).toList();
      await prefs.setString(_storageKey, json.encode(jsonList));
    } catch (e) {
      print('Error saving bookmarks: $e');
    }
  }

  /// Check if a question is bookmarked
  bool isBookmarked(int questionId) {
    return _bookmarks.containsKey(questionId);
  }

  /// Toggle bookmark for a question
  Future<void> toggleBookmark({
    required int questionId,
    required String question,
    required String topic,
  }) async {
    if (!_isLoaded) await load();

    if (_bookmarks.containsKey(questionId)) {
      _bookmarks.remove(questionId);
    } else {
      _bookmarks[questionId] = BookmarkedQuestion(
        questionId: questionId,
        question: question,
        topic: topic,
        savedAt: DateTime.now(),
      );
    }
    await _save();
  }

  /// Add bookmark
  Future<void> addBookmark({
    required int questionId,
    required String question,
    required String topic,
  }) async {
    if (!_isLoaded) await load();

    _bookmarks[questionId] = BookmarkedQuestion(
      questionId: questionId,
      question: question,
      topic: topic,
      savedAt: DateTime.now(),
    );
    await _save();
  }

  /// Remove bookmark
  Future<void> removeBookmark(int questionId) async {
    if (!_isLoaded) await load();

    _bookmarks.remove(questionId);
    await _save();
  }

  /// Clear all bookmarks
  Future<void> clearAll() async {
    _bookmarks.clear();
    await _save();
  }

  /// Get all bookmarked questions
  List<BookmarkedQuestion> getAllBookmarks() {
    return _bookmarks.values.toList()
      ..sort((a, b) => b.savedAt.compareTo(a.savedAt));
  }

  /// Get bookmarks by topic
  List<BookmarkedQuestion> getByTopic(String topic) {
    return _bookmarks.values
        .where((b) => b.topic.toLowerCase() == topic.toLowerCase())
        .toList();
  }

  /// Get weak questions (< 50% success with 2+ attempts)
  List<BookmarkedQuestion> getWeakQuestions() {
    return _bookmarks.values.where((b) => b.isWeak).toList();
  }

  /// Update question stats after answering
  Future<void> recordAnswer(int questionId, bool correct) async {
    if (!_isLoaded) await load();

    final bookmark = _bookmarks[questionId];
    if (bookmark != null) {
      bookmark.attempts++;
      if (correct) bookmark.correct++;
      await _save();
    }
  }

  /// Get bookmark count
  int get count => _bookmarks.length;

  /// Get weak questions count
  int get weakCount => getWeakQuestions().length;
}
