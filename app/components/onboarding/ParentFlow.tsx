"use client";

import { useState } from "react";
import { BackChevron, BugsyStage, ChunkyButton, ConvoStage, SpeechBubble } from "./ConvoUI";
import {
  AGE_MAX,
  AGE_MIN,
  OPEN_CLANS,
  type Clan,
  type ClanIntent,
} from "../../lib/data";

export const PARENT_STEPS = 7;

type Common = { tint: number; onBack: () => void };

// ── Step 1: Parent name ───────────────────────────────────────
export function ParentName({
  tint,
  parentName,
  setParentName,
  onNext,
  onBack,
}: Common & { parentName: string; setParentName: (s: string) => void; onNext: () => void }) {
  const [done, setDone] = useState(false);
  const line =
    "Hi there! I'm Bugsy. I'll be your child's brain-buddy soon — but first, what should I call you?";

  return (
    <ConvoStage step={5 /* lavender */}>
      <BackChevron onBack={onBack} />
      <BugsyStage mood="waving" tint={tint} size={190} animationKey="p-intro" />
      <div style={{ marginTop: 10 }} />
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
          value={parentName}
          onChange={(e) => setParentName(e.target.value)}
          placeholder="Your name"
          style={inputStyle}
        />
      </div>
      <div style={{ flex: 1 }} />
      <ChunkyButton onClick={onNext} disabled={!done || !parentName.trim()}>
        Continue →
      </ChunkyButton>
    </ConvoStage>
  );
}

// ── Step 2: What Clan Wars is ─────────────────────────────────
export function ParentIntro({
  tint,
  parentName,
  onNext,
  onBack,
}: Common & { parentName: string; onNext: () => void }) {
  const [done, setDone] = useState(false);
  const line = `Nice to meet you, ${parentName}. Here's the short version. Every day your kid picks from creative, learning, or physical projects. Finish one — they earn points, I get a new look, their clan climbs the leaderboard. No public chat. No DMs. Just teamwork.`;

  return (
    <ConvoStage step={6 /* azure */}>
      <BackChevron onBack={onBack} />
      <BugsyStage mood="happy" tint={tint} size={180} animationKey="p-intro2" />
      <div style={{ marginTop: 10 }} />
      <SpeechBubble text={line} onDone={() => setDone(true)} tail="up" />
      <div style={{ flex: 1 }} />
      <ChunkyButton onClick={onNext} disabled={!done}>
        Got it →
      </ChunkyButton>
    </ConvoStage>
  );
}

// ── Step 3: Create account ────────────────────────────────────
export function ParentAccount({
  tint,
  onNext,
  onBack,
}: Common & { onNext: () => void }) {
  const [done, setDone] = useState(false);
  const [mode, setMode] = useState<"create" | "signin">("create");
  const line =
    "Let's keep their progress safe. Pick how you'd like to sign in — I'll only use it for weekly summaries.";

  return (
    <ConvoStage step={2 /* sky-teal */}>
      <BackChevron onBack={onBack} />
      <BugsyStage mood="thinking" tint={tint} size={170} animationKey="p-account" />
      <div style={{ marginTop: 10 }} />
      <SpeechBubble text={line} onDone={() => setDone(true)} tail="up" />

      <div
        style={{
          marginTop: 16,
          opacity: done ? 1 : 0,
          transition: "opacity 0.4s ease",
          pointerEvents: done ? "auto" : "none",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <AuthButton onClick={onNext}>
          <GoogleG />
          {mode === "create" ? "Continue with Google" : "Sign in with Google"}
        </AuthButton>
        <AuthButton onClick={onNext}>✉️ {mode === "create" ? "Continue with email" : "Sign in with email"}</AuthButton>
      </div>

      <div style={{ flex: 1 }} />

      <button
        onClick={() => setMode(mode === "create" ? "signin" : "create")}
        style={{
          background: "transparent",
          border: "none",
          color: "rgba(255,255,255,0.92)",
          fontFamily: "var(--font-inter), system-ui",
          fontSize: 14,
          fontWeight: 600,
          cursor: "pointer",
          padding: "8px 0",
          textDecoration: "underline",
          textUnderlineOffset: 4,
        }}
      >
        {mode === "create" ? "I already have an account" : "Create a new account"}
      </button>
    </ConvoStage>
  );
}

function AuthButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        height: 60,
        borderRadius: 18,
        border: "none",
        background: "rgba(255,255,255,0.97)",
        cursor: "pointer",
        fontFamily: "var(--font-inter), system-ui",
        fontSize: 15,
        fontWeight: 600,
        color: "var(--ink)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        boxShadow: "0 6px 0 rgba(0,0,0,0.14)",
      }}
    >
      {children}
    </button>
  );
}

function GoogleG() {
  return (
    <svg width="20" height="20" viewBox="0 0 18 18">
      <path d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.79 2.72v2.26h2.9c1.7-1.56 2.69-3.87 2.69-6.62z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.81.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.95v2.33A9 9 0 0 0 9 18z" fill="#34A853"/>
      <path d="M3.95 10.7A5.41 5.41 0 0 1 3.66 9c0-.59.1-1.16.29-1.7V4.97H.95A9 9 0 0 0 0 9c0 1.45.35 2.83.95 4.04l3-2.34z" fill="#FBBC05"/>
      <path d="M9 3.58c1.32 0 2.5.45 3.44 1.34l2.58-2.58A9 9 0 0 0 9 0 9 9 0 0 0 .95 4.97l3 2.33C4.66 5.17 6.65 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}

// ── Step 4: Child's name ──────────────────────────────────────
export function ParentChildName({
  tint,
  childName,
  setChildName,
  onNext,
  onBack,
}: Common & { childName: string; setChildName: (s: string) => void; onNext: () => void }) {
  const [done, setDone] = useState(false);
  const line = "Now tell me about the kiddo. What's their name?";

  return (
    <ConvoStage step={0 /* pink-coral */}>
      <BackChevron onBack={onBack} />
      <BugsyStage mood="happy" tint={tint} size={170} animationKey="p-childname" />
      <div style={{ marginTop: 10 }} />
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
          placeholder="Your child's name"
          style={inputStyle}
        />
      </div>
      <div style={{ flex: 1 }} />
      <ChunkyButton onClick={onNext} disabled={!done || !childName.trim()}>
        Continue →
      </ChunkyButton>
    </ConvoStage>
  );
}

// ── Step 5: Child's age ───────────────────────────────────────
export function ParentChildAge({
  tint,
  childName,
  childAge,
  setChildAge,
  onNext,
  onBack,
}: Common & {
  childName: string;
  childAge: number | null;
  setChildAge: (n: number) => void;
  onNext: () => void;
}) {
  const [done, setDone] = useState(false);
  const line = `Got it — ${childName || "your child"}. How old?`;
  const ages = Array.from({ length: AGE_MAX - AGE_MIN + 1 }, (_, i) => AGE_MIN + i);

  return (
    <ConvoStage step={1 /* sun */}>
      <BackChevron onBack={onBack} />
      <BugsyStage mood="cheer" tint={tint} size={170} animationKey="p-childage" />
      <div style={{ marginTop: 10 }} />
      <SpeechBubble text={line} onDone={() => setDone(true)} tail="up" />

      <div
        style={{
          marginTop: 18,
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 10,
          opacity: done ? 1 : 0,
          transition: "opacity 0.4s ease",
          pointerEvents: done ? "auto" : "none",
        }}
      >
        {ages.map((a, i) => {
          const active = childAge === a;
          return (
            <button
              key={a}
              onClick={() => setChildAge(a)}
              style={{
                aspectRatio: "1 / 1",
                borderRadius: 18,
                cursor: "pointer",
                border: "none",
                background: active ? "#fff" : "rgba(255,255,255,0.22)",
                color: active ? "var(--ink)" : "#fff",
                fontFamily: "var(--font-fraunces), serif",
                fontWeight: 500,
                fontSize: 26,
                fontVariationSettings: "'SOFT' 80, 'WONK' 1",
                boxShadow: active ? "0 6px 0 rgba(0,0,0,0.18)" : "0 4px 0 rgba(0,0,0,0.10)",
                transition: "transform 0.12s ease, box-shadow 0.12s ease",
                transform: active ? "translateY(-2px) scale(1.04)" : "scale(1)",
                animation: `bugsy-pop 0.35s cubic-bezier(0.22, 1.5, 0.36, 1) ${0.04 * i}s backwards`,
              }}
            >
              {a}
            </button>
          );
        })}
      </div>

      <div style={{ flex: 1 }} />
      <ChunkyButton onClick={onNext} disabled={!done || childAge === null}>
        Continue →
      </ChunkyButton>
    </ConvoStage>
  );
}

// ── Step 6: Clan setup ────────────────────────────────────────
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
  const line = `How should we start ${childName || "your child"}'s clan?`;

  const [clanName, setClanName] = useState(intent?.kind === "create" ? intent.name : "");
  const [emoji, setEmoji] = useState(intent?.kind === "create" ? intent.emoji : "🦊");
  const [code, setCode] = useState(intent?.kind === "join-link" ? intent.code : "");
  const EMOJI_CHOICES = ["🦊", "🐉", "🦦", "🐧", "🐼", "🦁", "🐝", "🐙"];

  if (substep === "pick") {
    return (
      <ConvoStage step={3 /* mint */}>
        <BackChevron onBack={onBack} />
        <BugsyStage mood="thinking" tint={tint} size={170} animationKey="p-clanpick" />
        <div style={{ marginTop: 10 }} />
        <SpeechBubble text={line} onDone={() => setDone(true)} tail="up" />

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
          <ParentOption
            emoji="✨"
            title="Create a clan"
            sub="Be the founder. Invite friends after."
            onClick={() => setSubstep("create")}
          />
          <ParentOption
            emoji="🔗"
            title="Use an invite code"
            sub="Got one from another parent?"
            onClick={() => setSubstep("invite")}
          />
          <ParentOption
            emoji="🧭"
            title="Let my child pick"
            sub="They'll choose during their onboarding."
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
      <ConvoStage step={3}>
        <BackChevron onBack={() => setSubstep("pick")} />
        <BugsyStage mood="cheer" tint={tint} size={150} animationKey="p-clanname" />
        <SpeechBubble text="Pick a crest and a name." tail="up" />
        <div style={{ marginTop: 14 }}>
          <div
            style={{
              fontFamily: "var(--font-inter), system-ui",
              fontSize: 12,
              fontWeight: 700,
              color: "rgba(255,255,255,0.85)",
              textTransform: "uppercase",
              letterSpacing: 0.8,
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
                    borderRadius: 14,
                    cursor: "pointer",
                    border: "none",
                    background: active ? "#fff" : "rgba(255,255,255,0.22)",
                    fontSize: 24,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.15s ease",
                    transform: active ? "scale(1.08)" : "scale(1)",
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
            style={{ ...inputStyle, height: 58, fontSize: 18 }}
          />
        </div>
        <div style={{ flex: 1 }} />
        <ChunkyButton
          onClick={() => {
            setIntent({ kind: "create", name: clanName.trim(), emoji });
            onNext();
          }}
          disabled={!valid}
        >
          Create clan →
        </ChunkyButton>
      </ConvoStage>
    );
  }

  // invite
  const valid = code.trim().length >= 4;
  return (
    <ConvoStage step={3}>
      <BackChevron onBack={() => setSubstep("pick")} />
      <BugsyStage mood="thinking" tint={tint} size={150} animationKey="p-claninvite" />
      <SpeechBubble text="Pop in the invite code." tail="up" />
      <div style={{ marginTop: 14 }}>
        <input
          autoFocus
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="FOXES42"
          maxLength={12}
          style={{ ...inputStyle, height: 64, fontSize: 22, letterSpacing: 3, fontWeight: 700 }}
        />
      </div>
      <div style={{ flex: 1 }} />
      <ChunkyButton
        onClick={() => {
          setIntent({ kind: "join-link", code: code.trim(), clan: OPEN_CLANS[0] });
          onNext();
        }}
        disabled={!valid}
      >
        Join clan →
      </ChunkyButton>
    </ConvoStage>
  );
}

function ParentOption({
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
        textAlign: "left",
        padding: "14px 16px",
        borderRadius: 22,
        cursor: "pointer",
        background: "rgba(255,255,255,0.95)",
        color: "var(--ink)",
        border: "none",
        display: "flex",
        gap: 14,
        alignItems: "center",
        boxShadow: "0 6px 0 rgba(0,0,0,0.12)",
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 14,
          background: "oklch(94% 0.04 320)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 26,
          flexShrink: 0,
        }}
      >
        {emoji}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: "var(--font-inter), system-ui",
            fontSize: 16,
            fontWeight: 700,
            color: "var(--ink)",
            letterSpacing: -0.2,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontFamily: "var(--font-inter), system-ui",
            fontSize: 12.5,
            color: "var(--ink-60)",
            marginTop: 2,
          }}
        >
          {sub}
        </div>
      </div>
      <svg width="10" height="16" viewBox="0 0 10 16">
        <path d="M2 1l6 7-6 7" stroke="var(--ink-40)" strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
    </button>
  );
}

// ── Step 7: Confirmation / hand over ──────────────────────────
export function ParentDone({
  tint,
  parentName,
  childName,
  onHandOver,
  onBack,
}: Common & { parentName: string; childName: string; onHandOver: () => void }) {
  const [done, setDone] = useState(false);
  const line = `All set, ${parentName || "friend"}. I can't wait to meet ${childName || "your kiddo"}. When you're ready, hand the phone over — I'll take it from here.`;

  return (
    <ConvoStage step={4 /* rainbow finale */}>
      <BackChevron onBack={onBack} />
      <BugsyStage mood="cheer" tint={tint} size={210} animationKey="p-done" />
      <div style={{ marginTop: 10 }} />
      <SpeechBubble text={line} onDone={() => setDone(true)} tail="up" />

      <div style={{ flex: 1 }} />

      <ChunkyButton onClick={onHandOver} disabled={!done}>
        Hand the phone to {childName || "your child"} →
      </ChunkyButton>
    </ConvoStage>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: 64,
  boxSizing: "border-box",
  padding: "0 22px",
  borderRadius: 22,
  border: "none",
  background: "rgba(255,255,255,0.95)",
  fontFamily: "var(--font-inter), system-ui",
  fontSize: 20,
  fontWeight: 600,
  color: "var(--ink)",
  outline: "none",
  boxShadow: "0 8px 22px rgba(0,0,0,0.12)",
  textAlign: "center",
  letterSpacing: -0.2,
};

export type { Clan };
