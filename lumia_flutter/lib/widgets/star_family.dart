import 'dart:math' as math;

import 'package:flutter/material.dart';

class StarFamily extends StatefulWidget {
  const StarFamily({super.key, this.size = 120});

  final double size;

  @override
  State<StarFamily> createState() => _StarFamilyState();
}

class _StarFamilyState extends State<StarFamily>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 3600),
    )..repeat(reverse: true);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final width = widget.size * 2.45;
    final height = widget.size * 1.58;

    return SizedBox(
      width: width,
      height: height,
      child: AnimatedBuilder(
        animation: _controller,
        builder: (context, child) {
          final t = _controller.value;
          return Stack(
            clipBehavior: Clip.none,
            alignment: Alignment.center,
            children: [
              _AnimatedStar(
                left: width * 0.5,
                top: height * 0.35,
                size: widget.size * 1.08,
                color: const Color(0xFFFFD85A),
                dy: math.sin(t * math.pi) * -4,
                rotation: 0.014 * math.sin(t * math.pi),
                big: true,
              ),
              _AnimatedStar(
                left: width * 0.23,
                top: height * 0.84,
                size: widget.size * 0.5,
                color: const Color(0xFF4F8FF7),
                dy: math.sin((t + 0.2) * math.pi) * -5,
                rotation: -0.035 * math.sin(t * math.pi),
                gaze: 0.8,
              ),
              _AnimatedStar(
                left: width * 0.5,
                top: height * 0.9,
                size: widget.size * 0.56,
                color: const Color(0xFFFF75A9),
                dy: math.sin((t + 0.48) * math.pi) * -4,
                rotation: 0.03 * math.sin(t * math.pi),
                gaze: 0,
              ),
              _AnimatedStar(
                left: width * 0.77,
                top: height * 0.84,
                size: widget.size * 0.5,
                color: const Color(0xFF79D98B),
                dy: math.sin((t + 0.72) * math.pi) * -5,
                rotation: -0.028 * math.sin(t * math.pi),
                gaze: -0.8,
              ),
            ],
          );
        },
      ),
    );
  }
}

class _AnimatedStar extends StatelessWidget {
  const _AnimatedStar({
    required this.left,
    required this.top,
    required this.size,
    required this.color,
    required this.dy,
    required this.rotation,
    this.big = false,
    this.gaze = 0,
  });

  final double left;
  final double top;
  final double size;
  final Color color;
  final double dy;
  final double rotation;
  final bool big;
  final double gaze;

  @override
  Widget build(BuildContext context) {
    return Positioned(
      left: left - size / 2,
      top: top - size / 2 + dy,
      child: Transform.rotate(
        angle: rotation,
        child: SizedBox(
          width: size,
          height: size,
          child: Stack(
            alignment: Alignment.center,
            children: [
              CustomPaint(
                size: Size.square(size),
                painter: _BubblyStarPainter(color: color),
              ),
              Positioned(
                top: size * (big ? 0.36 : 0.35),
                left: size * (big ? 0.32 : 0.31),
                child: _Eye(size: size * (big ? 0.098 : 0.108), gaze: gaze),
              ),
              Positioned(
                top: size * (big ? 0.36 : 0.35),
                right: size * (big ? 0.32 : 0.31),
                child: _Eye(size: size * (big ? 0.098 : 0.108), gaze: gaze),
              ),
              Positioned(
                top: size * 0.5,
                left: size * 0.22,
                child: _Cheek(size: size * (big ? 0.09 : 0.1)),
              ),
              Positioned(
                top: size * 0.5,
                right: size * 0.22,
                child: _Cheek(size: size * (big ? 0.09 : 0.1)),
              ),
              Positioned(
                top: size * 0.57,
                child: CustomPaint(
                  size: Size(size * (big ? 0.34 : 0.38), size * 0.18),
                  painter: _SmilePainter(),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _Eye extends StatelessWidget {
  const _Eye({required this.size, required this.gaze});

  final double size;
  final double gaze;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: size,
      height: size * 1.16,
      decoration: BoxDecoration(
        color: const Color(0xFF25304B),
        borderRadius: BorderRadius.circular(size),
      ),
      child: Align(
        alignment: Alignment(-0.28 + gaze * 0.18, -0.36),
        child: Container(
          width: size * 0.34,
          height: size * 0.34,
          decoration: BoxDecoration(
            color: Colors.white.withValues(alpha: 0.92),
            shape: BoxShape.circle,
          ),
        ),
      ),
    );
  }
}

class _Cheek extends StatelessWidget {
  const _Cheek({required this.size});

  final double size;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: size,
      height: size * 0.62,
      decoration: BoxDecoration(
        color: const Color(0xFFFFAEC7).withValues(alpha: 0.5),
        borderRadius: BorderRadius.circular(size),
      ),
    );
  }
}

class _BubblyStarPainter extends CustomPainter {
  const _BubblyStarPainter({required this.color});

  final Color color;

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final outer = size.width * 0.44;
    final inner = size.width * 0.25;
    final points = <Offset>[];

    for (var i = 0; i < 10; i++) {
      final radius = i.isEven ? outer : inner;
      final angle = -math.pi / 2 + i * math.pi / 5;
      points.add(
        Offset(
          center.dx + math.cos(angle) * radius,
          center.dy + math.sin(angle) * radius,
        ),
      );
    }

    final path = Path()..moveTo(points.first.dx, points.first.dy);
    for (var i = 0; i < points.length; i++) {
      final current = points[i];
      final next = points[(i + 1) % points.length];
      final controlOne = Offset.lerp(current, next, 0.42)!;
      final controlTwo = Offset.lerp(current, next, 0.58)!;
      path.cubicTo(
        current.dx,
        current.dy,
        controlOne.dx,
        controlOne.dy,
        controlTwo.dx,
        controlTwo.dy,
      );
    }
    path.close();

    canvas.drawPath(
      path.shift(Offset(0, size.width * 0.04)),
      Paint()
        ..color = const Color(0x1A253B68)
        ..style = PaintingStyle.fill,
    );

    canvas.drawPath(
      path,
      Paint()
        ..color = color
        ..style = PaintingStyle.fill,
    );
    canvas.drawPath(
      path,
      Paint()
        ..color = Colors.white.withValues(alpha: 0.82)
        ..style = PaintingStyle.stroke
        ..strokeWidth = size.width * 0.05
        ..strokeJoin = StrokeJoin.round,
    );

    final shine = Path()
      ..moveTo(size.width * 0.34, size.height * 0.25)
      ..quadraticBezierTo(
        size.width * 0.42,
        size.height * 0.16,
        size.width * 0.52,
        size.height * 0.2,
      );
    canvas.drawPath(
      shine,
      Paint()
        ..color = Colors.white.withValues(alpha: 0.5)
        ..style = PaintingStyle.stroke
        ..strokeWidth = size.width * 0.035
        ..strokeCap = StrokeCap.round,
    );
  }

  @override
  bool shouldRepaint(covariant _BubblyStarPainter oldDelegate) {
    return oldDelegate.color != color;
  }
}

class _SmilePainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final path = Path()
      ..moveTo(0, size.height * 0.2)
      ..quadraticBezierTo(
        size.width / 2,
        size.height,
        size.width,
        size.height * 0.2,
      );

    canvas.drawPath(
      path,
      Paint()
        ..color = const Color(0xFF25304B)
        ..style = PaintingStyle.stroke
        ..strokeWidth = 3
        ..strokeCap = StrokeCap.round,
    );
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
