"use client";

import { useEffect, useState } from "react";
import { BugsyStage, ChunkyButton, ConvoStage, SpeechBubble } from "./ConvoUI";
import { LoginScreen } from "./LoginScreen";
import {
  AGE_MAX,
  AGE_MIN,
  OPEN_CLANS,
  type ClanIntent,
} from "../../lib/data";

// 8 screens after the shared "Who are you?" branch.
// Clan choice removed (bond before competition). Two new guardrail
// screens at the end ask for adult consent + login before the kid
// can enter the app proper.
export const CHILD_STEPS = 8;

type Common = { tint: number };

// ── C0: Bugsy intro + name ────────────────────────────────────
// Bubble: "Oh. My. Goodness. You're here! I'm Bugsy. Who are you?"
export function ChildIntro({
  tint,
  childName,
  setChildName,
  onNext,
}: Common & { childName: string; setChildName: (s: string) => void; onNext: () => void }) {
  const [done, setDone] = useState(false);
  const line = "Oh. My. Goodness. You're here! I'm Bugsy. Who are you?";

  return (
    <ConvoStage step={1}>
      <BugsyStage mood="cheer" tint={tint} size={200} animationKey="c-intro" />
      <div style={{ marginTop: 8 }} />
      <SpeechBubble text={line} onDone={() => setDone(true)} tail="up" />

      <div
        style={{
          marginTop: 18,
          opacity: done ? 1 : 0,
          transition: "opacity 0.4s ease",
          pointerEvents: done ? "auto" : "none",
        }}
      >
        <input
          autoFocus={done}
          value={childName}
          onChange={(e) => setChildName(e.target.value)}
          placeholder="Type your name…"
          style={inputStyle}
        />
        <div style={{ height: 12 }} />
        <ChunkyButton onClick={onNext} disabled={!done || !childName.trim()}>
          That&apos;s me
        </ChunkyButton>
      </div>

      <div style={{ flex: 1 }} />
    </ConvoStage>
  );
}

// ── C1: react to name + age picker ────────────────────────────
// Bubble: "[Name]! That is such a cool name. How old are you, [Name]?"
export function ChildAge({
  tint,
  childName,
  childAge,
  setChildAge,
  onNext,
}: Common & {
  childName: string;
  childAge: number | null;
  setChildAge: (n: number) => void;
  onNext: () => void;
}) {
  const ages = Array.from({ length: AGE_MAX - AGE_MIN + 1 }, (_, i) => AGE_MIN + i);
  const [done, setDone] = useState(false);
  const line = `${childName}! That is such a cool name. How old are you, ${childName}?`;

  return (
    <ConvoStage step={3 /* mint */}>
      <BugsyStage mood="cheer" tint={tint} size={180} animationKey="c-age" />
      <div style={{ marginTop: 8 }} />
      <SpeechBubble text={line} onDone={() => setDone(true)} tail="up" />

      <div
        style={{
          marginTop: 18,
          opacity: done ? 1 : 0,
          transition: "opacity 0.4s ease",
          pointerEvents: done ? "auto" : "none",
        }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
          {ages.map((a, i) => {
            const active = childAge === a;
            return (
              <button
                key={a}
                onClick={() => setChildAge(a)}
                style={{
                  aspectRatio: "1 / 1",
                  borderRadius: 16,
                  cursor: "pointer",
                  border: active ? `3px solid var(--primary)` : `2px solid var(--border)`,
                  background: active ? "var(--accent-soft)" : "var(--surface)",
                  color: active ? "var(--primary)" : "var(--ink)",
                  fontFamily: "var(--font-nunito), system-ui",
                  fontWeight: 800,
                  fontSize: 24,
                  boxShadow: active ? "0 4px 0 var(--primary-shadow)" : "0 2px 0 var(--border)",
                  transition: "transform 0.12s ease, box-shadow 0.12s ease",
                  transform: active ? "translateY(-2px)" : "none",
                  animation: `bugsy-pop 0.35s cubic-bezier(0.22, 1.5, 0.36, 1) ${0.04 * i}s backwards`,
                }}
              >
                {a}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ flex: 1 }} />
      <ChunkyButton onClick={onNext} disabled={!done || childAge === null}>
        Continue
      </ChunkyButton>
    </ConvoStage>
  );
}

// ── C2: real talk — team-up ───────────────────────────────────
// Bubble: "Okay. Real talk. You and me? We're a team now."
export function ChildTeamUp({
  tint,
  onNext,
}: Common & { onNext: () => void }) {
  const [done, setDone] = useState(false);
  return (
    <ConvoStage step={0 /* coral wash */}>
      <BugsyStage mood="thinking" tint={tint} size={190} animationKey="c-team" lean={!done} />
      <div style={{ marginTop: 8 }} />
      <SpeechBubble
        text="Okay. Real talk. You and me? We're a team now."
        onDone={() => setDone(true)}
        tail="up"
      />
      <div style={{ flex: 1 }} />
      <ChunkyButton onClick={onNext} disabled={!done}>
        Tell me more
      </ChunkyButton>
    </ConvoStage>
  );
}

// ── C3: level up + hat demo ───────────────────────────────────
// Bubble 1: "Every challenge you do… I level up."
// (hat pops on)
// Bubble 2: "Pretty cool, right?"
export function ChildLevelUp({
  tint,
  onNext,
}: Common & { onNext: () => void }) {
  const [phase, setPhase] = useState<"intro" | "react">("intro");
  const [phaseDone, setPhaseDone] = useState(false);

  // Trigger phase swap a little after the first bubble finishes
  useEffect(() => {
    if (phase === "intro" && phaseDone) {
      const t = setTimeout(() => {
        setPhaseDone(false);
        setPhase("react");
      }, 900);
      return () => clearTimeout(t);
    }
  }, [phase, phaseDone]);

  const text =
    phase === "intro"
      ? "Every challenge you do… I level up."
      : "Pretty cool, right?";

  return (
    <ConvoStage step={4 /* rainbow */}>
      <div style={{ position: "relative" }}>
        <BugsyStage
          mood={phase === "react" ? "cheer" : "happy"}
          tint={tint}
          hat={phase === "react" ? "crown" : undefined}
          animationKey={phase}
          size={200}
        />
        {phase === "react" && (
          <div
            aria-hidden
            style={{
              position: "absolute",
              top: "26%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontFamily: "var(--font-nunito), sans-serif",
              fontSize: 18,
              fontWeight: 800,
              color: "var(--primary)",
              animation: "float-up 1.1s ease-out forwards",
              pointerEvents: "none",
              whiteSpace: "nowrap",
            }}
          >
            ✨ +1 Crown
          </div>
        )}
      </div>
      <div style={{ marginTop: 8 }} />
      <SpeechBubble
        key={phase}
        text={text}
        onDone={() => setPhaseDone(true)}
        tail="up"
      />

      <div style={{ flex: 1 }} />
      <ChunkyButton
        onClick={onNext}
        disabled={phase !== "react" || !phaseDone}
      >
        Whoa
      </ChunkyButton>
    </ConvoStage>
  );
}

// ── C4: clan choice ───────────────────────────────────────────
// Bubble: "Are your friends already here?"
export function ChildClan({
  tint,
  childName,
  intent,
  setIntent,
  onNext,
}: Common & {
  childName: string;
  intent: ClanIntent | null;
  setIntent: (i: ClanIntent | null) => void;
  onNext: () => void;
}) {
  const [done, setDone] = useState(false);
  const [substep, setSubstep] = useState<"pick" | "code" | "name" | "open">("pick");
  const [code, setCode] = useState(intent?.kind === "join-link" ? intent.code : "");
  const [clanName, setClanName] = useState(intent?.kind === "create" ? intent.name : "");
  const [emoji, setEmoji] = useState(intent?.kind === "create" ? intent.emoji : "🦊");
  const EMOJI_CHOICES = ["🦊", "🐉", "🦦", "🐧", "🐼", "🦁", "🐝", "🐙"];

  if (substep === "pick") {
    return (
      <ConvoStage step={2 /* sky */}>
        <BugsyStage mood="thinking" tint={tint} size={170} animationKey="c-clan" />
        <div style={{ marginTop: 8 }} />
        <SpeechBubble
          text="Are your friends already here?"
          onDone={() => setDone(true)}
          tail="up"
        />

        <div
          style={{
            marginTop: 18,
            display: "flex",
            flexDirection: "column",
            gap: 10,
            opacity: done ? 1 : 0,
            transition: "opacity 0.4s ease",
            pointerEvents: done ? "auto" : "none",
          }}
        >
          <Option emoji="👯" title="Find my friends" sub="I have a code" onClick={() => setSubstep("code")} />
          <Option emoji="👑" title="Make my own" sub="I'll be the leader" onClick={() => setSubstep("name")} />
          <Option emoji="🌍" title="Join a clan" sub="Show me open ones" onClick={() => setSubstep("open")} />
        </div>
        <div style={{ flex: 1 }} />
      </ConvoStage>
    );
  }

  if (substep === "code") {
    const valid = code.trim().length >= 4;
    return (
      <ConvoStage step={2}>
        <BugsyStage mood="happy" tint={tint} size={150} animationKey="c-clan-code" />
        <SpeechBubble text="Cool! What's the code?" tail="up" />
        <div style={{ marginTop: 14 }}>
          <input
            autoFocus
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="FOXES42"
            maxLength={12}
            style={{ ...inputStyle, fontSize: 22, letterSpacing: 3, fontWeight: 800 }}
          />
          <div style={{ height: 12 }} />
          <ChunkyButton
            onClick={() => {
              setIntent({ kind: "join-link", code: code.trim(), clan: OPEN_CLANS[0] });
              onNext();
            }}
            disabled={!valid}
          >
            Join
          </ChunkyButton>
        </div>
        <div style={{ flex: 1 }} />
      </ConvoStage>
    );
  }

  if (substep === "name") {
    const valid = clanName.trim().length >= 3;
    return (
      <ConvoStage step={2}>
        <BugsyStage mood="cheer" tint={tint} size={150} animationKey="c-clan-name" />
        <SpeechBubble text="Yes! What should we call us?" tail="up" />
        <div style={{ marginTop: 14 }}>
          <div
            style={{
              fontFamily: "var(--font-nunito), system-ui",
              fontSize: 11,
              fontWeight: 800,
              color: "var(--ink-muted)",
              textTransform: "uppercase",
              letterSpacing: 1,
              marginBottom: 8,
            }}
          >
            Crest
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
            {EMOJI_CHOICES.map((e) => {
              const active = emoji === e;
              return (
                <button
                  key={e}
                  onClick={() => setEmoji(e)}
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    border: active ? "3px solid var(--primary)" : "2px solid var(--border)",
                    background: active ? "var(--accent-soft)" : "var(--surface)",
                    cursor: "pointer",
                    fontSize: 22,
                    transform: active ? "scale(1.06)" : "scale(1)",
                    transition: "all 0.15s ease",
                  }}
                >
                  {e}
                </button>
              );
            })}
          </div>
          <input
            autoFocus
            value={clanName}
            onChange={(e) => setClanName(e.target.value)}
            placeholder="Clan name"
            maxLength={24}
            style={{ ...inputStyle, fontSize: 18 }}
          />
          <div style={{ height: 12 }} />
          <ChunkyButton
            onClick={() => {
              setIntent({ kind: "create", name: clanName.trim(), emoji });
              onNext();
            }}
            disabled={!valid}
          >
            Create
          </ChunkyButton>
        </div>
        <div style={{ flex: 1 }} />
      </ConvoStage>
    );
  }

  // open
  return (
    <ConvoStage step={2}>
      <BugsyStage mood="happy" tint={tint} size={130} animationKey="c-clan-open" />
      <SpeechBubble text="These clans are looking for friends!" tail="up" />
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 14, overflowY: "auto" }}>
        {OPEN_CLANS.map((c) => {
          const active = intent?.kind === "join-open" && intent.clan.id === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setIntent({ kind: "join-open", clan: c })}
              style={{
                textAlign: "left",
                padding: "12px 14px",
                borderRadius: 16,
                border: active ? "3px solid var(--primary)" : "2px solid var(--border)",
                background: active ? "var(--accent-soft)" : "var(--surface)",
                boxShadow: active ? "0 4px 0 var(--primary-shadow)" : "0 2px 0 var(--border)",
                cursor: "pointer",
                display: "flex",
                gap: 12,
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: "var(--surface-1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  flexShrink: 0,
                }}
              >
                {c.emoji}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "var(--font-nunito), system-ui", fontSize: 15, fontWeight: 800 }}>
                  {c.name}
                </div>
                <div style={{ fontFamily: "var(--font-nunito), system-ui", fontSize: 12, fontWeight: 700, color: "var(--ink-muted)" }}>
                  {c.members} friends
                </div>
              </div>
            </button>
          );
        })}
      </div>
      <div style={{ flex: 1, minHeight: 8 }} />
      <ChunkyButton onClick={onNext} disabled={intent?.kind !== "join-open"}>
        Join
      </ChunkyButton>
    </ConvoStage>
  );
}

function Option({
  emoji,
  title,
  sub,
  onClick,
}: {
  emoji: string;
  title: string;
  sub: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        gap: 14,
        alignItems: "center",
        textAlign: "left",
        padding: "14px 16px",
        borderRadius: 18,
        border: "2px solid var(--border)",
        background: "var(--surface)",
        boxShadow: "0 3px 0 var(--border)",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          width: 46,
          height: 46,
          borderRadius: 12,
          background: "var(--accent-soft)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 24,
          flexShrink: 0,
        }}
      >
        {emoji}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: "var(--font-nunito), system-ui",
            fontSize: 16,
            fontWeight: 800,
            color: "var(--ink)",
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontFamily: "var(--font-nunito), system-ui",
            fontSize: 12.5,
            fontWeight: 700,
            color: "var(--ink-muted)",
            marginTop: 2,
          }}
        >
          {sub}
        </div>
      </div>
    </button>
  );
}

// ── C5: promise — the most important emotional beat ───────────
// Bubble: "Last thing. Promise me something. Come back tomorrow?"
export function ChildPromise({
  tint,
  onNext,
}: Common & { onNext: () => void }) {
  const [done, setDone] = useState(false);
  return (
    <ConvoStage step={5 /* lavender wash */}>
      <BugsyStage mood="thinking" tint={tint} size={190} animationKey="c-promise" />
      <div style={{ marginTop: 8 }} />
      <SpeechBubble
        text="Last thing. Promise me something. Come back tomorrow?"
        onDone={() => setDone(true)}
        tail="up"
      />
      <div style={{ flex: 1 }} />
      <ChunkyButton onClick={onNext} disabled={!done}>
        I promise
      </ChunkyButton>
    </ConvoStage>
  );
}

// ── C6: sendoff — big celebration ─────────────────────────────
// Bubble: "Let's go, [Name]. The world won't know what hit it."
export function ChildSendoff({
  tint,
  childName,
  equippedHat,
  onEnter,
}: Common & { childName: string; equippedHat: string | null; onEnter: () => void }) {
  const [done, setDone] = useState(false);
  const line = `Let's go, ${childName}. The world won't know what hit it.`;

  return (
    <ConvoStage step={4 /* rainbow */}>
      <BugsyStage
        mood="cheer"
        tint={tint}
        hat={equippedHat ?? undefined}
        animationKey="c-sendoff"
        size={220}
      />
      <div style={{ marginTop: 8 }} />
      <SpeechBubble text={line} onDone={() => setDone(true)} tail="up" />

      <div style={{ flex: 1 }} />
      <ChunkyButton onClick={onEnter} disabled={!done}>
        Let&apos;s go
      </ChunkyButton>
    </ConvoStage>
  );
}

// ── C6 (NEW): "Almost done — get a grown-up" ─────────────────
// The kid's sendoff feels like an ending, then this gently pulls
// them back: "wait, one more thing." Sets up the adult consent.
export function ChildAlmostDone({
  tint,
  childName,
  onNext,
}: Common & { childName: string; onNext: () => void }) {
  const friend = childName.trim() || "friend";
  const [done, setDone] = useState(false);
  return (
    <ConvoStage step={5 /* soft coral wash */}>
      <BugsyStage mood="thinking" tint={tint} size={170} animationKey="c-almost" />
      <div style={{ marginTop: 8 }} />
      <SpeechBubble
        text={`Wait — one tiny thing, ${friend}. Grab a grown-up.`}
        onDone={() => setDone(true)}
        tail="up"
      />
      <p
        style={{
          margin: "12px 8px 0",
          fontFamily: "var(--font-nunito), system-ui",
          fontSize: 13.5,
          fontWeight: 700,
          color: "var(--ink-muted)",
          textAlign: "center",
          lineHeight: 1.45,
          opacity: done ? 1 : 0,
          transition: "opacity 0.4s ease",
        }}
      >
        They need to sign you in. Then we can really start.
      </p>
      <div style={{ flex: 1 }} />
      <ChunkyButton onClick={onNext} disabled={!done}>
        I have a grown-up
      </ChunkyButton>
    </ConvoStage>
  );
}

// ── C7 (NEW): adult-consent login ─────────────────────────────
export function ChildAdultLogin({
  tint,
  childName,
  onNext,
}: Common & { childName: string; onNext: () => void }) {
  const friend = childName.trim() || "your kiddo";
  return (
    <LoginScreen
      tint={tint}
      mood="happy"
      step={1 /* lavender — calm parent moment */}
      bubbleText={`Grown-up — sign in to keep ${friend}'s progress safe.`}
      ctaLabel="Grown-up sign in"
      onContinue={() => onNext()}
    />
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: 64,
  boxSizing: "border-box",
  padding: "0 22px",
  borderRadius: 16,
  border: "2px solid var(--border)",
  background: "var(--surface)",
  fontFamily: "var(--font-nunito), system-ui",
  fontSize: 20,
  fontWeight: 700,
  color: "var(--ink)",
  outline: "none",
  boxShadow: "0 2px 0 var(--border)",
  textAlign: "center",
  letterSpacing: -0.2,
};
