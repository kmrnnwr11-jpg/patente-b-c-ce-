import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/foundation.dart';
import '../models/user_model.dart';
import '../services/auth_service.dart';

class GamificationService {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  final AuthService _authService = AuthService();

  // --- CONFIGURAZIONE ---

  static const Map<String, int> xpConfig = {
    'quiz_completed': 5,
    'quiz_perfect': 20,
    'quiz_good': 10,
    'correct_answer': 1,
    'simulation_completed': 10,
    'simulation_passed': 30,
    'simulation_perfect': 50,
    'streak_day': 5,
    'daily_bonus': 10,
    'referral_qualified': 100,
    'video_watched': 10,
  };

  static const List<Map<String, dynamic>> levelsConfig = [
    {
      'level': 1,
      'name': 'Principiante',
      'min_xp': 0,
      'max_xp': 99,
      'icon': '🌱',
    },
    {
      'level': 2,
      'name': 'Apprendista',
      'min_xp': 100,
      'max_xp': 299,
      'icon': '📚',
    },
    {
      'level': 3,
      'name': 'Studente',
      'min_xp': 300,
      'max_xp': 599,
      'icon': '✏️',
    },
    {
      'level': 4,
      'name': 'Praticante',
      'min_xp': 600,
      'max_xp': 999,
      'icon': '🎯',
    },
    {
      'level': 5,
      'name': 'Esperto',
      'min_xp': 1000,
      'max_xp': 1499,
      'icon': '⭐',
    },
    {
      'level': 6,
      'name': 'Veterano',
      'min_xp': 1500,
      'max_xp': 2199,
      'icon': '🏅',
    },
    {
      'level': 7,
      'name': 'Maestro',
      'min_xp': 2200,
      'max_xp': 2999,
      'icon': '🎖️',
    },
    {
      'level': 8,
      'name': 'Campione',
      'min_xp': 3000,
      'max_xp': 3999,
      'icon': '🏆',
    },
    {
      'level': 9,
      'name': 'Leggenda',
      'min_xp': 4000,
      'max_xp': 5499,
      'icon': '👑',
    },
    {
      'level': 10,
      'name': 'Dio della Patente',
      'min_xp': 5500,
      'max_xp': 999999,
      'icon': '🔱',
    },
  ];

  static Map<String, dynamic> getLevelInfo(int level) {
    return levelsConfig.firstWhere(
      (l) => l['level'] == level,
      orElse: () => levelsConfig.first,
    );
  }

  // --- XP SYSTEM ---

  Future<void> awardXP(
    String userId,
    String reason, {
    Map<String, dynamic>? details,
  }) async {
    try {
      final userDoc = await _firestore.collection('users').doc(userId).get();
      if (!userDoc.exists) return;

      final userData = userDoc.data()!;
      int currentTotalXp = userData['totalXp'] ?? 0;
      int currentStreak = userData['currentStreak'] ?? 0;
      int currentLevel = userData['currentLevel'] ?? 1;

      // 1. Calculate XP amount
      int baseXP = xpConfig[reason] ?? 0;
      double multiplier = _getStreakMultiplier(currentStreak);
      int finalXP = (baseXP * multiplier).round();

      if (finalXP <= 0) return;

      // 2. Update User Stats
      int newTotalXp = currentTotalXp + finalXP;

      // 3. Check Level Up
      int newLevel = _checkLevel(newTotalXp);
      bool levelUp = newLevel > currentLevel;

      Map<String, dynamic> updates = {
        'totalXp': newTotalXp,
        'currentLevel': newLevel,
        // Update daily/weekly stats if implemented separately
      };

      await _firestore.collection('users').doc(userId).update(updates);

      // 4. Log Transaction
      await _firestore
          .collection('users')
          .doc(userId)
          .collection('xp_history')
          .add({
            'amount': finalXP,
            'reason': reason,
            'details': details,
            'multiplier': multiplier,
            'timestamp': FieldValue.serverTimestamp(),
          });

      if (levelUp) {
        // Trigger generic notification or event (handled by UI listener usually)
        debugPrint('LEVEL UP: User $userId reached level $newLevel');
      }
    } catch (e) {
      debugPrint('Error awarding XP: $e');
    }
  }

  int _checkLevel(int totalXp) {
    // Find the highest level where min_xp <= totalXp
    for (int i = levelsConfig.length - 1; i >= 0; i--) {
      if (totalXp >= (levelsConfig[i]['min_xp'] as int)) {
        return levelsConfig[i]['level'] as int;
      }
    }
    return 1;
  }

  double _getStreakMultiplier(int streak) {
    if (streak >= 100) return 3.0;
    if (streak >= 60) return 2.5;
    if (streak >= 30) return 2.0;
    if (streak >= 14) return 1.75;
    if (streak >= 7) return 1.5;
    return 1.0;
  }

  // --- STREAK SYSTEM ---

  Future<void> updateStreak(String userId) async {
    try {
      final userDoc = await _firestore.collection('users').doc(userId).get();
      if (!userDoc.exists) return;

      final data = userDoc.data()!;
      final lastActivityTimestamp = data['lastActivityDate'] as Timestamp?;
      final currentStreak = data['currentStreak'] as int? ?? 0;
      final streakFreeze = data['streakFreezeAvailable'] as int? ?? 0;

      final now = DateTime.now();
      final today = DateTime(now.year, now.month, now.day);

      if (lastActivityTimestamp != null) {
        final lastDate = lastActivityTimestamp.toDate();
        final lastActivityDay = DateTime(
          lastDate.year,
          lastDate.month,
          lastDate.day,
        );

        // If already active today, do nothing
        if (lastActivityDay.isAtSameMomentAs(today)) return;

        final difference = today.difference(lastActivityDay).inDays;

        if (difference == 1) {
          // Consecutive day: Increment streak
          await _firestore.collection('users').doc(userId).update({
            'currentStreak': currentStreak + 1,
            'longestStreak': (currentStreak + 1 > (data['longestStreak'] ?? 0))
                ? currentStreak + 1
                : data['longestStreak'],
            'lastActivityDate': FieldValue.serverTimestamp(),
          });
          // Award daily streak XP
          await awardXP(userId, 'streak_day');
        } else if (difference > 1) {
          // Missed a day(s)
          if (streakFreeze > 0) {
            // Use freeze
            await _firestore.collection('users').doc(userId).update({
              'streakFreezeAvailable': streakFreeze - 1,
              'lastActivityDate': FieldValue.serverTimestamp(),
              // Maintain streak (don't increment, don't reset)
            });
            // Notify user streak was saved?
          } else {
            // Reset streak
            await _firestore.collection('users').doc(userId).update({
              'currentStreak': 1,
              'lastActivityDate': FieldValue.serverTimestamp(),
            });
            await awardXP(userId, 'streak_day'); // New streak starts
          }
        }
      } else {
        // First activity ever
        await _firestore.collection('users').doc(userId).update({
          'currentStreak': 1,
          'longestStreak': 1,
          'lastActivityDate': FieldValue.serverTimestamp(),
        });
        await awardXP(userId, 'streak_day');
      }
    } catch (e) {
      debugPrint('Error updating streak: $e');
    }
  }

  // --- REFERRAL SYSTEM ---

  Future<String> generateReferralCode(String userId, String userName) async {
    // Check if exists
    final userDoc = await _firestore.collection('users').doc(userId).get();
    if (userDoc.exists && userDoc.data()!['referralCode'] != null) {
      return userDoc.data()!['referralCode'];
    }

    // Generate: MARIO123
    String base = userName.trim().toUpperCase().replaceAll(
      RegExp(r'[^A-Z]'),
      '',
    );
    if (base.length > 5) base = base.substring(0, 5);
    if (base.isEmpty) base = 'USER';

    // Add random suffix
    String code =
        '$base${DateTime.now().millisecondsSinceEpoch.remainder(1000)}';

    // Save (ideally check uniqueness, but collision rare for now)
    await _firestore.collection('users').doc(userId).update({
      'referralCode': code,
    });

    return code;
  }
}
