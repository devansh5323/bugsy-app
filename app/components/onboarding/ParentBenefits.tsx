"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bobo } from "../Mascot";
import { NightRoomBackdrop } from "./WhoAreYou";

const F = "var(--font-nunito), system-ui, sans-serif";
const BUBBLE_TEXT = "I want you to introduce your child with me for 10 mins.";

export function ParentBenefits({
  tint, onNext, onBack,
}: {
  tint: number; onNext: () => void; onBack?: () => void;
}) {
  const [catVisible,   setCatVisible]   = useState(false);
  const [typedText,    setTypedText]    = useState("");
  const [showContent,  setShowContent]  = useState(false);
  const [holding,      setHolding]      = useState(false);
  const [promised,     setPromised]     = useState(false);
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const ts: ReturnType<typeof setTimeout>[] = [];
    ts.push(setTimeout(() => setCatVisible(true), 200));
    const tS = 700;
    BUBBLE_TEXT.split("").forEach((_, i) =>
      ts.push(setTimeout(() => setTypedText(BUBBLE_TEXT.slice(0, i + 1)), tS + i * 38))
    );
    const after = tS + BUBBLE_TEXT.length * 38 + 300;
    ts.push(setTimeout(() => setShowContent(true), after));
    return () => ts.forEach(clearTimeout);
  }, []);

  const startHold = () => {
    if (promised) return;
    setHolding(true);
    holdTimerRef.current = setTimeout(() => {
      setPromised(true);
      setHolding(false);
    }, 1500);
  };

  const cancelHold = () => {
    if (holdTimerRef.current) { clearTimeout(holdTimerRef.current); holdTimerRef.current = null; }
    if (!promised) setHolding(false);
  };

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

      {/* Cat + speech bubble */}
      <div style={{
        position: "relative", zIndex: 5, flexShrink: 0,
        display: "flex", alignItems: "flex-start",
        padding: "88px 16px 0 12px", gap: 10,
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
                padding: "14px 38px 15px 18px",
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
              <p style={{ fontFamily: F, fontSize: 16, fontWeight: 800, color: "#1a0f40", margin: 0, lineHeight: 1.35 }}>
                {typedText}
              </p>
              <span style={{ position: "absolute", top: 10, right: 14, color: "#C4B5FD", fontSize: 18 }}>✦</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main content */}
      <AnimatePresence>
        {showContent && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "relative", zIndex: 5,
              flex: 1, minHeight: 0,
              display: "flex", flexDirection: "column",
              padding: "20px 16px 100px",
              overflowY: "auto",
            }}
          >
            {/* ✦ My promise is I will ✦ */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 14 }}>
              <span style={{ color: "#FFD700", fontSize: 16 }}>✦</span>
              <span style={{ fontFamily: F, fontSize: 17, fontWeight: 900, color: "#fff" }}>My promise is I will</span>
              <span style={{ color: "#FFD700", fontSize: 16 }}>✦</span>
            </div>

            {/* 2-column benefit cards */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
              {[
                { emoji: "🩷", lines: ["Make them", "independent"] },
                { emoji: "🎯", lines: ["Grow", "attention"] },
              ].map((b, i) => (
                <div key={i} style={{
                  background: "rgba(24,16,62,0.88)",
                  borderRadius: 18,
                  padding: "22px 12px 18px",
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center",
                  gap: 10,
                  boxShadow: "0 4px 18px rgba(0,0,0,0.38)",
                }}>
                  <span style={{ fontSize: 46 }}>{b.emoji}</span>
                  <div style={{ textAlign: "center" }}>
                    {b.lines.map((l, j) => (
                      <div key={j} style={{ fontFamily: F, fontSize: 15, fontWeight: 800, color: "#fff", lineHeight: 1.3 }}>{l}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* ✦ Give me a high for the promise! ✦ */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, marginBottom: 12 }}>
              <span style={{ color: "#FFD700", fontSize: 13 }}>✦</span>
              <span style={{ fontFamily: F, fontSize: 15, fontWeight: 900, color: "#fff" }}>Give me a high for the promise!</span>
              <span style={{ color: "#FFD700", fontSize: 13 }}>✦</span>
            </div>

            {/* Paw print hold box */}
            <div
              onPointerDown={startHold}
              onPointerUp={cancelHold}
              onPointerLeave={cancelHold}
              style={{
                background: "rgba(14,9,42,0.92)",
                border: "2px dashed rgba(120,80,210,0.72)",
                borderRadius: 22,
                padding: "22px 16px 16px",
                display: "flex", flexDirection: "column",
                alignItems: "center",
                gap: 10,
                marginBottom: 14,
                cursor: "pointer",
                userSelect: "none",
                touchAction: "none",
                position: "relative",
              }}
            >
              {/* Pulse ring while holding */}
              <AnimatePresence>
                {holding && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: [0.6, 0.2, 0.6], scale: [0.85, 1.15, 0.85] }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.0, repeat: Infinity, ease: "easeInOut" }}
                    style={{
                      position: "absolute", top: "50%", left: "50%",
                      transform: "translate(-50%, -58%)",
                      width: 136, height: 136, borderRadius: "50%",
                      border: "3px solid #FFD700",
                      pointerEvents: "none",
                    }}
                  />
                )}
              </AnimatePresence>

              <motion.div
                animate={
                  promised
                    ? { scale: [1, 1.28, 1], y: [0, -12, 0] }
                    : holding
                    ? { scale: 1.12 }
                    : { scale: 1 }
                }
                transition={promised ? { duration: 0.5, ease: "easeOut" } : { duration: 0.15 }}
                style={{
                  fontSize: 92,
                  lineHeight: 1,
                  pointerEvents: "none",
                  filter: promised
                    ? "drop-shadow(0 0 28px rgba(255,210,0,1)) drop-shadow(0 0 10px rgba(255,255,100,0.9))"
                    : "drop-shadow(0 0 20px rgba(255,180,0,0.85))",
                }}
              >
                🐾
              </motion.div>

              <span style={{
                fontFamily: F, fontSize: 15, fontWeight: 800,
                color: promised ? "#FFD700" : "#8B5CF6",
              }}>
                {promised ? "Promise made! 🎉" : "Hold here for promise"}
              </span>
            </div>

            {/* Privacy card */}
            <div style={{
              background: "rgba(18,12,50,0.90)",
              borderRadius: 18,
              padding: "14px 16px",
              display: "flex", alignItems: "center", gap: 14,
              boxShadow: "0 4px 16px rgba(0,0,0,0.35)",
            }}>
              <span style={{ fontSize: 42, flexShrink: 0 }}>🛡️</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: F, fontSize: 15, fontWeight: 900, color: "#fff", margin: "0 0 3px" }}>I promise that</p>
                <p style={{ fontFamily: F, fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.70)", margin: 0, lineHeight: 1.4 }}>
                  all your data is stored safely, and will safeguard the dignity of the child.
                </p>
              </div>
              <span style={{ color: "#C4B5FD", fontSize: 16, flexShrink: 0, alignSelf: "flex-start" }}>✦</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Continue button */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 10, padding: "10px 16px 34px" }}>
        <motion.button
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
      </div>
    </div>
  );
}
