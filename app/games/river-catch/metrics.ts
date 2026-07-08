// Research metrics accumulator — the spec's five measures: hit rate,
// omission errors, commission errors, mean reaction time, reaction
// time variability. Pure math, no clock reads (docs/GAME_STANDARDS.md);
// the game feeds decisions in as they happen.

export type RoundMetrics = {
  hits: number;
  omissions: number;
  commissions: number;
  goodSaves: number;
  bestStreak: number;
  reactionTimesMs: number[];
};

export function createRoundMetrics(): RoundMetrics {
  return {
    hits: 0,
    omissions: 0,
    commissions: 0,
    goodSaves: 0,
    bestStreak: 0,
    reactionTimesMs: [],
  };
}

// Correct catches / total target fish that were catchable.
export function hitRate(m: RoundMetrics): number {
  const totalTargets = m.hits + m.omissions;
  return totalTargets === 0 ? 0 : m.hits / totalTargets;
}

export function meanReactionTimeMs(m: RoundMetrics): number | null {
  if (m.reactionTimesMs.length === 0) return null;
  const sum = m.reactionTimesMs.reduce((a, b) => a + b, 0);
  return sum / m.reactionTimesMs.length;
}

// Standard deviation of correct-catch reaction times — the spec's
// "consistency of the child's reaction speed".
export function reactionTimeVariabilityMs(m: RoundMetrics): number | null {
  const n = m.reactionTimesMs.length;
  if (n < 2) return null;
  const mean = meanReactionTimeMs(m) as number;
  const variance =
    m.reactionTimesMs.reduce((a, b) => a + (b - mean) ** 2, 0) / (n - 1);
  return Math.sqrt(variance);
}
