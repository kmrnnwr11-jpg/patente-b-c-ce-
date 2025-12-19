import 'package:flutter/material.dart';
import '../../models/translation.dart';

/// Widget that makes each word in a text clickable for translation
///
/// Tapping a word shows a language selector popup, then displays
/// the translation for that word in the selected language.
class ClickableText extends StatefulWidget {
  final String text;
  final String contextId;
  final TextStyle? style;
  final Map<String, Map<String, String>>? translations;
  final void Function(String word, String translation)? onTranslationFound;

  const ClickableText({
    super.key,
    required this.text,
    required this.contextId,
    this.style,
    this.translations,
    this.onTranslationFound,
  });

  @override
  State<ClickableText> createState() => _ClickableTextState();
}

class _ClickableTextState extends State<ClickableText> {
  String? _hoveredWord;
  OverlayEntry? _overlayEntry;

  @override
  void dispose() {
    _removeOverlay();
    super.dispose();
  }

  void _removeOverlay() {
    _overlayEntry?.remove();
    _overlayEntry = null;
  }

  /// Split text into words and punctuation tokens
  List<String> _tokenize(String text) {
    // Split preserving spaces and punctuation
    return text.split(RegExp(r'(\s+|[.,!?;:\-—])'));
  }

  /// Check if token is a word (not punctuation or whitespace)
  bool _isWord(String token) {
    return token.trim().isNotEmpty &&
        !RegExp(r'^[.,!?;:\-—\s]+$').hasMatch(token);
  }

  void _showLanguagePopup(BuildContext context, String word, Offset position) {
    _removeOverlay();

    _overlayEntry = OverlayEntry(
      builder: (context) => _LanguagePopup(
        word: word,
        position: position,
        onLanguageSelected: (language) {
          _removeOverlay();
          _showTranslation(context, word, language, position);
        },
        onDismiss: _removeOverlay,
      ),
    );

    Overlay.of(context).insert(_overlayEntry!);
  }

  void _showTranslation(
    BuildContext context,
    String word,
    AppLanguage language,
    Offset position,
  ) {
    // Look up translation
    String? translation;
    if (widget.translations != null) {
      final langTranslations = widget.translations![language.code];
      if (langTranslations != null) {
        translation = langTranslations[word.toLowerCase()];
      }
    }

    _overlayEntry = OverlayEntry(
      builder: (context) => _TranslationPopup(
        word: word,
        translation: translation,
        language: language,
        position: position,
        onDismiss: _removeOverlay,
      ),
    );

    Overlay.of(context).insert(_overlayEntry!);

    // Auto dismiss after 3 seconds
    Future.delayed(const Duration(seconds: 3), () {
      if (_overlayEntry != null) {
        _removeOverlay();
      }
    });

    if (translation != null) {
      widget.onTranslationFound?.call(word, translation);
    }
  }

  @override
  Widget build(BuildContext context) {
    final tokens = _tokenize(widget.text);
    final defaultStyle =
        widget.style ?? const TextStyle(fontSize: 16, height: 1.5);

    return Wrap(
      children: tokens.map((token) {
        if (!_isWord(token)) {
          // Punctuation or whitespace - render as-is
          return Text(token, style: defaultStyle);
        }

        final isHovered = _hoveredWord == token;

        return GestureDetector(
          onTapDown: (details) {
            _showLanguagePopup(context, token, details.globalPosition);
          },
          child: MouseRegion(
            onEnter: (_) => setState(() => _hoveredWord = token),
            onExit: (_) => setState(() => _hoveredWord = null),
            child: Container(
              decoration: BoxDecoration(
                border: Border(
                  bottom: BorderSide(
                    color: isHovered
                        ? Colors.blue.shade400
                        : Colors.grey.shade400,
                    width: 1,
                    style: isHovered ? BorderStyle.solid : BorderStyle.none,
                  ),
                ),
              ),
              child: Text(
                token,
                style: defaultStyle.copyWith(
                  color: isHovered ? Colors.blue.shade600 : null,
                  decoration: TextDecoration.underline,
                  decorationStyle: TextDecorationStyle.dotted,
                  decorationColor: Colors.grey.shade400,
                ),
              ),
            ),
          ),
        );
      }).toList(),
    );
  }
}

/// Popup for selecting translation language
class _LanguagePopup extends StatelessWidget {
  final String word;
  final Offset position;
  final void Function(AppLanguage) onLanguageSelected;
  final VoidCallback onDismiss;

  const _LanguagePopup({
    required this.word,
    required this.position,
    required this.onLanguageSelected,
    required this.onDismiss,
  });

  @override
  Widget build(BuildContext context) {
    final screenSize = MediaQuery.of(context).size;

    // Calculate position to keep popup on screen
    double left = position.dx - 140;
    double top = position.dy - 250;

    if (left < 16) left = 16;
    if (left + 280 > screenSize.width - 16) {
      left = screenSize.width - 296;
    }
    if (top < 16) top = position.dy + 20;

    return Stack(
      children: [
        // Dismiss layer
        Positioned.fill(
          child: GestureDetector(
            onTap: onDismiss,
            child: Container(color: Colors.transparent),
          ),
        ),

        // Popup
        Positioned(
          left: left,
          top: top,
          child: Material(
            elevation: 8,
            borderRadius: BorderRadius.circular(20),
            child: Container(
              width: 280,
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [Colors.blue.shade500, Colors.purple.shade500],
                ),
                borderRadius: BorderRadius.circular(20),
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  // Header
                  Padding(
                    padding: const EdgeInsets.all(16),
                    child: Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(
                            color: Colors.white.withOpacity(0.25),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: const Text(
                            '🌐',
                            style: TextStyle(fontSize: 24),
                          ),
                        ),
                        const SizedBox(width: 12),
                        const Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Scegli lingua:',
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            Text(
                              'Seleziona per tradurre',
                              style: TextStyle(
                                color: Colors.white70,
                                fontSize: 11,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),

                  // Language buttons
                  Padding(
                    padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
                    child: Column(
                      children: AppLanguage.values.map((lang) {
                        return Padding(
                          padding: const EdgeInsets.only(bottom: 8),
                          child: InkWell(
                            onTap: () => onLanguageSelected(lang),
                            borderRadius: BorderRadius.circular(12),
                            child: Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 14,
                                vertical: 12,
                              ),
                              decoration: BoxDecoration(
                                color: Colors.white.withOpacity(0.15),
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(
                                  color: Colors.white.withOpacity(0.2),
                                ),
                              ),
                              child: Row(
                                children: [
                                  Text(
                                    lang.flag,
                                    style: const TextStyle(fontSize: 26),
                                  ),
                                  const SizedBox(width: 12),
                                  Text(
                                    lang.name,
                                    style: const TextStyle(
                                      color: Colors.white,
                                      fontSize: 15,
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        );
                      }).toList(),
                    ),
                  ),

                  // Close button
                  Padding(
                    padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
                    child: TextButton(
                      onPressed: onDismiss,
                      style: TextButton.styleFrom(
                        backgroundColor: Colors.white.withOpacity(0.1),
                        minimumSize: const Size(double.infinity, 44),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      child: const Text(
                        'Chiudi',
                        style: TextStyle(
                          color: Colors.white70,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }
}

/// Popup showing the translation result
class _TranslationPopup extends StatelessWidget {
  final String word;
  final String? translation;
  final AppLanguage language;
  final Offset position;
  final VoidCallback onDismiss;

  const _TranslationPopup({
    required this.word,
    required this.translation,
    required this.language,
    required this.position,
    required this.onDismiss,
  });

  @override
  Widget build(BuildContext context) {
    final screenSize = MediaQuery.of(context).size;

    double left = position.dx - 120;
    double top = position.dy + 20;

    if (left < 16) left = 16;
    if (left + 240 > screenSize.width - 16) {
      left = screenSize.width - 256;
    }

    return Stack(
      children: [
        Positioned.fill(
          child: GestureDetector(
            onTap: onDismiss,
            child: Container(color: Colors.transparent),
          ),
        ),
        Positioned(
          left: left,
          top: top,
          child: Material(
            elevation: 8,
            borderRadius: BorderRadius.circular(12),
            child: Container(
              constraints: const BoxConstraints(maxWidth: 240),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.grey.shade200),
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Language badge
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 8,
                      vertical: 4,
                    ),
                    decoration: BoxDecoration(
                      color: Colors.blue.shade50,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text(
                          language.flag,
                          style: const TextStyle(fontSize: 14),
                        ),
                        const SizedBox(width: 4),
                        Text(
                          language.code.toUpperCase(),
                          style: TextStyle(
                            color: Colors.blue.shade700,
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 12),

                  // Translation
                  if (translation != null)
                    Text(
                      translation!,
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                        color: Colors.black87,
                      ),
                    )
                  else
                    Text(
                      'Traduzione non disponibile',
                      style: TextStyle(
                        fontSize: 14,
                        fontStyle: FontStyle.italic,
                        color: Colors.grey.shade600,
                      ),
                    ),

                  const SizedBox(height: 12),

                  // Footer
                  Row(
                    children: [
                      Icon(
                        Icons.auto_awesome,
                        size: 14,
                        color: Colors.amber.shade600,
                      ),
                      const SizedBox(width: 4),
                      Text(
                        'In memoria',
                        style: TextStyle(
                          fontSize: 11,
                          color: Colors.grey.shade500,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }
}
