"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { NightRoomBackdrop } from "./WhoAreYou";
import { Bobo } from "../Mascot";

const F = "var(--font-nunito), system-ui, sans-serif";
const GOLD = "#FBBF24";
const CAT_TINT = 220;

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

function ControllerIcon({ size = 46 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 46 46">
      {tileGradient("pay-ctrl-bg", "#8B7FF0", "#5B4CC4")}
      <rect width="46" height="46" rx="14" fill="url(#pay-ctrl-bg)" />
      <rect x="10" y="17" width="26" height="14" rx="7" fill="#fff" />
      <path d="M17 21v6M14 24h6" stroke="#5B4CC4" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="29" cy="21.5" r="1.7" fill="#5B4CC4" />
      <circle cx="32.5" cy="25" r="1.7" fill="#5B4CC4" />
    </svg>
  );
}

function TargetIcon({ size = 46 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 46 46">
      {tileGradient("pay-tgt-bg", "#F1637C", "#B32A49")}
      <rect width="46" height="46" rx="14" fill="url(#pay-tgt-bg)" />
      <circle cx="23" cy="23" r="10" fill="none" stroke="#fff" strokeWidth="2.4" />
      <circle cx="23" cy="23" r="5.4" fill="none" stroke="#fff" strokeWidth="2.4" />
      <circle cx="23" cy="23" r="1.8" fill="#fff" />
    </svg>
  );
}

function InsightsIcon({ size = 46 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 46 46">
      {tileGradient("pay-ins-bg", "#4A6FE0", "#22307E")}
      <rect width="46" height="46" rx="14" fill="url(#pay-ins-bg)" />
      <rect x="12" y="24" width="5.5" height="10" rx="1.8" fill="#7DD3FC" />
      <rect x="20.2" y="17" width="5.5" height="17" rx="1.8" fill="#93C5FD" />
      <rect x="28.5" y="12" width="5.5" height="22" rx="1.8" fill="#fff" />
    </svg>
  );
}

function CheckDot({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10.5" fill="none" stroke="#A78BFA" strokeWidth="1.8" />
      <path d="M8 12.2l2.6 2.6L16.2 9" stroke="#A78BFA" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function CalendarSparkleIcon({ size = 52 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none">
      <path d="M9 4c.5 3 1.2 3.8 4.2 4.2-3 .5-3.8 1.2-4.2 4.2-.5-3-1.2-3.8-4.2-4.2C7.8 7.8 8.5 7 9 4Z" fill={GOLD} />
      <path d="M7 32c.3 1.7.7 2.1 2.4 2.4-1.7.3-2.1.7-2.4 2.4-.3-1.7-.7-2.1-2.4-2.4C6.3 34.1 6.7 33.7 7 32Z" fill={GOLD} />
      <path d="M47 16c.3 1.6.7 2 2.3 2.3-1.6.3-2 .7-2.3 2.3-.3-1.6-.7-2-2.3-2.3 1.6-.3 2-.7 2.3-2.3Z" fill={GOLD} />
      <rect x="14" y="16" width="30" height="26" rx="5" fill="#fff" />
      <rect x="14" y="16" width="30" height="9" rx="5" fill="#7C3AED" />
      <rect x="20" y="12" width="4" height="8" rx="2" fill="#A78BFA" />
      <rect x="34" y="12" width="4" height="8" rx="2" fill="#A78BFA" />
      <text x="29" y="36" textAnchor="middle" fontFamily={F} fontSize="14" fontWeight="900" fill="#1E1B3A">14</text>
    </svg>
  );
}

const FEATURES = [
  { Icon: ControllerIcon, label: "Unlimited\ngames" },
  { Icon: TargetIcon, label: "Personalized\nmissions" },
  { Icon: InsightsIcon, label: "Parent\ninsights" },
];

export function PaymentScreen({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack: () => void;
}) {
  const [step, setStep] = useState(0);
  // step: 0=nothing, 1=heading, 2=mascot, 3=features, 4=trial, 5=pricing, 6=CTA

  useEffect(() => {
    const ts = [
      setTimeout(() => setStep(1), 150),
      setTimeout(() => setStep(2), 500),
      setTimeout(() => setStep(3), 950),
      setTimeout(() => setStep(4), 1300),
      setTimeout(() => setStep(5), 1600),
      setTimeout(() => setStep(6), 2000),
    ];
    return () => ts.forEach(clearTimeout);
  }, []);

  const fade = (threshold: number) => ({
    animate: { opacity: step >= threshold ? 1 : 0, y: step >= threshold ? 0 : 12 },
    transition: { type: "spring" as const, stiffness: 260, damping: 24 },
  });

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <NightRoomBackdrop minimal hideRug hideFloor />

      <button
        onClick={onBack}
        style={{
          position: "absolute", top: 52, left: 16, zIndex: 10,
          width: 46, height: 46, borderRadius: 14,
          background: "rgba(59,31,140,0.82)", border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", fontSize: 22, fontWeight: 700,
          boxShadow: "0 2px 10px rgba(0,0,0,0.28)",
          touchAction: "manipulation",
        }}
      >‹</button>

      <div style={{
        flex: 1, minHeight: 0, overflowY: "auto", position: "relative", zIndex: 4,
        display: "flex", flexDirection: "column", alignItems: "center",
        padding: "130px 20px 36px",
      }}>

        {/* Heading + subtext */}
        <motion.div {...fade(1)} style={{ width: "100%", textAlign: "center" }}>
          <p style={{
            fontFamily: F, fontSize: 27, fontWeight: 900, color: "#fff",
            margin: 0, lineHeight: 1.22,
          }}>
            Unlock the full
            <br />
            <span style={{ color: "#8B7FE8" }}>Fumi</span> experience
          </p>
          <p style={{
            fontFamily: F, fontSize: 14.5, fontWeight: 500,
            color: "rgba(222,218,248,0.8)", margin: "10px 0 0", lineHeight: 1.45,
          }}>
          
          </p>
        </motion.div>

        {/* Star, then the mascot below it */}
        <motion.div
          {...fade(2)}
          style={{
            flexShrink: 0, marginTop: 6, marginBottom: 8,
            display: "flex", flexDirection: "column", alignItems: "center",
          }}
        >
          <motion.span
            aria-hidden
            animate={{ rotate: [0, -8, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            style={{ fontSize: 30 }}
          >⭐</motion.span>
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
          >
            <Bobo mood="excited" tint={CAT_TINT} size={160} animate armsUp tailWag />
          </motion.div>
        </motion.div>

        {/* Feature row */}
        <motion.div {...fade(3)} style={{
          width: "100%", display: "flex", alignItems: "flex-start", justifyContent: "space-between",
          padding: "6px 2px",
        }}>
          {FEATURES.map((f, i) => (
            <div key={f.label} style={{
              flex: 1, display: "flex", alignItems: "center", gap: 8,
              borderLeft: i === 0 ? "none" : "1px solid rgba(255,255,255,0.14)",
              paddingLeft: i === 0 ? 0 : 10,
            }}>
              <f.Icon size={40} />
              <p style={{
                margin: 0, fontFamily: F, fontSize: 12.5, fontWeight: 600,
                color: "rgba(230,226,250,0.92)", lineHeight: 1.25, whiteSpace: "pre-line",
              }}>{f.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Free trial banner */}
        <motion.div {...fade(4)} style={{
          width: "100%", marginTop: 18,
          background: "rgba(139,124,246,0.14)", border: "1px solid rgba(139,124,246,0.25)",
          borderRadius: 18, padding: "14px 16px",
          display: "flex", alignItems: "center", gap: 12,
        }}>
          <CalendarSparkleIcon size={50} />
          <div>
            <p style={{ margin: 0, fontFamily: F, fontSize: 14, fontWeight: 800, color: "#fff", lineHeight: 1.35 }}>
              Try every Premium feature <span style={{ color: GOLD }}>FREE</span> for 14 days!
            </p>
            <p style={{ margin: "2px 0 0", fontFamily: F, fontSize: 12.5, fontWeight: 600, lineHeight: 1.35 }}>
              <span style={{ color: "#C4B5FD" }}>No payment today.</span>{" "}
              <span style={{ color: "rgba(230,226,250,0.7)" }}>Decide later.</span>
            </p>
          </div>
        </motion.div>

        {/* Pricing cards */}
        <motion.div {...fade(5)} style={{
          width: "100%", marginTop: 16,
          display: "flex", gap: 22, alignItems: "stretch",
        }}>
          {/* Monthly */}
          <div style={{
            flex: 1, position: "relative",
            border: "1.5px solid rgba(124,58,237,0.5)", borderRadius: 18,
            padding: "16px 12px", textAlign: "center",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
          }}>
            <p style={{ margin: 0, fontFamily: F, fontSize: 14, fontWeight: 800, color: "#A78BFA" }}>Monthly</p>
            <div style={{ width: 36, height: 1, background: "rgba(167,139,250,0.35)" }} />
            <div style={{
              display: "flex", alignItems: "baseline", gap: 3,
            }}>
              <span style={{ fontFamily: F, fontSize: 22, fontWeight: 900, color: "#fff" }}>₹499</span>
              <span style={{ fontFamily: F, fontSize: 12, fontWeight: 600, color: "rgba(230,226,250,0.65)" }}>/month</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-start" }}>
              {["Flexible", "Cancel anytime"].map((t) => (
                <div key={t} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <CheckDot size={15} />
                  <span style={{ fontFamily: F, fontSize: 12, fontWeight: 600, color: "rgba(230,226,250,0.85)" }}>{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Annual — highlighted */}
          <div style={{
            flex: 1, position: "relative",
            border: "1.5px solid " + GOLD, borderRadius: 18,
            padding: "20px 12px 16px", textAlign: "center",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
            background: "rgba(251,191,36,0.06)",
          }}>
            <div style={{
              position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
              background: GOLD, color: "#1E1B3A", whiteSpace: "nowrap",
              fontFamily: F, fontSize: 10.5, fontWeight: 900,
              borderRadius: 12, padding: "4px 10px",
              display: "flex", alignItems: "center", gap: 4,
              boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
            }}>★ MOST POPULAR</div>

            <p style={{ margin: 0, fontFamily: F, fontSize: 14, fontWeight: 800, color: GOLD }}>Annual</p>
            <div style={{ width: 36, height: 1, background: "rgba(251,191,36,0.4)" }} />
            <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
              <span style={{ fontFamily: F, fontSize: 22, fontWeight: 900, color: "#fff" }}>₹2,999</span>
              <span style={{ fontFamily: F, fontSize: 12, fontWeight: 600, color: "rgba(230,226,250,0.65)" }}>/year</span>
            </div>
            <div style={{
              background: "rgba(124,58,237,0.35)", borderRadius: 10, padding: "3px 10px",
              fontFamily: F, fontSize: 11, fontWeight: 700, color: "#fff",
            }}>Only ₹250/month</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontFamily: F, fontSize: 13, fontWeight: 900, color: GOLD }}>Save 50%</span>
              <span style={{ fontFamily: F, fontSize: 12, fontWeight: 600, color: "rgba(230,226,250,0.5)", textDecoration: "line-through" }}>₹5,998</span>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div {...fade(6)} style={{ width: "100%", marginTop: 36 }}>
          <motion.button
            onClick={onNext}
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            whileTap={{ scale: 0.95 }}
            style={{
              width: "100%", height: 50, borderRadius: 25,
              background: "linear-gradient(180deg, #4ADE80 0%, #16A34A 100%)",
              border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              fontFamily: F, fontSize: 16.5, fontWeight: 600, color: "#fff",
              boxShadow: "0 0 24px rgba(74,222,128,0.55), 0 4px 0 #15803D, 0 8px 22px rgba(22,163,74,0.45)",
              touchAction: "manipulation",
            }}
          >
            <span>✨</span>
            Just sign up and start journey!
            <motion.span
              aria-hidden
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
            >→</motion.span>
          </motion.button>

          <p style={{
            margin: "12px 0 0", fontFamily: F, fontSize: 12, fontWeight: 500,
            color: "rgba(222,218,248,0.5)", textAlign: "center",
          }}>Cancel anytime from your account settings.</p>
        </motion.div>

      </div>
    </div>
  );
}
