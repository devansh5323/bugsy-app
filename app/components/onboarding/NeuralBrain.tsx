"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bobo } from "../Mascot";
import { NightRoomBackdrop } from "./WhoAreYou";

const F = "var(--font-nunito), system-ui, sans-serif";

const WORDS = [
  "My","missions","help","your","child","build","skills",
  "they","use","everyday.",
];
const SKILLS = [
  { id: 1, name: "Attention",          desc: "Stay focused longer",               Icon: StarFaceGlyph, color: "#FFD700", glowColor: "rgba(255,215,0,0.65)",   outer: { x: 72, y: 57 }, inner: { x: 93, y: 69 }, side: "left"  as const },
  { id: 2, name: "Impulse Control",    desc: "Think before you act",              Icon: TargetGlyph,   color: "#22D3EE", glowColor: "rgba(34,211,238,0.65)",   outer: { x: 148, y: 57 }, inner: { x: 127, y: 69 }, side: "right" as const },
  { id: 3, name: "Executive Function", desc: "Plan, organize and solve problems", Icon: PuzzleGlyph,   color: "#C084FC", glowColor: "rgba(192,132,252,0.65)", outer: { x: 72, y: 99 }, inner: { x: 93, y: 87 },  side: "left"  as const },
  { id: 4, name: "Memory",             desc: "Remember more, learn better",       Icon: BookGlyph,     color: "#4ADE80", glowColor: "rgba(74,222,128,0.65)",  outer: { x: 148, y: 99 }, inner: { x: 127, y: 87 }, side: "right" as const },
];

// ── Glossy 3D skill icons — hand-drawn so they render identically
// everywhere, instead of relying on the platform's plain emoji font. ──
function StarFaceGlyph({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 34 34" style={{ display: "block" }}>
      <defs>
        <linearGradient id="nbStarFill" x1="0.25" y1="0" x2="0.75" y2="1">
          <stop offset="0%" stopColor="#FFF3B0" />
          <stop offset="45%" stopColor="#FFC940" />
          <stop offset="100%" stopColor="#E8880E" />
        </linearGradient>
      </defs>
      <path
        d="M17,1 L20.8,11.5 L32,11.9 L23.1,18.9 L26.2,29.6 L17,23.2 L7.8,29.6 L10.9,18.9 L2,11.9 L13.2,11.5 Z"
        fill="url(#nbStarFill)" stroke="#B85E00" strokeWidth="0.6" strokeLinejoin="round"
      />
      <circle cx="13.5" cy="16" r="1.3" fill="#7A4400" />
      <circle cx="20.5" cy="16" r="1.3" fill="#7A4400" />
      <path d="M13.5 19.5 Q17 22.3 20.5 19.5" stroke="#7A4400" strokeWidth="1.3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function TargetGlyph({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 34 34" style={{ display: "block" }}>
      <circle cx="15" cy="19" r="13" fill="#EF4444" stroke="#B91C1C" strokeWidth="0.8" />
      <circle cx="15" cy="19" r="9.4" fill="#fff" />
      <circle cx="15" cy="19" r="6" fill="#EF4444" />
      <circle cx="15" cy="19" r="2.6" fill="#fff" />
      <path d="M27 4 L20 11" stroke="#3B82F6" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M17 15 L21 10 L23.5 11.5 Z" fill="#1D4ED8" />
      <path d="M24 3 L28.5 1.5 L27 6 L24.5 6.5 Z" fill="#93C5FD" stroke="#3B82F6" strokeWidth="0.6" strokeLinejoin="round" />
      <ellipse cx="10.5" cy="13" rx="4" ry="2.2" fill="#fff" opacity="0.3" transform="rotate(-25 10.5 13)" />
    </svg>
  );
}

function PuzzleGlyph({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 34 34" style={{ display: "block" }}>
      <defs>
        <linearGradient id="nbPuzzleFill" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#8CE87A" />
          <stop offset="100%" stopColor="#2F9E44" />
        </linearGradient>
      </defs>
      <rect x="5" y="5" width="22" height="22" rx="5" fill="url(#nbPuzzleFill)" stroke="#1F7A32" strokeWidth="0.9" />
      <circle cx="27" cy="16" r="4.4" fill="url(#nbPuzzleFill)" stroke="#1F7A32" strokeWidth="0.9" />
      <ellipse cx="12" cy="10" rx="3.6" ry="2.2" fill="#fff" opacity="0.35" transform="rotate(-20 12 10)" />
    </svg>
  );
}

function BookGlyph({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 34 34" style={{ display: "block" }}>
      <defs>
        <linearGradient id="nbBookFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8CE87A" />
          <stop offset="100%" stopColor="#2F9E44" />
        </linearGradient>
      </defs>
      <rect x="7" y="4" width="20" height="26" rx="2.5" fill="url(#nbBookFill)" stroke="#1F7A32" strokeWidth="0.9" />
      <rect x="7" y="4" width="5" height="26" rx="2" fill="#1F7A32" opacity="0.35" />
      <line x1="16" y1="10" x2="24" y2="10" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" opacity="0.85" />
      <line x1="16" y1="15" x2="24" y2="15" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" opacity="0.85" />
      <line x1="16" y1="20" x2="22" y2="20" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" opacity="0.7" />
      <ellipse cx="13" cy="9" rx="3.2" ry="2" fill="#fff" opacity="0.3" transform="rotate(-15 13 9)" />
    </svg>
  );
}

// viewBox 390×500; brain 300×211 centered at (195,250)
// outer nodes: Attn(143,222), Imp(247,222), Exec(143,279), Mem(247,279)
// left-card right-edge x=114, right-card left-edge x=276
// top-card center_y≈168, bottom-card center_y≈333
const ARROW_PATHS = [
  "M 114,168 C 120,190 132,212 143,222",
  "M 276,168 C 270,190 258,212 247,222",
  "M 114,333 C 120,312 132,291 143,279",
  "M 276,333 C 270,312 258,291 247,279",
];

const WORD_DELAY   = 135;
const TYPING_START = 820;
const BUBBLE_SHOW  = 720;
const BRAIN_SWITCH = TYPING_START + WORDS.length * WORD_DELAY + 560;
const NEURAL_BASE  = BRAIN_SWITCH + 2100;
const NODE_GAP     = 370;

// Sequential animation beats (offsets from NEURAL_BASE):
// 1. Attention  → 0
// 2. Connection grows → ATT_CARD_T + 500
// 3. Brain glows      → CONN_BEAT  + 700
// 4. Memory           → GLOW_BEAT  + 600
// 5. Impulse          → MEM_START  + 1150
// 6. Executive        → IMP_START  + 1150
const ATT_CARD_T = 2 * NODE_GAP + 720;  // 1460 — Attention card appears
const CONN_BEAT  = ATT_CARD_T + 500;    // 1960 — Connection grows
const GLOW_BEAT  = CONN_BEAT  + 700;    // 2660 — Brain glows
const MEM_START  = GLOW_BEAT  + 600;    // 3260 — Memory
const IMP_START  = MEM_START  + 1150;   // 4410 — Impulse Control
const EXE_START  = IMP_START  + 1150;   // 5560 — Executive Function
// SKILL_GAPS indexed by SKILLS[i]: Attention(0), Impulse(1), Executive(2), Memory(3)
const SKILL_GAPS = [0, IMP_START, EXE_START, MEM_START];

export function NeuralBrain({
  tint,
  onNext,
  onBack,
}: {
  tint: number;
  onNext: () => void;
  onBack?: () => void;
}) {
  const [wordCount,    setWordCount   ] = useState(0);
  const [showBubble,   setShowBubble  ] = useState(false);
  const [showBrain,    setShowBrain   ] = useState(false);
  const [showHeading,  setShowHeading ] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [showBrainArea,setShowBrainArea] = useState(false);
  const [progress,     setProgress    ] = useState([0, 0, 0, 0]);
  const [cardVisible,  setCardVisible ] = useState([false, false, false, false]);
  const [showButton,   setShowButton  ] = useState(false);
  const [connGrow,     setConnGrow    ] = useState(false);
  const [brainGlow,    setBrainGlow   ] = useState(false);

  const allCardsVisible = cardVisible.every(v => v);

  useEffect(() => {
    const ts: ReturnType<typeof setTimeout>[] = [];
    ts.push(setTimeout(() => setShowBubble(true), BUBBLE_SHOW));
    WORDS.forEach((_, i) =>
      ts.push(setTimeout(() => setWordCount(i + 1), TYPING_START + i * WORD_DELAY))
    );
    ts.push(setTimeout(() => setShowBrain(true),    BRAIN_SWITCH));
    ts.push(setTimeout(() => setShowHeading(true),  BRAIN_SWITCH + 600));
    ts.push(setTimeout(() => setShowSubtitle(true), BRAIN_SWITCH + 1050));
    ts.push(setTimeout(() => setShowBrainArea(true),BRAIN_SWITCH + 1500));
    SKILL_GAPS.forEach((gap, si) => {
      [1, 2, 3].forEach((step) =>
        ts.push(setTimeout(() =>
          setProgress(p => { const n = [...p]; n[si] = step; return n; }),
          NEURAL_BASE + gap + (step - 1) * NODE_GAP,
        ))
      );
      ts.push(setTimeout(() =>
        setCardVisible(c => { const n = [...c]; n[si] = true; return n; }),
        NEURAL_BASE + gap + 2 * NODE_GAP + 720,
      ));
    });
    // Connection grows beat (after Attention card)
    ts.push(setTimeout(() => setConnGrow(true),  NEURAL_BASE + CONN_BEAT));
    // Brain glows beat
    ts.push(setTimeout(() => setBrainGlow(true), NEURAL_BASE + GLOW_BEAT));
    ts.push(setTimeout(() => setShowButton(true), NEURAL_BASE + EXE_START + 2 * NODE_GAP + 1300));
    return () => ts.forEach(clearTimeout);
  }, []);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <NightRoomBackdrop minimal hideRug hideFloor />

      {/* Back button */}
      <button
        onClick={onBack}
        style={{
          position: "absolute", top: 52, left: 16, zIndex: 40,
          width: 46, height: 46, borderRadius: 14,
          background: "rgba(59,31,140,0.82)", border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", fontSize: 22, fontWeight: 700,
          boxShadow: "0 2px 10px rgba(0,0,0,0.28)",
        }}
      >‹</button>

      {/* ── Phase A: Mascot intro ─────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {!showBrain && (
          <motion.div
            key="intro-phase"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -44 }}
            transition={{ duration: 0.52, ease: [0.4, 0, 0.2, 1] }}
            style={{
              position: "absolute", inset: 0, zIndex: 10,
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              paddingBottom: "10%",
            }}
          >
            <AnimatePresence>
              {showBubble && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.78, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 280, damping: 22 }}
                  style={{
                    background: "#fff", borderRadius: 18,
                    padding: "14px 18px 16px",
                    maxWidth: "calc(100% - 64px)",
                    boxShadow: "0 6px 28px rgba(0,0,0,0.22)",
                    position: "relative", marginBottom: 18,
                    minHeight: 64, display: "flex", alignItems: "center",
                  }}
                >
                  <p style={{ fontFamily: F, fontSize: 15.5, fontWeight: 600, color: "#000", lineHeight: 1.55, margin: 0 }}>
                    {WORDS.slice(0, wordCount).join(" ")}
                    {wordCount < WORDS.length && (
                      <motion.span
                        style={{ display: "inline-block", width: 2, height: "1em", background: "#000", marginLeft: 2, verticalAlign: "text-bottom", borderRadius: 1 }}
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ duration: 0.75, repeat: Infinity }}
                      />
                    )}
                  </p>
                  <div style={{ position: "absolute", bottom: -12, left: "50%", marginLeft: -12, width: 0, height: 0, borderLeft: "12px solid transparent", borderRight: "12px solid transparent", borderTop: "12px solid #fff" }} />
                </motion.div>
              )}
            </AnimatePresence>
            <motion.div initial={{ y: 70, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 190, damping: 18 }}>
              <motion.div animate={{ y: [0, -11, 0] }} transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}>
                <Bobo mood="happy" tint={tint} size={200} animate />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Phase B: Brain view ───────────────────────────────────── */}
      <AnimatePresence>
        {showBrain && (
          <motion.div
            key="brain-phase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.38 }}
            style={{ position: "absolute", inset: 0, zIndex: 10, display: "flex", flexDirection: "column" }}
          >
            {/* ── Top row: mascot + bubble (below back button) ── */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.44, delay: 0.06 }}
              style={{
                display: "flex", flexDirection: "row", alignItems: "center",
                gap: 10, marginTop: 108, marginLeft: 14, marginRight: 14, flexShrink: 0,
              }}
            >
              <motion.div
                initial={{ opacity: 0, x: -20, scale: 0.6 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 240, damping: 20, delay: 0.10 }}
                style={{ flexShrink: 0 }}
              >
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                >
                  <Bobo mood="happy" tint={tint} size={108} animate armsDown />
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.42, delay: 0.24 }}
                style={{ flex: 1, background: "#fff", borderRadius: 18, padding: "13px 16px", boxShadow: "0 4px 18px rgba(0,0,0,0.20)", position: "relative" }}
              >
                <div style={{ position: "absolute", left: -10, top: "50%", transform: "translateY(-50%)", width: 0, height: 0, borderTop: "10px solid transparent", borderBottom: "10px solid transparent", borderRight: "10px solid #fff" }} />
                <p style={{ fontFamily: F, fontSize: 14.5, fontWeight: 600, color: "#000", lineHeight: 1.45, margin: 0 }}>
                  My missions help your child build skills they use every day.
                </p>
              </motion.div>
            </motion.div>
 
            {/* ── Brain section: heading + cards. Scrolls instead of
                overlapping the CTA when it doesn't fit a short viewport. ── */}
            <div style={{ flex: 1, minHeight: 0, overflowY: "auto", overflowX: "hidden", display: "flex", flexDirection: "column", alignItems: "center" }}>

              {/* Title */}
              {showHeading && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.44 }}
                  style={{ flexShrink: 0, textAlign: "center", paddingTop: 66, paddingBottom: 6, paddingLeft: 16, paddingRight: 16 }}
                >
                  <div style={{
                    fontFamily: F, fontSize: 26, fontWeight: 900, letterSpacing: 0.8, lineHeight: 1.15,
                    color: "#fff",
                    textShadow: "0 2px 16px rgba(147,51,234,0.55)",
                  }}>
                    Skills We Practice
                  </div>
                </motion.div>
              )}

    

              {/* Brain + corner cards */}
              {showBrainArea && (
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.50 }}
                style={{ flexShrink: 0, height: 360, width: "100%", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}
              >

              {/* Brain SVG — centered by flex */}
              <motion.div
                initial={{ opacity: 0, scale: 0.80 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.55 }}
                style={{ flexShrink: 0, zIndex: 10, position: "relative" }}
              >
                <motion.div
                  animate={allCardsVisible ? {
                    scale: [1, 1.05, 1],
                    filter: [
                      "drop-shadow(0 0 8px rgba(124,58,237,0.45))",
                      "drop-shadow(0 0 32px rgba(124,58,237,0.90))",
                      "drop-shadow(0 0 8px rgba(124,58,237,0.45))",
                    ],
                  } : {}}
                  transition={allCardsVisible ? {
                    duration: 2.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    repeatDelay: 0.3,
                  } : {}}
                >
                  <BrainSVG progress={progress} svgWidth={230} svgHeight={162} connectionGrow={connGrow} brainGlow={brainGlow} />
                </motion.div>
              </motion.div>

              {/* Arrow SVG overlay — viewBox 390×500, preserveAspectRatio none */}
              <svg
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 15, overflow: "visible" }}
                viewBox="0 0 390 500"
                preserveAspectRatio="none"
              >
                <defs>
                  {SKILLS.map(s => (
                    <marker key={s.id} id={`nb-ah-${s.id}`} markerWidth="7" markerHeight="6" refX="6.5" refY="3" orient="auto">
                      <path d="M0,0 L0,6 L7,3 Z" fill={s.color} opacity="0.9" />
                    </marker>
                  ))}
                </defs>
                {ARROW_PATHS.map((d, idx) =>
                  progress[idx] >= 3 && (
                    <motion.path
                      key={idx}
                      d={d}
                      stroke={SKILLS[idx].color}
                      strokeWidth="2.2"
                      strokeDasharray="6 4"
                      fill="none"
                      markerEnd={`url(#nb-ah-${SKILLS[idx].id})`}
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 0.85 }}
                      transition={{ duration: 0.65, ease: "easeOut" }}
                    />
                  )
                )}
              </svg>

              {/* Skill cards — four corners, appear after their arrow draws */}
              {SKILLS.map((skill, idx) => {
                const visible = cardVisible[idx];
                const isTop   = idx < 2;
                const isLeft  = skill.side === "left";
                return (
                  <motion.div
                    key={skill.id}
                    initial={{ opacity: 0, scale: 0.72 }}
                    animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.72 }}
                    transition={{ duration: 0.42 }}
                    style={{
                      position: "absolute",
                      ...(isTop
                        ? { top: "calc(50% - 158px)" }
                        : { bottom: "calc(50% - 158px)" }),
                      ...(isLeft ? { left: 6 } : { right: 6 }),
                      width: 118,
                      background: "rgba(6, 4, 16, 0.95)",
                      border: `2px solid ${skill.color}`,
                      borderRadius: 18,
                      padding: "14px 10px 13px",
                      display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                      boxShadow: `0 0 24px ${skill.glowColor}, 0 3px 14px rgba(0,0,0,0.55)`,
                      zIndex: 20,
                    }}
                  >
                    <div style={{
                      width: 56, height: 56, borderRadius: "50%",
                      background: `rgba(${hexChan(skill.color)},0.16)`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      boxShadow: `0 0 16px 2px ${skill.glowColor}`,
                      flexShrink: 0,
                    }}>
                      <skill.Icon size={32} />
                    </div>
                    <span style={{ fontFamily: F, fontSize: 14, fontWeight: 800, color: "#fff", lineHeight: 1.25, textAlign: "center" }}>
                      {skill.name}
                    </span>
                  </motion.div>
                );
              })}
              </motion.div>
              )}
            </div>

            {/* ── CTA ── */}
            <AnimatePresence>
              {showButton && (
                <motion.button
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ opacity: { duration: 0.4 }, y: { duration: 0.4 } }}
                  onClick={onNext}
                  style={{
                    margin: "0 20px 36px",
                    height: 62, borderRadius: 31,
                    background: "linear-gradient(180deg, #9D6FE8 0%, #7C3AED 100%)",
                    border: "none", cursor: "pointer",
                    fontFamily: F, fontSize: 20, fontWeight: 900, color: "#fff",
                    boxShadow: "0 6px 0 #5B21B6, 0 10px 28px rgba(109,40,217,0.50)",
                    touchAction: "manipulation", flexShrink: 0,
                  }}
                >
                  Continue →
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Neuro vein paths (inside brain, branching from centre sulcus) ──
const VEINS: { d: string; dur: number; delay: number }[] = [
  // left hemisphere
  { d: "M 108,60 C 98,56 88,54 80,57",   dur: 1.4, delay: 0.0 },
  { d: "M 108,78 C 97,75 86,74 78,77",   dur: 1.6, delay: 0.7 },
  { d: "M 108,96 C 97,94 86,93 78,97",   dur: 1.3, delay: 1.3 },
  { d: "M 88,55 C 84,49 82,44 80,40",     dur: 0.8, delay: 0.3 },
  { d: "M 86,74 C 82,68 80,63 78,59",     dur: 0.7, delay: 1.0 },
  // right hemisphere (mirror)
  { d: "M 112,60 C 122,56 132,54 140,57", dur: 1.4, delay: 0.4 },
  { d: "M 112,78 C 123,75 134,74 142,77", dur: 1.6, delay: 1.1 },
  { d: "M 112,96 C 123,94 134,93 142,97", dur: 1.3, delay: 1.7 },
  { d: "M 132,55 C 136,49 138,44 140,40", dur: 0.8, delay: 0.7 },
  { d: "M 134,74 C 138,68 140,63 142,59", dur: 0.7, delay: 1.4 },
];

// ── Brain SVG ─────────────────────────────────────────────────────
function BrainSVG({ progress, svgWidth = 220, svgHeight = 155, connectionGrow = false, brainGlow = false }: {
  progress: number[];
  svgWidth?: number;
  svgHeight?: number;
  connectionGrow?: boolean;
  brainGlow?: boolean;
}) {
  const HUB = { x: 110, y: 78 };
  const hubLit   = progress.some(p => p >= 3);
  const hubPulse = progress.filter(p => p >= 3).length;

  const brainPath =
    "M 40,78 C 38,46 54,22 76,17 C 87,13 98,17 103,23 " +
    "C 107,27 109,30 110,30 C 111,30 113,27 117,23 " +
    "C 122,17 133,13 144,17 C 166,22 182,46 180,78 " +
    "C 180,108 165,131 144,134 C 133,138 121,135 117,129 " +
    "C 113,123 111,120 110,120 C 109,120 107,123 103,129 " +
    "C 99,135 87,138 76,134 C 55,131 40,108 40,78 Z";

  const sulcus = "M 110,30 C 110,55 110,100 110,120";
  const gyri = [
    "M 68,54 C 75,43 87,41 93,49",
    "M 66,96 C 73,84 86,83 92,91",
    "M 152,54 C 145,43 133,41 127,49",
    "M 154,96 C 147,84 134,83 128,91",
    "M 80,72 C 86,66 94,65 98,71",
    "M 140,72 C 134,66 126,65 122,71",
  ];
  const dimNodes = [
    { x: 80, y: 78 }, { x: 140, y: 78 },
    { x: 110, y: 53 }, { x: 110, y: 103 },
  ];

  return (
    <svg width={svgWidth} height={svgHeight} viewBox="0 0 220 155" fill="none">
      <defs>
        <radialGradient id="nb-bg" cx="50%" cy="42%" r="58%">
          <stop offset="0%"   stopColor="#9D6FE8" stopOpacity="0.55" />
          <stop offset="55%"  stopColor="#6D28D9" stopOpacity="0.50" />
          <stop offset="100%" stopColor="#3B0764" stopOpacity="0.65" />
        </radialGradient>
        <radialGradient id="nb-outer-glow" cx="50%" cy="42%" r="60%">
          <stop offset="0%"   stopColor="#7C3AED" stopOpacity="0.60" />
          <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.00" />
        </radialGradient>
        <filter id="nb-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="7" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="nb-dot" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="nb-hub" x="-120%" y="-120%" width="340%" height="340%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="nb-vein" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* outer glow halo */}
      <ellipse cx="110" cy="78" rx="80" ry="72" fill="url(#nb-outer-glow)" />

      {/* brain fill + stroke */}
      <path d={brainPath} fill="#7C3AED" opacity="0.22" transform="translate(-5,-5) scale(1.05)" filter="url(#nb-glow)" />
      <path d={brainPath} fill="url(#nb-bg)" stroke="rgba(167,139,250,0.60)" strokeWidth="1.6" />
      <path d={sulcus} stroke="rgba(167,139,250,0.32)" strokeWidth="1.1" />
      {gyri.map((g, i) => <path key={i} d={g} stroke="rgba(167,139,250,0.24)" strokeWidth="1" />)}

      {/* neuro veins — static tracks */}
      {VEINS.map((v, i) => (
        <path key={`vt-${i}`} d={v.d}
          stroke={connectionGrow ? "rgba(192,132,252,0.45)" : "rgba(192,132,252,0.18)"}
          strokeWidth={connectionGrow ? "1.4" : "0.8"} fill="none"
          style={{ transition: "stroke 0.5s ease, stroke-width 0.5s ease" }}
        />
      ))}

      {/* neuro veins — travelling pulses */}
      {VEINS.map((v, i) => (
        <motion.path
          key={`vp-${i}`}
          d={v.d}
          stroke={connectionGrow ? "#E879F9" : "#C084FC"}
          strokeWidth={connectionGrow ? "2.2" : "1.4"}
          strokeLinecap="round"
          fill="none"
          strokeDasharray="5 65"
          animate={{ strokeDashoffset: [0, -70] }}
          transition={{
            duration: connectionGrow ? v.dur * 0.55 : v.dur,
            repeat: Infinity,
            ease: "linear",
            delay: v.delay,
            repeatDelay: connectionGrow ? 0.05 : v.dur * 0.4,
          }}
          filter="url(#nb-vein)"
        />
      ))}

      {/* brain glow pulse — fires when brainGlow becomes true */}
      {brainGlow && (
        <motion.path
          d={brainPath}
          fill="none"
          stroke="#A78BFA"
          strokeWidth="3"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: [0, 0.9, 0.5, 0.9, 0], scale: [0.95, 1.06, 1.0, 1.06, 1.0] }}
          transition={{ duration: 2.4, ease: "easeInOut", repeat: Infinity, repeatDelay: 1.2 }}
          style={{ transformOrigin: "110px 78px" }}
          filter="url(#nb-glow)"
        />
      )}

      {/* dim background nodes */}
      {dimNodes.map((n, i) => (
        <circle key={i} cx={n.x} cy={n.y} r={3} fill="rgba(167,139,250,0.28)" stroke="rgba(167,139,250,0.38)" strokeWidth="0.8" />
      ))}

      {/* skill connection lines + nodes */}
      {SKILLS.map((skill, si) => {
        const p         = progress[si];
        const outerLit  = p >= 1;
        const innerLit  = p >= 2;
        const connected = p >= 3;
        return (
          <g key={skill.id}>
            <line x1={skill.outer.x} y1={skill.outer.y} x2={skill.inner.x} y2={skill.inner.y}
              stroke={innerLit ? "#FFD700" : "rgba(167,139,250,0.20)"} strokeWidth={innerLit ? 2 : 1}
              strokeDasharray={innerLit ? "none" : "2.5 3"} style={{ transition: "stroke 0.35s ease" }}
              filter={innerLit ? "url(#nb-dot)" : undefined}
            />
            <line x1={skill.inner.x} y1={skill.inner.y} x2={HUB.x} y2={HUB.y}
              stroke={connected ? "#FFD700" : "rgba(167,139,250,0.16)"} strokeWidth={connected ? 2 : 1}
              strokeDasharray={connected ? "none" : "2.5 3"} style={{ transition: "stroke 0.35s ease" }}
              filter={connected ? "url(#nb-dot)" : undefined}
            />
            <circle cx={skill.outer.x} cy={skill.outer.y} r={5}
              fill={outerLit ? "#FBBF24" : "rgba(167,139,250,0.28)"}
              stroke={outerLit ? "#FFD700" : "rgba(167,139,250,0.44)"} strokeWidth={outerLit ? 1.5 : 1}
              style={{ transition: "fill 0.3s ease, stroke 0.3s ease" }}
              filter={outerLit ? "url(#nb-dot)" : undefined}
            />
            <circle cx={skill.inner.x} cy={skill.inner.y} r={5}
              fill={innerLit ? "#FBBF24" : "rgba(167,139,250,0.28)"}
              stroke={innerLit ? "#FFD700" : "rgba(167,139,250,0.44)"} strokeWidth={innerLit ? 1.5 : 1}
              style={{ transition: "fill 0.3s ease, stroke 0.3s ease" }}
              filter={innerLit ? "url(#nb-dot)" : undefined}
            />
          </g>
        );
      })}

      {/* hub node */}
      <circle cx={HUB.x} cy={HUB.y} r={hubLit ? 10 : 7}
        fill={hubLit ? "#FFD700" : "rgba(167,139,250,0.45)"}
        stroke={hubLit ? "#FFD700" : "rgba(167,139,250,0.65)"} strokeWidth={hubLit ? 2 : 1.5}
        style={{ transition: "fill 0.4s ease, stroke 0.4s ease, r 0.4s ease" }}
        filter={hubLit ? "url(#nb-hub)" : undefined}
      />
      {hubPulse > 0 && (
        <circle cx={HUB.x} cy={HUB.y} r={12 + hubPulse * 3}
          fill="none" stroke={`rgba(255,215,0,${Math.max(0.08, 0.45 - hubPulse * 0.08)})`}
          strokeWidth="1.8" style={{ transition: "all 0.45s ease" }}
        />
      )}
    </svg>
  );
}

function hexChan(hex: string): string {
  const h = hex.replace("#", "");
  return `${parseInt(h.slice(0, 2), 16)},${parseInt(h.slice(2, 4), 16)},${parseInt(h.slice(4, 6), 16)}`;
}
