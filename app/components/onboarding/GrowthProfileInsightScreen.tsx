"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bobo } from "../Mascot";
import { NightRoomBackdrop } from "./WhoAreYou";

const F = "var(--font-nunito), system-ui, sans-serif";
const GOLD = "#FBBF24";

function StarGlyph({ size = 14, color = GOLD }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2l2.9 6.3 6.9.7-5.2 4.6 1.6 6.8L12 16.9 5.8 20.4l1.6-6.8L2.2 9l6.9-.7L12 2Z" fill={color} />
    </svg>
  );
}

function MiniSparkle({ cx, cy, r, color }: { cx: number; cy: number; r: number; color: string }) {
  const k = r * 0.28;
  return (
    <path
      d={`M${cx} ${cy - r} L${cx + k} ${cy - k} L${cx + r} ${cy} L${cx + k} ${cy + k} L${cx} ${cy + r} L${cx - k} ${cy + k} L${cx - r} ${cy} L${cx - k} ${cy - k} Z`}
      fill={color}
    />
  );
}

function TrophyIcon3D({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <path d="M14 8h20v10a10 10 0 0 1-20 0V8Z" fill="#FDE68A" />
      <path d="M14 9.5H7a5.5 5.5 0 0 0 5.5 8M34 9.5h7a5.5 5.5 0 0 1-5.5 8" stroke="#FDE68A" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <rect x="20.5" y="27" width="7" height="7.5" fill="#FDE68A" />
      <rect x="15" y="34.5" width="18" height="4.5" rx="2.2" fill="#FDE68A" />
      <path d="M24 12.5l2 4.2 4.6.6-3.3 3.3.8 4.6L24 23l-4.1 2.2.8-4.6-3.3-3.3 4.6-.6Z" fill="#7C3AED" />
      <MiniSparkle cx={37} cy={8} r={3.5} color="#FDE68A" />
      <MiniSparkle cx={7} cy={30} r={3} color="#FDE68A" />
    </svg>
  );
}

function SproutIcon3D({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <ellipse cx="24" cy="40" rx="15" ry="5.5" fill="#B45309" />
      <ellipse cx="24" cy="38" rx="13" ry="4.5" fill="#D97706" />
      <path d="M24 38V22" stroke="#065F46" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M24 24c-7 1-11-5-10-14 7 2 11 8 10 14Z" fill="#4ADE80" />
      <path d="M24 22c7 3 12-3 11-13-8 2-13 7-11 13Z" fill="#22C55E" />
      <MiniSparkle cx={38} cy={12} r={3.5} color="#FDE68A" />
      <MiniSparkle cx={8} cy={16} r={3} color="#FDE68A" />
    </svg>
  );
}

function MagnifyIcon3D({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <circle cx="20" cy="20" r="14" fill="#DBEAFE" stroke="#fff" strokeWidth="3" />
      <circle cx="20" cy="20" r="9.5" fill="#1D4ED8" opacity="0.18" />
      <path d="M30 30l9 9" stroke="#92400E" strokeWidth="6" strokeLinecap="round" />
      <path d="M30 30l9 9" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" />
      <MiniSparkle cx={38} cy={10} r={3.5} color="#DBEAFE" />
      <MiniSparkle cx={8} cy={32} r={3} color="#DBEAFE" />
    </svg>
  );
}

function MountainFlagIcon3D({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <path d="M4 40 17 18l6 9 4-5 17 18Z" fill="#8B7CB8" />
      <path d="M4 40 17 18l6 9-8 13Z" fill="#A897D4" />
      <path d="M24 22V6" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M24 6l10 4-10 4Z" fill="#fff" />
      <MiniSparkle cx={39} cy={10} r={3.5} color="#FBCFE8" />
      <MiniSparkle cx={7} cy={16} r={3} color="#FBCFE8" />
    </svg>
  );
}

const CARDS = [
  {
    cardBg: "#E3D8F7", iconBg: "linear-gradient(160deg, #A78BFA 0%, #6D28D9 100%)", Icon: TrophyIcon3D,
    title: "What they're doing well",
  },
  {
    cardBg: "#FBE6C6", iconBg: "linear-gradient(160deg, #FBBF24 0%, #D97706 100%)", Icon: SproutIcon3D,
    title: "Areas that may need support",
  },
  {
    cardBg: "#D3E4FA", iconBg: "linear-gradient(160deg, #60A5FA 0%, #2563EB 100%)", Icon: MagnifyIcon3D,
    title: "How these patterns show up in daily life",
  },
  {
    cardBg: "#F8D2E4", iconBg: "linear-gradient(160deg, #F472B6 0%, #DB2777 100%)", Icon: MountainFlagIcon3D,
    title: "Their first mission",
  },
];

export function GrowthProfileInsightScreen({
  childName,
  onNext,
}: {
  childName: string;
  onNext: () => void;
}) {
  const name = childName.trim() || "Your child";

  const [showMascot, setShowMascot] = useState(false);
  const [showHeading, setShowHeading] = useState(false);
  const [cardsShown, setCardsShown] = useState(0);
  const [showCTA, setShowCTA] = useState(false);

  useEffect(() => {
    const ts: ReturnType<typeof setTimeout>[] = [];
    ts.push(setTimeout(() => setShowMascot(true), 100));
    ts.push(setTimeout(() => setShowHeading(true), 700));
    for (let i = 1; i <= CARDS.length; i++) {
      ts.push(setTimeout(() => setCardsShown(i), 1250 + i * 500));
    }
    ts.push(setTimeout(() => setShowCTA(true), 1250 + (CARDS.length + 1) * 500));
    return () => ts.forEach(clearTimeout);
  }, []);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <NightRoomBackdrop minimal hideRug hideFloor />

      <div style={{
        flex: 1, minHeight: 0, overflowY: "auto", position: "relative", zIndex: 2,
        display: "flex", flexDirection: "column", alignItems: "center",
        padding: "150px 22px 12px",
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.6, y: 30 }}
          animate={showMascot ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.6, y: 30 }}
          transition={{ type: "spring", stiffness: 200, damping: 18 }}
          style={{ position: "relative", flexShrink: 0 }}
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
            <Bobo mood="cheer" tint={250} size={190} animate eyeOpen={1} tailWag />
          </motion.div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={showHeading ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
          style={{
            margin: "18px 0 0", fontFamily: F, fontSize: 27, fontWeight: 900, lineHeight: 1.25,
            textAlign: "center", color: "#fff",
          }}
        >
          {name}&apos;s Growth Profile<br />
          is <span style={{ color: GOLD }}>nearly ready!</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={showHeading ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12 }}
        >
          <div style={{ width: 40, height: 1, background: "rgba(255,255,255,0.25)" }} />
          <StarGlyph size={14} />
          <div style={{ width: 40, height: 1, background: "rgba(255,255,255,0.25)" }} />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={showHeading ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            margin: "14px 0 0", maxWidth: 460, fontFamily: F, fontSize: 16, fontWeight: 500,
            textAlign: "center", color: "#fff",
          }}
        >
          You&apos;re just a few questions away from discovering:
        </motion.p>

        <div style={{
          width: "100%", maxWidth: 460, marginTop: 18,
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14,
        }}>
          {CARDS.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={cardsShown > i ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 160, damping: 20 }}
              style={{
                background: `linear-gradient(180deg, #fff 0%, ${c.cardBg} 100%)`,
                border: `1px solid ${c.cardBg}`,
                borderRadius: 20, padding: "16px 14px",
                boxShadow: `0 3px 0 ${c.cardBg}, 0 10px 20px rgba(0,0,0,0.14), inset 0 1.5px 0 rgba(255,255,255,0.9)`,
                display: "flex", alignItems: "center", gap: 12,
              }}
            >
              <div style={{
                flexShrink: 0, width: 52, height: 52, borderRadius: 16,
                background: c.iconBg,
                boxShadow: "0 3px 8px rgba(0,0,0,0.2), inset 0 1px 2px rgba(255,255,255,0.4)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <c.Icon size={38} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: "0 0 2px", fontFamily: F, fontSize: 14.5, fontWeight: 800, color: "#1E1B3A", lineHeight: 1.25 }}>
                  {c.title}
                </p>
                <p style={{ margin: 0, fontFamily: F, fontSize: 11.5, fontWeight: 800,  }}>

                </p>
              </div>
            </motion.div>
          ))}
        </div>
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
            width: "100%", height: 58, borderRadius: 29,
            background: "linear-gradient(180deg, #9D6FE8 0%, #7C3AED 100%)",
            border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            fontFamily: F, fontSize: 19, fontWeight: 900, color: "#fff",
            boxShadow: "0 5px 0 #5B21B6, 0 8px 22px rgba(109,40,217,0.50)",
            touchAction: "manipulation",
          }}
        >
          Keep Discovering
          <motion.span aria-hidden animate={{ x: [0, 5, 0] }} transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}>
            &rarr;
          </motion.span>
        </motion.button>
      </motion.div>
    </div>
  );
}
