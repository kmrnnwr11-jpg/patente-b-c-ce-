import 'package:flutter/material.dart';
import '../../models/translation.dart';
import '../audio/audio_button.dart';

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

  /// Split text into words and punctuation tokens, keeping everything
  List<String> _tokenize(String text) {
    // Regex matches:
    // 1. Sequences of word characters (alphanumeric + accented)
    // 2. OR Sequences of non-word characters (spaces, punctuation)
    // We want to keep BOTH to render the text exactly as is.
    final RegExp regExp = RegExp(
      r'([a-zA-Z0-9àèéìòùÀÈÉÌÒÙ]+)|([^a-zA-Z0-9àèéìòùÀÈÉÌÒÙ]+)',
    );

    final List<String> tokens = [];
    final Iterable<Match> matches = regExp.allMatches(text);

    for (final Match match in matches) {
      tokens.add(match.group(0)!);
    }
    return tokens;
  }

  /// Check if token is a word (starts with letter/number)
  bool _isWord(String token) {
    if (token.trim().isEmpty) return false;
    // Check if it starts with a letter or number (roughly)
    return RegExp(r'^[a-zA-Z0-9àèéìòùÀÈÉÌÒÙ]').hasMatch(token);
  }

  void _showTranslationsPopup(
    BuildContext context,
    String word,
    Offset position,
  ) {
    _removeOverlay();

    // Find all translations for this word
    print(
      '🔍 Looking up translation for word: "$word" (lowercase: "${word.toLowerCase()}")',
    );
    if (widget.translations != null && widget.translations!.containsKey('ur')) {
      print('UR keys count: ${widget.translations!['ur']?.length}');
      // Check if 'strada' exists specifically
      if (widget.translations!['ur']!.containsKey('strada')) {
        print('✅ "strada" exists in UR map');
      } else {
        print('❌ "strada" NOT found in UR map');
      }
    }

    final Map<AppLanguage, String> foundTranslations = {};

    if (widget.translations != null) {
      final lookupWord = word.toLowerCase();
      print('🔎 Looking up word: "$lookupWord"');

      // Check Urdu
      final ur = widget.translations!['ur'];
      if (ur != null) {
        print('   UR map has ${ur.length} entries');
        if (ur.containsKey(lookupWord)) {
          foundTranslations[AppLanguage.urdu] = ur[lookupWord]!;
          print('   ✅ Found UR translation: ${ur[lookupWord]}');
        } else {
          print('   ❌ UR: "$lookupWord" not found');
        }
      }

      // Check Punjabi
      final pa = widget.translations!['pa'];
      if (pa != null) {
        if (pa.containsKey(lookupWord)) {
          foundTranslations[AppLanguage.punjabi] = pa[lookupWord]!;
          print('   ✅ Found PA translation: ${pa[lookupWord]}');
        } else {
          print('   ❌ PA: "$lookupWord" not found');
        }
      }

      // Check Hindi
      final hi = widget.translations!['hi'];
      if (hi != null && hi.containsKey(lookupWord)) {
        foundTranslations[AppLanguage.hindi] = hi[lookupWord]!;
      }

      // Check English
      final en = widget.translations!['en'];
      if (en != null && en.containsKey(lookupWord)) {
        foundTranslations[AppLanguage.english] = en[lookupWord]!;
      }

      print('   📋 Total translations found: ${foundTranslations.length}');
    } else {
      print('   ⚠️ widget.translations is NULL!');
    }

    _overlayEntry = OverlayEntry(
      builder: (context) => _MultiTranslationPopup(
        word: word,
        translations: foundTranslations,
        position: position,
        onDismiss: _removeOverlay,
      ),
    );

    Overlay.of(context).insert(_overlayEntry!);
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
            _showTranslationsPopup(context, token, details.globalPosition);
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

// Multi-translation list popup
class _MultiTranslationPopup extends StatelessWidget {
  final String word;
  final Map<AppLanguage, String> translations; // Map of available translations
  final Offset position;
  final VoidCallback onDismiss;

  const _MultiTranslationPopup({
    required this.word,
    required this.translations,
    required this.position,
    required this.onDismiss,
  });

  @override
  Widget build(BuildContext context) {
    final screenSize = MediaQuery.of(context).size;

    double left = position.dx - 140;
    double top = position.dy + 20;

    if (left < 16) left = 16;
    if (left + 280 > screenSize.width - 16) {
      left = screenSize.width - 296;
    }
    // Adjust if too close to bottom
    if (top + 200 > screenSize.height) {
      top = position.dy - 220; // Show above
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
            borderRadius: BorderRadius.circular(16),
            child: Container(
              width: 280,
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.grey.shade200),
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Header
                  Row(
                    children: [
                      Text(
                        word,
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: Colors.blue,
                        ),
                      ),
                      const Spacer(),
                      IconButton(
                        icon: const Icon(Icons.close, size: 20),
                        padding: EdgeInsets.zero,
                        constraints: const BoxConstraints(),
                        onPressed: onDismiss,
                      ),
                    ],
                  ),
                  const Divider(),

                  if (translations.isEmpty)
                    Padding(
                      padding: const EdgeInsets.symmetric(vertical: 8.0),
                      child: Text(
                        'Nessuna traduzione trovata',
                        style: TextStyle(
                          fontStyle: FontStyle.italic,
                          color: Colors.grey[600],
                        ),
                      ),
                    ),

                  // List of translations
                  ...translations.entries.map((entry) {
                    final language = entry.key;
                    final text = entry.value;

                    return Padding(
                      padding: const EdgeInsets.only(bottom: 12.0),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            language.flag,
                            style: const TextStyle(fontSize: 20),
                          ),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  language.name,
                                  style: TextStyle(
                                    fontSize: 10,
                                    color: Colors.grey[600],
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                Text(
                                  text,
                                  style: const TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.w500,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          InlineAudioButton(text: text, language: language),
                        ],
                      ),
                    );
                  }),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }
}
