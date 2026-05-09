# LumiA Kids Flutter Handover

This web prototype is the source of truth for the Flutter rebuild. The goal is to recreate the same calm toddler learning experience, not redesign the product during the first Flutter pass.

## Current Prototype

- Entry point: `index.html`
- App logic: `app.js`
- Visual system: `styles.css`
- Local preview: `node server.mjs`, then open `http://127.0.0.1:8765/index.html`

## Product Direction

LumiA Kids is an offline-first early learning app for children around age 2-3. The tone should stay calm, cheerful, soft, and simple. Animations should be slow and friendly, not fast or overstimulating.

Core learning modes:

- ABC tracing
- Number tracing
- Uppercase/lowercase matching
- Parent-only settings area

## Screens To Rebuild

1. Splash
   - Shows LumiA Kids branding.
   - Shows the star mascot family: one bigger elder-sister star and three smaller stars.
   - Has a single "Start Learning" action.

2. Home
   - Shows the mascot family.
   - Shows the memorable `ABC Trace & Count` badge.
   - Shows the star counter.
   - Main actions: ABC, 123, Play, Parent.

3. ABC Grid
   - Shows A-Z.
   - Each tile shows uppercase plus child-friendly lowercase.
   - Lowercase `a` should display as `ɑ`.

4. Letter Trace
   - Shows selected letter.
   - Lets child switch uppercase/lowercase for the chosen letter.
   - Shows star counter.
   - Shows tracing panel with solid outline and dotted tracing path.
   - Uses short text: `Trace it. Tap Done.`
   - Uses prompt: `Follow the dots`
   - Clear resets current trace.
   - Done only completes after enough tracing coverage.

5. Numbers Grid
   - Shows 1-20.

6. Number Trace
   - Same tracing rules as letters.
   - Numbers 0-9 use custom worksheet tracing paths.
   - Numbers 10-20 can be composed from digit paths.

7. Play Matching
   - Uses 2-letter groups only.
   - Helper text: `Tap a big letter. Tap its small letter.`
   - Child taps uppercase, then lowercase.
   - Correct: earn star, celebrate, mark pair done.
   - Wrong: show `Oops, try again.` with gentle styling and soft sound.

8. Parent Gate
   - Parent-only math gate.
   - Current gate is `8 + 5 = ?`, correct answer `13`.

9. Parent Area
   - Sound toggle.
   - Music toggle.
   - Reset stars/progress.
   - Privacy text: offline only, no ads, no child data.

## Learning Rules

- Tracing should reward effort but not complete immediately.
- If child taps Done too early, show: `Try the dots first.`
- Completion requires a minimum amount of tracing coverage.
- Sparkles should appear only when tracing near the guide path.
- After a completed trace:
  - earn one star
  - show the reward star animation
  - speak/play success if sound is on
  - auto-advance to the next tracing task
- Letter auto-advance:
  - uppercase A -> lowercase ɑ -> uppercase B -> lowercase b
  - continue through Z/z
- Number auto-advance:
  - 1 -> 2 -> 3 through 20, then loop.

## Star Reward Behavior

This is important for the Flutter version.

- A star is earned for:
  - completing a trace task
  - making a correct match in Play
- Star count persists locally.
- When a star is earned:
  - show a large cheerful smiling star
  - text says `You got stars!`
  - keep it large briefly
  - slowly shrink and glide toward the star counter, like returning home
  - show small trailing stars behind it
  - counter reacts with a sparkle when the star arrives
- Motion should be slow, smooth, and calm.

## Visual Rules

- Keep the palette soft and bright.
- Avoid sharp, aggressive animation.
- Preserve the star mascot family concept.
- Keep the tracing canvas warm cream with navy guide outlines/dots.
- Keep tap targets large.
- Prefer short labels and voice/audio cues over long text.
- The UI should work for phones and tablets.

## Important Prototype Functions

Use these functions in `app.js` as the behavioral reference:

- `renderSplash()`
- `renderHome()`
- `renderAbc()`
- `renderLetter()`
- `renderNumbers()`
- `renderNumber()`
- `renderPlay()`
- `renderParentGate()`
- `renderParentArea()`
- `tracePanel(character)`
- `setupCanvas(canvas)`
- `completeTraceTask()`
- `checkMatch()`
- `showCelebration()`
- `starBadge()`
- `earnStar()`
- `resetStars()`

## Tracing Guide Reference

The web prototype currently uses custom worksheet paths instead of raw font outlines. This is the preferred direction for Flutter too.

Flutter should implement tracing guides as custom painter paths:

- draw a solid outer outline
- draw an inner dotted trace path
- use the same path area for hit/coverage detection
- support custom paths for uppercase letters, lowercase letters, and digits

Do not rely only on a font outline for the final tracing experience. The custom worksheet paths are clearer for toddlers.

## Suggested Flutter Structure

Start simple and keep files readable:

- `lib/main.dart`
- `lib/app/lumia_app.dart`
- `lib/state/app_state.dart`
- `lib/screens/splash_screen.dart`
- `lib/screens/home_screen.dart`
- `lib/screens/abc_screen.dart`
- `lib/screens/letter_trace_screen.dart`
- `lib/screens/numbers_screen.dart`
- `lib/screens/number_trace_screen.dart`
- `lib/screens/play_screen.dart`
- `lib/screens/parent_gate_screen.dart`
- `lib/screens/parent_area_screen.dart`
- `lib/widgets/star_family.dart`
- `lib/widgets/star_counter.dart`
- `lib/widgets/reward_star_flight.dart`
- `lib/widgets/learning_badge.dart`
- `lib/widgets/trace_canvas.dart`
- `lib/tracing/tracing_paths.dart`
- `lib/tracing/tracing_controller.dart`
- `lib/audio/audio_controller.dart`

## Build Order

1. Create Flutter app shell and theme.
2. Build Splash and Home.
3. Build star mascot family and learning badge.
4. Build persistent star counter.
5. Build tracing canvas with one letter first: uppercase A.
6. Add coverage detection, Done/Clear, and "Try the dots first."
7. Add star reward flight animation.
8. Add all uppercase letters.
9. Add lowercase letters.
10. Add numbers 1-20.
11. Add Play matching.
12. Add Parent Gate and Parent Area.
13. Do tablet/phone QA.

## Acceptance Checklist Before Shipping Flutter Prototype

- App opens on phone and tablet layouts.
- All main screens are reachable.
- Tracing A/ɑ and at least several other letters feels clear.
- Numbers 1-20 trace correctly.
- Play uses 2-pair rounds.
- Stars persist after app restart.
- Reset stars works.
- Sound toggle works.
- Reward animation is slow and smooth.
- No ads, accounts, or child data collection.

