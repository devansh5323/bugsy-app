"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bobo } from "../Mascot";
import { NightRoomBackdrop } from "./WhoAreYou";
import { useAmbientMusic } from "./Welcome";

const F = "var(--font-nunito), system-ui, sans-serif";
const BLUE = "#2563EB";
const GOLD = "#D97706";

function ArrowLeftIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M19 12H5M11 6l-6 6 6 6" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function MusicIcon({ size = 20, on = true }: { size?: number; on?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
      {!on && <line x1="3" y1="3" x2="21" y2="21" />}
    </svg>
  );
}

// Sparkle used inline inside the 3D icons below — a simple 4-point star.
function MiniSparkle({ cx, cy, r, color }: { cx: number; cy: number; r: number; color: string }) {
  const k = r * 0.28;
  return (
    <path
      d={`M${cx} ${cy - r} L${cx + k} ${cy - k} L${cx + r} ${cy} L${cx + k} ${cy + k} L${cx} ${cy + r} L${cx - k} ${cy + k} L${cx - r} ${cy} L${cx - k} ${cy - k} Z`}
      fill={color}
    />
  );
}

// Chunky "3D sticker" stopwatch — matches the reference's running-timer icon.
function StopwatchIcon3D({ size = 44 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <defs>
        <radialGradient id="wtm-watch" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#C4B5FD" />
          <stop offset="100%" stopColor="#7C3AED" />
        </radialGradient>
      </defs>
      <path d="M4 30l9-3.5" stroke="#A78BFA" strokeWidth="2.6" strokeLinecap="round" opacity="0.7" />
      <path d="M2 23l9.5-1.5" stroke="#A78BFA" strokeWidth="2.6" strokeLinecap="round" opacity="0.7" />
      <path d="M4 16l9 3" stroke="#A78BFA" strokeWidth="2.6" strokeLinecap="round" opacity="0.7" />
      <rect x="19" y="1" width="10" height="6" rx="2.5" fill="#6D28D9" />
      <rect x="33.5" y="8.5" width="9" height="6" rx="2.5" fill="#7C3AED" transform="rotate(40 38 11.5)" />
      <circle cx="25" cy="28" r="18" fill="url(#wtm-watch)" stroke="#5B21B6" strokeWidth="1" />
      <circle cx="25" cy="28" r="13.5" fill="#F1EBFE" />
      <path d="M25 28V19.5" stroke="#6D28D9" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M25 28l5.5 3" stroke="#6D28D9" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="25" cy="28" r="2.2" fill="#6D28D9" />
      <MiniSparkle cx={41} cy={9} r={4} color="#C4B5FD" />
      <MiniSparkle cx={8} cy={38} r={3} color="#DDD6FE" />
    </svg>
  );
}

// Chunky "3D sticker" clipboard-with-pencil — matches the reference icon.
function ClipboardIcon3D({ size = 44 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <rect x="8" y="6" width="27" height="36" rx="4" fill="#fff" stroke="#E5E0F5" strokeWidth="1" />
      <rect x="15.5" y="2" width="12" height="7" rx="3" fill="#F1C232" stroke="#C9942A" strokeWidth="0.6" />
      <path d="M12.5 15.5l2.2 2.2 3.8-4" stroke="#16A34A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <rect x="20.5" y="15" width="10.5" height="2.4" rx="1.2" fill="#D8CCF7" />
      <path d="M12.5 23.5l2.2 2.2 3.8-4" stroke="#16A34A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <rect x="20.5" y="23" width="10.5" height="2.4" rx="1.2" fill="#D8CCF7" />
      <path d="M12.5 31.5l2.2 2.2 3.8-4" stroke="#16A34A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <rect x="20.5" y="31" width="7.5" height="2.4" rx="1.2" fill="#D8CCF7" />
      <path d="M27 39l14-14 4.5 4.5-14 14-5.5 1Z" fill="#FDBA3B" stroke="#B8790A" strokeWidth="0.8" />
      <path d="M41 25.5l4.5 4.5" stroke="#F87171" strokeWidth="2" />
      <path d="M27 39l1-4.5 3.5 3.5Z" fill="#7C6653" />
      <MiniSparkle cx={39} cy={13} r={3.5} color="#FBBF24" />
      <MiniSparkle cx={7} cy={39} r={3} color="#FBBF24" />
    </svg>
  );
}

// Chunky "3D sticker" shield-with-checkmark — matches the reference icon.
function ShieldIcon3D({ size = 44 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <defs>
        <linearGradient id="wtm-shield" x1="10%" y1="0%" x2="90%" y2="100%">
          <stop offset="0%" stopColor="#F472B6" />
          <stop offset="100%" stopColor="#DB2777" />
        </linearGradient>
      </defs>
      <path d="M24 3 41 9.5V22c0 12-8 19-17 24-9-5-17-12-17-24V9.5Z" fill="url(#wtm-shield)" stroke="#9D174D" strokeWidth="1" />
      <path d="M15 23.5l6.5 6.5L34 16.5" stroke="#fff" strokeWidth="4.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <MiniSparkle cx={40} cy={10} r={4} color="#FBCFE8" />
      <MiniSparkle cx={6} cy={36} r={3} color="#FBCFE8" />
    </svg>
  );
}

const ROWS = [
  {
    bg: "#C9C3F5", Icon3D: StopwatchIcon3D,
    title: "Takes 3-5 minutes", 
  },
  {
    bg: "#FBCB6B", Icon3D: ClipboardIcon3D,
    title: "Answer what you observe",
  },
  {
    bg: "#F6A8CE", Icon3D: ShieldIcon3D,
    title: "No right or wrong answers",
  },
];

// The mascot's speech-bubble line, revealed one word at a time.
const BUBBLE_WORDS: { text: string; color?: string }[] = [
  { text: "Your" }, { text: "responses" }, { text: "help" }, { text: "me" },
  { text: "unlock" }, { text: "your" }, { text: "child's" },
  { text: "growth", color: GOLD }, { text: "profile", color: GOLD },
  { text: "and" },
  { text: "personalize", color: BLUE }, { text: "their", color: BLUE }, { text: "missions", color: BLUE },
];

export function WhyThisMatterScreen({
  tint,
  onNext,
  onSkip,
  onBack,
}: {
  tint: number;
  onNext: () => void;
  onSkip?: () => void;
  onBack?: () => void;
}) {
  const { on: musicOn, toggle: toggleMusic } = useAmbientMusic();

  const [showMascot, setShowMascot] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [wordsShown, setWordsShown] = useState(0);
  const [rowsShown, setRowsShown] = useState(0);
  const [showCTA, setShowCTA] = useState(false);

  // Sequence: mascot settles in first, then the speech bubble pops in above
  // it and reveals its line one word at a time (as if Bobo is speaking it),
  // then the three info rows appear one by one, then the CTAs.
  useEffect(() => {
    const ts: ReturnType<typeof setTimeout>[] = [];
    ts.push(setTimeout(() => setShowMascot(true), 100));
    ts.push(setTimeout(() => setShowBubble(true), 700));

    const wordStart = 950;
    const wordStep = 110;
    for (let i = 1; i <= BUBBLE_WORDS.length; i++) {
      ts.push(setTimeout(() => setWordsShown(i), wordStart + i * wordStep));
    }
    const wordsEnd = wordStart + BUBBLE_WORDS.length * wordStep + 300;

    const rowStep = 350;
    for (let i = 1; i <= ROWS.length; i++) {
      ts.push(setTimeout(() => setRowsShown(i), wordsEnd + i * rowStep));
    }
    const rowsEnd = wordsEnd + ROWS.length * rowStep;
    ts.push(setTimeout(() => setShowCTA(true), rowsEnd + 400));

    return () => ts.forEach(clearTimeout);
  }, []);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <NightRoomBackdrop minimal hideRug hideFloor />

      {onBack && (
        <button
          onClick={onBack}
          style={{
            position: "absolute", top: 24, left: 20, zIndex: 40,
            width: 46, height: 46, borderRadius: 14,
            background: "rgba(76,41,168,0.75)", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 2px 10px rgba(0,0,0,0.28)",
          }}
        >
          <ArrowLeftIcon />
        </button>
      )}

      <button
        onClick={toggleMusic}
        aria-label={musicOn ? "Mute music" : "Play music"}
        style={{
          position: "absolute", top: 24, right: 20, zIndex: 40,
          width: 46, height: 46, borderRadius: 14,
          background: "rgba(76,41,168,0.75)", border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 2px 10px rgba(0,0,0,0.28)",
        }}
      >
        <MusicIcon on={musicOn} />
      </button>

      <div style={{
        flex: 1, minHeight: 0, overflowY: "auto", position: "relative", zIndex: 2,
        display: "flex", flexDirection: "column", alignItems: "center",
        padding: "120px 22px 12px",
      }}>
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.72 }}
          animate={showBubble ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 10, scale: 0.72 }}
          transition={{ type: "spring", stiffness: 300, damping: 26 }}
          style={{
            position: "relative", maxWidth: 300,
            background: "#fff",
            borderRadius: 18, padding: "16px 22px 20px", marginBottom: 18,
            boxShadow: "0 6px 28px rgba(0,0,0,0.22)",
          }}
        >
          <p style={{ margin: 0, fontFamily: F, fontSize: 15.5, fontWeight: 700, lineHeight: 1.45, textAlign: "center", color: "#1a0f40" }}>
            {BUBBLE_WORDS.map((w, i) => {
              const shown = wordsShown >= i + 1;
              return (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 6, scale: 0.8 }}
                  animate={shown ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 6, scale: 0.8 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  style={{ display: "inline-block", marginRight: 5, color: w.color ?? "#1a0f40", fontWeight: w.color ? 900 : 700 }}
                >
                  {w.text}
                </motion.span>
              );
            })}
          </p>
          <div style={{
            position: "absolute", bottom: -12, left: "50%", marginLeft: -12,
            width: 0, height: 0,
            borderLeft: "12px solid transparent", borderRight: "12px solid transparent",
            borderTop: "12px solid #fff",
          }} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.6, y: 30 }}
          animate={showMascot ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.6, y: 30 }}
          transition={{ type: "spring", stiffness: 200, damping: 18 }}
          style={{ position: "relative", flexShrink: 0 }}
        >
          <div style={{
            position: "absolute", bottom: 6, left: "50%", transform: "translateX(-50%)",
            width: 220, height: 60, borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(139,92,246,0.55) 0%, rgba(109,40,217,0.16) 60%, transparent 100%)",
            filter: "blur(6px)", zIndex: 0,
          }} />

          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
            style={{ position: "relative", zIndex: 1 }}
          >
            <Bobo mood="cheer" tint={tint} size={190} animate eyeOpen={1} armsDown tailWag />
          </motion.div>
        </motion.div>

        <div style={{
          width: "100%", maxWidth: 460, marginTop: 24,
          display: "flex", flexDirection: "column", gap: 10,
        }}>
          {ROWS.map((r, i) => (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, y: 22, scale: 0.94 }}
              animate={rowsShown > i ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 22, scale: 0.94 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                background: "rgba(32,22,64,0.75)",
                border: "1.5px solid rgba(139,110,255,0.25)",
                borderRadius: 18, padding: "12px 14px",
                boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
              }}
            >
              <div style={{ position: "relative", flexShrink: 0 }}>
                <div style={{
                  width: 54, height: 54, borderRadius: "50%",
                  background: r.bg,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <r.Icon3D size={36} />
                </div>
                <svg width={14} height={14} viewBox="0 0 14 14" style={{ position: "absolute", top: -2, right: -2 }}>
                  <MiniSparkle cx={7} cy={7} r={5.5} color="#fff" />
                </svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: "0 0 3px", fontFamily: F, fontSize: 15, fontWeight: 800, color: "#fff", lineHeight: 1.25 }}>
                  {r.title}
                </p>
                <p style={{ margin: 0, fontFamily: F, fontSize: 13.5, fontWeight: 600, color: "rgba(196,188,230,0.65)" }}>

                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={showCTA ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "relative", zIndex: 2,
          padding: "8px 22px 24px",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
        }}
      >
        <motion.button
          onClick={onNext}
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          whileTap={{ scale: 0.95 }}
          style={{
            width: "100%", height: 54, borderRadius: 27,
            background: "linear-gradient(180deg, #9D6FE8 0%, #7C3AED 100%)",
            border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            fontFamily: F, fontSize: 18, fontWeight: 900, color: "#fff",
            boxShadow: "0 5px 0 #5B21B6, 0 8px 22px rgba(109,40,217,0.50)",
            touchAction: "manipulation",
          }}
        >
          Get started
          <motion.span aria-hidden animate={{ x: [0, 5, 0] }} transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}>
            &rarr;
          </motion.span>
        </motion.button>

        {onSkip && (
          <button
            onClick={onSkip}
            style={{
              background: "none", border: "none", cursor: "pointer",
              fontFamily: F, fontSize: 14, fontWeight: 600, color: "rgba(180,175,210,0.65)",
              touchAction: "manipulation", padding: "4px 8px",
            }}
          >
            Skip for now
          </button>
        )}
      </motion.div>
    </div>
  );
}
