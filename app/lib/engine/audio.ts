// Sound manager — Web Audio tone synthesis, no audio asset files.
// One lazily-created AudioContext shared by every game (browser
// autoplay policy requires creation/resume from a real user gesture,
// so GameShell calls unlockAudio() from its Start button). Games call
// the semantic presets so SFX feel consistent across the platform.
// See docs/GAME_ENGINE.md and docs/GAME_STANDARDS.md.

let ctx: AudioContext | null = null;
let creationFailed = false;
let muted = false;

// Call from a user gesture (tap/click) before any programmatic sound.
export function unlockAudio(): void {
  const c = getCtx();
  if (c && c.state === "suspended") {
    void c.resume().catch(() => {
      // resume can reject on some webviews; sound stays off, game plays on
    });
  }
}

export function setMuted(value: boolean): void {
  muted = value;
}

export function isMuted(): boolean {
  return muted;
}

function getCtx(): AudioContext | null {
  if (ctx) return ctx;
  if (creationFailed || typeof window === "undefined") return null;
  try {
    ctx = new AudioContext();
  } catch {
    // Games must stay playable without sound (GAME_STANDARDS.md).
    creationFailed = true;
    return null;
  }
  return ctx;
}

export function playTone(
  freq: number,
  durationMs: number,
  type: OscillatorType = "sine",
  volume = 0.18,
): void {
  if (muted) return;
  const c = getCtx();
  if (!c || c.state !== "running") return;

  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;

  // Short attack then exponential decay — the shared "beep" envelope
  // both existing games converged on independently.
  const now = c.currentTime;
  const durS = durationMs / 1000;
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(volume, now + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + durS);

  osc.connect(gain);
  gain.connect(c.destination);
  osc.start(now);
  osc.stop(now + durS + 0.02);
}

// ── Semantic presets ─────────────────────────────────────────────
// Every scoring action gets immediate audio feedback (GAME_UI_GUIDELINES.md);
// these keep that feedback consistent-feeling across games.

// A successful in-round action (caught a snack, cleared a gap).
export function playHit(): void {
  playTone(660, 90, "triangle", 0.16);
}

// A bigger payoff moment (round cleared, game won) — quick ascending pair.
export function playSuccess(): void {
  playTone(523, 110, "triangle", 0.16); // C5
  if (typeof window !== "undefined") {
    window.setTimeout(() => playTone(784, 160, "triangle", 0.16), 90); // G5
  }
}

// A miss/life-lost moment — low and short, never harsh.
export function playFail(): void {
  playTone(196, 180, "sine", 0.14);
}
