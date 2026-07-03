"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bobo } from "../Mascot";
import { NightRoomBackdrop } from "./WhoAreYou";

const F = "var(--font-nunito), system-ui, sans-serif";

const LINE1 = "Awesome! I'm Fumi!";
const LINE2 = "I am a kitten who grows with attention and care.";
const FUMI_IDX = "Awesome! I'm ".length;

export function BugsyIntro({
  tint,
  onNext,
  onBack,
}: {
  tint: number;
  onNext: () => void;
  onBack: () => void;
}) {
  const [catVisible,  setCatVisible ] = useState(false);
  const [typedLine1,  setTypedLine1 ] = useState("");
  const [typedLine2,  setTypedLine2 ] = useState("");
  const [showButton,  setShowButton ] = useState(false);

  useEffect(() => {
    const ts: ReturnType<typeof setTimeout>[] = [];

    ts.push(setTimeout(() => setCatVisible(true), 200));

    const l1Start = 900;
    LINE1.split("").forEach((_, i) =>
      ts.push(setTimeout(() => setTypedLine1(LINE1.slice(0, i + 1)), l1Start + i * 50))
    );

    const l2Start = l1Start + LINE1.length * 50 + 380;
    LINE2.split("").forEach((_, i) =>
      ts.push(setTimeout(() => setTypedLine2(LINE2.slice(0, i + 1)), l2Start + i * 35))
    );

    ts.push(setTimeout(() => setShowButton(true), l2Start + LINE2.length * 35 + 420));

    return () => ts.forEach(clearTimeout);
  }, []);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <NightRoomBackdrop minimal hideRug hideFloor />

      {/* Back button */}
      <button
        onClick={onBack}
        style={{
          position: "absolute", top: 52, left: 16, zIndex: 20,
          width: 46, height: 46, borderRadius: 14,
          background: "rgba(59,31,140,0.82)", border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", fontSize: 22, fontWeight: 700,
          boxShadow: "0 2px 10px rgba(0,0,0,0.28)",
        }}
      >‹</button>

      {/* ── Speech bubble — anchored just above the cat ── */}
      {/* bottom: 50% screen + half cat height (107) + gap (16) = grows upward as text appears */}
      <div style={{
        position: "absolute",
        bottom: "calc(50% + 123px)",
        left: 0, right: 0,
        display: "flex", justifyContent: "center",
        zIndex: 8,
      }}>
        <AnimatePresence>
          {typedLine1.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.72 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 26 }}
              style={{
                background: "#fff",
                borderRadius: 18,
                padding: "16px 22px 20px",
                boxShadow: "0 6px 28px rgba(0,0,0,0.22)",
                maxWidth: "calc(100vw - 64px)",
                position: "relative",
                textAlign: "center",
              }}
            >
              {/* Line 1: types out, Fumi! in purple */}
              <p style={{
                fontFamily: F, fontSize: 20, fontWeight: 800,
                color: "#1a0f40", margin: 0,
                whiteSpace: "nowrap", lineHeight: 1.3,
              }}>
                {typedLine1.slice(0, FUMI_IDX)}
                {typedLine1.length > FUMI_IDX && (
                  <span style={{ color: "#7C3AED" }}>
                    {typedLine1.slice(FUMI_IDX)}
                  </span>
                )}
              </p>

              {/* Line 2: fades in then types */}
              {typedLine2.length > 0 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.22 }}
                  style={{
                    fontFamily: F, fontSize: 14, fontWeight: 500,
                    color: "rgba(26,15,64,0.82)",
                    margin: "10px 0 0", lineHeight: 1.65,
                    maxWidth: "100%",
                  }}
                >
                  {typedLine2}
                </motion.p>
              )}

              {/* Bubble tail pointing down at Fumi */}
              <div style={{
                position: "absolute", bottom: -12, left: "50%", marginLeft: -12,
                width: 0, height: 0,
                borderLeft: "12px solid transparent",
                borderRight: "12px solid transparent",
                borderTop: "12px solid #fff",
              }} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Fumi cat — vertically centered on screen ── */}
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 5, pointerEvents: "none",
      }}>
        <AnimatePresence>
          {catVisible && (
            <motion.div
              initial={{ y: 60, opacity: 0, scale: 0.65 }}
              animate={{ y: 0,  opacity: 1, scale: 1    }}
              transition={{ type: "spring", stiffness: 200, damping: 18 }}
            >
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut", delay: 1.0 }}
              >
                <Bobo mood="happy" tint={tint} size={215} animate />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Continue button — glows when it appears ── */}
      <AnimatePresence>
        {showButton && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: [1, 1.03, 1],
              boxShadow: [
                "0 6px 0 #5B21B6, 0 10px 28px rgba(109,40,217,0.50)",
                "0 6px 0 #5B21B6, 0 10px 44px rgba(157,111,232,0.85), 0 0 52px rgba(157,111,232,0.55)",
                "0 6px 0 #5B21B6, 0 10px 28px rgba(109,40,217,0.50)",
              ],
            }}
            transition={{
              opacity:    { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
              y:          { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
              scale:      { duration: 2.2,  repeat: Infinity, ease: "easeInOut", delay: 0.55 },
              boxShadow:  { duration: 2.2,  repeat: Infinity, ease: "easeInOut", delay: 0.55 },
            }}
            onClick={onNext}
            style={{
              position: "absolute", bottom: 38, left: 20, right: 20, zIndex: 20,
              height: 62, borderRadius: 31,
              background: "linear-gradient(180deg, #9D6FE8 0%, #7C3AED 100%)",
              border: "none", cursor: "pointer",
              fontFamily: F, fontSize: 20, fontWeight: 900, color: "#fff",
              boxShadow: "0 6px 0 #5B21B6, 0 10px 28px rgba(109,40,217,0.50)",
              touchAction: "manipulation",
            }}
          >
            Continue →
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
