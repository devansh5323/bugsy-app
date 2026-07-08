"use client";

// GameShell — the shared chrome around every game (docs/GAME_ENGINE.md):
// intro speech bubble, exit button, pause overlay, results screen. It
// owns the GameStatus transitions (intro → playing → paused ⇄ playing
// → results) and the analytics events those transitions imply, so
// individual games render only their play area and mechanics.
//
// Bugsy's tone rules apply throughout (docs/GAME_UI_GUIDELINES.md):
// results are warm regardless of outcome, and every tappable control
// here is ≥44×44px with the exit always in the top-right corner.

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import { TINT } from "../../lib/data";
import {
  trackGameCompleted,
  trackGameExitedEarly,
  trackGamePaused,
  trackGameResumed,
  trackGameStarted,
} from "../../lib/engine/analytics";
import { unlockAudio } from "../../lib/engine/audio";
import { buildResult } from "../../lib/engine/results";
import type {
  GameConfig,
  GameOutcome,
  GameResult,
  GameStatus,
} from "../../lib/engine/types";
import { Bobo } from "../Mascot";
import { Typewriter } from "../Typewriter";
import { PrimaryButton, TextButton } from "../ui";

export type GameShellApi = {
  status: GameStatus;
  // Increments on every "play again" — key internal game state on this
  // (or reset in an effect watching it) to start a fresh run.
  runId: number;
  pause: () => void;
  resume: () => void;
  // Call exactly once per run when the game reaches its end state.
  finish: (opts: {
    score: number;
    outcome: Exclude<GameOutcome, "quit">;
    difficultyLevelReached: number;
  }) => void;
};

const GameShellContext = createContext<GameShellApi | null>(null);

// How a game reaches its shell: render the game component as a child
// of <GameShell> and call this hook inside it.
export function useGameShell(): GameShellApi {
  const api = useContext(GameShellContext);
  if (!api) {
    throw new Error("useGameShell must be used inside <GameShell>");
  }
  return api;
}

export function GameShell({
  config,
  introLines,
  onExit,
  onComplete,
  resultLine,
  resultDetails,
  tint = TINT,
  children,
}: {
  config: GameConfig;
  // Bugsy's pre-game lines, shown one per tap-through with the
  // typewriter effect. Keep each to one short line a child can read.
  introLines: string[];
  onExit: () => void;
  // Receives the finished run — the app credits XP here (the existing
  // onEarnXp pattern) and decides what happens next.
  onComplete?: (result: GameResult) => void;
  // Bugsy's reaction on the results screen. Defaults below stay warm
  // for both outcomes — never override with anything that shames a loss.
  resultLine?: (result: GameResult) => string;
  // Extra game-specific stats rendered under the score on the results
  // screen (best streak, misses, reaction speed, ...). Same tone rules
  // apply: numbers are fine, judgment is not.
  resultDetails?: (result: GameResult) => ReactNode;
  tint?: number;
  // The game's play area; it reads its shell via useGameShell().
  children: ReactNode;
}) {
  const [status, setStatus] = useState<GameStatus>("intro");
  const [introStep, setIntroStep] = useState(0);
  const [introTyped, setIntroTyped] = useState(false);
  const [runId, setRunId] = useState(0);
  const [result, setResult] = useState<GameResult | null>(null);
  const playStartedAtRef = useRef(0);
  const lastLevelRef = useRef(config.difficulty.startLevel);

  const startPlaying = useCallback(() => {
    unlockAudio();
    playStartedAtRef.current = performance.now();
    lastLevelRef.current = config.difficulty.startLevel;
    trackGameStarted(config.id, config.domain, config.difficulty.startLevel);
    setStatus("playing");
  }, [config]);

  const pause = useCallback(() => {
    setStatus((s) => {
      if (s !== "playing") return s;
      trackGamePaused(config.id, config.domain);
      return "paused";
    });
  }, [config]);

  const resume = useCallback(() => {
    setStatus((s) => {
      if (s !== "paused") return s;
      trackGameResumed(config.id, config.domain);
      return "playing";
    });
  }, [config]);

  const finish = useCallback<GameShellApi["finish"]>(
    (opts) => {
      lastLevelRef.current = opts.difficultyLevelReached;
      const finished = buildResult({
        config,
        score: opts.score,
        durationMs: performance.now() - playStartedAtRef.current,
        outcome: opts.outcome,
        difficultyLevelReached: opts.difficultyLevelReached,
        timestamp: Date.now(),
      });
      trackGameCompleted(finished, config.domain);
      setResult(finished);
      setStatus("results");
      onComplete?.(finished);
    },
    [config, onComplete],
  );

  const exit = useCallback(() => {
    if (status === "playing" || status === "paused") {
      trackGameExitedEarly(config.id, config.domain, {
        elapsedMs: performance.now() - playStartedAtRef.current,
        difficultyLevelAtExit: lastLevelRef.current,
      });
    }
    onExit();
  }, [status, config, onExit]);

  const playAgain = useCallback(() => {
    setResult(null);
    setRunId((r) => r + 1);
    startPlaying();
  }, [startPlaying]);

  const defaultResultLine = (r: GameResult): string =>
    r.outcome === "cleared"
      ? `You did it! ${r.score} points — I knew you could!`
      : `Almost! Let's try again — I'm right here with you.`;

  const api = useMemo<GameShellApi>(
    () => ({ status, runId, pause, resume, finish }),
    [status, runId, pause, resume, finish],
  );

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {/* Play area — keyed by runId so "play again" gives the game a
          clean mount instead of every game writing its own reset path. */}
      <GameShellContext.Provider value={api}>
        <div key={runId} style={{ position: "absolute", inset: 0 }}>
          {children}
        </div>
      </GameShellContext.Provider>

      {/* Exit — same corner, same size, in every game. */}
      <button
        onClick={exit}
        aria-label="Exit game"
        style={{
          position: "absolute",
          top: 12,
          right: 12,
          width: 44,
          height: 44,
          borderRadius: 22,
          border: "none",
          background: "rgba(0,0,0,0.35)",
          color: "#fff",
          fontSize: 20,
          lineHeight: "44px",
          textAlign: "center",
          cursor: "pointer",
          zIndex: 30,
        }}
      >
        ✕
      </button>

      {/* Pause control while playing. */}
      {status === "playing" && (
        <button
          onClick={pause}
          aria-label="Pause game"
          style={{
            position: "absolute",
            top: 12,
            right: 64,
            width: 44,
            height: 44,
            borderRadius: 22,
            border: "none",
            background: "rgba(0,0,0,0.35)",
            color: "#fff",
            fontSize: 18,
            lineHeight: "44px",
            textAlign: "center",
            cursor: "pointer",
            zIndex: 30,
          }}
        >
          ⏸
        </button>
      )}

      {/* Intro — Bugsy talks the child in, one line per tap. */}
      {status === "intro" && (
        <div style={overlayStyle}>
          <Bobo mood="excited" tint={tint} size={160} />
          <div style={bubbleStyle}>
            <Typewriter
              key={introStep}
              text={introLines[introStep] ?? ""}
              speedMultiplier={1.2}
              onDone={() => setIntroTyped(true)}
            />
          </div>
          {introTyped && introStep < introLines.length - 1 && (
            <PrimaryButton
              onClick={() => {
                setIntroTyped(false);
                setIntroStep((s) => s + 1);
              }}
            >
              Next
            </PrimaryButton>
          )}
          {introTyped && introStep >= introLines.length - 1 && (
            <PrimaryButton onClick={startPlaying}>Let&apos;s play!</PrimaryButton>
          )}
        </div>
      )}

      {/* Pause overlay. */}
      {status === "paused" && (
        <div style={overlayStyle}>
          <Bobo mood="thinking" tint={tint} size={140} />
          <div style={bubbleStyle}>Taking a breather. Ready when you are!</div>
          <PrimaryButton onClick={resume}>Keep playing</PrimaryButton>
          <TextButton onClick={exit}>Exit game</TextButton>
        </div>
      )}

      {/* Results — warm for every outcome. */}
      {status === "results" && result && (
        <div style={overlayStyle}>
          <Bobo
            mood={result.outcome === "cleared" ? "cheer" : "happy"}
            tint={tint}
            size={160}
          />
          <div style={bubbleStyle}>{(resultLine ?? defaultResultLine)(result)}</div>
          <div
            style={{
              fontSize: 44,
              fontWeight: 800,
              color: "#fff",
              lineHeight: 1.1,
            }}
          >
            {result.score}
          </div>
          {result.xpEarned > 0 && (
            <div style={{ fontSize: 18, fontWeight: 700, color: "#FFD34D" }}>
              +{result.xpEarned} XP
            </div>
          )}
          {resultDetails?.(result)}
          <PrimaryButton onClick={playAgain}>Play again</PrimaryButton>
          <TextButton onClick={exit}>Back home</TextButton>
        </div>
      )}
    </div>
  );
}

const overlayStyle: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  zIndex: 20,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 16,
  padding: 24,
  background: "rgba(12, 16, 28, 0.82)",
};

const bubbleStyle: React.CSSProperties = {
  maxWidth: 320,
  padding: "14px 18px",
  borderRadius: 18,
  background: "#fff",
  color: "#1c2030",
  fontSize: 17,
  fontWeight: 600,
  textAlign: "center",
  lineHeight: 1.35,
};
