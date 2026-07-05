"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bobo } from "../Mascot";
import { NightRoomBackdrop } from "./WhoAreYou";

const F = "var(--font-nunito), system-ui, sans-serif";

export function HandoverScreen({
  tint,
  onNext,
  onBack,
}: {
  tint: number;
  onNext: () => void;
  onBack?: () => void;
}) {
  const [showCat,    setShowCat]    = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [showText,   setShowText]   = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const ts: ReturnType<typeof setTimeout>[] = [];
    ts.push(setTimeout(() => setShowCat(true),    150));
    ts.push(setTimeout(() => setShowBubble(true), 700));
    ts.push(setTimeout(() => setShowText(true),   1300));
    ts.push(setTimeout(() => setShowButton(true), 1900));
    return () => ts.forEach(clearTimeout);
  }, []);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <NightRoomBackdrop minimal hideRug hideFloor />

      {onBack && (
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
      )}

      {/* Upper section: bubble + cat */}
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "0 28px", marginTop: -40,
      }}>

        {/* Speech bubble */}
        <AnimatePresence>
          {showBubble && (
            <motion.div
              initial={{ opacity: 0, scale: 0.82, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              style={{ position: "relative", marginBottom: 14, zIndex: 2 }}
            >
              <div style={{
                background: "#fff",
                borderRadius: 22,
                padding: "16px 22px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.24)",
                maxWidth: 310,
                textAlign: "center",
              }}>
                <p style={{ fontFamily: F, fontSize: 22, fontWeight: 800, color: "#1a0f40", margin: 0, lineHeight: 1.3 }}>
                  I'm so excited to meet your child! 💜
                </p>
              </div>
              {/* Tail */}
              <div style={{
                position: "absolute", bottom: -11, left: "50%", marginLeft: -11,
                width: 0, height: 0,
                borderLeft: "11px solid transparent",
                borderRight: "11px solid transparent",
                borderTop: "11px solid #fff",
              }} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Excited cat */}
        <AnimatePresence>
          {showCat && (
            <motion.div
              initial={{ y: 70, opacity: 0, scale: 0.7 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 175, damping: 18 }}
            >
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 1.0 }}
              >
                <Bobo mood="excited" tint={tint} size={220} animate tailWag />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* "Now it's time to hand over…" */}
        <AnimatePresence>
          {showText && (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              style={{ textAlign: "center", marginTop: 20 }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "center", gap: 10, marginBottom: 2 }}>
                <span style={{ color: "#FFD700", fontSize: 20, marginTop: 4 }}>✦</span>
                <p style={{ fontFamily: F, fontSize: 27, fontWeight: 900, color: "#fff", margin: 0, lineHeight: 1.25 }}>
                  Now it's time to{" "}
                  <span style={{ color: "#A78BFA" }}>hand over</span>
                  {" "}the device to{" "}
                  <span style={{ color: "#A78BFA" }}>your child.</span>
                </p>
                <span style={{ color: "#FFD700", fontSize: 20, marginTop: 4 }}>✦</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 12 }}>
                <span style={{ color: "#FFD700", fontSize: 13 }}>✦</span>
                <p style={{ fontFamily: F, fontSize: 15, fontWeight: 600, color: "rgba(255,255,255,0.48)", margin: 0 }}>
                  Here's what happens next
                </p>
                <span style={{ color: "#FFD700", fontSize: 13 }}>✦</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* CTA button */}
      <div style={{ flexShrink: 0, padding: "0 24px 44px" }}>
        <AnimatePresence>
          {showButton && (
            <motion.button
              onClick={onNext}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{
                width: "100%", height: 66, borderRadius: 34,
                background: "linear-gradient(180deg, #9D6FE8 0%, #7C3AED 100%)",
                border: "none", cursor: "pointer",
                fontFamily: F, fontSize: 22, fontWeight: 900, color: "#fff",
                boxShadow: "0 6px 0 #5B21B6, 0 12px 32px rgba(109,40,217,0.50)",
                touchAction: "manipulation",
              }}
            >
              Let's start the journey
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
