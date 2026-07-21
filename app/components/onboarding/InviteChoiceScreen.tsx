"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bobo } from "../Mascot";
import { NightRoomBackdrop } from "./WhoAreYou";
import { useAmbientMusic } from "./Welcome";

const F = "var(--font-nunito), system-ui, sans-serif";
const PURPLE = "#8B5CF6";
const ORANGE = "#F97316";
const CAT_TINT = 250;

function MusicIcon({ size = 20, on = true }: { size?: number; on?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
      {!on && <line x1="3" y1="3" x2="21" y2="21" />}
    </svg>
  );
}

function EnvelopeIcon({ size = 26, color = "#fff" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="5" width="18" height="14" rx="2.5" fill={color} opacity="0.95" />
      <path d="M4 6.5 12 13 20 6.5" stroke={color === "#fff" ? PURPLE : "#fff"} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.7" />
    </svg>
  );
}

function DeviceDownloadIcon({ size = 26, color = "#fff" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="6" y="2" width="12" height="20" rx="3" fill={color} opacity="0.95" />
      <path d="M12 7v6.5M9 11l3 3 3-3" stroke={ORANGE} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="12" cy="19" r="1" fill={ORANGE} />
    </svg>
  );
}

function ArrowRightIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M9 5l7 7-7 7" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

export function InviteChoiceScreen({
  onSendInvite,
  onUseThisDevice,
  onBack,
}: {
  onSendInvite: () => void;
  onUseThisDevice: () => void;
  onBack?: () => void;
}) {
  const { on: musicOn, toggle: toggleMusic } = useAmbientMusic();

  const [showHeading, setShowHeading] = useState(false);
  const [showMascot, setShowMascot] = useState(false);
  const [showCards, setShowCards] = useState(false);

  useEffect(() => {
    const ts = [
      setTimeout(() => setShowHeading(true), 150),
      setTimeout(() => setShowMascot(true), 500),
      setTimeout(() => setShowCards(true), 950),
    ];
    return () => ts.forEach(clearTimeout);
  }, []);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <NightRoomBackdrop minimal hideRug hideFloor />

      {onBack && (
        <button
          onClick={onBack}
          style={{
            position: "absolute", top: 24, left: 20, zIndex: 40,
            width: 46, height: 46, borderRadius: 14,
            background: "rgba(76,41,168,0.75)", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: 22, fontWeight: 700,
            boxShadow: "0 2px 10px rgba(0,0,0,0.28)",
            touchAction: "manipulation",
          }}
        >‹</button>
      )}

      <button
        onClick={toggleMusic}
        aria-label={musicOn ? "Mute music" : "Play music"}
        style={{
          position: "absolute", top: 24, right: 20, zIndex: 40,
          width: 46, height: 46, borderRadius: 14,
          background: "rgba(76,41,168,0.75)", border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 2px 10px rgba(0,0,0,0.28)",
        }}
      >
        <MusicIcon on={musicOn} />
      </button>

      <div style={{
        flex: 1, minHeight: 0, overflowY: "auto", position: "relative", zIndex: 2,
        display: "flex", flexDirection: "column", alignItems: "center",
        padding: "128px 22px 24px",
      }}>
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={showHeading ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
          style={{
            margin: 0, fontFamily: F, fontSize: 28, fontWeight: 900, lineHeight: 1.22,
            textAlign: "center", color: "#fff",
          }}
        >
          How will your child<br />
          join <span style={{ color: PURPLE }}>Fumi&apos;s</span> world?
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: -6 }}
          animate={showHeading ? { opacity: 1, y: 0 } : { opacity: 0, y: -6 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            margin: "10px 0 0", fontFamily: F, fontSize: 15, fontWeight: 500,
            color: "rgba(216,206,255,0.75)", textAlign: "center",
          }}
        >
          Choose the way that works best for you.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.6, y: 30 }}
          animate={showMascot ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.6, y: 30 }}
          transition={{ type: "spring", stiffness: 200, damping: 18 }}
          style={{ position: "relative", marginTop: 16, marginBottom: 8, flexShrink: 0 }}
        >
          <div style={{
            position: "absolute", bottom: 6, left: "50%", transform: "translateX(-50%)",
            width: 200, height: 56, borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(139,92,246,0.55) 0%, rgba(109,40,217,0.16) 60%, transparent 100%)",
            filter: "blur(6px)", zIndex: 0,
          }} />
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
            style={{ position: "relative", zIndex: 1 }}
          >
            <Bobo mood="cheer" tint={CAT_TINT} size={160} animate tailWag eyeOpen={1} />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={showCards ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ type: "spring", stiffness: 220, damping: 24 }}
          style={{ width: "100%", maxWidth: 420, marginTop: 8 }}
        >
          {/* Send an invite link */}
          <motion.button
            onClick={onSendInvite}
            whileHover={{ scale: 1.03, boxShadow: `0 0 28px ${PURPLE}55` }}
            whileTap={{ scale: 0.98 }}
            style={{
              width: "100%", display: "flex", alignItems: "center", gap: 14,
              background: "rgba(139,92,246,0.14)", border: `1.5px solid ${PURPLE}`,
              borderRadius: 20, padding: "16px 16px", cursor: "pointer", textAlign: "left",
              touchAction: "manipulation",
            }}
          >
            <div style={{
              flexShrink: 0, width: 52, height: 52, borderRadius: "50%",
              background: `radial-gradient(circle at 35% 30%, ${PURPLE}, #5B21B6)`,
              boxShadow: `0 0 18px ${PURPLE}88`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <EnvelopeIcon />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontFamily: F, fontSize: 17, fontWeight: 800, color: "#fff", lineHeight: 1.3 }}>
                Send an invite link
              </p>
              <p style={{ margin: "2px 0 0", fontFamily: F, fontSize: 13.5, fontWeight: 500, color: "rgba(216,206,255,0.75)", lineHeight: 1.35 }}>
                They can join on their own device.
              </p>
            </div>
            <div style={{
              flexShrink: 0, width: 36, height: 36, borderRadius: "50%",
              background: PURPLE,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <ArrowRightIcon />
            </div>
          </motion.button>

          {/* My child will use this device */}
          <motion.button
            onClick={onUseThisDevice}
            whileHover={{ scale: 1.03, boxShadow: `0 0 28px ${ORANGE}55` }}
            whileTap={{ scale: 0.98 }}
            style={{
              width: "100%", display: "flex", alignItems: "center", gap: 14,
              background: "rgba(249,115,22,0.10)", border: `1.5px solid ${ORANGE}`,
              borderRadius: 20, padding: "16px 16px", cursor: "pointer", textAlign: "left",
              marginTop: 18,
              touchAction: "manipulation",
            }}
          >
            <div style={{
              flexShrink: 0, width: 52, height: 52, borderRadius: "50%",
              background: `radial-gradient(circle at 35% 30%, ${ORANGE}, #C2410C)`,
              boxShadow: `0 0 18px ${ORANGE}88`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <DeviceDownloadIcon />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontFamily: F, fontSize: 17, fontWeight: 800, color: "#fff", lineHeight: 1.3, whiteSpace: "nowrap" }}>
                My child will use this device
              </p>
              <p style={{ margin: "2px 0 0", fontFamily: F, fontSize: 13.5, fontWeight: 500, color: "rgba(216,206,255,0.75)", lineHeight: 1.35 }}>
                We&apos;ll set it up together.
              </p>
            </div>
            <div style={{
              flexShrink: 0, width: 36, height: 36, borderRadius: "50%",
              background: ORANGE,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <ArrowRightIcon />
            </div>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
