"use client";

import { Bobo } from "../Mascot";
import { NightRoomBackdrop } from "./WhoAreYou";
import type { Mood } from "../../lib/data";

const MILESTONES: {
  day: string;
  title: string;
  nodeEmoji: string;
  overlayEmoji?: string;
  tagline: string;
  desc: string;
  mood: Mood;
  right: boolean;
  tailWag?: boolean;
}[] = [
  {
    day: "DAY 1",
    title: "Build a Care Routine",
    nodeEmoji: "❤️",
    overlayEmoji: "💗",
    tagline: "Start the journey together",
    desc: "Meet Bugsy & start daily care missions.",
    mood: "happy",
    right: false,
    tailWag: true,
  },
  {
    day: "DAY 3",
    title: "Emotional Awareness",
    nodeEmoji: "🧠",
    tagline: "Understand feelings",
    desc: "Help Bugsy stay calm — practice self-control.",
    mood: "sleepy",
    right: true,
  },
  {
    day: "DAY 7",
    title: "Personal Responsibility",
    nodeEmoji: "⭐",
    overlayEmoji: "☑️",
    tagline: "Build real habits",
    desc: "Small tasks that build real habits.",
    mood: "cheer",
    right: false,
    tailWag: true,
  },
  {
    day: "DAY 14",
    title: "Grow Independence",
    nodeEmoji: "👑",
    overlayEmoji: "✨",
    tagline: "Grow together",
    desc: "Bugsy evolves as your child levels up.",
    mood: "excited",
    right: true,
    tailWag: true,
  },
];

const ROAD_START_MS    = 200;
const ROAD_DURATION_MS = 2400;
const FIRST_NODE_MS    = 600;
const BLOCK_MS         = 560;
const ENTER_DURATION   = 700;

export function ParentJourney({
  tint,
  childName,
  onNext,
  onBack,
}: {
  tint: number;
  childName: string;
  onNext: () => void;
  onBack?: () => void;
}) {
  const name = childName.trim() || "your child";

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        color: "#fff",
      }}
    >
      <NightRoomBackdrop minimal hideRug />

      {/* Back button */}
      {onBack && (
        <button
          onClick={onBack}
          style={{
            position: "absolute",
            top: 52,
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

      {/* Full-page content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: "100px 0 8px",
          boxSizing: "border-box",
          minHeight: 0,
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 8, paddingInline: 16 }}>
          <h1
            style={{
              fontFamily: "var(--font-nunito), system-ui",
              fontSize: 24,
              fontWeight: 900,
              margin: "0 0 2px",
              lineHeight: 1.1,
              color: "#fff",
            }}
          >
            Your Child&apos;s First
          </h1>
          <h1
            style={{
              fontFamily: "var(--font-nunito), system-ui",
              fontSize: 28,
              fontWeight: 900,
              margin: "0 0 5px",
              lineHeight: 1.1,
            }}
          >
            <span style={{ color: "#FFD234" }}>14 Days </span>
            <span style={{ color: "#FF9FD2" }}>of Adventure </span>
            <span style={{ color: "#A78BFA" }}>✨</span>
          </h1>
          <p
            style={{
              fontFamily: "var(--font-nunito), system-ui",
              fontSize: 13,
              fontWeight: 600,
              color: "#ffffff",
              margin: 0,
            }}
          >
            Every mission grows Bugsy — and your child 🛡️
          </p>
        </div>

        {/* Road + milestones — fills to wooden border */}
        <div
          style={{
            position: "relative",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-evenly",
            minHeight: 0,
          }}
        >
          {/* Road strip */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: 0,
              bottom: 0,
              transform: "translateX(-50%)",
              width: 10,
              background: "linear-gradient(180deg,#4C1D95 0%,#7C3AED 35%,#5B21B6 65%,#3B1F6A 100%)",
              borderRadius: 6,
              zIndex: 0,
              animation: `road-draw ${ROAD_DURATION_MS}ms cubic-bezier(0.4,0,0.2,1) ${ROAD_START_MS}ms both`,
            }}
          />

          {/* Road centre dashes */}
          {[0, 1, 2, 3, 4, 5, 6, 7].map((j) => (
            <div
              key={j}
              style={{
                position: "absolute",
                left: "50%",
                top: `${6 + j * 12}%`,
                transform: "translateX(-50%)",
                width: 2,
                height: "5%",
                background: "rgba(255,255,255,0.22)",
                borderRadius: 2,
                zIndex: 1,
                animation: `road-draw ${ROAD_DURATION_MS}ms cubic-bezier(0.4,0,0.2,1) ${ROAD_START_MS}ms both`,
              }}
            />
          ))}

          {/* Milestone rows */}
          {MILESTONES.map((m, i) => {
            const nodeDelay = FIRST_NODE_MS + i * BLOCK_MS;
            const itemDelay = nodeDelay + 60;
            const easing    = "cubic-bezier(0.22,1,0.36,1)";
            const dur       = `${ENTER_DURATION}ms`;
            const cardAnim  = `${m.right ? "journey-slide-right" : "journey-slide-left"} ${dur} ${easing} ${itemDelay}ms both`;
            const tagAnim   = `${m.right ? "journey-slide-left" : "journey-slide-right"} ${dur} ${easing} ${itemDelay + 40}ms both`;
            const nodeAnim  = `pop-in 0.45s ${easing} ${nodeDelay}ms both`;

            return (
              <div
                key={m.day}
                style={{
                  display: "flex",
                  alignItems: "center",
                  position: "relative",
                  zIndex: 2,
                }}
              >
                {/* LEFT ZONE */}
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    paddingLeft: 12,
                    paddingRight: 8,
                  }}
                >
                  {!m.right ? (
                    <div style={{ animation: cardAnim, width: "100%" }}>
                      <MilestoneCard m={m} tint={tint} bugsyOnRight />
                    </div>
                  ) : (
                    <div style={{ animation: tagAnim, textAlign: "right" }}>
                      <p
                        style={{
                          fontFamily: "var(--font-nunito), system-ui",
                          fontSize: 11,
                          fontWeight: 600,
                          fontStyle: "italic",
                          color: "rgba(255,240,190,0.80)",
                          margin: "0 0 2px",
                          lineHeight: 1.4,
                        }}
                      >
                        {m.tagline}
                      </p>
                      <span style={{ fontSize: 14, opacity: 0.7 }}>↩</span>
                    </div>
                  )}
                </div>

                {/* ROAD NODE */}
                <div
                  style={{
                    width: 36,
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 3,
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg,#C026D3,#7C3AED)",
                      border: "3px solid rgba(255,255,255,0.9)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 0 12px rgba(192,38,211,0.7),0 0 24px rgba(124,58,237,0.35)",
                      fontSize: 15,
                      animation: nodeAnim,
                    }}
                  >
                    {m.nodeEmoji}
                  </div>
                </div>

                {/* RIGHT ZONE */}
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    paddingLeft: 8,
                    paddingRight: 12,
                  }}
                >
                  {m.right ? (
                    <div style={{ animation: cardAnim, width: "100%" }}>
                      <MilestoneCard m={m} tint={tint} bugsyOnRight={false} />
                    </div>
                  ) : (
                    <div style={{ animation: tagAnim }}>
                      <p
                        style={{
                          fontFamily: "var(--font-nunito), system-ui",
                          fontSize: 11,
                          fontWeight: 600,
                          fontStyle: "italic",
                          color: "rgba(255,240,190,0.80)",
                          margin: "0 0 2px",
                          lineHeight: 1.4,
                        }}
                      >
                        {m.tagline}
                      </p>
                      <span style={{ fontSize: 14, opacity: 0.7 }}>↪</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          padding: "12px 16px 20px",
          background: "linear-gradient(to top,rgba(13,6,33,0.98) 70%,transparent)",
        }}
      >
        <button
          onClick={onNext}
          style={{
            width: "100%",
            height: 56,
            borderRadius: 20,
            background: "linear-gradient(135deg,#7C3AED 0%,#5B21B6 100%)",
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
            boxShadow: "0 6px 20px rgba(90,33,182,0.45)",
            animation: "cta-glow-pulse 2.2s ease-in-out infinite",
            touchAction: "manipulation",
          }}
        >
          Start {name}&apos;s Journey
        </button>
      </div>
    </div>
  );
}

function MilestoneCard({
  m,
  tint,
  bugsyOnRight,
}: {
  m: (typeof MILESTONES)[0];
  tint: number;
  bugsyOnRight: boolean;
}) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.97)",
        borderRadius: 16,
        padding: "8px 8px 8px 10px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.30)",
        display: "flex",
        flexDirection: bugsyOnRight ? "row" : "row-reverse",
        alignItems: "center",
        gap: 4,
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* Text block */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Day badge */}
        <div
          style={{
            display: "inline-block",
            background: "#5B21B6",
            borderRadius: 20,
            padding: "1px 7px",
            marginBottom: 3,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-nunito), system-ui",
              fontSize: 9,
              fontWeight: 800,
              color: "white",
              letterSpacing: "0.05em",
            }}
          >
            {m.day}
          </span>
        </div>

        {/* Title */}
        <p
          style={{
            fontFamily: "var(--font-nunito), system-ui",
            fontSize: 12,
            fontWeight: 900,
            color: "#1e1430",
            margin: "0 0 2px",
            lineHeight: 1.25,
          }}
        >
          {m.title}
        </p>

        {/* Description */}
        <p
          style={{
            fontFamily: "var(--font-nunito), system-ui",
            fontSize: 10,
            fontWeight: 500,
            color: "#5a4a72",
            margin: 0,
            lineHeight: 1.35,
          }}
        >
          {m.desc}
        </p>
      </div>

      {/* Bugsy mascot with optional emoji badge */}
      <div style={{ flexShrink: 0, position: "relative", display: "flex", alignItems: "center" }}>
        <Bobo mood={m.mood} tint={tint} size={62} tailWag={m.tailWag} />
        {m.overlayEmoji && (
          <span
            style={{
              position: "absolute",
              top: -2,
              right: bugsyOnRight ? -4 : undefined,
              left: bugsyOnRight ? undefined : -4,
              fontSize: 16,
              filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.35))",
              lineHeight: 1,
            }}
          >
            {m.overlayEmoji}
          </span>
        )}
      </div>
    </div>
  );
}
