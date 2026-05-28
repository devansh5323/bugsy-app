"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Bobo } from "../Mascot";
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
}: {
  text: string;
  onDone?: () => void;
  tail?: "up" | "down";
}) {
  return (
    <div
      style={{
        position: "relative",
        maxWidth: 320,
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
      <span
        aria-hidden
        style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%) rotate(45deg)",
          width: 16,
          height: 16,
          background: "var(--surface)",
          borderRadius: 3,
          ...(tail === "up"
            ? {
                top: -8,
                borderTop: "1px solid var(--border-strong)",
                borderLeft: "1px solid var(--border-strong)",
              }
            : {
                bottom: -8,
                borderRight: "1px solid var(--border-strong)",
                borderBottom: "1px solid var(--border-strong)",
              }),
        }}
      />
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
      {/* Doorway with light spilling out, Bugsy strolling through */}
      <div
        style={{
          position: "relative",
          width: 220,
          height: 260,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
        }}
      >
        {/* Door frame */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: 150,
            height: 230,
            borderRadius: "14px 14px 0 0",
            background: "linear-gradient(#6a5a3a, #4a3d28)",
            boxShadow: "0 0 0 8px #3a3020",
          }}
        />
        {/* Warm light from the doorway. Centered with margin (not
            translateX) so the door-open scaleX animation — which
            sets its own transform — doesn't knock it off-center. */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            bottom: 8,
            left: "50%",
            marginLeft: -65,
            transformOrigin: "center bottom",
            width: 130,
            height: 214,
            borderRadius: "10px 10px 0 0",
            background:
              "linear-gradient(#fff6d8 0%, #ffe6a8 55%, #ffd27a 100%)",
            animation: "door-open 0.9s ease forwards",
            boxShadow: "0 0 40px 18px rgba(255, 224, 150, 0.45)",
          }}
        />
        {/* Bugsy walking in */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            marginBottom: 6,
            animation: entered ? "bugsy-walk-in 1.5s ease forwards" : "none",
            opacity: entered ? undefined : 0,
          }}
        >
          <Bobo mood="waving" tint={tint} size={150} />
        </div>
      </div>

      <div
        style={{
          marginTop: 18,
          textAlign: "center",
          fontFamily: "var(--font-nunito), system-ui",
          fontSize: 20,
          fontWeight: 900,
          color: "#fff",
          textShadow: "0 2px 12px rgba(0,0,0,0.35)",
          opacity: entered ? 1 : 0,
          transition: "opacity 0.6s ease 0.6s",
        }}
      >
        Welcome to Bugsy&apos;s room…
      </div>

      <div style={{ flex: 1 }} />
      <div
        style={{
          width: "100%",
          opacity: ready ? 1 : 0,
          transform: ready ? "translateY(0)" : "translateY(10px)",
          transition: "opacity 0.5s ease, transform 0.5s ease",
          pointerEvents: ready ? "auto" : "none",
        }}
      >
        <BigCTA onClick={onNext}>Step inside →</BigCTA>
      </div>
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
function RoomBackdrop({
  tap,
  shake = null,
  onReveal,
  peek,
  chairs = true,
  dusk = false,
}: {
  tap?: (id: string) => void;
  shake?: string | null;
  onReveal?: () => void;
  peek?: React.ReactNode;
  chairs?: boolean;
  dusk?: boolean;
}) {
  const interactive = !!tap;
  // Evening palette for the "see you tomorrow" beat.
  const skyFill = dusk ? "url(#hs-sky-dusk)" : "url(#hs-sky)";
  const cloud = dusk ? "#f4c6ae" : "#ffffff";
  const hillA = dusk ? "#7ba06d" : "#a9d99a";
  const hillB = dusk ? "#67905d" : "#92c882";
  const bush1 = dusk ? "#5e8d56" : "#7cc46f";
  const bush2 = dusk ? "#6d9d62" : "#8ed07f";
  const bush3 = dusk ? "#547d4d" : "#6fb862";
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
        {dusk ? (
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
        <ellipse cx="160" cy="200" rx="30" ry="13" fill={cloud} opacity="0.8" />
        <ellipse cx="186" cy="194" rx="20" ry="11" fill={cloud} opacity="0.8" />
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
  // Ask for the name first (unless we already know it, e.g. from the parent).
  const [phase, setPhase] = useState<"name" | "search">(
    !named && setChildName ? "name" : "search",
  );
  const [nameInput, setNameInput] = useState(childName);
  const [found, setFound] = useState(false);
  const [shake, setShake] = useState<string | null>(null);
  const [bubbleDone, setBubbleDone] = useState(false);
  const [peeking, setPeeking] = useState(false);
  const { meow } = useCatSounds();

  const enteredName = (setChildName ? nameInput : childName).trim();
  const friend = enteredName || "friend";

  // Once the search begins, leave the room empty for a beat, then let
  // Bugsy pop up to peek.
  useEffect(() => {
    if (phase !== "search") return;
    const t = window.setTimeout(() => setPeeking(true), 1500);
    return () => window.clearTimeout(t);
  }, [phase]);

  const submitName = () => {
    const n = nameInput.trim();
    if (!n) return;
    setChildName?.(n);
    setPhase("search");
    meow();
  };

  const introLine = `Hi ${friend}! I'm Bugsy — I'm so happy you found me! …I just get a little shy around new friends.`;
  const ctaLabel = `Hi Bugsy! 👋`;

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
          {phase === "name" ? "Hi there! 🐱" : found ? "There you are! 🐾" : "Who's in my room?"}
          {phase === "search" && !found && (
            <span style={{ display: "block", fontSize: 19, fontWeight: 800, color: "#9c6f54", marginTop: 4 }}>
              Tap around to find me!
            </span>
          )}
        </div>
      </div>

      {/* ── Name first: Bugsy greets and asks who's playing ── */}
      {phase === "name" && !found && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 18,
            padding: "0 28px 70px",
            background: "rgba(252,234,221,0.72)",
            zIndex: 5,
          }}
        >
          <Bobo mood="happy" tint={tint} size={148} />
          <div
            style={{
              fontFamily: "var(--font-nunito), system-ui",
              fontSize: 20,
              lineHeight: 1.3,
              fontWeight: 900,
              color: "#5e3f2d",
              textAlign: "center",
            }}
          >
            Before we play hide-and-seek…
            <br />
            what should I call you?
          </div>
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
              maxWidth: 300,
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
          <div style={{ width: "100%", maxWidth: 300 }}>
            <BigCTA onClick={submitName} disabled={!nameInput.trim()}>
              That&apos;s me! →
            </BigCTA>
          </div>
        </div>
      )}

      {/* ── Found: Bugsy springs to centre + speech bubble + CTA ── */}
      {found && (
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
            <Bobo mood="excited" tint={tint} size={156} />
          </div>
          <RoomBubble tail="up" text={introLine} onDone={() => setBubbleDone(true)} />
        </div>
      )}

      {found && (
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
          <BigCTA onClick={onNext}>{ctaLabel}</BigCTA>
        </div>
      )}
    </div>
  );
}

// ── Shared full-bleed football park ───────────────────────────
// Backdrop for the playground (kick-the-ball) screen and the
// "how long do you want to practice" daily-goal screen.
export function ParkBackdrop() {
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

      {/* ── Soccer goal (centre) ── */}
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

// ── SCREEN 4 — Pet interaction ────────────────────────────────
type Heart = { id: number; x: number };

export function ChildPetMeet({
  tint,
  childName,
  childAge,
  setChildAge,
  onNext,
  onBack,
  gameNext = false,
}: Common & {
  childAge: number | null;
  setChildAge: (n: number) => void;
  /** When true, finish with "wanna play one more game?" → onNext (which
   *  the parent routes to Bird Spike). Off for the handover path. */
  gameNext?: boolean;
}) {
  const friend = childName.trim() || "friend";
  // Only ask for the age if we don't already know it (e.g. the parent
  // gave it during their onboarding → handover path skips the question).
  const [askAge] = useState(childAge === null);
  const [pets, setPets] = useState(0);
  const [hearts, setHearts] = useState<Heart[]>([]);
  const [wiggleKey, setWiggleKey] = useState(0);
  const [wagging, setWagging] = useState(false);
  const [phase, setPhase] = useState<"cuddle" | "age" | "invite">("cuddle");
  const [ageReady, setAgeReady] = useState(false);
  const [inviteReady, setInviteReady] = useState(false);
  const { purr } = useCatSounds();
  const enough = pets >= 3;
  // After two cuddles he's so happy his tail keeps swishing and he
  // does little zoomies left and right across the rug.
  const happy = pets >= 2;
  const ages = Array.from({ length: AGE_MAX - AGE_MIN + 1 }, (_, i) => AGE_MIN + i);

  // Bond grows with each cuddle: happy → smitten → in love.
  const cuddleMood: Mood = enough ? "cheer" : pets >= 1 ? "excited" : "happy";

  const pet = () => {
    if (phase !== "cuddle") return;
    purr();
    setWiggleKey((k) => k + 1);
    setWagging(true);
    window.setTimeout(() => setWagging(false), 900);
    setPets((p) => p + 1);
    const id = Date.now() + Math.random();
    const x = (Math.random() - 0.5) * 80;
    setHearts((h) => [...h, { id, x }]);
    window.setTimeout(() => setHearts((h) => h.filter((he) => he.id !== id)), 1000);
  };

  const heading =
    phase === "age" || phase === "invite"
      ? ""
      : enough
      ? "He loves you already! 💕"
      : pets > 0
      ? "Aww… he's purring 💓"
      : "Tap Bugsy to give him a cuddle";

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: "#f6d2bd" }}>
      {/* Back home in Bugsy's room (chairs cleared so Bugsy has the floor) */}
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
          background: "linear-gradient(180deg, rgba(252,234,221,0.98) 0%, rgba(252,234,221,0.98) 55%, rgba(252,234,221,0))",
          zIndex: 4,
        }}
      >
        <div
          style={{
            minHeight: 28,
            fontFamily: "var(--font-nunito), system-ui",
            fontSize: 24,
            fontWeight: 900,
            letterSpacing: "-0.3px",
            color: "#5e3f2d",
            textShadow: "0 1px 0 rgba(255,255,255,0.6)",
          }}
        >
          {heading}
        </div>
      </div>

      {phase === "cuddle" && (
        <>
          {/* ── Pettable Bugsy on the rug ── */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 150,
              display: "flex",
              justifyContent: "center",
              zIndex: 3,
            }}
          >
            <div
              onPointerDown={pet}
              role="button"
              aria-label="Pet Bugsy"
              style={{
                position: "relative",
                cursor: "pointer",
                touchAction: "manipulation",
                filter: "drop-shadow(0 12px 12px rgba(90,60,40,0.22))",
              }}
            >
              {/* Outer wrapper does the left-right happy zoomies once
                  Bugsy is in love. Inner wrapper still does the wiggle
                  on each tap — the two animations compose cleanly. */}
              <div
                style={{
                  animation: happy ? "bugsy-happy-run 1.7s ease-in-out infinite" : undefined,
                  transformOrigin: "bottom center",
                }}
              >
                <div
                  key={wiggleKey}
                  style={{
                    animation: wiggleKey > 0 ? "bugsy-wiggle 0.6s ease-in-out" : undefined,
                    transformOrigin: "bottom center",
                  }}
                >
                  <Bobo
                    mood={cuddleMood}
                    tint={tint}
                    size={184}
                    tailWag={wagging || happy}
                  />
                </div>
              </div>
              {hearts.map((h) => (
                <span
                  key={h.id}
                  aria-hidden
                  style={{
                    position: "absolute",
                    top: 20,
                    left: `calc(50% + ${h.x}px)`,
                    fontSize: 24,
                    animation: "pet-heart 1s ease-out forwards",
                    pointerEvents: "none",
                  }}
                >
                  💗
                </span>
              ))}
            </div>
          </div>

          {/* CTA → ask the age (if unknown) → invite to the next game */}
          <div style={{ position: "absolute", left: 20, right: 20, bottom: 28, zIndex: 6 }}>
            <BigCTA
              onClick={() =>
                askAge ? setPhase("age") : gameNext ? setPhase("invite") : onNext()
              }
              disabled={!enough}
            >
              {enough ? "Continue 💕" : `Cuddle me ${3 - pets} more`}
            </BigCTA>
          </div>
        </>
      )}

      {phase === "age" && (
        <>
          {/* ── Age question — Bugsy asks, child taps their age ── */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
              padding: "120px 24px 104px",
              zIndex: 3,
            }}
          >
            <div style={{ filter: "drop-shadow(0 10px 10px rgba(90,60,40,0.2))" }}>
              <Bobo mood="cheer" tint={tint} size={130} tailWag />
            </div>
            <RoomBubble
              tail="up"
              text={`I love you already, ${friend}! …How old are you?`}
              onDone={() => setAgeReady(true)}
            />
            <div
              style={{
                width: "100%",
                maxWidth: 300,
                opacity: ageReady ? 1 : 0,
                transform: ageReady ? "translateY(0)" : "translateY(8px)",
                transition: "opacity 0.4s ease, transform 0.4s ease",
                pointerEvents: ageReady ? "auto" : "none",
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
          </div>

          {/* CTA → next stop is the play-another-game invite (or onNext) */}
          <div style={{ position: "absolute", left: 20, right: 20, bottom: 28, zIndex: 6 }}>
            <BigCTA
              onClick={() => (gameNext ? setPhase("invite") : onNext())}
              disabled={childAge === null}
            >
              Continue →
            </BigCTA>
          </div>
        </>
      )}

      {phase === "invite" && (
        <>
          {/* ── "Play one more game with me?" — Bugsy bouncing happy ── */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 14,
              padding: "120px 24px 104px",
              zIndex: 3,
            }}
          >
            <div
              style={{
                filter: "drop-shadow(0 12px 12px rgba(90,60,40,0.22))",
                animation: "bugsy-happy-run 1.7s ease-in-out infinite",
                transformOrigin: "bottom center",
              }}
            >
              <Bobo mood="cheer" tint={tint} size={156} tailWag />
            </div>
            <RoomBubble
              tail="up"
              text={`Wanna play one more game with me, ${friend}? 🐦`}
              onDone={() => setInviteReady(true)}
            />
          </div>
          <div
            style={{
              position: "absolute",
              left: 20,
              right: 20,
              bottom: 28,
              opacity: inviteReady ? 1 : 0,
              transform: inviteReady ? "translateY(0)" : "translateY(10px)",
              transition: "opacity 0.4s ease, transform 0.4s ease",
              pointerEvents: inviteReady ? "auto" : "none",
              zIndex: 6,
            }}
          >
            <BigCTA onClick={onNext}>Let&apos;s play! 🐦</BigCTA>
          </div>
        </>
      )}
    </div>
  );
}

// ── SCREEN — Promise to come back tomorrow ────────────────────
// The emotional close: same room as the first meeting, but dusk has
// fallen — "it's getting late, come back tomorrow?"
export function ChildPromise({ tint, childName, onNext, onBack }: Common) {
  const friend = childName.trim() || "friend";
  const [done, setDone] = useState(false);

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

      {/* Bugsy + the promise, centred in the dusky room */}
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
        <div style={{ filter: "drop-shadow(0 12px 14px rgba(50,35,70,0.3))" }}>
          <Bobo mood="worried" tint={tint} size={172} />
        </div>
        <RoomBubble
          tail="up"
          text={`It's getting late, ${friend}… Promise me one thing? Come back tomorrow?`}
          onDone={() => setDone(true)}
        />
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
        <BigCTA onClick={onNext}>I promise 🤞</BigCTA>
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
