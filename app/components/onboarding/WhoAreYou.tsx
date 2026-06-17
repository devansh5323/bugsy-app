"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Bobo } from "../Mascot";
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



// ── Magical nighttime children's room backdrop ───────────────────
export function NightRoomBackdrop() {
  const star5 = (cx: number, cy: number, r: number, fill: string, op: number, key: string) => {
    const ri = r * 0.42;
    let pts = "";
    for (let i = 0; i < 5; i++) {
      const oa = ((i * 72 - 90) * Math.PI) / 180;
      const ia = ((i * 72 - 54) * Math.PI) / 180;
      pts += `${cx + r * Math.cos(oa)},${cy + r * Math.sin(oa)} ${cx + ri * Math.cos(ia)},${cy + ri * Math.sin(ia)} `;
    }
    return <polygon key={key} points={pts.trim()} fill={fill} opacity={op} filter="url(#nr-stk-glow)" />;
  };

  return (
    <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
      <svg width="100%" height="100%" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice"
        style={{ position: "absolute", inset: 0, display: "block" }}>
        <defs>
          {/* Backgrounds */}
          <linearGradient id="nr-bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#16103a" />
            <stop offset="52%"  stopColor="#231648" />
            <stop offset="100%" stopColor="#341e58" />
          </linearGradient>
          <linearGradient id="nr-floor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#2a1c42" />
            <stop offset="100%" stopColor="#1a1230" />
          </linearGradient>
          {/* Window sky */}
          <linearGradient id="nr-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#040115" />
            <stop offset="100%" stopColor="#0a0526" />
          </linearGradient>
          {/* Lamp cone */}
          <radialGradient id="nr-lamp-cone" cx="50%" cy="0%" r="100%" fx="50%" fy="0%">
            <stop offset="0%"   stopColor="#FFE580" stopOpacity="0.38" />
            <stop offset="55%"  stopColor="#FFD060" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#FFD060" stopOpacity="0" />
          </radialGradient>
          {/* Moon */}
          <radialGradient id="nr-moon" cx="38%" cy="38%" r="65%">
            <stop offset="0%"   stopColor="#FFFAE0" />
            <stop offset="100%" stopColor="#EDD850" />
          </radialGradient>
          {/* Rug rings */}
          <radialGradient id="nr-rug" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#C89EF0" />
            <stop offset="100%" stopColor="#6840A0" />
          </radialGradient>
          {/* Filters */}
          <filter id="nr-warm-blur" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="22" />
          </filter>
          <filter id="nr-glow-md" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="7" />
          </filter>
          <filter id="nr-stk-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="2.8" />
          </filter>
          <filter id="nr-ff-warm">
            <feDropShadow dx="0" dy="0" stdDeviation="3.2" floodColor="#FFE060" floodOpacity="0.85" />
          </filter>
          <filter id="nr-ff-cool">
            <feDropShadow dx="0" dy="0" stdDeviation="3.2" floodColor="#90C0FF" floodOpacity="0.75" />
          </filter>
          <filter id="nr-lamp-blur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
        </defs>

        {/* ── Background + floor ── */}
        <rect x="0" y="0" width="400" height="800" fill="url(#nr-bg)" />
        <rect x="0" y="738" width="400" height="62" fill="url(#nr-floor)" />
        <line x1="0" y1="738" x2="400" y2="738" stroke="#5a3090" strokeWidth="1" opacity="0.18" />
        {/* Warm ambient from lamp */}
        <ellipse cx="200" cy="200" rx="240" ry="310"
          fill="rgba(255,210,60,0.05)" filter="url(#nr-warm-blur)" />

        {/* ══ WINDOW — top-right ══ */}
        <rect x="284" y="30" width="112" height="138" rx="14"
          fill="rgba(0,0,0,0.50)" transform="translate(3,3)" />
        <rect x="281" y="27" width="112" height="138" rx="14" fill="#3a2468" />
        <rect x="285" y="31" width="104" height="130" rx="11" fill="url(#nr-sky)" />
        {/* Cross bars */}
        <line x1="337" y1="31" x2="337" y2="161" stroke="#3a2468" strokeWidth="4.5" />
        <line x1="285" y1="96" x2="389" y2="96"  stroke="#3a2468" strokeWidth="4.5" />
        {/* Frame border */}
        <rect x="281" y="27" width="112" height="138" rx="14"
          fill="none" stroke="#5840A0" strokeWidth="4" />
        {/* Sill */}
        <rect x="275" y="161" width="124" height="13" rx="6" fill="#4a3280" />
        {/* Moon glow halo */}
        <circle cx="347" cy="114" r="32" fill="rgba(255,240,140,0.14)" filter="url(#nr-glow-md)" />
        {/* Crescent moon */}
        <circle cx="345" cy="116" r="22" fill="url(#nr-moon)" />
        <circle cx="358" cy="110" r="19" fill="url(#nr-sky)" />
        {/* Curtains */}
        <path d="M281 27 Q268 96 281 165 L296 165 Q281 96 296 27 Z" fill="#7048B8" opacity="0.52" />
        <path d="M393 27 Q406 96 393 165 L378 165 Q393 96 378 27 Z" fill="#7048B8" opacity="0.52" />
        {/* Stars outside window */}
        {[{x:296,y:50,r:1.2,d:6.8,dl:0.4},{x:352,y:44,r:0.9,d:8.2,dl:1.3},
          {x:378,y:62,r:1.1,d:7.0,dl:0.9},{x:316,y:74,r:0.8,d:9.0,dl:2.2},
          {x:372,y:80,r:0.7,d:6.2,dl:3.1},{x:298,y:128,r:1.0,d:7.6,dl:1.7}].map((s,i)=>(
          <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="white" opacity="0.90"
            style={{ animation:`firefly ${s.d}s ease-in-out ${s.dl}s infinite` }} />
        ))}

        {/* ══ HANGING LAMP — top-center ══ */}
        <line x1="200" y1="0" x2="200" y2="52"
          stroke="#A090C0" strokeWidth="2.2" strokeLinecap="round" opacity="0.62" />
        <ellipse cx="200" cy="53" rx="19" ry="7.5" fill="#D4A830" />
        <path d="M181 53 Q173 75 169 98 Q183 109 200 110 Q217 109 231 98 Q227 75 219 53 Z"
          fill="#F5CA50" />
        <ellipse cx="200" cy="102" rx="31" ry="9.5" fill="#D4A830" />
        {/* Bulb glow */}
        <ellipse cx="200" cy="102" rx="13" ry="6.5" fill="#FFFCB0" opacity="0.95"
          style={{ transformBox:"fill-box", transformOrigin:"center",
            animation:"breath-glow 3.5s ease-in-out infinite" }} />
        {/* Lamp shine */}
        <path d="M186 60 Q195 57 200 60 Q195 72 186 71 Z"
          fill="rgba(255,255,200,0.34)" />
        {/* Light cone */}
        <path d="M168 102 Q104 296 64 438 L336 438 Q364 296 232 102 Z"
          fill="url(#nr-lamp-cone)" />
        <circle cx="200" cy="76" r="58"
          fill="rgba(255,215,60,0.09)" filter="url(#nr-lamp-blur)" />

        {/* ══ CAT POSTER — upper-left ══ */}
        <rect x="18" y="106" width="76" height="92" rx="9"
          fill="rgba(0,0,0,0.45)" transform="translate(4,4)" />
        <rect x="18" y="106" width="76" height="92" rx="9" fill="#4A3898" />
        <rect x="22" y="110" width="68" height="84" rx="7" fill="#6A58B8" />
        <rect x="25" y="113" width="62" height="78" rx="6" fill="#F5EAD8" />
        {/* Cat face */}
        <circle cx="56" cy="145" r="23" fill="#F0C898" />
        <polygon points="37,131 42,114 52,128" fill="#F0C898" />
        <polygon points="60,128 70,114 75,131" fill="#F0C898" />
        <polygon points="39,130 43,117 50,128" fill="#FFB6C1" />
        <polygon points="62,128 69,117 73,130" fill="#FFB6C1" />
        <ellipse cx="48" cy="141" rx="4.2" ry="4.8" fill="#2a1a40" />
        <ellipse cx="64" cy="141" rx="4.2" ry="4.8" fill="#2a1a40" />
        <circle cx="49.5" cy="139" r="1.6" fill="white" />
        <circle cx="65.5" cy="139" r="1.6" fill="white" />
        <path d="M53 148 L56 151 L59 148 L56 146 Z" fill="#FF9999" />
        <path d="M53 151 Q56 155 59 151" stroke="#D08080" strokeWidth="1.2"
          fill="none" strokeLinecap="round" />
        <line x1="33" y1="147" x2="50" y2="148" stroke="#B09070" strokeWidth="0.9" opacity="0.56" />
        <line x1="33" y1="150" x2="50" y2="150" stroke="#B09070" strokeWidth="0.9" opacity="0.56" />
        <line x1="62" y1="148" x2="79" y2="147" stroke="#B09070" strokeWidth="0.9" opacity="0.56" />
        <line x1="62" y1="150" x2="79" y2="150" stroke="#B09070" strokeWidth="0.9" opacity="0.56" />
        <circle cx="41" cy="146" r="5.5" fill="#FFB6C1" opacity="0.32" />
        <circle cx="71" cy="146" r="5.5" fill="#FFB6C1" opacity="0.32" />

        {/* ══ WALL STAR STICKERS ══ */}
        {star5(12,  258, 8,  "#FFE060", 0.54, "ws1")}
        {star5( 8,  348, 6,  "#C0A0FF", 0.44, "ws2")}
        {star5(14,  464, 7,  "#80D8FF", 0.38, "ws3")}
        {star5(386, 222, 8,  "#FFE060", 0.54, "ws4")}
        {star5(388, 354, 6,  "#FF90C0", 0.44, "ws5")}
        {star5(390, 490, 7,  "#90FF90", 0.38, "ws6")}
        {star5( 46,  44, 5,  "#FFE4A0", 0.32, "ws7")}
        {star5(162,  28, 4,  "#B6D4FF", 0.28, "ws8")}
        {star5(240,  24, 5,  "#FFB6C1", 0.30, "ws9")}

        {/* ══ BOOKSHELF — left edge ══ */}
        <rect x="0" y="548" width="88" height="152" rx="6" fill="#1e1240" opacity="0.90" />
        <rect x="0" y="597" width="88" height="8" rx="2" fill="#3e2870" />
        <rect x="0" y="652" width="88" height="8" rx="2" fill="#3e2870" />
        {/* Top shelf books */}
        {[{x:3,y:556,w:15,h:41,c:"#FF7E7E"},{x:20,y:558,w:13,h:39,c:"#7EC8FF"},
          {x:35,y:553,w:17,h:44,c:"#FFD080"},{x:54,y:556,w:14,h:41,c:"#80FFA0"},
          {x:70,y:554,w:16,h:43,c:"#D080FF"}].map((b,i)=>(
          <rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} rx="2.5" fill={b.c} />
        ))}
        {/* Bottom shelf books */}
        {[{x:3,y:609,w:13,h:43,c:"#FF90C0"},{x:18,y:606,w:16,h:46,c:"#60D8F0"},
          {x:36,y:610,w:14,h:42,c:"#FFA060"},{x:52,y:607,w:15,h:45,c:"#90E080"},
          {x:69,y:609,w:17,h:43,c:"#C8A0FF"}].map((b,i)=>(
          <rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} rx="2.5" fill={b.c} />
        ))}
        {/* Shelf decoration */}
        <circle cx="44" cy="548" r="7.5" fill="#FFD080" opacity="0.74" />
        <circle cx="44" cy="543" r="5.5" fill="#FFC040" opacity="0.88" />

        {/* ══ BEAN BAG — right edge ══ */}
        <ellipse cx="394" cy="604" rx="40" ry="52" fill="#9880D4" opacity="0.68" />
        <ellipse cx="392" cy="591" rx="31" ry="38" fill="#B4A0E8" opacity="0.58" />
        <ellipse cx="388" cy="581" rx="15" ry="11" fill="rgba(255,255,255,0.16)" />

        {/* ══ INDOOR PLANT — right corner ══ */}
        <path d="M352 732 Q348 707 358 702 L380 702 Q390 707 386 732 Z" fill="#C4956A" />
        <rect x="350" y="726" width="42" height="9" rx="4.5" fill="#D4A878" />
        <ellipse cx="371" cy="702" rx="12.5" ry="4.5" fill="#5C3218" />
        <path d="M371 701 Q393 667 402 679 Q395 696 371 701 Z" fill="#5CB85C" opacity="0.92" />
        <path d="M371 697 Q348 661 338 676 Q345 693 371 697 Z" fill="#4CAF50" opacity="0.92" />
        <path d="M372 687 Q386 654 373 644 Q363 667 372 687 Z" fill="#66BB6A" opacity="0.86" />
        <path d="M368 690 Q350 660 356 646 Q366 670 368 690 Z" fill="#A5D6A7" opacity="0.68" />

        {/* ══ TOY BLOCKS — left floor ══ */}
        <rect x="58"  y="672" width="30" height="30" rx="6" fill="#FFD080" />
        <path d="M58 672 L66 662 L88 662 L88 672 Z" fill="#FFE4A0" />
        <text x="73" y="692" textAnchor="middle" fill="white" fontSize="13"
          fontWeight="800" fontFamily="sans-serif" opacity="0.88">C</text>
        <rect x="48"  y="700" width="42" height="42" rx="7" fill="#FF8A65" />
        <path d="M48 700 L62 689 L90 689 L90 700 Z" fill="#FFA082" />
        <text x="69" y="727" textAnchor="middle" fill="white" fontSize="17"
          fontWeight="800" fontFamily="sans-serif" opacity="0.88">A</text>
        <rect x="24"  y="718" width="34" height="34" rx="6" fill="#7EC8FF" />
        <path d="M24 718 L34 707 L58 707 L58 718 Z" fill="#A0DAFF" />
        <text x="41" y="740" textAnchor="middle" fill="white" fontSize="14"
          fontWeight="800" fontFamily="sans-serif" opacity="0.88">B</text>

        {/* ══ ROUND RUG — center floor ══ */}
        <ellipse cx="200" cy="756" rx="148" ry="36" fill="#6840A0" opacity="0.46" />
        <ellipse cx="200" cy="754" rx="118" ry="29" fill="#8A60C8" opacity="0.42" />
        <ellipse cx="200" cy="752" rx="88"  ry="22" fill="#B080E0" opacity="0.38" />
        <ellipse cx="200" cy="750" rx="58"  ry="15" fill="#C89EF0" opacity="0.34" />
        <ellipse cx="200" cy="749" rx="32"  ry="9"  fill="#D8B8FF" opacity="0.28" />
        <ellipse cx="200" cy="748" rx="13"  ry="5"  fill="#ECD0FF" opacity="0.24" />

        {/* ══ FLOATING STAR PARTICLES ══ */}
        {[
          {x: 76,y:148,r:3.8,f:"#FFE27A",fi:"nr-ff-warm",d:7.0,dl:0.0},
          {x:134,y:220,r:3.2,f:"#FFE27A",fi:"nr-ff-warm",d:8.2,dl:1.4},
          {x:190,y:108,r:2.8,f:"#C0E4FF",fi:"nr-ff-cool",d:6.8,dl:2.6},
          {x:248,y:172,r:4.2,f:"#FFE27A",fi:"nr-ff-warm",d:9.0,dl:0.8},
          {x:308,y:132,r:3.4,f:"#E0C0FF",fi:"nr-ff-cool",d:7.8,dl:3.2},
          {x:106,y:332,r:2.8,f:"#FFE27A",fi:"nr-ff-warm",d:8.4,dl:2.0},
          {x:282,y:308,r:3.2,f:"#C0FFE0",fi:"nr-ff-cool",d:7.2,dl:1.1},
          {x:206,y:268,r:2.4,f:"#FFE27A",fi:"nr-ff-warm",d:9.2,dl:3.6},
          {x: 48,y:420,r:3.2,f:"#FFD0A0",fi:"nr-ff-warm",d:8.8,dl:0.5},
          {x:352,y:396,r:2.4,f:"#C0E0FF",fi:"nr-ff-cool",d:7.5,dl:2.9},
          {x:166,y:396,r:2.8,f:"#FFE27A",fi:"nr-ff-warm",d:9.6,dl:4.0},
          {x:242,y:444,r:3.2,f:"#FFB0D0",fi:"nr-ff-cool",d:6.9,dl:1.8},
          {x:354,y:190,r:2.8,f:"#FFE27A",fi:"nr-ff-warm",d:7.4,dl:0.9},
          {x: 30,y:284,r:2.4,f:"#C0FFFF",fi:"nr-ff-cool",d:8.2,dl:1.7},
          {x:368,y:264,r:2.4,f:"#FFE060",fi:"nr-ff-warm",d:6.8,dl:3.5},
          {x:118,y:494,r:2.8,f:"#FFE27A",fi:"nr-ff-warm",d:7.6,dl:2.3},
          {x:298,y:504,r:2.4,f:"#D0C0FF",fi:"nr-ff-cool",d:8.6,dl:0.7},
        ].map((p,i)=>(
          <circle key={i} cx={p.x} cy={p.y} r={p.r} fill={p.f}
            filter={`url(#${p.fi})`}
            style={{ animation:`firefly ${p.d}s ease-in-out ${p.dl}s infinite` }} />
        ))}
      </svg>
    </div>
  );
}

// ── Game-style role selection card ──────────────────────────────
function RoleCard({
  label,
  color,
  shadowColor,
  icon,
  onClick,
}: {
  label: string;
  color: string;
  shadowColor: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  const [pressed, setPressed] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false); }}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => { setPressed(false); setHovered(false); }}
      style={{
        width: "100%",
        height: 74,
        border: "none",
        borderRadius: 20,
        background: color,
        boxShadow: pressed
          ? `0 2px 0 ${shadowColor}`
          : `0 5px 0 ${shadowColor}, 0 8px 20px rgba(0,0,0,0.18)`,
        transform: pressed
          ? "translateY(3px) scale(0.98)"
          : hovered
          ? "translateY(-2px) scale(1.015)"
          : "translateY(0) scale(1)",
        transition: "transform 0.13s ease, box-shadow 0.13s ease",
        display: "flex",
        alignItems: "center",
        padding: "0 20px",
        gap: 16,
        cursor: "pointer",
        outline: "none",
      }}
    >
      {/* Icon circle */}
      <div style={{
        width: 52,
        height: 52,
        borderRadius: "50%",
        background: "rgba(255,255,255,0.22)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}>
        {icon}
      </div>

      {/* Label */}
      <span style={{
        flex: 1,
        textAlign: "center",
        fontFamily: "var(--font-nunito), system-ui",
        fontSize: 21,
        fontWeight: 900,
        letterSpacing: "0.05em",
        color: "white",
      }}>
        {label}
      </span>

      {/* Chevron */}
      <div style={{
        width: 32,
        height: 32,
        borderRadius: "50%",
        background: "rgba(255,255,255,0.20)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}>
        <svg width="14" height="14" viewBox="0 0 14 14">
          <path d="M5 3l4 4-4 4" stroke="white" strokeWidth="2.4" fill="none"
            strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </button>
  );
}

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
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "56px 24px 32px",
        boxSizing: "border-box",
        color: "#fff",
      }}
    >
      <NightRoomBackdrop />

      <div style={{ position: "relative", zIndex: 1, flex: 1 }} />

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
          position: "relative",
          zIndex: 1,
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
          zIndex: 1,
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

      <div style={{ flex: 1, position: "relative", zIndex: 1 }} />

      {/* CTAs — only after the greeting finishes typing. */}
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          opacity: showCTA ? 1 : 0,
          transform: showCTA ? "translateY(0)" : "translateY(16px)",
          transition: "opacity 0.5s ease, transform 0.5s ease",
          pointerEvents: showCTA ? "auto" : "none",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* "Who are you?" plain text heading */}
        <p style={{
          textAlign: "center",
          margin: "0 0 8px",
          fontFamily: "var(--font-nunito), system-ui",
          fontSize: 20,
          fontWeight: 900,
          color: "white",
          letterSpacing: "0.02em",
          textShadow: "0 2px 8px rgba(0,0,0,0.35)",
        }}>
          ✨ Who are you? ✨
        </p>

        <RoleCard
          label="PARENT"
          color="#F0366E"
          shadowColor="#A81E4A"
          icon={
            <svg viewBox="0 0 28 28" width="30" height="30" fill="none">
              {/* Two adults + child silhouette */}
              <circle cx="9"  cy="8"  r="4.5" fill="white" />
              <path d="M2 22 Q2 16 9 16 Q16 16 16 22" fill="white" />
              <circle cx="21" cy="9"  r="3.8" fill="rgba(255,255,255,0.75)" />
              <path d="M15 22 Q15 17 21 17 Q27 17 27 22" fill="rgba(255,255,255,0.75)" />
              <circle cx="13" cy="20" r="2.4" fill="rgba(255,255,255,0.55)" />
            </svg>
          }
          onClick={() => pick("parent")}
        />

        <RoleCard
          label="CHILD"
          color="#F5A800"
          shadowColor="#B07600"
          icon={
            <svg viewBox="0 0 28 28" width="30" height="30" fill="none">
              {/* Star */}
              <polygon
                points="14,3 16.5,10 24,10 18,14.5 20.5,22 14,17.5 7.5,22 10,14.5 4,10 11.5,10"
                fill="white"
              />
            </svg>
          }
          onClick={() => pick("child")}
        />

        <RoleCard
          label="YOUNG ADULT"
          color="#7C3AED"
          shadowColor="#4C1A9A"
          icon={
            <svg viewBox="0 0 28 28" width="30" height="30" fill="none">
              {/* Lightning bolt */}
              <polygon points="17,3 10,15 15,15 11,25 21,12 16,12" fill="white" />
            </svg>
          }
          onClick={() => {}}
        />
      </div>
    </div>
  );
}
