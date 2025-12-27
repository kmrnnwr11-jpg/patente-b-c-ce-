import 'package:flutter/material.dart';
import 'dart:math' as math;
import '../../theme/app_theme.dart';

/// Widget cerchio progresso animato con percentuale
/// Stile Duolingo per mostrare avanzamento studio
class ProgressCircle extends StatelessWidget {
  final double percentage; // 0.0 - 1.0
  final double size;
  final double strokeWidth;
  final Color? backgroundColor;
  final Color? progressColor;
  final Widget? child;
  final bool showPercentageText;

  const ProgressCircle({
    super.key,
    required this.percentage,
    this.size = 120,
    this.strokeWidth = 12,
    this.backgroundColor,
    this.progressColor,
    this.child,
    this.showPercentageText = true,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final bgColor =
        backgroundColor ?? theme.colorScheme.onSurface.withValues(alpha: 0.1);
    final fgColor = progressColor ?? _getProgressColor(percentage);

    return SizedBox(
      width: size,
      height: size,
      child: Stack(
        alignment: Alignment.center,
        children: [
          // Cerchio sfondo
          CustomPaint(
            size: Size(size, size),
            painter: _CirclePainter(
              progress: 1.0,
              color: bgColor,
              strokeWidth: strokeWidth,
            ),
          ),
          // Cerchio progresso animato
          TweenAnimationBuilder<double>(
            tween: Tween(begin: 0, end: percentage),
            duration: const Duration(milliseconds: 800),
            curve: Curves.easeOutCubic,
            builder: (context, value, _) {
              return CustomPaint(
                size: Size(size, size),
                painter: _CirclePainter(
                  progress: value,
                  color: fgColor,
                  strokeWidth: strokeWidth,
                ),
              );
            },
          ),
          // Contenuto centrale
          child ??
              (showPercentageText
                  ? Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text(
                          '${(percentage * 100).toInt()}%',
                          style: TextStyle(
                            fontSize: size * 0.22,
                            fontWeight: FontWeight.bold,
                            color: theme.colorScheme.onSurface,
                          ),
                        ),
                        Text(
                          'completato',
                          style: TextStyle(
                            fontSize: size * 0.1,
                            color: theme.colorScheme.onSurface.withValues(
                              alpha: 0.6,
                            ),
                          ),
                        ),
                      ],
                    )
                  : const SizedBox.shrink()),
        ],
      ),
    );
  }

  // Colore dinamico basato sul progresso
  Color _getProgressColor(double progress) {
    if (progress < 0.3) return AppTheme.warningOrange;
    if (progress < 0.7) return AppTheme.primaryColor;
    return AppTheme.successGreen;
  }
}

/// Painter personalizzato per cerchio progresso
class _CirclePainter extends CustomPainter {
  final double progress;
  final Color color;
  final double strokeWidth;

  _CirclePainter({
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
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round;

    // Disegna arco partendo da sopra (-90 gradi)
    final sweepAngle = 2 * math.pi * progress;
    canvas.drawArc(
      Rect.fromCircle(center: center, radius: radius),
      -math.pi / 2, // Inizia da sopra
      sweepAngle,
      false,
      paint,
    );
  }

  @override
  bool shouldRepaint(covariant _CirclePainter oldDelegate) {
    return oldDelegate.progress != progress ||
        oldDelegate.color != color ||
        oldDelegate.strokeWidth != strokeWidth;
  }
}
