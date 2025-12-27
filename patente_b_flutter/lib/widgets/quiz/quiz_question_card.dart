import 'package:flutter/material.dart';
import '../../theme/app_theme.dart';

/// Card per domanda quiz con design accessibile
/// Immagine grande, testo leggibile, pulsanti grandi
class QuizQuestionCard extends StatelessWidget {
  final String questionText;
  final String? imageUrl;
  final bool showTranslateButton;
  final VoidCallback? onTranslate;
  final Widget? answerWidget;

  const QuizQuestionCard({
    super.key,
    required this.questionText,
    this.imageUrl,
    this.showTranslateButton = true,
    this.onTranslate,
    this.answerWidget,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Card(
      margin: const EdgeInsets.all(16),
      elevation: 4,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Immagine segnale/situazione
          if (imageUrl != null)
            ClipRRect(
              borderRadius: const BorderRadius.vertical(
                top: Radius.circular(20),
              ),
              child: AspectRatio(
                aspectRatio: 16 / 10,
                child: Image.asset(
                  imageUrl!,
                  fit: BoxFit.contain,
                  errorBuilder: (_, __, ___) => Container(
                    color: theme.colorScheme.surfaceContainerHighest,
                    child: const Center(
                      child: Icon(Icons.image, size: 64, color: Colors.grey),
                    ),
                  ),
                ),
              ),
            ),

          // Testo domanda
          Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Testo domanda - font grande per accessibilità
                    Expanded(
                      child: Text(
                        questionText,
                        style: theme.textTheme.titleLarge?.copyWith(
                          fontWeight: FontWeight.w600,
                          height: 1.4,
                          fontSize: 20, // Min 18sp come da requisiti
                        ),
                      ),
                    ),
                    // Pulsante traduzione
                    if (showTranslateButton)
                      IconButton(
                        onPressed: onTranslate,
                        icon: Container(
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            color: AppTheme.infoPurple.withValues(alpha: 0.15),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: const Icon(
                            Icons.translate,
                            color: AppTheme.infoPurple,
                            size: 24,
                          ),
                        ),
                        tooltip: 'Traduci',
                      ),
                  ],
                ),
                const SizedBox(height: 20),
                // Widget risposta (V/F o multipla)
                if (answerWidget != null) answerWidget!,
              ],
            ),
          ),
        ],
      ),
    );
  }
}

/// Pulsanti risposta Vero/Falso con feedback visivo
class TrueFalseButtons extends StatelessWidget {
  final bool? selectedAnswer;
  final bool? correctAnswer;
  final bool showResult;
  final Function(bool) onAnswer;

  const TrueFalseButtons({
    super.key,
    this.selectedAnswer,
    this.correctAnswer,
    this.showResult = false,
    required this.onAnswer,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: _AnswerButton(
            text: 'VERO',
            icon: Icons.check,
            isTrue: true,
            isSelected: selectedAnswer == true,
            isCorrect: showResult && correctAnswer == true,
            isWrong:
                showResult && selectedAnswer == true && correctAnswer == false,
            onTap: () => onAnswer(true),
          ),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: _AnswerButton(
            text: 'FALSO',
            icon: Icons.close,
            isTrue: false,
            isSelected: selectedAnswer == false,
            isCorrect: showResult && correctAnswer == false,
            isWrong:
                showResult && selectedAnswer == false && correctAnswer == true,
            onTap: () => onAnswer(false),
          ),
        ),
      ],
    );
  }
}

/// Singolo pulsante risposta con animazione feedback
class _AnswerButton extends StatelessWidget {
  final String text;
  final IconData icon;
  final bool isTrue;
  final bool isSelected;
  final bool isCorrect;
  final bool isWrong;
  final VoidCallback onTap;

  const _AnswerButton({
    required this.text,
    required this.icon,
    required this.isTrue,
    required this.isSelected,
    required this.isCorrect,
    required this.isWrong,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    Color bgColor;
    Color fgColor;
    Color borderColor;

    if (isCorrect) {
      bgColor = AppTheme.successGreen;
      fgColor = Colors.white;
      borderColor = AppTheme.successGreen;
    } else if (isWrong) {
      bgColor = AppTheme.errorRed;
      fgColor = Colors.white;
      borderColor = AppTheme.errorRed;
    } else if (isSelected) {
      bgColor = AppTheme.primaryColor.withValues(alpha: 0.2);
      fgColor = AppTheme.primaryColor;
      borderColor = AppTheme.primaryColor;
    } else {
      bgColor = Colors.transparent;
      fgColor = Theme.of(context).colorScheme.onSurface;
      borderColor = Theme.of(context).dividerColor;
    }

    return AnimatedContainer(
      duration: const Duration(milliseconds: 200),
      curve: Curves.easeInOut,
      child: Material(
        color: bgColor,
        borderRadius: BorderRadius.circular(16),
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(16),
          child: Container(
            height: 60, // Min 56dp per accessibilità
            decoration: BoxDecoration(
              border: Border.all(color: borderColor, width: 2),
              borderRadius: BorderRadius.circular(16),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(icon, color: fgColor, size: 28),
                const SizedBox(width: 8),
                Text(
                  text,
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: fgColor,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
