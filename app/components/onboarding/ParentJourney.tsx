"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bobo } from "../Mascot";
import { NightRoomBackdrop } from "./WhoAreYou";

const F = "var(--font-nunito), system-ui, sans-serif";

const LINE1 = "Yay! I'm so happy you're here. Let me tell you about myself...";
const LINE2 = "I'm your child's pet companion- Together we grow, mastering one skill at a time";

const STAGES = [
  { num: 1,  size: 65,  title: "Tiny steps",       desc: "Fumi takes his first steps with your child's help.",                    icon: "❤️", label: "Trust",        labelColor: "#FF6BAD", gold: false },
  { num: 3,  size: 75,  title: "Growing curious",  desc: "Your child's attention helps Fumi explore and learn.",                  icon: "🎯", label: "Focus",        labelColor: "#C084FC", gold: false },
  { num: 6,  size: 84,  title: "More confident",   desc: "Fumi feels braver as your child keeps showing up.",                     icon: "😊", label: "Confidence",   labelColor: "#FDE68A", gold: false },
  { num: 9,  size: 92,  title: "Growing stronger", desc: "Every mission makes Fumi stronger and smarter!",                        icon: "🧠", label: "Learning",     labelColor: "#C084FC", gold: false },
  { num: 12, size: 88,  title: "Almost there",     desc: "Fumi is becoming your child's best adventure buddy!",                   icon: "⭐", label: "Independence", labelColor: "#FDE68A", gold: false },
  { num: 14, size: 100, title: "Fully grown! 🎉",  desc: "Together, you've helped Fumi grow into a confident, happy companion!", icon: "🏆", label: "Growth",       labelColor: "#7C3AED", gold: true  },
];

const DASHED = "repeating-linear-gradient(to bottom, rgba(130,80,220,0.55) 0px, rgba(130,80,220,0.55) 4px, transparent 4px, transparent 9px)";


function FullGrownCat({ tint = 210, size = 100 }: { tint?: number; size?: number }) {
  const h   = tint;
  const bt  = `oklch(88% 0.10 ${h})`;
  const bm  = `oklch(76% 0.15 ${h})`;
  const bb  = `oklch(60% 0.17 ${h})`;
  const ei  = `oklch(74% 0.16 ${(h + 18) % 360})`;
  const hl  = `oklch(96% 0.04 ${h})`;
  const tm  = `oklch(94% 0.04 ${h})`;
  const ck  = `oklch(72% 0.17 ${(h + 12) % 360})`;
  const ns  = "oklch(68% 0.14 20)";
  const gld = "oklch(82% 0.18 80)";
  const blc = "oklch(68% 0.22 78)";
  const gid = `fcg-${tint}`;
  return (
    <svg viewBox="-60 -62 120 124" width={size} height={size} style={{ display: "block", overflow: "visible" }}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={bt} />
          <stop offset="55%"  stopColor={bm} />
          <stop offset="100%" stopColor={bb} />
        </linearGradient>
      </defs>
      {/* Tail */}
      <path d="M 38 28 Q 58 10 54 -8 Q 50 -20 38 -16" stroke={bm} strokeWidth="10" fill="none" strokeLinecap="round"/>
      <path d="M 38 28 Q 58 10 54 -8 Q 50 -20 38 -16" stroke={bt}  strokeWidth="5.5" fill="none" strokeLinecap="round"/>
      {/* Body */}
      <path d={`M -38 -5 Q -46 6 -46 22 Q -46 48 -32 54 Q -18 60 0 60 Q 18 60 32 54 Q 46 48 46 22 Q 46 6 38 -5 Q 24 -13 0 -13 Q -24 -13 -38 -5 Z`} fill={`url(#${gid})`}/>
      {/* Tummy */}
      <ellipse cx="0" cy="26" rx="22" ry="30" fill={tm}/>
      {/* Head */}
      <circle cx="0" cy="-28" r="29" fill={bt}/>
      {/* Ears outer */}
      <path d="M -28 -46 L -40 -62 L -10 -50 Z" fill={bm}/>
      <path d="M  28 -46 L  40 -62 L  10 -50 Z" fill={bm}/>
      {/* Ears inner */}
      <path d="M -26 -49 L -37 -59 L -13 -51 Z" fill={ei}/>
      <path d="M  26 -49 L  37 -59 L  13 -51 Z" fill={ei}/>
      {/* Cheeks */}
      <ellipse cx="-18" cy="-23" rx="8" ry="5.5" fill={ck} opacity="0.5"/>
      <ellipse cx=" 18" cy="-23" rx="8" ry="5.5" fill={ck} opacity="0.5"/>
      {/* Eyes */}
      <circle cx="-10" cy="-31" r="8.5" fill="#12102a"/>
      <circle cx=" 10" cy="-31" r="8.5" fill="#12102a"/>
      <circle cx="-10" cy="-31" r="6"   fill="#0c1d38"/>
      <circle cx=" 10" cy="-31" r="6"   fill="#0c1d38"/>
      <circle cx="-6.5" cy="-35" r="3.2" fill="white"/>
      <circle cx=" 13.5" cy="-35" r="3.2" fill="white"/>
      {/* Nose */}
      <ellipse cx="0" cy="-19" rx="3.5" ry="2.5" fill={ns}/>
      {/* Mouth */}
      <path d="M -5 -15 Q 0 -11 5 -15" stroke="#774433" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      {/* Whiskers */}
      <line x1="-34" y1="-22" x2="-6" y2="-20.5" stroke={hl} strokeWidth="1.3" opacity="0.75"/>
      <line x1="-34" y1="-17" x2="-6" y2="-17.5" stroke={hl} strokeWidth="1.3" opacity="0.60"/>
      <line x1=" 34" y1="-22" x2=" 6" y2="-20.5" stroke={hl} strokeWidth="1.3" opacity="0.75"/>
      <line x1=" 34" y1="-17" x2=" 6" y2="-17.5" stroke={hl} strokeWidth="1.3" opacity="0.60"/>
      {/* Collar */}
      <path d="M -36 -5 Q -28 -15 0 -15 Q 28 -15 36 -5 Q 28 5 0 5 Q -28 5 -36 -5 Z" fill={gld}/>
      {/* Bell */}
      <circle cx="0" cy="-1" r="8.5" fill={blc}/>
      <circle cx="0" cy="-1" r="5.8" fill="oklch(88% 0.22 80)"/>
      <circle cx="-2" cy="-3.5" r="2.8" fill="oklch(95% 0.10 80)" opacity="0.85"/>
      <line x1="-7" y1="-1" x2="7" y2="-1" stroke={blc} strokeWidth="1.4" opacity="0.5"/>
      {/* Paws */}
      <ellipse cx="-22" cy="55" rx="14" ry="7"  fill={bm}/>
      <ellipse cx=" 22" cy="55" rx="14" ry="7"  fill={bm}/>
      <ellipse cx="-26" cy="59" rx="4" ry="3" fill={bb}/>
      <ellipse cx="-22" cy="60" rx="4" ry="3" fill={bb}/>
      <ellipse cx="-18" cy="59" rx="4" ry="3" fill={bb}/>
      <ellipse cx=" 18" cy="59" rx="4" ry="3" fill={bb}/>
      <ellipse cx=" 22" cy="60" rx="4" ry="3" fill={bb}/>
      <ellipse cx=" 26" cy="59" rx="4" ry="3" fill={bb}/>
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
  const [showMorphMascot, setShowMorphMascot] = useState(false);

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
      setTimeout(() => setShowMorphMascot(true), doneAt + 1400);
      STAGES.forEach((_, i) =>
        setTimeout(() => setStageCount(i + 1), doneAt + 2400 + i * 600)
      );
      const afterAll = doneAt + 2400 + STAGES.length * 600;
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
            <div className="pj-scroll" style={{ flex: 1, overflowY: "auto", overflowX: "hidden", paddingTop: 150 }}>

              {/* Cat + speech bubble */}
              <div style={{ display: "flex", alignItems: "flex-start", padding: "0 12px 0 10px", gap: 8, marginBottom: 0, marginTop: -40 }}>
                <div style={{ flexShrink: 0, pointerEvents: "none" }}>
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 3.0, repeat: Infinity, ease: "easeInOut" }}>
                    <Bobo mood="happy" tint={tint} size={72} animate armsDown />
                  </motion.div>
                </div>
                <div style={{ flex: 1, background: "#fff", borderRadius: 14, padding: "10px 13px", boxShadow: "0 5px 22px rgba(0,0,0,0.22)", position: "relative", marginTop: 6 }}>
                  <div style={{ position: "absolute", left: -10, top: 14, width: 0, height: 0, borderTop: "8px solid transparent", borderBottom: "8px solid transparent", borderRight: "10px solid #fff" }} />
                  <p style={{ fontFamily: F, fontSize: 13.5, fontWeight: 600, color: "#1a0f40", margin: 0, lineHeight: 1.4 }}>{LINE2}</p>
                </div>
              </div>

              {/* ── Morphing mascot: kitten ↔ full grown cat ── */}
              <motion.div
                animate={{ opacity: showMorphMascot ? 1 : 0, y: showMorphMascot ? 0 : 12 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "3px 0 5px", marginTop: 40 }}
              >
                <div style={{ position: "relative", width: 100, height: 100 }}>
                  <motion.div
                    animate={{ scale: [0.42, 1] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.6 }}
                    style={{ transformOrigin: "center center", position: "relative", width: 100, height: 100 }}
                  >
                    {/* Kitten — fades out as mascot grows */}
                    <motion.div
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.6 }}
                      style={{ position: "absolute", inset: 0 }}
                    >
                      <Bobo mood="happy" tint={tint} size={100} animate armsDown />
                    </motion.div>
                    {/* Fully grown cat — fades in as mascot grows */}
                    <motion.div
                      animate={{ opacity: [0, 1] }}
                      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.6 }}
                      style={{ position: "absolute", inset: 0 }}
                    >
                      <FullGrownCat tint={tint} size={100} />
                    </motion.div>
                  </motion.div>
                </div>

                <div style={{ height: 22, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 2, position: "relative" }}>
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.6 }}
                    style={{ position: "absolute", fontFamily: F, fontSize: 12, fontWeight: 700, whiteSpace: "nowrap", color: "#C4B5FD" }}
                  >🐱 Kitten</motion.span>
                  <motion.span
                    animate={{ opacity: [0, 1] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.6 }}
                    style={{ position: "absolute", fontFamily: F, fontSize: 12, fontWeight: 700, whiteSpace: "nowrap", color: "#A78BFA" }}
                  >😸 Fully Grown!</motion.span>
                </div>
              </motion.div>

              {/* ── Stage cards ── */}
              <div style={{ padding: "0 10px 0 10px", position: "relative" }}>
                {/* Static track line (faint) */}
                <div style={{ position: "absolute", left: 21, top: 0, bottom: 0, width: 2, background: DASHED, zIndex: 0, opacity: 0.35 }} />
                {/* Growing glow line */}
                <motion.div
                  style={{
                    position: "absolute", left: 20, top: 0, bottom: 0, width: 3,
                    borderRadius: 2, transformOrigin: "top center", zIndex: 0,
                  }}
                  animate={{
                    scaleY: stageCount / STAGES.length,
                    background: stageCount >= STAGES.length
                      ? "linear-gradient(to bottom, #B8860B, #DAA520, #B8860B)"
                      : "linear-gradient(to bottom, #9D6FE8, #6D28D9, #4C1D95)",
                    boxShadow: "none",
                  }}
                  transition={{
                    scaleY: { duration: 0.55, ease: "easeOut" },
                    background: { duration: 0.9 },
                  }}
                />

                {STAGES.map((stage, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: i < STAGES.length - 1 ? 10 : 0, position: "relative", zIndex: 1 }}>

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
                              width: stage.gold ? 20 : 12,
                              height: stage.gold ? 20 : 12,
                              borderRadius: "50%",
                              background: stage.gold
                                ? "radial-gradient(circle, #FFD700 0%, #B8860B 100%)"
                                : "radial-gradient(circle, #DAA520 0%, #92680A 100%)",
                              border: `1.5px solid rgba(218,165,32,0.70)`,
                              boxShadow: "none",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: 9,
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
                            initial={{ opacity: 0, x: 16, y: 8 }}
                            animate={{ opacity: 1, x: 0, y: 0 }}
                            transition={{ type: "spring", stiffness: 220, damping: 28 }}
                            style={{
                              height: 68,
                              background: stage.gold ? "rgba(30,12,70,0.75)" : "rgba(18,12,48,0.55)",
                              border: `1.5px solid ${stage.gold ? "rgba(139,92,246,0.85)" : "rgba(80,60,170,0.30)"}`,
                              borderRadius: 16,
                              overflow: "hidden",
                              boxShadow: stage.gold
                                ? "0 0 0 1px rgba(139,92,246,0.25), 0 4px 18px rgba(109,40,217,0.35)"
                                : "0 2px 10px rgba(0,0,0,0.38)",
                              display: "flex",
                              alignItems: "center",
                              padding: "5px 8px 5px 10px",
                              gap: 0,
                            }}
                          >
                            {/* Text */}
                            <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                                <div style={{
                                  display: "inline-flex", alignItems: "center", gap: 2,
                                  background: stage.gold ? "linear-gradient(90deg, #7C3AED, #9D4EDD)" : "#5B21B6",
                                  borderRadius: 20, padding: "1.5px 7px", flexShrink: 0,
                                }}>
                                  <span style={{ fontFamily: F, fontSize: 8.5, fontWeight: 900, color: "#fff" }}>DAY {stage.num}</span>
                                </div>
                                <span style={{ fontFamily: F, fontSize: 9, fontWeight: 800, color: stage.labelColor, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                  {stage.label}
                                </span>
                              </div>
                              <p style={{ fontFamily: F, fontSize: 14, fontWeight: 600, color: "#fff", margin: 0, lineHeight: 1.2 }}>
                                {stage.title}
                              </p>
                            </div>

                            {/* Icon only */}
                            <div style={{ flex: "0 0 44px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <span style={{ fontSize: 28 }}>{stage.icon}</span>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                ))}
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
