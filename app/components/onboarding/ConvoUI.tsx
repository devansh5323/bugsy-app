"use client";

import type { ReactNode } from "react";
import { Bobo } from "../Mascot";
import { Typewriter } from "../Typewriter";
import type { Mood } from "../../lib/data";

// Gradient palette — both child and parent flows pick from the same array,
// indexed by step. Both feel vibrant; parent just goes through more of them.
export const GRADIENTS = [
  "linear-gradient(160deg, oklch(78% 0.16 320) 0%, oklch(80% 0.18 25) 100%)",   // pink → coral
  "linear-gradient(160deg, oklch(80% 0.17 60) 0%,  oklch(78% 0.15 30) 100%)",   // sun
  "linear-gradient(160deg, oklch(75% 0.15 195) 0%, oklch(72% 0.16 250) 100%)",  // sky → teal
  "linear-gradient(160deg, oklch(78% 0.16 145) 0%, oklch(80% 0.16 175) 100%)",  // mint
  "linear-gradient(160deg, oklch(78% 0.17 320) 0%, oklch(78% 0.18 55) 100%)",   // rainbow finale
  "linear-gradient(160deg, oklch(78% 0.14 280) 0%, oklch(78% 0.15 320) 100%)",  // lavender
  "linear-gradient(160deg, oklch(78% 0.14 225) 0%, oklch(78% 0.15 195) 100%)",  // azure
];

export function ConvoStage({
  step,
  children,
}: {
  step: number;
  children: ReactNode;
}) {
  return (
    <div
      className="child-flow"
      style={{
        position: "absolute",
        inset: 0,
        background: GRADIENTS[step % GRADIENTS.length],
        display: "flex",
        flexDirection: "column",
        paddingTop: 56,
        paddingBottom: 32,
        paddingLeft: 20,
        paddingRight: 20,
        boxSizing: "border-box",
        color: "#fff",
        overflow: "hidden",
      }}
    >
      <Sparkles />
      {children}
    </div>
  );
}

export function Sparkles() {
  const dots = [
    { x: 12, y: 14, d: 0,   s: 8 },
    { x: 88, y: 18, d: 0.4, s: 10 },
    { x: 22, y: 38, d: 0.9, s: 6 },
    { x: 80, y: 46, d: 1.5, s: 7 },
    { x: 16, y: 70, d: 0.6, s: 9 },
    { x: 86, y: 78, d: 1.1, s: 8 },
  ];
  return (
    <>
      {dots.map((d, i) => (
        <div
          key={i}
          aria-hidden
          style={{
            position: "absolute",
            top: `${d.y}%`,
            left: `${d.x}%`,
            width: d.s,
            height: d.s,
            borderRadius: 999,
            background: "#fff",
            opacity: 0.85,
            animation: `sparkle 2.4s ease-in-out ${d.d}s infinite`,
            pointerEvents: "none",
          }}
        />
      ))}
    </>
  );
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
        width: 38,
        height: 38,
        borderRadius: 999,
        border: "none",
        cursor: "pointer",
        background: "rgba(255,255,255,0.95)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
        zIndex: 5,
      }}
    >
      <svg width="14" height="14" viewBox="0 0 14 14">
        <path
          d="M9 1L3 7l6 6"
          stroke="var(--ink)"
          strokeWidth="2"
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
        borderRadius: 24,
        background: "#fff",
        color: "var(--ink)",
        boxShadow: "0 14px 36px rgba(0,0,0,0.18)",
        animation: "bubble-pop 0.35s cubic-bezier(0.22, 1.5, 0.36, 1)",
        fontFamily: "var(--font-inter), system-ui",
        fontSize: 16,
        lineHeight: 1.45,
        letterSpacing: -0.1,
        minHeight: 80,
      }}
    >
      <Typewriter text={text} onDone={onDone} />
      {tail !== "none" && (
        <span
          aria-hidden
          style={{
            position: "absolute",
            ...(tail === "up"
              ? { top: -8, left: "50%", transform: "translateX(-50%) rotate(45deg)" }
              : { bottom: -8, left: "50%", transform: "translateX(-50%) rotate(45deg)" }),
            width: 18,
            height: 18,
            background: "#fff",
          }}
        />
      )}
    </div>
  );
}

export function ChunkyButton({
  children,
  onClick,
  disabled,
  color = "#fff",
  textColor = "var(--ink)",
}: {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  color?: string;
  textColor?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="chunky-btn"
      style={{ background: color, color: textColor, width: "100%" }}
    >
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
