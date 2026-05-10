import 'package:flutter/material.dart';

class PageBackground extends StatelessWidget {
  const PageBackground({super.key, required this.child});

  final Widget child;

  @override
  Widget build(BuildContext context) {
    return CustomPaint(
      painter: _GridPainter(),
      child: SizedBox.expand(child: child),
    );
  }
}

class _GridPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    canvas.drawColor(const Color(0xFFFFFBEE), BlendMode.src);

    final paint = Paint()
      ..color = const Color(0xFFE4EDF9)
      ..strokeWidth = 1;

    const gap = 56.0;
    for (double x = 0; x <= size.width; x += gap) {
      canvas.drawLine(Offset(x, 0), Offset(x, size.height), paint);
    }
    for (double y = 0; y <= size.height; y += gap) {
      canvas.drawLine(Offset(0, y), Offset(size.width, y), paint);
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
