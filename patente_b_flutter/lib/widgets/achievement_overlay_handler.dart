import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/achievement_service.dart';
import 'achievement_toast.dart';

class AchievementOverlayHandler extends StatefulWidget {
  final Widget child;

  const AchievementOverlayHandler({super.key, required this.child});

  @override
  State<AchievementOverlayHandler> createState() =>
      _AchievementOverlayHandlerState();
}

class _AchievementOverlayHandlerState extends State<AchievementOverlayHandler> {
  OverlayEntry? _overlayEntry;

  @override
  void initState() {
    super.initState();
    // Post-frame callback to ensure context is available for Provider
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final service = context.read<AchievementService>();
      service.onAchievementUnlocked = _showAchievementToast;
    });
  }

  void _showAchievementToast(Achievement achievement) {
    _overlayEntry?.remove();
    _overlayEntry = null;

    _overlayEntry = OverlayEntry(
      builder: (context) => Positioned(
        top: 0,
        left: 0,
        right: 0,
        child: _AnimatedToast(
          achievement: achievement,
          onDismiss: () {
            _overlayEntry?.remove();
            _overlayEntry = null;
          },
        ),
      ),
    );

    Overlay.of(context).insert(_overlayEntry!);
  }

  @override
  void dispose() {
    _overlayEntry?.remove();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return widget.child;
  }
}

class _AnimatedToast extends StatefulWidget {
  final Achievement achievement;
  final VoidCallback onDismiss;

  const _AnimatedToast({required this.achievement, required this.onDismiss});

  @override
  State<_AnimatedToast> createState() => _AnimatedToastState();
}

class _AnimatedToastState extends State<_AnimatedToast>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 600),
      reverseDuration: const Duration(milliseconds: 600),
    );

    _animation = CurvedAnimation(
      parent: _controller,
      curve: Curves.elasticOut,
      reverseCurve: Curves.easeOutBack,
    );

    _controller.forward();

    // Auto dismiss after 4 seconds
    Future.delayed(const Duration(seconds: 4), () {
      if (mounted) {
        _controller.reverse().then((_) => widget.onDismiss());
      }
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.transparent,
      child: SafeArea(
        child: SlideTransition(
          position: Tween<Offset>(
            begin: const Offset(0, -1),
            end: Offset.zero,
          ).animate(_animation),
          child: AchievementToast(achievement: widget.achievement),
        ),
      ),
    );
  }
}
