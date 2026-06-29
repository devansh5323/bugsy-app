"use client";

import { motion, type Variants, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { NightRoomBackdrop } from "./WhoAreYou";

const F     = "var(--font-nunito), system-ui, sans-serif";
const NB_L  = 23;
const NB_W  = 344;
const TOTAL = 15;

/* same 5 frequency options for every question — matches the reference exactly */
const OPTS = [
  { id: "a", icon: "🔭", label: "Always"    },
  { id: "b", icon: "👁️", label: "Often"     },
  { id: "c", icon: "😊", label: "Sometimes" },
  { id: "d", icon: "🤔", label: "Rarely"    },
  { id: "e", icon: "🌙", label: "Never"     },
];

/* [N] = child name placeholder */
const QUESTIONS: string[] = [
  "Does [N] show interest in playing with other children?",
  "Can [N] observe and describe things they see around them?",
  "Does [N] express their feelings clearly to you?",
  "Can [N] follow two or three instructions in a row?",
  "Does [N] show concern when someone near them is upset?",
  "Does [N] try new things even when they feel a bit nervous?",
  "Can [N] focus on a single activity for more than 10 minutes?",
  "Does [N] bounce back after feeling sad or frustrated?",
  "Can [N] understand and follow basic rules at home?",
  "Does [N] ask questions about why things happen?",
  "Does [N] handle switching between activities without difficulty?",
  "Can [N] name the emotion they're feeling in the moment?",
  "Does [N] enjoy creative play like drawing, building, or pretending?",
  "Does [N] respond well to praise and encouragement?",
  "Does [N] wake up feeling rested and ready for the day?",
];

/* slide variants — direction is +1 (forward) or -1 (back) */
const slideV: Variants = {
  hidden: (d: number) => ({ opacity: 0, x: d * 52 }),
  show:   { opacity: 1, x: 0,       transition: { duration: 0.36, ease: [0.22, 1, 0.36, 1] } },
  exit:   (d: number) => ({ opacity: 0, x: d * -52, transition: { duration: 0.22 } }),
};

export function QuestionnaireScreen({
  childName,
  onNext,
  onBack,
}: {
  childName: string;
  onNext: () => void;
  onBack: () => void;
}) {
  const name = childName.trim() || "your child";

  const [idx,     setIdx]     = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [dir,     setDir]     = useState(1); // +1 forward / -1 backward

  const isLast   = idx === TOTAL - 1;
  const barPct   = (idx + 1) / TOTAL;
  const question = QUESTIONS[idx].replace(/\[N\]/g, name);
  const selected = answers[idx];

  const goNext = () => {
    if (!isLast) { setDir(1);  setIdx((i) => i + 1); }
    else          onNext();
  };
  const goBack = () => {
    if (idx > 0) { setDir(-1); setIdx((i) => i - 1); }
    else          onBack();
  };
  const pick = (optId: string) =>
    setAnswers((prev) => ({ ...prev, [idx]: optId }));

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      {/* full night room — moon + stars + clouds visible */}
      <NightRoomBackdrop hideRug />

      {/* ── back ── */}
      <motion.button
        onClick={goBack}
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

      {/* ── progress bar ── */}
      <div
        style={{
          position: "absolute", top: 120, left: NB_L, width: NB_W,
          zIndex: 4,
        }}
      >
        {/* track row */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* "X of 15" */}
          <span
            style={{
              fontFamily: F, fontSize: 15, fontWeight: 800,
              color: "#FFFFFF", whiteSpace: "nowrap",
            }}
          >
            {idx + 1} of {TOTAL}
          </span>

          {/* pill track */}
          <div style={{ flex: 1, height: 14, position: "relative", borderRadius: 7 }}>
            {/* bg */}
            <div
              style={{
                position: "absolute", inset: 0,
                background: "rgba(255,255,255,0.22)", borderRadius: 7,
              }}
            />
            {/* fill */}
            <motion.div
              animate={{ width: `${barPct * 100}%` }}
              transition={{ duration: 0.42, ease: "easeOut" }}
              style={{
                position: "absolute", top: 0, left: 0, bottom: 0,
                background: "linear-gradient(to right, #A855F7, #7C3AED)",
                borderRadius: 7,
              }}
            />
            {/* heart marker */}
            <motion.div
              animate={{ left: `calc(${barPct * 100}% - 15px)` }}
              transition={{ duration: 0.42, ease: "easeOut" }}
              style={{
                position: "absolute", top: "50%", transform: "translateY(-50%)",
                width: 30, height: 30, borderRadius: "50%",
                background: "#7C3AED",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 3px 12px rgba(109,40,217,0.65)",
                zIndex: 1,
              }}
            >
              <span style={{ fontSize: 13 }}>💜</span>
            </motion.div>
          </div>
        </div>

        {/* "Learning about [name]" */}
        <p
          style={{
            fontFamily: F, fontSize: 14, fontWeight: 600,
            color: "#A78BFA", textAlign: "center", margin: "8px 0 0",
          }}
        >
          Learning about {name}
        </p>
      </div>

      {/* ── animated question + options ── */}
      <AnimatePresence mode="wait" custom={dir}>
        <motion.div
          key={idx}
          custom={dir}
          variants={slideV}
          initial="hidden"
          animate="show"
          exit="exit"
          style={{
            position: "absolute",
            top: 196, left: NB_L, width: NB_W, bottom: 92,
            display: "flex", flexDirection: "column",
          }}
        >
          {/* question text */}
          <p
            style={{
              fontFamily: F, fontSize: 27, fontWeight: 900,
              color: "#FFFFFF", textAlign: "center",
              lineHeight: 1.38, margin: 0,
              textShadow: "0 2px 20px rgba(0,0,0,0.30)",
            }}
          >
            {question}
          </p>

          {/* flexible spacer — pushes options to the bottom */}
          <div style={{ flex: 1, minHeight: 16 }} />

          {/* options */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {OPTS.map((opt) => {
              const sel = selected === opt.id;
              return (
                <motion.div
                  key={opt.id}
                  onClick={() => pick(opt.id)}
                  whileTap={{ scale: 0.975 }}
                  style={{
                    display: "flex", alignItems: "center", gap: 14,
                    padding: "15px 16px",
                    borderRadius: 16,
                    background: sel ? "#EDE9FF" : "#FFFFFF",
                    cursor: "pointer",
                    boxShadow: sel
                      ? "0 2px 12px rgba(109,40,217,0.22)"
                      : "0 2px 8px rgba(0,0,0,0.09)",
                  }}
                >
                  {/* icon */}
                  <span style={{ fontSize: 30, lineHeight: 1, userSelect: "none" }}>
                    {opt.icon}
                  </span>

                  {/* label */}
                  <span
                    style={{
                      flex: 1,
                      fontFamily: F, fontSize: 17, fontWeight: 700,
                      color: "#1A1040",
                    }}
                  >
                    {opt.label}
                  </span>

                  {/* radio */}
                  <div
                    style={{
                      width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
                      background: sel ? "#7C3AED" : "transparent",
                      border: sel ? "none" : "2.5px solid rgba(109,40,217,0.30)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      boxShadow: sel ? "0 3px 10px rgba(124,58,237,0.45)" : "none",
                    }}
                  >
                    {sel && (
                      <span style={{ color: "#fff", fontSize: 13, fontWeight: 900, lineHeight: 1 }}>
                        ✓
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ── CTA ── */}
      <motion.button
        key={`cta-${idx}`}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        onClick={goNext}
        whileHover={{ y: -3, scale: 1.015 }}
        whileTap={{ scale: 0.98 }}
        style={{
          position: "absolute",
          bottom: 24, left: NB_L, width: NB_W, height: 60,
          borderRadius: 30,
          background: "linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)",
          border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
          fontFamily: F, fontSize: 20, fontWeight: 900, color: "#fff",
          boxShadow: "0 12px 30px rgba(109,70,255,0.35)",
          zIndex: 6, touchAction: "manipulation",
        }}
      >
        {isLast ? "Done" : "Next"}&nbsp;→
      </motion.button>
    </div>
  );
}
