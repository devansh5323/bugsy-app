// Score manager — in-run score/streak tracking plus best-score
// persistence through the shared storage helpers (one key convention
// for every game, unlike the legacy `birdspike-best` /
// `bugsy-snack-scores` ad-hoc keys). See docs/GAME_ENGINE.md.
//
// Score lives here (not in React state) so games can add points from
// inside the RAF loop without re-rendering per frame; games mirror it
// into state only at the human-timescale moments the HUD needs
// (docs/GAME_STANDARDS.md).

import { getGameState, setGameState } from "./storage";

type PersistedScoreState = {
  bestScore: number;
};

export type ScoreManager = {
  add: (points?: number) => number;
  score: () => number;
  // Consecutive successful actions in the current run — feeds combo
  // displays and the difficulty engine's recordSuccess cadence.
  streak: () => number;
  breakStreak: () => void;
  bestScore: () => number;
  // Persist the current run's score if it beats the stored best.
  // Returns true when a new best was set (HUD "New best!" moment).
  commitBest: () => boolean;
  reset: () => void;
};

export function createScoreManager(gameId: string): ScoreManager {
  let score = 0;
  let streak = 0;
  let best = getGameState<PersistedScoreState>(gameId, { bestScore: 0 })
    .bestScore;

  return {
    add(points = 1): number {
      score += points;
      streak += 1;
      return score;
    },

    score: () => score,
    streak: () => streak,

    breakStreak(): void {
      streak = 0;
    },

    bestScore: () => best,

    commitBest(): boolean {
      if (score <= best) return false;
      best = score;
      setGameState<PersistedScoreState>(gameId, { bestScore: best });
      return true;
    },

    reset(): void {
      score = 0;
      streak = 0;
    },
  };
}
