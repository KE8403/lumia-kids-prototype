import 'dart:async';

import 'package:flutter/material.dart';

import '../widgets/page_background.dart';
import '../widgets/reward_star_flight.dart';
import '../widgets/star_counter.dart';
import '../widgets/trace_canvas.dart';

class LetterTraceScreen extends StatefulWidget {
  const LetterTraceScreen({
    super.key,
    required this.letter,
    required this.stars,
    required this.starPulseToken,
    required this.onBack,
    required this.onHome,
    required this.onEarnStar,
    required this.onTraceCompleted,
  });

  final String letter;
  final int stars;
  final int starPulseToken;
  final VoidCallback onBack;
  final VoidCallback onHome;
  final Future<void> Function() onEarnStar;
  final ValueChanged<String> onTraceCompleted;

  @override
  State<LetterTraceScreen> createState() => _LetterTraceScreenState();
}

class _LetterTraceScreenState extends State<LetterTraceScreen> {
  final GlobalKey<TraceCanvasState> _traceKey = GlobalKey<TraceCanvasState>();
  String _message = '';
  bool _completed = false;
  bool _showRewardStar = false;

  void _clear() {
    _traceKey.currentState?.clear();
    setState(() {
      _message = '';
      _completed = false;
    });
  }

  void _done() {
    final ready = _traceKey.currentState?.hasEnoughTracing ?? false;
    if (!ready) {
      setState(() {
        _message = 'Try the dots first.';
      });
      return;
    }

    if (!_completed) {
      unawaited(widget.onEarnStar());
      setState(() {
        _showRewardStar = true;
      });
    }

    setState(() {
      _completed = true;
      _message = 'Great job!';
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          PageBackground(
            child: SafeArea(
              child: Center(
                child: ConstrainedBox(
                  constraints: const BoxConstraints(maxWidth: 760),
                  child: Padding(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 18,
                      vertical: 16,
                    ),
                    child: Column(
                      children: [
                        _TraceTopBar(
                          letter: widget.letter,
                          stars: widget.stars,
                          pulseToken: widget.starPulseToken,
                          onBack: widget.onBack,
                          onHome: widget.onHome,
                        ),
                        const SizedBox(height: 16),
                        Expanded(
                          child: _TracePanel(
                            traceKey: _traceKey,
                            letter: widget.letter,
                            message: _message,
                            completed: _completed,
                            onClear: _clear,
                            onDone: _done,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),
          if (_showRewardStar)
            RewardStarFlight(
              onComplete: () {
                if (!mounted) return;
                setState(() {
                  _showRewardStar = false;
                });
                widget.onTraceCompleted(widget.letter);
              },
            ),
        ],
      ),
    );
  }
}

class _TraceTopBar extends StatelessWidget {
  const _TraceTopBar({
    required this.letter,
    required this.stars,
    required this.pulseToken,
    required this.onBack,
    required this.onHome,
  });

  final String letter;
  final int stars;
  final int pulseToken;
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
            'Trace $letter',
            style: Theme.of(context).textTheme.headlineSmall?.copyWith(
              color: const Color(0xFF253B68),
              fontWeight: FontWeight.w900,
            ),
          ),
        ),
        StarCounter(stars: stars, pulseToken: pulseToken),
      ],
    );
  }
}

class _TracePanel extends StatelessWidget {
  const _TracePanel({
    required this.traceKey,
    required this.letter,
    required this.message,
    required this.completed,
    required this.onClear,
    required this.onDone,
  });

  final GlobalKey<TraceCanvasState> traceKey;
  final String letter;
  final String message;
  final bool completed;
  final VoidCallback onClear;
  final VoidCallback onDone;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(8),
        boxShadow: const [
          BoxShadow(
            color: Color(0x14253B68),
            blurRadius: 24,
            offset: Offset(0, 12),
          ),
        ],
      ),
      child: Column(
        children: [
          const Text(
            'Trace it. Tap Done.',
            style: TextStyle(
              color: Color(0xFF68758E),
              fontSize: 22,
              fontWeight: FontWeight.w900,
            ),
          ),
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 22, vertical: 10),
            decoration: BoxDecoration(
              color: const Color(0xFFE7F4FF),
              borderRadius: BorderRadius.circular(999),
            ),
            child: const Text(
              'Follow the dots',
              style: TextStyle(
                color: Color(0xFF253B68),
                fontSize: 20,
                fontWeight: FontWeight.w900,
              ),
            ),
          ),
          const SizedBox(height: 16),
          Expanded(
            child: TraceCanvas(key: traceKey, guide: letter),
          ),
          const SizedBox(height: 14),
          Row(
            children: [
              Expanded(
                child: OutlinedButton(
                  onPressed: onClear,
                  style: OutlinedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 18),
                    side: const BorderSide(color: Color(0xFFE5EAF4), width: 2),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                  child: const Text(
                    'Clear',
                    style: TextStyle(
                      color: Color(0xFF253B68),
                      fontSize: 20,
                      fontWeight: FontWeight.w900,
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: FilledButton(
                  onPressed: onDone,
                  style: FilledButton.styleFrom(
                    backgroundColor: const Color(0xFFFFD85A),
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 18),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                  child: const Text(
                    'Done!',
                    style: TextStyle(fontSize: 22, fontWeight: FontWeight.w900),
                  ),
                ),
              ),
            ],
          ),
          AnimatedContainer(
            duration: const Duration(milliseconds: 220),
            height: message.isEmpty ? 10 : 44,
            alignment: Alignment.center,
            child: Text(
              message,
              style: TextStyle(
                color: completed
                    ? const Color(0xFF2F7F45)
                    : const Color(0xFF9D486C),
                fontSize: 18,
                fontWeight: FontWeight.w900,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
