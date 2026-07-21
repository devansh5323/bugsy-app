"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bobo } from "../Mascot";
import { NightRoomBackdrop } from "./WhoAreYou";

const F = "var(--font-nunito), system-ui, sans-serif";
const CHAR_MS = 38;

function LockIcon({ size = 14, color = "rgba(255,255,255,0.55)" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="5" y="11" width="14" height="10" rx="2" fill="none" stroke={color} strokeWidth="1.8" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke={color} strokeWidth="1.8" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function BadgeSparkle({ size = 14, style }: { size?: number; style?: React.CSSProperties }) {
  return (
    <span style={{ position: "absolute", fontSize: size, color: "#FBBF24", lineHeight: 1, ...style }}>✦</span>
  );
}

function LockShieldIcon({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <path d="M20 3 33 8v10c0 9-5.5 15.5-13 19-7.5-3.5-13-10-13-19V8Z" fill="none" stroke="#8B7FE0" strokeWidth="2" />
      <rect x="13.5" y="17" width="13" height="11" rx="2.5" fill="#FBBF24" />
      <path d="M16.5 17v-3a3.5 3.5 0 0 1 7 0v3" stroke="#B8860B" strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx="20" cy="21.5" r="1.8" fill="#8A5A06" />
    </svg>
  );
}

function PersonShieldIcon({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <circle cx="18" cy="14" r="6" fill="#7DD3FC" />
      <path d="M6 32c0-7 5.4-12 12-12s12 5 12 12" fill="#7DD3FC" />
      <circle cx="29" cy="28" r="8" fill="#1A1040" stroke="#7DD3FC" strokeWidth="1.5" />
      <path d="M25.5 28l2.4 2.4 4.6-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function GlowHeartIcon({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <defs>
        <radialGradient id="cs-heart-grad" cx="40%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FDA4E8" />
          <stop offset="100%" stopColor="#E84FC9" />
        </radialGradient>
      </defs>
      <path d="M20 33s-12-7.3-12-16.3C8 11.4 11.6 8 16 8c1.9 0 3.7.9 4 2.3.3-1.4 2.1-2.3 4-2.3 4.4 0 8 3.4 8 8.7C32 25.7 20 33 20 33Z" fill="url(#cs-heart-grad)" />
    </svg>
  );
}

const PROMISES = [
  { Icon: LockShieldIcon, sparkles: true, title: "Your data stays yours",        desc: "Encrypted, never sold, never shared" },
  { Icon: PersonShieldIcon, sparkles: false, title: "You're always in control",     desc: "View or delete your child's data anytime" },
  { Icon: GlowHeartIcon, sparkles: false, title: "Every mission is child-safe",  desc: "Designed for children, curated by experts" },
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
  parentName,
  onNext,
  onBack,
}: {
  tint: number;
  parentName?: string;
  onNext: () => void;
  onBack?: () => void;
}) {
  const PName = parentName?.trim() || "Parent";
  const BUBBLE = `Woohoo, Welcome ${PName}! Here is my promise to your family.`;

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
                maxWidth: 340, textAlign: "center", position: "relative",
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
                  textAlign: "center", maxWidth: 280,
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
                <h1 style={{ fontFamily: F, fontSize: 22, fontWeight: 900, color: "#fff", margin: 0, lineHeight: 1.2 }}>
                  Your family&apos;s privacy matters
                </h1>
              </div>

              {/* Promise cards — one by one */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 18, padding: "0 14px" }}>
                {PROMISES.map((p, i) => (
                  <div
                    key={i}
                    style={{
                      background: "rgba(15,8,55,0.72)",
                      border: "1px solid rgba(110,70,210,0.30)",
                      borderRadius: 18, padding: "16px 16px",
                      display: "flex", alignItems: "center", gap: 14,
                      ...fadeIn(cardCount > i),
                    }}
                  >
                    {/* Icon badge */}
                    <div style={{
                      width: 66, height: 66, borderRadius: "50%", flexShrink: 0, position: "relative",
                      background: "radial-gradient(circle at 35% 30%, #4C3A9E, #1A1040 78%)",
                      boxShadow: "inset 0 2px 4px rgba(255,255,255,0.18), inset 0 -4px 8px rgba(0,0,0,0.45), 0 4px 10px rgba(0,0,0,0.4)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {p.sparkles && (
                        <>
                          <BadgeSparkle size={13} style={{ top: 2, right: 4 }} />
                          <BadgeSparkle size={10} style={{ bottom: 8, left: 2 }} />
                        </>
                      )}
                      <p.Icon size={38} />
                    </div>

                    {/* Title + description */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontFamily: F, fontSize: 15, fontWeight: 800, color: "#fff", margin: "0 0 3px", lineHeight: 1.25 }}>
                        {p.title}
                      </p>
                      <p style={{ fontFamily: F, fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.55)", margin: 0, lineHeight: 1.35 }}>
                        {p.desc}
                      </p>
                    </div>

                    {/* Divider */}
                    <div style={{ flexShrink: 0, width: 1, alignSelf: "stretch", background: "rgba(255,255,255,0.14)" }} />

                    {/* Checkmark badge */}
                    <div style={{
                      flexShrink: 0, width: 38, height: 38, borderRadius: "50%",
                      background: "linear-gradient(180deg, #9D6FE8, #6D28D9)",
                      boxShadow: "0 3px 8px rgba(109,40,217,0.5)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <span style={{ color: "#fff", fontSize: 16, fontWeight: 900 }}>✓</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Checkboxes */}
              <div style={{
                display: "flex", flexDirection: "column", padding: "0 14px",
                ...fadeIn(showCheckboxes),
              }}>
                <label style={{ position: "relative", display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer", padding: "6px 0" }}>
                  <div style={{
                    marginTop: 2, flexShrink: 0, width: 24, height: 24, borderRadius: 7,
                    background: confirmed ? "linear-gradient(180deg, #9D6FE8, #6D28D9)" : "transparent",
                    border: confirmed ? "none" : "2px solid rgba(167,139,250,0.5)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: confirmed ? "0 2px 6px rgba(109,40,217,0.5)" : "none",
                  }}>
                    {confirmed && <span style={{ color: "#fff", fontSize: 13, fontWeight: 900 }}>✓</span>}
                  </div>
                  <input
                    type="checkbox"
                    checked={confirmed}
                    onChange={e => setConfirmed(e.target.checked)}
                    style={{ position: "absolute", opacity: 0, width: 0, height: 0 }}
                  />
                  <span style={{ fontFamily: F, fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.9)", lineHeight: 1.45 }}>
                    I confirm I am the child&apos;s parent or legal guardian.
                  </span>
                </label>

                <div style={{ borderTop: "1px dashed rgba(255,255,255,0.18)", margin: "4px 0" }} />

                <label style={{ position: "relative", display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer", padding: "6px 0" }}>
                  <div style={{
                    marginTop: 2, flexShrink: 0, width: 24, height: 24, borderRadius: 7,
                    background: agreed ? "linear-gradient(180deg, #9D6FE8, #6D28D9)" : "transparent",
                    border: agreed ? "none" : "2px solid rgba(167,139,250,0.5)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: agreed ? "0 2px 6px rgba(109,40,217,0.5)" : "none",
                  }}>
                    {agreed && <span style={{ color: "#fff", fontSize: 13, fontWeight: 900 }}>✓</span>}
                  </div>
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={e => setAgreed(e.target.checked)}
                    style={{ position: "absolute", opacity: 0, width: 0, height: 0 }}
                  />
                  <span style={{ fontFamily: F, fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.9)", lineHeight: 1.45 }}>
                    I agree to the{" "}
                    <span style={{ color: "#A78BFA", textDecoration: "underline", cursor: "pointer" }}>Privacy Policy</span>
                    {" "}and{" "}
                    <span style={{ color: "#A78BFA", textDecoration: "underline", cursor: "pointer" }}>Terms of Use</span>
                    .
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
                  width: "100%", height: 58, borderRadius: 29,
                  background: canContinue
                    ? "linear-gradient(180deg, #A78BFA 0%, #7C3AED 100%)"
                    : "rgba(124,58,237,0.28)",
                  border: "none",
                  cursor: canContinue ? "pointer" : "not-allowed",
                  fontFamily: F, fontSize: 18, fontWeight: 900, color: "#fff",
                  boxShadow: canContinue ? "0 6px 20px rgba(139,92,246,0.55)" : "none",
                  touchAction: "manipulation",
                  transition: "background 0.25s, box-shadow 0.25s",
                }}
              >
                I Agree &amp; Continue
              </button>

              <div style={{ marginTop: 14, textAlign: "center" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                  <LockIcon />
                  <span style={{ fontFamily: F, fontSize: 12.5, fontWeight: 600, color: "rgba(255,255,255,0.55)" }}>
                    COPPA &bull; GDPR &bull; DPDP Compliant
                  </span>
                </div>
                <p style={{ margin: "4px 0 0", fontFamily: F, fontSize: 12.5, fontWeight: 600, color: "rgba(255,255,255,0.55)" }}>
                  Children&apos;s Privacy Protected
                </p>
              </div>
            </div>

            <style>{`@keyframes cs-blink { 0%,100%{opacity:0.45} 50%{opacity:0} }`}</style>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
