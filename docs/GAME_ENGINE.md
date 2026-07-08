# GAME_ENGINE.md — Shared Game Engine Design

## Why a shared engine

Today `BirdSpikeGame.tsx` and `SnackCatchGame.tsx` are fully independent:
each hand-rolls its own `requestAnimationFrame` loop, Web Audio tone synth,
canvas DPR scaling, exit/intro chrome, and difficulty ramp. That was fine at
two games; it will not scale to ten. The shared engine's job is to extract
the parts that are identical in spirit across every canvas-based reaction
game, while leaving each game's actual gameplay (what's drawn, what counts
as a hit, what the win condition is) entirely to the game itself.

**The engine is not a game framework you code gameplay against (no
Phaser/PixiJS-style scene graph).** It's a small set of hooks and utilities
a game opts into individually. A game can use all of them, some of them, or
(temporarily, for a quick prototype) none — but anything reusable that a
second game needs must live here, not be copy-pasted.

## Core pieces (`app/lib/engine/`)

### `types.ts`
The shared vocabulary every other engine file and every game speaks:

```ts
export type CognitiveDomain =
  | "visual-attention" | "sustained-attention" | "selective-attention"
  | "cognitive-flexibility" | "working-memory" | "inhibition-control"
  | "time-management" | "auditory-attention";
  // Must stay in lockstep with ClanCat.domain values in app/lib/data.ts

export type GameConfig = {
  id: string;                 // kebab-case, matches folder name & registry key
  title: string;
  domain: CognitiveDomain;
  minAgeMonths?: number;      // optional finer-grained age gating within 8–15
  difficulty: DifficultyCurveParams;   // see GAME_DIFFICULTY.md
  estimatedMins: number;      // shown in project picker
};

export type GameStatus = "idle" | "intro" | "playing" | "paused" | "gameover" | "results";

export type GameResult = {
  gameId: string;
  score: number;
  durationMs: number;
  outcome: "cleared" | "failed" | "quit";
  difficultyLevelReached: number;
  timestamp: number;          // epoch ms, injected by caller (not Date.now() inside engine code paths that must stay resumable/testable)
};
```

### `useGameLoop.ts`
A single `requestAnimationFrame` hook wrapping the pattern both existing
games already use by hand: schedule/cancel the frame, pass `deltaMs` to a
callback, and mutate refs rather than triggering React re-renders per frame.

```ts
useGameLoop((deltaMs: number) => { /* update refs, draw */ }, { running: boolean });
```

Rule: **state that changes every frame (position, velocity, spawn timers)
lives in refs, never in `useState`.** Only cross into React state for things
the UI actually needs to re-render for (score display, game-over screen).
This is already how both existing games behave — the hook just names and
centralizes the pattern instead of each game reimplementing the RAF
bookkeeping.

### `useCanvas.ts`
Handles devicePixelRatio-aware canvas sizing/resize so every game gets crisp
rendering on mobile without repeating the DPR math. Returns a ref to attach
to `<canvas>` plus the logical (CSS-pixel) width/height to draw against.

### `audio.ts`
The Web Audio tone-synthesis helpers currently duplicated between the two
games (oscillator + gain envelope "beep" style SFX, no audio asset files).
Exposes small named functions like `playTone(freq, durationMs, type)` and a
couple of semantic presets (`playHit()`, `playSuccess()`, `playFail()`) so
games get consistent-*feeling* audio without each one tuning envelopes from
scratch. A shared `AudioContext` singleton, lazily created on first user
gesture (required by browser autoplay policy), lives here.

### `difficulty.ts`
The shared adaptive difficulty engine. Full behavioral spec is in
`GAME_DIFFICULTY.md`; this file is the implementation surface: given a
`DifficultyCurveParams` and either an elapsed-score or elapsed-time input,
returns the current difficulty level and derived tuning values a game maps
onto its own mechanics (speed multiplier, gap size, spawn rate — the mapping
from "difficulty level" to "game-specific numbers" stays in each game's
`config.ts`, not in the engine).

### `analytics.ts`
Thin wrapper around whatever telemetry backend is wired up (see
`GAME_ANALYTICS.md` — currently none; this module is the seam where one
plugs in later without touching game code). Games call semantic functions
(`trackGameStarted(gameId)`, `trackGameCompleted(result: GameResult)`,
`trackDifficultyAdjusted(...)`), never a raw analytics SDK.

### `storage.ts`
Namespaced, versioned `localStorage` helpers (`getGameState(gameId)`,
`setGameState(gameId, data)`) so every game doesn't invent its own key
convention the way `birdspike-best` and `bugsy-snack-scores` currently do
independently. New games should use this instead of calling
`localStorage` directly.

## `GameShell.tsx` (`app/components/games/`)

The one JSX piece of shared infrastructure: renders the chrome that should
look and behave identically across every game —

- Exit button (top corner, consistent placement/size across games)
- Intro speech bubble (Bugsy typewriter-style greeting before play starts)
- Pause overlay
- Results screen (score, XP/points earned, "play again" / "back to home")

A game's own component renders *inside* `GameShell`, focused purely on its
play-area canvas and mechanics. `GameShell` owns `GameStatus` transitions
(`idle → intro → playing → paused ⇄ playing → gameover → results`) and
exposes them via props/callbacks; individual games don't reinvent their own
exit/results UI.

## What stays per-game (never promoted to the engine)

- The actual draw calls / sprite logic for that game's world.
- Hit-detection / win-condition logic specific to that game's mechanics.
- The mapping from abstract "difficulty level" to concrete tuning numbers
  (a bird game maps difficulty to gap size + fall speed; a memory game would
  map it to sequence length — these mappings are inherently game-specific).
- Game-specific copy/mascot lines beyond the shared intro/results templates.

## Adding a new engine capability

If a third game needs something the first two didn't (e.g. multi-touch
gesture tracking, a shared particle-effect system), add it to
`app/lib/engine/` following the existing file-per-concern pattern, document
it in this file in the same change, and prefer extending an existing hook
over adding a parallel one that does something 80% similar.
