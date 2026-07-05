"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bobo } from "../Mascot";
import { NightRoomBackdrop } from "./WhoAreYou";

const F = "var(--font-nunito), system-ui, sans-serif";
const BUBBLE_TEXT = "I'm so excited to meet your child! 💜";

export function HandoverScreen({
  tint,
  onNext,
  onBack,
}: {
  tint: number;
  onNext: () => void;
  onBack?: () => void;
}) {
  const [catIn,      setCatIn]      = useState(false);
  const [bubbleIn,   setBubbleIn]   = useState(false);
  const [typed,      setTyped]      = useState("");
  const [showText,   setShowText]   = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const ids: ReturnType<typeof setTimeout>[] = [];

    // 1. Cat slides in first
    ids.push(setTimeout(() => setCatIn(true), 300));

    // 2. Bubble box appears at t=900, typing starts at t=1000
    ids.push(setTimeout(() => setBubbleIn(true), 900));
    BUBBLE_TEXT.split("").forEach((_, i) =>
      ids.push(setTimeout(() => setTyped(BUBBLE_TEXT.slice(0, i + 1)), 1000 + i * 36))
    );

    // 3. "Now it's time" text after typing finishes
    const doneAt = 1000 + BUBBLE_TEXT.length * 36 + 400;
    ids.push(setTimeout(() => setShowText(true), doneAt));

    // 4. CTA button
    ids.push(setTimeout(() => setShowButton(true), doneAt + 600));

    return () => ids.forEach(clearTimeout);
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

      {/* Upper section */}
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "0 28px", marginTop: -40,
      }}>

        {/* Speech bubble — stays mounted, transitions in */}
        <div style={{
          position: "relative", marginBottom: 14, zIndex: 2,
          opacity: bubbleIn ? 1 : 0,
          transform: bubbleIn ? "scale(1) translateY(0)" : "scale(0.84) translateY(10px)",
          transition: "opacity 0.35s ease, transform 0.35s cubic-bezier(0.34,1.56,0.64,1)",
        }}>
          <div style={{
            background: "#fff", borderRadius: 22,
            padding: "16px 22px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.24)",
            maxWidth: 310, textAlign: "center",
          }}>
            <p style={{
              fontFamily: F, fontSize: 22, fontWeight: 800,
              color: "#1a0f40", margin: 0, lineHeight: 1.3,
              minHeight: "2.6em",
            }}>
              {typed}
              {typed.length > 0 && typed.length < BUBBLE_TEXT.length && (
                <span style={{ opacity: 0.5, animation: "hs-blink 0.7s step-end infinite" }}>|</span>
              )}
            </p>
          </div>
          <div style={{
            position: "absolute", bottom: -11, left: "50%", marginLeft: -11,
            width: 0, height: 0,
            borderLeft: "11px solid transparent",
            borderRight: "11px solid transparent",
            borderTop: "11px solid #fff",
          }} />
        </div>

        {/* Excited cat — CSS transition, never unmounts */}
        <div style={{
          opacity: catIn ? 1 : 0,
          transform: catIn ? "translateY(0) scale(1)" : "translateY(60px) scale(0.7)",
          transition: "opacity 0.55s cubic-bezier(0.34,1.56,0.64,1), transform 0.55s cubic-bezier(0.34,1.56,0.64,1)",
        }}>
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 1.0 }}
          >
            <Bobo mood="excited" tint={tint} size={220} animate tailWag />
          </motion.div>
        </div>

        {/* "Now it's time…" */}
        <div style={{
          textAlign: "center", marginTop: 20,
          opacity: showText ? 1 : 0,
          transform: showText ? "translateY(0)" : "translateY(14px)",
          transition: "opacity 0.5s ease, transform 0.5s ease",
          pointerEvents: "none",
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "center", gap: 10, marginBottom: 2 }}>
            <span style={{ color: "#FFD700", fontSize: 20, marginTop: 4 }}>✦</span>
            <p style={{ fontFamily: F, fontSize: 27, fontWeight: 900, color: "#fff", margin: 0, lineHeight: 1.25 }}>
              Now it&apos;s time to{" "}
              <span style={{ color: "#A78BFA" }}>hand over</span>
              {" "}the device to{" "}
              <span style={{ color: "#A78BFA" }}>your child.</span>
            </p>
            <span style={{ color: "#FFD700", fontSize: 20, marginTop: 4 }}>✦</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 12 }}>
            <span style={{ color: "#FFD700", fontSize: 13 }}>✦</span>
            <p style={{ fontFamily: F, fontSize: 15, fontWeight: 600, color: "rgba(255,255,255,0.48)", margin: 0 }}>
              Here&apos;s what happens next
            </p>
            <span style={{ color: "#FFD700", fontSize: 13 }}>✦</span>
          </div>
        </div>
      </div>

      {/* CTA button — stays mounted, transitions in */}
      <div style={{ flexShrink: 0, padding: "0 24px 44px" }}>
        <div style={{
          opacity: showButton ? 1 : 0,
          transform: showButton ? "translateY(0)" : "translateY(18px)",
          transition: "opacity 0.4s ease, transform 0.4s ease",
          pointerEvents: showButton ? "auto" : "none",
        }}>
          <button
            onClick={onNext}
            style={{
              width: "100%", height: 66, borderRadius: 34,
              background: "linear-gradient(180deg, #9D6FE8 0%, #7C3AED 100%)",
              border: "none", cursor: "pointer",
              fontFamily: F, fontSize: 22, fontWeight: 900, color: "#fff",
              boxShadow: "0 6px 0 #5B21B6, 0 12px 32px rgba(109,40,217,0.50)",
              touchAction: "manipulation",
            }}
          >
            Let&apos;s start the journey
          </button>
        </div>
      </div>

      <style>{`
        @keyframes hs-blink { 0%,100%{opacity:1} 50%{opacity:0} }
      `}</style>
    </div>
  );
}
