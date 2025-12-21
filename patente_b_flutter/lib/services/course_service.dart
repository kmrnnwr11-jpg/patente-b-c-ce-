import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

enum CourseType { patente, italiano }

class CourseService extends ChangeNotifier {
  static const String _prefsKey = 'selected_course';
  CourseType _currentCourse = CourseType.patente;
  bool _isLoaded = false;
  bool _hasSelectedCourse = false;

  CourseType get currentCourse => _currentCourse;
  bool get isLoaded => _isLoaded;
  bool get hasSelectedCourse => _hasSelectedCourse;

  CourseService();

  Future<void> initialize() async {
    final prefs = await SharedPreferences.getInstance();
    final courseIndex = prefs.getInt(_prefsKey);

    if (courseIndex != null &&
        courseIndex >= 0 &&
        courseIndex < CourseType.values.length) {
      _currentCourse = CourseType.values[courseIndex];
      _hasSelectedCourse = true;
    } else {
      _hasSelectedCourse = false;
    }

    _isLoaded = true;
    notifyListeners();
  }

  Future<void> setCourse(CourseType course) async {
    _currentCourse = course;
    notifyListeners();

    final prefs = await SharedPreferences.getInstance();
    await prefs.setInt(_prefsKey, course.index);
  }

  String getCourseName(CourseType type) {
    switch (type) {
      case CourseType.patente:
        return 'Patente B';
      case CourseType.italiano:
        return 'Italiano';
    }
  }
}
