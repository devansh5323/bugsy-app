"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bobo } from "../Mascot";
import { NightRoomBackdrop } from "./WhoAreYou";

const F = "var(--font-nunito), system-ui, sans-serif";


function StarShape({ size = 128, glow = false, holding = false }: { size?: number; glow?: boolean; holding?: boolean }) {
  const star = "M50,4 L61.2,34.6 L93.7,35.8 L68.1,55.9 L77.1,87.2 L50,69 L22.9,87.2 L31.9,55.9 L6.3,35.8 L38.8,34.6 Z";
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" style={{
      display: "block",
      filter: glow
        ? "drop-shadow(0 0 26px rgba(255,210,0,1)) drop-shadow(0 0 52px rgba(255,140,0,0.80))"
        : holding
        ? "drop-shadow(0 2px 14px rgba(200,110,0,0.90))"
        : "drop-shadow(0 4px 10px rgba(160,70,0,0.60))",
    }}>
      <defs>
        <linearGradient id="sgFace" x1="0.28" y1="0" x2="0.72" y2="1">
          <stop offset="0%" stopColor="#FFF07A" />
          <stop offset="38%" stopColor="#FFC400" />
          <stop offset="100%" stopColor="#E07200" />
        </linearGradient>
        <linearGradient id="sgSide" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#B85000" />
          <stop offset="100%" stopColor="#7A2800" />
        </linearGradient>
        <radialGradient id="sgSpec" cx="33%" cy="20%" r="42%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.92)" />
          <stop offset="55%" stopColor="rgba(255,255,220,0.28)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
        <radialGradient id="sgBot" cx="50%" cy="94%" r="55%">
          <stop offset="0%" stopColor="rgba(110,35,0,0.42)" />
          <stop offset="100%" stopColor="rgba(110,35,0,0)" />
        </radialGradient>
      </defs>
      {/* 3-D extrusion layers — depth shadow */}
      <g transform="translate(3,5)"><path d={star} fill="url(#sgSide)" opacity="0.65" /></g>
      <g transform="translate(2,3.5)"><path d={star} fill="#C05800" opacity="0.50" /></g>
      <g transform="translate(1,2)"><path d={star} fill="#D06800" opacity="0.40" /></g>
      {/* Main face */}
      <path d={star} fill="url(#sgFace)" />
      {/* Bottom depth shadow */}
      <path d={star} fill="url(#sgBot)" />
      {/* Specular highlight */}
      <path d={star} fill="url(#sgSpec)" />
      {/* Bright inner glint */}
      <ellipse cx="34" cy="22" rx="9" ry="7" fill="rgba(255,255,255,0.38)" transform="rotate(-18 34 22)" />
    </svg>
  );
}

type Benefit = {
  emoji: string;
  stat: string;
  statDesc: string;
  color: string;
  glow: string;
  bgFrom: string;
  bgTo: string;
};

// A single benefit card — illustration + stat, always showing its full
// content. Shared between the resting grid slot and the center-stage
// overlay via the caller's matching layoutId.
function BenefitCard({ b }: { b: Benefit }) {
  return (
    <div style={{
      position: "relative", width: "100%", height: "100%", borderRadius: 18, overflow: "hidden",
      display: "flex", flexDirection: "column",
      boxShadow: `0 4px 18px rgba(0,0,0,0.5), 0 0 0 1.5px ${b.color}40`,
    }}>
      <div style={{
        position: "relative", flex: "0 0 58%",
        display: "flex", alignItems: "center", justifyContent: "center",
        background: `radial-gradient(circle at 50% 32%, ${b.glow} 0%, ${b.bgFrom} 55%, ${b.bgTo} 100%)`,
      }}>
        <span style={{ position: "absolute", top: 10, left: 12, fontSize: 8, color: "#fff", opacity: 0.85 }}>✦</span>
        <span style={{ position: "absolute", top: 18, right: 13, fontSize: 6, color: "#fff", opacity: 0.6 }}>✦</span>
        <span style={{ position: "absolute", bottom: 10, right: 11, fontSize: 7, color: "#fff", opacity: 0.5 }}>✦</span>
        <div style={{
          width: 56, height: 56, borderRadius: "50%",
          background: "rgba(255,255,255,0.14)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 29,
          boxShadow: `0 0 22px ${b.glow}`,
        }}>
          <span>{b.emoji}</span>
        </div>
      </div>
      <div style={{
        flex: 1, background: b.bgTo,
        padding: "10px 6px 12px", textAlign: "center",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      }}>
        <p style={{ fontFamily: F, fontSize: 23, fontWeight: 900, color: "#fff", margin: 0, lineHeight: 1 }}>{b.stat}</p>
        <p style={{ fontFamily: F, fontSize: 10.5, fontWeight: 700, color: "rgba(255,255,255,0.82)", margin: "4px 0 0", lineHeight: 1.25 }}>{b.statDesc}</p>
        <div style={{ height: 1, width: "100%", background: `${b.color}55`, marginTop: 4 }} />
      </div>
    </div>
  );
}

// A soft pulsing glow bloom behind a card, while it's center-stage.
function SoftGlow({ color }: { color: string }) {
  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: [0, 0.9, 0.65], scale: [0.85, 1.18, 1.1] }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{
        position: "absolute", inset: -34, borderRadius: 34,
        background: `radial-gradient(circle, ${color}66 0%, ${color}22 55%, transparent 75%)`,
        filter: "blur(8px)", pointerEvents: "none",
      }}
    />
  );
}

export function ParentBenefits({
  tint, onNext, onBack,
}: {
  tint: number; onNext: () => void; onBack?: () => void;
}) {
  const BUBBLE_TEXT = useMemo(
    () => "Here's my promise to you and your child",
    []
  );

  const BENEFITS = [
    {
      emoji: "🧠",
      stat: "2x", statDesc: "longer focus sessions",
      color: "#60A5FA", glow: "rgba(96,165,250,0.55)", bgFrom: "#1e3a8a", bgTo: "#0c1a4a",
    },
    {
      emoji: "🩷",
      stat: "30%", statDesc: "lesser emotional meltdown",
      color: "#F472B6", glow: "rgba(244,114,182,0.55)", bgFrom: "#831843", bgTo: "#3b0a24",
    },
    {
      emoji: "🌱",
      stat: "Daily", statDesc: "habit streaks that stick",
      color: "#4ADE80", glow: "rgba(74,222,128,0.55)", bgFrom: "#14532d", bgTo: "#052e12",
    },
  ];

  const [catVisible,    setCatVisible]    = useState(false);
  const [typedText,     setTypedText]     = useState("");
  const [revealStep,    setRevealStep]    = useState(0);
  const [holding,       setHolding]       = useState(false);
  const [holdProgress,  setHoldProgress]  = useState(0);
  const [promised,      setPromised]      = useState(false);
  const [glowing,       setGlowing]       = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Per-card choreography: hidden → center (pops straight into view at
  // full size, mid-screen, and glows) → settled (shrinks back to its
  // grid slot and stays there).
  type CardStage = "hidden" | "center" | "settled";
  const [cardStages, setCardStages] = useState<CardStage[]>(["hidden", "hidden", "hidden"]);
  const [activeCard, setActiveCard] = useState<number | null>(null);

  const setCardAt = (i: number, stage: CardStage) =>
    setCardStages((prev) => prev.map((v, idx) => (idx === i ? stage : v)));

  useEffect(() => {
    const ts: ReturnType<typeof setTimeout>[] = [];
    ts.push(setTimeout(() => setCatVisible(true), 200));
    const tS = 700;
    BUBBLE_TEXT.split("").forEach((_, i) =>
      ts.push(setTimeout(() => setTypedText(BUBBLE_TEXT.slice(0, i + 1)), tS + i * 34))
    );
    const after = tS + BUBBLE_TEXT.length * 34 + 400;

    // One card's full appear-at-center → glow → return cycle.
    const APPEAR_MS = 380;
    const GLOW_HOLD_MS = 950;
    const RETURN_MS = 560;
    const GAP_MS = 220;
    const PER_CARD_MS = APPEAR_MS + GLOW_HOLD_MS + RETURN_MS + GAP_MS;

    let cursor = after + 300;
    BENEFITS.forEach((_, i) => {
      const t0 = cursor;
      ts.push(setTimeout(() => { setActiveCard(i); setCardAt(i, "center"); }, t0));
      ts.push(setTimeout(() => {
        setActiveCard(null);
        setCardAt(i, "settled");
      }, t0 + APPEAR_MS + GLOW_HOLD_MS));
      cursor = t0 + PER_CARD_MS;
    });

    // Trust subtext appears shortly after the cards settle, then the
    // star/promise box follows quickly behind it.
    ts.push(setTimeout(() => setRevealStep(4), cursor + 150));
    ts.push(setTimeout(() => setRevealStep(5), cursor + 450));
    ts.push(setTimeout(() => setRevealStep(6), cursor + 850));

    return () => ts.forEach(clearTimeout);
  }, [BUBBLE_TEXT]);

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  const startHold = () => {
    if (promised) return;
    setHolding(true);
    setHoldProgress(0);
    let step = 0;
    const steps = 2000 / 30;
    intervalRef.current = setInterval(() => {
      step++;
      const pct = Math.min((step / steps) * 100, 100);
      setHoldProgress(pct);
      if (pct >= 100) {
        clearInterval(intervalRef.current!);
        intervalRef.current = null;
        setPromised(true);
        setHolding(false);
        setTimeout(() => setGlowing(true), 120);
        setTimeout(() => onNext(), 1100);
      }
    }, 30);
  };

  const cancelHold = () => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    if (!promised) { setHolding(false); setHoldProgress(0); }
  };

  const renderBubble = () => {
    const marker = "10 minutes";
    const idx = typedText.indexOf(marker);
    if (idx === -1) return <>{typedText}</>;
    return (
      <>
        {typedText.slice(0, idx)}
        <span style={{ color: "#7C3AED", fontWeight: 900 }}>{marker}</span>
        {typedText.slice(idx + marker.length)}
      </>
    );
  };

  const R  = 63;
  const C  = 2 * Math.PI * R;
  const SZ = (R + 10) * 2;

  const slideUp = {
    initial:    { opacity: 0, y: 20 },
    animate:    { opacity: 1, y: 0 },
    transition: { type: "spring" as const, stiffness: 230, damping: 26 },
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

      {/* Cat + bubble — vertically centered against each other so the
          bubble's tail always points at the cat regardless of its size. */}
      <div style={{
        position: "relative", zIndex: 5, flexShrink: 0,
        display: "flex", alignItems: "center",
        padding: "106px 14px 0 0", minHeight: 160,
      }}>
        <AnimatePresence>
          {catVisible && (
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 160, damping: 20 }}
              style={{ flexShrink: 0, zIndex: 2 }}
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
              >
                <Bobo mood="excited" tint={tint} size={125} animate tailWag />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {typedText.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              style={{
                flex: 1, background: "#fff", borderRadius: 20,
                padding: "12px 36px 12px 14px",
                boxShadow: "0 6px 30px rgba(0,0,0,0.25)",
                position: "relative", marginRight: 12,
              }}
            >
              <div style={{ position: "absolute", left: -12, top: "50%", marginTop: -10, width: 0, height: 0, borderTop: "10px solid transparent", borderBottom: "10px solid transparent", borderRight: "12px solid #fff" }} />
              <p style={{ fontFamily: F, fontSize: 14.5, fontWeight: 800, color: "#1a0f40", margin: 0, lineHeight: 1.38 }}>
                {renderBubble()}
              </p>
              <span style={{ position: "absolute", top: 12, right: 14, color: "#C4B5FD", fontSize: 19 }}>✦</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Scrollable content */}
      <div style={{ position: "relative", zIndex: 5, flex: 1, minHeight: 0, overflowY: "auto", padding: "40px 14px 28px" }}>

        {/* 2, 3, 4 — Three benefit cards. Each takes its turn: pops
            straight into view at center stage (full size, glowing),
            then shrinks back into its grid slot and stays revealed. */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 10 }}>
          {BENEFITS.map((b, i) => (
            <div key={i} style={{ minHeight: 156 }}>
              <AnimatePresence>
                {cardStages[i] === "settled" && (
                  <motion.div
                    key={`grid-${i}`}
                    layoutId={`benefit-card-${i}`}
                    style={{ width: "100%", height: 156 }}
                    transition={{ type: "spring", stiffness: 200, damping: 24 }}
                  >
                    <BenefitCard b={b} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Center-stage overlay — the card currently taking its turn. */}
        <AnimatePresence>
          {activeCard !== null && (
            <div style={{
              position: "fixed", inset: 0, zIndex: 50,
              display: "flex", alignItems: "center", justifyContent: "center",
              pointerEvents: "none",
            }}>
              <div style={{ position: "relative", width: 196, height: 264 }}>
                <SoftGlow color={BENEFITS[activeCard].color} />
                <motion.div
                  key={`overlay-${activeCard}`}
                  layoutId={`benefit-card-${activeCard}`}
                  style={{ position: "absolute", inset: 0 }}
                  initial={{ opacity: 0, scale: 0.82 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 170, damping: 26 }}
                >
                  <BenefitCard b={BENEFITS[activeCard]} />
                </motion.div>
              </div>
            </div>
          )}
        </AnimatePresence>

        {/* Trust subtext under the 3 cards */}
        <AnimatePresence>
          {revealStep >= 4 && (
            <motion.div key="study-note" {...slideUp} style={{
              display: "flex", justifyContent: "center", marginBottom: 20,
            }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 6,
                background: "rgba(124,58,237,0.14)", border: "1px solid rgba(124,58,237,0.35)",
                borderRadius: 999, padding: "6px 14px",
              }}>
                <span style={{ fontSize: 11 }}>✅</span>
                <p style={{ fontFamily: F, fontSize: 11.5, fontWeight: 600, color: "rgba(220,210,255,0.82)", margin: 0 }}>
                  Based on the internal study of <span style={{ fontWeight: 800, color: "#fff" }}>500 families</span> in 2026
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 5 — Promise / high-five box */}
        <AnimatePresence>
          {revealStep >= 5 && (
            <motion.div key="paw" {...slideUp} style={{
              background: "rgba(13,8,42,0.96)",
              border: "1.5px solid rgba(110,72,200,0.45)",
              borderRadius: 18, padding: "12px 10px 10px", marginBottom: 10,
            }}>
              {/* Title */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5, marginBottom: 2 }}>
                <span style={{ fontFamily: F, fontSize: 13, fontWeight: 900, color: "#fff" }}>Let&apos;s make our first promise together!</span>
                <span style={{ fontSize: 13.5 }}>💜</span>
              </div>
              <p style={{ fontFamily: F, fontSize: 11.5, fontWeight: 600, color: "#8B5CF6", textAlign: "center", margin: "0 0 6px", fontStyle: "italic" }}>
                Hold to begin our adventure
              </p>

              {/* Star interactive area */}
              <div
                style={{
                  position: "relative", height: 178, overflow: "hidden", borderRadius: 14,
                  cursor: "pointer", userSelect: "none", touchAction: "none",
                }}
                onPointerDown={startHold}
                onPointerUp={cancelHold}
                onPointerLeave={cancelHold}
              >
                {/* Cloud shapes at bottom */}
                <svg width="100%" height="70" viewBox="0 0 320 70" preserveAspectRatio="none"
                  style={{ position: "absolute", bottom: 0, left: 0, right: 0, pointerEvents: "none" }}>
                  <ellipse cx="60" cy="58" rx="90" ry="32" fill="rgba(22,10,58,0.90)" />
                  <ellipse cx="200" cy="62" rx="110" ry="36" fill="rgba(18,8,50,0.95)" />
                  <ellipse cx="310" cy="56" rx="80" ry="30" fill="rgba(20,9,54,0.88)" />
                </svg>





                {/* Soft neon glow halo — static at rest, only brightens once promised */}
                <div
                  style={{
                    position: "absolute", top: "50%", left: "50%",
                    width: SZ + 40, height: SZ + 40, marginLeft: -(SZ + 40) / 2, marginTop: -(SZ + 40) / 2,
                    borderRadius: "50%", pointerEvents: "none", zIndex: 1,
                    opacity: promised ? 0.9 : 0.4,
                    background: promised
                      ? "radial-gradient(circle, rgba(255,215,0,0.35) 0%, rgba(255,215,0,0) 70%)"
                      : "radial-gradient(circle, rgba(167,139,250,0.35) 0%, rgba(167,139,250,0) 70%)",
                    filter: "blur(6px)",
                    transition: "opacity 0.4s ease, background 0.4s ease",
                  }}
                />

                {/* Circle track + fill arc around star */}
                <svg
                  width={SZ} height={SZ}
                  style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", pointerEvents: "none", zIndex: 2 }}
                >
                  {/* Base ring — plain, no glow until the fill arc appears */}
                  <circle
                    cx={SZ / 2} cy={SZ / 2} r={R}
                    fill="none"
                    stroke="rgba(167,139,250,0.45)"
                    strokeWidth={5}
                  />
                  {/* Fill arc — grows as user holds */}
                  {(holding || promised) && (
                    <circle
                      cx={SZ / 2} cy={SZ / 2} r={R}
                      fill="none"
                      stroke={promised ? "#FFD700" : "#A78BFA"}
                      strokeWidth={5}
                      strokeLinecap="round"
                      strokeDasharray={C}
                      strokeDashoffset={C * (1 - holdProgress / 100)}
                      transform={`rotate(-90 ${SZ / 2} ${SZ / 2})`}
                      style={{ transition: "stroke-dashoffset 0.03s linear, stroke 0.4s ease", filter: "drop-shadow(0 0 10px rgba(255,215,0,0.85))" }}
                    />
                  )}
                </svg>

                {/* Star — wrapper div handles centering, motion.div handles animation only */}
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 3 }}>
                  <motion.div
                    animate={
                      promised ? { scale: [1, 1.22, 1], rotate: [0, -8, 8, 0], y: 0 } :
                      holding  ? { scale: 1.10, y: -4 } :
                      { scale: 1, y: 0 }
                    }
                    transition={
                      promised ? { duration: 0.55 } :
                      holding  ? { duration: 0.18 } :
                      { duration: 0.2 }
                    }
                  >
                    <StarShape size={112} glow={promised} holding={holding} />
                  </motion.div>
                </div>

                {/* Floating gold stars */}
                {[
                  { top: 10, right: 22, size: 16, delay: 0    },
                  { bottom: 32, right: 14, size: 13, delay: 0.9 },
                  { top: 42, right: 10, size:  9, delay: 1.4  },
                  { bottom: 44, right: 40, size: 11, delay: 0.3 },
                ].map((s, i) => (
                  <motion.span
                    key={i}
                    animate={{ opacity: [0.45, 1, 0.45], scale: [0.85, 1.12, 0.85] }}
                    transition={{ duration: 2.2 + i * 0.35, repeat: Infinity, ease: "easeInOut", delay: s.delay }}
                    style={{
                      position: "absolute", color: "#FFD700",
                      fontSize: s.size, pointerEvents: "none", lineHeight: 1,
                      top:    "top"    in s ? (s as { top: number }).top       : undefined,
                      bottom: "bottom" in s ? (s as { bottom: number }).bottom : undefined,
                      left:   "left"   in s ? (s as { left: number }).left     : undefined,
                      right:  "right"  in s ? (s as { right: number }).right   : undefined,
                    }}
                  >★</motion.span>
                ))}
              </div>

              {/* Tap hint — centered below the star, pulsing pointer + press & hold */}
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                marginTop: 10, pointerEvents: "none",
              }}>
                <div style={{ position: "relative", width: 29, height: 29, flexShrink: 0 }}>
                  <motion.div
                    animate={{ scale: [1, 1.9], opacity: [0.55, 0] }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
                    style={{
                      position: "absolute", inset: 0, borderRadius: "50%",
                      border: "2px solid #A78BFA",
                    }}
                  />
                  <div style={{
                    position: "absolute", inset: 5, borderRadius: "50%",
                    background: "linear-gradient(180deg, #C4B5FD, #7C3AED)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 13, boxShadow: "0 2px 8px rgba(124,58,237,0.6)",
                  }}>👆</div>
                </div>
                <p style={{ fontFamily: F, fontSize: 11.5, fontWeight: 700, color: "#fff", margin: 0, lineHeight: 1.25 }}>
                  Press &amp; hold for <span style={{ color: "#C4B5FD", fontWeight: 900 }}>2 seconds</span>
                </p>
              </div>

              <motion.p
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                style={{ fontFamily: F, fontSize: 11, fontWeight: 700, color: "#FBBF24", textAlign: "center", margin: "6px 0 0" }}
              >
                ✨ Keep holding to begin ✨
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 6 — Privacy/safety card */}
        <AnimatePresence>
          {revealStep >= 6 && (
            <motion.div key="safety" {...slideUp} style={{
              background: "rgba(18,12,50,0.90)", borderRadius: 18,
              padding: "12px 14px",
              display: "flex", alignItems: "center", gap: 12,
              boxShadow: "0 4px 16px rgba(0,0,0,0.35)",
            }}>
              <span style={{ fontSize: 36, flexShrink: 0 }}>🛡️</span>
              <p style={{ fontFamily: F, fontSize: 12.5, fontWeight: 600, color: "rgba(255,255,255,0.82)", margin: 0, lineHeight: 1.4, flex: 1 }}>
                I&apos;ll always keep your family&apos;s information safe, private, and treat your child with care.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Full-screen bloom flash */}
      <AnimatePresence>
        {glowing && (
          <motion.div
            key="bloom"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{ duration: 0.95, times: [0, 0.25, 0.60, 1], ease: "easeOut" }}
            style={{
              position: "absolute", inset: 0, zIndex: 60, pointerEvents: "none",
              background: "radial-gradient(circle at 50% 58%, rgba(255,230,80,1) 0%, rgba(210,100,255,0.92) 30%, rgba(90,25,200,0.80) 60%, rgba(20,8,60,0.70) 100%)",
            }}
          />
        )}
      </AnimatePresence>

      {/* Sparkle burst on promise */}
      <AnimatePresence>
        {promised && (
          <>
            {[...Array(8)].map((_, i) => {
              const angle = (i / 8) * 360;
              const rad = (angle * Math.PI) / 180;
              const dist = 120;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 1, x: 0, y: 0, scale: 0 }}
                  animate={{ opacity: [1, 1, 0], x: Math.cos(rad) * dist, y: Math.sin(rad) * dist, scale: [0, 1.4, 0] }}
                  transition={{ duration: 0.75, ease: "easeOut", delay: i * 0.04 }}
                  style={{ position: "absolute", top: "55%", left: "50%", zIndex: 55, pointerEvents: "none", fontSize: 18 + (i % 3) * 4, color: i % 2 === 0 ? "#FFD700" : "#fff" }}
                >✦</motion.div>
              );
            })}
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
