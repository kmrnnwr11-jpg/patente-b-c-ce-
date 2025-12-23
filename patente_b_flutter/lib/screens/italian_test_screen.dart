import 'dart:async';
import 'package:flutter/material.dart';
import '../../theme/app_theme.dart';
import '../../services/italian_test_service.dart';
import '../../models/italian_test.dart';

class ItalianTestScreen extends StatefulWidget {
  final String level;
  final String section;
  final String title;

  const ItalianTestScreen({
    super.key,
    required this.level,
    required this.section,
    required this.title,
  });

  @override
  State<ItalianTestScreen> createState() => _ItalianTestScreenState();
}

class _ItalianTestScreenState extends State<ItalianTestScreen> {
  final ItalianTestService _service = ItalianTestService();
  ItalianTest? _test;
  bool _isLoading = true;
  int _currentExerciseIndex = 0;

  // Timer related
  Timer? _timer;
  int _remainingSeconds = 0;

  // Track answers: questionId -> selectedOptionIndex
  final Map<int, int> _userAnswers = {};

  @override
  void initState() {
    super.initState();
    _loadTest();
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  Future<void> _loadTest() async {
    try {
      final test = await _service.loadTest(widget.level, widget.section);
      if (mounted) {
        setState(() {
          _test = test;
          _isLoading = false;
        });
        _startTimer();
      }
    } catch (e) {
      print('Error loading test: $e');
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  void _startTimer() {
    if (_test == null) return;

    // Duration is in minutes
    _remainingSeconds = _test!.duration * 60;

    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (!mounted) {
        timer.cancel();
        return;
      }

      if (_remainingSeconds > 0) {
        setState(() {
          _remainingSeconds--;
        });
      } else {
        timer.cancel();
        // Time over logic - could show alert or auto-submit
        _showTimeOverDialog();
      }
    });
  }

  String _formatTime(int seconds) {
    final int minutes = seconds ~/ 60;
    final int remaining = seconds % 60;
    return '$minutes:${remaining.toString().padLeft(2, '0')}';
  }

  void _showTimeOverDialog() {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => AlertDialog(
        title: const Text('Tempo Scaduto'),
        content: const Text('Il tempo a disposizione per il test è terminato.'),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.of(context).pop(); // Close dialog
              Navigator.of(context).pop(); // Exit screen
            },
            child: const Text('Esci'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.backgroundColor,
      appBar: AppBar(
        title: Text(widget.title),
        backgroundColor: Colors.transparent,
        elevation: 0,
        actions: [
          if (!_isLoading && _test != null)
            Center(
              child: Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 8,
                ),
                margin: const EdgeInsets.only(right: 16),
                decoration: BoxDecoration(
                  color: _remainingSeconds < 60
                      ? Colors.red.withOpacity(0.2)
                      : AppTheme.cardColor,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(
                    color: _remainingSeconds < 60
                        ? Colors.red
                        : Colors.white.withOpacity(0.2),
                  ),
                ),
                child: Row(
                  children: [
                    Icon(
                      Icons.timer,
                      size: 16,
                      color: _remainingSeconds < 60 ? Colors.red : Colors.white,
                    ),
                    const SizedBox(width: 8),
                    Text(
                      _formatTime(_remainingSeconds),
                      style: TextStyle(
                        fontFamily:
                            'TheFont', // Monospace if available looks better
                        fontWeight: FontWeight.bold,
                        color: _remainingSeconds < 60
                            ? Colors.red
                            : Colors.white,
                      ),
                    ),
                  ],
                ),
              ),
            ),
        ],
      ),
      body: SafeArea(
        child: _isLoading
            ? const Center(child: CircularProgressIndicator())
            : _test == null
            ? const Center(
                child: Text(
                  'Errore caricamento test',
                  style: TextStyle(color: Colors.white),
                ),
              )
            : _buildTestContent(),
      ),
    );
  }

  Widget _buildTestContent() {
    final exercise = _test!.exercises[_currentExerciseIndex];

    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Esercizio ${_currentExerciseIndex + 1}/${_test!.exercises.length}',
                style: TextStyle(
                  color: Colors.white.withOpacity(0.6),
                  fontSize: 14,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            exercise.title,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 22,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 16),

          if (exercise.content != null) ...[
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppTheme.cardColor,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Text(
                exercise.content!,
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 16,
                  height: 1.5,
                ),
              ),
            ),
            const SizedBox(height: 24),
          ],

          if (exercise.audioFile != null) ...[
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppTheme.primaryColor.withOpacity(0.2),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: AppTheme.primaryColor),
              ),
              child: Row(
                children: [
                  const Icon(
                    Icons.play_circle_filled,
                    color: AppTheme.primaryColor,
                    size: 40,
                  ),
                  const SizedBox(width: 12),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: const [
                      Text(
                        'Ascolta l\'audio',
                        style: TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      Text(
                        'Premi per riprodurre',
                        style: TextStyle(color: Colors.grey, fontSize: 12),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),
          ],

          const Text(
            'Domande:',
            style: TextStyle(
              color: Colors.white,
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 12),

          ...exercise.questions.map((q) => _buildQuestion(q)),

          const SizedBox(height: 40),

          // Navigation
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              if (_currentExerciseIndex > 0)
                TextButton.icon(
                  onPressed: () => setState(() => _currentExerciseIndex--),
                  icon: const Icon(Icons.arrow_back),
                  label: const Text('Precedente'),
                  style: TextButton.styleFrom(foregroundColor: Colors.white),
                )
              else
                const SizedBox.shrink(),

              if (_currentExerciseIndex < _test!.exercises.length - 1)
                ElevatedButton.icon(
                  onPressed: () => setState(() => _currentExerciseIndex++),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.primaryColor,
                    padding: const EdgeInsets.symmetric(
                      horizontal: 24,
                      vertical: 12,
                    ),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(30),
                    ),
                  ),
                  icon: const Icon(Icons.arrow_forward),
                  label: const Text('Prossimo'),
                )
              else
                ElevatedButton.icon(
                  onPressed: () {
                    // Submit functionality
                    Navigator.pop(context);
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.accentGreen,
                    padding: const EdgeInsets.symmetric(
                      horizontal: 24,
                      vertical: 12,
                    ),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(30),
                    ),
                  ),
                  icon: const Icon(Icons.check_circle),
                  label: const Text('Completa Test'),
                ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildQuestion(ItalianTestQuestion q) {
    return Container(
      margin: const EdgeInsets.only(bottom: 24),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.cardColor,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            q.question,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 16,
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 12),
          ...q.options.asMap().entries.map((entry) {
            final idx = entry.key;
            final text = entry.value;
            final isSelected = _userAnswers[q.id] == idx;

            return InkWell(
              onTap: () {
                setState(() {
                  _userAnswers[q.id] = idx;
                });
              },
              child: Container(
                margin: const EdgeInsets.only(bottom: 8),
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: isSelected
                      ? AppTheme.primaryColor.withOpacity(0.2)
                      : Colors.transparent,
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(
                    color: isSelected
                        ? AppTheme.primaryColor
                        : Colors.white.withOpacity(0.2),
                  ),
                ),
                child: Row(
                  children: [
                    Container(
                      width: 24,
                      height: 24,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: isSelected
                            ? AppTheme.primaryColor
                            : Colors.transparent,
                        border: Border.all(
                          color: isSelected
                              ? AppTheme.primaryColor
                              : Colors.white.withOpacity(0.5),
                          width: 2,
                        ),
                      ),
                      child: isSelected
                          ? const Icon(
                              Icons.check,
                              size: 16,
                              color: Colors.white,
                            )
                          : null,
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Text(
                        text,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 15,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            );
          }),
        ],
      ),
    );
  }
}
