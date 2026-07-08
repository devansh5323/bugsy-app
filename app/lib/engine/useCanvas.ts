"use client";

// DPR-aware canvas setup — games draw in a fixed logical coordinate
// space (e.g. 400×800) and this hook handles the devicePixelRatio
// backing-store scaling once, at mount/DPR-change time, never per
// frame. CSS sizing (how the canvas fits the screen) stays with the
// game's layout. See docs/GAME_ENGINE.md, docs/GAME_STANDARDS.md.

import { useCallback, useEffect, useRef } from "react";

export function useCanvas(logicalWidth: number, logicalHeight: number): {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  // 2D context pre-scaled so all drawing uses logical coordinates.
  // Null until the canvas mounts (or if 2D context is unavailable).
  getCtx: () => CanvasRenderingContext2D | null;
} {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const configure = () => {
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      canvas.width = Math.round(logicalWidth * dpr);
      canvas.height = Math.round(logicalHeight * dpr);
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctxRef.current = ctx;
    };

    configure();

    // DPR changes when the page moves between screens or the user
    // zooms — matchMedia fires exactly on that boundary. The query is
    // pinned to the *current* DPR, so it must re-arm after each change
    // or it only ever fires once.
    let disposed = false;
    let media: MediaQueryList | null = null;
    const onChange = () => {
      if (disposed) return;
      configure();
      arm();
    };
    const arm = () => {
      media?.removeEventListener("change", onChange);
      media = window.matchMedia(
        `(resolution: ${window.devicePixelRatio || 1}dppx)`,
      );
      media.addEventListener("change", onChange);
    };
    arm();
    return () => {
      disposed = true;
      media?.removeEventListener("change", onChange);
    };
  }, [logicalWidth, logicalHeight]);

  const getCtx = useCallback(() => ctxRef.current, []);

  return { canvasRef, getCtx };
}
