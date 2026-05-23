"use client";

import { useState } from "react";
import { BugsyStage, ChunkyButton, ConvoStage, SpeechBubble } from "./ConvoUI";
import { HATS, PROJECTS, type Project, type Relationship } from "../../lib/data";

type Common = { tint: number };

// ── Step 0 (NEW): explicit "pass the phone" prompt ────────────
// The previous "Hand the phone to {child}" button left it unclear
// whether the parent should literally hand over the device. This
// screen makes it explicit, and the button is phrased from the
// CHILD's perspective ("I'm Jamie!") — they have to physically
// take the phone and tap it themselves to proceed.
export function HandoverPrompt({
  tint,
  childName,
  onNext,
}: Common & { childName: string; onNext: () => void }) {
  const friend = childName.trim() || "your child";
  const [done, setDone] = useState(false);

  return (
    <ConvoStage step={4 /* rainbow finale wash */}>
      <BugsyStage
        mood="excited"
        tint={tint}
        size={170}
        animationKey="hp-prompt"
      />
      <div style={{ marginTop: 8 }} />
      <SpeechBubble
        text={`Quick — hand the phone to ${friend}.`}
        onDone={() => setDone(true)}
      />

      <div
        style={{
          marginTop: 16,
          padding: "14px 16px",
          borderRadius: 16,
          border: "2px dashed var(--border)",
          background: "var(--surface)",
          textAlign: "center",
          opacity: done ? 1 : 0,
          transition: "opacity 0.4s ease",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-nunito), system-ui",
            fontSize: 13,
            fontWeight: 700,
            color: "var(--ink-muted)",
            lineHeight: 1.4,
          }}
        >
          {friend}, tap below once you&apos;re holding the phone.
        </div>
      </div>

      <div style={{ flex: 1 }} />
      <ChunkyButton onClick={onNext} disabled={!done}>
        I&apos;m {friend}!
      </ChunkyButton>
    </ConvoStage>
  );
}

// ── Step 1 (parent-handover only): "Wait — is that you?!" ─────
// First time Bugsy ever "meets" the child. Bugsy already knows
// their name because the parent set it up. Lean into that magic.
// Reference the parent by relationship — Mom/Dad — except for
// "guardian" where there's no universal noun, so we use their
// first name directly (no "Your" prefix — that read awkwardly).
export function ChildHelloKnown({
  tint,
  childName,
  parentName,
  relationship,
  onNext,
}: Common & {
  childName: string;
  parentName: string;
  relationship: Relationship | null;
  onNext: () => void;
}) {
  const [done, setDone] = useState(false);
  const namePart =
    relationship === "mom"
      ? "Mom"
      : relationship === "dad"
      ? "Dad"
      : parentName.trim()
      ? parentName.trim()
      : "Someone";
  const line = `Wait… is that ${childName}?! ${namePart} told me ALL about you. I've been waiting. Like, refreshing-my-screen waiting.`;

  return (
    <ConvoStage step={4 /* rainbow */}>
      <BugsyStage mood="cheer" tint={tint} size={220} animationKey="hk" />
      <div style={{ marginTop: 10 }} />
      <SpeechBubble text={line} onDone={() => setDone(true)} />
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
      <SpeechBubble text={line} onDone={() => setDone(true)} />
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
      <SpeechBubble text={line} onDone={() => setDone(true)} />

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
// project before they hit the open app. Options are stacked in a
// single bordered container with dividers (Duolingo-style); the
// kid taps one to select, then "Continue" to start it.
export function FirstAction({
  tint,
  childName,
  onOpenProject,
  onSkip,
}: Common & { childName: string; onOpenProject: (id: string) => void; onSkip: () => void }) {
  const [done, setDone] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const line = `Right ${childName}, pick the first one. Just ONE. Then we're officially a team.`;

  // Pick 3 fastest games (lowest mins, kind: "game")
  const choices: Project[] = PROJECTS
    .filter((p) => p.kind === "game")
    .sort((a, b) => a.mins - b.mins)
    .slice(0, 3);

  return (
    <ConvoStage step={1 /* sun */}>
      <BugsyStage mood="cheer" tint={tint} size={140} animationKey="first" />
      <div style={{ marginTop: 10 }} />
      <SpeechBubble text={line} onDone={() => setDone(true)} />

      <div
        style={{
          marginTop: 18,
          borderRadius: 18,
          border: "1px solid var(--border)",
          background: "var(--surface)",
          overflow: "hidden",
          opacity: done ? 1 : 0,
          transition: "opacity 0.4s ease",
          pointerEvents: done ? "auto" : "none",
        }}
      >
        {choices.map((p, i) => {
          const active = selectedId === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setSelectedId(p.id)}
              style={{
                width: "100%",
                textAlign: "left",
                padding: "14px 16px",
                cursor: "pointer",
                background: active ? "var(--accent-soft)" : "var(--surface)",
                border: "none",
                borderTop: i === 0 ? "none" : "1px solid var(--border)",
                display: "flex",
                gap: 14,
                alignItems: "center",
                transition: "background 0.15s ease",
              }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: "var(--surface-1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  flexShrink: 0,
                }}
              >
                {p.emoji}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: "var(--font-nunito), system-ui",
                    fontSize: 15.5,
                    fontWeight: 800,
                    color: active ? "var(--primary)" : "var(--ink)",
                    letterSpacing: -0.15,
                  }}
                >
                  {p.title}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-nunito), system-ui",
                    fontSize: 12,
                    fontWeight: 700,
                    color: "var(--ink-muted)",
                    marginTop: 2,
                  }}
                >
                  {p.mins} min · +{p.points} pts
                </div>
              </div>
              {active ? (
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 999,
                    background: "var(--primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    boxShadow: "0 2px 0 var(--primary-shadow)",
                  }}
                  aria-hidden
                >
                  <svg width="12" height="12" viewBox="0 0 12 12">
                    <path
                      d="M2 6l3 3 5-6"
                      stroke="#fff"
                      strokeWidth="2.5"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              ) : (
                <span
                  style={{
                    fontFamily: "var(--font-nunito), system-ui",
                    fontSize: 10.5,
                    fontWeight: 800,
                    color: "var(--primary)",
                    background: "var(--accent-soft)",
                    padding: "4px 10px",
                    borderRadius: 999,
                    letterSpacing: 0.8,
                    textTransform: "uppercase",
                    flexShrink: 0,
                  }}
                >
                  Pick
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div style={{ flex: 1, minHeight: 8 }} />

      <ChunkyButton
        onClick={() => {
          if (selectedId) onOpenProject(selectedId);
        }}
        disabled={!done || !selectedId}
      >
        Continue
      </ChunkyButton>

      <button
        onClick={onSkip}
        style={{
          background: "transparent",
          border: "none",
          color: "var(--ink-muted)",
          fontFamily: "var(--font-nunito), system-ui",
          fontSize: 14,
          fontWeight: 700,
          cursor: "pointer",
          padding: "10px 0",
          marginTop: 4,
          textDecoration: "underline",
          textUnderlineOffset: 4,
        }}
      >
        Maybe later
      </button>
    </ConvoStage>
  );
}
