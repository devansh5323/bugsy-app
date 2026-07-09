// Fumi's River Catch — game data & tuning.
//
// Everything that describes "what can swim across the river" and "what
// counts as correct right now" lives here, separate from the engine
// (FumiRiverCatch.tsx) so the rule list / difficulty curve can be tuned
// without touching render or physics code.

export type FishColor = "blue" | "yellow" | "gold" | "red" | "murky";
export type FishSize = "tiny" | "normal" | "big";

export type Species = {
  id: string;
  kind: "fish" | "bottle" | "boot" | "leaf" | "twig" | "ripple";
  safe: boolean; // true = a real catchable fish; false = distractor
  color: FishColor;
  size: FishSize;
  sparkle: boolean; // rare/golden shimmer
  points: number;
  label: string;
  // Relative spawn weight (before rule-based biasing).
  weight: number;
};

export const SAFE_SPECIES: Species[] = [
  { id: "blue", kind: "fish", safe: true, color: "blue", size: "normal", sparkle: false, points: 10, label: "Blue Fish", weight: 3 },
  { id: "yellow", kind: "fish", safe: true, color: "yellow", size: "normal", sparkle: false, points: 10, label: "Yellow Fish", weight: 3 },
  { id: "gold", kind: "fish", safe: true, color: "gold", size: "normal", sparkle: false, points: 20, label: "Gold Fish", weight: 1.4 },
  { id: "tiny-blue", kind: "fish", safe: true, color: "blue", size: "tiny", sparkle: false, points: 15, label: "Tiny Fish", weight: 2 },
  { id: "big-blue", kind: "fish", safe: true, color: "blue", size: "big", sparkle: false, points: 10, label: "Big Fish", weight: 1.6 },
  { id: "rare-golden", kind: "fish", safe: true, color: "gold", size: "normal", sparkle: true, points: 50, label: "Rare Golden Fish", weight: 1.5 },
];

export const DISTRACTOR_SPECIES: Species[] = [
  { id: "red", kind: "fish", safe: false, color: "red", size: "normal", sparkle: false, points: 0, label: "Red Fish", weight: 2.6 },
  { id: "poison", kind: "fish", safe: false, color: "murky", size: "normal", sparkle: false, points: 0, label: "Poison Fish", weight: 1.6 },
  { id: "bottle", kind: "bottle", safe: false, color: "murky", size: "normal", sparkle: false, points: 0, label: "Plastic Bottle", weight: 1.4 },
  { id: "boot", kind: "boot", safe: false, color: "murky", size: "normal", sparkle: false, points: 0, label: "Old Boot", weight: 1 },
  { id: "leaf", kind: "leaf", safe: false, color: "murky", size: "tiny", sparkle: false, points: 0, label: "Leaf", weight: 1.6 },
  { id: "twig", kind: "twig", safe: false, color: "murky", size: "tiny", sparkle: false, points: 0, label: "Twig", weight: 1.2 },
  { id: "ripple", kind: "ripple", safe: false, color: "murky", size: "normal", sparkle: false, points: 0, label: "Fake Ripple", weight: 1.4 },
];

export const ALL_SPECIES = [...SAFE_SPECIES, ...DISTRACTOR_SPECIES];
export const speciesById = (id: string) => ALL_SPECIES.find((s) => s.id === id)!;

// ── Rules ──────────────────────────────────────────────────────────
// Each rule redefines "correct" for a while. `matches` is evaluated per
// spawned instance; `bias` nudges spawn weights so the rule is
// learnable (e.g. more red fish around when the rule is about red fish).
export type Rule = {
  id: string;
  text: string;
  icon: string;
  matches: (s: Species) => boolean;
  bias?: (s: Species) => number;
};

export const RULES: Rule[] = [
  {
    id: "catch-blue",
    text: "Catch Blue Fish",
    icon: "🔵",
    matches: (s) => s.safe && s.color === "blue",
  },
  {
    id: "avoid-red",
    text: "Avoid Red Fish",
    icon: "🚫",
    matches: (s) => s.safe,
    bias: (s) => (s.id === "red" ? 2.2 : 1),
  },
  {
    id: "catch-sparkle",
    text: "Catch Fish With Sparkles",
    icon: "✨",
    matches: (s) => s.sparkle,
    bias: (s) => (s.sparkle ? 2.4 : 1),
  },
  {
    id: "only-small",
    text: "Catch Only Small Fish",
    icon: "🤏",
    matches: (s) => s.safe && s.size === "tiny",
    bias: (s) => (s.size === "tiny" ? 1.8 : 1),
  },
  {
    id: "catch-golden",
    text: "Catch Golden Fish",
    icon: "🟡",
    matches: (s) => s.safe && s.color === "gold",
    bias: (s) => (s.color === "gold" ? 2 : 1),
  },
  {
    id: "avoid-ripples",
    text: "Avoid Fake Ripples",
    icon: "🌊",
    matches: (s) => s.safe,
    bias: (s) => (s.id === "ripple" ? 2.6 : 1),
  },
];

// ── Difficulty ─────────────────────────────────────────────────────
// Steps every 30s. Capped so it never spirals past "brisk but readable".
export const DIFFICULTY_STEP_MS = 30_000;
export const MAX_DIFFICULTY_STEPS = 5;

export function difficultyAt(elapsedMs: number) {
  const step = Math.min(
    MAX_DIFFICULTY_STEPS,
    Math.floor(elapsedMs / DIFFICULTY_STEP_MS),
  );
  const t = step / MAX_DIFFICULTY_STEPS; // 0..1
  return {
    step,
    spawnIntervalMs: 900 - t * 480, // 900ms -> 420ms — fish show up often from the start
    speedMul: 1 + t * 0.65, // 1x -> 1.65x
    distractorRatio: 0.32 + t * 0.28, // 32% -> 60%
    maxConcurrent: Math.round(6 + t * 5), // 6 -> 11 on screen at once
  };
}

// ── Session ────────────────────────────────────────────────────────
export const SESSION_MS = 120_000; // 2 minutes
export const RULE_DURATION_MS = 20_000; // rule changes every 20s
export const BASKET_TARGET = 8; // correct catches to fill one basket
export const FLOW_STREAK = 5; // combo length that triggers Focus Flow
export const GLOW_STREAK = 3; // combo length Fumi starts looking extra delighted
