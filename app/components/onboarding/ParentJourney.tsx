"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bobo } from "../Mascot";
import { NightRoomBackdrop } from "./WhoAreYou";

const F = "var(--font-nunito), system-ui, sans-serif";

const LINE1 = "Yay! I'm so happy you're here. Let me tell you about myself...";
const LINE2 = "I'm your child's pet companion- Together we grow, mastering one skill at a time";

// Four growth milestones, alternating purple/gold accents — mirrors the
// "Fumi's Growth Journey" reference layout (circular avatar + step badge
// + title + description + tag, linked by a colored dashed path).
const PURPLE = "#A78BFA";
const GOLD = "#FBBF24";
const STEPS = [
  { num: 1, title: "Building Trust", desc: "Your child feels safe, seen and ready to begin.", tagIcon: "💜", tag: "Emotional security", mood: "happy" as const, accent: PURPLE, filled: true },
  { num: 2, title: "Exploring & Learning", desc: "New skills, big curiosity and everyday discoveries.", tagIcon: "🎯", tag: "Focus & curiosity", mood: "excited" as const, accent: GOLD, filled: false },
  { num: 3, title: "Growing Stronger", desc: "With practice and encouragement, they build skills and confidence.", tagIcon: "🧠", tag: "Resilience & confidence", mood: "happy" as const, accent: PURPLE, filled: true },
  { num: 4, title: "Confident & Capable", desc: "Ready to take on new challenges, together.", tagIcon: "⭐", tag: "Independence & growth", mood: "cheer" as const, accent: GOLD, filled: false },
];

// Curved dashed link between two consecutive step avatars, swooping from
// whichever side the previous step sat on to whichever side the next
// one sits on — the zig-zag path connecting the growth journey.
function ZigZagConnector({
  fromRight, toRight, color, revealed,
}: {
  fromRight: boolean; toRight: boolean; color: string; revealed: boolean;
}) {
  const W = 358; // approx content width (mobile viewport minus side padding)
  const AV = 36; // half the 72px avatar, i.e. its center offset from the edge
  const H = 52;
  const fromX = fromRight ? W - AV : AV;
  const toX = toRight ? W - AV : AV;
  const path = `M ${fromX},0 C ${fromX},${H * 0.55} ${toX},${H * 0.45} ${toX},${H}`;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: -H, height: H, zIndex: 0, pointerEvents: "none" }}>
      <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ display: "block", overflow: "visible" }}>
        <path d={path} fill="none" stroke={color} strokeOpacity={0.25} strokeWidth={2.5} strokeDasharray="6 6" vectorEffect="non-scaling-stroke" />
        <motion.path
          d={path} fill="none" stroke={color} strokeWidth={2.5} strokeDasharray="6 6" vectorEffect="non-scaling-stroke"
          initial={false}
          animate={{ opacity: revealed ? 1 : 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
        <circle cx={fromX} cy={3} r={4} fill={color} opacity={revealed ? 1 : 0.3} />
        <circle cx={toX} cy={H - 3} r={4} fill={color} opacity={revealed ? 1 : 0.3} />
      </svg>
    </div>
  );
}

// A sitting kitten with big glossy eyes and a gold pendant — a
// hand-drawn stand-in for the reference photo, styled for Step 1's avatar.
function SittingKitten({ size = 62 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" style={{ display: "block", overflow: "visible" }}>
      <defs>
        <linearGradient id="kittenHead" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#DCEBFC" />
          <stop offset="100%" stopColor="#A9C9EE" />
        </linearGradient>
      </defs>

      {/* Shoulders / collar hint — mostly cropped by the avatar circle,
          like the reference's tight head-and-shoulders framing */}
      <ellipse cx="60" cy="112" rx="40" ry="22" fill="url(#kittenHead)" />
      <path d="M 34 100 Q 60 112 86 100" stroke="#5B7EB0" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <circle cx="60" cy="107" r="6.5" fill="#F5C542" stroke="#C88A1A" strokeWidth="1.2" />
      <circle cx="57.5" cy="104.5" r="2.2" fill="#FFEBAE" opacity="0.9" />

      {/* Ears */}
      <path d="M 26 30 L 14 2 L 48 20 Z" fill="url(#kittenHead)" />
      <path d="M 94 30 L 106 2 L 72 20 Z" fill="url(#kittenHead)" />
      <path d="M 26 26 L 20 8 L 42 21 Z" fill="#F4BFD4" opacity="0.9" />
      <path d="M 94 26 L 100 8 L 78 21 Z" fill="#F4BFD4" opacity="0.9" />

      {/* Head — big, fills most of the frame */}
      <circle cx="60" cy="52" r="44" fill="url(#kittenHead)" />

      {/* Eyebrows */}
      <path d="M 30 26 Q 39 18 48 25" stroke="#5B7EB0" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <path d="M 72 25 Q 81 18 90 26" stroke="#5B7EB0" strokeWidth="2.6" fill="none" strokeLinecap="round" />

      {/* Eyes — big and glossy */}
      <circle cx="42" cy="52" r="14" fill="#191527" />
      <circle cx="78" cy="52" r="14" fill="#191527" />
      <circle cx="37.5" cy="46" r="5" fill="#fff" />
      <circle cx="73.5" cy="46" r="5" fill="#fff" />
      <circle cx="46.5" cy="57" r="2.2" fill="#fff" opacity="0.85" />
      <circle cx="82.5" cy="57" r="2.2" fill="#fff" opacity="0.85" />

      {/* Cheeks */}
      <ellipse cx="24" cy="64" rx="7" ry="5" fill="#F4BFD4" opacity="0.55" />
      <ellipse cx="96" cy="64" rx="7" ry="5" fill="#F4BFD4" opacity="0.55" />

      {/* Nose + open smile */}
      <path d="M 56 68 L 64 68 L 60 73 Z" fill="#F2879C" />
      <path d="M 60 73 Q 60 79 52 80 Q 58 84 60 79 Q 62 84 68 80 Q 60 79 60 73" fill="#3C2A4A" opacity="0.85" />

      {/* Whiskers */}
      <line x1="14" y1="60" x2="34" y2="63" stroke="#fff" strokeWidth="1.4" opacity="0.7" strokeLinecap="round" />
      <line x1="14" y1="70" x2="35" y2="70" stroke="#fff" strokeWidth="1.4" opacity="0.7" strokeLinecap="round" />
      <line x1="106" y1="60" x2="86" y2="63" stroke="#fff" strokeWidth="1.4" opacity="0.7" strokeLinecap="round" />
      <line x1="106" y1="70" x2="85" y2="70" stroke="#fff" strokeWidth="1.4" opacity="0.7" strokeLinecap="round" />
    </svg>
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

  const [catVisible,   setCatVisible]   = useState(false);
  const [phase,        setPhase]        = useState<0 | 1 | 2 | 3>(0);
  const [typedLine1,   setTypedLine1]   = useState("");
  const [typedLine2,   setTypedLine2]   = useState("");
  const [showTimeline, setShowTimeline] = useState(false);
  const [stageCount,      setStageCount]      = useState(0);
  const [showButton,      setShowButton]      = useState(false);

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
      STEPS.forEach((_, i) =>
        setTimeout(() => setStageCount(i + 1), doneAt + 900 + i * 600)
      );
      const afterAll = doneAt + 900 + STEPS.length * 600;
      setTimeout(() => setShowButton(true), afterAll + 300);
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

      {/* ── Pre-timeline cat + bubbles, then the timeline itself — a single
          AnimatePresence (mode="wait") so only one mascot instance is ever
          mounted at a time, letting the shared layoutId FLIP cleanly. */}
      <AnimatePresence mode="wait">
        {!showTimeline ? (
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
                    <p style={{ fontFamily: F, fontSize: 16, fontWeight: 700, color: "#1a0f40", margin: 0, lineHeight: 1.4 }}>{typedLine1}</p>
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
                    layoutId="pj-mascot"
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
        ) : (
          <motion.div
            key="timeline"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: "absolute", inset: 0, zIndex: 8, display: "flex", flexDirection: "column", overflow: "hidden" }}
          >
            {/* Scrollable area */}
            <div className="pj-scroll" style={{ flex: 1, overflowY: "auto", overflowX: "hidden", paddingTop: 130 }}>

              {/* Mascot + recap bubble — Fumi flies here from center stage
                  (shared layoutId) and settles top-left, under the back button. */}
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "0 16px 18px" }}>
                <motion.div layoutId="pj-mascot" style={{ flexShrink: 0 }}>
                  <Bobo mood="happy" tint={tint} size={92} animate armsDown />
                </motion.div>
                <div style={{ flex: 1, background: "#fff", borderRadius: 16, padding: "14px 18px", boxShadow: "0 5px 22px rgba(0,0,0,0.22)", position: "relative", marginTop: 12 }}>
                  <div style={{ position: "absolute", left: -10, top: 18, width: 0, height: 0, borderTop: "9px solid transparent", borderBottom: "9px solid transparent", borderRight: "11px solid #fff" }} />
                  <p style={{ fontFamily: F, fontSize: 15, fontWeight: 600, color: "#1a0f40", margin: 0, lineHeight: 1.45 }}>{LINE2}</p>
                </div>
              </div>

              {/* ── Step cards — zig-zag: avatar alternates left/right,
                  linked by a curved path colored for the step it leads into ── */}
              <div style={{ padding: "0 16px", position: "relative" }}>
                {STEPS.map((step, i) => {
                  const isRight = i % 2 === 1;
                  const prevRight = i > 0 && (i - 1) % 2 === 1;
                  return (
                  <div key={i} style={{ position: "relative", zIndex: 1 }}>
                    {/* Curved connector leading into this step (skip before step 0) */}
                    {i > 0 && (
                      <ZigZagConnector fromRight={prevRight} toRight={isRight} color={step.accent} revealed={stageCount > i} />
                    )}

                    <div style={{ display: "flex", flexDirection: isRight ? "row-reverse" : "row", alignItems: "flex-start", gap: 12, marginBottom: i < STEPS.length - 1 ? 56 : 0 }}>
                      {/* Circular avatar */}
                      <div style={{ flexShrink: 0, width: 72, display: "flex", justifyContent: "center" }}>
                        <AnimatePresence>
                          {stageCount > i && (
                            <motion.div
                              key={`avatar-${i}`}
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ type: "spring", stiffness: 260, damping: 22 }}
                              style={{
                                width: 72, height: 72, borderRadius: "50%",
                                border: `3px solid ${step.accent}`,
                                boxShadow: `0 0 18px ${step.accent}66`,
                                background: "rgba(255,255,255,0.06)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                overflow: "hidden",
                              }}
                            >
                              {i === 0
                                ? <SittingKitten size={62} />
                                : <Bobo mood={step.mood} tint={tint} size={62} animate armsDown />}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Card */}
                      <div style={{ flex: 1, minWidth: 0, paddingTop: 4 }}>
                        <AnimatePresence>
                          {stageCount > i && (
                            <motion.div
                              key={`card-${i}`}
                              initial={{ opacity: 0, x: 16, y: 8 }}
                              animate={{ opacity: 1, x: 0, y: 0 }}
                              transition={{ type: "spring", stiffness: 220, damping: 28 }}
                            >
                              <div style={{
                                display: "inline-flex", alignItems: "center", marginBottom: 6,
                                borderRadius: 20, padding: "3px 11px",
                                background: step.filled ? `linear-gradient(90deg, ${step.accent}, #7C3AED)` : "transparent",
                                border: step.filled ? "none" : `1.5px solid ${step.accent}`,
                              }}>
                                <span style={{
                                  fontFamily: F, fontSize: 10, fontWeight: 900, letterSpacing: "0.03em",
                                  color: step.filled ? "#fff" : step.accent,
                                }}>STEP {step.num}</span>
                              </div>
                              <p style={{ fontFamily: F, fontSize: 15.5, fontWeight: 800, color: "#fff", margin: 0, lineHeight: 1.25 }}>
                                {step.title}
                              </p>
                              <p style={{ fontFamily: F, fontSize: 12, fontWeight: 500, color: "rgba(220,210,255,0.75)", margin: "4px 0 6px", lineHeight: 1.4 }}>
                                {step.desc}
                              </p>
                              <div style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                                <span style={{ fontSize: 13 }}>{step.tagIcon}</span>
                                <span style={{ fontFamily: F, fontSize: 11.5, fontWeight: 700, color: step.accent }}>{step.tag}</span>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                  );
                })}
              </div>

            </div>

            {/* Continue — pinned footer, always reserves space so cards don't shift */}
            <motion.div
              animate={{ opacity: showButton ? 1 : 0 }}
              style={{ padding: "6px 10px 16px", flexShrink: 0, pointerEvents: showButton ? "auto" : "none" }}
            >
              <button
                onClick={(e) => { e.stopPropagation(); onNext(); }}
                style={{
                  width: "100%", height: 52, borderRadius: 28,
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
              </button>
            </motion.div>
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
