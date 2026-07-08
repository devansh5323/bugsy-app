// Analytics manager — the seam between game code and whatever
// telemetry backend eventually exists. No backend is wired up today
// (docs/GAME_ANALYTICS.md), so the default backend logs to the console
// in development and drops events in production. Game code calls the
// semantic track* functions below and never a raw SDK, so plugging in
// a real collector later touches only this file.
//
// Privacy: the envelope is the full allowed property set — no PII, no
// free text, no device fingerprinting (docs/GAME_ANALYTICS.md,
// docs/AI_RULES.md). Think twice before adding a property.

import pkg from "../../../package.json";
import type { CognitiveDomain, DifficultyAdjustReason, GameResult } from "./types";

export type AnalyticsEvent = {
  event: string;
  timestamp: number;
  session_id: string;
  app_version: string;
  game_id?: string;
  domain?: CognitiveDomain;
  // Event-specific properties. snake_case, primitives only.
  [property: string]: string | number | boolean | undefined;
};

export type AnalyticsBackend = {
  send: (event: AnalyticsEvent) => void;
};

const consoleBackend: AnalyticsBackend = {
  send: (event) => {
    console.debug("[analytics]", event.event, event);
  },
};

const noopBackend: AnalyticsBackend = { send: () => {} };

let backend: AnalyticsBackend =
  process.env.NODE_ENV === "development" ? consoleBackend : noopBackend;

// Swap in a real collector later (Phase 3, docs/GAME_ROADMAP.md).
export function setAnalyticsBackend(next: AnalyticsBackend): void {
  backend = next;
}

// Rotates per app session (page load) — deliberately not persisted,
// and the only identifier events carry.
let sessionId: string | null = null;
function getSessionId(): string {
  if (sessionId === null) {
    sessionId =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `s-${Math.random().toString(36).slice(2)}`;
  }
  return sessionId;
}

// Timestamps are stamped here, at the I/O boundary — engine logic that
// must stay pure/testable (difficulty, results math) never reads the
// clock itself (docs/GAME_ANALYTICS.md envelope note).
function emit(
  event: string,
  gameId: string | undefined,
  domain: CognitiveDomain | undefined,
  properties: Record<string, string | number | boolean | undefined> = {},
): void {
  backend.send({
    event,
    timestamp: Date.now(),
    session_id: getSessionId(),
    app_version: pkg.version,
    game_id: gameId,
    domain,
    ...properties,
  });
}

// ── Core event set (docs/GAME_ANALYTICS.md — keep that table in sync) ──

export function trackGameStarted(
  gameId: string,
  domain: CognitiveDomain,
  difficultyLevelStart: number,
): void {
  emit("game_started", gameId, domain, {
    difficulty_level_start: difficultyLevelStart,
  });
}

export function trackRoundCompleted(
  gameId: string,
  domain: CognitiveDomain,
  opts: { roundIndex: number; success: boolean; reactionTimeMs?: number },
): void {
  emit("round_completed", gameId, domain, {
    round_index: opts.roundIndex,
    success: opts.success,
    reaction_time_ms: opts.reactionTimeMs,
  });
}

export function trackDifficultyAdjusted(
  gameId: string,
  domain: CognitiveDomain,
  opts: {
    previousLevel: number;
    newLevel: number;
    reason: DifficultyAdjustReason;
  },
): void {
  emit("difficulty_adjusted", gameId, domain, {
    previous_level: opts.previousLevel,
    new_level: opts.newLevel,
    reason: opts.reason,
  });
}

export function trackGamePaused(gameId: string, domain: CognitiveDomain): void {
  emit("game_paused", gameId, domain);
}

export function trackGameResumed(gameId: string, domain: CognitiveDomain): void {
  emit("game_resumed", gameId, domain);
}

export function trackGameCompleted(
  result: GameResult,
  domain: CognitiveDomain,
): void {
  emit("game_completed", result.gameId, domain, {
    score: result.score,
    duration_ms: result.durationMs,
    outcome: result.outcome,
    difficulty_level_end: result.difficultyLevelReached,
    xp_earned: result.xpEarned,
  });
}

export function trackGameExitedEarly(
  gameId: string,
  domain: CognitiveDomain,
  opts: { elapsedMs: number; difficultyLevelAtExit: number },
): void {
  emit("game_exited_early", gameId, domain, {
    elapsed_ms: opts.elapsedMs,
    difficulty_level_at_exit: opts.difficultyLevelAtExit,
  });
}
