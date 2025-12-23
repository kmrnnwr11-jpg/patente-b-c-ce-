import 'package:flutter/material.dart';
import '../../theme/app_theme.dart';
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
    return Scaffold(
      backgroundColor: AppTheme.backgroundColor,
      body: SafeArea(
        child: Column(
          children: [
            // Header
            _buildHeader(context),

            // Stats Cards
            Padding(
              padding: const EdgeInsets.all(20),
              child: Row(
                children: [
                  Expanded(
                    child: _buildStatCard(
                      'Corrette',
                      correctAnswers.toString(),
                      AppTheme.accentGreen,
                      Icons.check_circle_outline,
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: _buildStatCard(
                      'Errate',
                      wrongAnswers.toString(),
                      AppTheme.accentRed,
                      Icons.highlight_off,
                    ),
                  ),
                ],
              ),
            ),

            // Tabs / Section Title
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Text(
                'Riepilogo Domande',
                style: TextStyle(
                  color: Colors.white,
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
                  final userAnswer = userAnswers[question.id];
                  // If user didn't answer, userAnswer is null.
                  // But usually we answer all in exam.
                  // If skipped, we might treat as wrong or separate.

                  final isCorrect = userAnswer == question.risposta;

                  return _buildReviewCard(question, userAnswer, isCorrect);
                },
              ),
            ),

            // Bottom Buttons
            Container(
              padding: const EdgeInsets.all(20),
              color: AppTheme.cardColor,
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
                        side: BorderSide(color: Colors.white.withOpacity(0.3)),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      child: const Text('Home'),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () {
                        Navigator.pop(context, 'restart');
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.primaryColor,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      child: const Text('Riprova Test'),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHeader(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(30),
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: isPassed
                  ? AppTheme.accentGreen.withOpacity(0.1)
                  : AppTheme.accentRed.withOpacity(0.1),
              shape: BoxShape.circle,
            ),
            child: Icon(
              isPassed ? Icons.emoji_events : Icons.sentiment_dissatisfied,
              size: 60,
              color: isPassed ? AppTheme.accentGreen : AppTheme.accentRed,
            ),
          ),
          const SizedBox(height: 20),
          Text(
            isPassed ? 'Esame Superato!' : 'Non Superato',
            style: TextStyle(
              fontSize: 28,
              fontWeight: FontWeight.bold,
              color: isPassed ? AppTheme.accentGreen : AppTheme.accentRed,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            isPassed
                ? 'Ottimo lavoro! Continua così.'
                : 'Non mollare! Riprova e andrà meglio.',
            style: TextStyle(
              color: Colors.white.withOpacity(0.7),
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
  ) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.cardColor,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: color.withOpacity(0.3)),
      ),
      child: Column(
        children: [
          Icon(icon, color: color, size: 28),
          const SizedBox(height: 8),
          Text(
            value,
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
          Text(
            label,
            style: TextStyle(
              color: Colors.white.withOpacity(0.6),
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
  ) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.cardColor,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: isCorrect
              ? AppTheme.accentGreen.withOpacity(0.3)
              : AppTheme.accentRed.withOpacity(0.3),
        ),
      ),
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
                      ? AppTheme.accentGreen.withOpacity(0.1)
                      : AppTheme.accentRed.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Icon(
                  isCorrect ? Icons.check : Icons.close,
                  size: 16,
                  color: isCorrect ? AppTheme.accentGreen : AppTheme.accentRed,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Text(
                  question.domanda,
                  style: const TextStyle(color: Colors.white, fontSize: 14),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          // Show user answer vs correct answer
          Row(
            children: [
              _buildAnswerBadge(
                'La tua risposta: ${userAnswer == true ? "Vero" : "Falso"}',
                isCorrect,
              ),
              const Spacer(),
              if (!isCorrect)
                Text(
                  'Corretta: ${question.risposta ? "Vero" : "Falso"}',
                  style: TextStyle(
                    color: AppTheme.accentGreen,
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

  Widget _buildAnswerBadge(String text, bool isCorrect) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: isCorrect
            ? AppTheme.accentGreen.withOpacity(0.1)
            : AppTheme.accentRed.withOpacity(0.1),
        borderRadius: BorderRadius.circular(6),
      ),
      child: Text(
        text,
        style: TextStyle(
          color: isCorrect ? AppTheme.accentGreen : AppTheme.accentRed,
          fontSize: 12,
          fontWeight: FontWeight.w500,
        ),
      ),
    );
  }
}
