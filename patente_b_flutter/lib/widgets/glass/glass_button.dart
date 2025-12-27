import 'package:flutter/material.dart';
import '../../theme/apple_glass_theme.dart';

/// 🔘 Glass Button Types
enum GlassButtonType { primary, secondary, ghost }

/// 🔘 Glass Button Widget
/// Premium button with glass effect or gradient
class GlassButton extends StatefulWidget {
  final String label;
  final VoidCallback? onPressed;
  final GlassButtonType type;
  final Color? color;
  final IconData? icon;
  final bool isFullWidth;
  final bool isLarge;
  final bool isLoading;

  const GlassButton({
    super.key,
    required this.label,
    this.onPressed,
    this.type = GlassButtonType.secondary,
    this.color,
    this.icon,
    this.isFullWidth = false,
    this.isLarge = false,
    this.isLoading = false,
  });

  const GlassButton.primary({
    super.key,
    required this.label,
    this.onPressed,
    this.color,
    this.icon,
    this.isFullWidth = true,
    this.isLarge = true,
    this.isLoading = false,
  }) : type = GlassButtonType.primary;

  const GlassButton.secondary({
    super.key,
    required this.label,
    this.onPressed,
    this.color,
    this.icon,
    this.isFullWidth = false,
    this.isLarge = false,
    this.isLoading = false,
  }) : type = GlassButtonType.secondary;

  @override
  State<GlassButton> createState() => _GlassButtonState();
}

class _GlassButtonState extends State<GlassButton> {
  bool _isPressed = false;

  @override
  Widget build(BuildContext context) {
    final color = widget.color ?? AppleGlassTheme.accentBlue;
    final isDisabled = widget.onPressed == null || widget.isLoading;

    final padding = widget.isLarge
        ? const EdgeInsets.symmetric(
            horizontal: AppleGlassTheme.space6,
            vertical: AppleGlassTheme.space4,
          )
        : const EdgeInsets.symmetric(
            horizontal: AppleGlassTheme.space5,
            vertical: AppleGlassTheme.space3,
          );

    final fontSize = widget.isLarge
        ? AppleGlassTheme.textLg
        : AppleGlassTheme.textBase;

    BoxDecoration decoration;
    Color textColor;

    switch (widget.type) {
      case GlassButtonType.primary:
        decoration = BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [color, color.withValues(alpha: 0.8)],
          ),
          borderRadius: BorderRadius.circular(AppleGlassTheme.radiusMd),
          boxShadow: [
            BoxShadow(
              color: color.withValues(alpha: 0.3),
              blurRadius: 16,
              offset: const Offset(0, 4),
            ),
          ],
        );
        textColor = Colors.white;
        break;

      case GlassButtonType.secondary:
        decoration = BoxDecoration(
          color: AppleGlassTheme.glassBg,
          borderRadius: BorderRadius.circular(AppleGlassTheme.radiusMd),
          border: Border.all(color: AppleGlassTheme.glassBorder, width: 1),
        );
        textColor = AppleGlassTheme.textPrimary;
        break;

      case GlassButtonType.ghost:
        decoration = BoxDecoration(
          color: Colors.transparent,
          borderRadius: BorderRadius.circular(AppleGlassTheme.radiusMd),
        );
        textColor = AppleGlassTheme.textSecondary;
        break;
    }

    return GestureDetector(
      onTapDown: (_) => setState(() => _isPressed = true),
      onTapUp: (_) => setState(() => _isPressed = false),
      onTapCancel: () => setState(() => _isPressed = false),
      onTap: isDisabled ? null : widget.onPressed,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 100),
        transform: Matrix4.identity()..scale(_isPressed ? 0.97 : 1.0),
        child: AnimatedOpacity(
          duration: AppleGlassTheme.durationFast,
          opacity: isDisabled ? 0.4 : 1.0,
          child: Container(
            width: widget.isFullWidth ? double.infinity : null,
            padding: padding,
            decoration: decoration,
            child: Row(
              mainAxisSize: widget.isFullWidth
                  ? MainAxisSize.max
                  : MainAxisSize.min,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                if (widget.isLoading) ...[
                  SizedBox(
                    width: fontSize,
                    height: fontSize,
                    child: CircularProgressIndicator(
                      strokeWidth: 2,
                      valueColor: AlwaysStoppedAnimation(textColor),
                    ),
                  ),
                  const SizedBox(width: AppleGlassTheme.space2),
                ] else if (widget.icon != null) ...[
                  Icon(widget.icon, color: textColor, size: fontSize + 2),
                  const SizedBox(width: AppleGlassTheme.space2),
                ],
                Text(
                  widget.label,
                  style: TextStyle(
                    fontSize: fontSize,
                    fontWeight: FontWeight.w600,
                    color: textColor,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
