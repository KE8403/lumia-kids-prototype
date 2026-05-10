import 'package:flutter/material.dart';

import '../screens/abc_screen.dart';
import '../screens/home_screen.dart';
import '../screens/letter_trace_screen.dart';
import '../screens/splash_screen.dart';

enum LumiaScreen { splash, home, abc, letterTrace }

class LumiaApp extends StatefulWidget {
  const LumiaApp({super.key});

  @override
  State<LumiaApp> createState() => _LumiaAppState();
}

class _LumiaAppState extends State<LumiaApp> {
  LumiaScreen _screen = LumiaScreen.splash;
  int _stars = 0;
  int _starPulseToken = 0;
  String _selectedLetter = 'A';

  void _showHome() {
    setState(() {
      _screen = LumiaScreen.home;
    });
  }

  void _showAbc() {
    setState(() {
      _screen = LumiaScreen.abc;
    });
  }

  void _showLetterTrace(String letter) {
    setState(() {
      _selectedLetter = letter;
      _screen = LumiaScreen.letterTrace;
    });
  }

  void _earnStar() {
    setState(() {
      _stars += 1;
      _starPulseToken += 1;
    });
  }

  Widget _buildScreen() {
    return switch (_screen) {
      LumiaScreen.splash => SplashScreen(
        key: const ValueKey('splash'),
        onStart: _showHome,
      ),
      LumiaScreen.home => HomeScreen(
        key: const ValueKey('home'),
        stars: _stars,
        starPulseToken: _starPulseToken,
        onAbc: _showAbc,
        onPreviewStar: _earnStar,
      ),
      LumiaScreen.abc => AbcScreen(
        key: const ValueKey('abc'),
        stars: _stars,
        starPulseToken: _starPulseToken,
        onBack: _showHome,
        onHome: _showHome,
        onLetter: _showLetterTrace,
      ),
      LumiaScreen.letterTrace => LetterTraceScreen(
        key: ValueKey('letter-$_selectedLetter'),
        letter: _selectedLetter,
        stars: _stars,
        starPulseToken: _starPulseToken,
        onBack: _showAbc,
        onHome: _showHome,
        onEarnStar: _earnStar,
      ),
    };
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'LumiA Kids',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        fontFamily: 'Arial',
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF4F8FF7),
          primary: const Color(0xFF4F8FF7),
          secondary: const Color(0xFFFFD85A),
          surface: const Color(0xFFFFFBEE),
        ),
        scaffoldBackgroundColor: const Color(0xFFFFFBEE),
      ),
      home: AnimatedSwitcher(
        duration: const Duration(milliseconds: 520),
        switchInCurve: Curves.easeOutCubic,
        switchOutCurve: Curves.easeInCubic,
        child: _buildScreen(),
      ),
    );
  }
}
