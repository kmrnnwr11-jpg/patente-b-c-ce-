import 'package:flutter/material.dart';
import 'package:flutter_tts/flutter_tts.dart';
import '../../models/translation.dart';
import '../../services/translation_service.dart';

/// Simple text widget with hover translation tooltip and click-to-speak
class HoverTranslationText extends StatefulWidget {
  final String text;
  final AppLanguage currentLanguage;
  final TextStyle? style;
  final TextAlign? textAlign;

  const HoverTranslationText({
    super.key,
    required this.text,
    required this.currentLanguage,
    this.style,
    this.textAlign,
  });

  @override
  State<HoverTranslationText> createState() => _HoverTranslationTextState();
}

class _HoverTranslationTextState extends State<HoverTranslationText> {
  final TranslationService _translationService = TranslationService();
  final FlutterTts _tts = FlutterTts();
  String? _hoveredWord;

  @override
  void initState() {
    super.initState();
    _translationService.loadTranslations();
    _tts.setLanguage(widget.currentLanguage.code);
  }

  /// Split text into words and punctuation tokens
  List<String> _tokenize(String text) {
    return text.split(RegExp(r'(\s+|[.,!?;:\-—])'));
  }

  /// Check if token is a word (not punctuation or whitespace)
  bool _isWord(String token) {
    return token.trim().isNotEmpty &&
        !RegExp(r'^[.,!?;:\-—\s]+$').hasMatch(token);
  }

  /// Get translation for a word
  String? _getTranslation(String word) {
    if (widget.currentLanguage == AppLanguage.italian) {
      return null; // No translation needed for Italian
    }

    final translation = _translationService.getTranslation(
      0,
    ); // TODO: use proper ID
    return translation?.domandaEn; // Simplified - should lookup word
  }

  /// Speak word using TTS
  Future<void> _speakWord(String word) async {
    try {
      final translation = _getTranslation(word);
      final textToSpeak = translation ?? word;
      await _tts.speak(textToSpeak);
    } catch (e) {
      print('TTS error: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    if (widget.currentLanguage == AppLanguage.italian) {
      // No translation needed for Italian - show plain text
      return Text(
        widget.text,
        style: widget.style,
        textAlign: widget.textAlign ?? TextAlign.center,
      );
    }

    final tokens = _tokenize(widget.text);
    final defaultStyle =
        widget.style ?? const TextStyle(fontSize: 16, height: 1.5);

    return Wrap(
      alignment: WrapAlignment.center,
      children: tokens.map((token) {
        if (!_isWord(token)) {
          return Text(token, style: defaultStyle);
        }

        final isHovered = _hoveredWord == token;
        final translation = _getTranslation(token);

        return MouseRegion(
          onEnter: (_) => setState(() => _hoveredWord = token),
          onExit: (_) => setState(() => _hoveredWord = null),
          cursor: SystemMouseCursors.click,
          child: Tooltip(
            message: translation ?? 'Translation not available',
            waitDuration: const Duration(milliseconds: 100),
            preferBelow: true,
            decoration: BoxDecoration(
              color: Colors.black87,
              borderRadius: BorderRadius.circular(8),
            ),
            textStyle: const TextStyle(
              color: Colors.white,
              fontSize: 14,
              fontWeight: FontWeight.w500,
            ),
            child: GestureDetector(
              onTap: () => _speakWord(token),
              child: Text(
                token,
                style: defaultStyle.copyWith(
                  color: isHovered ? Colors.blue.shade600 : null,
                  decoration: TextDecoration.underline,
                  decorationStyle: TextDecorationStyle.dotted,
                  decorationColor: isHovered
                      ? Colors.blue.shade400
                      : Colors.grey.shade400,
                ),
              ),
            ),
          ),
        );
      }).toList(),
    );
  }

  @override
  void dispose() {
    _tts.stop();
    super.dispose();
  }
}
