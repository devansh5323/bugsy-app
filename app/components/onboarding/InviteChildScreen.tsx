"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { NightRoomBackdrop } from "./WhoAreYou";
import { Bobo } from "../Mascot";

const F      = "var(--font-nunito), system-ui, sans-serif";
const PURPLE = "#7C3AED";
const CAT_TINT = 250;
const INVITE_LINK = "https://app.fumi.world/join/ABC123";

function WhatsAppIcon({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32">
      <circle cx="16" cy="16" r="16" fill="#25D366" />
      <path d="M16 7a9 9 0 0 0-7.8 13.5L7 25l4.6-1.2A9 9 0 1 0 16 7Z" fill="#fff" />
      <path d="M16 8.4a7.6 7.6 0 0 0-6.6 11.4l.2.4-.9 3.3 3.4-.9.4.2A7.6 7.6 0 1 0 16 8.4Z" fill="#25D366" />
      <path d="M12.7 12.1c.2-.4.4-.4.6-.4h.5c.2 0 .4 0 .6.4.2.4.7 1.6.7 1.7.1.1.1.3 0 .4-.1.2-.1.3-.3.4-.1.2-.3.3-.4.5-.1.1-.3.3-.1.6.2.4.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.5 1.5.2.1.4.1.5-.1.2-.2.6-.7.8-.9.2-.2.3-.2.5-.1.2.1 1.5.7 1.7.8.2.1.4.2.4.3.1.2.1.9-.2 1.6-.3.8-1.7 1.5-2.3 1.5-.6.1-1.3.1-4.1-1-3.4-1.4-5.5-4.8-5.7-5-.2-.2-1.3-1.7-1.3-3.3 0-1.6.8-2.3 1.1-2.7Z" fill="#fff" />
    </svg>
  );
}

function MessagesIcon({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32">
      <path d="M16 5C9.4 5 4 9.6 4 15.2c0 3.2 1.8 6 4.6 7.9-.1 1-.6 2.6-1.6 4 1.9-.3 3.6-1.1 4.9-2 1.3.4 2.7.6 4.1.6 6.6 0 12-4.6 12-10.2S22.6 5 16 5Z" fill="#3DDC55" />
    </svg>
  );
}

function GmailIcon({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 36">
      <path d="M4 4h40v28a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V4Z" fill="#fff" />
      <path d="M4 4 24 20 44 4v6L24 26 4 10Z" fill="#EA4335" />
      <path d="M4 4h9v22H4z" fill="#4285F4" />
      <path d="M35 4h9v22h-9z" fill="#34A853" />
      <path d="M4 4h9l11 8.6L35 4h9L24 20.2Z" fill="#FBBC05" />
    </svg>
  );
}

function CopyIcon({ size = 18, color = PURPLE }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="8" y="8" width="12" height="12" rx="2.5" stroke={color} strokeWidth="1.8" />
      <path d="M16 8V6.5A2.5 2.5 0 0 0 13.5 4H6.5A2.5 2.5 0 0 0 4 6.5v7A2.5 2.5 0 0 0 6.5 16H8" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

const SHARE_OPTIONS = [
  { label: "WhatsApp", Icon: WhatsAppIcon },
  { label: "Messages", Icon: MessagesIcon },
  { label: "Email", Icon: GmailIcon },
];

export function InviteChildScreen({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack?: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const [showHeading, setShowHeading] = useState(false);
  const [showSubtext, setShowSubtext] = useState(false);
  const [showMascot, setShowMascot] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [showCTA, setShowCTA] = useState(false);

  useEffect(() => {
    const ts: ReturnType<typeof setTimeout>[] = [];
    ts.push(setTimeout(() => setShowHeading(true), 200));
    ts.push(setTimeout(() => setShowSubtext(true), 700));
    ts.push(setTimeout(() => setShowMascot(true), 1150));
    ts.push(setTimeout(() => setShowCard(true), 1750));
    ts.push(setTimeout(() => setShowCTA(true), 2250));
    return () => ts.forEach(clearTimeout);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(INVITE_LINK);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // clipboard unavailable — silently ignore, link is visible to copy manually
    }
  };

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <NightRoomBackdrop minimal hideRug hideFloor />

      {onBack && (
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
      )}

      <div style={{
        flex: 1, minHeight: 0, overflowY: "auto", position: "relative", zIndex: 4,
        display: "flex", flexDirection: "column", alignItems: "center",
        padding: "136px 24px 16px",
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={showHeading ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
          transition={{ type: "spring", stiffness: 260, damping: 16 }}
        >
          <p style={{
            fontFamily: F, fontSize: 30, fontWeight: 900, color: "#fff",
            textAlign: "center", margin: 0, lineHeight: 1.25,
          }}>
            Send invite to your 
          </p>
          <p style={{
            fontFamily: F, fontSize: 30, fontWeight: 900, color: "#fff",
            textAlign: "center", margin: 0, lineHeight: 1.25,
          }}>
            to <span style={{ color: "#8B7FE8" }}>child&apos;s device</span>
          </p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, scale: 0.6, y: 10 }}
          animate={showSubtext ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.6, y: 10 }}
          transition={{ type: "spring", stiffness: 280, damping: 18 }}
          style={{
            fontFamily: F, fontSize: 14.5, fontWeight: 500, color: "rgba(222,218,248,0.75)",
            textAlign: "center", margin: "14px 0 0", lineHeight: 1.5, maxWidth: 300,
          }}
        >
          Share a secure link to start their missions.
        </motion.p>

        {/* mascot + glowing envelope — the centerpiece of the screen */}
        <motion.div
          initial={{ opacity: 0, scale: 0.4 }}
          animate={showMascot ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.4 }}
          transition={{ type: "spring", stiffness: 230, damping: 15 }}
          style={{
            position: "relative", flex: "1 0 auto",
            marginTop: 28, marginBottom: 28,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <div style={{
            position: "absolute", bottom: 4, left: "50%", transform: "translateX(-50%)",
            width: 260, height: 100, borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(124,58,237,0.6) 0%, rgba(124,58,237,0) 72%)",
            filter: "blur(2px)",
          }} />
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}
          >
            <Bobo mood="excited" tint={CAT_TINT} size={190} animate armsDown tailWag />
          </motion.div>
        </motion.div>

        {/* Send link via card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 24 }}
          animate={showCard ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.85, y: 24 }}
          transition={{ type: "spring", stiffness: 240, damping: 22 }}
          style={{
          width: "100%", maxWidth: 360,
          background: "rgba(139,124,246,0.10)", border: "1px solid rgba(139,124,246,0.22)",
          borderRadius: 26, padding: "20px 18px",
        }}>
          <p style={{
            margin: "0 0 16px", fontFamily: F, fontSize: 16, fontWeight: 800, color: "#fff", textAlign: "center",
          }}>
            Send link via
          </p>

          <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
            {SHARE_OPTIONS.map((opt) => (
              <motion.button
                key={opt.label}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                style={{
                  flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                  background: "rgba(139,124,246,0.12)", border: "1px solid rgba(139,124,246,0.2)",
                  borderRadius: 18, padding: "14px 6px", cursor: "pointer",
                }}
              >
                <opt.Icon size={30} />
                <span style={{ fontFamily: F, fontSize: 12.5, fontWeight: 700, color: "#fff" }}>{opt.label}</span>
              </motion.button>
            ))}
          </div>

          <div style={{
            marginTop: 18, background: "rgba(20,14,44,0.55)", border: "1px solid rgba(139,124,246,0.18)",
            borderRadius: 18, padding: "14px 14px",
          }}>
            <p style={{ margin: "0 0 10px", fontFamily: F, fontSize: 13, fontWeight: 700, color: "#fff", textAlign: "center" }}>
              Or copy link
            </p>
            <div style={{
              display: "flex", alignItems: "center", gap: 10,
              background: "rgba(139,124,246,0.10)", border: "1px solid rgba(139,124,246,0.25)",
              borderRadius: 14, padding: "10px 14px",
            }}>
              <span style={{
                flex: 1, minWidth: 0, fontFamily: F, fontSize: 12.5, fontWeight: 600, color: "#B8ACEE",
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
                {INVITE_LINK}
              </span>
              <motion.button
                onClick={handleCopy}
                whileTap={{ scale: 0.9 }}
                style={{
                  flexShrink: 0, background: "none", border: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", padding: 2,
                }}
              >
                <CopyIcon size={18} color={copied ? "#4ADE80" : PURPLE} />
              </motion.button>
            </div>
            {copied && (
              <p style={{ margin: "8px 0 0", fontFamily: F, fontSize: 11.5, fontWeight: 700, color: "#4ADE80", textAlign: "center" }}>
                Copied!
              </p>
            )}
          </div>
        </motion.div>
      </div>

      {/* ── CTA ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={showCTA ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{
          flexShrink: 0, padding: "12px 16px 32px", zIndex: 7, position: "relative",
          pointerEvents: showCTA ? "auto" : "none",
        }}
      >
        <button
          onClick={onNext}
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
          Next <span aria-hidden>&rarr;</span>
        </button>
      </motion.div>
    </div>
  );
}
