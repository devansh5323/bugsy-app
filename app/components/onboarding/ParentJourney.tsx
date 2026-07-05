"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bobo } from "../Mascot";
import { NightRoomBackdrop } from "./WhoAreYou";

const F = "var(--font-nunito), system-ui, sans-serif";

const LINE_A = "Every day your child helps me grow...";
const LINE_B = "And together, we'll grow their confidence too! ✨";

const STAGES = [
  { num: 1,  size: 34, title: "Tiny steps",       desc: "Bugsy takes his first steps with\nyour child's help.",           icon: "❤️",  label: "Trust",        labelColor: "#FF6BAD", gold: false },
  { num: 3,  size: 40, title: "Growing curious",  desc: "Your child's attention helps\nBugsy explore and learn.",        icon: "🎯",  label: "Focus",        labelColor: "#A78BFA", gold: false },
  { num: 6,  size: 46, title: "More confident",   desc: "Bugsy feels braver as your child\nkeeps showing up.",           icon: "😊",  label: "Confidence",   labelColor: "#FFD700", gold: false },
  { num: 9,  size: 52, title: "Growing stronger", desc: "Every mission makes Bugsy\nstronger and smarter!",              icon: "🧠",  label: "Learning",     labelColor: "#A78BFA", gold: false },
  { num: 12, size: 58, title: "Almost there",     desc: "Bugsy is becoming your child's\nbest adventure buddy!",         icon: "⭐",  label: "Independence", labelColor: "#FFD700", gold: false },
  { num: 14, size: 66, title: "FULLY GROWN! 🎉",  desc: "Together, you've helped Bugsy grow\ninto a confident, happy companion!", icon: "🏆", label: "Growth", labelColor: "#FFD700", gold: true  },
];

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

  const [catVisible,    setCatVisible]    = useState(false);
  const [typedA,        setTypedA]        = useState("");
  const [typedB,        setTypedB]        = useState("");
  const [showHeading,   setShowHeading]   = useState(false);
  const [stageCount,    setStageCount]    = useState(0);
  const [showClosing,   setShowClosing]   = useState(false);
  const [showButton,    setShowButton]    = useState(false);

  useEffect(() => {
    const ts: ReturnType<typeof setTimeout>[] = [];
    ts.push(setTimeout(() => setCatVisible(true), 200));

    // Type LINE_A
    const aStart = 700;
    LINE_A.split("").forEach((_, i) =>
      ts.push(setTimeout(() => setTypedA(LINE_A.slice(0, i + 1)), aStart + i * 36))
    );
    // Type LINE_B after A finishes
    const bStart = aStart + LINE_A.length * 36 + 200;
    LINE_B.split("").forEach((_, i) =>
      ts.push(setTimeout(() => setTypedB(LINE_B.slice(0, i + 1)), bStart + i * 32))
    );

    const doneAt = bStart + LINE_B.length * 32 + 400;
    ts.push(setTimeout(() => setShowHeading(true), doneAt));
    STAGES.forEach((_, i) =>
      ts.push(setTimeout(() => setStageCount(i + 1), doneAt + 400 + i * 450))
    );
    const afterStages = doneAt + 400 + STAGES.length * 450;
    ts.push(setTimeout(() => setShowClosing(true), afterStages + 200));
    ts.push(setTimeout(() => setShowButton(true),  afterStages + 700));

    return () => ts.forEach(clearTimeout);
  }, []);

  // Highlight "confidence" in LINE_B
  const renderLineB = () => {
    const marker = "confidence";
    const idx = typedB.indexOf(marker);
    if (idx === -1) return <>{typedB}</>;
    return (
      <>
        {typedB.slice(0, idx)}
        <span style={{ color: "#7C3AED", fontWeight: 900 }}>{marker}</span>
        {typedB.slice(idx + marker.length)}
      </>
    );
  };

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

      {/* Main scrollable content */}
      <div style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "0 14px 32px" }}>

        {/* ── Cat + speech bubble ── */}
        <div style={{
          display: "flex", alignItems: "flex-end",
          padding: "96px 0 0 0", gap: 0, marginBottom: 8,
        }}>
          <AnimatePresence>
            {catVisible && (
              <motion.div
                initial={{ x: -80, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 160, damping: 20 }}
                style={{ flexShrink: 0, zIndex: 2 }}
              >
                <motion.div
                  animate={{ y: [0, -7, 0] }}
                  transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                >
                  <Bobo mood="happy" tint={tint} size={150} animate />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {typedA.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.88 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 24 }}
                style={{
                  flex: 1, background: "#fff", borderRadius: 20,
                  padding: "14px 40px 14px 16px",
                  boxShadow: "0 6px 30px rgba(0,0,0,0.25)",
                  position: "relative", marginBottom: 18, marginLeft: -8,
                }}
              >
                <div style={{ position: "absolute", left: -12, bottom: 24, width: 0, height: 0, borderTop: "10px solid transparent", borderBottom: "10px solid transparent", borderRight: "12px solid #fff" }} />
                <span style={{ position: "absolute", top: 12, right: 14, color: "#C4B5FD", fontSize: 18 }}>✦</span>
                {/* "Hi! I'm Bugsy 💜" heading */}
                <p style={{ fontFamily: F, fontSize: 19, fontWeight: 900, color: "#7C3AED", margin: "0 0 5px", lineHeight: 1.2 }}>
                  Hi! I'm Bugsy 💜
                </p>
                <p style={{ fontFamily: F, fontSize: 14, fontWeight: 700, color: "#1a0f40", margin: "0 0 3px", lineHeight: 1.4 }}>
                  {typedA}
                </p>
                {typedB.length > 0 && (
                  <p style={{ fontFamily: F, fontSize: 14, fontWeight: 700, color: "#1a0f40", margin: 0, lineHeight: 1.4 }}>
                    {renderLineB()}
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Section heading ── */}
        <AnimatePresence>
          {showHeading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{ textAlign: "center", marginBottom: 16 }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, marginBottom: 4 }}>
                <span style={{ fontSize: 18 }}>✨</span>
                <span style={{ fontFamily: F, fontSize: 18, fontWeight: 900, color: "#fff" }}>
                  Every visit helps Bugsy grow
                </span>
                <span style={{ fontSize: 18 }}>✨</span>
              </div>
              <p style={{ fontFamily: F, fontSize: 13.5, fontWeight: 700, color: "#A78BFA", margin: 0, fontStyle: "italic" }}>
                Little by little, big changes!
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Stages with left paw column ── */}
        <div style={{ position: "relative" }}>
          {/* Vertical dashed connector line */}
          {stageCount > 0 && (
            <div style={{
              position: "absolute",
              left: 21, top: 22, bottom: 22,
              width: 2,
              borderLeft: "2.5px dashed rgba(130,80,220,0.50)",
              zIndex: 0,
            }} />
          )}

          {STAGES.flatMap((stage, i) => {
            const card = (
              <div key={`row-${i}`} style={{ display: "flex", alignItems: "flex-start", gap: 10, position: "relative" }}>
                {/* Paw icon in golden circle */}
                <AnimatePresence>
                  {stageCount > i && (
                    <motion.div
                      key={`paw-${i}`}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 22 }}
                      style={{
                        width: 42, height: 42, borderRadius: "50%", flexShrink: 0,
                        background: stage.gold
                          ? "radial-gradient(circle, rgba(255,210,60,0.95) 0%, rgba(180,110,0,0.90) 100%)"
                          : "radial-gradient(circle, rgba(50,25,110,0.95) 0%, rgba(28,12,65,0.95) 100%)",
                        border: `2.5px solid ${stage.gold ? "rgba(255,185,0,0.90)" : "rgba(200,155,0,0.80)"}`,
                        boxShadow: stage.gold
                          ? "0 0 14px rgba(255,180,0,0.60)"
                          : "0 0 10px rgba(200,145,0,0.45)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        zIndex: 1, marginTop: 6,
                        fontSize: 18,
                      }}
                    >🐾</motion.div>
                  )}
                </AnimatePresence>

                {/* Stage card */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <AnimatePresence>
                    {stageCount > i && (
                      <motion.div
                        key={`card-${i}`}
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ type: "spring", stiffness: 240, damping: 26 }}
                        style={{
                          display: "flex", alignItems: "center", gap: 8,
                          padding: "10px 10px 10px 8px",
                          background: stage.gold ? "rgba(18,11,4,0.96)" : "rgba(18,12,52,0.94)",
                          border: `1.5px solid ${stage.gold ? "rgba(255,175,0,0.70)" : "rgba(70,45,155,0.60)"}`,
                          borderRadius: 18,
                          boxShadow: stage.gold
                            ? "0 0 22px rgba(255,150,0,0.32), 0 4px 14px rgba(0,0,0,0.50)"
                            : "0 4px 14px rgba(0,0,0,0.40)",
                        }}
                      >
                        {/* Cat + platform */}
                        <div style={{
                          width: 70, flexShrink: 0,
                          display: "flex", flexDirection: "column",
                          alignItems: "center", justifyContent: "flex-end",
                          alignSelf: "stretch", pointerEvents: "none",
                        }}>
                          <Bobo
                            mood={stage.gold ? "excited" : "happy"}
                            tint={tint}
                            size={stage.size}
                            animate={stage.gold}
                            tailWag={stage.gold}
                          />
                          <div style={{
                            width: stage.size * 1.32, height: 9, borderRadius: "50%",
                            background: stage.gold
                              ? "radial-gradient(ellipse, rgba(255,210,60,0.95) 0%, rgba(180,100,0,0.75) 100%)"
                              : "radial-gradient(ellipse, rgba(120,75,215,0.95) 0%, rgba(60,30,140,0.75) 100%)",
                            marginTop: -3,
                            boxShadow: stage.gold
                              ? "0 0 12px rgba(255,180,0,0.55)"
                              : "0 2px 8px rgba(0,0,0,0.5)",
                          }} />
                        </div>

                        {/* Info */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          {/* Day badge */}
                          <div style={{ marginBottom: 5 }}>
                            <div style={{
                              display: "inline-flex", alignItems: "center", gap: 4,
                              background: stage.gold ? "linear-gradient(90deg, #FF8C00, #FFD700)" : "#5B21B6",
                              borderRadius: 20, padding: "3px 10px",
                            }}>
                              {stage.gold && <span style={{ fontSize: 10 }}>👑</span>}
                              <span style={{ fontFamily: F, fontSize: 11.5, fontWeight: 900, color: "#fff" }}>
                                DAY {stage.num}
                              </span>
                            </div>
                          </div>
                          {stage.gold ? (
                            <>
                              <p style={{ fontFamily: F, fontSize: 15, fontWeight: 900, color: "#FFD700", margin: "0 0 3px", lineHeight: 1.2 }}>
                                {stage.title}
                              </p>
                              <p style={{ fontFamily: F, fontSize: 11.5, fontWeight: 600, color: "rgba(255,255,255,0.78)", margin: 0, lineHeight: 1.4 }}>
                                {stage.desc.split("\n").map((l, j) => <span key={j} style={{ display: "block" }}>{l}</span>)}
                              </p>
                            </>
                          ) : (
                            <>
                              <p style={{ fontFamily: F, fontSize: 14.5, fontWeight: 800, color: "#fff", margin: "0 0 3px", lineHeight: 1.2 }}>
                                {stage.title}
                              </p>
                              <p style={{ fontFamily: F, fontSize: 11.5, fontWeight: 500, color: "rgba(255,255,255,0.65)", margin: 0, lineHeight: 1.4 }}>
                                {stage.desc.split("\n").map((l, j) => <span key={j} style={{ display: "block" }}>{l}</span>)}
                              </p>
                            </>
                          )}
                        </div>

                        {/* Right icon + label */}
                        <div style={{
                          flexShrink: 0, width: 58,
                          display: "flex", flexDirection: "column",
                          alignItems: "center", gap: 3,
                        }}>
                          <span style={{ fontSize: 34 }}>{stage.icon}</span>
                          <span style={{ fontFamily: F, fontSize: 11, fontWeight: 700, color: stage.labelColor, textAlign: "center" }}>
                            {stage.label}
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            );

            // Chevron between stages (not after last)
            const chevron = i < STAGES.length - 1 ? (
              <div key={`chv-${i}`} style={{ paddingLeft: 52, display: "flex", justifyContent: "flex-start", margin: "2px 0" }}>
                <AnimatePresence>
                  {stageCount > i + 1 && (
                    <motion.div
                      key="c"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      style={{
                        width: 0, height: 0,
                        borderLeft: "8px solid transparent",
                        borderRight: "8px solid transparent",
                        borderTop: "14px solid #FF9800",
                        filter: "drop-shadow(0 1px 3px rgba(255,120,0,0.5))",
                        marginLeft: 24,
                      }}
                    />
                  )}
                </AnimatePresence>
              </div>
            ) : null;

            return chevron ? [card, chevron] : [card];
          })}
        </div>

        {/* ── Closing card ── */}
        <AnimatePresence>
          {showClosing && (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 26 }}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                background: "rgba(18,12,52,0.94)",
                border: "1.5px solid rgba(90,55,180,0.50)",
                borderRadius: 18,
                padding: "14px 12px",
                marginTop: 10,
                boxShadow: "0 4px 16px rgba(0,0,0,0.38)",
              }}
            >
              <div style={{
                width: 46, height: 46, borderRadius: "50%", flexShrink: 0,
                background: "linear-gradient(135deg, #9D4EDD, #6B2CC0)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22,
                boxShadow: "0 0 14px rgba(157,78,221,0.55)",
              }}>💜</div>
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: F, fontSize: 14, fontWeight: 700, color: "#fff", margin: "0 0 2px", lineHeight: 1.4 }}>
                  When Bugsy grows,{" "}
                  <span style={{ color: "#A78BFA", fontWeight: 900 }}>your child grows.</span>
                </p>
                <p style={{ fontFamily: F, fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.70)", margin: 0 }}>
                  Thank you for being part of this journey! 💜
                </p>
              </div>
              <div style={{ flexShrink: 0 }}>
                <Bobo mood="happy" tint={tint} size={52} armsDown />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Continue button — no flowers ── */}
        <AnimatePresence>
          {showButton && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{ marginTop: 16 }}
            >
              <motion.button
                onClick={onNext}
                style={{
                  width: "100%", height: 60, borderRadius: 30,
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
                >→</motion.span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
