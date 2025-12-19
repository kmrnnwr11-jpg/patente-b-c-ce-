import 'package:flutter/material.dart';
import '../../models/quiz_question.dart';
import '../../models/translation.dart';
import '../../services/quiz_service.dart';
import '../../services/bookmark_service.dart';
import '../../services/stats_service.dart';
import '../../services/achievement_service.dart';
import '../../theme/app_theme.dart';
import '../../widgets/audio/audio_button.dart';
import '../../widgets/translation/language_selector.dart';

enum QuizMode { quick, exam, topic }

/// Quiz screen with question display and answer handling
class QuizScreen extends StatefulWidget {
  final QuizMode mode;
  final String? topic;

  const QuizScreen({super.key, required this.mode, this.topic});

  @override
  State<QuizScreen> createState() => _QuizScreenState();
}

class _QuizScreenState extends State<QuizScreen> {
  final QuizService _quizService = QuizService();
  final BookmarkService _bookmarkService = BookmarkService();
  final StatsService _statsService = StatsService();
  final AchievementService _achievementService = AchievementService();

  List<QuizQuestion> _questions = [];
  int _currentIndex = 0;
  int _correctAnswers = 0;
  int _wrongAnswers = 0;
  bool _isLoading = true;
  bool? _selectedAnswer;
  bool _showResult = false;

  AppLanguage _selectedLanguage = AppLanguage.italian;
  Set<int> _bookmarkedIds = {};

  @override
  void initState() {
    super.initState();
    _loadQuestions();
    _loadServices();
  }

  Future<void> _loadServices() async {
    await _bookmarkService.load();
    await _statsService.load();
    await _achievementService.load();

    // Get already bookmarked question IDs
    final bookmarks = _bookmarkService.getAllBookmarks();
    setState(() {
      _bookmarkedIds = bookmarks.map((b) => b.questionId).toSet();
    });
  }

  Future<void> _loadQuestions() async {
    await _quizService.loadQuestions();

    List<QuizQuestion> questions;
    switch (widget.mode) {
      case QuizMode.quick:
        questions = _quizService.getRandomQuestions(10);
        break;
      case QuizMode.exam:
        questions = _quizService.getExamQuestions();
        break;
      case QuizMode.topic:
        questions = widget.topic != null
            ? _quizService.getByTopic(widget.topic!)
            : _quizService.getRandomQuestions(10);
        break;
    }

    setState(() {
      _questions = questions;
      _isLoading = false;
    });
  }

  void _answerQuestion(bool answer) {
    if (_showResult) return;

    setState(() {
      _selectedAnswer = answer;
      _showResult = true;

      if (answer == _questions[_currentIndex].risposta) {
        _correctAnswers++;
      } else {
        _wrongAnswers++;
      }

      // Record answer for stats tracking
      final question = _questions[_currentIndex];
      _statsService.recordAnswer(
        topic: question.argomento,
        correct: answer == question.risposta,
      );
    });
  }

  /// Toggle bookmark for current question
  Future<void> _toggleBookmark(QuizQuestion question) async {
    await _bookmarkService.toggleBookmark(
      questionId: question.id,
      question: question.domanda,
      topic: question.argomento,
    );

    setState(() {
      if (_bookmarkedIds.contains(question.id)) {
        _bookmarkedIds.remove(question.id);
      } else {
        _bookmarkedIds.add(question.id);
      }
    });
  }

  void _nextQuestion() {
    if (_currentIndex < _questions.length - 1) {
      setState(() {
        _currentIndex++;
        _selectedAnswer = null;
        _showResult = false;
      });
    } else {
      _showFinalResults();
    }
  }

  void _showFinalResults() async {
    // Record quiz completion and get XP
    final bool examPassed = widget.mode == QuizMode.exam && _wrongAnswers <= 4;
    final bool perfectQuiz = _wrongAnswers == 0;

    final xpEarned = await _statsService.recordQuizCompleted(
      correct: _correctAnswers,
      wrong: _wrongAnswers,
      mode: widget.mode.name,
    );

    // Check for new achievements
    final stats = _statsService.stats;
    final newAchievements = await _achievementService.checkAchievements(
      totalQuizzes: stats.totalQuizzes,
      currentStreak: stats.currentStreak,
      level: stats.level,
      accuracy: stats.accuracy,
      perfectQuiz: perfectQuiz,
      examPassed: examPassed,
    );

    // Add achievement XP
    for (final achievement in newAchievements) {
      await _statsService.addXp(achievement.xpReward);
    }

    if (!mounted) return;

    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => AlertDialog(
        backgroundColor: AppTheme.surfaceColor,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: Text(
          _wrongAnswers <= 4 ? '🎉 Superato!' : '😔 Non superato',
          textAlign: TextAlign.center,
          style: const TextStyle(fontSize: 24),
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              'Risposte corrette: $_correctAnswers',
              style: const TextStyle(color: AppTheme.accentGreen, fontSize: 18),
            ),
            const SizedBox(height: 8),
            Text(
              'Risposte errate: $_wrongAnswers',
              style: const TextStyle(color: AppTheme.accentRed, fontSize: 18),
            ),
            const SizedBox(height: 16),
            Text(
              widget.mode == QuizMode.exam
                  ? 'Max 4 errori per passare'
                  : 'Continua a studiare!',
              style: const TextStyle(color: AppTheme.textSecondary),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.of(context).pop();
              Navigator.of(context).pop();
            },
            child: const Text('Torna alla Home'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.of(context).pop();
              setState(() {
                _currentIndex = 0;
                _correctAnswers = 0;
                _wrongAnswers = 0;
                _selectedAnswer = null;
                _showResult = false;
              });
              _loadQuestions();
            },
            child: const Text('Riprova'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return Scaffold(
        appBar: AppBar(title: const Text('Caricamento...')),
        body: const Center(child: CircularProgressIndicator()),
      );
    }

    if (_questions.isEmpty) {
      return Scaffold(
        appBar: AppBar(title: const Text('Quiz')),
        body: const Center(child: Text('Nessuna domanda trovata')),
      );
    }

    final question = _questions[_currentIndex];
    final isCorrect = _selectedAnswer == question.risposta;

    return Scaffold(
      appBar: AppBar(
        title: Text(_getTitle()),
        actions: [
          Center(
            child: Padding(
              padding: const EdgeInsets.only(right: 16),
              child: Text(
                '${_currentIndex + 1}/${_questions.length}',
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ),
        ],
      ),
      body: SafeArea(
        child: Column(
          children: [
            // Progress bar
            LinearProgressIndicator(
              value: (_currentIndex + 1) / _questions.length,
              backgroundColor: AppTheme.cardColor,
              valueColor: const AlwaysStoppedAnimation<Color>(
                AppTheme.primaryColor,
              ),
            ),

            // Score display
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  _buildScoreBadge(
                    icon: Icons.check_circle,
                    count: _correctAnswers,
                    color: AppTheme.accentGreen,
                  ),
                  const SizedBox(width: 24),
                  _buildScoreBadge(
                    icon: Icons.cancel,
                    count: _wrongAnswers,
                    color: AppTheme.accentRed,
                  ),
                ],
              ),
            ),

            // Question content
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    // Image if present
                    if (question.immagine != null) ...[
                      Container(
                        height: 180,
                        decoration: BoxDecoration(
                          color: AppTheme.cardColor,
                          borderRadius: BorderRadius.circular(16),
                        ),
                        child: ClipRRect(
                          borderRadius: BorderRadius.circular(16),
                          child: Image.asset(
                            'assets${question.immagine}',
                            fit: BoxFit.contain,
                            errorBuilder: (context, error, stackTrace) {
                              return const Center(
                                child: Icon(
                                  Icons.image_not_supported,
                                  size: 48,
                                ),
                              );
                            },
                          ),
                        ),
                      ),
                      const SizedBox(height: 20),
                    ],

                    // Question text
                    Container(
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        color: AppTheme.surfaceColor,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: AppTheme.cardColor),
                      ),
                      child: Column(
                        children: [
                          // Controls row
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              // Language selector
                              LanguageSelector(
                                currentLanguage: _selectedLanguage,
                                onLanguageChanged: (lang) {
                                  setState(() => _selectedLanguage = lang);
                                },
                                compact: true,
                              ),

                              // Audio and Bookmark buttons
                              Row(
                                children: [
                                  // Audio button
                                  InlineAudioButton(
                                    text: question.domanda,
                                    language: _selectedLanguage,
                                  ),
                                  const SizedBox(width: 8),
                                  // Bookmark button
                                  IconButton(
                                    onPressed: () => _toggleBookmark(question),
                                    icon: Icon(
                                      _bookmarkedIds.contains(question.id)
                                          ? Icons.bookmark
                                          : Icons.bookmark_border,
                                      color:
                                          _bookmarkedIds.contains(question.id)
                                          ? Colors.amber
                                          : Colors.grey,
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                          const SizedBox(height: 16),
                          // Question text
                          Text(
                            question.domanda,
                            style: const TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.w500,
                              height: 1.5,
                            ),
                            textAlign: TextAlign.center,
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 24),

                    // Answer buttons
                    Row(
                      children: [
                        Expanded(
                          child: _buildAnswerButton(
                            label: 'VERO',
                            value: true,
                            isSelected: _selectedAnswer == true,
                            isCorrectAnswer: question.risposta == true,
                          ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: _buildAnswerButton(
                            label: 'FALSO',
                            value: false,
                            isSelected: _selectedAnswer == false,
                            isCorrectAnswer: question.risposta == false,
                          ),
                        ),
                      ],
                    ),

                    // Result feedback
                    if (_showResult) ...[
                      const SizedBox(height: 20),
                      Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: isCorrect
                              ? AppTheme.accentGreen.withOpacity(0.15)
                              : AppTheme.accentRed.withOpacity(0.15),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(
                            color: isCorrect
                                ? AppTheme.accentGreen
                                : AppTheme.accentRed,
                            width: 1,
                          ),
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(
                              isCorrect ? Icons.check_circle : Icons.cancel,
                              color: isCorrect
                                  ? AppTheme.accentGreen
                                  : AppTheme.accentRed,
                            ),
                            const SizedBox(width: 8),
                            Text(
                              isCorrect
                                  ? 'Risposta corretta!'
                                  : 'Risposta errata!',
                              style: TextStyle(
                                color: isCorrect
                                    ? AppTheme.accentGreen
                                    : AppTheme.accentRed,
                                fontWeight: FontWeight.bold,
                                fontSize: 16,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ],
                ),
              ),
            ),

            // Next button
            if (_showResult)
              Padding(
                padding: const EdgeInsets.all(20),
                child: SizedBox(
                  width: double.infinity,
                  height: 56,
                  child: ElevatedButton(
                    onPressed: _nextQuestion,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppTheme.primaryColor,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                    ),
                    child: Text(
                      _currentIndex < _questions.length - 1
                          ? 'Prossima Domanda'
                          : 'Vedi Risultati',
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildScoreBadge({
    required IconData icon,
    required int count,
    required Color color,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: BoxDecoration(
        color: color.withOpacity(0.15),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Row(
        children: [
          Icon(icon, color: color, size: 20),
          const SizedBox(width: 8),
          Text(
            count.toString(),
            style: TextStyle(
              color: color,
              fontWeight: FontWeight.bold,
              fontSize: 16,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAnswerButton({
    required String label,
    required bool value,
    required bool isSelected,
    required bool isCorrectAnswer,
  }) {
    Color backgroundColor;
    Color borderColor;
    Color textColor;

    if (_showResult) {
      if (isCorrectAnswer) {
        backgroundColor = AppTheme.accentGreen.withOpacity(0.2);
        borderColor = AppTheme.accentGreen;
        textColor = AppTheme.accentGreen;
      } else if (isSelected && !isCorrectAnswer) {
        backgroundColor = AppTheme.accentRed.withOpacity(0.2);
        borderColor = AppTheme.accentRed;
        textColor = AppTheme.accentRed;
      } else {
        backgroundColor = AppTheme.cardColor;
        borderColor = AppTheme.cardColor;
        textColor = AppTheme.textSecondary;
      }
    } else {
      backgroundColor = value
          ? AppTheme.accentGreen.withOpacity(0.1)
          : AppTheme.accentRed.withOpacity(0.1);
      borderColor = value
          ? AppTheme.accentGreen.withOpacity(0.3)
          : AppTheme.accentRed.withOpacity(0.3);
      textColor = value ? AppTheme.accentGreen : AppTheme.accentRed;
    }

    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: _showResult ? null : () => _answerQuestion(value),
        borderRadius: BorderRadius.circular(16),
        child: Container(
          height: 64,
          decoration: BoxDecoration(
            color: backgroundColor,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: borderColor, width: 2),
          ),
          child: Center(
            child: Text(
              label,
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: textColor,
              ),
            ),
          ),
        ),
      ),
    );
  }

  String _getTitle() {
    switch (widget.mode) {
      case QuizMode.quick:
        return 'Quiz Veloce';
      case QuizMode.exam:
        return 'Simulazione Esame';
      case QuizMode.topic:
        return widget.topic ?? 'Quiz per Argomento';
    }
  }
}
