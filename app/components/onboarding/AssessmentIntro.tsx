"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bobo } from "../Mascot";
import { NightRoomBackdrop } from "./WhoAreYou";
import { useAmbientMusic } from "./Welcome";

const F = "var(--font-nunito), system-ui, sans-serif";
const PURPLE = "#A78BFA";
const PINK   = "#EC4899";
const GOLD   = "#FBBF24";

// The "Did you know..." line, grouped the same way as its visual line
// breaks, revealed one word at a time.
const DYK_LINES: { words: string[]; gold?: boolean }[] = [
  { words: ["Did", "you", "know?"] },
  { words: ["1", "in", "5", "children"], gold: true },
  { words: ["need", "extra", "support in"] },
  { words: ["managing", "emotions and reactions"] },
];
const DYK_TOTAL_WORDS = DYK_LINES.reduce((s, l) => s + l.words.length, 0);

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

function StarGlyph({ size = 14, color = GOLD }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2l2.9 6.3 6.9.7-5.2 4.6 1.6 6.8L12 16.9 5.8 20.4l1.6-6.8L2.2 9l6.9-.7L12 2Z" fill={color} />
    </svg>
  );
}

function HeartGlyph({ size = 20, color = PINK }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 20.5s-8-4.9-8-11A4.8 4.8 0 0 1 12 6.2 4.8 4.8 0 0 1 20 9.5c0 6.1-8 11-8 11Z" fill={color} />
    </svg>
  );
}

export function AssessmentIntro({
  tint,
  parentName,
  onNext,
  onSkip,
  onBack,
}: {
  tint: number;
  parentName?: string;
  onNext: () => void;
  onSkip: () => void;
  onBack?: () => void;
}) {
  const name = parentName?.trim() || "Parent";
  const { on: musicOn, toggle: toggleMusic } = useAmbientMusic();

  const [showHeading, setShowHeading] = useState(false);
  const [showMascot, setShowMascot] = useState(false);
  const [wordsShown, setWordsShown] = useState(0);
  const [showBody, setShowBody] = useState(false);
  const [showCTA, setShowCTA] = useState(false);

  // Sequence: mascot first, then the "Hi, {name}" heading, then — a beat
  // later — the "Did you know..." line reveals one word at a time, and
  // only once that's finished do the info card and CTA appear.
  useEffect(() => {
    const ts: ReturnType<typeof setTimeout>[] = [];
    ts.push(setTimeout(() => setShowMascot(true), 100));
    ts.push(setTimeout(() => setShowHeading(true), 500));

    const wordStart = 1100;
    const wordStep = 130;
    for (let i = 1; i <= DYK_TOTAL_WORDS; i++) {
      ts.push(setTimeout(() => setWordsShown(i), wordStart + i * wordStep));
    }
    const wordsEnd = wordStart + DYK_TOTAL_WORDS * wordStep + 350;
    ts.push(setTimeout(() => setShowBody(true), wordsEnd));
    ts.push(setTimeout(() => setShowCTA(true), wordsEnd + 400));

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
        padding: "140px 22px 12px",
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.6, y: 30 }}
          animate={showMascot ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.6, y: 30 }}
          transition={{ type: "spring", stiffness: 200, damping: 18 }}
          style={{ position: "relative", flexShrink: 0 }}
        >
          <div style={{
            position: "absolute", bottom: 6, left: "50%", transform: "translateX(-50%)",
            width: 260, height: 70, borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(139,92,246,0.55) 0%, rgba(109,40,217,0.16) 60%, transparent 100%)",
            filter: "blur(6px)", zIndex: 0,
          }} />

          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
            style={{ position: "relative", zIndex: 1 }}
          >
            <Bobo mood="cheer" tint={tint} size={190} animate eyeOpen={1} tailWag />
          </motion.div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={showHeading ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
          style={{
            margin: "18px 0 0", fontFamily: F, fontSize: 28, fontWeight: 900, lineHeight: 1.3,
            textAlign: "center", color: "#fff",
          }}
        >
          Hi <span style={{ color: PINK }}>{name}</span>,
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={showHeading ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10 }}
        >
          <div style={{ width: 40, height: 1, background: "rgba(255,255,255,0.25)" }} />
          <StarGlyph size={14} />
          <div style={{ width: 40, height: 1, background: "rgba(255,255,255,0.25)" }} />
        </motion.div>

        <p
          style={{
            margin: "10px 0 0", fontFamily: F, fontSize: 26, fontWeight: 900, lineHeight: 1.3,
            textAlign: "center", color: "#fff",
          }}
        >
          {DYK_LINES.map((line, li) => {
            const priorCount = DYK_LINES.slice(0, li).reduce((s, l) => s + l.words.length, 0);
            return (
              <span key={li}>
                {line.words.map((w, wi) => {
                  const idx = priorCount + wi + 1;
                  const shown = wordsShown >= idx;
                  return (
                    <motion.span
                      key={wi}
                      initial={{ opacity: 0, y: 8 }}
                      animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                      transition={{ duration: 0.3 }}
                      style={{ display: "inline-block", color: line.gold ? GOLD : "#fff", marginRight: 8 }}
                    >
                      {w}
                    </motion.span>
                  );
                })}
                {li < DYK_LINES.length - 1 && <br />}
              </span>
            );
          })}
        </p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={showBody ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.5 }}
          style={{
            width: "100%", maxWidth: 460, marginTop: 40,
            display: "flex", alignItems: "center", gap: 14,
            background: "rgba(35,25,74,0.55)", border: "1px solid rgba(139,124,246,0.22)",
            borderRadius: 20, padding: "16px 16px",
          }}
        >
          <div style={{ position: "relative", flexShrink: 0 }}>
            <StarGlyph size={9} color={GOLD} />
            <div style={{ position: "absolute", top: -6, left: -8 }}><StarGlyph size={9} color={GOLD} /></div>
            <div style={{ position: "absolute", bottom: -4, left: -10 }}><StarGlyph size={7} color={GOLD} /></div>
            <div style={{
              width: 52, height: 40, borderRadius: 20, background: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
            }}>
              <HeartGlyph size={20} />
            </div>
            <div style={{
              position: "absolute", bottom: -6, left: 16, width: 0, height: 0,
              borderLeft: "6px solid transparent", borderRight: "6px solid transparent",
              borderTop: "8px solid #fff",
            }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontFamily: F, fontSize: 16, fontWeight: 500, color: "#fff", lineHeight: 1.45 }}>
              A few quick questions can tell how your child handles these{" "}
              <span style={{ color: PURPLE, fontWeight: 700 }}>everyday challenges</span>.
            </p>
          </div>
        </motion.div>
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
          Continue
          <motion.span aria-hidden animate={{ x: [0, 5, 0] }} transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}>
            &rarr;
          </motion.span>
        </motion.button>
      </motion.div>
    </div>
  );
}
