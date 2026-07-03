"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bobo } from "../Mascot";
import { NightRoomBackdrop } from "./WhoAreYou";

const F = "var(--font-nunito), system-ui, sans-serif";

const LINE1 = "Let me tell you about myself...";
const LINE2 = "I'm your child's pet and companion to learn focus, attention, and calming skills";
const LINE3 = "As your child grows these skills, I grow with them into a strong, confident cat.";

export function ParentJourney({
  tint,
  childName,
  onNext,
  onBack,
}: {
  tint: number;
  childName: string;
  onNext: () => void;
  onBack?: () => void;
}) {
  void childName;

  const [catVisible,  setCatVisible]  = useState(false);
  // 0 = typing line1 | 1 = wait tap1 | 2 = typing line2 | 3 = wait tap2 | 4 = typing line3
  const [phase,       setPhase]       = useState<0 | 1 | 2 | 3 | 4>(0);
  const [typedLine1,  setTypedLine1]  = useState("");
  const [typedLine2,  setTypedLine2]  = useState("");
  const [typedLine3,  setTypedLine3]  = useState("");
  const [showButton,  setShowButton]  = useState(false);

  useEffect(() => {
    const ts: ReturnType<typeof setTimeout>[] = [];

    ts.push(setTimeout(() => setCatVisible(true), 200));

    const l1S = 800;
    LINE1.split("").forEach((_, i) =>
      ts.push(setTimeout(() => setTypedLine1(LINE1.slice(0, i + 1)), l1S + i * 45))
    );
    ts.push(setTimeout(() => setPhase(1), l1S + LINE1.length * 45 + 200));

    return () => ts.forEach(clearTimeout);
  }, []);

  const handleTap = useCallback(() => {
    if (phase === 1) {
      // First tap: clear line1, start typing line2
      setPhase(2);
      const l2S = 400;
      LINE2.split("").forEach((_, i) =>
        setTimeout(() => setTypedLine2(LINE2.slice(0, i + 1)), l2S + i * 35)
      );
      setTimeout(() => setPhase(3), l2S + LINE2.length * 35 + 200);
    } else if (phase === 3) {
      // Second tap: clear line2, start typing line3
      setPhase(4);
      const l3S = 400;
      LINE3.split("").forEach((_, i) =>
        setTimeout(() => setTypedLine3(LINE3.slice(0, i + 1)), l3S + i * 38)
      );
      setTimeout(() => setShowButton(true), l3S + LINE3.length * 38 + 500);
    }
  }, [phase]);

  return (
    <div
      style={{ position: "absolute", inset: 0, overflow: "hidden" }}
      onClick={handleTap}
    >
      <NightRoomBackdrop minimal hideRug hideFloor />

      {/* Back button */}
      {onBack && (
        <button
          onClick={(e) => { e.stopPropagation(); onBack(); }}
          style={{
            position: "absolute", top: 52, left: 16, zIndex: 20,
            width: 46, height: 46, borderRadius: 14,
            background: "rgba(59,31,140,0.82)", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: 22, fontWeight: 700,
            boxShadow: "0 2px 10px rgba(0,0,0,0.28)",
          }}
        >‹</button>
      )}

      {/* ── Bubble 1 — "Let me tell you about myself..." ── */}
      <div style={{
        position: "absolute",
        bottom: "calc(50% + 130px)",
        left: 24, right: 24,
        display: "flex", justifyContent: "center",
        zIndex: 8,
      }}>
        <AnimatePresence>
          {phase <= 1 && typedLine1.length > 0 && (
            <motion.div
              key="b1"
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: -16 }}
              transition={{ type: "spring", stiffness: 280, damping: 24 }}
              style={{
                background: "#fff",
                borderRadius: 20,
                padding: "16px 22px 20px",
                boxShadow: "0 6px 28px rgba(0,0,0,0.22)",
                position: "relative",
                textAlign: "center",
                width: "100%",
              }}
            >
              <p style={{
                fontFamily: F, fontSize: 19, fontWeight: 700,
                color: "#1a0f40", margin: 0, lineHeight: 1.4,
              }}>
                {typedLine1}
              </p>
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

      {/* ── Bubble 2 — line2 ── */}
      <div style={{
        position: "absolute",
        bottom: "calc(50% + 130px)",
        left: 24, right: 24,
        display: "flex", justifyContent: "center",
        zIndex: 8,
      }}>
        <AnimatePresence>
          {phase >= 2 && phase <= 3 && typedLine2.length > 0 && (
            <motion.div
              key="b2"
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: -16 }}
              transition={{ type: "spring", stiffness: 280, damping: 24 }}
              style={{
                background: "#fff",
                borderRadius: 20,
                padding: "16px 22px 20px",
                boxShadow: "0 6px 28px rgba(0,0,0,0.22)",
                position: "relative",
                textAlign: "center",
                width: "100%",
              }}
            >
              <p style={{
                fontFamily: F, fontSize: 16, fontWeight: 700,
                color: "#1a0f40", margin: 0, lineHeight: 1.55,
              }}>
                {typedLine2}
              </p>
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

      {/* ── Bubble 3 — line3 ── */}
      <div style={{
        position: "absolute",
        bottom: "calc(50% + 130px)",
        left: 24, right: 24,
        display: "flex", justifyContent: "center",
        zIndex: 8,
      }}>
        <AnimatePresence>
          {phase >= 4 && typedLine3.length > 0 && (
            <motion.div
              key="b3"
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 280, damping: 24 }}
              style={{
                background: "#fff",
                borderRadius: 20,
                padding: "16px 22px 20px",
                boxShadow: "0 6px 28px rgba(0,0,0,0.22)",
                position: "relative",
                textAlign: "center",
                width: "100%",
              }}
            >
              <p style={{
                fontFamily: F, fontSize: 16, fontWeight: 700,
                color: "#1a0f40", margin: 0, lineHeight: 1.55,
              }}>
                {typedLine3}
              </p>
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

      {/* ── Cat — vertically centered ── */}
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 5, pointerEvents: "none",
      }}>
        <AnimatePresence>
          {catVisible && (
            <motion.div
              initial={{ y: 60, opacity: 0, scale: 0.65 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 18 }}
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 1.0 }}
              >
                <Bobo mood="happy" tint={tint} size={200} animate />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Continue button ── */}
      <AnimatePresence>
        {showButton && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            style={{
              position: "absolute", bottom: 38, left: 20, right: 20, zIndex: 20,
              height: 62, borderRadius: 31,
              background: "linear-gradient(180deg, #9D6FE8 0%, #7C3AED 100%)",
              border: "none", cursor: "pointer",
              fontFamily: F, fontSize: 20, fontWeight: 900, color: "#fff",
              boxShadow: "0 6px 0 #5B21B6, 0 10px 28px rgba(109,40,217,0.50)",
              touchAction: "manipulation",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            }}
          >
            Continue
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
              style={{ display: "inline-block" }}
            >
              →
            </motion.span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
