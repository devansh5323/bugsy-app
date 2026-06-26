"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { Mood } from "../lib/data";

// Reduced-motion guard. Wrapped so it works at module load (SSR) too.
function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

type BoboProps = {
  mood?: Mood;
  tint?: number;
  size?: number;
  animate?: boolean;
  hat?: string | null;
  // Continuous anger 0..1. When provided, drives the red body
  // tint, V-brows, steam, messy fur, and tremble amplitude
  // smoothly — independent of mood. Lets callers (the soothe
  // screen, etc.) interpolate the "cool-down" rather than
  // popping between discrete moods. Falls back to 1 when
  // mood === "angry" and angerLevel is omitted (back-compat).
  angerLevel?: number;
  // Continuous eye-openness 0..1. When provided, the eyes render
  // open with a body-colored eyelid that slides up + fades as the
  // value rises — giving a smooth "waking up" animation instead of
  // popping between sleep/sleepy/open eye shapes. Blinking is
  // suppressed while this is controlled. Undefined = mood drives eyes.
  eyeOpen?: number;
  // When true, the tail swishes fast and wide (an excited, happy wag)
  // instead of its slow idle sway. Used for petting/cuddle moments.
  tailWag?: boolean;
  // When true, the feet step alternately (walking / running animation).
  walking?: boolean;
  // When true, render an open mouth (eating). Overrides the mood mouth.
  mouthOpen?: boolean;
  // Continuous 0..1 "scared/anxious fur" — raises a messy crown of fur
  // tufts off the head (in the calm body colour, NOT the angry-red rig),
  // for frightened beats like the thunderstorm. Independent of anger.
  frazzled?: number;
  // When true, the right paw (shy pose) pulses with a purple glow to
  // signal to the user that they should tap it.
  glowRightPaw?: boolean;
};

// Hats sit above the ears — y centred around -120
function Hat({ kind }: { kind: string }) {
  switch (kind) {
    case "acorn":
      return (
        <g>
          <ellipse cx="0" cy="-118" rx="42" ry="22" fill="oklch(45% 0.08 50)"/>
          <path d="M -42 -118 Q 0 -150 42 -118 Q 30 -108 0 -108 Q -30 -108 -42 -118" fill="oklch(55% 0.11 50)"/>
          <path d="M -5 -148 Q 0 -160 5 -148" stroke="oklch(35% 0.06 50)" strokeWidth="3" strokeLinecap="round" fill="none"/>
        </g>
      );
    case "crown":
      return (
        <g>
          <path d="M -42 -100 L -42 -135 L -22 -118 L 0 -148 L 22 -118 L 42 -135 L 42 -100 Z" fill="oklch(82% 0.16 80)" stroke="oklch(55% 0.14 70)" strokeWidth="2.5" strokeLinejoin="round"/>
          <circle cx="-22" cy="-119" r="4" fill="oklch(60% 0.20 25)"/>
          <circle cx="0"   cy="-138" r="4" fill="oklch(60% 0.20 25)"/>
          <circle cx="22"  cy="-119" r="4" fill="oklch(60% 0.20 25)"/>
          <rect x="-44" y="-100" width="88" height="6" fill="oklch(72% 0.14 70)"/>
        </g>
      );
    case "wizard":
      return (
        <g>
          <path d="M -36 -100 L 0 -180 L 36 -100 Z" fill="oklch(38% 0.13 295)" stroke="oklch(28% 0.10 295)" strokeWidth="2.5" strokeLinejoin="round"/>
          <circle cx="-14" cy="-130" r="3" fill="oklch(85% 0.16 90)"/>
          <circle cx="10"  cy="-152" r="2.5" fill="oklch(85% 0.16 90)"/>
          <circle cx="-6"  cy="-160" r="2" fill="oklch(85% 0.16 90)"/>
          <rect x="-44" y="-102" width="88" height="10" fill="oklch(48% 0.12 295)" rx="2"/>
          <rect x="-44" y="-100" width="88" height="3" fill="oklch(85% 0.16 90)"/>
        </g>
      );
    case "graduate":
      return (
        <g>
          <rect x="-32" y="-110" width="64" height="20" fill="oklch(22% 0.02 280)" rx="3"/>
          <polygon points="-52,-114 0,-138 52,-114 0,-90" fill="oklch(22% 0.02 280)" stroke="oklch(10% 0 0)" strokeWidth="1.5"/>
          <line x1="0" y1="-116" x2="42" y2="-92" stroke="oklch(60% 0.20 25)" strokeWidth="2.5" strokeLinecap="round"/>
          <circle cx="44" cy="-90" r="6" fill="oklch(60% 0.20 25)"/>
        </g>
      );
    case "party":
      return (
        <g>
          <path d="M -28 -100 L 0 -170 L 28 -100 Z" fill="oklch(72% 0.18 25)" stroke="oklch(50% 0.16 25)" strokeWidth="2"/>
          <path d="M -28 -100 L 28 -100" stroke="oklch(40% 0.12 25)" strokeWidth="2" strokeLinecap="round"/>
          <path d="M -22 -118 L 22 -118" stroke="oklch(85% 0.18 90)" strokeWidth="3" strokeLinecap="round" strokeDasharray="4 4"/>
          <path d="M -14 -140 L 14 -140" stroke="oklch(72% 0.16 160)" strokeWidth="3" strokeLinecap="round" strokeDasharray="4 4"/>
          <circle cx="0" cy="-172" r="6" fill="oklch(85% 0.16 90)"/>
          <path d="M 0 -178 L 0 -190 M -6 -184 L 6 -184" stroke="oklch(85% 0.16 90)" strokeWidth="2" strokeLinecap="round"/>
        </g>
      );
    case "star":
      return (
        <g>
          <rect x="-50" y="-112" width="100" height="14" rx="7" fill="oklch(68% 0.18 28)" stroke="oklch(48% 0.16 28)" strokeWidth="2"/>
          <g transform="translate(0,-118)">
            <path d="M 0 -16 L 5 -5 L 17 -5 L 7 2 L 11 13 L 0 6 L -11 13 L -7 2 L -17 -5 L -5 -5 Z"
                  fill="oklch(88% 0.16 90)" stroke="oklch(60% 0.16 70)" strokeWidth="1.5" strokeLinejoin="round"/>
          </g>
        </g>
      );
    default:
      return null;
  }
}

export function Bobo({ mood = "happy", tint = 18, size = 220, animate = true, hat, angerLevel, eyeOpen, tailWag, walking, mouthOpen, frazzled, glowRightPaw }: BoboProps) {
  const lidControlled = eyeOpen !== undefined;
  const eyeOpenClamped = Math.max(0, Math.min(1, eyeOpen ?? 1));
  // Continuous anger 0..1. mood="angry" implies 1 when angerLevel
  // is omitted, so older callers still get the full angry look.
  const safeAnger = Math.max(
    0,
    Math.min(1, angerLevel ?? (mood === "angry" ? 1 : 0)),
  );
  // Lerp hue along the shortest path around the color wheel.
  // For tint=220 (sky-blue) → 25 (angry red) the short path runs
  // through magenta/pink (~290), so the cool-down "fades" through
  // a warm pink instead of an ugly yellow-green detour.
  const calmH = tint;
  const angryH = 25;
  const deltaH = ((angryH - calmH + 540) % 360) - 180;
  const h = (((calmH + deltaH * safeAnger) % 360) + 360) % 360;
  const lerp = (a: number, b: number) => a + (b - a) * safeAnger;
  const bodyTop = `oklch(${lerp(88, 82)}% ${lerp(0.10, 0.13)} ${h})`;
  const bodyMid = `oklch(${lerp(76, 68)}% ${lerp(0.15, 0.21)} ${h})`;
  const bodyBottom = `oklch(${lerp(58, 50)}% ${lerp(0.17, 0.22)} ${h})`;
  const earInner = `oklch(78% 0.14 ${(h + 20) % 360})`;
  const cheek = `oklch(72% 0.17 ${(h + 12) % 360})`;
  const highlight = `oklch(97% 0.03 ${h})`;
  const shadow = `oklch(28% 0.08 ${h} / 0.3)`;
  const nose = "oklch(68% 0.14 20)";
  const tummy = `oklch(93% 0.05 ${h})`;
  // Scared-fur amount + colour. Uses the CALM body hue so frightened
  // Bugsy keeps his blue coat (not the angry-red rig).
  const safeFraz = Math.max(0, Math.min(1, frazzled ?? 0));
  // Tufts sit at the top of the head, where the coat is at its lightest
  // (≈ bodyTop), so matching that shade lets them blend instead of
  // reading as dark stickers. A slightly darker tip adds soft depth.
  const furColor = `oklch(86% 0.11 ${calmH})`;
  const furColorTip = `oklch(80% 0.13 ${calmH})`;

  const id = useId().replace(/:/g, "_");

  // ── Aliveness: periodic blinks ───────────────────────────
  // Every 3.5-6s, briefly close the eyes for ~130ms. Skipped
  // when `animate` is false (static icon contexts) or the user
  // has prefers-reduced-motion on.
  const [blinking, setBlinking] = useState(false);
  useEffect(() => {
    if (!animate || lidControlled || prefersReducedMotion()) return;
    let cancelled = false;
    let timer: number | null = null;
    const tick = () => {
      if (cancelled) return;
      const delay = 3500 + Math.random() * 2500;
      timer = window.setTimeout(() => {
        if (cancelled) return;
        setBlinking(true);
        window.setTimeout(() => {
          if (!cancelled) setBlinking(false);
        }, 130);
        tick();
      }, delay);
    };
    tick();
    return () => {
      cancelled = true;
      if (timer !== null) clearTimeout(timer);
    };
  }, [animate, lidControlled]);

  // ── Aliveness: eyes follow pointer ───────────────────────
  // Tracks pointer position and offsets pupils slightly toward
  // it (capped + RAF-throttled so we don't re-render per pixel).
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [pupilOffset, setPupilOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  useEffect(() => {
    if (!animate || prefersReducedMotion()) return;
    let rafId: number | null = null;
    let lastEvent: { clientX: number; clientY: number } | null = null;
    const apply = () => {
      rafId = null;
      if (!lastEvent || !svgRef.current) return;
      const rect = svgRef.current.getBoundingClientRect();
      // Eyes sit roughly 42% from the top of Bugsy's bounding box.
      const ecx = rect.left + rect.width / 2;
      const ecy = rect.top + rect.height * 0.42;
      const dx = lastEvent.clientX - ecx;
      const dy = lastEvent.clientY - ecy;
      const dist = Math.hypot(dx, dy) || 1;
      // Cap at ~2.8 user units in the SVG viewBox; ramp in over
      // the first ~120 px of distance so close pointers don't
      // make the eyes spasm.
      const MAX = 2.8;
      const factor = Math.min(MAX, dist / 120);
      setPupilOffset({ x: (dx / dist) * factor, y: (dy / dist) * factor });
    };
    const onMove = (e: PointerEvent) => {
      lastEvent = { clientX: e.clientX, clientY: e.clientY };
      if (rafId === null) rafId = requestAnimationFrame(apply);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [animate]);

  type EyeCfg = {
    lx: number; rx: number; y: number; r: number;
    curve?: boolean;
    happyArc?: boolean;
    closed?: boolean;
    halfClosed?: boolean;       // sleepy
    pupilDown?: boolean;        // hungry — looking down
    sad?: boolean;              // sad eyes (smaller, dull)
    bigShine?: boolean;         // excited — extra-large pupils with bright shine
    worried?: boolean;          // worried eyes (wider whites)
  };
  const eyesMap: Record<Mood, EyeCfg> = {
    happy:    { lx: -20, rx: 20, y: -10, r: 12 },
    waving:   { lx: -20, rx: 20, y: -10, r: 12 },
    thinking: { lx: -22, rx: 18, y: -10, r: 10, curve: true },
    cheer:    { lx: -20, rx: 20, y: -12, r: 0,  happyArc: true },
    sleep:    { lx: -20, rx: 20, y: -8,  r: 0,  closed: true },
    blink:    { lx: -20, rx: 20, y: -8,  r: 0,  closed: true },
    sad:      { lx: -18, rx: 18, y: -6,  r: 8,  sad: true },
    sleepy:   { lx: -20, rx: 20, y: -8,  r: 0,  halfClosed: true },
    excited:  { lx: -20, rx: 20, y: -10, r: 14, bigShine: true },
    worried:  { lx: -20, rx: 20, y: -10, r: 10, worried: true },
    hungry:   { lx: -20, rx: 20, y: -8,  r: 10, pupilDown: true },
    shy:      { lx: -20, rx: 20, y: -12, r: 14, bigShine: true },
    angry:    { lx: -20, rx: 20, y: -10, r: 10 },
  };
  // When the eyelid system is driving the eyes, force a normal
  // open-eye geometry (sleep/sleepy configs use r:0, which would
  // render invisible pupils under the lid).
  const eyes = lidControlled
    ? { lx: -20, rx: 20, y: -10, r: 12 }
    : eyesMap[mood] ?? eyesMap.happy;

  const mouthMap: Record<Mood, React.ReactNode> = {
    happy:    <path d="M 0 22 Q -6 28 -10 24 M 0 22 Q 6 28 10 24" stroke="#2a1028" strokeWidth="2.8" fill="none" strokeLinecap="round"/>,
    waving:   <path d="M 0 22 Q -6 28 -10 24 M 0 22 Q 6 28 10 24" stroke="#2a1028" strokeWidth="2.8" fill="none" strokeLinecap="round"/>,
    thinking: <path d="M -5 24 Q 0 22 5 24" stroke="#2a1028" strokeWidth="2.8" fill="none" strokeLinecap="round"/>,
    cheer:    <path d="M -12 20 Q 0 36 12 20 Z" fill="#2a1028"/>,
    sleep:    <path d="M -4 24 Q 0 26 4 24" stroke="#2a1028" strokeWidth="2.5" fill="none" strokeLinecap="round"/>,
    blink:    <path d="M 0 22 Q -6 28 -10 24 M 0 22 Q 6 28 10 24" stroke="#2a1028" strokeWidth="2.8" fill="none" strokeLinecap="round"/>,
    sad:      <path d="M -10 28 Q 0 22 10 28" stroke="#2a1028" strokeWidth="2.8" fill="none" strokeLinecap="round"/>,
    sleepy:   <ellipse cx="0" cy="25" rx="3.5" ry="2.8" fill="#2a1028"/>,
    excited:  <path d="M -13 20 Q 0 36 13 20 Q 8 25 0 25 Q -8 25 -13 20 Z" fill="#2a1028"/>,
    worried:  <ellipse cx="0" cy="26" rx="3" ry="3" fill="#2a1028"/>,
    shy:      <path d="M -5 28 Q 0 32 5 28" stroke="#2a1028" strokeWidth="2.2" fill="none" strokeLinecap="round"/>,
    hungry:   (
      <>
        <ellipse cx="0" cy="26" rx="5" ry="4" fill="#2a1028"/>
        <ellipse cx="0" cy="30" rx="3" ry="1.5" fill={nose}/>
      </>
    ),
    angry: (
      <path
        d="M -14 24 L -10 28 L -6 24 L -2 28 L 2 24 L 6 28 L 10 24 L 14 28"
        stroke="#2a1028"
        strokeWidth="2.6"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  };

  return (
    <div
      style={{
        width: size,
        height: size,
        position: "relative",
        display: "inline-block",
        animation: animate ? "bobo-float 4.2s ease-in-out infinite" : "none",
      }}
    >
      <div
        style={
          {
            width: "100%",
            height: "100%",
            animation:
              animate && safeAnger > 0.02
                ? "bobo-tremble 0.18s ease-in-out infinite"
                : "none",
            "--anger": safeAnger,
          } as React.CSSProperties
        }
      >
      <svg ref={svgRef} viewBox="-120 -140 240 260" width={size} height={size} style={{ overflow: "visible" }}>
        <defs>
          <radialGradient id={`${id}-body`} cx="0.35" cy="0.25" r="0.9">
            <stop offset="0%" stopColor={highlight}/>
            <stop offset="35%" stopColor={bodyTop}/>
            <stop offset="75%" stopColor={bodyMid}/>
            <stop offset="100%" stopColor={bodyBottom}/>
          </radialGradient>
          <radialGradient id={`${id}-ear`} cx="0.4" cy="0.3" r="0.9">
            <stop offset="0%" stopColor={bodyTop}/>
            <stop offset="100%" stopColor={bodyMid}/>
          </radialGradient>
          {/* Scared-fur tuft gradient: slightly defined tip → lighter
              base so the standing fur melts into the light crown. */}
          <linearGradient id={`${id}-fur`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={furColorTip}/>
            <stop offset="100%" stopColor={furColor}/>
          </linearGradient>
          <radialGradient id={`${id}-cheek`} cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor={cheek} stopOpacity="0.85"/>
            <stop offset="100%" stopColor={cheek} stopOpacity="0"/>
          </radialGradient>
          <radialGradient id={`${id}-shine`} cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.95"/>
            <stop offset="100%" stopColor="#fff" stopOpacity="0"/>
          </radialGradient>
          {glowRightPaw && (
            <linearGradient id={`${id}-paw-grad`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%"   stopColor="#c084fc"/>
              <stop offset="45%"  stopColor="#f472b6"/>
              <stop offset="100%" stopColor="#fb923c"/>
            </linearGradient>
          )}
        </defs>

        <ellipse cx="0" cy="96" rx="72" ry="10" fill={shadow}/>

        {/* Feet — rendered outside the squish group so they stay
            anchored to the ground while the body bobs above them.
            Bigger and a touch more spread than v1 so they read as
            actual feet from a glance, not pebbles. Highlight on
            the upper rim plus a darker pad on the underside give
            them the same 3D feel as the body. */}
        {/* Left foot — wrapped so it can rock while walking */}
        <g
          style={{
            transformOrigin: "-28px 86px",
            animation: walking ? "bobo-foot-step 0.42s ease-in-out infinite" : undefined,
          }}
        >
          <ellipse cx="-28" cy="86" rx="26" ry="13" fill={bodyMid}/>
          {/* darker underside */}
          <ellipse cx="-28" cy="91" rx="14" ry="4" fill={bodyBottom} opacity="0.42"/>
          {/* toe beans */}
          <circle cx="-44" cy="79" r="3" fill={bodyBottom} opacity="0.55"/>
          <circle cx="-28" cy="76" r="3" fill={bodyBottom} opacity="0.55"/>
          <circle cx="-12" cy="79" r="3" fill={bodyBottom} opacity="0.55"/>
          {/* upper-rim highlight */}
          <path d="M -48 82 Q -28 73 -8 82" stroke={highlight} strokeWidth="2.5" fill="none" opacity="0.5" strokeLinecap="round"/>
          {/* tiny specular shine, top-left */}
          <ellipse cx="-38" cy="81" rx="5" ry="2" fill="#fff" opacity="0.35"/>
        </g>

        {/* Right foot — same animation but offset so it alternates */}
        <g
          style={{
            transformOrigin: "28px 86px",
            animation: walking ? "bobo-foot-step 0.42s ease-in-out -0.21s infinite" : undefined,
          }}
        >
          <ellipse cx="28" cy="86" rx="26" ry="13" fill={bodyMid}/>
          <ellipse cx="28" cy="91" rx="14" ry="4" fill={bodyBottom} opacity="0.42"/>
          <circle cx="12" cy="79" r="3" fill={bodyBottom} opacity="0.55"/>
          <circle cx="28" cy="76" r="3" fill={bodyBottom} opacity="0.55"/>
          <circle cx="44" cy="79" r="3" fill={bodyBottom} opacity="0.55"/>
          <path d="M 8 82 Q 28 73 48 82" stroke={highlight} strokeWidth="2.5" fill="none" opacity="0.5" strokeLinecap="round"/>
          <ellipse cx="18" cy="81" rx="5" ry="2" fill="#fff" opacity="0.35"/>
        </g>

        <g
          style={{
            animation: tailWag
              ? "bobo-tail-wag 0.5s ease-in-out infinite"
              : animate
              ? "bobo-tail 3.4s ease-in-out infinite"
              : "none",
            transformOrigin: "58px 60px",
          }}
        >
          <path d="M 58 60 C 90 48 102 20 96 -12 C 94 -24 82 -28 78 -16 C 76 -4 86 6 76 22 C 68 38 56 48 44 56 Z" fill={`url(#${id}-body)`}/>
          <path d="M 62 58 C 85 48 96 26 92 0" stroke={highlight} strokeWidth="3" fill="none" opacity="0.4" strokeLinecap="round"/>
        </g>

        <g
          style={{
            animation: animate ? "bobo-squish 3.6s ease-in-out infinite" : "none",
            transformOrigin: "center",
          }}
        >
          <g>
            <path d="M -72 -52 L -88 -108 Q -88 -112 -82 -110 L -44 -82 Z" fill={`url(#${id}-ear)`}/>
            <path d="M -72 -56 L -80 -96 Q -80 -98 -76 -96 L -52 -78 Z" fill={earInner} opacity="0.75"/>
            <path d="M 72 -52 L 88 -108 Q 88 -112 82 -110 L 44 -82 Z" fill={`url(#${id}-ear)`}/>
            <path d="M 72 -56 L 80 -96 Q 80 -98 76 -96 L 52 -78 Z" fill={earInner} opacity="0.75"/>
          </g>

          {/* Scared/anxious fur — a messy crown of tufts that stand off
              the head. Drawn BEFORE the body so the body occludes each
              tuft's base and only the soft tips poke through the
              silhouette, melting into the coat. Driven by `frazzled`
              (opacity) so it raises + settles smoothly. */}
          {safeFraz > 0.01 && (
            <g
              style={{
                opacity: safeFraz,
                transformOrigin: "center bottom",
                animation:
                  animate && !prefersReducedMotion()
                    ? "bobo-fur-quiver 0.5s ease-in-out infinite"
                    : "none",
              }}
              fill={`url(#${id}-fur)`}
            >
              <path d="M -42 -66 L -48 -98 L -26 -70 Z" />
              <path d="M -28 -70 L -34 -110 L -14 -72 Z" />
              <path d="M -14 -72 L -18 -118 L 2 -74 Z" />
              <path d="M 0 -74 L 5 -121 L 16 -73 Z" />
              <path d="M 14 -72 L 22 -115 L 30 -72 Z" />
              <path d="M 28 -70 L 38 -107 L 44 -70 Z" />
            </g>
          )}

          <path
            d="M 0 -88
               C 56 -88  94 -52  94 -4
               C 94 48  60 90  0  90
               C -60 90 -94 48 -94 -4
               C -94 -52 -56 -88 0 -88 Z"
            fill={`url(#${id}-body)`}
          />

          {/* Arms / paws — Duolingo-style, sticking out at chest
              level, slightly outside the body silhouette. Inside
              the squish group so they bob with the body. Each arm
              is wrapped in a single <g transform="rotate(…)"> so
              every detail (oval body, paw pad, toe beans, highlight)
              shares the same rotation pivot and stays geometrically
              consistent. Left arm always renders; right arm is
              suppressed during `waving` mood since the wave
              animation already draws a raised right arm. */}
          {mood !== "shy" && (
            mood === "waving" ? (
              // Waving: left arm hangs normally so right arm can wave solo
              <g transform="rotate(-14 -82 48)">
                <ellipse cx="-82" cy="48" rx="15" ry="22" fill={bodyMid}/>
                <ellipse cx="-82" cy="64" rx="7" ry="4.5" fill={bodyBottom} opacity="0.45"/>
                <circle cx="-88" cy="56" r="1.8" fill={bodyBottom} opacity="0.55"/>
                <circle cx="-82" cy="54" r="1.8" fill={bodyBottom} opacity="0.55"/>
                <circle cx="-76" cy="56" r="1.8" fill={bodyBottom} opacity="0.55"/>
                <path d="M -94 32 Q -98 48 -92 66" stroke={highlight} strokeWidth="2.5" fill="none" opacity="0.5" strokeLinecap="round"/>
                <ellipse cx="-86" cy="36" rx="3.5" ry="2.5" fill="#fff" opacity="0.4"/>
              </g>
            ) : (
              // Default: left paw raised — signature greeting pose
              <g>
                <path d="M -78 14 Q -108 -10 -104 -46" stroke={bodyMid} strokeWidth="22" fill="none" strokeLinecap="round"/>
                <path d="M -74 18 Q -100 -6 -96 -38" stroke={highlight} strokeWidth="3" fill="none" opacity="0.45" strokeLinecap="round"/>
                <circle cx="-104" cy="-48" r="16" fill={bodyMid}/>
                <ellipse cx="-104" cy="-42" rx="6.5" ry="4.5" fill={bodyBottom} opacity="0.5"/>
                <circle cx="-112" cy="-56" r="2.2" fill={bodyBottom} opacity="0.55"/>
                <circle cx="-104" cy="-60" r="2.2" fill={bodyBottom} opacity="0.55"/>
                <circle cx="-96" cy="-56" r="2.2" fill={bodyBottom} opacity="0.55"/>
                <ellipse cx="-110" cy="-54" rx="4.5" ry="2.5" fill="#fff" opacity="0.45"/>
              </g>
            )
          )}
          {mood !== "waving" && mood !== "shy" && (
            <g transform="rotate(14 82 48)">
              <ellipse cx="82" cy="48" rx="15" ry="22" fill={bodyMid}/>
              <ellipse cx="82" cy="64" rx="7" ry="4.5" fill={bodyBottom} opacity="0.45"/>
              <circle cx="76" cy="56" r="1.8" fill={bodyBottom} opacity="0.55"/>
              <circle cx="82" cy="54" r="1.8" fill={bodyBottom} opacity="0.55"/>
              <circle cx="88" cy="56" r="1.8" fill={bodyBottom} opacity="0.55"/>
              <path d="M 94 32 Q 98 48 92 66" stroke={highlight} strokeWidth="2.5" fill="none" opacity="0.5" strokeLinecap="round"/>
              <ellipse cx="78" cy="36" rx="3.5" ry="2.5" fill="#fff" opacity="0.4"/>
            </g>
          )}

          <ellipse cx="0" cy="56" rx="42" ry="26" fill={tummy} opacity="0.55"/>

          <path d="M -72 -48 C -55 -82 -20 -92 10 -90" stroke={highlight} strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.55"/>
          <ellipse cx="-24" cy="-58" rx="30" ry="14" fill={`url(#${id}-shine)`} opacity="0.9"/>

          <ellipse cx="-48" cy="20" rx="16" ry="10" fill={`url(#${id}-cheek)`}/>
          <ellipse cx="48" cy="20" rx="16" ry="10" fill={`url(#${id}-cheek)`}/>

          {/* Eye block — wrapped so pointer-tracking offset darts
              the eyes as one unit, and blinks can briefly override
              the mood's eye variant with the closed-eye shape.
              Sleepy/half-closed moods skip the blink override since
              they're already half-shut. */}
          <g
            style={{
              transform: `translate(${pupilOffset.x}px, ${pupilOffset.y}px)`,
              transition:
                "transform 0.28s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
          {lidControlled ? (
            <>
              {/* Closed-eye lash lines — shown while shut, fade out
                  as the eyes open. No overlay lid (that bled through
                  mid-transition); instead the pupils themselves
                  scale open below. */}
              <g
                style={{
                  opacity: 1 - eyeOpenClamped,
                  transition: "opacity 0.9s ease",
                }}
              >
                <path d={`M ${eyes.lx - eyes.r - 2} ${eyes.y} Q ${eyes.lx} ${eyes.y + 7} ${eyes.lx + eyes.r + 2} ${eyes.y}`} stroke="#1a1420" strokeWidth="3.2" fill="none" strokeLinecap="round"/>
                <path d={`M ${eyes.rx - eyes.r - 2} ${eyes.y} Q ${eyes.rx} ${eyes.y + 7} ${eyes.rx + eyes.r + 2} ${eyes.y}`} stroke="#1a1420" strokeWidth="3.2" fill="none" strokeLinecap="round"/>
              </g>
              {/* Each eye scales open vertically from a flat line
                  (scaleY 0) to a full eye (scaleY 1) around its own
                  center — a clean reveal with no artifacts. */}
              <g
                style={{
                  transformBox: "fill-box",
                  transformOrigin: "center",
                  transform: `scaleY(${eyeOpenClamped})`,
                  transition: "transform 1.1s cubic-bezier(0.33, 0, 0.2, 1)",
                }}
              >
                <ellipse cx={eyes.lx} cy={eyes.y} rx={eyes.r + 3} ry={eyes.r + 4} fill="#fff" stroke="#1a1420" strokeWidth="1.5"/>
                <ellipse cx={eyes.lx} cy={eyes.y} rx={eyes.r} ry={eyes.r + 2} fill="#1a1420"/>
                <circle cx={eyes.lx + 4} cy={eyes.y - 5} r="4" fill="#fff"/>
                <circle cx={eyes.lx - 3} cy={eyes.y + 4} r="2" fill="#fff" opacity="0.7"/>
              </g>
              <g
                style={{
                  transformBox: "fill-box",
                  transformOrigin: "center",
                  transform: `scaleY(${eyeOpenClamped})`,
                  transition: "transform 1.1s cubic-bezier(0.33, 0, 0.2, 1)",
                }}
              >
                <ellipse cx={eyes.rx} cy={eyes.y} rx={eyes.r + 3} ry={eyes.r + 4} fill="#fff" stroke="#1a1420" strokeWidth="1.5"/>
                <ellipse cx={eyes.rx} cy={eyes.y} rx={eyes.r} ry={eyes.r + 2} fill="#1a1420"/>
                <circle cx={eyes.rx + 4} cy={eyes.y - 5} r="4" fill="#fff"/>
                <circle cx={eyes.rx - 3} cy={eyes.y + 4} r="2" fill="#fff" opacity="0.7"/>
              </g>
            </>
          ) : (eyes.closed || (blinking && !eyes.halfClosed)) ? (
            <>
              <path d={`M ${eyes.lx - eyes.r - 2} ${eyes.y} Q ${eyes.lx} ${eyes.y + 7} ${eyes.lx + eyes.r + 2} ${eyes.y}`} stroke="#1a1420" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
              <path d={`M ${eyes.rx - eyes.r - 2} ${eyes.y} Q ${eyes.rx} ${eyes.y + 7} ${eyes.rx + eyes.r + 2} ${eyes.y}`} stroke="#1a1420" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
            </>
          ) : eyes.halfClosed ? (
            <>
              {/* Sleepy — top lid arches halfway down */}
              <path d={`M ${eyes.lx - eyes.r - 2} ${eyes.y - 2} Q ${eyes.lx} ${eyes.y + 6} ${eyes.lx + eyes.r + 2} ${eyes.y - 2}`} stroke="#1a1420" strokeWidth="3" fill="none" strokeLinecap="round"/>
              <path d={`M ${eyes.rx - eyes.r - 2} ${eyes.y - 2} Q ${eyes.rx} ${eyes.y + 6} ${eyes.rx + eyes.r + 2} ${eyes.y - 2}`} stroke="#1a1420" strokeWidth="3" fill="none" strokeLinecap="round"/>
            </>
          ) : eyes.happyArc ? (
            <>
              <path d={`M ${eyes.lx - eyes.r - 2} ${eyes.y + 2} Q ${eyes.lx} ${eyes.y - 8} ${eyes.lx + eyes.r + 2} ${eyes.y + 2}`} stroke="#1a1420" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
              <path d={`M ${eyes.rx - eyes.r - 2} ${eyes.y + 2} Q ${eyes.rx} ${eyes.y - 8} ${eyes.rx + eyes.r + 2} ${eyes.y + 2}`} stroke="#1a1420" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
            </>
          ) : eyes.curve ? (
            <>
              <ellipse cx={eyes.lx} cy={eyes.y} rx={eyes.r + 3} ry={eyes.r + 4} fill="#fff" stroke="#1a1420" strokeWidth="1.5"/>
              <ellipse cx={eyes.lx} cy={eyes.y} rx={eyes.r} ry={eyes.r + 2} fill="#1a1420"/>
              <circle cx={eyes.lx + 4} cy={eyes.y - 5} r="4" fill="#fff"/>
              <path d={`M ${eyes.rx - eyes.r + 2} ${eyes.y - 2} Q ${eyes.rx} ${eyes.y - 11} ${eyes.rx + eyes.r - 2} ${eyes.y - 2}`} stroke="#1a1420" strokeWidth="3" fill="none" strokeLinecap="round"/>
            </>
          ) : eyes.sad ? (
            <>
              <ellipse cx={eyes.lx} cy={eyes.y} rx={eyes.r + 2} ry={eyes.r + 3} fill="#fff" stroke="#1a1420" strokeWidth="1.2"/>
              <ellipse cx={eyes.rx} cy={eyes.y} rx={eyes.r + 2} ry={eyes.r + 3} fill="#fff" stroke="#1a1420" strokeWidth="1.2"/>
              <ellipse cx={eyes.lx} cy={eyes.y} rx={eyes.r} ry={eyes.r + 1} fill="#1a1420"/>
              <ellipse cx={eyes.rx} cy={eyes.y} rx={eyes.r} ry={eyes.r + 1} fill="#1a1420"/>
              {/* "Sad" brows — outer raised, inner low */}
              <path d={`M ${eyes.lx - 14} ${eyes.y - 16} Q ${eyes.lx - 4} ${eyes.y - 20} ${eyes.lx + 6} ${eyes.y - 10}`} stroke="#2a1028" strokeWidth="2.4" fill="none" strokeLinecap="round"/>
              <path d={`M ${eyes.rx - 6} ${eyes.y - 10} Q ${eyes.rx + 4} ${eyes.y - 20} ${eyes.rx + 14} ${eyes.y - 16}`} stroke="#2a1028" strokeWidth="2.4" fill="none" strokeLinecap="round"/>
            </>
          ) : eyes.worried ? (
            <>
              <ellipse cx={eyes.lx} cy={eyes.y} rx={eyes.r + 3} ry={eyes.r + 4} fill="#fff" stroke="#1a1420" strokeWidth="1.2"/>
              <ellipse cx={eyes.rx} cy={eyes.y} rx={eyes.r + 3} ry={eyes.r + 4} fill="#fff" stroke="#1a1420" strokeWidth="1.2"/>
              <circle cx={eyes.lx} cy={eyes.y - 1} r={eyes.r - 1} fill="#1a1420"/>
              <circle cx={eyes.rx} cy={eyes.y - 1} r={eyes.r - 1} fill="#1a1420"/>
              {/* Inner-raised brows */}
              <path d={`M ${eyes.lx - 14} ${eyes.y - 14} Q ${eyes.lx - 4} ${eyes.y - 20} ${eyes.lx + 6} ${eyes.y - 16}`} stroke="#2a1028" strokeWidth="2.4" fill="none" strokeLinecap="round"/>
              <path d={`M ${eyes.rx - 6} ${eyes.y - 16} Q ${eyes.rx + 4} ${eyes.y - 20} ${eyes.rx + 14} ${eyes.y - 14}`} stroke="#2a1028" strokeWidth="2.4" fill="none" strokeLinecap="round"/>
            </>
          ) : eyes.pupilDown ? (
            <>
              {/* Hungry — pupils sit low in the eye */}
              <ellipse cx={eyes.lx} cy={eyes.y} rx={eyes.r + 3} ry={eyes.r + 4} fill="#fff" stroke="#1a1420" strokeWidth="1.5"/>
              <ellipse cx={eyes.rx} cy={eyes.y} rx={eyes.r + 3} ry={eyes.r + 4} fill="#fff" stroke="#1a1420" strokeWidth="1.5"/>
              <ellipse cx={eyes.lx} cy={eyes.y + 3} rx={eyes.r} ry={eyes.r + 2} fill="#1a1420"/>
              <ellipse cx={eyes.rx} cy={eyes.y + 3} rx={eyes.r} ry={eyes.r + 2} fill="#1a1420"/>
              <circle cx={eyes.lx + 4} cy={eyes.y + 5} r="3" fill="#fff"/>
              <circle cx={eyes.rx + 4} cy={eyes.y + 5} r="3" fill="#fff"/>
            </>
          ) : eyes.bigShine ? (
            <>
              <ellipse cx={eyes.lx} cy={eyes.y} rx={eyes.r + 3} ry={eyes.r + 4} fill="#fff" stroke="#1a1420" strokeWidth="1.5"/>
              <ellipse cx={eyes.rx} cy={eyes.y} rx={eyes.r + 3} ry={eyes.r + 4} fill="#fff" stroke="#1a1420" strokeWidth="1.5"/>
              <ellipse cx={eyes.lx} cy={eyes.y} rx={eyes.r} ry={eyes.r + 2} fill="#1a1420"/>
              <ellipse cx={eyes.rx} cy={eyes.y} rx={eyes.r} ry={eyes.r + 2} fill="#1a1420"/>
              <circle cx={eyes.lx + 4} cy={eyes.y - 6} r="5" fill="#fff"/>
              <circle cx={eyes.rx + 4} cy={eyes.y - 6} r="5" fill="#fff"/>
              <circle cx={eyes.lx - 4} cy={eyes.y + 4} r="2.5" fill="#fff"/>
              <circle cx={eyes.rx - 4} cy={eyes.y + 4} r="2.5" fill="#fff"/>
            </>
          ) : (
            <>
              <ellipse cx={eyes.lx} cy={eyes.y} rx={eyes.r + 3} ry={eyes.r + 4} fill="#fff" stroke="#1a1420" strokeWidth="1.5"/>
              <ellipse cx={eyes.rx} cy={eyes.y} rx={eyes.r + 3} ry={eyes.r + 4} fill="#fff" stroke="#1a1420" strokeWidth="1.5"/>
              <ellipse cx={eyes.lx} cy={eyes.y} rx={eyes.r} ry={eyes.r + 2} fill="#1a1420"/>
              <ellipse cx={eyes.rx} cy={eyes.y} rx={eyes.r} ry={eyes.r + 2} fill="#1a1420"/>
              <circle cx={eyes.lx + 4} cy={eyes.y - 5} r="4" fill="#fff"/>
              <circle cx={eyes.rx + 4} cy={eyes.y - 5} r="4" fill="#fff"/>
              <circle cx={eyes.lx - 3} cy={eyes.y + 4} r="2" fill="#fff" opacity="0.7"/>
              <circle cx={eyes.rx - 3} cy={eyes.y + 4} r="2" fill="#fff" opacity="0.7"/>
            </>
          )}
          </g>

          <path d="M 0 12 L -6 18 Q 0 22 6 18 Z" fill={nose} stroke="#2a1028" strokeWidth="1.2" strokeLinejoin="round"/>
          <path d="M 0 19 L 0 21" stroke="#2a1028" strokeWidth="2" strokeLinecap="round"/>
          {/* Mood mouth — fades out as anger rises so we can crossfade
              the snarl in below without double-rendering. Also hidden
              while the mouth is open (eating). */}
          {!mouthOpen && (
            <g style={{ opacity: 1 - safeAnger }}>{mouthMap[mood]}</g>
          )}
          {/* Snarl crossfades in with anger so the cool-down isn't a snap. */}
          {!mouthOpen && safeAnger > 0.01 && mood !== "angry" && (
            <g style={{ opacity: safeAnger }}>{mouthMap.angry}</g>
          )}
          {/* Open mouth — for eating. Wide dark oval with a tongue inside. */}
          {mouthOpen && (
            <g>
              <ellipse cx="0" cy="20" rx="12" ry="9" fill="#2a1028" />
              <ellipse cx="0" cy="23" rx="8" ry="5" fill="#e87b91" />
              <path d="M-8 16 Q0 14 8 16" stroke="#ffffff" strokeWidth="1.2" fill="none" opacity="0.6" strokeLinecap="round" />
            </g>
          )}

          {!eyes.closed && (
            <g stroke="#2a1028" strokeWidth="1.6" strokeLinecap="round" opacity="0.7" fill="none">
              <path d="M -22 18 L -58 14"/>
              <path d="M -22 22 L -58 24"/>
              <path d="M 22 18 L 58 14"/>
              <path d="M 22 22 L 58 24"/>
            </g>
          )}

          {mood === "cheer" && (
            <path
              d="M -5 20 Q 0 28 5 20 Q 5 24 0 26 Q -5 24 -5 20 Z"
              fill={nose}
              style={{ opacity: 1 - safeAnger }}
            />
          )}

          {mood === "waving" && (
            <g
              style={{
                animation: animate ? "bobo-wave 1.6s ease-in-out infinite" : "none",
                transformOrigin: "78px 0px",
              }}
            >
              {/* Arm — slightly tapered: thicker at the shoulder,
                  thinner at the wrist, drawn as two stacked strokes */}
              <path d="M 78 14 Q 102 -12 108 -42" stroke={bodyMid} strokeWidth="22" fill="none" strokeLinecap="round"/>
              <path d="M 82 8 Q 98 -10 106 -32" stroke={highlight} strokeWidth="3" fill="none" opacity="0.45" strokeLinecap="round"/>
              {/* Paw — solid disc with proper paw-pad detail */}
              <circle cx="108" cy="-44" r="16" fill={bodyMid}/>
              {/* Central pad — soft darker oval, low on the paw */}
              <ellipse cx="108" cy="-38" rx="6.5" ry="4.5" fill={bodyBottom} opacity="0.5"/>
              {/* Three toe beans clustered above the pad, in body-
                  tint instead of coral so they read as paw, not face */}
              <circle cx="100" cy="-48" r="2.2" fill={bodyBottom} opacity="0.55"/>
              <circle cx="108" cy="-51" r="2.2" fill={bodyBottom} opacity="0.55"/>
              <circle cx="116" cy="-48" r="2.2" fill={bodyBottom} opacity="0.55"/>
              {/* Highlight on the top-left of the paw */}
              <ellipse cx="102" cy="-49" rx="4.5" ry="2.5" fill="#fff" opacity="0.45"/>
            </g>
          )}

          {mood === "thinking" && (
            <g>
              <circle cx="76" cy="-86" r="16" fill="#fff" stroke="#1a1420" strokeWidth="2"/>
              <circle cx="58" cy="-64" r="6" fill="#fff" stroke="#1a1420" strokeWidth="2"/>
              <circle cx="48" cy="-50" r="3" fill="#fff" stroke="#1a1420" strokeWidth="2"/>
              <text x="76" y="-80" textAnchor="middle" fontSize="17" fontWeight="700" fill="#1a1420" fontFamily="system-ui">?</text>
            </g>
          )}

          {mood === "sleep" && (
            <g fill="#1a1420" fontFamily="system-ui" fontWeight="700">
              <text x="64" y="-68" fontSize="22">z</text>
              <text x="86" y="-88" fontSize="15">z</text>
            </g>
          )}

          {/* Sleepy z's — smaller, closer to head */}
          {mood === "sleepy" && (
            <g fill="#1a1420" fontFamily="system-ui" fontWeight="700">
              <text x="54" y="-58" fontSize="16">z</text>
              <text x="70" y="-72" fontSize="11">z</text>
            </g>
          )}

          {/* Sad — single teardrop falling from left eye */}
          {mood === "sad" && (
            <path
              d="M -18 12 Q -22 18 -18 24 Q -14 18 -18 12 Z"
              fill="oklch(72% 0.13 230)"
              stroke="oklch(50% 0.13 230)"
              strokeWidth="0.6"
            />
          )}

          {/* Worried — small sweat drop on cheek */}
          {mood === "worried" && (
            <path
              d="M 56 -22 Q 52 -16 56 -10 Q 60 -16 56 -22 Z"
              fill="oklch(72% 0.13 230)"
              stroke="oklch(50% 0.13 230)"
              strokeWidth="0.6"
            />
          )}

          {/* Shy+curious+nervous: paws raised and clasped in front of face */}
          {mood === "shy" && (
            <g>
              {/* Rosy blush dots on cheeks (like reference) */}
              <circle cx="-50" cy="10" r="16" fill={cheek} opacity="0.72"/>
              <circle cx="50" cy="10" r="16" fill={cheek} opacity="0.72"/>

              {/* Nervous sweat drop left side */}
              <path d="M -66 -30 Q -62 -23 -66 -16 Q -70 -23 -66 -30 Z"
                fill="oklch(72% 0.13 230)" stroke="oklch(50% 0.13 230)" strokeWidth="0.7"/>

              {/* Left arm curving inward to front-center */}
              <path d="M -78 28 Q -56 14 -26 26" stroke={bodyMid} strokeWidth="22" fill="none" strokeLinecap="round"/>
              {/* Left paw — in front of body, near center */}
              <circle cx="-24" cy="28" r="20" fill={bodyTop}/>
              <circle cx="-24" cy="28" r="20" fill="none" stroke={bodyBottom} strokeWidth="1.6" opacity="0.45"/>
              <ellipse cx="-24" cy="37" rx="8" ry="5" fill={bodyBottom} opacity="0.38"/>
              <circle cx="-33" cy="20" r="2.6" fill={bodyBottom} opacity="0.52"/>
              <circle cx="-24" cy="17" r="2.6" fill={bodyBottom} opacity="0.52"/>
              <circle cx="-15" cy="20" r="2.6" fill={bodyBottom} opacity="0.52"/>
              <ellipse cx="-31" cy="18" rx="5" ry="3" fill="#fff" opacity="0.45"/>

              {/* Right arm curving inward to front-center */}
              <path d="M 78 28 Q 56 14 26 26" stroke={bodyMid} strokeWidth="22" fill="none" strokeLinecap="round"/>
              {/* Right paw — glows + gradient fill when glowRightPaw is true */}
              <g style={glowRightPaw ? { animation: "paw-flicker 2.4s ease-in-out infinite" } : {}}>
                <circle cx="24" cy="28" r="20" fill={glowRightPaw ? `url(#${id}-paw-grad)` : bodyTop}/>
                <circle cx="24" cy="28" r="20" fill="none" stroke={bodyBottom} strokeWidth="1.6" opacity="0.45"/>
                <ellipse cx="24" cy="37" rx="8" ry="5" fill={bodyBottom} opacity="0.38"/>
                <circle cx="15" cy="20" r="2.6" fill={bodyBottom} opacity="0.52"/>
                <circle cx="24" cy="17" r="2.6" fill={bodyBottom} opacity="0.52"/>
                <circle cx="33" cy="20" r="2.6" fill={bodyBottom} opacity="0.52"/>
                <ellipse cx="17" cy="18" rx="5" ry="3" fill="#fff" opacity="0.45"/>
              </g>
            </g>
          )}

          {/* Excited — sparkle stars around the face */}
          {mood === "excited" && (
            <g fill="oklch(80% 0.16 90)" stroke="oklch(55% 0.16 70)" strokeWidth="1">
              <path d="M -78 -52 l 3 -7 l 3 7 l 7 3 l -7 3 l -3 7 l -3 -7 l -7 -3 z"/>
              <path d="M 78 -60 l 2.5 -6 l 2.5 6 l 6 2.5 l -6 2.5 l -2.5 6 l -2.5 -6 l -6 -2.5 z"/>
              <path d="M 88 20 l 2 -5 l 2 5 l 5 2 l -5 2 l -2 5 l -2 -5 l -5 -2 z"/>
              <path d="M -82 30 l 2 -5 l 2 5 l 5 2 l -5 2 l -2 5 l -2 -5 l -5 -2 z"/>
            </g>
          )}

          {/* Hungry — small drool drop hanging from the mouth */}
          {mood === "hungry" && (
            <path
              d="M 0 28 Q -3 32 0 36 Q 3 32 0 28 Z"
              fill="oklch(85% 0.05 230)"
              opacity="0.8"
            />
          )}

          {/* Angry — V-brows, messy fur tufts, steam puffs above head.
              Opacity is driven by safeAnger so the whole rig fades
              smoothly with each soothing tap. */}
          {safeAnger > 0.01 && (
            <g style={{ opacity: safeAnger }}>
              {/* Sharp V-brows pulled in toward the nose */}
              <path
                d="M -30 -30 L -10 -22"
                stroke="#2a1028"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <path
                d="M 30 -30 L 10 -22"
                stroke="#2a1028"
                strokeWidth="4"
                strokeLinecap="round"
              />
              {/* Messy fur tufts sticking up off the head silhouette */}
              <g fill={bodyBottom} stroke={bodyBottom} strokeWidth="1" strokeLinejoin="round">
                <path d="M -56 -78 L -50 -92 L -42 -78 Z"/>
                <path d="M -28 -90 L -22 -106 L -14 -90 Z"/>
                <path d="M 6 -90 L 12 -108 L 18 -90 Z"/>
                <path d="M 36 -82 L 42 -98 L 48 -82 Z"/>
                <path d="M -68 -52 L -78 -62 L -64 -58 Z"/>
                <path d="M 68 -52 L 80 -64 L 64 -58 Z"/>
              </g>
              {/* Steam puffs above the head, animated */}
              <g
                style={{
                  animation: animate ? "steam-puff 1.3s ease-in-out infinite" : "none",
                  transformOrigin: "center",
                }}
              >
                <ellipse cx="-30" cy="-120" rx="8" ry="5" fill="#cccccc" opacity="0.85"/>
                <ellipse cx="-22" cy="-130" rx="6" ry="4" fill="#cccccc" opacity="0.65"/>
                <ellipse cx="-14" cy="-140" rx="4" ry="3" fill="#cccccc" opacity="0.45"/>
              </g>
              <g
                style={{
                  animation: animate ? "steam-puff 1.6s ease-in-out 0.4s infinite" : "none",
                  transformOrigin: "center",
                }}
              >
                <ellipse cx="30" cy="-120" rx="8" ry="5" fill="#cccccc" opacity="0.85"/>
                <ellipse cx="22" cy="-132" rx="6" ry="4" fill="#cccccc" opacity="0.65"/>
                <ellipse cx="14" cy="-142" rx="4" ry="3" fill="#cccccc" opacity="0.45"/>
              </g>
            </g>
          )}

          {hat && <Hat kind={hat} />}
        </g>
      </svg>
      </div>
    </div>
  );
}

export function BoboHead({ mood = "happy", tint = 18, size = 40, hat }: BoboProps) {
  return <Bobo mood={mood} tint={tint} size={size} animate={false} hat={hat}/>;
}
