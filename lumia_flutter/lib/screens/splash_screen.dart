import 'package:flutter/material.dart';

import '../widgets/learning_badge.dart';
import '../widgets/page_background.dart';
import '../widgets/star_family.dart';

class SplashScreen extends StatelessWidget {
  const SplashScreen({super.key, required this.onStart});

  final VoidCallback onStart;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: PageBackground(
        child: SafeArea(
          child: Center(
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 560),
              child: Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: 24,
                  vertical: 28,
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Spacer(),
                    const StarFamily(size: 132),
                    const SizedBox(height: 24),
                    Text(
                      'LumiA Kids',
                      textAlign: TextAlign.center,
                      style: Theme.of(context).textTheme.displaySmall?.copyWith(
                        color: const Color(0xFF253B68),
                        fontWeight: FontWeight.w900,
                        height: 1,
                      ),
                    ),
                    const SizedBox(height: 18),
                    const LearningBadge(),
                    const SizedBox(height: 34),
                    SizedBox(
                      width: double.infinity,
                      child: FilledButton(
                        onPressed: onStart,
                        style: FilledButton.styleFrom(
                          backgroundColor: const Color(0xFF4F8FF7),
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(vertical: 20),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(8),
                          ),
                        ),
                        child: const Text(
                          'Start Learning',
                          style: TextStyle(
                            fontSize: 22,
                            fontWeight: FontWeight.w900,
                          ),
                        ),
                      ),
                    ),
                    const Spacer(),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
