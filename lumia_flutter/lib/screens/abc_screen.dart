import 'package:flutter/material.dart';

import '../widgets/page_background.dart';
import '../widgets/star_counter.dart';

class AbcScreen extends StatelessWidget {
  const AbcScreen({
    super.key,
    required this.stars,
    required this.starPulseToken,
    required this.onBack,
    required this.onHome,
    required this.onLetter,
  });

  final int stars;
  final int starPulseToken;
  final VoidCallback onBack;
  final VoidCallback onHome;
  final ValueChanged<String> onLetter;

  static const _letters = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: PageBackground(
        child: SafeArea(
          child: Center(
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 820),
              child: Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: 18,
                  vertical: 16,
                ),
                child: Column(
                  children: [
                    _TopBar(
                      title: 'ABC',
                      stars: stars,
                      starPulseToken: starPulseToken,
                      onBack: onBack,
                      onHome: onHome,
                    ),
                    const SizedBox(height: 16),
                    Expanded(
                      child: LayoutBuilder(
                        builder: (context, constraints) {
                          final columns = constraints.maxWidth >= 700
                              ? 6
                              : constraints.maxWidth >= 520
                              ? 5
                              : 4;
                          return GridView.builder(
                            physics: const BouncingScrollPhysics(),
                            gridDelegate:
                                SliverGridDelegateWithFixedCrossAxisCount(
                                  crossAxisCount: columns,
                                  mainAxisSpacing: 12,
                                  crossAxisSpacing: 12,
                                  childAspectRatio: 1,
                                ),
                            itemCount: _letters.length,
                            itemBuilder: (context, index) {
                              final letter = _letters[index];
                              final lower = letter == 'A'
                                  ? 'ɑ'
                                  : letter.toLowerCase();
                              final enabled = letter == 'A';
                              return _LetterTile(
                                letter: letter,
                                lower: lower,
                                enabled: enabled,
                                onTap: () => onLetter(letter),
                              );
                            },
                          );
                        },
                      ),
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
}

class _TopBar extends StatelessWidget {
  const _TopBar({
    required this.title,
    required this.stars,
    required this.starPulseToken,
    required this.onBack,
    required this.onHome,
  });

  final String title;
  final int stars;
  final int starPulseToken;
  final VoidCallback onBack;
  final VoidCallback onHome;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        IconButton.filledTonal(
          onPressed: onBack,
          icon: const Icon(Icons.arrow_back_rounded),
        ),
        const SizedBox(width: 8),
        IconButton.filledTonal(
          onPressed: onHome,
          icon: const Icon(Icons.home_rounded),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Text(
            title,
            style: Theme.of(context).textTheme.headlineMedium?.copyWith(
              color: const Color(0xFF253B68),
              fontWeight: FontWeight.w900,
            ),
          ),
        ),
        StarCounter(stars: stars, pulseToken: starPulseToken),
      ],
    );
  }
}

class _LetterTile extends StatelessWidget {
  const _LetterTile({
    required this.letter,
    required this.lower,
    required this.enabled,
    required this.onTap,
  });

  final String letter;
  final String lower;
  final bool enabled;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: enabled ? Colors.white : Colors.white.withValues(alpha: 0.62),
      borderRadius: BorderRadius.circular(8),
      child: InkWell(
        onTap: enabled ? onTap : null,
        borderRadius: BorderRadius.circular(8),
        child: Container(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(8),
            border: Border.all(
              color: enabled
                  ? const Color(0xFFCCE0FF)
                  : const Color(0xFFE6E1D3),
              width: 3,
            ),
            boxShadow: enabled
                ? const [
                    BoxShadow(
                      color: Color(0x14253B68),
                      blurRadius: 16,
                      offset: Offset(0, 8),
                    ),
                  ]
                : null,
          ),
          child: Center(
            child: Text(
              '$letter $lower',
              style: TextStyle(
                color: enabled
                    ? const Color(0xFF253B68)
                    : const Color(0xFF9C9A92),
                fontSize: 26,
                fontWeight: FontWeight.w900,
              ),
            ),
          ),
        ),
      ),
    );
  }
}
