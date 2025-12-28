import 'package:flutter/material.dart';

/// 🍎 Apple Glass Design System
/// Premium glassmorphism theme for Patente App
class AppleGlassTheme {
  // ═══════════════════════════════════════════════════════════════════════════
  // COLORS - Background
  // ═══════════════════════════════════════════════════════════════════════════
  static const Color bgPrimary = Color(0xFF0A0A0F);
  static const Color bgSecondary = Color(0xFF13131A);
  static const Color bgTertiary = Color(0xFF1A1A24);

  static const LinearGradient bgGradient = LinearGradient(
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
    colors: [bgPrimary, bgSecondary, bgTertiary],
    stops: [0.0, 0.5, 1.0],
  );

  // Light Mode: Moroccan Cream Gradient
  static const LinearGradient bgGradientLight = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [
      Color(0xFFFAF3E0), // Moroccan Cream (Light)
      Color(0xFFE8DCCA), // Moroccan Beige (Darker)
    ],
    stops: [0.0, 1.0],
  );

  // Light Mode Card Colors
  // Light Mode Card Colors (Water Glass)
  static const Color cardBgLight = Color(
    0x80E0F7FA,
  ); // Water Blue (50% opacity)
  static const Color cardBorderLight = Color(
    0x99FFFFFF,
  ); // White border (60% opacity)

  // Mesh gradient overlay colors
  static const Color meshPurple = Color(0x1F7877C6); // 12% opacity
  static const Color meshPink = Color(0x14FF7773); // 8% opacity

  // ═══════════════════════════════════════════════════════════════════════════
  // COLORS - Glass Effects
  // ═══════════════════════════════════════════════════════════════════════════
  static const Color glassBg = Color(0x08FFFFFF); // 3% white
  static const Color glassBgHover = Color(0x0DFFFFFF); // 5% white
  static const Color glassBgActive = Color(0x12FFFFFF); // 7% white
  static const Color glassBorder = Color(0x0FFFFFFF); // 6% white
  static const Color glassBorderHover = Color(0x1AFFFFFF); // 10% white
  static const Color glassHighlight = Color(0x1FFFFFFF); // 12% white

  // ═══════════════════════════════════════════════════════════════════════════
  // COLORS - Accent (Per licenza)
  // ═══════════════════════════════════════════════════════════════════════════
  static const Color accentBlue = Color(0xFF5E9EFF); // Patente B
  static const Color accentOrange = Color(0xFFFF9F5E); // Patente C
  static const Color accentRed = Color(0xFFFF6B6B); // Patente CE
  static const Color accentPurple = Color(0xFFA78BFA); // CQC Merci
  static const Color accentCyan = Color(0xFF5EEAD4); // CQC Persone

  // Glow variants (15% opacity)
  static Color glowBlue = accentBlue.withValues(alpha: 0.15);
  static Color glowOrange = accentOrange.withValues(alpha: 0.15);
  static Color glowRed = accentRed.withValues(alpha: 0.15);
  static Color glowPurple = accentPurple.withValues(alpha: 0.15);
  static Color glowCyan = accentCyan.withValues(alpha: 0.15);

  // ═══════════════════════════════════════════════════════════════════════════
  // COLORS - Semantic
  // ═══════════════════════════════════════════════════════════════════════════
  static const Color success = Color(0xFF34D399);
  static const Color successBg = Color(0x1A34D399); // 10%
  static const Color successBorder = Color(0x4D34D399); // 30%

  static const Color warning = Color(0xFFFBBF24);
  static const Color warningBg = Color(0x1AFBBF24);
  static const Color warningBorder = Color(0x4DFBBF24);

  static const Color error = Color(0xFFF87171);
  static const Color errorBg = Color(0x1AF87171);
  static const Color errorBorder = Color(0x4DF87171);

  // ═══════════════════════════════════════════════════════════════════════════
  // COLORS - Text
  // ═══════════════════════════════════════════════════════════════════════════
  static const Color textPrimary = Color(0xF2FFFFFF); // 95%
  static const Color textSecondary = Color(0x99FFFFFF); // 60%
  static const Color textTertiary = Color(0x66FFFFFF); // 40%
  static const Color textQuaternary = Color(0x40FFFFFF); // 25%

  // Text Colors for Light Background
  // Text Colors for Light Background (Deep Teal/Cyan)
  // Text Colors for Light Background (Deep Teal/Cyan)
  static const Color textPrimaryDark = Color(0xFF000000); // Black (Primary)
  static const Color textSecondaryDark = Color(
    0xB3000000,
  ); // Black 70% (Secondary)
  static const Color textTertiaryDark = Color(
    0x80000000,
  ); // Black 50% (Tertiary)

  // ═══════════════════════════════════════════════════════════════════════════
  // TYPOGRAPHY
  // ═══════════════════════════════════════════════════════════════════════════
  static const String fontFamily = 'SF Pro Display';

  static const double textXs = 11.0;
  static const double textSm = 13.0;
  static const double textBase = 15.0;
  static const double textLg = 17.0;
  static const double textXl = 20.0;
  static const double text2xl = 24.0;
  static const double text3xl = 28.0;
  static const double text4xl = 34.0;
  static const double text5xl = 48.0;

  // ═══════════════════════════════════════════════════════════════════════════
  // SPACING
  // ═══════════════════════════════════════════════════════════════════════════
  static const double space1 = 4.0;
  static const double space2 = 8.0;
  static const double space3 = 12.0;
  static const double space4 = 16.0;
  static const double space5 = 20.0;
  static const double space6 = 24.0;
  static const double space8 = 32.0;
  static const double space10 = 40.0;
  static const double space12 = 48.0;
  static const double space16 = 64.0;

  // ═══════════════════════════════════════════════════════════════════════════
  // BORDER RADIUS
  // ═══════════════════════════════════════════════════════════════════════════
  static const double radiusSm = 8.0;
  static const double radiusMd = 12.0;
  static const double radiusLg = 16.0;
  static const double radiusXl = 20.0;
  static const double radius2xl = 24.0;
  static const double radius3xl = 32.0;

  // ═══════════════════════════════════════════════════════════════════════════
  // BLUR
  // ═══════════════════════════════════════════════════════════════════════════
  static const double blurSm = 8.0;
  static const double blurMd = 16.0;
  static const double blurLg = 20.0;
  static const double blurXl = 40.0;

  // ═══════════════════════════════════════════════════════════════════════════
  // ANIMATIONS
  // ═══════════════════════════════════════════════════════════════════════════
  static const Duration durationFast = Duration(milliseconds: 150);
  static const Duration durationNormal = Duration(milliseconds: 250);
  static const Duration durationSlow = Duration(milliseconds: 400);

  static const Curve easeDefault = Curves.easeOutCubic;
  static const Curve easeSpring = Curves.elasticOut;

  // ═══════════════════════════════════════════════════════════════════════════
  // BOX SHADOWS
  // ═══════════════════════════════════════════════════════════════════════════
  static List<BoxShadow> shadowMd = [
    BoxShadow(
      color: Colors.black.withValues(alpha: 0.1),
      blurRadius: 16,
      offset: const Offset(0, 4),
    ),
  ];

  static List<BoxShadow> shadowLg = [
    BoxShadow(
      color: Colors.black.withValues(alpha: 0.12),
      blurRadius: 32,
      offset: const Offset(0, 8),
    ),
  ];

  static List<BoxShadow> glowShadow(Color color) => [
    BoxShadow(
      color: color.withValues(alpha: 0.15),
      blurRadius: 60,
      spreadRadius: 0,
    ),
  ];

  // ═══════════════════════════════════════════════════════════════════════════
  // GLASS DECORATION
  // ═══════════════════════════════════════════════════════════════════════════
  static BoxDecoration glassDecoration({
    Color? borderColor,
    double radius = radiusXl,
    bool withHighlight = true,
  }) {
    return BoxDecoration(
      color: glassBg,
      borderRadius: BorderRadius.circular(radius),
      border: Border.all(color: borderColor ?? glassBorder, width: 1),
      gradient: withHighlight
          ? LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.center,
              colors: [
                glassHighlight.withValues(alpha: 0.06),
                Colors.transparent,
              ],
            )
          : null,
    );
  }

  static BoxDecoration glassDecorationLight({double radius = radiusXl}) {
    return BoxDecoration(
      color: cardBgLight,
      borderRadius: BorderRadius.circular(radius),
      border: Border.all(color: cardBorderLight, width: 1.5),
      boxShadow: [
        BoxShadow(
          color: Colors.black.withOpacity(0.1),
          blurRadius: 20,
          offset: const Offset(0, 8),
        ),
      ],
    );
  }

  static BoxDecoration glassDecorationSelected(Color accentColor) {
    return BoxDecoration(
      color: glassBgActive,
      borderRadius: BorderRadius.circular(radiusXl),
      border: Border.all(color: accentColor.withValues(alpha: 0.4), width: 1),
      boxShadow: glowShadow(accentColor),
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // TEXT STYLES
  // ═══════════════════════════════════════════════════════════════════════════
  static TextStyle get titleLarge => const TextStyle(
    fontSize: text3xl,
    fontWeight: FontWeight.w600,
    color: textPrimary,
    letterSpacing: -0.02 * text3xl,
  );

  static TextStyle get titleMedium => const TextStyle(
    fontSize: textXl,
    fontWeight: FontWeight.w600,
    color: textPrimary,
  );

  static TextStyle get bodyLarge => const TextStyle(
    fontSize: textLg,
    fontWeight: FontWeight.w500,
    color: textPrimary,
  );

  static TextStyle get bodyMedium => const TextStyle(
    fontSize: textBase,
    fontWeight: FontWeight.w400,
    color: textSecondary,
  );

  static TextStyle get labelSmall => const TextStyle(
    fontSize: textXs,
    fontWeight: FontWeight.w600,
    color: textQuaternary,
    letterSpacing: 0.1 * textXs,
  );

  static TextStyle get statValue => const TextStyle(
    fontSize: textBase,
    fontWeight: FontWeight.w600,
    color: textPrimary,
  );

  static TextStyle get statLabel => const TextStyle(
    fontSize: textXs,
    fontWeight: FontWeight.w400,
    color: textTertiary,
  );
}
