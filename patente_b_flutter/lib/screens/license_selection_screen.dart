import 'package:flutter/material.dart';
import 'dart:ui' as ui;
import 'package:provider/provider.dart';
import '../services/course_service.dart';
import '../theme/apple_glass_theme.dart';
import 'main_navigation_screen.dart';
import 'course_selection_screen.dart';

/// Schermata di selezione licenza (B, C, CE)
/// Design basato su UI_DESIGN_PLAN.md
class LicenseSelectionScreen extends StatefulWidget {
  const LicenseSelectionScreen({super.key});

  @override
  State<LicenseSelectionScreen> createState() => _LicenseSelectionScreenState();
}

class _LicenseSelectionScreenState extends State<LicenseSelectionScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late List<Animation<double>> _cardAnimations;

  // Dati licenze - PATENTI
  final List<LicenseOption> _patenteLicenses = [
    LicenseOption(
      type: 'B',
      name: 'Patente B',
      description: 'Auto e moto fino a 125cc',
      icon: '🚗',
      assetPath: 'assets/images/licenses/license_b.png',
      color: AppleGlassTheme.accentBlue,
      gradient: LinearGradient(
        colors: [
          AppleGlassTheme.accentBlue,
          AppleGlassTheme.accentBlue.withValues(alpha: 0.8),
        ],
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
      ),
      quizCount: 7194,
      lessonCount: 30,
      signalCount: 620,
      isNew: false,
      examInfo: '40 dom / 30 min / 4 err',
    ),
    LicenseOption(
      type: 'C',
      name: 'Patente C',
      description: 'Camion oltre 3.5 tonnellate',
      icon: '🚛',
      assetPath: 'assets/images/licenses/license_c.png',
      color: AppleGlassTheme.accentOrange,
      gradient: LinearGradient(
        colors: [
          AppleGlassTheme.accentOrange,
          AppleGlassTheme.accentOrange.withValues(alpha: 0.8),
        ],
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
      ),
      quizCount: 3493,
      lessonCount: 17,
      signalCount: 620,
      isNew: true,
      comingSoon: true,
      requirement: 'Richiede patente B',
      examInfo: '40 dom / 40 min / 4 err',
    ),
    LicenseOption(
      type: 'CE',
      name: 'Patente CE',
      description: 'Camion + Rimorchio pesante',
      icon: '🚚',
      assetPath: 'assets/images/licenses/license_ce.png',
      color: AppleGlassTheme.accentRed,
      gradient: LinearGradient(
        colors: [
          AppleGlassTheme.accentRed,
          AppleGlassTheme.accentRed.withValues(alpha: 0.8),
        ],
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
      ),
      quizCount: 3493,
      lessonCount: 17,
      signalCount: 620,
      isNew: true,
      comingSoon: true,
      requirement: 'Richiede patente C',
      examInfo: '40 dom / 40 min / 4 err',
    ),
  ];

  // Dati licenze - CQC PROFESSIONALI
  final List<LicenseOption> _cqcLicenses = [
    LicenseOption(
      type: 'CQC_M',
      name: 'CQC Merci',
      description: 'Autista Camion Professionale',
      icon: '📦',
      assetPath: 'assets/images/licenses/cqc_merci.png',
      color: AppleGlassTheme.accentPurple,
      gradient: LinearGradient(
        colors: [
          AppleGlassTheme.accentPurple,
          AppleGlassTheme.accentPurple.withValues(alpha: 0.8),
        ],
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
      ),
      quizCount: 3389,
      lessonCount: 13,
      signalCount: 0,
      isNew: true,
      comingSoon: true,
      requirement: 'Richiede patente C/CE',
      examInfo: '70 dom / 90 min / 7 err',
      isCQC: true,
    ),
    LicenseOption(
      type: 'CQC_P',
      name: 'CQC Persone',
      description: 'Autista Autobus Professionale',
      icon: '🚌',
      assetPath: 'assets/images/licenses/cqc_persone.png',
      color: AppleGlassTheme.accentCyan,
      gradient: LinearGradient(
        colors: [
          AppleGlassTheme.accentCyan,
          AppleGlassTheme.accentCyan.withValues(alpha: 0.8),
        ],
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
      ),
      quizCount: 3200,
      lessonCount: 13,
      signalCount: 0,
      isNew: true,
      comingSoon: true,
      requirement: 'Richiede patente D/DE',
      examInfo: '70 dom / 90 min / 7 err',
      isCQC: true,
    ),
  ];

  // Tutti insieme per animazioni
  List<LicenseOption> get _allLicenses => [
    ..._patenteLicenses,
    ..._cqcLicenses,
  ];

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 800),
      vsync: this,
    );

    // Animazioni stagger per le card
    _cardAnimations = List.generate(
      _allLicenses.length + 2, // +2 per section labels e bundle
      (index) => Tween<double>(begin: 0, end: 1).animate(
        CurvedAnimation(
          parent: _controller,
          curve: Interval(
            index * 0.15,
            0.5 + index * 0.15,
            curve: Curves.easeOutBack,
          ),
        ),
      ),
    );

    _controller.forward();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _selectLicense(String licenseType) {
    // Go directly to dashboard without confirmation dialog
    _navigateToDashboard(licenseType);
  }

  Widget _buildSelectionDialog(String licenseType) {
    final license = _allLicenses.firstWhere((l) => l.type == licenseType);

    return Dialog(
      backgroundColor: Colors.transparent,
      elevation: 0,
      insetPadding: const EdgeInsets.all(20),
      child: Center(
        child: Container(
          width: double.infinity,
          constraints: const BoxConstraints(maxWidth: 400),
          decoration: BoxDecoration(
            color: const Color(0xFF1A1A2E).withOpacity(0.85),
            borderRadius: BorderRadius.circular(32),
            border: Border.all(
              color: license.color.withOpacity(0.4),
              width: 1.5,
            ),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.5),
                blurRadius: 40,
                spreadRadius: 0,
                offset: const Offset(0, 20),
              ),
              BoxShadow(
                color: license.color.withOpacity(0.2),
                blurRadius: 20,
                spreadRadius: -5,
                offset: const Offset(0, 0),
              ),
            ],
          ),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(32),
            child: BackdropFilter(
              filter: ui.ImageFilter.blur(sigmaX: 20, sigmaY: 20),
              child: Padding(
                padding: const EdgeInsets.all(32),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    // Icon with Glow
                    Container(
                      height: 120,
                      width: 120,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        gradient: RadialGradient(
                          colors: [
                            license.color.withOpacity(0.3),
                            Colors.transparent,
                          ],
                        ),
                      ),
                      child: Center(
                        child: SizedBox(
                          height: 100,
                          width: 100,
                          child: Image.asset(
                            license.assetPath,
                            fit: BoxFit.contain,
                            errorBuilder: (context, error, stack) => Text(
                              license.icon,
                              style: const TextStyle(fontSize: 64),
                            ),
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 24),

                    // Title
                    Text(
                      license.name,
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 28,
                        fontWeight: FontWeight.bold,
                        shadows: [
                          Shadow(
                            color: license.color.withOpacity(0.5),
                            blurRadius: 10,
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 8),

                    // Subtitle
                    Text(
                      'Stai per attivare il corso per ${license.name}.',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        color: Colors.white.withOpacity(0.7),
                        fontSize: 16,
                        height: 1.4,
                      ),
                    ),
                    const SizedBox(height: 32),

                    // Buttons
                    Row(
                      children: [
                        Expanded(
                          child: TextButton(
                            onPressed: () => Navigator.pop(context),
                            style: TextButton.styleFrom(
                              foregroundColor: Colors.white70,
                              padding: const EdgeInsets.symmetric(vertical: 16),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(16),
                              ),
                            ),
                            child: const Text(
                              'Annulla',
                              style: TextStyle(fontSize: 16),
                            ),
                          ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Container(
                            decoration: BoxDecoration(
                              gradient: LinearGradient(
                                colors: [
                                  license.color,
                                  license.color.withOpacity(0.8),
                                ],
                                begin: Alignment.topLeft,
                                end: Alignment.bottomRight,
                              ),
                              borderRadius: BorderRadius.circular(16),
                              boxShadow: [
                                BoxShadow(
                                  color: license.color.withOpacity(0.4),
                                  blurRadius: 12,
                                  offset: const Offset(0, 4),
                                ),
                              ],
                            ),
                            child: ElevatedButton(
                              onPressed: () {
                                Navigator.pop(context);
                                _navigateToDashboard(licenseType);
                              },
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Colors.transparent,
                                foregroundColor: Colors.white,
                                shadowColor: Colors.transparent,
                                padding: const EdgeInsets.symmetric(
                                  vertical: 16,
                                ),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(16),
                                ),
                              ),
                              child: const Text(
                                'Conferma',
                                style: TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  void _navigateToDashboard(String licenseType) async {
    // Salva la selezione
    final courseService = context.read<CourseService>();
    await courseService.setSelectedLicense(licenseType);

    if (mounted) {
      Navigator.of(context).pushReplacement(
        PageRouteBuilder(
          pageBuilder: (context, animation, secondaryAnimation) =>
              const MainNavigationScreen(),
          transitionsBuilder: (context, animation, secondaryAnimation, child) {
            return FadeTransition(
              opacity: animation,
              child: SlideTransition(
                position:
                    Tween<Offset>(
                      begin: const Offset(0.1, 0),
                      end: Offset.zero,
                    ).animate(
                      CurvedAnimation(
                        parent: animation,
                        curve: Curves.easeOutCubic,
                      ),
                    ),
                child: child,
              ),
            );
          },
          transitionDuration: const Duration(milliseconds: 400),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppleGlassTheme.bgPrimary,
      body: Container(
        decoration: BoxDecoration(gradient: AppleGlassTheme.bgGradient),
        child: SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Back button to return to course selection
                Align(
                  alignment: Alignment.centerLeft,
                  child: IconButton(
                    icon: const Icon(Icons.arrow_back_ios, color: Colors.white),
                    onPressed: () {
                      Navigator.of(context).pushReplacement(
                        MaterialPageRoute(
                          builder: (context) => const CourseSelectionScreen(),
                        ),
                      );
                    },
                  ),
                ),
                const SizedBox(height: 10),

                // Header
                Center(
                  child: Column(
                    children: [
                      Text(
                        'Scegli la tua Patente',
                        style: AppleGlassTheme.titleLarge,
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'Puoi cambiarla in qualsiasi momento',
                        style: AppleGlassTheme.bodyMedium,
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 40),

                // Section: PATENTI
                _buildSectionLabel('PATENTI'),
                const SizedBox(height: 16),

                // Patente Cards
                ...List.generate(_patenteLicenses.length, (index) {
                  return AnimatedBuilder(
                    animation: _cardAnimations[index],
                    builder: (context, child) {
                      return Transform.scale(
                        scale: _cardAnimations[index].value,
                        child: Opacity(
                          opacity: _cardAnimations[index].value,
                          child: _buildLicenseCard(_patenteLicenses[index]),
                        ),
                      );
                    },
                  );
                }),

                const SizedBox(height: 24),

                // Section: CQC PROFESSIONALE
                _buildSectionLabel('CQC PROFESSIONALE'),
                const SizedBox(height: 16),

                // CQC Cards
                ...List.generate(_cqcLicenses.length, (index) {
                  final animIndex = _patenteLicenses.length + index;
                  return AnimatedBuilder(
                    animation: _cardAnimations[animIndex],
                    builder: (context, child) {
                      return Transform.scale(
                        scale: _cardAnimations[animIndex].value,
                        child: Opacity(
                          opacity: _cardAnimations[animIndex].value,
                          child: _buildLicenseCard(_cqcLicenses[index]),
                        ),
                      );
                    },
                  );
                }),

                const SizedBox(height: 24),

                // Bundle PRO Card
                AnimatedBuilder(
                  animation: _cardAnimations[_allLicenses.length],
                  builder: (context, child) {
                    return Transform.scale(
                      scale: _cardAnimations[_allLicenses.length].value,
                      child: Opacity(
                        opacity: _cardAnimations[_allLicenses.length].value,
                        child: _buildBundleCard(),
                      ),
                    );
                  },
                ),

                const SizedBox(height: 40),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildLicenseCard(LicenseOption license) {
    return GestureDetector(
      onTap: license.comingSoon
          ? () {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text(
                    '${license.name} sarà disponibile a breve!',
                    style: const TextStyle(color: Colors.white),
                  ),
                  backgroundColor: Colors.grey.shade800,
                  behavior: SnackBarBehavior.floating,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
                  duration: const Duration(seconds: 2),
                ),
              );
            }
          : () => _selectLicense(license.type),
      child: Container(
        margin: const EdgeInsets.only(bottom: 16),
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: license.comingSoon
              ? Colors.grey.shade900.withOpacity(0.5)
              : null,
          gradient: license.comingSoon
              ? null
              : LinearGradient(
                  colors: [
                    license.color.withOpacity(0.15),
                    license.color.withOpacity(0.05),
                  ],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: license.comingSoon
                ? Colors.grey.shade800
                : license.color.withOpacity(0.3),
            width: 1,
          ),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header row
            Row(
              children: [
                Opacity(
                  opacity: license.comingSoon ? 0.5 : 1.0,
                  child: SizedBox(
                    width: 56,
                    height: 56,
                    child: Image.asset(
                      license.assetPath,
                      fit: BoxFit.contain,
                      errorBuilder: (context, error, stack) => Text(
                        license.icon,
                        style: const TextStyle(fontSize: 40),
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Text(
                            license.name,
                            style: TextStyle(
                              color: license.comingSoon
                                  ? Colors.grey.shade500
                                  : license.color,
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          if (license.comingSoon) ...[
                            const SizedBox(width: 8),
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 8,
                                vertical: 2,
                              ),
                              decoration: BoxDecoration(
                                color: Colors.grey.shade700,
                                borderRadius: BorderRadius.circular(10),
                              ),
                              child: const Text(
                                'SOSPESO',
                                style: TextStyle(
                                  color: Colors.white70,
                                  fontSize: 10,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ] else if (license.isNew) ...[
                            const SizedBox(width: 8),
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 8,
                                vertical: 2,
                              ),
                              decoration: BoxDecoration(
                                color: Colors.orange,
                                borderRadius: BorderRadius.circular(10),
                              ),
                              child: const Text(
                                '🔥 NEW',
                                style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 10,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ],
                        ],
                      ),
                      const SizedBox(height: 4),
                      Text(
                        license.description,
                        style: TextStyle(
                          color: license.comingSoon
                              ? Colors.grey.shade600
                              : Colors.white.withOpacity(0.7),
                          fontSize: 14,
                        ),
                      ),
                    ],
                  ),
                ),
                Icon(
                  license.comingSoon
                      ? Icons.lock_outline
                      : Icons.arrow_forward_ios,
                  color: license.comingSoon
                      ? Colors.grey.shade700
                      : license.color.withOpacity(0.7),
                  size: 20,
                ),
              ],
            ),

            const SizedBox(height: 16),

            // Stats row
            Opacity(
              opacity: license.comingSoon ? 0.3 : 1.0,
              child: Row(
                children: [
                  _buildStatChip(
                    '✓ ${license.quizCount} quiz',
                    license.comingSoon ? Colors.grey : license.color,
                  ),
                  const SizedBox(width: 8),
                  _buildStatChip(
                    '✓ ${license.lessonCount} lezioni',
                    license.comingSoon ? Colors.grey : license.color,
                  ),
                  const SizedBox(width: 8),
                  _buildStatChip(
                    '✓ ${license.signalCount}+ segnali',
                    license.comingSoon ? Colors.grey : license.color,
                  ),
                ],
              ),
            ),

            if (license.requirement != null && !license.comingSoon) ...[
              const SizedBox(height: 12),
              Text(
                license.requirement!,
                style: TextStyle(
                  color: Colors.white.withOpacity(0.5),
                  fontSize: 12,
                  fontStyle: FontStyle.italic,
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildStatChip(String text, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Text(
        text,
        style: TextStyle(
          color: color.withOpacity(0.9),
          fontSize: 11,
          fontWeight: FontWeight.w500,
        ),
      ),
    );
  }

  Widget _buildSectionLabel(String label) {
    return Center(child: Text(label, style: AppleGlassTheme.labelSmall));
  }

  Widget _buildBundleCard() {
    return GestureDetector(
      onTap: () {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: const Text(
              'Il Bundle PRO sarà disponibile con il rilascio delle patenti C/CE.',
              style: TextStyle(color: Colors.white),
            ),
            backgroundColor: Colors.grey.shade800,
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(10),
            ),
            duration: const Duration(seconds: 3),
          ),
        );
      },
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: Colors.grey.shade900.withOpacity(0.5),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: Colors.grey.shade800, width: 1),
        ),
        child: Row(
          children: [
            const Opacity(
              opacity: 0.5,
              child: Text('⭐', style: TextStyle(fontSize: 36)),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Text(
                        'BUNDLE PROFESSIONALE',
                        style: TextStyle(
                          color: Colors.white54,
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(width: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 8,
                          vertical: 2,
                        ),
                        decoration: BoxDecoration(
                          color: Colors.grey.shade700,
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: const Text(
                          'SOSPESO',
                          style: TextStyle(
                            color: Colors.white70,
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'B + C + CE • Disponibile a breve',
                    style: TextStyle(
                      color: Colors.white.withOpacity(0.4),
                      fontSize: 14,
                    ),
                  ),
                ],
              ),
            ),
            Icon(
              Icons.lock_outline,
              color: Colors.white.withOpacity(0.3),
              size: 20,
            ),
          ],
        ),
      ),
    );
  }
}

/// Dati per una opzione licenza
class LicenseOption {
  final String type;
  final String name;
  final String description;
  final String icon;
  final String assetPath;
  final Color color;
  final Gradient gradient;
  final int quizCount;
  final int lessonCount;
  final int signalCount;
  final bool isNew;
  final String? requirement;
  final String? examInfo;
  final bool isCQC;
  final bool comingSoon;

  LicenseOption({
    required this.type,
    required this.name,
    required this.description,
    required this.icon,
    required this.assetPath,
    required this.color,
    required this.gradient,
    required this.quizCount,
    required this.lessonCount,
    required this.signalCount,
    this.isNew = false,
    this.comingSoon = false,
    this.requirement,
    this.examInfo,
    this.isCQC = false,
  });
}
