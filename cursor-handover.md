# Cursor Handover: LumiA Kids

## Project

**Brand:** LumiA Kids  
**First app:** LumiA Kids: ABC Trace & Count  
**Target users:** Children ages 2-3  
**Target platform:** Android first, Google Play later  
**Final build direction:** Flutter  
**Current artifact:** Clickable web prototype

## Current Files

- `index.html` - Prototype entry point.
- `styles.css` - Prototype UI styling.
- `app.js` - Prototype interaction logic.
- `handover-spec.md` - Product decisions and scope.
- `cursor-handover.md` - This handover note.

Open `index.html` in a browser to review the current prototype.

## Confirmed Product Decisions

- Educational game app.
- Brand name: LumiA Kids.
- App title: ABC Trace & Count.
- Version 1 includes:
  - Learn ABC.
  - Trace uppercase letters A-Z.
  - Trace lowercase letters a-z.
  - Learn numbers 1-20.
  - Trace numbers 1-20.
  - Play matching game: uppercase to lowercase.
- Uppercase and lowercase are shown side by side, such as `A a`.
- Visual style: bright, soft, playful classroom style.
- Mascot: 3 smiling star mascots.
- Star personalities:
  - Blue star: curious and calm.
  - Pink/coral star: cheerful and encouraging.
  - Yellow star: playful and excited.
- App icon direction: 3 smiling stars around a big letter `A`.
- Audio: English only for version 1.
- Reward system: stars plus cheerful sound.
- Monetization: paid app around RM1.00 in Malaysia.
- No ads.
- No in-app purchases.
- Fully offline.
- Local progress only.
- No login, no child name, no cloud sync.
- Parent area protected by a simple math question.

## Current Prototype Behavior

The prototype currently supports:

- Splash screen.
- Home screen with `ABC`, `123`, `Play`, and `Parent`.
- ABC list with A-Z and lowercase side by side.
- Letter tracing screen.
- Number list 1-20.
- Number tracing screen.
- Matching game screen.
- Parent gate with math question.
- Parent area with sound/music/reset/privacy placeholders.

Tracing behavior:

- The child traces over a dotted guide on a canvas.
- Tracing is forgiving and playful.
- The child can draw inside or outside the guide and still finish.
- A manual Done button completes the attempt.
- If the child traces enough of the guide actively/correctly, the attempt can auto-complete.
- A success tone and spoken `Great job` play after Done.
- Auto-complete should be based on guide coverage and active tracing time, not just total finger movement.
- Completion should last a few seconds so parents and kids have time to clap and enjoy the achievement.
- Celebration direction: warmer voice such as `Hooray! Great job`, fuller slower confetti, and a harmonious genuine applause sound, like a small award-giving moment.
- Production audio should use separate bundled voice assets for letter names, softer lowercase delivery, and celebration phrases rather than relying on one device TTS voice.
- The prototype then auto-advances:
  - Letter flow: `A -> a -> B -> b`.
  - Number flow: `1 -> 2 -> 3`, up to 20, then loops.

Matching behavior:

- Correct matches play a success sound.
- After the current set is completed, the prototype auto-moves to the next set.

Voice behavior:

- Uses browser speech synthesis.
- Tries to choose a smooth English female-style voice when available.
- Actual voice depends on installed browser/system voices.

## Recommended Flutter MVP Structure

Suggested folders:

```text
lib/
  main.dart
  app.dart
  theme/
    lumia_theme.dart
  models/
    learning_item.dart
    progress_state.dart
  screens/
    splash_screen.dart
    home_screen.dart
    abc_screen.dart
    letter_detail_screen.dart
    numbers_screen.dart
    number_detail_screen.dart
    play_matching_screen.dart
    parent_gate_screen.dart
    parent_area_screen.dart
  widgets/
    star_mascots.dart
    big_menu_button.dart
    trace_canvas.dart
    reward_overlay.dart
  services/
    audio_service.dart
    progress_service.dart
```

## Flutter Implementation Notes

- Use Flutter for the final Android app.
- Keep the app offline.
- Store progress locally only, likely using `shared_preferences` or a simple local store.
- Use custom drawing for tracing:
  - Display a large dotted guide character.
  - Track finger movement with `GestureDetector`.
  - Let the child draw freely, complete with a Done button, and optionally auto-complete when enough tracing is detected.
- Version 1 tracing should stay friendly, not strict:
  - No stroke order scoring required.
  - No harsh failure state.
  - Encourage completion with stars.
  - Accept approximate attempts because the target age is 2-3.
- Audio should use bundled assets for production:
  - Letter sounds.
  - Number sounds.
  - Success chime.
  - Gentle try-again sound.
  - Cheerful female voice clips, preferably recorded or generated consistently.
- Avoid relying on device TTS in production if a consistent child-friendly voice is important.
- Important: lowercase letters should not just be lower volume. They should use a softer, gentler pronunciation while staying clear and audible.
- Use recorded or generated bundled audio for production because browser/device TTS can pronounce letters unclearly or say things like `capital A`.

## Immediate Next Steps In Cursor

1. Review `handover-spec.md`.
2. Review the web prototype in `index.html`.
3. Create a Flutter project for `LumiA Kids: ABC Trace & Count`.
4. Rebuild the screens from the prototype in Flutter.
5. Implement local navigation and tracing behavior.
6. Add placeholder audio first.
7. Add persistent local progress.
8. Test on Android emulator/device.

## Important Policy Direction

Design the final app as a child-safe paid app:

- No ads.
- No external links outside the parent area.
- No analytics unless truly needed and child-safe.
- No personal data collection.
- No account system.
- No online content.
