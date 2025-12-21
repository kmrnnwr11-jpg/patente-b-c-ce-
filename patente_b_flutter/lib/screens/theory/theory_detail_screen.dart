import 'package:flutter/material.dart';
import '../../models/theory_chapter.dart';
import '../../theme/app_theme.dart';

class TheoryDetailScreen extends StatelessWidget {
  final TheoryChapter chapter;

  const TheoryDetailScreen({super.key, required this.chapter});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(chapter.title), centerTitle: true),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: chapter.sections.length,
        itemBuilder: (context, index) {
          final section = chapter.sections[index];
          return Card(
            margin: const EdgeInsets.only(bottom: 24),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(16),
            ),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Title
                  Text(
                    section.title,
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.primaryColor,
                    ),
                  ),
                  const SizedBox(height: 12),

                  // Single image (for signals)
                  if (section.image != null && section.image!.isNotEmpty) ...[
                    Center(
                      child: Container(
                        constraints: const BoxConstraints(
                          maxWidth: 200,
                          maxHeight: 200,
                        ),
                        decoration: BoxDecoration(
                          color: Colors.grey.shade100,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: Colors.grey.shade300),
                        ),
                        child: ClipRRect(
                          borderRadius: BorderRadius.circular(12),
                          child: Image.asset(
                            section.image!,
                            fit: BoxFit.contain,
                            errorBuilder: (context, error, stackTrace) {
                              // Debug: print error
                              debugPrint(
                                'Error loading image: ${section.image} - $error',
                              );
                              return Container(
                                width: 100,
                                height: 100,
                                color: Colors.grey.shade200,
                                child: Column(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    const Icon(
                                      Icons.image_not_supported,
                                      size: 32,
                                      color: Colors.grey,
                                    ),
                                    const SizedBox(height: 4),
                                    Text(
                                      section.image!.split('/').last,
                                      style: const TextStyle(
                                        fontSize: 8,
                                        color: Colors.grey,
                                      ),
                                      textAlign: TextAlign.center,
                                    ),
                                  ],
                                ),
                              );
                            },
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),
                  ],

                  // Multiple images (for theory lessons)
                  if (section.images != null && section.images!.isNotEmpty) ...[
                    SizedBox(
                      height: 140,
                      child: ListView.separated(
                        scrollDirection: Axis.horizontal,
                        itemCount: section.images!.length,
                        separatorBuilder: (_, __) => const SizedBox(width: 12),
                        itemBuilder: (context, imgIndex) {
                          final imagePath = section.images![imgIndex];
                          return Container(
                            width: 140,
                            decoration: BoxDecoration(
                              color: Colors.grey.shade100,
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(color: Colors.grey.shade300),
                            ),
                            child: ClipRRect(
                              borderRadius: BorderRadius.circular(12),
                              child: Image.asset(
                                imagePath,
                                fit: BoxFit.contain,
                                errorBuilder: (context, error, stackTrace) {
                                  debugPrint(
                                    'Error loading image: $imagePath - $error',
                                  );
                                  return const Center(
                                    child: Icon(
                                      Icons.image_not_supported,
                                      color: Colors.grey,
                                    ),
                                  );
                                },
                              ),
                            ),
                          );
                        },
                      ),
                    ),
                    const SizedBox(height: 16),
                  ],

                  // Content text
                  Text(
                    section.content,
                    style: const TextStyle(
                      fontSize: 16,
                      height: 1.6,
                      color: AppTheme.textPrimary,
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
