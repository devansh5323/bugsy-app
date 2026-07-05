"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bobo } from "../Mascot";
import { NightRoomBackdrop } from "./WhoAreYou";
import { useEffect } from "react";

const F = "var(--font-nunito), system-ui, sans-serif";

const LINE1 = "Let me tell you about myself...";
const LINE2 = "I'm your child's pet companion- Together we grow, mastering one skill at a time";

const STAGES = [
  { num: 1,  size: 22, title: "Tiny steps",       desc: "Bugsy takes his first steps with your child's help.",           icon: "❤️", label: "Trust",        labelColor: "#FF6BAD", gold: false },
  { num: 3,  size: 26, title: "Growing curious",  desc: "Your child's attention helps Bugsy explore and learn.",         icon: "🎯", label: "Focus",        labelColor: "#C084FC", gold: false },
  { num: 6,  size: 30, title: "More confident",   desc: "Bugsy feels braver as your child keeps showing up.",            icon: "😊", label: "Confidence",   labelColor: "#FDE68A", gold: false },
  { num: 9,  size: 34, title: "Growing stronger", desc: "Every mission makes Bugsy stronger and smarter!",               icon: "🧠", label: "Learning",     labelColor: "#C084FC", gold: false },
  { num: 12, size: 38, title: "Almost there",     desc: "Bugsy is becoming your child's best adventure buddy!",          icon: "⭐", label: "Independence", labelColor: "#FDE68A", gold: false },
  { num: 14, size: 44, title: "FULLY GROWN! 🎉",  desc: "Together, you've helped Bugsy grow into a confident, happy companion!", icon: "🏆", label: "Growth", labelColor: "#FFD700", gold: true  },
];

const DASHED = "repeating-linear-gradient(to bottom, rgba(130,80,220,0.55) 0px, rgba(130,80,220,0.55) 4px, transparent 4px, transparent 9px)";

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

  const [catVisible,   setCatVisible]   = useState(false);
  const [phase,        setPhase]        = useState<0 | 1 | 2 | 3>(0);
  const [typedLine1,   setTypedLine1]   = useState("");
  const [typedLine2,   setTypedLine2]   = useState("");
  const [showTimeline, setShowTimeline] = useState(false);
  const [stageCount,   setStageCount]   = useState(0);
  const [showClosing,  setShowClosing]  = useState(false);
  const [showButton,   setShowButton]   = useState(false);

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
        setTimeout(() => setStageCount(i + 1), doneAt + 800 + i * 460)
      );
      const afterAll = doneAt + 800 + STAGES.length * 460;
      setTimeout(() => setShowClosing(true), afterAll + 200);
      setTimeout(() => setShowButton(true),  afterAll + 600);
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

      {/* ── Timeline view — single screen, no scroll ── */}
      <AnimatePresence>
        {showTimeline && (
          <motion.div
            key="timeline"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "absolute", inset: 0, zIndex: 8,
              display: "flex", flexDirection: "column",
              overflow: "hidden",
              paddingTop: 108,
            }}
          >
            {/* ── Cat (left) + speech bubble (right) ── */}
            <div style={{
              display: "flex", alignItems: "flex-start",
              padding: "0 12px 0 8px", gap: 8, flexShrink: 0,
            }}>
              <div style={{ flexShrink: 0, pointerEvents: "none" }}>
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 3.0, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Bobo mood="happy" tint={tint} size={90} animate />
                </motion.div>
              </div>
              <div style={{
                flex: 1, background: "#fff", borderRadius: 14,
                padding: "9px 28px 9px 10px",
                boxShadow: "0 5px 22px rgba(0,0,0,0.22)",
                position: "relative", marginTop: 4,
              }}>
                <div style={{ position: "absolute", left: -10, top: 14, width: 0, height: 0, borderTop: "8px solid transparent", borderBottom: "8px solid transparent", borderRight: "10px solid #fff" }} />
                <span style={{ position: "absolute", top: 7, right: 9, color: "#C4B5FD", fontSize: 13 }}>✦</span>
                <p style={{ fontFamily: F, fontSize: 15, fontWeight: 900, color: "#7C3AED", margin: "0 0 2px", lineHeight: 1.2 }}>
                  Hi! I'm Bugsy 💜
                </p>
                <p style={{ fontFamily: F, fontSize: 11, fontWeight: 700, color: "#1a0f40", margin: "0 0 1px", lineHeight: 1.35 }}>
                  Every day your child helps me grow...
                </p>
                <p style={{ fontFamily: F, fontSize: 11, fontWeight: 700, color: "#1a0f40", margin: 0, lineHeight: 1.35 }}>
                  And together, we'll grow their{" "}
                  <span style={{ color: "#7C3AED", fontWeight: 900 }}>confidence</span> too! ✨
                </p>
              </div>
            </div>

            {/* ── Section heading ── */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "5px 0 2px", flexShrink: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ fontSize: 13 }}>✨</span>
                <span style={{ fontFamily: F, fontSize: 13.5, fontWeight: 900, color: "#fff" }}>Every visit helps Bugsy grow</span>
                <span style={{ fontSize: 13 }}>✨</span>
              </div>
              <p style={{ fontFamily: F, fontSize: 11, fontWeight: 700, color: "#A78BFA", margin: 0, fontStyle: "italic" }}>
                Little by little, big changes!
              </p>
            </div>

            {/* ── Stages: flex:1, flatMap no-scroll ── */}
            <div style={{
              flex: 1, minHeight: 0,
              display: "flex", flexDirection: "column",
              padding: "2px 10px 2px 6px",
            }}>
              {STAGES.flatMap((stage, i) => {
                const row = (
                  <div key={`slot-${i}`} style={{ flex: 1, minHeight: 0, display: "flex", alignItems: "stretch", gap: 6 }}>

                    {/* Paw column */}
                    <div style={{ width: 30, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                      <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 2, background: DASHED, transform: "translateX(-50%)", zIndex: 0 }} />
                      <AnimatePresence>
                        {stageCount > i && (
                          <motion.div
                            key={`paw-${i}`}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 320, damping: 22 }}
                            style={{
                              width: 26, height: 26, borderRadius: "50%",
                              background: stage.gold
                                ? "radial-gradient(circle, rgba(255,210,60,0.98) 0%, rgba(180,110,0,0.92) 100%)"
                                : "radial-gradient(circle, rgba(50,25,110,0.98) 0%, rgba(28,12,65,0.98) 100%)",
                              border: `2px solid ${stage.gold ? "rgba(255,185,0,0.92)" : "rgba(190,145,0,0.80)"}`,
                              boxShadow: stage.gold
                                ? "0 0 10px rgba(255,180,0,0.60)"
                                : "0 0 8px rgba(200,145,0,0.40)",
                              zIndex: 1, flexShrink: 0,
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: 11,
                            }}
                          >🐾</motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Stage card */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <AnimatePresence>
                        {stageCount > i && (
                          <motion.div
                            key={`card-${i}`}
                            initial={{ opacity: 0, x: 12 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ type: "spring", stiffness: 250, damping: 26 }}
                            style={{
                              height: "100%", display: "flex", alignItems: "center", gap: 6,
                              padding: "3.5px 7px 3.5px 5px",
                              background: stage.gold ? "rgba(20,13,4,0.94)" : "rgba(12,8,34,0.86)",
                              border: `1.5px solid ${stage.gold ? "rgba(255,175,0,0.65)" : "rgba(70,50,150,0.60)"}`,
                              borderRadius: 13,
                              boxShadow: stage.gold
                                ? "0 0 18px rgba(255,155,0,0.28), 0 3px 10px rgba(0,0,0,0.48)"
                                : "0 3px 10px rgba(0,0,0,0.40)",
                            }}
                          >
                            {/* Bobo + oval */}
                            <div style={{
                              width: 46, flexShrink: 0, alignSelf: "stretch",
                              display: "flex", flexDirection: "column",
                              alignItems: "center", justifyContent: "flex-end",
                              pointerEvents: "none",
                            }}>
                              <Bobo
                                mood={stage.gold ? "excited" : "happy"}
                                tint={tint}
                                size={stage.size}
                                animate={stage.gold}
                                tailWag={stage.gold}
                              />
                              <div style={{
                                width: stage.size * 1.3, height: 7, borderRadius: "50%",
                                background: stage.gold
                                  ? "radial-gradient(ellipse, rgba(255,210,60,0.95) 0%, rgba(180,100,0,0.75) 100%)"
                                  : "radial-gradient(ellipse, rgba(120,75,215,0.95) 0%, rgba(60,30,140,0.75) 100%)",
                                marginTop: -2,
                                boxShadow: stage.gold ? "0 0 9px rgba(255,180,0,0.50)" : "0 1px 6px rgba(0,0,0,0.5)",
                              }} />
                            </div>

                            {/* Info */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ marginBottom: 3 }}>
                                <div style={{
                                  display: "inline-flex", alignItems: "center", gap: 3,
                                  background: stage.gold ? "linear-gradient(90deg, #FF8C00, #FFD700)" : "#5B21B6",
                                  borderRadius: 20, padding: "2px 8px",
                                }}>
                                  {stage.gold && <span style={{ fontSize: 9 }}>👑</span>}
                                  <span style={{ fontFamily: F, fontSize: 10.5, fontWeight: 900, color: "#fff" }}>
                                    DAY {stage.num}
                                  </span>
                                </div>
                              </div>
                              {stage.gold ? (
                                <>
                                  <p style={{ fontFamily: F, fontSize: 12.5, fontWeight: 900, color: "#FFD700", margin: "0 0 1px", lineHeight: 1.15 }}>
                                    {stage.title}
                                  </p>
                                  <p style={{ fontFamily: F, fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.75)", margin: 0, lineHeight: 1.3 }}>
                                    {stage.desc}
                                  </p>
                                </>
                              ) : (
                                <>
                                  <p style={{ fontFamily: F, fontSize: 12.5, fontWeight: 800, color: "#fff", margin: "0 0 1px", lineHeight: 1.15 }}>
                                    {stage.title}
                                  </p>
                                  <p style={{ fontFamily: F, fontSize: 10, fontWeight: 500, color: "rgba(255,255,255,0.62)", margin: 0, lineHeight: 1.3 }}>
                                    {stage.desc}
                                  </p>
                                </>
                              )}
                            </div>

                            {/* Right icon + label */}
                            <div style={{
                              flexShrink: 0, width: 40,
                              display: "flex", flexDirection: "column",
                              alignItems: "center", gap: 2,
                            }}>
                              <span style={{ fontSize: 22 }}>{stage.icon}</span>
                              <span style={{
                                fontFamily: F, fontSize: 8.5, fontWeight: 700,
                                color: stage.labelColor, textAlign: "center", lineHeight: 1.1,
                              }}>
                                {stage.label}
                              </span>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                );

                const arrow = i < STAGES.length - 1 ? (
                  <div key={`arr-${i}`} style={{ height: 11, flexShrink: 0, display: "flex", alignItems: "stretch" }}>
                    {/* Dashed line continuation in paw col */}
                    <div style={{ width: 30, flexShrink: 0, position: "relative" }}>
                      <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 2, background: DASHED, transform: "translateX(-50%)" }} />
                    </div>
                    <div style={{ width: 6 }} />
                    {/* Chevron */}
                    <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
                      <AnimatePresence>
                        {stageCount > i + 1 && (
                          <motion.div
                            key="chv"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div style={{
                              width: 0, height: 0,
                              borderLeft: "7px solid transparent",
                              borderRight: "7px solid transparent",
                              borderTop: "11px solid #FF9800",
                              filter: "drop-shadow(0 1px 2px rgba(255,120,0,0.45))",
                            }} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                ) : null;

                return arrow ? [row, arrow] : [row];
              })}
            </div>

            {/* ── Closing card ── */}
            <AnimatePresence>
              {showClosing && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 220, damping: 26 }}
                  style={{
                    flexShrink: 0,
                    display: "flex", alignItems: "center", gap: 9,
                    background: "rgba(12,8,34,0.90)",
                    border: "1.5px solid rgba(90,55,180,0.50)",
                    borderRadius: 14,
                    padding: "9px 10px",
                    margin: "2px 10px 0 6px",
                    boxShadow: "0 3px 12px rgba(0,0,0,0.38)",
                  }}
                >
                  <div style={{
                    width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
                    background: "linear-gradient(135deg, #9D4EDD, #6B2CC0)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 17, boxShadow: "0 0 12px rgba(157,78,221,0.50)",
                  }}>💜</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: F, fontSize: 12, fontWeight: 700, color: "#fff", margin: "0 0 1px", lineHeight: 1.3 }}>
                      When Bugsy grows,{" "}
                      <span style={{ color: "#A78BFA", fontWeight: 900 }}>your child grows.</span>
                    </p>
                    <p style={{ fontFamily: F, fontSize: 10.5, fontWeight: 600, color: "rgba(255,255,255,0.62)", margin: 0 }}>
                      Thank you for being part of this journey! 💜
                    </p>
                  </div>
                  <div style={{ flexShrink: 0, pointerEvents: "none" }}>
                    <Bobo mood="happy" tint={tint} size={40} armsDown />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Continue button — no flower emojis ── */}
            <div style={{ flexShrink: 0, padding: "4px 10px 22px 6px" }}>
              <AnimatePresence>
                {showButton && (
                  <motion.button
                    onClick={(e) => { e.stopPropagation(); onNext(); }}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                      width: "100%", height: 56, borderRadius: 28,
                      background: "linear-gradient(180deg, #9D6FE8 0%, #7C3AED 100%)",
                      border: "none", cursor: "pointer",
                      fontFamily: F, fontSize: 19, fontWeight: 900, color: "#fff",
                      boxShadow: "0 6px 0 #5B21B6, 0 10px 28px rgba(109,40,217,0.50)",
                      touchAction: "manipulation",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
