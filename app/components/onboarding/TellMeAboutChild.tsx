"use client";

import { motion } from "framer-motion";
import { NightRoomBackdrop } from "./WhoAreYou";

const AGE_OPTIONS = Array.from({ length: 11 }, (_, i) => ({
  value: i + 5,
  label: `${i + 5} Years`,
}));

const F = "var(--font-nunito), system-ui, sans-serif";

export function TellMeAboutChild({
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
  onBack?: () => void;
}) {
  const canContinue = childName.trim().length > 0 && childAge !== null;

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column" }}>
      <style>{`.tmac-scroll::-webkit-scrollbar{display:none}`}</style>
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
            color: "#fff", fontSize: 20, fontWeight: 400,
            boxShadow: "0 2px 10px rgba(0,0,0,0.28)",
          }}
        >‹</button>
      )}

      {/* Scrollable content */}
      <div className="tmac-scroll" style={{
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", paddingInline: 22,
        overflowY: "auto",
        position: "relative", zIndex: 1,
        paddingBottom: 120,
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}>

        {/* Star + Title + Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.44 }}
          style={{ paddingTop: 140, width: "100%", textAlign: "center" }}
        >
          <h1 style={{
            fontFamily: F, fontSize: 32, fontWeight: 900, lineHeight: 1.2,
            color: "#fff", margin: "0 0 10px",
          }}>
            Let’s understand{" "}
            <span style={{ color: "#A78BFA" }}>your child</span>
          </h1>
          <p style={{
            fontFamily: F, fontSize: 15, fontWeight: 500,
            color: "rgba(220,210,255,0.80)", margin: 0, lineHeight: 1.55,
          }}>
            Answer a few quick questions so<br />
            Fumi can personalize their first mission.💜
          </p>
        </motion.div>


        {/* Nickname card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.42, delay: 0.28 }}
          style={{
            width: "100%", marginTop: 12,
            background: "rgba(20,10,55,0.90)", borderRadius: 22,
            border: "1.5px solid rgba(124,58,237,0.30)",
            padding: "18px 18px", boxShadow: "0 4px 20px rgba(0,0,0,0.35)",
            display: "flex", flexDirection: "column", gap: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 50, height: 50, borderRadius: "50%", flexShrink: 0,
              background: "rgba(124,58,237,0.28)", border: "1.5px solid rgba(124,58,237,0.50)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26,
            }}>🧒</div>
            <div>
              <div style={{ fontFamily: F, fontSize: 15, fontWeight: 800, color: "#fff" }}>
                What&apos;s your child&apos;s nickname?
              </div>
            </div>
          </div>
          <div style={{ position: "relative" }}>
            <input
              type="text"
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              placeholder="Enter nickname"
              style={{
                width: "100%", height: 52, borderRadius: 14,
                background: "rgba(255,255,255,0.07)",
                border: "1.5px solid rgba(124,58,237,0.35)",
                padding: "0 44px 0 16px",
                fontFamily: F, fontSize: 15, fontWeight: 600,
                color: "#fff", outline: "none", boxSizing: "border-box",
              }}
            />
            <span style={{
              position: "absolute", right: 14, top: "50%",
              transform: "translateY(-50%)", fontSize: 18, pointerEvents: "none",
            }}>⭐</span>
          </div>
        </motion.div>

        {/* Age card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.42, delay: 0.38 }}
          style={{
            width: "100%", marginTop: 14,
            background: "rgba(20,10,55,0.90)", borderRadius: 22,
            border: "1.5px solid rgba(124,58,237,0.30)",
            padding: "18px 18px", boxShadow: "0 4px 20px rgba(0,0,0,0.35)",
            display: "flex", flexDirection: "column", gap: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 50, height: 50, borderRadius: "50%", flexShrink: 0,
              background: "rgba(124,58,237,0.28)", border: "1.5px solid rgba(124,58,237,0.50)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24,
            }}>📅</div>
            <div>
              <div style={{ fontFamily: F, fontSize: 15, fontWeight: 800, color: "#fff" }}>
                How old is your child?
              </div>
            </div>
          </div>
          <div style={{ position: "relative" }}>
            <select
              value={childAge ?? ""}
              onChange={(e) => setChildAge(e.target.value ? parseInt(e.target.value) : null)}
              style={{
                width: "100%", height: 52, borderRadius: 14,
                background: "rgba(255,255,255,0.07)",
                border: "1.5px solid rgba(124,58,237,0.35)",
                padding: "0 40px 0 16px",
                fontFamily: F, fontSize: 15, fontWeight: 600,
                color: childAge ? "#fff" : "rgba(255,255,255,0.40)",
                outline: "none", WebkitAppearance: "none", appearance: "none",
                cursor: "pointer", boxSizing: "border-box",
              }}
            >
              <option value="" style={{ color: "#888" }}>Select age</option>
              {AGE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} style={{ color: "#000" }}>
                  {opt.label}
                </option>
              ))}
            </select>
            <span style={{
              position: "absolute", right: 16, top: "50%",
              transform: "translateY(-50%)",
              color: "#A78BFA", pointerEvents: "none", fontSize: 14,
            }}>▼</span>
          </div>
        </motion.div>


      </div>

      {/* CTA pinned to bottom */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.44, delay: 0.58 }}
        style={{ position: "relative", zIndex: 10, padding: "0 22px 36px" }}
      >
        <button
          onClick={onNext}
          disabled={!canContinue}
          style={{
            width: "100%", height: 64, borderRadius: 32,
            background: canContinue
              ? "linear-gradient(180deg, #9D6FE8 0%, #7C3AED 100%)"
              : "rgba(124,58,237,0.35)",
            border: "none", cursor: canContinue ? "pointer" : "not-allowed",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            fontFamily: F, fontSize: 20, fontWeight: 900, color: "#fff",
            boxShadow: canContinue ? "0 6px 0 #5B21B6, 0 10px 28px rgba(109,40,217,0.50)" : "none",
            touchAction: "manipulation",
          }}
        >
          Next
        </button>
      </motion.div>
    </div>
  );
}
