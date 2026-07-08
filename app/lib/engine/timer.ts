// Frame-driven timers for game loops. Both count via the deltaMs the
// RAF loop already produces (useGameLoop), never wall-clock reads — so
// they pause for free when the loop pauses and stay unit-testable.
// See docs/GAME_ENGINE.md.

export type GameTimer = {
  // Advance by one frame's delta. Call from the useGameLoop callback.
  tick: (deltaMs: number) => void;
  elapsedMs: () => number;
  reset: () => void;
};

export function createGameTimer(): GameTimer {
  let elapsed = 0;
  return {
    tick(deltaMs: number): void {
      elapsed += deltaMs;
    },
    elapsedMs: () => elapsed,
    reset(): void {
      elapsed = 0;
    },
  };
}

export type Countdown = {
  tick: (deltaMs: number) => void;
  remainingMs: () => number;
  expired: () => boolean;
  reset: (totalMs?: number) => void;
};

// For time-boxed rounds ("catch as many as you can in 60s").
export function createCountdown(totalMs: number): Countdown {
  let total = totalMs;
  let elapsed = 0;
  return {
    tick(deltaMs: number): void {
      elapsed = Math.min(total, elapsed + deltaMs);
    },
    remainingMs: () => total - elapsed,
    expired: () => elapsed >= total,
    reset(nextTotalMs?: number): void {
      if (nextTotalMs !== undefined) total = nextTotalMs;
      elapsed = 0;
    },
  };
}

// mm:ss for HUD display ("1:05"). Rounds up so a countdown shows "0:01"
// until it actually expires rather than sitting on "0:00" for a second.
export function formatMs(ms: number): string {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}
