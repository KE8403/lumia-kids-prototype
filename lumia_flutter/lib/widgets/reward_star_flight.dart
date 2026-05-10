import 'dart:math' as math;

import 'package:flutter/material.dart';

class RewardStarFlight extends StatefulWidget {
  const RewardStarFlight({super.key, required this.onComplete});

  final VoidCallback onComplete;

  @override
  State<RewardStarFlight> createState() => _RewardStarFlightState();
}

class _RewardStarFlightState extends State<RewardStarFlight>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller =
        AnimationController(
            vsync: this,
            duration: const Duration(milliseconds: 4300),
          )
          ..addStatusListener((status) {
            if (status == AnimationStatus.completed) {
              widget.onComplete();
            }
          })
          ..forward();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Positioned.fill(
      child: IgnorePointer(
        child: LayoutBuilder(
          builder: (context, constraints) {
            final screen = Size(constraints.maxWidth, constraints.maxHeight);
            final start = Offset(screen.width * 0.5, screen.height * 0.46);
            final end = Offset(screen.width - 58, 58);

            return AnimatedBuilder(
              animation: _controller,
              builder: (context, child) {
                final value = _controller.value;
                final hold = (value / 0.34).clamp(0.0, 1.0);
                final travel = Curves.easeInOutCubic.transform(
                  ((value - 0.34) / 0.66).clamp(0.0, 1.0),
                );
                final position = Offset.lerp(start, end, travel)!;
                final lift = math.sin(travel * math.pi) * -26;
                final scale = 1.08 - travel * 0.9;
                final opacity = value > 0.94
                    ? (1 - ((value - 0.94) / 0.06)).clamp(0.0, 1.0)
                    : 1.0;

                return Stack(
                  children: [
                    Positioned(
                      left: screen.width / 2 - 104,
                      top: screen.height * 0.2,
                      child: Opacity(
                        opacity: (1 - travel).clamp(0.0, 1.0),
                        child: Transform.scale(
                          scale: 0.88 + hold * 0.12,
                          child: Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 22,
                              vertical: 12,
                            ),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(999),
                              boxShadow: const [
                                BoxShadow(
                                  color: Color(0x1A253B68),
                                  blurRadius: 20,
                                  offset: Offset(0, 8),
                                ),
                              ],
                            ),
                            child: const Text(
                              'You got stars!',
                              style: TextStyle(
                                color: Color(0xFF253B68),
                                fontSize: 20,
                                fontWeight: FontWeight.w900,
                              ),
                            ),
                          ),
                        ),
                      ),
                    ),
                    _TrailStar(
                      position: Offset.lerp(
                        start,
                        end,
                        (travel - 0.1).clamp(0.0, 1.0),
                      )!,
                      opacity: travel > 0 ? (1 - travel).clamp(0.0, 0.75) : 0,
                      size: 24,
                      delayLift: 18,
                    ),
                    _TrailStar(
                      position: Offset.lerp(
                        start,
                        end,
                        (travel - 0.2).clamp(0.0, 1.0),
                      )!,
                      opacity: travel > 0 ? (1 - travel).clamp(0.0, 0.55) : 0,
                      size: 18,
                      delayLift: 26,
                    ),
                    Positioned(
                      left: position.dx - 70,
                      top: position.dy - 70 + lift,
                      child: Opacity(
                        opacity: opacity,
                        child: Transform.rotate(
                          angle: math.sin(travel * math.pi) * 0.08,
                          child: Transform.scale(
                            scale: scale,
                            child: const _SmilingRewardStar(size: 140),
                          ),
                        ),
                      ),
                    ),
                  ],
                );
              },
            );
          },
        ),
      ),
    );
  }
}

class _TrailStar extends StatelessWidget {
  const _TrailStar({
    required this.position,
    required this.opacity,
    required this.size,
    required this.delayLift,
  });

  final Offset position;
  final double opacity;
  final double size;
  final double delayLift;

  @override
  Widget build(BuildContext context) {
    return Positioned(
      left: position.dx - size / 2 - 16,
      top: position.dy - size / 2 + delayLift,
      child: Opacity(
        opacity: opacity,
        child: Text(
          '★',
          style: TextStyle(
            color: const Color(0xFFFFD85A),
            fontSize: size,
            fontWeight: FontWeight.w900,
          ),
        ),
      ),
    );
  }
}

class _SmilingRewardStar extends StatelessWidget {
  const _SmilingRewardStar({required this.size});

  final double size;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: size,
      height: size,
      child: Stack(
        alignment: Alignment.center,
        children: [
          CustomPaint(size: Size.square(size), painter: _RewardStarPainter()),
          Positioned(
            top: size * 0.37,
            left: size * 0.32,
            child: _Eye(size: size * 0.09),
          ),
          Positioned(
            top: size * 0.37,
            right: size * 0.32,
            child: _Eye(size: size * 0.09),
          ),
          Positioned(
            top: size * 0.58,
            child: CustomPaint(
              size: Size(size * 0.32, size * 0.16),
              painter: _SmilePainter(),
            ),
          ),
        ],
      ),
    );
  }
}

class _Eye extends StatelessWidget {
  const _Eye({required this.size});

  final double size;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: size,
      height: size * 1.12,
      decoration: BoxDecoration(
        color: const Color(0xFF25304B),
        borderRadius: BorderRadius.circular(size),
      ),
      child: Align(
        alignment: const Alignment(-0.3, -0.36),
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

class _RewardStarPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final outer = size.width * 0.44;
    final inner = size.width * 0.25;
    final path = Path();

    for (var i = 0; i < 10; i++) {
      final radius = i.isEven ? outer : inner;
      final angle = -math.pi / 2 + i * math.pi / 5;
      final point = Offset(
        center.dx + math.cos(angle) * radius,
        center.dy + math.sin(angle) * radius,
      );
      if (i == 0) {
        path.moveTo(point.dx, point.dy);
      } else {
        path.lineTo(point.dx, point.dy);
      }
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
        ..color = const Color(0xFFFFD85A)
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
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
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
