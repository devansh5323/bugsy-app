// Shared engine vocabulary — every other engine module and every game
// speaks these types. See docs/GAME_ENGINE.md.

// Must stay in lockstep with ClanCat.domain values in app/lib/data.ts.
export type CognitiveDomain =
  | "visual-attention"
  | "sustained-attention"
  | "selective-attention"
  | "cognitive-flexibility"
  | "working-memory"
  | "inhibition-control"
  | "time-management"
  | "auditory-attention";

export type GameStatus =
  | "idle"
  | "intro"
  | "playing"
  | "paused"
  | "gameover"
  | "results";

export type GameOutcome = "cleared" | "failed" | "quit";

// What advances a game's in-session difficulty ramp.
export type DifficultyDriver = "score" | "time";

export type DifficultyCurveParams = {
  driver: DifficultyDriver;
  // Rounds (driver: "score") or ms (driver: "time") before the ramp
  // begins at all — the player learns the controls in this window.
  graceUnits: number;
  // Units after the grace window until maxLevel is reached.
  rampToMaxUnits: number;
  // Normalized levels, 0..1. startLevel is overridable later by
  // cross-session calibration (GAME_DIFFICULTY.md, not built yet).
  startLevel: number;
  maxLevel: number;
  // A bad run rubber-bands down toward this, never below it.
  rubberBandFloor: number;
};

export type DifficultyAdjustReason =
  | "ramp"
  | "rubber_band_up"
  | "rubber_band_down";

export type GameConfig = {
  // kebab-case, stable forever once shipped (localStorage namespace +
  // analytics dimension). Matches the game's folder name.
  id: string;
  title: string;
  domain: CognitiveDomain;
  difficulty: DifficultyCurveParams;
  // Shown in the project picker; keep proportionate to PROJECTS entries.
  estimatedMins: number;
  // Base points awarded on completion — mirrors Project.points in
  // app/lib/data.ts for this game.
  basePoints: number;
  // Optional finer-grained age gating within the app's 8–15 range.
  minAgeMonths?: number;
};

export type GameResult = {
  gameId: string;
  score: number;
  durationMs: number;
  outcome: GameOutcome;
  // Normalized 0..1 difficulty level when the run ended.
  difficultyLevelReached: number;
  xpEarned: number;
  // Epoch ms, injected by the caller (GameShell) — pure engine
  // functions never call Date.now() themselves so they stay testable.
  timestamp: number;
};
