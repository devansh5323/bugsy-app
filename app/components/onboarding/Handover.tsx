"use client";

import { useState } from "react";
import { BugsyStage, ChunkyButton, ConvoStage, SpeechBubble } from "./ConvoUI";
import { HATS, PROJECTS, type Project } from "../../lib/data";

type Common = { tint: number };

// ── Step 0 (parent-handover only): "Wait — is that you?!" ─────
// First time Bugsy ever "meets" the child. Bugsy already knows
// their name because the parent set it up. Lean into that magic.
export function ChildHelloKnown({
  tint,
  childName,
  parentName,
  onNext,
}: Common & { childName: string; parentName: string; onNext: () => void }) {
  const [done, setDone] = useState(false);
  const namePart = parentName ? `Your ${parentName} ` : "Someone ";
  const line = `Wait… is that ${childName}?! ${namePart}told me ALL about you. I've been waiting. Like, refreshing-my-screen waiting.`;

  return (
    <ConvoStage step={4 /* rainbow */}>
      <BugsyStage mood="cheer" tint={tint} size={220} animationKey="hk" />
      <div style={{ marginTop: 10 }} />
      <SpeechBubble text={line} onDone={() => setDone(true)} tail="up" />
      <div style={{ flex: 1 }} />
      <ChunkyButton onClick={onNext} disabled={!done}>
        Hi Bugsy! 👋
      </ChunkyButton>
    </ConvoStage>
  );
}

// ── Step 1: Pinky promise — the explicit daily commitment ─────
export function PinkyPromise({
  tint,
  childName,
  onNext,
}: Common & { childName: string; onNext: () => void }) {
  const [done, setDone] = useState(false);
  const line = `Okay ${childName}, here's the deal. You and me — every day. One little challenge, that's all. I get cooler. You get points. We climb together. Pinky promise?`;

  return (
    <ConvoStage step={0 /* pink-coral */}>
      <BugsyStage mood="happy" tint={tint} size={200} animationKey="pinky" lean={!done} />
      <div style={{ marginTop: 10 }} />
      <SpeechBubble text={line} onDone={() => setDone(true)} tail="up" />
      <div style={{ flex: 1 }} />
      <ChunkyButton onClick={onNext} disabled={!done}>
        Pinky promise 🤝
      </ChunkyButton>
    </ConvoStage>
  );
}

// ── Step 2: Daily map — visualize the streak / growth path ────
// Shows future hat unlocks anchored to days. Makes the loop tangible:
// "if I show up tomorrow I get X, day 3 I get Y…"
export function DailyMap({
  tint,
  onNext,
}: Common & { onNext: () => void }) {
  const [done, setDone] = useState(false);
  const line =
    "See this? Each day you come back and do one thing, I level up. Three days = Crown. Five days = Wizard. Eighteen = legend. But ONLY if you keep showing up.";

  const milestones = HATS.slice(0, 4); // first 4 hats by unlockAt
  const labels = ["TODAY", "DAY 3", "DAY 5", "DAY 8"];

  return (
    <ConvoStage step={3 /* mint */}>
      <BugsyStage mood="thinking" tint={tint} size={150} animationKey="map" />
      <div style={{ marginTop: 10 }} />
      <SpeechBubble text={line} onDone={() => setDone(true)} tail="up" />

      <div
        style={{
          marginTop: 18,
          opacity: done ? 1 : 0,
          transition: "opacity 0.4s ease",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 8,
        }}
      >
        {milestones.map((h, i) => {
          const active = i === 0;
          return (
            <div
              key={h.key}
              style={{
                padding: "10px 6px 12px",
                borderRadius: 16,
                background: active ? "#fff" : "rgba(255,255,255,0.18)",
                color: active ? "var(--ink)" : "rgba(255,255,255,0.9)",
                textAlign: "center",
                boxShadow: active ? "0 6px 0 rgba(0,0,0,0.16)" : "none",
                animation: `bugsy-pop 0.4s cubic-bezier(0.22, 1.5, 0.36, 1) ${0.1 + i * 0.08}s backwards`,
                position: "relative",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-inter), system-ui",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: 0.6,
                  color: active ? "var(--accent)" : "rgba(255,255,255,0.85)",
                  marginBottom: 4,
                }}
              >
                {labels[i]}
              </div>
              <div style={{ fontSize: 26, lineHeight: 1, marginBottom: 4 }}>
                {h.key === "acorn" ? "🌰" : h.key === "crown" ? "👑" : h.key === "wizard" ? "🧙" : "🎓"}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-inter), system-ui",
                  fontSize: 10.5,
                  fontWeight: 600,
                  lineHeight: 1.2,
                  letterSpacing: -0.1,
                }}
              >
                {h.name}
              </div>
              {!active && (
                <div
                  style={{
                    position: "absolute",
                    top: 6,
                    right: 6,
                    fontSize: 11,
                    opacity: 0.85,
                  }}
                  aria-hidden
                >
                  🔒
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ flex: 1 }} />
      <ChunkyButton onClick={onNext} disabled={!done}>
        I&apos;m in →
      </ChunkyButton>
    </ConvoStage>
  );
}

// ── Step 3: First action — pick a quick game right now ────────
// Closes the loop once during onboarding. Child completes a real
// project before they hit the open app.
export function FirstAction({
  tint,
  childName,
  onOpenProject,
  onSkip,
}: Common & { childName: string; onOpenProject: (id: string) => void; onSkip: () => void }) {
  const [done, setDone] = useState(false);
  const line = `Right ${childName}, pick the first one. Just ONE. Then we're officially a team.`;

  // Pick 3 fastest games (lowest mins, kind: "game")
  const choices: Project[] = PROJECTS
    .filter((p) => p.kind === "game")
    .sort((a, b) => a.mins - b.mins)
    .slice(0, 3);

  return (
    <ConvoStage step={1 /* sun */}>
      <BugsyStage mood="cheer" tint={tint} size={150} animationKey="first" />
      <div style={{ marginTop: 10 }} />
      <SpeechBubble text={line} onDone={() => setDone(true)} tail="up" />

      <div
        style={{
          marginTop: 16,
          display: "flex",
          flexDirection: "column",
          gap: 10,
          opacity: done ? 1 : 0,
          transition: "opacity 0.4s ease",
          pointerEvents: done ? "auto" : "none",
        }}
      >
        {choices.map((p, i) => (
          <button
            key={p.id}
            onClick={() => onOpenProject(p.id)}
            style={{
              textAlign: "left",
              padding: "14px 16px",
              borderRadius: 22,
              cursor: "pointer",
              background: "rgba(255,255,255,0.96)",
              color: "var(--ink)",
              border: "none",
              display: "flex",
              gap: 14,
              alignItems: "center",
              boxShadow: "0 6px 0 rgba(0,0,0,0.14)",
              animation: `bugsy-pop 0.45s cubic-bezier(0.22, 1.5, 0.36, 1) ${0.1 + i * 0.08}s backwards`,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: "oklch(94% 0.04 80)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 26,
                flexShrink: 0,
              }}
            >
              {p.emoji}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontFamily: "var(--font-inter), system-ui",
                  fontSize: 15.5,
                  fontWeight: 700,
                  color: "var(--ink)",
                  letterSpacing: -0.15,
                }}
              >
                {p.title}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-inter), system-ui",
                  fontSize: 12,
                  color: "var(--ink-60)",
                  marginTop: 2,
                }}
              >
                {p.mins} min · +{p.points} pts
              </div>
            </div>
            <span
              style={{
                fontFamily: "var(--font-inter), system-ui",
                fontSize: 12,
                fontWeight: 700,
                color: "var(--accent)",
                background: "var(--accent-soft)",
                padding: "5px 10px",
                borderRadius: 999,
                letterSpacing: 0.3,
              }}
            >
              GO →
            </span>
          </button>
        ))}
      </div>

      <div style={{ flex: 1 }} />

      <button
        onClick={onSkip}
        style={{
          background: "transparent",
          border: "none",
          color: "rgba(255,255,255,0.92)",
          fontFamily: "var(--font-inter), system-ui",
          fontSize: 14,
          fontWeight: 600,
          cursor: "pointer",
          padding: "10px 0",
          textDecoration: "underline",
          textUnderlineOffset: 4,
        }}
      >
        Maybe later
      </button>
    </ConvoStage>
  );
}
