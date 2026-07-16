 "use client";

import { motion } from "framer-motion";
import { Bobo } from "../Mascot";

const F = "var(--font-nunito), system-ui, sans-serif";
const PURPLE = "#7C3AED";

// Obstacle-course scene for the "Bird spikes" tile — jagged spike rows top
// and bottom (Flappy-Bird-style hazard), soft clouds, and motion lines so
// the tile reads as an actual game scene rather than a bare emoji.
function BirdSpikesScene() {
  return (
    <svg width="88" height="88" viewBox="0 0 88 88" style={{ position: "absolute", inset: 0 }}>
      <ellipse cx="20" cy="20" rx="13" ry="6" fill="rgba(255,255,255,0.10)" />
      <ellipse cx="66" cy="14" rx="10" ry="5" fill="rgba(255,255,255,0.07)" />
      <path d="M0 0 L8 15 L16 0 L24 15 L32 0 L40 15 L48 0 L56 15 L64 0 L72 15 L80 0 L88 15 L88 0 Z" fill="#1F3610" />
      <path d="M0 88 L8 73 L16 88 L24 73 L32 88 L40 73 L48 88 L56 73 L64 88 L72 73 L80 88 L88 73 L88 88 Z" fill="#1F3610" />
      <path d="M10 48 Q20 46 30 48" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M6 57 Q16 55.5 26 57" stroke="rgba(255,255,255,0.2)" strokeWidth="1.6" strokeLinecap="round" fill="none" />
    </svg>
  );
}

// River scene for "Fumi's River Catch" — water wave bands, rising bubbles,
// a splash ripple, and a dangling hook + line to sell the catching mechanic.
function RiverCatchScene() {
  return (
    <svg width="88" height="88" viewBox="0 0 88 88" style={{ position: "absolute", inset: 0 }}>
      <path d="M0 58 Q22 52 44 58 T88 58 V88 H0 Z" fill="rgba(125,211,252,0.10)" />
      <path d="M0 68 Q22 63 44 68 T88 68 V88 H0 Z" fill="rgba(125,211,252,0.16)" />
      <circle cx="16" cy="26" r="2.4" fill="rgba(255,255,255,0.4)" />
      <circle cx="64" cy="18" r="1.7" fill="rgba(255,255,255,0.3)" />
      <circle cx="70" cy="32" r="1.2" fill="rgba(255,255,255,0.35)" />
      <ellipse cx="44" cy="55" rx="21" ry="4.5" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="1.5" />
      <path d="M52 0 V24" stroke="rgba(220,220,230,0.55)" strokeWidth="1.3" fill="none" />
      <path d="M52 24c0 3-2.4 5-4.8 4.4-2-.5-2.8-2.6-1.6-4.2" stroke="#E8C766" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

const TILE_STYLE = {
  bird: { bg: "radial-gradient(ellipse at 40% 30%, #1E5A8C 0%, #082032 100%)", emoji: "🐦", sparkle: "#7DD3FC", animate: "pd-rocket", Scene: BirdSpikesScene },
  river: { bg: "linear-gradient(160deg, #1E4620 0%, #0D2B12 100%)", emoji: "🐟", sparkle: "#A7F3D0", animate: "none", Scene: RiverCatchScene },
} as const;

const MISSIONS = [
  {
    title: "Bird spikes",
    desc: "A quick reflex game that sharpens visual scanning and impulse control.",
    tile: "bird" as const,
    completed: true,
    skills: [
      { icon: "👀", label: "Visual scanning" },
      { icon: "✋", label: "Impulse control" },
    ],
  },
  {
    title: "Fumi's River Catch",
    desc: "A river-catching game that builds mental flexibility and sharp eyes.",
    tile: "river" as const,
    completed: true,
    skills: [
      { icon: "🔄", label: "Mental Flexibility" },
      { icon: "👁️", label: "Visual discrimination" },
    ],
  },
];

const PULSE_QUESTIONS = [
  { icon: "😄", iconBg: "#FEF3C7", text: "How was your child's experience this week?" },
  { icon: "🎯", iconBg: "#FEE2E2", text: "What did your child enjoy the most?" },
  { icon: "💡", iconBg: "#FEF9C3", text: "Any challenges you noticed?" },
];

function BellIcon({ size = 20, color = "#fff" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 3a6 6 0 0 0-6 6v3.5c0 .6-.2 1.2-.6 1.7L4 16.5c-.5.6-.1 1.5.7 1.5h14.6c.8 0 1.2-.9.7-1.5l-1.4-2.3c-.4-.5-.6-1.1-.6-1.7V9a6 6 0 0 0-6-6Z"
        stroke={color} strokeWidth="1.7" strokeLinejoin="round" fill="none" />
      <path d="M9.5 20a2.5 2.5 0 0 0 5 0" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function ParentDashboard({
  tint,
  parentName,
  childName,
  onNext,
  onReports,
  onProfile,
}: {
  tint: number;
  parentName?: string;
  childName?: string;
  onNext: () => void;
  onReports?: () => void;
  onProfile?: () => void;
}) {
  const PName = parentName?.trim() || "Parent";
  const CName = childName?.trim() || "Your child";

  const CARD: React.CSSProperties = {
    background: "#fff",
    border: "1px solid #EEF0F4",
    borderRadius: 18,
    padding: "16px 14px",
    marginBottom: 14,
    boxShadow: "0 2px 10px rgba(30,20,70,0.06)",
  };

  return (
    <div style={{
      position: "absolute", inset: 0,
      background: "#fff",
      display: "flex", flexDirection: "column",
      fontFamily: F,
    }}>

      {/* ── Dark header — matches the "Welcome back" reference exactly:
          badge pill, big bold two-line greeting, larger mascot, planet +
          star decorations, notification bell, wavy bottom. ── */}
      <div style={{
        flexShrink: 0, position: "relative", overflow: "hidden",
        background: "linear-gradient(135deg, #0B0A1F 0%, #241B5C 55%, #3B2E82 100%)",
        padding: "48px 16px 22px",
      }}>
        {/* faint ringed-planet decoration */}
        <div style={{
          position: "absolute", top: 4, right: 64, width: 18, height: 18, borderRadius: "50%",
          background: "rgba(139,124,246,0.14)", transform: "rotate(-20deg)",
        }}>
          <div style={{ position: "absolute", inset: "-4px -8px", border: "1.2px solid rgba(139,124,246,0.22)", borderRadius: "50%" }} />
        </div>

        {/* sparkles */}
        <span style={{ position: "absolute", top: 20, left: "10%", color: "#fff", fontSize: 20 }}>✦</span>
        <span style={{ position: "absolute", top: 58, left: "26%", color: "rgba(255,255,255,0.6)", fontSize: 9 }}>✦</span>
        <span style={{ position: "absolute", top: 10, left: "60%", color: "rgba(255,255,255,0.55)", fontSize: 11 }}>✦</span>
        <span style={{ position: "absolute", top: 96, left: "4%", color: "rgba(255,255,255,0.5)", fontSize: 10 }}>✦</span>

        {/* notification bell */}
        <div style={{
          position: "absolute", top: 18, right: 18, width: 38, height: 38, borderRadius: "50%",
          background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <BellIcon size={17} />
          <span style={{
            position: "absolute", top: 5, right: 6, width: 8, height: 8, borderRadius: "50%",
            background: "#A78BFA", border: "1.5px solid #14122B",
          }} />
        </div>

        {/* wavy bottom decoration */}
        <svg width="100%" height="42" viewBox="0 0 400 42" preserveAspectRatio="none" style={{ position: "absolute", left: 0, right: 0, bottom: 0, display: "block" }}>
          <path d="M0 22 Q50 6 100 20 T200 18 T300 24 T400 14 V42 H0 Z" fill="rgba(139,124,246,0.16)" />
          <path d="M0 30 Q60 14 120 28 T240 26 T360 30 T400 24 V42 H0 Z" fill="rgba(139,124,246,0.10)" />
        </svg>

        <div style={{ display: "flex", alignItems: "center", gap: 12, position: "relative", zIndex: 1 }}>
          <div style={{ flexShrink: 0 }}>
            <Bobo mood="excited" tint={tint} size={118} animate tailWag armsDown />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, color: "#fff", fontSize: 25, fontWeight: 900, lineHeight: 1.12 }}>
              Hi, {PName}! 👋
            </p>
            <p style={{ margin: "2px 0 0", color: "#fff", fontSize: 18, fontWeight: 900, lineHeight: 1.2 }}>
              Great to see you here.
            </p>
            <p style={{ margin: "6px 0 0", color: "rgba(222,218,248,0.8)", fontSize: 12, fontWeight: 500, lineHeight: 1.4 }}>
              Let&apos;s help your child grow<br />together. 💜
            </p>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16, position: "relative", zIndex: 1 }}>
          <button onClick={onNext} style={{
            display: "flex", alignItems: "center", gap: 8, cursor: "pointer",
            fontFamily: F, fontSize: 12.5, fontWeight: 700, color: "#fff",
            background: "linear-gradient(180deg, #5B4FE0 0%, #3E30B0 100%)",
            border: "1.5px solid rgba(160,150,255,0.55)",
            borderRadius: 999, padding: "11px 16px", lineHeight: 1.3,
            boxShadow: "0 0 14px rgba(120,110,240,0.5)",
          }}>
            <span style={{ fontSize: 16 }}>👧</span>
            Switch to Child Dashboard
            <span style={{ fontSize: 15, opacity: 0.75 }}>›</span>
          </button>
        </div>
      </div>

      {/* ── White panel ── */}
      <div style={{
        flex: 1, minHeight: 0, background: "#fff",
        borderTopLeftRadius: 26, borderTopRightRadius: 26,
        marginTop: -14, position: "relative", zIndex: 1,
        display: "flex", flexDirection: "column", overflow: "hidden",
      }}>
        <div className="pd-scroll" style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: "18px 14px 0" }}>

          {/* ── THIS WEEK'S HIGHLIGHT ── */}
          <div style={{ ...CARD, overflow: "hidden", position: "relative" }}>
            <p style={{ margin: "0 0 10px", color: PURPLE, fontSize: 10.5, fontWeight: 800, letterSpacing: "1.2px", textTransform: "uppercase" }}>This Week&apos;s Highlight</p>

            <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: "0 0 14px", color: "#1E1B3A", fontSize: 18, fontWeight: 600, lineHeight: 1.3 }}>
                  {CName} showed growth in ability to handle setbacks!
                </p>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: "#DCFCE7", borderRadius: 12,
                  padding: "7px 12px",
                }}>
                  <span style={{ color: "#16A34A", fontSize: 18, lineHeight: 1 }}>📈</span>
                  <div>
                    <p style={{ margin: 0, color: "#1E1B3A", fontSize: 12, fontWeight: 700, lineHeight: 1.3 }}>
                      Frustration tolerance improved by <span style={{ color: "#16A34A" }}>8%</span>
                    </p>
                    <p style={{ margin: 0, color: "#8A8FA3", fontSize: 10 }}>Compared to last week</p>
                  </div>
                </div>
              </div>

              {/* Plant illustration */}
              <div style={{ flexShrink: 0, width: 94, height: 94, position: "relative" }}>
                <span style={{ position: "absolute", top: 0, right: 8, color: "#F59E0B", fontSize: 8, opacity: 0.9 }}>✦</span>
                <span style={{ position: "absolute", top: 12, left: 2, color: "#F59E0B", fontSize: 6, opacity: 0.7 }}>✦</span>
                <span style={{ position: "absolute", bottom: 4, right: 2, color: "#F59E0B", fontSize: 10, opacity: 0.8 }}>✦</span>
                <svg width="94" height="94" viewBox="0 0 94 94">
                  <defs>
                    <radialGradient id="pd-plant-glow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="rgba(167,139,250,0.22)" />
                      <stop offset="100%" stopColor="rgba(167,139,250,0)" />
                    </radialGradient>
                  </defs>
                  <circle cx="47" cy="52" r="38" fill="url(#pd-plant-glow)" />
                  <circle cx="47" cy="52" r="36" fill="none" stroke="rgba(167,139,250,0.28)" strokeWidth="1.5" />
                  <ellipse cx="47" cy="76" rx="22" ry="8" fill="#5B3A1A" />
                  <ellipse cx="47" cy="74" rx="18" ry="6" fill="#7A4E2A" />
                  <line x1="47" y1="74" x2="47" y2="40" stroke="#4CAF50" strokeWidth="3.5" strokeLinecap="round" />
                  <path d="M 47 56 C 30 48 22 32 33 23 C 41 18 47 32 47 56Z" fill="#4CAF50" />
                  <path d="M 47 50 C 64 40 74 26 61 18 C 52 13 47 28 47 50Z" fill="#66BB6A" />
                  <path d="M 47 56 C 38 44 34 30 35 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.9" />
                  <path d="M 47 50 C 56 40 62 28 60 20" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.9" />
                </svg>
              </div>
            </div>
          </div>

          {/* ── Stats Row — single card, 3 columns ── */}
          <div style={{ ...CARD, display: "flex", alignItems: "center", padding: "12px 6px" }}>

            {/* Streak */}
            <div style={{ flex: 3, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                background: "#FEF3C7",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15,
              }}>🔥</div>
              <p style={{ margin: 0, color: "#D97706", fontSize: 26, fontWeight: 900, lineHeight: 1 }}>1</p>
              <p style={{ margin: 0, color: "#1E1B3A", fontSize: 10, fontWeight: 700, textAlign: "center" }}>Day Streak</p>
              <p style={{ margin: 0, color: "#8A8FA3", fontSize: 9.5, textAlign: "center" }}>Keep it up!</p>
            </div>

            {/* Divider */}
            <div style={{ width: 1, alignSelf: "stretch", background: "#EEF0F4", margin: "0 3px" }} />

            {/* Focus Score — gauge + badge + description */}
            <div style={{ flex: 4, display: "flex", flexDirection: "column", alignItems: "center", minWidth: 0 }}>
              {/* SVG gauge — r=36, viewBox trimmed */}
              <svg viewBox="0 0 160 88" style={{ width: "100%", maxWidth: 130, display: "block" }}>
                <defs>
                  <linearGradient id="fst-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#6D28D9" />
                    <stop offset="100%" stopColor="#A855F7" />
                  </linearGradient>
                </defs>
                {/* Track — 220° arc, r=36 */}
                <circle cx="80" cy="62" r="36"
                  fill="none" stroke="#EEF0F4" strokeWidth="8" strokeLinecap="round"
                  strokeDasharray="138.5 88.1"
                  transform="rotate(160, 80, 62)"
                />
                {/* Fill — 35% */}
                <circle cx="80" cy="62" r="36"
                  fill="none" stroke="url(#fst-grad)" strokeWidth="8" strokeLinecap="round"
                  strokeDasharray="48.5 178.1"
                  transform="rotate(160, 80, 62)"
                  style={{ filter: "drop-shadow(0 0 5px rgba(168,85,247,0.35))" }}
                />
                {/* Score */}
                <text x="80" y="57" textAnchor="middle" dominantBaseline="middle"
                  fill="#1E1B3A" fontSize="32" fontWeight="900"
                  fontFamily="var(--font-nunito), system-ui, sans-serif">35</text>
                {/* Label */}
                <text x="80" y="76" textAnchor="middle" dominantBaseline="middle"
                  fill="#8A8FA3" fontSize="9.5" fontWeight="700"
                  fontFamily="var(--font-nunito), system-ui, sans-serif">Focus Score</text>
              </svg>

              {/* Badge */}
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 4,
                background: "#FEF3C7", borderRadius: 20,
                padding: "3px 10px", marginBottom: 5,
              }}>
                <span style={{ color: "#D97706", fontSize: 11 }}>↓</span>
                <span style={{ fontFamily: F, fontSize: 10.5, fontWeight: 800, color: "#D97706" }}>Below average</span>
              </div>

              {/* Description */}
              <p style={{
                margin: 0, textAlign: "center", fontFamily: F,
                fontSize: 10, lineHeight: 1.4, color: "#8A8FA3",
              }}>
                Focusing better than{" "}
                <span style={{ color: "#1E1B3A", fontWeight: 700 }}>35%</span>{" "}
                of kids this week!
              </p>
            </div>

            {/* Divider */}
            <div style={{ width: 1, alignSelf: "stretch", background: "#EEF0F4", margin: "0 3px" }} />

            {/* Missions */}
            <div style={{ flex: 3, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                background: "#DCFCE7",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15,
              }}>✅</div>
              <p style={{ margin: 0, color: "#16A34A", fontSize: 26, fontWeight: 900, lineHeight: 1 }}>2</p>
              <p style={{ margin: 0, color: "#1E1B3A", fontSize: 10, fontWeight: 700, textAlign: "center" }}>Missions Done</p>
              <p style={{ margin: 0, color: "#8A8FA3", fontSize: 9.5, textAlign: "center" }}>This week</p>
            </div>
          </div>

          {/* ── TODAY'S MISSIONS ── */}
          <div style={{ ...CARD }}>
            <p style={{ margin: "0 0 4px", color: PURPLE, fontSize: 10.5, fontWeight: 800, letterSpacing: "1.2px", textTransform: "uppercase" }}>Today&apos;s Missions</p>

            {MISSIONS.map((m, i) => {
              const Scene = TILE_STYLE[m.tile].Scene;
              return (
              <div key={m.title} style={{
                display: "flex", gap: 12, alignItems: "flex-start",
                paddingTop: i === 0 ? 10 : 16, marginTop: i === 0 ? 0 : 16,
                borderTop: i === 0 ? "none" : "1px solid #EEF0F4",
              }}>
                {/* Tile image */}
                <div style={{
                  width: 88, height: 88, flexShrink: 0, borderRadius: 18,
                  position: "relative", overflow: "hidden",
                  background: TILE_STYLE[m.tile].bg,
                  boxShadow: `inset 0 0 0 1.5px rgba(255,255,255,0.08), inset 0 2px 6px rgba(0,0,0,0.35), 0 6px 14px ${TILE_STYLE[m.tile].sparkle}33`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Scene />
                  {/* Glossy diagonal sheen */}
                  <div style={{
                    position: "absolute", top: "-40%", left: "-30%", width: "160%", height: "70%",
                    background: "linear-gradient(160deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0) 70%)",
                    transform: "rotate(-8deg)", pointerEvents: "none",
                  }} />
                  {/* Radial glow behind the emoji */}
                  <div style={{
                    position: "absolute", width: 56, height: 56, borderRadius: "50%",
                    background: `radial-gradient(circle, ${TILE_STYLE[m.tile].sparkle}40 0%, transparent 70%)`,
                  }} />
                  <span style={{ position: "absolute", top: 8, right: 10, color: TILE_STYLE[m.tile].sparkle, fontSize: 10, opacity: 0.9 }}>✦</span>
                  <span style={{ position: "absolute", bottom: 10, left: 9, color: TILE_STYLE[m.tile].sparkle, fontSize: 7, opacity: 0.7 }}>✦</span>
                  <span style={{ position: "absolute", top: 30, left: 12, color: TILE_STYLE[m.tile].sparkle, fontSize: 5, opacity: 0.6 }}>✦</span>
                  <span style={{
                    fontSize: 40, position: "relative", zIndex: 2, display: "block",
                    filter: "drop-shadow(0 3px 5px rgba(0,0,0,0.45))",
                    animation: TILE_STYLE[m.tile].animate === "pd-rocket" ? "pd-rocket 1.8s ease-in-out infinite" : "none",
                  }}>{TILE_STYLE[m.tile].emoji}</span>
                </div>

                {/* Details */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 6 }}>
                    <p style={{ margin: 0, color: "#1E1B3A", fontSize: 17, fontWeight: 900, lineHeight: 1.2 }}>{m.title}</p>
                    {m.completed ? (
                      <div style={{ display: "inline-flex", alignItems: "center", gap: 5, flexShrink: 0, background: "#DCFCE7", borderRadius: 20, padding: "4px 8px 4px 10px" }}>
                        <span style={{ color: "#16A34A", fontSize: 10.5, fontWeight: 800 }}>Completed</span>
                        <span style={{ width: 15, height: 15, borderRadius: "50%", background: "#16A34A", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <span style={{ color: "#fff", fontSize: 8.5, lineHeight: 1 }}>✓</span>
                        </span>
                      </div>
                    ) : (
                      <div style={{ flexShrink: 0, background: "#FEF3C7", borderRadius: 20, padding: "4px 10px" }}>
                        <span style={{ color: "#D97706", fontSize: 10.5, fontWeight: 800 }}>Not Started</span>
                      </div>
                    )}
                  </div>

                  <p style={{ margin: "0 0 9px", color: "#7B7F8C", fontSize: 12, lineHeight: 1.45 }}>{m.desc}</p>

                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                    <span style={{ color: PURPLE, fontSize: 11, fontWeight: 800, flexShrink: 0 }}>Skills</span>
                    {m.skills.map((s) => (
                      <div key={s.label} style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "#F1EBFE", borderRadius: 14, padding: "3px 9px 3px 3px" }}>
                        <span style={{ width: 17, height: 17, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9 }}>{s.icon}</span>
                        <span style={{ color: PURPLE, fontSize: 10, fontWeight: 700 }}>{s.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              );
            })}
          </div>

          {/* ── PARENT PULSE ── */}
          <div style={{ ...CARD }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
              <p style={{ margin: 0, color: PURPLE, fontSize: 10.5, fontWeight: 800, letterSpacing: "1.2px", textTransform: "uppercase" }}>Parent Pulse</p>
              <button style={{
                display: "flex", alignItems: "center", gap: 5, flexShrink: 0, cursor: "pointer",
                fontFamily: F, fontSize: 11, fontWeight: 800, color: PURPLE,
                background: "#F1EBFE", border: "none", borderRadius: 20, padding: "7px 12px",
              }}>
                <span style={{ fontSize: 12 }}>💬</span>
                Give Feedback
              </button>
            </div>

            <p style={{ margin: "8px 0 14px", color: "#7B7F8C", fontSize: 12, lineHeight: 1.5, maxWidth: "72%" }}>
              Your insights help us personalize Fumi for your child.
            </p>

            <div style={{ display: "flex", gap: 8 }}>
              {PULSE_QUESTIONS.map((q) => (
                <div key={q.text} style={{
                  flex: 1, minWidth: 0, background: "#F7F5FC", borderRadius: 14,
                  padding: "10px 8px", display: "flex", alignItems: "flex-start", gap: 5, cursor: "pointer",
                }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: "50%", flexShrink: 0,
                    background: q.iconBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12,
                  }}>{q.icon}</div>
                  <p style={{ flex: 1, minWidth: 0, margin: 0, color: "#1E1B3A", fontSize: 9.5, fontWeight: 600, lineHeight: 1.3 }}>{q.text}</p>
                  <span style={{ color: "#C4C7D1", fontSize: 12, flexShrink: 0 }}>›</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Coming Tomorrow ── */}
          <div style={{
            ...CARD,
            display: "flex", alignItems: "center",
          }}>
            {/* Calendar-star icon tile */}
            <div style={{ flexShrink: 0, marginRight: 12, position: "relative" }}>
              <div style={{
                width: 54, height: 54, borderRadius: 14,
                background: "linear-gradient(145deg, #A78BFA, #7C3AED)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 28,
              }}>📅</div>
              <div style={{
                position: "absolute", top: -7, right: -7,
                width: 22, height: 22, borderRadius: "50%",
                background: "linear-gradient(135deg, #FFD700, #FF9900)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
              }}>⭐</div>
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: "0 0 2px", color: "#D97706", fontSize: 10, fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase" }}>Coming Tomorrow</p>
              <p style={{ margin: "0 0 3px", color: "#1E1B3A", fontSize: 13, fontWeight: 500, lineHeight: 1.3 }}>New Adventure Unlocks</p>
              <p style={{ margin: 0, color: "#D97706", fontSize: 14, fontWeight: 700 }}>Emotional Balance Builder</p>
            </div>

            {/* Moon + cloud illustration */}
            <div style={{ flexShrink: 0, position: "relative", width: 76, height: 56 }}>
              <span style={{ position: "absolute", top: 2, left: 6, color: "#F59E0B", fontSize: 9, opacity: 0.85 }}>✦</span>
              <span style={{ position: "absolute", top: 12, left: 26, color: "#F59E0B", fontSize: 7, opacity: 0.7 }}>✦</span>
              <svg width="68" height="56" viewBox="0 0 68 56" style={{ position: "absolute", right: 0, top: 0 }}>
                <defs>
                  <radialGradient id="ct-mg" cx="40%" cy="35%" r="60%">
                    <stop offset="0%" stopColor="#FDE68A" />
                    <stop offset="100%" stopColor="#F59E0B" />
                  </radialGradient>
                </defs>
                <circle cx="46" cy="18" r="14" fill="url(#ct-mg)" />
                <circle cx="38" cy="13" r="11" fill="#fff" />
                <ellipse cx="32" cy="44" rx="22" ry="11" fill="#F1EBFE" />
                <ellipse cx="54" cy="46" rx="17" ry="9" fill="#F1EBFE" />
                <ellipse cx="14" cy="47" rx="12" ry="8" fill="#F1EBFE" />
              </svg>
            </div>
          </div>

          {/* Spacer */}
          <div style={{ height: 20 }} />
        </div>
      </div>

      {/* ── Bottom Tab Bar ── */}
      <div style={{
        flexShrink: 0, height: 74,
        background: "rgba(6,4,20,0.97)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        display: "flex", alignItems: "center",
        position: "relative",
      }}>
        {/* Home — active */}
        <motion.div
          whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.92 }}
          style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2, cursor: "pointer" }}
        >
          <div style={{
            width: 46, height: 46, borderRadius: "50%",
            background: "#7C3AED",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ fontSize: 22 }}>🏠</span>
          </div>
          <span style={{ color: "#fff", fontSize: 11, fontWeight: 800 }}>Home</span>
          <div style={{
            position: "absolute", bottom: 0, left: "calc(16.67% - 20px)", width: 40, height: 3,
            background: "#7C3AED", borderRadius: 2,
          }} />
        </motion.div>

        {/* Reports */}
        <motion.div
          onClick={onReports}
          whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.92 }}
          style={{
            flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
            cursor: "pointer",
          }}
        >
          <div style={{ width: 46, height: 46, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 22 }}>📊</span>
          </div>
          <span style={{ color: "#fff", fontSize: 11, fontWeight: 600 }}>Reports</span>
        </motion.div>

        {/* Profile */}
        <motion.div
          onClick={onProfile}
          whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.92 }}
          style={{
            flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
            cursor: "pointer",
          }}
        >
          <div style={{ width: 46, height: 46, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 22 }}>👤</span>
          </div>
          <span style={{ color: "#fff", fontSize: 11, fontWeight: 600 }}>Profile</span>
        </motion.div>
      </div>

      <style>{`
        .pd-scroll::-webkit-scrollbar { display: none; }
        .pd-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes pd-twinkle { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.2;transform:scale(0.5)} }
        @keyframes pd-rocket  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
      `}</style>
    </div>
  );
}
