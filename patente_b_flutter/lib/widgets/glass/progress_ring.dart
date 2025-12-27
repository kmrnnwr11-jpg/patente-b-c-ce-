import 'dart:math' as math;
import 'package:flutter/material.dart';
import '../../theme/apple_glass_theme.dart';

/// ⭕ Progress Ring Widget
/// Circular progress indicator with percentage display
class ProgressRing extends StatelessWidget {
  final double progress; // 0.0 to 1.0
  final double size;
  final double strokeWidth;
  final Color? color;
  final Color? backgroundColor;
  final Widget? child;
  final bool showPercentage;

  const ProgressRing({
    super.key,
    required this.progress,
    this.size = 120,
    this.strokeWidth = 8,
    this.color,
    this.backgroundColor,
    this.child,
    this.showPercentage = true,
  });

  @override
  Widget build(BuildContext context) {
    final progressColor = color ?? AppleGlassTheme.accentBlue;
    final bgColor = backgroundColor ?? Colors.white.withValues(alpha: 0.1);
    final percentage = (progress * 100).round();

    return SizedBox(
      width: size,
      height: size,
      child: Stack(
        alignment: Alignment.center,
        children: [
          // Background ring
          CustomPaint(
            size: Size(size, size),
            painter: _RingPainter(
              progress: 1.0,
              color: bgColor,
              strokeWidth: strokeWidth,
            ),
          ),
          // Progress ring
          TweenAnimationBuilder<double>(
            tween: Tween(begin: 0, end: progress),
            duration: AppleGlassTheme.durationSlow,
            curve: Curves.easeOutCubic,
            builder: (context, animatedProgress, _) {
              return CustomPaint(
                size: Size(size, size),
                painter: _RingPainter(
                  progress: animatedProgress,
                  color: progressColor,
                  strokeWidth: strokeWidth,
                ),
              );
            },
          ),
          // Center content
          if (child != null)
            child!
          else if (showPercentage)
            Text(
              '$percentage%',
              style: TextStyle(
                fontSize: size * 0.22,
                fontWeight: FontWeight.w700,
                color: AppleGlassTheme.textPrimary,
              ),
            ),
        ],
      ),
    );
  }
}

class _RingPainter extends CustomPainter {
  final double progress;
  final Color color;
  final double strokeWidth;

  _RingPainter({
    required this.progress,
    required this.color,
    required this.strokeWidth,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = (size.width - strokeWidth) / 2;

    final paint = Paint()
      ..color = color
      ..strokeWidth = strokeWidth
      ..strokeCap = StrokeCap.round
      ..style = PaintingStyle.stroke;

    final sweepAngle = 2 * math.pi * progress;
    const startAngle = -math.pi / 2; // Start from top

    canvas.drawArc(
      Rect.fromCircle(center: center, radius: radius),
      startAngle,
      sweepAngle,
      false,
      paint,
    );
  }

  @override
  bool shouldRepaint(_RingPainter oldDelegate) =>
      oldDelegate.progress != progress ||
      oldDelegate.color != color ||
      oldDelegate.strokeWidth != strokeWidth;
}

/// 🏷️ Glass Badge Widget
class GlassBadge extends StatelessWidget {
  final String label;
  final Color? color;
  final bool showDot;

  const GlassBadge({
    super.key,
    required this.label,
    this.color,
    this.showDot = false,
  });

  @override
  Widget build(BuildContext context) {
    final badgeColor = color ?? AppleGlassTheme.accentOrange;

    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: AppleGlassTheme.space2,
        vertical: AppleGlassTheme.space1,
      ),
      decoration: BoxDecoration(
        color: badgeColor.withValues(alpha: 0.15),
        borderRadius: BorderRadius.circular(AppleGlassTheme.radiusSm),
        border: Border.all(color: badgeColor.withValues(alpha: 0.3), width: 1),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (showDot) ...[
            Container(
              width: 6,
              height: 6,
              decoration: BoxDecoration(
                color: badgeColor,
                shape: BoxShape.circle,
              ),
            ),
            const SizedBox(width: AppleGlassTheme.space1),
          ],
          Text(
            label,
            style: TextStyle(
              fontSize: AppleGlassTheme.textXs,
              fontWeight: FontWeight.w600,
              color: badgeColor,
              letterSpacing: 0.5,
            ),
          ),
        ],
      ),
    );
  }
}
