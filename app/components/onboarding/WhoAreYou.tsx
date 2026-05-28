"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Bobo } from "../Mascot";
import { ChunkyButton } from "./ConvoUI";
import { Typewriter } from "../Typewriter";
import type { Mood, UserType } from "../../lib/data";

// First real moment with Bugsy. The box opens, he rises out and
// stretches awake, types out a greeting, and only then do the CTAs
// appear. Tapping him gives a purr + happy wiggle. A gentle ambient
// pad fades in on the first touch (browser autoplay rules mean we
// can't start audio before a gesture).

// closed:   box sealed (brief)
// sleeping: flaps open, Bugsy VISIBLE asleep with z's (~2s dwell)
// waking:   sits up, sleepy
// stretch:  stretches awake, happy
// greeting: types the hello line
// ready:    CTAs appear
type Phase = "closed" | "sleeping" | "waking" | "stretch" | "greeting" | "ready";
const RANK: Record<Phase, number> = {
  closed: 0,
  sleeping: 1,
  waking: 2,
  stretch: 3,
  greeting: 4,
  ready: 5,
};

// A fuller field of fireflies — drifting + blinking on staggered,
// slow loops. Deterministic positions = no hydration mismatch.
const FIREFLIES = [
  { left: "20%", top: "18%", size: 4, delay: 0.0, dur: 7.0 },
  { left: "34%", top: "27%", size: 4, delay: 1.4, dur: 8.0 },
  { left: "48%", top: "14%", size: 3, delay: 2.6, dur: 6.6 },
  { left: "63%", top: "21%", size: 5, delay: 0.8, dur: 9.0 },
  { left: "78%", top: "16%", size: 4, delay: 3.2, dur: 7.8 },
  { left: "27%", top: "41%", size: 3, delay: 2.0, dur: 8.4 },
  { left: "71%", top: "38%", size: 4, delay: 1.1, dur: 7.2 },
  { left: "52%", top: "33%", size: 3, delay: 3.6, dur: 9.2 },
  { left: "13%", top: "52%", size: 4, delay: 0.5, dur: 8.8 },
  { left: "87%", top: "49%", size: 3, delay: 2.9, dur: 7.5 },
  { left: "42%", top: "49%", size: 3, delay: 4.0, dur: 9.6 },
  { left: "61%", top: "55%", size: 4, delay: 1.8, dur: 6.9 },
];

export function WhoAreYou({
  tint,
  onPick,
}: {
  tint: number;
  onPick: (t: UserType) => void;
}) {
  const [phase, setPhase] = useState<Phase>("closed");
  const [wiggleKey, setWiggleKey] = useState(0);
  const audioRef = useRef<AudioContext | null>(null);
  const padRef = useRef<{ stop: () => void } | null>(null);

  // Timed wake sequence. Reduced-motion users land on "ready".
  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setPhase("ready");
      return;
    }
    const timers = [
      // Box pops open quickly so the kid SEES Bugsy sleeping…
      window.setTimeout(() => setPhase("sleeping"), 800),
      // …dozes (z's) for ~2s, then the eyes open fully in one
      // smooth ~1.1s move…
      window.setTimeout(() => setPhase("waking"), 2800),
      // …and he stretches awake as they finish opening.
      window.setTimeout(() => setPhase("stretch"), 3900),
      window.setTimeout(() => setPhase("greeting"), 5000),
    ];
    return () => timers.forEach((t) => clearTimeout(t));
  }, []);

  const rank = RANK[phase];
  const flapsOpen = rank >= RANK.sleeping;
  const sittingUp = rank >= RANK.waking;
  const showText = rank >= RANK.greeting;
  const showCTA = phase === "ready";
  // sleep (with z's) through the sleeping dwell, sleepy as he stirs,
  // then happy once he's stretching/awake.
  const mood: Mood =
    rank <= RANK.sleeping ? "sleep" : rank === RANK.waking ? "sleepy" : "happy";
  // Deep in the box when closed → slumped but visible while asleep
  // → sits fully up when waking.
  const bugsyTranslateY = phase === "closed" ? 74 : sittingUp ? 0 : 22;
  // Eyes go straight from shut to fully open in one smooth move
  // (no half-open beat) — the mascot's ~1.1s eye-open transition
  // eases the whole reveal.
  const eyeOpen = rank <= RANK.sleeping ? 0 : 1;

  // ── Audio ────────────────────────────────────────────────
  const ensureAudio = useCallback(() => {
    if (audioRef.current) return audioRef.current;
    try {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      audioRef.current = new AC();
    } catch {
      // audio optional
    }
    return audioRef.current;
  }, []);

  const playPurr = useCallback(() => {
    const ctx = ensureAudio();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.value = 58;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 220;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.07, now + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.1);
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 22;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.04;
    lfo.connect(lfoGain).connect(gain.gain);
    osc.connect(filter).connect(gain).connect(ctx.destination);
    osc.start(now);
    lfo.start(now);
    osc.stop(now + 1.15);
    lfo.stop(now + 1.15);
  }, [ensureAudio]);

  const startPad = useCallback(() => {
    const ctx = ensureAudio();
    if (!ctx || padRef.current) return;
    const now = ctx.currentTime;
    const master = ctx.createGain();
    master.gain.setValueAtTime(0.0001, now);
    master.gain.exponentialRampToValueAtTime(0.045, now + 2.5);
    master.connect(ctx.destination);
    const oscs = [220, 277.2, 329.6].map((f) => {
      const o = ctx.createOscillator();
      o.type = "sine";
      o.frequency.value = f;
      const g = ctx.createGain();
      g.gain.value = 0.33;
      o.connect(g).connect(master);
      o.start(now);
      return o;
    });
    padRef.current = {
      stop: () => {
        const t = ctx.currentTime;
        master.gain.exponentialRampToValueAtTime(0.0001, t + 1);
        oscs.forEach((o) => o.stop(t + 1.1));
      },
    };
  }, [ensureAudio]);

  useEffect(() => {
    return () => {
      padRef.current?.stop();
      const ctx = audioRef.current;
      if (ctx && ctx.state !== "closed") {
        window.setTimeout(() => ctx.close().catch(() => {}), 1300);
      }
    };
  }, []);

  const onPet = useCallback(() => {
    // Tapping early skips Bugsy straight to greeting (text types,
    // then CTAs). Always purr + wiggle + kick off the ambient pad.
    setPhase((p) => (RANK[p] < RANK.greeting ? "greeting" : p));
    ensureAudio();
    startPad();
    playPurr();
    setWiggleKey((k) => k + 1);
  }, [ensureAudio, startPad, playPurr]);

  const pick = (t: UserType) => {
    padRef.current?.stop();
    onPick(t);
  };

  // Bugsy wrapper animation: stretch once on entering "stretch",
  // wiggle on tap, otherwise none.
  const bugsyAnim =
    phase === "stretch"
      ? "bugsy-wake-stretch 0.9s cubic-bezier(0.22, 1, 0.36, 1)"
      : wiggleKey > 0 && rank >= RANK.greeting
      ? "bugsy-wiggle 0.5s ease-in-out"
      : "none";

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        background:
          "radial-gradient(ellipse 80% 60% at 50% 60%, #463c66 0%, #2c2545 52%, #1d1830 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "56px 24px 32px",
        boxSizing: "border-box",
        color: "#fff",
      }}
    >
      {/* Fireflies */}
      {FIREFLIES.map((f, i) => (
        <span
          key={i}
          aria-hidden
          style={{
            position: "absolute",
            left: f.left,
            top: f.top,
            width: f.size,
            height: f.size,
            borderRadius: "50%",
            background: "#FFE27A",
            boxShadow: "0 0 8px 2px rgba(255, 220, 110, 0.75)",
            animation: `firefly ${f.dur}s ease-in-out ${f.delay}s infinite`,
            pointerEvents: "none",
          }}
        />
      ))}

      <div style={{ flex: 1 }} />

      {/* Dialogue bubble — sits above Bugsy with a tail pointing
          down at him, so it reads as him speaking. Space is
          reserved (minHeight) so the box scene doesn't jump when
          the bubble appears. */}
      <div
        style={{
          minHeight: 86,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          marginBottom: 6,
        }}
      >
        {showText && (
          <div
            style={{
              position: "relative",
              maxWidth: 300,
              padding: "14px 22px",
              borderRadius: 22,
              background: "var(--surface)",
              border: "1px solid var(--border-strong)",
              color: "var(--ink)",
              fontFamily: "var(--font-nunito), system-ui",
              fontSize: 18,
              fontWeight: 800,
              lineHeight: 1.4,
              textAlign: "center",
              boxShadow: "0 8px 22px rgba(0,0,0,0.28)",
              animation: "bubble-pop 0.4s cubic-bezier(0.22, 1.5, 0.36, 1)",
            }}
          >
            <Typewriter
              text="Hi, I'm Bugsy. Follow me to discover something cool"
              speedMultiplier={1.4}
              onDone={() => setPhase("ready")}
            />
            {/* down-pointing tail toward Bugsy */}
            <span
              aria-hidden
              style={{
                position: "absolute",
                bottom: -8,
                left: "50%",
                transform: "translateX(-50%) rotate(45deg)",
                width: 16,
                height: 16,
                background: "var(--surface)",
                borderRight: "1px solid var(--border-strong)",
                borderBottom: "1px solid var(--border-strong)",
                borderRadius: 3,
              }}
            />
          </div>
        )}
      </div>

      {/* Box + Bugsy scene */}
      <div
        style={{
          position: "relative",
          width: 280,
          height: 240,
          display: "flex",
          justifyContent: "center",
        }}
      >
        {/* Dark box interior — revealed once the flaps open */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            bottom: 6,
            left: "50%",
            transform: "translateX(-50%)",
            width: 188,
            height: 124,
            background: "linear-gradient(#2c2013, #1c1209)",
            borderRadius: "12px 12px 10px 10px",
            zIndex: 1,
          }}
        />

        {/* Bugsy — rises out of the box (translateY) then stretches.
            onPet wakes/purrs; the inner key re-mounts on tap so the
            wiggle replays. */}
        <div
          onPointerDown={onPet}
          role="button"
          aria-label="Pet Bugsy"
          style={{
            position: "absolute",
            bottom: 70,
            left: "50%",
            transform: `translateX(-50%) translateY(${bugsyTranslateY}px)`,
            transition: "transform 0.95s cubic-bezier(0.22, 1, 0.36, 1)",
            zIndex: 2,
            cursor: "pointer",
            touchAction: "manipulation",
          }}
        >
          <div
            key={`bugsy-${phase}-${wiggleKey}`}
            style={{ animation: bugsyAnim, transformOrigin: "bottom center" }}
          >
            <Bobo mood={mood} tint={tint} size={150} eyeOpen={eyeOpen} />
          </div>
        </div>

        {/* Box flaps — closed they cap the opening (and hide Bugsy);
            they swing open ±118° as the box "opens". Kept in front
            (z=4) so the closed state fully conceals him. */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            bottom: 96,
            left: 42,
            width: 98,
            height: 46,
            background: "linear-gradient(160deg, #dcb98a 0%, #c39c6c 100%)",
            border: "2px solid #a8825a",
            borderRadius: "8px 4px 3px 3px",
            transformOrigin: "left bottom",
            transform: flapsOpen ? "rotate(-118deg)" : "rotate(0deg)",
            transition: "transform 0.95s cubic-bezier(0.34, 1.3, 0.5, 1)",
            boxShadow: "inset 0 3px 6px rgba(255,255,255,0.16)",
            zIndex: 4,
          }}
        />
        <div
          aria-hidden
          style={{
            position: "absolute",
            bottom: 96,
            left: 140,
            width: 98,
            height: 46,
            background: "linear-gradient(200deg, #dcb98a 0%, #c39c6c 100%)",
            border: "2px solid #a8825a",
            borderRadius: "4px 8px 3px 3px",
            transformOrigin: "right bottom",
            transform: flapsOpen ? "rotate(118deg)" : "rotate(0deg)",
            transition: "transform 0.95s cubic-bezier(0.34, 1.3, 0.5, 1)",
            boxShadow: "inset 0 3px 6px rgba(255,255,255,0.16)",
            zIndex: 4,
          }}
        />

        {/* Box front wall — covers Bugsy's lower half, in front. */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: 196,
            height: 100,
            background:
              "linear-gradient(168deg, #e0bd8d 0%, #cba472 60%, #bd9462 100%)",
            border: "2px solid #ac8458",
            borderRadius: "8px 8px 14px 14px",
            boxShadow:
              "inset 0 6px 10px rgba(255,255,255,0.18), inset 0 -8px 14px rgba(0,0,0,0.14)",
            zIndex: 3,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: "50%",
              width: 2,
              background: "rgba(0,0,0,0.10)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 12,
              left: "50%",
              transform: "translateX(-50%)",
              fontSize: 16,
              opacity: 0.5,
            }}
          >
            ♥
          </div>
        </div>

        {/* Ground shadow */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            bottom: -6,
            left: "50%",
            transform: "translateX(-50%)",
            width: 220,
            height: 18,
            borderRadius: "50%",
            background: "rgba(0,0,0,0.30)",
            filter: "blur(6px)",
            zIndex: 0,
          }}
        />
      </div>

      <div style={{ flex: 1 }} />

      {/* CTAs — only after the greeting finishes typing. */}
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          opacity: showCTA ? 1 : 0,
          transform: showCTA ? "translateY(0)" : "translateY(12px)",
          transition: "opacity 0.5s ease, transform 0.5s ease",
          pointerEvents: showCTA ? "auto" : "none",
        }}
      >
        <ChunkyButton onClick={() => pick("parent")}>I&apos;m a Parent</ChunkyButton>
        <ChunkyButton onClick={() => pick("child")} variant="secondary">
          I&apos;m a Child
        </ChunkyButton>
      </div>
    </div>
  );
}
