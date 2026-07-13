"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bobo } from "../Mascot";
import { NightRoomBackdrop } from "./WhoAreYou";

const F = "var(--font-nunito), system-ui, sans-serif";
const BUBBLE = "Before we start, here's my promise to your child.";
const CHAR_MS = 38;

const PROMISES = [
  { icon: "🔒", title: "Your data stays yours",        desc: "Encrypted, never sold, never shared" },
  { icon: "👤", title: "You're always in control",     desc: "View or delete your child's data anytime" },
  { icon: "🤍", title: "Every mission is child-safe",  desc: "Designed for children, curated by experts" },
];

function fadeIn(show: boolean): React.CSSProperties {
  return {
    opacity: show ? 1 : 0,
    transform: show ? "translateY(0px)" : "translateY(14px)",
    transition: "opacity 0.4s ease-out, transform 0.4s ease-out",
  };
}

export function ConsentScreen({
  tint,
  onNext,
  onBack,
}: {
  tint: number;
  onNext: () => void;
  onBack?: () => void;
}) {
  const [confirmed,      setConfirmed]      = useState(false);
  const [agreed,         setAgreed]         = useState(false);
  const canContinue = confirmed && agreed;

  /* ── Phase 1: centered cat + bubble ── */
  const [showCat,      setShowCat]      = useState(false);
  const [showBubble,   setShowBubble]   = useState(false);
  const [typedPhase1,  setTypedPhase1]  = useState("");

  /* ── Phase 2: timeline layout ── */
  const [showTimeline,   setShowTimeline]   = useState(false);
  const [showHeading,    setShowHeading]    = useState(false);
  const [cardCount,      setCardCount]      = useState(0);
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [showCTA,        setShowCTA]        = useState(false);

  useEffect(() => {
    const ids: ReturnType<typeof setTimeout>[] = [];

    /* Phase 1 — cat bounces in, then bubble box appears, then text types */
    ids.push(setTimeout(() => setShowCat(true),    200));
    ids.push(setTimeout(() => setShowBubble(true), 850));
    const P1_TYPE_START = 950;
    BUBBLE.split("").forEach((_, i) =>
      ids.push(setTimeout(() => setTypedPhase1(BUBBLE.slice(0, i + 1)), P1_TYPE_START + i * CHAR_MS))
    );

    /* Transition to Phase 2 — 500ms after phase 1 typing finishes */
    const p1Done = P1_TYPE_START + BUBBLE.length * CHAR_MS;
    const TL = p1Done + 500;
    ids.push(setTimeout(() => setShowTimeline(true), TL));

    /* After phase 2 starts, show heading after a short delay */
    ids.push(setTimeout(() => setShowHeading(true), TL + 400));

    /* 1 second after heading → cards one by one */
    const cardsStart = TL + 400 + 1300;
    ids.push(setTimeout(() => setCardCount(1), cardsStart));
    ids.push(setTimeout(() => setCardCount(2), cardsStart + 500));
    ids.push(setTimeout(() => setCardCount(3), cardsStart + 1000));

    /* Checkboxes then CTA */
    const afterCards = cardsStart + 1500;
    ids.push(setTimeout(() => setShowCheckboxes(true), afterCards));
    ids.push(setTimeout(() => setShowCTA(true),        afterCards + 550));

    return () => ids.forEach(clearTimeout);
  }, []);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
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
            touchAction: "manipulation",
          }}
        >‹</button>
      )}

      {/* ── Phase 1: centered cat + speech bubble ── */}
      <AnimatePresence>
        {!showTimeline && (
          <motion.div
            key="pre"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            style={{
              position: "absolute", inset: 0, zIndex: 5,
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              paddingBottom: 60,
            }}
          >
            {/* Bubble above cat */}
            <div style={{
              marginBottom: 16,
              opacity: showBubble ? 1 : 0,
              transform: showBubble ? "scale(1) translateY(0)" : "scale(0.88) translateY(10px)",
              transition: "opacity 0.35s ease, transform 0.38s cubic-bezier(0.34,1.56,0.64,1)",
            }}>
              <div style={{
                background: "#fff", borderRadius: 20,
                padding: "16px 22px",
                boxShadow: "0 8px 28px rgba(0,0,0,0.22)",
                maxWidth: 300, textAlign: "center", position: "relative",
              }}>
                <p style={{ fontFamily: F, fontSize: 17, fontWeight: 700, color: "#1a0f40", margin: 0, lineHeight: 1.4, minHeight: "2.8em" }}>
                  {typedPhase1}
                  {typedPhase1.length > 0 && typedPhase1.length < BUBBLE.length && (
                    <span style={{ opacity: 0.45, animation: "cs-blink 0.7s step-end infinite" }}>|</span>
                  )}
                </p>
                <div style={{
                  position: "absolute", bottom: -11, left: "50%", marginLeft: -11,
                  width: 0, height: 0,
                  borderLeft: "11px solid transparent",
                  borderRight: "11px solid transparent",
                  borderTop: "11px solid #fff",
                }} />
              </div>
            </div>

            {/* Centered cat */}
            <div style={{
              opacity: showCat ? 1 : 0,
              transform: showCat ? "translateY(0) scale(1)" : "translateY(50px) scale(0.65)",
              transition: "opacity 0.55s cubic-bezier(0.34,1.56,0.64,1), transform 0.55s cubic-bezier(0.34,1.56,0.64,1)",
            }}>
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
              >
                <Bobo mood="excited" tint={tint} size={190} animate armsDown />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Phase 2: timeline layout ── */}
      <AnimatePresence>
        {showTimeline && (
          <motion.div
            key="timeline"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "absolute", inset: 0, zIndex: 8,
              display: "flex", flexDirection: "column", overflow: "hidden",
            }}
          >
            {/* Scrollable content */}
            <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", paddingBottom: 16 }}>

              {/* Bubble above + centered mascot */}
              <div style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                padding: "136px 20px 0", marginBottom: 20,
              }}>
                {/* Speech bubble */}
                <div style={{
                  background: "#fff", borderRadius: 18,
                  padding: "12px 20px",
                  boxShadow: "0 6px 24px rgba(0,0,0,0.22)",
                  position: "relative", marginBottom: 14,
                  textAlign: "center", whiteSpace: "nowrap",
                }}>
                  <p style={{ fontFamily: F, fontSize: 15, fontWeight: 700, color: "#1a0f40", margin: 0, lineHeight: 1.4 }}>
                    {BUBBLE}
                  </p>
                  {/* Downward tail */}
                  <div style={{
                    position: "absolute", bottom: -11, left: "50%", marginLeft: -11,
                    width: 0, height: 0,
                    borderLeft: "11px solid transparent",
                    borderRight: "11px solid transparent",
                    borderTop: "11px solid #fff",
                  }} />
                </div>

                {/* Mascot */}
                <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
                  <Bobo mood="excited" tint={tint} size={130} animate armsDown />
                </motion.div>
              </div>

              {/* Heading */}
              <div style={{ textAlign: "center", marginBottom: 16, padding: "0 16px", ...fadeIn(showHeading) }}>
                <h1 style={{ fontFamily: F, fontSize: 22, fontWeight: 900, color: "#fff", margin: "0 0 5px", lineHeight: 1.2 }}>
                  Your family&apos;s privacy matters
                </h1>
              
              </div>

              {/* Promise cards — one by one */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18, padding: "0 12px" }}>
                {PROMISES.map((p, i) => (
                  <div
                    key={i}
                    style={{
                      background: "rgba(15,8,55,0.72)",
                      border: "1px solid rgba(110,70,210,0.30)",
                      borderRadius: 14, padding: "13px 14px",
                      display: "flex", alignItems: "center", gap: 12,
                      ...fadeIn(cardCount > i),
                    }}
                  >
                    {/* Icon container */}
                    <div style={{
                      width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                      background: "rgba(90,50,190,0.38)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 20,
                    }}>
                      {p.icon}
                    </div>

                    {/* Title + description */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontFamily: F, fontSize: 14, fontWeight: 800, color: "#fff", margin: "0 0 2px", lineHeight: 1.25 }}>
                        {p.title}
                      </p>
                      <p style={{ fontFamily: F, fontSize: 11.5, fontWeight: 500, color: "rgba(255,255,255,0.55)", margin: 0, lineHeight: 1.35 }}>
                        {p.desc}
                      </p>
                    </div>

                    {/* Checkmark */}
                    <span style={{ flexShrink: 0, fontSize: 16, color: "rgba(167,139,250,0.85)", fontWeight: 700 }}>✓</span>
                  </div>
                ))}
              </div>

              {/* Checkboxes */}
              <div style={{
                display: "flex", flexDirection: "column", gap: 12, padding: "0 12px",
                ...fadeIn(showCheckboxes),
              }}>
                <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={confirmed}
                    onChange={e => setConfirmed(e.target.checked)}
                    style={{ marginTop: 2, width: 18, height: 18, cursor: "pointer", accentColor: "#7C3AED", flexShrink: 0 }}
                  />
                  <span style={{ fontFamily: F, fontSize: 12.5, fontWeight: 600, color: "rgba(255,255,255,0.85)", lineHeight: 1.45 }}>
                    I confirm I am the child&apos;s parent or legal guardian.
                  </span>
                </label>

                <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={e => setAgreed(e.target.checked)}
                    style={{ marginTop: 2, width: 18, height: 18, cursor: "pointer", accentColor: "#7C3AED", flexShrink: 0 }}
                  />
                  <span style={{ fontFamily: F, fontSize: 12.5, fontWeight: 600, color: "rgba(255,255,255,0.85)", lineHeight: 1.45 }}>
                    I agree to the{" "}
                    <span style={{ color: "#A78BFA", textDecoration: "underline", cursor: "pointer" }}>Privacy Policy</span>
                    {" "}and{" "}
                    <span style={{ color: "#A78BFA", textDecoration: "underline", cursor: "pointer" }}>Terms of Use</span>
                  </span>
                </label>
              </div>

            </div>

            {/* CTA — pinned to bottom */}
            <div style={{
              padding: "6px 18px 36px", flexShrink: 0, position: "relative", zIndex: 10,
              pointerEvents: showCTA ? "auto" : "none",
              ...fadeIn(showCTA),
            }}>
              <button
                onClick={onNext}
                disabled={!canContinue}
                style={{
                  width: "100%", height: 60, borderRadius: 30,
                  background: canContinue
                    ? "linear-gradient(180deg, #9D6FE8 0%, #7C3AED 100%)"
                    : "rgba(124,58,237,0.28)",
                  border: "none",
                  cursor: canContinue ? "pointer" : "not-allowed",
                  fontFamily: F, fontSize: 18, fontWeight: 900, color: "#fff",
                  boxShadow: canContinue ? "0 6px 0 #5B21B6, 0 10px 28px rgba(109,40,217,0.50)" : "none",
                  touchAction: "manipulation",
                  transition: "background 0.25s, box-shadow 0.25s",
                }}
              >
                I Agree &amp; Continue
              </button>
            </div>

            <style>{`@keyframes cs-blink { 0%,100%{opacity:0.45} 50%{opacity:0} }`}</style>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
