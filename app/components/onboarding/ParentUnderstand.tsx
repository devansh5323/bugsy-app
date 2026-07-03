"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bobo } from "../Mascot";
import { NightRoomBackdrop } from "./WhoAreYou";

const F = "var(--font-nunito), system-ui, sans-serif";
const INTRO_TEXT = "Here's everything we will do together:";

const TABS = [
  { key: "missions",  emoji: "🎯", label: "Daily\nMissions",         accent: "#EC4899", accentBg: "rgba(236,72,153,0.22)" },
  { key: "emotional", emoji: "💛", label: "Learn\nemotional control", accent: "#FBBF24", accentBg: "rgba(251,191,36,0.22)" },
  { key: "habit",     emoji: "🌱", label: "Habit\nbuilding",          accent: "#34D399", accentBg: "rgba(52,211,153,0.22)" },
];

const SKILL_CARDS = [
  { key: "visual",  emoji: "👁️", label: "Visual Attention",  desc: "Noticing and focusing on important details",         iconBg: "#5B21B6", sparkle: "#A78BFA" },
  { key: "focus",   emoji: "⏱",  label: "Sustained focus",   desc: "Staying on task for longer periods",                 iconBg: "#059669", sparkle: "#34D399" },
  { key: "org",     emoji: "📋", label: "Organization",       desc: "Planning, prioritizing and keeping things in order", iconBg: "#92400E", sparkle: "#FCD34D" },
  { key: "flex",    emoji: "🔀", label: "Mental Flexibility", desc: "Adapting to changes and trying new ways",            iconBg: "#9F1239", sparkle: "#FB7185" },
  { key: "problem", emoji: "🧩", label: "Problem-solving",    desc: "Thinking critically and finding solutions",          iconBg: "#1E3A8A", sparkle: "#60A5FA" },
];

const CAT_STATS = [
  { label: "HUNGER",      sub: "Feeding",       emoji: "🍲", value: 90, color: "#FF6B9D", track: "rgba(255,107,157,0.25)" },
  { label: "PLAYING",     sub: "Fun & games",   emoji: "🎾", value: 60, color: "#4ADE80", track: "rgba(74,222,128,0.25)"  },
  { label: "CUDDLING",    sub: "Love & bonding",emoji: "❤️", value: 80, color: "#FF4757", track: "rgba(255,71,87,0.25)"   },
  { label: "GROOMING",    sub: "Clean & comfy", emoji: "🪮", value: 70, color: "#22D3EE", track: "rgba(34,211,238,0.25)"  },
  { label: "SOCIALIZING", sub: "Friends & clan",emoji: "😸", value: 55, color: "#A78BFA", track: "rgba(167,139,250,0.25)" },
];

function Catometer() {
  const vw = 280, vh = 128;
  const cx = vw / 2, cy = vh - 10;
  const R = 90;
  const sw = 20;

  const pct = 0.78;
  const ang = (1 - pct) * Math.PI;
  const px = cx + R * Math.cos(ang);
  const py = cy - R * Math.sin(ang);

  return (
    <div style={{
      background: "transparent",
      borderRadius: 20,
      padding: "10px 10px 8px",
      position: "relative", overflow: "visible",
    }}>
      {/* Corner sparkles */}
      <span style={{ position: "absolute", top: 10, left: 12,  color: "#A78BFA", fontSize: 12, opacity: 0.8 }}>✦</span>
      <span style={{ position: "absolute", top: 10, right: 12, color: "#A78BFA", fontSize: 12, opacity: 0.8 }}>✦</span>

      {/* Title */}
      <div style={{ textAlign: "center", marginBottom: 2 }}>
        <span style={{ fontFamily: F, fontSize: 14.5, fontWeight: 900, color: "#FF6B9D" }}>{"Fumi's Cat-o-meter"}</span>
        <span style={{ fontSize: 15, marginLeft: 5 }}>😸</span>
      </div>
      <p style={{ fontFamily: F, fontSize: 11, fontWeight: 500, color: "rgba(255,255,255,0.45)", textAlign: "center", margin: "0 0 0" }}>
        Help me grow by giving me daily attention.
      </p>

      {/* Gauge SVG */}
      <div style={{ position: "relative" }}>
        <svg viewBox={`0 0 ${vw} ${vh}`} style={{ width: "100%", display: "block", overflow: "visible" }}>
          <defs>
            <linearGradient id="cg" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="#FF3CAC" />
              <stop offset="15%"  stopColor="#FF6030" />
              <stop offset="30%"  stopColor="#FFA030" />
              <stop offset="48%"  stopColor="#DFEE00" />
              <stop offset="63%"  stopColor="#22E87A" />
              <stop offset="80%"  stopColor="#00DDFF" />
              <stop offset="100%" stopColor="#9D50FF" />
            </linearGradient>
          </defs>
          {/* Faint track */}
          <path d={`M ${cx-R} ${cy} A ${R} ${R} 0 0 1 ${cx+R} ${cy}`}
            fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={sw} strokeLinecap="round" />
          {/* Rainbow arc */}
          <path d={`M ${cx-R} ${cy} A ${R} ${R} 0 0 1 ${cx+R} ${cy}`}
            fill="none" stroke="url(#cg)" strokeWidth={sw} strokeLinecap="round" />
          {/* Pointer: large white ring with dark fill + white play icon */}
          <circle cx={px} cy={py} r="18" fill="#1a1040" stroke="#ffffff" strokeWidth="3" />
          <polygon points={`${px-5},${py-7.5} ${px-5},${py+7.5} ${px+8.5},${py}`} fill="#ffffff" />
        </svg>

        {/* 78% + Healthy badge overlaid on arc center */}
        <div style={{
          position: "absolute", bottom: 12, left: "50%", transform: "translateX(-50%)",
          textAlign: "center", pointerEvents: "none", whiteSpace: "nowrap",
        }}>
          <div style={{ fontFamily: F, fontSize: 28, fontWeight: 900, color: "#4ADE80", lineHeight: 1 }}>
            78% <span style={{ fontSize: 16 }}>❤️</span>
          </div>
          <div style={{
            fontFamily: F, fontSize: 11, fontWeight: 800, color: "#4ADE80",
            background: "rgba(74,222,128,0.18)", border: "1px solid rgba(74,222,128,0.45)",
            borderRadius: 10, padding: "3px 12px", marginTop: 4, display: "inline-block",
          }}>Healthy!</div>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: "flex", justifyContent: "space-between", gap: 2, marginTop: 0 }}>
        {CAT_STATS.map(s => (
          <div key={s.label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <span style={{ fontFamily: F, fontSize: 7, fontWeight: 900, color: s.color, letterSpacing: 0.3, textAlign: "center" }}>{s.label}</span>
            <span style={{ fontFamily: F, fontSize: 6.5, color: "rgba(255,255,255,0.38)", textAlign: "center", lineHeight: 1.2 }}>{s.sub}</span>
            <span style={{ fontSize: 18, lineHeight: 1, margin: "2px 0" }}>{s.emoji}</span>
            <div style={{ width: 10, height: 34, borderRadius: 5, background: s.track, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: `${s.value}%`, background: s.color, borderRadius: 5 }} />
            </div>
            <span style={{ fontFamily: F, fontSize: 10.5, fontWeight: 900, color: s.color }}>{s.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ParentUnderstand({
  tint, childName, parentName, onNext, onBack,
}: {
  tint: number; childName: string; parentName: string; onNext: () => void; onBack?: () => void;
}) {
  void childName; void parentName;

  const [catVisible,     setCatVisible]     = useState(false);
  const [typedText,      setTypedText]      = useState("");
  const [tabCount,       setTabCount]       = useState(0);
  const [showHint,       setShowHint]       = useState(false);
  const [showButton,     setShowButton]     = useState(false);
  const [selectedTab,    setSelectedTab]    = useState<number | null>(null);
  const [skillCardCount, setSkillCardCount] = useState(0);

  useEffect(() => {
    const ts: ReturnType<typeof setTimeout>[] = [];
    ts.push(setTimeout(() => setCatVisible(true), 200));
    const tS = 700;
    INTRO_TEXT.split("").forEach((_, i) =>
      ts.push(setTimeout(() => setTypedText(INTRO_TEXT.slice(0, i + 1)), tS + i * 38))
    );
    const after = tS + INTRO_TEXT.length * 38 + 350;
    ts.push(setTimeout(() => setTabCount(1), after));
    ts.push(setTimeout(() => setTabCount(2), after + 340));
    ts.push(setTimeout(() => setTabCount(3), after + 680));
    ts.push(setTimeout(() => setShowHint(true),   after + 960));
    ts.push(setTimeout(() => setShowButton(true), after + 1200));
    return () => ts.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    const ts: ReturnType<typeof setTimeout>[] = [];
    if (selectedTab === 0) {
      SKILL_CARDS.forEach((_, i) =>
        ts.push(setTimeout(() => setSkillCardCount(i + 1), 200 + i * 180))
      );
    } else {
      setSkillCardCount(0);
    }
    return () => ts.forEach(clearTimeout);
  }, [selectedTab]);

  const isDailyMissions = selectedTab === 0;
  const isHabitBuilding = selectedTab === 2;

  const renderBubbleText = () => {
    const prefix = "Here's everything we will do ";
    if (typedText.length <= prefix.length) {
      return <span style={{ color: "#1a0f40" }}>{typedText}</span>;
    }
    return (
      <>
        <span style={{ color: "#1a0f40" }}>{prefix}</span>
        <span style={{ color: "#7C3AED" }}>{typedText.slice(prefix.length)}</span>
      </>
    );
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

      {/* ── Cat + bubble ── */}
      <div style={{
        position: "relative", zIndex: 5, flexShrink: 0,
        display: "flex", alignItems: "flex-start",
        padding: "88px 16px 0 12px", gap: 10,
      }}>
        <AnimatePresence>
          {catVisible && (
            <motion.div
              initial={{ x: -64, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              style={{ flexShrink: 0 }}
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3.0, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
              >
                <Bobo mood="excited" tint={tint} size={120} animate />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {typedText.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 280, damping: 24 }}
              style={{
                flex: 1, background: "#fff", borderRadius: 20,
                padding: "14px 18px 15px",
                boxShadow: "0 6px 28px rgba(0,0,0,0.22)",
                position: "relative", marginTop: 10,
              }}
            >
              <div style={{
                position: "absolute", left: -12, top: 22,
                width: 0, height: 0,
                borderTop: "10px solid transparent",
                borderBottom: "10px solid transparent",
                borderRight: "12px solid #fff",
              }} />
              <p style={{ fontFamily: F, fontSize: 16, fontWeight: 800, margin: 0, lineHeight: 1.4 }}>
                {renderBubbleText()}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Tabs ── */}
      <div style={{
        position: "relative", zIndex: 5, flexShrink: 0,
        display: "flex", gap: 10, padding: "18px 16px 0",
      }}>
        {TABS.map((tab, i) => {
          const isSel = selectedTab === i;
          return (
            <AnimatePresence key={tab.key}>
              {tabCount > i && (
                <motion.button
                  initial={{ opacity: 0, y: 24 }}
                  animate={{
                    opacity: 1, y: 0,
                    boxShadow: isSel
                      ? `0 0 0 2px ${tab.accent}, 0 0 28px ${tab.accent}88`
                      : "0 0 0 transparent",
                  }}
                  whileHover={{ scale: 1.06, boxShadow: `0 0 0 2px ${tab.accent}, 0 0 32px ${tab.accent}99` }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 260, damping: 22 }}
                  onClick={() => setSelectedTab(isSel ? null : i)}
                  style={{
                    flex: 1,
                    background: isSel ? tab.accentBg : "rgba(255,255,255,0.07)",
                    border: `2px solid ${isSel ? tab.accent : "rgba(255,255,255,0.15)"}`,
                    borderRadius: 16, padding: "12px 6px 11px",
                    cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
                  }}
                >
                  <span style={{ fontSize: 28, lineHeight: 1 }}>{tab.emoji}</span>
                  <span style={{
                    fontFamily: F, fontSize: 10.5, fontWeight: 700,
                    color: isSel ? "#fff" : "rgba(255,255,255,0.70)",
                    textAlign: "center", lineHeight: 1.3, whiteSpace: "pre-line",
                  }}>{tab.label}</span>
                </motion.button>
              )}
            </AnimatePresence>
          );
        })}
      </div>

      {/* ── Hint ── */}
      <div style={{ position: "relative", zIndex: 5, flexShrink: 0, padding: "10px 16px 0", textAlign: "center" }}>
        <AnimatePresence>
          {showHint && selectedTab === null && (
            <motion.div
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                style={{ fontFamily: F, fontSize: 12.5, fontWeight: 600, color: "rgba(255,255,255,0.65)" }}
              >
                ✨ Tap on each to know more ✨
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Content area ── */}
      <div style={{ position: "relative", zIndex: 5, flex: 1, minHeight: 0, padding: "12px 16px 0", overflow: "hidden" }}>
        <AnimatePresence mode="wait">

          {/* Daily Missions */}
          {isDailyMissions && (
            <motion.div
              key="missions"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              style={{ display: "flex", flexDirection: "column", gap: 8, paddingBottom: 110 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: 0.05 }}
                style={{ textAlign: "center", marginBottom: 2 }}
              >
                <div style={{ fontFamily: F, fontSize: 13.5, fontWeight: 600, color: "rgba(255,255,255,0.9)", lineHeight: 1.5 }}>
                  {"When your child completes "}
                  <span style={{ fontWeight: 800, color: "#C084FC" }}>{"daily missions"}</span>
                  {", it reinforces neural"}
                </div>
                <div style={{ fontFamily: F, fontSize: 13.5, fontWeight: 800, color: "#FCD34D", lineHeight: 1.5, marginTop: 3 }}>
                  {"pathways and helps develop skills like: ✨"}
                </div>
              </motion.div>

              {SKILL_CARDS.map((card, i) => (
                <AnimatePresence key={card.key}>
                  {skillCardCount > i && (
                    <motion.div
                      initial={{ opacity: 0, x: -28 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 26 }}
                      style={{
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.10)",
                        borderRadius: 16, padding: "10px 14px",
                        display: "flex", alignItems: "center", gap: 13,
                        flexShrink: 0,
                      }}
                    >
                      <div style={{
                        width: 52, height: 52, borderRadius: 14, flexShrink: 0,
                        background: card.iconBg,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 26,
                      }}>{card.emoji}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: F, fontSize: 15, fontWeight: 800, color: "#fff", lineHeight: 1.2 }}>{card.label}</div>
                        <div style={{ fontFamily: F, fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.5)", marginTop: 3, lineHeight: 1.35 }}>{card.desc}</div>
                      </div>
                      <span style={{ color: card.sparkle, fontSize: 16, flexShrink: 0 }}>✦</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              ))}
            </motion.div>
          )}

          {/* Habit Building — two paragraphs + Cat-o-meter */}
          {isHabitBuilding && (
            <motion.div
              key="habit"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.22 }}
              style={{ display: "flex", flexDirection: "column", gap: 10, paddingBottom: 110 }}
            >
              <div style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 14, padding: "12px 14px",
              }}>
                  <p style={{ fontFamily: F, fontSize: 12.5, fontWeight: 600, color: "#fff", margin: "0 0 7px", lineHeight: 1.6 }}>
                    Just like your child, I need attention daily through food, play and cuddles.
                  </p>
                  <p style={{ fontFamily: F, fontSize: 12.5, fontWeight: 600, color: "#fff", margin: 0, lineHeight: 1.6 }}>
                    When your child takes care of me daily, it motivates your child to take care of themselves and build lasting habits.
                  </p>
              </div>
              <Catometer />
            </motion.div>
          )}

          {/* Emotional control */}
          {selectedTab === 1 && (
            <motion.div
              key="emotional"
              initial={{ opacity: 0, y: 8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.97 }}
              transition={{ duration: 0.22 }}
              style={{
                background: TABS[1].accentBg,
                border: `1.5px solid ${TABS[1].accent}55`,
                borderRadius: 16, padding: "16px 20px", textAlign: "center",
              }}
            >
              <p style={{ fontFamily: F, fontSize: 14, fontWeight: 600, color: "#fff", margin: 0, lineHeight: 1.6 }}>
                Fun activities to help your child understand and manage their emotions every day.
              </p>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* ── Continue button ── */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 10, padding: "10px 16px 34px" }}>
        <AnimatePresence>
          {showButton && (
            <motion.button
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              onClick={onNext}
              style={{
                width: "100%", height: 58, borderRadius: 29,
                background: "linear-gradient(180deg, #9D6FE8 0%, #7C3AED 100%)",
                border: "none", cursor: "pointer",
                fontFamily: F, fontSize: 19, fontWeight: 900, color: "#fff",
                boxShadow: "0 6px 0 #5B21B6, 0 10px 28px rgba(109,40,217,0.50)",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                touchAction: "manipulation",
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
  );
}
