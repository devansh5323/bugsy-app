"use client";

// Fumi's River Catch — the first game built on the shared engine.
//
// Fumi the cat fishes at a sunset river. Fish and distractors drift
// past the hook; the child taps only what the rule card allows (CPT /
// go-no-go / visual search). Correct catches fill Fumi's food basket;
// resisting bad fish, junk, and fake ripples earns "Good Save" points.
// Five rule stages arrive as the shared difficulty engine ramps —
// and rubber-band back if the child is struggling.
//
// World rendering is Canvas2D inside the engine's RAF loop; per-frame
// state lives in refs; Fumi stays a DOM <Bobo> overlay (same split as
// the earlier games, now via the engine — docs/GAME_ENGINE.md).

import { useCallback, useEffect, useRef, useState } from "react";
import { Bobo } from "../../components/Mascot";
import { GameShell, useGameShell } from "../../components/games/GameShell";
import { HUD } from "../../components/games/HUD";
import type { Mood } from "../../lib/data";
// Type-only import: erased at compile time, so this doesn't create a
// runtime circular dependency with registry.ts's dynamic() import of
// this same file.
import type { GameLaunchProps } from "../registry";
import {
  trackDifficultyAdjusted,
  trackRoundCompleted,
} from "../../lib/engine/analytics";
import { playFail, playHit, playSuccess, playTone } from "../../lib/engine/audio";
import { createDifficultyEngine } from "../../lib/engine/difficulty";
import { createScoreManager } from "../../lib/engine/score";
import { createCountdown, createGameTimer } from "../../lib/engine/timer";
import { useCanvas } from "../../lib/engine/useCanvas";
import { useGameLoop } from "../../lib/engine/useGameLoop";
import {
  BASKET_TARGET,
  FOCUS_FLOW_MULTIPLIER,
  FOCUS_FLOW_STREAK,
  POINTS_CATCH,
  POINTS_GOLDEN,
  POINTS_GOOD_SAVE,
  RIVER_CATCH_CONFIG,
  ROUND_MS,
  stageForLevel,
  tuningForLevel,
  type RuleStage,
} from "./config";
import {
  CATCH_ZONE_HALF_W,
  HOOK_X,
  RIVER_BOTTOM,
  RIVER_TOP,
  hitTest,
  inCatchZone,
  isCorrectCatch,
  spawnEntity,
  stepEntities,
  type Entity,
} from "./entities";
import {
  createRoundMetrics,
  meanReactionTimeMs,
  type RoundMetrics,
} from "./metrics";

const GAME_W = 400;
const GAME_H = 800;
const INITIAL_STAGE = stageForLevel(RIVER_CATCH_CONFIG.difficulty.startLevel);
const EMOJI_FONT =
  '26px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", serif';
// Fumi is her own cat, not Bugsy — the warm-orange tint keeps that
// visually distinct from the blue companion.
const FUMI_TINT = 35;

type Popup = { x: number; y: number; text: string; color: string; bornAt: number };

// Current points multiplier — Focus Flow doubles points while the
// streak holds (used by both the loop and the tap handler).
function focusMultiplier(streak: number): number {
  return streak >= FOCUS_FLOW_STREAK ? FOCUS_FLOW_MULTIPLIER : 1;
}

export function RiverCatchGame({ onExit, onEarnXp }: GameLaunchProps) {
  const clearedRef = useRef(false);
  const metricsRef = useRef<RoundMetrics>(createRoundMetrics());

  return (
    <GameShell
      config={RIVER_CATCH_CONFIG}
      tint={FUMI_TINT}
      introLines={[
        "I'm Fumi! I'm fishing for my dinner by this river.",
        "Tap the blue fish when they swim near my hook.",
        "Skip red fish, junk, and sneaky fake ripples!",
      ]}
      onExit={() => onExit(clearedRef.current)}
      onComplete={(r) => {
        if (r.outcome === "cleared") clearedRef.current = true;
        onEarnXp?.(r.xpEarned);
      }}
      resultLine={(r) =>
        r.outcome === "cleared"
          ? "My basket is full — what a feast. Thank you!"
          : "Tricky fish today! We'll fill the basket next time."
      }
      resultDetails={() => <ResultStats metrics={metricsRef.current} />}
    >
      <RiverPlay metricsRef={metricsRef} />
    </GameShell>
  );
}

// The spec's end screen: basket, fish caught, best streak, wrong
// catches, missed fish, reaction speed. Numbers only — no judgment.
function ResultStats({ metrics }: { metrics: RoundMetrics }) {
  const meanRt = meanReactionTimeMs(metrics);
  const rows: [string, string][] = [
    ["🐟 Fish caught", String(metrics.hits)],
    ["🧺 Basket", `${Math.min(metrics.hits, BASKET_TARGET)}/${BASKET_TARGET}`],
    ["🔥 Best streak", String(metrics.bestStreak)],
    ["🛟 Good saves", String(metrics.goodSaves)],
    ["🙈 Wrong taps", String(metrics.commissions)],
    ["💨 Swam away", String(metrics.omissions)],
  ];
  if (meanRt !== null) {
    rows.push(["⚡ Reaction speed", `${(meanRt / 1000).toFixed(2)}s`]);
  }
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "auto auto",
        gap: "6px 18px",
        padding: "12px 18px",
        borderRadius: 14,
        background: "rgba(255,255,255,0.08)",
        color: "#fff",
        fontSize: 14,
        fontWeight: 600,
      }}
    >
      {rows.map(([label, value]) => (
        <div key={label} style={{ display: "contents" }}>
          <span style={{ opacity: 0.85 }}>{label}</span>
          <span style={{ textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
            {value}
          </span>
        </div>
      ))}
    </div>
  );
}

function RiverPlay({
  metricsRef,
}: {
  metricsRef: React.MutableRefObject<RoundMetrics>;
}) {
  const shell = useGameShell();
  const { canvasRef, getCtx } = useCanvas(GAME_W, GAME_H);

  // ── Per-frame state: refs only (docs/GAME_STANDARDS.md) ────────
  const entitiesRef = useRef<Entity[]>([]);
  const popupsRef = useRef<Popup[]>([]);
  const spawnInRef = useRef(900);
  const clockRef = useRef(createGameTimer());
  const countdownRef = useRef(createCountdown(ROUND_MS));
  // useState (not a ref): bestScore() is read during render for the
  // HUD, and reading a ref in render trips react-hooks/refs.
  const [scoreMgr] = useState(() => createScoreManager(RIVER_CATCH_CONFIG.id));
  const levelRef = useRef(RIVER_CATCH_CONFIG.difficulty.startLevel);
  const stageRef = useRef<RuleStage>(INITIAL_STAGE);
  const streakRef = useRef(0);
  const decisionsRef = useRef(0);
  const flashUntilRef = useRef(0);
  const finishedRef = useRef(false);
  const difficultyRef = useRef(
    createDifficultyEngine(RIVER_CATCH_CONFIG.difficulty, (adj) =>
      trackDifficultyAdjusted(RIVER_CATCH_CONFIG.id, RIVER_CATCH_CONFIG.domain, adj),
    ),
  );

  // ── Human-timescale mirrors for the HUD/chrome ─────────────────
  const [score, setScore] = useState(0);
  const [basket, setBasket] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeftMs, setTimeLeftMs] = useState(ROUND_MS);
  const [rule, setRule] = useState(INITIAL_STAGE.rule);
  const [mood, setMood] = useState<Mood>("happy");
  const moodTimeoutRef = useRef<number | null>(null);

  // Fresh run: GameShell remounts this component per runId, so mount
  // is the reset point for run-scoped stores.
  useEffect(() => {
    metricsRef.current = createRoundMetrics();
    const timeout = moodTimeoutRef;
    return () => {
      if (timeout.current !== null) window.clearTimeout(timeout.current);
    };
  }, [metricsRef]);

  const flashMood = useCallback((m: Mood, ms = 900) => {
    setMood(m);
    if (moodTimeoutRef.current !== null) window.clearTimeout(moodTimeoutRef.current);
    moodTimeoutRef.current = window.setTimeout(() => setMood("happy"), ms);
  }, []);

  const setStreakBoth = useCallback((next: number) => {
    streakRef.current = next;
    setStreak(next);
    if (next > metricsRef.current.bestStreak) {
      metricsRef.current.bestStreak = next;
    }
  }, [metricsRef]);

  const finish = useCallback(
    (outcome: "cleared" | "failed") => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      scoreMgr.commitBest();
      shell.finish({
        score: scoreMgr.score(),
        outcome,
        difficultyLevelReached: levelRef.current,
      });
    },
    [shell, scoreMgr],
  );

  const emitDecision = useCallback((success: boolean, reactionTimeMs?: number) => {
    decisionsRef.current += 1;
    trackRoundCompleted(RIVER_CATCH_CONFIG.id, RIVER_CATCH_CONFIG.domain, {
      roundIndex: decisionsRef.current,
      success,
      reactionTimeMs,
    });
  }, []);

  // ── The frame ──────────────────────────────────────────────────
  useGameLoop(
    (deltaMs) => {
      const clock = clockRef.current;
      const countdown = countdownRef.current;
      clock.tick(deltaMs);
      countdown.tick(deltaMs);
      const now = clock.elapsedMs();

      // Difficulty → active rule stage (can move both ways).
      const level = difficultyRef.current.levelAt(now);
      levelRef.current = level;
      const stage = stageForLevel(level);
      if (stage.stage !== stageRef.current.stage) {
        stageRef.current = stage;
        setRule(stage.rule);
        popupsRef.current.push({
          x: GAME_W / 2, y: RIVER_TOP - 40,
          text: "New rule!", color: "#FFD34D", bornAt: now,
        });
        playTone(880, 120, "triangle", 0.12);
      }
      const tuning = tuningForLevel(level);

      // Spawning.
      spawnInRef.current -= deltaMs;
      if (spawnInRef.current <= 0) {
        entitiesRef.current.push(spawnEntity(stage, tuning, now, GAME_W));
        spawnInRef.current = tuning.spawnIntervalMs * (0.7 + Math.random() * 0.6);
      }

      // Movement + everything that left play this frame.
      const out = stepEntities(entitiesRef.current, deltaMs, now, GAME_W);
      for (const missed of out.omissions) {
        metricsRef.current.omissions += 1;
        setStreakBoth(0);
        difficultyRef.current.recordFailure();
        emitDecision(false);
        popupsRef.current.push({
          x: Math.max(30, Math.min(GAME_W - 30, missed.x)), y: missed.y,
          text: "swam away!", color: "#cfe3ff", bornAt: now,
        });
      }
      for (let i = 0; i < out.goodSaves.length; i++) {
        metricsRef.current.goodSaves += 1;
        const pts = POINTS_GOOD_SAVE * focusMultiplier(streakRef.current);
        setScore(scoreMgr.add(pts));
        setStreakBoth(streakRef.current + 1);
        difficultyRef.current.recordSuccess();
        emitDecision(true);
        playTone(740, 90, "sine", 0.1);
        popupsRef.current.push({
          x: GAME_W / 2, y: RIVER_TOP + 30,
          text: `Good save! +${pts}`, color: "#7ef0a5", bornAt: now,
        });
      }

      // HUD countdown at one-second granularity, not per frame.
      const remaining = countdown.remainingMs();
      setTimeLeftMs((prev) =>
        Math.ceil(prev / 1000) === Math.ceil(remaining / 1000) ? prev : remaining,
      );

      drawScene(
        getCtx(),
        now,
        stage,
        entitiesRef.current,
        popupsRef.current,
        flashUntilRef.current,
        streakRef.current,
      );

      if (countdown.expired()) finish("failed");
    },
    { running: shell.status === "playing" },
  );

  // ── Tap = the go/no-go decision ────────────────────────────────
  const onPointerDown = useCallback(
    (ev: React.PointerEvent<HTMLCanvasElement>) => {
      if (shell.status !== "playing" || finishedRef.current) return;
      const rect = ev.currentTarget.getBoundingClientRect();
      const x = ((ev.clientX - rect.left) / rect.width) * GAME_W;
      const y = ((ev.clientY - rect.top) / rect.height) * GAME_H;
      const hit = hitTest(entitiesRef.current, x, y);
      if (!hit) return;

      const now = clockRef.current.elapsedMs();
      const stage = stageRef.current;

      if (isCorrectCatch(hit, stage)) {
        hit.resolved = true;
        const rt = hit.zoneEnteredAt !== null ? now - hit.zoneEnteredAt : undefined;
        if (rt !== undefined) metricsRef.current.reactionTimesMs.push(rt);
        metricsRef.current.hits += 1;
        const base = hit.kind === "golden" ? POINTS_GOLDEN : POINTS_CATCH;
        const pts = base * focusMultiplier(streakRef.current);
        setScore(scoreMgr.add(pts));
        setStreakBoth(streakRef.current + 1);
        setBasket(metricsRef.current.hits);
        difficultyRef.current.recordSuccess();
        emitDecision(true, rt);
        if (hit.kind === "golden") playSuccess();
        else playHit();
        flashMood("excited", 700);
        popupsRef.current.push({
          x: hit.x, y: hit.y, text: `+${pts}`,
          color: hit.kind === "golden" ? "#FFD34D" : "#9ff0ff", bornAt: now,
        });
        if (metricsRef.current.hits >= BASKET_TARGET) {
          playSuccess();
          finish("cleared");
        }
        return;
      }

      if (
        (hit.kind === "target" || hit.kind === "golden") &&
        stage.requireZone &&
        !inCatchZone(hit.x)
      ) {
        // Right fish, wrong moment — a gentle hint, not an error.
        popupsRef.current.push({
          x: hit.x, y: hit.y, text: "wait for the hook!",
          color: "#ffe9b0", bornAt: now,
        });
        return;
      }

      // Commission: unsafe fish, junk, leaf, fake ripple, or a
      // rule-breaking distractor. The fish escapes; Fumi wobbles.
      hit.resolved = true;
      metricsRef.current.commissions += 1;
      setStreakBoth(0);
      difficultyRef.current.recordFailure();
      emitDecision(false);
      playFail();
      flashMood(hit.kind === "ripple" ? "thinking" : "worried", 900);
      flashUntilRef.current = now + 260;
      popupsRef.current.push({
        x: hit.x, y: hit.y,
        text: hit.kind === "ripple" ? "just a ripple!" : "oops!",
        color: "#ffb3ab", bornAt: now,
      });
    },
    [shell.status, emitDecision, finish, flashMood, metricsRef, setStreakBoth, scoreMgr],
  );

  const basketPct = Math.round((basket / BASKET_TARGET) * 100);
  const focusFlow = streak >= FOCUS_FLOW_STREAK;

  return (
    <div style={{ position: "absolute", inset: 0, background: "#27476E" }}>
      <canvas
        ref={canvasRef}
        onPointerDown={onPointerDown}
        style={{ width: "100%", height: "100%", display: "block", touchAction: "none" }}
      />
      {/* Fumi on her rock, reacting to how the fishing is going. */}
      <div
        style={{
          position: "absolute",
          left: "2%",
          bottom: "13%",
          pointerEvents: "none",
          transform: mood === "worried" ? "rotate(-5deg)" : undefined,
          transition: "transform 180ms ease",
        }}
      >
        <Bobo mood={mood} tint={FUMI_TINT} size={120} />
      </div>

      <HUD score={score} best={scoreMgr.bestScore()} timeLeftMs={timeLeftMs} />

      {/* Catch Rule Card + basket meter + streak. */}
      <div
        style={{
          position: "absolute",
          top: 100,
          left: "50%",
          transform: "translateX(-50%)",
          width: "max-content",
          maxWidth: "92%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 6,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            padding: "8px 16px",
            borderRadius: 999,
            background: "rgba(0,0,0,0.45)",
            color: "#fff",
            fontSize: 15,
            fontWeight: 700,
            textAlign: "center",
          }}
        >
          {rule}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            aria-label={`Food basket ${basket} of ${BASKET_TARGET}`}
            style={{
              width: 130,
              height: 12,
              borderRadius: 999,
              background: "rgba(0,0,0,0.4)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${basketPct}%`,
                height: "100%",
                borderRadius: 999,
                background: "#FFD34D",
                transition: "width 240ms ease",
              }}
            />
          </div>
          <span style={{ fontSize: 14 }}>🧺</span>
          {streak > 1 && (
            <span
              style={{
                fontSize: 13,
                fontWeight: 800,
                color: focusFlow ? "#FFD34D" : "#fff",
                background: "rgba(0,0,0,0.4)",
                borderRadius: 999,
                padding: "3px 10px",
              }}
            >
              {focusFlow ? `🔥 Focus Flow ×${FOCUS_FLOW_MULTIPLIER}` : `🔥 ${streak}`}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Static background cache ──────────────────────────────────────
// The sky/sun/mountains/river/bank never change, so they render once
// to an offscreen canvas (per devicePixelRatio) and blit as a single
// drawImage per frame — rebuilding two gradients and ~15 paths at
// 60fps was the scene's whole allocation budget
// (docs/GAME_STANDARDS.md: no allocations in the hot loop).
let bgCache: HTMLCanvasElement | null = null;
let bgCacheDpr = 0;

function staticBackground(dpr: number): HTMLCanvasElement | null {
  if (bgCache && bgCacheDpr === dpr) return bgCache;
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(GAME_W * dpr);
  canvas.height = Math.round(GAME_H * dpr);
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.scale(dpr, dpr);

  // Sunset sky.
  const sky = ctx.createLinearGradient(0, 0, 0, RIVER_TOP);
  sky.addColorStop(0, "#F9B97F");
  sky.addColorStop(0.6, "#F58E7E");
  sky.addColorStop(1, "#C96F8E");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, GAME_W, RIVER_TOP);

  // Sun + mountains + treeline.
  ctx.fillStyle = "rgba(255, 236, 179, 0.9)";
  ctx.beginPath();
  ctx.arc(300, 150, 42, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#8A5A83";
  ctx.beginPath();
  ctx.moveTo(0, RIVER_TOP);
  ctx.lineTo(90, 170);
  ctx.lineTo(200, RIVER_TOP);
  ctx.lineTo(280, 210);
  ctx.lineTo(400, RIVER_TOP);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#5D3F66";
  ctx.fillRect(0, RIVER_TOP - 18, GAME_W, 18);

  // River.
  const river = ctx.createLinearGradient(0, RIVER_TOP, 0, RIVER_BOTTOM + 60);
  river.addColorStop(0, "#3E7CB1");
  river.addColorStop(1, "#27476E");
  ctx.fillStyle = river;
  ctx.fillRect(0, RIVER_TOP, GAME_W, RIVER_BOTTOM + 60 - RIVER_TOP);

  // Riverbank + Fumi's rock (the DOM cat sits on top of this).
  ctx.fillStyle = "#3E5C3A";
  ctx.fillRect(0, GAME_H - 160, GAME_W, 160);
  ctx.fillStyle = "#7B8794";
  ctx.beginPath();
  ctx.ellipse(84, GAME_H - 150, 78, 34, 0, 0, Math.PI * 2);
  ctx.fill();

  bgCache = canvas;
  bgCacheDpr = dpr;
  return canvas;
}

// ── Scene painting — module-level, pure canvas + passed data ─────
function drawScene(
  ctx: CanvasRenderingContext2D | null,
  now: number,
  stage: RuleStage,
  entities: Entity[],
  popups: Popup[],
  flashUntil: number,
  streak: number,
): void {
  if (!ctx) return;
  const focusFlow = streak >= FOCUS_FLOW_STREAK;

    // Static layers in one blit.
    const bg = staticBackground(Math.max(1, window.devicePixelRatio || 1));
    if (bg) ctx.drawImage(bg, 0, 0, GAME_W, GAME_H);

    // Gentle shimmer lines.
    ctx.strokeStyle = "rgba(255,255,255,0.16)";
    ctx.lineWidth = 2;
    for (let i = 0; i < 5; i++) {
      const y = RIVER_TOP + 44 + i * 58 + Math.sin(now / 900 + i) * 5;
      ctx.beginPath();
      ctx.moveTo(20 + ((now / 24 + i * 90) % 80), y);
      ctx.lineTo(90 + ((now / 24 + i * 90) % 80), y);
      ctx.stroke();
    }

    // Catch zone band — brighter once the rule demands it.
    ctx.fillStyle = `rgba(255, 255, 255, ${stage.requireZone ? 0.1 : 0.05})`;
    ctx.fillRect(HOOK_X - CATCH_ZONE_HALF_W, RIVER_TOP, CATCH_ZONE_HALF_W * 2, RIVER_BOTTOM - RIVER_TOP);

    // Rod + line + hook; the rod tip glows while a catchable target
    // is in the zone (the spec's alertness cue).
    const targetInZone = entities.some(
      (e) => !e.resolved && (e.kind === "target" || e.kind === "golden") && inCatchZone(e.x),
    );
    ctx.strokeStyle = "#5B3B22";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(78, GAME_H - 190);
    ctx.quadraticCurveTo(150, RIVER_TOP - 120, HOOK_X, RIVER_TOP - 70);
    ctx.stroke();
    ctx.strokeStyle = "rgba(255,255,255,0.75)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(HOOK_X, RIVER_TOP - 70);
    ctx.lineTo(HOOK_X, RIVER_TOP + 52);
    ctx.stroke();
    ctx.save();
    if (targetInZone || focusFlow) {
      ctx.shadowColor = "#FFD34D";
      ctx.shadowBlur = 14;
    }
    ctx.strokeStyle = "#FFD34D";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(HOOK_X + 4, RIVER_TOP + 58, 7, Math.PI * 0.15, Math.PI * 1.2);
    ctx.stroke();
    ctx.restore();

    // Entities.
    for (const e of entities) {
      if (e.resolved) continue;
      if (e.kind === "ripple") {
        const age = (now - e.bornAt) / e.lifeMs;
        ctx.strokeStyle = `rgba(255,255,255,${0.5 * (1 - age)})`;
        ctx.lineWidth = 2;
        for (let r = 0; r < 3; r++) {
          ctx.beginPath();
          ctx.arc(e.x, e.y, 6 + age * 26 + r * 8, 0, Math.PI * 2);
          ctx.stroke();
        }
        continue;
      }
      if (e.emoji) {
        ctx.font = EMOJI_FONT;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(e.emoji, e.x, e.y);
        continue;
      }
      drawFish(ctx, e, now);
    }

    // Floating popups.
    for (let i = popups.length - 1; i >= 0; i--) {
      const p = popups[i];
      const age = (now - p.bornAt) / 1100;
      if (age >= 1) {
        popups.splice(i, 1);
        continue;
      }
      ctx.globalAlpha = 1 - age;
      ctx.fillStyle = p.color;
      ctx.font = "bold 20px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(p.text, p.x, p.y - age * 42);
      ctx.globalAlpha = 1;
    }

    // Focus Flow river glow.
    if (focusFlow) {
      ctx.fillStyle = "rgba(255, 211, 77, 0.10)";
      ctx.fillRect(0, RIVER_TOP, GAME_W, RIVER_BOTTOM + 60 - RIVER_TOP);
    }

    // Brief soft flash after a wrong tap.
    if (now < flashUntil) {
      ctx.fillStyle = "rgba(255, 120, 100, 0.12)";
      ctx.fillRect(0, 0, GAME_W, GAME_H);
    }
  }

// Stylized side-view fish. Color carries the rule; shape carries it
// too (unsafe fish get spiky fins + a frown) so no state is
// color-only (docs/GAME_UI_GUIDELINES.md).
const FISH_COLORS: Record<Entity["color"], string> = {
  blue: "#4FA3E3",
  green: "#57C785",
  red: "#E4572E",
  gold: "#F4C430",
  plain: "#8FA3B0",
};

function drawFish(ctx: CanvasRenderingContext2D, e: Entity, now: number) {
  const dir = e.vx >= 0 ? 1 : -1;
  const bob = Math.sin(now / 300 + e.id) * 3;
  const x = e.x;
  const y = e.y + bob;
  const s = e.size;
  const fill = FISH_COLORS[e.color];

  ctx.save();
  if (e.kind === "golden") {
    ctx.shadowColor = "#FFD34D";
    ctx.shadowBlur = 16;
  }

  // Tail.
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.moveTo(x - dir * s * 0.55, y);
  ctx.lineTo(x - dir * s * 0.95, y - s * 0.35);
  ctx.lineTo(x - dir * s * 0.95, y + s * 0.35);
  ctx.closePath();
  ctx.fill();

  // Body.
  ctx.beginPath();
  ctx.ellipse(x, y, s * 0.6, s * 0.38, 0, 0, Math.PI * 2);
  ctx.fill();

  // Unsafe fish: spiky dorsal fin — readable without color.
  if (e.kind === "unsafe") {
    ctx.beginPath();
    for (let i = -2; i <= 2; i++) {
      ctx.moveTo(x + i * s * 0.18, y - s * 0.3);
      ctx.lineTo(x + i * s * 0.18 + s * 0.09, y - s * 0.62);
      ctx.lineTo(x + i * s * 0.18 + s * 0.18, y - s * 0.3);
    }
    ctx.fill();
  }

  // Eye.
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(x + dir * s * 0.32, y - s * 0.08, s * 0.11, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#1c2030";
  ctx.beginPath();
  ctx.arc(x + dir * s * 0.35, y - s * 0.08, s * 0.055, 0, Math.PI * 2);
  ctx.fill();

  // Sparkle — the stage-2 rule cue.
  if (e.sparkle) {
    ctx.fillStyle = "rgba(255,255,255,0.95)";
    for (let i = 0; i < 3; i++) {
      const sx = x - dir * s * (0.1 + i * 0.16);
      const sy = y - s * 0.05 + (i % 2 === 0 ? -4 : 5);
      const r = 2.4 - i * 0.5;
      ctx.beginPath();
      ctx.moveTo(sx, sy - r * 2);
      ctx.lineTo(sx + r, sy);
      ctx.lineTo(sx, sy + r * 2);
      ctx.lineTo(sx - r, sy);
      ctx.closePath();
      ctx.fill();
    }
  }

  ctx.restore();
}
