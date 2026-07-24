"use client";

import { useState, useEffect, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bobo } from "../Mascot";
import { NightRoomBackdrop } from "./WhoAreYou";

const F = "var(--font-nunito), system-ui, sans-serif";

const LINE1 = "Hi, I'm Fumi.";
const LINE2 = "I'll be your child's pet companion.";
const FUMI_START = "Hi, I'm ".length;
const FUMI_END = FUMI_START + "Fumi".length;

function HeartIcon({ size = 22 }: { size?: number }) {
  const id = useId().replace(/:/g, "_");
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id={`${id}-h`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFDF8" />
          <stop offset="100%" stopColor="#E8E3D8" />
        </linearGradient>
      </defs>
      <path d="M12 20.5s-8-4.9-8-11A4.8 4.8 0 0 1 12 6.2 4.8 4.8 0 0 1 20 9.5c0 6.1-8 11-8 11Z" fill={`url(#${id}-h)`} />
      <ellipse cx="9.5" cy="9.5" rx="2.6" ry="1.6" fill="#fff" opacity="0.45" />
    </svg>
  );
}

function StarIcon({ size = 22 }: { size?: number }) {
  const id = useId().replace(/:/g, "_");
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id={`${id}-s`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFDF8" />
          <stop offset="100%" stopColor="#E8E3D8" />
        </linearGradient>
      </defs>
      <path d="M12 2.5 15 9l7 1-5 5 1.3 7-6.3-3.4L5.7 22 7 15 2 10l7-1Z" fill={`url(#${id}-s)`} />
      <ellipse cx="10" cy="9" rx="2.2" ry="1.4" fill="#fff" opacity="0.4" />
    </svg>
  );
}

function SproutIcon({ size = 22 }: { size?: number }) {
  const id = useId().replace(/:/g, "_");
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id={`${id}-sp`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFDF8" />
          <stop offset="100%" stopColor="#E8E3D8" />
        </linearGradient>
      </defs>
      <path d="M12 20V12" stroke="#F0EBDF" strokeWidth="2.2" strokeLinecap="round" />
      <rect x="9" y="20" width="6" height="2" rx="1" fill={`url(#${id}-sp)`} />
      <path d="M12 13C12 8.5 8.5 6.5 5 6.5c0 3.8 1.8 7.3 7 7.3Z" fill={`url(#${id}-sp)`} />
      <path d="M12 12.5c0-4 3-6 6.5-6 .2 3.5-1.4 7-6.5 7Z" fill={`url(#${id}-sp)`} opacity="0.9" />
      <ellipse cx="8.5" cy="9" rx="1.4" ry="0.9" fill="#fff" opacity="0.4" />
    </svg>
  );
}

const LAVENDER = "#BCA8F2";

const CARDS: { iconColor: string; iconBg: string; Icon: (p: { size?: number }) => React.ReactElement; text: React.ReactNode }[] = [
  {
    iconColor: "#F472B6", iconBg: "linear-gradient(160deg, #F472B6 0%, #BE185D 100%)", Icon: HeartIcon,
    text: <>Children naturally care for the things they love.<br /><span style={{ color: "#F472B6" }}>That&apos;s why I&apos;m here.</span></>,
  },
  {
    iconColor: "#A78BFA", iconBg: "linear-gradient(160deg, #A78BFA 0%, #6D28D9 100%)", Icon: StarIcon,
    text: <>Through caring for me, they&apos;ll build attention, confidence, responsibility, and life skills—<br /><span style={{ color: LAVENDER }}>one skill at a time.</span></>,
  },
  {
    iconColor: "#34D399", iconBg: "linear-gradient(160deg, #34D399 0%, #0D9463 100%)", Icon: SproutIcon,
    text: <>When I grow,<br /><span style={{ color: "#34D399", fontWeight: 800 }}>your child grows too.</span></>,
  },
];

export function BugsyIntro({
  tint,
  onNext,
  onBack,
}: {
  tint: number;
  onNext: () => void;
  onBack: () => void;
}) {
  const [catVisible,  setCatVisible ] = useState(false);
  const [typedLine1,  setTypedLine1 ] = useState("");
  const [typedLine2,  setTypedLine2 ] = useState("");
  const [shiftUp,     setShiftUp    ] = useState(false);
  const [cardCount,   setCardCount  ] = useState(0);
  const [showButton,  setShowButton ] = useState(false);

  useEffect(() => {
    const ts: ReturnType<typeof setTimeout>[] = [];

    ts.push(setTimeout(() => setCatVisible(true), 200));

    const l1Start = 900;
    LINE1.split("").forEach((_, i) =>
      ts.push(setTimeout(() => setTypedLine1(LINE1.slice(0, i + 1)), l1Start + i * 50))
    );

    const l2Start = l1Start + LINE1.length * 50 + 380;
    LINE2.split("").forEach((_, i) =>
      ts.push(setTimeout(() => setTypedLine2(LINE2.slice(0, i + 1)), l2Start + i * 35))
    );

    const l2Done = l2Start + LINE2.length * 35;

    // Shift the cat + bubble up a little, then reveal the 3 promise
    // cards one by one, then the CTA.
    ts.push(setTimeout(() => setShiftUp(true), l2Done + 400));
    const cardsStart = l2Done + 400 + 450;
    ts.push(setTimeout(() => setCardCount(1), cardsStart));
    ts.push(setTimeout(() => setCardCount(2), cardsStart + 500));
    ts.push(setTimeout(() => setCardCount(3), cardsStart + 1000));

    ts.push(setTimeout(() => setShowButton(true), cardsStart + 1000 + 550));

    return () => ts.forEach(clearTimeout);
  }, []);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <NightRoomBackdrop minimal hideRug hideFloor />

      {/* Back button */}
      <button
        onClick={onBack}
        style={{
          position: "absolute", top: 52, left: 16, zIndex: 20,
          width: 46, height: 46, borderRadius: 14,
          background: "rgba(59,31,140,0.82)", border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", fontSize: 22, fontWeight: 700,
          boxShadow: "0 2px 10px rgba(0,0,0,0.28)",
        }}
      >‹</button>

      {/* ── Bubble + cat shift up a little once the cards start showing ── */}
      <motion.div
        animate={{ y: shiftUp ? -90 : 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ position: "absolute", inset: 0 }}
      >

      {/* ── Speech bubble — anchored just above the cat ── */}
      {/* bottom: 50% screen + half cat height (107) + gap (16) = grows upward as text appears */}
      <div style={{
        position: "absolute",
        bottom: "calc(50% + 123px)",
        left: 0, right: 0,
        display: "flex", justifyContent: "center",
        zIndex: 8,
      }}>
        <AnimatePresence>
          {typedLine1.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.72 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 26 }}
              style={{
                background: "#fff",
                borderRadius: 18,
                padding: "16px 22px 20px",
                boxShadow: "0 6px 28px rgba(0,0,0,0.22)",
                maxWidth: "calc(100vw - 64px)",
                position: "relative",
                textAlign: "center",
              }}
            >
              {/* Line 1: types out, "Fumi" in purple */}
              <p style={{
                fontFamily: F, fontSize: 20, fontWeight: 800,
                color: "#1a0f40", margin: 0,
                lineHeight: 1.3, maxWidth: "100%",
              }}>
                {typedLine1.slice(0, FUMI_START)}
                {typedLine1.length > FUMI_START && (
                  <span style={{ color: "#7C3AED" }}>
                    {typedLine1.slice(FUMI_START, Math.min(typedLine1.length, FUMI_END))}
                  </span>
                )}
                {typedLine1.length > FUMI_END && typedLine1.slice(FUMI_END)}
              </p>

              {/* Line 2: fades in then types */}
              {typedLine2.length > 0 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.22 }}
                  style={{
                    fontFamily: F, fontSize: 16, fontWeight: 600,
                    color: "rgba(26,15,64,0.82)",
                    margin: "10px 0 0", lineHeight: 1.65,
                    maxWidth: "100%",
                  }}
                >
                  {typedLine2}
                </motion.p>
              )}

              {/* Bubble tail pointing down at Fumi */}
              <div style={{
                position: "absolute", bottom: -12, left: "50%", marginLeft: -12,
                width: 0, height: 0,
                borderLeft: "12px solid transparent",
                borderRight: "12px solid transparent",
                borderTop: "12px solid #fff",
              }} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Fumi cat — vertically centered on screen ── */}
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 5, pointerEvents: "none",
      }}>
        <AnimatePresence>
          {catVisible && (
            <motion.div
              initial={{ y: 60, opacity: 0, scale: 0.65 }}
              animate={{ y: 0,  opacity: 1, scale: 1    }}
              transition={{ type: "spring", stiffness: 200, damping: 18 }}
            >
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut", delay: 1.0 }}
              >
                <Bobo mood="waving" tint={tint} size={215} animate />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      </motion.div>

      {/* ── Promise cards — reveal one by one, close under the shifted cat ── */}
      <div style={{
        position: "absolute", left: 20, right: 20, bottom: 210, zIndex: 6,
        display: "flex", flexDirection: "column", gap: 10,
      }}>
        <AnimatePresence>
          {CARDS.slice(0, cardCount).map((c) => (
            <motion.div
              key={c.iconColor}
              initial={{ opacity: 0, y: 22, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              style={{
                position: "relative", overflow: "hidden",
                display: "flex", alignItems: "center", gap: 14,
                background: "linear-gradient(155deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 35%, rgba(0,0,0,0.16) 100%), rgba(35,24,68,0.6)",
                border: "1.5px solid rgba(139,110,255,0.22)",
                borderRadius: 20, padding: "14px 16px",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.10), inset 0 -6px 12px rgba(0,0,0,0.18), 0 6px 16px rgba(0,0,0,0.32)",
              }}
            >
              <div style={{
                position: "relative",
                flexShrink: 0, width: 52, height: 52, borderRadius: "50%",
                background: c.iconBg,
                boxShadow: `0 0 16px ${c.iconColor}77, inset 0 1px 2px rgba(255,255,255,0.25)`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <span aria-hidden style={{ position: "absolute", top: 2, left: 4, fontSize: 10, color: "#fff", opacity: 0.9 }}>✦</span>
                <span aria-hidden style={{ position: "absolute", bottom: 2, right: 4, fontSize: 8, color: "#fff", opacity: 0.7 }}>✦</span>
                <c.Icon size={26} />
              </div>
              <p style={{ flex: 1, margin: 0, fontFamily: F, fontSize: 14, fontWeight: 600, color: "#fff", lineHeight: 1.4 }}>
                {c.text}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* ── Continue button — glows when it appears ── */}
      <AnimatePresence>
        {showButton && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            onClick={onNext}
            style={{
              position: "absolute", bottom: 38, left: 20, right: 20, zIndex: 20,
              height: 62, borderRadius: 31,
              background: "linear-gradient(180deg, #9D6FE8 0%, #7C3AED 100%)",
              border: "none", cursor: "pointer",
              fontFamily: F, fontSize: 20, fontWeight: 900, color: "#fff",
              boxShadow: "0 6px 0 #5B21B6, 0 10px 28px rgba(109,40,217,0.50)",
              touchAction: "manipulation",
            }}
          >
            Continue →
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
