"use client";

import React, { useState } from "react";
import { Bobo } from "../Mascot";
import { NightRoomBackdrop } from "./WhoAreYou";
import type { Relationship } from "../../lib/data";

type RoleKey = "mom" | "dad" | "caregiver" | "guardian";

const ROLES: { key: RoleKey; rel: Relationship; label: string; emoji: string }[] = [
  { key: "mom",       rel: "mom",      label: "Mom",       emoji: "👩"     },
  { key: "dad",       rel: "dad",      label: "Dad",       emoji: "🧔"     },
  { key: "caregiver", rel: "guardian", label: "Caregiver", emoji: "🧑‍⚕️" },
  { key: "guardian",  rel: "guardian", label: "Guardian",  emoji: "👪"     },
];

export function ParentIntro({
  tint,
  parentName,
  setParentName,
  relationship,
  setRelationship,
  onNext,
  onBack,
}: {
  tint: number;
  parentName: string;
  setParentName: (n: string) => void;
  relationship: Relationship | null;
  setRelationship: (r: Relationship) => void;
  onNext: () => void;
  onBack?: () => void;
}) {
  const [hoveredRole, setHoveredRole] = useState<RoleKey | null>(null);
  const [selectedRole, setSelectedRole] = useState<RoleKey | null>(() => {
    if (!relationship) return null;
    if (relationship === "mom") return "mom";
    if (relationship === "dad") return "dad";
    return "guardian";
  });

  const handleRolePick = (role: (typeof ROLES)[0]) => {
    setSelectedRole(role.key);
    setRelationship(role.rel);
  };

  const canContinue = selectedRole !== null && parentName.trim().length > 0;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        color: "#fff",
      }}
    >
      <NightRoomBackdrop minimal hideRug />

      {/* ── Back button ─────────────────────────────────────────── */}
      {onBack && (
        <button
          onClick={onBack}
          style={{
            position: "absolute",
            top: 18,
            left: 16,
            zIndex: 10,
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.15)",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            color: "white",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            touchAction: "manipulation",
          }}
        >
          ‹
        </button>
      )}

      {/* ── TOP: speech bubble + Bugsy centered ─────────────────── */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-end",
          minHeight: 0,
          paddingBottom: 0,
        }}
      >
        {/* Speech bubble */}
        <div
          style={{
            position: "relative",
            background: "#fff8f0",
            borderRadius: 22,
            padding: "14px 20px",
            maxWidth: 260,
            textAlign: "center",
            boxShadow: "0 4px 20px rgba(0,0,0,0.18)",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-nunito), system-ui",
              fontSize: 12,
              fontWeight: 700,
              color: "#1e1430",
              margin: "0 0 4px",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            Welcome, grown-up! 🌙
          </p>
          <p
            style={{
              fontFamily: "var(--font-nunito), system-ui",
              fontSize: 22,
              fontWeight: 900,
              margin: "0 0 6px",
              lineHeight: 1.15,
              color: "#C026D3",
            }}
          >
            Nice to meet you!
          </p>
          <p
            style={{
              fontFamily: "var(--font-nunito), system-ui",
              fontSize: 13,
              fontWeight: 600,
              color: "#1e1430",
              margin: 0,
            }}
          >
            Let&apos;s start this journey together 💗
          </p>
          {/* Tail pointing down toward Bugsy */}
          <div
            style={{
              position: "absolute",
              bottom: -13,
              left: "50%",
              transform: "translateX(-50%)",
              width: 0,
              height: 0,
              borderLeft: "12px solid transparent",
              borderRight: "12px solid transparent",
              borderTop: "14px solid #fff8f0",
            }}
          />
        </div>

        <Bobo mood="excited" tint={tint} size={200} tailWag noSparkles />
      </div>

      {/* ── BOTTOM CARD ─────────────────────────────────────────── */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          background: "linear-gradient(180deg, #1C0F42 0%, #130828 100%)",
          borderRadius: "26px 26px 0 0",
          padding: "18px 14px 22px",
          boxSizing: "border-box",
          boxShadow: "0 -4px 32px rgba(0,0,0,0.45)",
        }}
      >
        {/* Section: who are you */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
          <span style={{ fontSize: 17 }}>🐾</span>
          <span
            style={{
              fontFamily: "var(--font-nunito), system-ui",
              fontSize: 16,
              fontWeight: 800,
              color: "rgba(255,255,255,0.92)",
            }}
          >
            Who are you?
          </span>
          <span style={{ marginLeft: "auto", fontSize: 13, color: "#A78BFA" }}>
            ✦
          </span>
        </div>

        {/* 2×2 role cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
            marginBottom: 14,
          }}
        >
          {ROLES.map((role) => {
            const sel = selectedRole === role.key;
            return (
              <button
                key={role.key}
                onClick={() => handleRolePick(role)}
                onMouseEnter={() => setHoveredRole(role.key)}
                onMouseLeave={() => setHoveredRole(null)}
                style={{
                  borderRadius: 16,
                  border: `2.5px solid ${sel ? "#C026D3" : hoveredRole === role.key ? "rgba(167,139,250,0.6)" : "rgba(255,255,255,0.12)"}`,
                  background: sel ? "#2E1660" : hoveredRole === role.key ? "#2A1660" : "#231256",
                  cursor: "pointer",
                  padding: "12px 8px 10px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 7,
                  position: "relative",
                  touchAction: "manipulation",
                  boxShadow: sel
                    ? "0 4px 20px rgba(192,38,211,0.35)"
                    : hoveredRole === role.key
                    ? "0 6px 24px rgba(139,92,246,0.30)"
                    : "0 2px 8px rgba(0,0,0,0.3)",
                  transform: hoveredRole === role.key && !sel ? "translateY(-2px)" : "none",
                  transition: "border-color 0.18s, box-shadow 0.18s, background 0.18s, transform 0.18s",
                }}
              >
                {sel && (
                  <div
                    style={{
                      position: "absolute",
                      top: 8,
                      left: 8,
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      background: "#C026D3",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 13,
                      color: "white",
                      fontWeight: 900,
                    }}
                  >
                    ✓
                  </div>
                )}
                <div
                  style={{
                    width: 58,
                    height: 58,
                    borderRadius: "50%",
                    background: "#F5EFE6",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 34,
                    lineHeight: 1,
                  }}
                >
                  {role.emoji}
                </div>
                <span
                  style={{
                    fontFamily: "var(--font-nunito), system-ui",
                    fontSize: 14,
                    fontWeight: 800,
                    color: sel ? "#E0BBFF" : "rgba(255,255,255,0.80)",
                    transition: "color 0.15s",
                  }}
                >
                  {role.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Section: name */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
          <span style={{ fontSize: 17 }}>🐾</span>
          <span
            style={{
              fontFamily: "var(--font-nunito), system-ui",
              fontSize: 16,
              fontWeight: 800,
              color: "rgba(255,255,255,0.92)",
            }}
          >
            What should I call you?
          </span>
        </div>

        {/* Name input — locked until a role is chosen */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "#160B36",
            borderRadius: 14,
            border: selectedRole ? "2.5px solid #C026D3" : "2.5px solid transparent",
            padding: "0 14px",
            marginBottom: 14,
            height: 52,
            boxShadow: selectedRole
              ? parentName.trim()
                ? "0 0 0 3px rgba(192,38,211,0.22), 0 0 14px rgba(192,38,211,0.25), inset 0 1px 4px rgba(0,0,0,0.3)"
                : "inset 0 1px 4px rgba(0,0,0,0.3)"
              : "inset 0 1px 4px rgba(0,0,0,0.3)",
            transition: "border-color 0.3s, box-shadow 0.3s",
          }}
        >
          <span style={{ fontSize: 18, marginRight: 10, opacity: 0.6 }}>🙂</span>
          <input
            value={parentName}
            onChange={(e) => setParentName(e.target.value)}
            placeholder="Enter your name"
            disabled={!selectedRole}
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              fontFamily: "var(--font-nunito), system-ui",
              fontSize: 15,
              fontWeight: 600,
              color: "white",
              background: "transparent",
              cursor: selectedRole ? "text" : "default",
            }}
          />
          {parentName.trim().length > 0 && (
            <span style={{ fontSize: 16, marginLeft: 6 }}>✓</span>
          )}
        </div>

        {/* Continue button */}
        <button
          onClick={canContinue ? onNext : undefined}
          style={{
            width: "100%",
            height: 54,
            borderRadius: 18,
            background: canContinue
              ? "linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)"
              : "rgba(255,255,255,0.12)",
            border: "none",
            cursor: canContinue ? "pointer" : "default",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            fontFamily: "var(--font-nunito), system-ui",
            fontSize: 18,
            fontWeight: 900,
            color: "white",
            boxShadow: canContinue ? "0 6px 20px rgba(90,33,182,0.40)" : "none",
            transition: "background 0.25s, box-shadow 0.25s",
            touchAction: "manipulation",
          }}
        >
          Continue
          <span style={{ fontSize: 18 }}>→</span>
        </button>

      </div>
    </div>
  );
}
