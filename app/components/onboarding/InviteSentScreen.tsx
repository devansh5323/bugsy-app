"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { NightRoomBackdrop } from "./WhoAreYou";
import { Bobo } from "../Mascot";

const F      = "var(--font-nunito), system-ui, sans-serif";
const PURPLE = "#7C3AED";
const CAT_TINT = 250;

function CheckIcon({ size = 22, color = "#fff" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M5 13l4.5 4.5L19 7" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function PhoneLinkIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="6" y="2" width="12" height="20" rx="3" stroke="#fff" strokeWidth="1.8" fill="none" />
      <circle cx="12" cy="18" r="1" fill="#fff" />
      <circle cx="9.5" cy="9" r="1.8" stroke="#fff" strokeWidth="1.5" fill="none" />
      <circle cx="14.5" cy="9" r="1.8" stroke="#fff" strokeWidth="1.5" fill="none" />
      <path d="M11.1 9h1.8" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function MiniCatFaceIcon({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M6 5 8 9" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M18 5 16 9" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="12" cy="12" r="7.5" fill="#fff" />
      <circle cx="9.3" cy="11.5" r="1.1" fill="#1a1420" />
      <path d="M14 11.7q1 -0.9 2 0" stroke="#1a1420" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <path d="M10.8 14.3q1.2 1 2.4 0" stroke="#1a1420" strokeWidth="1.1" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function StarIcon({ size = 24, color = "#FDE047" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2.5 15 9l7 1-5 5 1.3 7-6.3-3.4L5.7 22 7 15 2 10l7-1Z" fill={color} />
    </svg>
  );
}

function PaperPlaneIcon({ size = 22, color = "#fff" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M3 11.5 21 3l-6 18-3.5-7L3 11.5Z" stroke={color} strokeWidth="1.7" strokeLinejoin="round" strokeLinecap="round" fill="none" />
      <path d="M11.5 13.5 21 3" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function ShieldIcon({ size = 14, color = "rgba(216,206,255,0.85)" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2.5l7.5 3v5.2c0 4.9-3.2 9.1-7.5 10.3-4.3-1.2-7.5-5.4-7.5-10.3V5.5l7.5-3z" fill={color} opacity={0.16} stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M8.7 12.3l2.1 2.1 4.3-4.5" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  );
}

const STEPS = [
  { bg: "#5B4FCF", Icon: PhoneLinkIcon, title: "They tap the link", subtitle: "on their device." },
  { bg: "#3B82C4", Icon: MiniCatFaceIcon, title: "Create their profile", subtitle: "and meet Fumi!" },
  { bg: "#3A2E63", Icon: StarIcon, title: "Start their personalized", subtitle: "adventure." },
];

export function InviteSentScreen({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack?: () => void;
}) {
  const [showCheck, setShowCheck] = useState(false);
  const [showHeading, setShowHeading] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [showCard, setShowCard] = useState(false);

  useEffect(() => {
    const ts: ReturnType<typeof setTimeout>[] = [];
    // Mascot animates in immediately; everything else follows once it lands.
    ts.push(setTimeout(() => setShowCheck(true), 650));
    ts.push(setTimeout(() => setShowHeading(true), 900));
    ts.push(setTimeout(() => setShowSubtitle(true), 1100));
    ts.push(setTimeout(() => setShowCard(true), 1350));
    return () => ts.forEach(clearTimeout);
  }, []);

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
        padding: "130px 0 0",
      }}>
        {/* Mascot */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 240, damping: 18, delay: 0.1 }}
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
          >
            <Bobo mood="excited" tint={CAT_TINT} size={150} animate tailWag armsUp />
          </motion.div>
        </motion.div>

        {/* Green checkmark badge, overlapping the card below */}
        <motion.div
          initial={{ opacity: 0, scale: 0.3 }}
          animate={showCheck ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.3 }}
          transition={{ type: "spring", stiffness: 320, damping: 16 }}
          style={{
            width: 66, height: 66, borderRadius: "50%",
            background: "#22C55E",
            display: "flex", alignItems: "center", justifyContent: "center",
            marginTop: 14, marginBottom: -33, zIndex: 6,
            boxShadow: "0 6px 18px rgba(0,0,0,0.35)",
            border: "4px solid #140C28",
          }}
        >
          <CheckIcon size={30} />
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={showCheck ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ type: "spring", stiffness: 220, damping: 24 }}
          style={{
            width: "100%", maxWidth: 480, flex: 1, minHeight: 0,
            background: "rgba(20,14,44,0.7)",
            borderTopLeftRadius: 32, borderTopRightRadius: 32,
            padding: "45px 22px 24px",
            display: "flex", flexDirection: "column", alignItems: "center",
          }}
        >
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={showHeading ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            style={{
              margin: 0, fontFamily: F, fontSize: 32, fontWeight: 900, color: "#fff",
              textAlign: "center", lineHeight: 1.2,
            }}
          >
            Invite sent!
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={showSubtitle ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            style={{
              margin: "10px 0 0", maxWidth: 320,
              fontFamily: F, fontSize: 14.5, fontWeight: 500, color: "rgba(216,206,255,0.8)",
              textAlign: "center", lineHeight: 1.55,
            }}
          >
            Your child can now join Fumi&apos;s world using the invitation link.
          </motion.p>

          {/* What happens next */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={showCard ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ type: "spring", stiffness: 220, damping: 24 }}
            style={{
            width: "100%", maxWidth: 400, marginTop: 22,
            background: "rgba(139,124,246,0.08)", border: "1px solid rgba(139,124,246,0.18)",
            borderRadius: 24, padding: "18px 18px 6px",
          }}>
            <p style={{
              margin: "0 0 14px", fontFamily: F, fontSize: 15.5, fontWeight: 800, color: "#fff",
              textAlign: "left",
            }}>
              What happens next?
            </p>
            {STEPS.map((s, i) => (
              <div key={s.title} style={{
                display: "flex", alignItems: "center", gap: 14,
                padding: "12px 0",
                borderTop: i === 0 ? "none" : "1px solid rgba(139,124,246,0.14)",
              }}>
                <div style={{
                  flexShrink: 0, width: 44, height: 44, borderRadius: "50%",
                  background: s.bg,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <s.Icon size={22} />
                </div>
                <div>
                  <p style={{ margin: 0, fontFamily: F, fontSize: 15, fontWeight: 800, color: "#fff", lineHeight: 1.3 }}>
                    {s.title}
                  </p>
                  <p style={{ margin: 0, fontFamily: F, fontSize: 13.5, fontWeight: 500, color: "rgba(216,206,255,0.75)", lineHeight: 1.3 }}>
                    {s.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Invite again anytime, CTA, footer */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={showCard ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ type: "spring", stiffness: 220, damping: 24, delay: 0.08 }}
            style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}
          >
            <div style={{
              width: "100%", maxWidth: 400, marginTop: 16,
              background: "rgba(139,124,246,0.08)", border: "1px solid rgba(139,124,246,0.18)",
              borderRadius: 24, padding: "16px 18px",
              display: "flex", alignItems: "center", gap: 14,
            }}>
              <div style={{
                flexShrink: 0, width: 44, height: 44, borderRadius: "50%",
                background: "#5B4FCF",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <PaperPlaneIcon />
              </div>
              <div>
                <p style={{ margin: 0, fontFamily: F, fontSize: 15, fontWeight: 800, color: "#fff", lineHeight: 1.3 }}>
                  You can invite again anytime
                </p>
                <p style={{ margin: 0, fontFamily: F, fontSize: 13.5, fontWeight: 500, color: "rgba(216,206,255,0.75)", lineHeight: 1.3 }}>
                  from your parent dashboard.
                </p>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={onNext}
              style={{
                width: "100%", maxWidth: 400, height: 58, marginTop: 20,
                borderRadius: 29,
                background: "linear-gradient(180deg, #9D6FE8 0%, #7C3AED 100%)",
                border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                fontFamily: F, fontSize: 18, fontWeight: 900, color: "#fff",
                boxShadow: "0 6px 0 #5B21B6, 0 10px 28px rgba(109,40,217,0.50)",
                touchAction: "manipulation",
              }}
            >
              Got it
            </button>

            {/* Footer */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 16 }}>
              <ShieldIcon color={PURPLE} />
              <span style={{
                fontFamily: F, fontSize: 13, fontWeight: 600,
                color: "rgba(216,206,255,0.7)",
              }}>
                Private &bull; Secure &bull; Just for you
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
