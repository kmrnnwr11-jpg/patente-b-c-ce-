import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'theme/app_theme.dart';
import 'screens/role_based_home_screen.dart';

import 'screens/italian_dashboard_screen.dart';
import 'screens/course_selection_screen.dart';
import 'screens/license_selection_screen.dart';
import 'screens/auth/splash_screen.dart';
import 'screens/auth/login_screen.dart';
import 'services/firebase_service.dart';
import 'services/course_service.dart';
import 'services/achievement_service.dart';
import 'services/theory_service.dart';
import 'services/word_translation_service.dart';
import 'services/quiz_service.dart';
import 'services/bookmark_service.dart';
import 'services/stats_service.dart';
import 'services/translation_service.dart';
import 'providers/auth_provider.dart';
import 'providers/theme_provider.dart';
import 'widgets/achievement_overlay_handler.dart';

void main() async {
  // Ensure Flutter bindings are initialized
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize Firebase
  try {
    await FirebaseService().initialize();
  } catch (e) {
    debugPrint('Failed to initialize Firebase: $e');
  }

  // Initialize Services
  final courseService = CourseService();
  await courseService.initialize();

  final achievementService = AchievementService();
  await achievementService.load();

  final theoryService = TheoryService();
  await theoryService.loadTheory();

  final wordService = WordTranslationService();
  await wordService.loadTranslations();

  final quizService = QuizService();
  final bookmarkService = BookmarkService();
  final statsService = StatsService();
  final themeProvider = ThemeProvider(); // Init ThemeProvider

  // Initialize TranslationService with both local and Firestore data
  final translationService = TranslationService();
  await translationService.loadTranslations(); // Load English from JSON
  await translationService
      .loadFromFirestore(); // Load Urdu/Punjabi from Firebase

  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => courseService),
        ChangeNotifierProvider(
          create: (_) => themeProvider,
        ), // Add ThemeProvider
        Provider(create: (_) => achievementService),
        Provider(create: (_) => theoryService),
        Provider(create: (_) => wordService),
        // Added services
        Provider(create: (_) => quizService),
        Provider(create: (_) => bookmarkService),
        ChangeNotifierProvider.value(value: statsService),
        Provider(create: (_) => translationService),
      ],
      child: const PatenteBApp(),
    ),
  );
}

/// Main application widget
class PatenteBApp extends StatelessWidget {
  const PatenteBApp({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer2<CourseService, ThemeProvider>(
      builder: (context, courseService, themeProvider, child) {
        return MaterialApp(
          title: 'Patente B Quiz',
          debugShowCheckedModeBanner: false,
          theme: AppTheme.lightTheme, // Default Light
          darkTheme: AppTheme.darkTheme, // Default Dark
          themeMode: themeProvider.themeMode, // Dynamic Theme Mode
          builder: (context, child) {
            // Avvia il monitoraggio della sessione se l'utente è loggato
            WidgetsBinding.instance.addPostFrameCallback((_) {
              context.read<AuthProvider>().startSessionMonitoring(context);
            });
            return AchievementOverlayHandler(child: child!);
          },
          home: SplashScreen(
            authenticatedScreen: _getHomeScreen(courseService),
            loginScreen: LoginScreen(
              destinationScreen: _getHomeScreen(courseService),
            ),
          ),
        );
      },
    );
  }

  Widget _getHomeScreen(CourseService service) {
    if (!service.hasSelectedCourse) {
      return const CourseSelectionScreen();
    }

    switch (service.currentCourse) {
      case CourseType.patente:
        // Check if license selected, otherwise show license selection
        if (!service.hasSelectedLicense) {
          return const LicenseSelectionScreen();
        }
        return const AdminModeSwitch();
      case CourseType.italiano:
        return const ItalianDashboardScreen();
    }
  }
}
