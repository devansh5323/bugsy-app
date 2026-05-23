"use client";

import { createContext, useContext, useEffect, type ReactNode } from "react";
import { Bobo } from "../Mascot";
import { Typewriter } from "../Typewriter";
import type { Mood } from "../../lib/data";
import { useVoice } from "../../lib/voice";

// Progress through the current onboarding flow (0–1). Provided by
// page.tsx. ConvoStage reads it and renders the progress bar.
// null = no progress bar (e.g., welcome / who / login standalone).
export const ProgressContext = createContext<number | null>(null);

// Step-keyed accent washes. White canvas + soft tint behind Bugsy.
const STEP_WASHES = [
  "rgba(255, 92, 138, 0.16)",   // coral primary
  "rgba(167, 139, 250, 0.18)",  // lavender
  "rgba(255, 200, 0, 0.20)",    // accent yellow
  "rgba(206, 130, 255, 0.18)",  // accent purple
  "rgba(255, 150, 0, 0.18)",    // streak orange
  "rgba(255, 124, 168, 0.20)",  // soft coral
  "rgba(167, 139, 250, 0.18)",  // lavender repeat
];

export const GRADIENTS = STEP_WASHES;

export function ConvoStage({
  step,
  children,
}: {
  step: number;
  children: ReactNode;
}) {
  const wash = STEP_WASHES[step % STEP_WASHES.length];
  const progress = useContext(ProgressContext);
  // Add headroom for the progress bar so it doesn't collide with
  // Bugsy on tightly packed screens.
  const paddingTop = progress !== null ? 68 : 56;
  return (
    <div
      className="child-flow"
      style={{
        position: "absolute",
        inset: 0,
        background: `radial-gradient(ellipse 90% 55% at 50% 0%, ${wash} 0%, transparent 70%), var(--canvas)`,
        display: "flex",
        flexDirection: "column",
        paddingTop,
        paddingBottom: 32,
        paddingLeft: 20,
        paddingRight: 20,
        boxSizing: "border-box",
        color: "var(--ink)",
        overflow: "hidden",
      }}
    >
      {progress !== null && <ProgressBar value={progress} />}
      {/* Voice toggle — top-right, present on every conversational screen */}
      <VoiceToggle />
      {children}
    </div>
  );
}

function ProgressBar({ value }: { value: number }) {
  const pct = Math.max(0, Math.min(1, value));
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        top: 24,
        left: 64,
        right: 64,
        height: 16,
        background: "var(--surface-2)",
        borderRadius: 9999,
        overflow: "hidden",
        zIndex: 4,
      }}
    >
      <div
        style={{
          width: `${pct * 100}%`,
          height: "100%",
          background: "var(--accent-yellow)",
          borderRadius: 9999,
          transition: "width 0.55s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      />
    </div>
  );
}

// Kept for backwards compatibility — old code imported this. No-op on white canvas.
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

export function VoiceToggle() {
  const { enabled, toggle } = useVoice();
  return (
    <button
      onClick={toggle}
      aria-label={enabled ? "Mute Bugsy" : "Hear Bugsy"}
      aria-pressed={enabled}
      style={{
        position: "absolute",
        top: 14,
        right: 14,
        width: 40,
        height: 40,
        borderRadius: 12,
        border: enabled
          ? "2px solid var(--primary)"
          : "2px solid var(--border)",
        cursor: "pointer",
        background: enabled ? "var(--accent-soft)" : "var(--surface)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: enabled
          ? "0 2px 0 var(--primary-shadow)"
          : "0 2px 0 var(--border)",
        zIndex: 5,
        color: enabled ? "var(--primary)" : "var(--ink-muted)",
      }}
    >
      {enabled ? (
        // sound on — speaker + waves
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M3 9v6h4l5 4V5L7 9H3z" fill="currentColor" />
          <path
            d="M16 8a5 5 0 010 8M19 5a9 9 0 010 14"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      ) : (
        // sound off — speaker + X
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M3 9v6h4l5 4V5L7 9H3z" fill="currentColor" />
          <path
            d="M16 9l5 5m0-5l-5 5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      )}
    </button>
  );
}

// The speech bubble — sized to its text (no minHeight), text centered,
// and triggers voice synthesis when the text changes if voice is on.
// Borderless: just the surface fill + soft drop shadow + an
// up-pointing tail toward Bugsy.
export function SpeechBubble({
  text,
  onDone,
}: {
  text: string;
  onDone?: () => void;
}) {
  const { speak, enabled, stop } = useVoice();

  // Speak when the bubble's text changes (or when voice is toggled
  // on). speak() coalesces internally — multiple rapid calls only
  // produce one utterance, so we don't need a cleanup here.
  useEffect(() => {
    if (enabled) speak(text);
  }, [text, enabled, speak]);

  // Stop speech (and clear any pending utterance timer) when this
  // bubble unmounts — i.e. navigating to a different screen.
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return (
    <div
      style={{
        position: "relative",
        padding: "14px 22px",
        borderRadius: 20,
        background: "var(--surface)",
        border: "1px solid var(--border-strong)",
        color: "var(--ink)",
        animation: "bubble-pop 0.35s cubic-bezier(0.22, 1.5, 0.36, 1)",
        fontFamily: "var(--font-nunito), system-ui",
        fontSize: 16,
        fontWeight: 700,
        lineHeight: 1.45,
        letterSpacing: 0,
        textAlign: "center",
      }}
    >
      <Typewriter text={text} onDone={onDone} />
      {/* tail — rotated square with matching hairline border on
          two sides so the outline runs continuously from the
          bubble around the tail */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          top: -8,
          left: "50%",
          transform: "translateX(-50%) rotate(45deg)",
          width: 14,
          height: 14,
          background: "var(--surface)",
          borderTop: "1px solid var(--border-strong)",
          borderLeft: "1px solid var(--border-strong)",
          borderRadius: 2,
        }}
      />
    </div>
  );
}

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
