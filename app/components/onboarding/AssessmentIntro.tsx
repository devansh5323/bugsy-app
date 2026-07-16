"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bobo } from "../Mascot";
import { NightRoomBackdrop } from "./WhoAreYou";

const F = "var(--font-nunito), system-ui, sans-serif";

function tileGradient(id: string, from: string, to: string) {
  return (
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="0.3" y2="1">
        <stop offset="0%" stopColor={from} />
        <stop offset="100%" stopColor={to} />
      </linearGradient>
    </defs>
  );
}

function ScreenTimeIcon({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64">
      {tileGradient("dt-bg", "#6C7EFF", "#4432C4")}
      <rect width="64" height="64" rx="18" fill="url(#dt-bg)" />
      <rect x="21" y="14" width="20" height="32" rx="4" fill="#241B5C" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" />
      <path d="M25 18 L34 18" stroke="rgba(255,255,255,0.6)" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="46" cy="42" r="10" fill="#fff" />
      <circle cx="46" cy="42" r="7.5" fill="none" stroke="#6C4BD6" strokeWidth="1.4" />
      <path d="M46 37.5V42l3 2.4" stroke="#6C4BD6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function FeelingsIcon({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64">
      {tileGradient("df-bg", "#F1637C", "#B32A49")}
      <rect width="64" height="64" rx="18" fill="url(#df-bg)" />
      <path d="M32 47S16 37 16 25.5C16 19.7 20.5 15 26 15c2.6 0 5 1.2 6 3.2 1-2 3.4-3.2 6-3.2 5.5 0 10 4.7 10 10.5C48 37 32 47 32 47Z" fill="#F98BA0" />
      <circle cx="27" cy="27" r="1.8" fill="#7A1730" />
      <circle cx="37" cy="27" r="1.8" fill="#7A1730" />
      <path d="M26 32c1.6 2 4 3 6 3s4.4-1 6-3" stroke="#7A1730" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function SocialIcon({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64">
      {tileGradient("ds-bg", "#4A3F8C", "#221A4E")}
      <rect width="64" height="64" rx="18" fill="url(#ds-bg)" />
      <path d="M14 24a9 9 0 1 1 6 8.5L15 35l1.3-4.6A9 9 0 0 1 14 24Z" fill="#9B8CE0" />
      <circle cx="19.5" cy="23.5" r="1.4" fill="#2A2266" />
      <circle cx="23.5" cy="23.5" r="1.4" fill="#2A2266" />
      <path d="M20 27c1 .9 2 1.3 3 1.3s2-.4 3-1.3" stroke="#2A2266" strokeWidth="1.3" strokeLinecap="round" fill="none" />
      <path d="M50 30a9 9 0 1 1-6 8.5l-5 1.5 1.3-4.6A9 9 0 0 1 50 30Z" fill="#FBBF24" />
      <circle cx="45.5" cy="29.5" r="1.4" fill="#7A4A05" />
      <circle cx="49.5" cy="29.5" r="1.4" fill="#7A4A05" />
      <path d="M46 33c1 .9 2 1.3 3 1.3s2-.4 3-1.3" stroke="#7A4A05" strokeWidth="1.3" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function FriendsIcon({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64">
      {tileGradient("dr-bg", "#3FAE6B", "#1C6B3E")}
      <rect width="64" height="64" rx="18" fill="url(#dr-bg)" />
      <path d="M25 30l3.2 3.2L25 36.4l-3.2-3.2Z" fill="#EF4867" />
      <circle cx="24" cy="30" r="6" fill="#4ADE80" />
      <path d="M14 47c1-6 5-9.5 10-9.5s9 3.5 10 9.5Z" fill="#4ADE80" />
      <circle cx="40" cy="33" r="6" fill="#60A5FA" />
      <path d="M30 47c1-6 5-9.5 10-9.5s9 3.5 10 9.5Z" fill="#60A5FA" />
    </svg>
  );
}

function CommunicateIcon({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64">
      {tileGradient("dc-bg", "#8B5CF6", "#5230A8")}
      <rect width="64" height="64" rx="18" fill="url(#dc-bg)" />
      <path d="M16 27v10h6l12 8V19l-12 8Z" fill="#fff" />
      <rect x="13" y="27" width="4" height="10" rx="1.5" fill="#fff" />
      <path d="M40 24c2.4 2.2 3.8 5 3.8 8s-1.4 5.8-3.8 8" stroke="#7DD3FC" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <path d="M45 19c4 3.6 6.2 8 6.2 13s-2.2 9.4-6.2 13" stroke="#7DD3FC" strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.7" />
    </svg>
  );
}

function RoutinesIcon({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64">
      {tileGradient("dq-bg", "#8B7FE0", "#5647B8")}
      <rect width="64" height="64" rx="18" fill="url(#dq-bg)" />
      <rect x="15" y="18" width="34" height="28" rx="4" fill="#EDE9FE" />
      <rect x="15" y="18" width="34" height="8" rx="4" fill="#C7B8F5" />
      <rect x="21" y="12" width="3" height="9" rx="1.5" fill="#fff" />
      <rect x="40" y="12" width="3" height="9" rx="1.5" fill="#fff" />
      {[0, 1, 2].flatMap((row) =>
        [0, 1, 2].map((col) => (
          <rect key={`${row}-${col}`} x={21 + col * 8} y={31 + row * 6} width="5" height="4" rx="1" fill="#8B7FE0" opacity="0.7" />
        ))
      )}
      <circle cx="47" cy="47" r="9" fill="#22C55E" stroke="#15803D" strokeWidth="1" />
      <path d="M43 47l3 3 5-6" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

export function AssessmentIntro({
  tint,
  onNext,
  onSkip,
  onBack,
}: {
  tint: number;
  onNext: () => void;
  onSkip: () => void;
  onBack?: () => void;
}) {
  // step: 0=nothing, 1=mascot, 2=title, 3=sub, 4=discover line, 5-10=cards 1-6, 11=CTA
  const [step, setStep] = useState(0);

  useEffect(() => {
    const ts = [
      setTimeout(() => setStep(1),  200),
      setTimeout(() => setStep(2),  1100),
      setTimeout(() => setStep(3),  1700),
      setTimeout(() => setStep(4),  2200),
      setTimeout(() => setStep(5),  2600),
      setTimeout(() => setStep(6),  2900),
      setTimeout(() => setStep(7),  3200),
      setTimeout(() => setStep(8),  3500),
      setTimeout(() => setStep(9),  3800),
      setTimeout(() => setStep(10), 4100),
      setTimeout(() => setStep(11), 4700),
    ];
    return () => ts.forEach(clearTimeout);
  }, []);

  const fade = (threshold: number) => ({
    animate: { opacity: step >= threshold ? 1 : 0 },
    transition: { duration: 0.45 },
  });

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column" }}>
      <NightRoomBackdrop minimal hideRug hideFloor />

      {/* Back button */}
      {onBack && (
        <button
          onClick={onBack}
          style={{
            position: "absolute", top: 52, left: 16, zIndex: 40,
            width: 46, height: 46, borderRadius: 14,
            background: "rgba(59,31,140,0.82)", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: 22, fontWeight: 700,
            boxShadow: "0 2px 10px rgba(0,0,0,0.28)",
          }}
        >‹</button>
      )}

      {/* Content — sized to fit one screen, no scroll. Centered vertically so
          any slack space is split evenly instead of collecting in one gap,
          while the minimum top padding still guarantees clearance under the moon. */}
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "flex-start", paddingInline: 22,
        overflowY: "auto", overflowX: "hidden",
        position: "relative", zIndex: 1,
      }}>

        {/* TOP: title + subtitle — always in DOM, fade in */}
        <div style={{
          paddingTop: 118, width: "100%", flexShrink: 0,
          display: "flex", flexDirection: "column", alignItems: "center",
        }}>
          <motion.h1
            {...fade(2)}
            style={{
              fontFamily: F, fontSize: 30, fontWeight: 900, lineHeight: 1.15,
              textAlign: "center", color: "#fff", margin: "0 0 4px",
            }}
          >
            Help me understand
            <br />
            your child&apos;s
            <br />
            <span style={{ color: "#FBBF24" }}>focus profile</span>
          </motion.h1>

          <motion.p
            {...fade(3)}
            style={{
              fontFamily: F, fontSize: 14.5, fontWeight: 500,
              color: "rgba(220,210,255,0.88)",
              textAlign: "center", lineHeight: 1.3, margin: 0,
            }}
          >
            to unlock their first personalized mission.
          </motion.p>
        </div>

        {/* Mascot — in normal flow, between the subtitle and the discover list */}
        {step >= 1 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.72, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
            style={{ flexShrink: 0, marginTop: 8 }}
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 1.0 }}
            >
              <Bobo mood="excited" tint={tint} size={110} animate armsDown />
            </motion.div>
          </motion.div>
        )}

        {/* Absorbs slack on tall screens so the bottom section doesn't dangle with
            a gap above it — shrinks to 0 on short screens instead of forcing overlap. */}
        <div style={{ flexGrow: 1, flexShrink: 1, minHeight: 0, maxHeight: 24 }} />

        {/* BOTTOM SECTION — always in DOM, each fades in at the right step */}
        <div style={{ width: "100%", flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 0 }}>

          <motion.p
            {...fade(4)}
            style={{
              width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              fontFamily: F, fontSize: 13, fontWeight: 700, color: "#fff",
              margin: "0 0 4px", textAlign: "center",
            }}
          >
            <span style={{ fontSize: 13 }}>⭐</span>
            A few quick answers help me discover:
          </motion.p>

          <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%" }}>
            {DISCOVER_ITEMS.map((item, i) => (
              <motion.div key={item.label} {...fade(5 + i)}>
                <DiscoverCard Icon={item.Icon} label={item.label} />
              </motion.div>
            ))}
          </div>

        </div>

      </div>

      {/* CTAs — always in DOM so no layout jump when they appear */}
      <motion.div
        {...fade(11)}
        style={{
          position: "relative", zIndex: 2,
          padding: "8px 22px 20px",
          display: "flex", flexDirection: "column", gap: 8,
        }}
      >
        <motion.button
          onClick={onNext}
          animate={{ scale: [1, 1.035, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          whileTap={{ scale: 0.95 }}
          style={{
            width: "100%", height: 50, borderRadius: 25,
            background: "linear-gradient(180deg, #9D6FE8 0%, #7C3AED 100%)",
            border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: F, fontSize: 17, fontWeight: 900, color: "#fff",
            boxShadow: "0 5px 0 #5B21B6, 0 8px 22px rgba(109,40,217,0.50)",
            touchAction: "manipulation",
          }}
        >
          Start Assessment
          <motion.span
            aria-hidden
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
            style={{ marginLeft: 8 }}
          >
            &rarr;
          </motion.span>
        </motion.button>

        <button
          onClick={onSkip}
          style={{
            width: "100%", height: 42, borderRadius: 21,
            background: "transparent",
            border: "2px solid rgba(124,58,237,0.50)",
            cursor: "pointer",
            fontFamily: F, fontSize: 14.5, fontWeight: 700, color: "#A78BFA",
            touchAction: "manipulation",
          }}
        >
          Skip for now
        </button>
      </motion.div>
    </div>
  );
}

const DISCOVER_ITEMS = [
  { Icon: ScreenTimeIcon, label: "How they manage screen time." },
  { Icon: FeelingsIcon, label: "How they express feelings." },
  { Icon: SocialIcon, label: "How they handle social interactions." },
  { Icon: FriendsIcon, label: "How they maintain friends." },
  { Icon: CommunicateIcon, label: "How they communicates with others." },
  { Icon: RoutinesIcon, label: "What their everyday routines look like." },
];

function DiscoverCard({ Icon, label }: { Icon: (p: { size?: number }) => React.ReactElement; label: string }) {
  return (
    <div style={{
      background: "rgba(12,5,42,0.88)", borderRadius: 15,
      border: "1.5px solid rgba(124,58,237,0.35)",
      padding: "7px 13px", display: "flex", flexDirection: "row",
      alignItems: "center", gap: 12,
      boxShadow: "0 4px 20px rgba(0,0,0,0.35)",
    }}>
      <Icon size={44} />
      <p style={{
        margin: 0, fontFamily: F, fontSize: 14, fontWeight: 500,
        color: "rgba(220,210,255,0.92)", lineHeight: 1.28,
      }}>{label}</p>
    </div>
  );
}
