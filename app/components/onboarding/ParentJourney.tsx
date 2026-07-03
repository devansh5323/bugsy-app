"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bobo } from "../Mascot";
import { NightRoomBackdrop } from "./WhoAreYou";

const F = "var(--font-nunito), system-ui, sans-serif";

const LINE1 = "Let me tell you about myself...";
const LINE2 = "I'm your child's pet companion- Together we grow, mastering one skill at a time";

const STAGES = [
  { day: "Day 1",  size: 40, lines: ["Tiny steps,", "big adventures", "begin!"],            gold: false },
  { day: "Day 3",  size: 50, lines: ["Growing curiosity,", "building", "confidence."],       gold: false },
  { day: "Day 6",  size: 60, lines: ["More playful,", "more agile,", "more confident!"],     gold: false },
  { day: "Day 9",  size: 70, lines: ["Growing", "stronger", "every day!"],                   gold: false },
  { day: "Day 12", size: 80, lines: ["Almost there!", "Shining brighter", "every day."],     gold: false },
  { day: "Day 14", size: 92, lines: ["FULLY GROWN!", "Confident.", "Calm. Ready", "for anything!"], gold: true },
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
        setTimeout(() => setStageCount(i + 1), doneAt + 800 + i * 350)
      );
      setTimeout(() => setShowButton(true), doneAt + 800 + STAGES.length * 350 + 350);
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
                  {LINE2}
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
                gap: 7, padding: "16px 16px 4px", flexShrink: 0,
              }}
            >
              <span style={{ color: "#FFD700", fontSize: 15 }}>✦</span>
              <span style={{ fontFamily: F, fontSize: 16, fontWeight: 900, color: "#fff" }}>
                Watch me grow with your child!
              </span>
              <span style={{ color: "#FFD700", fontSize: 15 }}>✦</span>
            </motion.div>

            {/* Stages row (horizontally scrollable) */}
            <div style={{
              display: "flex",
              alignItems: "flex-end",
              padding: "6px 10px 0",
              flexShrink: 0,
              overflowX: "auto",
              scrollbarWidth: "none" as const,
            }}>
              {STAGES.map((stage, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-end", flexShrink: 0 }}>
                  {/* Stage column */}
                  <div style={{ width: stage.size + 14, flexShrink: 0, minHeight: 10 }}>
                    <AnimatePresence>
                      {stageCount > i && (
                        <motion.div
                          initial={{ opacity: 0, y: 28, scale: 0.78 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ type: "spring", stiffness: 270, damping: 22 }}
                          style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
                        >
                          {/* Cat */}
                          <div style={{ pointerEvents: "none" }}>
                            <Bobo
                              mood={stage.gold ? "excited" : "happy"}
                              tint={tint}
                              size={stage.size}
                              animate={stage.gold}
                              tailWag={stage.gold}
                            />
                          </div>
                          {/* Paw + day label */}
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 2 }}>
                            <span style={{ fontSize: 11, lineHeight: 1 }}>🐾</span>
                            <span style={{
                              fontFamily: F, fontSize: 9.5, fontWeight: 800,
                              color: stage.gold ? "#FFD700" : "rgba(255,255,255,0.80)",
                              marginTop: 1, whiteSpace: "nowrap",
                            }}>{stage.day}</span>
                          </div>
                          {/* Text card */}
                          <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.14, type: "spring", stiffness: 260, damping: 24 }}
                            style={{
                              marginTop: 5,
                              background: stage.gold ? "rgba(255,200,0,0.13)" : "rgba(255,255,255,0.10)",
                              border: `1px solid ${stage.gold ? "rgba(255,210,0,0.42)" : "rgba(255,255,255,0.16)"}`,
                              borderRadius: 8,
                              padding: "5px 3px 6px",
                              width: stage.size + 12,
                              minHeight: 60,
                              display: "flex", flexDirection: "column",
                              alignItems: "center", justifyContent: "center",
                              boxShadow: stage.gold ? "0 0 12px rgba(255,200,0,0.22)" : "none",
                            }}
                          >
                            {stage.lines.map((line, j) => (
                              <span key={j} style={{
                                fontFamily: F,
                                fontSize: 8.5,
                                lineHeight: 1.38,
                                fontWeight: (j === 0 && stage.gold) ? 900 : 650,
                                color: (j === 0 && stage.gold) ? "#FFD700" : "#fff",
                                textAlign: "center",
                                display: "block",
                              }}>{line}</span>
                            ))}
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Arrow between stages */}
                  {i < STAGES.length - 1 && (
                    <AnimatePresence>
                      {stageCount > i + 1 && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.4 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ type: "spring", stiffness: 280, damping: 22 }}
                          style={{
                            fontSize: 15, color: "#FF9E2C",
                            marginBottom: 74, flexShrink: 0, padding: "0 1px",
                          }}
                        >→</motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              ))}
            </div>

            {/* Paw progress meter */}
            <div style={{
              display: "flex", alignItems: "center",
              padding: "12px 16px 0",
              flexShrink: 0,
            }}>
              {STAGES.map((stage, i) => {
                const active = stageCount > i;
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", flex: i < STAGES.length - 1 ? 1 : 0 }}>
                    <motion.div
                      animate={{
                        scale: active ? 1 : 0.85,
                        opacity: active ? 1 : 0.38,
                        boxShadow: active && stage.gold
                          ? "0 0 16px rgba(255,200,0,0.75), 0 2px 8px rgba(0,0,0,0.30)"
                          : "0 2px 6px rgba(0,0,0,0.20)",
                      }}
                      transition={{ type: "spring", stiffness: 290, damping: 20 }}
                      style={{
                        width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
                        background: active
                          ? (stage.gold ? "linear-gradient(135deg, #FFE040, #FF9800)" : "rgba(88,55,168,0.88)")
                          : "rgba(50,35,100,0.55)",
                        border: `2px solid ${active ? (stage.gold ? "#FFD700" : "rgba(148,118,218,0.62)") : "rgba(100,80,160,0.35)"}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 15,
                      }}
                    >🐾</motion.div>
                    {i < STAGES.length - 1 && (
                      <div style={{
                        flex: 1, height: 2.5,
                        background: stageCount > i + 1
                          ? "rgba(148,118,218,0.65)"
                          : "rgba(80,60,140,0.35)",
                        borderRadius: 2,
                        transition: "background 0.4s ease",
                      }} />
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Continue button ── */}
      <AnimatePresence>
        {showButton && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            style={{
              position: "absolute", bottom: 38, left: 20, right: 20, zIndex: 20,
              height: 62, borderRadius: 31,
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
        )}
      </AnimatePresence>
    </div>
  );
}
