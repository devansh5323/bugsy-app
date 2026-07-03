"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bobo } from "../Mascot";
import { NightRoomBackdrop } from "./WhoAreYou";

const F = "var(--font-nunito), system-ui, sans-serif";

const LINE1 = "Let me tell you about myself...";
const LINE2 = "I'm your child's pet companion- Together we grow, mastering one skill at a time";

const STAGES = [
  { num: 1,  size: 38, text: "Tiny steps,\nbig adventures begin!",         hl: null,         hlColor: "",        icon: "⭐", gold: false },
  { num: 3,  size: 46, text: "Growing curiosity,\nbuilding confidence.",    hl: "confidence", hlColor: "#FF9E2C", icon: "💗", gold: false },
  { num: 6,  size: 54, text: "More playful,\nmore agile, more confident!",  hl: "confident",  hlColor: "#FF9E2C", icon: "⚡", gold: false },
  { num: 9,  size: 62, text: "Growing stronger\nevery day!",                hl: "stronger",   hlColor: "#4ADE80", icon: "📈", gold: false },
  { num: 12, size: 70, text: "Almost there!\nShining brighter every day.",  hl: "brighter",   hlColor: "#FF9E2C", icon: "☀️", gold: false },
  { num: 14, size: 80, text: "Confident. Calm.\nReady for anything!",       hl: null,         hlColor: "",        icon: "🏆", gold: true  },
];

function StageDesc({ text, hl, hlColor }: { text: string; hl: string | null; hlColor: string }) {
  return (
    <>
      {text.split("\n").map((line, li) => (
        <span key={li} style={{ display: "block" }}>
          {hl && line.includes(hl)
            ? line.split(hl).map((part, j, arr) => (
                <span key={j}>
                  {part}
                  {j < arr.length - 1 && <span style={{ color: hlColor }}>{hl}</span>}
                </span>
              ))
            : line}
        </span>
      ))}
    </>
  );
}

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
  const [phase,         setPhase]         = useState<0 | 1 | 2 | 3>(0);
  const [typedLine1,    setTypedLine1]    = useState("");
  const [typedLine2,    setTypedLine2]    = useState("");
  const [showTimeline,  setShowTimeline]  = useState(false);
  const [stageCount,    setStageCount]    = useState(0);
  const [showButton,    setShowButton]    = useState(false);

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
      setTimeout(() => setShowTimeline(true), doneAt + 400);
      STAGES.forEach((_, i) =>
        setTimeout(() => setStageCount(i + 1), doneAt + 800 + i * 500)
      );
      setTimeout(() => setShowButton(true), doneAt + 800 + STAGES.length * 500 + 500);
    }
  }, [phase]);

  return (
    <div
      style={{ position: "absolute", inset: 0, overflow: "hidden" }}
      onClick={handleTap}
    >
      <NightRoomBackdrop minimal hideRug hideFloor />

      {/* Back button */}
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

      {/* ── Pre-timeline: centered cat + speech bubbles ── */}
      <AnimatePresence>
        {!showTimeline && (
          <motion.div
            key="pre"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ position: "absolute", inset: 0, zIndex: 5 }}
          >
            {/* Bubble 1 */}
            <div style={{
              position: "absolute",
              bottom: "calc(50% + 130px)",
              left: 24, right: 24,
              display: "flex", justifyContent: "center",
              zIndex: 8,
            }}>
              <AnimatePresence>
                {phase <= 1 && typedLine1.length > 0 && (
                  <motion.div
                    key="b1"
                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.85, y: -16 }}
                    transition={{ type: "spring", stiffness: 280, damping: 24 }}
                    style={{
                      background: "#fff", borderRadius: 20,
                      padding: "16px 22px 20px",
                      boxShadow: "0 6px 28px rgba(0,0,0,0.22)",
                      position: "relative", textAlign: "center", width: "100%",
                    }}
                  >
                    <p style={{ fontFamily: F, fontSize: 20, fontWeight: 700, color: "#1a0f40", margin: 0, lineHeight: 1.4 }}>
                      {typedLine1}
                    </p>
                    <div style={{ position: "absolute", bottom: -12, left: "50%", marginLeft: -12, width: 0, height: 0, borderLeft: "12px solid transparent", borderRight: "12px solid transparent", borderTop: "12px solid #fff" }} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bubble 2 */}
            <div style={{
              position: "absolute",
              bottom: "calc(50% + 130px)",
              left: 24, right: 24,
              display: "flex", justifyContent: "center",
              zIndex: 8,
            }}>
              <AnimatePresence>
                {phase >= 2 && typedLine2.length > 0 && (
                  <motion.div
                    key="b2"
                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.85, y: -16 }}
                    transition={{ type: "spring", stiffness: 280, damping: 24 }}
                    style={{
                      background: "#fff", borderRadius: 20,
                      padding: "16px 22px 20px",
                      boxShadow: "0 6px 28px rgba(0,0,0,0.22)",
                      position: "relative", textAlign: "center", width: "100%",
                    }}
                  >
                    <p style={{ fontFamily: F, fontSize: 17, fontWeight: 700, color: "#1a0f40", margin: 0, lineHeight: 1.55 }}>
                      {typedLine2}
                    </p>
                    <div style={{ position: "absolute", bottom: -12, left: "50%", marginLeft: -12, width: 0, height: 0, borderLeft: "12px solid transparent", borderRight: "12px solid transparent", borderTop: "12px solid #fff" }} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Centered cat */}
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              zIndex: 5, pointerEvents: "none",
            }}>
              <AnimatePresence>
                {catVisible && (
                  <motion.div
                    initial={{ y: 60, opacity: 0, scale: 0.65 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 18 }}
                  >
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 1.0 }}
                    >
                      <Bobo mood="happy" tint={tint} size={200} animate />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Timeline view ── */}
      <AnimatePresence>
        {showTimeline && (
          <motion.div
            key="timeline"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "absolute", inset: 0, zIndex: 8,
              display: "flex", flexDirection: "column",
              overflowY: "auto", paddingBottom: 106,
            }}
          >
            {/* Cat (left) + LINE2 bubble (right) */}
            <div style={{
              display: "flex", alignItems: "flex-start",
              padding: "74px 14px 0 10px", gap: 10, flexShrink: 0,
            }}>
              <div style={{ flexShrink: 0, pointerEvents: "none" }}>
                <motion.div
                  animate={{ y: [0, -7, 0] }}
                  transition={{ duration: 3.0, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Bobo mood="happy" tint={tint} size={108} animate />
                </motion.div>
              </div>
              <div style={{
                flex: 1, background: "#fff", borderRadius: 18,
                padding: "13px 15px 14px",
                boxShadow: "0 6px 28px rgba(0,0,0,0.22)",
                position: "relative", marginTop: 10,
              }}>
                <div style={{ position: "absolute", left: -11, top: 18, width: 0, height: 0, borderTop: "9px solid transparent", borderBottom: "9px solid transparent", borderRight: "11px solid #fff" }} />
                <p style={{ fontFamily: F, fontSize: 14, fontWeight: 800, color: "#1a0f40", margin: 0, lineHeight: 1.38 }}>
                  {LINE2} 💜
                </p>
              </div>
            </div>

            {/* "Watch me grow with your child!" */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                gap: 8, padding: "14px 16px 10px", flexShrink: 0,
              }}
            >
              <span style={{ fontSize: 20 }}>✨</span>
              <span style={{ fontFamily: F, fontSize: 17, fontWeight: 900, color: "#fff" }}>
                Watch me grow with your child!
              </span>
              <span style={{ fontSize: 20 }}>✨</span>
            </motion.div>

            {/* Stages — vertical list */}
            <div style={{
              display: "flex", flexDirection: "column",
              padding: "0 14px",
              flexShrink: 0,
            }}>
              {STAGES.map((stage, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column" }}>
                  <AnimatePresence>
                    {stageCount > i && (
                      <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.94 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ type: "spring", stiffness: 240, damping: 24 }}
                        style={{
                          display: "flex", alignItems: "center", gap: 10,
                          padding: "11px 12px 11px 8px",
                          background: stage.gold ? "rgba(20,13,4,0.90)" : "rgba(12,8,34,0.82)",
                          border: `1.5px solid ${stage.gold ? "rgba(255,175,0,0.60)" : "rgba(70,50,150,0.60)"}`,
                          borderRadius: 18,
                          boxShadow: stage.gold
                            ? "0 0 22px rgba(255,160,0,0.28), 0 4px 14px rgba(0,0,0,0.45)"
                            : "0 4px 14px rgba(0,0,0,0.38)",
                        }}
                      >
                        {/* Cat + platform + paw */}
                        <div style={{
                          width: 88, flexShrink: 0,
                          display: "flex", flexDirection: "column", alignItems: "center",
                          pointerEvents: "none",
                        }}>
                          <Bobo
                            mood={stage.gold ? "excited" : "happy"}
                            tint={tint}
                            size={stage.size}
                            animate={stage.gold}
                            tailWag={stage.gold}
                          />
                          {/* Platform */}
                          <div style={{
                            width: stage.size * 1.25, height: 11, borderRadius: "50%",
                            background: stage.gold
                              ? "radial-gradient(ellipse, rgba(255,200,60,0.9) 0%, rgba(180,100,0,0.7) 100%)"
                              : "radial-gradient(ellipse, rgba(110,70,210,0.9) 0%, rgba(60,30,140,0.7) 100%)",
                            marginTop: -5,
                            boxShadow: stage.gold
                              ? "0 0 14px rgba(255,180,0,0.55)"
                              : "0 3px 10px rgba(0,0,0,0.5)",
                          }} />
                          <span style={{ fontSize: 11, marginTop: 3, lineHeight: 1 }}>🐾</span>
                        </div>

                        {/* Info: day badge + description */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          {/* Day pill badge */}
                          <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 5 }}>
                            <div style={{
                              background: stage.gold
                                ? "linear-gradient(90deg, #FF8C00, #FFD700)"
                                : "#5B21B6",
                              borderRadius: 20, padding: "3px 11px",
                              display: "inline-flex",
                            }}>
                              <span style={{ fontFamily: F, fontSize: 11.5, fontWeight: 900, color: "#fff" }}>
                                DAY {stage.num}
                              </span>
                            </div>
                            <span style={{ color: "#FFD700", fontSize: 11 }}>✦</span>
                          </div>
                          {/* Description */}
                          {stage.gold ? (
                            <div>
                              <p style={{ fontFamily: F, fontSize: 16, fontWeight: 900, color: "#FFD700", margin: "0 0 2px", lineHeight: 1.2 }}>
                                FULLY GROWN!
                              </p>
                              <p style={{ fontFamily: F, fontSize: 13.5, fontWeight: 700, color: "#fff", margin: 0, lineHeight: 1.4 }}>
                                Confident. Calm.<br />Ready for anything!
                              </p>
                            </div>
                          ) : (
                            <p style={{ fontFamily: F, fontSize: 13.5, fontWeight: 700, color: "#fff", margin: 0, lineHeight: 1.4 }}>
                              <StageDesc text={stage.text} hl={stage.hl} hlColor={stage.hlColor} />
                            </p>
                          )}
                        </div>

                        {/* Right icon */}
                        <div style={{ fontSize: 26, flexShrink: 0, width: 34, textAlign: "center" }}>
                          {stage.icon}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Orange arrow between stages */}
                  {i < STAGES.length - 1 && (
                    <AnimatePresence>
                      {stageCount > i + 1 && (
                        <motion.div
                          initial={{ opacity: 0, scaleY: 0 }}
                          animate={{ opacity: 1, scaleY: 1 }}
                          transition={{ duration: 0.25, ease: "easeOut" }}
                          style={{ display: "flex", justifyContent: "center", padding: "3px 0" }}
                        >
                          <div style={{
                            width: 0, height: 0,
                            borderLeft: "9px solid transparent",
                            borderRight: "9px solid transparent",
                            borderTop: "15px solid #FF9800",
                            filter: "drop-shadow(0 2px 4px rgba(255,120,0,0.55))",
                          }} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              ))}
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Continue button with flower decorations ── */}
      <AnimatePresence>
        {showButton && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: "absolute", bottom: 32, left: 16, right: 16, zIndex: 20 }}
          >
            {/* Flower decorations */}
            <span style={{ position: "absolute", left: -2, bottom: 2, fontSize: 28, pointerEvents: "none", zIndex: 21 }}>🌸</span>
            <span style={{ position: "absolute", right: 0, bottom: 4, fontSize: 26, pointerEvents: "none", zIndex: 21 }}>🌿</span>
            <motion.button
              onClick={(e) => { e.stopPropagation(); onNext(); }}
              style={{
                width: "100%", height: 64, borderRadius: 32,
                background: "linear-gradient(180deg, #9D6FE8 0%, #7C3AED 100%)",
                border: "none", cursor: "pointer",
                fontFamily: F, fontSize: 20, fontWeight: 900, color: "#fff",
                boxShadow: "0 6px 0 #5B21B6, 0 10px 28px rgba(109,40,217,0.50)",
                touchAction: "manipulation",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}
            >
              <span style={{ color: "#FFD700", fontSize: 18 }}>✦</span>
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
  );
}
