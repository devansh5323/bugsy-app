 "use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Bobo } from "../Mascot";
import { BRAIN_HEALTH_SCORE, brainHealthStatus, BRAIN_HEALTH_STATUS_STYLE } from "../../lib/data";

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

// Heart-and-sparkles scene for "Emotional Balance Builder" — the third,
// not-yet-played tile shown in the "View All" list.
function EmotionScene() {
  return (
    <svg width="88" height="88" viewBox="0 0 88 88" style={{ position: "absolute", inset: 0 }}>
      <circle cx="20" cy="18" r="1.6" fill="rgba(255,255,255,0.4)" />
      <circle cx="68" cy="24" r="1.2" fill="rgba(255,255,255,0.3)" />
      <circle cx="72" cy="60" r="1.6" fill="rgba(255,255,255,0.35)" />
      <path d="M44 54s-16-9.5-16-21A9.5 9.5 0 0 1 44 27a9.5 9.5 0 0 1 16 6c0 11.5-16 21-16 21Z" fill="rgba(255,255,255,0.22)" />
    </svg>
  );
}

const TILE_STYLE = {
  bird: { bg: "radial-gradient(ellipse at 40% 30%, #1E5A8C 0%, #082032 100%)", emoji: "🐦", sparkle: "#7DD3FC", animate: "pd-rocket", Scene: BirdSpikesScene },
  river: { bg: "linear-gradient(160deg, #1E4620 0%, #0D2B12 100%)", emoji: "🐟", sparkle: "#A7F3D0", animate: "none", Scene: RiverCatchScene },
  emotion: { bg: "linear-gradient(160deg, #6D28D9 0%, #2E1065 100%)", emoji: "💜", sparkle: "#DDD6FE", animate: "none", Scene: EmotionScene },
} as const;

const MISSIONS = [
  {
    title: "Fumi's River Catch",
    tile: "river" as const,
    skillTag: { icon: "🎯", label: "Self-regulation" },
    duration: "3 min",
    type: "Game",
  },
  {
    title: "Bird spikes",
    tile: "bird" as const,
    skillTag: { icon: "👀", label: "Visual scanning" },
    duration: "2 min",
    type: "Game",
  },
  {
    title: "Emotional Balance Builder",
    tile: "emotion" as const,
    skillTag: { icon: "💜", label: "Emotional regulation" },
    duration: "4 min",
    type: "Game",
  },
];

const PULSE_MOODS = [
  { key: "difficult", emoji: "😣", label: "Very difficult" },
  { key: "okay", emoji: "😐", label: "Okay" },
  { key: "good", emoji: "🙂", label: "Good" },
  { key: "excellent", emoji: "🤩", label: "Excellent" },
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

// Illustrated coach avatar — clean headshot bust: dark bob haircut,
// warm skin tone, purple top with a star badge on the chest.
function CoachAvatarGlyph({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block" }}>
      <defs>
        <radialGradient id="coach-bg" cx="0.35" cy="0.3" r="0.9">
          <stop offset="0%" stopColor="#EDE4FF" />
          <stop offset="100%" stopColor="#B39DEB" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="50" fill="url(#coach-bg)" />

      {/* shoulders / purple top — anchored to the bottom edge */}
      <path d="M12 100c0-22 17-32 38-32s38 10 38 32Z" fill="#7C3AED" />
      <path d="M38 70q12 10 24 0l-2 18q-10 7-20 0Z" fill="#6D28D9" />

      {/* star badge on the chest */}
      <path d="M50 78l2.4 5.2 5.6.5-4.2 3.7 1.3 5.6-4.6-3-4.6 3 1.3-5.6-4.2-3.7 5.6-.5Z" fill="#FBBF24" />

      {/* head cluster — nudged up so it isn't crowded against the
          shoulders, leaving even margin above the hair */}
      <g transform="translate(0,-9)">
        {/* neck */}
        <rect x="43" y="58" width="14" height="14" rx="6" fill="#D4A574" />

        {/* ears */}
        <circle cx="26" cy="52" r="5" fill="#D4A574" />
        <circle cx="74" cy="52" r="5" fill="#D4A574" />

        {/* face */}
        <ellipse cx="50" cy="48" rx="19" ry="20" fill="#E4AC79" />

        {/* hair */}
        <path d="M50 26c-14 0-23 10-23 22 0 4 1 7 2 9 2-8 6-13 11-15-1 4-1 8 1 10 3-6 9-10 15-10 6 0 10 3 12 7 1-3 2-6 2-9 0-12-9-22-20-22Z" fill="#2A1B3D" />

        {/* eyes */}
        <circle cx="43" cy="48" r="1.8" fill="#2A1B3D" />
        <circle cx="57" cy="48" r="1.8" fill="#2A1B3D" />

        {/* smile */}
        <path d="M44 55q6 4 12 0" stroke="#8A5A3A" strokeWidth="1.6" strokeLinecap="round" fill="none" />

        {/* cheeks */}
        <circle cx="34" cy="52" r="3" fill="#F0A9A0" opacity="0.55" />
        <circle cx="66" cy="52" r="3" fill="#F0A9A0" opacity="0.55" />
      </g>
    </svg>
  );
}

function CheckCircleIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill={PURPLE} />
      <path d="M7.5 12.5l3 3 6-6.5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function SpeechDotsIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M3 11a8 7 0 1 1 4.5 6.3L3 19l1.3-4.2A7 6 0 0 1 3 11Z" fill={PURPLE} />
      <circle cx="8.5" cy="11" r="1.15" fill="#fff" />
      <circle cx="12" cy="11" r="1.15" fill="#fff" />
      <circle cx="15.5" cy="11" r="1.15" fill="#fff" />
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

  const [pulseMood, setPulseMood] = useState<string | null>(null);
  const [pulseComment, setPulseComment] = useState("");
  const [viewAllOpen, setViewAllOpen] = useState(false);

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
        {/* purple sparkles around the mascot */}
        <span style={{ position: "absolute", top: 84, left: "36%", color: "rgba(196,181,253,0.85)", fontSize: 15 }}>✦</span>
        <span style={{ position: "absolute", top: 96, left: 8, color: "rgba(196,181,253,0.7)", fontSize: 12 }}>✦</span>

        {/* notification bell */}
        <div style={{
          position: "absolute", top: 18, right: 18, width: 42, height: 42, borderRadius: "50%",
          background: "rgba(255,255,255,0.06)", border: "1.5px solid rgba(255,255,255,0.22)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <BellIcon size={18} />
          <span style={{
            position: "absolute", top: 6, right: 7, width: 8, height: 8, borderRadius: "50%",
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
            <Bobo mood="waving" tint={tint} size={150} animate tailWag />
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

          {/* ── Brain Health — same score/status as the Attention Report's
              Brain Health Score hero card (shared via lib/data.ts) ── */}
          {(() => {
            const brainStatus = brainHealthStatus(BRAIN_HEALTH_SCORE);
            const brainTier = BRAIN_HEALTH_STATUS_STYLE[brainStatus];
            const circumference = 226.2;
            const dash = (BRAIN_HEALTH_SCORE / 100) * circumference;
            return (
              <div style={{ ...CARD }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ position: "relative", flexShrink: 0, width: 88, height: 88 }}>
                    <svg width="88" height="88" viewBox="0 0 88 88">
                      <defs>
                        <linearGradient id="pd-brain-ring" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor={brainTier.ringFrom} />
                          <stop offset="100%" stopColor={brainTier.ringTo} />
                        </linearGradient>
                      </defs>
                      <circle cx="44" cy="44" r="36" fill="none" stroke="#EDE9FE" strokeWidth="8" />
                      <circle
                        cx="44" cy="44" r="36" fill="none" stroke="url(#pd-brain-ring)" strokeWidth="8" strokeLinecap="round"
                        strokeDasharray={`${dash} ${circumference}`} transform="rotate(-90 44 44)"
                      />
                    </svg>
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34 }}>🧠</div>
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 6 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 5, minWidth: 0 }}>
                        <p style={{ margin: 0, color: "#1E1B3A", fontSize: 15.5, fontWeight: 800 }}>{CName}&apos;s Brain Health</p>
                        <span style={{ color: "#C4C7D1", fontSize: 13, flexShrink: 0 }}>ⓘ</span>
                      </div>
                      <div style={{
                        display: "inline-flex", alignItems: "center", gap: 5, flexShrink: 0,
                        background: brainTier.bg, borderRadius: 20, padding: "5px 11px",
                      }}>
                        <span style={{ fontSize: 12 }}>🏆</span>
                        <span style={{ fontFamily: F, fontSize: 11, fontWeight: 800, color: brainTier.color }}>On track</span>
                      </div>
                    </div>
                    <p style={{ margin: "0 0 6px", fontFamily: F, fontSize: 11.5 }}>
                      <span style={{ color: "#1E1B3A", fontWeight: 700 }}>Status:</span>{" "}
                      <span style={{ color: brainTier.color, fontWeight: 800 }}>{brainStatus}</span>
                      <span style={{ color: "#D5D8E0" }}> | </span>
                      <span style={{ color: "#1E1B3A", fontWeight: 700 }}>Score:</span>{" "}
                      <span style={{ color: brainTier.color, fontWeight: 800 }}>{BRAIN_HEALTH_SCORE}%</span>
                    </p>
                    <button
                      onClick={onReports}
                      style={{
                        display: "flex", alignItems: "center", gap: 5, cursor: "pointer",
                        background: "none", border: "none", padding: 0,
                        fontFamily: F, fontSize: 12.5, fontWeight: 800, color: PURPLE,
                      }}
                    >
                      View Growth Profile
                      <span aria-hidden>→</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* ── Fumi's Focus Today ── */}
          <div style={{ ...CARD, display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              flexShrink: 0, width: 64, height: 64, borderRadius: "50%",
              background: "#FEE2E2", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30,
            }}>🎯</div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: "0 0 2px", color: PURPLE, fontSize: 10.5, fontWeight: 800, letterSpacing: "1.2px", textTransform: "uppercase" }}>Fumi&apos;s Focus Today</p>
              <p style={{ margin: "0 0 6px", color: "#1E1B3A", fontSize: 17, fontWeight: 900 }}>Self-regulation</p>
              <p style={{ margin: 0, color: "#7B7F8C", fontSize: 11.5, lineHeight: 1.45 }}>
                Helping {CName} stay calm, manage emotions and handle challenges.
              </p>
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

          {/* ── TODAY'S MISSION ── */}
          <div style={{ ...CARD }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <p style={{ margin: 0, color: "#1E1B3A", fontSize: 15, fontWeight: 800 }}>Today&apos;s Mission</p>
              <button
                onClick={() => setViewAllOpen(true)}
                style={{
                  display: "flex", alignItems: "center", gap: 4, cursor: "pointer",
                  background: "none", border: "none", padding: 0,
                  fontFamily: F, fontSize: 12.5, fontWeight: 800, color: PURPLE,
                }}
              >
                View All
                <span aria-hidden>→</span>
              </button>
            </div>

            {(() => {
              const m = MISSIONS[0];
              const Scene = TILE_STYLE[m.tile].Scene;
              return (
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  {/* Tile image */}
                  <div style={{
                    width: 72, height: 72, flexShrink: 0, borderRadius: 16,
                    position: "relative", overflow: "hidden",
                    background: TILE_STYLE[m.tile].bg,
                    boxShadow: `inset 0 0 0 1.5px rgba(255,255,255,0.08), inset 0 2px 6px rgba(0,0,0,0.35), 0 6px 14px ${TILE_STYLE[m.tile].sparkle}33`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Scene />
                    <div style={{
                      position: "absolute", width: 46, height: 46, borderRadius: "50%",
                      background: `radial-gradient(circle, ${TILE_STYLE[m.tile].sparkle}40 0%, transparent 70%)`,
                    }} />
                    <span style={{
                      fontSize: 30, position: "relative", zIndex: 2, display: "block",
                      filter: "drop-shadow(0 3px 5px rgba(0,0,0,0.45))",
                    }}>{TILE_STYLE[m.tile].emoji}</span>
                  </div>

                  {/* Details */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: "0 0 6px", color: "#1E1B3A", fontSize: 16, fontWeight: 800, lineHeight: 1.2 }}>{m.title}</p>

                    <div style={{
                      display: "inline-flex", alignItems: "center", gap: 5, marginBottom: 8,
                      background: "#F1EBFE", borderRadius: 14, padding: "4px 10px 4px 6px",
                    }}>
                      <span style={{ fontSize: 12 }}>{m.skillTag.icon}</span>
                      <span style={{ fontFamily: F, fontSize: 11.5, fontWeight: 800, color: PURPLE }}>{m.skillTag.label}</span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: F, fontSize: 11, color: "#8A8FA3" }}>
                      <span>🕐</span>
                      <span>{m.duration}</span>
                      <span style={{ color: "#D5D8E0" }}>|</span>
                      <span>🎮</span>
                      <span>{m.type}</span>
                    </div>
                  </div>

                  <button style={{
                    flexShrink: 0, cursor: "pointer",
                    fontFamily: F, fontSize: 12.5, fontWeight: 800, color: "#fff",
                    background: "linear-gradient(180deg, #9D6FE8 0%, #7C3AED 100%)",
                    border: "none", borderRadius: 999, padding: "11px 16px",
                    boxShadow: "0 3px 10px rgba(124,58,237,0.35)",
                  }}>
                    Start Mission
                  </button>
                </div>
              );
            })()}
          </div>

          {/* ── "View All" missions modal — centered, blurred backdrop ── */}
          {typeof document !== "undefined" && createPortal(
            <AnimatePresence>
              {viewAllOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setViewAllOpen(false)}
                  style={{
                    position: "fixed", inset: 0, zIndex: 100,
                    background: "rgba(20,14,44,0.55)", backdropFilter: "blur(6px)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    padding: 24,
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                    transition={{ type: "spring", stiffness: 300, damping: 26 }}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      position: "relative", width: "100%", maxWidth: 500, maxHeight: "88vh", overflowY: "auto",
                      background: "#fff", borderRadius: 26, padding: "30px 24px",
                      boxShadow: "0 24px 60px rgba(0,0,0,0.4)",
                    }}
                  >
                    <button
                      onClick={() => setViewAllOpen(false)}
                      aria-label="Close"
                      style={{
                        position: "absolute", top: 16, right: 16, cursor: "pointer",
                        width: 32, height: 32, borderRadius: "50%",
                        background: "#F3F1FE", border: "none",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 16, color: "#1E1B3A",
                      }}
                    >
                      ✕
                    </button>

                    <p style={{ margin: "0 0 18px", color: "#1E1B3A", fontSize: 18, fontWeight: 800 }}>All Missions</p>

                    <div style={{ display: "flex", flexDirection: "column" }}>
                      {MISSIONS.slice(1).map((m, i) => {
                        const Scene = TILE_STYLE[m.tile].Scene;
                        return (
                          <div key={m.title} style={{
                            display: "flex", alignItems: "center", gap: 12,
                            paddingTop: i === 0 ? 0 : 18, marginTop: i === 0 ? 0 : 18,
                            borderTop: i === 0 ? "none" : "1px solid #EEF0F4",
                          }}>
                            <div style={{
                              width: 60, height: 60, flexShrink: 0, borderRadius: 16,
                              position: "relative", overflow: "hidden",
                              background: TILE_STYLE[m.tile].bg,
                              display: "flex", alignItems: "center", justifyContent: "center",
                            }}>
                              <Scene />
                              <span style={{ fontSize: 26, position: "relative", zIndex: 2 }}>{TILE_STYLE[m.tile].emoji}</span>
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <p style={{ margin: "0 0 4px", color: "#1E1B3A", fontSize: 14.5, fontWeight: 800, lineHeight: 1.2 }}>{m.title}</p>
                              <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 4 }}>
                                <span style={{ fontSize: 11 }}>{m.skillTag.icon}</span>
                                <span style={{ fontFamily: F, fontSize: 11, fontWeight: 700, color: PURPLE }}>{m.skillTag.label}</span>
                              </div>
                              <div style={{ display: "flex", alignItems: "center", gap: 5, fontFamily: F, fontSize: 10.5, color: "#8A8FA3" }}>
                                <span>🕐 {m.duration}</span>
                                <span style={{ color: "#D5D8E0" }}>|</span>
                                <span>🎮 {m.type}</span>
                              </div>
                            </div>
                            <button style={{
                              flexShrink: 0, cursor: "pointer",
                              fontFamily: F, fontSize: 11.5, fontWeight: 800, color: "#fff",
                              background: "linear-gradient(180deg, #9D6FE8 0%, #7C3AED 100%)",
                              border: "none", borderRadius: 999, padding: "9px 13px",
                              boxShadow: "0 3px 10px rgba(124,58,237,0.35)",
                            }}>
                              Start Mission
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>,
            document.body
          )}

          {/* ── PARENT PULSE ── */}
          <div style={{ ...CARD, padding: 0, overflow: "hidden" }}>
            <div style={{ padding: "16px 14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <SpeechDotsIcon size={20} />
                <p style={{ margin: 0, color: "#1E1B3A", fontSize: 15.5, fontWeight: 800 }}>Fumi wants a quick pulse</p>
              </div>

              <p style={{ margin: "10px 0 10px", color: "#1E1B3A", fontSize: 13, fontWeight: 600 }}>
                How was the experience so far?
              </p>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {PULSE_MOODS.map((m) => {
                  const active = pulseMood === m.key;
                  return (
                    <button
                      key={m.key}
                      onClick={() => setPulseMood(m.key)}
                      style={{
                        display: "flex", alignItems: "center", gap: 6, cursor: "pointer",
                        fontFamily: F, fontSize: 12, fontWeight: 600, color: "#1E1B3A",
                        background: active ? "#F1EBFE" : "#fff",
                        border: `1.5px solid ${active ? PURPLE : "#EEF0F4"}`,
                        borderRadius: 999, padding: "9px 14px",
                      }}
                    >
                      <span style={{ fontSize: 16 }}>{m.emoji}</span>
                      {m.label}
                    </button>
                  );
                })}
              </div>

              <p style={{ margin: "14px 0 8px", fontSize: 12.5 }}>
                <span style={{ color: "#1E1B3A", fontWeight: 800 }}>Any comments?</span>{" "}
                <span style={{ color: "#9AA0AE", fontWeight: 500 }}>(Optional)</span>
              </p>

              <div style={{
                display: "flex", alignItems: "center", gap: 8,
                background: "#F7F5FC", borderRadius: 14, padding: "6px 6px 6px 14px",
              }}>
                <input
                  value={pulseComment}
                  onChange={(e) => setPulseComment(e.target.value)}
                  placeholder="Tell us what felt easy, confusing, or helpful..."
                  style={{
                    flex: 1, minWidth: 0, background: "none", border: "none", outline: "none",
                    fontFamily: F, fontSize: 12, color: "#1E1B3A",
                  }}
                />
                <button style={{
                  flexShrink: 0, cursor: "pointer", background: "none", border: "none",
                  fontFamily: F, fontSize: 13, fontWeight: 800, color: PURPLE, padding: "8px 10px",
                }}>
                  Submit
                </button>
              </div>
            </div>

            <div style={{ background: "#F1EBFE", padding: "16px 14px", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ flexShrink: 0 }}>
                <CoachAvatarGlyph size={56} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: "0 0 3px", color: "#1E1B3A", fontSize: 14.5, fontWeight: 800 }}>Want expert support?</p>
                <p style={{ margin: "0 0 8px", color: "#5B6472", fontSize: 11.5, lineHeight: 1.45 }}>
                  A Fumi coach can help you understand {CName}&apos;s profile and plan the next steps.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <CheckCircleIcon size={14} />
                    <span style={{ fontFamily: F, fontSize: 11, fontWeight: 600, color: "#1E1B3A" }}>Growth profile walkthrough</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <CheckCircleIcon size={14} />
                    <span style={{ fontFamily: F, fontSize: 11, fontWeight: 600, color: "#1E1B3A" }}>Personalised sessions for your child</span>
                  </div>
                </div>
                <button style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6, cursor: "pointer",
                  width: "100%", fontFamily: F, fontSize: 13, fontWeight: 800, color: PURPLE,
                  background: "#fff", border: `1.5px solid ${PURPLE}`, borderRadius: 999, padding: "10px 14px",
                }}>
                  Talk to a Coach
                  <span aria-hidden>›</span>
                </button>
              </div>
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
