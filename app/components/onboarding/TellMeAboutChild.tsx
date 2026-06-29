"use client";

import { motion, type Variants } from "framer-motion";
import { Bobo } from "../Mascot";
import { NightRoomBackdrop } from "./WhoAreYou";

/* ─── data ──────────────────────────────────────────────────────── */
const AGE_OPTIONS = Array.from({ length: 12 }, (_, i) => ({
  value: i + 1,
  label: i === 0 ? "1 Year" : `${i + 1} Years`,
}));

const F = "var(--font-nunito), system-ui, sans-serif";

/* ─── design-spec constants (390 × 844 screen) ──────────────────── */
const NB_W      = 344;   // notebook unit width  (design spec)
const NB_H      = 520;   // notebook unit height (design spec)
const NB_T      = 90;    // notebook top offset from screen top
const NB_L      = Math.round((390 - NB_W) / 2); // = 23, centered

const SPIRAL_W  = 28;    // left spiral-binding area
const COVER_W   = 15;    // right purple-cover strip width
// interior card width = NB_W - SPIRAL_W - COVER_W = 301px

const SPIRALS   = 13;
const BADGE     = 42;
const BADGE_GAP = 12;

/* ─── animation variants ────────────────────────────────────────── */
const bookV: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  show:   { opacity: 1, scale: 1, y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};
const headV: Variants = {
  hidden: { opacity: 0, y: -14 },
  show:   { opacity: 1, y: 0,
    transition: { delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};
const avatarV: Variants = {
  hidden: { scale: 0, opacity: 0 },
  show:   { scale: 1, opacity: 1,
    transition: { delay: 0.38, type: "spring", stiffness: 260, damping: 16 } },
};
const inputsV: Variants = {
  hidden: { opacity: 0, y: 14 },
  show:   { opacity: 1, y: 0,
    transition: { delay: 0.5, duration: 0.45, ease: "easeOut" } },
};
const ctaV: Variants = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0,
    transition: { delay: 0.65, duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

/* ─── 3-D ring coil ─────────────────────────────────────────────── */
function Coil({ pct }: { pct: number }) {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        left: SPIRAL_W / 2,
        top: `${pct}%`,
        transform: "translate(-50%, -50%)",
        width: 26, height: 26, borderRadius: "50%",
        background: "#0C052A",
        border: "7px solid #7C3AED",
        boxShadow:
          "0 3px 10px rgba(0,0,0,0.65), " +
          "0 0 0 1.5px rgba(50,5,110,0.50), " +
          "inset 0 2px 4px rgba(200,140,255,0.25)",
        zIndex: 6,
        pointerEvents: "none",
      }}
    />
  );
}

/* ─── screen component ──────────────────────────────────────────── */
export function TellMeAboutChild({
  tint,
  childName,
  setChildName,
  childAge,
  setChildAge,
  onNext,
  onBack,
}: {
  tint: number;
  childName: string;
  setChildName: (n: string) => void;
  childAge: number | null;
  setChildAge: (a: number | null) => void;
  onNext: () => void;
  onBack?: () => void;
}) {
  const name = childName.trim() || "Your Child";
  const poss = childName.trim() ? `${childName.trim()}'s` : "Your Child's";

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <NightRoomBackdrop minimal hideRug />

      {/* ── back ─────────────────────────────────────── */}
      {onBack && (
        <motion.button
          onClick={onBack}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          style={{
            position: "absolute", top: 50, left: 16, zIndex: 10,
            width: 46, height: 46, borderRadius: "50%",
            background: "#5B21B6", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22, color: "#fff",
            boxShadow: "0 4px 18px rgba(0,0,0,0.45)",
            touchAction: "manipulation",
          }}
        >←</motion.button>
      )}

      {/* ── music ────────────────────────────────────── */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92, rotate: 15 }}
        style={{
          position: "absolute", top: 50, right: 16, zIndex: 10,
          width: 46, height: 46, borderRadius: "50%",
          background: "#5B21B6", border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 20,
          boxShadow: "0 4px 18px rgba(0,0,0,0.45)",
          touchAction: "manipulation",
        }}
      >🎵</motion.button>

      {/* ═══════════════════════════════════════════════════════════
          NOTEBOOK UNIT  —  344 × 520, top:90, left:23
          Contains: spiral coils + right cover + interior card
          ═══════════════════════════════════════════════════════════ */}
      <div
        style={{
          position: "absolute",
          top: NB_T, left: NB_L,
          width: NB_W, height: NB_H,
          zIndex: 2,
        }}
      >
        {/* spiral coil rings, distributed 4 %→96 % of notebook height */}
        {Array.from({ length: SPIRALS }, (_, j) => (
          <Coil key={j} pct={(j / (SPIRALS - 1)) * 92 + 4} />
        ))}

        {/* purple right cover strip */}
        <div
          style={{
            position: "absolute", right: 0, top: 0, bottom: 0,
            width: COVER_W,
            background: "linear-gradient(180deg, #8B5CF6 0%, #5B21B6 100%)",
            borderRadius: "0 28px 28px 0",
            boxShadow: "-3px 0 14px rgba(0,0,0,0.35)",
            zIndex: 3,
          }}
        />

        {/* ── INTERIOR CARD ──────────────────────────────────────── */}
        <motion.div
          variants={bookV}
          initial="hidden"
          animate="show"
          style={{
            position: "absolute",
            top: 0, left: SPIRAL_W, right: COVER_W, bottom: 0,
            borderRadius: 28,
            background: "#FFF6EC",
            overflow: "hidden",
            display: "flex", flexDirection: "column",
            boxShadow:
              "0 20px 60px rgba(0,0,0,0.18), " +
              "0 6px 20px rgba(0,0,0,0.14), " +
              "inset 0 0 0 1.5px rgba(255,255,255,0.70)",
          }}
        >

          {/* ── HEADER ─────────────────────────────────────────── */}
          <motion.div
            variants={headV}
            initial="hidden"
            animate="show"
            style={{ padding: "18px 18px 10px 18px", flexShrink: 0 }}
          >
            {/* badge + title row */}
            <div style={{ display: "flex", alignItems: "center", gap: BADGE_GAP, marginBottom: 6 }}>
              <div
                style={{
                  width: BADGE, height: BADGE, borderRadius: "50%",
                  background: "radial-gradient(circle at 38% 32%, #B970FF, #6D28D9 58%)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                  boxShadow:
                    "0 4px 16px rgba(109,40,217,0.70), " +
                    "inset 0 -3px 5px rgba(0,0,0,0.38), " +
                    "inset 0 2px 4px rgba(255,255,255,0.26)",
                }}
              >
                <span style={{ color: "#fff", fontFamily: F, fontWeight: 900, fontSize: 21, lineHeight: 1 }}>5</span>
              </div>
              <h1 style={{ fontFamily: F, fontSize: 26, fontWeight: 900, color: "#1A1040", margin: 0, lineHeight: 1.15, flex: 1 }}>
                Tell Me About {name}
              </h1>
            </div>

            {/* subtitle, indented to match title start */}
            <p style={{ fontFamily: F, fontSize: 13.5, fontWeight: 700, color: "#3B1E7A", margin: `0 0 0 ${BADGE + BADGE_GAP}px`, lineHeight: 1.4 }}>
              Let&apos;s create {poss} story. 💜
            </p>
          </motion.div>

          {/* thin page-divider line */}
          <div
            style={{
              height: 1, flexShrink: 0, marginInline: 18,
              background: "linear-gradient(to right, transparent, rgba(109,40,217,0.18) 25%, rgba(109,40,217,0.18) 75%, transparent)",
            }}
          />

          {/* ── TWO-PAGE CONTENT (flex:1 → fills exact remainder) ── */}
          {/*
            Left:  justifyContent space-between → avatar at top, quote at bottom
            Right: justifyContent flex-start, gap 22 → form groups at top,
                   cream notebook paper visible below (matches reference)
          */}
          <div style={{ display: "flex", flex: 1, minHeight: 0 }}>

            {/* ── LEFT PAGE ── */}
            <div
              style={{
                flex: "0 0 44%",
                padding: "14px 8px 18px 14px",
                display: "flex", flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              {/* avatar — purple gradient circle with white ring */}
              <motion.div
                variants={avatarV}
                initial="hidden"
                animate="show"
                style={{
                  width: 122, height: 122, borderRadius: "50%",
                  background: "linear-gradient(135deg, #5B21B6 0%, #A78BFA 100%)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                  boxShadow:
                    "0 0 0 5px #FFF6EC, " +
                    "0 0 0 11px #FFFFFF, " +
                    "0 10px 30px rgba(109,40,217,0.48)",
                  fontSize: 64, userSelect: "none",
                }}
              >
                👧
              </motion.div>

              {/* quote — left-aligned, pinned to page bottom */}
              <p
                style={{
                  fontFamily: F, fontSize: 12, fontWeight: 600,
                  color: "#2D1A4A", lineHeight: 1.65,
                  margin: 0, width: "100%", textAlign: "left",
                }}
              >
                Every child is unique. I want to know {name} a little better. 💜
              </p>
            </div>

            {/* ── SPINE (open-book crease shadow) ── */}
            <div
              style={{
                width: 12, flexShrink: 0,
                background: "linear-gradient(to right, rgba(0,0,0,0.06), rgba(0,0,0,0.11) 50%, rgba(0,0,0,0.04))",
              }}
            />

            {/* ── RIGHT PAGE ── */}
            <motion.div
              variants={inputsV}
              initial="hidden"
              animate="show"
              style={{
                flex: 1,
                padding: "18px 16px 16px 8px",
                display: "flex", flexDirection: "column",
                justifyContent: "flex-start",
                gap: 22,
              }}
            >
              {/* name group */}
              <div>
                <label style={{ fontFamily: F, fontSize: 13, fontWeight: 800, color: "#252547", display: "block", marginBottom: 8 }}>
                  {poss} Name
                </label>
                <input
                  type="text"
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  placeholder="Enter name"
                  style={{
                    width: "100%", height: 52, borderRadius: 14, border: "none",
                    background: "#FFFFFF", padding: "0 16px",
                    fontSize: 15, fontFamily: F, fontWeight: 700, color: "#252547",
                    outline: "none", boxSizing: "border-box",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.10), 0 1px 3px rgba(0,0,0,0.07)",
                  }}
                />
              </div>

              {/* age group */}
              <div>
                <label style={{ fontFamily: F, fontSize: 13, fontWeight: 800, color: "#252547", display: "block", marginBottom: 8 }}>
                  {poss} Age
                </label>
                <div style={{ position: "relative" }}>
                  <select
                    value={childAge ?? ""}
                    onChange={(e) => setChildAge(e.target.value ? parseInt(e.target.value) : null)}
                    style={{
                      width: "100%", height: 52, borderRadius: 14, border: "none",
                      background: "#FFFFFF", padding: "0 38px 0 16px",
                      fontSize: 15, fontFamily: F, fontWeight: 700,
                      color: childAge ? "#252547" : "#9CA3AF",
                      outline: "none", WebkitAppearance: "none", appearance: "none",
                      cursor: "pointer", boxSizing: "border-box",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.10), 0 1px 3px rgba(0,0,0,0.07)",
                    }}
                  >
                    <option value="">Select age</option>
                    {AGE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <span
                    style={{
                      position: "absolute", right: 14, top: "50%",
                      transform: "translateY(-50%)",
                      color: "#7C3AED", pointerEvents: "none", fontSize: 13, fontWeight: 900,
                    }}
                  >▼</span>
                </div>
              </div>
            </motion.div>

          </div>
          {/* end two-page content */}

        </motion.div>
        {/* end interior card */}

      </div>
      {/* end notebook unit */}

      {/* ═══════════════════════════════════════════════════════════
          FLOOR LAYER
          All elements sit at the same "floor level" y≈682
          Notebook bottom: NB_T + NB_H = 90 + 520 = 610
          Bugsy overlaps notebook by 38px (35% of 108px)
          ═══════════════════════════════════════════════════════════ */}

      {/* rainbow + toy blocks — bottom-left */}
      <div
        style={{
          position: "absolute",
          bottom: 162,
          left: NB_L + 18,
          zIndex: 4,
          display: "flex", alignItems: "flex-end", gap: 5,
        }}
      >
        <span style={{ fontSize: 42, lineHeight: 1, filter: "drop-shadow(0 3px 8px rgba(0,0,0,0.28))" }}>
          🌈
        </span>
        <div style={{ display: "flex", gap: 4, alignItems: "flex-end", marginBottom: 3 }}>
          <div style={{ width: 26, height: 26, borderRadius: 7, background: "#EC4899",
            boxShadow: "0 3px 8px rgba(0,0,0,0.40), inset 0 1px 2px rgba(255,255,255,0.20)" }} />
          <div style={{ width: 30, height: 30, borderRadius: 7, background: "#6D28D9",
            boxShadow: "0 3px 8px rgba(0,0,0,0.40), inset 0 1px 2px rgba(255,255,255,0.20)" }} />
          <div style={{ width: 24, height: 24, borderRadius: 7, background: "#F59E0B",
            boxShadow: "0 3px 8px rgba(0,0,0,0.40), inset 0 1px 2px rgba(255,255,255,0.20)" }} />
        </div>
      </div>

      {/* Bugsy — bottom-right, 35% overlap with notebook bottom */}
      {/*
        Notebook bottom:  y = 90 + 520 = 610
        Bugsy height:     108px
        35% overlap:      108 × 0.35 ≈ 38px  →  Bugsy top = 610 − 38 = 572
        Bugsy bottom:     572 + 108 = 680
        bottom value:     844 − 680 = 164  (use 162 to nudge slightly higher)
      */}
      <motion.div
        animate={{ y: [0, -7, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          bottom: 162,
          right: NB_L + 2,
          zIndex: 5,
          filter: "drop-shadow(0 14px 22px rgba(87,200,255,0.45))",
        }}
      >
        <Bobo mood="waving" tint={tint} size={108} tailWag />
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════
          BOTTOM CHROME  — pagination + CTA
          Pagination bottom: 24 + 60 + 8 = 92
          CTA bottom:        24
          ═══════════════════════════════════════════════════════════ */}

      {/* pagination dots */}
      <div
        style={{
          position: "absolute", bottom: 92, left: 0, right: 0,
          display: "flex", justifyContent: "center", alignItems: "center", gap: 9,
          zIndex: 5,
        }}
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              width: i === 0 ? 14 : 10,
              height: i === 0 ? 14 : 10,
              borderRadius: "50%",
              background: i === 0 ? "#7C3AED" : "rgba(255,255,255,0.55)",
              boxShadow: i === 0 ? "0 0 10px rgba(124,58,237,0.80)" : "0 1px 3px rgba(0,0,0,0.22)",
            }}
          />
        ))}
      </div>

      {/* CTA button */}
      <motion.button
        variants={ctaV}
        initial="hidden"
        animate="show"
        onClick={onNext}
        whileHover={{ y: -3, scale: 1.015 }}
        whileTap={{ scale: 0.98 }}
        style={{
          position: "absolute",
          bottom: 24, left: NB_L, width: NB_W, height: 60,
          borderRadius: 30,
          background: "linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)",
          border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          fontFamily: F, fontSize: 20, fontWeight: 900, color: "#fff",
          boxShadow: "0 12px 30px rgba(109,70,255,0.35)",
          zIndex: 5, touchAction: "manipulation",
        }}
      >
        Next <span role="img" aria-label="paw">🐾</span>
      </motion.button>

    </div>
  );
}
