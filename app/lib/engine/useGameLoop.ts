"use client";

// The shared requestAnimationFrame loop — names the pattern both
// existing games hand-rolled: schedule/cancel the frame, hand deltaMs
// to a callback, and keep per-frame state in refs so React never
// re-renders at 60fps. See docs/GAME_ENGINE.md, docs/GAME_STANDARDS.md.

import { useEffect, useRef } from "react";

// After a tab-switch the next delta can be seconds long — clamping
// stops physics from teleporting through walls on resume.
const DEFAULT_MAX_DELTA_MS = 50;

export function useGameLoop(
  onFrame: (deltaMs: number) => void,
  opts: { running: boolean; maxDeltaMs?: number },
): void {
  const { running, maxDeltaMs = DEFAULT_MAX_DELTA_MS } = opts;

  // Latest-callback ref so the loop never restarts (or goes stale)
  // when the component re-renders with a new closure.
  const onFrameRef = useRef(onFrame);
  useEffect(() => {
    onFrameRef.current = onFrame;
  });

  useEffect(() => {
    if (!running) return;

    let rafId = 0;
    let last = performance.now();

    const frame = (now: number) => {
      const delta = Math.min(now - last, maxDeltaMs);
      last = now;
      onFrameRef.current(delta);
      rafId = requestAnimationFrame(frame);
    };

    rafId = requestAnimationFrame(frame);

    // Cancel on pause/unmount — a leaked loop from an exited game is a
    // real battery bug, not a theoretical one (GAME_STANDARDS.md).
    return () => cancelAnimationFrame(rafId);
  }, [running, maxDeltaMs]);
}
