+"use client";

import { useId, useState, useEffect, useRef, useCallback } from "react";
import { Bobo } from "../Mascot";
import { NightRoomBackdrop } from "./WhoAreYou";
import { Typewriter } from "../Typewriter";

// ── Subject-themed clay icons ────────────────────────────────────
type ClaySubject = "book" | "pencil" | "math" | "flask" | "music" | "globe";

function Clay({ shape, size }: { shape: ClaySubject; size: number }) {
  const rawId = useId().replace(/:/g, "_");
  const id = `clay-${shape}-${rawId}`;
  const ds = "drop-shadow(0 5px 9px rgba(20, 16, 30, 0.18))";
  const svgProps = {
    width: size,
    height: size,
    viewBox: "0 0 100 100",
    style: { filter: ds, overflow: "visible" as const },
  };

  if (shape === "book") {
    return (
      <svg {...svgProps}>
        <defs>
          <radialGradient id={id} cx="0.32" cy="0.26" r="0.85">
            <stop offset="0%" stopColor="#FFC4D4" />
            <stop offset="55%" stopColor="#FF7AA0" />
            <stop offset="100%" stopColor="#C73062" />
          </radialGradient>
        </defs>
        <rect x="14" y="18" width="72" height="64" rx="9" fill={`url(#${id})`} />
        <rect x="14" y="18" width="11" height="64" rx="3" fill="rgba(0,0,0,0.22)" />
        <rect x="36" y="42" width="38" height="6" rx="2" fill="rgba(255,255,255,0.85)" />
        <rect x="36" y="54" width="28" height="4" rx="1.5" fill="rgba(255,255,255,0.55)" />
        <ellipse cx="38" cy="28" rx="15" ry="5" fill="rgba(255,255,255,0.5)" />
      </svg>
    );
  }

  if (shape === "pencil") {
    return (
      <svg {...svgProps}>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFE89A" />
            <stop offset="50%" stopColor="#FFC835" />
            <stop offset="100%" stopColor="#D49500" />
          </linearGradient>
        </defs>
        <g transform="rotate(-32 50 50)">
          <path d="M10 50 L18 46 L18 54 Z" fill="#2A2A2A" />
          <path d="M18 44 L28 44 L28 56 L18 56 Z M18 44 L10 50 L18 56 Z" fill="#E8B873" />
          <rect x="28" y="42" width="42" height="16" fill={`url(#${id})`} />
          <rect x="28" y="44" width="42" height="2.5" fill="rgba(255,255,255,0.55)" />
          <rect x="70" y="42" width="6" height="16" fill="#BDBDBD" />
          <rect x="71" y="44" width="4" height="2" fill="#F5F5F5" />
          <rect x="71" y="49" width="4" height="1" fill="rgba(0,0,0,0.2)" />
          <path d="M76 42 L84 42 Q90 42 90 47 L90 53 Q90 58 84 58 L76 58 Z" fill="#FF9AB3" />
          <ellipse cx="80" cy="46" rx="3" ry="1.5" fill="rgba(255,255,255,0.5)" />
        </g>
      </svg>
    );
  }

  if (shape === "math") {
    return (
      <svg {...svgProps}>
        <defs>
          <radialGradient id={id} cx="0.3" cy="0.26" r="0.85">
            <stop offset="0%" stopColor="#DDD0FF" />
            <stop offset="55%" stopColor="#B79EFC" />
            <stop offset="100%" stopColor="#7E5BE0" />
          </radialGradient>
        </defs>
        <rect x="12" y="12" width="76" height="76" rx="14" fill={`url(#${id})`} />
        <rect x="32" y="46" width="36" height="8" rx="4" fill="rgba(255,255,255,0.95)" />
        <rect x="46" y="32" width="8" height="36" rx="4" fill="rgba(255,255,255,0.95)" />
        <ellipse cx="34" cy="22" rx="14" ry="5" fill="rgba(255,255,255,0.4)" />
      </svg>
    );
  }

  if (shape === "flask") {
    return (
      <svg {...svgProps}>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="0.6">
            <stop offset="0%" stopColor="#F8FFFB" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#D7E8E0" stopOpacity="0.75" />
          </linearGradient>
          <linearGradient id={`${id}-liquid`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5EE8A4" />
            <stop offset="100%" stopColor="#2EB377" />
          </linearGradient>
        </defs>
        <rect x="38" y="8" width="24" height="6" rx="2" fill="#9E9E9E" />
        <path d="M42 14 L58 14 L58 32 L42 32 Z" fill={`url(#${id})`} stroke="#A0A0A0" strokeWidth="1.2" />
        <path d="M40 32 L60 32 L84 80 Q84 90 76 90 L24 90 Q16 90 16 80 Z" fill={`url(#${id})`} stroke="#A0A0A0" strokeWidth="1.2" />
        <path d="M28 66 L72 66 L80 82 Q80 86 76 86 L24 86 Q20 86 20 82 Z" fill={`url(#${id}-liquid)`} />
        <path d="M28 66 Q50 62 72 66" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1.5" />
        <circle cx="38" cy="76" r="2" fill="rgba(255,255,255,0.6)" />
        <circle cx="58" cy="80" r="1.6" fill="rgba(255,255,255,0.55)" />
        <circle cx="50" cy="74" r="1.2" fill="rgba(255,255,255,0.5)" />
        <path d="M28 38 L34 38 L42 80 L36 80 Z" fill="rgba(255,255,255,0.45)" />
      </svg>
    );
  }

  if (shape === "music") {
    return (
      <svg {...svgProps}>
        <defs>
          <radialGradient id={id} cx="0.32" cy="0.28" r="0.85">
            <stop offset="0%" stopColor="#E5C0FF" />
            <stop offset="55%" stopColor="#CE82FF" />
            <stop offset="100%" stopColor="#9F4FE0" />
          </radialGradient>
        </defs>
        <path d="M60 18 Q86 24 80 50 Q78 36 60 38 Z" fill={`url(#${id})`} />
        <rect x="56" y="22" width="7" height="54" fill={`url(#${id})`} />
        <ellipse cx="40" cy="74" rx="20" ry="13" fill={`url(#${id})`} transform="rotate(-22 40 74)" />
        <ellipse cx="34" cy="68" rx="8" ry="3" fill="rgba(255,255,255,0.55)" transform="rotate(-22 34 68)" />
        <path d="M64 24 Q74 26 76 36" stroke="rgba(255,255,255,0.45)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg {...svgProps}>
      <defs>
        <radialGradient id={id} cx="0.3" cy="0.28" r="0.85">
          <stop offset="0%" stopColor="#FFD8B8" />
          <stop offset="55%" stopColor="#FFA875" />
          <stop offset="100%" stopColor="#D67838" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="42" fill={`url(#${id})`} />
      <path d="M30 38 Q40 32 50 38 Q50 46 42 50 Q34 48 30 38 Z" fill="rgba(46, 179, 119, 0.78)" />
      <path d="M56 38 Q66 36 70 44 Q66 52 60 50 Q54 46 56 38 Z" fill="rgba(46, 179, 119, 0.78)" />
      <path d="M44 64 Q56 60 62 68 Q58 76 50 75 Q42 70 44 64 Z" fill="rgba(46, 179, 119, 0.78)" />
      <ellipse cx="50" cy="50" rx="42" ry="14" fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth="1.4" />
      <ellipse cx="50" cy="50" rx="14" ry="42" fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth="1.4" />
      <ellipse cx="36" cy="32" rx="11" ry="6" fill="rgba(255,255,255,0.55)" />
    </svg>
  );
}

// ── Sparkle ──────────────────────────────────────────────────────
function Sparkle({ size, x, y, delay }: { size: number; x: number; y: number; delay: number }) {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        marginLeft: x,
        marginTop: y,
        animation: `sparkle 2.8s ease-in-out ${delay}s infinite`,
        pointerEvents: "none",
      }}
    >
      <svg width={size} height={size} viewBox="0 0 20 20">
        <path
          d="M10 1L11.8 8.2L19 10L11.8 11.8L10 19L8.2 11.8L1 10L8.2 8.2L10 1Z"
          fill="#FFD700"
          opacity="0.85"
        />
      </svg>
    </div>
  );
}

// ── Gradient text helper ─────────────────────────────────────────
const g = (gradient: string): React.CSSProperties => ({
  background: gradient,
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  display: "inline",
} as React.CSSProperties);

// ── Nature-inspired pastel backdrop (enhanced) ───────────────────
// Rich storybook scene: fluffy cloud top-left, smiling sun top-right,
// scattered stars/sparkles/bubbles/confetti mid-screen, lush layered
// leaf clusters at bottom corners, gentle rolling hills.
function WelcomeBackdrop() {
  // 4-pointed diamond star
  const star = (cx: number, cy: number, r: number, color: string, op: number) => {
    const q = r * 0.32;
    return (
      <path
        key={`s-${cx}-${cy}`}
        d={`M${cx},${cy - r} L${cx + q},${cy - q} L${cx + r},${cy} L${cx + q},${cy + q} L${cx},${cy + r} L${cx - q},${cy + q} L${cx - r},${cy} L${cx - q},${cy - q} Z`}
        fill={color}
        opacity={op}
      />
    );
  };

  // 8-line asterisk twinkle — pulses in/out via wb-twinkle animation
  const twinkle = (cx: number, cy: number, r: number, color: string, dur: number, delay: number) => (
    <g
      key={`t-${cx}-${cy}`}
      style={{ transformBox: "fill-box", transformOrigin: "center", animation: `wb-twinkle ${dur}s ease-in-out ${delay}s infinite` }}
    >
      <line x1={cx} y1={cy - r} x2={cx} y2={cy + r} stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <line x1={cx - r} y1={cy} x2={cx + r} y2={cy} stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <line x1={cx - r * 0.7} y1={cy - r * 0.7} x2={cx + r * 0.7} y2={cy + r * 0.7} stroke={color} strokeWidth="1.2" strokeLinecap="round" />
      <line x1={cx + r * 0.7} y1={cy - r * 0.7} x2={cx - r * 0.7} y2={cy + r * 0.7} stroke={color} strokeWidth="1.2" strokeLinecap="round" />
    </g>
  );

  // Hollow bubble circle — gently floats
  const bubble = (cx: number, cy: number, r: number, color: string, op: number, delay = 0) => (
    <circle
      key={`b-${cx}-${cy}`} cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="1.5" opacity={op}
      style={{ animation: `wb-float ${6 + delay}s ease-in-out ${delay * 0.7}s infinite` }}
    />
  );

  return (
    <div
      aria-hidden
      style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 400 800"
        preserveAspectRatio="xMidYMid slice"
        style={{ position: "absolute", inset: 0, display: "block" }}
      >
        <defs>
          <linearGradient id="wb-bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#FFF6D6" />
            <stop offset="42%"  stopColor="#F7F9F5" />
            <stop offset="100%" stopColor="#DDF7F7" />
          </linearGradient>
          <linearGradient id="wb-hill-a" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#D0EED8" />
            <stop offset="100%" stopColor="#BAE4C4" />
          </linearGradient>
          <linearGradient id="wb-hill-b" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#C4E8CC" />
            <stop offset="100%" stopColor="#AEDCBA" />
          </linearGradient>
          <linearGradient id="wb-hill-c" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#B8F0D4" />
            <stop offset="100%" stopColor="#9EDEC0" />
          </linearGradient>
          <radialGradient id="wb-sun-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#FFE566" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#FFE566" stopOpacity="0" />
          </radialGradient>
          <filter id="wb-glow">
            <feGaussianBlur stdDeviation="22" />
          </filter>
          <filter id="wb-cloud-shadow">
            <feGaussianBlur stdDeviation="4" />
          </filter>
          <filter id="wb-leaf">
            <feGaussianBlur stdDeviation="4" />
          </filter>
          <filter id="wb-leaf-front">
            <feGaussianBlur stdDeviation="1.5" />
          </filter>
        </defs>

        {/* ── Background fill ── */}
        <rect x="0" y="0" width="400" height="800" fill="url(#wb-bg)" />

        {/* Warm radial glow behind mascot center */}
        <ellipse cx="200" cy="310" rx="200" ry="190"
          fill="rgba(255,246,214,0.30)" filter="url(#wb-glow)" />

        {/* ══ SUN — top-right corner, smiling, ~20% smaller + floating ══ */}
        <g style={{ transformBox: "fill-box", transformOrigin: "356px 56px", animation: "wb-float 5s ease-in-out 0.3s infinite" }}>
          {/* Animated soft glow halo */}
          <circle cx="356" cy="56" r="52"
            fill="url(#wb-sun-glow)"
            style={{ transformBox: "fill-box", transformOrigin: "center", animation: "breath-glow 4s ease-in-out 0s infinite" }}
          />
          {/* Rays — alternating long/short */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => {
            const a = (deg * Math.PI) / 180;
            const r1 = 26, r2 = i % 2 === 0 ? 40 : 35;
            return (
              <line key={i}
                x1={356 + Math.cos(a) * r1} y1={56 + Math.sin(a) * r1}
                x2={356 + Math.cos(a) * r2} y2={56 + Math.sin(a) * r2}
                stroke="#FFCC22" strokeWidth={i % 2 === 0 ? "3.5" : "2"} strokeLinecap="round" opacity="0.82"
              />
            );
          })}
          <circle cx="356" cy="56" r="24" fill="#FFE05A" />
          <circle cx="356" cy="56" r="19" fill="#FFF0A0" />
          <ellipse cx="348" cy="48" rx="7" ry="4.5" fill="rgba(255,255,255,0.60)"
            transform="rotate(-28 348 48)" />
          <circle cx="350" cy="53" r="2.3" fill="#B87000" />
          <circle cx="362" cy="53" r="2.3" fill="#B87000" />
          <circle cx="351.2" cy="51.8" r="0.9" fill="white" />
          <circle cx="363.2" cy="51.8" r="0.9" fill="white" />
          <path d="M350 60 Q356 67 362 60" stroke="#B87000" strokeWidth="2.1"
            fill="none" strokeLinecap="round" />
          <ellipse cx="344" cy="58" rx="4" ry="2.8" fill="#FFB3B3" opacity="0.38" />
          <ellipse cx="368" cy="58" rx="4" ry="2.8" fill="#FFB3B3" opacity="0.38" />
        </g>

        {/* ══ CLOUD — top-left corner, ~25% smaller, drift + gentle float ══ */}
        <g
          style={{
            transformBox: "fill-box",
            transformOrigin: "center",
            animation: "cloud-drift 14s ease-in-out 0s infinite, wb-float 9s ease-in-out 1s infinite",
          }}
        >
          {/* Shadow */}
          <ellipse cx="82" cy="98" rx="64" ry="10"
            fill="#C0CFD8" opacity="0.28" filter="url(#wb-cloud-shadow)" />
          {/* Flat base */}
          <ellipse cx="80" cy="78" rx="66" ry="20" fill="white" />
          {/* Puffs */}
          <circle cx="28"  cy="66"  r="23" fill="white" />
          <circle cx="54"  cy="54"  r="28" fill="white" />
          <circle cx="86"  cy="50"  r="25" fill="white" />
          <circle cx="116" cy="58"  r="21" fill="white" />
          <circle cx="138" cy="70"  r="16" fill="white" />
          {/* Inner highlight */}
          <ellipse cx="70"  cy="56" rx="22" ry="9" fill="rgba(255,255,255,0.65)" />
          {/* Underside tint */}
          <ellipse cx="80" cy="90" rx="60" ry="10" fill="#D8EAF4" opacity="0.22" />
        </g>

        {/* Small secondary cloud — mid-right, very faint */}
        <g
          opacity="0.13"
          style={{
            transformBox: "fill-box",
            transformOrigin: "center",
            animation: "cloud-drift 15s ease-in-out 2.5s infinite",
          }}
        >
          <ellipse cx="330" cy="230" rx="52" ry="15" fill="white" />
          <circle cx="302" cy="220" r="18" fill="white" />
          <circle cx="324" cy="214" r="22" fill="white" />
          <circle cx="350" cy="218" r="18" fill="white" />
          <circle cx="368" cy="227" r="13" fill="white" />
        </g>

        {/* ══ SCATTERED STARS ══ */}
        {star( 18,  52,  7, "#FFB6C1", 0.22)}
        {star( 28, 172,  5, "#D4B6FF", 0.18)}
        {star( 14, 310,  6, "#A8F0D0", 0.16)}
        {star( 32, 422,  5, "#FFB6C1", 0.14)}
        {star( 22, 536,  6, "#B6D4FF", 0.15)}
        {star(376,  98,  6, "#A8F0D0", 0.20)}
        {star(386, 224,  5, "#FFE4A0", 0.18)}
        {star(370, 340,  7, "#D4B6FF", 0.16)}
        {star(382, 460,  5, "#FFB6C1", 0.14)}
        {star(374, 574,  6, "#A8F0D0", 0.15)}
        {star(166,  44,  5, "#FFE4A0", 0.18)}
        {star(248,  36,  4, "#B6D4FF", 0.16)}
        {star(298,  88,  6, "#FFB6C1", 0.14)}
        {star( 58, 248,  4, "#FFE4A0", 0.13)}
        {star(340, 190,  5, "#D4B6FF", 0.14)}
        {star(118, 330,  4, "#A8F0D0", 0.12)}
        {star(282, 300,  5, "#FFB6C1", 0.13)}
        {star(196, 420,  4, "#B6D4FF", 0.12)}
        {star( 72, 490,  5, "#FFE4A0", 0.13)}
        {star(308, 430,  4, "#D4B6FF", 0.12)}
        {star(156, 560,  5, "#A8F0D0", 0.13)}

        {/* ══ TWINKLE SPARKLES — pulse in/out with staggered timings ══ */}
        {twinkle( 44, 130,  6, "#FFE566", 2.8, 0.0)}
        {twinkle(360, 160,  5, "#B6D4FF", 3.2, 0.6)}
        {twinkle( 88, 278,  5, "#FFB6C1", 2.5, 1.1)}
        {twinkle(316, 262,  6, "#A8F0D0", 3.0, 1.7)}
        {twinkle(142, 450,  5, "#FFE566", 2.7, 0.4)}
        {twinkle(264, 500,  6, "#D4B6FF", 3.4, 2.0)}
        {twinkle( 38, 584,  5, "#A8F0D0", 2.9, 0.9)}
        {twinkle(362, 520,  5, "#FFB6C1", 3.1, 1.5)}
        {twinkle(200, 120,  4, "#FFE566", 2.6, 0.3)}
        {twinkle( 76, 388,  4, "#B6D4FF", 3.3, 2.2)}

        {/* ══ HOLLOW BUBBLE CIRCLES — gentle float with staggered delays ══ */}
        {bubble( 52, 196,  7, "#B6D4FF", 0.18, 0.0)}
        {bubble(348, 148,  5, "#FFB6C1", 0.16, 1.2)}
        {bubble(182, 264,  8, "#A8F0D0", 0.14, 2.4)}
        {bubble(360, 320,  6, "#D4B6FF", 0.15, 0.7)}
        {bubble( 36, 448,  6, "#FFE4A0", 0.16, 1.9)}
        {bubble(278, 378,  7, "#FFB6C1", 0.14, 3.1)}
        {bubble(124, 518,  5, "#B6D4FF", 0.15, 0.5)}
        {bubble(390, 560,  6, "#A8F0D0", 0.14, 2.8)}
        {bubble(230, 192,  5, "#FFE4A0", 0.12, 1.6)}
        {bubble( 96, 144,  4, "#D4B6FF", 0.13, 0.3)}

        {/* ══ CONFETTI DOTS ══ */}
        <circle cx=" 62" cy="104" r="3.0" fill="#FFB6C1" opacity="0.18" />
        <circle cx="310" cy=" 78" r="2.5" fill="#B6D4FF" opacity="0.16" />
        <circle cx="178" cy="150" r="3.5" fill="#A8F0D0" opacity="0.14" />
        <circle cx="388" cy="186" r="2.5" fill="#FFE4A0" opacity="0.16" />
        <circle cx=" 18" cy="260" r="3.0" fill="#D4B6FF" opacity="0.15" />
        <circle cx="330" cy="240" r="2.5" fill="#FFB6C1" opacity="0.14" />
        <circle cx="102" cy="348" r="3.5" fill="#B6D4FF" opacity="0.14" />
        <circle cx="384" cy="374" r="3.0" fill="#A8F0D0" opacity="0.14" />
        <circle cx=" 48" cy="464" r="3.5" fill="#FFE4A0" opacity="0.16" />
        <circle cx="252" cy="474" r="2.5" fill="#FFB6C1" opacity="0.14" />
        <circle cx="364" cy="498" r="3.0" fill="#D4B6FF" opacity="0.14" />
        <circle cx="108" cy="542" r="3.5" fill="#A8F0D0" opacity="0.15" />
        <circle cx="226" cy="360" r="2.5" fill="#FFE566" opacity="0.14" />
        <circle cx="150" cy="220" r="3.0" fill="#FFB6C1" opacity="0.13" />
        <circle cx="296" cy="170" r="2.5" fill="#B6D4FF" opacity="0.13" />

        {/* ══ TINY GEOMETRIC SHAPES ══ */}
        <polygon points="76,84 80,92 72,92"       fill="#FFE4A0" opacity="0.16" />
        <polygon points="354,200 358,208 350,208" fill="#FFB6C1" opacity="0.14" />
        <polygon points="16,378 20,386 12,386"    fill="#A8F0D0" opacity="0.14" />
        <polygon points="388,432 392,440 384,440" fill="#D4B6FF" opacity="0.14" />
        <polygon points="200,480 204,488 196,488" fill="#FFE4A0" opacity="0.13" />
        <polygon points="92,560 96,568 88,568"    fill="#B6D4FF" opacity="0.14" />
        <path d="M132 178 L136 184 L132 190 L128 184 Z" fill="#D4B6FF" opacity="0.15" />
        <path d="M268 292 L272 298 L268 304 L264 298 Z" fill="#FFB6C1" opacity="0.14" />
        <path d="M44  328 L48  334 L44  340 L40  334 Z" fill="#A8F0D0" opacity="0.13" />
        <path d="M352 400 L356 406 L352 412 L348 406 Z" fill="#FFE566" opacity="0.14" />

        {/* ══ ROLLING HILLS — storybook style ══ */}
        <path
          d="M0 680 C 60 644, 140 660, 210 650 C 280 640, 345 652, 400 642 L400 800 L0 800 Z"
          fill="url(#wb-hill-a)" opacity="0.60"
        />
        <path
          d="M0 714 C 80 686, 168 700, 248 692 C 314 686, 364 694, 400 684 L400 800 L0 800 Z"
          fill="url(#wb-hill-b)" opacity="0.80"
        />
        <path
          d="M0 748 C 70 724, 160 736, 240 728 C 308 722, 362 730, 400 720 L400 800 L0 800 Z"
          fill="url(#wb-hill-c)"
        />

        {/* ══ BOTTOM-LEFT LEAF CLUSTER — layered depth ══ */}
        <g filter="url(#wb-leaf)" opacity="0.65">
          <ellipse cx="-8"  cy="800" rx="72" ry="44" fill="#C7F5F5" />
          <ellipse cx="32"  cy="800" rx="58" ry="40" fill="#BEEFD8" />
          <path d="M-12 778 Q20 740 58 764 Q42 796   8 793 Z" fill="#C7F5F5" />
          <path d="M  8 786 Q40 748 74 772 Q56 802  18 800 Z" fill="#BEEFD8" />
        </g>
        <g filter="url(#wb-leaf-front)" opacity="0.82">
          <path d="M-8  800 Q18 762 52 780 Q38 806  4 803 Z" fill="#A8E8D0" />
          <path d="M 6  800 Q34 758 64 778 Q48 808 14 804 Z" fill="#C4F0E8" />
          <path d="M-14 800 Q10 768 42 788 Q28 812  -4 810 Z" fill="#94DCC8" />
          <ellipse cx="22"  cy="798" rx="38" ry="18" fill="#BEEFD8" opacity="0.70" />
          <ellipse cx="52"  cy="800" rx="24" ry="14" fill="#A8E8D0" opacity="0.60" />
        </g>
        <circle cx="26" cy="778" r="3"   fill="#6ECCB4" opacity="0.22" />
        <circle cx="44" cy="768" r="2"   fill="#6ECCB4" opacity="0.18" />
        <circle cx="14" cy="786" r="2.5" fill="#6ECCB4" opacity="0.20" />

        {/* ══ BOTTOM-RIGHT LEAF CLUSTER — mirrored ══ */}
        <g filter="url(#wb-leaf)" opacity="0.65">
          <ellipse cx="408" cy="800" rx="72" ry="44" fill="#C7F5F5" />
          <ellipse cx="368" cy="800" rx="58" ry="40" fill="#BEEFD8" />
          <path d="M412 778 Q380 740 342 764 Q358 796 392 793 Z" fill="#C7F5F5" />
          <path d="M392 786 Q360 748 326 772 Q344 802 382 800 Z" fill="#BEEFD8" />
        </g>
        <g filter="url(#wb-leaf-front)" opacity="0.82">
          <path d="M408 800 Q382 762 348 780 Q362 806 396 803 Z" fill="#A8E8D0" />
          <path d="M394 800 Q366 758 336 778 Q352 808 386 804 Z" fill="#C4F0E8" />
          <path d="M414 800 Q390 768 358 788 Q372 812 404 810 Z" fill="#94DCC8" />
          <ellipse cx="378" cy="798" rx="38" ry="18" fill="#BEEFD8" opacity="0.70" />
          <ellipse cx="348" cy="800" rx="24" ry="14" fill="#A8E8D0" opacity="0.60" />
        </g>
        <circle cx="374" cy="778" r="3"   fill="#6ECCB4" opacity="0.22" />
        <circle cx="356" cy="768" r="2"   fill="#6ECCB4" opacity="0.18" />
        <circle cx="386" cy="786" r="2.5" fill="#6ECCB4" opacity="0.20" />
      </svg>
    </div>
  );
}

// ── "Can I trust you?" intermediate screen ───────────────────────
// Hearts are px-positioned relative to the cat so they truly cluster
// around it. Cat head sits at roughly (195, 153) within the 320px-tall
// comp box — all other elements are anchored to that point.
export function TrustScreen({ tint, onNext }: { tint: number; onNext: () => void }) {
  const HEARTS = [
    { left:  18, top:  50, size: 26, delay: 0.0, dur: 3.0 },  // upper-left
    { left: 155, top:  18, size: 18, delay: 0.7, dur: 2.8 },  // above head
    { left: 290, top:  45, size: 22, delay: 1.3, dur: 3.4 },  // upper-right (above bubble)
    { left:  12, top: 165, size: 20, delay: 1.9, dur: 3.2 },  // left torso
    { left:  20, top: 278, size: 16, delay: 0.4, dur: 2.6 },  // lower-left
    { left: 305, top: 270, size: 14, delay: 1.1, dur: 3.8 },  // lower-right
  ];

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <NightRoomBackdrop />

      {/* Music button */}
      <div style={{
        position: "absolute", top: 18, right: 20, zIndex: 4,
        width: 48, height: 48, borderRadius: "50%",
        background: "#5B21B6",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer",
        boxShadow: "0 4px 16px rgba(91,33,182,0.50)",
      }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
          stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="16" r="3" />
        </svg>
      </div>

      {/* Main column — vertically centers the composition */}
      <div style={{
        position: "relative", zIndex: 1,
        height: "100%", display: "flex", flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 0 44px",
        boxSizing: "border-box",
        gap: 20,
      }}>

        {/* ── Composition box: fixed 320px tall so hearts, bubble, and cat
            are all pixel-positioned relative to the same origin ── */}
        <div style={{
          position: "relative",
          width: "100%",
          height: 320,
          flexShrink: 0,
        }}>

          {/* Hearts — pixel coords anchored near cat center (195, 153) */}
          {HEARTS.map((h, i) => (
            <div key={i} aria-hidden style={{
              position: "absolute",
              left: h.left, top: h.top,
              fontSize: h.size,
              animation: `float-heart ${h.dur}s ease-in-out ${h.delay}s infinite`,
              pointerEvents: "none", lineHeight: 1, zIndex: 2,
            }}>💗</div>
          ))}

          {/* Speech bubble — right side, tail aligned to cat head (y≈152) */}
          <div style={{
            position: "absolute",
            right: 12, top: 115,
            width: 148,
            background: "#fffdf5",
            borderRadius: 22,
            padding: "14px 18px 14px 16px",
            boxShadow: "0 10px 36px rgba(0,0,0,0.32)",
            zIndex: 3,
            animation: "pop-in 0.5s cubic-bezier(0.22, 1.5, 0.36, 1) 0.85s backwards",
          }}>
            {/* Tail points left toward cat face */}
            <div style={{
              position: "absolute",
              left: -13, top: 28,
              width: 0, height: 0,
              borderTop: "9px solid transparent",
              borderBottom: "9px solid transparent",
              borderRight: "15px solid #fffdf5",
            }} />
            <p style={{
              fontFamily: "var(--font-nunito), system-ui",
              fontSize: 22, fontWeight: 900, color: "#1e1430",
              margin: 0, lineHeight: 1.3,
            }}>Can I<br />trust you?</p>
          </div>

          {/* Bugsy — centered, pinned to bottom of comp box */}
          <div
            onClick={onNext}
            style={{
              position: "absolute",
              bottom: 10, left: "50%", transform: "translateX(-50%)",
              cursor: "pointer",
              animation: "bobo-enter 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.15s backwards",
            }}
          >
            <Bobo mood="cheer" tint={tint} size={210} tailWag />
          </div>
        </div>

        {/* Tap hint — finger-tapping paw animation */}
        <div
          onClick={onNext}
          style={{
            cursor: "pointer", flexShrink: 0,
            display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
            animation: "fade-up 0.5s ease 1.5s backwards",
          }}
        >
          <span style={{
            fontFamily: "var(--font-nunito), system-ui",
            fontSize: 20, fontWeight: 900,
            color: "#FFD234",
            textShadow: "0 0 18px rgba(255,210,52,0.75), 0 2px 8px rgba(0,0,0,0.6)",
            letterSpacing: 0.4,
          }}>Tap on paw</span>

          {/* Paw + ripples + tapping finger */}
          <div style={{ position: "relative", width: 76, height: 80 }}>

            {/* Ripple ring 1 */}
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              pointerEvents: "none",
            }}>
              <div style={{
                width: 64, height: 64, borderRadius: "50%",
                border: "2.5px solid rgba(255,210,52,0.80)",
                animation: "paw-ripple 1.9s ease-out 2.1s infinite",
              }} />
            </div>

            {/* Ripple ring 2 (offset delay) */}
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              pointerEvents: "none",
            }}>
              <div style={{
                width: 64, height: 64, borderRadius: "50%",
                border: "2px solid rgba(255,210,52,0.50)",
                animation: "paw-ripple 1.9s ease-out 2.4s infinite",
              }} />
            </div>

            {/* Paw emoji — squishes on tap */}
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{
                fontSize: 40, lineHeight: 1, display: "inline-block",
                animation: "paw-compress 1.9s ease-in-out 2.1s infinite",
              }}>🐾</span>
            </div>

            {/* Finger — bobs down from above to tap the paw */}
            <div style={{
              position: "absolute", top: -8, left: "50%", transform: "translateX(-20%)",
              pointerEvents: "none",
            }}>
              <span style={{
                fontSize: 28, lineHeight: 1, display: "inline-block",
                animation: "finger-tap 1.9s ease-in-out 2.1s infinite",
              }}>👆</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Ambient music via Web Audio API ─────────────────────────────
function useAmbientMusic() {
  const ctxRef     = useRef<AudioContext | null>(null);
  const masterRef  = useRef<GainNode | null>(null);
  const startedRef = useRef(false);
  const [on, setOn] = useState(true);

  const startAudio = useCallback(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const AudioCtx = (window as any).AudioContext ?? (window as any).webkitAudioContext;
    if (!AudioCtx) return;

    const ctx: AudioContext = new AudioCtx();
    ctxRef.current = ctx;

    const master = ctx.createGain();
    master.gain.setValueAtTime(0, ctx.currentTime);
    master.gain.linearRampToValueAtTime(0.22, ctx.currentTime + 4);
    master.connect(ctx.destination);
    masterRef.current = master;

    // Slow breathing LFO — gentle volume swell
    const lfo     = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.07;
    lfoGain.gain.value  = 0.025;
    lfo.connect(lfoGain);
    lfoGain.connect(master.gain);
    lfo.start();

    // A-minor ambient pad: A2 E3 A3 C4 E4 A4
    ([ [110, 0.12], [164.81, 0.08], [220, 0.07],
       [261.63, 0.05], [329.63, 0.04], [440, 0.025] ] as [number, number][])
      .forEach(([freq, vol]) => {
        const osc = ctx.createOscillator();
        const g   = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;
        g.gain.value = vol;
        osc.connect(g);
        g.connect(master);
        osc.start();
      });
  }, []);

  // Auto-start on first user gesture (browser autoplay policy)
  useEffect(() => {
    const handler = () => startAudio();
    document.addEventListener("pointerdown", handler, { once: true });
    return () => document.removeEventListener("pointerdown", handler);
  }, [startAudio]);

  const toggle = useCallback(() => {
    startAudio(); // no-op if already running
    setOn(prev => {
      const next = !prev;
      if (masterRef.current && ctxRef.current) {
        const t = ctxRef.current.currentTime;
        masterRef.current.gain.cancelScheduledValues(t);
        masterRef.current.gain.setValueAtTime(masterRef.current.gain.value, t);
        masterRef.current.gain.linearRampToValueAtTime(
          next ? 0.22 : 0,
          t + (next ? 1.2 : 0.8),
        );
      }
      return next;
    });
  }, [startAudio]);

  // Cleanup on unmount
  useEffect(() => () => { try { ctxRef.current?.close(); } catch (_) {} }, []);

  return { on, toggle };
}

// ── Splash / teaser screen (shown before Welcome) ────────────────
export function Splash({ onEnter }: { onEnter: () => void }) {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <NightRoomBackdrop minimal hideRug />

      <div style={{
        position: "relative", zIndex: 1,
        height: "100%", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "space-between",
        padding: "118px 28px 48px",
        boxSizing: "border-box",
      }}>

        {/* ── Logo ── */}
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
          animation: "fade-up 0.7s ease 0.1s backwards",
        }}>
          <h1 style={{
            fontFamily: "var(--font-nunito), system-ui",
            fontSize: 72, fontWeight: 900, margin: 0, lineHeight: 1,
            letterSpacing: -2,
            background: "linear-gradient(135deg, #FFD234 0%, #FF85C2 48%, #A78BFA 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            animation: "logo-glow 3s ease-in-out infinite",
          }}>Bugsy</h1>
        </div>

        {/* ── Bold intro text ── */}
        <div style={{
          textAlign: "center",
          animation: "fade-up 0.65s ease 0.6s backwards, float-gentle 3.6s ease-in-out 1.4s infinite",
        }}>
          <p style={{
            fontFamily: "var(--font-nunito), system-ui",
            fontSize: 13, fontWeight: 700,
            color: "rgba(255,220,160,0.75)",
            letterSpacing: 3, textTransform: "uppercase",
            margin: "0 0 14px",
          }}>✦ &nbsp;meet your new friend&nbsp; ✦</p>
          <p style={{
            fontFamily: "var(--font-nunito), system-ui",
            fontSize: 34, fontWeight: 900,
            color: "#fff",
            lineHeight: 1.3, margin: "0 0 6px",
            textShadow: "0 3px 20px rgba(0,0,0,0.6), 0 0 40px rgba(167,139,250,0.25)",
            letterSpacing: -0.5,
          }}>
            Hi, someone&apos;s been
          </p>
          <p style={{
            fontFamily: "var(--font-nunito), system-ui",
            fontSize: 34, fontWeight: 900,
            lineHeight: 1.3, margin: 0,
            textShadow: "0 3px 20px rgba(0,0,0,0.6)",
            letterSpacing: -0.5,
          }}>
            <span style={{ color: "#FFD234" }}>waiting</span>
            <span style={{ color: "#fff" }}> to meet </span>
            <span style={{ color: "#FF85C2" }}>you.</span>
          </p>
          <p style={{
            fontFamily: "var(--font-nunito), system-ui",
            fontSize: 16, fontWeight: 600,
            color: "rgba(200,215,255,0.72)",
            margin: "16px 0 0",
            letterSpacing: 0.2,
          }}>
            Your very own study buddy 💜
          </p>
        </div>

        {/* ── CTA ── */}
        <div style={{
          width: "100%", position: "relative",
          animation: "fade-up 0.6s ease 1.1s backwards",
        }}>
          {/* Pulsing glow rings */}
          <div style={{
            position: "absolute", inset: -8, borderRadius: 40,
            background: "rgba(147,51,234,0.42)",
            animation: "say-hi-ping 2.2s ease-out 1.8s infinite",
            pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", inset: -8, borderRadius: 40,
            background: "rgba(109,40,217,0.30)",
            animation: "say-hi-ping 2.2s ease-out 3.1s infinite",
            pointerEvents: "none",
          }} />
          <button
            onClick={onEnter}
            style={{
              width: "100%", height: 64, border: "none", borderRadius: 32,
              background: "linear-gradient(180deg, #9333EA 0%, #6D28D9 100%)",
              color: "#fff",
              fontFamily: "var(--font-nunito), system-ui",
              fontSize: 20, fontWeight: 900, letterSpacing: 0.2,
              cursor: "pointer",
              boxShadow: "0 6px 0 #4C1D95, 0 10px 36px rgba(109,40,217,0.55)",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              position: "relative", overflow: "hidden",
              animation: "cta-glow-pulse 2.4s ease-in-out 1.5s infinite",
            }}
            onPointerDown={e => {
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(5px)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 2px 0 #4C1D95, 0 4px 14px rgba(109,40,217,0.28)";
            }}
            onPointerUp={e => {
              (e.currentTarget as HTMLButtonElement).style.transform = "";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 0 #4C1D95, 0 10px 36px rgba(109,40,217,0.55)";
            }}
            onPointerLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.transform = "";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 0 #4C1D95, 0 10px 36px rgba(109,40,217,0.55)";
            }}
          >
            {/* shimmer sweep */}
            <div style={{
              position: "absolute", top: "-10%", left: "-90%",
              width: "48%", height: "120%",
              background: "linear-gradient(105deg, transparent 20%, rgba(255,220,100,0.35) 50%, transparent 80%)",
              transform: "skewX(-12deg)",
              animation: "say-hi-shimmer 3.2s ease-in-out 1.6s infinite",
              pointerEvents: "none",
            }} />
            Tap to find out who &nbsp;👀
          </button>
        </div>

      </div>
    </div>
  );
}

// ── The welcome screen ───────────────────────────────────────────
export function Welcome({
  tint,
  onGetStarted,
  onHaveAccount,
}: {
  tint: number;
  onGetStarted: () => void;
  onHaveAccount: () => void;
}) {
  const [introPhase, setIntroPhase] = useState(0);
  const [burstActive, setBurstActive] = useState(false);
  const { on: musicOn, toggle: toggleMusic } = useAmbientMusic();

  useEffect(() => {
    const t = setTimeout(() => setIntroPhase(1), 1150);
    return () => clearTimeout(t);
  }, []);

  // paw tapped → play high-five burst, then navigate after 950ms
  const handlePawTap = useCallback(() => {
    if (introPhase !== 4 || burstActive) return;
    setBurstActive(true);
    setTimeout(() => onGetStarted(), 950);
  }, [introPhase, burstActive, onGetStarted]);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <NightRoomBackdrop minimal />

      {/* Music toggle button — top-right */}
      <div
        role="button"
        aria-label={musicOn ? "Mute music" : "Play music"}
        onClick={toggleMusic}
        style={{
          position: "absolute", top: 18, right: 20, zIndex: 4,
          width: 48, height: 48, borderRadius: "50%",
          background: musicOn ? "#5B21B6" : "rgba(60,20,100,0.55)",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer",
          boxShadow: musicOn ? "0 4px 16px rgba(91,33,182,0.50)" : "none",
          transition: "background 0.3s ease, box-shadow 0.3s ease",
          opacity: musicOn ? 1 : 0.65,
        }}
      >
        {/* Pulsing ring when music is on */}
        {musicOn && (
          <div style={{
            position: "absolute", inset: -5, borderRadius: "50%",
            border: "2px solid rgba(147,51,234,0.55)",
            animation: "say-hi-ping 2.6s ease-out 0.4s infinite",
            pointerEvents: "none",
          }} />
        )}
        {musicOn ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
            stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
            stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
            <line x1="3" y1="3" x2="21" y2="21" />
          </svg>
        )}
      </div>

      {/* ── Main column ── */}
      <div style={{
        position: "relative", zIndex: 1,
        height: "100%", display: "flex", flexDirection: "column",
        padding: "60px 20px 32px",
        boxSizing: "border-box",
      }}>

        {/* ── Scene: cat centered, bubble floats above ── */}
        <div style={{
          flex: 1, minHeight: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: 0,
        }}>
          {/* Speech bubble — above cat, tail points down to its head.
              minHeight locks it to the fully-expanded size so Bugsy
              never shifts as new lines appear. */}
          <div style={{
            position: "relative",
            width: 220,
            minHeight: 168,
            background: "#fff9f0",
            borderRadius: 22,
            padding: "12px 16px 10px",
            boxShadow: "0 10px 36px rgba(0,0,0,0.28)",
            marginBottom: 4,
            boxSizing: "border-box",
            animation: "pop-in 0.45s cubic-bezier(0.22, 1.5, 0.36, 1) 0.6s backwards",
          }}>
            {/* Tail pointing down toward cat head */}
            <div style={{
              position: "absolute",
              bottom: -13, left: "38%",
              width: 0, height: 0,
              borderLeft: "12px solid transparent",
              borderRight: "12px solid transparent",
              borderTop: "15px solid #fff9f0",
            }} />

            <p style={{ textAlign: "center", margin: "0 0 5px", fontSize: 18, lineHeight: 1 }}>♥</p>

            {introPhase >= 1 && (
              <p style={{
                fontFamily: "var(--font-nunito), system-ui",
                fontSize: 17, fontWeight: 800, color: "#1e1430", margin: "0 0 2px",
              }}>
                <Typewriter text="Hi..." onDone={() => setIntroPhase(2)} speedMultiplier={1.4} />
              </p>
            )}

            {introPhase >= 2 && (
              <p style={{
                fontFamily: "var(--font-nunito), system-ui",
                fontSize: 17, fontWeight: 800, color: "#1e1430", margin: "0 0 8px",
              }}>
                I&apos;m{" "}
                <span style={{ color: "#FF5C8A" }}>
                  <Typewriter text="Bugsy." onDone={() => setIntroPhase(3)} speedMultiplier={1.0} />
                </span>
              </p>
            )}

            {introPhase >= 3 && (
              <p style={{
                fontFamily: "var(--font-nunito), system-ui",
                fontSize: 13, fontWeight: 600, color: "#5a4070",
                lineHeight: 1.5, margin: "0 0 7px",
              }}>
                <Typewriter
                  text="I get a little shy when meeting new friends."
                  onDone={() => setIntroPhase(4)}
                  speedMultiplier={0.8}
                />
              </p>
            )}

            {introPhase >= 4 && (
              <p style={{
                textAlign: "center", margin: 0, fontSize: 17, lineHeight: 1,
                animation: "fade-up 0.3s ease backwards",
              }}>💜</p>
            )}

          </div>

          {/* Bugsy — sits at bottom; right paw glows at phase 4 */}
          <div style={{
            position: "relative",
            animation: "bobo-enter 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.2s backwards",
          }}>
            <Bobo
              mood="shy"
              tint={tint}
              size={240}
              glowRightPaw={introPhase === 4 && !burstActive}
            />

            {/* Click target on Bugsy's right paw + two expanding ping rings */}
            {introPhase === 4 && !burstActive && (
              <div
                onClick={handlePawTap}
                style={{
                  position: "absolute",
                  left: 120, top: 133,
                  width: 48, height: 48,
                  borderRadius: "50%",
                  cursor: "pointer",
                  zIndex: 10,
                }}
              >
                <div style={{
                  position: "absolute", inset: -10,
                  borderRadius: "50%",
                  border: "2.5px solid rgba(192,132,252,0.70)",
                  animation: "paw-ring-ping 1.6s ease-out infinite",
                  pointerEvents: "none",
                }} />
                <div style={{
                  position: "absolute", inset: -10,
                  borderRadius: "50%",
                  border: "2.5px solid rgba(192,132,252,0.50)",
                  animation: "paw-ring-ping 1.6s ease-out 0.8s infinite",
                  pointerEvents: "none",
                }} />
              </div>
            )}
          </div>

          {/* Hint text — bold, gold sparkles, MY PAW uppercase */}
          {introPhase === 4 && !burstActive && (
            <div style={{
              marginTop: 6,
              textAlign: "center",
              animation: "fade-up 0.5s ease 0.2s backwards",
              userSelect: "none",
            }}>
              <p style={{
                fontFamily: "var(--font-nunito), system-ui",
                fontSize: 20, fontWeight: 900,
                color: "#f0e6ff",
                margin: 0,
                letterSpacing: "0.03em",
                WebkitTextStroke: "0.4px rgba(240,230,255,0.6)",
                animation: "hint-pulse 2s ease-in-out infinite",
                display: "inline-block",
              }}>
                <span style={{ color: "#FFD166" }}>✦</span>
                {" "}Tap on{" "}
                <span style={{
                  color: "#FFD166",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}>my paw</span>
                {" "}to say hello!{" "}
                <span style={{ color: "#FFD166" }}>✦</span>
              </p>
            </div>
          )}
        </div>

      </div>

      {/* ── High-five burst overlay ── */}
      {burstActive && (
        <div style={{
          position: "absolute", inset: 0,
          pointerEvents: "none", zIndex: 20,
          overflow: "hidden",
        }}>
          {/* Expanding bloom — covers screen just before Trust appears */}
          <div style={{
            position: "absolute",
            left: "50%", top: "60%",
            width: 80, height: 80,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(220,160,255,0.95) 0%, rgba(167,100,255,0.80) 45%, rgba(109,40,217,0.60) 100%)",
            animation: "screen-bloom 0.95s cubic-bezier(0.22, 1, 0.36, 1) 0s both",
            pointerEvents: "none",
          }} />

          {/* Spark particles radiating from Bugsy's right paw */}
          {([
            { e: "⭐", x: -72, y: -95,  delay: 0  },
            { e: "✨", x:   4, y: -108, delay: 35  },
            { e: "🌟", x:  78, y: -90,  delay: 15  },
            { e: "⭐", x: -98, y: -28,  delay: 55  },
            { e: "✨", x:  98, y: -32,  delay: 10  },
            { e: "🌟", x: -58, y:  58,  delay: 45  },
            { e: "⭐", x:  64, y:  62,  delay: 25  },
            { e: "✨", x:   4, y:  82,  delay: 65  },
            { e: "💜", x: -38, y: -130, delay: 20  },
            { e: "💜", x:  42, y: -128, delay: 50  },
          ] as { e: string; x: number; y: number; delay: number }[]).map((p, i) => (
            <div key={i} style={{
              position: "absolute",
              left: "50%", top: "60%",
              fontSize: 22, lineHeight: 1,
              ["--tx" as string]: `${p.x}px`,
              ["--ty" as string]: `${p.y}px`,
              animation: `burst-out 0.82s ease-out ${p.delay}ms both`,
            }}>{p.e}</div>
          ))}

        </div>
      )}
    </div>
  );
}
