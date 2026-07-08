// Fumi's River Catch — config and tuning. Gameplay source of truth:
// "Game Paradigm's - Fumi's world" spec (CPT / Go-No-Go / visual search
// paradigms). All mapping from the engine's abstract difficulty level
// to concrete game numbers lives here, per docs/GAME_STANDARDS.md.

import type { GameConfig } from "../../lib/engine/types";

export const RIVER_CATCH_CONFIG: GameConfig = {
  id: "river-catch",
  title: "Fumi's River Catch",
  // Filtering target fish out of distractors/decoys is the Laser-cat
  // domain; the go/no-go "don't tap" element trains inhibition too,
  // but a game tags exactly one domain (docs/AGENTS.md).
  domain: "selective-attention",
  difficulty: {
    driver: "time",
    graceUnits: 8_000, // first 8s: slow fish, no decoys — learn the tap
    rampToMaxUnits: 60_000,
    startLevel: 0.15,
    maxLevel: 1,
    rubberBandFloor: 0.1,
  },
  estimatedMins: 2,
  basePoints: 50, // mirrors the PROJECTS entry in app/lib/data.ts
};

// ── Round shape ──────────────────────────────────────────────────
export const ROUND_MS = 90_000;
export const BASKET_TARGET = 12; // catches to fill Fumi's food basket

// ── Scoring ──────────────────────────────────────────────────────
export const POINTS_CATCH = 10;
export const POINTS_GOLDEN = 25;
export const POINTS_GOOD_SAVE = 5;
// After 5 correct decisions in a row, Focus Flow: river glows, points double.
export const FOCUS_FLOW_STREAK = 5;
export const FOCUS_FLOW_MULTIPLIER = 2;

// ── Rule stages (the spec's five "simple difficulty levels") ─────
// The engine's normalized level selects the active stage; rubber-
// banding can step a struggling player back to an earlier rule.
export type RuleStage = {
  stage: 1 | 2 | 3 | 4 | 5;
  rule: string; // the Catch Rule Card text, one child-readable line
  targetColor: "blue" | "green";
  sparkleRule: boolean; // stage 2+: only sparkly fish are targets
  requireZone: boolean; // stage 3+: catch only near the hook
  fakeRipples: boolean; // stage 4+: fake ripples spawn as decoys
};

export const RULE_STAGES: readonly RuleStage[] = [
  { stage: 1, rule: "Catch blue fish. Avoid red fish!", targetColor: "blue", sparkleRule: false, requireZone: false, fakeRipples: false },
  { stage: 2, rule: "Catch sparkly fish. Skip plain ones!", targetColor: "blue", sparkleRule: true, requireZone: false, fakeRipples: false },
  { stage: 3, rule: "Catch sparkly fish near the hook!", targetColor: "blue", sparkleRule: true, requireZone: true, fakeRipples: false },
  { stage: 4, rule: "Fake ripples about! Catch near the hook!", targetColor: "blue", sparkleRule: true, requireZone: true, fakeRipples: true },
  { stage: 5, rule: "New card: catch GREEN fish only!", targetColor: "green", sparkleRule: false, requireZone: true, fakeRipples: true },
];

export function stageForLevel(level: number): RuleStage {
  const idx = Math.min(
    RULE_STAGES.length - 1,
    Math.floor(Math.max(0, Math.min(1, level)) * RULE_STAGES.length),
  );
  return RULE_STAGES[idx];
}

// ── Continuous tuning (speed/pressure scale within every stage) ──
export type Tuning = {
  fishSpeed: number; // px/s horizontal
  spawnIntervalMs: number; // mean gap between spawns
  distractorRatio: number; // chance a spawn is a non-target
  decoyRatio: number; // of distractors, chance it's junk/leaf/ripple
};

export function tuningForLevel(level: number): Tuning {
  const l = Math.max(0, Math.min(1, level));
  return {
    fishSpeed: 85 + 150 * l,
    spawnIntervalMs: 1_400 - 700 * l,
    distractorRatio: 0.35 + 0.35 * l,
    decoyRatio: 0.25 + 0.35 * l,
  };
}
