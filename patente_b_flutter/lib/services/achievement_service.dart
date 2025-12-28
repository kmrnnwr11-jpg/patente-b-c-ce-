import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';

/// Model for an achievement
class Achievement {
  final String id;
  final String title;
  final String description;
  final String icon;
  final int xpReward;
  final AchievementRarity rarity;
  bool isUnlocked;
  DateTime? unlockedAt;

  Achievement({
    required this.id,
    required this.title,
    required this.description,
    required this.icon,
    required this.xpReward,
    required this.rarity,
    this.isUnlocked = false,
    this.unlockedAt,
  });

  Map<String, dynamic> toJson() => {
    'id': id,
    'isUnlocked': isUnlocked,
    'unlockedAt': unlockedAt?.toIso8601String(),
  };
}

enum AchievementRarity {
  common('Comune', 0xFF4CAF50),
  rare('Raro', 0xFF2196F3),
  epic('Epico', 0xFF9C27B0),
  legendary('Leggendario', 0xFFFF9800);

  final String name;
  final int color;
  const AchievementRarity(this.name, this.color);
}

/// Service for managing achievements
class AchievementService {
  static const String _storageKey = 'achievements';

  final Map<String, Achievement> _achievements = {};
  bool _isLoaded = false;

  /// Callback when achievement is unlocked
  void Function(Achievement)? onAchievementUnlocked;

  /// All available achievements
  static final List<Achievement> _allAchievements = [
    Achievement(
      id: 'first_quiz',
      title: 'Primo Passo',
      description: 'Completa il tuo primo quiz',
      icon: '🎯',
      xpReward: 50,
      rarity: AchievementRarity.common,
    ),
    Achievement(
      id: 'perfect_quiz',
      title: 'Perfezione',
      description: 'Completa un quiz senza errori',
      icon: '⭐',
      xpReward: 100,
      rarity: AchievementRarity.rare,
    ),
    Achievement(
      id: 'exam_passed',
      title: 'Patentato',
      description: 'Supera una simulazione esame',
      icon: '🏆',
      xpReward: 200,
      rarity: AchievementRarity.epic,
    ),
    Achievement(
      id: 'streak_3',
      title: 'Costanza',
      description: 'Mantieni una streak di 3 giorni',
      icon: '🔥',
      xpReward: 75,
      rarity: AchievementRarity.common,
    ),
    Achievement(
      id: 'streak_7',
      title: 'Settimana Perfetta',
      description: 'Mantieni una streak di 7 giorni',
      icon: '🌟',
      xpReward: 150,
      rarity: AchievementRarity.rare,
    ),
    Achievement(
      id: 'streak_30',
      title: 'Maratona',
      description: 'Mantieni una streak di 30 giorni',
      icon: '👑',
      xpReward: 500,
      rarity: AchievementRarity.legendary,
    ),
    Achievement(
      id: 'level_5',
      title: 'Studente',
      description: 'Raggiungi il livello 5',
      icon: '📚',
      xpReward: 100,
      rarity: AchievementRarity.common,
    ),
    Achievement(
      id: 'level_10',
      title: 'Esperto',
      description: 'Raggiungi il livello 10',
      icon: '🎓',
      xpReward: 200,
      rarity: AchievementRarity.rare,
    ),
    Achievement(
      id: 'level_25',
      title: 'Maestro',
      description: 'Raggiungi il livello 25',
      icon: '🏅',
      xpReward: 500,
      rarity: AchievementRarity.epic,
    ),
    Achievement(
      id: 'quiz_10',
      title: 'Pratica',
      description: 'Completa 10 quiz',
      icon: '📝',
      xpReward: 75,
      rarity: AchievementRarity.common,
    ),
    Achievement(
      id: 'quiz_50',
      title: 'Dedizione',
      description: 'Completa 50 quiz',
      icon: '💪',
      xpReward: 200,
      rarity: AchievementRarity.rare,
    ),
    Achievement(
      id: 'quiz_100',
      title: 'Veterano',
      description: 'Completa 100 quiz',
      icon: '🏆',
      xpReward: 400,
      rarity: AchievementRarity.epic,
    ),
    Achievement(
      id: 'accuracy_90',
      title: 'Precisione',
      description: 'Raggiungi 90% di accuratezza',
      icon: '🎯',
      xpReward: 300,
      rarity: AchievementRarity.legendary,
    ),
  ];

  /// Load achievements from storage
  Future<void> load() async {
    if (_isLoaded) return;

    // Initialize with all achievements
    for (final achievement in _allAchievements) {
      _achievements[achievement.id] = Achievement(
        id: achievement.id,
        title: achievement.title,
        description: achievement.description,
        icon: achievement.icon,
        xpReward: achievement.xpReward,
        rarity: achievement.rarity,
      );
    }

    try {
      final prefs = await SharedPreferences.getInstance();
      final jsonString = prefs.getString(_storageKey);

      if (jsonString != null) {
        final List<dynamic> jsonList = json.decode(jsonString);
        for (final item in jsonList) {
          final id = item['id'] as String;
          if (_achievements.containsKey(id)) {
            _achievements[id]!.isUnlocked = item['isUnlocked'] ?? false;
            if (item['unlockedAt'] != null) {
              _achievements[id]!.unlockedAt = DateTime.parse(
                item['unlockedAt'],
              );
            }
          }
        }
      }
      _isLoaded = true;
    } catch (e) {
      debugPrint('Error loading achievements: $e');
    }
  }

  /// Save achievements to storage
  Future<void> _save() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final jsonList = _achievements.values.map((a) => a.toJson()).toList();
      await prefs.setString(_storageKey, json.encode(jsonList));
    } catch (e) {
      debugPrint('Error saving achievements: $e');
    }
  }

  /// Get all achievements
  List<Achievement> getAll() {
    return _achievements.values.toList();
  }

  /// Get unlocked achievements
  List<Achievement> getUnlocked() {
    return _achievements.values.where((a) => a.isUnlocked).toList();
  }

  /// Get locked achievements
  List<Achievement> getLocked() {
    return _achievements.values.where((a) => !a.isUnlocked).toList();
  }

  /// Unlock an achievement by ID
  Future<Achievement?> unlock(String id) async {
    if (!_isLoaded) await load();

    final achievement = _achievements[id];
    if (achievement != null && !achievement.isUnlocked) {
      achievement.isUnlocked = true;
      achievement.unlockedAt = DateTime.now();
      await _save();

      onAchievementUnlocked?.call(achievement);
      return achievement;
    }
    return null;
  }

  /// Check and unlock achievements based on stats
  Future<List<Achievement>> checkAchievements({
    required int totalQuizzes,
    required int currentStreak,
    required int level,
    required double accuracy,
    bool perfectQuiz = false,
    bool examPassed = false,
  }) async {
    if (!_isLoaded) await load();

    final unlocked = <Achievement>[];

    // First quiz
    if (totalQuizzes >= 1) {
      final a = await unlock('first_quiz');
      if (a != null) unlocked.add(a);
    }

    // Perfect quiz
    if (perfectQuiz) {
      final a = await unlock('perfect_quiz');
      if (a != null) unlocked.add(a);
    }

    // Exam passed
    if (examPassed) {
      final a = await unlock('exam_passed');
      if (a != null) unlocked.add(a);
    }

    // Streaks
    if (currentStreak >= 3) {
      final a = await unlock('streak_3');
      if (a != null) unlocked.add(a);
    }
    if (currentStreak >= 7) {
      final a = await unlock('streak_7');
      if (a != null) unlocked.add(a);
    }
    if (currentStreak >= 30) {
      final a = await unlock('streak_30');
      if (a != null) unlocked.add(a);
    }

    // Levels
    if (level >= 5) {
      final a = await unlock('level_5');
      if (a != null) unlocked.add(a);
    }
    if (level >= 10) {
      final a = await unlock('level_10');
      if (a != null) unlocked.add(a);
    }
    if (level >= 25) {
      final a = await unlock('level_25');
      if (a != null) unlocked.add(a);
    }

    // Quiz count
    if (totalQuizzes >= 10) {
      final a = await unlock('quiz_10');
      if (a != null) unlocked.add(a);
    }
    if (totalQuizzes >= 50) {
      final a = await unlock('quiz_50');
      if (a != null) unlocked.add(a);
    }
    if (totalQuizzes >= 100) {
      final a = await unlock('quiz_100');
      if (a != null) unlocked.add(a);
    }

    // Accuracy
    if (accuracy >= 90) {
      final a = await unlock('accuracy_90');
      if (a != null) unlocked.add(a);
    }

    return unlocked;
  }

  /// Reset all achievements
  Future<void> reset() async {
    for (final achievement in _achievements.values) {
      achievement.isUnlocked = false;
      achievement.unlockedAt = null;
    }
    await _save();
  }

  /// Get achievement count
  int get unlockedCount => getUnlocked().length;
  int get totalCount => _achievements.length;
}
