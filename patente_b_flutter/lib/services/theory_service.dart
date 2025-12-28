import 'package:flutter/foundation.dart';
import 'dart:convert';
import 'package:flutter/services.dart';
import '../models/theory_chapter.dart';

/// Model for PDF extracted content
class PdfTheorySection {
  final String id;
  final String title;
  final String content;
  final List<String>? simpleSummary;
  final String? icon;
  final String? image;

  PdfTheorySection({
    required this.id,
    required this.title,
    required this.content,
    this.simpleSummary,
    this.icon,
    this.image,
  });

  factory PdfTheorySection.fromJson(Map<String, dynamic> json) {
    return PdfTheorySection(
      id: json['id'] ?? '',
      title: json['title'] ?? 'Contenuto',
      content: json['content'] ?? '',
      simpleSummary: json['simple_summary'] != null
          ? List<String>.from(json['simple_summary'])
          : null,
      icon: json['icon'],
      image: _fixPath(json['image']),
    );
  }

  static String? _fixPath(String? path) {
    if (path == null) return null;
    String clean = path.startsWith('/') ? path.substring(1) : path;
    if (clean.startsWith('images/') && !clean.startsWith('assets/')) {
      return 'assets/$clean';
    }
    return clean;
  }
}

/// Model for PDF extracted chapter
class PdfTheoryChapter {
  final String id;
  final String title;
  final int order;
  final int startPage;
  final int endPage;
  final List<PdfTheorySection> sections;

  PdfTheoryChapter({
    required this.id,
    required this.title,
    required this.order,
    required this.startPage,
    required this.endPage,
    required this.sections,
  });

  factory PdfTheoryChapter.fromJson(Map<String, dynamic> json) {
    final sectionsJson = json['sections'] as List? ?? [];
    return PdfTheoryChapter(
      id: json['id'] ?? '',
      title: json['title'] ?? '',
      order: json['order'] ?? 0,
      startPage: json['start_page'] ?? 1,
      endPage: json['end_page'] ?? 1,
      sections: sectionsJson.map((s) => PdfTheorySection.fromJson(s)).toList(),
    );
  }

  /// Get full content from all sections
  String get fullContent {
    return sections.map((s) => s.content).join('\n\n');
  }

  /// Convert to TheoryChapter for compatibility
  TheoryChapter toTheoryChapter() {
    return TheoryChapter(
      id: id,
      title: title,
      description: 'Pagine $startPage-$endPage del Manuale di Teoria',
      sections: sections
          .map(
            (s) => TheorySection(
              id: s.id,
              title: s.title,
              content: s.content,
              simpleSummary: s.simpleSummary,
              icon: s.icon,
              image: s.image,
            ),
          )
          .toList(),
    );
  }
}

/// Service for loading and managing theory content
class TheoryService {
  List<TheoryChapter> _chapters = [];
  final List<PdfTheoryChapter> _pdfManuale = [];
  final List<PdfTheoryChapter> _pdfGrafiche = [];
  final List<Map<String, dynamic>> _pdfImages = [];
  bool _isLoaded = false;

  /// Load theory chapters from the new PDF extracted content with images
  Future<void> loadTheory() async {
    if (_isLoaded) return;

    try {
      // 1. First load signals with full descriptions from theory-segnali-completo.json
      List<TheoryChapter> signalChapters = [];
      try {
        final String signalsJson = await rootBundle.loadString(
          'assets/data/theory-segnali-completo.json',
        );
        final dynamic signalsData = json.decode(signalsJson);

        if (signalsData is Map<String, dynamic> &&
            signalsData['chapters'] != null) {
          final chapters = signalsData['chapters'] as List;
          for (var chapter in chapters) {
            // Convert signals to sections with images
            final signals = chapter['signals'] as List? ?? [];
            final List<TheorySection> sections = [];

            // Add general description section first
            if (chapter['description'] != null) {
              sections.add(
                TheorySection(
                  id: 'desc-${chapter['id']}',
                  title: 'Caratteristiche',
                  content: chapter['description'] ?? '',
                ),
              );
            }

            // Add each signal as a section with its image
            for (var signal in signals) {
              final imagePath = signal['image'] as String?;
              String? fullImagePath;
              if (imagePath != null) {
                // Ensure path starts with 'assets/' if it's in the images folder
                // Convert /images/segnali/xxx.png to assets/images/segnali/xxx.png
                String cleanPath = imagePath.startsWith('/')
                    ? imagePath.substring(1) // Remove leading /
                    : imagePath;

                if (cleanPath.startsWith('images/') &&
                    !cleanPath.startsWith('assets/')) {
                  fullImagePath = 'assets/$cleanPath';
                } else {
                  fullImagePath = cleanPath;
                }
                debugPrint(
                  '🔍 DEBUG IMAGE PATH: $imagePath -> $cleanPath -> $fullImagePath',
                );
              }

              sections.add(
                TheorySection(
                  id: signal['id'] ?? '',
                  title: signal['nome'] ?? 'Segnale',
                  content:
                      '${signal['descrizione'] ?? ''}\n\n📌 Comportamento:\n${signal['comportamento'] ?? ''}',
                  image: fullImagePath,
                ),
              );
            }

            signalChapters.add(
              TheoryChapter(
                id: chapter['id'] ?? '',
                title: chapter['title'] ?? '',
                description: chapter['description'],
                icon: chapter['icon'],
                sections: sections,
              ),
            );
          }
          debugPrint(
            'Loaded ${signalChapters.length} signal chapters with ${signalChapters.fold(0, (sum, c) => sum + c.sections.length)} signals',
          );
        }
      } catch (e) {
        debugPrint('Error loading signals: $e');
      }

      // 2. Load the complete lessons file (with general theory)
      List<TheoryChapter> theoryChapters = [];
      try {
        final String lessonsJson = await rootBundle.loadString(
          'assets/data/theory-pdf-lessons.json',
        );
        final dynamic lessonsData = json.decode(lessonsJson);

        if (lessonsData is Map<String, dynamic> &&
            lessonsData['chapters'] != null) {
          final chapters = lessonsData['chapters'] as List;
          theoryChapters = chapters
              .map((c) => TheoryChapter.fromJson(c))
              .toList();
          debugPrint('Loaded ${theoryChapters.length} theory chapters');
          // Debug: Check if first chapter has images
          if (theoryChapters.isNotEmpty) {
            final firstChapter = theoryChapters.first;
            debugPrint('📸 First chapter: ${firstChapter.title}');
            for (var section in firstChapter.sections) {
              debugPrint(
                '  📷 Section "${section.title}" image: ${section.image}',
              );
            }
          }
        }
      } catch (e) {
        debugPrint('Error loading theory lessons: $e');
      }

      // 3. Combine: Signal chapters first, then general theory
      _chapters = [
        ...theoryChapters,
      ]; // Only load PDF lessons (signals are merged in)

      // Sort by order - signals get priority 1-10, theory gets 100+
      _chapters.sort((a, b) {
        int getOrder(TheoryChapter c) {
          // Signals chapters with numeric IDs
          if (c.id.startsWith('segnali-')) return 1;
          // Extract number from lesson ID
          final match = RegExp(r'(\d+)').firstMatch(c.id);
          if (match != null) return int.parse(match.group(1)!) + 100;
          return 999;
        }

        return getOrder(a).compareTo(getOrder(b));
      });

      _isLoaded = true;
      debugPrint('Theory loaded: ${_chapters.length} total chapters');
    } catch (e) {
      debugPrint('Error loading theory: $e');
      _chapters = [];
    }
  }

  /// Get all chapters (from Manuale di teoria)
  List<TheoryChapter> getAllChapters() => _chapters;

  /// Get PDF Manuale chapters
  List<PdfTheoryChapter> getManualeChapters() => _pdfManuale;

  /// Get PDF Grafiche chapters
  List<PdfTheoryChapter> getGraficheChapters() => _pdfGrafiche;

  /// Get all PDF images
  List<Map<String, dynamic>> getPdfImages() => _pdfImages;

  /// Get images for a specific page
  List<Map<String, dynamic>> getImagesForPage(int page) {
    return _pdfImages.where((img) => img['page'] == page).toList();
  }

  /// Get all PDF lessons (alias for backward compatibility)
  List<TheoryChapter> getPdfLessons() => _chapters;

  /// Get all chapters combined
  List<TheoryChapter> getAllChaptersCombined() => _chapters;

  /// Get a chapter by ID
  TheoryChapter? getChapterById(String id) {
    try {
      return _chapters.firstWhere((c) => c.id == id);
    } catch (_) {
      return null;
    }
  }

  /// Get a PDF chapter by ID
  PdfTheoryChapter? getPdfChapterById(String id) {
    try {
      return _pdfManuale.firstWhere((c) => c.id == id);
    } catch (_) {
      try {
        return _pdfGrafiche.firstWhere((c) => c.id == id);
      } catch (_) {
        return null;
      }
    }
  }

  /// Get chapters for signals (filtered by title)
  List<TheoryChapter> getSignalChapters() {
    return _chapters
        .where(
          (c) =>
              c.title.toLowerCase().contains('segnali') ||
              c.title.toLowerCase().contains('segnaletica') ||
              c.id.contains('segnali'),
        )
        .toList();
  }

  /// Get chapters for general theory (non-signals)
  List<TheoryChapter> getGeneralTheoryChapters() {
    return _chapters
        .where(
          (c) =>
              !c.title.toLowerCase().contains('segnali') &&
              !c.title.toLowerCase().contains('segnaletica') &&
              !c.id.contains('segnali'),
        )
        .toList();
  }

  /// Search chapters by content
  List<TheoryChapter> searchChapters(String query) {
    final normalizedQuery = query.toLowerCase();
    return _chapters
        .where(
          (c) =>
              c.title.toLowerCase().contains(normalizedQuery) ||
              (c.description?.toLowerCase().contains(normalizedQuery) ??
                  false) ||
              c.sections.any(
                (s) =>
                    s.content.toLowerCase().contains(normalizedQuery) ||
                    s.title.toLowerCase().contains(normalizedQuery),
              ),
        )
        .toList();
  }
}
