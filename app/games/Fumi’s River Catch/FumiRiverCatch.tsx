"use client";

// Fumi's River Catch — a cozy attention-training mini-game.
//
// Same construction pattern as the app's other mini-games
// (BirdSpikeGame / SnackCatchGame): a Canvas2D layer renders the world
// (river, fish, particles) at 60fps via a mutable-ref RAF loop, while
// the mascot + HUD live as DOM overlays so React only re-renders on
// discrete events (score, rule change, mood) rather than every frame.
//
// Scope note: the original spec asks for a Unity/Phaser 3D production
// with day/night cycles, 6 separate modes, and unlockable gear. This
// build focuses on one strong, fully-realized core loop — swimming
// fish, a rotating rule card, full catch/miss feedback, combo/basket
// systems, difficulty ramp, and real cognitive metrics — in the
// hand-drawn Canvas2D + SVG style this codebase already uses. Weather
// variation, unlockables, and additional modes are natural follow-ups
// once this loop is validated.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Bobo } from "../../components/Mascot";
import type { Mood } from "../../lib/data";
import {
  BASKET_TARGET,
  DISTRACTOR_SPECIES,
  FLOW_STREAK,
  GLOW_STREAK,
  RULES,
  RULE_DURATION_MS,
  SAFE_SPECIES,
  SESSION_MS,
  difficultyAt,
  type Rule,
  type Species,
} from "./riverCatchConfig";
import {
  bestStars,
  createSessionRecorder,
  persistSession,
  type SessionSummary,
} from "./riverCatchMetrics";

const GAME_W = 400;
const GAME_H = 800;
const RIVER_TOP = 250;
const RIVER_BOTTOM = 740;
// Height of the grassy bank Fumi and the basket stand on — tall enough
// that her feet (DOM-positioned near canvas y≈756) land clearly inside
// it instead of right at the water's edge.
const GRASS_H = 80;
const CATCH_ANIM_MS = 380;
// Where caught fish fly to — roughly Fumi's basket, bottom-left bank.
const BASKET_ANCHOR = { x: 108, y: 706 };
// Fumi's fishing rod — base sits right at her raised right paw (Bobo's
// default paw pose, unaffected by armsDown), tip reaching out over the
// water. The line drawn from the tip to a hooked fish is what sells the
// "reeling it in" catch animation.
const ROD_BASE = { x: 92, y: 742 };
const ROD_TIP = { x: 150, y: 572 };
const FLICK_MS = 260;

type GameState = "idle" | "playing" | "paused" | "announcing" | "ended";
// How long a rule announcement holds center-screen before flying back
// up to the HUD and resuming play.
const RULE_ANNOUNCE_MS = 4000;

const DEPTH_BANDS = [
  { yMin: 300, yMax: 380, speed: 0.62, scale: 0.72 },
  { yMin: 410, yMax: 500, speed: 0.86, scale: 0.94 },
  { yMin: 530, yMax: 630, speed: 1.15, scale: 1.2 },
] as const;

type Entity = {
  id: number;
  species: Species;
  x: number;
  y: number;
  baseY: number;
  vx: number;
  dir: 1 | -1;
  scale: number;
  bobPhase: number;
  swimPhase: number;
  spawnedAt: number;
  jumping: boolean;
  jumpStart: number;
  caught: boolean;
  caughtAt: number;
  caughtFromX: number;
  caughtFromY: number;
  wrong: boolean;
  countedMiss: boolean;
};

type Particle = { x: number; y: number; vx: number; vy: number; life: number; color: string; drop?: boolean };
type Popup = { x: number; y: number; text: string; color: string; born: number };
type SplashRing = { x: number; y: number; born: number; color: string };
type Cloud = { x: number; y: number; r: number; speed: number };
type Bird = { x: number; y: number; speed: number; phase: number };
type Bubble = { x: number; y: number; vy: number; r: number; wobble: number };
type Decor = { x: number; y: number; kind: "lily" | "leaf"; speed: number; phase: number };
type Rock = { x: number; y: number; r: number };
type Flower = { x: number; color: string; phase: number };
type Pollen = { x: number; y: number; speed: number; phase: number; r: number };

const COLOR_HEX: Record<Species["color"], string> = {
  blue: "#2bb6ff",
  yellow: "#ffe066",
  gold: "#ffc93c",
  red: "#ff6b6b",
  murky: "#75886a",
};
const COLOR_HEX_LIGHT: Record<Species["color"], string> = {
  blue: "#a7e6ff",
  yellow: "#fff3c4",
  gold: "#ffe89a",
  red: "#ffc2c2",
  murky: "#b9c7ac",
};

let uid = 1;

export function FumiRiverCatch({
  onExit,
  onSessionEnd,
}: {
  onExit: () => void;
  onSessionEnd?: (summary: SessionSummary) => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [gameState, setGameState] = useState<GameState>("idle");
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [basketPercent, setBasketPercent] = useState(0);
  const [basketsFilled, setBasketsFilled] = useState(0);
  const [ruleIndex, setRuleIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(SESSION_MS / 1000);
  const [mascotMood, setMascotMood] = useState<Mood>("happy");
  const [flowActive, setFlowActive] = useState(false);
  const [celebrateKey, setCelebrateKey] = useState(0);
  const [hopKey, setHopKey] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [endSummary, setEndSummary] = useState<SessionSummary | null>(null);
  const [beatHighScore, setBeatHighScore] = useState(false);

  // ── Mutable engine state (kept off React so the loop stays 60fps) ──
  const entitiesRef = useRef<Entity[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const popupsRef = useRef<Popup[]>([]);
  const splashRef = useRef<SplashRing[]>([]);
  const cloudsRef = useRef<Cloud[]>([]);
  const birdsRef = useRef<Bird[]>([]);
  const bubblesRef = useRef<Bubble[]>([]);
  const decorRef = useRef<Decor[]>([]);
  const rocksRef = useRef<Rock[]>([]);
  const flowersRef = useRef<Flower[]>([]);
  const pollenRef = useRef<Pollen[]>([]);
  const lastTimeRef = useRef(0);
  const playStartRef = useRef(0);
  const pausedAccumRef = useRef(0);
  const pauseBeganAtRef = useRef(0);
  const spawnTimerRef = useRef(1200);
  const ruleStartRef = useRef(0);
  const ruleIndexRef = useRef(0);
  const comboRef = useRef(0);
  const basketCountRef = useRef(0);
  const flowActiveRef = useRef(false);
  const lastSadAtRef = useRef(-9999);
  const lastCatchAtRef = useRef(-9999);
  const lastSecondRef = useRef(-1);
  const rafRef = useRef(0);
  const audioRef = useRef<AudioContext | null>(null);
  const moodTimeoutRef = useRef<number | null>(null);
  const baseMoodRef = useRef<Mood>("happy");
  const recorderRef = useRef(createSessionRecorder(0));
  const soundOnRef = useRef(true);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    soundOnRef.current = soundOn;
  }, [soundOn]);
  useEffect(() => {
    reducedMotionRef.current = reducedMotion;
  }, [reducedMotion]);

  // Reduced-motion / saved settings, once on mount.
  useEffect(() => {
    try {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      const saved = window.localStorage.getItem("fumi-river-catch-settings");
      if (saved) {
        const parsed = JSON.parse(saved) as { soundOn?: boolean; reducedMotion?: boolean };
        if (typeof parsed.soundOn === "boolean") setSoundOn(parsed.soundOn);
        if (typeof parsed.reducedMotion === "boolean") setReducedMotion(parsed.reducedMotion);
        else setReducedMotion(mq.matches);
      } else {
        setReducedMotion(mq.matches);
      }
    } catch {
      /* ignore */
    }
  }, []);
  useEffect(() => {
    try {
      window.localStorage.setItem(
        "fumi-river-catch-settings",
        JSON.stringify({ soundOn, reducedMotion }),
      );
    } catch {
      /* ignore */
    }
  }, [soundOn, reducedMotion]);

  const currentRule = useMemo<Rule>(() => RULES[ruleIndex % RULES.length], [ruleIndex]);
  const currentRuleRef = useRef(currentRule);
  useEffect(() => {
    currentRuleRef.current = currentRule;
  }, [currentRule]);

  // ── Audio (Web Audio, synthesized — no external files) ──────────
  const ensureAudio = useCallback(() => {
    if (!audioRef.current) {
      const AC = (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext) as typeof AudioContext;
      audioRef.current = new AC();
    }
    return audioRef.current;
  }, []);
  const tone = useCallback(
    (freq: number, dur: number, type: OscillatorType = "sine", gainV = 0.16, delay = 0) => {
      if (!soundOnRef.current) return;
      try {
        const ac = ensureAudio();
        const osc = ac.createOscillator();
        const g = ac.createGain();
        osc.type = type;
        osc.frequency.value = freq;
        const start = ac.currentTime + delay;
        g.gain.setValueAtTime(gainV, start);
        g.gain.exponentialRampToValueAtTime(0.001, start + dur);
        osc.connect(g);
        g.connect(ac.destination);
        osc.start(start);
        osc.stop(start + dur);
      } catch {
        /* audio blocked — silently continue */
      }
    },
    [ensureAudio],
  );
  const catchTone = useCallback(
    (rare: boolean) => {
      tone(660, 0.1, "triangle", 0.18);
      tone(880, 0.12, "triangle", 0.12, 0.05);
      if (rare) tone(1320, 0.18, "sine", 0.12, 0.1);
    },
    [tone],
  );
  const wrongTone = useCallback(() => tone(220, 0.16, "sine", 0.1), [tone]);
  const basketFullTone = useCallback(() => {
    tone(523, 0.14, "triangle", 0.16);
    tone(659, 0.14, "triangle", 0.16, 0.1);
    tone(784, 0.22, "triangle", 0.18, 0.2);
  }, [tone]);
  const vibrate = useCallback((pattern: number | number[]) => {
    try {
      navigator.vibrate?.(pattern);
    } catch {
      /* no-op */
    }
  }, []);

  // ── Mood helpers ──────────────────────────────────────────────
  const pulseMood = useCallback((mood: Mood, ms: number) => {
    if (moodTimeoutRef.current) window.clearTimeout(moodTimeoutRef.current);
    setMascotMood(mood);
    moodTimeoutRef.current = window.setTimeout(() => {
      setMascotMood(baseMoodRef.current);
    }, ms);
  }, []);

  // ── Spawning ──────────────────────────────────────────────────
  const weightedPick = (pool: Species[], rule: Rule) => {
    const weights = pool.map((s) => s.weight * (rule.bias?.(s) ?? 1));
    const total = weights.reduce((a, b) => a + b, 0);
    let r = Math.random() * total;
    for (let i = 0; i < pool.length; i++) {
      r -= weights[i];
      if (r <= 0) return pool[i];
    }
    return pool[pool.length - 1];
  };

  const spawnEntity = useCallback((now: number, distractorRatio: number, speedMul: number) => {
    const rule = currentRuleRef.current;
    const isDistractor = Math.random() < distractorRatio;
    const species = weightedPick(isDistractor ? DISTRACTOR_SPECIES : SAFE_SPECIES, rule);
    const band = DEPTH_BANDS[Math.floor(Math.random() * DEPTH_BANDS.length)];
    const dir: 1 | -1 = Math.random() < 0.5 ? 1 : -1;
    const baseY = band.yMin + Math.random() * (band.yMax - band.yMin);
    const startX = dir === 1 ? -50 * band.scale : GAME_W + 50 * band.scale;
    const baseSpeed = 1.15 * band.speed * speedMul;
    const e: Entity = {
      id: uid++,
      species,
      x: startX,
      y: baseY,
      baseY,
      vx: baseSpeed * dir,
      dir,
      scale: band.scale,
      bobPhase: Math.random() * Math.PI * 2,
      swimPhase: Math.random() * Math.PI * 2,
      spawnedAt: now,
      jumping: false,
      jumpStart: 0,
      caught: false,
      caughtAt: 0,
      caughtFromX: 0,
      caughtFromY: 0,
      wrong: false,
      countedMiss: false,
    };
    entitiesRef.current.push(e);
    if (species.safe && rule.matches(species)) {
      recorderRef.current.recordSpawnedCorrect();
    }
  }, []);

  // ── Ambient world init (clouds / birds / bubbles / decor) ──────
  const seedAmbience = useCallback(() => {
    cloudsRef.current = Array.from({ length: 4 }, (_, i) => ({
      x: (i / 4) * GAME_W + Math.random() * 60,
      y: 40 + Math.random() * 90,
      r: 26 + Math.random() * 20,
      speed: 0.06 + Math.random() * 0.05,
    }));
    birdsRef.current = Array.from({ length: 2 }, (_, i) => ({
      x: -40 - i * 200,
      y: 90 + Math.random() * 60,
      speed: 0.5 + Math.random() * 0.3,
      phase: Math.random() * Math.PI * 2,
    }));
    bubblesRef.current = [];
    decorRef.current = Array.from({ length: 6 }, (_, i) => ({
      x: Math.random() * GAME_W,
      y: RIVER_TOP + 20 + Math.random() * (RIVER_BOTTOM - RIVER_TOP - 40),
      kind: i % 2 === 0 ? "lily" : "leaf",
      speed: 0.08 + Math.random() * 0.1,
      phase: Math.random() * Math.PI * 2,
    }));
    rocksRef.current = Array.from({ length: 4 }, (_, i) => ({
      x: 30 + i * (GAME_W - 60) / 3 + Math.random() * 20,
      y: RIVER_BOTTOM + 10 + Math.random() * 14,
      r: 12 + Math.random() * 14,
    }));
    const flowerColors = ["#ff6fa5", "#ffd93d", "#ff9f4d", "#c084fc", "#ffffff"];
    flowersRef.current = Array.from({ length: 14 }, () => ({
      x: Math.random() * GAME_W,
      color: flowerColors[Math.floor(Math.random() * flowerColors.length)],
      phase: Math.random() * Math.PI * 2,
    }));
    pollenRef.current = Array.from({ length: 16 }, () => ({
      x: Math.random() * GAME_W,
      y: Math.random() * GAME_H,
      speed: 0.12 + Math.random() * 0.2,
      phase: Math.random() * Math.PI * 2,
      r: 1.4 + Math.random() * 1.6,
    }));
  }, []);

  // ── Tap handling ────────────────────────────────────────────────
  const handleTap = useCallback(
    (clientX: number, clientY: number) => {
      const canvas = canvasRef.current;
      if (!canvas || gameState !== "playing") return;
      const rect = canvas.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width) * GAME_W;
      const y = ((clientY - rect.top) / rect.height) * GAME_H;
      const now = performance.now();

      let hit: Entity | null = null;
      let bestDist = Infinity;
      for (const e of entitiesRef.current) {
        if (e.caught || e.wrong) continue;
        const r = Math.max(30, 22 * e.scale) + 14; // generous, accessible touch target
        const d = Math.hypot(e.x - x, e.y - y);
        if (d <= r && d < bestDist) {
          bestDist = d;
          hit = e;
        }
      }

      const rule = currentRuleRef.current;
      splashRef.current.push({ x, y, born: now, color: hit ? "rgba(255,255,255,0.5)" : "rgba(180,210,255,0.35)" });

      if (!hit) {
        recorderRef.current.recordTap({
          x: x / GAME_W,
          y: y / GAME_H,
          hit: false,
          correct: null,
          ruleId: rule.id,
          speciesId: null,
          reactionMs: null,
          now,
        });
        return;
      }

      const correct = rule.matches(hit.species);
      recorderRef.current.recordTap({
        x: x / GAME_W,
        y: y / GAME_H,
        hit: true,
        correct,
        ruleId: rule.id,
        speciesId: hit.species.id,
        reactionMs: now - hit.spawnedAt,
        now,
      });

      if (correct) {
        hit.caught = true;
        hit.caughtAt = now;
        hit.caughtFromX = hit.x;
        hit.caughtFromY = hit.y;
        lastCatchAtRef.current = now;

        // a little flash of sparks right at the rod tip — the "line just
        // fired" moment, before it visibly reels the fish in
        for (let i = 0; i < 7; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 0.8 + Math.random() * 1.6;
          particlesRef.current.push({
            x: ROD_TIP.x,
            y: ROD_TIP.y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 0,
            color: "#fff6c9",
          });
        }

        const flowMul = flowActiveRef.current ? 2 : 1;
        const gained = hit.species.points * flowMul;
        setScore((s) => s + gained);

        comboRef.current += 1;
        setCombo(comboRef.current);
        recorderRef.current.recordStreak(comboRef.current);

        if (comboRef.current === FLOW_STREAK) {
          flowActiveRef.current = true;
          setFlowActive(true);
        }
        // Fumi stays visibly delighted once a streak is going, not just
        // during Focus Flow — makes her read as happy/playful more often.
        baseMoodRef.current = comboRef.current >= GLOW_STREAK ? "excited" : "happy";
        pulseMood("excited", 550);
        setHopKey((k) => k + 1);

        basketCountRef.current += 1;
        const pct = Math.min(100, Math.round((basketCountRef.current / BASKET_TARGET) * 100));
        setBasketPercent(pct);
        if (basketCountRef.current >= BASKET_TARGET) {
          basketCountRef.current = 0;
          setBasketPercent(0);
          setBasketsFilled((n) => n + 1);
          recorderRef.current.recordBasketFilled();
          setScore((s) => s + 40);
          setCelebrateKey((k) => k + 1);
          basketFullTone();
          vibrate([20, 30, 20]);
          pulseMood("cheer", 1400);
        } else {
          catchTone(hit.species.sparkle);
          vibrate(hit.species.sparkle ? 30 : 15);
        }

        for (let i = 0; i < (hit.species.sparkle ? 16 : 10); i++) {
          const angle = (Math.PI * 2 * i) / 10 + Math.random() * 0.4;
          const speed = 1.2 + Math.random() * 2;
          particlesRef.current.push({
            x: hit.x,
            y: hit.y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 1,
            life: 0,
            color: hit.species.sparkle ? "#ffe27a" : COLOR_HEX[hit.species.color],
          });
        }
        // water droplets kick up from the splash, arcing under gravity
        for (let i = 0; i < 8; i++) {
          const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.8;
          const speed = 1.8 + Math.random() * 2.4;
          particlesRef.current.push({
            x: hit.x,
            y: hit.y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 0,
            color: "#eafcff",
            drop: true,
          });
        }
        popupsRef.current.push({
          x: hit.x,
          y: hit.y - 20,
          text: `+${gained}`,
          color: "#2f9e44",
          born: now,
        });
      } else {
        hit.wrong = true;
        hit.vx *= 2.4;
        comboRef.current = 0;
        setCombo(0);
        flowActiveRef.current = false;
        setFlowActive(false);
        baseMoodRef.current = "happy";
        pulseMood("worried", 650);
        wrongTone();
        popupsRef.current.push({ x: hit.x, y: hit.y - 18, text: "✕", color: "#d23b3b", born: now });
        for (let i = 0; i < 6; i++) {
          const angle = Math.random() * Math.PI * 2;
          particlesRef.current.push({
            x: hit.x,
            y: hit.y,
            vx: Math.cos(angle) * 1.4,
            vy: Math.sin(angle) * 1.4,
            life: 0,
            color: "#dff0ee",
            drop: true,
          });
        }
      }
    },
    [gameState, pulseMood, catchTone, wrongTone, basketFullTone, vibrate],
  );

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("[data-hud]")) return;
    ensureAudio();
    handleTap(e.clientX, e.clientY);
  };

  // ── Lifecycle ─────────────────────────────────────────────────
  const startGame = useCallback(() => {
    entitiesRef.current = [];
    particlesRef.current = [];
    popupsRef.current = [];
    splashRef.current = [];
    seedAmbience();
    spawnTimerRef.current = 300;
    ruleStartRef.current = 0;
    ruleIndexRef.current = Math.floor(Math.random() * RULES.length);
    comboRef.current = 0;
    basketCountRef.current = 0;
    flowActiveRef.current = false;
    lastSadAtRef.current = -9999;
    lastSecondRef.current = -1;
    lastTimeRef.current = 0;
    playStartRef.current = 0;
    pausedAccumRef.current = 0;
    recorderRef.current = createSessionRecorder(performance.now());
    baseMoodRef.current = "happy";
    setScore(0);
    setCombo(0);
    setBasketPercent(0);
    setBasketsFilled(0);
    setRuleIndex(ruleIndexRef.current);
    setSecondsLeft(SESSION_MS / 1000);
    setMascotMood("happy");
    setFlowActive(false);
    setEndSummary(null);
    // Announce the very first rule too — the timer/difficulty clock only
    // starts once we drop into "playing" after it, via the effect below.
    setGameState("announcing");

    // Paint one static frame right away so the first announcement isn't
    // shown over a blank canvas — the RAF loop hasn't drawn anything yet.
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      const t0 = performance.now();
      ctx.clearRect(0, 0, GAME_W, GAME_H);
      drawSky(ctx, t0);
      drawMountainsAndForest(ctx, t0);
      drawRiver(ctx, t0, rocksRef.current, flowersRef.current);
    }
  }, [seedAmbience]);

  const endGame = useCallback(() => {
    const summary = recorderRef.current.finalize(performance.now());
    const prevBest = bestStars();
    persistSession(summary);
    setBeatHighScore(summary.starsEarned > prevBest);
    setEndSummary(summary);
    setGameState("ended");
    onSessionEnd?.(summary);
  }, [onSessionEnd]);

  const togglePause = useCallback(() => {
    setGameState((s) => {
      if (s === "playing") {
        pauseBeganAtRef.current = performance.now();
        return "paused";
      }
      if (s === "paused") {
        pausedAccumRef.current += performance.now() - pauseBeganAtRef.current;
        lastTimeRef.current = 0;
        return "playing";
      }
      return s;
    });
  }, []);

  // A rule announcement holds center-screen for a fixed beat, then hands
  // back to normal play. `playStartRef` being 0 means this is the very
  // first announcement (before the session clock has ever ticked), so
  // there's no paused-time gap to account for yet.
  useEffect(() => {
    if (gameState !== "announcing") return;
    const id = window.setTimeout(() => {
      if (playStartRef.current) {
        pausedAccumRef.current += performance.now() - pauseBeganAtRef.current;
      }
      lastTimeRef.current = 0;
      setGameState("playing");
    }, RULE_ANNOUNCE_MS);
    return () => window.clearTimeout(id);
  }, [gameState]);

  // ── Main RAF loop ───────────────────────────────────────────────
  useEffect(() => {
    if (gameState !== "playing") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const loop = (t: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = t;
      if (!playStartRef.current) playStartRef.current = t;
      const dt = Math.min(3, (t - lastTimeRef.current) / 16.67);
      lastTimeRef.current = t;

      const elapsed = t - playStartRef.current - pausedAccumRef.current;
      const diff = difficultyAt(elapsed);
      const rule = currentRuleRef.current;

      // ── Session countdown ──
      const msLeft = Math.max(0, SESSION_MS - elapsed);
      const secLeft = Math.ceil(msLeft / 1000);
      if (secLeft !== lastSecondRef.current) {
        lastSecondRef.current = secLeft;
        setSecondsLeft(secLeft);
      }
      if (msLeft <= 0) {
        endGame();
        return;
      }

      // ── Rule rotation ── pauses play and announces the new rule
      // center-screen so the child has a clear beat to read it.
      if (elapsed - ruleStartRef.current >= RULE_DURATION_MS) {
        ruleStartRef.current = elapsed;
        let next = Math.floor(Math.random() * RULES.length);
        if (RULES.length > 1 && next === ruleIndexRef.current) next = (next + 1) % RULES.length;
        ruleIndexRef.current = next;
        setRuleIndex(next);
        tone(740, 0.1, "sine", 0.08);
        pauseBeganAtRef.current = t;
        setGameState("announcing");
        return;
      }

      // ── Spawn ──
      spawnTimerRef.current -= dt * 16.67;
      if (spawnTimerRef.current <= 0 && entitiesRef.current.length < diff.maxConcurrent) {
        spawnTimerRef.current = diff.spawnIntervalMs * (0.7 + Math.random() * 0.6);
        spawnEntity(t, diff.distractorRatio, diff.speedMul * (flowActiveRef.current ? 0.72 : 1));
      }

      // ── Update entities ──
      const next: Entity[] = [];
      for (const e of entitiesRef.current) {
        if (e.caught) {
          const k = Math.min(1, (t - e.caughtAt) / CATCH_ANIM_MS);
          const ease = 1 - (1 - k) ** 3;
          const baseX = e.caughtFromX + (BASKET_ANCHOR.x - e.caughtFromX) * ease;
          const baseY = e.caughtFromY + (BASKET_ANCHOR.y - e.caughtFromY) * ease;
          // a little "still fighting" wiggle perpendicular to the reel-in
          // path, fading out as it nears the basket — feels alive, not
          // just a fish sliding on rails
          const dx = BASKET_ANCHOR.x - e.caughtFromX;
          const dy = BASKET_ANCHOR.y - e.caughtFromY;
          const len = Math.hypot(dx, dy) || 1;
          const wiggle = Math.sin(k * Math.PI * 5) * 9 * (1 - k);
          e.x = baseX + (-dy / len) * wiggle;
          e.y = baseY + (dx / len) * wiggle;
          if (k < 1) next.push(e);
          continue;
        }

        e.x += e.vx * dt;
        e.swimPhase += dt * 0.22;
        if (!e.jumping && e.species.kind === "fish" && Math.random() < 0.0009 * dt) {
          e.jumping = true;
          e.jumpStart = t;
        }
        let jumpOffset = 0;
        if (e.jumping) {
          const jp = (t - e.jumpStart) / 460;
          if (jp >= 1) e.jumping = false;
          else jumpOffset = -Math.sin(jp * Math.PI) * 16 * e.scale;
        }
        e.y = e.baseY + Math.sin(t / 500 + e.bobPhase) * 5 * e.scale + jumpOffset;

        const offLeft = e.x < -70 * e.scale;
        const offRight = e.x > GAME_W + 70 * e.scale;
        if (offLeft || offRight) {
          if (!e.wrong && !e.countedMiss && e.species.safe && rule.matches(e.species)) {
            e.countedMiss = true;
            recorderRef.current.recordMiss({ ruleId: rule.id, speciesId: e.species.id, now: t });
            if (t - lastSadAtRef.current > 1400) {
              lastSadAtRef.current = t;
              baseMoodRef.current = "happy";
              pulseMood("sad", 700);
            }
          }
          continue;
        }
        next.push(e);
      }
      entitiesRef.current = next;

      // ── Ambience ──
      for (const c of cloudsRef.current) {
        c.x += c.speed * dt;
        if (c.x > GAME_W + 60) c.x = -60;
      }
      for (const b of birdsRef.current) {
        b.x += b.speed * dt;
        if (b.x > GAME_W + 60) b.x = -60 - Math.random() * 200;
      }
      for (const d of decorRef.current) {
        d.x += d.speed * dt;
        if (d.x > GAME_W + 30) d.x = -30;
      }
      if (Math.random() < 0.05 * dt) {
        bubblesRef.current.push({
          x: 40 + Math.random() * (GAME_W - 80),
          y: RIVER_BOTTOM - 4,
          vy: 0.4 + Math.random() * 0.5,
          r: 2 + Math.random() * 3,
          wobble: Math.random() * Math.PI * 2,
        });
      }
      bubblesRef.current = bubblesRef.current.filter((b) => {
        b.y -= b.vy * dt;
        b.wobble += 0.1 * dt;
        return b.y > RIVER_TOP - 10;
      });
      for (const p of pollenRef.current) {
        p.y -= p.speed * dt;
        p.x += Math.sin(t / 1400 + p.phase) * 0.15 * dt;
        if (p.y < -10) {
          p.y = GAME_H + 10;
          p.x = Math.random() * GAME_W;
        }
      }

      // ══════════ RENDER ══════════
      ctx.clearRect(0, 0, GAME_W, GAME_H);
      drawSky(ctx, t);
      for (const c of cloudsRef.current) drawCloud(ctx, c);
      for (const b of birdsRef.current) drawBird(ctx, b, t);
      drawMountainsAndForest(ctx, t);
      drawRiver(ctx, t, rocksRef.current, flowersRef.current);
      for (const bub of bubblesRef.current) drawBubble(ctx, bub);
      for (const d of decorRef.current) drawDecor(ctx, d, t);
      for (const p of pollenRef.current) drawPollen(ctx, p, t);

      if (flowActiveRef.current) {
        // warm-white wash (not gold) so it reads as a bright shimmer over
        // the blue water instead of mixing down into a muddy green
        const g = ctx.createLinearGradient(0, 0, GAME_W, 0);
        g.addColorStop(0, "rgba(255,255,255,0.06)");
        g.addColorStop(0.5, "rgba(255,255,255,0.14)");
        g.addColorStop(1, "rgba(255,255,255,0.06)");
        ctx.fillStyle = g;
        ctx.fillRect(0, RIVER_TOP, GAME_W, RIVER_BOTTOM - RIVER_TOP);
      }

      const activeCatches = entitiesRef.current.filter((e) => e.caught);
      drawFishingRod(ctx, t, activeCatches.length > 0, lastCatchAtRef.current);

      for (const e of entitiesRef.current) drawEntity(ctx, e, t);

      // the line reels in on top of the fish, so it visibly stays hooked
      // to it all the way back to the basket
      for (const e of activeCatches) drawReelLine(ctx, e, t, lastCatchAtRef.current);

      // splashes — a crisp inner ring plus a softer trailing one for a
      // premium "crystal water" pop
      splashRef.current = splashRef.current.filter((s) => {
        const age = t - s.born;
        if (age > 520) return false;
        const k = age / 520;
        ctx.save();
        ctx.globalAlpha = (1 - k) * 0.75;
        ctx.strokeStyle = s.color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(s.x, s.y, 6 + k * 30, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = (1 - k) * 0.35;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.arc(s.x, s.y, 10 + k * 44, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
        return true;
      });

      // particles — sparkles as soft dots, water droplets as tiny
      // gravity-arced teardrops oriented along their travel direction
      particlesRef.current = particlesRef.current.filter((p) => {
        p.life += dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += (p.drop ? 0.26 : 0.15) * dt;
        const maxLife = p.drop ? 22 : 30;
        if (p.life >= maxLife) return false;
        const a = 1 - p.life / maxLife;
        ctx.globalAlpha = a;
        ctx.fillStyle = p.color;
        if (p.drop) {
          const len = 3 + Math.hypot(p.vx, p.vy) * 0.8;
          const angle = Math.atan2(p.vy, p.vx);
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(angle);
          ctx.beginPath();
          ctx.ellipse(0, 0, len, 1.6, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2.5 + (1 - a) * 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
        return true;
      });

      // popups
      popupsRef.current = popupsRef.current.filter((p) => {
        const age = (t - p.born) / 1000;
        if (age >= 0.9) return false;
        const a = 1 - age / 0.9;
        ctx.save();
        ctx.globalAlpha = a;
        ctx.font = 'bold 22px "Nunito", system-ui, sans-serif';
        ctx.textAlign = "center";
        ctx.lineWidth = 4;
        ctx.strokeStyle = "rgba(255,255,255,0.95)";
        ctx.strokeText(p.text, p.x, p.y - age * 40);
        ctx.fillStyle = p.color;
        ctx.fillText(p.text, p.x, p.y - age * 40);
        ctx.restore();
        return true;
      });

      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [gameState, spawnEntity, endGame, pulseMood, tone]);

  return (
    <div
      ref={wrapRef}
      onPointerDown={onPointerDown}
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        background: "linear-gradient(180deg, #4fb8ec 0%, #8adcf7 45%, #2fa3c9 100%)",
        touchAction: "none",
        userSelect: "none",
        fontFamily: "var(--font-nunito), system-ui",
      }}
    >
      <canvas
        ref={canvasRef}
        width={GAME_W}
        height={GAME_H}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
      />

      {/* Dragonflies + butterflies — ambient DOM sprites, ignored by hit-testing */}
      {!reducedMotion && gameState === "playing" && (
        <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
          <span style={{ position: "absolute", animation: "bug-drift-1 13s ease-in-out infinite", fontSize: 22 }}>🦋</span>
          <span style={{ position: "absolute", animation: "bug-drift-2 17s ease-in-out infinite", fontSize: 20 }}>🦋</span>
          <Dragonfly style={{ position: "absolute", animation: "bug-drift-3 15s ease-in-out infinite" }} />
        </div>
      )}

      {/* Fumi + rod + basket, standing on the bank */}
      {gameState !== "idle" && (
        <div
          aria-hidden
          key={hopKey}
          style={{
            position: "absolute",
            left: 14,
            bottom: 44,
            zIndex: 3,
            pointerEvents: "none",
            filter: "drop-shadow(0 8px 10px rgba(30,30,10,0.35))",
            animation: hopKey > 0 && !reducedMotion ? "rc-mascot-hop 0.45s cubic-bezier(0.22,1.5,0.36,1)" : undefined,
          }}
        >
          <Bobo
            mood={mascotMood}
            tint={250}
            size={128}
            animate={!reducedMotion}
            armsDown
            tailWag
          />
        </div>
      )}
      {gameState !== "idle" && (
        <div style={{ position: "absolute", left: 118, bottom: 34, zIndex: 3, pointerEvents: "none" }}>
          <Basket percent={basketPercent} pulseKey={celebrateKey} />
        </div>
      )}

      {/* ── HUD ── */}
      {gameState === "playing" || gameState === "paused" || gameState === "announcing" ? (
        <>
          <div data-hud style={{ position: "absolute", top: 14, left: 14, right: 60, zIndex: 6 }}>
            <RuleCard rule={currentRule} ruleKey={ruleIndex} />
          </div>
          {gameState !== "announcing" && (
            <button
              data-hud
              className="rc-btn"
              onClick={togglePause}
              aria-label={gameState === "paused" ? "Resume" : "Pause"}
              style={pauseBtnStyle}
            >
              {gameState === "paused" ? "▶" : "❚❚"}
            </button>
          )}

          <div data-hud style={{ position: "absolute", top: 92, left: 14, zIndex: 6 }}>
            <Chip icon="⏱" value={`${Math.floor(secondsLeft / 60)}:${String(secondsLeft % 60).padStart(2, "0")}`} />
          </div>
          <div data-hud style={{ position: "absolute", top: 92, right: 14, zIndex: 6, display: "flex", gap: 8, alignItems: "center" }}>
            {combo >= 2 && <ComboBadge combo={combo} flow={flowActive} />}
            <Chip icon="⭐" value={String(score)} />
          </div>

          {flowActive && (
            <div
              aria-hidden
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 6,
                zIndex: 6,
                background:
                  "linear-gradient(90deg, #ffd65a, #fff3c4, #ffd65a, #fff3c4)",
                backgroundSize: "200% 100%",
                animation: reducedMotion ? undefined : "focus-flow-shimmer 1.4s linear infinite",
              }}
            />
          )}
        </>
      ) : null}

      {gameState === "announcing" && (
        <RuleAnnouncement rule={currentRule} reducedMotion={reducedMotion} />
      )}

      {gameState === "paused" && (
        <div
          data-hud
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(20,60,70,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 8,
          }}
        >
          <div style={cardStyle}>
            <div style={{ fontWeight: 900, fontSize: 22, color: INK, marginBottom: 14 }}>Paused</div>
            <label style={settingsRowStyle}>
              <span>Sound</span>
              <input type="checkbox" checked={soundOn} onChange={(e) => setSoundOn(e.target.checked)} />
            </label>
            <label style={settingsRowStyle}>
              <span>Reduced motion</span>
              <input type="checkbox" checked={reducedMotion} onChange={(e) => setReducedMotion(e.target.checked)} />
            </label>
            <button className="rc-btn" onClick={togglePause} style={ctaStyle("#3d8f5b", "#276b3f")}>Resume</button>
            <button className="rc-btn" onClick={onExit} style={ctaSecondaryStyle}>Exit</button>
          </div>
        </div>
      )}

      {gameState === "idle" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, rgba(140,220,255,0.35) 0%, rgba(190,235,255,0.6) 55%, rgba(255,255,255,0.82) 100%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 16,
            padding: "0 24px 150px",
            zIndex: 5,
          }}
        >
          <div style={{ animation: "bubble-pop 0.4s cubic-bezier(0.22,1.5,0.36,1)" }}>
            <IntroBubble text="Help me catch fish for dinner! Tap only the fish the rule card asks for." />
          </div>
          <Bobo mood="happy" tint={250} size={150} animate={!reducedMotion} armsDown tailWag />
          <button className="rc-btn" onClick={startGame} style={{ ...ctaStyle("#3d8f5b", "#276b3f"), width: "100%", maxWidth: 320 }}>
            Let&apos;s go fishing →
          </button>
        </div>
      )}

      {gameState === "ended" && endSummary && (
        <EndScreen
          summary={endSummary}
          basketsFilled={basketsFilled}
          beatHighScore={beatHighScore}
          onReplay={startGame}
          onHome={onExit}
        />
      )}
    </div>
  );
}

// ── Canvas draw helpers (pure, module-scope for stable perf) ──────

function drawSky(ctx: CanvasRenderingContext2D, t: number) {
  const g = ctx.createLinearGradient(0, 0, 0, RIVER_TOP + 40);
  g.addColorStop(0, "#4fb8ec");
  g.addColorStop(0.5, "#8adcf7");
  g.addColorStop(1, "#dff6ff");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, GAME_W, RIVER_TOP + 40);

  // bright daylight sun, upper-right
  const sunX = GAME_W * 0.76;
  const sunY = 96;
  const pulse = 1 + Math.sin(t / 1200) * 0.015;
  const sg = ctx.createRadialGradient(sunX, sunY, 6, sunX, sunY, 78 * pulse);
  sg.addColorStop(0, "rgba(255,253,235,0.95)");
  sg.addColorStop(0.5, "rgba(255,250,210,0.35)");
  sg.addColorStop(1, "rgba(255,250,210,0)");
  ctx.fillStyle = sg;
  ctx.beginPath();
  ctx.arc(sunX, sunY, 78 * pulse, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#fffdf2";
  ctx.beginPath();
  ctx.arc(sunX, sunY, 24, 0, Math.PI * 2);
  ctx.fill();

  drawGodRays(ctx, t, sunX, sunY);
}

// Soft diagonal light shafts fanning from the sun, as if filtering
// through the treeline — a cheap but effective god-ray approximation.
function drawGodRays(ctx: CanvasRenderingContext2D, t: number, sunX: number, sunY: number) {
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  for (let i = 0; i < 4; i++) {
    const angle = 2.15 + i * 0.24 + Math.sin(t / 5000 + i) * 0.04;
    const len = 480;
    const halfW = 20 + i * 4;
    ctx.save();
    ctx.translate(sunX, sunY);
    ctx.rotate(angle);
    const rg = ctx.createLinearGradient(0, 0, len, 0);
    rg.addColorStop(0, "rgba(255,255,240,0.16)");
    rg.addColorStop(1, "rgba(255,255,240,0)");
    ctx.fillStyle = rg;
    ctx.beginPath();
    ctx.moveTo(0, -halfW * 0.4);
    ctx.lineTo(len, -halfW * 1.6);
    ctx.lineTo(len, halfW * 1.6);
    ctx.lineTo(0, halfW * 0.4);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
  ctx.restore();
}

function drawCloud(ctx: CanvasRenderingContext2D, c: Cloud) {
  ctx.save();
  // soft shadow underside first, for a little volume
  ctx.globalAlpha = 0.18;
  ctx.fillStyle = "#a9cfe0";
  for (const [dx, dy, r] of [
    [0, 5, c.r],
    [c.r * 0.75, 8, c.r * 0.65],
    [-c.r * 0.75, 9, c.r * 0.55],
    [c.r * 0.25, 10, c.r * 0.6],
  ] as const) {
    ctx.beginPath();
    ctx.ellipse(c.x + dx, c.y + dy, r, r * 0.55, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 0.92;
  ctx.fillStyle = "#ffffff";
  for (const [dx, dy, r] of [
    [0, 0, c.r],
    [c.r * 0.75, 3, c.r * 0.65],
    [-c.r * 0.75, 4, c.r * 0.55],
    [c.r * 0.25, -c.r * 0.35, c.r * 0.55],
  ] as const) {
    ctx.beginPath();
    ctx.ellipse(c.x + dx, c.y + dy, r, r * 0.62, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawBird(ctx: CanvasRenderingContext2D, b: Bird, t: number) {
  const flap = Math.sin(t / 120 + b.phase) * 5;
  ctx.save();
  ctx.strokeStyle = "rgba(80,50,40,0.55)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(b.x - 8, b.y + flap);
  ctx.quadraticCurveTo(b.x, b.y - 6, b.x + 8, b.y + flap);
  ctx.stroke();
  ctx.restore();
}

function drawMountainsAndForest(ctx: CanvasRenderingContext2D, t: number) {
  // distant hills — soft blue-green daytime haze
  ctx.fillStyle = "rgba(150,190,175,0.6)";
  ctx.beginPath();
  ctx.moveTo(0, RIVER_TOP + 10);
  ctx.lineTo(0, RIVER_TOP - 70);
  ctx.lineTo(70, RIVER_TOP - 130);
  ctx.lineTo(140, RIVER_TOP - 60);
  ctx.lineTo(210, RIVER_TOP - 120);
  ctx.lineTo(290, RIVER_TOP - 50);
  ctx.lineTo(360, RIVER_TOP - 100);
  ctx.lineTo(GAME_W, RIVER_TOP - 40);
  ctx.lineTo(GAME_W, RIVER_TOP + 10);
  ctx.closePath();
  ctx.fill();

  // vibrant green treeline
  ctx.fillStyle = "#5aa652";
  ctx.beginPath();
  ctx.moveTo(0, RIVER_TOP + 20);
  for (let x = 0; x <= GAME_W; x += 24) {
    const h = 16 + ((x * 37) % 22);
    ctx.lineTo(x, RIVER_TOP + 20 - h);
    ctx.lineTo(x + 12, RIVER_TOP + 20 - h * 0.4);
  }
  ctx.lineTo(GAME_W, RIVER_TOP + 20);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#3f8a3e";
  ctx.beginPath();
  ctx.moveTo(0, RIVER_TOP + 20);
  for (let x = 0; x <= GAME_W; x += 24) {
    const h = 8 + ((x * 19) % 12);
    ctx.lineTo(x, RIVER_TOP + 20 - h);
    ctx.lineTo(x + 12, RIVER_TOP + 20 - h * 0.3);
  }
  ctx.lineTo(GAME_W, RIVER_TOP + 20);
  ctx.closePath();
  ctx.fill();

  // two swaying foreground trees peeking in from the top corners
  drawSwayingTree(ctx, 26, RIVER_TOP - 30, 1, t, 0);
  drawSwayingTree(ctx, GAME_W - 34, RIVER_TOP - 46, 1.2, t, 1.4);
}

function drawSwayingTree(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number, t: number, phase: number) {
  const sway = Math.sin(t / 1600 + phase) * 0.05;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.strokeStyle = "#6b4a2f";
  ctx.lineWidth = 7;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(0, 46);
  ctx.lineTo(0, 6);
  ctx.stroke();
  ctx.rotate(sway);
  ctx.fillStyle = "#4a9a45";
  for (const [dx, dy, r] of [
    [0, -6, 30],
    [-20, 6, 22],
    [20, 6, 22],
  ] as const) {
    ctx.beginPath();
    ctx.arc(dx, dy, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = "rgba(255,255,255,0.2)";
  ctx.beginPath();
  ctx.arc(-8, -18, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawRiver(ctx: CanvasRenderingContext2D, t: number, rocks: Rock[], flowers: Flower[]) {
  // crystal-clear turquoise water
  const g = ctx.createLinearGradient(0, RIVER_TOP, 0, RIVER_BOTTOM + 60);
  g.addColorStop(0, "#8fe7ec");
  g.addColorStop(0.35, "#4fc7dd");
  g.addColorStop(0.7, "#2fa3c9");
  g.addColorStop(1, "#1f7fa8");
  ctx.fillStyle = g;
  ctx.fillRect(0, RIVER_TOP, GAME_W, RIVER_BOTTOM - RIVER_TOP + 60);

  drawCaustics(ctx, t);

  // bright shimmering reflection bands (sky/sun reflected in the water)
  for (let i = 0; i < 6; i++) {
    const y = RIVER_TOP + 18 + i * 22;
    ctx.save();
    ctx.globalAlpha = 0.16 + (i % 2) * 0.06;
    ctx.strokeStyle = "#f2fffe";
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let x = 0; x <= GAME_W; x += 8) {
      const wave = Math.sin(x / 26 + t / 500 + i) * 4;
      if (x === 0) ctx.moveTo(x, y + wave);
      else ctx.lineTo(x, y + wave);
    }
    ctx.stroke();
    ctx.restore();
  }

  // rocks resting in the shallows near the bank
  for (const r of rocks) drawRock(ctx, r);

  // lush grassy bank strip at the very bottom — tall enough for Fumi
  // and the basket to visibly stand on solid ground, not the waterline
  ctx.fillStyle = "#5cab4f";
  ctx.fillRect(0, GAME_H - GRASS_H, GAME_W, GRASS_H);
  ctx.fillStyle = "#489038";
  for (let x = 0; x < GAME_W; x += 14) {
    const h = 9 + ((x * 13) % 7);
    ctx.beginPath();
    ctx.moveTo(x, GAME_H - GRASS_H);
    ctx.quadraticCurveTo(x + 4 + Math.sin(t / 700 + x) * 2, GAME_H - GRASS_H - h, x + 8, GAME_H - GRASS_H);
    ctx.fill();
  }
  for (const f of flowers) drawWildflower(ctx, f, t);
}

// Overlapping soft light cells that drift slowly, standing in for
// caustic refraction patterns on the riverbed.
function drawCaustics(ctx: CanvasRenderingContext2D, t: number) {
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  const rows = 4;
  const cols = 5;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const baseX = (c + 0.5) * (GAME_W / cols);
      const baseY = RIVER_TOP + 30 + r * ((RIVER_BOTTOM - RIVER_TOP - 40) / rows);
      const x = baseX + Math.sin(t / 1800 + r * 1.3 + c) * 14;
      const y = baseY + Math.cos(t / 2200 + c * 1.7 + r) * 10;
      const radius = 26 + Math.sin(t / 1500 + r + c) * 6;
      const rg = ctx.createRadialGradient(x, y, 0, x, y, radius);
      rg.addColorStop(0, "rgba(255,255,255,0.10)");
      rg.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = rg;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}

function drawRock(ctx: CanvasRenderingContext2D, r: Rock) {
  ctx.save();
  ctx.translate(r.x, r.y);
  ctx.fillStyle = "rgba(10,30,20,0.18)";
  ctx.beginPath();
  ctx.ellipse(0, r.r * 0.5, r.r * 1.1, r.r * 0.35, 0, 0, Math.PI * 2);
  ctx.fill();
  const rg = ctx.createLinearGradient(-r.r, -r.r, r.r, r.r);
  rg.addColorStop(0, "#b9c4c2");
  rg.addColorStop(1, "#7c8a86");
  ctx.fillStyle = rg;
  ctx.beginPath();
  ctx.ellipse(0, 0, r.r, r.r * 0.78, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.beginPath();
  ctx.ellipse(-r.r * 0.3, -r.r * 0.3, r.r * 0.35, r.r * 0.2, -0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawWildflower(ctx: CanvasRenderingContext2D, f: Flower, t: number) {
  const sway = Math.sin(t / 900 + f.phase) * 2;
  const y = GAME_H - 34;
  ctx.save();
  ctx.translate(f.x + sway, y);
  ctx.strokeStyle = "#3d7a30";
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, -8);
  ctx.stroke();
  ctx.fillStyle = f.color;
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    ctx.beginPath();
    ctx.ellipse(Math.cos(a) * 3.2, -8 + Math.sin(a) * 3.2, 2.4, 1.6, a, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = "#ffd93d";
  ctx.beginPath();
  ctx.arc(0, -8, 1.6, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawPollen(ctx: CanvasRenderingContext2D, p: Pollen, t: number) {
  ctx.save();
  ctx.globalAlpha = 0.5 + Math.sin(t / 500 + p.phase) * 0.2;
  ctx.fillStyle = "#fff6c9";
  ctx.beginPath();
  ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

// Shared rod-tip position: idle sway, plus a quick outward "flick" snap
// right when a catch lands (a fast cast-and-recoil), so the rod itself
// visibly reacts to every catch instead of just the line appearing.
function rodTipAt(t: number, lastCatchAt: number) {
  const sway = Math.sin(t / 900) * 4;
  const sinceCatch = t - lastCatchAt;
  let flick = 0;
  if (sinceCatch >= 0 && sinceCatch < FLICK_MS) {
    flick = Math.sin((sinceCatch / FLICK_MS) * Math.PI) * 16;
  }
  return { x: ROD_TIP.x + sway + flick, y: ROD_TIP.y - flick * 0.4 };
}

// Fumi's fishing rod — held at her raised right paw. Always visible
// while playing: a gentle idle sway and a dangling hook when nothing's
// hooked, so the "fishing" read is constant, not just mid-catch. Flicks
// outward on every catch and spins its little reel handle right after.
function drawFishingRod(ctx: CanvasRenderingContext2D, t: number, hasActiveCatch: boolean, lastCatchAt: number) {
  const { x: tipX, y: tipY } = rodTipAt(t, lastCatchAt);

  ctx.save();
  // pole
  const poleGrad = ctx.createLinearGradient(ROD_BASE.x, ROD_BASE.y, tipX, tipY);
  poleGrad.addColorStop(0, "#8a5a34");
  poleGrad.addColorStop(1, "#c98f52");
  ctx.strokeStyle = poleGrad;
  ctx.lineWidth = 5;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(ROD_BASE.x, ROD_BASE.y);
  ctx.quadraticCurveTo(ROD_BASE.x + 10, (ROD_BASE.y + tipY) / 2, tipX, tipY);
  ctx.stroke();

  // grip wrap where her paw closes around the handle
  ctx.strokeStyle = "#3d2916";
  ctx.lineWidth = 3;
  for (let i = 0; i < 3; i++) {
    const gx = ROD_BASE.x + (i - 1) * 1.5;
    const gy = ROD_BASE.y - 10 - i * 6;
    ctx.beginPath();
    ctx.moveTo(gx - 4, gy);
    ctx.lineTo(gx + 5, gy - 2);
    ctx.stroke();
  }

  // reel — spins for a beat right after a catch
  const sinceCatch = t - lastCatchAt;
  const reelSpin = sinceCatch >= 0 && sinceCatch < 500 ? (sinceCatch / 40) : 0;
  ctx.save();
  ctx.translate(ROD_BASE.x - 4, ROD_BASE.y - 4);
  ctx.rotate(reelSpin);
  ctx.fillStyle = "#5a3d24";
  ctx.beginPath();
  ctx.arc(0, 0, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#3d2916";
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.strokeStyle = "rgba(255,255,255,0.5)";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(-5, 0);
  ctx.lineTo(5, 0);
  ctx.moveTo(0, -5);
  ctx.lineTo(0, 5);
  ctx.stroke();
  ctx.restore();

  if (!hasActiveCatch) {
    // idle dangling line + hook, swaying gently over the water
    const hookX = tipX + Math.sin(t / 700) * 6;
    const hookY = tipY + 46 + Math.sin(t / 1300) * 3;
    ctx.strokeStyle = "rgba(255,255,255,0.65)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(tipX, tipY);
    ctx.lineTo(hookX, hookY);
    ctx.stroke();
    ctx.fillStyle = "#e8c04a";
    ctx.beginPath();
    ctx.arc(hookX, hookY, 3.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.8)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(hookX, hookY, 3.2, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
}

// The line connecting the rod tip to a fish that's actively being
// reeled in (mid catch-tween). A little sag reads as line tension
// easing as the fish gets closer to the basket.
function drawReelLine(ctx: CanvasRenderingContext2D, e: Entity, t: number, lastCatchAt: number) {
  const { x: tipX, y: tipY } = rodTipAt(t, lastCatchAt);
  const dist = Math.hypot(e.x - tipX, e.y - tipY);
  const sag = Math.min(26, dist * 0.14);
  const midX = (tipX + e.x) / 2;
  const midY = (tipY + e.y) / 2 + sag;

  ctx.save();
  ctx.strokeStyle = "rgba(255,255,255,0.85)";
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(tipX, tipY);
  ctx.quadraticCurveTo(midX, midY, e.x, e.y);
  ctx.stroke();

  // small glint sliding along the line for a bit of energy
  const k = (Math.sin(t / 160) + 1) / 2;
  const lx = (1 - k) * (1 - k) * tipX + 2 * (1 - k) * k * midX + k * k * e.x;
  const ly = (1 - k) * (1 - k) * tipY + 2 * (1 - k) * k * midY + k * k * e.y;
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.beginPath();
  ctx.arc(lx, ly, 1.6, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawBubble(ctx: CanvasRenderingContext2D, b: Bubble) {
  ctx.save();
  ctx.globalAlpha = 0.5;
  ctx.strokeStyle = "rgba(255,255,255,0.7)";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(b.x + Math.sin(b.wobble) * 4, b.y, b.r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function drawDecor(ctx: CanvasRenderingContext2D, d: Decor, t: number) {
  const bob = Math.sin(t / 800 + d.phase) * 2;
  ctx.save();
  ctx.translate(d.x, d.y + bob);
  if (d.kind === "lily") {
    ctx.fillStyle = "#4fae57";
    ctx.beginPath();
    ctx.ellipse(0, 0, 13, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.4)";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = "#ff8fc4";
    ctx.beginPath();
    ctx.arc(0, 0, 3, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.fillStyle = "#7fc25a";
    ctx.beginPath();
    ctx.ellipse(0, 0, 8, 5, Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawEntity(ctx: CanvasRenderingContext2D, e: Entity, t: number) {
  const s = e.species;
  const scale = e.scale * (e.caught ? Math.max(0.15, 1 - 0.85 * ((t - e.caughtAt) / CATCH_ANIM_MS)) : 1);
  const alpha = e.caught ? Math.max(0.15, 1 - 0.4 * ((t - e.caughtAt) / CATCH_ANIM_MS)) : 1;
  const flip = e.dir === -1 ? -1 : 1;

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(e.x, e.y);

  // soft underwater shadow, blurred to feel like it's cast through clear water
  ctx.globalAlpha = alpha * 0.22;
  ctx.filter = "blur(2px)";
  ctx.fillStyle = "#0a2a2a";
  ctx.beginPath();
  ctx.ellipse(0, 16 * scale, 20 * scale, 5 * scale, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.filter = "none";
  ctx.globalAlpha = alpha;

  ctx.scale(flip, 1);

  switch (s.kind) {
    case "fish":
      drawFish(ctx, s, scale, e.swimPhase, t);
      break;
    case "bottle":
      drawBottle(ctx, scale);
      break;
    case "boot":
      drawBoot(ctx, scale);
      break;
    case "leaf":
      ctx.rotate(Math.sin(e.swimPhase) * 0.2);
      drawLeafObj(ctx, scale);
      break;
    case "twig":
      drawTwig(ctx, scale);
      break;
    case "ripple":
      drawRipple(ctx, t);
      break;
  }
  ctx.restore();
}

function drawFish(ctx: CanvasRenderingContext2D, s: Species, scale: number, swimPhase: number, t: number) {
  const color = COLOR_HEX[s.color];
  const lightColor = COLOR_HEX_LIGHT[s.color];
  const wag = Math.sin(swimPhase) * 24 * (Math.PI / 180);
  const bodyLen = s.size === "tiny" ? 16 : s.size === "big" ? 30 : 22;
  const bodyH = s.size === "tiny" ? 8 : s.size === "big" ? 15 : 11;

  // tail
  ctx.save();
  ctx.translate(-bodyLen * scale, 0);
  ctx.rotate(wag);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(-12 * scale, -8 * scale);
  ctx.lineTo(-12 * scale, 8 * scale);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // body — vertical gradient gives it a rounded, shimmery-scale feel
  const bodyGrad = ctx.createLinearGradient(0, -bodyH * scale, 0, bodyH * scale);
  bodyGrad.addColorStop(0, lightColor);
  bodyGrad.addColorStop(0.55, color);
  bodyGrad.addColorStop(1, color);
  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  ctx.ellipse(0, 0, bodyLen * scale, bodyH * scale, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.65)";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // shimmering scale highlight — a soft arc that slides along the body
  const shimmerX = Math.sin(t / 700 + swimPhase) * bodyLen * 0.5 * scale;
  ctx.save();
  ctx.globalAlpha = 0.4;
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.arc(shimmerX, -bodyH * 0.15 * scale, bodyH * 0.5 * scale, Math.PI * 1.1, Math.PI * 1.6);
  ctx.stroke();
  ctx.restore();

  // dorsal fin
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, -bodyH * scale);
  ctx.lineTo(6 * scale, -bodyH * scale - 8 * scale);
  ctx.lineTo(10 * scale, -bodyH * scale);
  ctx.closePath();
  ctx.fill();

  if (s.id === "poison") {
    ctx.fillStyle = "rgba(20,50,20,0.6)";
    for (const dx of [-6, 2, 10]) {
      ctx.beginPath();
      ctx.arc(dx * scale, -2 * scale, 2.4 * scale, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // eye, with a bright highlight dot for extra life
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(bodyLen * 0.55 * scale, -2 * scale, 3.4 * scale, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#222";
  ctx.beginPath();
  ctx.arc(bodyLen * 0.6 * scale, -2 * scale, 1.7 * scale, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(bodyLen * 0.6 * scale - 0.6 * scale, -2.6 * scale, 0.6 * scale, 0, Math.PI * 2);
  ctx.fill();

  if (s.sparkle) {
    const sparkAngle = t / 300;
    for (let i = 0; i < 3; i++) {
      const a = sparkAngle + (i * Math.PI * 2) / 3;
      const sx = Math.cos(a) * bodyLen * 1.3 * scale;
      const sy = Math.sin(a) * bodyH * 1.6 * scale;
      drawSparkle(ctx, sx, sy, 3.2 * scale);
    }
  }
}

function drawSparkle(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "#fff3b0";
  ctx.beginPath();
  ctx.moveTo(0, -size);
  ctx.lineTo(size * 0.3, -size * 0.3);
  ctx.lineTo(size, 0);
  ctx.lineTo(size * 0.3, size * 0.3);
  ctx.lineTo(0, size);
  ctx.lineTo(-size * 0.3, size * 0.3);
  ctx.lineTo(-size, 0);
  ctx.lineTo(-size * 0.3, -size * 0.3);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawBottle(ctx: CanvasRenderingContext2D, scale: number) {
  ctx.fillStyle = "rgba(150,190,160,0.7)";
  ctx.strokeStyle = "rgba(90,120,100,0.8)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(-8 * scale, -14 * scale, 16 * scale, 26 * scale, 4 * scale);
  ctx.fill();
  ctx.stroke();
  ctx.fillRect(-3 * scale, -22 * scale, 6 * scale, 10 * scale);
}

function drawBoot(ctx: CanvasRenderingContext2D, scale: number) {
  ctx.fillStyle = "#6b4a34";
  ctx.beginPath();
  ctx.moveTo(-14 * scale, 8 * scale);
  ctx.lineTo(-14 * scale, -10 * scale);
  ctx.lineTo(0, -10 * scale);
  ctx.lineTo(2 * scale, 2 * scale);
  ctx.lineTo(16 * scale, 4 * scale);
  ctx.lineTo(16 * scale, 8 * scale);
  ctx.closePath();
  ctx.fill();
}

function drawLeafObj(ctx: CanvasRenderingContext2D, scale: number) {
  ctx.fillStyle = "#7fae5c";
  ctx.beginPath();
  ctx.ellipse(0, 0, 14 * scale, 8 * scale, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#5a7d40";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(-12 * scale, 0);
  ctx.lineTo(12 * scale, 0);
  ctx.stroke();
}

function drawTwig(ctx: CanvasRenderingContext2D, scale: number) {
  ctx.strokeStyle = "#7a5a3a";
  ctx.lineWidth = 3 * scale;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(-14 * scale, 2 * scale);
  ctx.lineTo(14 * scale, -3 * scale);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-2 * scale, 0);
  ctx.lineTo(-6 * scale, -6 * scale);
  ctx.stroke();
}

function drawRipple(ctx: CanvasRenderingContext2D, t: number) {
  for (let i = 0; i < 2; i++) {
    const phase = ((t / 900 + i * 0.5) % 1);
    ctx.save();
    ctx.globalAlpha = (1 - phase) * 0.5;
    ctx.strokeStyle = "rgba(255,255,255,0.8)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, 6 + phase * 22, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
}

function Dragonfly({ style }: { style?: React.CSSProperties }) {
  return (
    <svg width="26" height="26" viewBox="-13 -13 26 26" style={style}>
      <line x1="0" y1="-10" x2="0" y2="8" stroke="#2f6f5a" strokeWidth="2" strokeLinecap="round" />
      <g style={{ animation: "dragonfly-wing 0.18s ease-in-out infinite", transformOrigin: "0px -2px" }}>
        <ellipse cx="-7" cy="-2" rx="7" ry="2.4" fill="rgba(200,240,230,0.65)" />
        <ellipse cx="7" cy="-2" rx="7" ry="2.4" fill="rgba(200,240,230,0.65)" />
      </g>
    </svg>
  );
}

// Big center-screen callout shown whenever the rule changes (including
// the very first one). Holds still long enough to read, then flies back
// up toward the HUD's rule card and fades — same total duration as the
// gameplay pause in the parent, so the animation and the resume land
// together.
function RuleAnnouncement({ rule, reducedMotion }: { rule: Rule; reducedMotion: boolean }) {
  return (
    <div
      aria-hidden
      data-hud
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 10,
        pointerEvents: "none",
        background: "rgba(10,50,65,0.32)",
        animation: reducedMotion ? undefined : `rule-announce-backdrop ${RULE_ANNOUNCE_MS}ms ease-in-out forwards`,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "42%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          animation: reducedMotion ? undefined : `rule-announce ${RULE_ANNOUNCE_MS}ms cubic-bezier(0.22,1,0.36,1) forwards`,
          ...glassStyle,
          padding: "26px 30px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
          minWidth: 230,
        }}
      >
        <div style={{ fontSize: 12.5, fontWeight: 800, color: INK_MUTED, textTransform: "uppercase", letterSpacing: 1.4 }}>
          New Rule
        </div>
        <div style={{ fontSize: 46 }}>{rule.icon}</div>
        <div style={{ fontSize: 22, fontWeight: 900, color: INK, textAlign: "center", lineHeight: 1.25 }}>
          {rule.text}
        </div>
      </div>
    </div>
  );
}

function RuleCard({ rule, ruleKey }: { rule: Rule; ruleKey: number }) {
  return (
    <div
      key={ruleKey}
      style={{
        ...glassStyle,
        padding: "8px 16px 8px 8px",
        display: "flex",
        alignItems: "center",
        gap: 10,
        animation: "rule-card-in 0.5s cubic-bezier(0.22,1.5,0.36,1)",
        transformStyle: "preserve-3d",
      }}
    >
      <span
        style={{
          width: 34,
          height: 34,
          borderRadius: "50%",
          background: "linear-gradient(180deg, #fff6cf 0%, #ffd873 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 17,
          flexShrink: 0,
          boxShadow: "0 2px 6px rgba(200,150,20,0.35)",
        }}
      >
        {rule.icon}
      </span>
      <span style={{ fontWeight: 800, fontSize: 15, color: INK }}>{rule.text}</span>
    </div>
  );
}

function Chip({ icon, value }: { icon: string; value: string }) {
  return (
    <div
      style={{
        ...glassStyle,
        display: "flex",
        alignItems: "center",
        gap: 6,
        borderRadius: 999,
        padding: "6px 14px",
        fontWeight: 800,
        fontSize: 15,
        color: INK,
      }}
    >
      <span>{icon}</span>
      <span>{value}</span>
    </div>
  );
}

function ComboBadge({ combo, flow }: { combo: number; flow: boolean }) {
  return (
    <div
      key={combo}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 4,
        background: flow
          ? "linear-gradient(180deg, rgba(255,233,168,0.85) 0%, rgba(255,201,77,0.85) 100%)"
          : "rgba(255,255,255,0.62)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        border: `1.5px solid ${flow ? "rgba(224,148,42,0.85)" : "rgba(255,255,255,0.85)"}`,
        borderRadius: 999,
        padding: "5px 12px",
        boxShadow: flow ? "0 4px 14px rgba(200,140,20,0.35)" : "0 6px 20px rgba(31,110,150,0.18)",
        fontWeight: 800,
        fontSize: 13,
        color: flow ? "#8a5b00" : INK,
        animation: "combo-pop 0.3s cubic-bezier(0.22,1.5,0.36,1)",
      }}
    >
      🔥 {combo}
    </div>
  );
}

function Basket({ percent, pulseKey }: { percent: number; pulseKey: number }) {
  return (
    <svg
      key={pulseKey}
      viewBox="0 0 120 100"
      width="86"
      style={{
        display: "block",
        filter: "drop-shadow(0 4px 4px rgba(30,20,10,0.4))",
        animation: pulseKey > 0 ? "basket-pop 0.5s ease" : undefined,
      }}
    >
      <defs>
        <clipPath id="basket-clip">
          <path d="M14 32 L106 32 L96 88 Q60 98 24 88 Z" />
        </clipPath>
      </defs>
      <path d="M14 32 L106 32 L96 88 Q60 98 24 88 Z" fill="#d6904a" stroke="#8a5b22" strokeWidth="3" strokeLinejoin="round" />
      <rect
        x="10"
        y={88 - Math.max(4, percent * 0.56)}
        width="100"
        height={Math.max(4, percent * 0.56)}
        fill="#ffce54"
        clipPath="url(#basket-clip)"
      />
      <rect x="12" y="26" width="100" height="10" rx="3" fill="#e7a662" stroke="#8a5b22" strokeWidth="2" />
      <path d="M32 32 Q60 -6 88 32" fill="none" stroke="#8a5b22" strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}

function IntroBubble({ text }: { text: string }) {
  return (
    <div
      style={{
        ...glassStyle,
        position: "relative",
        maxWidth: 320,
        padding: "14px 20px",
        borderRadius: 20,
        color: INK,
        fontWeight: 800,
        fontSize: 15.5,
        lineHeight: 1.4,
        textAlign: "center",
      }}
    >
      {text}
    </div>
  );
}

function EndScreen({
  summary,
  basketsFilled,
  beatHighScore,
  onReplay,
  onHome,
}: {
  summary: SessionSummary;
  basketsFilled: number;
  beatHighScore: boolean;
  onReplay: () => void;
  onHome: () => void;
}) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(180deg, rgba(140,220,255,0.4) 0%, rgba(190,235,255,0.65) 55%, rgba(255,255,255,0.85) 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 20px",
        zIndex: 9,
      }}
    >
      <div style={{ ...cardStyle, maxHeight: "88vh", overflowY: "auto", width: "100%", maxWidth: 340 }}>
        <Bobo mood={summary.starsEarned >= 2 ? "cheer" : "happy"} tint={250} size={100} armsDown tailWag />
        <div style={{ fontWeight: 900, fontSize: 22, color: INK, marginTop: 4 }}>
          {basketsFilled > 0 ? "Dinner is served!" : "Nice fishing!"}
        </div>
        {beatHighScore && (
          <div style={{ color: "#c67a00", fontWeight: 900, fontSize: 13, marginTop: 2 }}>🏆 New high score!</div>
        )}
        <div style={{ fontSize: 20, letterSpacing: 3, marginTop: 6 }}>{"⭐".repeat(summary.starsEarned)}</div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 16, width: "100%" }}>
          <Stat label="Fish caught" value={String(summary.fishCaught)} />
          <Stat label="Accuracy" value={`${Math.round(summary.accuracy * 100)}%`} />
          <Stat label="Avg reaction" value={`${Math.round(summary.avgReactionMs)}ms`} />
          <Stat label="Best streak" value={String(summary.longestStreak)} />
          <Stat label="Missed fish" value={String(summary.falseNegatives)} />
          <Stat label="Wrong taps" value={String(summary.falsePositives)} />
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 14, justifyContent: "center" }}>
          <div style={xpPillStyle}>🐟 {basketsFilled} basket{basketsFilled === 1 ? "" : "s"}</div>
          <div style={xpPillStyle}>⚡ +{summary.xpEarned} XP</div>
          <div style={xpPillStyle}>🪙 +{summary.coinsEarned}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 18 }}>
          <button className="rc-btn" onClick={onReplay} style={ctaStyle("#3d8f5b", "#276b3f")}>Play again</button>
          <button className="rc-btn" onClick={onHome} style={ctaSecondaryStyle}>Home</button>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: "rgba(230,248,255,0.7)", borderRadius: 14, padding: "8px 10px", textAlign: "center" }}>
      <div style={{ fontWeight: 900, fontSize: 17, color: INK }}>{value}</div>
      <div style={{ fontSize: 10.5, fontWeight: 700, color: INK_MUTED, marginTop: 2 }}>{label}</div>
    </div>
  );
}

// Bright, child-friendly glassmorphism palette used across the HUD and
// modal cards — deep teal ink on frosted white, instead of the old
// sunset cream/brown scheme.
const INK = "#1f5065";
const INK_MUTED = "#5f8394";

const glassStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.62)",
  backdropFilter: "blur(14px)",
  WebkitBackdropFilter: "blur(14px)",
  border: "1.5px solid rgba(255,255,255,0.85)",
  borderRadius: 18,
  boxShadow: "0 6px 20px rgba(31,110,150,0.18)",
};

const cardStyle: React.CSSProperties = {
  position: "relative",
  ...glassStyle,
  borderRadius: 28,
  boxShadow: "0 10px 30px rgba(31,110,150,0.25)",
  padding: "22px 22px",
  textAlign: "center",
  color: INK,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  animation: "bubble-pop 0.5s cubic-bezier(0.22,1.5,0.36,1)",
};

const settingsRowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
  minWidth: 220,
  fontWeight: 700,
  fontSize: 14,
  marginBottom: 10,
  color: INK,
};

const xpPillStyle: React.CSSProperties = {
  ...glassStyle,
  borderRadius: 999,
  padding: "5px 12px",
  fontWeight: 800,
  fontSize: 12.5,
  color: "#c67a00",
};

const pauseBtnStyle: React.CSSProperties = {
  position: "absolute",
  top: 14,
  right: 14,
  width: 40,
  height: 40,
  borderRadius: 14,
  ...glassStyle,
  color: INK,
  fontWeight: 900,
  cursor: "pointer",
  zIndex: 6,
};

function ctaStyle(bg: string, shadow: string): React.CSSProperties {
  return {
    width: "100%",
    minHeight: 52,
    borderRadius: 16,
    border: "none",
    background: bg,
    color: "#fff",
    fontWeight: 900,
    fontSize: 16,
    letterSpacing: 0.3,
    cursor: "pointer",
    boxShadow: `0 4px 0 ${shadow}`,
  };
}
// Secondary (glass) CTA — used for Exit / Home instead of the solid green.
const ctaSecondaryStyle: React.CSSProperties = {
  ...ctaStyle("rgba(255,255,255,0.7)", "rgba(150,190,205,0.7)"),
  color: INK,
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
};
