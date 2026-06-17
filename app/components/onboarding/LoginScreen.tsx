"use client";

import { useId, useState, type ReactNode } from "react";
import { BackChevron, ConvoStage, SpeechBubble } from "./ConvoUI";
import { Bobo } from "../Mascot";
import type { Mood } from "../../lib/data";

// ── Login-screen illustration clay icons ─────────────────────────
type LoginClayShape = "abc" | "numbers" | "pencil" | "flask" | "music" | "planet";

function LoginClay({ shape, size }: { shape: LoginClayShape; size: number }) {
  const rawId = useId().replace(/:/g, "_");
  const id = `lclay-${shape}-${rawId}`;
  const ds = "drop-shadow(0 5px 9px rgba(20,16,30,0.18))";
  const p = { width: size, height: size, viewBox: "0 0 100 100", style: { filter: ds, overflow: "visible" as const } };

  if (shape === "abc") {
    return (
      <svg {...p}>
        <defs>
          <radialGradient id={id} cx="0.3" cy="0.26" r="0.85">
            <stop offset="0%" stopColor="#FFE0B2" />
            <stop offset="55%" stopColor="#FFA040" />
            <stop offset="100%" stopColor="#D06000" />
          </radialGradient>
        </defs>
        {/* block face */}
        <rect x="12" y="12" width="76" height="76" rx="14" fill={`url(#${id})`} />
        {/* top bevel */}
        <rect x="12" y="12" width="76" height="14" rx="14" fill="rgba(255,255,255,0.22)" />
        {/* shine */}
        <ellipse cx="34" cy="22" rx="14" ry="5" fill="rgba(255,255,255,0.38)" />
        {/* letter A */}
        <path d="M24 68 L32 36 L40 68 M27 58 L37 58" stroke="rgba(255,255,255,0.92)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        {/* letter B */}
        <path d="M46 36 L46 68 M46 36 Q60 36 60 45 Q60 52 46 52 M46 52 Q62 52 62 60 Q62 68 46 68" stroke="rgba(255,255,255,0.92)" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        {/* letter C */}
        <path d="M78 42 Q70 34 64 46 Q60 54 64 62 Q70 72 78 66" stroke="rgba(255,255,255,0.92)" strokeWidth="4.5" strokeLinecap="round" fill="none" />
      </svg>
    );
  }

  if (shape === "numbers") {
    return (
      <svg {...p}>
        <defs>
          <radialGradient id={id} cx="0.3" cy="0.26" r="0.85">
            <stop offset="0%" stopColor="#B3E5FC" />
            <stop offset="55%" stopColor="#29B6F6" />
            <stop offset="100%" stopColor="#0277BD" />
          </radialGradient>
        </defs>
        <rect x="12" y="12" width="76" height="76" rx="14" fill={`url(#${id})`} />
        <rect x="12" y="12" width="76" height="14" rx="14" fill="rgba(255,255,255,0.22)" />
        <ellipse cx="34" cy="22" rx="14" ry="5" fill="rgba(255,255,255,0.38)" />
        {/* "1" */}
        <path d="M26 38 L30 34 L30 68" stroke="rgba(255,255,255,0.92)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        {/* "2" */}
        <path d="M42 42 Q42 34 50 34 Q58 34 58 42 Q58 48 42 68 L60 68" stroke="rgba(255,255,255,0.92)" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        {/* "3" */}
        <path d="M66 36 Q76 36 76 46 Q76 52 69 52 M69 52 Q78 52 78 62 Q78 70 66 70" stroke="rgba(255,255,255,0.92)" strokeWidth="4.5" strokeLinecap="round" fill="none" />
      </svg>
    );
  }

  if (shape === "pencil") {
    return (
      <svg {...p}>
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
          <path d="M76 42 L84 42 Q90 42 90 47 L90 53 Q90 58 84 58 L76 58 Z" fill="#FF9AB3" />
          <ellipse cx="80" cy="46" rx="3" ry="1.5" fill="rgba(255,255,255,0.5)" />
        </g>
      </svg>
    );
  }

  if (shape === "flask") {
    return (
      <svg {...p}>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="0.6">
            <stop offset="0%" stopColor="#F8FFFB" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#D7E8E0" stopOpacity="0.75" />
          </linearGradient>
          <linearGradient id={`${id}l`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5EE8A4" />
            <stop offset="100%" stopColor="#2EB377" />
          </linearGradient>
        </defs>
        <rect x="38" y="8" width="24" height="6" rx="2" fill="#9E9E9E" />
        <path d="M42 14 L58 14 L58 32 L42 32 Z" fill={`url(#${id})`} stroke="#A0A0A0" strokeWidth="1.2" />
        <path d="M40 32 L60 32 L84 80 Q84 90 76 90 L24 90 Q16 90 16 80 Z" fill={`url(#${id})`} stroke="#A0A0A0" strokeWidth="1.2" />
        <path d="M28 66 L72 66 L80 82 Q80 86 76 86 L24 86 Q20 86 20 82 Z" fill={`url(#${id}l)`} />
        <path d="M28 66 Q50 62 72 66" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1.5" />
        <circle cx="38" cy="76" r="2" fill="rgba(255,255,255,0.6)" />
        <circle cx="58" cy="80" r="1.6" fill="rgba(255,255,255,0.55)" />
        <path d="M28 38 L34 38 L42 80 L36 80 Z" fill="rgba(255,255,255,0.45)" />
      </svg>
    );
  }

  if (shape === "music") {
    return (
      <svg {...p}>
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

  // planet
  return (
    <svg {...p}>
      <defs>
        <radialGradient id={id} cx="0.3" cy="0.28" r="0.85">
          <stop offset="0%" stopColor="#E0C8FF" />
          <stop offset="55%" stopColor="#A855F7" />
          <stop offset="100%" stopColor="#6B21A8" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="38" fill={`url(#${id})`} />
      {/* ring */}
      <ellipse cx="50" cy="50" rx="56" ry="16" fill="none" stroke="#CE82FF" strokeWidth="6" opacity="0.7" />
      <ellipse cx="50" cy="50" rx="56" ry="16" fill="none" stroke="#E5C0FF" strokeWidth="3" opacity="0.4" />
      {/* continent blobs */}
      <path d="M34 38 Q44 32 52 40 Q50 48 42 48 Q34 46 34 38Z" fill="rgba(255,255,255,0.20)" />
      <path d="M54 56 Q62 52 66 60 Q62 68 56 66 Q50 62 54 56Z" fill="rgba(255,255,255,0.18)" />
      {/* shine */}
      <ellipse cx="36" cy="32" rx="11" ry="6" fill="rgba(255,255,255,0.50)" />
    </svg>
  );
}

function LoginSparkle({ size, x, y, delay }: { size: number; x: number; y: number; delay: number }) {
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
        <path d="M10 1L11.8 8.2L19 10L11.8 11.8L10 19L8.2 11.8L1 10L8.2 8.2L10 1Z" fill="#FFD700" opacity="0.85" />
      </svg>
    </div>
  );
}

// Mascot size for the login illustration. All icon offsets are
// calculated to keep every element clear of this radius (~108px).
const MASCOT_SIZE = 216;

function LoginIllustration({ mood, tint }: { mood: Mood; tint: number }) {
  return (
    <div
      style={{
        height: 248,
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {/* Soft radial glow */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,92,138,0.20) 0%, rgba(167,139,250,0.10) 50%, transparent 72%)",
          filter: "blur(20px)",
          animation: "breath-glow 4s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />

      {/* Mascot + floating objects */}
      <div
        style={{
          position: "relative",
          animation: "bugsy-pop 0.6s cubic-bezier(0.22, 1.5, 0.36, 1)",
        }}
      >
        <Bobo mood={mood} tint={tint} size={MASCOT_SIZE} />

        {/* Ground shadow */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            bottom: 8,
            left: "50%",
            transform: "translateX(-50%)",
            width: 185,
            height: 20,
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(20,16,30,0.15) 0%, transparent 70%)",
            filter: "blur(7px)",
            pointerEvents: "none",
            zIndex: -1,
          }}
        />

        {/* Floating clay icons
            Mascot radius ≈ 108px. Every icon sits at distance ≥ 155px
            from center so the nearest icon edge never touches the mascot
            (155 − half_size ≥ 108 + 25px clearance for all sizes below). */}
        {([
          { shape: "abc",     size: 44, x:  148, y: -72,  rot:  12, delay: 0.28 },
          { shape: "numbers", size: 44, x: -158, y: -60,  rot: -12, delay: 0.38 },
          { shape: "flask",   size: 40, x:  152, y:  74,  rot:   8, delay: 0.52 },
          { shape: "pencil",  size: 48, x: -162, y:  74,  rot:   0, delay: 0.46 },
          { shape: "music",   size: 36, x:   72, y: -152, rot:  10, delay: 0.62 },
          { shape: "planet",  size: 40, x:  -72, y:  152, rot:   0, delay: 0.72 },
        ] as const).map((s, i) => (
          <div
            key={i}
            aria-hidden
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              marginLeft: s.x,
              marginTop: s.y,
              animation: `pop-in 0.5s cubic-bezier(0.22, 1.5, 0.36, 1) ${s.delay}s backwards`,
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                transform: `rotate(${s.rot}deg)`,
                animation: `bobo-float ${2.5 + i * 0.28}s ease-in-out ${s.delay + 0.6}s infinite`,
              }}
            >
              <LoginClay shape={s.shape} size={s.size} />
            </div>
          </div>
        ))}

        {/* Sparkles — all placed at dist > 125px so none sit on the mascot */}
        <LoginSparkle size={12} x={-118} y={-100} delay={0.2} />
        <LoginSparkle size={9}  x={ 120} y={ -42} delay={0.9} />
        <LoginSparkle size={10} x={  98} y={ 118} delay={1.5} />
        <LoginSparkle size={8}  x={-120} y={  98} delay={0.5} />
        <LoginSparkle size={11} x={ -46} y={-128} delay={1.2} />
      </div>
    </div>
  );
}

export type AuthProvider = "google" | "apple" | "email";

// Shared conversational login screen. Used in 3 places:
//   • Welcome → "I already have an account"
//   • Parent flow → guardrail before handover
//   • Child flow → adult consent at the end
// Bugsy stays in voice; copy + mood change per context.
export function LoginScreen({
  tint,
  bubbleText,
  mood = "happy",
  step = 2,
  ctaLabel,
  onContinue,
  onBack,
}: {
  tint: number;
  bubbleText: string;
  mood?: Mood;
  step?: number;
  /** Optional small text shown above the auth buttons */
  ctaLabel?: string;
  onContinue: (provider: AuthProvider) => void;
  onBack?: () => void;
}) {
  const [done, setDone] = useState(false);

  return (
    <ConvoStage step={step}>
      <SkyBackdrop />
      {onBack && <BackChevron onBack={onBack} />}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          flex: 1,
          width: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <LoginIllustration mood={mood} tint={tint} />
        <div style={{ marginTop: 4 }} />
        <SpeechBubble text={bubbleText} onDone={() => setDone(true)} />

        <div
          style={{
            marginTop: 18,
            display: "flex",
            flexDirection: "column",
            gap: 10,
            opacity: done ? 1 : 0,
            transition: "opacity 0.4s ease",
            pointerEvents: done ? "auto" : "none",
          }}
        >
          {ctaLabel && (
            <div
              style={{
                fontFamily: "var(--font-nunito), system-ui",
                fontSize: 11,
                fontWeight: 800,
                color: "var(--ink-muted)",
                letterSpacing: 0.8,
                textTransform: "uppercase",
                textAlign: "center",
                marginBottom: 2,
              }}
            >
              {ctaLabel}
            </div>
          )}
          <AuthButton provider="google" onClick={() => onContinue("google")} />
          <AuthButton provider="apple" onClick={() => onContinue("apple")} />
          <AuthButton provider="email" onClick={() => onContinue("email")} />
        </div>

        <div style={{ flex: 1 }} />

        {/* Tiny privacy assurance under the buttons */}
        <div
          style={{
            fontFamily: "var(--font-nunito), system-ui",
            fontSize: 11,
            fontWeight: 700,
            color: "var(--ink-muted)",
            textAlign: "center",
            marginTop: 12,
            letterSpacing: -0.05,
            opacity: done ? 1 : 0,
            transition: "opacity 0.4s ease",
          }}
        >
          Only used to save progress. No spam — pinky promise.
        </div>
      </div>
    </ConvoStage>
  );
}

// Nature-inspired pastel backdrop: warm cream → ivory → aqua gradient,
// smiling sun top-right, fluffy drifting clouds top-left, pastel stars
// and dots scattered throughout, rolling hills + leaf clusters at bottom.
function SkyBackdrop() {
  // 4-pointed sparkle star helper
  const star = (cx: number, cy: number, r: number, color: string, op: number) => {
    const q = r * 0.32;
    return (
      <path
        d={`M${cx},${cy - r} L${cx + q},${cy - q} L${cx + r},${cy} L${cx + q},${cy + q} L${cx},${cy + r} L${cx - q},${cy + q} L${cx - r},${cy} L${cx - q},${cy - q} Z`}
        fill={color}
        opacity={op}
      />
    );
  };

  // Fluffy cloud made of overlapping ellipses, drifts horizontally
  const cloud = (x: number, y: number, s: number, dur: number, delay: number, op: number) => (
    <g
      opacity={op}
      style={{
        transformBox: "fill-box",
        transformOrigin: "center",
        animation: `cloud-drift ${dur}s ease-in-out ${delay}s infinite`,
      }}
    >
      {/* shadow */}
      <ellipse cx={x + 2} cy={y + 7 * s} rx={40 * s} ry={13 * s} fill="#C8D8E0" opacity={0.28} />
      {/* body puffs */}
      <ellipse cx={x}           cy={y}          rx={40 * s} ry={21 * s} fill="white" />
      <ellipse cx={x - 25 * s}  cy={y + 8 * s}  rx={27 * s} ry={18 * s} fill="white" />
      <ellipse cx={x + 27 * s}  cy={y + 7 * s}  rx={29 * s} ry={17 * s} fill="white" />
      <ellipse cx={x +  3 * s}  cy={y - 13 * s} rx={23 * s} ry={17 * s} fill="white" />
      <ellipse cx={x - 10 * s}  cy={y -  9 * s} rx={19 * s} ry={15 * s} fill="white" />
    </g>
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
          {/* Main background: cream → ivory → aqua */}
          <linearGradient id="nature-bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#FFF6D6" />
            <stop offset="42%"  stopColor="#F7F9F5" />
            <stop offset="100%" stopColor="#DDF7F7" />
          </linearGradient>

          {/* Hill layers — light → mid → front pastel green */}
          <linearGradient id="hill-a" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#D6F0DC" />
            <stop offset="100%" stopColor="#C2E8CA" />
          </linearGradient>
          <linearGradient id="hill-b" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#C8EACF" />
            <stop offset="100%" stopColor="#B4DEC0" />
          </linearGradient>
          <linearGradient id="hill-c" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#BEEFD8" />
            <stop offset="100%" stopColor="#A8DEC5" />
          </linearGradient>

          {/* Soft blur for glow + leaves */}
          <filter id="bg-glow">
            <feGaussianBlur stdDeviation="20" />
          </filter>
          <filter id="leaf-blur">
            <feGaussianBlur stdDeviation="5" />
          </filter>
        </defs>

        {/* ── Background ── */}
        <rect x="0" y="0" width="400" height="800" fill="url(#nature-bg)" />

        {/* Warm glow centered behind mascot area */}
        <ellipse cx="200" cy="310" rx="210" ry="200"
          fill="rgba(255,246,214,0.28)" filter="url(#bg-glow)" />

        {/* ── Sun (top right) ── */}
        <g>
          {/* Rays */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
            const a = (deg * Math.PI) / 180;
            return (
              <line key={i}
                x1={350 + Math.cos(a) * 34} y1={66 + Math.sin(a) * 34}
                x2={350 + Math.cos(a) * 47} y2={66 + Math.sin(a) * 47}
                stroke="#FFCC22" strokeWidth="3.5" strokeLinecap="round" opacity="0.80"
              />
            );
          })}
          {/* Body */}
          <circle cx="350" cy="66" r="27" fill="#FFE566" />
          <circle cx="350" cy="66" r="22" fill="#FFF0A0" />
          {/* Shine */}
          <ellipse cx="342" cy="57" rx="8" ry="5" fill="rgba(255,255,255,0.55)"
            transform="rotate(-25 342 57)" />
          {/* Eyes */}
          <circle cx="344" cy="63" r="2.5" fill="#C87800" />
          <circle cx="356" cy="63" r="2.5" fill="#C87800" />
          {/* Smile */}
          <path d="M344 71 Q350 78 356 71" stroke="#C87800" strokeWidth="2.2"
            fill="none" strokeLinecap="round" />
          {/* Rosy cheeks */}
          <circle cx="340" cy="68" r="4.5" fill="#FFB3B3" opacity="0.30" />
          <circle cx="360" cy="68" r="4.5" fill="#FFB3B3" opacity="0.30" />
        </g>

        {/* ── Clouds ── */}
        {cloud(88,  118, 1.05, 10,  0.0, 0.18)}
        {cloud(316, 228, 0.70, 13,  1.8, 0.12)}
        {cloud(52,  462, 0.48, 11,  0.9, 0.08)}

        {/* ── Pastel 4-pointed stars (10–14% opacity) ── */}
        {star( 36,  58,  6, "#FFB6C1", 0.14)}
        {star(292,  42,  5, "#B6D4FF", 0.13)}
        {star(158,  80,  4, "#FFE4A0", 0.12)}
        {star( 18, 200,  5, "#D4B6FF", 0.11)}
        {star(374, 156,  4, "#A8F0D0", 0.13)}
        {star( 54, 350,  5, "#FFB6C1", 0.10)}
        {star(340, 298,  4, "#FFE4A0", 0.12)}
        {star(188, 440,  5, "#B6D4FF", 0.10)}
        {star( 28, 504,  4, "#A8F0D0", 0.11)}
        {star(370, 480,  5, "#D4B6FF", 0.10)}
        {star(210, 160,  4, "#FFB6C1", 0.10)}
        {star(120, 280,  4, "#FFE4A0", 0.11)}
        {star(284, 390,  5, "#A8F0D0", 0.10)}
        {star(148, 548,  4, "#B6D4FF", 0.10)}

        {/* ── Floating pastel dots (10–12% opacity) ── */}
        <circle cx=" 48" cy="140" r="4.0" fill="#FFB6C1" opacity="0.12" />
        <circle cx="332" cy="118" r="3.0" fill="#B6D4FF" opacity="0.11" />
        <circle cx="174" cy="200" r="4.5" fill="#A8F0D0" opacity="0.10" />
        <circle cx="382" cy="250" r="3.5" fill="#FFE4A0" opacity="0.12" />
        <circle cx=" 22" cy="314" r="4.0" fill="#D4B6FF" opacity="0.11" />
        <circle cx="308" cy="344" r="3.0" fill="#FFB6C1" opacity="0.10" />
        <circle cx="140" cy="384" r="4.5" fill="#B6D4FF" opacity="0.11" />
        <circle cx="374" cy="400" r="3.5" fill="#A8F0D0" opacity="0.10" />
        <circle cx=" 60" cy="460" r="4.0" fill="#FFE4A0" opacity="0.12" />
        <circle cx="244" cy="524" r="3.0" fill="#FFB6C1" opacity="0.11" />
        <circle cx="356" cy="560" r="4.0" fill="#D4B6FF" opacity="0.10" />
        <circle cx="100" cy="574" r="3.5" fill="#A8F0D0" opacity="0.11" />

        {/* ── Rolling hills (bottom) ── */}
        {/* Back hill — lightest, most distant */}
        <path
          d="M0 692 C 70 656, 155 670, 235 662 C 300 656, 356 664, 400 656 L400 800 L0 800 Z"
          fill="url(#hill-a)" opacity="0.65"
        />
        {/* Mid hill */}
        <path
          d="M0 724 C 92 698, 172 710, 258 704 C 318 700, 364 707, 400 698 L400 800 L0 800 Z"
          fill="url(#hill-b)" opacity="0.82"
        />
        {/* Front hill */}
        <path
          d="M0 754 C 88 734, 172 742, 252 736 C 316 731, 364 738, 400 730 L400 800 L0 800 Z"
          fill="url(#hill-c)"
        />

        {/* ── Bottom-left leaf & bush cluster ── */}
        <g filter="url(#leaf-blur)" opacity="0.72">
          <ellipse cx="-6"  cy="798" rx="60" ry="38" fill="#C7F5F5" />
          <ellipse cx="30"  cy="800" rx="48" ry="34" fill="#BEEFD8" />
          <path d="M-4 782 Q24 750 50 774 Q34 798  6 794 Z" fill="#BEEFD8" />
          <path d="M14 792 Q36 756 60 780 Q44 806 16 800 Z" fill="#C7F5F5" />
          <path d="M-6 802 Q22 768 44 792 Q28 812  0 808 Z" fill="#A8E4D4" />
          <ellipse cx="6"   cy="800" rx="32" ry="20" fill="#BEEFD8" opacity="0.55" />
        </g>

        {/* ── Bottom-right leaf & bush cluster ── */}
        <g filter="url(#leaf-blur)" opacity="0.72">
          <ellipse cx="406" cy="798" rx="60" ry="38" fill="#C7F5F5" />
          <ellipse cx="370" cy="800" rx="48" ry="34" fill="#BEEFD8" />
          <path d="M404 782 Q376 750 350 774 Q366 798 394 794 Z" fill="#BEEFD8" />
          <path d="M386 792 Q364 756 340 780 Q356 806 384 800 Z" fill="#C7F5F5" />
          <path d="M406 802 Q378 768 356 792 Q372 812 400 808 Z" fill="#A8E4D4" />
          <ellipse cx="394" cy="800" rx="32" ry="20" fill="#BEEFD8" opacity="0.55" />
        </g>
      </svg>
    </div>
  );
}

function AuthButton({
  provider,
  onClick,
}: {
  provider: AuthProvider;
  onClick: () => void;
}) {
  const cfg = providerConfig[provider];
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        minHeight: 56,
        padding: "12px 20px",
        borderRadius: 16,
        background: cfg.bg,
        color: cfg.fg,
        border: cfg.border,
        boxShadow: cfg.shadow,
        fontFamily: "var(--font-nunito), system-ui",
        fontWeight: 800,
        fontSize: 15,
        letterSpacing: -0.1,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        transition: "transform 80ms ease, box-shadow 80ms ease",
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = "translateY(3px)";
        e.currentTarget.style.boxShadow = cfg.shadowActive;
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = cfg.shadow;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = cfg.shadow;
      }}
    >
      <ProviderIcon provider={provider} />
      <span>{cfg.label}</span>
    </button>
  );
}

const providerConfig: Record<
  AuthProvider,
  {
    label: string;
    bg: string;
    fg: string;
    border: string;
    shadow: string;
    shadowActive: string;
  }
> = {
  google: {
    label: "Continue with Google",
    bg: "var(--surface)",
    fg: "var(--ink)",
    border: "2px solid var(--border)",
    shadow: "0 4px 0 var(--border)",
    shadowActive: "0 1px 0 var(--border)",
  },
  apple: {
    label: "Continue with Apple",
    bg: "var(--ink)",
    fg: "var(--canvas)",
    border: "none",
    shadow: "0 4px 0 #000",
    shadowActive: "0 1px 0 #000",
  },
  email: {
    label: "Continue with email",
    bg: "var(--primary)",
    fg: "var(--on-primary)",
    border: "none",
    shadow: "0 4px 0 var(--primary-shadow)",
    shadowActive: "0 1px 0 var(--primary-shadow)",
  },
};

function ProviderIcon({ provider }: { provider: AuthProvider }) {
  if (provider === "google") return <GoogleIcon />;
  if (provider === "apple") return <AppleIcon />;
  return <EmailIcon />;
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.44c-.28 1.48-1.12 2.73-2.39 3.58v2.96h3.86c2.26-2.09 3.58-5.17 3.58-8.78z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-2.96c-1.07.72-2.44 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.06C3.26 21.3 7.31 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.33c-.24-.72-.38-1.49-.38-2.28s.14-1.56.38-2.28V6.71H1.29C.47 8.34 0 10.13 0 12.05s.47 3.71 1.29 5.34l3.98-3.06z"
      />
      <path
        fill="#EA4335"
        d="M12 4.77c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.71l3.98 3.06C6.22 6.88 8.87 4.77 12 4.77z"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  );
}

export function LoginNode({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
