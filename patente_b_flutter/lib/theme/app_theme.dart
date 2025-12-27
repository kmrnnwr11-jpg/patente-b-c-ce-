import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

/// App theme with Duolingo-inspired design for accessibility
/// Optimized for foreigners learning Italian driving theory
class AppTheme {
  // ═══════════════════════════════════════════════════════════════════════════
  // COLORI PRIMARI - Blu Patente (come cartello informativo)
  // ═══════════════════════════════════════════════════════════════════════════
  static const Color primaryColor = Color(0xFF1976D2);
  static const Color primaryLight = Color(0xFF42A5F5);
  static const Color primaryDark = Color(0xFF1565C0);

  // ═══════════════════════════════════════════════════════════════════════════
  // COLORI SEMANTICI - Feedback Quiz (come semaforo)
  // ═══════════════════════════════════════════════════════════════════════════
  static const Color successGreen = Color(0xFF4CAF50); // Risposta corretta
  static const Color errorRed = Color(0xFFF44336); // Risposta sbagliata
  static const Color warningOrange = Color(0xFFFF9800); // Attenzione
  static const Color infoPurple = Color(0xFF9C27B0); // Info/Traduzione

  // Alias per compatibilità
  static const Color accentGreen = successGreen;
  static const Color accentRed = errorRed;
  static const Color accentOrange = warningOrange;
  static const Color accentPurple = infoPurple;

  // ═══════════════════════════════════════════════════════════════════════════
  // COLORI GAMIFICATION - Duolingo style
  // ═══════════════════════════════════════════════════════════════════════════
  static const Color streakOrange = Color(0xFFFF9500);
  static const Color xpGold = Color(0xFFFFD700);
  static const Color levelBlue = Color(0xFF58CC02);

  // ═══════════════════════════════════════════════════════════════════════════
  // SFONDO - Dark Theme
  // ═══════════════════════════════════════════════════════════════════════════
  static const Color backgroundColor = Color(0xFF121212);
  static const Color surfaceColor = Color(0xFF1E1E1E);
  static const Color cardColor = Color(0xFF2C2C2C);

  // ═══════════════════════════════════════════════════════════════════════════
  // TESTO
  // ═══════════════════════════════════════════════════════════════════════════
  static const Color textPrimary = Color(0xFFF5F5F5);
  static const Color textSecondary = Color(0xFFB0B0B0);

  // Gradients
  static const LinearGradient primaryGradient = LinearGradient(
    colors: [primaryColor, primaryLight],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient successGradient = LinearGradient(
    colors: [Color(0xFF059669), Color(0xFF10B981)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient dangerGradient = LinearGradient(
    colors: [Color(0xFFDC2626), Color(0xFFEF4444)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      colorScheme: ColorScheme.light(
        primary: primaryColor,
        secondary: accentGreen,
        surface: Colors.white, // Slate 100
        error: accentRed,
        onPrimary: Colors.white,
        onSurface: const Color(0xFF1E293B), // Slate 800
      ),
      scaffoldBackgroundColor: const Color(0xFFF8FAFC), // Slate 50
      cardColor: Colors.white,
      dividerColor: const Color(0xFFE2E8F0), // Slate 200
      textTheme: GoogleFonts.interTextTheme(ThemeData.light().textTheme).apply(
        bodyColor: const Color(0xFF1E293B), // Slate 800
        displayColor: const Color(0xFF0F172A), // Slate 900
      ),
      appBarTheme: AppBarTheme(
        backgroundColor: Colors.white,
        elevation: 0,
        centerTitle: true,
        iconTheme: const IconThemeData(color: Color(0xFF1E293B)),
        titleTextStyle: GoogleFonts.inter(
          fontSize: 20,
          fontWeight: FontWeight.w600,
          color: const Color(0xFF1E293B),
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: primaryColor,
          foregroundColor: Colors.white,
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          textStyle: GoogleFonts.inter(
            fontSize: 16,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
      cardTheme: const CardThemeData(
        color: Colors.white,
        elevation: 2,
        shadowColor: Color(0x1A000000), // Black with low opacity
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.all(Radius.circular(16)),
        ),
      ),
    );
  }

  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      colorScheme: ColorScheme.dark(
        primary: primaryColor,
        secondary: accentGreen,
        surface: surfaceColor,
        error: accentRed,
      ),
      scaffoldBackgroundColor: backgroundColor,
      cardColor: cardColor,
      textTheme: GoogleFonts.interTextTheme(
        ThemeData.dark().textTheme,
      ).apply(bodyColor: textPrimary, displayColor: textPrimary),
      appBarTheme: AppBarTheme(
        backgroundColor: backgroundColor,
        elevation: 0,
        centerTitle: true,
        titleTextStyle: GoogleFonts.inter(
          fontSize: 20,
          fontWeight: FontWeight.w600,
          color: textPrimary,
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: primaryColor,
          foregroundColor: textPrimary,
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          textStyle: GoogleFonts.inter(
            fontSize: 16,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
      cardTheme: const CardThemeData(
        color: cardColor,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.all(Radius.circular(16)),
        ),
      ),
    );
  }
}
