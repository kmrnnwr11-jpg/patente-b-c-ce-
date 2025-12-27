import 'package:flutter/material.dart';
import '../../models/translation.dart';
import '../../theme/app_theme.dart';

/// FAB per cambio lingua rapido - sempre visibile
/// Mostra bandiera della lingua corrente
class TranslationFAB extends StatelessWidget {
  final AppLanguage currentLanguage;
  final VoidCallback onPressed;
  final bool mini;

  const TranslationFAB({
    super.key,
    required this.currentLanguage,
    required this.onPressed,
    this.mini = false,
  });

  @override
  Widget build(BuildContext context) {
    return FloatingActionButton(
      onPressed: onPressed,
      backgroundColor: AppTheme.infoPurple,
      foregroundColor: Colors.white,
      heroTag: 'translationFab',
      mini: mini,
      elevation: 6,
      child: Stack(
        alignment: Alignment.center,
        children: [
          Text(
            currentLanguage.flag,
            style: TextStyle(fontSize: mini ? 20 : 28),
          ),
          // Badge con icona traduzione
          Positioned(
            right: mini ? 0 : 2,
            bottom: mini ? 0 : 2,
            child: Container(
              padding: const EdgeInsets.all(2),
              decoration: BoxDecoration(
                color: Colors.white,
                shape: BoxShape.circle,
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.2),
                    blurRadius: 4,
                  ),
                ],
              ),
              child: Icon(
                Icons.translate,
                size: mini ? 10 : 14,
                color: AppTheme.infoPurple,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

/// Bottom sheet per selezione lingua con bandiere
class LanguageSelectorSheet extends StatelessWidget {
  final AppLanguage currentLanguage;
  final Function(AppLanguage) onLanguageSelected;

  const LanguageSelectorSheet({
    super.key,
    required this.currentLanguage,
    required this.onLanguageSelected,
  });

  // Lingue ordinate per frequenza d'uso
  static const List<AppLanguage> _orderedLanguages = [
    AppLanguage.italian,
    AppLanguage.urdu,
    AppLanguage.punjabi,
    AppLanguage.hindi,
    AppLanguage.english,
  ];

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Container(
      padding: const EdgeInsets.symmetric(vertical: 24),
      decoration: BoxDecoration(
        color: theme.scaffoldBackgroundColor,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Handle bar
          Container(
            width: 40,
            height: 4,
            margin: const EdgeInsets.only(bottom: 20),
            decoration: BoxDecoration(
              color: theme.colorScheme.onSurface.withValues(alpha: 0.3),
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          // Titolo
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24),
            child: Row(
              children: [
                const Icon(Icons.translate, size: 28),
                const SizedBox(width: 12),
                Text(
                  'Scegli la lingua',
                  style: theme.textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),
          // Lista lingue
          ...List.generate(_orderedLanguages.length, (index) {
            final lang = _orderedLanguages[index];
            final isSelected = lang == currentLanguage;

            return ListTile(
              contentPadding: const EdgeInsets.symmetric(
                horizontal: 24,
                vertical: 8,
              ),
              leading: Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color: isSelected
                      ? theme.colorScheme.primary.withValues(alpha: 0.15)
                      : theme.colorScheme.onSurface.withValues(alpha: 0.05),
                  borderRadius: BorderRadius.circular(12),
                  border: isSelected
                      ? Border.all(color: theme.colorScheme.primary, width: 2)
                      : null,
                ),
                child: Center(
                  child: Text(lang.flag, style: const TextStyle(fontSize: 28)),
                ),
              ),
              title: Text(
                lang.name,
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                  color: isSelected
                      ? theme.colorScheme.primary
                      : theme.colorScheme.onSurface,
                ),
              ),
              trailing: isSelected
                  ? Icon(Icons.check_circle, color: theme.colorScheme.primary)
                  : null,
              onTap: () {
                onLanguageSelected(lang);
                Navigator.pop(context);
              },
            );
          }),
          const SizedBox(height: 16),
        ],
      ),
    );
  }

  /// Mostra il bottom sheet
  static void show(
    BuildContext context, {
    required AppLanguage currentLanguage,
    required Function(AppLanguage) onLanguageSelected,
  }) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => LanguageSelectorSheet(
        currentLanguage: currentLanguage,
        onLanguageSelected: onLanguageSelected,
      ),
    );
  }
}
