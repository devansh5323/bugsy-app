"use client";

import { useId } from "react";
import { Bobo } from "../Mascot";
import { ChunkyButton } from "./ConvoUI";

// ── Subject-themed clay icons ────────────────────────────────────
// Each icon represents one of the things your child will learn —
// reading, writing, math, science, music, geography. Rendered as
// soft 3D clay using radial gradients + shine highlights + drop
// shadows. All inline SVG so they scale crisply.
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
        {/* cover */}
        <rect x="14" y="18" width="72" height="64" rx="9" fill={`url(#${id})`} />
        {/* spine (darker stripe on the left edge) */}
        <rect x="14" y="18" width="11" height="64" rx="3" fill="rgba(0,0,0,0.22)" />
        {/* title plaque */}
        <rect x="36" y="42" width="38" height="6" rx="2" fill="rgba(255,255,255,0.85)" />
        <rect x="36" y="54" width="28" height="4" rx="1.5" fill="rgba(255,255,255,0.55)" />
        {/* shine */}
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
          {/* graphite tip (dark triangle) */}
          <path d="M10 50 L18 46 L18 54 Z" fill="#2A2A2A" />
          {/* wood tip */}
          <path d="M18 44 L28 44 L28 56 L18 56 Z M18 44 L10 50 L18 56 Z" fill="#E8B873" />
          {/* shaft */}
          <rect x="28" y="42" width="42" height="16" fill={`url(#${id})`} />
          {/* shaft highlight stripe */}
          <rect x="28" y="44" width="42" height="2.5" fill="rgba(255,255,255,0.55)" />
          {/* ferrule (metal band) */}
          <rect x="70" y="42" width="6" height="16" fill="#BDBDBD" />
          <rect x="71" y="44" width="4" height="2" fill="#F5F5F5" />
          <rect x="71" y="49" width="4" height="1" fill="rgba(0,0,0,0.2)" />
          {/* eraser */}
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
        {/* tile body */}
        <rect x="12" y="12" width="76" height="76" rx="14" fill={`url(#${id})`} />
        {/* chunky "+" sign */}
        <rect x="32" y="46" width="36" height="8" rx="4" fill="rgba(255,255,255,0.95)" />
        <rect x="46" y="32" width="8" height="36" rx="4" fill="rgba(255,255,255,0.95)" />
        {/* shine */}
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
        {/* mouth rim */}
        <rect x="38" y="8" width="24" height="6" rx="2" fill="#9E9E9E" />
        {/* neck */}
        <path
          d="M42 14 L58 14 L58 32 L42 32 Z"
          fill={`url(#${id})`}
          stroke="#A0A0A0"
          strokeWidth="1.2"
        />
        {/* body */}
        <path
          d="M40 32 L60 32 L84 80 Q84 90 76 90 L24 90 Q16 90 16 80 Z"
          fill={`url(#${id})`}
          stroke="#A0A0A0"
          strokeWidth="1.2"
        />
        {/* liquid */}
        <path
          d="M28 66 L72 66 L80 82 Q80 86 76 86 L24 86 Q20 86 20 82 Z"
          fill={`url(#${id}-liquid)`}
        />
        {/* meniscus */}
        <path
          d="M28 66 Q50 62 72 66"
          fill="none"
          stroke="rgba(255,255,255,0.55)"
          strokeWidth="1.5"
        />
        {/* bubbles */}
        <circle cx="38" cy="76" r="2" fill="rgba(255,255,255,0.6)" />
        <circle cx="58" cy="80" r="1.6" fill="rgba(255,255,255,0.55)" />
        <circle cx="50" cy="74" r="1.2" fill="rgba(255,255,255,0.5)" />
        {/* glass highlight on body */}
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
        {/* flag */}
        <path
          d="M60 18 Q86 24 80 50 Q78 36 60 38 Z"
          fill={`url(#${id})`}
        />
        {/* stem */}
        <rect x="56" y="22" width="7" height="54" fill={`url(#${id})`} />
        {/* note head */}
        <ellipse
          cx="40"
          cy="74"
          rx="20"
          ry="13"
          fill={`url(#${id})`}
          transform="rotate(-22 40 74)"
        />
        {/* shine on head */}
        <ellipse
          cx="34"
          cy="68"
          rx="8"
          ry="3"
          fill="rgba(255,255,255,0.55)"
          transform="rotate(-22 34 68)"
        />
        {/* shine on flag */}
        <path
          d="M64 24 Q74 26 76 36"
          stroke="rgba(255,255,255,0.45)"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  // globe
  return (
    <svg {...svgProps}>
      <defs>
        <radialGradient id={id} cx="0.3" cy="0.28" r="0.85">
          <stop offset="0%" stopColor="#FFD8B8" />
          <stop offset="55%" stopColor="#FFA875" />
          <stop offset="100%" stopColor="#D67838" />
        </radialGradient>
      </defs>
      {/* sphere */}
      <circle cx="50" cy="50" r="42" fill={`url(#${id})`} />
      {/* continents */}
      <path
        d="M30 38 Q40 32 50 38 Q50 46 42 50 Q34 48 30 38 Z"
        fill="rgba(46, 179, 119, 0.78)"
      />
      <path
        d="M56 38 Q66 36 70 44 Q66 52 60 50 Q54 46 56 38 Z"
        fill="rgba(46, 179, 119, 0.78)"
      />
      <path
        d="M44 64 Q56 60 62 68 Q58 76 50 75 Q42 70 44 64 Z"
        fill="rgba(46, 179, 119, 0.78)"
      />
      {/* equator */}
      <ellipse
        cx="50"
        cy="50"
        rx="42"
        ry="14"
        fill="none"
        stroke="rgba(0,0,0,0.15)"
        strokeWidth="1.4"
      />
      {/* meridian */}
      <ellipse
        cx="50"
        cy="50"
        rx="14"
        ry="42"
        fill="none"
        stroke="rgba(0,0,0,0.15)"
        strokeWidth="1.4"
      />
      {/* shine */}
      <ellipse cx="36" cy="32" rx="11" ry="6" fill="rgba(255,255,255,0.55)" />
    </svg>
  );
}

// ── The welcome screen ──────────────────────────────────────────
export function Welcome({
  tint,
  onGetStarted,
  onHaveAccount,
}: {
  tint: number;
  onGetStarted: () => void;
  onHaveAccount: () => void;
}) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "var(--canvas)",
        overflow: "hidden",
      }}
    >
      {/* Grid layer — fades in, masked at edges */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: `
            linear-gradient(to right, rgba(60, 60, 60, 0.07) 1px, transparent 1px) 0 0 / 32px 32px,
            linear-gradient(to bottom, rgba(60, 60, 60, 0.07) 1px, transparent 1px) 0 0 / 32px 32px
          `,
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 65% at 50% 42%, black 20%, transparent 100%)",
          maskImage:
            "radial-gradient(ellipse 80% 65% at 50% 42%, black 20%, transparent 100%)",
          animation: "fade-in 1s ease 0.1s backwards",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          paddingTop: 48,
          paddingBottom: 28,
          paddingLeft: 20,
          paddingRight: 20,
          boxSizing: "border-box",
        }}
      >
        {/* Brand mark */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            marginTop: 4,
          }}
        >
          <Bobo mood="happy" tint={tint} size={34} animate={false} />
          <span
            style={{
              fontFamily: "var(--font-nunito), sans-serif",
              fontSize: 26,
              fontWeight: 900,
              letterSpacing: -0.6,
              color: "var(--primary)",
              lineHeight: 1,
              marginTop: 2,
            }}
          >
            bugsy
          </span>
        </div>

        {/* Hero scene */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          {/* Soft glow behind Bugsy */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              width: 320,
              height: 320,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(255, 92, 138, 0.18) 0%, transparent 65%)",
              filter: "blur(8px)",
              animation: "fade-in 1.2s ease 0.2s backwards",
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              position: "relative",
              animation: "bobo-enter 0.7s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            <Bobo mood="waving" tint={tint} size={200} />

            {/* Platform shadow */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                bottom: 10,
                left: "50%",
                transform: "translateX(-50%)",
                width: 170,
                height: 22,
                borderRadius: "50%",
                background:
                  "radial-gradient(ellipse, rgba(20, 16, 30, 0.18) 0%, transparent 70%)",
                filter: "blur(6px)",
                pointerEvents: "none",
                zIndex: -1,
              }}
            />

            {/* Subject clay shapes — book, pencil, math, flask, music, globe */}
            {[
              { shape: "book",   size: 46, x: 105,  y: -55, rot: 12,  delay: 0.30 },
              { shape: "math",   size: 48, x: -115, y: -45, rot: -10, delay: 0.40 },
              { shape: "flask",  size: 44, x: 115,  y: 60,  rot: 8,   delay: 0.55 },
              { shape: "pencil", size: 52, x: -120, y: 60,  rot: 0,   delay: 0.50 },
              { shape: "music",  size: 38, x: 55,   y: -105, rot: 10, delay: 0.65 },
              { shape: "globe",  size: 38, x: -55,  y: 115, rot: 0,   delay: 0.75 },
            ].map((s, i) => (
              <div
                key={i}
                aria-hidden
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  marginLeft: s.x,
                  marginTop: s.y,
                  transform: `rotate(${s.rot}deg)`,
                  animation: `pop-in 0.5s cubic-bezier(0.22, 1.5, 0.36, 1) ${s.delay}s backwards`,
                  pointerEvents: "none",
                }}
              >
                <Clay shape={s.shape as ClaySubject} size={s.size} />
              </div>
            ))}
          </div>
        </div>

        {/* Tagline */}
        <h1
          style={{
            fontFamily: "var(--font-nunito), sans-serif",
            fontSize: 26,
            fontWeight: 800,
            lineHeight: 1.2,
            letterSpacing: -0.6,
            textAlign: "center",
            color: "var(--ink)",
            margin: "0 auto 24px",
            padding: "0 8px",
            maxWidth: 340,
          }}
        >
          The safe, fun way for your child to learn and grow.
        </h1>

        {/* CTAs */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <ChunkyButton onClick={onGetStarted}>Get started</ChunkyButton>
          <ChunkyButton onClick={onHaveAccount} variant="ghost">
            I already have an account
          </ChunkyButton>
        </div>
      </div>
    </div>
  );
}
