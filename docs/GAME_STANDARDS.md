# GAME_STANDARDS.md — Coding Standards for Game Code

Applies to everything under `app/games/` and `app/lib/engine/`. General repo
conventions are in `AGENTS.md`; this file covers what's specific to
performance-sensitive game code.

## TypeScript

- `strict` mode, no `any`, no non-null assertions (`!`) except where a value
  is genuinely guaranteed by control flow immediately above it (and even
  then prefer a narrowing check).
- Every game exports a `GameConfig` (see `GAME_ENGINE.md`) from `config.ts` —
  don't inline config values as magic numbers inside the component.
- Discriminated unions for game state (`GameStatus`), not booleans
  (`isPlaying`, `isPaused`, `isOver` as separate flags invite impossible
  states). Both existing games already lean this way; keep doing it.

## Performance rules (non-negotiable for anything inside the RAF loop)

These exist because both current games already had to hand-solve them, and
getting them wrong is the single biggest source of janky, battery-draining
mobile gameplay:

1. **Never call `useState`/`setState` inside a `requestAnimationFrame`
   callback for anything that changes every frame** (position, velocity,
   timers, particle lists). Use `useRef` and mutate directly. Reserve React
   state for values the UI needs to re-render on a human timescale (score
   shown in a HUD, game-over transition).
2. **Draw imperatively.** Canvas drawing is plain `ctx.fillRect`/`ctx.arc`/etc
   calls inside the loop callback, not JSX-driven. Don't introduce a
   React-driven per-object rendering approach (mapping game entities to DOM
   nodes) for anything that moves continuously — it will not hit 60fps on
   mid-range mobile devices.
3. **Scale for devicePixelRatio once, at resize time**, not per frame — use
   `useCanvas.ts` (`GAME_ENGINE.md`) rather than recomputing DPR math inline.
4. **Cancel the RAF loop on unmount and on pause.** A leaked loop from an
   exited game is a real battery/perf bug, not a theoretical one.
5. **Avoid allocations inside the hot loop** where reasonably possible
   (don't create new arrays/objects every frame for things that can be
   reused/mutated in place — e.g. a pooled array of active obstacles rather
   than `.filter()`-ing a new array 60 times a second).
6. **Audio must be triggered from a real user gesture at least once** before
   any programmatic `AudioContext` use, per browser autoplay policy — the
   shared `audio.ts` singleton handles this; don't create a second
   `AudioContext` in a game file.

## Structure of a game component

- One default-exported component per game, named `<Name>Game`, in its own
  folder per `GAME_FOLDER_STRUCTURE.md`.
- Props in, callbacks out — a game should not reach into global app state or
  `app/lib/data.ts` directly for anything beyond its own `GameConfig`. Score
  reporting, XP awarding, and exit happen via callback props
  (`onComplete(result: GameResult)`, `onExit()`), mirroring the existing
  `onEarnXp` pattern in `SnackCatchGame.tsx`. This keeps games swappable/
  testable in isolation and keeps `GameShell` (not the game) responsible for
  chrome and navigation.
- A game owns: its canvas draw logic, its entity/physics update logic, its
  hit-detection/win-condition logic, and the mapping from abstract
  difficulty level to its own concrete tuning numbers.
- A game does not own: RAF scheduling mechanics, canvas DPR setup, audio
  context creation, exit/pause/results chrome, or analytics event
  transmission — all of those come from the engine/shell.

## Styling

- Match existing convention: Tailwind utility classes for static layout,
  inline `style={{}}` for computed/dynamic values (positions, colors driven
  by game state). Don't introduce CSS Modules or styled-components as a
  third styling system.
- Game canvases render at a fixed logical aspect ratio; UI chrome around them
  (`GameShell`) is responsive. Don't hardcode pixel values that assume a
  specific device width beyond the shared ~390×844 mobile-first baseline
  documented in `GAME_UI_GUIDELINES.md`.

## Error handling

- Canvas/`AudioContext` acquisition failures (rare, but possible on some
  embedded webviews) should degrade gracefully — a game should still be
  playable without sound rather than crashing if `AudioContext` creation
  throws. Don't add speculative error handling beyond real failure modes
  like this one; don't wrap every function in try/catch defensively.

## Testing expectations

No automated game-logic test suite exists yet (see `AGENTS.md`). Until one
does:

- Manually verify a new/changed game at the ~390×844 mobile viewport (the
  existing `snap*.js` scripts are the closest thing to a visual check
  available — extend that pattern rather than inventing a new one).
- If you add pure, non-canvas logic (difficulty math, score calculation),
  prefer writing it as a plain testable function in `config.ts` or
  `lib/engine/difficulty.ts` rather than inline in the component, so it *can*
  be unit tested once a test runner exists, even if it isn't tested today.

## Naming

- `GameConfig.id`: kebab-case, stable forever once shipped (it's used as a
  `localStorage` namespace key and an analytics dimension — renaming it
  orphans historical data).
- Difficulty/tuning constants: named, not magic numbers, and centralized in
  `config.ts` (`GRACE_ROUNDS`, `MAX_SPEED_MULTIPLIER`, etc.) rather than
  scattered through the draw/update functions.
