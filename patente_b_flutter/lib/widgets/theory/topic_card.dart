import 'package:flutter/material.dart';
import '../../theme/app_theme.dart';

/// Card per argomento teoria con icona, progresso e stato lock
/// Design accessibile con icone grandi e testo chiaro
class TopicCard extends StatelessWidget {
  final String title;
  final String? subtitle;
  final String icon;
  final double progress; // 0.0 - 1.0
  final bool isLocked;
  final VoidCallback? onTap;
  final Color? accentColor;

  const TopicCard({
    super.key,
    required this.title,
    this.subtitle,
    required this.icon,
    this.progress = 0.0,
    this.isLocked = false,
    this.onTap,
    this.accentColor,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final color = accentColor ?? AppTheme.primaryColor;

    return Card(
      elevation: isLocked ? 1 : 3,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: InkWell(
        onTap: isLocked ? null : onTap,
        borderRadius: BorderRadius.circular(16),
        child: Opacity(
          opacity: isLocked ? 0.5 : 1.0,
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                // Icona con sfondo colorato
                Container(
                  width: 56,
                  height: 56,
                  decoration: BoxDecoration(
                    color: color.withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(14),
                  ),
                  child: Center(
                    child: isLocked
                        ? Icon(
                            Icons.lock,
                            color: theme.colorScheme.onSurface.withValues(
                              alpha: 0.5,
                            ),
                            size: 28,
                          )
                        : Text(icon, style: const TextStyle(fontSize: 28)),
                  ),
                ),
                const SizedBox(width: 16),
                // Titolo e sottotitolo
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        title,
                        style: theme.textTheme.titleMedium?.copyWith(
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                        ),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                      if (subtitle != null) ...[
                        const SizedBox(height: 4),
                        Text(
                          subtitle!,
                          style: theme.textTheme.bodySmall?.copyWith(
                            color: theme.colorScheme.onSurface.withValues(
                              alpha: 0.6,
                            ),
                          ),
                        ),
                      ],
                      // Progress bar
                      if (progress > 0 && !isLocked) ...[
                        const SizedBox(height: 8),
                        Row(
                          children: [
                            Expanded(
                              child: ClipRRect(
                                borderRadius: BorderRadius.circular(4),
                                child: LinearProgressIndicator(
                                  value: progress,
                                  backgroundColor: color.withValues(alpha: 0.2),
                                  valueColor: AlwaysStoppedAnimation(color),
                                  minHeight: 6,
                                ),
                              ),
                            ),
                            const SizedBox(width: 8),
                            Text(
                              '${(progress * 100).toInt()}%',
                              style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.bold,
                                color: color,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ],
                  ),
                ),
                // Freccia navigazione
                if (!isLocked)
                  Icon(
                    Icons.chevron_right,
                    color: theme.colorScheme.onSurface.withValues(alpha: 0.5),
                  ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

/// Griglia di TopicCard per selezione argomenti
class TopicGrid extends StatelessWidget {
  final List<TopicCard> topics;
  final int crossAxisCount;
  final double spacing;

  const TopicGrid({
    super.key,
    required this.topics,
    this.crossAxisCount = 2,
    this.spacing = 12,
  });

  @override
  Widget build(BuildContext context) {
    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: crossAxisCount,
        childAspectRatio: 1.2,
        crossAxisSpacing: spacing,
        mainAxisSpacing: spacing,
      ),
      itemCount: topics.length,
      itemBuilder: (context, index) => topics[index],
    );
  }
}
