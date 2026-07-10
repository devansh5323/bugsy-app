"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bobo } from "../Mascot";
import { NightRoomBackdrop } from "./WhoAreYou";

const F = "var(--font-nunito), system-ui, sans-serif";

const LINE1 = "Yay! I'm so happy you're here. Let me tell you about myself...";
const LINE2 = "I'm your child's pet companion- Together we grow, mastering one skill at a time";

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

  const [catVisible, setCatVisible] = useState(false);
  const [phase,      setPhase]      = useState<0 | 1 | 2 | 3>(0);
  const [typedLine1, setTypedLine1] = useState("");
  const [typedLine2, setTypedLine2] = useState("");
  const [showButton, setShowButton] = useState(false);

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
      setPhase(2);
      const l2S = 400;
      LINE2.split("").forEach((_, i) =>
        setTimeout(() => setTypedLine2(LINE2.slice(0, i + 1)), l2S + i * 35)
      );
      const doneAt = l2S + LINE2.length * 35 + 200;
      setTimeout(() => setPhase(3), doneAt);
      setTimeout(() => setShowButton(true), doneAt + 400);
    }
  }, [phase]);

  return (
    <div
      style={{ position: "absolute", inset: 0, overflow: "hidden" }}
      onClick={handleTap}
    >
      <NightRoomBackdrop minimal hideRug hideFloor />

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

      <div style={{ position: "absolute", inset: 0, zIndex: 5, display: "flex", flexDirection: "column" }}>
        <div style={{ position: "absolute", bottom: "calc(50% + 130px)", left: 24, right: 24, display: "flex", justifyContent: "center", zIndex: 8 }}>
          <AnimatePresence>
            {phase <= 1 && typedLine1.length > 0 && (
              <motion.div
                key="b1"
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.85, y: -16 }}
                transition={{ type: "spring", stiffness: 280, damping: 24 }}
                style={{ background: "#fff", borderRadius: 20, padding: "16px 22px 20px", boxShadow: "0 6px 28px rgba(0,0,0,0.22)", position: "relative", textAlign: "center", width: "100%" }}
              >
                <p style={{ fontFamily: F, fontSize: 16, fontWeight: 700, color: "#1a0f40", margin: 0, lineHeight: 1.4 }}>{typedLine1}</p>
                <div style={{ position: "absolute", bottom: -12, left: "50%", marginLeft: -12, width: 0, height: 0, borderLeft: "12px solid transparent", borderRight: "12px solid transparent", borderTop: "12px solid #fff" }} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div style={{ position: "absolute", bottom: "calc(50% + 130px)", left: 24, right: 24, display: "flex", justifyContent: "center", zIndex: 8 }}>
          <AnimatePresence>
            {phase >= 2 && typedLine2.length > 0 && (
              <motion.div
                key="b2"
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.85, y: -16 }}
                transition={{ type: "spring", stiffness: 280, damping: 24 }}
                style={{ background: "#fff", borderRadius: 20, padding: "16px 22px 20px", boxShadow: "0 6px 28px rgba(0,0,0,0.22)", position: "relative", textAlign: "center", width: "100%" }}
              >
                <p style={{ fontFamily: F, fontSize: 17, fontWeight: 700, color: "#1a0f40", margin: 0, lineHeight: 1.55 }}>{typedLine2}</p>
                <div style={{ position: "absolute", bottom: -12, left: "50%", marginLeft: -12, width: 0, height: 0, borderLeft: "12px solid transparent", borderRight: "12px solid transparent", borderTop: "12px solid #fff" }} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 5, pointerEvents: "none" }}>
          <AnimatePresence>
            {catVisible && (
              <motion.div
                initial={{ y: 60, opacity: 0, scale: 0.65 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 18 }}
              >
                <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 1.0 }}>
                  <Bobo mood="happy" tint={tint} size={200} animate armsDown />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* CTA — rises in once the mascot's intro is fully typed out */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={showButton ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ type: "spring", stiffness: 220, damping: 22 }}
          style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "6px 20px 36px", zIndex: 9, pointerEvents: showButton ? "auto" : "none" }}
        >
          <motion.button
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            animate={showButton ? { scale: [1, 1.03, 1] } : { scale: 1 }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            style={{
              width: "100%", height: 58, borderRadius: 29,
              background: "linear-gradient(180deg, #9D6FE8 0%, #7C3AED 100%)",
              border: "none", cursor: "pointer",
              fontFamily: F, fontSize: 19, fontWeight: 900, color: "#fff",
              boxShadow: "0 6px 0 #5B21B6, 0 10px 28px rgba(109,40,217,0.50)",
              touchAction: "manipulation",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              position: "relative", overflow: "hidden",
            }}
          >
            {showButton && (
              <motion.div
                initial={{ x: "-120%" }}
                animate={{ x: "220%" }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1.3, ease: "easeInOut" }}
                style={{
                  position: "absolute", top: 0, bottom: 0, width: "40%",
                  background: "linear-gradient(100deg, transparent, rgba(255,255,255,0.45), transparent)",
                  pointerEvents: "none",
                }}
              />
            )}
            Tell me how
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
              style={{ display: "inline-block" }}
            >→</motion.span>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
