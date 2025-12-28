import 'package:flutter/material.dart';

/// Widget che mostra il badge dell'autoscuola
/// Usato nell'app bar, nel profilo, etc.
class SchoolBadge extends StatelessWidget {
  final String schoolName;
  final String? logoUrl;
  final String primaryColor;
  final bool showPremiumBadge;
  final bool compact;

  const SchoolBadge({
    super.key,
    required this.schoolName,
    this.logoUrl,
    this.primaryColor = '#4F46E5',
    this.showPremiumBadge = false,
    this.compact = false,
  });

  Color get _primaryColor {
    try {
      return Color(int.parse(primaryColor.replaceFirst('#', '0xFF')));
    } catch (_) {
      return const Color(0xFF4F46E5);
    }
  }

  @override
  Widget build(BuildContext context) {
    if (compact) {
      return Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
        decoration: BoxDecoration(
          color: _primaryColor.withOpacity(0.1),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: _primaryColor.withOpacity(0.3)),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            if (logoUrl != null)
              ClipRRect(
                borderRadius: BorderRadius.circular(4),
                child: Image.network(
                  logoUrl!,
                  width: 16,
                  height: 16,
                  fit: BoxFit.cover,
                  errorBuilder: (_, __, ___) =>
                      Icon(Icons.school, size: 16, color: _primaryColor),
                ),
              )
            else
              Icon(Icons.school, size: 16, color: _primaryColor),
            const SizedBox(width: 4),
            Text(
              schoolName,
              style: TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.w600,
                color: _primaryColor,
              ),
            ),
          ],
        ),
      );
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: _primaryColor.withOpacity(0.1),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: _primaryColor.withOpacity(0.3)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (logoUrl != null)
            ClipRRect(
              borderRadius: BorderRadius.circular(8),
              child: Image.network(
                logoUrl!,
                width: 24,
                height: 24,
                fit: BoxFit.cover,
                errorBuilder: (_, __, ___) => Container(
                  width: 24,
                  height: 24,
                  decoration: BoxDecoration(
                    color: _primaryColor.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Icon(Icons.school, size: 16, color: _primaryColor),
                ),
              ),
            )
          else
            Container(
              width: 24,
              height: 24,
              decoration: BoxDecoration(
                color: _primaryColor.withOpacity(0.2),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Icon(Icons.school, size: 16, color: _primaryColor),
            ),
          const SizedBox(width: 8),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                schoolName,
                style: TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                  color: _primaryColor,
                ),
              ),
              if (showPremiumBadge)
                Text(
                  '✨ Premium incluso',
                  style: TextStyle(
                    fontSize: 10,
                    color: _primaryColor.withOpacity(0.8),
                  ),
                ),
            ],
          ),
        ],
      ),
    );
  }
}

/// Card informativa sull'autoscuola
/// Da mostrare nel profilo studente
class SchoolInfoCard extends StatelessWidget {
  final String schoolName;
  final String? logoUrl;
  final String primaryColor;
  final String? instructorName;
  final VoidCallback? onTap;

  const SchoolInfoCard({
    super.key,
    required this.schoolName,
    this.logoUrl,
    this.primaryColor = '#4F46E5',
    this.instructorName,
    this.onTap,
  });

  Color get _primaryColor {
    try {
      return Color(int.parse(primaryColor.replaceFirst('#', '0xFF')));
    } catch (_) {
      return const Color(0xFF4F46E5);
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              _primaryColor.withOpacity(0.1),
              _primaryColor.withOpacity(0.05),
            ],
          ),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: _primaryColor.withOpacity(0.2)),
        ),
        child: Row(
          children: [
            // Logo
            Container(
              width: 56,
              height: 56,
              decoration: BoxDecoration(
                color: isDark ? Colors.white : _primaryColor.withOpacity(0.1),
                borderRadius: BorderRadius.circular(12),
                boxShadow: [
                  BoxShadow(
                    color: _primaryColor.withOpacity(0.2),
                    blurRadius: 8,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: logoUrl != null
                  ? ClipRRect(
                      borderRadius: BorderRadius.circular(12),
                      child: Image.network(
                        logoUrl!,
                        fit: BoxFit.cover,
                        errorBuilder: (_, __, ___) =>
                            Icon(Icons.school, size: 28, color: _primaryColor),
                      ),
                    )
                  : Icon(Icons.school, size: 28, color: _primaryColor),
            ),

            const SizedBox(width: 16),

            // Info
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'La tua Autoscuola',
                    style: TextStyle(
                      fontSize: 12,
                      color: isDark ? Colors.grey[400] : Colors.grey[600],
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    schoolName,
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: isDark ? Colors.white : Colors.grey[900],
                    ),
                  ),
                  if (instructorName != null) ...[
                    const SizedBox(height: 4),
                    Row(
                      children: [
                        Icon(
                          Icons.person_outline,
                          size: 14,
                          color: _primaryColor,
                        ),
                        const SizedBox(width: 4),
                        Text(
                          'Istruttore: $instructorName',
                          style: TextStyle(
                            fontSize: 12,
                            color: isDark ? Colors.grey[400] : Colors.grey[600],
                          ),
                        ),
                      ],
                    ),
                  ],
                ],
              ),
            ),

            // Premium badge
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [_primaryColor, _primaryColor.withOpacity(0.8)],
                ),
                borderRadius: BorderRadius.circular(20),
              ),
              child: const Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(Icons.star, size: 14, color: Colors.white),
                  SizedBox(width: 4),
                  Text(
                    'Premium',
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// Banner che mostra l'accesso Premium gratuito via autoscuola
class SchoolPremiumBanner extends StatelessWidget {
  final String schoolName;
  final String? logoUrl;
  final String primaryColor;

  const SchoolPremiumBanner({
    super.key,
    required this.schoolName,
    this.logoUrl,
    this.primaryColor = '#4F46E5',
  });

  Color get _primaryColor {
    try {
      return Color(int.parse(primaryColor.replaceFirst('#', '0xFF')));
    } catch (_) {
      return const Color(0xFF4F46E5);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            _primaryColor,
            _primaryColor.withBlue((_primaryColor.blue + 30).clamp(0, 255)),
          ],
        ),
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: _primaryColor.withOpacity(0.4),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        children: [
          // Logo
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
            ),
            child: logoUrl != null
                ? ClipRRect(
                    borderRadius: BorderRadius.circular(12),
                    child: Image.network(
                      logoUrl!,
                      fit: BoxFit.cover,
                      errorBuilder: (_, __, ___) =>
                          Icon(Icons.school, size: 24, color: _primaryColor),
                    ),
                  )
                : Icon(Icons.school, size: 24, color: _primaryColor),
          ),

          const SizedBox(width: 16),

          // Testo
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Row(
                  children: [
                    Icon(Icons.star, size: 16, color: Colors.amber),
                    SizedBox(width: 4),
                    Text(
                      'Premium GRATUITO',
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                Text(
                  'Offerto da $schoolName',
                  style: TextStyle(
                    fontSize: 12,
                    color: Colors.white.withOpacity(0.9),
                  ),
                ),
              ],
            ),
          ),

          // Check icon
          Container(
            width: 32,
            height: 32,
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.2),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.check, size: 18, color: Colors.white),
          ),
        ],
      ),
    );
  }
}

/// Tile per le impostazioni profilo quando iscritto a un'autoscuola
class SchoolSettingsTile extends StatelessWidget {
  final String schoolName;
  final String? logoUrl;
  final String primaryColor;
  final VoidCallback? onTap;
  final VoidCallback? onLeave;

  const SchoolSettingsTile({
    super.key,
    required this.schoolName,
    this.logoUrl,
    this.primaryColor = '#4F46E5',
    this.onTap,
    this.onLeave,
  });

  Color get _primaryColor {
    try {
      return Color(int.parse(primaryColor.replaceFirst('#', '0xFF')));
    } catch (_) {
      return const Color(0xFF4F46E5);
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF1A1A2E) : Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isDark ? Colors.white.withOpacity(0.1) : Colors.grey.shade200,
        ),
      ),
      child: Column(
        children: [
          // Header
          ListTile(
            onTap: onTap,
            leading: Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                color: _primaryColor.withOpacity(0.1),
                borderRadius: BorderRadius.circular(10),
              ),
              child: logoUrl != null
                  ? ClipRRect(
                      borderRadius: BorderRadius.circular(10),
                      child: Image.network(
                        logoUrl!,
                        fit: BoxFit.cover,
                        errorBuilder: (_, __, ___) =>
                            Icon(Icons.school, color: _primaryColor),
                      ),
                    )
                  : Icon(Icons.school, color: _primaryColor),
            ),
            title: Text(
              schoolName,
              style: TextStyle(
                fontWeight: FontWeight.w600,
                color: isDark ? Colors.white : Colors.grey[900],
              ),
            ),
            subtitle: Row(
              children: [
                Icon(Icons.star, size: 12, color: Colors.amber.shade600),
                const SizedBox(width: 4),
                Text(
                  'Premium incluso',
                  style: TextStyle(fontSize: 12, color: Colors.amber.shade700),
                ),
              ],
            ),
            trailing: Icon(
              Icons.chevron_right,
              color: isDark ? Colors.grey[400] : Colors.grey[600],
            ),
          ),

          // Divider
          Divider(
            height: 1,
            color: isDark
                ? Colors.white.withOpacity(0.1)
                : Colors.grey.shade200,
          ),

          // Leave option
          ListTile(
            onTap: onLeave,
            leading: Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                color: Colors.red.withOpacity(0.1),
                borderRadius: BorderRadius.circular(10),
              ),
              child: const Icon(Icons.logout, color: Colors.red, size: 20),
            ),
            title: const Text(
              'Esci dall\'autoscuola',
              style: TextStyle(color: Colors.red, fontSize: 14),
            ),
            subtitle: Text(
              'Perderai l\'accesso Premium gratuito',
              style: TextStyle(
                fontSize: 12,
                color: isDark ? Colors.grey[500] : Colors.grey[600],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
