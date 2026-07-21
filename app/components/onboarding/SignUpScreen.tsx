"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { NightRoomBackdrop } from "./WhoAreYou";
import { Bobo } from "../Mascot";

const WORD_START_MS = 550;
const WORD_STEP_MS = 150;

const F        = "var(--font-nunito), system-ui, sans-serif";
const W        = 344;
const CAT_TINT = 250; // periwinkle-blue — matches app-wide TINT
const PURPLE   = "#7C3AED";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width={22} height={22}>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function AppleIcon({ color = "#111" }: { color?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={20} height={20} fill={color}>
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
    </svg>
  );
}

function EnvelopeIcon({ size = 20, color = PURPLE }: { size?: number; color?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill={color}>
      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
    </svg>
  );
}

function ShieldIcon({ size = 16, color = "#fff" }: { size?: number; color?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none">
      <path d="M12 2.5l7.5 3v5.2c0 4.9-3.2 9.1-7.5 10.3-4.3-1.2-7.5-5.4-7.5-10.3V5.5l7.5-3z" fill={color} opacity={0.16} stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M8.7 12.3l2.1 2.1 4.3-4.5" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  );
}

function PersonIcon({ size = 20, color = "#fff" }: { size?: number; color?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none">
      <circle cx="12" cy="8.5" r="4" fill={color} />
      <path d="M4 21c0-4.4 3.6-7.5 8-7.5s8 3.1 8 7.5" fill={color} />
    </svg>
  );
}

function HeartMiniIcon({ size = 18, color = PURPLE }: { size?: number; color?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none">
      <path d="M12 20.5s-8-4.9-8-11A4.8 4.8 0 0 1 12 6.2 4.8 4.8 0 0 1 20 9.5c0 6.1-8 11-8 11Z" fill={color} />
    </svg>
  );
}

// Small sparkle diamond used to flank badges/headings
function Sparkle({ size = 10, color = "#fff", style }: { size?: number; color?: string; style?: React.CSSProperties }) {
  return <span style={{ fontSize: size, color, lineHeight: 1, ...style }}>✦</span>;
}

// Thin "whoosh" burst lines flanking the heading
function Burst({ flip = false, color = "rgba(167,139,250,0.65)" }: { flip?: boolean; color?: string }) {
  const dashes = [
    { rotate: -20, top: 0,  length: 16 },
    { rotate: 0,   top: 7,  length: 22 },
    { rotate: 20,  top: 14, length: 16 },
  ];
  return (
    <div style={{ position: "relative", width: 26, height: 24, transform: flip ? "scaleX(-1)" : undefined }}>
      {dashes.map((d, i) => (
        <div key={i} style={{
          position: "absolute", top: d.top, left: 0,
          width: d.length, height: 2.6, borderRadius: 2,
          background: color,
          transform: `rotate(${d.rotate}deg)`,
          transformOrigin: "left center",
        }} />
      ))}
    </div>
  );
}

export function SignUpScreen({
  childName,
  onNext,
  onBack,
}: {
  childName?: string;
  onNext: () => void;
  onBack: () => void;
}) {
  void childName;
  const MESSAGE = "Hi there! Before you introduce your little one to me, let's secure your account.";
  const WORDS = MESSAGE.split(" ");
  const COLORED = new Set<number>();
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    const ts: ReturnType<typeof setTimeout>[] = [];
    WORDS.forEach((_, i) =>
      ts.push(setTimeout(() => setWordCount(i + 1), WORD_START_MS + i * WORD_STEP_MS))
    );
    return () => ts.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cardDelay = (WORD_START_MS + WORDS.length * WORD_STEP_MS + 300) / 1000;

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <NightRoomBackdrop minimal hideRug hideFloor />

      {/* ── back ── */}
      <button
        onClick={onBack}
        style={{
          position: "absolute", top: 52, left: 16, zIndex: 10,
          width: 46, height: 46, borderRadius: 14,
          background: "rgba(59,31,140,0.82)", border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", fontSize: 20, fontWeight: 400,
          boxShadow: "0 2px 10px rgba(0,0,0,0.28)",
          touchAction: "manipulation",
        }}
      >‹</button>

      {/* ── top content: speech bubble + mascot ── */}
      <div style={{
        flexShrink: 0, position: "relative", zIndex: 2,
        display: "flex", flexDirection: "column", alignItems: "center",
        paddingTop: 128,
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.75 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 26, delay: 0.35 }}
          style={{
            maxWidth: W + 60,
            background: "#fff", borderRadius: 18,
            padding: "14px 20px 16px",
            boxShadow: "0 6px 28px rgba(0,0,0,0.22)",
            position: "relative",
          }}
        >
          <p style={{
            fontFamily: F, fontSize: 15.5, fontWeight: 800,
            color: "#1a0f40", textAlign: "center",
            margin: 0, lineHeight: 1.4,
          }}>
            {WORDS.slice(0, wordCount).map((w, i) => (
              <span key={i} style={{ color: COLORED.has(i) ? PURPLE : undefined }}>
                {w}{i < wordCount - 1 ? " " : ""}
              </span>
            ))}
          </p>

          {/* bubble tail pointing down at the mascot */}
          <div style={{
            position: "absolute", bottom: -12, left: "50%", marginLeft: -12,
            width: 0, height: 0,
            borderLeft: "12px solid transparent",
            borderRight: "12px solid transparent",
            borderTop: "12px solid #fff",
          }} />
        </motion.div>

        <motion.div
          initial={{ y: 50, opacity: 0, scale: 0.7 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 18, delay: 0.1 }}
          style={{ marginTop: 18, position: "relative" }}
        >
          {/* Soft ground glow under the cat */}
          <div style={{
            position: "absolute", bottom: 4, left: "50%",
            transform: "translateX(-50%)",
            width: 150, height: 40, borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(139,92,246,0.55) 0%, rgba(109,40,217,0.18) 60%, transparent 100%)",
            filter: "blur(6px)", zIndex: 0, pointerEvents: "none",
          }} />
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
            style={{ position: "relative", zIndex: 1 }}
          >
            <Bobo mood="cheer" tint={CAT_TINT} size={160} animate tailWag eyeOpen={1} armsDown />
          </motion.div>
        </motion.div>
      </div>

      {/* ── bottom card ── */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 240, damping: 26, delay: cardDelay }}
        style={{
          flex: 1, minHeight: 0, marginTop: 20, zIndex: 3, position: "relative",
          background: "rgba(35,25,74,0.55)",
          border: "1px solid rgba(167,139,250,0.28)",
          borderTopLeftRadius: 32, borderTopRightRadius: 32,
          padding: "30px 24px 28px",
          overflowY: "auto",
          display: "flex", flexDirection: "column", alignItems: "center",
        }}
      >
        {/* parent-account badge, flanked by sparkles */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <Sparkle size={10} color="#C4B5FD" />
          <div style={{
            width: 56, height: 56, borderRadius: "50%",
            background: "linear-gradient(180deg, #8B5CF6 0%, #6D28D9 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 20px rgba(124,58,237,0.65)",
          }}>
            <PersonIcon size={26} />
          </div>
          <Sparkle size={10} color="#C4B5FD" />
        </div>

        {/* heading, flanked by whoosh bursts */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 18 }}>
          <Burst flip />
          <p style={{
            margin: 0, maxWidth: W,
            fontFamily: F, fontSize: 27, fontWeight: 900,
            textAlign: "center", lineHeight: 1.2,
          }}>
            <span style={{ color: "#fff" }}>Create your</span><br />
            <span style={{ color: "#FBBF24" }}>account</span>
          </p>
          <Burst />
        </div>

        <p style={{
          margin: "14px 0 0", maxWidth: W,
          fontFamily: F, fontSize: 14, fontWeight: 600, color: "rgba(216,206,255,0.85)",
          textAlign: "center", lineHeight: 1.55,
        }}>
          Save your child&apos;s progress, unlock personalized guidance, and let Fumi remember every milestone as your child grows.
        </p>

        {/* auth buttons */}
        <div style={{ width: "100%", maxWidth: W, marginTop: 22, display: "flex", flexDirection: "column", gap: 12 }}>
          <button
            onClick={onNext}
            style={{
              width: "100%", height: 54, borderRadius: 27,
              background: "#fff", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
              fontFamily: F, fontSize: 15.5, fontWeight: 800, color: "#1a0f40",
              boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
              touchAction: "manipulation",
            }}
          >
            <GoogleIcon />
            Continue with Google
          </button>

          <button
            onClick={onNext}
            style={{
              width: "100%", height: 54, borderRadius: 27,
              background: "#000", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
              fontFamily: F, fontSize: 15.5, fontWeight: 800, color: "#fff",
              boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
              touchAction: "manipulation",
            }}
          >
            <AppleIcon color="#fff" />
            Continue with Apple
          </button>

          <button
            onClick={onNext}
            style={{
              width: "100%", height: 54, borderRadius: 27,
              background: "transparent", border: `2px solid ${PURPLE}`, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
              fontFamily: F, fontSize: 15.5, fontWeight: 800, color: PURPLE,
              touchAction: "manipulation",
            }}
          >
            <EnvelopeIcon size={19} color={PURPLE} />
            Continue with Email
          </button>
        </div>

        {/* divider */}
        <div style={{ width: "100%", maxWidth: W, display: "flex", alignItems: "center", gap: 12, marginTop: 22 }}>
          <div style={{ flex: 1, height: 1, background: "rgba(167,139,250,0.28)" }} />
          <HeartMiniIcon size={18} color={PURPLE} />
          <div style={{ flex: 1, height: 1, background: "rgba(167,139,250,0.28)" }} />
        </div>

        {/* footer */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, marginTop: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 22, height: 22, borderRadius: "50%",
              background: "#6D28D9",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <ShieldIcon size={13} />
            </div>
            <span style={{
              fontFamily: F, fontSize: 13, fontWeight: 600,
              color: "rgba(216,206,255,0.85)", textAlign: "center",
            }}>
              COPPA &bull; GDPR &bull; DPDP Compliant
            </span>
          </div>
          <span style={{
            fontFamily: F, fontSize: 12, fontWeight: 600,
            color: "rgba(216,206,255,0.7)", textAlign: "center",
          }}>
            Your child&apos;s privacy is protected from day one.
          </span>
        </div>
      </motion.div>
    </div>
  );
} 