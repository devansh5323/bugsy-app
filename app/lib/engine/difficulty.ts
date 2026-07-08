// Adaptive difficulty engine — turns a game's DifficultyCurveParams
// into a normalized 0..1 level. Behavioral spec: docs/GAME_DIFFICULTY.md.
//
// The engine owns the abstract level only. Each game maps that level
// onto its own concrete tuning numbers (gap size, fall speed, sequence
// length) in its config — that mapping is inherently game-specific and
// never lives here (docs/GAME_STANDARDS.md).
//
// Everything here is pure with respect to time — units come in from
// the game's loop (score or elapsed ms), never from Date.now() — so
// the math is unit-testable once a test runner exists.

import type {
  DifficultyAdjustReason,
  DifficultyCurveParams,
} from "./types";

// Rubber-band tuning (docs/GAME_DIFFICULTY.md — safety rails; changing
// these is a product decision per AI_RULES.md, not a refactor).
const FAILURE_STREAK_TO_STEP_DOWN = 3;
const SUCCESS_STREAK_TO_STEP_UP = 5;
const STEP_DOWN_AMOUNT = 0.12;
const STEP_UP_AMOUNT = 0.08;

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

// The base in-session ramp, before rubber-banding: flat at startLevel
// through the grace window, then linear to maxLevel over rampToMaxUnits.
export function baseLevelAt(
  params: DifficultyCurveParams,
  units: number,
): number {
  const { graceUnits, rampToMaxUnits, startLevel, maxLevel } = params;
  if (units <= graceUnits || rampToMaxUnits <= 0) return startLevel;
  const progress = clamp01((units - graceUnits) / rampToMaxUnits);
  return startLevel + (maxLevel - startLevel) * progress;
}

export type DifficultyAdjustment = {
  previousLevel: number;
  newLevel: number;
  reason: DifficultyAdjustReason;
};

export type DifficultyEngine = {
  // Current level for the ramp position `units` (score or elapsed ms,
  // per params.driver), including any rubber-band offset, clamped to
  // [rubberBandFloor, maxLevel].
  levelAt: (units: number) => number;
  // Feed round outcomes in; streaks trigger rubber-band adjustments.
  recordSuccess: () => void;
  recordFailure: () => void;
  reset: () => void;
};

export function createDifficultyEngine(
  params: DifficultyCurveParams,
  // Fires on every rubber-band step — GameShell/games forward this to
  // trackDifficultyAdjusted (docs/GAME_ANALYTICS.md).
  onAdjust?: (adjustment: DifficultyAdjustment) => void,
): DifficultyEngine {
  let offset = 0;
  let successStreak = 0;
  let failureStreak = 0;
  // Last ramp position seen, so streak handlers can report the level
  // change at the point the adjustment happened.
  let lastUnits = 0;

  const clampLevel = (raw: number): number =>
    Math.max(params.rubberBandFloor, Math.min(params.maxLevel, raw));

  const currentLevel = (): number =>
    clampLevel(baseLevelAt(params, lastUnits) + offset);

  const applyOffset = (delta: number, reason: DifficultyAdjustReason): void => {
    const previousLevel = currentLevel();
    offset += delta;
    // Keep the offset from pushing the level past its rails — and from
    // accumulating beyond them, which would make recovery sluggish.
    const unclamped = baseLevelAt(params, lastUnits) + offset;
    const clamped = clampLevel(unclamped);
    offset += clamped - unclamped;
    const newLevel = currentLevel();
    if (newLevel !== previousLevel) {
      onAdjust?.({ previousLevel, newLevel, reason });
    }
  };

  return {
    levelAt(units: number): number {
      lastUnits = units;
      return currentLevel();
    },

    recordSuccess(): void {
      failureStreak = 0;
      successStreak += 1;
      if (successStreak >= SUCCESS_STREAK_TO_STEP_UP) {
        successStreak = 0;
        applyOffset(STEP_UP_AMOUNT, "rubber_band_up");
      }
    },

    recordFailure(): void {
      successStreak = 0;
      failureStreak += 1;
      if (failureStreak >= FAILURE_STREAK_TO_STEP_DOWN) {
        failureStreak = 0;
        applyOffset(-STEP_DOWN_AMOUNT, "rubber_band_down");
      }
    },

    reset(): void {
      offset = 0;
      successStreak = 0;
      failureStreak = 0;
      lastUnits = 0;
    },
  };
}
