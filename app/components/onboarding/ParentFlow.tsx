"use client";

import { useEffect, useState } from "react";
import { BackChevron, BugsyStage, ChunkyButton, ConvoStage, SpeechBubble } from "./ConvoUI";
import { LoginScreen } from "./LoginScreen";
import {
  AGE_MAX,
  AGE_MIN,
  NOTICING_OPTIONS,
  OPEN_CLANS,
  type Clan,
  type ClanIntent,
} from "../../lib/data";

// 11 screens after the shared "Who are you?" branch.
// (Clan/team setup intentionally deferred — bond first.)
// A login guardrail sits just before the Meet-Bugsy handover.
export const PARENT_STEPS = 11;

type Common = { tint: number; onBack?: () => void };

// ── P0: parent name (ask → react) ─────────────────────────────
// Phase 1: "Great. What's your name?"
// Phase 2: "Lovely to meet you, [Name]." (auto-advances)
export function ParentName({
  tint,
  parentName,
  setParentName,
  onNext,
  onBack,
}: Common & { parentName: string; setParentName: (s: string) => void; onNext: () => void }) {
  const [phase, setPhase] = useState<"ask" | "react">("ask");
  const [bubbleDone, setBubbleDone] = useState(false);

  // After reaction finishes typewriting, hold a beat, then advance
  useEffect(() => {
    if (phase === "react" && bubbleDone) {
      const t = setTimeout(onNext, 1200);
      return () => clearTimeout(t);
    }
  }, [phase, bubbleDone, onNext]);

  const text =
    phase === "ask"
      ? "Great. What's your name?"
      : `Lovely to meet you, ${parentName.trim()}.`;

  return (
    <ConvoStage step={5}>
      {onBack && <BackChevron onBack={onBack} />}
      <BugsyStage
        mood={phase === "react" ? "cheer" : "happy"}
        tint={tint}
        size={150}
        animationKey={phase}
      />
      <div style={{ marginTop: 8 }} />
      <SpeechBubble
        key={phase}
        text={text}
        onDone={() => setBubbleDone(true)}
        tail="up"
      />

      {phase === "ask" && (
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
          <div style={{ height: 12 }} />
          <ChunkyButton
            onClick={() => {
              setBubbleDone(false);
              setPhase("react");
            }}
            disabled={!bubbleDone || !parentName.trim()}
          >
            Continue
          </ChunkyButton>
        </div>
      )}

      <div style={{ flex: 1 }} />
    </ConvoStage>
  );
}

// ── P1: intro 1 ───────────────────────────────────────────────
// Bubble: "Your child is going to love this."
// Small text under bubble + "Tell me more"
export function ParentIntro({
  tint,
  onNext,
  onBack,
}: Common & { onNext: () => void }) {
  const [done, setDone] = useState(false);
  return (
    <ConvoStage step={6 /* azure wash */}>
      {onBack && <BackChevron onBack={onBack} />}
      <BugsyStage mood="happy" tint={tint} size={150} animationKey="p-intro" />
      <div style={{ marginTop: 8 }} />
      <SpeechBubble
        text="Your child is going to love this."
        onDone={() => setDone(true)}
        tail="up"
      />
      <p
        style={{
          margin: "12px 4px 0",
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
        Daily creative challenges that build real skills.
      </p>
      <div style={{ flex: 1 }} />
      <ChunkyButton onClick={onNext} disabled={!done}>
        Tell me more
      </ChunkyButton>
    </ConvoStage>
  );
}

// ── P2: intro 2 ───────────────────────────────────────────────
// Bubble: "They'll join a team, earn rewards, and grow."
export function ParentIntro2({
  tint,
  onNext,
  onBack,
}: Common & { onNext: () => void }) {
  const [done, setDone] = useState(false);
  return (
    <ConvoStage step={2 /* sky */}>
      {onBack && <BackChevron onBack={onBack} />}
      <BugsyStage mood="cheer" tint={tint} size={150} animationKey="p-intro2" />
      <div style={{ marginTop: 8 }} />
      <SpeechBubble
        text="They'll get a buddy who grows with them every day."
        onDone={() => setDone(true)}
        tail="up"
      />
      <div style={{ flex: 1 }} />
      <ChunkyButton onClick={onNext} disabled={!done}>
        Sounds good
      </ChunkyButton>
    </ConvoStage>
  );
}

// ── P3 (NEW): Bond — daily visits make Bugsy grow ─────────────
export function ParentBondGrowth({
  tint,
  onNext,
  onBack,
}: Common & { onNext: () => void }) {
  const [done, setDone] = useState(false);
  return (
    <ConvoStage step={2 /* warm yellow */}>
      {onBack && <BackChevron onBack={onBack} />}
      <BugsyStage mood="excited" tint={tint} size={170} animationKey="p-bond-growth" />
      <div style={{ marginTop: 8 }} />
      <SpeechBubble
        text="Every visit, I grow a little stronger."
        onDone={() => setDone(true)}
        tail="up"
      />
      <p
        style={{
          margin: "12px 4px 0",
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
        Showing up daily is half the work.
      </p>
      <div style={{ flex: 1 }} />
      <ChunkyButton onClick={onNext} disabled={!done}>
        Show me more
      </ChunkyButton>
    </ConvoStage>
  );
}

// ── P4 (NEW): Bond — absence makes Bugsy sad (two-phase morph) ─
// Phase 1: Bugsy waving, "I love when they visit..."
// Phase 2: Bugsy sad with tear, "...if they don't, I get sad."
export function ParentBondAbsence({
  tint,
  onNext,
  onBack,
}: Common & { onNext: () => void }) {
  const [phase, setPhase] = useState<"happy" | "sad">("happy");
  const [bubbleDone, setBubbleDone] = useState(false);

  // After the happy phase finishes typewriting, hold for a beat,
  // then morph into the sad phase — the contrast IS the story.
  useEffect(() => {
    if (phase === "happy" && bubbleDone) {
      const t = setTimeout(() => {
        setBubbleDone(false);
        setPhase("sad");
      }, 1100);
      return () => clearTimeout(t);
    }
  }, [phase, bubbleDone]);

  const text =
    phase === "happy"
      ? "I love when they visit…"
      : "…but if they don't, I get sad.";

  return (
    <ConvoStage step={5 /* soft coral wash */}>
      {onBack && <BackChevron onBack={onBack} />}
      <BugsyStage
        mood={phase === "happy" ? "waving" : "sad"}
        tint={tint}
        size={170}
        animationKey={phase}
      />
      <div style={{ marginTop: 8 }} />
      <SpeechBubble
        key={phase}
        text={text}
        onDone={() => setBubbleDone(true)}
        tail="up"
      />
      <div style={{ flex: 1 }} />
      <ChunkyButton onClick={onNext} disabled={phase !== "sad" || !bubbleDone}>
        Aw, Bugsy
      </ChunkyButton>
    </ConvoStage>
  );
}

// ── P5 (NEW): Bond — finishing matters (two-phase morph) ───────
// Phase 1: Bugsy cheer, "Finish a project? I light up!"
// Phase 2: Bugsy worried with sweat, "Leave it half-done? I cry."
export function ParentBondTasks({
  tint,
  onNext,
  onBack,
}: Common & { onNext: () => void }) {
  const [phase, setPhase] = useState<"finish" | "half">("finish");
  const [bubbleDone, setBubbleDone] = useState(false);

  useEffect(() => {
    if (phase === "finish" && bubbleDone) {
      const t = setTimeout(() => {
        setBubbleDone(false);
        setPhase("half");
      }, 1100);
      return () => clearTimeout(t);
    }
  }, [phase, bubbleDone]);

  const text =
    phase === "finish"
      ? "Finish a project? I light up!"
      : "Leave it half-done? It really hurts.";

  return (
    <ConvoStage step={4 /* streak orange wash */}>
      {onBack && <BackChevron onBack={onBack} />}
      <BugsyStage
        mood={phase === "finish" ? "cheer" : "worried"}
        tint={tint}
        size={170}
        animationKey={phase}
      />
      <div style={{ marginTop: 8 }} />
      <SpeechBubble
        key={phase}
        text={text}
        onDone={() => setBubbleDone(true)}
        tail="up"
      />
      <div style={{ flex: 1 }} />
      <ChunkyButton onClick={onNext} disabled={phase !== "half" || !bubbleDone}>
        I see
      </ChunkyButton>
    </ConvoStage>
  );
}

// ── P6 (NEW): Bond — habit loop summary ───────────────────────
export function ParentBondLoop({
  tint,
  onNext,
  onBack,
}: Common & { onNext: () => void }) {
  const [done, setDone] = useState(false);
  return (
    <ConvoStage step={1 /* lavender — calm togetherness */}>
      {onBack && <BackChevron onBack={onBack} />}
      <BugsyStage mood="excited" tint={tint} size={170} animationKey="p-bond-loop" />
      <div style={{ marginTop: 8 }} />
      <SpeechBubble
        text="Visit daily. Finish what you start. We grow."
        onDone={() => setDone(true)}
        tail="up"
      />
      <p
        style={{
          margin: "12px 4px 0",
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
        That&apos;s the whole loop — small daily wins, real bonds.
      </p>
      <div style={{ flex: 1 }} />
      <ChunkyButton onClick={onNext} disabled={!done}>
        Got it
      </ChunkyButton>
    </ConvoStage>
  );
}

// ── P3: child name → react+age (multi-phase) ──────────────────
// Phase 1: "What's your child's name?"  + name input
// Phase 2: "Perfect. And how old is [Name]?"  + age picker
export function ParentChildSetup({
  tint,
  childName,
  setChildName,
  childAge,
  setChildAge,
  onNext,
  onBack,
}: Common & {
  childName: string;
  setChildName: (s: string) => void;
  childAge: number | null;
  setChildAge: (n: number) => void;
  onNext: () => void;
}) {
  const [phase, setPhase] = useState<"name" | "age">("name");
  const [bubbleDone, setBubbleDone] = useState(false);
  const ages = Array.from({ length: AGE_MAX - AGE_MIN + 1 }, (_, i) => AGE_MIN + i);

  const text =
    phase === "name"
      ? "What's your child's name?"
      : `Perfect. And how old is ${childName.trim()}?`;

  return (
    <ConvoStage step={3 /* mint */}>
      {onBack && <BackChevron onBack={onBack} />}
      <BugsyStage
        mood={phase === "age" ? "cheer" : "happy"}
        tint={tint}
        size={140}
        animationKey={phase}
      />
      <div style={{ marginTop: 8 }} />
      <SpeechBubble
        key={phase}
        text={text}
        onDone={() => setBubbleDone(true)}
        tail="up"
      />

      {phase === "name" ? (
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
            value={childName}
            onChange={(e) => setChildName(e.target.value)}
            placeholder="Your child's name"
            style={inputStyle}
          />
          <div style={{ height: 12 }} />
          <ChunkyButton
            onClick={() => {
              setBubbleDone(false);
              setPhase("age");
            }}
            disabled={!bubbleDone || !childName.trim()}
          >
            Continue
          </ChunkyButton>
        </div>
      ) : (
        <>
          <div
            style={{
              marginTop: 18,
              opacity: bubbleDone ? 1 : 0,
              transition: "opacity 0.4s ease",
              pointerEvents: bubbleDone ? "auto" : "none",
            }}
          >
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
              {ages.map((a, i) => {
                const active = childAge === a;
                return (
                  <button
                    key={a}
                    onClick={() => setChildAge(a)}
                    style={{
                      aspectRatio: "1 / 1",
                      borderRadius: 14,
                      cursor: "pointer",
                      border: active ? "3px solid var(--primary)" : "2px solid var(--border)",
                      background: active ? "var(--accent-soft)" : "var(--surface)",
                      color: active ? "var(--primary)" : "var(--ink)",
                      fontFamily: "var(--font-nunito), system-ui",
                      fontWeight: 800,
                      fontSize: 22,
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
          <ChunkyButton onClick={onNext} disabled={!bubbleDone || childAge === null}>
            Continue
          </ChunkyButton>
        </>
      )}

      {phase === "name" && <div style={{ flex: 1 }} />}
    </ConvoStage>
  );
}

// ── P4: clan setup ────────────────────────────────────────────
// Bubble: "Would you like to set up their team now?"
// 3 options: Create a Clan / Invite Friends / Let them choose
export function ParentClan({
  tint,
  childName,
  intent,
  setIntent,
  onNext,
  onBack,
}: Common & {
  childName: string;
  intent: ClanIntent | null;
  setIntent: (i: ClanIntent | null) => void;
  onNext: () => void;
}) {
  const [done, setDone] = useState(false);
  const [substep, setSubstep] = useState<"pick" | "create" | "invite">("pick");
  const [clanName, setClanName] = useState(intent?.kind === "create" ? intent.name : "");
  const [emoji, setEmoji] = useState(intent?.kind === "create" ? intent.emoji : "🦊");
  const [code, setCode] = useState(intent?.kind === "join-link" ? intent.code : "");
  const EMOJI_CHOICES = ["🦊", "🐉", "🦦", "🐧", "🐼", "🦁", "🐝", "🐙"];
  void childName; // reserved for personalised copy

  if (substep === "pick") {
    return (
      <ConvoStage step={0 /* coral wash */}>
        {onBack && <BackChevron onBack={onBack} />}
        <BugsyStage mood="thinking" tint={tint} size={140} animationKey="p-clan" />
        <div style={{ marginTop: 8 }} />
        <SpeechBubble
          text="Would you like to set up their team now?"
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
          <Option emoji="✨" title="Create a clan" sub="Be the founder" onClick={() => setSubstep("create")} />
          <Option emoji="🔗" title="Invite friends" sub="I have a code to share" onClick={() => setSubstep("invite")} />
          <Option
            emoji="🧭"
            title="Let them choose"
            sub="They'll pick one inside the app"
            onClick={() => {
              setIntent({ kind: "let-child-explore" });
              onNext();
            }}
          />
        </div>
        <div style={{ flex: 1 }} />
      </ConvoStage>
    );
  }

  if (substep === "create") {
    const valid = clanName.trim().length >= 3;
    return (
      <ConvoStage step={0}>
        {onBack && <BackChevron onBack={() => setSubstep("pick")} />}
        <BugsyStage mood="cheer" tint={tint} size={130} animationKey="p-clan-create" />
        <SpeechBubble text="Pick a crest and a name." tail="up" />
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
            Create clan
          </ChunkyButton>
        </div>
        <div style={{ flex: 1 }} />
      </ConvoStage>
    );
  }

  // invite
  const valid = code.trim().length >= 4;
  return (
    <ConvoStage step={0}>
      {onBack && <BackChevron onBack={() => setSubstep("pick")} />}
      <BugsyStage mood="thinking" tint={tint} size={130} animationKey="p-clan-invite" />
      <SpeechBubble text="Pop in the invite code." tail="up" />
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
          Join clan
        </ChunkyButton>
      </div>
      <div style={{ flex: 1 }} />
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

// ── P4 (new): "What are you noticing?" — multi-select screening ──
// Sits before the Meet-Bugsy moment so the answers feed into the
// kind of projects we'll surface for the child.
export function ParentNoticing({
  tint,
  childName,
  noticing,
  setNoticing,
  onNext,
  onBack,
}: Common & {
  childName: string;
  noticing: string[];
  setNoticing: (n: string[]) => void;
  onNext: () => void;
}) {
  const [done, setDone] = useState(false);
  const friend = childName.trim() || "your child";
  const toggle = (key: string) => {
    if (noticing.includes(key)) setNoticing(noticing.filter((k) => k !== key));
    else setNoticing([...noticing, key]);
  };

  return (
    <ConvoStage step={1}>
      {onBack && <BackChevron onBack={onBack} />}
      <BugsyStage mood="thinking" tint={tint} size={130} animationKey="p-notice" />
      <div style={{ marginTop: 8 }} />
      <SpeechBubble
        text={`What are you noticing about ${friend}?`}
        onDone={() => setDone(true)}
        tail="up"
      />

      <div
        style={{
          marginTop: 14,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          overflowY: "auto",
          opacity: done ? 1 : 0,
          transition: "opacity 0.4s ease",
          pointerEvents: done ? "auto" : "none",
        }}
      >
        {NOTICING_OPTIONS.map((opt) => {
          const active = noticing.includes(opt.key);
          return (
            <button
              key={opt.key}
              onClick={() => toggle(opt.key)}
              style={{
                textAlign: "left",
                padding: "10px 14px",
                borderRadius: 16,
                cursor: "pointer",
                background: active ? "var(--accent-soft)" : "var(--surface)",
                border: active ? "2px solid var(--primary)" : "2px solid var(--border)",
                boxShadow: active
                  ? "0 2px 0 var(--primary-shadow)"
                  : "0 2px 0 var(--border)",
                display: "flex",
                gap: 12,
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 11,
                  background: "var(--surface-1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  flexShrink: 0,
                }}
              >
                {opt.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: "var(--font-nunito), system-ui",
                    fontSize: 14.5,
                    fontWeight: 800,
                    color: "var(--ink)",
                    letterSpacing: -0.1,
                  }}
                >
                  {opt.title}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-nunito), system-ui",
                    fontSize: 12,
                    fontWeight: 700,
                    color: "var(--ink-muted)",
                    marginTop: 1,
                  }}
                >
                  {opt.sub}
                </div>
              </div>
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 999,
                  border: active ? "none" : "2px solid var(--border)",
                  background: active ? "var(--primary)" : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  boxShadow: active ? "0 2px 0 var(--primary-shadow)" : "none",
                }}
              >
                {active && (
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
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div style={{ flex: 1, minHeight: 8 }} />

      <div
        style={{
          fontFamily: "var(--font-nunito), system-ui",
          fontSize: 12,
          fontWeight: 700,
          color: "var(--ink-muted)",
          textAlign: "center",
          marginBottom: 8,
        }}
      >
        {noticing.length === 0 ? "Pick at least one" : `${noticing.length} selected — pick a few more if you like`}
      </div>
      <ChunkyButton onClick={onNext} disabled={!done || noticing.length === 0}>
        Next
      </ChunkyButton>
    </ConvoStage>
  );
}

// ── P9 (NEW): login guardrail before handover ─────────────────
// Sits right before the Meet-Bugsy moment — the parent's last
// step before they physically hand the phone over. Locks the
// account so progress isn't lost and the kid can't get back into
// parent-only screens without a grown-up.
export function ParentLogin({
  tint,
  childName,
  onNext,
  onBack,
}: Common & { childName: string; onNext: () => void }) {
  const friend = childName.trim() || "your child";
  return (
    <LoginScreen
      tint={tint}
      mood="happy"
      step={6}
      bubbleText={`Quick — sign in to save ${friend}'s progress.`}
      ctaLabel="Lock in your account"
      onContinue={() => onNext()}
      onBack={onBack}
    />
  );
}

// ── P5: meet Bugsy / done ─────────────────────────────────────
// Phase 1: "[Child] is all set. Meet Bugsy."  (Bugsy entrance)
// Phase 2: "Bugsy will look after them every single day."
export function ParentDone({
  tint,
  childName,
  onHandOver,
  onBack,
}: Common & { parentName: string; childName: string; onHandOver: () => void }) {
  const [phase, setPhase] = useState<"meet" | "reassure">("meet");
  const [bubbleDone, setBubbleDone] = useState(false);

  useEffect(() => {
    if (phase === "meet" && bubbleDone) {
      const t = setTimeout(() => {
        setBubbleDone(false);
        setPhase("reassure");
      }, 1000);
      return () => clearTimeout(t);
    }
  }, [phase, bubbleDone]);

  const friend = childName.trim() || "Your child";
  const text =
    phase === "meet"
      ? `${friend} is all set. Meet Bugsy.`
      : "Bugsy will look after them every single day.";

  return (
    <ConvoStage step={4 /* rainbow finale */}>
      {onBack && <BackChevron onBack={onBack} />}
      <BugsyStage
        mood="cheer"
        tint={tint}
        size={200}
        animationKey={phase}
      />
      <div style={{ marginTop: 8 }} />
      <SpeechBubble
        key={phase}
        text={text}
        onDone={() => setBubbleDone(true)}
        tail="up"
      />
      <div style={{ flex: 1 }} />
      <ChunkyButton
        onClick={onHandOver}
        disabled={phase !== "reassure" || !bubbleDone}
      >
        I&apos;m ready
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

export type { Clan };
