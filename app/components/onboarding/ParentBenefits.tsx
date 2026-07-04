"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bobo } from "../Mascot";
import { NightRoomBackdrop } from "./WhoAreYou";

const F = "var(--font-nunito), system-ui, sans-serif";

// CSS-drawn paw print — 4 toes + palm with inner pads
function PawPrint({ size, glow, holding }: { size: number; glow?: boolean; holding?: boolean }) {
  const toe   = size * 0.265;
  const palmW = size * 0.63;
  const palmH = size * 0.58;
  const body  = "linear-gradient(145deg, #B06AEE 0%, #7B2FBE 100%)";
  const pad   = "rgba(230,185,255,0.72)";
  const palmGlow = glow
    ? "0 0 40px rgba(255,165,0,1), 0 0 80px rgba(255,130,0,0.65), 0 0 16px rgba(255,220,100,1)"
    : holding
    ? "0 0 24px rgba(255,165,0,0.70), 0 0 50px rgba(255,130,0,0.38)"
    : "0 0 18px rgba(110,45,210,0.60)";
  const toeGlow = glow
    ? "0 0 12px rgba(255,165,0,0.90)"
    : holding
    ? "0 0 7px rgba(255,165,0,0.55)"
    : "none";

  const toes = [
    { x: size * 0.03, y: size * 0.04 },
    { x: size * 0.29, y: size * 0.00 },
    { x: size * 0.54, y: size * 0.00 },
    { x: size * 0.74, y: size * 0.05 },
  ];

  return (
    <div style={{ position: "relative", width: size, height: size * 1.08, flexShrink: 0 }}>
      {toes.map((t, i) => (
        <div key={i} style={{
          position: "absolute",
          width: toe, height: toe * 1.15,
          borderRadius: "50%",
          background: body,
          left: t.x, top: t.y,
          boxShadow: toeGlow,
        }}>
          <div style={{ position: "absolute", width: "45%", height: "40%", borderRadius: "50%", background: pad, top: "22%", left: "28%" }} />
        </div>
      ))}
      <div style={{
        position: "absolute",
        width: palmW, height: palmH,
        borderRadius: "48% 48% 42% 42%",
        background: body,
        bottom: 0,
        left: (size - palmW) / 2,
        boxShadow: palmGlow,
      }}>
        {[{ x: "8%", y: "15%" }, { x: "36%", y: "11%" }, { x: "62%", y: "15%" }].map((p, i) => (
          <div key={i} style={{ position: "absolute", width: "28%", height: "26%", borderRadius: "50%", background: pad, left: p.x, top: p.y }} />
        ))}
        <div style={{ position: "absolute", width: "40%", height: "28%", borderRadius: "50%", background: pad, left: "30%", bottom: "13%" }} />
      </div>
    </div>
  );
}

export function ParentBenefits({
  tint,
  childName = "your child",
  onNext,
  onBack,
}: {
  tint: number;
  childName?: string;
  onNext: () => void;
  onBack?: () => void;
}) {
  const BUBBLE_TEXT = useMemo(
    () => `Will you let me become ${childName}'s little adventure buddy for just 10 minutes each day?`,
    [childName]
  );

  const BENEFITS = [
    {
      emoji: "🩷",
      title: "I'll help",
      highlight: "believe in themselves.",
      color: "#FF6BAD",
      desc: "Building confidence\nfor real life.",
    },
    {
      emoji: "🎯",
      title: "I'll help",
      highlight: "stay focused.",
      color: "#A78BFA",
      desc: "One adventure\nat a time.",
    },
  ];

  const [catVisible,   setCatVisible]   = useState(false);
  const [typedText,    setTypedText]    = useState("");
  const [showContent,  setShowContent]  = useState(false);
  const [holding,      setHolding]      = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [promised,     setPromised]     = useState(false);
  const [glowing,      setGlowing]      = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const ts: ReturnType<typeof setTimeout>[] = [];
    ts.push(setTimeout(() => setCatVisible(true), 200));
    const tS = 700;
    BUBBLE_TEXT.split("").forEach((_, i) =>
      ts.push(setTimeout(() => setTypedText(BUBBLE_TEXT.slice(0, i + 1)), tS + i * 34))
    );
    const after = tS + BUBBLE_TEXT.length * 34 + 400;
    ts.push(setTimeout(() => setShowContent(true), after));
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

  const R  = 80;
  const C  = 2 * Math.PI * R;
  const SZ = (R + 12) * 2; // SVG size = 184

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

      {/* ── Large cat + speech bubble ── */}
      <div style={{
        position: "relative", zIndex: 5, flexShrink: 0,
        display: "flex", alignItems: "flex-start",
        padding: "62px 14px 0 0",
        minHeight: 160,
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
                position: "relative",
                marginTop: 36, marginRight: 12,
              }}
            >
              <div style={{
                position: "absolute", left: -12, top: 22,
                width: 0, height: 0,
                borderTop: "10px solid transparent",
                borderBottom: "10px solid transparent",
                borderRight: "12px solid #fff",
              }} />
              <p style={{ fontFamily: F, fontSize: 14.5, fontWeight: 800, color: "#1a0f40", margin: 0, lineHeight: 1.38 }}>
                {renderBubble()}
              </p>
              <span style={{ position: "absolute", top: 12, right: 14, color: "#C4B5FD", fontSize: 19 }}>✦</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Scrollable content ── */}
      <div style={{
        position: "relative", zIndex: 5,
        flex: 1, minHeight: 0,
        overflowY: "auto",
        padding: "0 14px 28px",
      }}>
        <AnimatePresence>
          {showContent && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* ✦ Here's my promise to [name] ✦ */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.20)" }} />
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ color: "#FFD700", fontSize: 14 }}>✦</span>
                  <span style={{ fontFamily: F, fontSize: 15.5, fontWeight: 900, color: "#fff" }}>
                    Here's my promise to {childName}
                  </span>
                  <span style={{ color: "#FFD700", fontSize: 14 }}>✦</span>
                </div>
                <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.20)" }} />
              </div>

              {/* 2-column benefit cards */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
                {BENEFITS.map((b, i) => (
                  <div key={i} style={{
                    background: "rgba(22,14,60,0.94)",
                    borderRadius: 18,
                    padding: "16px 10px 14px",
                    display: "flex", flexDirection: "column",
                    alignItems: "center", gap: 8,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.45)",
                    position: "relative",
                  }}>
                    <span style={{ position: "absolute", top: 8, left: 9,  color: "#FFD700", fontSize: 12 }}>✦</span>
                    <span style={{ position: "absolute", top: 8, right: 9, color: "#FFD700", fontSize: 12 }}>✦</span>
                    <span style={{ fontSize: 50 }}>{b.emoji}</span>
                    <div style={{ textAlign: "center" }}>
                      <p style={{ fontFamily: F, fontSize: 15, fontWeight: 800, color: "#fff", margin: "0 0 2px", lineHeight: 1.2 }}>
                        {b.title}
                      </p>
                      <p style={{ fontFamily: F, fontSize: 14, fontWeight: 900, color: b.color, margin: "0 0 5px", lineHeight: 1.2, fontStyle: "italic" }}>
                        {b.highlight}
                      </p>
                      <p style={{ fontFamily: F, fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.56)", margin: 0, lineHeight: 1.4 }}>
                        {b.desc.split("\n").map((l, j) => <span key={j} style={{ display: "block" }}>{l}</span>)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* ── Promise box ── */}
              <div style={{
                background: "rgba(13,8,42,0.96)",
                border: "2px dashed rgba(110,72,200,0.60)",
                borderRadius: 22,
                padding: "18px 14px 20px",
                marginBottom: 12,
              }}>
                {/* Title */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, marginBottom: 4 }}>
                  <span style={{ color: "#FFD700", fontSize: 15 }}>✦</span>
                  <span style={{ fontFamily: F, fontSize: 15.5, fontWeight: 900, color: "#fff" }}>
                    Let's make our first promise together!
                  </span>
                  <span style={{ color: "#FFD700", fontSize: 15 }}>✦</span>
                </div>
                <p style={{ fontFamily: F, fontSize: 14, fontWeight: 700, color: "#8B5CF6", textAlign: "center", margin: "0 0 14px", fontStyle: "italic" }}>
                  Tap and hold to high five
                </p>

                {/* Paw row: instruction label left + ring+paw center */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", position: "relative", minHeight: SZ }}>

                  {/* "Hold for 2 seconds" — left */}
                  <div style={{
                    position: "absolute", left: 10, top: "50%",
                    transform: "translateY(-55%)",
                    display: "flex", flexDirection: "column", alignItems: "center",
                    gap: 4, pointerEvents: "none",
                  }}>
                    {/* Curved purple arrow pointing right toward paw */}
                    <svg width="52" height="54" viewBox="0 0 52 54" fill="none">
                      <path d="M 10,8 C 8,24 26,38 42,44" stroke="#8B5CF6" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                      <polygon points="40,50 48,42 38,40" fill="#8B5CF6" />
                    </svg>
                    <p style={{ fontFamily: F, fontSize: 13, fontWeight: 800, color: "#8B5CF6", margin: 0, lineHeight: 1.28, textAlign: "center" }}>
                      Hold for<br />2 seconds
                    </p>
                  </div>

                  {/* Always-visible gold circle + SVG progress ring + paw */}
                  <div
                    style={{
                      position: "relative",
                      width: SZ, height: SZ,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: "pointer", userSelect: "none", touchAction: "none",
                    }}
                    onPointerDown={startHold}
                    onPointerUp={cancelHold}
                    onPointerLeave={cancelHold}
                  >
                    {/* Static dark circle background */}
                    <div style={{
                      position: "absolute",
                      width: R * 2 + 4, height: R * 2 + 4,
                      borderRadius: "50%",
                      background: "radial-gradient(circle, rgba(50,20,110,0.85) 0%, rgba(20,8,55,0.95) 100%)",
                      border: `3px solid ${holding || promised ? "rgba(255,175,0,0.90)" : "rgba(255,165,0,0.75)"}`,
                      boxShadow: holding || promised
                        ? "0 0 36px rgba(255,160,0,0.80), 0 0 70px rgba(255,130,0,0.45)"
                        : "0 0 22px rgba(255,160,0,0.55), 0 0 50px rgba(255,120,0,0.25)",
                      transition: "box-shadow 0.2s ease, border-color 0.2s ease",
                    }} />

                    {/* SVG progress ring — fills on hold */}
                    <svg width={SZ} height={SZ} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
                      {(holding || promised) && (
                        <circle
                          cx={SZ / 2} cy={SZ / 2} r={R}
                          fill="none" stroke="#FFD700" strokeWidth={5}
                          strokeLinecap="round"
                          strokeDasharray={C}
                          strokeDashoffset={C * (1 - holdProgress / 100)}
                          transform={`rotate(-90 ${SZ / 2} ${SZ / 2})`}
                          style={{ transition: "stroke-dashoffset 0.03s linear" }}
                        />
                      )}
                    </svg>

                    {/* Paw print */}
                    <motion.div
                      animate={
                        promised
                          ? { scale: [1, 1.25, 1], rotate: [0, -8, 8, 0] }
                          : holding
                          ? { scale: 1.1 }
                          : { scale: 1 }
                      }
                      transition={promised ? { duration: 0.55 } : { duration: 0.18 }}
                      style={{ position: "relative", zIndex: 1 }}
                    >
                      <PawPrint size={130} glow={promised} holding={holding} />
                    </motion.div>

                    {/* Floating sparkles */}
                    {[
                      { top: 4,  right: 16, size: 15 },
                      { top: 18, left:  2,  size: 10 },
                      { bottom: 8, right: 4, size: 12 },
                      { bottom: 18, left: 16, size: 9 },
                    ].map((sp, i) => (
                      <motion.span
                        key={i}
                        animate={{ opacity: [0.45, 1, 0.45], scale: [0.8, 1.15, 0.8] }}
                        transition={{ duration: 1.9 + i * 0.45, repeat: Infinity, ease: "easeInOut", delay: i * 0.55 }}
                        style={{
                          position: "absolute", color: "#FFD700",
                          fontSize: sp.size, pointerEvents: "none",
                          top: "top" in sp ? sp.top : undefined,
                          bottom: "bottom" in sp ? sp.bottom : undefined,
                          left: "left" in sp ? sp.left : undefined,
                          right: "right" in sp ? sp.right : undefined,
                        }}
                      >✦</motion.span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Privacy card */}
              <div style={{
                background: "rgba(18,12,50,0.90)",
                borderRadius: 18,
                padding: "13px 14px",
                display: "flex", alignItems: "center", gap: 12,
                boxShadow: "0 4px 16px rgba(0,0,0,0.35)",
              }}>
                <span style={{ fontSize: 42, flexShrink: 0 }}>🛡️</span>
                <p style={{ fontFamily: F, fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.82)", margin: 0, lineHeight: 1.4, flex: 1 }}>
                  I'll always keep your family's information safe, private, and treat your child with care.
                </p>
                <div style={{ flexShrink: 0 }}>
                  <Bobo mood="happy" tint={tint} size={50} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Promise made: full-screen bloom flash ── */}
      <AnimatePresence>
        {glowing && (
          <motion.div
            key="bloom"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{ duration: 0.95, times: [0, 0.25, 0.60, 1], ease: "easeOut" }}
            style={{
              position: "absolute", inset: 0, zIndex: 60,
              pointerEvents: "none",
              background: "radial-gradient(circle at 50% 58%, rgba(255,230,80,1) 0%, rgba(210,100,255,0.92) 30%, rgba(90,25,200,0.80) 60%, rgba(20,8,60,0.70) 100%)",
            }}
          />
        )}
      </AnimatePresence>

      {/* Burst sparkles on promise */}
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
                  animate={{
                    opacity: [1, 1, 0],
                    x: Math.cos(rad) * dist,
                    y: Math.sin(rad) * dist,
                    scale: [0, 1.4, 0],
                  }}
                  transition={{ duration: 0.75, ease: "easeOut", delay: i * 0.04 }}
                  style={{
                    position: "absolute",
                    top: "55%", left: "50%",
                    zIndex: 55, pointerEvents: "none",
                    fontSize: 18 + (i % 3) * 4,
                    color: i % 2 === 0 ? "#FFD700" : "#fff",
                  }}
                >✦</motion.div>
              );
            })}
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
