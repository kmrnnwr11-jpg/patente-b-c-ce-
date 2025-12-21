import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../theme/app_theme.dart';
import '../../services/course_service.dart';
import 'dashboard_screen.dart';
import 'italian_dashboard_screen.dart';

class CourseSelectionScreen extends StatelessWidget {
  const CourseSelectionScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.backgroundColor,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const SizedBox(height: 40),
              const Text(
                'Scegli il tuo percorso',
                style: TextStyle(
                  fontSize: 28,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 8),
              Text(
                'Cosa vuoi imparare oggi?',
                style: TextStyle(
                  fontSize: 16,
                  color: Colors.white.withOpacity(0.7),
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 60),

              // Patente B Card
              Expanded(
                child: _buildCourseCard(
                  context,
                  title: 'Patente B',
                  subtitle: 'Quiz, Teoria e Simulazioni',
                  icon: Icons.directions_car,
                  color: AppTheme.primaryColor,
                  type: CourseType.patente,
                ),
              ),

              const SizedBox(height: 24),

              // Italiano Card
              Expanded(
                child: _buildCourseCard(
                  context,
                  title: 'Lingua Italiana',
                  subtitle: 'Test A2 & B1 per la cittadinanza',
                  icon: Icons.translate,
                  color: AppTheme.accentGreen,
                  type: CourseType.italiano,
                ),
              ),

              const SizedBox(height: 40),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildCourseCard(
    BuildContext context, {
    required String title,
    required String subtitle,
    required IconData icon,
    required Color color,
    required CourseType type,
  }) {
    return GestureDetector(
      onTap: () {
        context.read<CourseService>().setCourse(type);
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(
            builder: (context) => type == CourseType.patente
                ? const DashboardScreen()
                : const ItalianDashboardScreen(),
          ),
        );
      },
      child: Container(
        decoration: BoxDecoration(
          color: AppTheme.cardColor,
          borderRadius: BorderRadius.circular(24),
          border: Border.all(color: color.withOpacity(0.3), width: 2),
          boxShadow: [
            BoxShadow(
              color: color.withOpacity(0.1),
              blurRadius: 20,
              offset: const Offset(0, 8),
            ),
          ],
        ),
        child: Stack(
          children: [
            // Background Icon Faded
            Positioned(
              right: -20,
              bottom: -20,
              child: Icon(icon, size: 140, color: color.withOpacity(0.05)),
            ),

            // Content
            Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: color.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Icon(icon, color: color, size: 32),
                  ),
                  const Spacer(),
                  Text(
                    title,
                    style: const TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    subtitle,
                    style: TextStyle(
                      fontSize: 14,
                      color: Colors.white.withOpacity(0.6),
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
