"use client";

// Shared in-game HUD — big legible numbers (they're the payoff of the
// interaction, per docs/GAME_UI_GUIDELINES.md), hearts for lives, and
// an optional countdown. Sits top-left so it never collides with the
// GameShell exit/pause buttons pinned top-right. Purely presentational:
// games mirror ref-held values into React state at human timescale and
// pass them down — never per frame.

import { formatMs } from "../../lib/engine/timer";

export function HUD({
  score,
  best,
  lives,
  maxLives,
  timeLeftMs,
}: {
  score: number;
  // Shown as a quiet "Best: n" under the score when provided.
  best?: number;
  // When provided, renders filled/empty hearts (lives of maxLives).
  lives?: number;
  maxLives?: number;
  // When provided, renders a m:ss countdown.
  timeLeftMs?: number;
}) {
  return (
    <div
      style={{
        position: "absolute",
        top: 12,
        left: 12,
        zIndex: 10,
        display: "flex",
        flexDirection: "column",
        gap: 4,
        padding: "10px 14px",
        borderRadius: 16,
        background: "rgba(0,0,0,0.35)",
        color: "#fff",
        pointerEvents: "none",
        fontVariantNumeric: "tabular-nums",
      }}
    >
      <div style={{ fontSize: 32, fontWeight: 800, lineHeight: 1 }}>{score}</div>
      {best !== undefined && best > 0 && (
        <div style={{ fontSize: 13, fontWeight: 600, opacity: 0.8 }}>
          Best: {best}
        </div>
      )}
      {lives !== undefined && (
        <div style={{ fontSize: 16, letterSpacing: 2 }} aria-label={`${lives} lives left`}>
          {/* Filled + empty hearts, not color-only, so state reads for
              color-blind players too (GAME_UI_GUIDELINES.md). */}
          {"❤️".repeat(Math.max(0, lives))}
          {"🤍".repeat(Math.max(0, (maxLives ?? lives) - lives))}
        </div>
      )}
      {timeLeftMs !== undefined && (
        <div style={{ fontSize: 20, fontWeight: 700 }}>{formatMs(timeLeftMs)}</div>
      )}
    </div>
  );
}
