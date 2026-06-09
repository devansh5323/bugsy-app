"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Bobo, BoboHead } from "../Mascot";
import { ChunkyButton } from "./ConvoUI";
import { Typewriter } from "../Typewriter";
import type { Mood } from "../../lib/data";
import { AGE_MAX, AGE_MIN } from "../../lib/data";

// ── Child onboarding, post-handover: meeting Bugsy in his room ──
// Brighter, bigger, more playful than the parent flow. Screens:
//   1 ChildDoorway      — Bugsy walks into the child's world
//   2 ChildHideSeek     — find Bugsy hiding behind the furniture
//   3 ChildFirstContact — coax him out with toys → be friends?
//   4 ChildPetMeet      — tap to pet, purr + hearts
// (Screens 5-10 — age, adventure explainer, snacks game, box
//  breathing, home unlock — are the next installment.)

type Common = {
  tint: number;
  childName: string;
  onNext: () => void;
  onBack?: () => void;
};

// ── Shared kid-audio: synth meow + purr, lazily on first gesture ──
function useCatSounds() {
  const ctxRef = useRef<AudioContext | null>(null);
  const ensure = useCallback(() => {
    if (ctxRef.current) return ctxRef.current;
    try {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      ctxRef.current = new AC();
    } catch {
      /* audio optional */
    }
    return ctxRef.current;
  }, []);

  const meow = useCallback(() => {
    const ctx = ensure();
    if (!ctx) return;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = "triangle";
    // little up-then-down pitch sweep = "mrow"
    osc.frequency.setValueAtTime(620, t);
    osc.frequency.linearRampToValueAtTime(880, t + 0.12);
    osc.frequency.linearRampToValueAtTime(540, t + 0.34);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.12, t + 0.06);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.4);
    osc.connect(g).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.42);
  }, [ensure]);

  const purr = useCallback(() => {
    const ctx = ensure();
    if (!ctx) return;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.value = 56;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 210;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.07, t + 0.12);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 1.0);
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 24;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.04;
    lfo.connect(lfoGain).connect(g.gain);
    osc.connect(filter).connect(g).connect(ctx.destination);
    osc.start(t);
    lfo.start(t);
    osc.stop(t + 1.05);
    lfo.stop(t + 1.05);
  }, [ensure]);

  // Close the context when the owning screen unmounts.
  useEffect(() => {
    return () => {
      const ctx = ctxRef.current;
      if (ctx && ctx.state !== "closed") {
        window.setTimeout(() => ctx.close().catch(() => {}), 1200);
      }
    };
  }, []);

  return { meow, purr };
}

// Shared dark-room container — cozy explorer vibe.
function Room({
  children,
  brighten = false,
  onBack,
}: {
  children: React.ReactNode;
  brighten?: boolean;
  onBack?: () => void;
}) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        background:
          "radial-gradient(ellipse 90% 60% at 50% 62%, #4a3f63 0%, #2e2747 55%, #1d1830 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "56px 22px 30px",
        boxSizing: "border-box",
        color: "#fff",
        animation: brighten ? "scene-brighten 2.4s ease forwards" : undefined,
      }}
    >
      {onBack && (
        <button
          onClick={onBack}
          aria-label="Back"
          style={{
            position: "absolute",
            top: 14,
            left: 14,
            width: 40,
            height: 40,
            borderRadius: 12,
            border: "2px solid rgba(255,255,255,0.25)",
            background: "rgba(255,255,255,0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#fff",
            zIndex: 6,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14">
            <path
              d="M9 1L3 7l6 6"
              stroke="currentColor"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
      {children}
    </div>
  );
}

// Big kid-friendly CTA (brighter + larger than the standard button).
function BigCTA({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: "100%",
        minHeight: 64,
        borderRadius: 18,
        border: "none",
        background: disabled ? "rgba(255,255,255,0.18)" : "var(--primary)",
        color: "#fff",
        fontFamily: "var(--font-nunito), system-ui",
        fontWeight: 900,
        fontSize: 18,
        letterSpacing: 0.4,
        textTransform: "uppercase",
        cursor: disabled ? "not-allowed" : "pointer",
        boxShadow: disabled ? "none" : "0 5px 0 var(--primary-shadow)",
        transition: "transform 0.08s ease, box-shadow 0.08s ease",
      }}
    >
      {children}
    </button>
  );
}

// A floating speech bubble on the dark room. The tail can point
// up (bubble sits below Bugsy) or down (bubble above him).
function RoomBubble({
  text,
  onDone,
  tail = "down",
  maxWidth = 320,
}: {
  text: string;
  onDone?: () => void;
  // Tail direction names the side it comes OUT of the bubble — i.e.
  // the direction the bubble is "pointing". So `tail="right"` puts the
  // bubble on the left of the speaker.
  tail?: "up" | "down" | "left" | "right";
  maxWidth?: number;
}) {
  const tailBase: React.CSSProperties = {
    position: "absolute",
    width: 16,
    height: 16,
    background: "var(--surface)",
    borderRadius: 3,
  };
  const tailVariant: React.CSSProperties =
    tail === "up"
      ? {
          top: -8,
          left: "50%",
          transform: "translateX(-50%) rotate(45deg)",
          borderTop: "1px solid var(--border-strong)",
          borderLeft: "1px solid var(--border-strong)",
        }
      : tail === "down"
        ? {
            bottom: -8,
            left: "50%",
            transform: "translateX(-50%) rotate(45deg)",
            borderRight: "1px solid var(--border-strong)",
            borderBottom: "1px solid var(--border-strong)",
          }
        : tail === "right"
          ? {
              right: -8,
              top: "50%",
              transform: "translateY(-50%) rotate(45deg)",
              borderTop: "1px solid var(--border-strong)",
              borderRight: "1px solid var(--border-strong)",
            }
          : {
              left: -8,
              top: "50%",
              transform: "translateY(-50%) rotate(45deg)",
              borderBottom: "1px solid var(--border-strong)",
              borderLeft: "1px solid var(--border-strong)",
            };

  return (
    <div
      style={{
        position: "relative",
        maxWidth,
        padding: "16px 22px",
        borderRadius: 22,
        background: "var(--surface)",
        border: "1px solid var(--border-strong)",
        color: "var(--ink)",
        fontFamily: "var(--font-nunito), system-ui",
        fontSize: 16.5,
        fontWeight: 800,
        lineHeight: 1.4,
        textAlign: "center",
        boxShadow: "0 8px 22px rgba(0,0,0,0.28)",
        animation: "bubble-pop 0.4s cubic-bezier(0.22, 1.5, 0.36, 1)",
      }}
    >
      <Typewriter text={text} onDone={onDone} speedMultiplier={1.15} />
      <span aria-hidden style={{ ...tailBase, ...tailVariant }} />
    </div>
  );
}

// ── SCREEN 1 — Doorway transition ─────────────────────────────
export function ChildDoorway({ tint, onNext, onBack }: Common) {
  const [entered, setEntered] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t1 = window.setTimeout(() => setEntered(true), 900);
    const t2 = window.setTimeout(() => setReady(true), 3000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <Room brighten={entered} onBack={onBack}>
      <div style={{ flex: 1 }} />
      {/* The whole doorway is the tap target — kid follows the cat
          by tapping the door once it's open. */}
      <div
        onClick={ready ? onNext : undefined}
        role="button"
        aria-label="Enter Bugsy's room"
        aria-disabled={!ready}
        style={{
          position: "relative",
          width: 320,
          height: 440,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          cursor: ready ? "pointer" : "default",
          touchAction: "manipulation",
          animation: ready ? "door-tap-pulse 1.8s ease-in-out infinite" : undefined,
          transformOrigin: "center bottom",
        }}
      >
        {/* Door frame */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: 220,
            height: 340,
            borderRadius: "18px 18px 0 0",
            background: "linear-gradient(#6a5a3a, #4a3d28)",
            boxShadow: "0 0 0 10px #3a3020",
          }}
        />
        {/* Warm light from the doorway. Centered with margin (not
            translateX) so the door-open scaleX animation — which
            sets its own transform — doesn't knock it off-center. */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            bottom: 10,
            left: "50%",
            marginLeft: -98,
            transformOrigin: "center bottom",
            width: 196,
            height: 320,
            borderRadius: "12px 12px 0 0",
            background:
              "linear-gradient(#fff6d8 0%, #ffe6a8 55%, #ffd27a 100%)",
            animation: "door-open 0.9s ease forwards",
            boxShadow: "0 0 56px 24px rgba(255, 224, 150, 0.5)",
          }}
        />
        {/* "Bugsy's room" hanging name plate above the door */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            bottom: 358,
            left: "50%",
            marginLeft: -110,
            width: 220,
            padding: "12px 16px",
            background: "#fff3d6",
            border: "3px solid #6b4520",
            borderRadius: 14,
            color: "#3a2410",
            fontFamily: "var(--font-nunito), system-ui",
            fontWeight: 900,
            fontSize: 22,
            letterSpacing: 0.3,
            textAlign: "center",
            boxShadow: "0 5px 0 #4a2f15, 0 8px 16px rgba(0,0,0,0.35)",
            zIndex: 3,
          }}
        >
          Bugsy&apos;s room
        </div>
        {/* small ropes hanging the sign from above the door */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            bottom: 420,
            left: "50%",
            marginLeft: -84,
            width: 3,
            height: 18,
            background: "#6b4520",
            borderRadius: 2,
            zIndex: 2,
          }}
        />
        <div
          aria-hidden
          style={{
            position: "absolute",
            bottom: 420,
            left: "50%",
            marginLeft: 82,
            width: 3,
            height: 18,
            background: "#6b4520",
            borderRadius: 2,
            zIndex: 2,
          }}
        />
        {/* Bugsy walking in */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            marginBottom: 10,
            animation: entered ? "bugsy-walk-in 1.5s ease forwards" : "none",
            opacity: entered ? undefined : 0,
          }}
        >
          <Bobo mood="waving" tint={tint} size={216} />
        </div>
      </div>

      <div
        style={{
          marginTop: 18,
          textAlign: "center",
          fontFamily: "var(--font-nunito), system-ui",
          fontSize: 18,
          fontWeight: 800,
          color: "#fff",
          textShadow: "0 2px 12px rgba(0,0,0,0.35)",
          opacity: ready ? 1 : 0,
          transform: ready ? "translateY(0)" : "translateY(6px)",
          transition: "opacity 0.5s ease, transform 0.5s ease",
        }}
      >
        Follow the cat by tapping on the door
      </div>

      <div style={{ flex: 1 }} />
    </Room>
  );
}

// ── SCREEN 2 — Hide & seek in an isometric room ───────────────
// A proper iso "diorama" bedroom (à la cozy mobile games): shaded
// floor + two walls, 3D furniture, wall decor. Bugsy hides behind
// the toy chest with his ears peeking over the lid as the hint.
// Decoy furniture jiggles when tapped; finding Bugsy brings him to
// the center as a full mascot.

// Isometric projection (2:1). grid units → screen coords.
const TW = 120; // tile width
const TH = 60; // tile height
const ZH = 56; // height unit
const iso = (gx: number, gy: number, gz = 0): [number, number] => [
  (gx - gy) * (TW / 2),
  (gx + gy) * (TH / 2) - gz * ZH,
];
const poly = (...ps: [number, number][]) =>
  ps.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");

// ── Shared full-bleed cosy living room ────────────────────────
// Used as the backdrop for both Hide & Seek and Pet Bugsy so the
// child stays "home" across screens. Pass interaction props for the
// hide-and-seek game; omit them for a purely decorative backdrop.
export function RoomBackdrop({
  tap,
  shake = null,
  onReveal,
  peek,
  chairs = true,
  dusk = false,
  stormy = false,
}: {
  tap?: (id: string) => void;
  shake?: string | null;
  onReveal?: () => void;
  peek?: React.ReactNode;
  chairs?: boolean;
  dusk?: boolean;
  // Thunderstorm visuals through the window — used by ChildCalmBugsy.
  stormy?: boolean;
}) {
  const interactive = !!tap;
  // Evening palette for the "see you tomorrow" beat.
  const skyFill = stormy
    ? "url(#hs-sky-storm)"
    : dusk
      ? "url(#hs-sky-dusk)"
      : "url(#hs-sky)";
  const cloud = stormy ? "#4c4f6a" : dusk ? "#f4c6ae" : "#ffffff";
  // Storm palette — hills shift toward warm wet-earth tones (muted
  // olive-brown) so they read as soggy hillside rather than the same
  // sage-green as the bushes.
  const hillA = stormy ? "#857a62" : dusk ? "#7ba06d" : "#a9d99a";
  const hillB = stormy ? "#665a44" : dusk ? "#67905d" : "#92c882";
  const bush1 = stormy ? "#5e8078" : dusk ? "#5e8d56" : "#7cc46f";
  const bush2 = stormy ? "#7a958c" : dusk ? "#6d9d62" : "#8ed07f";
  const bush3 = stormy ? "#4d6e66" : dusk ? "#547d4d" : "#6fb862";
  const tapStyle = (id: string): React.CSSProperties => ({
    cursor: interactive ? "pointer" : "default",
    transformBox: "fill-box",
    transformOrigin: "center",
    animation: shake === id ? "furniture-shake 0.45s ease" : undefined,
  });
  const handler = (id: string) => (tap ? () => tap(id) : undefined);

  // A cosy front-view armchair anchored at its floor contact point (cx, by).
  const armchair = (cx: number, by: number, back: string, arm: string, seat: string) => {
    const w = 132;
    const x = cx - w / 2;
    return (
      <>
        <ellipse cx={cx} cy={by + 4} rx={w * 0.6} ry={13} fill="rgba(120,80,40,0.16)" />
        <rect x={x + 12} y={by - 150} width={w - 24} height={120} rx={26} fill={back} />
        <rect x={x + 26} y={by - 138} width={w - 52} height={70} rx={18} fill="rgba(255,255,255,0.2)" />
        <rect x={x} y={by - 86} width={28} height={94} rx={14} fill={arm} />
        <rect x={x + w - 28} y={by - 86} width={28} height={94} rx={14} fill={arm} />
        <rect x={x + 20} y={by - 66} width={w - 40} height={56} rx={16} fill={seat} />
        <rect x={x + 12} y={by - 22} width={w - 24} height={26} rx={10} fill={arm} />
        <rect x={x + 22} y={by + 2} width={12} height={16} rx={4} fill="#8a6a4a" />
        <rect x={x + w - 34} y={by + 2} width={12} height={16} rx={4} fill="#8a6a4a" />
      </>
    );
  };

  return (
    <svg
      viewBox="0 -54 400 800"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid slice"
      style={{ position: "absolute", inset: 0, display: "block" }}
    >
      <defs>
        <linearGradient id="hs-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fceadd" />
          <stop offset="100%" stopColor="#f4cdb8" />
        </linearGradient>
        <linearGradient id="hs-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e8c89c" />
          <stop offset="100%" stopColor="#d9b483" />
        </linearGradient>
        <linearGradient id="hs-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e3f4ff" />
          <stop offset="100%" stopColor="#bfe3ff" />
        </linearGradient>
        <radialGradient id="hs-rug" cx="0.5" cy="0.5" r="0.6">
          <stop offset="0%" stopColor="#f8cdd9" />
          <stop offset="100%" stopColor="#ec9fb4" />
        </radialGradient>
        <radialGradient id="hs-glow" cx="0.5" cy="0.32" r="0.75">
          <stop offset="0%" stopColor="#fff6e0" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#fff6e0" stopOpacity="0" />
        </radialGradient>
        <pattern id="hs-grid" width="30" height="30" patternUnits="userSpaceOnUse">
          <path d="M30 0H0V30" fill="none" stroke="rgba(150,100,70,0.06)" strokeWidth="1" />
        </pattern>
        {/* dusk: sunset through the window + a warm→cool light wash */}
        <linearGradient id="hs-sky-dusk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a5a98" />
          <stop offset="45%" stopColor="#b56e8e" />
          <stop offset="78%" stopColor="#f0a06a" />
          <stop offset="100%" stopColor="#ffd29a" />
        </linearGradient>
        <linearGradient id="hs-dusk-wash" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffb15e" stopOpacity="0.16" />
          <stop offset="55%" stopColor="#9a6a9e" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#3a3470" stopOpacity="0.32" />
        </linearGradient>
        {/* Stormy night sky — deep indigo at the top, slightly warmer
            (rain-haze) toward the horizon. */}
        <linearGradient id="hs-sky-storm" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#171a36" />
          <stop offset="55%" stopColor="#262a52" />
          <stop offset="100%" stopColor="#3b3a6a" />
        </linearGradient>
      </defs>

      {/* Wall + subtle grid */}
      <rect x="0" y="-80" width="400" height="665" fill="url(#hs-wall)" />
      <rect x="0" y="-80" width="400" height="665" fill="url(#hs-grid)" />
      {/* warm ambient glow */}
      <ellipse cx="200" cy="300" rx="280" ry="320" fill="url(#hs-glow)" />
      {/* Baseboard + floor */}
      <rect x="0" y="566" width="400" height="20" fill="#e6b89a" />
      <rect x="0" y="585" width="400" height="215" fill="url(#hs-floor)" />
      {[70, 150, 250, 340].map((px) => (
        <line key={`pk${px}`} x1={px} y1="586" x2={px} y2="800" stroke="#caa06f" strokeWidth="2" opacity="0.5" />
      ))}

      {/* ── Bunting garland across the top ── */}
      {(() => {
        const cols = ["#e8788f", "#7cb6e8", "#f4c542", "#8fd08a", "#c89bf0", "#f59ac0", "#6cc6b8"];
        const ax = 18, ay = 60, bx = 382, by = 60, mx = 200, my = 108;
        const pts = cols.map((_, i) => {
          const t = (i + 0.5) / cols.length;
          const xx = (1 - t) * (1 - t) * ax + 2 * (1 - t) * t * mx + t * t * bx;
          const yy = (1 - t) * (1 - t) * ay + 2 * (1 - t) * t * my + t * t * by;
          return [xx, yy] as const;
        });
        return (
          <g>
            <path d={`M ${ax} ${ay} Q ${mx} ${my} ${bx} ${by}`} fill="none" stroke="#b98e6a" strokeWidth="2.5" />
            {pts.map(([xx, yy], i) => (
              <polygon key={`fl${i}`} points={`${xx - 11},${yy} ${xx + 11},${yy} ${xx},${yy + 20}`} fill={cols[i]} stroke="#fff" strokeWidth="1.2" />
            ))}
          </g>
        );
      })()}

      {/* ── Big garden window (centre wall) ── */}
      <g onClick={handler("window")} style={tapStyle("window")}>
        <rect x="104" y="118" width="192" height="26" rx="8" fill="#efbd9c" />
        <line x1="118" y1="131" x2="282" y2="131" stroke="#e0a884" strokeWidth="2" />
        <line x1="200" y1="144" x2="200" y2="158" stroke="#cf9a78" strokeWidth="2" />
        <circle cx="200" cy="160" r="3" fill="#cf9a78" />
        <rect x="112" y="146" width="176" height="232" rx="6" fill={skyFill} />
        {stormy ? (
          <>
            {/* Heavy storm clouds */}
            <ellipse cx="158" cy="178" rx="40" ry="14" fill="#2a2e4a" opacity="0.92" />
            <ellipse cx="200" cy="170" rx="44" ry="15" fill="#3a3e5e" opacity="0.92" />
            <ellipse cx="252" cy="186" rx="38" ry="13" fill="#252849" opacity="0.92" />
            {/* Steady (dim) lightning bolt in the window — the screen-
                level flash overlay handles the bright strike moments. */}
            <path
              d="M214 196 L184 282 L212 282 L196 360 L246 264 L218 264 L246 196 Z"
              fill="#fffbe0"
              opacity="0.32"
              stroke="#ffe27a"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
            {/* Rain — slanted streaks falling through the window */}
            {[120, 138, 156, 174, 192, 210, 228, 246, 264, 282].map((x, i) => (
              <line
                key={`rain-${i}`}
                x1={x}
                y1={186 + (i % 3) * 10}
                x2={x - 10}
                y2={186 + (i % 3) * 10 + 28}
                stroke="rgba(190,210,235,0.55)"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            ))}
            {[130, 168, 206, 244, 274].map((x, i) => (
              <line
                key={`rain-b-${i}`}
                x1={x + 4}
                y1={244 + (i % 2) * 14}
                x2={x - 6}
                y2={244 + (i % 2) * 14 + 32}
                stroke="rgba(190,210,235,0.5)"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            ))}
          </>
        ) : dusk ? (
          <>
            {/* low setting sun + a couple of early stars */}
            <circle cx="236" cy="300" r="22" fill="#ff9d5c" opacity="0.9" />
            <circle cx="150" cy="172" r="1.8" fill="#fff" />
            <circle cx="200" cy="160" r="1.5" fill="#fff" />
            <circle cx="262" cy="178" r="1.6" fill="#fff" />
          </>
        ) : (
          <circle cx="250" cy="186" r="20" fill="#ffe9a8" />
        )}
        {!stormy && (
          <>
            <ellipse cx="160" cy="200" rx="30" ry="13" fill={cloud} opacity="0.8" />
            <ellipse cx="186" cy="194" rx="20" ry="11" fill={cloud} opacity="0.8" />
          </>
        )}
        <ellipse cx="150" cy="392" rx="120" ry="70" fill={hillA} />
        <ellipse cx="270" cy="400" rx="120" ry="74" fill={hillB} />
        <circle cx="150" cy="338" r="30" fill={bush1} />
        <circle cx="186" cy="346" r="24" fill={bush2} />
        <circle cx="246" cy="344" r="28" fill={bush3} />
        <line x1="200" y1="146" x2="200" y2="378" stroke="#fff3e6" strokeWidth="7" />
        <line x1="112" y1="262" x2="288" y2="262" stroke="#fff3e6" strokeWidth="7" />
        <rect x="112" y="146" width="176" height="232" rx="6" fill="none" stroke="#fff3e6" strokeWidth="14" />
        <rect x="100" y="376" width="200" height="14" rx="4" fill="#e7c79c" />
      </g>

      {/* ── Framed art on the left wall ── */}
      <g onClick={handler("art")} style={tapStyle("art")}>
        <rect x="34" y="180" width="56" height="64" rx="6" fill="#c98b66" />
        <rect x="40" y="186" width="44" height="52" rx="3" fill="#fef3ea" />
        <path d="M62 230c-12-9-18-16-18-24a8 8 0 0116-2 8 8 0 0116 2c0 8-6 15-14 24z" fill="#f29db0" />
        <rect x="40" y="262" width="50" height="58" rx="6" fill="#c98b66" />
        <rect x="46" y="268" width="38" height="46" rx="3" fill="#fef3ea" />
        <circle cx="65" cy="291" r="11" fill="#ffd76a" />
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const a = (i / 6) * Math.PI * 2;
          return <line key={i} x1={65 + Math.cos(a) * 14} y1={291 + Math.sin(a) * 14} x2={65 + Math.cos(a) * 18} y2={291 + Math.sin(a) * 18} stroke="#ffd76a" strokeWidth="2" />;
        })}
      </g>

      {/* ── Rug (under furniture) ── */}
      <ellipse cx="200" cy="708" rx="180" ry="58" fill="url(#hs-rug)" />
      <ellipse cx="200" cy="708" rx="120" ry="36" fill="none" stroke="#fce0e8" strokeWidth="6" opacity="0.8" />

      {/* ── Tall potted plant (left) ── */}
      <g onClick={handler("plantL")} style={tapStyle("plantL")}>
        <ellipse cx="52" cy="650" rx="42" ry="10" fill="rgba(120,80,40,0.16)" />
        <path d="M40 648h28l-5 56H45z" fill="#cf8b43" />
        <path d="M40 648h28l-2 14H42z" fill="#b9772f" />
        {/* leaves rooted into the pot (translated down so they meet the rim) */}
        <g transform="translate(0 36)">
          <path d="M54 612c-18-6-30-26-26-50 18 4 30 24 26 50z" fill="#6fb862" />
          <path d="M54 612c16-10 22-34 12-56-15 9-20 33-12 56z" fill="#8ed07f" />
          <path d="M54 616c2-26-6-50-6-50s-10 24-2 50z" fill="#7cc46f" />
        </g>
      </g>

      {/* ── Coffee table with toys (centre) ── */}
      <g onClick={handler("table")} style={tapStyle("table")}>
        <ellipse cx="200" cy="724" rx="74" ry="12" fill="rgba(120,80,40,0.16)" />
        <rect x="146" y="690" width="108" height="18" rx="8" fill="#c9854a" />
        <rect x="146" y="690" width="108" height="7" rx="4" fill="#dca06a" />
        <rect x="154" y="706" width="10" height="22" rx="3" fill="#a87038" />
        <rect x="236" y="706" width="10" height="22" rx="3" fill="#a87038" />
        <rect x="172" y="668" width="22" height="22" rx="4" fill="#e8788f" />
        <rect x="196" y="668" width="22" height="22" rx="4" fill="#7cb6e8" />
        <rect x="184" y="646" width="22" height="22" rx="4" fill="#f4c542" />
      </g>

      {/* ── Left armchair (pink) ── */}
      {chairs && (
        <g onClick={handler("chairL")} style={tapStyle("chairL")}>
          {armchair(94, 664, "#ef9fb6", "#f4b3c6", "#f9cdd8")}
        </g>
      )}

      {/* Optional peeking Bugsy (rendered before the blue chair so it occludes him) */}
      {peek}

      {/* ── Right armchair (blue) ── */}
      {chairs && (
        <g onClick={onReveal} style={tapStyle("chairR")}>
          {armchair(300, 672, "#9cc3ee", "#b2d2f4", "#cbe2f9")}
        </g>
      )}

      {/* ── Little robot vacuum ── */}
      <g onClick={handler("vac")} style={tapStyle("vac")}>
        <ellipse cx="150" cy="736" rx="34" ry="9" fill="rgba(120,80,40,0.16)" />
        <ellipse cx="150" cy="724" rx="34" ry="16" fill="#d7dde4" />
        <ellipse cx="150" cy="720" rx="34" ry="14" fill="#eef2f6" />
        <circle cx="150" cy="718" r="7" fill="#8fd0c6" />
        <circle cx="150" cy="718" r="3" fill="#fff" />
      </g>

      {/* ── Small plant (right) ── */}
      <g onClick={handler("plantR")} style={tapStyle("plantR")}>
        <ellipse cx="368" cy="724" rx="26" ry="7" fill="rgba(120,80,40,0.16)" />
        <path d="M356 706h24l-4 18h-16z" fill="#e0986a" />
        <circle cx="362" cy="690" r="13" fill="#7cc46f" />
        <circle cx="374" cy="694" r="11" fill="#8ed07f" />
        <circle cx="368" cy="680" r="11" fill="#6fb862" />
      </g>

      {/* evening light wash over the whole room */}
      {dusk && <rect x="-20" y="-90" width="440" height="900" fill="url(#hs-dusk-wash)" pointerEvents="none" />}
    </svg>
  );
}

export function ChildHideSeek({
  tint,
  childName,
  setChildName,
  onNext,
  onBack,
}: Common & { setChildName?: (s: string) => void }) {
  const named = childName.trim().length > 0;
  // New flow: child *finds* Bugsy first, then he asks for their name,
  // then a two-line greeting (with a small pause between the lines).
  const askName = !named && !!setChildName;
  const [phase, setPhase] = useState<"search" | "askName" | "greet">("search");
  const [nameInput, setNameInput] = useState(childName);
  const [found, setFound] = useState(false);
  const [shake, setShake] = useState<string | null>(null);
  const [bubbleDone, setBubbleDone] = useState(false);
  const [peeking, setPeeking] = useState(false);
  // askName plays two lines: 0 = "Yay, you found me!", then after a
  // beat 1 = "I'm excited to meet you! What's your name?"
  const [nameStep, setNameStep] = useState<0 | 1>(0);
  // 0 = "Hi [name]. I feel shy…", 1 = "But you seem nice. Can we play?"
  const [greetStep, setGreetStep] = useState<0 | 1>(0);
  const { meow } = useCatSounds();

  const enteredName = (setChildName ? nameInput : childName).trim();
  const friend = enteredName || "friend";

  // While the room is empty, let Bugsy pop up to peek after a beat.
  useEffect(() => {
    if (phase !== "search") return;
    const t = window.setTimeout(() => setPeeking(true), 1500);
    return () => window.clearTimeout(t);
  }, [phase]);

  // Reset the typewriter "done" flag whenever the bubble's content
  // changes (askName intro / first greeting / second greeting).
  useEffect(() => {
    setBubbleDone(false);
    setNameStep(0);
  }, [phase, greetStep]);

  const submitName = () => {
    const n = nameInput.trim();
    if (!n) return;
    setChildName?.(n);
    setGreetStep(0);
    setPhase("greet");
    meow();
  };

  const greetLines: [string, string] = [
    `Hi ${friend}. I feel shy when I meet new people.`,
    `But you seem nice. I'd love some pets.`,
  ];

  const wrong = (id: string) => {
    if (found) return;
    setShake(id);
    meow();
    window.setTimeout(() => setShake((s) => (s === id ? null : s)), 450);
  };
  const reveal = () => {
    if (found) return;
    setFound(true);
    meow();
    // Reveal → ask the name (if unknown) → greeting. Tiny delay so the
    // reveal animation lands before the overlay slides in.
    window.setTimeout(() => {
      setPhase(askName ? "askName" : "greet");
      setGreetStep(0);
    }, 450);
  };

  const tapStyle = (id: string) => ({
    cursor: "pointer" as const,
    transformBox: "fill-box" as const,
    transformOrigin: "center" as const,
    animation: shake === id ? "furniture-shake 0.45s ease" : undefined,
  });

  // A cosy front-view armchair anchored at its floor contact point (cx, by).
  const armchair = (cx: number, by: number, back: string, arm: string, seat: string) => {
    const w = 132;
    const x = cx - w / 2;
    return (
      <>
        <ellipse cx={cx} cy={by + 4} rx={w * 0.6} ry={13} fill="rgba(120,80,40,0.16)" />
        <rect x={x + 12} y={by - 150} width={w - 24} height={120} rx={26} fill={back} />
        <rect x={x + 26} y={by - 138} width={w - 52} height={70} rx={18} fill="rgba(255,255,255,0.2)" />
        <rect x={x} y={by - 86} width={28} height={94} rx={14} fill={arm} />
        <rect x={x + w - 28} y={by - 86} width={28} height={94} rx={14} fill={arm} />
        <rect x={x + 20} y={by - 66} width={w - 40} height={56} rx={16} fill={seat} />
        <rect x={x + 12} y={by - 22} width={w - 24} height={26} rx={10} fill={arm} />
        <rect x={x + 22} y={by + 2} width={12} height={16} rx={4} fill="#8a6a4a" />
        <rect x={x + w - 34} y={by + 2} width={12} height={16} rx={4} fill="#8a6a4a" />
      </>
    );
  };

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: "#f6d2bd" }}>
      {/* ── Full-bleed cosy living room ── */}
      <svg
        viewBox="0 -54 400 800"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid slice"
        style={{ position: "absolute", inset: 0, display: "block" }}
      >
        <defs>
          <linearGradient id="hs-wall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fceadd" />
            <stop offset="100%" stopColor="#f4cdb8" />
          </linearGradient>
          <linearGradient id="hs-floor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e8c89c" />
            <stop offset="100%" stopColor="#d9b483" />
          </linearGradient>
          <linearGradient id="hs-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e3f4ff" />
            <stop offset="100%" stopColor="#bfe3ff" />
          </linearGradient>
          <radialGradient id="hs-rug" cx="0.5" cy="0.5" r="0.6">
            <stop offset="0%" stopColor="#f8cdd9" />
            <stop offset="100%" stopColor="#ec9fb4" />
          </radialGradient>
          <radialGradient id="hs-glow" cx="0.5" cy="0.32" r="0.75">
            <stop offset="0%" stopColor="#fff6e0" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#fff6e0" stopOpacity="0" />
          </radialGradient>
          <pattern id="hs-grid" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M30 0H0V30" fill="none" stroke="rgba(150,100,70,0.06)" strokeWidth="1" />
          </pattern>
        </defs>

        {/* Wall + subtle grid */}
        <rect x="0" y="-80" width="400" height="665" fill="url(#hs-wall)" />
        <rect x="0" y="-80" width="400" height="665" fill="url(#hs-grid)" />
        {/* warm ambient glow */}
        <ellipse cx="200" cy="300" rx="280" ry="320" fill="url(#hs-glow)" />
        {/* Baseboard + floor */}
        <rect x="0" y="566" width="400" height="20" fill="#e6b89a" />
        <rect x="0" y="585" width="400" height="215" fill="url(#hs-floor)" />
        {[70, 150, 250, 340].map((px) => (
          <line key={`pk${px}`} x1={px} y1="586" x2={px} y2="800" stroke="#caa06f" strokeWidth="2" opacity="0.5" />
        ))}

        {/* ── Bunting garland across the top ── */}
        {(() => {
          const cols = ["#e8788f", "#7cb6e8", "#f4c542", "#8fd08a", "#c89bf0", "#f59ac0", "#6cc6b8"];
          const ax = 18, ay = 60, bx = 382, by = 60, mx = 200, my = 108;
          const pts = cols.map((_, i) => {
            const t = (i + 0.5) / cols.length;
            const xx = (1 - t) * (1 - t) * ax + 2 * (1 - t) * t * mx + t * t * bx;
            const yy = (1 - t) * (1 - t) * ay + 2 * (1 - t) * t * my + t * t * by;
            return [xx, yy] as const;
          });
          return (
            <g>
              <path d={`M ${ax} ${ay} Q ${mx} ${my} ${bx} ${by}`} fill="none" stroke="#b98e6a" strokeWidth="2.5" />
              {pts.map(([xx, yy], i) => (
                <polygon key={`fl${i}`} points={`${xx - 11},${yy} ${xx + 11},${yy} ${xx},${yy + 20}`} fill={cols[i]} stroke="#fff" strokeWidth="1.2" />
              ))}
            </g>
          );
        })()}

        {/* ── Big garden window (centre wall) ── */}
        <g onClick={() => wrong("window")} style={tapStyle("window")}>
          {/* roller-blind valance */}
          <rect x="104" y="118" width="192" height="26" rx="8" fill="#efbd9c" />
          <line x1="118" y1="131" x2="282" y2="131" stroke="#e0a884" strokeWidth="2" />
          <line x1="200" y1="144" x2="200" y2="158" stroke="#cf9a78" strokeWidth="2" />
          <circle cx="200" cy="160" r="3" fill="#cf9a78" />
          {/* glass */}
          <rect x="112" y="146" width="176" height="232" rx="6" fill="url(#hs-sky)" />
          {/* sun + clouds */}
          <circle cx="250" cy="186" r="20" fill="#ffe9a8" />
          <ellipse cx="160" cy="200" rx="30" ry="13" fill="#ffffff" opacity="0.85" />
          <ellipse cx="186" cy="194" rx="20" ry="11" fill="#ffffff" opacity="0.85" />
          {/* rolling green hills + bushes outside */}
          <ellipse cx="150" cy="392" rx="120" ry="70" fill="#a9d99a" />
          <ellipse cx="270" cy="400" rx="120" ry="74" fill="#92c882" />
          <circle cx="150" cy="338" r="30" fill="#7cc46f" />
          <circle cx="186" cy="346" r="24" fill="#8ed07f" />
          <circle cx="246" cy="344" r="28" fill="#6fb862" />
          {/* mullions */}
          <line x1="200" y1="146" x2="200" y2="378" stroke="#fff3e6" strokeWidth="7" />
          <line x1="112" y1="262" x2="288" y2="262" stroke="#fff3e6" strokeWidth="7" />
          {/* frame */}
          <rect x="112" y="146" width="176" height="232" rx="6" fill="none" stroke="#fff3e6" strokeWidth="14" />
          {/* sill */}
          <rect x="100" y="376" width="200" height="14" rx="4" fill="#e7c79c" />
        </g>

        {/* ── Framed art on the left wall ── */}
        <g onClick={() => wrong("art")} style={tapStyle("art")}>
          <rect x="34" y="180" width="56" height="64" rx="6" fill="#c98b66" />
          <rect x="40" y="186" width="44" height="52" rx="3" fill="#fef3ea" />
          <path d="M62 230c-12-9-18-16-18-24a8 8 0 0116-2 8 8 0 0116 2c0 8-6 15-14 24z" fill="#f29db0" />
          <rect x="40" y="262" width="50" height="58" rx="6" fill="#c98b66" />
          <rect x="46" y="268" width="38" height="46" rx="3" fill="#fef3ea" />
          <circle cx="65" cy="291" r="11" fill="#ffd76a" />
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const a = (i / 6) * Math.PI * 2;
            return <line key={i} x1={65 + Math.cos(a) * 14} y1={291 + Math.sin(a) * 14} x2={65 + Math.cos(a) * 18} y2={291 + Math.sin(a) * 18} stroke="#ffd76a" strokeWidth="2" />;
          })}
        </g>

        {/* ── Rug (under furniture) ── */}
        <ellipse cx="200" cy="708" rx="180" ry="58" fill="url(#hs-rug)" />
        <ellipse cx="200" cy="708" rx="120" ry="36" fill="none" stroke="#fce0e8" strokeWidth="6" opacity="0.8" />

        {/* ── Tall potted plant (left) ── */}
        <g onClick={() => wrong("plantL")} style={tapStyle("plantL")}>
          <ellipse cx="52" cy="650" rx="42" ry="10" fill="rgba(120,80,40,0.16)" />
          <path d="M40 648h28l-5 56H45z" fill="#cf8b43" />
          <path d="M40 648h28l-2 14H42z" fill="#b9772f" />
          <g transform="translate(0 36)">
            <path d="M54 612c-18-6-30-26-26-50 18 4 30 24 26 50z" fill="#6fb862" />
            <path d="M54 612c16-10 22-34 12-56-15 9-20 33-12 56z" fill="#8ed07f" />
            <path d="M54 616c2-26-6-50-6-50s-10 24-2 50z" fill="#7cc46f" />
          </g>
        </g>

        {/* ── Coffee table with toys (centre) ── */}
        <g onClick={() => wrong("table")} style={tapStyle("table")}>
          <ellipse cx="200" cy="724" rx="74" ry="12" fill="rgba(120,80,40,0.16)" />
          <rect x="146" y="690" width="108" height="18" rx="8" fill="#c9854a" />
          <rect x="146" y="690" width="108" height="7" rx="4" fill="#dca06a" />
          <rect x="154" y="706" width="10" height="22" rx="3" fill="#a87038" />
          <rect x="236" y="706" width="10" height="22" rx="3" fill="#a87038" />
          {/* stacked toy blocks */}
          <rect x="172" y="668" width="22" height="22" rx="4" fill="#e8788f" />
          <rect x="196" y="668" width="22" height="22" rx="4" fill="#7cb6e8" />
          <rect x="184" y="646" width="22" height="22" rx="4" fill="#f4c542" />
        </g>

        {/* ── Left armchair (pink) ── */}
        <g onClick={() => wrong("chairL")} style={tapStyle("chairL")}>
          {armchair(94, 664, "#ef9fb6", "#f4b3c6", "#f9cdd8")}
        </g>

        {/* ── The real Bugsy mascot peeking over the back of the blue armchair.
              The room starts empty; he pops up to peek after a short beat. ── */}
        {!found && peeking && (
          <foreignObject
            x={232}
            y={462}
            width={136}
            height={170}
            onClick={reveal}
            style={{ cursor: "pointer", overflow: "visible" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                animation: "bugsy-peekaboo 4.4s ease-in-out infinite",
              }}
            >
              <Bobo mood="worried" tint={tint} size={120} />
            </div>
          </foreignObject>
        )}

        {/* ── Right armchair (blue) — Bugsy's hiding spot ── */}
        <g onClick={reveal} style={tapStyle("chairR")}>
          {armchair(300, 672, "#9cc3ee", "#b2d2f4", "#cbe2f9")}
        </g>

        {/* ── Little robot vacuum (fun decoy) ── */}
        <g onClick={() => wrong("vac")} style={tapStyle("vac")}>
          <ellipse cx="150" cy="736" rx="34" ry="9" fill="rgba(120,80,40,0.16)" />
          <ellipse cx="150" cy="724" rx="34" ry="16" fill="#d7dde4" />
          <ellipse cx="150" cy="720" rx="34" ry="14" fill="#eef2f6" />
          <circle cx="150" cy="718" r="7" fill="#8fd0c6" />
          <circle cx="150" cy="718" r="3" fill="#fff" />
        </g>

        {/* ── Small plant (right) ── */}
        <g onClick={() => wrong("plantR")} style={tapStyle("plantR")}>
          <ellipse cx="368" cy="724" rx="26" ry="7" fill="rgba(120,80,40,0.16)" />
          <path d="M356 706h24l-4 18h-16z" fill="#e0986a" />
          <circle cx="362" cy="690" r="13" fill="#7cc46f" />
          <circle cx="374" cy="694" r="11" fill="#8ed07f" />
          <circle cx="368" cy="680" r="11" fill="#6fb862" />
        </g>
      </svg>

      {/* back button */}
      {onBack && (
        <button
          onClick={onBack}
          aria-label="Back"
          style={{
            position: "absolute",
            top: 14,
            left: 14,
            width: 40,
            height: 40,
            borderRadius: 12,
            border: "2px solid rgba(0,0,0,0.12)",
            background: "rgba(255,255,255,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#7a5a44",
            zIndex: 8,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14">
            <path d="M9 1L3 7l6 6" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}

      {/* heading overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          padding: "56px 20px 34px",
          textAlign: "center",
          pointerEvents: "none",
          background: "linear-gradient(180deg, rgba(252,234,221,0.98) 0%, rgba(252,234,221,0.98) 55%, rgba(252,234,221,0))",
          zIndex: 4,
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-nunito), system-ui",
            fontSize: 28,
            lineHeight: 1.12,
            fontWeight: 900,
            letterSpacing: "-0.4px",
            color: "#5e3f2d",
            textShadow: "0 1px 0 rgba(255,255,255,0.6)",
          }}
        >
          {phase === "search" ? (found ? "There you are! 🐾" : "Find Bugsy!") : ""}
          {phase === "search" && !found && (
            <span style={{ display: "block", fontSize: 19, fontWeight: 800, color: "#9c6f54", marginTop: 4 }}>
              Tap around to find me!
            </span>
          )}
        </div>
      </div>

      {/* ── askName: Bugsy is out, asks "Who is in my room?" → name input ── */}
      {phase === "askName" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            padding: "0 28px 110px",
            background: "rgba(252,234,221,0.72)",
            zIndex: 5,
          }}
        >
          <div style={{ animation: "bugsy-reveal 0.6s ease both" }}>
            <Bobo mood="happy" tint={tint} size={156} />
          </div>
          <RoomBubble
            key={nameStep}
            tail="up"
            text={
              nameStep === 0
                ? "Yay, you found me!"
                : "I'm excited to meet you! What's your name?"
            }
            onDone={() => {
              if (nameStep === 0) {
                // brief pause before the next line begins
                window.setTimeout(() => setNameStep(1), 700);
              } else {
                setBubbleDone(true);
              }
            }}
          />
          <div
            style={{
              width: "100%",
              maxWidth: 300,
              display: "flex",
              flexDirection: "column",
              gap: 12,
              opacity: bubbleDone ? 1 : 0,
              transform: bubbleDone ? "translateY(0)" : "translateY(8px)",
              transition: "opacity 0.35s ease, transform 0.35s ease",
              pointerEvents: bubbleDone ? "auto" : "none",
            }}
          >
            <input
              autoFocus
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submitName();
              }}
              placeholder="Type your name"
              maxLength={20}
              style={{
                width: "100%",
                height: 60,
                borderRadius: 16,
                border: "3px solid rgba(0,0,0,0.1)",
                background: "#fff",
                padding: "0 18px",
                fontFamily: "var(--font-nunito), system-ui",
                fontSize: 20,
                fontWeight: 800,
                color: "#5e3f2d",
                textAlign: "center",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>
        </div>
      )}

      {/* CTA for askName: submit the name */}
      {phase === "askName" && (
        <div
          style={{
            position: "absolute",
            left: 20,
            right: 20,
            bottom: 28,
            opacity: bubbleDone ? 1 : 0,
            transform: bubbleDone ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 0.4s ease, transform 0.4s ease",
            pointerEvents: bubbleDone ? "auto" : "none",
            zIndex: 6,
          }}
        >
          <BigCTA onClick={submitName} disabled={!nameInput.trim()}>
            That&apos;s me! →
          </BigCTA>
        </div>
      )}

      {/* ── greet: two-line greeting with a tiny pause between them ── */}
      {phase === "greet" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            padding: "0 20px 120px",
            background: "rgba(252,234,221,0.55)",
            zIndex: 5,
          }}
        >
          <div style={{ animation: "bugsy-reveal 0.6s ease both" }}>
            <Bobo mood={greetStep === 0 ? "worried" : "happy"} tint={tint} size={156} />
          </div>
          <RoomBubble
            key={`greet-${greetStep}`}
            tail="up"
            text={greetLines[greetStep]}
            onDone={() => {
              if (greetStep === 0) {
                // pause, then move to the second line
                window.setTimeout(() => setGreetStep(1), 1200);
              } else {
                setBubbleDone(true);
              }
            }}
          />
        </div>
      )}

      {/* CTA for greet: "Yes!" only on the second line, after it types */}
      {phase === "greet" && greetStep === 1 && (
        <div
          style={{
            position: "absolute",
            left: 20,
            right: 20,
            bottom: 28,
            opacity: bubbleDone ? 1 : 0,
            transform: bubbleDone ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 0.4s ease, transform 0.4s ease",
            pointerEvents: bubbleDone ? "auto" : "none",
            zIndex: 6,
          }}
        >
          <BigCTA onClick={onNext}>Yes!</BigCTA>
        </div>
      )}
    </div>
  );
}

// ── Shared full-bleed football park ───────────────────────────
// Backdrop for the playground (kick-the-ball) screen and the
// "how long do you want to practice" daily-goal screen.
export function ParkBackdrop({ goal = true }: { goal?: boolean } = {}) {
  return (
    <svg
      viewBox="0 0 400 800"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid slice"
      style={{ position: "absolute", inset: 0, display: "block" }}
    >
      <defs>
        <linearGradient id="pg-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d6f0ff" />
          <stop offset="100%" stopColor="#a9ddff" />
        </linearGradient>
        <linearGradient id="pg-grass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9ed68f" />
          <stop offset="100%" stopColor="#7cc46f" />
        </linearGradient>
        <radialGradient id="pg-sun" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#fff3bf" />
          <stop offset="100%" stopColor="#ffe27a" />
        </radialGradient>
      </defs>

      {/* sky */}
      <rect x="0" y="0" width="400" height="540" fill="url(#pg-sky)" />
      {/* sun */}
      <circle cx="330" cy="120" r="42" fill="url(#pg-sun)" />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const a = (i / 8) * Math.PI * 2;
        return <line key={i} x1={330 + Math.cos(a) * 50} y1={120 + Math.sin(a) * 50} x2={330 + Math.cos(a) * 62} y2={120 + Math.sin(a) * 62} stroke="#ffe27a" strokeWidth="5" strokeLinecap="round" />;
      })}
      {/* clouds */}
      <g fill="#ffffff" opacity="0.92">
        <ellipse cx="90" cy="120" rx="46" ry="22" />
        <ellipse cx="120" cy="108" rx="34" ry="20" />
        <ellipse cx="220" cy="200" rx="38" ry="18" />
        <ellipse cx="248" cy="192" rx="26" ry="15" />
      </g>
      {/* distant hills */}
      <ellipse cx="110" cy="480" rx="240" ry="120" fill="#8ed07f" />
      <ellipse cx="320" cy="492" rx="240" ry="120" fill="#a3da93" />
      {/* grass foreground */}
      <rect x="0" y="460" width="400" height="340" fill="url(#pg-grass)" />
      <path d="M0 470 Q 200 442 400 472 L400 500 L0 500 Z" fill="#aadd99" opacity="0.6" />

      {/* ── Left tree ── */}
      <g>
        <rect x="40" y="430" width="20" height="110" rx="8" fill="#b9772f" />
        <circle cx="50" cy="410" r="46" fill="#6fb862" />
        <circle cx="20" cy="436" r="32" fill="#7cc46f" />
        <circle cx="80" cy="436" r="34" fill="#62ad57" />
        <circle cx="50" cy="430" r="30" fill="#86cf78" />
      </g>
      {/* ── Right tree ── */}
      <g>
        <rect x="350" y="448" width="18" height="100" rx="8" fill="#b9772f" />
        <circle cx="359" cy="430" r="40" fill="#6fb862" />
        <circle cx="334" cy="452" r="28" fill="#7cc46f" />
        <circle cx="384" cy="452" r="26" fill="#62ad57" />
      </g>

      {/* ── Swing set (left) ── */}
      <g transform="translate(-94 0)">
        <rect x="70" y="356" width="138" height="12" rx="6" fill="#7cb6e8" />
        <line x1="84" y1="362" x2="64" y2="540" stroke="#cf8b43" strokeWidth="9" strokeLinecap="round" />
        <line x1="84" y1="362" x2="104" y2="540" stroke="#cf8b43" strokeWidth="9" strokeLinecap="round" />
        <line x1="196" y1="362" x2="176" y2="540" stroke="#cf8b43" strokeWidth="9" strokeLinecap="round" />
        <line x1="196" y1="362" x2="216" y2="540" stroke="#cf8b43" strokeWidth="9" strokeLinecap="round" />
        <line x1="120" y1="368" x2="120" y2="470" stroke="#9c6638" strokeWidth="3" />
        <line x1="146" y1="368" x2="146" y2="470" stroke="#9c6638" strokeWidth="3" />
        <rect x="112" y="470" width="42" height="10" rx="4" fill="#f4a8be" />
        <line x1="158" y1="368" x2="158" y2="488" stroke="#9c6638" strokeWidth="3" />
        <line x1="184" y1="368" x2="184" y2="488" stroke="#9c6638" strokeWidth="3" />
        <rect x="150" y="488" width="42" height="10" rx="4" fill="#f4c542" />
      </g>

      {/* ── Slide (right) ── */}
      <g transform="translate(52 0)">
        <rect x="300" y="400" width="9" height="140" rx="4" fill="#b9772f" />
        <rect x="346" y="400" width="9" height="140" rx="4" fill="#b9772f" />
        <rect x="292" y="392" width="72" height="14" rx="6" fill="#9cc3ee" />
        <polygon points="288,392 368,392 328,356" fill="#e8788f" />
        <path d="M300 406 Q 250 470 236 540 L268 540 Q 286 470 332 414 Z" fill="#f4a8be" />
        <path d="M300 406 Q 250 470 236 540" fill="none" stroke="#e489a6" strokeWidth="3" />
        <line x1="352" y1="406" x2="360" y2="540" stroke="#7cb6e8" strokeWidth="6" strokeLinecap="round" />
        <line x1="372" y1="406" x2="380" y2="540" stroke="#7cb6e8" strokeWidth="6" strokeLinecap="round" />
        {[430, 466, 502].map((y, i) => (
          <line key={i} x1="354" y1={y} x2="378" y2={y} stroke="#7cb6e8" strokeWidth="5" strokeLinecap="round" />
        ))}
      </g>

      {/* ── Soccer goal (centre) — only when the football game lives here ── */}
      {goal && (
        <g>
          <ellipse cx="220" cy="552" rx="92" ry="12" fill="rgba(80,60,30,0.14)" />
          <rect x="160" y="458" width="120" height="92" rx="3" fill="#eef6ff" opacity="0.7" />
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <line key={`v${i}`} x1={168 + i * 14} y1="460" x2={168 + i * 14} y2="550" stroke="#9fb8cf" strokeWidth="1.4" opacity="0.8" />
          ))}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <line key={`h${i}`} x1="160" y1={472 + i * 14} x2="280" y2={472 + i * 14} stroke="#9fb8cf" strokeWidth="1.4" opacity="0.8" />
          ))}
          <rect x="150" y="450" width="12" height="102" rx="6" fill="#ffffff" stroke="#7e96a8" strokeWidth="3" />
          <rect x="280" y="450" width="12" height="102" rx="6" fill="#ffffff" stroke="#7e96a8" strokeWidth="3" />
          <rect x="150" y="446" width="142" height="12" rx="6" fill="#ffffff" stroke="#7e96a8" strokeWidth="3" />
        </g>
      )}

      {/* ── Bench (foreground) ── */}
      <g>
        <ellipse cx="118" cy="612" rx="62" ry="12" fill="rgba(80,60,30,0.16)" />
        <rect x="70" y="572" width="96" height="12" rx="5" fill="#cf8b43" />
        <rect x="70" y="592" width="96" height="12" rx="5" fill="#dca06a" />
        <rect x="78" y="584" width="8" height="30" rx="3" fill="#b9772f" />
        <rect x="150" y="584" width="8" height="30" rx="3" fill="#b9772f" />
      </g>
    </svg>
  );
}

// ── Shared full-bleed "family / get a grown-up" backdrop ──────
// Warm home scene with a grown-up + child holding hands and floating
// hearts. Used by the two screens that ask the child to grab a
// grown-up, so they feel like one moment.
export function FamilyBackdrop() {
  const heart = (x: number, y: number, s: number, fill: string, op = 1) => (
    <path
      d={`M ${x} ${y} c ${-2.6 * s},${-3 * s} ${-8 * s},${-3 * s} ${-8 * s},${2 * s} c 0,${5 * s} ${8 * s},${9 * s} ${8 * s},${9 * s} c 0,0 ${8 * s},${-4 * s} ${8 * s},${-9 * s} c 0,${-5 * s} ${-5.4 * s},${-5 * s} ${-8 * s},${-2 * s} z`}
      fill={fill}
      opacity={op}
    />
  );
  return (
    <svg
      viewBox="0 0 400 800"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid slice"
      style={{ position: "absolute", inset: 0, display: "block" }}
    >
      <defs>
        <linearGradient id="fam-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff2e2" />
          <stop offset="100%" stopColor="#ffd9c2" />
        </linearGradient>
        <linearGradient id="fam-ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f9c3cf" />
          <stop offset="100%" stopColor="#f3a8bc" />
        </linearGradient>
        <radialGradient id="fam-glow" cx="0.5" cy="0.28" r="0.7">
          <stop offset="0%" stopColor="#fff6d8" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#fff6d8" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* warm sky + glow */}
      <rect x="0" y="0" width="400" height="800" fill="url(#fam-sky)" />
      <ellipse cx="200" cy="210" rx="300" ry="280" fill="url(#fam-glow)" />
      <circle cx="318" cy="150" r="40" fill="#ffe6a6" opacity="0.85" />
      {/* soft clouds */}
      <g fill="#ffffff" opacity="0.7">
        <ellipse cx="92" cy="150" rx="44" ry="20" />
        <ellipse cx="120" cy="138" rx="30" ry="17" />
        <ellipse cx="300" cy="300" rx="34" ry="15" />
      </g>

      {/* rolling ground */}
      <path d="M0 640 Q 200 596 400 642 L400 800 L0 800 Z" fill="url(#fam-ground)" />
      <path d="M0 648 Q 200 612 400 650" fill="none" stroke="#ffd0db" strokeWidth="6" opacity="0.7" />

      {/* floating hearts */}
      {heart(150, 452, 2.6, "#f06f93", 0.9)}
      {heart(262, 430, 2.0, "#f8a0b8", 0.85)}
      {heart(206, 398, 1.5, "#ffc2d2", 0.9)}

      {/* ── Grown-up + child holding hands ── */}
      <g>
        {/* shared shadow */}
        <ellipse cx="210" cy="678" rx="124" ry="18" fill="rgba(150,70,90,0.14)" />

        {/* Grown-up (left, centred ~x172) */}
        <g>
          {/* legs */}
          <rect x="156" y="616" width="14" height="56" rx="6" fill="#6f5a8e" />
          <rect x="176" y="616" width="14" height="56" rx="6" fill="#6f5a8e" />
          {/* torso */}
          <path d="M150 556 q22 -20 44 0 l5 66 q-27 12 -54 0 z" fill="#7cb6e8" />
          {/* left arm + hand (hangs down the side) */}
          <path d="M153 562 Q 143 592 147 616" fill="none" stroke="#7cb6e8" strokeWidth="13" strokeLinecap="round" />
          <circle cx="147" cy="617" r="7.5" fill="#f7c9a8" />
          {/* right arm + hand (reaches across to the child) */}
          <path d="M191 562 Q 211 592 219 612" fill="none" stroke="#7cb6e8" strokeWidth="13" strokeLinecap="round" />
          <circle cx="219" cy="613" r="7.5" fill="#f7c9a8" />
          {/* head */}
          <circle cx="172" cy="518" r="27" fill="#f7c9a8" />
          {/* hair — neat cap on the crown, sides ending above the ears */}
          <path d="M149 505 A27 27 0 0 1 195 505 Q172 511 149 505 Z" fill="#5b4a3a" />
          <circle cx="164" cy="519" r="2.6" fill="#3a2e2a" />
          <circle cx="181" cy="519" r="2.6" fill="#3a2e2a" />
          <path d="M165 527 q7 6 14 0" fill="none" stroke="#3a2e2a" strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* Child (right, centred ~x249) — a touch shorter */}
        <g>
          {/* legs */}
          <rect x="236" y="650" width="11" height="34" rx="5" fill="#b56a4e" />
          <rect x="253" y="650" width="11" height="34" rx="5" fill="#b56a4e" />
          {/* torso */}
          <path d="M233 606 q16 -16 33 0 l4 50 q-21 10 -41 0 z" fill="#f4a8be" />
          {/* right arm + hand (hangs down the side) */}
          <path d="M263 612 Q 272 634 270 652" fill="none" stroke="#f4a8be" strokeWidth="11" strokeLinecap="round" />
          <circle cx="270" cy="653" r="6.5" fill="#f7c9a8" />
          {/* left arm + hand (reaches up to the grown-up) */}
          <path d="M236 612 Q 232 612 230 613" fill="none" stroke="#f4a8be" strokeWidth="11" strokeLinecap="round" />
          <circle cx="229" cy="613" r="6.5" fill="#f7c9a8" />
          {/* head */}
          <circle cx="249" cy="574" r="20" fill="#f7c9a8" />
          {/* hair — neat cap on the crown, sides ending above the ears */}
          <path d="M232 562 A20 20 0 0 1 266 562 Q249 567 232 562 Z" fill="#3f342c" />
          <circle cx="243" cy="575" r="2.2" fill="#3a2e2a" />
          <circle cx="256" cy="575" r="2.2" fill="#3a2e2a" />
          <path d="M244 581 q5 5 11 0" fill="none" stroke="#3a2e2a" strokeWidth="1.8" strokeLinecap="round" />
        </g>
      </g>
    </svg>
  );
}

// ── SCREEN 3 — First contact (kick the ball into the goal) ────
// First two shots miss; the third one finds the net.
const SHOTS_TO_SCORE = 3;

export function ChildFirstContact({ tint, onNext, onBack }: Common) {
  const [shots, setShots] = useState(0);
  const [busy, setBusy] = useState(false); // locks input during a kick sequence
  const [jumping, setJumping] = useState(false);
  const [kicking, setKicking] = useState(false);
  const [missing, setMissing] = useState(false); // current shot is a miss
  const [netHit, setNetHit] = useState(false);
  const [showGoal, setShowGoal] = useState(false);
  const [showMiss, setShowMiss] = useState(false);
  const [askFriends, setAskFriends] = useState(false);
  const [yes, setYes] = useState(false);
  const [bubbleDone, setBubbleDone] = useState(false);
  const { meow, purr } = useCatSounds();

  const kick = () => {
    if (busy || askFriends) return;
    const shotNo = shots + 1;
    const isGoal = shotNo >= SHOTS_TO_SCORE; // first two miss, the third goes in
    setBusy(true);
    setShots(shotNo);
    setMissing(!isGoal);
    meow();
    // 1) Bugsy springs up to head the ball.
    setJumping(true);
    // 2) At the jump's peak the ball launches into its arc.
    window.setTimeout(() => setKicking(true), 170);
    window.setTimeout(() => setJumping(false), 640);
    // 3) Ball arrives — goal (net ripple + cheer) or a near miss.
    window.setTimeout(() => {
      if (isGoal) {
        setNetHit(true);
        setShowGoal(true);
        purr();
        window.setTimeout(() => setAskFriends(true), 850);
      } else {
        setShowMiss(true);
        meow();
      }
    }, 600);
    // 4) Reset for the next kick.
    window.setTimeout(() => {
      setKicking(false);
      setMissing(false);
    }, 740);
    window.setTimeout(() => setNetHit(false), 1160);
    window.setTimeout(() => {
      setShowGoal(false);
      setShowMiss(false);
    }, 1450);
    window.setTimeout(() => setBusy(false), 1200);
  };

  const sayYes = () => {
    setYes(true);
    purr();
  };

  const mood: Mood = yes || showGoal ? "cheer" : showMiss ? "worried" : "happy";
  // All dialogue lives in a speech bubble above Bugsy now, so the kid
  // never has to look up at a separate heading. Key the bubble so the
  // typewriter restarts cleanly when the state moves on.
  const bubbleText = yes
    ? "Yay! Best friends! 💕"
    : askFriends
    ? "That was so fun! Do you want to be friends?"
    : showMiss
    ? "Oooh, so close! Try again ⚽"
    : shots > 0
    ? "Kick again — you've got this! ⚽"
    : "Tap the ball — score a goal! ⚽";
  const bubbleKey = yes
    ? "yes"
    : askFriends
    ? "ask"
    : showMiss
    ? "miss"
    : shots > 0
    ? `kick-${shots}`
    : "start";

  useEffect(() => {
    setBubbleDone(false);
  }, [bubbleKey]);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: "#bfe6ff" }}>
      {/* ── Full-bleed playground ── */}
      <svg
        viewBox="0 0 400 800"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid slice"
        style={{ position: "absolute", inset: 0, display: "block" }}
      >
        <defs>
          <linearGradient id="pg-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d6f0ff" />
            <stop offset="100%" stopColor="#a9ddff" />
          </linearGradient>
          <linearGradient id="pg-grass" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#9ed68f" />
            <stop offset="100%" stopColor="#7cc46f" />
          </linearGradient>
          <radialGradient id="pg-sun" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#fff3bf" />
            <stop offset="100%" stopColor="#ffe27a" />
          </radialGradient>
        </defs>

        {/* sky */}
        <rect x="0" y="0" width="400" height="540" fill="url(#pg-sky)" />
        {/* sun */}
        <circle cx="330" cy="120" r="42" fill="url(#pg-sun)" />
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
          const a = (i / 8) * Math.PI * 2;
          return <line key={i} x1={330 + Math.cos(a) * 50} y1={120 + Math.sin(a) * 50} x2={330 + Math.cos(a) * 62} y2={120 + Math.sin(a) * 62} stroke="#ffe27a" strokeWidth="5" strokeLinecap="round" />;
        })}
        {/* clouds */}
        <g fill="#ffffff" opacity="0.92">
          <ellipse cx="90" cy="120" rx="46" ry="22" />
          <ellipse cx="120" cy="108" rx="34" ry="20" />
          <ellipse cx="220" cy="200" rx="38" ry="18" />
          <ellipse cx="248" cy="192" rx="26" ry="15" />
        </g>
        {/* distant hills */}
        <ellipse cx="110" cy="480" rx="240" ry="120" fill="#8ed07f" />
        <ellipse cx="320" cy="492" rx="240" ry="120" fill="#a3da93" />
        {/* grass foreground */}
        <rect x="0" y="460" width="400" height="340" fill="url(#pg-grass)" />
        <path d="M0 470 Q 200 442 400 472 L400 500 L0 500 Z" fill="#aadd99" opacity="0.6" />

        {/* ── Left tree ── */}
        <g>
          <rect x="40" y="430" width="20" height="110" rx="8" fill="#b9772f" />
          <circle cx="50" cy="410" r="46" fill="#6fb862" />
          <circle cx="20" cy="436" r="32" fill="#7cc46f" />
          <circle cx="80" cy="436" r="34" fill="#62ad57" />
          <circle cx="50" cy="430" r="30" fill="#86cf78" />
        </g>
        {/* ── Right tree ── */}
        <g>
          <rect x="350" y="448" width="18" height="100" rx="8" fill="#b9772f" />
          <circle cx="359" cy="430" r="40" fill="#6fb862" />
          <circle cx="334" cy="452" r="28" fill="#7cc46f" />
          <circle cx="384" cy="452" r="26" fill="#62ad57" />
        </g>

        {/* ── Swing set (shifted left to clear the goal) ── */}
        <g transform="translate(-94 0)">
          {/* top bar */}
          <rect x="70" y="356" width="138" height="12" rx="6" fill="#7cb6e8" />
          {/* A-frame legs */}
          <line x1="84" y1="362" x2="64" y2="540" stroke="#cf8b43" strokeWidth="9" strokeLinecap="round" />
          <line x1="84" y1="362" x2="104" y2="540" stroke="#cf8b43" strokeWidth="9" strokeLinecap="round" />
          <line x1="196" y1="362" x2="176" y2="540" stroke="#cf8b43" strokeWidth="9" strokeLinecap="round" />
          <line x1="196" y1="362" x2="216" y2="540" stroke="#cf8b43" strokeWidth="9" strokeLinecap="round" />
          {/* two swings */}
          <line x1="120" y1="368" x2="120" y2="470" stroke="#9c6638" strokeWidth="3" />
          <line x1="146" y1="368" x2="146" y2="470" stroke="#9c6638" strokeWidth="3" />
          <rect x="112" y="470" width="42" height="10" rx="4" fill="#f4a8be" />
          <line x1="158" y1="368" x2="158" y2="488" stroke="#9c6638" strokeWidth="3" />
          <line x1="184" y1="368" x2="184" y2="488" stroke="#9c6638" strokeWidth="3" />
          <rect x="150" y="488" width="42" height="10" rx="4" fill="#f4c542" />
        </g>

        {/* ── Slide (shifted right to clear the goal) ── */}
        <g transform="translate(52 0)">
          {/* platform legs */}
          <rect x="300" y="400" width="9" height="140" rx="4" fill="#b9772f" />
          <rect x="346" y="400" width="9" height="140" rx="4" fill="#b9772f" />
          {/* platform + canopy */}
          <rect x="292" y="392" width="72" height="14" rx="6" fill="#9cc3ee" />
          <polygon points="288,392 368,392 328,356" fill="#e8788f" />
          {/* slide ramp curving down-left to the grass */}
          <path d="M300 406 Q 250 470 236 540 L268 540 Q 286 470 332 414 Z" fill="#f4a8be" />
          <path d="M300 406 Q 250 470 236 540" fill="none" stroke="#e489a6" strokeWidth="3" />
          {/* ladder on the right */}
          <line x1="352" y1="406" x2="360" y2="540" stroke="#7cb6e8" strokeWidth="6" strokeLinecap="round" />
          <line x1="372" y1="406" x2="380" y2="540" stroke="#7cb6e8" strokeWidth="6" strokeLinecap="round" />
          {[430, 466, 502].map((y, i) => (
            <line key={i} x1="354" y1={y} x2="378" y2={y} stroke="#7cb6e8" strokeWidth="5" strokeLinecap="round" />
          ))}
        </g>

        {/* ── Bench (foreground) ── */}
        <g>
          <ellipse cx="118" cy="612" rx="62" ry="12" fill="rgba(80,60,30,0.16)" />
          <rect x="70" y="572" width="96" height="12" rx="5" fill="#cf8b43" />
          <rect x="70" y="592" width="96" height="12" rx="5" fill="#dca06a" />
          <rect x="78" y="584" width="8" height="30" rx="3" fill="#b9772f" />
          <rect x="150" y="584" width="8" height="30" rx="3" fill="#b9772f" />
        </g>

      </svg>

      {/* ── Soccer goal (HTML overlay so it lines up with Bugsy + ball) ── */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: 320,
          transform: "translateX(-50%)",
          width: 170,
          zIndex: 2,
          pointerEvents: "none",
        }}
      >
        <svg
          width="170"
          height="120"
          viewBox="0 0 170 120"
          style={{ display: "block", overflow: "visible", filter: "drop-shadow(0 6px 7px rgba(40,60,30,0.3))" }}
        >
          <ellipse cx="85" cy="115" rx="80" ry="9" fill="rgba(80,60,30,0.18)" />
          {/* net mesh — ripples when the ball hits */}
          <g
            key={`net${shots}`}
            style={{
              transformBox: "fill-box",
              transformOrigin: "center",
              animation: netHit ? "net-ripple 0.55s ease" : undefined,
            }}
          >
            {/* solid backing so the net reads against the busy park */}
            <rect x="20" y="14" width="130" height="92" rx="3" fill="#eef6ff" opacity="0.82" />
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <line key={`v${i}`} x1={28 + i * 14} y1="16" x2={28 + i * 14} y2="104" stroke="#9fb8cf" strokeWidth="1.6" opacity="0.85" />
            ))}
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <line key={`h${i}`} x1="20" y1={28 + i * 14} x2="150" y2={28 + i * 14} stroke="#9fb8cf" strokeWidth="1.6" opacity="0.85" />
            ))}
          </g>
          {/* frame: posts + crossbar (bold so the goal is unmistakable) */}
          <rect x="9" y="6" width="13" height="104" rx="6" fill="#ffffff" stroke="#7e96a8" strokeWidth="3" />
          <rect x="148" y="6" width="13" height="104" rx="6" fill="#ffffff" stroke="#7e96a8" strokeWidth="3" />
          <rect x="9" y="1" width="152" height="13" rx="6" fill="#ffffff" stroke="#7e96a8" strokeWidth="3" />
        </svg>
      </div>

      {/* back button */}
      {onBack && (
        <button
          onClick={onBack}
          aria-label="Back"
          style={{
            position: "absolute",
            top: 14,
            left: 14,
            width: 40,
            height: 40,
            borderRadius: 12,
            border: "2px solid rgba(0,0,0,0.12)",
            background: "rgba(255,255,255,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#7a5a44",
            zIndex: 8,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14">
            <path d="M9 1L3 7l6 6" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}

      {/* ── "GOAL!" celebration at the net ── */}
      {showGoal && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: "44%",
            textAlign: "center",
            pointerEvents: "none",
            zIndex: 7,
            animation: "goal-pop 0.85s ease both",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-nunito), system-ui",
              fontSize: 42,
              fontWeight: 900,
              color: "#f4c542",
              WebkitTextStroke: "2px #fff",
              textShadow: "0 4px 0 rgba(180,120,20,0.35)",
            }}
          >
            GOAL! ⚽
          </span>
        </div>
      )}

      {/* ── "So close!" near-miss banner ── */}
      {showMiss && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: "44%",
            textAlign: "center",
            pointerEvents: "none",
            zIndex: 7,
            animation: "goal-pop 0.85s ease both",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-nunito), system-ui",
              fontSize: 36,
              fontWeight: 900,
              color: "#e8788f",
              WebkitTextStroke: "2px #fff",
              textShadow: "0 4px 0 rgba(150,40,70,0.3)",
            }}
          >
            So close! 😣
          </span>
        </div>
      )}

      {/* ── The soccer ball: tap to head it into the goal ── */}
      {!askFriends && (
        <button
          onClick={kick}
          disabled={busy}
          aria-label="Kick the ball"
          style={{
            position: "absolute",
            left: "calc(50% - 26px)",
            bottom: 244,
            width: 52,
            height: 52,
            fontSize: 46,
            lineHeight: "52px",
            background: "none",
            border: "none",
            padding: 0,
            cursor: busy ? "default" : "pointer",
            zIndex: 5,
            filter: "drop-shadow(0 4px 5px rgba(0,0,0,0.25))",
          }}
        >
          <span
            style={{
              display: "inline-block",
              animation: kicking
                ? missing
                  ? "ball-miss 0.6s cubic-bezier(0.3,0.7,0.5,1) forwards"
                  : "ball-kick 0.55s cubic-bezier(0.3,0.7,0.5,1) forwards"
                : "ball-rest 1.2s ease-in-out infinite",
            }}
          >
            ⚽
          </span>
        </button>
      )}

      {/* ── Bugsy with his dialogue bubble floating just above him ── */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 140,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
          padding: "0 24px",
          zIndex: 3,
        }}
      >
        <RoomBubble
          key={bubbleKey}
          tail="down"
          text={bubbleText}
          onDone={() => setBubbleDone(true)}
        />
        <div
          style={{
            animation: jumping
              ? "bobo-header 0.62s cubic-bezier(0.3,0.9,0.4,1)"
              : yes
              ? "bobo-bump 0.6s ease"
              : undefined,
            filter: "drop-shadow(0 10px 10px rgba(60,90,40,0.2))",
          }}
        >
          <Bobo mood={mood} tint={tint} size={yes ? 165 : 146} />
        </div>
      </div>

      {/* CTA */}
      <div style={{ position: "absolute", left: 20, right: 20, bottom: 28, zIndex: 6 }}>
        {askFriends && !yes && (
          <div
            style={{
              opacity: bubbleDone ? 1 : 0,
              transition: "opacity 0.4s ease",
              pointerEvents: bubbleDone ? "auto" : "none",
            }}
          >
            <BigCTA onClick={sayYes}>YES! 🐱</BigCTA>
          </div>
        )}
        {yes && (
          <div
            style={{
              opacity: bubbleDone ? 1 : 0,
              transition: "opacity 0.4s ease",
              pointerEvents: bubbleDone ? "auto" : "none",
            }}
          >
            <BigCTA onClick={onNext}>Continue →</BigCTA>
          </div>
        )}
      </div>
    </div>
  );
}


// ── SCREEN 4 — Cuddle the belly, then off on an adventure ─────
type Heart = { id: number; x: number };

export function ChildPetMeet({
  tint,
  childName,
  onNext,
  onBack,
}: Common & {
  // Legacy props kept so page.tsx callers don't have to change.
  childAge?: number | null;
  setChildAge?: (n: number) => void;
  gameNext?: boolean;
}) {
  void childName;
  const [pets, setPets] = useState(0);
  const [hearts, setHearts] = useState<Heart[]>([]);
  const [wagging, setWagging] = useState(false);
  const [phase, setPhase] = useState<"belly" | "rising" | "adventure">("belly");
  const [adventureStep, setAdventureStep] = useState<0 | 1 | 2>(0);
  const [bubbleDone, setBubbleDone] = useState(false);
  const { purr } = useCatSounds();

  const PETS_TO_RISE = 3;

  // Reset the typewriter "done" flag whenever the bubble's text changes.
  useEffect(() => {
    setBubbleDone(false);
  }, [phase, adventureStep]);

  const pet = () => {
    if (phase !== "belly") return;
    // Each tap on the belly: purr, flick the tail, and float a sparkle.
    purr();
    setWagging(true);
    window.setTimeout(() => setWagging(false), 900);
    const id = Date.now() + Math.random();
    const x = (Math.random() - 0.5) * 80;
    setHearts((h) => [...h, { id, x }]);
    window.setTimeout(
      () => setHearts((h) => h.filter((he) => he.id !== id)),
      1000,
    );
    setPets((p) => {
      const n = p + 1;
      if (n >= PETS_TO_RISE) {
        // Bugsy gets up (curious), then the dialogue sequence begins.
        window.setTimeout(() => setPhase("rising"), 600);
        window.setTimeout(() => setPhase("adventure"), 1600);
      }
      return n;
    });
  };

  const adventureLines: [string, string, string] = [
    "You just completed your first care mission!",
    "I love adventures! And they're way more fun with a friend.",
    "Do you want to come with me on missions?",
  ];

  const heading = phase === "belly" ? "Tap on the belly to pet the cat" : "";

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: "#f6d2bd" }}>
      <RoomBackdrop chairs={false} />

      {/* back button */}
      {onBack && (
        <button
          onClick={onBack}
          aria-label="Back"
          style={{
            position: "absolute",
            top: 14,
            left: 14,
            width: 40,
            height: 40,
            borderRadius: 12,
            border: "2px solid rgba(0,0,0,0.12)",
            background: "rgba(255,255,255,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#7a5a44",
            zIndex: 8,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14">
            <path d="M9 1L3 7l6 6" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}

      {/* heading */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          padding: "56px 20px 26px",
          textAlign: "center",
          pointerEvents: "none",
          background: heading
            ? "linear-gradient(180deg, rgba(252,234,221,0.98) 0%, rgba(252,234,221,0.98) 55%, rgba(252,234,221,0))"
            : "transparent",
          zIndex: 4,
        }}
      >
        <div
          style={{
            minHeight: 28,
            fontFamily: "var(--font-nunito), system-ui",
            fontSize: 22,
            fontWeight: 900,
            letterSpacing: "-0.3px",
            color: "#5e3f2d",
            textShadow: "0 1px 0 rgba(255,255,255,0.6)",
          }}
        >
          {heading}
        </div>
      </div>

      {/* Bugsy area — sits to be petted, gets up when the adventure starts */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 140,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 14,
          padding: "0 20px",
          zIndex: 3,
        }}
      >
        {/* Adventure bubble sits above Bugsy, tail pointing down to him */}
        {phase === "adventure" && (
          <RoomBubble
            key={`adv-${adventureStep}`}
            tail="down"
            text={adventureLines[adventureStep]}
            onDone={() => {
              if (adventureStep < 2) {
                window.setTimeout(
                  () => setAdventureStep((s) => (s + 1) as 0 | 1 | 2),
                  1200,
                );
              } else {
                setBubbleDone(true);
              }
            }}
          />
        )}

        <div
          onPointerDown={phase === "belly" ? pet : undefined}
          role={phase === "belly" ? "button" : undefined}
          aria-label={phase === "belly" ? "Tap Bugsy's belly to pet him" : undefined}
          style={{
            position: "relative",
            cursor: phase === "belly" ? "pointer" : "default",
            touchAction: "manipulation",
            filter: "drop-shadow(0 12px 12px rgba(90,60,40,0.22))",
            // A little wiggle on each pet; a pop as he gets up.
            animation: wagging
              ? "bugsy-wiggle 0.5s ease-in-out"
              : phase === "rising"
              ? "bugsy-pop 0.6s cubic-bezier(0.22, 1.5, 0.36, 1)"
              : undefined,
            transformOrigin: "center bottom",
          }}
        >
          <Bobo
            mood={phase === "belly" ? "happy" : "thinking"}
            tint={tint}
            size={150}
            tailWag={wagging || phase === "belly"}
          />
          {hearts.map((h) => (
            <span
              key={h.id}
              aria-hidden
              style={{
                position: "absolute",
                top: 20,
                left: `calc(50% + ${h.x}px)`,
                fontSize: 28,
                animation: "pet-heart 1s ease-out forwards",
                pointerEvents: "none",
              }}
            >
              ✨
            </span>
          ))}
        </div>
      </div>

      {/* CTA: only on the final adventure line, after it finishes typing */}
      {phase === "adventure" && adventureStep === 2 && (
        <div
          style={{
            position: "absolute",
            left: 20,
            right: 20,
            bottom: 28,
            opacity: bubbleDone ? 1 : 0,
            transform: bubbleDone ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 0.4s ease, transform 0.4s ease",
            pointerEvents: bubbleDone ? "auto" : "none",
            zIndex: 6,
          }}
        >
          <BigCTA onClick={onNext}>Yes, of course!</BigCTA>
        </div>
      )}
    </div>
  );
}

// ── SCREEN 5 — Age question on the football park (no football) ─
export function ChildAgeQuestion({
  tint,
  childName,
  childAge,
  setChildAge,
  onNext,
  onBack,
}: Common & {
  childAge: number | null;
  setChildAge: (n: number) => void;
}) {
  const friend = childName.trim() || "friend";
  const [phase, setPhase] = useState<"ask" | "reveal">(
    childAge === null ? "ask" : "reveal",
  );
  const [bubbleDone, setBubbleDone] = useState(false);
  const ages = Array.from({ length: AGE_MAX - AGE_MIN + 1 }, (_, i) => AGE_MIN + i);
  const { purr } = useCatSounds();

  useEffect(() => {
    setBubbleDone(false);
  }, [phase]);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: "#bfe6ff" }}>
      <ParkBackdrop goal={false} />

      {/* back button */}
      {onBack && (
        <button
          onClick={onBack}
          aria-label="Back"
          style={{
            position: "absolute",
            top: 14,
            left: 14,
            width: 40,
            height: 40,
            borderRadius: 12,
            border: "2px solid rgba(0,0,0,0.12)",
            background: "rgba(255,255,255,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#3b6a86",
            zIndex: 8,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14">
            <path d="M9 1L3 7l6 6" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}

      {/* Bugsy + dialogue, centred on the park */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          padding: "80px 24px 110px",
          overflowY: "auto",
          zIndex: 3,
        }}
      >
        <div
          style={{
            filter: "drop-shadow(0 10px 12px rgba(40,70,40,0.22))",
            // While revealing, Bugsy morphs kitten → cat → kitten.
            animation:
              phase === "reveal" ? "kitten-morph 3.6s ease-in-out both" : undefined,
            transformOrigin: "bottom center",
          }}
        >
          <Bobo
            mood={phase === "reveal" ? "cheer" : "thinking"}
            tint={tint}
            size={130}
            tailWag={phase === "reveal"}
          />
        </div>

        {phase === "ask" ? (
          <>
            <RoomBubble
              tail="up"
              text="First, how old are you?"
              onDone={() => setBubbleDone(true)}
            />
            <div
              style={{
                width: "100%",
                maxWidth: 300,
                opacity: bubbleDone ? 1 : 0,
                transform: bubbleDone ? "translateY(0)" : "translateY(8px)",
                transition: "opacity 0.4s ease, transform 0.4s ease",
                pointerEvents: bubbleDone ? "auto" : "none",
              }}
            >
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
                {ages.map((a, i) => {
                  const active = childAge === a;
                  return (
                    <button
                      key={a}
                      onClick={() => {
                        setChildAge(a);
                        purr();
                      }}
                      style={{
                        aspectRatio: "1 / 1",
                        borderRadius: 16,
                        cursor: "pointer",
                        border: active ? "3px solid var(--primary)" : "2px solid var(--border)",
                        background: active ? "var(--accent-soft)" : "var(--surface)",
                        color: active ? "var(--primary)" : "var(--ink)",
                        fontFamily: "var(--font-nunito), system-ui",
                        fontWeight: 800,
                        fontSize: 24,
                        boxShadow: active ? "0 4px 0 var(--primary-shadow)" : "0 2px 0 var(--border)",
                        transition: "transform 0.12s ease, box-shadow 0.12s ease",
                        transform: active ? "translateY(-2px)" : "none",
                        animation: `bugsy-pop 0.35s cubic-bezier(0.22, 1.5, 0.36, 1) ${0.04 * i}s backwards`,
                      }}
                    >
                      {a}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          <RoomBubble
            tail="up"
            text={`You're a kitten just like me, ${friend}! If you take care of me daily, I will grow up to be a strong cat!`}
            onDone={() => setBubbleDone(true)}
          />
        )}
      </div>

      {/* CTA */}
      <div style={{ position: "absolute", left: 20, right: 20, bottom: 28, zIndex: 6 }}>
        {phase === "ask" ? (
          <BigCTA
            onClick={() => setPhase("reveal")}
            disabled={childAge === null || !bubbleDone}
          >
            That&apos;s me! →
          </BigCTA>
        ) : (
          <div
            style={{
              opacity: bubbleDone ? 1 : 0,
              transform: bubbleDone ? "translateY(0)" : "translateY(10px)",
              transition: "opacity 0.4s ease, transform 0.4s ease",
              pointerEvents: bubbleDone ? "auto" : "none",
            }}
          >
            <BigCTA onClick={onNext}>Continue →</BigCTA>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Shared full-bleed kitchen backdrop ────────────────────────
export function KitchenBackdrop() {
  return (
    <svg
      viewBox="0 0 400 800"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid slice"
      style={{ position: "absolute", inset: 0, display: "block" }}
    >
      <defs>
        <linearGradient id="kt-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffe9b8" />
          <stop offset="100%" stopColor="#fcd286" />
        </linearGradient>
        <linearGradient id="kt-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#cf8b43" />
          <stop offset="100%" stopColor="#a87038" />
        </linearGradient>
        <linearGradient id="kt-window" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#cdebff" />
          <stop offset="100%" stopColor="#a9ddff" />
        </linearGradient>
        {/* Subtle tile pattern on the wall for design polish */}
        <pattern id="kt-tiles" width="44" height="44" patternUnits="userSpaceOnUse">
          <path d="M44 0H0V44" fill="none" stroke="rgba(180,130,60,0.10)" strokeWidth="1" />
        </pattern>
      </defs>

      {/* wall + floor — floor line raised to y=600 so the floor reads as
          a tile band rather than dominating the lower third. */}
      <rect x="0" y="0" width="400" height="600" fill="url(#kt-wall)" />
      {/* subtle tile grid over the wall */}
      <rect x="0" y="0" width="400" height="600" fill="url(#kt-tiles)" />
      <rect x="0" y="600" width="400" height="200" fill="url(#kt-floor)" />
      {/* skirting */}
      <rect x="0" y="598" width="400" height="6" fill="#7f5b30" />
      {/* floor planks — vertical seams */}
      {[60, 140, 220, 300, 380].map((px) => (
        <line key={`pk${px}`} x1={px} y1="606" x2={px} y2="800" stroke="#8a5e30" strokeWidth="2" opacity="0.55" />
      ))}
      {/* floor planks — staggered horizontal seams */}
      <line x1="0" y1="690" x2="140" y2="690" stroke="#8a5e30" strokeWidth="1.6" opacity="0.45" />
      <line x1="220" y1="690" x2="400" y2="690" stroke="#8a5e30" strokeWidth="1.6" opacity="0.45" />
      <line x1="60" y1="760" x2="300" y2="760" stroke="#8a5e30" strokeWidth="1.6" opacity="0.45" />
      <line x1="380" y1="760" x2="400" y2="760" stroke="#8a5e30" strokeWidth="1.6" opacity="0.45" />
      <line x1="0" y1="760" x2="60" y2="760" stroke="#8a5e30" strokeWidth="1.6" opacity="0.45" />

      {/* ── Wall cabinets (upper left) ── */}
      <g>
        <rect x="32" y="120" width="140" height="120" rx="6" fill="#fff6e0" stroke="#cf8b43" strokeWidth="4" />
        <line x1="102" y1="124" x2="102" y2="236" stroke="#cf8b43" strokeWidth="3" />
        <circle cx="92" cy="180" r="4" fill="#cf8b43" />
        <circle cx="112" cy="180" r="4" fill="#cf8b43" />
        {/* open shelf below with jars */}
        <rect x="32" y="248" width="140" height="60" fill="#fff6e0" stroke="#cf8b43" strokeWidth="4" />
        <line x1="32" y1="276" x2="172" y2="276" stroke="#cf8b43" strokeWidth="2" />
        {/* jars */}
        <rect x="44" y="254" width="18" height="18" rx="3" fill="#e8788f" />
        <rect x="66" y="254" width="18" height="18" rx="3" fill="#7cb6e8" />
        <rect x="88" y="254" width="18" height="18" rx="3" fill="#f4c542" />
        <rect x="110" y="254" width="18" height="18" rx="3" fill="#8fd08a" />
        <rect x="132" y="254" width="18" height="18" rx="3" fill="#c89bf0" />
        <circle cx="50" cy="290" r="9" fill="#fbe0a8" stroke="#cf8b43" strokeWidth="1.5" />
        <circle cx="74" cy="290" r="9" fill="#f7c8d4" stroke="#cf8b43" strokeWidth="1.5" />
        <circle cx="98" cy="290" r="9" fill="#cee3f5" stroke="#cf8b43" strokeWidth="1.5" />
        <circle cx="122" cy="290" r="9" fill="#d8e6c8" stroke="#cf8b43" strokeWidth="1.5" />
        <circle cx="146" cy="290" r="9" fill="#f4c542" stroke="#cf8b43" strokeWidth="1.5" />
      </g>

      {/* ── Wall clock (between the cabinet and window) ── */}
      <g>
        <circle cx="188" cy="170" r="22" fill="#fff" stroke="#cf8b43" strokeWidth="3" />
        <circle cx="188" cy="170" r="22" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="1.5" transform="translate(1 2)" />
        {/* tick marks at 12/3/6/9 */}
        <line x1="188" y1="153" x2="188" y2="157" stroke="#5b3a1f" strokeWidth="2" strokeLinecap="round" />
        <line x1="205" y1="170" x2="201" y2="170" stroke="#5b3a1f" strokeWidth="2" strokeLinecap="round" />
        <line x1="188" y1="187" x2="188" y2="183" stroke="#5b3a1f" strokeWidth="2" strokeLinecap="round" />
        <line x1="171" y1="170" x2="175" y2="170" stroke="#5b3a1f" strokeWidth="2" strokeLinecap="round" />
        {/* hands */}
        <line x1="188" y1="170" x2="188" y2="158" stroke="#5b3a1f" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="188" y1="170" x2="199" y2="174" stroke="#5b3a1f" strokeWidth="2" strokeLinecap="round" />
        <circle cx="188" cy="170" r="2" fill="#5b3a1f" />
      </g>

      {/* ── Framed fish art (below the cabinet, above the counter) ── */}
      <g>
        <rect x="74" y="340" width="68" height="58" rx="4" fill="#fff6e0" stroke="#cf8b43" strokeWidth="3" />
        {/* fish body */}
        <ellipse cx="100" cy="368" rx="18" ry="11" fill="#7cb6e8" />
        {/* tail */}
        <path d="M118 368 l10 -8 l0 16 z" fill="#7cb6e8" />
        {/* eye */}
        <circle cx="93" cy="365" r="2.4" fill="#1a1420" />
        <circle cx="93.8" cy="364.3" r="0.8" fill="#fff" />
        {/* bubbles */}
        <circle cx="80" cy="356" r="2" fill="#bfe3ff" opacity="0.9" />
        <circle cx="84" cy="350" r="1.5" fill="#bfe3ff" opacity="0.9" />
        {/* mat caption line */}
        <line x1="80" y1="388" x2="136" y2="388" stroke="#cf8b43" strokeWidth="1.5" opacity="0.5" />
      </g>

      {/* ── Sunny window (centre, above the counter) ── */}
      <g>
        <rect x="200" y="150" width="120" height="140" rx="4" fill="url(#kt-window)" stroke="#fff3e6" strokeWidth="10" />
        <line x1="260" y1="150" x2="260" y2="290" stroke="#fff3e6" strokeWidth="5" />
        <line x1="200" y1="220" x2="320" y2="220" stroke="#fff3e6" strokeWidth="5" />
        {/* sun + cloud */}
        <circle cx="296" cy="178" r="14" fill="#ffe27a" />
        <ellipse cx="226" cy="200" rx="20" ry="9" fill="#fff" opacity="0.9" />
        <ellipse cx="240" cy="194" rx="14" ry="7" fill="#fff" opacity="0.9" />
        {/* sill */}
        <rect x="192" y="288" width="136" height="10" rx="2" fill="#cf8b43" />
      </g>

      {/* ── Fridge (right) — extended to reach the new floor line. ── */}
      <g>
        <rect x="324" y="180" width="64" height="420" rx="8" fill="#fafafa" stroke="#b5b5b5" strokeWidth="3" />
        <line x1="324" y1="290" x2="388" y2="290" stroke="#b5b5b5" strokeWidth="2" />
        {/* freezer handle (upper) */}
        <rect x="380" y="220" width="4" height="22" rx="2" fill="#b5b5b5" />
        {/* fridge handle (lower) */}
        <rect x="380" y="320" width="4" height="28" rx="2" fill="#b5b5b5" />
      </g>

      {/* ── Counter + stove (centre, sitting on the new floor line) ── */}
      <g>
        {/* counter top */}
        <rect x="80" y="528" width="240" height="14" rx="3" fill="#f7c8a0" />
        {/* counter cabinets */}
        <rect x="80" y="542" width="240" height="58" rx="0" fill="#fff6e0" stroke="#cf8b43" strokeWidth="3" />
        <line x1="200" y1="542" x2="200" y2="600" stroke="#cf8b43" strokeWidth="2" />
        <circle cx="140" cy="572" r="3" fill="#cf8b43" />
        <circle cx="260" cy="572" r="3" fill="#cf8b43" />
        {/* stove */}
        <rect x="140" y="472" width="120" height="56" rx="6" fill="#e2e2e2" stroke="#9a9a9a" strokeWidth="2" />
        {/* knobs */}
        <circle cx="156" cy="486" r="5" fill="#7e96a8" />
        <circle cx="178" cy="486" r="5" fill="#7e96a8" />
        <circle cx="222" cy="486" r="5" fill="#7e96a8" />
        <circle cx="244" cy="486" r="5" fill="#7e96a8" />
        {/* burners */}
        <circle cx="170" cy="510" r="9" fill="#444" />
        <circle cx="230" cy="510" r="9" fill="#444" />
        {/* pot */}
        <rect x="186" y="438" width="34" height="22" rx="4" fill="#7cb6e8" />
        <rect x="178" y="432" width="50" height="8" rx="3" fill="#9cc3ee" />
        {/* steam wisps */}
        <path d="M196 424 q4 -8 0 -16" fill="none" stroke="#ffffff" strokeWidth="2.5" opacity="0.8" strokeLinecap="round" />
        <path d="M204 420 q-4 -8 0 -16" fill="none" stroke="#ffffff" strokeWidth="2.5" opacity="0.8" strokeLinecap="round" />
        <path d="M212 424 q4 -8 0 -16" fill="none" stroke="#ffffff" strokeWidth="2.5" opacity="0.8" strokeLinecap="round" />
      </g>

      {/* ── Cat food bowl (right foreground on the floor) ── */}
      <g>
        <ellipse cx="60" cy="694" rx="36" ry="8" fill="rgba(60,40,20,0.18)" />
        <ellipse cx="60" cy="688" rx="32" ry="9" fill="#e8788f" />
        <ellipse cx="60" cy="684" rx="28" ry="7" fill="#fce0e8" />
        {/* a few kibbles in the bowl */}
        <circle cx="52" cy="681" r="2.4" fill="#cf8b43" />
        <circle cx="60" cy="680" r="2.4" fill="#cf8b43" />
        <circle cx="68" cy="681" r="2.4" fill="#cf8b43" />
        <circle cx="56" cy="685" r="2.4" fill="#cf8b43" />
        <circle cx="64" cy="685" r="2.4" fill="#cf8b43" />
      </g>
    </svg>
  );
}

// ── SCREEN 6 — Kitchen mission ────────────────────────────────
export function ChildKitchen({ tint, onNext, onBack }: Common) {
  // Beat 1: dramatic tummy growl + meow. Beat 2: Bugsy freezes and asks
  // the child to help find food.
  const [phase, setPhase] = useState<"growl" | "talk">("growl");
  const [done, setDone] = useState(false);
  const { meow } = useCatSounds();

  useEffect(() => {
    meow();
    const t = window.setTimeout(() => setPhase("talk"), 1100);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: "#fcd286" }}>
      <KitchenBackdrop />

      {/* back button */}
      {onBack && (
        <button
          onClick={onBack}
          aria-label="Back"
          style={{
            position: "absolute",
            top: 14,
            left: 14,
            width: 40,
            height: 40,
            borderRadius: 12,
            border: "2px solid rgba(0,0,0,0.12)",
            background: "rgba(255,255,255,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#7a5a44",
            zIndex: 8,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14">
            <path d="M9 1L3 7l6 6" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}

      {/* Bugsy + (growl indicator | dialogue bubble) on the kitchen floor */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 150,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 14,
          padding: "0 24px",
          zIndex: 3,
        }}
      >
        {phase === "talk" && (
          <RoomBubble
            tail="down"
            text="Yay! Our first mission is a snack hunt — let's collect yummy food!"
            onDone={() => setDone(true)}
          />
        )}
        <div
          style={{
            position: "relative",
            filter: "drop-shadow(0 12px 12px rgba(80,50,20,0.28))",
            animation: phase === "growl" ? "bobo-growl 1s ease-in-out" : undefined,
            transformOrigin: "center bottom",
          }}
        >
          <Bobo
            mood={phase === "growl" ? "worried" : "hungry"}
            tint={tint}
            size={160}
          />
          {/* "GRRR…" tummy-growl indicator floats next to Bugsy during the growl beat */}
          {phase === "growl" && (
            <span
              aria-hidden
              style={{
                position: "absolute",
                top: 22,
                right: -30,
                background: "#fff5d8",
                border: "2px solid #b9772f",
                borderRadius: 12,
                padding: "4px 9px",
                fontFamily: "var(--font-nunito), system-ui",
                fontWeight: 900,
                fontSize: 14,
                color: "#7a4a18",
                boxShadow: "0 3px 0 #8a5b22",
                animation: "goal-pop 0.9s ease both",
                pointerEvents: "none",
                letterSpacing: 0.3,
              }}
            >
              GRRR…
            </span>
          )}
        </div>
      </div>

      {/* CTA */}
      <div
        style={{
          position: "absolute",
          left: 20,
          right: 20,
          bottom: 28,
          opacity: done ? 1 : 0,
          transform: done ? "translateY(0)" : "translateY(10px)",
          transition: "opacity 0.4s ease, transform 0.4s ease",
          pointerEvents: done ? "auto" : "none",
          zIndex: 6,
        }}
      >
        <BigCTA onClick={onNext}>Start the first mission</BigCTA>
      </div>
    </div>
  );
}

// ── SCREEN — The growth plan (train me) ───────────────────────
// Plays right after the child has calmed Bugsy's zoomies. Now that
// they've helped him settle with calm breaths, Bugsy lays out the
// simple loop: do missions to train him, earn XP, unlock
// rewards. Kept to JUST the training idea — the clan is introduced on
// its own screen next so it's not dumped on the child all at once.
export function ChildGrowPlan({ tint, childName, onNext, onBack }: Common) {
  const friend = childName.trim() || "friend";
  type Phase = "win" | "loop";
  const ORDER: Phase[] = ["win", "loop"];
  const [phase, setPhase] = useState<Phase>("win");
  const [bubbleDone, setBubbleDone] = useState(false);

  // Reset the typewriter "done" flag each time the line changes.
  useEffect(() => {
    setBubbleDone(false);
  }, [phase]);

  const idx = ORDER.indexOf(phase);
  const advance = () => {
    const next = ORDER[idx + 1];
    if (next) setPhase(next);
    else onNext();
  };

  const text =
    phase === "win"
      ? `You helped me feel calm, ${friend}! Now let's get stronger together. 💪`
      : "Here's how we grow: do missions to train me, earn XP, and unlock cool rewards!";

  const cta = phase === "win" ? "How?" : "Got it!";

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: "#e7c3bd" }}>
      <RoomBackdrop chairs={false} dusk />

      {/* back button */}
      {onBack && (
        <button
          onClick={onBack}
          aria-label="Back"
          style={{
            position: "absolute",
            top: 14,
            left: 14,
            width: 40,
            height: 40,
            borderRadius: 12,
            border: "2px solid rgba(0,0,0,0.12)",
            background: "rgba(255,255,255,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#6a4a52",
            zIndex: 8,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14">
            <path d="M9 1L3 7l6 6" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}

      {/* Bugsy + dialogue (+ the loop list on the "loop" beat) */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 150,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          padding: "0 24px",
          zIndex: 4,
        }}
      >
        <RoomBubble key={phase} tail="down" text={text} onDone={() => setBubbleDone(true)} />

        <div style={{ filter: "drop-shadow(0 12px 14px rgba(50,35,70,0.3))" }}>
          <Bobo mood="cheer" tint={tint} size={150} tailWag />
        </div>

        {phase === "loop" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              width: "100%",
              maxWidth: 300,
              opacity: bubbleDone ? 1 : 0,
              transform: bubbleDone ? "translateY(0)" : "translateY(8px)",
              transition: "opacity 0.45s ease, transform 0.45s ease",
            }}
          >
            <ActivityRow icon={<MissionsIcon />} text="Do missions to train me" />
            <ActivityRow icon="⚡" text="Earn XP & unlock rewards" />
          </div>
        )}
      </div>

      {/* CTA — appears once the line finishes typing. */}
      <div
        style={{
          position: "absolute",
          left: 20,
          right: 20,
          bottom: 28,
          opacity: bubbleDone ? 1 : 0,
          transform: bubbleDone ? "translateY(0)" : "translateY(10px)",
          transition: "opacity 0.4s ease, transform 0.4s ease",
          pointerEvents: bubbleDone ? "auto" : "none",
          zIndex: 6,
        }}
      >
        <BigCTA onClick={advance}>{cta}</BigCTA>
      </div>
    </div>
  );
}

// ── SCREEN — Meet the clan ────────────────────────────────────
// Introduces the "clan" idea on its own, gently, so it doesn't land out
// of nowhere: first Bugsy explains what a clan is (a team of cats + their
// humans), with a little line-up of clan cats to make it concrete, then
// the goal — once strong, they join one to take on big adventures together.
export function ChildClanIntro({ tint, childName, onNext, onBack }: Common) {
  const friend = childName.trim() || "friend";
  type Phase = "what" | "join";
  const ORDER: Phase[] = ["what", "join"];
  const [phase, setPhase] = useState<Phase>("what");
  const [bubbleDone, setBubbleDone] = useState(false);

  useEffect(() => {
    setBubbleDone(false);
  }, [phase]);

  const idx = ORDER.indexOf(phase);
  const advance = () => {
    const next = ORDER[idx + 1];
    if (next) setPhase(next);
    else onNext();
  };

  const text =
    phase === "what"
      ? "Oh — have you heard of a CLAN? It's a team of cats and their humans, all training together."
      : `Once I'm strong, we'll join one — and our whole clan takes on big adventures together. Stronger as a team, ${friend}!`;

  const cta = phase === "what" ? "Whoa, cool!" : "Join the clan! 🛡️";

  // A little line-up of clan cats (varied colours, a couple with hats)
  // so "clan" reads as a group, not just Bugsy.
  const CLAN: { tint: number; hat?: string }[] = [
    { tint: 200 },
    { tint: 320, hat: "crown" },
    { tint: 95 },
    { tint: 45, hat: "party" },
  ];

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: "#e7c3bd" }}>
      <RoomBackdrop chairs={false} dusk />

      {/* back button */}
      {onBack && (
        <button
          onClick={onBack}
          aria-label="Back"
          style={{
            position: "absolute",
            top: 14,
            left: 14,
            width: 40,
            height: 40,
            borderRadius: 12,
            border: "2px solid rgba(0,0,0,0.12)",
            background: "rgba(255,255,255,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#6a4a52",
            zIndex: 8,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14">
            <path d="M9 1L3 7l6 6" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 150,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          padding: "0 24px",
          zIndex: 4,
        }}
      >
        <RoomBubble key={phase} tail="down" text={text} onDone={() => setBubbleDone(true)} />

        <div style={{ filter: "drop-shadow(0 12px 14px rgba(50,35,70,0.3))" }}>
          <Bobo mood="excited" tint={tint} size={132} tailWag />
        </div>

        {/* The clan line-up — appears once the line finishes typing. */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            gap: 4,
            opacity: bubbleDone ? 1 : 0,
            transform: bubbleDone ? "translateY(0)" : "translateY(8px)",
            transition: "opacity 0.45s ease, transform 0.45s ease",
          }}
        >
          {CLAN.map((c, i) => (
            <div
              key={i}
              style={{
                filter: "drop-shadow(0 6px 6px rgba(50,35,70,0.25))",
                animation: `bugsy-pop 0.45s cubic-bezier(0.22, 1.5, 0.36, 1) ${i * 0.09}s backwards`,
              }}
            >
              <BoboHead mood="happy" tint={c.tint} size={50} hat={c.hat} />
            </div>
          ))}
        </div>
      </div>

      {/* CTA — appears once the line finishes typing. */}
      <div
        style={{
          position: "absolute",
          left: 20,
          right: 20,
          bottom: 28,
          opacity: bubbleDone ? 1 : 0,
          transform: bubbleDone ? "translateY(0)" : "translateY(10px)",
          transition: "opacity 0.4s ease, transform 0.4s ease",
          pointerEvents: bubbleDone ? "auto" : "none",
          zIndex: 6,
        }}
      >
        <BigCTA onClick={advance}>{cta}</BigCTA>
      </div>
    </div>
  );
}

// ── SCREEN — The zoomies & calming Bugsy ──────────────────────
// The room stays bright and warm. A glowing "breathing bubble" appears
// beside Bugsy as he suddenly gets the zoomies — wiggling with too much
// energy and spiky fur. He asks the child to take calm breaths with him.
// Guided box breathing (in-3 / hold-3 / out-3 × 3 rounds) gradually
// slows him, softens his glow, and at the end he curls up calmly.
//
// Phases:
//   "zoomies"   — Bugsy bouncing with energy → "Start calm breathing"
//   "breathing" — guided breathing loop (3 rounds)
//   "calm"      — Bugsy curled up calm, reassurance line, Continue
export function ChildCalmBugsy({ tint, onNext, onBack }: Common) {
  type Phase = "zoomies" | "breathing" | "calm";
  type Step = "in" | "hold" | "out";

  const [phase, setPhase] = useState<Phase>("zoomies");
  const [step, setStep] = useState<Step>("in");
  const [count, setCount] = useState(1); // 1..3 inside the step
  const [round, setRound] = useState(0); // 0..2
  const [bubbleDone, setBubbleDone] = useState(false);
  // The calm wind-down plays a few beats: 0 = "how do you feel?", 1 =
  // when to use calm breaths, 2 = daily-return invite (icons float in),
  // 3 = the things we can do together. `thanksDone` = current line typed.
  const [calmStep, setCalmStep] = useState(0);
  const [thanksDone, setThanksDone] = useState(false);

  // ── Calm wind-down script ──
  const CALM_LINES = [
    "Phew! I feel much calmer now. How do you feel?",
    "We can use calm breaths when:",
    "Come visit me every day to care for me and grow with me!",
    "We can:",
  ];
  const CALM_CTAS = ["I feel calm 😌", "Got it!", "What can we do?", "I'll come back!"];
  // Situations where calm breaths help (calm beat 1).
  const CALM_WHEN: { icon: React.ReactNode; text: string }[] = [
    { icon: "🚀", text: "Before we start a mission" },
    { icon: "🏁", text: "After we finish a mission" },
    { icon: "😰", text: "When I get nervous" },
    { icon: "🤩", text: "When I get excited" },
  ];
  // Things we do together (calm beat 3).
  const CALM_CAN: { icon: React.ReactNode; text: string }[] = [
    { icon: <MissionsIcon />, text: "Go on missions" },
    { icon: "🍎", text: "Eat yummy food" },
    { icon: "🧶", text: "Play together" },
    { icon: "🤗", text: "Cuddle me" },
    { icon: "🫧", text: "Practice calm breaths" },
    { icon: "👋", text: "Socialise" },
  ];

  // Box-breathing 1-Hz tick. Counts up 1..3, then advances the step
  // (in → hold → out → next round). After 3 rounds, phase = "calm".
  useEffect(() => {
    if (phase !== "breathing") return;
    const id = window.setInterval(() => {
      setCount((c) => {
        if (c < 3) return c + 1;
        // Wrap to 1 and advance the step.
        setStep((s) => {
          if (s === "in") return "hold";
          if (s === "hold") return "out";
          // Finishing an "out" closes a round.
          setRound((r) => {
            if (r >= 2) {
              setPhase("calm");
              return r;
            }
            return r + 1;
          });
          return "in";
        });
        return 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [phase]);

  // 0..1 calmness progress — drives Bugsy's glow softness + wiggle speed.
  const calmProgress =
    phase === "calm"
      ? 1
      : phase === "breathing"
        ? Math.min(
            1,
            (round * 3 +
              (step === "in" ? 0 : step === "hold" ? 1 : 2) +
              count / 3) /
              9,
          )
        : 0;

  // High while he has the zoomies, eases to 0 as the child breathes him
  // calm — drives the spiky fur (frazzled) and the wiggle/glow intensity.
  const energy = phase === "calm" ? 0 : 1 - calmProgress * 0.9;

  // Mood ladder — bouncy excited with the zoomies, settles to happy
  // mid-breathing, content once curled up.
  const mood: Mood =
    phase === "calm"
      ? "happy"
      : phase === "breathing" && calmProgress > 0.6
        ? "happy"
        : "excited";

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        background: "#fceadd",
      }}
    >
      <RoomBackdrop chairs={false} />

      {/* Back button */}
      {onBack && (
        <button
          onClick={onBack}
          aria-label="Back"
          style={{
            position: "absolute",
            top: 14,
            left: 14,
            width: 40,
            height: 40,
            borderRadius: 12,
            border: "2px solid rgba(0,0,0,0.12)",
            background: "rgba(255,255,255,0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#7a5a44",
            zIndex: 8,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14">
            <path
              d="M9 1L3 7l6 6"
              stroke="currentColor"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}

      {/* Zoomies / breathing: Bugsy + dialogue or breathing guide,
          anchored above the CTA bar. */}
      {phase !== "calm" && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 150,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 18,
            padding: "0 24px",
            zIndex: 4,
          }}
        >
          {phase === "zoomies" && (
            <RoomBubble
              tail="down"
              text="Oh dear! I feel the zoomies coming! Let's take calm breaths, so I feel steady."
              onDone={() => setBubbleDone(true)}
            />
          )}
          {phase === "breathing" && (
            <BreathingGuide step={step} count={count} round={round} />
          )}

          {/* Bugsy himself — bounces with spiky-fur energy during the
              zoomies; belly-breathes and slows as the child breathes
              with him. */}
          <BugsyAvatar
            phase={phase}
            step={step}
            energy={energy}
            calmProgress={calmProgress}
            mood={mood}
            tint={tint}
          />
        </div>
      )}

      {/* Calm wind-down — Bugsy curled up with a soft glow + gently
          shining breathing bubble; a few dialogue beats with little
          lists / floating care icons. Full-height + scrollable so the
          longer lists never clip. */}
      {phase === "calm" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            padding: "70px 24px 120px",
            overflowY: "auto",
            zIndex: 4,
          }}
        >
          <RoomBubble
            key={calmStep}
            tail="down"
            maxWidth={300}
            text={CALM_LINES[calmStep]}
            onDone={() => setThanksDone(true)}
          />

          <div style={{ position: "relative" }}>
            <BugsyAvatar
              phase={phase}
              step={step}
              energy={energy}
              calmProgress={calmProgress}
              mood={mood}
              tint={tint}
            />
          </div>

          {/* Beat 1: when calm breaths help. Beat 3: what we do together. */}
          {(calmStep === 1 || calmStep === 3) && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                width: "100%",
                maxWidth: 300,
                opacity: thanksDone ? 1 : 0,
                transform: thanksDone ? "translateY(0)" : "translateY(8px)",
                transition: "opacity 0.45s ease, transform 0.45s ease",
              }}
            >
              {(calmStep === 1 ? CALM_WHEN : CALM_CAN).map((row, i) => (
                <ActivityRow key={i} icon={row.icon} text={row.text} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* CTA bar — "Start calm breathing" → breathing loop, then Continue. */}
      <div
        style={{
          position: "absolute",
          left: 20,
          right: 20,
          bottom: 28,
          opacity:
            (phase === "zoomies" && bubbleDone) ||
            (phase === "calm" && thanksDone)
              ? 1
              : 0,
          transform:
            (phase === "zoomies" && bubbleDone) ||
            (phase === "calm" && thanksDone)
              ? "translateY(0)"
              : "translateY(10px)",
          transition: "opacity 0.4s ease, transform 0.4s ease",
          pointerEvents:
            (phase === "zoomies" && bubbleDone) ||
            (phase === "calm" && thanksDone)
              ? "auto"
              : "none",
          zIndex: 6,
        }}
      >
        {phase === "zoomies" && (
          <BigCTA
            onClick={() => {
              setPhase("breathing");
              setStep("in");
              setCount(1);
              setRound(0);
            }}
          >
            Start calm breathing
          </BigCTA>
        )}
        {phase === "calm" && (
          <BigCTA
            onClick={() => {
              if (calmStep < CALM_LINES.length - 1) {
                // Re-arm the "line typed" flag so the next beat's list /
                // CTA wait for the new line to finish typing.
                setThanksDone(false);
                setCalmStep((s) => s + 1);
              } else onNext();
            }}
          >
            {CALM_CTAS[calmStep]}
          </BigCTA>
        )}
      </div>
    </div>
  );
}

// Guided box-breathing visual: a circle that inflates over "in",
// holds during "hold", and deflates on "out". Count and round are
// labelled around it so the kid always knows where they are.
function BreathingGuide({
  step,
  count,
  round,
}: {
  step: "in" | "hold" | "out";
  count: number;
  round: number;
}) {
  // Target diameter of the breathing ring. CSS transition handles the
  // smooth 3 s travel between sizes — quick "snap" when we re-enter
  // a step at the start of a new round is intentional and barely
  // noticeable because the value matches the previous "out" exit.
  const targetScale = step === "out" ? 0.62 : 1;
  const label =
    step === "in" ? "Breathe in" : step === "hold" ? "Hold" : "Breathe out";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 14,
      }}
    >
      {/* Full instruction so the child knows the whole rhythm up front. */}
      <div
        style={{
          fontFamily: "var(--font-nunito), system-ui",
          fontWeight: 800,
          fontSize: 13.5,
          color: "#7a5a44",
          textAlign: "center",
          maxWidth: 280,
          lineHeight: 1.4,
        }}
      >
        Breathe in for 1…2…3. Hold for 1…2…3. Breathe out for 1…2…3.
      </div>
      <div
        style={{
          position: "relative",
          width: 140,
          height: 140,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* The expanding/contracting ring */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.85), rgba(255, 220, 200, 0.55) 70%, rgba(255, 180, 160, 0.45))",
            border: "3px solid rgba(255, 255, 255, 0.9)",
            transform: `scale(${targetScale})`,
            transition: "transform 3s ease-in-out",
            boxShadow:
              "0 0 32px rgba(255, 240, 220, 0.55), inset 0 4px 12px rgba(255,255,255,0.55)",
          }}
        />
        {/* Count digit centred in the ring */}
        <div
          style={{
            position: "relative",
            fontFamily: "var(--font-nunito), system-ui",
            fontWeight: 900,
            fontSize: 56,
            lineHeight: 1,
            color: "#5b3a1f",
            textShadow: "0 2px 0 rgba(255,255,255,0.55)",
          }}
        >
          {count}
        </div>
      </div>

      <div
        style={{
          fontFamily: "var(--font-nunito), system-ui",
          fontWeight: 900,
          fontSize: 22,
          color: "#5b3a1f",
          letterSpacing: 0.4,
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontFamily: "var(--font-nunito), system-ui",
          fontWeight: 800,
          fontSize: 12,
          color: "rgba(91, 58, 31, 0.7)",
          letterSpacing: 1.6,
          textTransform: "uppercase",
        }}
      >
        Round {round + 1} of 3
      </div>
    </div>
  );
}

// Bugsy mascot block used inside ChildCalmBugsy. Lives outside the
// screen body so the calm-phase row layout can place a speech bubble
// next to him without re-declaring the glow / wiggle / breathing-belly
// stack inline twice.
function BugsyAvatar({
  phase,
  step,
  energy,
  calmProgress,
  mood,
  tint,
}: {
  phase: "zoomies" | "breathing" | "calm";
  step: "in" | "hold" | "out";
  // 0..1 — high while he has the zoomies, eases to 0 as he calms.
  energy: number;
  calmProgress: number;
  mood: Mood;
  tint: number;
}) {
  // Body wiggle: fast & bouncy with the zoomies, slowing as he calms,
  // stopping once curled up.
  const wiggle =
    phase === "zoomies"
      ? "zoomies-bounce 0.5s ease-in-out infinite"
      : phase === "breathing"
        ? `zoomies-bounce ${(0.7 + calmProgress * 2).toFixed(2)}s ease-in-out infinite`
        : undefined;

  // Glow behind Bugsy — bright & quick while energetic, soft & steady
  // as he calms.
  const glowAnim =
    phase === "zoomies"
      ? "breath-glow 1.4s ease-in-out infinite"
      : phase === "breathing"
        ? `breath-glow ${(2.4 + calmProgress * 2).toFixed(2)}s ease-in-out infinite`
        : "breath-glow 5s ease-in-out infinite";

  return (
    <div
      style={{
        position: "relative",
        // Trim him down a touch in calm so the bubble + tail wag fit.
        transform: phase === "calm" ? "scale(0.9)" : "none",
        transition: "transform 1.6s cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      {/* Soft glowing halo behind Bugsy — softens/steadies as he calms. */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: "calc(50% - 115px)",
          top: "calc(52% - 115px)",
          width: 230,
          height: 230,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(255,224,150,${(0.55 - calmProgress * 0.12).toFixed(2)}) 0%, rgba(255,200,120,0.22) 46%, rgba(255,200,120,0) 72%)`,
          filter: "blur(4px)",
          animation: glowAnim,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Glowing "breathing bubble" beside Bugsy — appears with the
          zoomies as a hint of the calm breathing to come. */}
      {phase === "zoomies" && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            right: -6,
            top: 4,
            width: 54,
            height: 54,
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.95), rgba(255,224,150,0.7) 60%, rgba(255,200,120,0.45))",
            border: "2px solid rgba(255,255,255,0.9)",
            boxShadow: "0 0 22px rgba(255, 220, 150, 0.8)",
            animation: "breath-glow 2.2s ease-in-out infinite",
            zIndex: 2,
          }}
        />
      )}

      {/* Breathing belly — only animates while breathing. scaleX grows a
          touch more than scaleY so it reads as a "puff out", with the
          transform-origin near the belly so the head barely moves. */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          transform:
            phase === "breathing" && step !== "out"
              ? "scale(1.07, 1.04)"
              : "scale(1, 1)",
          transformOrigin: "50% 72%",
          transition: "transform 3s ease-in-out",
        }}
      >
        {/* Calm: gentle idle. Otherwise the body wiggle (zoomies fast,
            breathing slowing). */}
        <div
          style={{
            filter: "drop-shadow(0 12px 12px rgba(120,80,40,0.28))",
            animation:
              phase === "calm" ? "bobo-calm-idle 3.6s ease-in-out infinite" : wiggle,
            transformOrigin: "bottom center",
          }}
        >
          <Bobo
            mood={mood}
            tint={tint}
            size={160}
            tailWag={phase === "calm"}
            frazzled={phase === "calm" ? 0 : energy}
          />
        </div>
      </div>
    </div>
  );
}

// Cream/amber activity pill used in the calm wind-down lists. Matches
// the warm onboarding palette (same border + drop-shadow as the rest
// of Bugsy's room). `icon` can be a string emoji or any JSX element.
function ActivityRow({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "9px 14px",
        background: "rgba(255, 246, 224, 0.96)",
        border: "2px solid #cf8b43",
        borderRadius: 14,
        fontFamily: "var(--font-nunito), system-ui",
        fontWeight: 800,
        fontSize: 14.5,
        color: "#5b3a1f",
        boxShadow: "0 2px 0 #8a5b22",
      }}
    >
      <span
        style={{
          width: 30,
          height: 30,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 22,
          lineHeight: 1,
        }}
      >
        {icon}
      </span>
      <span>{text}</span>
    </div>
  );
}

// Game-console icon used for the "Go on missions with me" row.
function MissionsIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      width="30"
      height="30"
      aria-hidden
    >
      <path
        d="M255,142.13a14,14,0,0,1-14-14,172.68,172.68,0,0,1,24.16-88.2,14,14,0,0,1,24.07,14.3A144.78,144.78,0,0,0,269,128.13,14,14,0,0,1,255,142.13Z"
        fill="#34344f"
      />
      <path
        d="M170.69,393.19Q152.81,419.82,135,446.27a73.32,73.32,0,0,1-60.81,32.65h0A74.34,74.34,0,0,1,0,404.78v-24.3c.05-116.27,16.41-231,136.21-241.57,13.21-.89,66.49-3.17,119.77-3,53.28-.16,106.56,2.12,119.77,3C495.58,149.52,512,264.24,512,380.53v24.25a74.33,74.33,0,0,1-74.14,74.14h0a73.31,73.31,0,0,1-60.81-32.65q-17.87-26.44-35.74-53.08c-13.86-20.64-36.58-33.13-60.83-33.2q-24.48-.08-49,0C207.27,360.06,184.55,372.55,170.69,393.19Z"
        fill="#f9973e"
      />
      <path
        d="M398,142.33a170.41,170.41,0,0,0-22.27-3.42c-13.21-.89-66.49-3.17-119.77-3-53.28-.16-106.56,2.12-119.77,3C18.83,149.31.76,259.61,0,373.42a277,277,0,0,0,120.53,27.4,279.31,279.31,0,0,0,47.75-4.1l2.38-3.53c13.86-20.64,36.58-33.13,60.83-33.2q17.11-.06,34.22,0A278.06,278.06,0,0,0,398,142.33Z"
        fill="#fca84c"
      />
      <circle cx="132.33" cy="251.05" r="72.74" fill="#e8f5f9" />
      <path
        d="M170.45,234.05H149.33V212.93a17,17,0,1,0-34,0v21.12H94.21a17,17,0,1,0,0,34h21.12v21.13a17,17,0,1,0,34,0V268.05h21.12a17,17,0,0,0,0-34Z"
        fill="#34344f"
      />
      <circle cx="379.67" cy="251.05" r="72.74" fill="#e8f5f9" />
      <circle cx="379.67" cy="215.43" r="18.43" fill="#34344f" />
      <circle cx="379.67" cy="286.67" r="18.43" fill="#34344f" />
      <circle cx="344.05" cy="251.05" r="18.43" fill="#34344f" />
      <circle cx="415.29" cy="251.05" r="18.43" fill="#34344f" />
      <path
        d="M325.72 404.41a49.82 49.82 0 1 1 49.83-49.82A49.88 49.88 0 0 1 325.72 404.41ZM186.28 404.41a49.82 49.82 0 1 1 49.82-49.82A49.88 49.88 0 0 1 186.28 404.41Z"
        fill="#34344f"
      />
      <path
        d="M256,135.9c8.67,0,17.34,0,25.84.1l-.62-4.74A13.32,13.32,0,0,0,268,119.69H244a13.32,13.32,0,0,0-13.2,11.57l-.62,4.74C238.66,135.91,247.32,135.87,256,135.9Z"
        fill="#3d3d59"
      />
      <path
        d="M347.55 354.59a21.83 21.83 0 1 0-21.83 21.82A21.85 21.85 0 0 0 347.55 354.59ZM186.28 332.77a21.82 21.82 0 1 0 21.82 21.82A21.85 21.85 0 0 0 186.28 332.77Z"
        fill="#4b4b6b"
      />
    </svg>
  );
}

// ── SCREEN — When should I wait for you tomorrow? ─────────────
// The emotional close: same room as the first meeting, but dusk has
// fallen. Bugsy asks what time to wait for the child tomorrow, so the
// daily visit feels like a promise he's holding onto.
const PROMISE_TIMES: { id: string; label: string; emoji: string }[] = [
  { id: "morning", label: "Morning", emoji: "🌅" },
  { id: "afternoon", label: "Afternoon", emoji: "☀️" },
  { id: "evening", label: "Evening", emoji: "🌙" },
];
export function ChildPromise({ tint, childName, onNext, onBack }: Common) {
  const friend = childName.trim() || "friend";
  const [picked, setPicked] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const pickedLabel = PROMISE_TIMES.find((t) => t.id === picked)?.label.toLowerCase();
  const bubbleText = picked
    ? `Yay! I'll be right here waiting for you in the ${pickedLabel}. 🐾`
    : `It's getting late, ${friend}… When should I wait for you tomorrow?`;

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: "#e7c3bd" }}>
      <RoomBackdrop dusk />

      {/* back button */}
      {onBack && (
        <button
          onClick={onBack}
          aria-label="Back"
          style={{
            position: "absolute",
            top: 14,
            left: 14,
            width: 40,
            height: 40,
            borderRadius: 12,
            border: "2px solid rgba(0,0,0,0.12)",
            background: "rgba(255,255,255,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#6a4a52",
            zIndex: 8,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14">
            <path d="M9 1L3 7l6 6" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}

      {/* Bugsy + the question + time options, centred in the dusky room */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          padding: "70px 24px 110px",
          overflowY: "auto",
          zIndex: 3,
        }}
      >
        <div style={{ filter: "drop-shadow(0 12px 14px rgba(50,35,70,0.3))" }}>
          <Bobo mood={picked ? "cheer" : "worried"} tint={tint} size={150} tailWag={!!picked} />
        </div>
        <RoomBubble
          key={picked ?? "ask"}
          tail="up"
          text={bubbleText}
          onDone={() => setDone(true)}
        />

        {/* Time-of-day options — hidden once one is chosen. */}
        {!picked && (
          <div
            style={{
              width: "100%",
              maxWidth: 300,
              display: "flex",
              flexDirection: "column",
              gap: 10,
              opacity: done ? 1 : 0,
              transform: done ? "translateY(0)" : "translateY(8px)",
              transition: "opacity 0.4s ease, transform 0.4s ease",
              pointerEvents: done ? "auto" : "none",
            }}
          >
            {PROMISE_TIMES.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setDone(false);
                  setPicked(t.id);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "14px 18px",
                  borderRadius: 16,
                  border: "2px solid #c98",
                  background: "rgba(255,255,255,0.92)",
                  color: "#5b3a4a",
                  fontFamily: "var(--font-nunito), system-ui",
                  fontWeight: 800,
                  fontSize: 18,
                  cursor: "pointer",
                  boxShadow: "0 4px 0 #b07f8c",
                }}
              >
                <span style={{ fontSize: 26 }}>{t.emoji}</span>
                {t.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* CTA — appears once a time is picked and the reply finishes. */}
      <div
        style={{
          position: "absolute",
          left: 20,
          right: 20,
          bottom: 28,
          opacity: picked && done ? 1 : 0,
          transform: picked && done ? "translateY(0)" : "translateY(10px)",
          transition: "opacity 0.4s ease, transform 0.4s ease",
          pointerEvents: picked && done ? "auto" : "none",
          zIndex: 6,
        }}
      >
        <BigCTA onClick={onNext}>It&apos;s a promise 🤞</BigCTA>
      </div>
    </div>
  );
}

// ── SCREEN — Daily goal (kept in the football park) ───────────
const DAILY_GOAL_OPTIONS = [
  { mins: 5, label: "Casual", sub: "A quick visit" },
  { mins: 10, label: "Regular", sub: "Just right" },
  { mins: 15, label: "Serious", sub: "Big plans!" },
  { mins: 20, label: "Intense", sub: "All in" },
];
const DAILY_GOAL_LINES: Record<number, string> = {
  5: "5 mins a day? That's 7 mini-quests with me this week!",
  10: "10 mins a day? 14 challenges this week — let's go!",
  15: "15 mins a day?! 21 challenges this week — pro mode!",
  20: "20 mins a day?? 28 challenges this week — superstar!",
};

export function ChildDailyGoal({
  tint,
  goal,
  setGoal,
  onNext,
  onBack,
}: Common & { goal: number | null; setGoal: (n: number) => void }) {
  const [bubbleDone, setBubbleDone] = useState(false);
  const bubbleText =
    goal === null
      ? "How long do you want to practice with me each day?"
      : DAILY_GOAL_LINES[goal];

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: "#bfe6ff" }}>
      <ParkBackdrop />

      {/* back button */}
      {onBack && (
        <button
          onClick={onBack}
          aria-label="Back"
          style={{
            position: "absolute",
            top: 14,
            left: 14,
            width: 40,
            height: 40,
            borderRadius: 12,
            border: "2px solid rgba(0,0,0,0.12)",
            background: "rgba(255,255,255,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#3b6a86",
            zIndex: 8,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14">
            <path d="M9 1L3 7l6 6" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}

      {/* Bugsy + question + options */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
          padding: "62px 20px 100px",
          overflowY: "auto",
          zIndex: 3,
        }}
      >
        <div style={{ filter: "drop-shadow(0 8px 10px rgba(40,70,40,0.22))" }}>
          <Bobo mood={goal === null ? "thinking" : "cheer"} tint={tint} size={118} />
        </div>
        <RoomBubble key={`goal-${goal ?? "ask"}`} tail="up" text={bubbleText} onDone={() => setBubbleDone(true)} />

        <div
          style={{
            width: "100%",
            maxWidth: 340,
            display: "flex",
            flexDirection: "column",
            gap: 10,
            opacity: bubbleDone ? 1 : 0,
            transition: "opacity 0.4s ease",
            pointerEvents: bubbleDone ? "auto" : "none",
          }}
        >
          {DAILY_GOAL_OPTIONS.map((opt) => {
            const active = goal === opt.mins;
            return (
              <button
                key={opt.mins}
                onClick={() => setGoal(opt.mins)}
                style={{
                  display: "flex",
                  gap: 14,
                  alignItems: "center",
                  textAlign: "left",
                  padding: "12px 14px",
                  borderRadius: 18,
                  cursor: "pointer",
                  background: active ? "var(--accent-soft)" : "var(--surface)",
                  border: active ? "3px solid var(--primary)" : "2px solid var(--border)",
                  boxShadow: active ? "0 3px 0 var(--primary-shadow)" : "0 3px 0 var(--border)",
                  transform: active ? "translateY(-2px)" : "none",
                  transition: "transform 0.12s ease, box-shadow 0.12s ease, background 0.15s ease",
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    background: active ? "var(--primary)" : "var(--surface-1)",
                    color: active ? "#fff" : "var(--ink)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-nunito), system-ui",
                    fontWeight: 900,
                    fontSize: 18,
                    letterSpacing: -0.3,
                    flexShrink: 0,
                    transition: "background 0.15s ease, color 0.15s ease",
                  }}
                >
                  {opt.mins}m
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: "var(--font-nunito), system-ui",
                      fontSize: 16,
                      fontWeight: 800,
                      color: active ? "var(--primary)" : "var(--ink)",
                      letterSpacing: -0.15,
                    }}
                  >
                    {opt.label}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-nunito), system-ui",
                      fontSize: 12.5,
                      fontWeight: 700,
                      color: "var(--ink-muted)",
                      marginTop: 2,
                    }}
                  >
                    {opt.sub}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <div style={{ position: "absolute", left: 20, right: 20, bottom: 28, zIndex: 6 }}>
        <BigCTA onClick={onNext} disabled={goal === null || !bubbleDone}>
          {goal === null ? "Pick a goal" : "That's my goal"}
        </BigCTA>
      </div>
    </div>
  );
}

// Shared chrome for the two "grab a grown-up" screens.
function familyBackBtn(onBack?: () => void) {
  if (!onBack) return null;
  return (
    <button
      onClick={onBack}
      aria-label="Back"
      style={{
        position: "absolute",
        top: 14,
        left: 14,
        width: 40,
        height: 40,
        borderRadius: 12,
        border: "2px solid rgba(0,0,0,0.12)",
        background: "rgba(255,255,255,0.8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        color: "#9a5b6a",
        zIndex: 8,
      }}
    >
      <svg width="14" height="14" viewBox="0 0 14 14">
        <path d="M9 1L3 7l6 6" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

// ── SCREEN — Sendoff ("one tiny grown-up step, then unstoppable") ──
export function ChildSendoff({
  tint,
  childName,
  equippedHat,
  onEnter,
  onBack,
}: Omit<Common, "onNext"> & { equippedHat: string | null; onEnter: () => void }) {
  const [done, setDone] = useState(false);
  const friend = childName.trim() || "friend";
  const line = `Let's go, ${friend}! Almost ready — one tiny grown-up step and then we are UNSTOPPABLE.`;

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: "#ffe6d6" }}>
      <FamilyBackdrop />
      {familyBackBtn(onBack)}

      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
          padding: "52px 24px 0",
          zIndex: 4,
        }}
      >
        <div style={{ filter: "drop-shadow(0 8px 10px rgba(150,80,90,0.22))" }}>
          <Bobo mood="cheer" tint={tint} hat={equippedHat ?? undefined} size={134} />
        </div>
        <RoomBubble tail="up" text={line} onDone={() => setDone(true)} />
      </div>

      <div
        style={{
          position: "absolute",
          left: 20,
          right: 20,
          bottom: 28,
          opacity: done ? 1 : 0,
          transform: done ? "translateY(0)" : "translateY(10px)",
          transition: "opacity 0.4s ease, transform 0.4s ease",
          pointerEvents: done ? "auto" : "none",
          zIndex: 6,
        }}
      >
        <BigCTA onClick={onEnter}>Let&apos;s go</BigCTA>
      </div>
    </div>
  );
}

// ── SCREEN — Almost done ("grab a grown-up for me?") ──────────
export function ChildAlmostDone({ tint, childName, onNext, onBack }: Common) {
  const friend = childName.trim() || "friend";
  const [done, setDone] = useState(false);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: "#ffe6d6" }}>
      <FamilyBackdrop />
      {familyBackBtn(onBack)}

      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
          padding: "52px 24px 0",
          zIndex: 4,
        }}
      >
        <div style={{ filter: "drop-shadow(0 8px 10px rgba(150,80,90,0.22))" }}>
          <Bobo mood="thinking" tint={tint} size={124} />
        </div>
        <RoomBubble
          tail="up"
          text={`Okay ${friend} — here's the tiny grown-up step. Grab one for me?`}
          onDone={() => setDone(true)}
        />
        <p
          style={{
            margin: "2px 8px 0",
            maxWidth: 300,
            fontFamily: "var(--font-nunito), system-ui",
            fontSize: 14,
            fontWeight: 800,
            color: "#9a5b6a",
            textAlign: "center",
            lineHeight: 1.45,
            opacity: done ? 1 : 0,
            transition: "opacity 0.4s ease",
          }}
        >
          They sign you in, then we&apos;re unstoppable. Promise.
        </p>
      </div>

      <div
        style={{
          position: "absolute",
          left: 20,
          right: 20,
          bottom: 28,
          opacity: done ? 1 : 0,
          transform: done ? "translateY(0)" : "translateY(10px)",
          transition: "opacity 0.4s ease, transform 0.4s ease",
          pointerEvents: done ? "auto" : "none",
          zIndex: 6,
        }}
      >
        <BigCTA onClick={onNext}>I have a grown-up</BigCTA>
      </div>
    </div>
  );
}
