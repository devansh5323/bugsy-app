"use client";

import { Bobo } from "../Mascot";
import { NightRoomBackdrop } from "./WhoAreYou";

const FEATURES = [
  {
    icon: "⭐", title: "Milestones",           sub: "Quick & easy",
    desc: "Track key moments that matter.",
    bg: "#1A1500", border: "#FFD234", glow: "rgba(255,210,52,0.55)",  iconBg: "#2D2400", anim: "card-fly-tl",
  },
  {
    icon: "📍", title: "Personalised Journey", sub: "Just for them",
    desc: "Activities matched to your child's needs.",
    bg: "#18083A", border: "#C026D3", glow: "rgba(192,38,211,0.50)",  iconBg: "#280A50", anim: "card-fly-tr",
  },
  {
    icon: "📊", title: "Better Insights",      sub: "As we go along",
    desc: "Clear reports to see real progress.",
    bg: "#001525", border: "#38BDF8", glow: "rgba(56,189,248,0.45)",  iconBg: "#002038", anim: "card-fly-bl",
  },
  {
    icon: "💗", title: "Tips & Tricks",        sub: "For every stage",
    desc: "Helpful ideas to support your child every day.",
    bg: "#1E0010", border: "#FF85C2", glow: "rgba(255,133,194,0.50)", iconBg: "#300018", anim: "card-fly-br",
  },
];

// ── Timing constants (ms) ─────────────────────────────────────
const BUBBLE_POP_MS   = 600;   // bubble container appears
const NAME_MS         = 900;   // parent name fades in
const WORD_START_MS   = 1100;  // first dialogue word
const WORD_GAP_MS     = 170;   // gap between each word
const HEART_MS        = 3200;  // 💜 after last word
const LABEL_MS        = 3600;  // "Here's what we'll do"
const CARD_BASE_MS    = 4000;  // first card
const CARD_STAGGER_MS = 320;   // gap between cards
const CTA_MS          = CARD_BASE_MS + 4 * CARD_STAGGER_MS + 600; // after last card

const popIn = (delay: number, dur = 500) =>
  `word-pop ${dur}ms cubic-bezier(0.34,1.56,0.64,1) ${delay}ms both`;

const fadeUp = (delay: number, dur = 500) =>
  `fade-up ${dur}ms cubic-bezier(0.22,1,0.36,1) ${delay}ms both`;

export function ParentUnderstand({
  tint,
  childName,
  parentName,
  onNext,
  onBack,
}: {
  tint: number;
  childName: string;
  parentName: string;
  onNext: () => void;
  onBack?: () => void;
}) {
  const child  = childName.trim()  || "child";
  const parent = parentName.trim() || "there";

  // Split dialogue into words; mark the child-name token specially
  const DIALOGUE_WORDS = ["The", "more", "you", "share", "about", `__child__`, "the", "better", "we", "grow", "together."];

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", display: "flex", flexDirection: "column", color: "#fff" }}>
      <NightRoomBackdrop minimal hideRug />

      {/* ── BACK BUTTON ── */}
      {onBack && (
        <button
          onClick={onBack}
          style={{
            position: "absolute", top: 52, left: 16, zIndex: 10,
            width: 40, height: 40, borderRadius: "50%",
            background: "rgba(255,255,255,0.15)", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20, color: "white",
            backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)",
            touchAction: "manipulation",
          }}
        >‹</button>
      )}

      {/* ── HEADER ── */}
      <div style={{ position: "relative", zIndex: 1, padding: "100px 20px 0", textAlign: "center", animation: fadeUp(100) }}>
        <h1 style={{ fontFamily: "var(--font-nunito), system-ui", fontSize: 32, fontWeight: 900, margin: "0 0 2px", lineHeight: 1.1, color: "#fff" }}>
          Let&apos;s Understand
        </h1>
        <h1 style={{ fontFamily: "var(--font-nunito), system-ui", fontSize: 36, fontWeight: 900, margin: "0 0 6px", lineHeight: 1.1 }}>
          <span style={{ color: "#FFD234" }}>your </span>
          <span style={{ color: "#FF85C2" }}>{child}</span>
        </h1>
        <p style={{ fontFamily: "var(--font-nunito), system-ui", fontSize: 14, fontWeight: 600, color: "#fff", margin: "0 0 6px" }}>
          Better understanding. Better adventures.
        </p>
        <span style={{ fontSize: 16 }}>🩷</span>
      </div>

      {/* ── BUGSY + SPEECH BUBBLE ── */}
      <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "10px 16px 0", animation: fadeUp(200) }}>

        {/* Bugsy */}
        <div style={{ flexShrink: 0, position: "relative" }}>
          <Bobo mood="excited" tint={tint} size={160} tailWag noSparkles />
          <div aria-hidden style={{ position: "absolute", bottom: -2, left: "50%", transform: "translateX(-50%)", width: 130, height: 38, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(210,30,55,0.75) 0%, rgba(160,15,38,0.42) 46%, transparent 100%)", filter: "blur(2px)", zIndex: -1 }} />
        </div>

        {/* Speech bubble */}
        <div style={{ position: "relative", background: "#fff8f0", borderRadius: 20, padding: "12px 16px 10px", maxWidth: 192, boxShadow: "0 6px 24px rgba(0,0,0,0.28)", animation: `bubble-pop 0.4s cubic-bezier(0.22,1.5,0.36,1) ${BUBBLE_POP_MS}ms both` }}>
          <div style={{ position: "absolute", left: -12, top: "40%", transform: "translateY(-50%)", width: 0, height: 0, borderTop: "9px solid transparent", borderBottom: "9px solid transparent", borderRight: "13px solid #fff8f0" }} />

          {/* Parent name */}
          <p style={{ fontFamily: "var(--font-nunito), system-ui", fontSize: 14, fontWeight: 800, color: "#FF85C2", margin: "0 0 4px", animation: popIn(NAME_MS, 400) }}>
            {parent},
          </p>

          {/* Word-by-word dialogue */}
          <p style={{ fontFamily: "var(--font-nunito), system-ui", fontSize: 13, fontWeight: 600, color: "#2d1a4a", margin: "0 0 6px", lineHeight: 1.6 }}>
            {DIALOGUE_WORDS.map((word, i) => {
              const delay = WORD_START_MS + i * WORD_GAP_MS;
              if (word === "__child__") {
                return (
                  <span key={i} style={{ display: "inline-block", color: "#7C3AED", fontWeight: 800, marginRight: "0.28em", animation: popIn(delay) }}>
                    {child},
                  </span>
                );
              }
              const isLast = i === DIALOGUE_WORDS.length - 1;
              return (
                <span key={i} style={{ display: "inline-block", marginRight: isLast ? 0 : "0.28em", animation: popIn(delay) }}>
                  {word}
                </span>
              );
            })}
          </p>

          {/* Heart */}
          <p style={{ margin: 0, fontSize: 16, textAlign: "center", animation: popIn(HEART_MS, 400) }}>💜</p>
        </div>
      </div>

      {/* ── FEATURE GRID ── */}
      <div style={{ position: "relative", zIndex: 1, flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "8px 16px 0", minHeight: 0 }}>
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10 }}>

          {/* Label */}
          <p style={{ fontFamily: "var(--font-nunito), system-ui", fontSize: 15, fontWeight: 800, color: "#fff", margin: 0, textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, animation: fadeUp(LABEL_MS) }}>
            <span>✨</span> Here&apos;s what we&apos;ll do: <span>✨</span>
          </p>

          {/* Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                style={{
                  background: f.bg,
                  border: `2px solid ${f.border}`,
                  borderRadius: 18,
                  padding: "12px 10px",
                  display: "flex", flexDirection: "column", gap: 0,
                  boxShadow: `0 0 18px ${f.glow}, 0 0 6px ${f.glow}, inset 0 0 10px ${f.glow}`,
                  animation: `${f.anim} 0.6s cubic-bezier(0.34,1.56,0.64,1) ${CARD_BASE_MS + i * CARD_STAGGER_MS}ms both`,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: f.iconBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0, boxShadow: `0 0 8px ${f.glow}` }}>
                    {f.icon}
                  </div>
                  <div>
                    <p style={{ fontFamily: "var(--font-nunito), system-ui", fontSize: 13, fontWeight: 900, color: "#fff", margin: 0, lineHeight: 1.2 }}>{f.title}</p>
                    <p style={{ fontFamily: "var(--font-nunito), system-ui", fontSize: 11, fontWeight: 500, color: "rgba(255,255,255,0.55)", margin: 0 }}>{f.sub}</p>
                  </div>
                </div>
                <div style={{ width: "100%", height: 1, background: `${f.border}44`, marginBottom: 8 }} />
                <p style={{ fontFamily: "var(--font-nunito), system-ui", fontSize: 11, fontWeight: 500, color: "rgba(255,255,255,0.70)", margin: 0, lineHeight: 1.5 }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* ── CTA ── */}
      <div style={{ position: "relative", zIndex: 1, padding: "12px 20px 6px", background: "linear-gradient(to top, rgba(13,6,33,0.98) 70%, transparent)", animation: fadeUp(CTA_MS) }}>
        <button
          onClick={onNext}
          style={{
            width: "100%", height: 56, borderRadius: 28,
            background: "linear-gradient(135deg,#7C3AED 0%,#5B21B6 100%)",
            border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            fontFamily: "var(--font-nunito), system-ui",
            fontSize: 18, fontWeight: 900, color: "white",
            boxShadow: "0 6px 20px rgba(90,33,182,0.50)",
            animation: `cta-glow-pulse 2.2s ease-in-out ${CTA_MS}ms infinite`,
            touchAction: "manipulation",
          }}
        >
          Start Assessment
        </button>
        <p style={{ fontFamily: "var(--font-nunito), system-ui", fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.50)", textAlign: "center", margin: "8px 0 10px" }}>
          Takes less than 2 minutes ⏱
        </p>
      </div>

    </div>
  );
}
