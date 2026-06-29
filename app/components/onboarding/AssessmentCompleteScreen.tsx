"use client";

import { motion } from "framer-motion";
import { NightRoomBackdrop } from "./WhoAreYou";
import { Bobo } from "../Mascot";

const F       = "var(--font-nunito), system-ui, sans-serif";
const W       = 344;
const CAT_TINT = 220; // sky-blue — matches app-wide TINT

const centered = (extra?: React.CSSProperties): React.CSSProperties => ({
  position: "absolute",
  left: "50%",
  transform: "translateX(-50%)",
  width: W,
  ...extra,
});

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
  childName,
  onNext,
  onBack,
}: {
  childName: string;
  onNext: () => void;
  onBack: () => void;
}) {
  const name = childName.trim() || "your child";

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <NightRoomBackdrop minimal hideRug />

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
      <motion.button
        onClick={onBack}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        style={{
          position: "absolute", top: 52, left: 16, zIndex: 10,
          width: 46, height: 46, borderRadius: "50%",
          background: "#5B21B6", border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 22, color: "#fff",
          boxShadow: "0 4px 18px rgba(0,0,0,0.45)",
          touchAction: "manipulation",
        }}
      >←</motion.button>

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

      {/* ── checkmark badge (in moonlight cone) ── */}
      <div
        style={{
          ...centered({ top: 153, zIndex: 4 }),
          display: "flex", justifyContent: "center", alignItems: "flex-start",
          height: 60,
        }}
      >
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

        {/* plain wrapper — no CSS transform on motion element */}
        <div style={{ display: "flex", justifyContent: "center" }}>
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
      </div>

      {/* ── heading "Assessment Complete!" ── */}
      <div style={centered({ top: 220, zIndex: 4 })}>
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: F, fontSize: 42, fontWeight: 900,
            color: "#fff", textAlign: "center",
            lineHeight: 1.18, margin: 0,
            whiteSpace: "pre-line",
            textShadow: "0 3px 28px rgba(0,0,0,0.45)",
          }}
        >
          {"Assessment\nComplete!"}
        </motion.p>
      </div>

      {/* ── subtitle ── */}
      <div style={centered({ top: 346, zIndex: 4 })}>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.48, duration: 0.45 }}
        >
          <p style={{
            fontFamily: F, fontSize: 17, fontWeight: 700,
            color: "#A78BFA", textAlign: "center",
            margin: "0 0 4px",
          }}>
            Yay! Now I know {name} a little better.
          </p>
          <p style={{
            fontFamily: F, fontSize: 17, fontWeight: 700,
            color: "#fff", textAlign: "center",
            margin: 0,
          }}>
            {"I can't wait to start our adventures together! 💜"}
          </p>
        </motion.div>
      </div>

      {/* ── concentric ring mat (renders behind Bobo) ── */}
      <div style={{
        position: "absolute", left: "50%", transform: "translateX(-50%)",
        top: 628, zIndex: 3, pointerEvents: "none",
      }}>
        <motion.div
          initial={{ opacity: 0, scaleX: 0.55, scaleY: 0.55 }}
          animate={{ opacity: 1, scaleX: 1, scaleY: 1 }}
          transition={{ delay: 0.55, duration: 0.55, ease: "easeOut" }}
          style={{ position: "relative", width: 300, height: 90 }}
        >
          {([
            { w: 300, h: 90, fill: "rgba(55,0,0,0.96)"    },
            { w: 244, h: 73, fill: "rgba(100,3,3,0.96)"   },
            { w: 188, h: 56, fill: "rgba(155,12,12,0.96)" },
            { w: 133, h: 40, fill: "rgba(200,25,25,0.96)" },
            { w:  78, h: 23, fill: "rgba(235,48,48,0.96)" },
          ] as { w: number; h: number; fill: string }[]).map((ring, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: "50%", marginLeft: -(ring.w / 2),
                top:  "50%", marginTop:  -(ring.h / 2),
                width: ring.w, height: ring.h,
                borderRadius: "50%",
                background: ring.fill,
              }}
            />
          ))}
        </motion.div>
      </div>

      {/* ── Bobo mascot ── */}
      {/* outer plain div: CSS centering — inner motion.div: entrance animation */}
      <div style={{
        position: "absolute", left: "50%", transform: "translateX(-50%)",
        top: 438, zIndex: 5,
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.65, y: 32 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 250, damping: 20, delay: 0.52 }}
          style={{ display: "flex", justifyContent: "center" }}
        >
          <Bobo mood="excited" tint={CAT_TINT} size={225} animate tailWag />
        </motion.div>
      </div>

      {/* ── CTA "Let's Begin Our Journey!" ── */}
      <div style={centered({ bottom: 36, zIndex: 7 })}>
        {/* pulsing glow layer */}
        <motion.div
          animate={{ opacity: [0.45, 0.75, 0.45], scale: [1, 1.06, 1] }}
          transition={{ duration: 2.0, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute", inset: -10,
            borderRadius: 40,
            background: "linear-gradient(135deg, #A855F7, #6D28D9)",
            filter: "blur(16px)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
        <motion.button
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.78, duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
          onClick={onNext}
          whileHover={{ y: -3, scale: 1.015 }}
          whileTap={{ scale: 0.97 }}
          style={{
            position: "relative", zIndex: 1,
            width: "100%", height: 60,
            borderRadius: 30,
            background: "linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)",
            border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            fontFamily: F, fontSize: 19, fontWeight: 900, color: "#fff",
            boxShadow: "0 10px 30px rgba(109,40,217,0.55)",
            touchAction: "manipulation",
          }}
        >
          {"Let's Begin Our Journey! ✨ →"}
        </motion.button>
      </div>
    </div>
  );
}
