"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { NightRoomBackdrop } from "./WhoAreYou";

const F = "var(--font-nunito), system-ui, sans-serif";
const GOLD = "#FBBF24";

const LINE1 = "Imagine if";
const LINE2 = "10 minutes a day";
const LINE3 = "helped your child have…";

const CHAR_MS = 55;          // per-letter typing speed — kept slow and readable
const LINE_GAP_MS = 300;     // pause between heading lines
const PRE_CARDS_PAUSE_MS = 500;
const CARD_STAGGER_MS = 260;
const PRE_CTA_PAUSE_MS = 900;

function BrainIcon({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <path d="M20 8c-4.4 0-8 3.6-8 8 0 .7.1 1.3.2 2C9.9 19 8 21.6 8 24.7c0 3 1.7 5.5 4.2 6.8-.1.5-.2 1-.2 1.5 0 3.9 3.1 7 7 7h1V8h-1Z"
        fill="rgba(255,255,255,0.92)" opacity="0.95" />
      <path d="M28 8c4.4 0 8 3.6 8 8 0 .7-.1 1.3-.2 2 2.3 1 4.2 3.6 4.2 6.7 0 3-1.7 5.5-4.2 6.8.1.5.2 1 .2 1.5 0 3.9-3.1 7-7 7h-1V8h1Z"
        fill="rgba(255,255,255,0.7)" />
      <circle cx="15" cy="16" r="1.6" fill="#D08A2E" opacity="0.7" />
      <circle cx="13" cy="24" r="1.4" fill="#D08A2E" opacity="0.7" />
      <circle cx="18" cy="30" r="1.4" fill="#D08A2E" opacity="0.7" />
      <circle cx="33" cy="16" r="1.6" fill="#C77A28" opacity="0.55" />
      <circle cx="35" cy="24" r="1.4" fill="#C77A28" opacity="0.55" />
      <circle cx="30" cy="30" r="1.4" fill="#C77A28" opacity="0.55" />
    </svg>
  );
}

function HeartIconGlyph({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <path d="M24 41s-15-9.4-15-20.2C9 14.4 13.4 10 19 10c2.6 0 5 1 6.8 2.9L24 15l-1.8-2.1C24 11 26.4 10 29 10c5.6 0 10 4.4 10 10.8C39 31.6 24 41 24 41Z"
        fill="rgba(255,255,255,0.94)" />
      <path d="M24 15c1.8-1.9 4.2-2.9 6.8-2.9C36.4 12.1 40.8 16.5 40.8 22.3c0 10.8-15 20.2-15 20.2"
        fill="rgba(255,255,255,0.28)" />
    </svg>
  );
}

function LeafIcon({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <path d="M38 10C22 10 10 22 10 38c16 0 28-12 28-28Z" fill="rgba(255,255,255,0.94)" />
      <path d="M38 10c-8 8-12 18-28 28" stroke="rgba(150,120,20,0.5)" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function SmileyIconGlyph({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="16" fill="rgba(255,255,255,0.94)" />
      <circle cx="18" cy="21" r="2.2" fill="#C77A28" />
      <circle cx="30" cy="21" r="2.2" fill="#C77A28" />
      <path d="M16 28c2 3.5 5 5.5 8 5.5s6-2 8-5.5" stroke="#C77A28" strokeWidth="2.4" strokeLinecap="round" fill="none" />
    </svg>
  );
}

const CARDS = [
  { label: "Better Focus", gradient: "linear-gradient(160deg, #F3B45C 0%, #E2903A 100%)", Icon: BrainIcon },
  { label: "Less Frustration", gradient: "linear-gradient(160deg, #EC7B8A 0%, #D8495B 100%)", Icon: HeartIconGlyph },
  { label: "Independent Routines", gradient: "linear-gradient(160deg, #6FBB61 0%, #4C9142 100%)", Icon: LeafIcon },
  { label: "Fewer Reminders", gradient: "linear-gradient(160deg, #F0A840 0%, #DC8730 100%)", Icon: SmileyIconGlyph },
];

export function ImagineFocusScreen({ onNext }: { onNext: () => void }) {
  const [typedLine1, setTypedLine1] = useState("");
  const [typedLine2, setTypedLine2] = useState("");
  const [typedLine3, setTypedLine3] = useState("");
  const [showCards, setShowCards] = useState(false);
  const [showCTA, setShowCTA] = useState(false);

  useEffect(() => {
    const ts: ReturnType<typeof setTimeout>[] = [];
    let cursor = 400;

    LINE1.split("").forEach((_, i) =>
      ts.push(setTimeout(() => setTypedLine1(LINE1.slice(0, i + 1)), cursor + i * CHAR_MS))
    );
    cursor += LINE1.length * CHAR_MS + LINE_GAP_MS;

    LINE2.split("").forEach((_, i) =>
      ts.push(setTimeout(() => setTypedLine2(LINE2.slice(0, i + 1)), cursor + i * CHAR_MS))
    );
    cursor += LINE2.length * CHAR_MS + LINE_GAP_MS;

    LINE3.split("").forEach((_, i) =>
      ts.push(setTimeout(() => setTypedLine3(LINE3.slice(0, i + 1)), cursor + i * CHAR_MS))
    );
    cursor += LINE3.length * CHAR_MS;

    cursor += PRE_CARDS_PAUSE_MS;
    ts.push(setTimeout(() => setShowCards(true), cursor));

    cursor += (CARDS.length - 1) * CARD_STAGGER_MS + PRE_CTA_PAUSE_MS;
    ts.push(setTimeout(() => setShowCTA(true), cursor));

    return () => ts.forEach(clearTimeout);
  }, []);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <NightRoomBackdrop minimal hideRug hideFloor />

      {/* ── content ── */}
      <div style={{
        flex: 1, minHeight: 0, overflowY: "auto", position: "relative", zIndex: 4,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: "110px 24px 20px",
      }}>
        <p style={{
          fontFamily: F, fontSize: 27, fontWeight: 800, color: "#fff",
          textAlign: "center", margin: 0, lineHeight: 1.3, minHeight: "1.3em",
        }}>
          {typedLine1}
        </p>
        <p style={{
          fontFamily: F, fontSize: 27, fontWeight: 900, color: GOLD,
          textAlign: "center", margin: 0, lineHeight: 1.3, minHeight: "1.3em",
        }}>
          {typedLine2}
        </p>
        <p style={{
          fontFamily: F, fontSize: 27, fontWeight: 800, color: "#fff",
          textAlign: "center", margin: "0 0 26px", lineHeight: 1.3, minHeight: "1.3em",
        }}>
          {typedLine3}
        </p>

        <div style={{
          width: "100%", maxWidth: 340,
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14,
        }}>
          {CARDS.map((c, i) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, scale: 0.5, y: 26 }}
              animate={showCards ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.5, y: 26 }}
              transition={{ type: "spring", stiffness: 240, damping: 20, delay: (i * CARD_STAGGER_MS) / 1000 }}
              style={{
              position: "relative", overflow: "hidden",
              aspectRatio: "1 / 0.92",
              borderRadius: 22, background: c.gradient,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10,
              boxShadow: `
                0 14px 26px rgba(0,0,0,0.38),
                0 3px 0 rgba(0,0,0,0.18),
                inset 0 1.5px 0 rgba(255,255,255,0.55),
                inset 0 -10px 16px rgba(0,0,0,0.16)
              `,
              padding: "12px 10px",
            }}>
              {/* glossy diagonal sheen */}
              <div style={{
                position: "absolute", top: "-30%", left: "-20%", width: "140%", height: "65%",
                background: "linear-gradient(160deg, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0) 70%)",
                transform: "rotate(-8deg)", pointerEvents: "none",
              }} />
              <div style={{
                flexShrink: 0, width: 62, height: 62, borderRadius: "50%",
                background: "rgba(255,255,255,0.14)",
                boxShadow: "inset 0 2px 4px rgba(255,255,255,0.35), inset 0 -3px 6px rgba(0,0,0,0.18)",
                display: "flex", alignItems: "center", justifyContent: "center",
                position: "relative", zIndex: 1,
              }}>
                <c.Icon size={40} />
              </div>
              <p style={{
                margin: 0, fontFamily: F, fontSize: 16, fontWeight: 800, color: "#fff",
                textAlign: "center", lineHeight: 1.25, position: "relative", zIndex: 1,
                textShadow: "0 1px 3px rgba(0,0,0,0.25)",
              }}>
                {c.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── CTA ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={showCTA ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{
          flexShrink: 0, padding: "12px 16px 32px", zIndex: 7, position: "relative",
          pointerEvents: showCTA ? "auto" : "none",
        }}
      >
        <motion.button
          onClick={onNext}
          animate={{ scale: [1, 1.035, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          whileTap={{ scale: 0.95 }}
          style={{
            width: "100%", height: 60,
            borderRadius: 30,
            background: "linear-gradient(180deg, #9D6FE8 0%, #7C3AED 100%)",
            border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            fontFamily: F, fontSize: 19, fontWeight: 900, color: "#fff",
            boxShadow: "0 6px 0 #5B21B6, 0 10px 28px rgba(109,40,217,0.50)",
            touchAction: "manipulation",
          }}
        >
          Meet Fumi
          <motion.span
            aria-hidden
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
          >
            &rarr;
          </motion.span>
        </motion.button>
      </motion.div>
    </div>
  );
}
