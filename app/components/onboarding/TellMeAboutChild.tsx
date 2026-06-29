"use client";

import { Bobo } from "../Mascot";
import { NightRoomBackdrop } from "./WhoAreYou";

const AGE_OPTIONS = Array.from({ length: 12 }, (_, i) => ({
  value: i + 1,
  label: i === 0 ? "1 Year" : `${i + 1} Years`,
}));

const SPIRAL_COUNT = 11;

export function TellMeAboutChild({
  tint,
  childName,
  setChildName,
  childAge,
  setChildAge,
  onNext,
  onBack,
}: {
  tint: number;
  childName: string;
  setChildName: (n: string) => void;
  childAge: number | null;
  setChildAge: (a: number | null) => void;
  onNext: () => void;
  onBack?: () => void;
}) {
  const name       = childName.trim() || "Your Child";
  const possessive = childName.trim() ? `${childName.trim()}'s` : "Your Child's";

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <NightRoomBackdrop minimal hideRug />

      {/* Back button */}
      {onBack && (
        <button
          onClick={onBack}
          style={{
            position: "absolute",
            top: 50,
            left: 16,
            zIndex: 10,
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: "#5B21B6",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
            color: "white",
            boxShadow: "0 4px 14px rgba(0,0,0,0.4)",
            touchAction: "manipulation",
          }}
        >
          ←
        </button>
      )}

      {/* Music button */}
      <button
        style={{
          position: "absolute",
          top: 50,
          right: 16,
          zIndex: 10,
          width: 44,
          height: 44,
          borderRadius: "50%",
          background: "#5B21B6",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
          boxShadow: "0 4px 14px rgba(0,0,0,0.4)",
          touchAction: "manipulation",
        }}
      >
        🎵
      </button>

      {/* ── Page body ── */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "92px 16px 14px",
          width: "100%",
          boxSizing: "border-box",
          minHeight: 0,
        }}
      >
        {/* ── Main area: book + cat + floor decorations ── */}
        <div
          style={{
            flex: 1,
            width: "100%",
            maxWidth: 400,
            position: "relative",
            minHeight: 0,
          }}
        >
          {/* ── Book section occupies top portion, leaves 85px for floor ── */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 85,
            }}
          >
            {/* Spiral coil rings along left edge */}
            {Array.from({ length: SPIRAL_COUNT }, (_, j) => {
              const pct = (j / (SPIRAL_COUNT - 1)) * 92 + 4; // 4%…96%
              return (
                <div
                  key={j}
                  style={{
                    position: "absolute",
                    left: 16,
                    top: `${pct}%`,
                    transform: "translate(-50%, -50%)",
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    background: "transparent",
                    border: "6px solid #5B21B6",
                    boxShadow:
                      "0 2px 6px rgba(0,0,0,0.55), inset 0 1px 2px rgba(255,255,255,0.12)",
                    zIndex: 5,
                  }}
                />
              );
            })}

            {/* Purple bookmark strip — right edge */}
            <div
              style={{
                position: "absolute",
                right: 0,
                top: 0,
                bottom: 0,
                width: 14,
                background: "#5B21B6",
                borderRadius: "0 18px 18px 0",
                boxShadow: "-2px 0 6px rgba(0,0,0,0.20)",
                zIndex: 2,
              }}
            />

            {/* Open book card */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 26,   // clear of spiral centres
                right: 12,  // clear of bookmark
                bottom: 0,
                borderRadius: 18,
                background: "#F8ECD8",
                display: "flex",
                flexDirection: "row",
                overflow: "hidden",
                boxShadow:
                  "0 10px 36px rgba(0,0,0,0.45), 0 2px 8px rgba(0,0,0,0.20), inset 0 0 0 1px rgba(255,255,255,0.50)",
              }}
            >
              {/* ── LEFT PAGE ── */}
              <div
                style={{
                  flex: "0 0 44%",
                  padding: "16px 10px 14px 16px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Step badge + heading */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 8,
                    marginBottom: 6,
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: "#6D28D9",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      boxShadow: "0 2px 8px rgba(109,40,217,0.55)",
                    }}
                  >
                    <span
                      style={{
                        color: "#fff",
                        fontFamily: "var(--font-nunito), system-ui",
                        fontWeight: 900,
                        fontSize: 16,
                      }}
                    >
                      5
                    </span>
                  </div>
                  <h1
                    style={{
                      fontFamily: "var(--font-nunito), system-ui",
                      fontSize: 16,
                      fontWeight: 900,
                      color: "#1A1040",
                      margin: 0,
                      lineHeight: 1.2,
                    }}
                  >
                    Tell Me About {name}
                  </h1>
                </div>

                {/* Subtitle */}
                <p
                  style={{
                    fontFamily: "var(--font-nunito), system-ui",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#3B1E7A",
                    margin: "0 0 10px",
                    lineHeight: 1.4,
                  }}
                >
                  Let&apos;s create {possessive} story. 💜
                </p>

                {/* Child avatar */}
                <div
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg, #6D28D9 0%, #A78BFA 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 10px",
                    boxShadow:
                      "0 0 0 4px #F8ECD8, 0 0 0 6px #fff, 0 4px 16px rgba(109,40,217,0.40)",
                    fontSize: 52,
                    userSelect: "none",
                    flexShrink: 0,
                  }}
                >
                  👧
                </div>

                {/* Quote */}
                <p
                  style={{
                    fontFamily: "var(--font-nunito), system-ui",
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#2D1A4A",
                    lineHeight: 1.55,
                    margin: 0,
                    flex: 1,
                  }}
                >
                  Every child is unique. I want to know {name} a little better.{" "}
                  💜
                </p>
              </div>

              {/* ── SPINE ── */}
              <div
                style={{
                  width: 14,
                  flexShrink: 0,
                  background:
                    "linear-gradient(to right, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0.04) 60%, transparent 100%)",
                }}
              />

              {/* ── RIGHT PAGE ── */}
              <div
                style={{
                  flex: 1,
                  padding: "18px 14px 14px 6px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Name label */}
                <label
                  style={{
                    fontFamily: "var(--font-nunito), system-ui",
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#2D1A4A",
                    marginBottom: 6,
                    display: "block",
                  }}
                >
                  {possessive} Name
                </label>

                {/* Name input */}
                <input
                  type="text"
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  placeholder="Enter name"
                  style={{
                    width: "100%",
                    height: 44,
                    borderRadius: 12,
                    border: "1.5px solid #DDD0F0",
                    background: "#FFFFFF",
                    padding: "0 14px",
                    fontSize: 15,
                    fontFamily: "var(--font-nunito), system-ui",
                    fontWeight: 600,
                    color: "#1A1040",
                    outline: "none",
                    boxSizing: "border-box",
                    marginBottom: 16,
                  }}
                />

                {/* Age label */}
                <label
                  style={{
                    fontFamily: "var(--font-nunito), system-ui",
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#2D1A4A",
                    marginBottom: 6,
                    display: "block",
                  }}
                >
                  {possessive} Age
                </label>

                {/* Age dropdown */}
                <div style={{ position: "relative" }}>
                  <select
                    value={childAge ?? ""}
                    onChange={(e) =>
                      setChildAge(
                        e.target.value ? parseInt(e.target.value) : null,
                      )
                    }
                    style={{
                      width: "100%",
                      height: 44,
                      borderRadius: 12,
                      border: "1.5px solid #DDD0F0",
                      background: "#FFFFFF",
                      padding: "0 36px 0 14px",
                      fontSize: 15,
                      fontFamily: "var(--font-nunito), system-ui",
                      fontWeight: 600,
                      color: childAge ? "#1A1040" : "#9CA3AF",
                      outline: "none",
                      WebkitAppearance: "none",
                      appearance: "none",
                      cursor: "pointer",
                      boxSizing: "border-box",
                    }}
                  >
                    <option value="">Select age</option>
                    {AGE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <span
                    style={{
                      position: "absolute",
                      right: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#7C3AED",
                      pointerEvents: "none",
                      fontSize: 14,
                      fontWeight: 800,
                    }}
                  >
                    ▼
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Bugsy cat — outside book, bottom-right ── */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              right: 8,
              zIndex: 8,
            }}
          >
            <Bobo mood="waving" tint={tint} size={90} />
          </div>

          {/* ── Floor decorations — rainbow + blocks, bottom-left ── */}
          <div
            style={{
              position: "absolute",
              bottom: 2,
              left: 28,
              zIndex: 6,
              display: "flex",
              alignItems: "flex-end",
              gap: 4,
            }}
          >
            <span style={{ fontSize: 36, lineHeight: 1 }}>🌈</span>
            <div
              style={{
                display: "flex",
                gap: 3,
                alignItems: "flex-end",
                marginBottom: 2,
              }}
            >
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 5,
                  background: "#EC4899",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.35)",
                }}
              />
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 5,
                  background: "#6D28D9",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.35)",
                }}
              />
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 5,
                  background: "#F59E0B",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.35)",
                }}
              />
            </div>
          </div>
        </div>

        {/* ── CTA button ── */}
        <button
          onClick={onNext}
          style={{
            width: "100%",
            maxWidth: 400,
            height: 56,
            borderRadius: 28,
            background: "#7C3AED",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            fontFamily: "var(--font-nunito), system-ui",
            fontSize: 18,
            fontWeight: 900,
            color: "white",
            boxShadow: "0 6px 20px rgba(124,58,237,0.55)",
            touchAction: "manipulation",
            marginTop: 10,
            flexShrink: 0,
          }}
        >
          Next 🐾
        </button>
      </div>
    </div>
  );
}
