import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';
import 'package:flutter/foundation.dart';

/// Model for user statistics and progress
class UserStats {
  int totalQuizzes;
  int totalQuestions;
  int correctAnswers;
  int wrongAnswers;
  int currentStreak;
  int bestStreak;
  int totalXp;
  DateTime? lastQuizDate;
  Map<String, TopicStats> topicStats;

  UserStats({
    this.totalQuizzes = 0,
    this.totalQuestions = 0,
    this.correctAnswers = 0,
    this.wrongAnswers = 0,
    this.currentStreak = 0,
    this.bestStreak = 0,
    this.totalXp = 0,
    this.lastQuizDate,
    Map<String, TopicStats>? topicStats,
  }) : topicStats = topicStats ?? {};

  /// Overall accuracy percentage
  double get accuracy =>
      totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

  /// Current level (100 XP per level)
  int get level => (totalXp / 100).floor() + 1;

  /// XP progress to next level (0-100)
  int get xpToNextLevel => totalXp % 100;

  Map<String, dynamic> toJson() => {
    'totalQuizzes': totalQuizzes,
    'totalQuestions': totalQuestions,
    'correctAnswers': correctAnswers,
    'wrongAnswers': wrongAnswers,
    'currentStreak': currentStreak,
    'bestStreak': bestStreak,
    'totalXp': totalXp,
    'lastQuizDate': lastQuizDate?.toIso8601String(),
    'topicStats': topicStats.map((k, v) => MapEntry(k, v.toJson())),
  };

  factory UserStats.fromJson(Map<String, dynamic> json) {
    final topicStatsJson = json['topicStats'] as Map<String, dynamic>?;
    return UserStats(
      totalQuizzes: json['totalQuizzes'] ?? 0,
      totalQuestions: json['totalQuestions'] ?? 0,
      correctAnswers: json['correctAnswers'] ?? 0,
      wrongAnswers: json['wrongAnswers'] ?? 0,
      currentStreak: json['currentStreak'] ?? 0,
      bestStreak: json['bestStreak'] ?? 0,
      totalXp: json['totalXp'] ?? 0,
      lastQuizDate: json['lastQuizDate'] != null
          ? DateTime.parse(json['lastQuizDate'])
          : null,
      topicStats: topicStatsJson?.map(
        (k, v) => MapEntry(k, TopicStats.fromJson(v)),
      ),
    );
  }
}

/// Stats for a specific topic
class TopicStats {
  int attempts;
  int correct;

  TopicStats({this.attempts = 0, this.correct = 0});

  double get accuracy => attempts > 0 ? (correct / attempts) * 100 : 0;

  Map<String, dynamic> toJson() => {'attempts': attempts, 'correct': correct};

  factory TopicStats.fromJson(Map<String, dynamic> json) {
    return TopicStats(
      attempts: json['attempts'] ?? 0,
      correct: json['correct'] ?? 0,
    );
  }
}

/// Service for managing user statistics and gamification
class StatsService with ChangeNotifier {
  static const String _storageKey = 'user_stats';

  UserStats _stats = UserStats();
  bool _isLoaded = false;

  /// Load stats from storage
  Future<void> load() async {
    if (_isLoaded) return;

    try {
      final prefs = await SharedPreferences.getInstance();
      final jsonString = prefs.getString(_storageKey);

      if (jsonString != null) {
        _stats = UserStats.fromJson(json.decode(jsonString));
      }
      _isLoaded = true;
      notifyListeners();
    } catch (e) {
      print('Error loading stats: $e');
      _stats = UserStats();
      notifyListeners();
    }
  }

  /// Save stats to storage
  Future<void> _save() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(_storageKey, json.encode(_stats.toJson()));
      notifyListeners();
    } catch (e) {
      print('Error saving stats: $e');
    }
  }

  /// Get current stats
  UserStats get stats => _stats;

  /// Record a completed quiz
  Future<int> recordQuizCompleted({
    required int correct,
    required int wrong,
    required String mode,
    Map<String, int>? topicResults, // topic -> correct count
  }) async {
    if (!_isLoaded) await load();

    _stats.totalQuizzes++;
    _stats.totalQuestions += correct + wrong;
    _stats.correctAnswers += correct;
    _stats.wrongAnswers += wrong;

    // Calculate XP earned
    int xpEarned = correct * 10; // 10 XP per correct answer
    if (mode == 'exam' && wrong <= 4) {
      xpEarned += 50; // Bonus for passing exam
    }
    _stats.totalXp += xpEarned;

    // Update streak
    final today = DateTime.now();
    if (_stats.lastQuizDate != null) {
      final lastDate = _stats.lastQuizDate!;
      final diff = today.difference(lastDate).inDays;

      if (diff == 1) {
        // Consecutive day
        _stats.currentStreak++;
        if (_stats.currentStreak > _stats.bestStreak) {
          _stats.bestStreak = _stats.currentStreak;
        }
      } else if (diff > 1) {
        // Streak broken
        _stats.currentStreak = 1;
      }
      // Same day - keep streak
    } else {
      _stats.currentStreak = 1;
    }
    _stats.lastQuizDate = today;

    // Update topic stats
    if (topicResults != null) {
      for (final entry in topicResults.entries) {
        final topic = entry.key;
        final correctCount = entry.value;

        if (!_stats.topicStats.containsKey(topic)) {
          _stats.topicStats[topic] = TopicStats();
        }
        _stats.topicStats[topic]!.attempts++;
        _stats.topicStats[topic]!.correct += correctCount;
      }
    }

    await _save();
    return xpEarned;
  }

  /// Record a single answer
  Future<void> recordAnswer({
    required String topic,
    required bool correct,
  }) async {
    if (!_isLoaded) await load();

    if (!_stats.topicStats.containsKey(topic)) {
      _stats.topicStats[topic] = TopicStats();
    }
    _stats.topicStats[topic]!.attempts++;
    if (correct) {
      _stats.topicStats[topic]!.correct++;
    }

    await _save();
  }

  /// Get worst performing topics
  List<MapEntry<String, TopicStats>> getWeakTopics({int limit = 5}) {
    final sorted = _stats.topicStats.entries.toList()
      ..sort((a, b) => a.value.accuracy.compareTo(b.value.accuracy));
    return sorted.take(limit).toList();
  }

  /// Get best performing topics
  List<MapEntry<String, TopicStats>> getStrongTopics({int limit = 5}) {
    final sorted = _stats.topicStats.entries.toList()
      ..sort((a, b) => b.value.accuracy.compareTo(a.value.accuracy));
    return sorted.take(limit).toList();
  }

  /// Add XP (for achievements, etc.)
  Future<void> addXp(int amount) async {
    if (!_isLoaded) await load();
    _stats.totalXp += amount;
    await _save();
  }

  /// Reset all stats
  Future<void> reset() async {
    _stats = UserStats();
    await _save();
  }
}
