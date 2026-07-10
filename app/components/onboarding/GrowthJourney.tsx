"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NightRoomBackdrop } from "./WhoAreYou";

const F = "var(--font-nunito), system-ui, sans-serif";

const PURPLE = "#A78BFA";
const GOLD   = "#FBBF24";
const GREEN  = "#4ADE80";
const BLUE   = "#60A5FA";

// ── Growth-stage mascot illustrations — one consistent blue-cat style,
// growing in size and maturity across the four stages. ──────────────

function TinyKittenGlyph({ size = 70 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 130 130" style={{ display: "block", overflow: "visible" }}>
      <defs>
        <linearGradient id="gjTinyBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#CFEFFF" />
          <stop offset="55%" stopColor="#7BC9F0" />
          <stop offset="100%" stopColor="#3E93D1" />
        </linearGradient>
      </defs>
      <path d="M 95 95 Q 115 90 112 68" stroke="#5BB2E8" strokeWidth="10" fill="none" strokeLinecap="round" />
      <ellipse cx="65" cy="92" rx="34" ry="26" fill="url(#gjTinyBody)" />
      <ellipse cx="65" cy="100" rx="17" ry="10" fill="#EAF8FF" opacity="0.7" />
      <ellipse cx="50" cy="114" rx="9" ry="7" fill="#A9DDF7" />
      <ellipse cx="80" cy="114" rx="9" ry="7" fill="#A9DDF7" />
      <path d="M 40 42 L 28 16 L 56 32 Z" fill="url(#gjTinyBody)" />
      <path d="M 90 42 L 102 16 L 74 32 Z" fill="url(#gjTinyBody)" />
      <path d="M 40 38 L 33 22 L 50 31 Z" fill="#F4BFD4" opacity="0.85" />
      <path d="M 90 38 L 97 22 L 80 31 Z" fill="#F4BFD4" opacity="0.85" />
      <circle cx="65" cy="58" r="38" fill="url(#gjTinyBody)" />
      <circle cx="52" cy="60" r="11" fill="#1A2340" />
      <circle cx="78" cy="60" r="11" fill="#1A2340" />
      <circle cx="48.5" cy="55.5" r="3.8" fill="#fff" />
      <circle cx="74.5" cy="55.5" r="3.8" fill="#fff" />
      <ellipse cx="38" cy="66" rx="6" ry="4" fill="#F4BFD4" opacity="0.5" />
      <ellipse cx="92" cy="66" rx="6" ry="4" fill="#F4BFD4" opacity="0.5" />
      <path d="M 61 70 L 69 70 L 65 75 Z" fill="#F2879C" />
      <path d="M 65 75 Q 65 80 59 81" stroke="#1A2340" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <path d="M 65 75 Q 65 80 71 81" stroke="#1A2340" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <line x1="18" y1="64" x2="38" y2="67" stroke="#fff" strokeWidth="1.4" opacity="0.7" strokeLinecap="round" />
      <line x1="18" y1="74" x2="39" y2="74" stroke="#fff" strokeWidth="1.4" opacity="0.7" strokeLinecap="round" />
      <line x1="112" y1="64" x2="92" y2="67" stroke="#fff" strokeWidth="1.4" opacity="0.7" strokeLinecap="round" />
      <line x1="112" y1="74" x2="91" y2="74" stroke="#fff" strokeWidth="1.4" opacity="0.7" strokeLinecap="round" />
    </svg>
  );
}

function PlayfulKittenGlyph({ size = 92 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 130 130" style={{ display: "block", overflow: "visible" }}>
      <defs>
        <linearGradient id="gjPlayBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#CFEFFF" />
          <stop offset="55%" stopColor="#7BC9F0" />
          <stop offset="100%" stopColor="#3E93D1" />
        </linearGradient>
      </defs>
      <path d="M 92 100 Q 112 95 108 72" stroke="#5BB2E8" strokeWidth="10" fill="none" strokeLinecap="round" />
      <path d="M 88 78 Q 106 58 100 34" stroke="url(#gjPlayBody)" strokeWidth="18" fill="none" strokeLinecap="round" />
      <circle cx="99" cy="30" r="12" fill="url(#gjPlayBody)" />
      <ellipse cx="62" cy="94" rx="36" ry="28" fill="url(#gjPlayBody)" />
      <ellipse cx="62" cy="103" rx="18" ry="11" fill="#EAF8FF" opacity="0.7" />
      <ellipse cx="46" cy="120" rx="10" ry="7" fill="#A9DDF7" />
      <ellipse cx="78" cy="120" rx="10" ry="7" fill="#A9DDF7" />
      <ellipse cx="30" cy="90" rx="9" ry="15" fill="url(#gjPlayBody)" />
      <path d="M 36 40 L 22 12 L 52 30 Z" fill="url(#gjPlayBody)" />
      <path d="M 84 40 L 98 12 L 68 30 Z" fill="url(#gjPlayBody)" />
      <path d="M 36 36 L 28 18 L 46 29 Z" fill="#F4BFD4" opacity="0.85" />
      <path d="M 84 36 L 92 18 L 74 29 Z" fill="#F4BFD4" opacity="0.85" />
      <circle cx="60" cy="56" r="38" fill="url(#gjPlayBody)" />
      <circle cx="47" cy="58" r="11" fill="#1A2340" />
      <circle cx="73" cy="58" r="11" fill="#1A2340" />
      <circle cx="43.5" cy="53.5" r="4" fill="#fff" />
      <circle cx="69.5" cy="53.5" r="4" fill="#fff" />
      <ellipse cx="33" cy="64" rx="6" ry="4" fill="#F4BFD4" opacity="0.5" />
      <ellipse cx="87" cy="64" rx="6" ry="4" fill="#F4BFD4" opacity="0.5" />
      <path d="M 56 68 L 64 68 L 60 73 Z" fill="#F2879C" />
      <path d="M 48 76 Q 60 92 72 76 Q 60 84 48 76 Z" fill="#3C2A4A" />
      <path d="M 55 78 Q 60 83 65 78" fill="#F2879C" opacity="0.9" />
      <line x1="12" y1="62" x2="34" y2="65" stroke="#fff" strokeWidth="1.4" opacity="0.7" strokeLinecap="round" />
      <line x1="12" y1="72" x2="35" y2="72" stroke="#fff" strokeWidth="1.4" opacity="0.7" strokeLinecap="round" />
      <line x1="108" y1="62" x2="86" y2="65" stroke="#fff" strokeWidth="1.4" opacity="0.7" strokeLinecap="round" />
      <line x1="108" y1="72" x2="85" y2="72" stroke="#fff" strokeWidth="1.4" opacity="0.7" strokeLinecap="round" />
    </svg>
  );
}

function ConfidentKittenGlyph({ size = 116 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 130 130" style={{ display: "block", overflow: "visible" }}>
      <defs>
        <linearGradient id="gjConfBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#CFEFFF" />
          <stop offset="55%" stopColor="#7BC9F0" />
          <stop offset="100%" stopColor="#3E93D1" />
        </linearGradient>
      </defs>
      <path d="M 94 102 Q 114 96 110 74" stroke="#5BB2E8" strokeWidth="10" fill="none" strokeLinecap="round" />
      <ellipse cx="63" cy="96" rx="37" ry="29" fill="url(#gjConfBody)" />
      <ellipse cx="63" cy="105" rx="18" ry="11" fill="#EAF8FF" opacity="0.7" />
      <ellipse cx="47" cy="122" rx="10" ry="7" fill="#A9DDF7" />
      <ellipse cx="79" cy="122" rx="10" ry="7" fill="#A9DDF7" />
      <ellipse cx="50" cy="86" rx="17" ry="9" fill="url(#gjConfBody)" transform="rotate(-12 50 86)" />
      <ellipse cx="76" cy="86" rx="17" ry="9" fill="url(#gjConfBody)" transform="rotate(12 76 86)" />
      <circle cx="38" cy="83" r="8" fill="url(#gjConfBody)" />
      <circle cx="88" cy="83" r="8" fill="url(#gjConfBody)" />
      <path d="M 100 122 V 112" stroke="#4C8C2E" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M 100 114 C 100 108 94 107 91 108 C 91 114 96 116 100 114 Z" fill="#6FCB55" />
      <path d="M 100 111 C 100 106 106 105 109 106 C 109 111 104 113 100 111 Z" fill="#6FCB55" />
      <path d="M 38 42 L 24 14 L 54 32 Z" fill="url(#gjConfBody)" />
      <path d="M 86 42 L 100 14 L 70 32 Z" fill="url(#gjConfBody)" />
      <path d="M 38 38 L 30 20 L 48 31 Z" fill="#F4BFD4" opacity="0.85" />
      <path d="M 86 38 L 94 20 L 76 31 Z" fill="#F4BFD4" opacity="0.85" />
      <circle cx="62" cy="58" r="38" fill="url(#gjConfBody)" />
      <path d="M 42 58 Q 49 51 56 58" stroke="#1A2340" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <path d="M 68 58 Q 75 51 82 58" stroke="#1A2340" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <ellipse cx="35" cy="66" rx="6" ry="4" fill="#F4BFD4" opacity="0.5" />
      <ellipse cx="89" cy="66" rx="6" ry="4" fill="#F4BFD4" opacity="0.5" />
      <path d="M 58 68 L 66 68 L 62 73 Z" fill="#F2879C" />
      <path d="M 62 73 Q 62 78 56 79" stroke="#1A2340" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M 62 73 Q 62 78 68 79" stroke="#1A2340" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <line x1="14" y1="64" x2="36" y2="67" stroke="#fff" strokeWidth="1.4" opacity="0.7" strokeLinecap="round" />
      <line x1="14" y1="74" x2="37" y2="74" stroke="#fff" strokeWidth="1.4" opacity="0.7" strokeLinecap="round" />
      <line x1="110" y1="64" x2="88" y2="67" stroke="#fff" strokeWidth="1.4" opacity="0.7" strokeLinecap="round" />
      <line x1="110" y1="74" x2="87" y2="74" stroke="#fff" strokeWidth="1.4" opacity="0.7" strokeLinecap="round" />
    </svg>
  );
}

function AdultCatGlyph({ size = 138 }: { size?: number }) {
  return (
    <svg width={size} height={size * 160 / 150} viewBox="0 0 150 160" style={{ display: "block", overflow: "visible" }}>
      <defs>
        <linearGradient id="gjAdultBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#CFEFFF" />
          <stop offset="55%" stopColor="#7BC9F0" />
          <stop offset="100%" stopColor="#3E93D1" />
        </linearGradient>
      </defs>
      <path d="M 108 130 Q 138 128 140 100 Q 141 82 122 80" stroke="#5BB2E8" strokeWidth="11" fill="none" strokeLinecap="round" />
      <ellipse cx="72" cy="118" rx="42" ry="34" fill="url(#gjAdultBody)" />
      <ellipse cx="72" cy="130" rx="22" ry="14" fill="#EAF8FF" opacity="0.7" />
      <ellipse cx="54" cy="150" rx="11" ry="8" fill="#A9DDF7" />
      <ellipse cx="90" cy="150" rx="11" ry="8" fill="#A9DDF7" />
      <path d="M 44 46 L 28 14 L 62 34 Z" fill="url(#gjAdultBody)" />
      <path d="M 100 46 L 116 14 L 82 34 Z" fill="url(#gjAdultBody)" />
      <path d="M 44 41 L 35 22 L 55 33 Z" fill="#F4BFD4" opacity="0.85" />
      <path d="M 100 41 L 109 22 L 89 33 Z" fill="#F4BFD4" opacity="0.85" />
      <circle cx="72" cy="62" r="40" fill="url(#gjAdultBody)" />
      <path d="M 50 62 Q 58 54 66 62" stroke="#1A2340" strokeWidth="2.8" fill="none" strokeLinecap="round" />
      <path d="M 78 62 Q 86 54 94 62" stroke="#1A2340" strokeWidth="2.8" fill="none" strokeLinecap="round" />
      <ellipse cx="44" cy="71" rx="6.5" ry="4.4" fill="#F4BFD4" opacity="0.5" />
      <ellipse cx="100" cy="71" rx="6.5" ry="4.4" fill="#F4BFD4" opacity="0.5" />
      <path d="M 67 73 L 77 73 L 72 79 Z" fill="#F2879C" />
      <path d="M 72 79 Q 72 84 65 85" stroke="#1A2340" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M 72 79 Q 72 84 79 85" stroke="#1A2340" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M 46 92 Q 72 104 98 92" stroke="#5B7EB0" strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="72" cy="100" r="7.5" fill="#F5C542" stroke="#C88A1A" strokeWidth="1.3" />
      <circle cx="69.5" cy="97.5" r="2.4" fill="#FFEBAE" opacity="0.9" />
      <line x1="20" y1="68" x2="44" y2="71" stroke="#fff" strokeWidth="1.5" opacity="0.7" strokeLinecap="round" />
      <line x1="20" y1="78" x2="45" y2="78" stroke="#fff" strokeWidth="1.5" opacity="0.7" strokeLinecap="round" />
      <line x1="124" y1="68" x2="100" y2="71" stroke="#fff" strokeWidth="1.5" opacity="0.7" strokeLinecap="round" />
      <line x1="124" y1="78" x2="99" y2="78" stroke="#fff" strokeWidth="1.5" opacity="0.7" strokeLinecap="round" />
    </svg>
  );
}

const STEPS = [
  {
    num: 1, title: "Tiny Kitten", tagIcon: "💜", tag: "Builds Trust",
    desc: "Your child forms an emotional bond, building trust and connection.",
    accent: PURPLE, Icon: TinyKittenGlyph, avatarSize: 70, side: "left" as const,
  },
  {
    num: 2, title: "Playful Kitten", tagIcon: "🎯", tag: "Builds Focus",
    desc: "Through daily missions, your child develops focus and problem-solving skills.",
    accent: GOLD, Icon: PlayfulKittenGlyph, avatarSize: 92, side: "right" as const,
  },
  {
    num: 3, title: "Confident Kitten", tagIcon: "🌱", tag: "Builds Healthy Habits",
    desc: "Skills strengthen and your child begins practicing healthy routines and self-control.",
    accent: GREEN, Icon: ConfidentKittenGlyph, avatarSize: 112, side: "left" as const,
  },
  {
    num: 4, title: "Adult Cat", tagIcon: "⭐", tag: "Builds Independence",
    desc: "Your child is ready to take on new challenges, growing independent with Fumi by their side.",
    accent: BLUE, Icon: AdultCatGlyph, avatarSize: 128, side: "right" as const,
  },
];

// Curved dashed connector between two consecutive avatars — fades in
// only once triggered (no future segment ever visible ahead of time),
// with a small solid dot at the start (previous step's accent) and a
// hollow ring at the end (next step's accent).
function GrowthConnector({
  fromSide, fromSize, toSide, toSize, fromColor, toColor, on,
}: {
  fromSide: "left" | "right"; fromSize: number;
  toSide: "left" | "right"; toSize: number;
  fromColor: string; toColor: string; on: boolean;
}) {
  const W = 358;
  const MARGIN = 22;
  const H = 66;
  const fromX = fromSide === "left" ? MARGIN + fromSize / 2 : W - MARGIN - fromSize / 2;
  const toX   = toSide   === "left" ? MARGIN + toSize / 2   : W - MARGIN - toSize / 2;
  const path = `M ${fromX},0 C ${fromX},${H * 0.55} ${toX},${H * 0.45} ${toX},${H}`;
  if (!on) return null;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: -H, height: H, zIndex: 0, pointerEvents: "none" }}>
      <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ display: "block", overflow: "visible" }}>
        <motion.path
          d={path} fill="none" stroke="#8B7FE0" strokeWidth={2.6} strokeDasharray="7 7" strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, ease: "easeOut" }}
        />
        <motion.circle
          cx={fromX} cy={6} r={5} fill={fromColor}
          initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}
        />
        <motion.circle
          cx={toX} cy={H - 6} r={8} fill="none" stroke={toColor} strokeWidth={3}
          initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: [0.5, 1.3, 1] }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{ transformOrigin: `${toX}px ${H - 6}px` }}
        />
      </svg>
    </div>
  );
}

export function GrowthJourney({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack?: () => void;
}) {
  const [nodeOn,  setNodeOn]  = useState<boolean[]>(() => STEPS.map(() => false));
  const [cardOn,  setCardOn]  = useState<boolean[]>(() => STEPS.map(() => false));
  const [pathOn,  setPathOn]  = useState<boolean[]>(() => STEPS.map(() => false));
  const [showButton, setShowButton] = useState(false);

  // The zig-zag reveal starts immediately on mount — no intro dialogue,
  // straight into the growth journey.
  useEffect(() => {
    const ts: ReturnType<typeof setTimeout>[] = [];
    const flipOn = (setter: React.Dispatch<React.SetStateAction<boolean[]>>, i: number) =>
      setter((prev) => prev.map((v, idx) => (idx === i ? true : v)));
    const NODE_MS = 500, CARD_MS = 550, SETTLE_MS = 250, PATH_MS = 650;
    let cursor = 500;
    STEPS.forEach((_, i) => {
      ts.push(setTimeout(() => flipOn(setNodeOn, i), cursor));
      cursor += NODE_MS;
      ts.push(setTimeout(() => flipOn(setCardOn, i), cursor));
      cursor += CARD_MS + SETTLE_MS;
      if (i < STEPS.length - 1) {
        ts.push(setTimeout(() => flipOn(setPathOn, i + 1), cursor));
        cursor += PATH_MS + 200;
      }
    });
    ts.push(setTimeout(() => setShowButton(true), cursor + 500));
    return () => ts.forEach(clearTimeout);
  }, []);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
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

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{ position: "absolute", inset: 0, zIndex: 8, display: "flex", flexDirection: "column", overflow: "hidden" }}
      >
        <div className="gj-scroll" style={{ flex: 1, overflowY: "auto", overflowX: "hidden", paddingTop: 130 }}>

              <div style={{ padding: "0 16px", position: "relative" }}>
                {STEPS.map((step, i) => {
                  const isRight = step.side === "right";
                  const prevStep = i > 0 ? STEPS[i - 1] : null;
                  return (
                    <div key={i} style={{ position: "relative", zIndex: 1 }}>
                      {i > 0 && prevStep && (
                        <GrowthConnector
                          fromSide={prevStep.side} fromSize={prevStep.avatarSize}
                          toSide={step.side} toSize={step.avatarSize}
                          fromColor={prevStep.accent} toColor={step.accent}
                          on={pathOn[i]}
                        />
                      )}

                      <div style={{
                        display: "flex", flexDirection: isRight ? "row-reverse" : "row",
                        alignItems: "flex-end", gap: 10,
                        marginBottom: i < STEPS.length - 1 ? 56 : 0,
                      }}>
                        {/* Avatar column */}
                        <div style={{ flexShrink: 0, width: step.avatarSize + 12, display: "flex", justifyContent: "center", position: "relative" }}>
                          <AnimatePresence>
                            {nodeOn[i] && (
                              <motion.div
                                key={`avatar-${i}`}
                                initial={{ opacity: 0, scale: 0.6, y: 16 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ type: "spring", stiffness: 200, damping: 18 }}
                                style={{ position: "relative" }}
                              >
                                <div style={{
                                  position: "absolute", bottom: -4, left: "50%", transform: "translateX(-50%)",
                                  width: step.avatarSize * 0.72, height: step.avatarSize * 0.2, borderRadius: "50%",
                                  background: `${step.accent}33`, boxShadow: `0 0 22px 6px ${step.accent}55`,
                                  zIndex: 0,
                                }} />
                                <motion.div
                                  animate={{ y: [0, -5, 0] }}
                                  transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                                  style={{ position: "relative", zIndex: 1 }}
                                >
                                  <step.Icon size={step.avatarSize} />
                                </motion.div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Card */}
                        <div style={{
                          flex: 1, minWidth: 0, position: "relative",
                          background: "rgba(20,14,44,0.78)",
                          border: "1.5px solid rgba(124,58,237,0.4)",
                          borderRadius: 18, padding: "16px 16px 14px",
                          boxShadow: "0 4px 18px rgba(0,0,0,0.28)",
                        }}>
                          <div style={{
                            position: "absolute", top: -14, left: -14,
                            width: 30, height: 30, borderRadius: "50%",
                            background: step.accent,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontFamily: F, fontWeight: 900, fontSize: 14, color: "#1a0f2e",
                            boxShadow: `0 0 12px ${step.accent}aa`,
                          }}>
                            {step.num}
                          </div>
                          <AnimatePresence>
                            {cardOn[i] && (
                              <motion.div
                                key={`card-${i}`}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                              >
                                <p style={{ fontFamily: F, fontSize: 17, fontWeight: 800, color: "#fff", margin: 0, lineHeight: 1.25 }}>
                                  {step.title}
                                </p>
                                <div style={{ display: "inline-flex", alignItems: "center", gap: 5, marginTop: 5 }}>
                                  <span style={{ fontSize: 13 }}>{step.tagIcon}</span>
                                  <span style={{ fontFamily: F, fontSize: 12.5, fontWeight: 700, color: step.accent }}>{step.tag}</span>
                                </div>
                                <div style={{ height: 1, background: "rgba(255,255,255,0.1)", margin: "10px 0" }} />
                                <p style={{ fontFamily: F, fontSize: 12.5, fontWeight: 500, color: "rgba(220,210,255,0.78)", margin: 0, lineHeight: 1.4 }}>
                                  {step.desc}
                                </p>
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

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={showButton ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ type: "spring", stiffness: 220, damping: 22 }}
              style={{ padding: "6px 16px 22px", flexShrink: 0, pointerEvents: showButton ? "auto" : "none" }}
            >
              <button
                onClick={(e) => { e.stopPropagation(); onNext(); }}
                style={{
                  width: "100%", height: 58, borderRadius: 29,
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

      <style>{`
        .gj-scroll::-webkit-scrollbar { display: none; }
        .gj-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
