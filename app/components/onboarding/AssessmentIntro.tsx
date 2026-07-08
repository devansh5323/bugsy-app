"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bobo } from "../Mascot";
import { NightRoomBackdrop } from "./WhoAreYou";

const F = "var(--font-nunito), system-ui, sans-serif";

export function AssessmentIntro({
  tint,
  onNext,
  onSkip,
  onBack,
}: {
  tint: number;
  onNext: () => void;
  onSkip: () => void;
  onBack?: () => void;
}) {
  // step: 0=nothing, 1=mascot, 2=title, 3=sub, 4=card1, 5=card2, 6=trust, 7=CTA
  const [step, setStep] = useState(0);

  useEffect(() => {
    const ts = [
      setTimeout(() => setStep(1),  200),
      setTimeout(() => setStep(2),  1100),
      setTimeout(() => setStep(3),  1700),
      setTimeout(() => setStep(4),  2300),
      setTimeout(() => setStep(5),  2800),
      setTimeout(() => setStep(6),  3300),
      setTimeout(() => setStep(7),  3900),
    ];
    return () => ts.forEach(clearTimeout);
  }, []);

  const fade = (threshold: number) => ({
    animate: { opacity: step >= threshold ? 1 : 0 },
    transition: { duration: 0.45 },
  });

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column" }}>
      <NightRoomBackdrop minimal hideRug hideFloor />

      {/* Back button */}
      {onBack && (
        <button
          onClick={onBack}
          style={{
            position: "absolute", top: 52, left: 16, zIndex: 40,
            width: 46, height: 46, borderRadius: 14,
            background: "rgba(59,31,140,0.82)", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: 22, fontWeight: 700,
            boxShadow: "0 2px 10px rgba(0,0,0,0.28)",
          }}
        >‹</button>
      )}

      {/* Mascot — absolutely positioned, conditional is fine (doesn't affect flow) */}
      {step >= 1 && (
        <div style={{
          position: "absolute", top: "44%", left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 3,
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.72, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 1.0 }}
            >
              <Bobo mood="excited" tint={tint} size={210} animate armsDown />
            </motion.div>
          </motion.div>
        </div>
      )}

      {/* Scrollable content */}
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", paddingInline: 22,
        overflowY: "auto",
        position: "relative", zIndex: 1,
      }}>

        {/* TOP: title + subtitle — always in DOM, fade in */}
        <div style={{
          paddingTop: 120, width: "100%",
          display: "flex", flexDirection: "column", alignItems: "center",
        }}>
          <motion.h1
            {...fade(2)}
            style={{
              fontFamily: F, fontSize: 30, fontWeight: 900, lineHeight: 1.2,
              textAlign: "center", color: "#fff", margin: "0 0 10px",
            }}
          >
            Now it&apos;s time to
            <br />
            get to know{" "}
            <span style={{ color: "#FBBF24" }}>your child.</span>
          </motion.h1>

          <motion.p
            {...fade(3)}
            style={{
              fontFamily: F, fontSize: 15, fontWeight: 500,
              color: "rgba(220,210,255,0.88)",
              textAlign: "center", lineHeight: 1.55, margin: 0,
            }}
          >
            Complete a quick assessment so we can
            <br />
            personalize their first mission. 💜
          </motion.p>
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* BOTTOM SECTION — always in DOM, each fades in at the right step */}
        <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 120 }}>

          {/* Two info cards — slots always in DOM so no width jump */}
          <div style={{ display: "flex", gap: 12, width: "100%", marginBottom: 12 }}>
            <motion.div style={{ flex: 1 }} {...fade(4)}>
              <InfoCard icon="🕐" label="Time" value="3 mins" />
            </motion.div>
            <motion.div style={{ flex: 1 }} {...fade(5)}>
              <InfoCard icon="❓" label="Questions" value="15 questions" />
            </motion.div>
          </div>

          {/* Trust badge */}
          <motion.div
            {...fade(6)}
            style={{
              width: "100%", background: "rgba(12,5,42,0.88)", borderRadius: 18,
              border: "1.5px solid rgba(124,58,237,0.35)",
              padding: "14px 16px", display: "flex", flexDirection: "row",
              alignItems: "flex-start", gap: 14,
              boxShadow: "0 4px 20px rgba(0,0,0,0.35)",
            }}
          >
            <div style={{
              width: 44, height: 44, borderRadius: 12, flexShrink: 0,
              background: "rgba(124,58,237,0.25)", border: "1.5px solid rgba(124,58,237,0.55)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
            }}>🛡️</div>
            <p style={{
              fontFamily: F, fontSize: 13.5, fontWeight: 500,
              color: "rgba(220,210,255,0.88)", lineHeight: 1.55, margin: 0,
            }}>
              Your answers help us understand your child better and create the{" "}
              <span style={{ color: "#FBBF24", fontWeight: 700 }}>best experience.</span>
            </p>
          </motion.div>

        </div>

      </div>

      {/* CTAs — always in DOM so no layout jump when they appear */}
      <motion.div
        {...fade(7)}
        style={{
          position: "relative", zIndex: 2,
          padding: "12px 22px 36px",
          display: "flex", flexDirection: "column", gap: 12,
        }}
      >
        <button
          onClick={onNext}
          style={{
            width: "100%", height: 64, borderRadius: 32,
            background: "linear-gradient(180deg, #9D6FE8 0%, #7C3AED 100%)",
            border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: F, fontSize: 20, fontWeight: 900, color: "#fff",
            boxShadow: "0 6px 0 #5B21B6, 0 10px 28px rgba(109,40,217,0.50)",
            touchAction: "manipulation",
          }}
        >
          Start Assessment
        </button>

        <button
          onClick={onSkip}
          style={{
            width: "100%", height: 56, borderRadius: 28,
            background: "transparent",
            border: "2px solid rgba(124,58,237,0.50)",
            cursor: "pointer",
            fontFamily: F, fontSize: 17, fontWeight: 700, color: "#A78BFA",
            touchAction: "manipulation",
          }}
        >
          Skip for now
        </button>
      </motion.div>
    </div>
  );
}

function InfoCard({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div style={{
      background: "rgba(12,5,42,0.88)", borderRadius: 20,
      border: "1.5px solid rgba(124,58,237,0.35)",
      padding: "18px 16px", display: "flex", flexDirection: "row",
      alignItems: "center", gap: 14,
      boxShadow: "0 4px 20px rgba(0,0,0,0.35)",
    }}>
      <div style={{
        width: 52, height: 52, borderRadius: "50%", flexShrink: 0,
        background: "rgba(124,58,237,0.25)", border: "1.5px solid rgba(124,58,237,0.55)",
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24,
      }}>{icon}</div>
      <div>
        <div style={{ fontFamily: F, fontSize: 13, fontWeight: 600, color: "rgba(200,190,255,0.75)" }}>{label}</div>
        <div style={{ fontFamily: F, fontSize: 18, fontWeight: 900, color: "#FBBF24" }}>{value}</div>
      </div>
    </div>
  );
}
