"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bobo } from "../Mascot";
import { NightRoomBackdrop } from "./WhoAreYou";

const F = "var(--font-nunito), system-ui, sans-serif";
const BUBBLE_TEXT = "With daily visits you will";

const BENEFITS = [
  {
    key: "attention",
    emoji: "📊",
    iconBg: "#EDE9FE",
    iconColor: "#7C3AED",
    sparkle: "#C4B5FD",
    title: "See attention grow by 2x",
    desc: "Consistent attention helps build stronger focus and learning skills.",
  },
  {
    key: "emotional",
    emoji: "😊",
    iconBg: "#FCE7F3",
    iconColor: "#DB2777",
    sparkle: "#F9A8D4",
    title: "See a reduction in emotional meltdowns by 30%",
    desc: "Calming routines and support reduce big emotions over time.",
  },
  {
    key: "habits",
    emoji: "✅",
    iconBg: "#CCFBF1",
    iconColor: "#0D9488",
    sparkle: "#5EEAD4",
    title: "Observe healthy habit formations",
    desc: "Stay informed with simple reports and tips tailored for your child.",
  },
];

export function ParentBenefits({
  tint, onNext, onBack,
}: {
  tint: number; onNext: () => void; onBack?: () => void;
}) {
  const [catVisible,  setCatVisible]  = useState(false);
  const [typedText,   setTypedText]   = useState("");
  const [cardCount,   setCardCount]   = useState(0);
  const [showButton,  setShowButton]  = useState(false);

  useEffect(() => {
    const ts: ReturnType<typeof setTimeout>[] = [];
    ts.push(setTimeout(() => setCatVisible(true), 200));

    const tS = 700;
    BUBBLE_TEXT.split("").forEach((_, i) =>
      ts.push(setTimeout(() => setTypedText(BUBBLE_TEXT.slice(0, i + 1)), tS + i * 42))
    );

    const after = tS + BUBBLE_TEXT.length * 42 + 300;
    BENEFITS.forEach((_, i) =>
      ts.push(setTimeout(() => setCardCount(i + 1), after + i * 280))
    );
    ts.push(setTimeout(() => setShowButton(true), after + BENEFITS.length * 280 + 300));

    return () => ts.forEach(clearTimeout);
  }, []);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <NightRoomBackdrop minimal hideRug hideFloor />

      {onBack && (
        <button onClick={onBack} style={{
          position: "absolute", top: 52, left: 16, zIndex: 20,
          width: 46, height: 46, borderRadius: 14,
          background: "rgba(59,31,140,0.82)", border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", fontSize: 22, fontWeight: 700,
          boxShadow: "0 2px 10px rgba(0,0,0,0.28)",
        }}>‹</button>
      )}

      {/* ── Cat (top-left) + speech bubble (right) ── */}
      <div style={{
        position: "relative", zIndex: 5, flexShrink: 0,
        display: "flex", alignItems: "flex-start",
        padding: "90px 16px 0 12px", gap: 10,
      }}>
        <AnimatePresence>
          {catVisible && (
            <motion.div
              initial={{ x: -64, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              style={{ flexShrink: 0 }}
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3.0, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
              >
                <Bobo mood="excited" tint={tint} size={118} animate />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {typedText.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 280, damping: 24 }}
              style={{
                flex: 1, background: "#fff", borderRadius: 20,
                padding: "14px 18px 15px",
                boxShadow: "0 6px 28px rgba(0,0,0,0.22)",
                position: "relative", marginTop: 10,
              }}
            >
              <div style={{
                position: "absolute", left: -12, top: 22,
                width: 0, height: 0,
                borderTop: "10px solid transparent",
                borderBottom: "10px solid transparent",
                borderRight: "12px solid #fff",
              }} />
              <p style={{ fontFamily: F, fontSize: 17, fontWeight: 800, color: "#1a0f40", margin: 0, lineHeight: 1.35 }}>
                {typedText}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Benefit cards ── */}
      <div style={{
        position: "relative", zIndex: 5, flex: 1, minHeight: 0,
        padding: "24px 16px 0",
        display: "flex", flexDirection: "column", gap: 14,
        overflow: "hidden",
      }}>
        {BENEFITS.map((b, i) => (
          <AnimatePresence key={b.key}>
            {cardCount > i && (
              <motion.div
                initial={{ opacity: 0, y: 28, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 24 }}
                style={{
                  background: "rgba(255,255,255,0.97)",
                  borderRadius: 18,
                  padding: "14px 16px",
                  display: "flex", alignItems: "center", gap: 14,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.10)",
                  flexShrink: 0,
                  position: "relative", overflow: "hidden",
                }}
              >
                {/* Colored icon */}
                <div style={{
                  width: 60, height: 60, borderRadius: 16, flexShrink: 0,
                  background: b.iconBg,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 28,
                }}>
                  {b.emoji}
                </div>

                {/* Text */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: F, fontSize: 14.5, fontWeight: 900, color: "#1a0f40", lineHeight: 1.25, marginBottom: 4 }}>
                    {b.title}
                  </div>
                  <div style={{ fontFamily: F, fontSize: 12, fontWeight: 500, color: "rgba(26,15,64,0.52)", lineHeight: 1.4 }}>
                    {b.desc}
                  </div>
                </div>

                {/* Sparkle accent */}
                <span style={{ position: "absolute", top: 10, right: 12, color: b.sparkle, fontSize: 14 }}>✦</span>
              </motion.div>
            )}
          </AnimatePresence>
        ))}
      </div>

      {/* ── Continue button ── */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 10, padding: "10px 16px 34px" }}>
        <AnimatePresence>
          {showButton && (
            <motion.button
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              onClick={onNext}
              style={{
                width: "100%", height: 58, borderRadius: 29,
                background: "linear-gradient(180deg, #9D6FE8 0%, #7C3AED 100%)",
                border: "none", cursor: "pointer",
                fontFamily: F, fontSize: 19, fontWeight: 900, color: "#fff",
                boxShadow: "0 6px 0 #5B21B6, 0 10px 28px rgba(109,40,217,0.50)",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                touchAction: "manipulation",
              }}
            >
              Continue
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
                style={{ display: "inline-block" }}
              >→</motion.span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
