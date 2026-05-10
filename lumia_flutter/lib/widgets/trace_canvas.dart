import 'dart:math' as math;

import 'package:flutter/material.dart';

class TraceCanvas extends StatefulWidget {
  const TraceCanvas({super.key, required this.guide});

  final String guide;

  @override
  State<TraceCanvas> createState() => TraceCanvasState();
}

class TraceCanvasState extends State<TraceCanvas> {
  final List<List<Offset>> _strokes = [];
  final Set<int> _coveredGuidePoints = {};
  final List<_Sparkle> _sparkles = [];

  int _validTracePoints = 0;
  DateTime _lastSparkleAt = DateTime.fromMillisecondsSinceEpoch(0);

  bool get hasEnoughTracing {
    final coverage = _coveredGuidePoints.length / _guidePointCount;
    return coverage >= 0.54 && _validTracePoints >= 22;
  }

  int get _guidePointCount => widget.guide == 'A' ? 31 : 1;

  void clear() {
    setState(() {
      _strokes.clear();
      _coveredGuidePoints.clear();
      _sparkles.clear();
      _validTracePoints = 0;
    });
  }

  void _startStroke(DragStartDetails details, Size size) {
    setState(() {
      _strokes.add([details.localPosition]);
      _recordGuideHit(details.localPosition, size);
    });
  }

  void _updateStroke(DragUpdateDetails details, Size size) {
    setState(() {
      if (_strokes.isEmpty) {
        _strokes.add([]);
      }
      _strokes.last.add(details.localPosition);
      _recordGuideHit(details.localPosition, size);
    });
  }

  void _recordGuideHit(Offset point, Size size) {
    final guidePoint = _nearestGuidePoint(point, size);
    if (guidePoint == null) return;

    final threshold = math.max(26.0, size.shortestSide * 0.075);
    if (guidePoint.distance > threshold) return;

    _validTracePoints += 1;
    _coveredGuidePoints.add(guidePoint.index);

    final now = DateTime.now();
    if (now.difference(_lastSparkleAt).inMilliseconds < 150) return;

    _lastSparkleAt = now;
    _sparkles.add(_Sparkle(point));

    Future.delayed(const Duration(milliseconds: 900), () {
      if (!mounted || _sparkles.isEmpty) return;
      setState(() {
        _sparkles.removeAt(0);
      });
    });
  }

  _NearestGuidePoint? _nearestGuidePoint(Offset point, Size size) {
    final samples = _guideSamples(size);
    if (samples.isEmpty) return null;

    _GuideSample? nearest;
    var distance = double.infinity;
    for (final sample in samples) {
      final currentDistance = (sample.point - point).distance;
      if (currentDistance < distance) {
        distance = currentDistance;
        nearest = sample;
      }
    }

    if (nearest == null) return null;
    return _NearestGuidePoint(index: nearest.index, distance: distance);
  }

  List<_GuideSample> _guideSamples(Size size) {
    if (widget.guide != 'A') return const [];

    final points = _aGeometry(size);
    return [
      ..._samplesOnLine(points.left, points.top, 12, 0),
      ..._samplesOnLine(points.top, points.right, 12, 12),
      ..._samplesOnLine(points.crossLeft, points.crossRight, 7, 24),
    ];
  }

  List<_GuideSample> _samplesOnLine(
    Offset start,
    Offset end,
    int count,
    int indexOffset,
  ) {
    return List.generate(count, (index) {
      final t = count == 1 ? 0.0 : index / (count - 1);
      return _GuideSample(
        index: indexOffset + index,
        point: Offset.lerp(start, end, t)!,
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(8),
      child: LayoutBuilder(
        builder: (context, constraints) {
          final size = Size(constraints.maxWidth, constraints.maxHeight);
          return GestureDetector(
            onPanStart: (details) => _startStroke(details, size),
            onPanUpdate: (details) => _updateStroke(details, size),
            child: CustomPaint(
              painter: _TracePainter(
                guide: widget.guide,
                strokes: _strokes,
                sparkles: _sparkles,
              ),
              child: const SizedBox.expand(),
            ),
          );
        },
      ),
    );
  }
}

class _TracePainter extends CustomPainter {
  const _TracePainter({
    required this.guide,
    required this.strokes,
    required this.sparkles,
  });

  final String guide;
  final List<List<Offset>> strokes;
  final List<_Sparkle> sparkles;

  @override
  void paint(Canvas canvas, Size size) {
    final background = Paint()..color = const Color(0xFFFFF7D8);
    canvas.drawRect(Offset.zero & size, background);

    if (guide == 'A') {
      _drawA(canvas, size);
    }

    final tracePaint = Paint()
      ..color = const Color(0xFFFF817D)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 20
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round;

    for (final stroke in strokes) {
      if (stroke.length < 2) continue;
      final path = Path()..moveTo(stroke.first.dx, stroke.first.dy);
      for (final point in stroke.skip(1)) {
        path.lineTo(point.dx, point.dy);
      }
      canvas.drawPath(path, tracePaint);
    }

    _drawSparkles(canvas);
  }

  void _drawA(Canvas canvas, Size size) {
    final points = _aGeometry(size);
    final scale = size.shortestSide / 360;

    final outlinePath = Path()
      ..moveTo(points.left.dx, points.left.dy)
      ..lineTo(points.top.dx, points.top.dy)
      ..lineTo(points.right.dx, points.right.dy)
      ..moveTo(points.crossLeft.dx, points.crossLeft.dy)
      ..lineTo(points.crossRight.dx, points.crossRight.dy);

    final outlineBack = Paint()
      ..color = const Color(0xFF243F6D)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 62 * scale
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round;

    final outlineFill = Paint()
      ..color = const Color(0xFFFFF7D8)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 48 * scale
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round;

    canvas.drawPath(outlinePath, outlineBack);
    canvas.drawPath(outlinePath, outlineFill);

    final dotPaint = Paint()
      ..color = const Color(0xFF243F6D)
      ..style = PaintingStyle.fill;

    _drawDotsOnLine(canvas, points.left, points.top, 12, 5.2 * scale, dotPaint);
    _drawDotsOnLine(
      canvas,
      points.top,
      points.right,
      12,
      5.2 * scale,
      dotPaint,
    );
    _drawDotsOnLine(
      canvas,
      points.crossLeft,
      points.crossRight,
      7,
      5.2 * scale,
      dotPaint,
    );
  }

  void _drawDotsOnLine(
    Canvas canvas,
    Offset start,
    Offset end,
    int count,
    double radius,
    Paint paint,
  ) {
    for (var i = 0; i < count; i++) {
      final t = count == 1 ? 0.0 : i / (count - 1);
      final point = Offset.lerp(start, end, t)!;
      canvas.drawCircle(point, radius, paint);
    }
  }

  void _drawSparkles(Canvas canvas) {
    final sparklePaint = Paint()
      ..color = const Color(0xFFFFD85A)
      ..style = PaintingStyle.fill;

    for (final sparkle in sparkles) {
      _drawStar(canvas, sparkle.point, 9, sparklePaint);
    }
  }

  void _drawStar(Canvas canvas, Offset center, double radius, Paint paint) {
    final path = Path();
    for (var i = 0; i < 10; i++) {
      final currentRadius = i.isEven ? radius : radius * 0.48;
      final angle = -math.pi / 2 + i * math.pi / 5;
      final point = Offset(
        center.dx + math.cos(angle) * currentRadius,
        center.dy + math.sin(angle) * currentRadius,
      );
      if (i == 0) {
        path.moveTo(point.dx, point.dy);
      } else {
        path.lineTo(point.dx, point.dy);
      }
    }
    path.close();
    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(covariant _TracePainter oldDelegate) => true;
}

_AGeometry _aGeometry(Size size) {
  final scale = size.shortestSide / 360;
  final centerX = size.width / 2;
  final top = size.height * 0.16;
  final bottom = size.height * 0.82;
  final left = centerX - 104 * scale;
  final right = centerX + 104 * scale;
  final crossY = size.height * 0.57;
  final crossLeft = centerX - 58 * scale;
  final crossRight = centerX + 58 * scale;

  return _AGeometry(
    left: Offset(left, bottom),
    top: Offset(centerX, top + 18 * scale),
    right: Offset(right, bottom),
    crossLeft: Offset(crossLeft, crossY),
    crossRight: Offset(crossRight, crossY),
  );
}

class _AGeometry {
  const _AGeometry({
    required this.left,
    required this.top,
    required this.right,
    required this.crossLeft,
    required this.crossRight,
  });

  final Offset left;
  final Offset top;
  final Offset right;
  final Offset crossLeft;
  final Offset crossRight;
}

class _GuideSample {
  const _GuideSample({required this.index, required this.point});

  final int index;
  final Offset point;
}

class _NearestGuidePoint {
  const _NearestGuidePoint({required this.index, required this.distance});

  final int index;
  final double distance;
}

class _Sparkle {
  const _Sparkle(this.point);

  final Offset point;
}
