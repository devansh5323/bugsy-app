"use client";

import { motion, type Variants, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { NightRoomBackdrop } from "./WhoAreYou";

const F     = "var(--font-nunito), system-ui, sans-serif";
const W     = 344;   // content width
const TOTAL = 15;

const OPTS = [
  { id: "a", icon: "🔭", label: "Always"    },
  { id: "b", icon: "👁️", label: "Often"     },
  { id: "c", icon: "😊", label: "Sometimes" },
  { id: "d", icon: "🤔", label: "Rarely"    },
  { id: "e", icon: "🌙", label: "Never"     },
];

type Question = { text: string; hint?: string };

const QUESTIONS: Question[] = [
  { text: "Does [N] show interest in playing with other children?" },
  { text: "Does your child explain why routines are important?", hint: "Such as brushing teeth at bedtime or going to bed early" },
  { text: "Does [N] express their feelings clearly to you?" },
  { text: "Can [N] follow two or three instructions in a row?" },
  { text: "Does [N] show concern when someone near them is upset?" },
  { text: "Does [N] try new things even when they feel a bit nervous?" },
  { text: "Can [N] focus on a single activity for more than 10 minutes?" },
  { text: "Does [N] bounce back after feeling sad or frustrated?" },
  { text: "Can [N] understand and follow basic rules at home?" },
  { text: "Does [N] ask questions about why things happen?" },
  { text: "Does [N] handle switching between activities without difficulty?" },
  { text: "Can [N] name the emotion they're feeling in the moment?" },
  { text: "Does [N] enjoy creative play like drawing, building, or pretending?" },
  { text: "Does [N] respond well to praise and encouragement?" },
  { text: "Does [N] wake up feeling rested and ready for the day?" },
];

/* ── centering helper ─────────────────────────────────────────────
   Use this on plain divs (not motion elements) so CSS transform
   centering never conflicts with framer-motion's own transforms.  */
const centered = (extra?: React.CSSProperties): React.CSSProperties => ({
  position: "absolute",
  left: "50%",
  transform: "translateX(-50%)",
  width: W,
  ...extra,
});

/* slide variants — framer-motion translates X; parent handles centering */
const slideV: Variants = {
  hidden: (d: number) => ({ opacity: 0, x: d * 48 }),
  show:   { opacity: 1, x: 0,        transition: { duration: 0.36, ease: [0.22, 1, 0.36, 1] } },
  exit:   (d: number) => ({ opacity: 0, x: d * -48, transition: { duration: 0.22 } }),
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

  const [idx,         setIdx]         = useState(0);
  const [answers,     setAnswers]     = useState<Record<number, string>>({});
  const [dir,         setDir]         = useState(1);
  const [celebrating, setCelebrating] = useState(false);

  const isLast   = idx === TOTAL - 1;
  const barPct   = (idx + 1) / TOTAL;
  const question = QUESTIONS[idx].text.replace(/\[N\]/g, name);
  const hint     = QUESTIONS[idx].hint;
  const selected = answers[idx];

  // navigate to the next screen after the celebration animation finishes
  useEffect(() => {
    if (!celebrating) return;
    const t = window.setTimeout(onNext, 2800);
    return () => window.clearTimeout(t);
  }, [celebrating, onNext]);

  const goNext = () => {
    if (!isLast) { setDir(1);  setIdx((i) => i + 1); }
    else          setCelebrating(true);
  };
  const goBack = () => {
    if (idx > 0) { setDir(-1); setIdx((i) => i - 1); }
    else          onBack();
  };
  const pick = (optId: string) =>
    setAnswers((prev) => {
      if (prev[idx] === optId) {
        const next = { ...prev };
        delete next[idx];
        return next;
      }
      return { ...prev, [idx]: optId };
    });

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <NightRoomBackdrop minimal hideRug />

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

      {/* ══ PROGRESS BAR ══
          Plain div — safe to use CSS transform for centering. */}
      <div style={centered({ top: 118, zIndex: 4 })}>
        {/* row: "X of 15" + pill track */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontFamily: F, fontSize: 15, fontWeight: 800, color: "#fff", whiteSpace: "nowrap" }}>
            {idx + 1} of {TOTAL}
          </span>

          <div style={{ flex: 1, height: 14, position: "relative", borderRadius: 7 }}>
            {/* track bg */}
            <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.22)", borderRadius: 7 }} />
            {/* fill */}
            <motion.div
              animate={{ width: `${barPct * 100}%` }}
              transition={{ duration: 0.42, ease: "easeOut" }}
              style={{ position: "absolute", top: 0, left: 0, bottom: 0, background: "linear-gradient(to right,#A855F7,#7C3AED)", borderRadius: 7 }}
            />
            {/* heart marker — uses animate for "left", not transform */}
            <motion.div
              animate={{ left: `calc(${barPct * 100}% - 15px)` }}
              transition={{ duration: 0.42, ease: "easeOut" }}
              style={{
                position: "absolute", top: "50%", marginTop: -15,
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
        <p style={{ fontFamily: F, fontSize: 14, fontWeight: 600, color: "#A78BFA", textAlign: "center", margin: "26px 0 0" }}>
          Learning about {name}
        </p>
      </div>

      {/* ══ QUESTION + OPTIONS ══
          Wrapper div centers the column; motion.div animates inside it.
          Keeping centering CSS off the motion element prevents framer-motion
          from overwriting translateX(-50%) with its own x-slide transform. */}
      <div
        style={centered({ top: 204, bottom: 92, zIndex: 3, overflow: "hidden" })}
      >
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={idx}
            custom={dir}
            variants={slideV}
            initial="hidden"
            animate="show"
            exit="exit"
            style={{
              position: "absolute", inset: 0,
              display: "flex", flexDirection: "column",
            }}
          >
            {/* hint — shown above question when present */}
            {hint && (
              <p
                style={{
                  fontFamily: F, fontSize: 13, fontWeight: 600,
                  color: "rgba(196,181,253,0.85)", textAlign: "center",
                  lineHeight: 1.5, margin: "0 0 10px",
                  letterSpacing: 0.1,
                }}
              >
                {hint}
              </p>
            )}

            {/* question text */}
            <p
              style={{
                fontFamily: F, fontSize: 28, fontWeight: 900,
                color: "#fff", textAlign: "center",
                lineHeight: 1.42, margin: 0,
                textShadow: "0 2px 24px rgba(0,0,0,0.35)",
              }}
            >
              {question}
            </p>

            {/* fixed gap — matches the small gap in the reference */}
            <div style={{ flexShrink: 0, height: 32 }} />

            {/* options */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {OPTS.map((opt) => {
                const sel = selected === opt.id;
                return (
                  <motion.div
                    key={opt.id}
                    onClick={() => pick(opt.id)}
                    whileHover={{ scale: 1.04, transition: { type: "spring", stiffness: 380, damping: 22 } }}
                    whileTap={{ scale: 0.97 }}
                    style={{
                      display: "flex", alignItems: "center", gap: 16,
                      padding: "19px 18px",
                      borderRadius: 18,
                      background: sel ? "#EDE9FF" : "#FAFAF8",
                      cursor: "pointer",
                      boxShadow: sel
                        ? "0 3px 14px rgba(109,40,217,0.24)"
                        : "0 3px 10px rgba(0,0,0,0.10)",
                    }}
                  >
                    <span style={{ fontSize: 30, lineHeight: 1, userSelect: "none" }}>{opt.icon}</span>
                    <span style={{ flex: 1, fontFamily: F, fontSize: 17, fontWeight: 700, color: "#1A1040" }}>
                      {opt.label}
                    </span>
                    <div
                      style={{
                        width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                        background: sel ? "#7C3AED" : "transparent",
                        border: sel ? "none" : "2.5px solid rgba(109,40,217,0.28)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        boxShadow: sel ? "0 3px 10px rgba(124,58,237,0.45)" : "none",
                      }}
                    >
                      {sel && <span style={{ color: "#fff", fontSize: 14, fontWeight: 900, lineHeight: 1 }}>✓</span>}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ══ CTA ══
          Plain wrapper div centers; glow div + motion.button sit inside.
          The glow is a blurred div that pulses when an option is selected. */}
      <div style={centered({ bottom: 24, zIndex: 6 })}>
        {/* pulsing glow — only mounts when an answer is picked */}
        <AnimatePresence>
          {selected && (
            <motion.div
              key="cta-glow"
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{
                opacity: [0.55, 0.85, 0.55],
                scale:   [1,    1.07,  1   ],
              }}
              exit={{ opacity: 0, scale: 0.88, transition: { duration: 0.2 } }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              style={{
                position: "absolute",
                inset: -10,
                borderRadius: 40,
                background: "linear-gradient(135deg, #A855F7, #6D28D9)",
                filter: "blur(16px)",
                zIndex: 0,
                pointerEvents: "none",
              }}
            />
          )}
        </AnimatePresence>

        <motion.button
          key={`cta-${idx}`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          onClick={goNext}
          whileHover={{ y: -3, scale: 1.015 }}
          whileTap={{ scale: 0.98 }}
          style={{
            position: "relative", zIndex: 1,
            width: "100%", height: 60,
            borderRadius: 30,
            background: "linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)",
            border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            fontFamily: F, fontSize: 20, fontWeight: 900, color: "#fff",
            boxShadow: selected
              ? "0 8px 32px rgba(109,40,217,0.55)"
              : "0 12px 30px rgba(109,70,255,0.35)",
            touchAction: "manipulation",
          }}
        >
          {isLast ? "Done" : "Next"}&nbsp;→
        </motion.button>
      </div>

      {/* ── celebration overlay — plays when Done is tapped on Q15 ── */}
      <AnimatePresence>
        {celebrating && (
          <motion.div
            key="celebrate-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.32 }}
            style={{
              position: "absolute", inset: 0, zIndex: 40,
              background: "radial-gradient(ellipse at 50% 46%, #2D0B6B 0%, #130333 55%, #09011E 100%)",
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              gap: 26, overflow: "hidden",
            }}
          >
            {/* ── falling confetti ── */}
            {([
              { x: "6%",  color: "#FCD34D", w: 12, h: 7,  rot:  25, dur: 0.0, hex: false },
              { x: "14%", color: "#F472B6", w: 10, h: 10, rot: -30, dur: 0.1, hex: true  },
              { x: "21%", color: "#60A5FA", w: 11, h: 7,  rot:  15, dur: 0.2, hex: false },
              { x: "30%", color: "#34D399", w: 9,  h: 9,  rot: -10, dur: 0.3, hex: true  },
              { x: "39%", color: "#FBBF24", w: 13, h: 8,  rot:  40, dur: 0.0, hex: false },
              { x: "50%", color: "#A78BFA", w: 10, h: 10, rot:   0, dur: 0.15,hex: true  },
              { x: "59%", color: "#F87171", w: 11, h: 7,  rot: -20, dur: 0.25,hex: false },
              { x: "68%", color: "#FCD34D", w: 9,  h: 9,  rot:  10, dur: 0.05,hex: true  },
              { x: "76%", color: "#EC4899", w: 12, h: 7,  rot: -35, dur: 0.18,hex: false },
              { x: "84%", color: "#38BDF8", w: 10, h: 10, rot:   5, dur: 0.28,hex: true  },
              { x: "91%", color: "#A3E635", w: 11, h: 7,  rot:  30, dur: 0.08,hex: false },
              { x: "10%", color: "#FB923C", w: 9,  h: 9,  rot: -15, dur: 0.35,hex: true  },
              { x: "44%", color: "#E879F9", w: 12, h: 8,  rot:  20, dur: 0.22,hex: false },
              { x: "72%", color: "#4ADE80", w: 10, h: 7,  rot: -25, dur: 0.12,hex: false },
            ] as { x: string; color: string; w: number; h: number; rot: number; dur: number; hex: boolean }[])
              .map((c, i) => (
                <motion.div
                  key={`fc-${i}`}
                  initial={{ top: -20, rotate: c.rot, opacity: 1 }}
                  animate={{ top: "108%", rotate: c.rot + (i % 2 ? 380 : -380), opacity: 0.85 }}
                  transition={{ delay: 0.18 + c.dur * 1.4, duration: 2.0 + c.dur * 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                  style={{
                    position: "absolute", left: c.x,
                    width: c.w, height: c.hex ? c.w : c.h,
                    background: c.color,
                    borderRadius: c.hex ? 0 : 3,
                    clipPath: c.hex ? "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)" : undefined,
                    pointerEvents: "none",
                  }}
                />
              ))}

            {/* ── 3 expanding rings (different colours) ── */}
            {([
              { delay: 0.2,  color: "167,139,250", size: 148 },
              { delay: 0.45, color: "236,72,153",  size: 148 },
              { delay: 0.7,  color: "96,165,250",  size: 148 },
            ] as { delay: number; color: string; size: number }[]).map((r, i) => (
              <motion.div
                key={`ring-${i}`}
                initial={{ scale: 0.55, opacity: 0.8 }}
                animate={{ scale: 3.4, opacity: 0 }}
                transition={{ delay: r.delay, duration: 1.7, ease: "easeOut" }}
                style={{
                  position: "absolute",
                  width: r.size, height: r.size, borderRadius: "50%",
                  border: `2.5px solid rgba(${r.color},0.75)`,
                  pointerEvents: "none",
                }}
              />
            ))}

            {/* ── 12 directional burst particles ── */}
            {([
              { angle: 0,   color: "#FCD34D", size: 14 },
              { angle: 30,  color: "#F472B6", size: 11 },
              { angle: 60,  color: "#60A5FA", size: 15 },
              { angle: 90,  color: "#34D399", size: 12 },
              { angle: 120, color: "#FBBF24", size: 14 },
              { angle: 150, color: "#A78BFA", size: 11 },
              { angle: 180, color: "#F87171", size: 15 },
              { angle: 210, color: "#FCD34D", size: 12 },
              { angle: 240, color: "#EC4899", size: 14 },
              { angle: 270, color: "#38BDF8", size: 11 },
              { angle: 300, color: "#A3E635", size: 15 },
              { angle: 330, color: "#FB923C", size: 12 },
            ] as { angle: number; color: string; size: number }[]).map((p, i) => {
              const rad = (p.angle * Math.PI) / 180;
              const dist = 130;
              return (
                <motion.div
                  key={`bp-${i}`}
                  initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                  animate={{
                    x: Math.cos(rad) * dist,
                    y: Math.sin(rad) * dist,
                    scale: [0, 1.5, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{ delay: 0.5 + i * 0.035, duration: 1.15, ease: "easeOut" }}
                  style={{
                    position: "absolute",
                    width: p.size, height: p.size, borderRadius: "50%",
                    background: p.color,
                    pointerEvents: "none",
                  }}
                />
              );
            })}

            {/* ── star sparkles orbiting the circle ── */}
            {([
              { x: -90, y: -65, delay: 0.95,  size: 20 },
              { x:  82, y: -60, delay: 1.1,  size: 16 },
              { x: -98, y:  18, delay: 1.25, size: 18 },
              { x:  92, y:  22, delay: 1.02, size: 14 },
              { x: -28, y: -98, delay: 1.18, size: 16 },
              { x:  32, y: -95, delay: 1.32, size: 18 },
            ] as { x: number; y: number; delay: number; size: number }[]).map((s, i) => (
              <motion.span
                key={`star-${i}`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1.4, 1], opacity: [0, 1, 0.7], y: [0, -8, 0] }}
                transition={{ delay: s.delay, duration: 1.3, repeat: Infinity, repeatDelay: 0.5, ease: "easeInOut" }}
                style={{
                  position: "absolute", left: `calc(50% + ${s.x}px)`, top: `calc(50% + ${s.y}px)`,
                  fontSize: s.size, pointerEvents: "none", userSelect: "none",
                }}
              >✦</motion.span>
            ))}

            {/* ── main tick circle — low-damping spring = joyful bounce ── */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 9, delay: 0.35 }}
              style={{
                width: 148, height: 148, borderRadius: "50%",
                background: "linear-gradient(135deg, #9333EA 0%, #5B21B6 100%)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 0 55px rgba(147,51,234,0.85), 0 0 110px rgba(147,51,234,0.45)",
              }}
            >
              {/* SVG tick drawn progressively */}
              <motion.svg viewBox="0 0 60 60" width={88} height={88} style={{ overflow: "visible" }}>
                <motion.path
                  d="M 11 30 L 25 45 L 51 15"
                  stroke="white" strokeWidth="5.5"
                  strokeLinecap="round" strokeLinejoin="round"
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ delay: 0.85, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                />
              </motion.svg>
            </motion.div>

            {/* ── "You did it!" text ── */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <motion.p
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 14, delay: 1.1 }}
                style={{
                  fontFamily: F, fontSize: 30, fontWeight: 900,
                  color: "#fff", margin: 0, textAlign: "center",
                  textShadow: "0 2px 24px rgba(0,0,0,0.45)",
                }}
              >
                You did it! 🎉
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.35, duration: 0.5 }}
                style={{
                  fontFamily: F, fontSize: 16, fontWeight: 600,
                  color: "#C4B5FD", margin: 0, textAlign: "center",
                }}
              >
                Assessment Complete ✨
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
