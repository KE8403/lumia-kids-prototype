import 'package:flutter/material.dart';

class StarCounter extends StatefulWidget {
  const StarCounter({super.key, required this.stars, this.pulseToken = 0});

  final int stars;
  final int pulseToken;

  @override
  State<StarCounter> createState() => _StarCounterState();
}

class _StarCounterState extends State<StarCounter>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1300),
    );
  }

  @override
  void didUpdateWidget(covariant StarCounter oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.pulseToken != oldWidget.pulseToken) {
      _controller.forward(from: 0);
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        final pulse = Curves.easeOutBack.transform(
          (_controller.value / 0.45).clamp(0.0, 1.0),
        );
        final sparkle = Curves.easeOut.transform(
          (_controller.value / 0.72).clamp(0.0, 1.0),
        );
        final fade = (1 - _controller.value).clamp(0.0, 1.0);

        return Transform.scale(
          scale: 1 + pulse * 0.14,
          child: Stack(
            clipBehavior: Clip.none,
            alignment: Alignment.center,
            children: [
              child!,
              _CounterSparkle(
                alignment: const Alignment(-1.35, -1.05),
                opacity: sparkle * fade,
                size: 18,
              ),
              _CounterSparkle(
                alignment: const Alignment(1.3, -0.95),
                opacity: sparkle * fade,
                size: 16,
              ),
              _CounterSparkle(
                alignment: const Alignment(0.85, 1.35),
                opacity: sparkle * fade,
                size: 15,
              ),
            ],
          ),
        );
      },
      child: Container(
        constraints: const BoxConstraints(minWidth: 82, minHeight: 40),
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 7),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(999),
          border: Border.all(color: const Color(0xFFFFD85A), width: 3),
          boxShadow: const [
            BoxShadow(
              color: Color(0x1A253B68),
              blurRadius: 18,
              offset: Offset(0, 8),
            ),
          ],
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text(
              '★',
              style: TextStyle(
                color: Color(0xFFFFD85A),
                fontSize: 24,
                fontWeight: FontWeight.w900,
              ),
            ),
            const SizedBox(width: 8),
            Text(
              '${widget.stars}',
              style: const TextStyle(
                color: Color(0xFF253B68),
                fontSize: 19,
                fontWeight: FontWeight.w900,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _CounterSparkle extends StatelessWidget {
  const _CounterSparkle({
    required this.alignment,
    required this.opacity,
    required this.size,
  });

  final Alignment alignment;
  final double opacity;
  final double size;

  @override
  Widget build(BuildContext context) {
    return Positioned.fill(
      child: Align(
        alignment: alignment,
        child: Opacity(
          opacity: opacity,
          child: Text(
            '✦',
            style: TextStyle(
              color: const Color(0xFFFFD85A),
              fontSize: size,
              fontWeight: FontWeight.w900,
            ),
          ),
        ),
      ),
    );
  }
}
