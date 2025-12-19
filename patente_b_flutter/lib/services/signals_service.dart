import 'dart:convert';
import 'package:flutter/services.dart';
import '../models/signal.dart';

/// Service for loading and managing traffic signals
class SignalsService {
  List<Signal> _signals = [];
  bool _isLoaded = false;

  /// Load signals from JSON asset
  Future<void> loadSignals() async {
    if (_isLoaded) return;

    try {
      final String jsonString = await rootBundle.loadString(
        'assets/data/theory-segnali-completo.json',
      );
      final List<dynamic> jsonList = json.decode(jsonString);

      _signals = jsonList.map((json) => Signal.fromJson(json)).toList();
      _isLoaded = true;
    } catch (e) {
      print('Error loading signals: $e');
      _signals = [];
    }
  }

  /// Get all signals
  List<Signal> getAllSignals() => _signals;

  /// Get signals by category
  List<Signal> getByCategory(String category) {
    final normalizedCategory = category.toLowerCase();
    return _signals
        .where((s) => s.category.toLowerCase().contains(normalizedCategory))
        .toList();
  }

  /// Get signals by category enum
  List<Signal> getByCategoryEnum(SignalCategory category) {
    return getByCategory(category.id);
  }

  /// Get a single signal by ID
  Signal? getById(String id) {
    try {
      return _signals.firstWhere((s) => s.id == id);
    } catch (_) {
      return null;
    }
  }

  /// Search signals by name
  List<Signal> searchByName(String query) {
    final normalizedQuery = query.toLowerCase();
    return _signals
        .where((s) => s.name.toLowerCase().contains(normalizedQuery))
        .toList();
  }

  /// Get unique categories
  List<String> getCategories() {
    return _signals.map((s) => s.category).toSet().toList();
  }
}
