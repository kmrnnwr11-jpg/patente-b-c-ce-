import 'package:flutter/material.dart';
import 'theme/app_theme.dart';
import 'screens/dashboard_screen.dart';

void main() {
  runApp(const PatenteBApp());
}

/// Main application widget
class PatenteBApp extends StatelessWidget {
  const PatenteBApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Patente B Quiz',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.darkTheme,
      home: const DashboardScreen(),
    );
  }
}
