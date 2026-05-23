"use client";

import { Bobo } from "./Mascot";
import type { Mood, Tab } from "../lib/data";

export type TourStep = {
  tab: Tab;
  text: string;
  mood: Mood;
};

// Bottom-panel coachmark. Sits above the tab bar but below the
// status area. The user sees the actual tab content underneath as
// the tour navigates through Home → Projects → Clan → Me.
export function TourOverlay({
  step,
  steps,
  tint,
  onNext,
  onSkip,
}: {
  step: number;
  steps: TourStep[];
  tint: number;
  onNext: () => void;
  onSkip: () => void;
}) {
  const current = steps[step];
  const isLast = step + 1 >= steps.length;

  return (
    <>
      {/* Subtle dim — keeps the underlying tab content visible
          but signals "you can't tap through this right now". */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(20, 16, 30, 0.18)",
          zIndex: 40,
          pointerEvents: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      />

      {/* Skip button — top-right, always visible */}
      <button
        onClick={onSkip}
        style={{
          position: "fixed",
          top: 16,
          right: 16,
          zIndex: 60,
          background: "var(--surface)",
          border: "2px solid var(--border)",
          borderRadius: 999,
          padding: "6px 14px",
          fontFamily: "var(--font-nunito), system-ui",
          fontSize: 12,
          fontWeight: 800,
          color: "var(--ink-muted)",
          boxShadow: "0 2px 0 var(--border)",
          cursor: "pointer",
          letterSpacing: 0.3,
          textTransform: "uppercase",
        }}
      >
        Skip tour
      </button>

      {/* Bottom panel — Bugsy + bubble + Next, anchored above tab bar */}
      <div
        style={{
          position: "fixed",
          left: 16,
          right: 16,
          bottom: 96, // above the 80px tab bar
          zIndex: 50,
          padding: 16,
          borderRadius: 22,
          background: "var(--surface)",
          border: "2px solid var(--border)",
          boxShadow: "0 6px 0 var(--border), 0 14px 28px rgba(20,16,30,0.18)",
          display: "flex",
          gap: 14,
          alignItems: "center",
          maxWidth: 448,
          margin: "0 auto",
          animation: "bubble-pop 0.35s cubic-bezier(0.22, 1.5, 0.36, 1)",
        }}
        key={step}
      >
        {/* Bugsy */}
        <div style={{ flexShrink: 0, marginTop: -28 }}>
          <Bobo mood={current.mood} tint={tint} size={84} />
        </div>

        {/* Text + dots */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontFamily: "var(--font-nunito), system-ui",
              fontSize: 14.5,
              fontWeight: 700,
              color: "var(--ink)",
              lineHeight: 1.35,
              letterSpacing: -0.1,
            }}
          >
            {current.text}
          </div>
          <div style={{ display: "flex", gap: 5, marginTop: 8 }}>
            {steps.map((_, i) => (
              <span
                key={i}
                aria-hidden
                style={{
                  width: i === step ? 16 : 6,
                  height: 6,
                  borderRadius: 999,
                  background: i === step ? "var(--primary)" : "var(--border)",
                  transition: "width 0.2s ease, background 0.2s ease",
                }}
              />
            ))}
          </div>
        </div>

        {/* Next / Done */}
        <button
          onClick={onNext}
          className="btn-3d"
          style={{
            width: "auto",
            minHeight: 48,
            padding: "10px 18px",
            fontSize: 14,
            flexShrink: 0,
          }}
        >
          {isLast ? "Done" : "Next →"}
        </button>
      </div>
    </>
  );
}
