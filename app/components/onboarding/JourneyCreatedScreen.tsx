"use client";

import { motion } from "framer-motion";
import { NightRoomBackdrop } from "./WhoAreYou";
import { Bobo } from "../Mascot";

const F        = "var(--font-nunito), system-ui, sans-serif";
const W        = 344;
const CAT_TINT = 220;

const centered = (extra?: React.CSSProperties): React.CSSProperties => ({
  position: "absolute",
  left: "50%",
  transform: "translateX(-50%)",
  width: W,
  ...extra,
});

// ✦ sparkles around Bobo — x/y relative to Bobo's center (195, 353)
const SPARKLES = [
  { x: -74, y: -60, delay: 0.4,  size: 18 },
  { x:  68, y: -54, delay: 0.6,  size: 14 },
  { x: -84, y:   4, delay: 0.8,  size: 16 },
  { x:  80, y:  -1, delay: 0.52, size: 16 },
];

// ── SVG icons ────────────────────────────────────────────────────────────
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

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" width={20} height={20} fill="#111">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
    </svg>
  );
}

function EnvelopeIcon({ size = 20, color = "#7C3AED" }: { size?: number; color?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill={color}>
      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" width={14} height={14} fill="rgba(167,139,250,0.75)">
      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
    </svg>
  );
}

export function JourneyCreatedScreen({
  childName,
  onNext,
  onBack,
}: {
  childName: string;
  onNext: () => void;
  onBack: () => void;
}) {
  const name = childName.trim() || "your child";

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <NightRoomBackdrop minimal hideRug />

      {/* ── back ── */}
      <motion.button
        onClick={onBack}
        whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
        style={{
          position: "absolute", top: 52, left: 16, zIndex: 10,
          width: 46, height: 46, borderRadius: "50%",
          background: "#5B21B6", border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 22, color: "#fff",
          boxShadow: "0 4px 18px rgba(0,0,0,0.45)", touchAction: "manipulation",
        }}
      >←</motion.button>

      {/* ── music ── */}
      <motion.button
        whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92, rotate: 15 }}
        style={{
          position: "absolute", top: 52, right: 16, zIndex: 10,
          width: 46, height: 46, borderRadius: "50%",
          background: "#5B21B6", border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 20, boxShadow: "0 4px 18px rgba(0,0,0,0.45)", touchAction: "manipulation",
        }}
      >🎵</motion.button>

      {/* ── heading "Journey Created!" ── */}
      <div style={centered({ top: 148, zIndex: 4 })}>
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: F, fontSize: 40, fontWeight: 900,
            color: "#fff", textAlign: "center",
            lineHeight: 1.15, margin: 0,
            textShadow: "0 3px 28px rgba(0,0,0,0.42)",
          }}
        >
          Journey Created!
        </motion.p>
      </div>

      {/* ── subtitle "{Name}'s personalized path." ── */}
      <div style={centered({ top: 210, zIndex: 4 })}>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          style={{
            fontFamily: F, fontSize: 18, fontWeight: 700,
            color: "#fff", textAlign: "center", margin: 0, lineHeight: 1.4,
          }}
        >
          <span style={{ color: "#A78BFA" }}>{name}&apos;s</span>{" "}personalized path.
        </motion.p>
      </div>

      {/* ── concentric ring mat ── */}
      <div style={{
        position: "absolute", left: "50%", transform: "translateX(-50%)",
        top: 418, zIndex: 3, pointerEvents: "none",
      }}>
        <motion.div
          initial={{ opacity: 0, scaleX: 0.5, scaleY: 0.5 }}
          animate={{ opacity: 1, scaleX: 1, scaleY: 1 }}
          transition={{ delay: 0.44, duration: 0.52, ease: "easeOut" }}
          style={{ position: "relative", width: 270, height: 76 }}
        >
          {([
            { w: 270, h: 76, fill: "rgba(55,0,0,0.96)"    },
            { w: 220, h: 62, fill: "rgba(100,3,3,0.96)"   },
            { w: 168, h: 50, fill: "rgba(155,12,12,0.96)" },
            { w: 118, h: 36, fill: "rgba(200,25,25,0.96)" },
            { w:  68, h: 20, fill: "rgba(235,48,48,0.96)" },
          ] as { w: number; h: number; fill: string }[]).map((ring, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: "50%", marginLeft: -(ring.w / 2),
                top:  "50%", marginTop:  -(ring.h / 2),
                width: ring.w, height: ring.h,
                borderRadius: "50%", background: ring.fill,
              }}
            />
          ))}
        </motion.div>
      </div>

      {/* ── ✦ sparkles around Bobo ── */}
      {SPARKLES.map((s, i) => (
        <motion.span
          key={`sp-${i}`}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.35, 1], opacity: [0, 1, 0.75], y: [0, -7, 0] }}
          transition={{
            delay: s.delay, duration: 1.25,
            repeat: Infinity, repeatDelay: 0.55, ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            left: `calc(50% + ${s.x}px)`,
            top: 258 + 95 + s.y,  // Bobo center y = top(258) + halfSize(95)
            fontSize: s.size, color: "#FCD34D",
            pointerEvents: "none", userSelect: "none", zIndex: 6,
          }}
        >✦</motion.span>
      ))}

      {/* ── Bobo mascot ── */}
      <div style={{
        position: "absolute", left: "50%", transform: "translateX(-50%)",
        top: 258, zIndex: 5,
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.7, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 250, damping: 20, delay: 0.35 }}
          style={{ display: "flex", justifyContent: "center" }}
        >
          <Bobo mood="excited" tint={CAT_TINT} size={190} animate tailWag />
        </motion.div>
      </div>

      {/* ── email icon circle (overlaps bottom of mat) ── */}
      <div style={{
        position: "absolute", left: "50%", transform: "translateX(-50%)",
        top: 476, zIndex: 7,
      }}>
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.52 }}
          style={{ position: "relative" }}
        >
          <div style={{
            width: 66, height: 66, borderRadius: "50%",
            background: "#EDE9FE",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 6px 26px rgba(0,0,0,0.32)",
          }}>
            <EnvelopeIcon size={32} color="#6D28D9" />
          </div>
          {/* micro sparkles around circle */}
          <motion.span
            animate={{ scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut" }}
            style={{ position: "absolute", top: -5, right: -9, fontSize: 11, color: "#FCD34D", pointerEvents: "none" }}
          >✦</motion.span>
          <motion.span
            animate={{ scale: [1, 1.35, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.55 }}
            style={{ position: "absolute", bottom: -3, left: -11, fontSize: 10, color: "#FCD34D", pointerEvents: "none" }}
          >✦</motion.span>
        </motion.div>
      </div>

      {/* ── "Sign up so we can continue…" ── */}
      <div style={centered({ top: 552, zIndex: 4 })}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.62, duration: 0.42 }}
        >
          <p style={{
            fontFamily: F, fontSize: 18, fontWeight: 800,
            color: "#fff", textAlign: "center",
            margin: "0 0 2px", lineHeight: 1.45,
            textShadow: "0 2px 16px rgba(0,0,0,0.35)",
          }}>
            Sign up so we can continue<br />this journey together and
          </p>
          <p style={{
            fontFamily: F, fontSize: 18, fontWeight: 800,
            color: "#A78BFA", textAlign: "center", margin: 0,
          }}>
            meet {name}!
          </p>
        </motion.div>
      </div>

      {/* ── sign-in buttons ── */}
      <div style={{ ...centered({ top: 648, zIndex: 8 }), display: "flex", flexDirection: "column", gap: 10 }}>
        {[
          { label: "Continue with Google", icon: <GoogleIcon /> },
          { label: "Continue with Apple",  icon: <AppleIcon /> },
          { label: "Continue with Email",  icon: <EnvelopeIcon size={20} color="#7C3AED" /> },
        ].map(({ label, icon }, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 + i * 0.09, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            onClick={onNext}
            whileHover={{
              scale: [1, 1.05, 1],
              transition: { duration: 0.5, repeat: Infinity, ease: "easeInOut" },
            }}
            whileTap={{ scale: 0.96 }}
            style={{
              width: "100%", height: 50, borderRadius: 25,
              background: "#fff", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 14,
              fontFamily: F, fontSize: 16, fontWeight: 800, color: "#111",
              boxShadow: "0 4px 22px rgba(0,0,0,0.22)",
              touchAction: "manipulation",
            }}
          >
            {icon}
            {label}
          </motion.button>
        ))}
      </div>

      {/* ── "Your data is safe with us." footer ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0, duration: 0.4 }}
        style={{
          position: "absolute", bottom: 14, left: 0, right: 0, zIndex: 4,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
        }}
      >
        <ShieldIcon />
        <span style={{
          fontFamily: F, fontSize: 13, fontWeight: 600,
          color: "rgba(167,139,250,0.8)",
        }}>
          Your data is safe with us.
        </span>
      </motion.div>
    </div>
  );
}
