"use client";

import { useEffect, useState } from "react";
import { BugsyStage, ChunkyButton, ConvoStage, SpeechBubble } from "./ConvoUI";
import { LoginScreen } from "./LoginScreen";
import {
  AGE_MAX,
  AGE_MIN,
  OPEN_CLANS,
  RELATIONSHIP_OPTIONS,
  type ClanIntent,
  type Relationship,
} from "../../lib/data";

// 13 screens after the shared "Who are you?" branch.
// Storyline: Bugsy says hi → bond explainer → name/age/goal →
// promise + sendoff → grown-up takes over (login + their details)
// → grown-up shares what they're noticing → Bugsy responds with
// what the child will achieve → home. Same achieve beat lands here
// as it does in the parent flow, just on the grown-up's screen.
export const CHILD_STEPS = 13;

type Common = { tint: number };

// ── C0: Bugsy says hi (no name ask) ──────────────────────────
// Pure intro — Bugsy makes a big entrance. Name collection
// happens later, after the team-up and level-up bond beats.
export function ChildIntro({
  tint,
  onNext,
}: Common & { onNext: () => void }) {
  const [done, setDone] = useState(false);
  return (
    <ConvoStage step={1}>
      <BugsyStage mood="cheer" tint={tint} size={200} animationKey="c-intro" />
      <div style={{ marginTop: 8 }} />
      <SpeechBubble
        text="Oh. My. Goodness. You're here! I'm Bugsy."
        onDone={() => setDone(true)}
      />
      <div style={{ flex: 1 }} />
      <ChunkyButton onClick={onNext} disabled={!done}>
        Hi Bugsy! 👋
      </ChunkyButton>
    </ConvoStage>
  );
}

// ── C3 (after bond beats): name input ─────────────────────────
// Now that the kid knows what Bugsy is and how the loop works,
// Bugsy asks the name. Mirrors the original ChildIntro input
// piece, just on its own dedicated screen.
export function ChildName({
  tint,
  childName,
  setChildName,
  onNext,
}: Common & { childName: string; setChildName: (s: string) => void; onNext: () => void }) {
  const [done, setDone] = useState(false);
  return (
    <ConvoStage step={5 /* soft coral wash */}>
      <BugsyStage mood="happy" tint={tint} size={170} animationKey="c-name" />
      <div style={{ marginTop: 8 }} />
      <SpeechBubble
        text="So… who are you?"
        onDone={() => setDone(true)}
      />

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
      <SpeechBubble text={line} onDone={() => setDone(true)} />

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
        <SpeechBubble text="Cool! What's the code?" />
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
        <SpeechBubble text="Yes! What should we call us?" />
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
      <SpeechBubble text="These clans are looking for friends!" />
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

// ── C4 (NEW): Daily goal — Duolingo-style commitment ──────────
// Sits right after the "every challenge levels me up" beat, so
// the kid is primed to commit. The speech bubble morphs on every
// pick to give them an instant, tangible payoff — "5 mins = 7
// quests this week" — which makes the choice feel concrete
// instead of abstract.
export function ChildDailyGoal({
  tint,
  goal,
  setGoal,
  onNext,
}: Common & {
  goal: number | null;
  setGoal: (n: number) => void;
  onNext: () => void;
}) {
  const [bubbleDone, setBubbleDone] = useState(false);

  const bubbleText =
    goal === null
      ? "How long do you want to play with me each day?"
      : DAILY_GOAL_LINES[goal];

  return (
    <ConvoStage step={2 /* yellow wash — sunny commitment */}>
      <BugsyStage
        mood={goal === null ? "thinking" : "cheer"}
        tint={tint}
        size={150}
        animationKey={`c-goal-${goal ?? "ask"}`}
      />
      <div style={{ marginTop: 8 }} />
      <SpeechBubble
        key={`c-goal-${goal ?? "ask"}`}
        text={bubbleText}
        onDone={() => setBubbleDone(true)}
      />

      <div
        style={{
          marginTop: 22,
          display: "flex",
          flexDirection: "column",
          gap: 10,
          opacity: bubbleDone ? 1 : 0,
          transition: "opacity 0.4s ease",
          pointerEvents: bubbleDone ? "auto" : "none",
        }}
      >
        {DAILY_GOAL_OPTIONS.map((opt) => {
          const active = goal === opt.mins;
          return (
            <button
              key={opt.mins}
              onClick={() => {
                setBubbleDone(false);
                setGoal(opt.mins);
              }}
              style={{
                display: "flex",
                gap: 14,
                alignItems: "center",
                textAlign: "left",
                padding: "12px 14px",
                borderRadius: 18,
                cursor: "pointer",
                background: active ? "var(--accent-soft)" : "var(--surface)",
                border: active ? "3px solid var(--primary)" : "2px solid var(--border)",
                boxShadow: active
                  ? "0 3px 0 var(--primary-shadow)"
                  : "0 3px 0 var(--border)",
                transform: active ? "translateY(-2px)" : "none",
                transition: "transform 0.12s ease, box-shadow 0.12s ease, background 0.15s ease",
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: active ? "var(--primary)" : "var(--surface-1)",
                  color: active ? "#fff" : "var(--ink)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-nunito), system-ui",
                  fontWeight: 900,
                  fontSize: 18,
                  letterSpacing: -0.3,
                  flexShrink: 0,
                  transition: "background 0.15s ease, color 0.15s ease",
                }}
              >
                {opt.mins}m
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: "var(--font-nunito), system-ui",
                    fontSize: 16,
                    fontWeight: 800,
                    color: active ? "var(--primary)" : "var(--ink)",
                    letterSpacing: -0.15,
                  }}
                >
                  {opt.label}
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
                  {opt.sub}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div style={{ flex: 1, minHeight: 8 }} />
      <ChunkyButton onClick={onNext} disabled={goal === null || !bubbleDone}>
        {goal === null ? "Pick a goal" : "That's my goal"}
      </ChunkyButton>
    </ConvoStage>
  );
}

const DAILY_GOAL_OPTIONS = [
  { mins: 5, label: "Casual", sub: "A quick visit" },
  { mins: 10, label: "Regular", sub: "Just right" },
  { mins: 15, label: "Serious", sub: "Big plans!" },
  { mins: 20, label: "Intense", sub: "All in" },
];

// Result lines reflect roughly 1 mini-challenge per 5 min, ×7 days.
// Wording uses "quests/challenges" — the same nouns the rest of
// the app uses — so the payoff feels native, not bolted on.
const DAILY_GOAL_LINES: Record<number, string> = {
  5: "5 mins a day? That's 7 mini-quests with me this week!",
  10: "10 mins a day? 14 challenges this week — let's go!",
  15: "15 mins a day?! 21 challenges this week — pro mode!",
  20: "20 mins a day?? 28 challenges this week — superstar!",
};

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
      <SpeechBubble text={line} onDone={() => setDone(true)} />

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

// ── C8 (NEW): post-signup grown-up details ────────────────────
// Lands right after the adult sign-in. We've got an account but
// don't know who's behind it — so capture name + relationship now,
// before they leave the onboarding context. Same chips pattern the
// parent flow uses, so it feels like one design.
export function ChildParentDetails({
  tint,
  childName,
  parentName,
  setParentName,
  relationship,
  setRelationship,
  onNext,
}: Common & {
  childName: string;
  parentName: string;
  setParentName: (s: string) => void;
  relationship: Relationship | null;
  setRelationship: (r: Relationship) => void;
  onNext: () => void;
}) {
  const friend = childName.trim() || "your kiddo";
  const [bubbleDone, setBubbleDone] = useState(false);
  const valid = parentName.trim().length > 0 && relationship !== null;

  return (
    <ConvoStage step={1 /* lavender — same wash as adult login */}>
      <BugsyStage mood="happy" tint={tint} size={140} animationKey="c-parent-details" />
      <div style={{ marginTop: 8 }} />
      <SpeechBubble
        text={`Welcome! Who are you to ${friend}?`}
        onDone={() => setBubbleDone(true)}
      />

      <div
        style={{
          marginTop: 18,
          opacity: bubbleDone ? 1 : 0,
          transition: "opacity 0.4s ease",
          pointerEvents: bubbleDone ? "auto" : "none",
        }}
      >
        <input
          autoFocus={bubbleDone}
          value={parentName}
          onChange={(e) => setParentName(e.target.value)}
          placeholder="Your name"
          style={inputStyle}
        />
        <div style={{ height: 14 }} />
        <div
          style={{
            fontFamily: "var(--font-nunito), system-ui",
            fontSize: 11,
            fontWeight: 800,
            color: "var(--ink-muted)",
            textTransform: "uppercase",
            letterSpacing: 1,
            marginBottom: 8,
            textAlign: "center",
          }}
        >
          I&apos;m {friend}&apos;s…
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
          {RELATIONSHIP_OPTIONS.map((opt) => {
            const active = relationship === opt.key;
            return (
              <button
                key={opt.key}
                onClick={() => setRelationship(opt.key)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  padding: "12px 6px 10px",
                  borderRadius: 16,
                  cursor: "pointer",
                  background: active ? "var(--accent-soft)" : "var(--surface)",
                  border: active ? "3px solid var(--primary)" : "2px solid var(--border)",
                  boxShadow: active
                    ? "0 3px 0 var(--primary-shadow)"
                    : "0 3px 0 var(--border)",
                  transform: active ? "translateY(-2px)" : "none",
                  transition:
                    "transform 0.12s ease, box-shadow 0.12s ease, background 0.15s ease",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={opt.icon}
                  alt=""
                  width={52}
                  height={52}
                  style={{ display: "block" }}
                />
                <div
                  style={{
                    fontFamily: "var(--font-nunito), system-ui",
                    fontSize: 14,
                    fontWeight: 800,
                    color: active ? "var(--primary)" : "var(--ink)",
                    letterSpacing: -0.1,
                  }}
                >
                  {opt.label}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ flex: 1, minHeight: 8 }} />
      <ChunkyButton onClick={onNext} disabled={!bubbleDone || !valid}>
        Finish
      </ChunkyButton>
    </ConvoStage>
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
