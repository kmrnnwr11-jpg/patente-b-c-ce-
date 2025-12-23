import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../models/translation.dart';
import '../../services/google_translate_service.dart';
import '../../widgets/audio/audio_button.dart';

/// Interactive text widget where each word shows translation on tap and plays audio
/// Designed for touch screens - tap shows translation popup and plays ONLY that word
class InteractiveTranslationText extends StatefulWidget {
  final String text; // Italian text to display
  final AppLanguage
  targetLanguage; // Language to translate to (Urdu, Punjabi, etc.)
  final TextStyle? style;
  final TextAlign textAlign;

  const InteractiveTranslationText({
    super.key,
    required this.text,
    required this.targetLanguage,
    this.style,
    this.textAlign = TextAlign.start,
  });

  @override
  State<InteractiveTranslationText> createState() =>
      _InteractiveTranslationTextState();
}

class _InteractiveTranslationTextState
    extends State<InteractiveTranslationText> {
  final GoogleTranslateService _translateService = GoogleTranslateService();
  final TtsService _ttsService = TtsService();
  String? _selectedWord;
  String? _translatingWord;

  // Cache for word translations
  final Map<String, String> _wordCache = {};

  @override
  void initState() {
    super.initState();
    _ttsService.init();
  }

  /// Split text into tokens (words and punctuation)
  List<String> _tokenize(String text) {
    final tokens = <String>[];
    final regex = RegExp(r"[\w\u00C0-\u017F]+|[^\w\u00C0-\u017F]+");
    for (final match in regex.allMatches(text)) {
      tokens.add(match.group(0)!);
    }
    return tokens;
  }

  /// Check if token is a word (not just punctuation/whitespace)
  bool _isWord(String token) {
    return RegExp(r'^[\w\u00C0-\u017F]+$').hasMatch(token);
  }

  /// Handle word tap - translate using Google Translate and play audio
  Future<void> _onWordTap(String word) async {
    print('👆 WORD TAP: "$word"');

    setState(() {
      _selectedWord = word;
      _translatingWord = word;
    });

    String? translation;

    // Check cache first
    final cacheKey = '${word.toLowerCase()}_${widget.targetLanguage.code}';
    if (_wordCache.containsKey(cacheKey)) {
      translation = _wordCache[cacheKey];
      print('📦 Word cache hit: "$word" -> "$translation"');
    } else {
      // Translate single word using Google Translate
      translation = await _translateService.translate(
        word,
        widget.targetLanguage,
      );
      if (translation != null) {
        _wordCache[cacheKey] = translation;
        print('🌐 Word translated: "$word" -> "$translation"');
      }
    }

    setState(() => _translatingWord = null);

    if (translation != null) {
      // Play audio of the translated word ONLY
      print('🔊 Playing single word: "$translation"');
      _ttsService.speak(translation, language: widget.targetLanguage);

      // Show snackbar with translation
      if (mounted) {
        ScaffoldMessenger.of(context).hideCurrentSnackBar();
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Row(
              children: [
                const Icon(Icons.translate, color: Colors.white, size: 20),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        word,
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          color: Colors.white70,
                          fontSize: 12,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        translation,
                        style: widget.targetLanguage == AppLanguage.urdu
                            ? GoogleFonts.notoNastaliqUrdu(
                                fontSize: 20,
                                color: Colors.white,
                                fontWeight: FontWeight.w500,
                              )
                            : widget.targetLanguage == AppLanguage.punjabi
                            ? GoogleFonts.notoSansGurmukhi(
                                fontSize: 18,
                                color: Colors.white,
                                fontWeight: FontWeight.w500,
                              )
                            : const TextStyle(
                                fontSize: 18,
                                color: Colors.white,
                                fontWeight: FontWeight.w500,
                              ),
                      ),
                    ],
                  ),
                ),
                const Icon(Icons.volume_up, color: Colors.white54, size: 18),
              ],
            ),
            backgroundColor: Colors.blue.shade800,
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
            duration: const Duration(seconds: 2),
            margin: const EdgeInsets.all(16),
          ),
        );
      }
    }

    // Clear selection after a moment
    Future.delayed(const Duration(milliseconds: 800), () {
      if (mounted) setState(() => _selectedWord = null);
    });
  }

  @override
  Widget build(BuildContext context) {
    final tokens = _tokenize(widget.text);
    final defaultStyle =
        widget.style ?? const TextStyle(fontSize: 16, height: 1.5);

    return Wrap(
      alignment: widget.textAlign == TextAlign.center
          ? WrapAlignment.center
          : widget.textAlign == TextAlign.end
          ? WrapAlignment.end
          : WrapAlignment.start,
      children: tokens.map((token) {
        if (!_isWord(token)) {
          return Text(token, style: defaultStyle);
        }

        final isSelected = _selectedWord == token;
        final isTranslating = _translatingWord == token;

        return GestureDetector(
          behavior: HitTestBehavior.opaque,
          onTap: () => _onWordTap(token),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 3, vertical: 2),
            margin: const EdgeInsets.symmetric(vertical: 1),
            decoration: BoxDecoration(
              color: isSelected
                  ? Colors.blue.withOpacity(0.3)
                  : Colors.blue.withOpacity(0.08),
              borderRadius: BorderRadius.circular(4),
              border: Border.all(
                color: isSelected
                    ? Colors.blue.shade400
                    : Colors.blue.withOpacity(0.2),
                width: 1,
              ),
            ),
            child: isTranslating
                ? Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        token,
                        style: defaultStyle.copyWith(
                          color: Colors.blue.shade300,
                        ),
                      ),
                      const SizedBox(width: 4),
                      SizedBox(
                        width: 12,
                        height: 12,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          valueColor: AlwaysStoppedAnimation(
                            Colors.blue.shade300,
                          ),
                        ),
                      ),
                    ],
                  )
                : Text(
                    token,
                    style: defaultStyle.copyWith(
                      color: isSelected
                          ? Colors.blue.shade300
                          : Colors.blue.shade200,
                    ),
                  ),
          ),
        );
      }).toList(),
    );
  }
}

/// Keep the old HoverTranslationText for backward compatibility
typedef HoverTranslationText = InteractiveTranslationText;
