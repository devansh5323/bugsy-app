# GAME_DIFFICULTY.md — Adaptive Difficulty Rules

## Current state

Both existing games already implement a difficulty ramp, independently and
slightly differently:

- `BirdSpikeGame.tsx`: `difficultyAt(score)` — a **score-driven** linear
  interpolation of gap size/speed/spacing, with a grace period for the first
  ~5 points before ramping toward a max at ~25.
- `SnackCatchGame.tsx`: a **time-driven** ramp (`RAMP_MS = 30000`,
  `speedMul = 0.55 + ramp*0.9`) — difficulty increases with elapsed session
  time regardless of performance.

Neither currently adapts to how well the *specific child* is doing beyond
that single in-session curve, and neither persists difficulty calibration
across sessions. This document defines the shared model both should
eventually sit on top of (`lib/engine/difficulty.ts` in `GAME_ENGINE.md`),
and the safety rails that make it appropriate for this age group.

## Why this matters more than typical game-difficulty tuning

The product's stated purpose is cognitive training, not just entertainment.
Difficulty that's miscalibrated doesn't just feel bad — it undermines the
training value: too easy produces no cognitive load and no improvement, too
hard produces frustration and disengagement before enough reps accumulate.
Age 8–15 spans a huge range of motor/processing-speed maturity, so a single
static curve tuned for a 12-year-old will be wrong for both an 8- and a
15-year-old.

## Model

### Two layers of adaptation

1. **In-session ramp** (what both games already have): difficulty rises as
   the round progresses, driven by score and/or elapsed time. This is the
   short-term challenge curve within one sitting.
2. **Cross-session calibration** (not yet built — `GAME_ROADMAP.md` Phase 3):
   a persisted per-game, per-device starting difficulty that shifts slowly
   based on aggregate past performance, so a child who consistently clears a
   game easily starts future sessions a bit harder, and one who consistently
   struggles starts a bit easier. Persisted via `lib/engine/storage.ts`
   (`GAME_ROADMAP.md`/`GAME_ENGINE.md`), not a backend.

### `DifficultyCurveParams` (config-level, per game)

```ts
type DifficultyCurveParams = {
  driver: "score" | "time";      // what advances the ramp
  graceUnits: number;            // rounds/ms before ramp begins at all
  rampToMaxUnits: number;        // rounds/ms until max difficulty reached
  startLevel: number;            // 0..1, overridable by cross-session calibration
  maxLevel: number;              // usually 1.0
  rubberBandFloor: number;       // see below — the level a bad run can't drop below within a session
};
```

A game's `config.ts` supplies these; `lib/engine/difficulty.ts` turns
`(params, currentUnits)` into a normalized `level: number` (0..1); the game
itself maps that normalized level onto its own concrete numbers (gap size,
fall speed, sequence length — whatever is game-specific, per
`GAME_STANDARDS.md`).

### Grace period

Every game must have a genuine no-fail or low-stakes opening (`graceUnits`)
before ramping starts — this matches `BirdSpikeGame`'s existing 0–5 grace
window. The point is to let a player get oriented to the *controls* before
the *challenge* begins; conflating the two punishes a child for not yet
knowing how to tap, not for lacking the cognitive skill being trained.

### Rubber-banding (frustration safety rail)

Within a single session, if a player fails repeatedly at the current level,
the engine should step difficulty back down toward `rubberBandFloor`, not
reset all the way to zero (that would feel patronizing) and not stay pinned
at a level that's clearly too hard (that produces the frustration spiral
`AI_RULES.md` calls out as a hard-rule concern). Conversely, a player
clearing rounds well above the current ramp's expectation can be
nudged up faster than the default curve — this is what turns a fixed ramp
into something that actually adapts to the player in front of it, not just
to elapsed score/time.

Every rubber-band adjustment emits a `difficulty_adjusted` analytics event
(`GAME_ANALYTICS.md`) with a `reason` of `rubber_band_up`/`rubber_band_down`
— this is the signal that later tells us a game's base curve is miscalibrated
if one direction dominates persistently across many sessions/players.

### Never below the floor, never silently maxed out

- `rubberBandFloor` exists so a very rough session still produces *some*
  challenge and doesn't feel like the game gave up on the player.
- `maxLevel` is a hard ceiling — a game should never ramp into genuinely
  unfair/unbeatable territory just because a player is doing extremely well;
  cap out and let mastery show up as sustained high scores at the ceiling,
  not ever-increasing unfairness.

## Per-domain calibration notes

Difficulty means different things per cognitive domain (`ClanCat.domain` in
`app/lib/data.ts`) and the *mechanic* that should ramp differs accordingly —
this is guidance for choosing what a new game's difficulty actually tunes,
not a rule the engine enforces:

| Domain | What difficulty typically ramps |
|---|---|
| Visual / Selective Attention | number of distractors, target-vs-distractor similarity |
| Sustained Attention | session length before a lapse is penalized, stimulus interval |
| Cognitive Flexibility | rule-switch frequency |
| Working Memory | sequence length, retention interval |
| Inhibition Control | go/no-go ratio, response deadline |
| Time Management | time pressure / deadline tightness |
| Auditory Attention | signal-to-noise, cue subtlety |
| (reaction games like Bird Spike / Snack Catch) | speed, spacing/tolerance |

## Implementation status & what to do next

`lib/engine/difficulty.ts` does not exist yet. Building it means: (1)
extracting the shared normalized-level math from the two existing
game-specific ramp functions, (2) adding the rubber-band logic neither game
currently has, (3) wiring `difficulty_adjusted` events. Cross-session
calibration (layer 2) is a separate, later effort — don't build it before
the in-session shared curve is extracted and both existing games are
migrated onto it (`GAME_ROADMAP.md` Phase 1 → Phase 3).
