"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { NightRoomBackdrop } from "./WhoAreYou";
import { Bobo } from "../Mascot";

const F       = "var(--font-nunito), system-ui, sans-serif";
const W       = 344;
const CAT_TINT = 220; // sky-blue — matches app-wide TINT

const MESSAGE = "Your child's Growth plan is unlocked! Sign in to view their personalized recommendations.";

// ── Confetti — fixed positions so layout is deterministic ──────────────
const CONFETTI = [
  // left side
  { id:  0, x: "7%",  y: "16%", color: "#FBBF24", hex: false, w: 12, h: 8,  rot: 20,  dur: 2.8, delay: 0.0 },
  { id:  1, x: "13%", y: "30%", color: "#EF4444", hex: true,  w: 12, h: 12, rot: -15, dur: 3.1, delay: 0.1 },
  { id:  2, x: "4%",  y: "44%", color: "#60A5FA", hex: false, w: 10, h: 7,  rot: 0,   dur: 2.6, delay: 0.2 },
  { id:  3, x: "19%", y: "55%", color: "#10B981", hex: false, w: 12, h: 8,  rot: 30,  dur: 3.4, delay: 0.3 },
  { id:  4, x: "10%", y: "67%", color: "#F97316", hex: false, w: 11, h: 7,  rot: -20, dur: 2.9, delay: 0.4 },
  { id:  5, x: "23%", y: "21%", color: "#A78BFA", hex: true,  w: 11, h: 11, rot: 0,   dur: 3.3, delay: 0.15},
  { id:  6, x: "29%", y: "70%", color: "#F472B6", hex: false, w: 10, h: 7,  rot: 15,  dur: 2.7, delay: 0.25},
  // right side
  { id:  7, x: "79%", y: "13%", color: "#FCD34D", hex: true,  w: 12, h: 12, rot: 0,   dur: 3.0, delay: 0.05},
  { id:  8, x: "87%", y: "27%", color: "#8B5CF6", hex: false, w: 11, h: 7,  rot: -25, dur: 2.85,delay: 0.18},
  { id:  9, x: "73%", y: "38%", color: "#F87171", hex: false, w: 12, h: 8,  rot: 10,  dur: 3.2, delay: 0.35},
  { id: 10, x: "84%", y: "50%", color: "#34D399", hex: false, w: 10, h: 7,  rot: -30, dur: 2.65,delay: 0.42},
  { id: 11, x: "91%", y: "62%", color: "#93C5FD", hex: true,  w: 11, h: 11, rot: 0,   dur: 3.15,delay: 0.08},
  { id: 12, x: "76%", y: "73%", color: "#FBBF24", hex: false, w: 12, h: 8,  rot: 20,  dur: 2.95,delay: 0.28},
  // centre scatter
  { id: 13, x: "36%", y: "10%", color: "#F472B6", hex: false, w: 9,  h: 7,  rot: -10, dur: 3.05,delay: 0.12},
  { id: 14, x: "57%", y: "8%",  color: "#60A5FA", hex: true,  w: 10, h: 10, rot: 0,   dur: 2.75,delay: 0.22},
  { id: 15, x: "34%", y: "44%", color: "#FBBF24", hex: false, w: 12, h: 8,  rot: 25,  dur: 3.35,delay: 0.32},
  { id: 16, x: "63%", y: "47%", color: "#F87171", hex: false, w: 10, h: 7,  rot: -15, dur: 2.9, delay: 0.38},
  { id: 17, x: "48%", y: "74%", color: "#A78BFA", hex: true,  w: 11, h: 11, rot: 0,   dur: 3.0, delay: 0.45},
];

export function AssessmentCompleteScreen({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack: () => void;
}) {
  const [typedMsg, setTypedMsg] = useState("");

  useEffect(() => {
    const ts: ReturnType<typeof setTimeout>[] = [];
    const start = 700;
    MESSAGE.split("").forEach((_, i) =>
      ts.push(setTimeout(() => setTypedMsg(MESSAGE.slice(0, i + 1)), start + i * 28))
    );
    return () => ts.forEach(clearTimeout);
  }, []);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <NightRoomBackdrop minimal hideRug hideFloor />

      {/* ── confetti ──────────────────────────────────────────────── */}
      {CONFETTI.map((c) => (
        <motion.div
          key={c.id}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: [0, -7, 0],
            rotate: [c.rot - 5, c.rot + 5, c.rot - 5],
          }}
          transition={{
            opacity: { delay: 0.4 + c.delay, duration: 0.4 },
            scale:   { delay: 0.4 + c.delay, duration: 0.4, type: "spring", stiffness: 350, damping: 18 },
            y:       { duration: c.dur, repeat: Infinity, ease: "easeInOut", delay: c.delay },
            rotate:  { duration: c.dur * 1.15, repeat: Infinity, ease: "easeInOut", delay: c.delay * 0.8 },
          }}
          style={{
            position: "absolute",
            left: c.x,
            top:  c.y,
            width:  c.w,
            height: c.hex ? c.w : c.h,
            background: c.color,
            borderRadius: c.hex ? 0 : 3,
            clipPath: c.hex
              ? "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)"
              : undefined,
            zIndex: 2,
            pointerEvents: "none",
          }}
        />
      ))}

      {/* ── back ── */}
      <button
        onClick={onBack}
        style={{
          position: "absolute", top: 52, left: 16, zIndex: 10,
          width: 46, height: 46, borderRadius: 14,
          background: "rgba(59,31,140,0.82)", border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", fontSize: 20, fontWeight: 400,
          boxShadow: "0 2px 10px rgba(0,0,0,0.28)",
          touchAction: "manipulation",
        }}
      >‹</button>

      {/* ── music ── */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92, rotate: 15 }}
        style={{
          position: "absolute", top: 52, right: 16, zIndex: 10,
          width: 46, height: 46, borderRadius: "50%",
          background: "#5B21B6", border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 20,
          boxShadow: "0 4px 18px rgba(0,0,0,0.45)",
          touchAction: "manipulation",
        }}
      >🎵</motion.button>

      {/* ── Scrollable content — flex-flow instead of fixed pixel offsets,
          so it adapts to any viewport height instead of the mascot
          clipping behind the CTA on shorter screens. ── */}
      <div style={{
        flex: 1, minHeight: 0, overflowY: "auto", position: "relative", zIndex: 4,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: "92px 16px 16px",
      }}>
        {/* checkmark badge (in moonlight cone) */}
        <div style={{ position: "relative", display: "flex", justifyContent: "center", height: 60, width: W, flexShrink: 0 }}>
          {/* sparkle left of badge */}
          <motion.span
            animate={{ scale: [1, 1.45, 1], opacity: [0.65, 1, 0.65] }}
            transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut", delay: 0.25 }}
            style={{
              position: "absolute", fontSize: 13, color: "#FCD34D",
              top: 2, left: "50%", marginLeft: -44,
              pointerEvents: "none",
            }}
          >✦</motion.span>
          {/* sparkle right of badge */}
          <motion.span
            animate={{ scale: [1, 1.55, 1], opacity: [0.65, 1, 0.65] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
            style={{
              position: "absolute", fontSize: 11, color: "#FCD34D",
              top: 9, left: "50%", marginLeft: 30,
              pointerEvents: "none",
            }}
          >✦</motion.span>

          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 340, damping: 18, delay: 0.2 }}
            style={{
              width: 52, height: 52, borderRadius: "50%",
              background: "#7C3AED",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 6px 24px rgba(124,58,237,0.65)",
            }}
          >
            <span style={{ color: "#fff", fontSize: 26, lineHeight: 1, fontWeight: 900 }}>✓</span>
          </motion.div>
        </div>

        {/* message — same entrance/typing style as BugsyIntro's bubble, no box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.72 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 26, delay: 0.35 }}
          style={{ flexShrink: 0, marginTop: 20, maxWidth: W }}
        >
          <p style={{
            fontFamily: F, fontSize: 19, fontWeight: 700,
            color: "#fff", textAlign: "center",
            margin: 0, lineHeight: 1.3,
          }}>
            {typedMsg}
          </p>
        </motion.div>

        {/* Bobo mascot — same entrance/float animation as BugsyIntro's Fumi */}
        <motion.div
          initial={{ y: 60, opacity: 0, scale: 0.65 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.55 }}
          style={{ display: "flex", justifyContent: "center", flexShrink: 0, marginTop: 12 }}
        >
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut", delay: 1.4 }}
          >
            <Bobo mood="excited" tint={CAT_TINT} size={200} animate tailWag armsUp />
          </motion.div>
        </motion.div>
      </div>

      {/* ── CTA — pinned footer, never overlapped by content above ── */}
      <div style={{ flexShrink: 0, padding: "12px 16px 32px", zIndex: 7, position: "relative" }}>
        <button
          onClick={onNext}
          style={{
            width: "100%", height: 60,
            borderRadius: 30,
            background: "linear-gradient(180deg, #9D6FE8 0%, #7C3AED 100%)",
            border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: F, fontSize: 19, fontWeight: 900, color: "#fff",
            boxShadow: "0 6px 0 #5B21B6, 0 10px 28px rgba(109,40,217,0.50)",
            touchAction: "manipulation",
          }}
        >
          Let&apos;s begin with the journey
        </button>
      </div>
    </div>
  );
}
