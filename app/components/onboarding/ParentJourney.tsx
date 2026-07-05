"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bobo } from "../Mascot";
import { NightRoomBackdrop } from "./WhoAreYou";

const F = "var(--font-nunito), system-ui, sans-serif";

const LINE1 = "Let me tell you about myself...";
const LINE2 = "I'm your child's pet companion- Together we grow, mastering one skill at a time";

const STAGES = [
  { num: 1,  size: 65,  title: "Tiny steps",       desc: "Fumi takes his first steps with your child's help.",                    icon: "❤️", label: "Trust",        labelColor: "#FF6BAD", gold: false },
  { num: 3,  size: 75,  title: "Growing curious",  desc: "Your child's attention helps Fumi explore and learn.",                  icon: "🎯", label: "Focus",        labelColor: "#C084FC", gold: false },
  { num: 6,  size: 84,  title: "More confident",   desc: "Fumi feels braver as your child keeps showing up.",                     icon: "😊", label: "Confidence",   labelColor: "#FDE68A", gold: false },
  { num: 9,  size: 92,  title: "Growing stronger", desc: "Every mission makes Fumi stronger and smarter!",                        icon: "🧠", label: "Learning",     labelColor: "#C084FC", gold: false },
  { num: 12, size: 88,  title: "Almost there",     desc: "Fumi is becoming your child's best adventure buddy!",                   icon: "⭐", label: "Independence", labelColor: "#FDE68A", gold: false },
  { num: 14, size: 100, title: "Fully grown! 🎉",  desc: "Together, you've helped Fumi grow into a confident, happy companion!", icon: "🏆", label: "Growth",       labelColor: "#FFD700", gold: true  },
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
      setTimeout(() => setShowButton(true), afterAll + 200);
    }
  }, [phase]);

  return (
    <div
      style={{ position: "absolute", inset: 0, overflow: "hidden" }}
      onClick={handleTap}
    >
      <NightRoomBackdrop minimal hideRug hideFloor />

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
            <div style={{ position: "absolute", bottom: "calc(50% + 130px)", left: 24, right: 24, display: "flex", justifyContent: "center", zIndex: 8 }}>
              <AnimatePresence>
                {phase <= 1 && typedLine1.length > 0 && (
                  <motion.div
                    key="b1"
                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.85, y: -16 }}
                    transition={{ type: "spring", stiffness: 280, damping: 24 }}
                    style={{ background: "#fff", borderRadius: 20, padding: "16px 22px 20px", boxShadow: "0 6px 28px rgba(0,0,0,0.22)", position: "relative", textAlign: "center", width: "100%" }}
                  >
                    <p style={{ fontFamily: F, fontSize: 20, fontWeight: 700, color: "#1a0f40", margin: 0, lineHeight: 1.4 }}>{typedLine1}</p>
                    <div style={{ position: "absolute", bottom: -12, left: "50%", marginLeft: -12, width: 0, height: 0, borderLeft: "12px solid transparent", borderRight: "12px solid transparent", borderTop: "12px solid #fff" }} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div style={{ position: "absolute", bottom: "calc(50% + 130px)", left: 24, right: 24, display: "flex", justifyContent: "center", zIndex: 8 }}>
              <AnimatePresence>
                {phase >= 2 && typedLine2.length > 0 && (
                  <motion.div
                    key="b2"
                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.85, y: -16 }}
                    transition={{ type: "spring", stiffness: 280, damping: 24 }}
                    style={{ background: "#fff", borderRadius: 20, padding: "16px 22px 20px", boxShadow: "0 6px 28px rgba(0,0,0,0.22)", position: "relative", textAlign: "center", width: "100%" }}
                  >
                    <p style={{ fontFamily: F, fontSize: 17, fontWeight: 700, color: "#1a0f40", margin: 0, lineHeight: 1.55 }}>{typedLine2}</p>
                    <div style={{ position: "absolute", bottom: -12, left: "50%", marginLeft: -12, width: 0, height: 0, borderLeft: "12px solid transparent", borderRight: "12px solid transparent", borderTop: "12px solid #fff" }} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 5, pointerEvents: "none" }}>
              <AnimatePresence>
                {catVisible && (
                  <motion.div
                    initial={{ y: 60, opacity: 0, scale: 0.65 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 18 }}
                  >
                    <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 1.0 }}>
                      <Bobo mood="happy" tint={tint} size={200} animate armsDown />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Timeline view — scrollable ── */}
      <AnimatePresence>
        {showTimeline && (
          <motion.div
            key="timeline"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: "absolute", inset: 0, zIndex: 8, display: "flex", flexDirection: "column", overflow: "hidden" }}
          >
            {/* Scrollable area */}
            <div className="pj-scroll" style={{ flex: 1, overflowY: "auto", overflowX: "hidden", paddingTop: 100 }}>

              {/* Cat + speech bubble */}
              <div style={{ display: "flex", alignItems: "flex-start", padding: "0 12px 0 10px", gap: 8, marginBottom: 6 }}>
                <div style={{ flexShrink: 0, pointerEvents: "none" }}>
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 3.0, repeat: Infinity, ease: "easeInOut" }}>
                    <Bobo mood="happy" tint={tint} size={90} animate armsDown />
                  </motion.div>
                </div>
                <div style={{ flex: 1, background: "#fff", borderRadius: 14, padding: "10px 13px", boxShadow: "0 5px 22px rgba(0,0,0,0.22)", position: "relative", marginTop: 6 }}>
                  <div style={{ position: "absolute", left: -10, top: 14, width: 0, height: 0, borderTop: "8px solid transparent", borderBottom: "8px solid transparent", borderRight: "10px solid #fff" }} />
                  <p style={{ fontFamily: F, fontSize: 13.5, fontWeight: 600, color: "#1a0f40", margin: 0, lineHeight: 1.4 }}>{LINE2} 💜</p>
                </div>
              </div>

              {/* Section heading */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "4px 0 8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ fontSize: 13 }}>✨</span>
                  <span style={{ fontFamily: F, fontSize: 13.5, fontWeight: 400, color: "#fff" }}>Every visit helps Fumi grow</span>
                  <span style={{ fontSize: 13 }}>✨</span>
                </div>
                <p style={{ fontFamily: F, fontSize: 11, fontWeight: 700, color: "#A78BFA", margin: 0, fontStyle: "italic" }}>Little by little, big changes!</p>
              </div>

              {/* ── Stage cards ── */}
              <div style={{ padding: "0 10px 0 10px", position: "relative" }}>
                {/* Continuous left dashed line */}
                <div style={{ position: "absolute", left: 21, top: 0, bottom: 0, width: 2, background: DASHED, zIndex: 0 }} />

                {STAGES.map((stage, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: i < STAGES.length - 1 ? 8 : 0, position: "relative", zIndex: 1 }}>

                    {/* Left connector dot */}
                    <div style={{ width: 24, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <AnimatePresence>
                        {stageCount > i && (
                          <motion.div
                            key={`dot-${i}`}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 320, damping: 22 }}
                            style={{
                              width: stage.gold ? 22 : 14,
                              height: stage.gold ? 22 : 14,
                              borderRadius: "50%",
                              background: stage.gold
                                ? "radial-gradient(circle, rgba(255,210,60,0.98) 0%, rgba(180,110,0,0.92) 100%)"
                                : "rgba(255,255,255,0.18)",
                              border: `2px solid ${stage.gold ? "rgba(255,185,0,0.92)" : "rgba(255,255,255,0.5)"}`,
                              boxShadow: stage.gold ? "0 0 10px rgba(255,180,0,0.65)" : "none",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: 10,
                            }}
                          >
                            {stage.gold ? "⭐" : null}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Card */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <AnimatePresence>
                        {stageCount > i && (
                          <motion.div
                            key={`card-${i}`}
                            initial={{ opacity: 0, x: 14 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ type: "spring", stiffness: 250, damping: 26 }}
                            style={{
                              position: "relative",
                              height: stage.gold ? 108 : 94,
                              background: stage.gold ? "rgba(20,13,4,0.96)" : "rgba(13,9,36,0.92)",
                              border: `1.5px solid ${stage.gold ? "rgba(255,175,0,0.65)" : "rgba(75,55,155,0.55)"}`,
                              borderRadius: 16,
                              overflow: "hidden",
                              boxShadow: stage.gold
                                ? "0 0 20px rgba(255,155,0,0.25), 0 4px 14px rgba(0,0,0,0.5)"
                                : "0 4px 12px rgba(0,0,0,0.42)",
                            }}
                          >
                            {/* Text — left portion */}
                            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "52%", padding: "10px 0 10px 12px", display: "flex", flexDirection: "column", justifyContent: "center", zIndex: 2 }}>
                              <div style={{ marginBottom: 5 }}>
                                <div style={{
                                  display: "inline-flex", alignItems: "center", gap: 2,
                                  background: stage.gold ? "linear-gradient(90deg, #FF8C00, #FFD700)" : "#5B21B6",
                                  borderRadius: 20, padding: "1.5px 7px",
                                }}>
                                  {stage.gold && <span style={{ fontSize: 8 }}>⭐</span>}
                                  <span style={{ fontFamily: F, fontSize: 8.5, fontWeight: 900, color: "#fff" }}>DAY {stage.num}</span>
                                </div>
                              </div>
                              <p style={{ fontFamily: F, fontSize: 13.5, fontWeight: 900, color: stage.gold ? "#FFD700" : "#fff", margin: "0 0 4px", lineHeight: 1.2 }}>
                                {stage.title}
                              </p>
                              <p style={{ fontFamily: F, fontSize: 10, fontWeight: 500, color: "rgba(255,255,255,0.58)", margin: 0, lineHeight: 1.4, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" } as React.CSSProperties}>
                                {stage.desc}
                              </p>
                            </div>

                            {/* Bobo — center-right, vertically centered */}
                            <div style={{ position: "absolute", right: 44, top: "50%", transform: "translateY(-50%)", zIndex: 1, pointerEvents: "none" }}>
                              <Bobo
                                mood={stage.gold ? "excited" : "happy"}
                                tint={tint}
                                size={stage.size}
                                animate={stage.gold}
                                tailWag={stage.gold}
                                armsDown
                              />
                            </div>

                            {/* Right icon + label */}
                            <div style={{
                              position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)",
                              width: 38, zIndex: 2,
                              display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                            }}>
                              <span style={{ fontSize: 24 }}>{stage.icon}</span>
                              <span style={{ fontFamily: F, fontSize: 9, fontWeight: 700, color: stage.labelColor, textAlign: "center", lineHeight: 1.1 }}>
                                {stage.label}
                              </span>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                ))}
              </div>

              {/* Continue button */}
              <div style={{ padding: "12px 10px 28px" }}>
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .pj-scroll::-webkit-scrollbar { display: none; }
        .pj-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
