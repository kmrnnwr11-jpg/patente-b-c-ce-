import 'dart:ui';
import 'package:flutter/material.dart';
import '../../theme/apple_glass_theme.dart';

/// 🔮 Glass Card Widget
/// Premium glassmorphism card with blur, border and optional glow
/// Supports both Dark Mode (transparent glass) and Light Mode (solid white with shadows)
class GlassCard extends StatelessWidget {
  final Widget child;
  final EdgeInsetsGeometry? padding;
  final EdgeInsetsGeometry? margin;
  final double? width;
  final double? height;
  final Color? accentColor;
  final bool isSelected;
  final VoidCallback? onTap;
  final double borderRadius;
  final bool isDarkMode;

  const GlassCard({
    super.key,
    required this.child,
    this.padding,
    this.margin,
    this.width,
    this.height,
    this.accentColor,
    this.isSelected = false,
    this.onTap,
    this.borderRadius = AppleGlassTheme.radiusXl,
    this.isDarkMode = true,
  });

  @override
  Widget build(BuildContext context) {
    // Determine decoration based on mode and selection
    final BoxDecoration decoration;

    if (isSelected && accentColor != null) {
      decoration = AppleGlassTheme.glassDecorationSelected(accentColor!);
    } else if (isDarkMode) {
      // Dark Mode: Transparent glass effect
      decoration = AppleGlassTheme.glassDecoration(radius: borderRadius);
    } else {
      // Light Mode: Warm cream style with soft shadow
      decoration = BoxDecoration(
        color: AppleGlassTheme.cardBgLight,
        borderRadius: BorderRadius.circular(borderRadius),
        border: Border.all(color: AppleGlassTheme.cardBorderLight, width: 1),
        boxShadow: [
          BoxShadow(
            color: Colors.brown.withValues(alpha: 0.06),
            blurRadius: 20,
            offset: const Offset(0, 4),
            spreadRadius: 0,
          ),
          BoxShadow(
            color: Colors.brown.withValues(alpha: 0.03),
            blurRadius: 6,
            offset: const Offset(0, 2),
            spreadRadius: 0,
          ),
        ],
      );
    }

    // In light mode, skip the backdrop filter for cleaner look
    if (!isDarkMode) {
      return Container(
        width: width,
        height: height,
        margin: margin,
        child: Material(
          color: Colors.transparent,
          child: InkWell(
            onTap: onTap,
            borderRadius: BorderRadius.circular(borderRadius),
            splashColor: Colors.grey.withValues(alpha: 0.1),
            highlightColor: Colors.grey.withValues(alpha: 0.05),
            child: AnimatedContainer(
              duration: AppleGlassTheme.durationFast,
              decoration: decoration,
              padding: padding ?? const EdgeInsets.all(AppleGlassTheme.space5),
              child: child,
            ),
          ),
        ),
      );
    }

    // Dark Mode with backdrop blur
    return Container(
      width: width,
      height: height,
      margin: margin,
      child: ClipRRect(
        borderRadius: BorderRadius.circular(borderRadius),
        child: BackdropFilter(
          filter: ImageFilter.blur(
            sigmaX: AppleGlassTheme.blurLg,
            sigmaY: AppleGlassTheme.blurLg,
          ),
          child: Material(
            color: Colors.transparent,
            child: InkWell(
              onTap: onTap,
              borderRadius: BorderRadius.circular(borderRadius),
              splashColor: Colors.white.withValues(alpha: 0.05),
              highlightColor: Colors.white.withValues(alpha: 0.03),
              child: AnimatedContainer(
                duration: AppleGlassTheme.durationFast,
                decoration: decoration,
                padding:
                    padding ?? const EdgeInsets.all(AppleGlassTheme.space5),
                child: child,
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/// 🔮 Glass Card without blur (for performance on web)
/// Same styling as GlassCard but without backdrop filter
class GlassCardLight extends StatelessWidget {
  final Widget child;
  final EdgeInsetsGeometry? padding;
  final EdgeInsetsGeometry? margin;
  final Color? accentColor;
  final bool isSelected;
  final VoidCallback? onTap;
  final double borderRadius;
  final bool isDarkMode;

  const GlassCardLight({
    super.key,
    required this.child,
    this.padding,
    this.margin,
    this.accentColor,
    this.isSelected = false,
    this.onTap,
    this.borderRadius = AppleGlassTheme.radiusXl,
    this.isDarkMode = true,
  });

  @override
  Widget build(BuildContext context) {
    // Background color
    final Color bgColor;
    if (!isDarkMode) {
      // Light Mode: Water Glass
      bgColor = isSelected
          ? const Color(0xFFB2EBF2).withOpacity(0.5) // Cyan 100 (Selected)
          : AppleGlassTheme.cardBgLight;
    } else {
      // Dark Mode: Transparent glass
      bgColor = isSelected
          ? AppleGlassTheme.glassBgActive
          : AppleGlassTheme.glassBg;
    }

    // Border color
    final Color borderColor;
    if (isSelected && accentColor != null) {
      borderColor = accentColor!.withValues(alpha: 0.4);
    } else if (!isDarkMode) {
      borderColor = AppleGlassTheme.cardBorderLight;
    } else {
      borderColor = AppleGlassTheme.glassBorder;
    }

    // Box shadow
    final List<BoxShadow> boxShadow;
    if (isSelected && accentColor != null) {
      boxShadow = AppleGlassTheme.glowShadow(accentColor!);
    } else if (!isDarkMode) {
      // Light Mode: Warm soft shadow
      boxShadow = [
        BoxShadow(
          color: Colors.brown.withValues(alpha: 0.06),
          blurRadius: 16,
          offset: const Offset(0, 4),
          spreadRadius: 0,
        ),
        BoxShadow(
          color: Colors.brown.withValues(alpha: 0.03),
          blurRadius: 4,
          offset: const Offset(0, 2),
          spreadRadius: 0,
        ),
      ];
    } else {
      boxShadow = AppleGlassTheme.shadowMd;
    }

    return Container(
      margin: margin,
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(borderRadius),
          splashColor: isDarkMode
              ? Colors.white.withValues(alpha: 0.05)
              : Colors.grey.withValues(alpha: 0.1),
          highlightColor: isDarkMode
              ? Colors.white.withValues(alpha: 0.03)
              : Colors.grey.withValues(alpha: 0.05),
          child: AnimatedContainer(
            duration: AppleGlassTheme.durationFast,
            padding: padding ?? const EdgeInsets.all(AppleGlassTheme.space5),
            decoration: BoxDecoration(
              color: bgColor,
              borderRadius: BorderRadius.circular(borderRadius),
              border: Border.all(color: borderColor, width: 1),
              boxShadow: boxShadow,
            ),
            child: child,
          ),
        ),
      ),
    );
  }
}
