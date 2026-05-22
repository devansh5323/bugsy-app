"use client";

import type { ReactNode } from "react";
import { Bobo } from "../Mascot";
import { Typewriter } from "../Typewriter";
import type { Mood } from "../../lib/data";

// Step-keyed accent colors. White canvas, but the soft wash behind
// Bugsy gently shifts per step so the journey still has visual
// variety. (Duolingo onboarding does this with the language-tile
// background color.)
const STEP_WASHES = [
  "rgba(255, 92, 138, 0.16)",   // coral primary (default)
  "rgba(167, 139, 250, 0.18)",  // lavender
  "rgba(255, 200, 0, 0.20)",    // accent yellow
  "rgba(206, 130, 255, 0.18)",  // accent purple
  "rgba(255, 150, 0, 0.18)",    // streak orange
  "rgba(255, 124, 168, 0.20)",  // soft coral
  "rgba(167, 139, 250, 0.18)",  // lavender repeat
];

// Back-compat alias — older callers indexed into GRADIENTS
export const GRADIENTS = STEP_WASHES;

export function ConvoStage({
  step,
  children,
}: {
  step: number;
  children: ReactNode;
}) {
  const wash = STEP_WASHES[step % STEP_WASHES.length];
  return (
    <div
      className="child-flow"
      style={{
        position: "absolute",
        inset: 0,
        background: `radial-gradient(ellipse 90% 55% at 50% 0%, ${wash} 0%, transparent 70%), var(--canvas)`,
        display: "flex",
        flexDirection: "column",
        paddingTop: 56,
        paddingBottom: 32,
        paddingLeft: 20,
        paddingRight: 20,
        boxSizing: "border-box",
        color: "var(--ink)",
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
}

// Kept for backwards compatibility — used to render white dots
// over a gradient. On a white canvas we don't want dots so this
// is now a no-op.
export function Sparkles() {
  return null;
}

export function BackChevron({ onBack }: { onBack: () => void }) {
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
        border: "2px solid var(--border)",
        cursor: "pointer",
        background: "var(--surface)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 2px 0 var(--border)",
        zIndex: 5,
        color: "var(--ink-muted)",
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
  );
}

export function SpeechBubble({
  text,
  onDone,
  tail = "up",
}: {
  text: string;
  onDone?: () => void;
  tail?: "up" | "down" | "none";
}) {
  return (
    <div
      style={{
        position: "relative",
        padding: "16px 20px",
        borderRadius: 20,
        background: "var(--surface)",
        border: "2px solid var(--border)",
        boxShadow: "0 2px 0 var(--border)",
        color: "var(--ink)",
        animation: "bubble-pop 0.35s cubic-bezier(0.22, 1.5, 0.36, 1)",
        fontFamily: "var(--font-nunito), system-ui",
        fontSize: 16,
        fontWeight: 700,
        lineHeight: 1.45,
        letterSpacing: 0,
        minHeight: 80,
      }}
    >
      <Typewriter text={text} onDone={onDone} />
      {tail !== "none" && (
        <>
          {/* Border tail (slightly larger, behind) */}
          <span
            aria-hidden
            style={{
              position: "absolute",
              ...(tail === "up"
                ? { top: -12, left: "50%", transform: "translateX(-50%) rotate(45deg)" }
                : { bottom: -12, left: "50%", transform: "translateX(-50%) rotate(45deg)" }),
              width: 18,
              height: 18,
              background: "var(--border)",
              borderRadius: 3,
            }}
          />
          {/* Fill tail (smaller, in front) */}
          <span
            aria-hidden
            style={{
              position: "absolute",
              ...(tail === "up"
                ? { top: -8, left: "50%", transform: "translateX(-50%) rotate(45deg)" }
                : { bottom: -8, left: "50%", transform: "translateX(-50%) rotate(45deg)" }),
              width: 14,
              height: 14,
              background: "var(--surface)",
              borderRadius: 2,
            }}
          />
        </>
      )}
    </div>
  );
}

// The 3D button — coral primary by default. Accepts an explicit
// color/textColor only for special cases (e.g. lavender secondary).
export function ChunkyButton({
  children,
  onClick,
  disabled,
  color,
  textColor,
  variant = "primary",
}: {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  color?: string;
  textColor?: string;
  variant?: "primary" | "secondary" | "ghost";
}) {
  const className =
    variant === "secondary"
      ? "btn-3d btn-3d--secondary"
      : variant === "ghost"
      ? "btn-3d btn-3d--ghost"
      : "btn-3d";

  const style: React.CSSProperties = {};
  if (color) style.background = color;
  if (textColor) style.color = textColor;

  return (
    <button onClick={onClick} disabled={disabled} className={className} style={style}>
      {children}
    </button>
  );
}

export function BugsyStage({
  mood,
  tint,
  hat,
  animationKey,
  size = 220,
  lean,
}: {
  mood: Mood;
  tint: number;
  hat?: string;
  animationKey?: string | number;
  size?: number;
  lean?: boolean;
}) {
  return (
    <div
      key={animationKey}
      style={{
        display: "flex",
        justifyContent: "center",
        animation: lean
          ? "bugsy-lean 3.6s ease-in-out infinite"
          : "bugsy-pop 0.6s cubic-bezier(0.22, 1.5, 0.36, 1)",
      }}
    >
      <Bobo mood={mood} tint={tint} size={size} hat={hat} />
    </div>
  );
}
