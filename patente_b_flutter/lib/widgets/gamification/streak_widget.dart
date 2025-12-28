import 'package:flutter/material.dart';

class StreakWidget extends StatelessWidget {
  final int currentStreak;
  final bool todayCompleted;
  final double multiplier;

  const StreakWidget({
    Key? key,
    required this.currentStreak,
    required this.todayCompleted,
    required this.multiplier,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: todayCompleted
              ? [Colors.orange.shade600, Colors.red.shade600]
              : [Colors.grey.shade600, Colors.grey.shade800],
        ),
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: (todayCompleted ? Colors.orange : Colors.grey).withOpacity(
              0.3,
            ),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        children: [
          // Icona fuoco animata
          TweenAnimationBuilder<double>(
            tween: Tween(begin: 0.9, end: 1.1),
            duration: const Duration(milliseconds: 1000),
            curve: Curves.easeInOut,
            builder: (context, scale, child) {
              return Transform.scale(
                scale: todayCompleted ? scale : 1.0,
                child: const Text('🔥', style: TextStyle(fontSize: 48)),
              );
            },
            onEnd: () {}, // Loop handled by parent usually, simple pulse here
          ),
          const SizedBox(width: 16),

          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  '$currentStreak giorni',
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 28,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                if (todayCompleted)
                  const Text(
                    'Streak mantenuto! ✓',
                    style: TextStyle(color: Colors.white70),
                  )
                else
                  const Text(
                    'Completa un quiz per mantenere lo streak!',
                    style: TextStyle(color: Colors.yellowAccent, fontSize: 13),
                  ),
              ],
            ),
          ),

          // Moltiplicatore
          if (multiplier > 1.0)
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
              ),
              child: Text(
                '${multiplier}x XP',
                style: const TextStyle(
                  color: Colors.orange,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
        ],
      ),
    );
  }
}
