import 'dart:io';
import 'dart:ui' as ui;
import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:path_provider/path_provider.dart';

/// Utility per catturare screenshot di widget Flutter
class ScreenshotCapture {
  /// Cattura un widget come immagine PNG
  static Future<File?> captureWidget(
    GlobalKey key, {
    String fileName = 'screenshot',
    double pixelRatio = 3.0,
  }) async {
    try {
      RenderRepaintBoundary boundary =
          key.currentContext!.findRenderObject() as RenderRepaintBoundary;

      ui.Image image = await boundary.toImage(pixelRatio: pixelRatio);

      ByteData? byteData = await image.toByteData(
        format: ui.ImageByteFormat.png,
      );

      if (byteData != null) {
        final directory = await getApplicationDocumentsDirectory();
        final file = File('${directory.path}/$fileName.png');
        await file.writeAsBytes(byteData.buffer.asUint8List());
        debugPrint('📸 Screenshot salvato: ${file.path}');
        return file;
      }
    } catch (e) {
      debugPrint('❌ Errore cattura screenshot: $e');
    }
    return null;
  }
}

/// Widget per creare screenshot promozionali con cornice device
class PromoScreenshot extends StatelessWidget {
  final String title;
  final String subtitle;
  final Widget appScreen;
  final List<Color> gradientColors;
  final double width;
  final double height;

  const PromoScreenshot({
    Key? key,
    required this.title,
    required this.subtitle,
    required this.appScreen,
    this.gradientColors = const [Color(0xFF667eea), Color(0xFF764ba2)],
    this.width = 1080,
    this.height = 1920,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      width: width,
      height: height,
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: gradientColors,
        ),
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          // Titolo
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 40),
            child: Text(
              title,
              textAlign: TextAlign.center,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 48,
                fontWeight: FontWeight.bold,
                height: 1.2,
                decoration: TextDecoration.none,
              ),
            ),
          ),
          const SizedBox(height: 20),

          // Sottotitolo
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 60),
            child: Text(
              subtitle,
              textAlign: TextAlign.center,
              style: TextStyle(
                color: Colors.white.withOpacity(0.8),
                fontSize: 24,
                decoration: TextDecoration.none,
              ),
            ),
          ),
          const SizedBox(height: 60),

          // Screenshot con cornice telefono
          _buildPhoneFrame(),
        ],
      ),
    );
  }

  Widget _buildPhoneFrame() {
    return Container(
      decoration: BoxDecoration(
        color: Colors.black,
        borderRadius: BorderRadius.circular(50),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.4),
            blurRadius: 30,
            offset: const Offset(0, 15),
          ),
        ],
      ),
      padding: const EdgeInsets.all(15),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(40),
        child: SizedBox(width: 350, height: 700, child: appScreen),
      ),
    );
  }
}

/// Widget cornice telefono standalone
class PhoneFrame extends StatelessWidget {
  final Widget child;
  final Color frameColor;
  final double borderRadius;

  const PhoneFrame({
    Key? key,
    required this.child,
    this.frameColor = Colors.black,
    this.borderRadius = 40,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: frameColor,
        borderRadius: BorderRadius.circular(borderRadius + 10),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.3),
            blurRadius: 20,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      padding: const EdgeInsets.all(12),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(borderRadius),
        child: child,
      ),
    );
  }
}

/// Feature Graphic per Play Store (1024x500)
class FeatureGraphic extends StatelessWidget {
  final String title;
  final String subtitle;
  final Widget? screenshotWidget;

  const FeatureGraphic({
    Key? key,
    this.title = 'Patente B Quiz',
    this.subtitle = 'La tua patente a portata di tap!',
    this.screenshotWidget,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 1024,
      height: 500,
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Color(0xFF1a237e), Color(0xFF4a148c)],
        ),
      ),
      child: Row(
        children: [
          // Lato sinistro - Testo
          Expanded(
            flex: 3,
            child: Padding(
              padding: const EdgeInsets.all(40),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Logo/Icona
                  Container(
                    width: 80,
                    height: 80,
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: const Center(
                      child: Text('🚗', style: TextStyle(fontSize: 40)),
                    ),
                  ),
                  const SizedBox(height: 20),

                  // Titolo
                  Text(
                    title,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 48,
                      fontWeight: FontWeight.bold,
                      decoration: TextDecoration.none,
                    ),
                  ),
                  const SizedBox(height: 10),

                  // Sottotitolo
                  Text(
                    subtitle,
                    style: TextStyle(
                      color: Colors.white.withOpacity(0.8),
                      fontSize: 24,
                      decoration: TextDecoration.none,
                    ),
                  ),
                  const SizedBox(height: 20),

                  // Badge
                  Row(
                    children: [
                      _buildBadge('🇮🇹 Italiano'),
                      const SizedBox(width: 10),
                      _buildBadge('📱 Offline'),
                      const SizedBox(width: 10),
                      _buildBadge('✨ 2024'),
                    ],
                  ),
                ],
              ),
            ),
          ),

          // Lato destro - Mockup
          if (screenshotWidget != null)
            Expanded(
              flex: 2,
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: Transform.rotate(
                  angle: 0.1,
                  child: PhoneFrame(
                    child: SizedBox(
                      width: 200,
                      height: 400,
                      child: screenshotWidget,
                    ),
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildBadge(String text) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.2),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Text(
        text,
        style: const TextStyle(
          color: Colors.white,
          fontSize: 14,
          decoration: TextDecoration.none,
        ),
      ),
    );
  }
}
