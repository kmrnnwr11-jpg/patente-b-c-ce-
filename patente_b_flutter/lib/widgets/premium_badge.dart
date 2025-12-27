import 'package:flutter/material.dart';

/// Badge per indicare lo stato Premium di un utente
class PremiumBadge extends StatelessWidget {
  final bool isPremium;
  final double size;
  final bool showLabel;

  const PremiumBadge({
    super.key,
    required this.isPremium,
    this.size = 24,
    this.showLabel = false,
  });

  @override
  Widget build(BuildContext context) {
    if (!isPremium) return const SizedBox.shrink();

    return Container(
      padding: EdgeInsets.symmetric(
        horizontal: showLabel ? 10 : 6,
        vertical: 4,
      ),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [Colors.amber.shade600, Colors.orange.shade700],
        ),
        borderRadius: BorderRadius.circular(showLabel ? 12 : 8),
        boxShadow: [
          BoxShadow(
            color: Colors.amber.withOpacity(0.3),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(Icons.workspace_premium, color: Colors.white, size: size * 0.7),
          if (showLabel) ...[
            const SizedBox(width: 4),
            const Text(
              'PRO',
              style: TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
                fontSize: 12,
              ),
            ),
          ],
        ],
      ),
    );
  }
}

/// Widget per mostrare il badge premium accanto a un avatar
class PremiumAvatar extends StatelessWidget {
  final String? photoUrl;
  final String displayName;
  final bool isPremium;
  final double radius;

  const PremiumAvatar({
    super.key,
    this.photoUrl,
    required this.displayName,
    required this.isPremium,
    this.radius = 24,
  });

  @override
  Widget build(BuildContext context) {
    return Stack(
      clipBehavior: Clip.none,
      children: [
        CircleAvatar(
          radius: radius,
          backgroundImage: photoUrl != null ? NetworkImage(photoUrl!) : null,
          backgroundColor: Theme.of(context).colorScheme.primary,
          child: photoUrl == null
              ? Text(
                  displayName.isNotEmpty ? displayName[0].toUpperCase() : '?',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: radius * 0.8,
                    fontWeight: FontWeight.bold,
                  ),
                )
              : null,
        ),
        if (isPremium)
          Positioned(
            right: -4,
            bottom: -4,
            child: Container(
              padding: const EdgeInsets.all(4),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [Colors.amber.shade600, Colors.orange.shade700],
                ),
                shape: BoxShape.circle,
                border: Border.all(
                  color: Theme.of(context).colorScheme.surface,
                  width: 2,
                ),
              ),
              child: const Icon(Icons.star, color: Colors.white, size: 12),
            ),
          ),
      ],
    );
  }
}
