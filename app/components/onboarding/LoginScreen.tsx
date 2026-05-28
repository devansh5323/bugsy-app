"use client";

import { useState, type ReactNode } from "react";
import { BackChevron, BugsyStage, ConvoStage, SpeechBubble } from "./ConvoUI";
import type { Mood } from "../../lib/data";

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
        <BugsyStage mood={mood} tint={tint} size={140} animationKey="login" />
        <div style={{ marginTop: 8 }} />
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

// Playful full-bleed sky behind the login content: soft sky gradient,
// a sun with rays, drifting puffy clouds, sparkles, and confetti dots.
// Sits at zIndex 0 (above ConvoStage's bg wash) — the content wrapper
// above runs at zIndex 1 so taps + visuals never collide.
function SkyBackdrop() {
  const cloud = (x: number, y: number, s: number, dur: number, delay: number) => (
    <g
      style={{
        transformBox: "fill-box",
        transformOrigin: "center",
        animation: `cloud-drift ${dur}s ease-in-out ${delay}s infinite`,
      }}
    >
      {/* soft shadow under the cloud for depth */}
      <ellipse cx={x + 2} cy={y + 7 * s} rx={36 * s} ry={20 * s} fill="#cfd6ea" opacity="0.45" />
      <ellipse cx={x} cy={y} rx={34 * s} ry={18 * s} fill="#ffffff" />
      <ellipse cx={x - 22 * s} cy={y + 6 * s} rx={22 * s} ry={14 * s} fill="#ffffff" />
      <ellipse cx={x + 24 * s} cy={y + 5 * s} rx={24 * s} ry={15 * s} fill="#ffffff" />
      <ellipse cx={x + 2 * s} cy={y - 10 * s} rx={20 * s} ry={14 * s} fill="#ffffff" />
    </g>
  );
  const sparkle = (x: number, y: number, r: number, color: string) => (
    <path
      d={`M${x} ${y - r} L${x + r / 3} ${y - r / 3} L${x + r} ${y} L${x + r / 3} ${y + r / 3} L${x} ${y + r} L${x - r / 3} ${y + r / 3} L${x - r} ${y} L${x - r / 3} ${y - r / 3} Z`}
      fill={color}
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
          <linearGradient id="sky-bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ece4ff" />
            <stop offset="50%" stopColor="#fff5ec" />
            <stop offset="100%" stopColor="#ffe1d4" />
          </linearGradient>
        </defs>

        {/* sky */}
        <rect x="0" y="0" width="400" height="800" fill="url(#sky-bg)" />

        {/* sun with rays (upper-right) */}
        <g>
          <circle cx="338" cy="118" r="34" fill="#ffe27a" />
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
            const a = (i / 8) * Math.PI * 2;
            return (
              <line
                key={i}
                x1={338 + Math.cos(a) * 42}
                y1={118 + Math.sin(a) * 42}
                x2={338 + Math.cos(a) * 54}
                y2={118 + Math.sin(a) * 54}
                stroke="#ffd76a"
                strokeWidth="4"
                strokeLinecap="round"
              />
            );
          })}
        </g>

        {/* clouds */}
        {cloud(82, 170, 1, 10, 0)}
        {cloud(308, 254, 0.85, 12, 1.4)}
        {cloud(160, 364, 0.6, 9, 0.7)}
        {cloud(62, 500, 0.78, 11, 1.8)}
        {cloud(332, 568, 0.7, 10.5, 0.3)}
        {cloud(190, 692, 0.55, 9.5, 2.5)}

        {/* sparkles */}
        {sparkle(50, 80, 8, "#ffd76a")}
        {sparkle(252, 86, 6, "#f59ac0")}
        {sparkle(40, 332, 5, "#ffd76a")}
        {sparkle(220, 444, 6, "#7cb6e8")}
        {sparkle(360, 408, 6, "#c89bf0")}
        {sparkle(370, 684, 6, "#f59ac0")}
        {sparkle(118, 600, 5, "#8fd08a")}

        {/* colourful confetti dots */}
        <circle cx="120" cy="92" r="4" fill="#e8788f" />
        <circle cx="288" cy="160" r="3.6" fill="#7cb6e8" />
        <circle cx="70" cy="262" r="4" fill="#8fd08a" />
        <circle cx="350" cy="310" r="4" fill="#c89bf0" />
        <circle cx="170" cy="498" r="3.6" fill="#f4c542" />
        <circle cx="280" cy="640" r="4" fill="#e8788f" />
        <circle cx="52" cy="640" r="3.6" fill="#7cb6e8" />
        <circle cx="294" cy="500" r="3.5" fill="#ffb347" />
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
