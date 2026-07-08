// River entities — pure spawn/step/hit-test logic, no canvas and no
// React, so the go/no-go decision rules stay unit-testable
// (docs/GAME_STANDARDS.md). Drawing lives in RiverCatchGame.tsx.

import type { RuleStage, Tuning } from "./config";

// What tapping each kind means, per the spec:
//   target/golden → catch (golden is the rare bonus fish)
//   distractor    → a fish that looks close but breaks the rule
//                    (plain when sparkle is required, blue when the
//                    card says green) — tapping is a commission error
//   unsafe        → red spiky fish — tapping is a commission error
//   junk / leaf   → floating rubbish/leaves — tapping is a commission error
//   ripple        → fake ripple, tests impulsive tapping — same
export type EntityKind =
  | "target"
  | "golden"
  | "distractor"
  | "unsafe"
  | "junk"
  | "leaf"
  | "ripple";

export type Entity = {
  id: number;
  kind: EntityKind;
  x: number;
  y: number;
  vx: number; // px/s, sign = swim direction
  size: number;
  sparkle: boolean;
  color: "blue" | "green" | "red" | "gold" | "plain";
  emoji?: string; // junk/leaf render as glyphs
  // Game-clock ms when the entity entered the catch zone (for reaction
  // time: zone entry → tap, per the spec's research metrics).
  zoneEnteredAt: number | null;
  // Ripples live in place and fade instead of swimming.
  bornAt: number;
  lifeMs: number;
  resolved: boolean; // tapped, caught, or already scored as a save/miss
};

export const RIVER_TOP = 320;
export const RIVER_BOTTOM = 620;
export const HOOK_X = 210;
export const CATCH_ZONE_HALF_W = 78;

const JUNK_EMOJI = ["🥫", "👢", "🧦"];
const GOLDEN_CHANCE = 0.06;
const RIPPLE_LIFE_MS = 2_400;

export function inCatchZone(x: number): boolean {
  return Math.abs(x - HOOK_X) <= CATCH_ZONE_HALF_W;
}

// Whether tapping this entity right now is a correct catch under the
// active rule card. The single decision function both the tap handler
// and (by inversion) the error accounting share.
export function isCorrectCatch(e: Entity, stage: RuleStage): boolean {
  if (e.kind !== "target" && e.kind !== "golden") return false;
  if (stage.requireZone && !inCatchZone(e.x)) return false;
  return true;
}

let nextId = 1;

export function spawnEntity(
  stage: RuleStage,
  tuning: Tuning,
  nowMs: number,
  gameWidth: number,
  random: () => number = Math.random,
): Entity {
  const fromLeft = random() < 0.5;
  const y = RIVER_TOP + random() * (RIVER_BOTTOM - RIVER_TOP);
  const speed = tuning.fishSpeed * (0.85 + random() * 0.3);
  const base = {
    id: nextId++,
    x: fromLeft ? -40 : gameWidth + 40,
    y,
    vx: fromLeft ? speed : -speed,
    zoneEnteredAt: null,
    bornAt: nowMs,
    lifeMs: Number.POSITIVE_INFINITY,
    resolved: false,
  };

  const isDistractor = random() < tuning.distractorRatio;
  if (!isDistractor) {
    if (random() < GOLDEN_CHANCE) {
      return { ...base, kind: "golden", size: 34, sparkle: true, color: "gold" };
    }
    return {
      ...base,
      kind: "target",
      size: 30,
      sparkle: stage.sparkleRule,
      color: stage.targetColor,
    };
  }

  const isDecoy = random() < tuning.decoyRatio;
  if (!isDecoy) {
    // A rule-breaking fish: plain twin under a sparkle rule, blue fish
    // once the card says green, otherwise the red unsafe fish.
    if (stage.sparkleRule) {
      return { ...base, kind: "distractor", size: 30, sparkle: false, color: stage.targetColor };
    }
    if (stage.targetColor === "green" && random() < 0.5) {
      return { ...base, kind: "distractor", size: 30, sparkle: false, color: "blue" };
    }
    return { ...base, kind: "unsafe", size: 30, sparkle: false, color: "red" };
  }

  const roll = random();
  if (stage.fakeRipples && roll < 0.45) {
    return {
      ...base,
      kind: "ripple",
      x: 40 + random() * (gameWidth - 80),
      vx: 0,
      size: 26,
      sparkle: false,
      color: "plain",
      lifeMs: RIPPLE_LIFE_MS,
    };
  }
  if (roll < 0.75) {
    return {
      ...base,
      kind: "leaf",
      y: RIVER_TOP - 4 + random() * 24, // leaves drift on the surface
      vx: base.vx * 0.45,
      size: 24,
      sparkle: false,
      color: "plain",
      emoji: "🍂",
    };
  }
  return {
    ...base,
    kind: "junk",
    size: 28,
    sparkle: false,
    color: "plain",
    emoji: JUNK_EMOJI[Math.floor(random() * JUNK_EMOJI.length)],
  };
}

export type StepOutcome = {
  // Target fish that crossed the zone and left the screen untapped.
  omissions: Entity[];
  // Unsafe fish / junk / expired ripples the player correctly left
  // alone after they were catchable — the spec's "Good Save".
  goodSaves: Entity[];
  removed: Entity[];
};

// Advance all entities by deltaMs and classify everything that left
// play. Mutates entities in place (pooled array, no per-frame allocs
// beyond the outcome lists) — the caller owns the array.
export function stepEntities(
  entities: Entity[],
  deltaMs: number,
  nowMs: number,
  gameWidth: number,
): StepOutcome {
  const outcome: StepOutcome = { omissions: [], goodSaves: [], removed: [] };

  for (const e of entities) {
    e.x += (e.vx * deltaMs) / 1000;
    if (e.zoneEnteredAt === null && inCatchZone(e.x)) {
      e.zoneEnteredAt = nowMs;
    }
  }

  for (let i = entities.length - 1; i >= 0; i--) {
    const e = entities[i];
    const offscreen = e.x < -60 || e.x > gameWidth + 60;
    const expired = nowMs - e.bornAt >= e.lifeMs;
    if (!offscreen && !expired) continue;

    entities.splice(i, 1);
    outcome.removed.push(e);
    if (e.resolved) continue;

    if ((e.kind === "target" || e.kind === "golden") && e.zoneEnteredAt !== null) {
      outcome.omissions.push(e);
    } else if (
      (e.kind === "unsafe" || e.kind === "junk" || e.kind === "ripple") &&
      (e.zoneEnteredAt !== null || e.kind === "ripple")
    ) {
      // Leaves are ambience — resisting them isn't rewarded, or every
      // drifting leaf would inflate the score.
      outcome.goodSaves.push(e);
    }
  }

  return outcome;
}

// Topmost entity within touch distance of the tap, or null. Generous
// radius for young motor control (docs/GAME_UI_GUIDELINES.md).
export function hitTest(entities: Entity[], x: number, y: number): Entity | null {
  const TOUCH_RADIUS = 34;
  let best: Entity | null = null;
  let bestDist = Number.POSITIVE_INFINITY;
  for (const e of entities) {
    if (e.resolved) continue;
    const d = Math.hypot(e.x - x, e.y - y);
    if (d <= TOUCH_RADIUS + e.size / 2 && d < bestDist) {
      best = e;
      bestDist = d;
    }
  }
  return best;
}
