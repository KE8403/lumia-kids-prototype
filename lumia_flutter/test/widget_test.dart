import 'package:flutter_test/flutter_test.dart';
import 'package:lumia_flutter/app/lumia_app.dart';

void main() {
  testWidgets('shows splash then home screen', (tester) async {
    await tester.pumpWidget(const LumiaApp());

    expect(find.text('LumiA Kids'), findsOneWidget);
    expect(find.text('Start Learning'), findsOneWidget);

    await tester.tap(find.text('Start Learning'));
    await tester.pump(const Duration(milliseconds: 700));

    expect(find.text('ABC'), findsOneWidget);
    expect(find.text('123'), findsOneWidget);
    expect(find.text('Play'), findsOneWidget);
    expect(find.text('Parent'), findsOneWidget);

    await tester.tap(find.text('ABC'));
    await tester.pump(const Duration(milliseconds: 700));

    expect(find.text('A ɑ'), findsOneWidget);
    expect(find.text('B b'), findsOneWidget);

    await tester.tap(find.text('A ɑ'));
    await tester.pump(const Duration(milliseconds: 700));

    expect(find.text('Trace A'), findsOneWidget);
    expect(find.text('Follow the dots'), findsOneWidget);
    expect(find.text('Clear'), findsOneWidget);
    expect(find.text('Done!'), findsOneWidget);
  });
}
