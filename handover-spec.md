# LumiA Kids: ABC Trace & Count

## Product Direction

LumiA Kids is a children learning brand inspired by Atiff, Aesha, and Ali. The first app is **LumiA Kids: ABC Trace & Count**, an offline educational game for children ages 2-3.

The app teaches early literacy and numbers through simple, cheerful activities:

- Learn uppercase and lowercase letters side by side.
- Trace uppercase and lowercase letters.
- Learn numbers 1-20.
- Trace numbers 1-20.
- Play a simple uppercase-to-lowercase matching game.

## Confirmed Decisions

- Category: Educational game.
- Brand: LumiA Kids.
- First app title: ABC Trace & Count.
- Target age: 2-3 years old.
- Platform: Flutter, Android first for Google Play.
- Prototype format: Clickable web prototype before Flutter build.
- Visual style: Bright, soft, playful classroom style.
- Mascot: Three star mascots representing Atiff, Aesha, and Ali.
- Mascot personalities:
  - Blue Star: curious and calm.
  - Pink/Coral Star: cheerful and encouraging.
  - Yellow Star: playful and excited.
- Logo direction: LumiA Kids wordmark with three star mascots.
- App icon direction: Three smiling stars around a big letter A.
- Audio language: English only for version 1.
- Rewards: Stars plus cheerful feedback sound.
- Monetization: Paid app at RM1.00 in Malaysia, no ads, no in-app purchases.
- Data model: Simple local progress only.
- Connectivity: Fully offline.
- Parent area: Protected by a simple math question.

## Version 1 Scope

### Main Menu

- ABC
- 123
- Play
- Parent

### Screens

1. Splash / Logo
2. Home
3. ABC List
4. Letter Detail / Trace
5. 123 List
6. Number Detail / Trace
7. Play Matching
8. Parent Gate
9. Parent Area

### ABC Flow

The ABC screen shows uppercase and lowercase together:

- A a
- B b
- C c
- ...
- Z z

The letter detail screen lets kids:

- Hear the letter.
- Choose uppercase or lowercase tracing.
- Trace using guided free-trace.
- Receive a star reward.

### Number Flow

The number screen shows numbers 1-20.

The number detail screen lets kids:

- Hear the number.
- Trace using guided free-trace.
- Receive a star reward.

### Play Flow

Version 1 includes one play activity:

- Match uppercase letters to lowercase letters.

Example:

- Match A with a.
- Match B with b.

## Safety And Privacy

Version 1 should avoid:

- Ads.
- In-app purchases.
- User accounts.
- Child profile names.
- Cloud sync.
- Location.
- Camera.
- Microphone.
- Open chat.
- User-generated public content.
- External links accessible without a parent gate.

The app should store only local progress and settings on the device.

## Prototype Notes

The clickable web prototype is not the production app. It exists to confirm:

- Brand feel.
- Screen flow.
- Layout.
- Star mascot direction.
- Tracing interaction feel.
- Matching game direction.
- Parent gate direction.

After the prototype is approved, the next step is to build the Flutter MVP.

## Latest Prototype Interaction Decisions

- Tracing should be forgiving and playful for ages 2-3.
- The child should be able to trace outside the line or draw an approximate letter shape.
- Keep a Done button so the child or parent can decide when the tracing attempt is finished.
- If the child traces enough of the shape correctly/actively, the app can auto-complete and move to the next task.
- After tapping Done, the app should play a cheerful success sound and voice.
- Auto-complete should wait until the tracing looks reasonably finished, not just because the child scribbled a short distance.
- Completion should include a toddler-friendly celebration lasting a few seconds so parents and kids have time to clap and enjoy the achievement.
- Celebration direction: warmer voice such as `Hooray! Great job`, fuller slower confetti, and a harmonious genuine applause sound, like a small award-giving moment.
- Production audio should use separate bundled voice assets for letter names, softer lowercase delivery, and celebration phrases rather than relying on one device TTS voice.
- Background music can be included, but it must be very light, gentle, looped, and easy for parents to turn off.
- The app should automatically advance to the next task:
  - Letter flow: A, a, B, b, C, c.
  - Number flow: 1, 2, 3 through 20.
- Voice direction: smooth, cheerful female English voice.
- For production, use bundled voice/audio assets for consistency instead of depending only on device text-to-speech.
- Important audio requirement for Flutter: lowercase should use a softer pronunciation/delivery, not simply lower volume. Keep volume clear and audible, but record or generate a gentler voice take for lowercase letters.
- Letter pronunciation must be clearer than the current browser text-to-speech prototype. Use proper bundled voice assets before release.
