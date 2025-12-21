import 'dart:convert';
import 'package:flutter/services.dart';
import '../models/italian_test.dart';

class ItalianTestService {
  /// Load a specific test by level and section
  /// e.g. loadTest('a2', 'reading') loads assets/data/italian-tests/a2-reading.json
  Future<ItalianTest> loadTest(String level, String section) async {
    try {
      final String path =
          'assets/data/italian-tests/${level.toLowerCase()}-${section.toLowerCase()}.json';
      final String jsonString = await rootBundle.loadString(path);
      final Map<String, dynamic> jsonMap = json.decode(jsonString);
      return ItalianTest.fromJson(jsonMap);
    } catch (e) {
      print('Error loading Italian test $level-$section: $e');
      rethrow;
    }
  }

  /// Get available sections for a level
  List<String> getSectionsForLevel(String level) {
    return ['reading', 'listening', 'grammar'];
  }
}
