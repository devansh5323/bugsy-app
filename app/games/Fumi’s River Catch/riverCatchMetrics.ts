// Fumi's River Catch — cognitive metrics recorder.
//
// The whole point of this game is attention training, so every
// gameplay event is logged here and reduced into the research metrics
// the spec calls for. This is intentionally storage-agnostic: it just
// produces a plain JSON-serialisable summary. Wiring it to a real
// analytics/research backend is a follow-up — for now the summary is
// persisted to localStorage (same pattern as the other mini-games) and
// handed back via `onSessionEnd` for the host app to forward anywhere.

export type TapEvent = {
  t: number; // ms since session start
  x: number; // normalized 0..1 tap position (heatmap)
  y: number;
  hit: boolean; // landed on a live entity at all
  correct: boolean | null; // null = tapped empty water
  ruleId: string;
  speciesId: string | null;
  reactionMs: number | null; // time from spawn/catch-zone-entry to tap
};

export type MissEvent = {
  t: number;
  ruleId: string;
  speciesId: string;
};

export type SessionSummary = {
  durationMs: number;
  fishCaught: number;
  correctAvailable: number;
  hitRate: number; // correctCaught / correctAvailable
  falsePositives: number; // wrong taps (distractor or off-rule fish)
  falseNegatives: number; // correct fish that escaped uncaught
  accuracy: number; // correct taps / total taps
  totalInteractions: number;
  avgReactionMs: number;
  reactionStdDevMs: number;
  longestStreak: number;
  basketsFilled: number;
  accuracyByRule: Record<string, { correct: number; wrong: number; missed: number }>;
  distractorPerformance: Record<string, number>; // species id -> times tapped
  tapHeatmap: { x: number; y: number; correct: boolean | null }[];
  starsEarned: number;
  coinsEarned: number;
  xpEarned: number;
};

export function createSessionRecorder(startedAt: number) {
  const taps: TapEvent[] = [];
  const misses: MissEvent[] = [];
  let correctAvailable = 0;
  let longestStreak = 0;
  let basketsFilled = 0;

  return {
    recordSpawnedCorrect() {
      correctAvailable += 1;
    },
    recordTap(e: Omit<TapEvent, "t"> & { now: number }) {
      taps.push({ ...e, t: e.now - startedAt });
    },
    recordMiss(e: Omit<MissEvent, "t"> & { now: number }) {
      misses.push({ ...e, t: e.now - startedAt });
    },
    recordStreak(len: number) {
      if (len > longestStreak) longestStreak = len;
    },
    recordBasketFilled() {
      basketsFilled += 1;
    },
    finalize(endedAt: number): SessionSummary {
      const durationMs = endedAt - startedAt;
      const correctTaps = taps.filter((t) => t.correct === true);
      const wrongTaps = taps.filter((t) => t.correct === false);
      const totalInteractions = taps.length;
      const reactions = correctTaps
        .map((t) => t.reactionMs)
        .filter((v): v is number => v != null);
      const avgReactionMs = reactions.length
        ? reactions.reduce((a, b) => a + b, 0) / reactions.length
        : 0;
      const variance = reactions.length
        ? reactions.reduce((a, b) => a + (b - avgReactionMs) ** 2, 0) / reactions.length
        : 0;

      const accuracyByRule: SessionSummary["accuracyByRule"] = {};
      const bump = (ruleId: string, key: "correct" | "wrong" | "missed") => {
        accuracyByRule[ruleId] ??= { correct: 0, wrong: 0, missed: 0 };
        accuracyByRule[ruleId][key] += 1;
      };
      for (const t of correctTaps) bump(t.ruleId, "correct");
      for (const t of wrongTaps) bump(t.ruleId, "wrong");
      for (const m of misses) bump(m.ruleId, "missed");

      const distractorPerformance: Record<string, number> = {};
      for (const t of wrongTaps) {
        if (!t.speciesId) continue;
        distractorPerformance[t.speciesId] = (distractorPerformance[t.speciesId] ?? 0) + 1;
      }

      const hitRate = correctAvailable ? correctTaps.length / correctAvailable : 0;
      const accuracy = totalInteractions
        ? correctTaps.length / totalInteractions
        : 0;

      const starsEarned = accuracy >= 0.85 && hitRate >= 0.7 ? 3 : accuracy >= 0.6 ? 2 : 1;
      const coinsEarned = correctTaps.length * 2 + basketsFilled * 15;
      const xpEarned = 40 + correctTaps.length * 3 + basketsFilled * 20 + longestStreak * 2;

      return {
        durationMs,
        fishCaught: correctTaps.length,
        correctAvailable,
        hitRate,
        falsePositives: wrongTaps.length,
        falseNegatives: misses.length,
        accuracy,
        totalInteractions,
        avgReactionMs,
        reactionStdDevMs: Math.sqrt(variance),
        longestStreak,
        basketsFilled,
        accuracyByRule,
        distractorPerformance,
        tapHeatmap: taps.map((t) => ({ x: t.x, y: t.y, correct: t.correct })),
        starsEarned,
        coinsEarned,
        xpEarned,
      };
    },
  };
}

export function persistSession(summary: SessionSummary) {
  try {
    const key = "fumi-river-catch-sessions";
    const prev: SessionSummary[] = JSON.parse(window.localStorage.getItem(key) ?? "[]");
    prev.push(summary);
    window.localStorage.setItem(key, JSON.stringify(prev.slice(-30)));
  } catch {
    /* localStorage unavailable — quietly skip */
  }
}

export function bestStars(): number {
  try {
    const key = "fumi-river-catch-sessions";
    const prev: SessionSummary[] = JSON.parse(window.localStorage.getItem(key) ?? "[]");
    return prev.reduce((m, s) => Math.max(m, s.starsEarned), 0);
  } catch {
    return 0;
  }
}
