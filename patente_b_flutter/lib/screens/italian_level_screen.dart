import 'package:flutter/material.dart';
import '../../theme/app_theme.dart';
import 'italian_test_screen.dart';

class ItalianLevelScreen extends StatelessWidget {
  final String level;
  final String title;
  final Color color;

  const ItalianLevelScreen({
    super.key,
    required this.level,
    required this.title,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.backgroundColor,
      appBar: AppBar(
        title: Text(title),
        backgroundColor: color,
        foregroundColor: Colors.white,
      ),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.all(20),
          children: [
            _buildSectionCard(
              context,
              section: 'reading',
              label: 'Lettura',
              icon: Icons.menu_book,
            ),
            const SizedBox(height: 16),
            _buildSectionCard(
              context,
              section: 'listening',
              label: 'Ascolto',
              icon: Icons.headphones,
            ),
            const SizedBox(height: 16),
            _buildSectionCard(
              context,
              section: 'grammar',
              label: 'Grammatica',
              icon: Icons.spellcheck,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSectionCard(
    BuildContext context, {
    required String section,
    required String label,
    required IconData icon,
  }) {
    return Card(
      color: AppTheme.cardColor,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: InkWell(
        onTap: () {
          // Navigate to test
          Navigator.of(context).push(
            MaterialPageRoute(
              builder: (context) => ItalianTestScreen(
                level: level,
                section: section,
                title: '$label - $level',
              ),
            ),
          );
        },
        borderRadius: BorderRadius.circular(16),
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: color.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(icon, color: color, size: 32),
              ),
              const SizedBox(width: 20),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      label,
                      style: const TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Test di $label livello $level',
                      style: TextStyle(
                        fontSize: 14,
                        color: Colors.white.withOpacity(0.6),
                      ),
                    ),
                  ],
                ),
              ),
              const Icon(Icons.arrow_forward_ios, color: Colors.grey, size: 16),
            ],
          ),
        ),
      ),
    );
  }
}
