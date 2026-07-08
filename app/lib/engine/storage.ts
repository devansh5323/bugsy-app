// Namespaced, versioned localStorage helpers so every game doesn't
// invent its own key convention (the way `birdspike-best` and
// `bugsy-snack-scores` did independently). New games use these instead
// of touching localStorage directly. See docs/GAME_ENGINE.md.

const PREFIX = "ah:v1:game:";

function key(gameId: string): string {
  return `${PREFIX}${gameId}`;
}

// localStorage can be unavailable (SSR pass, private-mode quota,
// embedded webviews) — every access degrades to the fallback rather
// than crashing a game over persistence.
export function getGameState<T>(gameId: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key(gameId));
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function setGameState<T>(gameId: string, data: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key(gameId), JSON.stringify(data));
  } catch {
    // Quota/security errors: persistence is best-effort, never fatal.
  }
}

export function clearGameState(gameId: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key(gameId));
  } catch {
    // ignore
  }
}
