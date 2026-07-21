"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bobo } from "../Mascot";
import { NightRoomBackdrop } from "./WhoAreYou";
import { useAmbientMusic } from "./Welcome";

const F = "var(--font-nunito), system-ui, sans-serif";
const PURPLE = "#A78BFA";
const PINK   = "#EC4899";
const GOLD   = "#FBBF24";
const OFFWHITE = "rgba(250,249,245,0.88)";

function ArrowLeftIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M19 12H5M11 6l-6 6 6 6" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function MusicIcon({ size = 20, on = true }: { size?: number; on?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
      {!on && <line x1="3" y1="3" x2="21" y2="21" />}
    </svg>
  );
}

function Sparkle({ size = 14, color = GOLD, style }: { size?: number; color?: string; style?: React.CSSProperties }) {
  return <span aria-hidden style={{ position: "absolute", fontSize: size, color, lineHeight: 1, pointerEvents: "none", ...style }}>✦</span>;
}

function GrowthReportIcon({ size = 44 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none">
      <path d="M8 4h20l8 8v28a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" fill="#fff" />
      <path d="M28 4v8h8Z" fill="#E5E0FF" />
      <rect x="9" y="16" width="14" height="2" rx="1" fill="#C7B8F5" />
      <circle cx="16" cy="30" r="7" fill="#F1EEFF" />
      <path d="M16 30V23a7 7 0 0 1 7 7Z" fill="#F472B6" />
      <path d="M16 30l6.06 3.5A7 7 0 0 1 16 37Z" fill="#FBBF24" />
      <path d="M16 30 9.94 33.5A7 7 0 0 1 16 23Z" fill="#60A5FA" />
    </svg>
  );
}

function TargetDartIcon({ size = 44 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none">
      <circle cx="20" cy="22" r="17" fill="#FBC5D3" />
      <circle cx="20" cy="22" r="12" fill="#fff" />
      <circle cx="20" cy="22" r="12" fill="none" stroke="#F472B6" strokeWidth="1.5" />
      <circle cx="20" cy="22" r="6.5" fill="#FBC5D3" />
      <circle cx="20" cy="22" r="2.4" fill="#EC4899" />
      <path d="M34 6 24 18" stroke="#60A5FA" strokeWidth="3" strokeLinecap="round" />
      <path d="M34 6 30 6.5 33.5 10Z" fill="#3B82F6" />
    </svg>
  );
}

function CalendarStarIcon({ size = 44 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none">
      <rect x="5" y="8" width="34" height="30" rx="5" fill="#fff" />
      <path d="M5 8h34v8H5Z" fill="#EF4444" />
      <rect x="12" y="3" width="3.5" height="9" rx="1.5" fill="#B91C1C" />
      <rect x="28.5" y="3" width="3.5" height="9" rx="1.5" fill="#B91C1C" />
      <path d="M22 19l2.4 4.9 5.4.8-3.9 3.8.9 5.4L22 31.4l-4.8 2.5.9-5.4-3.9-3.8 5.4-.8Z" fill="#FBBF24" />
    </svg>
  );
}

const HELP_ITEMS = [
  { Icon: GrowthReportIcon, title: "Growth Report", subtitle: "Strengths & focus areas." },
  { Icon: TargetDartIcon, title: "Personalized Missions", subtitle: "Activities matched to your child." },
  { Icon: CalendarStarIcon, title: "Daily Guidance", subtitle: "Simple ways to build better habits." },
];

export function AssessmentIntro({
  tint,
  parentName,
  onNext,
  onSkip,
  onBack,
}: {
  tint: number;
  parentName?: string;
  onNext: () => void;
  onSkip: () => void;
  onBack?: () => void;
}) {
  const name = parentName?.trim() || "Parent";
  const { on: musicOn, toggle: toggleMusic } = useAmbientMusic();

  const [showHeading, setShowHeading] = useState(false);
  const [showMascot, setShowMascot] = useState(false);
  const [showBody, setShowBody] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [showCTA, setShowCTA] = useState(false);

  useEffect(() => {
    const ts = [
      setTimeout(() => setShowHeading(true), 150),
      setTimeout(() => setShowMascot(true), 500),
      setTimeout(() => setShowBody(true), 1000),
      setTimeout(() => setShowCard(true), 1350),
      setTimeout(() => setShowCTA(true), 1700),
    ];
    return () => ts.forEach(clearTimeout);
  }, []);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <NightRoomBackdrop minimal hideRug hideFloor />

      {onBack && (
        <button
          onClick={onBack}
          style={{
            position: "absolute", top: 24, left: 20, zIndex: 40,
            width: 46, height: 46, borderRadius: 14,
            background: "rgba(76,41,168,0.75)", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 2px 10px rgba(0,0,0,0.28)",
          }}
        >
          <ArrowLeftIcon />
        </button>
      )}

      <button
        onClick={toggleMusic}
        aria-label={musicOn ? "Mute music" : "Play music"}
        style={{
          position: "absolute", top: 24, right: 20, zIndex: 40,
          width: 46, height: 46, borderRadius: 14,
          background: "rgba(76,41,168,0.75)", border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 2px 10px rgba(0,0,0,0.28)",
        }}
      >
        <MusicIcon on={musicOn} />
      </button>

      <div style={{
        flex: 1, minHeight: 0, overflowY: "auto", position: "relative", zIndex: 2,
        display: "flex", flexDirection: "column", alignItems: "center",
        padding: "140px 22px 12px",
      }}>
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={showHeading ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
          style={{
            margin: 0, fontFamily: F, fontSize: 25, fontWeight: 900, lineHeight: 1.25,
            textAlign: "center",
          }}
        >
          <span style={{ color: PURPLE }}>{name},</span>{" "}
          <span style={{ color: "#fff" }}>most kids are yet to achieve their full potential with</span>{" "}
          <span style={{ color: PINK }}>Emotion Management.</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scale: 0.6, y: 30 }}
          animate={showMascot ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.6, y: 30 }}
          transition={{ type: "spring", stiffness: 200, damping: 18 }}
          style={{ position: "relative", marginTop: 8, flexShrink: 0 }}
        >
          <div style={{
            position: "absolute", bottom: 6, left: "50%", transform: "translateX(-50%)",
            width: 220, height: 60, borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(139,92,246,0.55) 0%, rgba(109,40,217,0.16) 60%, transparent 100%)",
            filter: "blur(6px)", zIndex: 0,
          }} />
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
            style={{ position: "relative", zIndex: 1 }}
          >
            <Bobo mood="cheer" tint={tint} size={170} animate armsDown eyeOpen={1} />
          </motion.div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={showMascot ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          style={{
            margin: "10px 0 0", maxWidth: 460, fontFamily: F, fontSize: 16, fontWeight: 500,
            color: OFFWHITE, textAlign: "center", lineHeight: 1.45,
          }}
        >
          It contributes to how they handle anger, impulses, relationships, and limiting screen use.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={showBody ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.5 }}
          style={{ width: "100%", maxWidth: 460, marginTop: 4 }}
        >
          <p style={{
            margin: "0 0 14px", fontFamily: F, fontSize: 16, fontWeight: 500,
            color: OFFWHITE, textAlign: "center", lineHeight: 1.45,
          }}>
            Your responses across these areas will help me choose{" "}
            <span style={{ color: GOLD, fontWeight: 800 }}>your child&apos;s missions</span>.
          </p>
          <p style={{
            margin: 0, fontFamily: F, fontSize: 16, fontWeight: 500,
            color: OFFWHITE, textAlign: "center", lineHeight: 1.45,
          }}>
             
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={showCard ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ type: "spring", stiffness: 220, damping: 24 }}
          style={{ width: "100%", maxWidth: 460, marginTop: 20, marginBottom: 12 }}
        >
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div style={{ width: 34, height: 1, background: "rgba(167,139,250,0.5)" }} />
            <Sparkle size={11} color={PURPLE} style={{ position: "static" }} />
            <p style={{ margin: 0, fontFamily: F, fontSize: 16, fontWeight: 900, color: "#fff", whiteSpace: "nowrap" }}>
              You&apos;ll receive:
            </p>
            <Sparkle size={11} color={PURPLE} style={{ position: "static" }} />
            <div style={{ width: 34, height: 1, background: "rgba(167,139,250,0.5)" }} />
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            {HELP_ITEMS.map((it) => (
              <div key={it.title} style={{
                flex: 1, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center",
                background: "rgba(35,25,74,0.55)", border: "1px solid rgba(139,124,246,0.22)",
                borderRadius: 20, padding: "18px 8px",
              }}>
                <div style={{ position: "relative", width: 60, height: 60, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{
                    position: "absolute", inset: 0, borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(139,92,246,0.35) 0%, transparent 72%)",
                  }} />
                  <Sparkle size={10} color={GOLD} style={{ top: -2, left: 0 }} />
                  <Sparkle size={9} color={GOLD} style={{ top: -2, right: 0 }} />
                  <Sparkle size={9} color={GOLD} style={{ bottom: -2, left: 4 }} />
                  <Sparkle size={8} color={GOLD} style={{ bottom: -2, right: 4 }} />
                  <it.Icon size={44} />
                </div>
                <p style={{ margin: "10px 0 4px", fontFamily: F, fontSize: 14.5, fontWeight: 800, color: PURPLE, lineHeight: 1.25 }}>
                  {it.title}
                </p>
                <p style={{ margin: 0, fontFamily: F, fontSize: 12.5, fontWeight: 500, color: OFFWHITE, lineHeight: 1.35 }}>
                  {it.subtitle}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={showCTA ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "relative", zIndex: 2,
          padding: "8px 22px 24px",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
        }}
      >
        <motion.button
          onClick={onNext}
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          whileTap={{ scale: 0.95 }}
          style={{
            width: "100%", height: 54, borderRadius: 27,
            background: "linear-gradient(180deg, #9D6FE8 0%, #7C3AED 100%)",
            border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            fontFamily: F, fontSize: 18, fontWeight: 900, color: "#fff",
            boxShadow: "0 5px 0 #5B21B6, 0 8px 22px rgba(109,40,217,0.50)",
            touchAction: "manipulation",
          }}
        >
          Get started
          <motion.span aria-hidden animate={{ x: [0, 5, 0] }} transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}>
            &rarr;
          </motion.span>
        </motion.button>

        <button
          onClick={onSkip}
          style={{
            background: "none", border: "none", cursor: "pointer",
            fontFamily: F, fontSize: 15, fontWeight: 600, color: "rgba(180,175,210,0.7)",
            touchAction: "manipulation", padding: "4px 8px",
          }}
        >
          Skip for now
        </button>
      </motion.div>
    </div>
  );
}
