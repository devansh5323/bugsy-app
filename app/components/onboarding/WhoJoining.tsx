"use client";

import type { CSSProperties } from "react";
import { motion } from "framer-motion";
import { NightRoomBackdrop } from "./WhoAreYou";

const F = "var(--font-nunito), system-ui, sans-serif";

function Sparkle({ style }: { style: CSSProperties }) {
  return (
    <span aria-hidden style={{ position: "absolute", lineHeight: 1, pointerEvents: "none", ...style }}>
      ✦
    </span>
  );
}

export function WhoJoining({
  onChild,
  onParent,
}: {
  onChild: () => void;
  onParent: () => void;
}) {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <NightRoomBackdrop minimal hideRug hideFloor />

      {/* ── Centered column: title + cards together ── */}
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "0 20px 36px",
        gap: 32,
        zIndex: 5,
      }}>

        {/* Title block */}
        <div style={{ textAlign: "center", padding: "0 8px" }}>
          <h1 style={{
            fontFamily: F, fontWeight: 900, fontSize: 42,
            color: "#fff", margin: 0, lineHeight: 1.1, letterSpacing: -0.5,
          }}>
            Who's joining
          </h1>
          <h1 style={{
            fontFamily: F, fontWeight: 900, fontSize: 42,
            color: "#A78BFA", margin: "2px 0 0", lineHeight: 1.1, letterSpacing: -0.5,
          }}>
            me today?
          </h1>
          <div style={{
            fontSize: 44, margin: "16px 0 10px", lineHeight: 1,
            filter: "drop-shadow(0 0 10px rgba(255,200,30,0.75))",
          }}>⭐</div>
          <p style={{
            fontFamily: F, fontSize: 15, fontWeight: 500,
            color: "rgba(255,255,255,0.52)", margin: 0, lineHeight: 1.6,
          }}>
            We'll make the adventure<br />just right for you.
          </p>
        </div>

        {/* Cards */}
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 14 }}>

          {/* It's Me */}
          <motion.button
            whileHover={{ scale: 1.04, boxShadow: "0 0 44px rgba(139,92,246,0.72), 0 10px 30px rgba(109,40,217,0.5)" }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 320, damping: 22 }}
            onClick={onChild}
            style={{
              display: "flex", alignItems: "center",
              background: "#241870",
              border: "2px solid rgba(139,92,246,0.85)",
              borderRadius: 20, padding: "13px 14px",
              cursor: "pointer", width: "100%", textAlign: "left",
              position: "relative", overflow: "visible",
              boxShadow: "0 4px 22px rgba(109,40,217,0.22)",
            }}
          >
            <Sparkle style={{ top: -4, left: 10, fontSize: 13, color: "rgba(200,178,255,0.95)" }} />
            <div style={{
              width: 68, height: 68, borderRadius: "50%", flexShrink: 0,
              background: "radial-gradient(circle at 40% 38%, #6D4AE8, #3A1FAD)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 38,
              boxShadow: "0 0 0 3px rgba(139,92,246,0.35), 0 4px 14px rgba(109,40,217,0.45)",
            }}>👦</div>
            <div style={{ flex: 1, paddingLeft: 14 }}>
              <div style={{ fontFamily: F, fontSize: 20, fontWeight: 800, color: "#fff", lineHeight: 1.25 }}>
                It's Me
              </div>
              <div style={{ fontFamily: F, fontSize: 13, fontWeight: 500, color: "rgba(195,178,255,0.78)", marginTop: 3 }}>
                I'll play on my own
              </div>
            </div>
            <div style={{ position: "relative", flexShrink: 0, marginRight: 2 }}>
              <Sparkle style={{ top: -10, right: 0,  fontSize: 12, color: "rgba(200,178,255,0.95)" }} />
              <Sparkle style={{ top:   4, right: -8, fontSize:  9, color: "rgba(200,178,255,0.7)"  }} />
              <div style={{
                width: 50, height: 50, borderRadius: "50%", background: "#7C3AED",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22, color: "#fff", fontWeight: 700,
                boxShadow: "0 4px 14px rgba(109,40,217,0.55)",
              }}>→</div>
            </div>
          </motion.button>

          {/* I'm a Parent */}
          <motion.button
            whileHover={{ scale: 1.04, boxShadow: "0 0 44px rgba(251,146,60,0.65), 0 10px 30px rgba(194,65,12,0.5)" }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 320, damping: 22 }}
            onClick={onParent}
            style={{
              display: "flex", alignItems: "center",
              background: "#0F0807",
              border: "2px solid rgba(249,115,22,0.72)",
              borderRadius: 20, padding: "13px 14px",
              cursor: "pointer", width: "100%", textAlign: "left",
              position: "relative", overflow: "visible",
              boxShadow: "0 4px 22px rgba(0,0,0,0.42)",
            }}
          >
            <div style={{
              width: 68, height: 68, borderRadius: "50%", flexShrink: 0,
              background: "#1C1008",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 38,
              boxShadow: "0 0 0 3px rgba(249,115,22,0.28), 0 4px 14px rgba(0,0,0,0.45)",
            }}>👨‍👩‍👧</div>
            <div style={{ flex: 1, paddingLeft: 14 }}>
              <div style={{ fontFamily: F, fontSize: 20, fontWeight: 800, color: "#fff", lineHeight: 1.25 }}>
                I'm a Parent
              </div>
              <div style={{ fontFamily: F, fontSize: 13, fontWeight: 500, color: "rgba(255,195,140,0.72)", marginTop: 3 }}>
                I'm here to guide and help
              </div>
            </div>
            <div style={{ position: "relative", flexShrink: 0, marginRight: 2 }}>
              <Sparkle style={{ top: -10, right: 0,  fontSize: 12, color: "rgba(255,180,80,0.95)" }} />
              <Sparkle style={{ top:   4, right: -8, fontSize:  9, color: "rgba(255,180,80,0.7)"  }} />
              <div style={{
                width: 50, height: 50, borderRadius: "50%", background: "#F97316",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22, color: "#fff", fontWeight: 700,
                boxShadow: "0 4px 14px rgba(194,65,12,0.55)",
              }}>→</div>
            </div>
          </motion.button>

        </div>
      </div>
    </div>
  );
}
