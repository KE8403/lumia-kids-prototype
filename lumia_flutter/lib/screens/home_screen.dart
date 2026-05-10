import 'package:flutter/material.dart';

import '../widgets/learning_badge.dart';
import '../widgets/page_background.dart';
import '../widgets/star_counter.dart';
import '../widgets/star_family.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({
    super.key,
    required this.stars,
    required this.starPulseToken,
    required this.onAbc,
    required this.onPreviewStar,
  });

  final int stars;
  final int starPulseToken;
  final VoidCallback onAbc;
  final VoidCallback onPreviewStar;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: PageBackground(
        child: SafeArea(
          child: Center(
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 780),
              child: Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: 20,
                  vertical: 18,
                ),
                child: LayoutBuilder(
                  builder: (context, constraints) {
                    final wide = constraints.maxWidth >= 620;
                    return Column(
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              'LumiA Kids',
                              style: Theme.of(context).textTheme.headlineSmall
                                  ?.copyWith(
                                    color: const Color(0xFF253B68),
                                    fontWeight: FontWeight.w900,
                                  ),
                            ),
                            StarCounter(
                              stars: stars,
                              pulseToken: starPulseToken,
                            ),
                          ],
                        ),
                        const SizedBox(height: 18),
                        const StarFamily(size: 118),
                        const SizedBox(height: 18),
                        const LearningBadge(),
                        const SizedBox(height: 24),
                        Expanded(
                          child: GridView.count(
                            crossAxisCount: wide ? 4 : 2,
                            mainAxisSpacing: 14,
                            crossAxisSpacing: 14,
                            childAspectRatio: wide ? 0.95 : 1.12,
                            physics: const BouncingScrollPhysics(),
                            children: [
                              _HomeAction(
                                label: 'ABC',
                                sublabel: 'Letters',
                                color: const Color(0xFF4F8FF7),
                                onTap: onAbc,
                              ),
                              _HomeAction(
                                label: '123',
                                sublabel: 'Numbers',
                                color: const Color(0xFF79D98B),
                                onTap: onPreviewStar,
                              ),
                              _HomeAction(
                                label: 'Play',
                                sublabel: 'Match',
                                color: const Color(0xFFFF75A9),
                                onTap: onPreviewStar,
                              ),
                              _HomeAction(
                                label: 'Parent',
                                sublabel: 'Grown-ups',
                                color: const Color(0xFFFFD85A),
                                darkText: true,
                                onTap: onPreviewStar,
                              ),
                            ],
                          ),
                        ),
                      ],
                    );
                  },
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _HomeAction extends StatelessWidget {
  const _HomeAction({
    required this.label,
    required this.sublabel,
    required this.color,
    required this.onTap,
    this.darkText = false,
  });

  final String label;
  final String sublabel;
  final Color color;
  final VoidCallback onTap;
  final bool darkText;

  @override
  Widget build(BuildContext context) {
    final textColor = darkText ? const Color(0xFF253B68) : Colors.white;

    return Material(
      color: color,
      borderRadius: BorderRadius.circular(8),
      elevation: 0,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(8),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                label,
                textAlign: TextAlign.center,
                style: TextStyle(
                  color: textColor,
                  fontSize: 32,
                  fontWeight: FontWeight.w900,
                  height: 1,
                ),
              ),
              const SizedBox(height: 10),
              Text(
                sublabel,
                textAlign: TextAlign.center,
                style: TextStyle(
                  color: textColor.withValues(alpha: 0.86),
                  fontSize: 16,
                  fontWeight: FontWeight.w800,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
