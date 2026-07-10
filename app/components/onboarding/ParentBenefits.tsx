"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import { Bobo } from "../Mascot";
import { NightRoomBackdrop } from "./WhoAreYou";

const F = "var(--font-nunito), system-ui, sans-serif";

type BuildItem = {
  Icon: (props: { size?: number }) => React.ReactElement;
  iconBg: string;
  iconGlow: string;
  title: string;
  desc: string;
};

// Glossy gradient-shaded star — reads crisply at small sizes regardless
// of the platform's emoji font, unlike a plain text "⭐".
function StarGlyph({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 34 34" style={{ display: "block" }}>
      <defs>
        <linearGradient id="pbStarFill" x1="0.25" y1="0" x2="0.75" y2="1">
          <stop offset="0%" stopColor="#FFF3B0" />
          <stop offset="45%" stopColor="#FFC940" />
          <stop offset="100%" stopColor="#E8880E" />
        </linearGradient>
      </defs>
      <path
        d="M17,1 L20.8,11.5 L32,11.9 L23.1,18.9 L26.2,29.6 L17,23.2 L7.8,29.6 L10.9,18.9 L2,11.9 L13.2,11.5 Z"
        fill="url(#pbStarFill)" stroke="#B85E00" strokeWidth="0.6" strokeLinejoin="round"
      />
      <ellipse cx="12" cy="9" rx="4.3" ry="2.4" fill="#fff" opacity="0.55" transform="rotate(-18 12 9)" />
    </svg>
  );
}

// Glossy gradient-shaded heart.
function HeartGlyph({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 34 34" style={{ display: "block" }}>
      <defs>
        <linearGradient id="pbHeartFill" x1="0.3" y1="0" x2="0.7" y2="1">
          <stop offset="0%" stopColor="#FF9AAE" />
          <stop offset="45%" stopColor="#FB4D6A" />
          <stop offset="100%" stopColor="#C4123F" />
        </linearGradient>
      </defs>
      <path
        d="M17 30 C17 30 3 21 3 11.5 C3 6 7 3 11 3 C14 3 16.3 4.8 17 7 C17.7 4.8 20 3 23 3 C27 3 31 6 31 11.5 C31 21 17 30 17 30 Z"
        fill="url(#pbHeartFill)"
      />
      <ellipse cx="10.3" cy="9" rx="4" ry="2.4" fill="#fff" opacity="0.5" transform="rotate(-25 10.3 9)" />
    </svg>
  );
}

// Glossy gradient-shaded sprout.
function SproutGlyph({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 34 34" style={{ display: "block" }}>
      <defs>
        <linearGradient id="pbSproutFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8CE87A" />
          <stop offset="100%" stopColor="#2F9E44" />
        </linearGradient>
      </defs>
      <path d="M17 31 V17" stroke="#4C8C2E" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M17 19 C17 12 10 11 6 12 C6 19 12 21 17 19 Z" fill="url(#pbSproutFill)" />
      <path d="M17 15 C17 9 24 8 28 9 C28 16 21 18 17 15 Z" fill="url(#pbSproutFill)" />
      <ellipse cx="10" cy="14" rx="2.2" ry="1.1" fill="#fff" opacity="0.4" transform="rotate(-30 10 14)" />
    </svg>
  );
}

// A single "what we'll build together" item — its own rounded card with
// a glowing icon badge, a vertical divider, title + description, and a
// trailing chevron.
function BuildRow({ item }: { item: BuildItem }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 16,
      background: "rgba(20,14,44,0.7)",
      border: "1.5px solid rgba(124,58,237,0.4)",
      borderRadius: 20, padding: "16px 16px",
      boxShadow: "0 4px 18px rgba(0,0,0,0.25)",
    }}>
      <div style={{
        position: "relative", flexShrink: 0, width: 64, height: 64, borderRadius: "50%",
        background: item.iconBg,
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: `0 0 22px 4px ${item.iconGlow}`, overflow: "hidden",
      }}>
        <item.Icon size={34} />
      </div>
      <div style={{ width: 1, alignSelf: "stretch", background: "rgba(167,139,250,0.3)" }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontFamily: F, fontSize: 18, fontWeight: 800, color: "#fff", margin: 0, lineHeight: 1.25 }}>
          {item.title}
        </p>
        <p style={{ fontFamily: F, fontSize: 13.5, fontWeight: 500, color: "#fff", margin: "3px 0 0", lineHeight: 1.35 }}>
          {item.desc}
        </p>
      </div>
      <span style={{ flexShrink: 0, fontSize: 22, fontWeight: 900, color: "rgba(167,139,250,0.75)" }}>›</span>
    </div>
  );
}

const THUMB = 62;
const TRACK_PAD = 8;

// A single-color paw print — one main pad plus four toes, matching the
// clean vector icon used inside the slide-to-begin thumb.
function PawIcon({ size = 30, color = "#6D28D9" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" style={{ display: "block" }}>
      <ellipse cx="22" cy="29" rx="13" ry="10.5" fill={color} />
      <ellipse cx="9" cy="16" rx="5.4" ry="7" fill={color} transform="rotate(-18 9 16)" />
      <ellipse cx="20" cy="9" rx="5.2" ry="7" fill={color} />
      <ellipse cx="31.5" cy="10.5" rx="5.2" ry="7" fill={color} transform="rotate(14 31.5 10.5)" />
      <ellipse cx="37.5" cy="20" rx="4.6" ry="6.2" fill={color} transform="rotate(34 37.5 20)" />
    </svg>
  );
}

export function ParentBenefits({
  tint, onNext, onBack,
}: {
  tint: number; onNext: () => void; onBack?: () => void;
}) {
  const BUBBLE_TEXT = useMemo(
    () => "Here's my promise to you and your child",
    []
  );

  const BUILD_ITEMS: BuildItem[] = [
    {
      Icon: StarGlyph,
      iconBg: "rgba(251,191,36,0.22)", iconGlow: "rgba(251,191,36,0.5)",
      title: "Better Focus", desc: "Helps your child grow Attention by 2x",
    },
    {
      Icon: HeartGlyph,
      iconBg: "rgba(216,70,239,0.22)", iconGlow: "rgba(216,70,239,0.5)",
      title: "Confidence", desc: "Helps your child feel braver every day.",
    },
    {
      Icon: SproutGlyph,
      iconBg: "rgba(74,222,128,0.22)", iconGlow: "rgba(74,222,128,0.5)",
      title: "Healthy Habits", desc: "Helps your child build positive habits that last.",
    },
  ];

  const [catVisible,    setCatVisible]    = useState(false);
  const [typedText,     setTypedText]     = useState("");
  const [revealStep,    setRevealStep]    = useState(0);
  const [itemsShown,    setItemsShown]    = useState(0);
  const [promised,      setPromised]      = useState(false);
  const [glowing,       setGlowing]       = useState(false);

  const trackRef = useRef<HTMLDivElement>(null);
  const dragX = useMotionValue(0);
  const fillWidth = useTransform(dragX, (x) => x + THUMB);

  useEffect(() => {
    const ts: ReturnType<typeof setTimeout>[] = [];
    ts.push(setTimeout(() => setCatVisible(true), 200));
    const tS = 700;
    BUBBLE_TEXT.split("").forEach((_, i) =>
      ts.push(setTimeout(() => setTypedText(BUBBLE_TEXT.slice(0, i + 1)), tS + i * 34))
    );
    const after = tS + BUBBLE_TEXT.length * 34 + 400;

    // Cascade: "What we'll build together" header, then the 3 tabs one
    // by one at an unhurried pace, then the trust note, then the
    // slide-to-begin bar.
    const ITEM_START_GAP = 400;
    const ITEM_STAGGER = 550;
    const headerAt = after + 200;
    const itemsStart = headerAt + ITEM_START_GAP;
    ts.push(setTimeout(() => setRevealStep(1), headerAt));
    BUILD_ITEMS.forEach((_, i) =>
      ts.push(setTimeout(() => setItemsShown(i + 1), itemsStart + i * ITEM_STAGGER))
    );
    const lastItemAt = itemsStart + (BUILD_ITEMS.length - 1) * ITEM_STAGGER;
    ts.push(setTimeout(() => setRevealStep(2), lastItemAt + 700));
    ts.push(setTimeout(() => setRevealStep(3), lastItemAt + 1100));

    return () => ts.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [BUBBLE_TEXT]);

  const handleDragEnd = () => {
    if (!trackRef.current) return;
    const max = trackRef.current.offsetWidth - THUMB - TRACK_PAD * 2;
    const pct = max > 0 ? (dragX.get() / max) * 100 : 0;
    if (pct >= 85) {
      animate(dragX, max, { type: "spring", stiffness: 300, damping: 30 });
      setPromised(true);
      setTimeout(() => setGlowing(true), 120);
      setTimeout(() => onNext(), 900);
    } else {
      animate(dragX, 0, { type: "spring", stiffness: 300, damping: 26 });
    }
  };

  const renderBubble = () => {
    const marker = "10 minutes";
    const idx = typedText.indexOf(marker);
    if (idx === -1) return <>{typedText}</>;
    return (
      <>
        {typedText.slice(0, idx)}
        <span style={{ color: "#7C3AED", fontWeight: 900 }}>{marker}</span>
        {typedText.slice(idx + marker.length)}
      </>
    );
  };

  const slideUp = {
    initial:    { opacity: 0, y: 20 },
    animate:    { opacity: 1, y: 0 },
    transition: { type: "spring" as const, stiffness: 230, damping: 26 },
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

      {/* Cat + bubble — vertically centered against each other so the
          bubble's tail always points at the cat regardless of its size. */}
      <div style={{
        position: "relative", zIndex: 5, flexShrink: 0,
        display: "flex", alignItems: "center",
        padding: "106px 14px 0 0", minHeight: 160,
      }}>
        <AnimatePresence>
          {catVisible && (
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 160, damping: 20 }}
              style={{ flexShrink: 0, zIndex: 2 }}
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
              >
                <Bobo mood="excited" tint={tint} size={125} animate tailWag />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {typedText.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              style={{
                flex: 1, background: "#fff", borderRadius: 20,
                padding: "12px 36px 12px 14px",
                boxShadow: "0 6px 30px rgba(0,0,0,0.25)",
                position: "relative", marginRight: 12,
              }}
            >
              <div style={{ position: "absolute", left: -12, top: "50%", marginTop: -10, width: 0, height: 0, borderTop: "10px solid transparent", borderBottom: "10px solid transparent", borderRight: "12px solid #fff" }} />
              <p style={{ fontFamily: F, fontSize: 14.5, fontWeight: 800, color: "#1a0f40", margin: 0, lineHeight: 1.38 }}>
                {renderBubble()}
              </p>
              <span style={{ position: "absolute", top: 12, right: 14, color: "#C4B5FD", fontSize: 19 }}>✦</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Scrollable content */}
      <div style={{ position: "relative", zIndex: 5, flex: 1, minHeight: 0, overflowY: "auto", padding: "40px 14px 8px" }}>

        {/* 1 — "What we'll build together" header, then each tab arrives
            one by one at an unhurried pace */}
        <AnimatePresence>
          {revealStep >= 1 && (
            <motion.div key="build-header" {...slideUp} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 9 }}>
                <span style={{ fontSize: 17 }}>✨</span>
                <span style={{ fontFamily: F, fontSize: 19, fontWeight: 900, color: "#fff" }}>What we&apos;ll build together</span>
                <span style={{ fontSize: 17 }}>✨</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 18 }}>
          {BUILD_ITEMS.map((item, i) => (
            <AnimatePresence key={i}>
              {itemsShown > i && (
                <motion.div
                  initial={{ opacity: 0, y: 24, scale: 0.94 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 210, damping: 24 }}
                >
                  <BuildRow item={item} />
                </motion.div>
              )}
            </AnimatePresence>
          ))}
        </div>

        {/* Trust subtext under the list */}
        <AnimatePresence>
          {revealStep >= 2 && (
            <motion.div key="study-note" {...slideUp} style={{
              display: "flex", justifyContent: "center", marginBottom: 20,
            }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 6,
                background: "rgba(124,58,237,0.14)", border: "1px solid rgba(124,58,237,0.35)",
                borderRadius: 999, padding: "6px 14px",
              }}>
                <span style={{ fontSize: 11 }}>✅</span>
                <p style={{ fontFamily: F, fontSize: 11.5, fontWeight: 600, color: "rgba(220,210,255,0.82)", margin: 0 }}>
                  Based on the internal study of <span style={{ fontWeight: 800, color: "#fff" }}>500 families</span> in 2026
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Pinned footer — slide-to-begin bar always sits at the bottom of
          the screen, independent of how far the content above is scrolled. */}
      <AnimatePresence>
        {revealStep >= 3 && (
          <motion.div
            key="slide-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 230, damping: 26 }}
            style={{ position: "relative", zIndex: 5, flexShrink: 0, padding: "10px 14px 22px" }}
          >
            <p style={{ fontFamily: F, fontSize: 19, fontWeight: 800, color: "#A78BFA", textAlign: "center", margin: "0 0 18px" }}>
              Slide to begin our adventure
            </p>

            <div style={{ position: "relative" }}>
              <motion.span
                aria-hidden
                animate={{ opacity: [0.4, 1, 0.4], scale: [0.9, 1.15, 0.9] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                style={{ position: "absolute", top: -14, right: 6, fontSize: 18, color: "#FBBF24", pointerEvents: "none" }}
              >✨</motion.span>
              <motion.span
                aria-hidden
                animate={{ opacity: [0.4, 1, 0.4], scale: [0.9, 1.15, 0.9] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
                style={{ position: "absolute", bottom: -12, left: 0, fontSize: 14, color: "#A78BFA", pointerEvents: "none" }}
              >✨</motion.span>

              <div
                ref={trackRef}
                style={{
                  position: "relative", height: 78, borderRadius: 999,
                  background: "linear-gradient(90deg, #4C3A9E 0%, #6D3FD6 55%, #8B5CF6 100%)",
                  border: "2px solid #FBBF24",
                  boxShadow: promised
                    ? "0 0 28px rgba(255,215,0,0.9), 0 8px 20px rgba(124,58,237,0.5)"
                    : "0 0 16px rgba(251,191,36,0.55), 0 8px 20px rgba(124,58,237,0.5)",
                  display: "flex", alignItems: "center",
                  padding: `0 ${TRACK_PAD}px`, overflow: "hidden",
                  transition: "box-shadow 0.3s ease",
                }}
              >
                {/* Glossy top highlight — soft sheen along the upper edge */}
                <div style={{
                  position: "absolute", inset: 0, borderRadius: 999,
                  background: "linear-gradient(180deg, rgba(255,255,255,0.20) 0%, rgba(255,255,255,0) 55%)",
                  pointerEvents: "none",
                }} />
                {/* Static glossy track — decorative, always faintly visible */}
                <div style={{
                  position: "absolute", left: 16, right: 16, bottom: 12, height: 14,
                  borderRadius: 999, background: "rgba(255,255,255,0.16)",
                }} />
                {/* Progress fill — trails the thumb as it's dragged */}
                <motion.div style={{
                  position: "absolute", left: 0, top: 0, bottom: 0,
                  width: fillWidth,
                  background: "rgba(255,255,255,0.24)",
                }} />
                {/* Label — sits centered in the track, covered as the thumb slides over it */}
                <div style={{
                  position: "absolute", inset: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  pointerEvents: "none",
                }}>
                  <span style={{
                    fontFamily: F, fontSize: 21, fontWeight: 900, color: "#fff",
                  }}>
                    {promised ? "Promise Made!" : "Slide to Begin"}
                  </span>
                </div>
                {/* Draggable thumb */}
                <motion.div
                  drag={promised ? false : "x"}
                  dragConstraints={trackRef}
                  dragElastic={0}
                  dragMomentum={false}
                  onDragEnd={handleDragEnd}
                  style={{
                    x: dragX,
                    position: "relative", zIndex: 1, flexShrink: 0,
                    width: THUMB, height: THUMB, borderRadius: "50%",
                    background: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
                    cursor: promised ? "default" : "grab", touchAction: "none",
                  }}
                ><PawIcon size={32} /></motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full-screen bloom flash */}
      <AnimatePresence>
        {glowing && (
          <motion.div
            key="bloom"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{ duration: 0.95, times: [0, 0.25, 0.60, 1], ease: "easeOut" }}
            style={{
              position: "absolute", inset: 0, zIndex: 60, pointerEvents: "none",
              background: "radial-gradient(circle at 50% 58%, rgba(255,230,80,1) 0%, rgba(210,100,255,0.92) 30%, rgba(90,25,200,0.80) 60%, rgba(20,8,60,0.70) 100%)",
            }}
          />
        )}
      </AnimatePresence>

      {/* Sparkle burst on promise */}
      <AnimatePresence>
        {promised && (
          <>
            {[...Array(8)].map((_, i) => {
              const angle = (i / 8) * 360;
              const rad = (angle * Math.PI) / 180;
              const dist = 120;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 1, x: 0, y: 0, scale: 0 }}
                  animate={{ opacity: [1, 1, 0], x: Math.cos(rad) * dist, y: Math.sin(rad) * dist, scale: [0, 1.4, 0] }}
                  transition={{ duration: 0.75, ease: "easeOut", delay: i * 0.04 }}
                  style={{ position: "absolute", top: "70%", left: "50%", zIndex: 55, pointerEvents: "none", fontSize: 18 + (i % 3) * 4, color: i % 2 === 0 ? "#FFD700" : "#fff" }}
                >✦</motion.div>
              );
            })}
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
