import 'dart:ui';
import 'package:flutter/material.dart';
import '../../theme/apple_glass_theme.dart';

/// 🔮 Glass Card Widget
/// Premium glassmorphism card with blur, border and optional glow
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
  });

  @override
  Widget build(BuildContext context) {
    final decoration = isSelected && accentColor != null
        ? AppleGlassTheme.glassDecorationSelected(accentColor!)
        : AppleGlassTheme.glassDecoration(radius: borderRadius);

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
class GlassCardLight extends StatelessWidget {
  final Widget child;
  final EdgeInsetsGeometry? padding;
  final EdgeInsetsGeometry? margin;
  final Color? accentColor;
  final bool isSelected;
  final VoidCallback? onTap;
  final double borderRadius;

  const GlassCardLight({
    super.key,
    required this.child,
    this.padding,
    this.margin,
    this.accentColor,
    this.isSelected = false,
    this.onTap,
    this.borderRadius = AppleGlassTheme.radiusXl,
  });

  @override
  Widget build(BuildContext context) {
    final bgColor = isSelected
        ? AppleGlassTheme.glassBgActive
        : AppleGlassTheme.glassBg;

    final borderColor = isSelected && accentColor != null
        ? accentColor!.withValues(alpha: 0.4)
        : AppleGlassTheme.glassBorder;

    final boxShadow = isSelected && accentColor != null
        ? AppleGlassTheme.glowShadow(accentColor!)
        : AppleGlassTheme.shadowMd;

    return Container(
      margin: margin,
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(borderRadius),
          splashColor: Colors.white.withValues(alpha: 0.05),
          highlightColor: Colors.white.withValues(alpha: 0.03),
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
