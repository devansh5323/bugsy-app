"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Bobo } from "./Mascot";
import { Typewriter } from "./Typewriter";

// Bird Spike — a tap-to-fly mini-game starring Bugsy.
//
// World rendering (sky, pipes, particles, parallax) lives on a
// Canvas2D layer for performance. The mascot itself stays as the
// existing Bobo SVG, overlaid as an absolutely-positioned DOM
// element so we don't have to redraw it pixel-by-pixel. The bird's
// transform is mutated directly via a ref inside the RAF loop, so
// we never re-render React state at 60fps — we only setState on
// discrete events (state changes, score increments, best update).
//
// Inputs: pointer / touch / spacebar all trigger a flap.
// Audio: Web Audio synthesised — no external files.

type GameState = "idle" | "playing" | "over";

// Tuning knobs (canvas-pixel units per 60fps frame; dt-scaled).
// The bird's *feel* (gravity, flap kick, max fall) stays constant —
// what changes with score is the *world* (gap height, scroll speed,
// horizontal spacing between pillars). Means the bird's response to
// a tap never shifts under the kid's fingers; only the obstacles do.
const GRAVITY = 0.42;
const FLAP_VEL = -7.4;
const MAX_FALL = 9.5;
const PIPE_W = 70;
const BIRD_R = 25;
const BIRD_X_FRAC = 0.3;
// How aggressively the visible rotation chases velocity-derived
// target. Smaller = smoother but laggier; 0.14 is a sweet spot
// that masks per-frame jitter while still feeling responsive.
const ROT_LERP = 0.14;
const BEST_KEY = "birdspike-best";
const INTRO_TEXT = "Tap the screen to make me fly. Let's go!";

// ── Difficulty ramp ──────────────────────────────────────────
// Linear ramp with a grace period — scores 0-5 stay at "easy",
// scores 5-25 ramp smoothly to max, scores 25+ plateau.
// Grace period covers the auto-play demo (0-3) plus a couple
// of free pillars after the kid takes over, so they get to find
// the rhythm before the world starts squeezing.
const DIFF_GRACE_SCORE = 5;
const DIFF_RAMP_SCORE = 25;
const GAP_EASY = 245;     // very forgiving early window
const GAP_HARD = 120;     // tight late-game gap
const SPEED_EASY = 1.8;   // slow scroll while learning
const SPEED_HARD = 4.0;   // ~2.2x faster at peak
const SPACING_EASY = 330; // lots of breathing room between pillars
const SPACING_HARD = 240; // tighter rhythm late game

function difficultyAt(score: number) {
  const t = Math.max(
    0,
    Math.min(
      1,
      (score - DIFF_GRACE_SCORE) / (DIFF_RAMP_SCORE - DIFF_GRACE_SCORE),
    ),
  );
  return {
    gap: GAP_EASY + (GAP_HARD - GAP_EASY) * t,
    speed: SPEED_EASY + (SPEED_HARD - SPEED_EASY) * t,
    spacing: SPACING_EASY + (SPACING_HARD - SPACING_EASY) * t,
  };
}

type Pipe = { x: number; topH: number; gap: number; passed: boolean };
type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  hue: number;
};
type Cloud = { x: number; y: number; r: number; speed: number };

export function BirdSpikeGame({
  tint,
  onExit,
}: {
  tint: number;
  onExit: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const birdRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<AudioContext | null>(null);

  // RAF-mutated state (no React re-render needed for these)
  const stateRef = useRef<GameState>("idle");
  const birdYRef = useRef(0);
  const birdVRef = useRef(0);
  const birdRotRef = useRef(0);
  const pipesRef = useRef<Pipe[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const cloudsRef = useRef<Cloud[]>([]);
  const shakeRef = useRef(0);
  const scoreRef = useRef(0);
  const sizeRef = useRef({ w: 0, h: 0 });
  const bestRef = useRef(0);

  // UI-rendered state
  const [renderState, setRenderState] = useState<GameState>("idle");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  // Re-keyed on every flap to retrigger the wing animation
  const [flapKey, setFlapKey] = useState(0);
  // First-run explainer: Bugsy types out the rules before the
  // kid can tap to start. Flips true when the typewriter finishes
  // OR when an impatient kid taps mid-typing (we then render the
  // full text immediately so the lesson is still complete on-screen
  // before the bubble's dismiss-tap).
  const [introDone, setIntroDone] = useState(false);
  const [skipTyping, setSkipTyping] = useState(false);

  // ── Audio (lazy init on first user gesture) ──────────────
  const ensureAudio = useCallback(() => {
    if (audioRef.current) return audioRef.current;
    try {
      const AC =
        window.AudioContext ||
        (
          window as unknown as {
            webkitAudioContext: typeof AudioContext;
          }
        ).webkitAudioContext;
      audioRef.current = new AC();
    } catch {
      // sound is optional — silently disable
    }
    return audioRef.current;
  }, []);

  const tone = useCallback(
    (freq: number, dur: number, type: OscillatorType, vol: number) => {
      const ctx = audioRef.current;
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + dur + 0.02);
    },
    [],
  );

  const playFlap = useCallback(() => {
    const ctx = ensureAudio();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(280, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(520, ctx.currentTime + 0.07);
    gain.gain.setValueAtTime(0.09, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.14);
  }, [ensureAudio]);

  const playScore = useCallback(() => {
    ensureAudio();
    tone(880, 0.08, "triangle", 0.1);
    window.setTimeout(() => tone(1320, 0.1, "triangle", 0.1), 60);
  }, [ensureAudio, tone]);

  const playHit = useCallback(() => {
    const ctx = ensureAudio();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(220, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.4);
    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  }, [ensureAudio]);

  // Best score hydration
  useEffect(() => {
    try {
      const v = window.localStorage.getItem(BEST_KEY);
      if (v) {
        const n = Math.max(0, parseInt(v, 10) || 0);
        setBest(n);
        bestRef.current = n;
      }
    } catch {
      // ignored
    }
  }, []);

  // Canvas sizing — keep crisp via devicePixelRatio scaling
  useEffect(() => {
    const fit = () => {
      const el = containerRef.current;
      const canvas = canvasRef.current;
      if (!el || !canvas) return;
      const w = el.clientWidth;
      const h = el.clientHeight;
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sizeRef.current = { w, h };
      if (stateRef.current === "idle") {
        birdYRef.current = h * 0.45;
      }
      // Re-seed clouds on first valid size
      if (w > 0 && cloudsRef.current.length === 0) {
        cloudsRef.current = Array.from({ length: 5 }).map((_, i) => ({
          x: (i / 5) * w + Math.random() * 60,
          y: 30 + Math.random() * (h * 0.5),
          r: 18 + Math.random() * 30,
          speed: 0.25 + Math.random() * 0.25,
        }));
      }
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  // ── Main game loop ───────────────────────────────────────
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const loop = (t: number) => {
      // dt normalised so 1 = one 60fps frame; capped to avoid huge
      // physics steps if the tab was backgrounded.
      const dt = Math.min(2.5, (t - last) / (1000 / 60));
      last = t;
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      const { w, h } = sizeRef.current;
      if (!ctx || w === 0 || h === 0) {
        raf = requestAnimationFrame(loop);
        return;
      }
      const state = stateRef.current;
      const { gap, speed, spacing } = difficultyAt(scoreRef.current);

      // Clouds always drift, even on idle / over
      for (const c of cloudsRef.current) {
        c.x -= c.speed * speed * dt;
        if (c.x + c.r * 2 < -10) {
          c.x = w + c.r;
          c.y = 30 + Math.random() * (h * 0.5);
          c.r = 18 + Math.random() * 30;
        }
      }

      // Bird sits centered while idle (so the intro bubble can hover
      // directly above it), then slides to the gameplay slot at 0.3
      // once play begins. Collision/score logic uses the same `bx`.
      const bx = state === "idle" ? w * 0.5 : w * BIRD_X_FRAC;

      if (state === "playing") {
        // Physics
        birdVRef.current = Math.min(MAX_FALL, birdVRef.current + GRAVITY * dt);
        birdYRef.current += birdVRef.current * dt;
        // Rotation chases a velocity-derived target with framerate-
        // independent damping. Using a small ROT_LERP keeps the
        // tilt smooth and forgiving rather than reactive/jittery.
        const targetRot = Math.max(-0.5, Math.min(1.25, birdVRef.current / 10));
        const damping = 1 - Math.pow(1 - ROT_LERP, dt);
        birdRotRef.current += (targetRot - birdRotRef.current) * damping;

        // Move pipes
        for (const p of pipesRef.current) p.x -= speed * dt;
        // Cull
        pipesRef.current = pipesRef.current.filter((p) => p.x + PIPE_W > -20);
        // Spawn — `spacing` and `gap` are both dynamic so pipes
        // drift apart and shrink as the kid skills up. Each pillar
        // captures the current `gap` at spawn time so its bottom
        // doesn't visually jump when difficulty re-tightens after
        // a score increment.
        const lastPipe = pipesRef.current[pipesRef.current.length - 1];
        if (!lastPipe || w - lastPipe.x > spacing) {
          const margin = 70;
          const topH = margin + Math.random() * (h - gap - margin * 2 - 30);
          const newX = lastPipe ? lastPipe.x + spacing : w + 20;
          pipesRef.current.push({ x: newX, topH, gap, passed: false });
        }

        // Score check
        for (const p of pipesRef.current) {
          if (!p.passed && p.x + PIPE_W < bx) {
            p.passed = true;
            scoreRef.current += 1;
            setScore(scoreRef.current);
            playScore();
            // Sparkle burst
            for (let i = 0; i < 10; i++) {
              const a = (i / 10) * Math.PI * 2;
              particlesRef.current.push({
                x: bx,
                y: birdYRef.current,
                vx: Math.cos(a) * (1.5 + Math.random()),
                vy: Math.sin(a) * (1.5 + Math.random()) - 1,
                life: 0,
                max: 24,
                hue: 50 + Math.random() * 30,
              });
            }
          }
        }

        // Collision — use each pillar's spawn-time gap so a score
        // increment mid-cross can't retroactively shrink the gap
        // the bird is currently flying through.
        const by = birdYRef.current;
        let hit = false;
        const floorY = h - 6;
        if (by - BIRD_R + 4 < 0 || by + BIRD_R - 4 > floorY) hit = true;
        for (const p of pipesRef.current) {
          if (hit) break;
          if (p.x < bx + BIRD_R - 4 && p.x + PIPE_W > bx - BIRD_R + 4) {
            const gapTop = p.topH;
            const gapBot = p.topH + p.gap;
            if (by - BIRD_R + 4 < gapTop || by + BIRD_R - 4 > gapBot) {
              hit = true;
            }
          }
        }
        if (hit) {
          playHit();
          shakeRef.current = 16;
          stateRef.current = "over";
          const final = scoreRef.current;
          if (final > bestRef.current) {
            bestRef.current = final;
            setBest(final);
            try {
              window.localStorage.setItem(BEST_KEY, String(final));
            } catch {
              // ignored
            }
          }
          for (let i = 0; i < 18; i++) {
            const a = Math.random() * Math.PI * 2;
            const v = 2 + Math.random() * 3;
            particlesRef.current.push({
              x: bx,
              y: by,
              vx: Math.cos(a) * v,
              vy: Math.sin(a) * v - 1,
              life: 0,
              max: 40,
              hue: 350 + Math.random() * 20,
            });
          }
          setRenderState("over");
        }
      } else if (state === "over") {
        // Tumble down
        birdVRef.current = Math.min(MAX_FALL, birdVRef.current + GRAVITY * dt);
        birdYRef.current = Math.min(
          h - BIRD_R,
          birdYRef.current + birdVRef.current * dt,
        );
        birdRotRef.current = Math.min(
          Math.PI / 2,
          birdRotRef.current + 0.06 * dt,
        );
      } else {
        // Idle hover bob
        birdYRef.current = h * 0.45 + Math.sin(t / 380) * 9;
        birdRotRef.current = 0;
      }

      // Particles
      for (const p of particlesRef.current) {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += 0.16 * dt;
        p.life += dt;
      }
      particlesRef.current = particlesRef.current.filter(
        (p) => p.life < p.max,
      );

      shakeRef.current = Math.max(0, shakeRef.current - 0.9 * dt);

      // ── DRAW ─────────────────────────────────────────────
      ctx.clearRect(0, 0, w, h);
      // Sky — peach/lavender so the pink spikes pop
      const sky = ctx.createLinearGradient(0, 0, 0, h);
      sky.addColorStop(0, "#cfeaff");
      sky.addColorStop(0.55, "#ffe6f1");
      sky.addColorStop(1, "#fff2c2");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h);

      const sx = (Math.random() - 0.5) * shakeRef.current;
      const sy = (Math.random() - 0.5) * shakeRef.current;
      ctx.save();
      ctx.translate(sx, sy);

      // Clouds
      ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
      for (const c of cloudsRef.current) {
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
        ctx.arc(c.x + c.r * 0.6, c.y + 4, c.r * 0.75, 0, Math.PI * 2);
        ctx.arc(c.x - c.r * 0.6, c.y + 6, c.r * 0.75, 0, Math.PI * 2);
        ctx.fill();
      }

      // Pipes — coral spikes with darker cap and a glint. The cap
      // edges facing the gap are rounded for a softer silhouette.
      const roundedCap = (cx: number, cy: number, cw: number, ch: number, r: number, side: "top" | "bot") => {
        ctx.beginPath();
        if (side === "top") {
          ctx.moveTo(cx, cy);
          ctx.lineTo(cx + cw, cy);
          ctx.lineTo(cx + cw, cy + ch - r);
          ctx.quadraticCurveTo(cx + cw, cy + ch, cx + cw - r, cy + ch);
          ctx.lineTo(cx + r, cy + ch);
          ctx.quadraticCurveTo(cx, cy + ch, cx, cy + ch - r);
          ctx.closePath();
        } else {
          ctx.moveTo(cx, cy + r);
          ctx.quadraticCurveTo(cx, cy, cx + r, cy);
          ctx.lineTo(cx + cw - r, cy);
          ctx.quadraticCurveTo(cx + cw, cy, cx + cw, cy + r);
          ctx.lineTo(cx + cw, cy + ch);
          ctx.lineTo(cx, cy + ch);
          ctx.closePath();
        }
        ctx.fill();
      };
      for (const p of pipesRef.current) {
        // Use this pillar's own gap (locked at spawn) so its bottom
        // segment doesn't visually jump when the global `gap`
        // shrinks at the next score increment.
        const gapTop = p.topH;
        const gapBot = p.topH + p.gap;
        // top stalk
        ctx.fillStyle = "#FF5C8A";
        ctx.fillRect(p.x, 0, PIPE_W, gapTop);
        // top cap (rounded on the gap-facing edge)
        ctx.fillStyle = "#D6396B";
        roundedCap(p.x - 4, gapTop - 16, PIPE_W + 8, 16, 6, "top");
        // top glint
        ctx.fillStyle = "rgba(255,255,255,0.18)";
        ctx.fillRect(p.x + 6, 0, 6, gapTop - 16);
        // bottom stalk
        ctx.fillStyle = "#FF5C8A";
        ctx.fillRect(p.x, gapBot, PIPE_W, h - gapBot - 6);
        // bottom cap
        ctx.fillStyle = "#D6396B";
        roundedCap(p.x - 4, gapBot, PIPE_W + 8, 16, 6, "bot");
        // bottom glint
        ctx.fillStyle = "rgba(255,255,255,0.18)";
        ctx.fillRect(p.x + 6, gapBot + 16, 6, h - gapBot - 22);
      }

      // Floor
      ctx.fillStyle = "#A78BFA";
      ctx.fillRect(0, h - 6, w, 6);

      // Particles
      for (const p of particlesRef.current) {
        const a = 1 - p.life / p.max;
        ctx.fillStyle = `hsla(${p.hue}, 90%, 60%, ${a})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3 * a + 1.4, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      // Position the mascot via direct transform — sidesteps
      // React state and keeps the loop smooth. translate3d hints
      // the GPU so the bird stays buttery on mobile.
      const bird = birdRef.current;
      if (bird) {
        const by = birdYRef.current;
        bird.style.transform = `translate3d(${bx + sx}px, ${by + sy}px, 0) translate(-50%, -50%) rotate(${birdRotRef.current}rad)`;
      }

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [playHit, playScore]);

  // ── Input ────────────────────────────────────────────────
  const flap = useCallback(() => {
    ensureAudio();
    const state = stateRef.current;
    if (state === "idle") {
      // First tap during the intro fast-forwards the typewriter
      // (so the full sentence is visible) and unlocks the bubble.
      // The next tap actually starts the game.
      if (!introDone) {
        setSkipTyping(true);
        setIntroDone(true);
        return;
      }
      pipesRef.current = [];
      particlesRef.current = [];
      scoreRef.current = 0;
      setScore(0);
      birdYRef.current = sizeRef.current.h * 0.45;
      birdVRef.current = FLAP_VEL;
      // Don't snap rotation — let it ease from current to the
      // velocity-derived target so the launch feels smooth.
      shakeRef.current = 0;
      stateRef.current = "playing";
      setRenderState("playing");
      playFlap();
      setFlapKey((k) => k + 1);
    } else if (state === "playing") {
      birdVRef.current = FLAP_VEL;
      playFlap();
      setFlapKey((k) => k + 1);
    } else {
      // over → reset to idle (next tap will start)
      stateRef.current = "idle";
      setRenderState("idle");
      birdVRef.current = 0;
      birdRotRef.current = 0;
    }
  }, [ensureAudio, playFlap, introDone]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        flap();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [flap]);

  const wingColor = `oklch(76% 0.15 ${tint})`;

  return (
    <div
      ref={containerRef}
      onPointerDown={flap}
      style={{
        position: "absolute",
        inset: 0,
        background: "#cfeaff",
        overflow: "hidden",
        cursor: "pointer",
        userSelect: "none",
        touchAction: "manipulation",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          display: "block",
          pointerEvents: "none",
        }}
      />

      {/* Exit/finish button — kid can stop the run any time. */}
      <button
        type="button"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={onExit}
        aria-label="Finish playing"
        style={{
          position: "absolute",
          top: 14,
          left: 14,
          width: 40,
          height: 40,
          borderRadius: 12,
          border: "2px solid rgba(255,255,255,0.6)",
          background: "rgba(255,255,255,0.75)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: "#3C3C3C",
          fontWeight: 900,
          fontSize: 18,
          zIndex: 6,
          boxShadow: "0 3px 0 rgba(0,0,0,0.08)",
          fontFamily: "var(--font-nunito), system-ui",
        }}
      >
        ✕
      </button>

      {/* Live score — pulses on each increment via re-key. Visible
          from the very first pillar so the kid sees the demo
          counter climb during auto-play, too. */}
      {renderState !== "idle" && (
        <div
          key={`score-${score}`}
          style={{
            position: "absolute",
            top: 56,
            left: 0,
            right: 0,
            textAlign: "center",
            fontFamily: "var(--font-nunito), system-ui",
            fontWeight: 900,
            fontSize: 64,
            color: "#fff",
            textShadow: "0 4px 0 #D6396B, 0 6px 14px rgba(0,0,0,0.2)",
            letterSpacing: -2,
            animation: "score-pop 0.32s cubic-bezier(0.22, 1.5, 0.36, 1)",
            zIndex: 4,
            pointerEvents: "none",
          }}
        >
          {score}
        </div>
      )}

      {/* Mascot — Bobo + side wings. Outer div owns the position
          transform (set every RAF tick). Inner div owns the flap
          animation, re-keyed on every tap to retrigger it. */}
      <div
        ref={birdRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 64,
          height: 64,
          willChange: "transform",
          pointerEvents: "none",
          zIndex: 3,
        }}
      >
        <div
          key={`bird-${flapKey}`}
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            animation: "wing-flap 0.32s ease-out",
          }}
        >
          <span
            aria-hidden
            style={{
              position: "absolute",
              top: 18,
              left: -16,
              width: 26,
              height: 18,
              borderRadius: "50% 50% 50% 30%",
              background: wingColor,
              transformOrigin: "100% 50%",
              animation: "wing-left 0.32s ease-out",
              boxShadow: "0 2px 0 rgba(0,0,0,0.10)",
            }}
          />
          <span
            aria-hidden
            style={{
              position: "absolute",
              top: 18,
              right: -16,
              width: 26,
              height: 18,
              borderRadius: "50% 50% 30% 50%",
              background: wingColor,
              transformOrigin: "0% 50%",
              animation: "wing-right 0.32s ease-out",
              boxShadow: "0 2px 0 rgba(0,0,0,0.10)",
            }}
          />
          <Bobo
            mood={renderState === "over" ? "worried" : "excited"}
            tint={tint}
            size={64}
            animate={false}
          />
        </div>
      </div>

      {/* Idle screen.
          Bugsy's bubble hovers just above his centered idle pose
          and sticks around until the kid taps to launch — the tap
          itself dismisses the bubble (the game flips to "playing"
          and this block stops rendering). Taps are gated by
          `introDone` so a quick first tap can't skip the lesson. */}
      {renderState === "idle" && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            // Center horizontally on the bird (now at 50% during idle),
            // and sit roughly half a Bugsy-height above his head.
            top: "26%",
            left: "50%",
            transform: "translate(-50%, 0)",
            maxWidth: 320,
            padding: "16px 22px",
            borderRadius: 22,
            background: "var(--surface)",
            border: "1px solid var(--border-strong)",
            color: "var(--ink)",
            fontFamily: "var(--font-nunito), system-ui",
            fontSize: 16,
            fontWeight: 700,
            lineHeight: 1.45,
            textAlign: "center",
            boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
            animation: "bubble-pop 0.4s cubic-bezier(0.22, 1.5, 0.36, 1)",
            zIndex: 4,
            pointerEvents: "none",
          }}
        >
          {skipTyping ? (
            <span>{INTRO_TEXT}</span>
          ) : (
            <Typewriter
              text={INTRO_TEXT}
              onDone={() => setIntroDone(true)}
              speedMultiplier={1.8}
            />
          )}
          {/* Tap-to-play hint that fades in once typing finishes —
              tells the kid the bubble is ready to be dismissed. */}
          {introDone && (
            <div
              style={{
                marginTop: 10,
                fontFamily: "var(--font-nunito), system-ui",
                fontSize: 12,
                fontWeight: 900,
                letterSpacing: 1,
                textTransform: "uppercase",
                color: "#FF5C8A",
                animation: "tap-pulse 1.2s ease-in-out infinite",
              }}
            >
              Tap to fly →
            </div>
          )}
          {/* Down-pointing tail toward Bugsy below */}
          <span
            aria-hidden
            style={{
              position: "absolute",
              bottom: -8,
              left: "50%",
              transform: "translateX(-50%) rotate(45deg)",
              width: 14,
              height: 14,
              background: "var(--surface)",
              borderRight: "1px solid var(--border-strong)",
              borderBottom: "1px solid var(--border-strong)",
              borderRadius: 2,
            }}
          />
        </div>
      )}

      {/* Best score chip during idle — only when there's a score
          worth showing and the kid is past the explainer. */}
      {renderState === "idle" && introDone && best > 0 && (
        <div
          style={{
            position: "absolute",
            bottom: 32,
            left: 0,
            right: 0,
            textAlign: "center",
            fontFamily: "var(--font-nunito), system-ui",
            fontWeight: 800,
            fontSize: 14,
            color: "#3C3C3C",
            pointerEvents: "none",
            zIndex: 4,
          }}
        >
          <span
            style={{
              background: "rgba(255,255,255,0.7)",
              padding: "6px 14px",
              borderRadius: 9999,
            }}
          >
            Best: {best}
          </span>
        </div>
      )}

      {/* Game over panel */}
      {renderState === "over" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.18)",
            backdropFilter: "blur(2px)",
            WebkitBackdropFilter: "blur(2px)",
            zIndex: 5,
            padding: 24,
          }}
        >
          <div
            style={{
              padding: "22px 28px 18px",
              borderRadius: 22,
              background: "#fff",
              boxShadow: "0 8px 0 rgba(0,0,0,0.14)",
              fontFamily: "var(--font-nunito), system-ui",
              textAlign: "center",
              minWidth: 240,
              animation: "bugsy-pop 0.4s cubic-bezier(0.22, 1.5, 0.36, 1)",
            }}
          >
            <div
              style={{
                fontWeight: 900,
                fontSize: 18,
                color: "#FF5C8A",
                letterSpacing: 0.5,
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              Crash!
            </div>
            <div
              style={{
                fontWeight: 900,
                fontSize: 56,
                color: "#3C3C3C",
                letterSpacing: -2,
                lineHeight: 1,
                marginBottom: 4,
              }}
            >
              {score}
            </div>
            <div
              style={{
                fontWeight: 700,
                fontSize: 13,
                color: "#777",
                marginBottom: 16,
              }}
            >
              Best: {best}
            </div>
            <div
              style={{
                padding: "12px 18px",
                borderRadius: 12,
                background: "#FF5C8A",
                color: "#fff",
                fontWeight: 900,
                letterSpacing: 0.4,
                textTransform: "uppercase",
                fontSize: 15,
                boxShadow: "0 4px 0 #D6396B",
                animation: "tap-pulse 1.2s ease-in-out infinite",
              }}
            >
              Tap to Retry
            </div>
            <button
              type="button"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={onExit}
              style={{
                marginTop: 14,
                background: "transparent",
                border: "none",
                color: "#777",
                fontFamily: "inherit",
                fontWeight: 700,
                fontSize: 14,
                textDecoration: "underline",
                textUnderlineOffset: 4,
                cursor: "pointer",
              }}
            >
              I&apos;m done — save my score
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
