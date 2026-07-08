# GAME_UI_GUIDELINES.md — UI/UX Guidelines for Games

Audience reminder from `AI_RULES.md`: players are children roughly 8–15,
usually on a phone, often with a parent nearby. Every guideline below
optimizes for that, not for a general-purpose design system.

## Bugsy (the mascot) is a constant presence, not a decoration

- Bugsy frames every game: an intro line before play starts (typewriter
  effect, matching `Typewriter.tsx`) and a reaction line at results.
- Bugsy's reaction to outcomes is **always warm**. Bad rounds get gentle
  encouragement ("Almost! Let's try again 🐾"), never mockery, never a
  "you failed" framing. Bugsy's `angry`/`worried` moods (defined in
  `app/lib/data.ts`) are reserved for the *care-meter neglect* storyline
  (Bugsy hasn't been fed/played with), never for the child's in-game
  performance — conflating "you lost" with "Bugsy is upset at you" is
  exactly the shaming pattern `AI_RULES.md` prohibits.
- New games should reuse the existing `Mascot.tsx` component and `Mood`
  vocabulary rather than drawing a bespoke mascot state.

## Color

- Base palette uses OKLCH color space already (`app/lib/data.ts`:
  `CATEGORIES`, `ACCENT_HUE`/`ACCENT_CHROMA`). New game-specific colors
  should be defined in OKLCH for consistent perceptual lightness/chroma
  across hues, not ad-hoc hex values.
- Category colors are fixed and meaningful: educational ≈ blue
  (`oklch(72% 0.15 235)`), creative ≈ orange/red (`oklch(72% 0.17 30)`),
  physical ≈ green (`oklch(72% 0.15 145)`). A game's dominant UI accent
  should match its `Project.category`, so the color language a child learns
  in the home screen carries into the game itself.
- Each `ClanCat` cognitive domain has its own hue (`tint` field in
  `app/lib/data.ts`) — where a game surfaces its domain (e.g. a badge or
  results-screen tag), use that domain's existing tint rather than picking a
  new color.
- Maintain WCAG AA contrast (4.5:1 for text) even though the primary
  audience is children, not because of a compliance checkbox but because
  low-vision/glare-on-phone-outdoors is a real everyday condition for this
  audience.

## Typography & copy tone

- Short, second-person, present-tense copy ("Tap to flap", "Catch the
  snacks!") — no instructional paragraphs. A child should never need to
  read more than one short line to know what to do.
- Numbers (score, XP, streaks) are always large and legible — these are the
  dopamine payoff of the interaction, don't bury them in small text.
- Avoid competitive/comparative language inside a game itself ("you're
  losing," "behind Riya"). Comparative/leaderboard framing belongs in the
  clan/leaderboard screens (`CareScreens.tsx`/leaderboard tab), which are
  opt-in and unlocked later (`CLAN_UNLOCK_THRESHOLD`) — not inside the
  moment-to-moment game loop.

## Motion

- `framer-motion` for UI chrome transitions (screen entrances, results
  reveal, XP counters ticking up) — it's already a dependency, use it rather
  than hand-rolling CSS transitions for anything outside the canvas.
- The canvas game world itself is *not* driven by framer-motion — it's
  imperative RAF-driven per `GAME_ENGINE.md`. Don't mix the two rendering
  models inside one game's play area.
- Respect `prefers-reduced-motion` for chrome-level animation (screen
  transitions, XP tick-up) by shortening/removing non-essential motion; the
  core gameplay loop itself (a reaction game inherently involves motion) is
  exempt since removing it would remove the game.

## Layout & touch targets

- Mobile-first at a ~390×844 baseline viewport (matches existing
  `viewportFit: cover`, `userScalable: false` config) — design for a single
  thumb held phone, not desktop mouse precision.
- Minimum touch target 44×44 CSS px for any tappable game control (exit
  button, pause, results CTAs) — canvas-internal tap zones for gameplay
  itself can be tuned per game's mechanics but should stay generous for
  young/imprecise motor control.
- `GameShell`'s exit button is always top-corner, always the same corner,
  across every game — a child should never have to relearn "where's the way
  out" per game.

## Feedback loops

- Every scoring action gets immediate audio + visual feedback (the existing
  Web Audio tone-synth "beep" pattern) — silence after a successful action
  reads as "did that count?" to a young player.
- Positive reinforcement is layered: in-round feedback (tone/particle) →
  round summary (score) → meta-progression (XP/coins toward the next
  `CAT_BADGES` tier or `HATS` unlock) — a new game should hook into the
  existing XP/coins economy (`onEarnXp`-style callback) rather than invent a
  parallel currency.

## Accessibility minimums

- Every game must be playable with sound off (visual feedback must never be
  audio-only) — many play sessions happen in quiet rooms/school settings.
- Text/icon pairing for anything conveying state (don't rely on color alone
  to distinguish, e.g., a "good" vs "miss" hit — color-blind players are a
  real fraction of any large enough child audience).
- Respect the existing voice/TTS provider (`app/lib/voice.tsx`) conventions
  if a game surfaces readable instructional text, rather than introducing a
  second speech mechanism.

## Consistency checklist for a new game's UI

- [ ] Uses `GameShell` for intro/exit/pause/results chrome
- [ ] Bugsy intro + results lines present, tone matches guidelines above
- [ ] Accent color matches the game's `Project.category`
- [ ] Domain tag (if shown) uses that `ClanCat`'s existing tint
- [ ] All tappable chrome ≥44×44px
- [ ] Playable with sound muted
- [ ] No comparative/shaming language in-game
