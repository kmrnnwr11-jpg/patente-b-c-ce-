import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/theme_provider.dart';

class ThemeToggleButton extends StatelessWidget {
  final Color? color;
  final double? size;

  const ThemeToggleButton({super.key, this.color, this.size});

  @override
  Widget build(BuildContext context) {
    return Consumer<ThemeProvider>(
      builder: (context, themeProvider, _) {
        return IconButton(
          icon: Icon(
            themeProvider.isDarkMode ? Icons.light_mode : Icons.dark_mode,
            size: size,
          ),
          color: color,
          // If color is null, it falls back to IconTheme or properties
          onPressed: () {
            themeProvider.toggleTheme();
          },
          tooltip: themeProvider.isDarkMode
              ? 'Passa alla modalità giorno'
              : 'Passa alla modalità notte',
        );
      },
    );
  }
}
