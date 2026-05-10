import 'package:flutter/material.dart';

class LearningBadge extends StatelessWidget {
  const LearningBadge({super.key});

  @override
  Widget build(BuildContext context) {
    return FittedBox(
      fit: BoxFit.scaleDown,
      child: Container(
        padding: const EdgeInsets.all(10),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(8),
          boxShadow: const [
            BoxShadow(
              color: Color(0x1A253B68),
              blurRadius: 20,
              offset: Offset(0, 8),
            ),
          ],
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: const [
            _LetterBox(letter: 'A', color: Color(0xFF4F8FF7)),
            SizedBox(width: 8),
            _LetterBox(letter: 'B', color: Color(0xFFFF75A9)),
            SizedBox(width: 8),
            _LetterBox(letter: 'C', color: Color(0xFF79D98B)),
            SizedBox(width: 18),
            _Pill(label: 'Trace', color: Color(0xFFFFF0B8)),
            SizedBox(width: 10),
            _AndBubble(),
            SizedBox(width: 10),
            _Pill(label: 'Count', color: Color(0xFFE7F4FF)),
          ],
        ),
      ),
    );
  }
}

class _LetterBox extends StatelessWidget {
  const _LetterBox({required this.letter, required this.color});

  final String letter;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 54,
      height: 54,
      alignment: Alignment.center,
      decoration: BoxDecoration(
        color: color,
        borderRadius: BorderRadius.circular(8),
        boxShadow: const [
          BoxShadow(
            color: Color(0x26253B68),
            blurRadius: 0,
            offset: Offset(0, 5),
          ),
        ],
      ),
      child: Text(
        letter,
        style: const TextStyle(
          color: Colors.white,
          fontSize: 30,
          fontWeight: FontWeight.w900,
        ),
      ),
    );
  }
}

class _Pill extends StatelessWidget {
  const _Pill({required this.label, required this.color});

  final String label;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Container(
      constraints: const BoxConstraints(minWidth: 118),
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
      alignment: Alignment.center,
      decoration: BoxDecoration(
        color: color,
        borderRadius: BorderRadius.circular(999),
      ),
      child: Text(
        label,
        style: const TextStyle(
          color: Color(0xFF253B68),
          fontSize: 26,
          fontWeight: FontWeight.w900,
        ),
      ),
    );
  }
}

class _AndBubble extends StatelessWidget {
  const _AndBubble();

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 52,
      height: 52,
      alignment: Alignment.center,
      decoration: const BoxDecoration(
        color: Color(0xFFFFE3EF),
        shape: BoxShape.circle,
      ),
      child: const Text(
        '&',
        style: TextStyle(
          color: Color(0xFF9D486C),
          fontSize: 28,
          fontWeight: FontWeight.w900,
        ),
      ),
    );
  }
}
