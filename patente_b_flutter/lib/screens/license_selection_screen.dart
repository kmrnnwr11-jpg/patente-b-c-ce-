import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/course_service.dart';
import '../theme/apple_glass_theme.dart';
import 'main_navigation_screen.dart';

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
      requirement: 'Richiede patente B',
      examInfo: '40 dom / 40 min / 4 err',
    ),
    LicenseOption(
      type: 'CE',
      name: 'Patente CE',
      description: 'Camion + Rimorchio pesante',
      icon: '🚚',
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
      requirement: 'Richiede patente C/CE',
      examInfo: '70 dom / 90 min / 7 err',
      isCQC: true,
    ),
    LicenseOption(
      type: 'CQC_P',
      name: 'CQC Persone',
      description: 'Autista Autobus Professionale',
      icon: '🚌',
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
    // Animazione di selezione
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => _buildSelectionDialog(licenseType),
    );
  }

  Widget _buildSelectionDialog(String licenseType) {
    final license = _allLicenses.firstWhere((l) => l.type == licenseType);

    return Dialog(
      backgroundColor: Colors.transparent,
      child: Container(
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [const Color(0xFF1A1A2E), license.color.withOpacity(0.2)],
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
          ),
          borderRadius: BorderRadius.circular(24),
          border: Border.all(color: license.color.withOpacity(0.5), width: 2),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(license.icon, style: const TextStyle(fontSize: 64)),
            const SizedBox(height: 16),
            Text(
              license.name,
              style: TextStyle(
                color: license.color,
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Iniziamo!',
              style: TextStyle(
                color: Colors.white.withOpacity(0.7),
                fontSize: 16,
              ),
            ),
            const SizedBox(height: 24),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed: () => Navigator.pop(context),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: Colors.white70,
                      side: BorderSide(color: Colors.white.withOpacity(0.3)),
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    child: const Text('Annulla'),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: ElevatedButton(
                    onPressed: () {
                      Navigator.pop(context);
                      _navigateToDashboard(licenseType);
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: license.color,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    child: const Text(
                      'Conferma',
                      style: TextStyle(fontWeight: FontWeight.bold),
                    ),
                  ),
                ),
              ],
            ),
          ],
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
                const SizedBox(height: 20),

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
      onTap: () => _selectLicense(license.type),
      child: Container(
        margin: const EdgeInsets.only(bottom: 16),
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [
              license.color.withOpacity(0.15),
              license.color.withOpacity(0.05),
            ],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: license.color.withOpacity(0.3), width: 1),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header row
            Row(
              children: [
                Text(license.icon, style: const TextStyle(fontSize: 40)),
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
                              color: license.color,
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          if (license.isNew) ...[
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
                          color: Colors.white.withOpacity(0.7),
                          fontSize: 14,
                        ),
                      ),
                    ],
                  ),
                ),
                Icon(
                  Icons.arrow_forward_ios,
                  color: license.color.withOpacity(0.7),
                  size: 20,
                ),
              ],
            ),

            const SizedBox(height: 16),

            // Stats row
            Row(
              children: [
                _buildStatChip('✓ ${license.quizCount} quiz', license.color),
                const SizedBox(width: 8),
                _buildStatChip(
                  '✓ ${license.lessonCount} lezioni',
                  license.color,
                ),
                const SizedBox(width: 8),
                _buildStatChip(
                  '✓ ${license.signalCount}+ segnali',
                  license.color,
                ),
              ],
            ),

            if (license.requirement != null) ...[
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
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFFF59E0B), Color(0xFFD97706)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFFF59E0B).withOpacity(0.3),
            blurRadius: 20,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      child: Row(
        children: [
          const Text('⭐', style: TextStyle(fontSize: 36)),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Row(
                  children: [
                    Text(
                      'BUNDLE PROFESSIONALE',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    SizedBox(width: 8),
                    Text(
                      'PRO',
                      style: TextStyle(
                        color: Colors.white70,
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                Text(
                  'B + C + CE • Risparmia 40%',
                  style: TextStyle(
                    color: Colors.white.withOpacity(0.8),
                    fontSize: 14,
                  ),
                ),
              ],
            ),
          ),
          Icon(
            Icons.arrow_forward_ios,
            color: Colors.white.withOpacity(0.7),
            size: 20,
          ),
        ],
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
  final Color color;
  final Gradient gradient;
  final int quizCount;
  final int lessonCount;
  final int signalCount;
  final bool isNew;
  final String? requirement;
  final String? examInfo;
  final bool isCQC;

  LicenseOption({
    required this.type,
    required this.name,
    required this.description,
    required this.icon,
    required this.color,
    required this.gradient,
    required this.quizCount,
    required this.lessonCount,
    required this.signalCount,
    this.isNew = false,
    this.requirement,
    this.examInfo,
    this.isCQC = false,
  });
}
