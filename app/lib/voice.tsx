"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

type VoiceState = {
  enabled: boolean;
  toggle: () => void;
  speak: (text: string) => void;
  stop: () => void;
};

const VoiceCtx = createContext<VoiceState>({
  enabled: false,
  toggle: () => {},
  speak: () => {},
  stop: () => {},
});

// Friendly English voices to prefer, in priority order.
const PREFERRED_VOICE_NAMES = [
  "Samantha", // macOS / iOS default friendly female
  "Karen",    // macOS Aus
  "Moira",    // macOS IE
  "Tessa",    // macOS ZA
  "Google US English",
  "Google UK English Female",
  "Microsoft Aria Online (Natural) - English (United States)",
];

function pickVoice(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  for (const name of PREFERRED_VOICE_NAMES) {
    const v = voices.find((v) => v.name === name);
    if (v) return v;
  }
  return voices.find((v) => v.lang.startsWith("en")) ?? voices[0] ?? null;
}

function sanitize(text: string): string {
  return text
    .replace(/…/g, ", ")
    .replace(/[—–]/g, ", ")
    .replace(/[→←↑↓]/g, "")
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, "")
    .trim();
}

export function VoiceProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false);

  // Single pending utterance — every speak() call clears the
  // previous timer before scheduling its own, so React StrictMode
  // double-mounting and rapid screen transitions don't queue up
  // multiple competing utterances that cancel each other out.
  const pendingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load saved preference once on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.localStorage.getItem("bugsy-voice") === "on") {
      setEnabled(true);
    }
  }, []);

  // Prime the voice list — voices load async; getVoices() can return [] on first call.
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.getVoices();
    const handler = () => window.speechSynthesis.getVoices();
    window.speechSynthesis.addEventListener("voiceschanged", handler);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", handler);
    };
  }, []);

  const stop = useCallback(() => {
    if (pendingTimerRef.current !== null) {
      clearTimeout(pendingTimerRef.current);
      pendingTimerRef.current = null;
    }
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
    } catch {
      // ignore
    }
  }, []);

  const toggle = useCallback(() => {
    setEnabled((prev) => {
      const next = !prev;
      if (typeof window === "undefined") return next;

      window.localStorage.setItem("bugsy-voice", next ? "on" : "off");

      if ("speechSynthesis" in window) {
        if (next) {
          // iOS requires the very first speak() to be inside a
          // user gesture; some Chrome builds also reject whitespace-
          // only utterances. We use a tiny real word at near-zero
          // volume to satisfy both engines.
          try {
            const warmup = new SpeechSynthesisUtterance("hi");
            warmup.volume = 0.001;
            warmup.rate = 2;
            window.speechSynthesis.speak(warmup);
            // Chrome occasionally leaves the engine paused after
            // instantiation — resume() is a no-op if it isn't.
            if (window.speechSynthesis.paused) {
              window.speechSynthesis.resume();
            }
          } catch {}
        } else {
          if (pendingTimerRef.current !== null) {
            clearTimeout(pendingTimerRef.current);
            pendingTimerRef.current = null;
          }
          try {
            window.speechSynthesis.cancel();
          } catch {}
        }
      }
      return next;
    });
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (!enabled) return;
      if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

      const cleaned = sanitize(text);
      if (!cleaned) return;

      // Coalesce: if a previous speak() is still waiting on its
      // post-cancel timer, blow it away — only the latest call
      // should actually produce sound.
      if (pendingTimerRef.current !== null) {
        clearTimeout(pendingTimerRef.current);
        pendingTimerRef.current = null;
      }

      const synth = window.speechSynthesis;
      try {
        synth.cancel();
      } catch {}

      // 100ms gap gives the engine time to actually drain the
      // cancel before we queue the new utterance. Chromium drops
      // utterances queued in the same tick as a cancel().
      pendingTimerRef.current = setTimeout(() => {
        pendingTimerRef.current = null;
        try {
          const u = new SpeechSynthesisUtterance(cleaned);
          u.pitch = 1.1;
          u.rate = 1.0;
          u.volume = 1.0;
          const v = pickVoice();
          if (v) u.voice = v;
          synth.speak(u);
          // Chrome can land in a paused state after instantiation
          // (especially after several cancel/speak cycles); a
          // no-op resume kicks the engine back to playing.
          if (synth.paused) synth.resume();
        } catch {
          // ignore — engine may be unavailable
        }
      }, 120);
    },
    [enabled]
  );

  const value = useMemo(
    () => ({ enabled, toggle, speak, stop }),
    [enabled, toggle, speak, stop]
  );

  return <VoiceCtx.Provider value={value}>{children}</VoiceCtx.Provider>;
}

export function useVoice() {
  return useContext(VoiceCtx);
}

// Kept for back-compat with any callers that still import this.
// Prefer useVoice().stop() — it also clears the pending timer.
export function stopSpeaking() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.cancel();
  } catch {}
}
