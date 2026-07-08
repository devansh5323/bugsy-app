// Result calculator — turns a finished run into a GameResult and the
// XP it earns. Pure functions: the caller (GameShell) injects the
// timestamp, nothing here reads the clock. See docs/GAME_ENGINE.md.

import type { GameConfig, GameOutcome, GameResult } from "./types";

// XP model (warmth-first, per docs/GAME_UI_GUIDELINES.md):
// - cleared → full base points, plus up to +50% for the difficulty
//   level the run ended at, so harder play visibly pays more.
// - failed → a participation floor (25% of base). Effort counts; a
//   loss never pays zero, because "you got nothing" reads as shaming
//   to this age group.
// - quit  → 0. Exiting early isn't punished, but rewarding it would
//   teach opening-and-quitting as an XP farm.
const DIFFICULTY_BONUS_MAX = 0.5;
const FAILED_PARTICIPATION_RATE = 0.25;

export function calculateXp(
  config: GameConfig,
  outcome: GameOutcome,
  difficultyLevelReached: number,
): number {
  if (outcome === "quit") return 0;
  if (outcome === "failed") {
    return Math.round(config.basePoints * FAILED_PARTICIPATION_RATE);
  }
  const bonus = DIFFICULTY_BONUS_MAX * Math.max(0, Math.min(1, difficultyLevelReached));
  return Math.round(config.basePoints * (1 + bonus));
}

export function buildResult(opts: {
  config: GameConfig;
  score: number;
  durationMs: number;
  outcome: GameOutcome;
  difficultyLevelReached: number;
  timestamp: number;
}): GameResult {
  return {
    gameId: opts.config.id,
    score: opts.score,
    durationMs: opts.durationMs,
    outcome: opts.outcome,
    difficultyLevelReached: opts.difficultyLevelReached,
    xpEarned: calculateXp(opts.config, opts.outcome, opts.difficultyLevelReached),
    timestamp: opts.timestamp,
  };
}
