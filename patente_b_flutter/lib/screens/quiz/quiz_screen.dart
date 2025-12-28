import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'dart:ui'; // For blur
import '../../models/quiz_question.dart';
import '../../models/translation.dart';
import '../../services/quiz_service.dart';
import '../../services/bookmark_service.dart';
import '../../services/stats_service.dart';
import '../../services/achievement_service.dart';
import '../../services/translation_service.dart';
import '../../services/language_preference_service.dart';
import 'package:provider/provider.dart';
import '../../services/course_service.dart';
import '../../theme/app_theme.dart';
import '../../theme/apple_glass_theme.dart'; // Glass Theme
import '../../widgets/glass/glass_card.dart'; // Glass Card
import '../../widgets/common/theme_toggle_button.dart';

import '../../widgets/audio/audio_button.dart';
import '../../widgets/translation/language_selector.dart';
import '../../widgets/translation/hover_translation_text.dart';

enum QuizMode { quick, exam, topic, errors }

/// Quiz screen with question display and answer handling
class QuizScreen extends StatefulWidget {
  final QuizMode mode;
  final String? topic;

  const QuizScreen({super.key, required this.mode, this.topic});

  @override
  State<QuizScreen> createState() => _QuizScreenState();
}

class _QuizScreenState extends State<QuizScreen> {
  // ... existing state variables ...
  late QuizService _quizService;
  late BookmarkService _bookmarkService;
  late StatsService _statsService;
  late AchievementService _achievementService;
  late TranslationService _translationService;
  late LanguagePreferenceService _languagePreferenceService;

  List<QuizQuestion> _questions = [];
  int _currentIndex = 0;
  int _correctAnswers = 0;
  int _wrongAnswers = 0;
  bool _isLoading = true;

  // Track answers for each question (key = question index, value = user's answer)
  final Map<int, bool> _userAnswers = {};

  AppLanguage _selectedLanguage = AppLanguage.italian;
  Set<int> _bookmarkedIds = {};
  bool _showTranslation = false;

  // Answer feedback overlay
  bool _showAnswerOverlay = false;
  bool? _lastAnswerCorrect;

  // Quiz preferences
  bool _instantCorrection = true; // Show correct/wrong immediately
  bool _translationsEnabled = true; // Enable translations
  bool _preferencesShown = false; // Track if dialog was shown

  @override
  void initState() {
    super.initState();
    _languagePreferenceService = LanguagePreferenceService();

    // Defer loading to didChangeDependencies
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted) {
        _loadServices();
        _loadQuestions();
        if (!_preferencesShown) {
          _showQuizPreferencesDialog();
        }
      }
    });
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _quizService = context.read<QuizService>();
    _bookmarkService = context.read<BookmarkService>();
    _statsService = context.read<StatsService>();
    _achievementService = context.read<AchievementService>();
    _translationService = context.read<TranslationService>();
  }

  /// Show quiz preferences dialog at start
  void _showQuizPreferencesDialog() {
    _preferencesShown = true;

    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) {
        bool tempInstantCorrection = _instantCorrection;

        return StatefulBuilder(
          builder: (context, setDialogState) {
            final isDarkMode = Theme.of(context).brightness == Brightness.dark;
            final dialogBgColor = isDarkMode
                ? const Color(0xFF2C2C2E)
                : Colors.white;
            final textColor = isDarkMode ? Colors.white : Colors.black87;
            final secondaryTextColor = isDarkMode
                ? Colors.white70
                : Colors.black54;

            return AlertDialog(
              backgroundColor: dialogBgColor,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(24),
              ),
              contentPadding: const EdgeInsets.all(24),
              content: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Theme.of(context).primaryColor.withOpacity(0.1),
                      shape: BoxShape.circle,
                    ),
                    child: Icon(
                      Icons.quiz_outlined,
                      size: 48,
                      color: Theme.of(context).primaryColor,
                    ),
                  ),
                  const SizedBox(height: 20),
                  Text(
                    'Modalità Correzione',
                    style: TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                      color: textColor,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    _getPreferenceTranslation(_selectedLanguage),
                    style: TextStyle(fontSize: 14, color: secondaryTextColor),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 24),
                  _buildCorrectionOption(
                    context: context,
                    icon: Icons.flash_on,
                    iconColor: Colors.amber,
                    title: 'Risposta Istantanea',
                    subtitle: 'Vedi subito se hai risposto correttamente',
                    isSelected: tempInstantCorrection,
                    textColor: textColor,
                    secondaryTextColor: secondaryTextColor,
                    onTap: () {
                      setDialogState(() => tempInstantCorrection = true);
                    },
                  ),
                  const SizedBox(height: 12),
                  _buildCorrectionOption(
                    context: context,
                    icon: Icons.flag_outlined,
                    iconColor: Colors.green,
                    title: 'Fine del Quiz',
                    subtitle: 'Tutte le risposte dopo 30 domande',
                    isSelected: !tempInstantCorrection,
                    textColor: textColor,
                    secondaryTextColor: secondaryTextColor,
                    onTap: () {
                      setDialogState(() => tempInstantCorrection = false);
                    },
                  ),
                  const SizedBox(height: 24),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: () {
                        setState(() {
                          _instantCorrection = tempInstantCorrection;
                        });
                        Navigator.pop(context);
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Theme.of(context).primaryColor,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(14),
                        ),
                      ),
                      child: const Text(
                        'Inizia Quiz',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  Widget _buildCorrectionOption({
    required BuildContext context,
    required IconData icon,
    required Color iconColor,
    required String title,
    required String subtitle,
    required bool isSelected,
    required Color textColor,
    required Color secondaryTextColor,
    required VoidCallback onTap,
  }) {
    final isDarkMode = Theme.of(context).brightness == Brightness.dark;

    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: isSelected
              ? (isDarkMode
                    ? iconColor.withOpacity(0.2)
                    : iconColor.withOpacity(0.1))
              : (isDarkMode
                    ? Colors.white.withOpacity(0.05)
                    : Colors.grey.withOpacity(0.05)),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: isSelected ? iconColor : Colors.grey.withOpacity(0.2),
            width: isSelected ? 2 : 1,
          ),
        ),
        child: Row(
          children: [
            AnimatedContainer(
              duration: const Duration(milliseconds: 200),
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: isSelected
                    ? iconColor.withOpacity(0.2)
                    : Colors.grey.withOpacity(0.1),
                shape: BoxShape.circle,
              ),
              child: Icon(
                icon,
                color: isSelected ? iconColor : Colors.grey,
                size: 28,
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: textColor,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    subtitle,
                    style: TextStyle(fontSize: 13, color: secondaryTextColor),
                  ),
                ],
              ),
            ),
            if (isSelected)
              Icon(Icons.check_circle, color: iconColor, size: 24),
          ],
        ),
      ),
    );
  }

  String _getPreferenceTranslation(AppLanguage language) {
    switch (language) {
      case AppLanguage.urdu:
        return 'کیا آپ ٹیسٹ کے دوران فوری نتیجہ دیکھنا چاہتے ہیں؟';
      case AppLanguage.punjabi:
        return 'ਕੀ ਤੁਸੀਂ ਟੈਸਟ ਦੌਰਾਨ ਤੁਰੰਤ ਹੀ ਰਿਜ਼ਲਟ ਦੇਖਣਾ ਚਾਹੁੰਦੇ ਹੋ?';
      case AppLanguage.hindi:
        return 'क्या आप टेस्ट के दौरान तुरंत परिणाम देखना चाहते हैं?';
      case AppLanguage.english:
        return 'Do you want instant correction during the test?';
      default:
        return '';
    }
  }

  Future<void> _loadServices() async {
    await _bookmarkService.load();
    await _statsService.load();
    await _achievementService.load();
    await _translationService.loadFromFirestore();
    await _languagePreferenceService.loadPreference();

    final bookmarks = _bookmarkService.getAllBookmarks();
    setState(() {
      _bookmarkedIds = bookmarks.map((b) => b.questionId).toSet();
      _selectedLanguage = _languagePreferenceService.preferredLanguage;
    });
  }

  Future<void> _loadQuestions() async {
    final courseService = context.read<CourseService>();
    await _quizService.loadQuestions(license: courseService.currentLicense);

    List<QuizQuestion> questions;
    switch (widget.mode) {
      case QuizMode.quick:
        questions = _quizService.getRandomQuestions(30);
        break;
      case QuizMode.exam:
        questions = _quizService.getExamQuestions();
        break;
      case QuizMode.topic:
        questions = widget.topic != null
            ? _quizService.getRandomByTopic(widget.topic!)
            : _quizService.getRandomQuestions(30);
        break;
      case QuizMode.errors:
        questions = _quizService.getErrorQuestions();
        break;
    }

    setState(() {
      _questions = questions;
      _isLoading = false;
    });
  }

  bool get _hasAnswered => _userAnswers.containsKey(_currentIndex);
  bool? get _currentAnswer => _userAnswers[_currentIndex];

  void _answerQuestion(bool answer) {
    if (_instantCorrection && _hasAnswered) return;

    final isCorrect = answer == _questions[_currentIndex].risposta;

    setState(() {
      _userAnswers[_currentIndex] = answer;

      if (_instantCorrection) {
        _showAnswerOverlay = true;
        _lastAnswerCorrect = isCorrect;

        if (isCorrect) {
          _correctAnswers++;
          _quizService.removeError(_questions[_currentIndex].id);
        } else {
          _wrongAnswers++;
          _quizService.addError(_questions[_currentIndex].id);
        }

        final question = _questions[_currentIndex];
        _statsService.recordAnswer(
          topic: question.argomento,
          correct: isCorrect,
        );
      }
    });

    if (_instantCorrection) {
      Future.delayed(const Duration(milliseconds: 800), () {
        if (mounted) {
          setState(() => _showAnswerOverlay = false);
        }
      });
    }
  }

  void _calculateFinalResults() {
    if (!_instantCorrection) {
      int correct = 0;
      int wrong = 0;

      for (int i = 0; i < _questions.length; i++) {
        final userAnswer = _userAnswers[i];
        if (userAnswer != null) {
          final isCorrect = userAnswer == _questions[i].risposta;
          if (isCorrect) {
            correct++;
            _quizService.removeError(_questions[i].id);
          } else {
            wrong++;
            _quizService.addError(_questions[i].id);
          }
          _statsService.recordAnswer(
            topic: _questions[i].argomento,
            correct: isCorrect,
          );
        }
      }

      setState(() {
        _correctAnswers = correct;
        _wrongAnswers = wrong;
      });
    }
  }

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
      });
    } else {
      _handleQuizEnd();
    }
  }

  void _previousQuestion() {
    if (_currentIndex > 0) {
      setState(() {
        _currentIndex--;
      });
    }
  }

  int get _unansweredCount => _questions.length - _userAnswers.length;
  List<int> get _unansweredIndices {
    return List.generate(
      _questions.length,
      (i) => i,
    ).where((i) => !_userAnswers.containsKey(i)).toList();
  }

  void _handleQuizEnd() {
    if (_unansweredCount > 0) {
      showDialog(
        context: context,
        builder: (context) => AlertDialog(
          backgroundColor: Theme.of(context).cardColor,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20),
          ),
          title: const Text(
            '⚠️ Domande non risposte',
            textAlign: TextAlign.center,
          ),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                'Hai $_unansweredCount domande senza risposta.',
                style: const TextStyle(fontSize: 16),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 16),
              const Text(
                'Vuoi tornare a rispondere o vedere i risultati?',
                style: TextStyle(color: AppTheme.textSecondary),
                textAlign: TextAlign.center,
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
                setState(() {
                  _currentIndex = _unansweredIndices.first;
                });
              },
              child: const Text('Continua Quiz'),
            ),
            ElevatedButton(
              onPressed: () {
                Navigator.of(context).pop();
                _showFinalResults();
              },
              child: const Text('Vedi Risultati'),
            ),
          ],
        ),
      );
    } else {
      _showFinalResults();
    }
  }

  void _showFinalResults() async {
    _calculateFinalResults();

    final bool examPassed = widget.mode == QuizMode.exam && _wrongAnswers <= 3;
    final bool perfectQuiz = _wrongAnswers == 0;

    await _statsService.recordQuizCompleted(
      correct: _correctAnswers,
      wrong: _wrongAnswers,
      mode: widget.mode.name,
    );

    final stats = _statsService.stats;
    final newAchievements = await _achievementService.checkAchievements(
      totalQuizzes: stats.totalQuizzes,
      currentStreak: stats.currentStreak,
      level: stats.level,
      accuracy: stats.accuracy,
      perfectQuiz: perfectQuiz,
      examPassed: examPassed,
    );

    for (final achievement in newAchievements) {
      await _statsService.addXp(achievement.xpReward);
    }

    if (!mounted) return;

    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => AlertDialog(
        backgroundColor: Theme.of(context).cardColor,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: Text(
          _wrongAnswers <= 3 ? '🎉 Superato!' : '😔 Non superato',
          textAlign: TextAlign.center,
          style: const TextStyle(fontSize: 24),
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              'Risposte corrette: $_correctAnswers',
              style: TextStyle(
                color: Theme.of(context).colorScheme.secondary,
                fontSize: 18,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Risposte errate: $_wrongAnswers',
              style: TextStyle(
                color: Theme.of(context).colorScheme.error,
                fontSize: 18,
              ),
            ),
            const SizedBox(height: 16),
            Text(
              widget.mode == QuizMode.exam
                  ? 'Max 3 errori per passare'
                  : 'Continua a studiare!',
              style: TextStyle(
                color: Theme.of(context).textTheme.bodyMedium?.color,
              ),
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
                _userAnswers.clear();
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
        body: Container(
          decoration: BoxDecoration(
            gradient: Theme.of(context).brightness == Brightness.dark
                ? AppleGlassTheme.bgGradient
                : AppleGlassTheme.bgGradientLight,
          ),
          child: const Center(
            child: CircularProgressIndicator(color: Colors.white),
          ),
        ),
      );
    }

    if (_questions.isEmpty) {
      return Scaffold(
        extendBodyBehindAppBar: true,
        appBar: AppBar(
          backgroundColor: Colors.transparent,
          elevation: 0,
          leading: const BackButton(color: Colors.white),
        ),
        body: Container(
          decoration: BoxDecoration(
            gradient: Theme.of(context).brightness == Brightness.dark
                ? AppleGlassTheme.bgGradient
                : AppleGlassTheme.bgGradientLight,
          ),
          child: const Center(
            child: Text(
              'Nessuna domanda trovata',
              style: TextStyle(color: Colors.white, fontSize: 18),
            ),
          ),
        ),
      );
    }

    final question = _questions[_currentIndex];
    final isCorrect = _currentAnswer == question.risposta;
    final isDarkMode = Theme.of(context).brightness == Brightness.dark;

    // Determining text color based on theme
    final textColor = isDarkMode
        ? Colors.white
        : AppleGlassTheme.textPrimaryDark;

    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: Text(
          _getTitle(),
          style: GoogleFonts.poppins(
            color: textColor,
            fontWeight: FontWeight.bold,
          ),
        ),
        iconTheme: IconThemeData(color: textColor),
        actions: [
          ThemeToggleButton(color: textColor),
          Center(
            child: Padding(
              padding: const EdgeInsets.only(right: 16),
              child: GlassCard(
                isDarkMode: isDarkMode,
                borderRadius: 12,
                padding: const EdgeInsets.symmetric(
                  horizontal: 12,
                  vertical: 6,
                ),
                child: Text(
                  '${_currentIndex + 1}/${_questions.length}',
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                    color: textColor,
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
      body: Container(
        decoration: BoxDecoration(
          gradient: isDarkMode
              ? AppleGlassTheme.bgGradient
              : AppleGlassTheme.bgGradientLight,
        ),
        child: Stack(
          children: [
            // ... rest of stack content, will be replaced in chunks ...
            // Main quiz content
            SafeArea(
              child: Column(
                children: [
                  // Progress bar
                  LinearProgressIndicator(
                    value: (_currentIndex + 1) / _questions.length,
                    backgroundColor: isDarkMode
                        ? Colors.white10
                        : Colors.black12,
                    valueColor: AlwaysStoppedAnimation<Color>(
                      AppleGlassTheme.accentBlue,
                    ),
                  ),

                  // Score display
                  Padding(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 20,
                      vertical: 12,
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        _buildScoreBadge(
                          icon: Icons.check_circle,
                          count: _correctAnswers,
                          isSuccess: true,
                          isDarkMode: isDarkMode,
                        ),
                        const SizedBox(width: 24),
                        _buildScoreBadge(
                          icon: Icons.cancel,
                          count: _wrongAnswers,
                          isSuccess: false,
                          isDarkMode: isDarkMode,
                        ),
                      ],
                    ),
                  ),

                  // Question content
                  Expanded(
                    child: GestureDetector(
                      onHorizontalDragEnd: (details) {
                        if (details.primaryVelocity! < -300) {
                          _nextQuestion();
                        } else if (details.primaryVelocity! > 300) {
                          _previousQuestion();
                        }
                      },
                      child: SingleChildScrollView(
                        padding: const EdgeInsets.all(20),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.stretch,
                          children: [
                            // Image if present
                            if (question.immagine != null) ...[
                              GlassCard(
                                isDarkMode: isDarkMode,
                                borderRadius: 16,
                                padding: EdgeInsets.zero,
                                child: Container(
                                  padding: const EdgeInsets.all(12),
                                  decoration: BoxDecoration(
                                    color: isDarkMode
                                        ? Colors.transparent
                                        : Colors.white,
                                    borderRadius: BorderRadius.circular(16),
                                  ),
                                  child: SizedBox(
                                    height: 180,
                                    child: ClipRRect(
                                      borderRadius: BorderRadius.circular(12),
                                      child: Image.asset(
                                        'assets${question.immagine}',
                                        fit: BoxFit.contain,
                                        errorBuilder:
                                            (context, error, stackTrace) {
                                              return const Center(
                                                child: Icon(
                                                  Icons.image_not_supported,
                                                  size: 48,
                                                  color: Colors.grey,
                                                ),
                                              );
                                            },
                                      ),
                                    ),
                                  ),
                                ),
                              ),
                              const SizedBox(height: 20),
                            ],

                            // Question text
                            GlassCard(
                              isDarkMode: isDarkMode,
                              borderRadius: 16,
                              padding: const EdgeInsets.all(20),
                              child: Column(
                                children: [
                                  // Controls row
                                  Row(
                                    mainAxisAlignment:
                                        MainAxisAlignment.spaceBetween,
                                    children: [
                                      // Language selector
                                      LanguageSelector(
                                        currentLanguage: _selectedLanguage,
                                        onLanguageChanged: (lang) {
                                          setState(
                                            () => _selectedLanguage = lang,
                                          );
                                        },
                                        compact: true,
                                      ),

                                      // Audio and Bookmark buttons
                                      Row(
                                        children: [
                                          Tooltip(
                                            message: 'Ascolta in Italiano',
                                            child: InlineAudioButton(
                                              text: question.domanda,
                                              language: AppLanguage.italian,
                                              audioUrl: null,
                                              icon: Icons.volume_up,
                                              color: AppleGlassTheme.success,
                                            ),
                                          ),
                                          const SizedBox(width: 4),
                                          if (_selectedLanguage !=
                                              AppLanguage.italian)
                                            Tooltip(
                                              message: 'Ascolta traduzione',
                                              child: TranslationAudioButton(
                                                questionId: question.id,
                                                italianText: question.domanda,
                                                targetLanguage:
                                                    _selectedLanguage,
                                                audioUrl: _translationService
                                                    .getAudioUrl(
                                                      question.id,
                                                      _selectedLanguage,
                                                    ),
                                                icon: Icons.translate,
                                                color:
                                                    AppleGlassTheme.accentBlue,
                                                getTranslation:
                                                    (
                                                      id,
                                                      text,
                                                      lang,
                                                    ) => _translationService
                                                        .getTranslationWithFallback(
                                                          id,
                                                          text,
                                                          lang,
                                                        ),
                                              ),
                                            ),
                                          IconButton(
                                            onPressed: () =>
                                                _toggleBookmark(question),
                                            icon: Icon(
                                              _bookmarkedIds.contains(
                                                    question.id,
                                                  )
                                                  ? Icons.bookmark
                                                  : Icons.bookmark_border,
                                              color:
                                                  _bookmarkedIds.contains(
                                                    question.id,
                                                  )
                                                  ? Colors.amber
                                                  : (isDarkMode
                                                        ? Colors.white38
                                                        : Colors.black38),
                                            ),
                                          ),
                                        ],
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 16),
                                  if (_selectedLanguage == AppLanguage.italian)
                                    Text(
                                      question.domanda,
                                      style: TextStyle(
                                        fontSize: 18,
                                        fontWeight: FontWeight
                                            .bold, // Bold for better visibility
                                        height: 1.5,
                                        color: textColor,
                                      ),
                                      textAlign: TextAlign.center,
                                    )
                                  else
                                    InteractiveTranslationText(
                                      text: question.domanda,
                                      targetLanguage: _selectedLanguage,
                                      style: TextStyle(
                                        fontSize: 18,
                                        fontWeight: FontWeight.w500,
                                        height: 1.5,
                                        color: textColor,
                                      ),
                                      textAlign: TextAlign.center,
                                    ),
                                ],
                              ),
                            ),

                            // Translation toggle
                            const SizedBox(height: 12),
                            GestureDetector(
                              onTap: () {
                                setState(() {
                                  _showTranslation = !_showTranslation;
                                });
                              },
                              child: GlassCard(
                                isDarkMode: isDarkMode,
                                borderRadius: 12,
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 16,
                                  vertical: 10,
                                ),
                                child: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Icon(
                                      Icons.translate,
                                      size: 20,
                                      color: AppleGlassTheme.accentBlue,
                                    ),
                                    const SizedBox(width: 8),
                                    Text(
                                      _showTranslation ? 'Nascondi' : 'Traduci',
                                      style: TextStyle(
                                        color: AppleGlassTheme.accentBlue,
                                        fontWeight: FontWeight.w500,
                                      ),
                                    ),
                                    const Spacer(),
                                    Icon(
                                      _showTranslation
                                          ? Icons.keyboard_arrow_up
                                          : Icons.keyboard_arrow_down,
                                      color: AppleGlassTheme.accentBlue,
                                    ),
                                  ],
                                ),
                              ),
                            ),

                            // Translation panel
                            if (_showTranslation) ...[
                              const SizedBox(height: 12),
                              Container(
                                width: double.infinity,
                                padding: const EdgeInsets.all(16),
                                decoration: BoxDecoration(
                                  color: AppleGlassTheme.accentBlue.withOpacity(
                                    0.1,
                                  ),
                                  borderRadius: BorderRadius.circular(12),
                                  border: Border.all(
                                    color: AppleGlassTheme.accentBlue
                                        .withOpacity(0.3),
                                  ),
                                ),
                                child: FutureBuilder<String?>(
                                  future: _translationService
                                      .getTranslationWithFallback(
                                        question.id,
                                        question.domanda,
                                        _selectedLanguage,
                                      ),
                                  builder: (context, snapshot) {
                                    if (snapshot.connectionState ==
                                        ConnectionState.waiting) {
                                      return const Center(
                                        child: CircularProgressIndicator(),
                                      );
                                    }
                                    final translation = snapshot.data;
                                    if (translation != null &&
                                        translation.isNotEmpty) {
                                      return Column(
                                        crossAxisAlignment:
                                            CrossAxisAlignment.start,
                                        children: [
                                          Text(
                                            translation,
                                            style: TextStyle(
                                              fontSize: 16,
                                              color: textColor,
                                            ),
                                          ),
                                        ],
                                      );
                                    }
                                    return Text(
                                      'Traduzione non disponibile',
                                      style: TextStyle(color: textColor),
                                    );
                                  },
                                ),
                              ),
                            ],

                            const SizedBox(height: 16),

                            // Navigation & Answers
                            Row(
                              children: [
                                IconButton(
                                  onPressed: _currentIndex > 0
                                      ? _previousQuestion
                                      : null,
                                  icon: Icon(
                                    Icons.chevron_left_rounded,
                                    color: _currentIndex > 0
                                        ? textColor
                                        : textColor.withOpacity(0.3),
                                    size: 36,
                                  ),
                                ),
                                const SizedBox(width: 8),
                                Expanded(
                                  child: _buildAnswerButton(
                                    label: 'VERO',
                                    value: true,
                                    isSelected: _currentAnswer == true,
                                    isCorrectAnswer: question.risposta == true,
                                    isDarkMode: isDarkMode,
                                  ),
                                ),
                                const SizedBox(width: 12),
                                Expanded(
                                  child: _buildAnswerButton(
                                    label: 'FALSO',
                                    value: false,
                                    isSelected: _currentAnswer == false,
                                    isCorrectAnswer: question.risposta == false,
                                    isDarkMode: isDarkMode,
                                  ),
                                ),
                                const SizedBox(width: 8),
                                IconButton(
                                  onPressed: _nextQuestion,
                                  icon: _currentIndex < _questions.length - 1
                                      ? Icon(
                                          Icons.chevron_right_rounded,
                                          color: textColor,
                                          size: 36,
                                        )
                                      : Icon(
                                          Icons.check_circle_rounded,
                                          color: AppleGlassTheme.success,
                                          size: 32,
                                        ),
                                ),
                              ],
                            ),

                            // Feedback
                            if (_instantCorrection && _hasAnswered) ...[
                              const SizedBox(height: 20),
                              GlassCard(
                                isDarkMode: isDarkMode,
                                borderRadius: 12,
                                padding: const EdgeInsets.all(16),
                                child: Row(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    Icon(
                                      isCorrect
                                          ? Icons.check_circle
                                          : Icons.cancel,
                                      color: isCorrect
                                          ? AppleGlassTheme.success
                                          : AppleGlassTheme.error,
                                    ),
                                    const SizedBox(width: 8),
                                    Text(
                                      isCorrect
                                          ? 'Risposta corretta!'
                                          : 'Risposta errata!',
                                      style: TextStyle(
                                        color: isCorrect
                                            ? AppleGlassTheme.success
                                            : AppleGlassTheme.error,
                                        fontWeight: FontWeight.bold,
                                        fontSize: 16,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              if (!isCorrect) ...[
                                const SizedBox(height: 12),
                                Container(
                                  width: double.infinity,
                                  padding: const EdgeInsets.all(12),
                                  decoration: BoxDecoration(
                                    color: const Color(
                                      0xFFF59E0B,
                                    ).withOpacity(0.1),
                                    borderRadius: BorderRadius.circular(12),
                                    border: Border.all(
                                      color: const Color(0xFFF59E0B),
                                    ),
                                  ),
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      const Text(
                                        'Spiegazione:',
                                        style: TextStyle(
                                          fontWeight: FontWeight.bold,
                                          color: Color(0xFFF59E0B),
                                        ),
                                      ),
                                      const SizedBox(height: 4),
                                      Text(
                                        'La risposta corretta è ${question.risposta ? "VERO" : "FALSO"}. Ripassa il capitolo "${question.argomento}".',
                                        style: TextStyle(color: textColor),
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ],
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            // Animated Answer Feedback Overlay
            if (_showAnswerOverlay)
              AnimatedOpacity(
                opacity: _showAnswerOverlay ? 1.0 : 0.0,
                duration: const Duration(milliseconds: 200),
                child: Container(
                  color: (_lastAnswerCorrect ?? false)
                      ? Colors.green.withOpacity(0.85)
                      : Colors.red.withOpacity(0.85),
                  child: Center(
                    child: TweenAnimationBuilder<double>(
                      duration: const Duration(milliseconds: 400),
                      tween: Tween(begin: 0.0, end: 1.0),
                      curve: Curves.elasticOut,
                      builder: (context, value, child) {
                        return Transform.scale(scale: value, child: child);
                      },
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Container(
                            padding: const EdgeInsets.all(24),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              shape: BoxShape.circle,
                              boxShadow: [
                                BoxShadow(
                                  color: Colors.black.withOpacity(0.3),
                                  blurRadius: 20,
                                  offset: const Offset(0, 8),
                                ),
                              ],
                            ),
                            child: Icon(
                              (_lastAnswerCorrect ?? false)
                                  ? Icons.check_rounded
                                  : Icons.close_rounded,
                              size: 80,
                              color: (_lastAnswerCorrect ?? false)
                                  ? Colors.green
                                  : Colors.red,
                            ),
                          ),
                          const SizedBox(height: 24),
                          Text(
                            (_lastAnswerCorrect ?? false)
                                ? 'CORRETTO!'
                                : 'SBAGLIATO!',
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 32,
                              fontWeight: FontWeight.bold,
                              letterSpacing: 2,
                            ),
                          ),
                        ],
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
    required bool isSuccess,
    required bool isDarkMode,
  }) {
    final color = isSuccess ? AppleGlassTheme.success : AppleGlassTheme.error;

    return GlassCard(
      isDarkMode: isDarkMode,
      borderRadius: 16,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Row(
        mainAxisSize: MainAxisSize.min,
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
    required bool isDarkMode,
  }) {
    Color textColor;
    Gradient? backgroundGradient;
    Color borderColor;

    // In END mode: only show neutral selection, don't reveal correct/wrong
    // In INSTANT mode: show correct/wrong colors after answering
    final bool showCorrectness = _instantCorrection && _hasAnswered;

    if (showCorrectness) {
      // INSTANT mode: show correct/wrong feedback
      if (isCorrectAnswer) {
        borderColor = AppleGlassTheme.success;
        textColor = AppleGlassTheme.success;
        backgroundGradient = LinearGradient(
          colors: [
            AppleGlassTheme.success.withOpacity(0.2),
            AppleGlassTheme.success.withOpacity(0.1),
          ],
        );
      } else if (isSelected && !isCorrectAnswer) {
        borderColor = AppleGlassTheme.error;
        textColor = AppleGlassTheme.error;
        backgroundGradient = LinearGradient(
          colors: [
            AppleGlassTheme.error.withOpacity(0.2),
            AppleGlassTheme.error.withOpacity(0.1),
          ],
        );
      } else {
        borderColor = Colors.transparent;
        textColor = isDarkMode ? Colors.white38 : Colors.black38;
      }
    } else if (isSelected) {
      // END mode OR not answered yet: show neutral "selected" highlight
      borderColor = AppleGlassTheme.accentBlue;
      textColor = AppleGlassTheme.accentBlue;
      backgroundGradient = LinearGradient(
        colors: [
          AppleGlassTheme.accentBlue.withOpacity(0.2),
          AppleGlassTheme.accentBlue.withOpacity(0.1),
        ],
      );
    } else {
      // Not selected - show default button colors
      borderColor = Colors.transparent;
      textColor = isDarkMode ? Colors.white : AppleGlassTheme.textPrimaryDark;
    }

    final bool isEnabled = !_instantCorrection || !_hasAnswered;

    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: isEnabled ? () => _answerQuestion(value) : null,
        borderRadius: BorderRadius.circular(16),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          height: 64,
          decoration: isSelected || showCorrectness
              ? BoxDecoration(
                  gradient: backgroundGradient,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: borderColor, width: 2),
                )
              : isDarkMode
              ? AppleGlassTheme.glassDecoration()
              : AppleGlassTheme.glassDecorationLight(),
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
      case QuizMode.errors:
        return 'Ripasso Errori';
    }
  }
}
