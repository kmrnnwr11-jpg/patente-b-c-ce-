import 'dart:convert';
import 'package:flutter/services.dart';
import '../models/theory_chapter.dart';

/// Service for loading and managing theory content
class TheoryService {
  List<TheoryChapter> _chapters = [];
  bool _isLoaded = false;

  /// Load theory chapters from JSON asset
  Future<void> loadTheory() async {
    if (_isLoaded) return;

    try {
      final String jsonString = await rootBundle.loadString(
        'assets/data/theory-structure.json',
      );
      final dynamic jsonData = json.decode(jsonString);

      // Handle both array and object formats
      if (jsonData is List) {
        _chapters = jsonData
            .map((json) => TheoryChapter.fromJson(json))
            .toList();
      } else if (jsonData is Map<String, dynamic>) {
        // If it's an object with chapters key
        final chapters = jsonData['chapters'] ?? jsonData['lessons'] ?? [];
        _chapters = (chapters as List)
            .map((json) => TheoryChapter.fromJson(json))
            .toList();
      }

      _isLoaded = true;
    } catch (e) {
      print('Error loading theory: $e');
      _chapters = [];
    }
  }

  /// Get all chapters
  List<TheoryChapter> getAllChapters() => _chapters;

  /// Get a chapter by ID
  TheoryChapter? getChapterById(String id) {
    try {
      return _chapters.firstWhere((c) => c.id == id);
    } catch (_) {
      return null;
    }
  }

  /// Get chapters for signals (filtered)
  List<TheoryChapter> getSignalChapters() {
    return _chapters
        .where(
          (c) =>
              c.title.toLowerCase().contains('segnali') ||
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
              !c.id.contains('segnali'),
        )
        .toList();
  }

  /// Search chapters by title
  List<TheoryChapter> searchChapters(String query) {
    final normalizedQuery = query.toLowerCase();
    return _chapters
        .where(
          (c) =>
              c.title.toLowerCase().contains(normalizedQuery) ||
              (c.description?.toLowerCase().contains(normalizedQuery) ?? false),
        )
        .toList();
  }
}
