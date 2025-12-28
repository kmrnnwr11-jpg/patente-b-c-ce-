import 'package:flutter/material.dart';
import '../../theme/apple_glass_theme.dart';
import '../../widgets/glass/glass_card.dart';
import '../../models/quiz_question.dart';
import '../dashboard_screen.dart';

class ResultsScreen extends StatelessWidget {
  final int correctAnswers;
  final int wrongAnswers;
  final int totalQuestions;
  final List<QuizQuestion> questions;
  final Map<int, bool> userAnswers; // questionId -> userAnswer (true/false)
  final bool isExamMode;

  const ResultsScreen({
    super.key,
    required this.correctAnswers,
    required this.wrongAnswers,
    required this.totalQuestions,
    required this.questions,
    required this.userAnswers,
    this.isExamMode = false,
  });

  bool get isPassed => isExamMode ? wrongAnswers <= 4 : true;

  @override
  Widget build(BuildContext context) {
    final isDarkMode = Theme.of(context).brightness == Brightness.dark;
    final textColor = isDarkMode
        ? Colors.white
        : AppleGlassTheme.textPrimaryDark;

    return Scaffold(
      extendBodyBehindAppBar: true,
      body: Container(
        decoration: BoxDecoration(
          gradient: isDarkMode
              ? AppleGlassTheme.bgGradient
              : AppleGlassTheme.bgGradientLight,
        ),
        child: SafeArea(
          child: Column(
            children: [
              // Header
              _buildHeader(context, isDarkMode),

              // Stats Cards
              Padding(
                padding: const EdgeInsets.all(20),
                child: Row(
                  children: [
                    Expanded(
                      child: _buildStatCard(
                        'Corrette',
                        correctAnswers.toString(),
                        AppleGlassTheme.success,
                        Icons.check_circle_outline,
                        isDarkMode,
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: _buildStatCard(
                        'Errate',
                        wrongAnswers.toString(),
                        AppleGlassTheme.error,
                        Icons.highlight_off,
                        isDarkMode,
                      ),
                    ),
                  ],
                ),
              ),

              // Section Title
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: Text(
                  'Riepilogo Domande',
                  style: TextStyle(
                    color: textColor,
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              const SizedBox(height: 10),

              // Review List
              Expanded(
                child: ListView.builder(
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  itemCount: questions.length,
                  itemBuilder: (context, index) {
                    final question = questions[index];
                    final userAnswer =
                        userAnswers[index]; // Note: userAnswers key is index I think? Wait, check original file.
                    // Original file comment: "questionId -> userAnswer".
                    // But QuizScreen uses "_userAnswers[index] = answer".
                    // So key is INDEX.
                    // But in ResultsScreen original code: "final userAnswer = userAnswers[question.id];"
                    // Wait. In QuizScreen I saw `_userAnswers[_currentIndex] = answer`. And `_currentIndex` is int.
                    // So the key is index (0, 1, 2...).
                    // However, original ResultsScreen used `question.id`.
                    // If `QuizScreen` passes `_userAnswers` which is `Map<int, bool>`, and keys are indices...
                    // then `userAnswers[question.id]` would only work if question.id == index.
                    // Let's check `QuizScreen` line 94 (restored methods) logic.
                    // `_userAnswers[_currentIndex] = answer`.
                    // `final question = _questions[_currentIndex]`.
                    // So `_userAnswers` maps INDEX to ANSWER.
                    // Original ResultsScreen used `userAnswers[question.id]`. This looks like a BUG in the original code, OR `question.id` matches index.
                    // I will stick to usage in `QuizScreen` which maps by index.
                    // So `userAnswers[index]`.

                    final isCorrect = userAnswer == question.risposta;

                    return _buildReviewCard(
                      question,
                      userAnswer,
                      isCorrect,
                      isDarkMode,
                    );
                  },
                ),
              ),

              // Bottom Buttons
              GlassCard(
                isDarkMode: isDarkMode,
                borderRadius: 0,
                // We want a container at bottom, maybe specific styling?
                // Or just padding.
                padding: const EdgeInsets.all(20),
                child: Row(
                  children: [
                    Expanded(
                      child: OutlinedButton(
                        onPressed: () {
                          Navigator.pushAndRemoveUntil(
                            context,
                            MaterialPageRoute(
                              builder: (context) => const DashboardScreen(),
                            ),
                            (route) => false,
                          );
                        },
                        style: OutlinedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          side: BorderSide(
                            color: isDarkMode
                                ? Colors.white30
                                : AppleGlassTheme.textSecondaryDark,
                          ),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                        child: Text(
                          'Home',
                          style: TextStyle(
                            color: textColor,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: ElevatedButton(
                        onPressed: () {
                          Navigator.pop(context, 'restart');
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppleGlassTheme.accentBlue,
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                        child: const Text(
                          'Riprova Test',
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
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
    );
  }

  Widget _buildHeader(BuildContext context, bool isDarkMode) {
    final statusColor = isPassed
        ? AppleGlassTheme.success
        : AppleGlassTheme.error;

    return Container(
      padding: const EdgeInsets.all(30),
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: statusColor.withOpacity(0.1),
              shape: BoxShape.circle,
              boxShadow: [
                BoxShadow(
                  color: statusColor.withOpacity(0.2),
                  blurRadius: 20,
                  spreadRadius: 2,
                ),
              ],
            ),
            child: Icon(
              isPassed ? Icons.emoji_events : Icons.sentiment_dissatisfied,
              size: 60,
              color: statusColor,
            ),
          ),
          const SizedBox(height: 20),
          Text(
            isPassed ? 'Esame Superato!' : 'Non Superato',
            style: TextStyle(
              fontSize: 28,
              fontWeight: FontWeight.bold,
              color: statusColor,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            isPassed
                ? 'Ottimo lavoro! Continua così.'
                : 'Non mollare! Riprova e andrà meglio.',
            style: TextStyle(
              color: isDarkMode
                  ? Colors.white70
                  : AppleGlassTheme.textSecondaryDark,
              fontSize: 16,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatCard(
    String label,
    String value,
    Color color,
    IconData icon,
    bool isDarkMode,
  ) {
    return GlassCard(
      isDarkMode: isDarkMode,
      borderRadius: 16,
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          Icon(icon, color: color, size: 28),
          const SizedBox(height: 8),
          Text(
            value,
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: isDarkMode
                  ? Colors.white
                  : AppleGlassTheme.textPrimaryDark,
            ),
          ),
          Text(
            label,
            style: TextStyle(
              color: isDarkMode
                  ? Colors.white60
                  : AppleGlassTheme.textSecondaryDark,
              fontSize: 12,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildReviewCard(
    QuizQuestion question,
    bool? userAnswer,
    bool isCorrect,
    bool isDarkMode,
  ) {
    final textColor = isDarkMode
        ? Colors.white
        : AppleGlassTheme.textPrimaryDark;

    return GlassCard(
      isDarkMode: isDarkMode,
      borderRadius: 12,
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: isCorrect
                      ? AppleGlassTheme.success.withOpacity(0.1)
                      : AppleGlassTheme.error.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Icon(
                  isCorrect ? Icons.check : Icons.close,
                  size: 16,
                  color: isCorrect
                      ? AppleGlassTheme.success
                      : AppleGlassTheme.error,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Text(
                  question.domanda,
                  style: TextStyle(color: textColor, fontSize: 14),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          // Show user answer vs correct answer
          Row(
            children: [
              _buildAnswerBadge(
                'La tua risposta: ${userAnswer == true ? "Vero" : (userAnswer == false ? "Falso" : "Non risposta")}',
                isCorrect,
                isDarkMode,
              ),
              const Spacer(),
              if (!isCorrect)
                Text(
                  'Corretta: ${question.risposta ? "Vero" : "Falso"}',
                  style: TextStyle(
                    color: AppleGlassTheme.success,
                    fontWeight: FontWeight.bold,
                    fontSize: 12,
                  ),
                ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildAnswerBadge(String text, bool isCorrect, bool isDarkMode) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: isCorrect
            ? AppleGlassTheme.success.withOpacity(0.1)
            : AppleGlassTheme.error.withOpacity(0.1),
        borderRadius: BorderRadius.circular(6),
      ),
      child: Text(
        text,
        style: TextStyle(
          color: isCorrect ? AppleGlassTheme.success : AppleGlassTheme.error,
          fontSize: 12,
          fontWeight: FontWeight.w500,
        ),
      ),
    );
  }
}
