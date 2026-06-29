"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { NightRoomBackdrop } from "./WhoAreYou";
import { Bobo } from "../Mascot";

const F = "var(--font-nunito), system-ui, sans-serif";
const W = 344;

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
// 2-17 year-olds as of 2026
const YEARS  = [2024,2023,2022,2021,2020,2019,2018,2017,2016,2015,2014,2013,2012,2011,2010,2009];
const CUR_YR = 2026;

// ── icons ─────────────────────────────────────────────────────────────────
function PersonIcon() {
  return (
    <svg viewBox="0 0 24 24" width={20} height={20} fill="#A78BFA">
      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
    </svg>
  );
}

function CakeIcon() {
  return (
    <svg viewBox="0 0 24 24" width={20} height={20} fill="#A78BFA">
      <path d="M12 6c1.1 0 2-.9 2-2 0-.38-.1-.73-.29-1.03L12 0l-1.71 2.97c-.19.3-.29.65-.29 1.03 0 1.1.9 2 2 2zm4.6 9.99l-1.07-1.07-1.08 1.07c-1.3 1.3-3.58 1.31-4.89 0l-1.07-1.07-1.09 1.07C6.75 17.64 5.88 18 4.96 18c-.73 0-1.4-.23-1.96-.61V21c0 .55.45 1 1 1h16c.55 0 1-.45 1-1v-3.61c-.56.38-1.23.61-1.96.61-.92 0-1.79-.36-2.44-1.01zM18 9H6c-1.1 0-2 .9-2 2v2.47c.48.36 1.07.53 1.69.53.7 0 1.36-.28 1.85-.77l1.06-1.06 1.09 1.09c.98.98 2.69.98 3.67 0l1.07-1.07 1.07 1.07c.49.49 1.15.77 1.85.77.62 0 1.21-.17 1.69-.53V11c0-1.1-.9-2-2-2zm-1-1V6h-3V4H10v2H7v2h10z"/>
    </svg>
  );
}

// ── component ─────────────────────────────────────────────────────────────
export function BondWithBugsy({
  childName,
  setChildName,
  childAge,
  setChildAge,
  onNext,
  onBack,
}: {
  childName: string;
  setChildName: (n: string) => void;
  childAge: number | null;
  setChildAge: (a: number | null) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const defaultYear = childAge ? Math.max(YEARS[YEARS.length - 1], Math.min(YEARS[0], CUR_YR - childAge)) : 2020;

  const [day,   setDay]   = useState(10);
  const [month, setMonth] = useState(5);   // June (0-indexed)
  const [year,  setYear]  = useState(YEARS.includes(defaultYear) ? defaultYear : 2020);

  const age    = CUR_YR - year;
  const canGo  = childName.trim().length > 0;

  const cycleDay   = (d: 1 | -1) => setDay(v   => { const n = v + d;   return n < 1 ? 31 : n > 31 ? 1 : n; });
  const cycleMonth = (d: 1 | -1) => setMonth(v => { const n = v + d;   return n < 0 ? 11 : n > 11 ? 0 : n; });
  const cycleYear  = (d: 1 | -1) => setYear(y  => {
    const i  = YEARS.indexOf(y);
    const ni = Math.max(0, Math.min(YEARS.length - 1, i + d));
    return YEARS[ni];
  });

  const handleNext = () => { setChildAge(age); onNext(); };

  // ── shared spinner column ──
  const Spinner = ({
    label, value, fontSize = 18,
    onLeft, onRight,
  }: { label: string; value: string; fontSize?: number; onLeft: () => void; onRight: () => void }) => (
    <div style={{ flex: 1 }}>
      <p style={{ fontFamily: F, fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.38)", letterSpacing: 1.1, margin: "0 0 6px", textAlign: "center" }}>
        {label}
      </p>
      <div style={{ background: "#1e1650", borderRadius: 14, height: 52, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 2px" }}>
        <motion.button whileTap={{ scale: 0.75 }} onClick={onLeft}
          style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.45)", fontSize: 22, fontWeight: 700, padding: "6px 10px", lineHeight: 1, touchAction: "manipulation" }}>
          ‹
        </motion.button>
        <span style={{ fontFamily: F, fontSize, fontWeight: 800, color: "#fff", minWidth: 38, textAlign: "center" }}>
          {value}
        </span>
        <motion.button whileTap={{ scale: 0.75 }} onClick={onRight}
          style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.45)", fontSize: 22, fontWeight: 700, padding: "6px 10px", lineHeight: 1, touchAction: "manipulation" }}>
          ›
        </motion.button>
      </div>
    </div>
  );

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <NightRoomBackdrop minimal hideRug />

      {/* ── back ── */}
      <motion.button
        onClick={onBack}
        whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
        style={{
          position: "absolute", top: 52, left: 16, zIndex: 10,
          width: 42, height: 42, borderRadius: "50%",
          background: "rgba(255,255,255,0.12)", border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 22, color: "#fff", backdropFilter: "blur(4px)",
          touchAction: "manipulation",
        }}
      >‹</motion.button>

      {/* ── heading ── */}
      <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", top: 118, width: W, zIndex: 4, textAlign: "center" }}>
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ fontFamily: F, fontSize: 36, fontWeight: 900, color: "#fff", margin: 0, lineHeight: 1.2, textShadow: "0 3px 20px rgba(0,0,0,0.4)" }}
        >
          Bond with <span style={{ color: "#FBBF24" }}>Bugsy</span>
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.28, duration: 0.45 }}
          style={{ fontFamily: F, fontSize: 15, fontWeight: 600, color: "rgba(255,255,255,0.75)", margin: "6px 0 0", lineHeight: 1.4 }}
        >
          We&apos;re excited to get to know you!
        </motion.p>
      </div>

      {/* ── speech bubble ── */}
      <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", top: 208, width: 178, zIndex: 6 }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 22, delay: 0.38 }}
          style={{ background: "#fff", borderRadius: 18, padding: "10px 16px 12px", textAlign: "center", boxShadow: "0 6px 22px rgba(0,0,0,0.28)", position: "relative" }}
        >
          <p style={{ fontFamily: F, fontSize: 15, fontWeight: 800, color: "#1a1035", margin: 0, lineHeight: 1.42 }}>
            Let&apos;s get<br />to know <span style={{ color: "#7C3AED" }}>you!</span> 💙
          </p>
          {/* downward tail */}
          <div style={{ position: "absolute", bottom: -9, left: "50%", marginLeft: -9, width: 0, height: 0, borderLeft: "9px solid transparent", borderRight: "9px solid transparent", borderTop: "9px solid #fff" }} />
        </motion.div>
      </div>

      {/* ── Bobo ── */}
      <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", top: 278, zIndex: 5 }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.72, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 240, damping: 18, delay: 0.28 }}
          style={{ display: "flex", justifyContent: "center" }}
        >
          <Bobo mood="happy" tint={220} size={158} animate tailWag />
        </motion.div>
      </div>

      {/* ── bottom card ── */}
      <motion.div
        initial={{ y: 440 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 30, delay: 0.18 }}
        style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          background: "#130d2e", borderRadius: "28px 28px 0 0",
          padding: "22px 20px 0",
          zIndex: 8,
          boxShadow: "0 -6px 40px rgba(0,0,0,0.55)",
        }}
      >
        {/* YOUR NAME */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(167,139,250,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <PersonIcon />
            </div>
            <span style={{ fontFamily: F, fontSize: 11, fontWeight: 800, color: "rgba(255,255,255,0.45)", letterSpacing: 1.3 }}>
              YOUR NAME
            </span>
          </div>

          <div style={{ position: "relative" }}>
            <input
              type="text"
              value={childName}
              onChange={e => setChildName(e.target.value)}
              placeholder="Type your name…"
              style={{
                width: "100%", height: 50, borderRadius: 14,
                background: "#1e1650", border: "none", outline: "none",
                padding: "0 48px 0 18px",
                fontFamily: F, fontSize: 17, fontWeight: 700, color: "#fff",
                boxSizing: "border-box",
              }}
            />
            {childName.length > 0 && (
              <motion.button
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                onClick={() => setChildName("")}
                style={{
                  position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                  width: 28, height: 28, borderRadius: "50%",
                  background: "#7C3AED", border: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontSize: 16, lineHeight: 1,
                  touchAction: "manipulation",
                }}
              >×</motion.button>
            )}
          </div>

          <p style={{ fontFamily: F, fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.35)", margin: "6px 0 0 4px" }}>
            This is how Bugsy will talk to you.
          </p>
        </div>

        {/* divider */}
        <div style={{ height: 1, background: "rgba(255,255,255,0.07)", margin: "0 0 14px" }} />

        {/* YOUR BIRTHDAY */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(167,139,250,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <CakeIcon />
              </div>
              <span style={{ fontFamily: F, fontSize: 11, fontWeight: 800, color: "rgba(255,255,255,0.45)", letterSpacing: 1.3 }}>
                YOUR BIRTHDAY
              </span>
            </div>
            {/* age badge */}
            <div style={{ background: "#F59E0B", borderRadius: 20, padding: "4px 10px", display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ fontSize: 11 }}>⭐</span>
              <span style={{ fontFamily: F, fontSize: 11, fontWeight: 800, color: "#3a1a00" }}>{age} yrs fearless</span>
            </div>
          </div>

          {/* day / month / year spinners */}
          <div style={{ display: "flex", gap: 8 }}>
            <Spinner label="DAY"   value={String(day)}       fontSize={18} onLeft={() => cycleDay(-1)}   onRight={() => cycleDay(1)}   />
            <Spinner label="MONTH" value={MONTHS[month]}     fontSize={18} onLeft={() => cycleMonth(-1)} onRight={() => cycleMonth(1)} />
            <Spinner label="YEAR"  value={String(year)}      fontSize={15} onLeft={() => cycleYear(1)}   onRight={() => cycleYear(-1)} />
          </div>

          <p style={{ fontFamily: F, fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.35)", margin: "7px 0 0 4px" }}>
            We use this to personalize your experience.
          </p>
        </div>

        {/* CTA */}
        <motion.button
          onClick={canGo ? handleNext : undefined}
          whileHover={canGo ? { scale: 1.02 } : {}}
          whileTap={canGo ? { scale: 0.97 } : {}}
          style={{
            width: "100%", height: 56, borderRadius: 28,
            background: canGo
              ? "linear-gradient(135deg, #F43F5E 0%, #EC4899 100%)"
              : "rgba(255,255,255,0.08)",
            border: "none", cursor: canGo ? "pointer" : "default",
            fontFamily: F, fontSize: 19, fontWeight: 900,
            color: canGo ? "#fff" : "rgba(255,255,255,0.3)",
            boxShadow: canGo ? "0 8px 28px rgba(244,63,94,0.42)" : "none",
            touchAction: "manipulation",
            transition: "background 0.3s, box-shadow 0.3s, color 0.3s",
          }}
        >
          Let&apos;s go! →
        </motion.button>

        {/* safe footer */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5, padding: "10px 0 max(14px, env(safe-area-inset-bottom))" }}>
          <span style={{ fontSize: 12 }}>🔒</span>
          <span style={{ fontFamily: F, fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.3)" }}>
            Your info is safe and private
          </span>
        </div>
      </motion.div>
    </div>
  );
}
