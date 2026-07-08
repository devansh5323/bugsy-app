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

const REVEAL_DELAYS = [0, 460, 920, 1380, 3380, 3880];

export function ParentBenefits({
  tint, childName = "your child", onNext, onBack,
}: {
  tint: number; childName?: string; onNext: () => void; onBack?: () => void;
}) {
  const BUBBLE_TEXT = useMemo(
    () => `Will you let me become ${childName}'s little adventure buddy for just 10 minutes each day?`,
    [childName]
  );

  const BENEFITS = [
    {
      num: 1, emoji: "🎯",
      title: "Grow Attention by 2x",
      desc: "Better focus, better learning, better future.",
      color: "#60A5FA", iconBg: "rgba(30,58,138,0.75)",
    },
    {
      num: 2, emoji: "🩷",
      title: "Reduction in emotional meltdowns by 30%",
      desc: "Calmer emotions, happier days.",
      color: "#F472B6", iconBg: "rgba(131,24,67,0.75)",
    },
    {
      num: 3, emoji: "🌱",
      title: "Build healthy habits",
      desc: "Strong routines today, stronger tomorrow.",
      color: "#4ADE80", iconBg: "rgba(20,83,45,0.75)",
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

  useEffect(() => {
    const ts: ReturnType<typeof setTimeout>[] = [];
    ts.push(setTimeout(() => setCatVisible(true), 200));
    const tS = 700;
    BUBBLE_TEXT.split("").forEach((_, i) =>
      ts.push(setTimeout(() => setTypedText(BUBBLE_TEXT.slice(0, i + 1)), tS + i * 34))
    );
    const after = tS + BUBBLE_TEXT.length * 34 + 400;
    REVEAL_DELAYS.forEach((d, i) =>
      ts.push(setTimeout(() => setRevealStep(i + 1), after + d))
    );
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

  const R  = 78;
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

      {/* Cat + bubble */}
      <div style={{
        position: "relative", zIndex: 5, flexShrink: 0,
        display: "flex", alignItems: "flex-start",
        padding: "106px 14px 0 0", minHeight: 160,
      }}>
        <AnimatePresence>
          {catVisible && (
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 160, damping: 20 }}
              style={{ flexShrink: 0, zIndex: 2, marginBottom: -20 }}
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
              >
                <Bobo mood="excited" tint={tint} size={145} animate tailWag />
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
                position: "relative", marginTop: 36, marginRight: 12,
              }}
            >
              <div style={{ position: "absolute", left: -12, top: 22, width: 0, height: 0, borderTop: "10px solid transparent", borderBottom: "10px solid transparent", borderRight: "12px solid #fff" }} />
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

        {/* 1 — Header */}
        <AnimatePresence>
          {revealStep >= 1 && (
            <motion.div key="hdr" {...slideUp} style={{ textAlign: "center", marginBottom: 12 }}>
              <span style={{ fontFamily: F, fontSize: 15.5, fontWeight: 700, color: "#fff", whiteSpace: "nowrap" }}>
                Here&apos;s my promise to you and your child
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 2, 3, 4 — Three benefit cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
          {BENEFITS.map((b, i) => (
            <AnimatePresence key={i}>
              {revealStep >= i + 2 && (
                <motion.div key={`card-${i}`} {...slideUp} style={{
                  background: "rgba(18,12,55,0.96)",
                  borderRadius: 14, overflow: "hidden",
                  display: "flex", flexDirection: "column",
                  boxShadow: "0 4px 18px rgba(0,0,0,0.50)",
                  position: "relative", padding: "10px 6px 0",
                }}>
                  {/* Number badge top-left */}
                  <div style={{
                    position: "absolute", top: 7, left: 7, zIndex: 2,
                    width: 20, height: 20, borderRadius: "50%",
                    background: b.color,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <span style={{ fontFamily: F, fontSize: 11, fontWeight: 900, color: "#fff" }}>{b.num}</span>
                  </div>
                  {/* Sparkle top-right */}
                  <span style={{ position: "absolute", top: 7, right: 7, color: "#FFD700", fontSize: 12, zIndex: 2 }}>✦</span>
                  {/* Circular icon */}
                  <div style={{
                    width: 62, height: 62, borderRadius: "50%",
                    background: b.iconBg,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    alignSelf: "center", marginTop: 12, marginBottom: 9,
                    boxShadow: `0 0 16px ${b.color}55`,
                  }}>
                    <span style={{ fontSize: 33 }}>{b.emoji}</span>
                  </div>
                  {/* Text */}
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 3, paddingBottom: 11, textAlign: "center" }}>
                    <p style={{ fontFamily: F, fontSize: 12, fontWeight: 800, color: "#fff", margin: 0, lineHeight: 1.25 }}>{b.title}</p>
                  </div>
                  {/* Color bar */}
                  <div style={{ height: 3, background: b.color }} />
                </motion.div>
              )}
            </AnimatePresence>
          ))}
        </div>

        {/* 5 — Promise / high-five box */}
        <AnimatePresence>
          {revealStep >= 5 && (
            <motion.div key="paw" {...slideUp} style={{
              background: "rgba(13,8,42,0.96)",
              border: "1.5px solid rgba(110,72,200,0.45)",
              borderRadius: 20, padding: "14px 12px 12px", marginBottom: 12,
            }}>
              {/* Title */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 2 }}>
                <span style={{ fontFamily: F, fontSize: 14.5, fontWeight: 900, color: "#fff" }}>Let&apos;s make our first promise together!</span>
                <span style={{ fontSize: 15 }}>💜</span>
              </div>
              <p style={{ fontFamily: F, fontSize: 12.5, fontWeight: 600, color: "#8B5CF6", textAlign: "center", margin: "0 0 8px", fontStyle: "italic" }}>
                Hold to begin our adventure
              </p>

              {/* Star interactive area */}
              <div
                style={{
                  position: "relative", height: 200, overflow: "hidden", borderRadius: 14,
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





                {/* Circle track + fill arc around star */}
                <svg
                  width={SZ} height={SZ}
                  style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", pointerEvents: "none", zIndex: 2 }}
                >
                  {/* Static track ring — always visible */}
                  <circle
                    cx={SZ / 2} cy={SZ / 2} r={R}
                    fill="none"
                    stroke="rgba(167,139,250,0.22)"
                    strokeWidth={4}
                  />
                  {/* Fill arc — grows as user holds */}
                  {(holding || promised) && (
                    <circle
                      cx={SZ / 2} cy={SZ / 2} r={R}
                      fill="none"
                      stroke={promised ? "#FFD700" : "#A78BFA"}
                      strokeWidth={4}
                      strokeLinecap="round"
                      strokeDasharray={C}
                      strokeDashoffset={C * (1 - holdProgress / 100)}
                      transform={`rotate(-90 ${SZ / 2} ${SZ / 2})`}
                      style={{ transition: "stroke-dashoffset 0.03s linear, stroke 0.4s ease" }}
                    />
                  )}
                </svg>

                {/* Star — wrapper div handles centering, motion.div handles animation only */}
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 3 }}>
                  <motion.div
                    animate={
                      promised ? { scale: [1, 1.22, 1], rotate: [0, -8, 8, 0] } :
                      holding  ? { scale: 1.10, y: -4 } :
                      { y: [0, -7, 0] }
                    }
                    transition={
                      promised ? { duration: 0.55 } :
                      holding  ? { duration: 0.18 } :
                      { duration: 2.6, repeat: Infinity, ease: "easeInOut" }
                    }
                  >
                    <StarShape size={128} glow={promised} holding={holding} />
                  </motion.div>
                </div>

                {/* Hold label — bottom left */}
                <div style={{
                  position: "absolute", bottom: 14, left: 10, zIndex: 4,
                  display: "flex", flexDirection: "column", alignItems: "flex-start",
                  gap: 2, pointerEvents: "none",
                }}>
                  <p style={{ fontFamily: F, fontSize: 11, fontWeight: 800, color: "#C4B5FD", margin: 0, lineHeight: 1.25, textAlign: "left", letterSpacing: 0.2 }}>
                    ✨ Press &amp; hold
                  </p>
                  <p style={{ fontFamily: F, fontSize: 10, fontWeight: 600, color: "rgba(167,139,250,0.75)", margin: 0, lineHeight: 1.2, fontStyle: "italic" }}>
                    for 2 seconds
                  </p>
                  {/* Arrow pointing up-right toward the centered star */}
                  <svg width="60" height="50" viewBox="0 0 60 50" fill="none" style={{ marginTop: 3 }}>
                    <path d="M4,48 Q20,28 56,6" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" fill="none" />
                    <polygon points="53,0 62,10 50,11" fill="#A78BFA" />
                  </svg>
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
