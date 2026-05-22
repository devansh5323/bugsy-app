"use client";

import { useEffect, useState } from "react";
import { BugsyStage, ChunkyButton, ConvoStage, SpeechBubble } from "./ConvoUI";
import {
  AGE_MAX,
  AGE_MIN,
  OPEN_CLANS,
  type ClanIntent,
} from "../../lib/data";

export const CHILD_STEPS = 5;

type Common = { tint: number };

// ── Step 1: Intro + name ──────────────────────────────────────
export function ChildIntro({
  tint,
  childName,
  setChildName,
  onNext,
}: Common & { childName: string; setChildName: (s: string) => void; onNext: () => void }) {
  const [bubbleDone, setBubbleDone] = useState(false);
  const line =
    "Heyyyy! Oh my goodness, a new friend! I've been waiting for you. I'm Bugsy. What's your name?";

  return (
    <ConvoStage step={0}>
      <BugsyStage mood="waving" tint={tint} size={210} animationKey="intro" />
      <div style={{ marginTop: 10 }} />
      <SpeechBubble text={line} onDone={() => setBubbleDone(true)} tail="up" />

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
          placeholder="Type your name…"
          style={{
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
          }}
        />
        <div style={{ height: 12 }} />
        <ChunkyButton onClick={onNext} disabled={!childName.trim()}>
          That&apos;s me →
        </ChunkyButton>
      </div>

      <div style={{ flex: 1 }} />
    </ConvoStage>
  );
}

// ── Step 2: Name reaction + age ───────────────────────────────
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
  const line = `${childName}?! I LOVE that name. Okay, how old are you, ${childName}?`;

  return (
    <ConvoStage step={1}>
      <BugsyStage mood="cheer" tint={tint} size={190} animationKey="age" />
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
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
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
      </div>

      <div style={{ flex: 1 }} />

      <ChunkyButton onClick={onNext} disabled={!done || childAge === null}>
        Continue →
      </ChunkyButton>
    </ConvoStage>
  );
}

// ── Step 3: Team-up + hat demo ────────────────────────────────
export function ChildTeamUp({
  tint,
  childName,
  onNext,
}: Common & { childName: string; onNext: () => void }) {
  const line = `Okay ${childName}, here's the deal. You and me? We're a team. Every project you finish, I get cooler. Hat-wearing, badge-collecting, legendary-level cool. Watch.`;
  const [done, setDone] = useState(false);
  const [showHat, setShowHat] = useState(false);

  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => setShowHat(true), 350);
    return () => clearTimeout(t);
  }, [done]);

  return (
    <ConvoStage step={2}>
      <div style={{ position: "relative" }}>
        <BugsyStage
          mood={showHat ? "cheer" : "happy"}
          tint={tint}
          hat={showHat ? "crown" : undefined}
          animationKey={showHat ? "hat-on" : "hat-off"}
          size={210}
          lean={!done}
        />
        {showHat && (
          <div
            aria-hidden
            style={{
              position: "absolute",
              top: "30%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: 26,
              animation: "float-up 1s ease-out forwards",
              pointerEvents: "none",
            }}
          >
            ✨ +1 Crown
          </div>
        )}
      </div>
      <div style={{ marginTop: 10 }} />
      <SpeechBubble text={line} onDone={() => setDone(true)} tail="up" />

      <div style={{ flex: 1 }} />

      <ChunkyButton onClick={onNext} disabled={!done}>
        Whoa. Let&apos;s go →
      </ChunkyButton>
    </ConvoStage>
  );
}

// ── Step 4: Clan choice ───────────────────────────────────────
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
  const [substep, setSubstep] = useState<"pick" | "name" | "code" | "open">("pick");
  const line = `Now, ${childName} — are your friends already here, or are we starting fresh?`;

  const [clanName, setClanName] = useState(intent?.kind === "create" ? intent.name : "");
  const [emoji, setEmoji] = useState(intent?.kind === "create" ? intent.emoji : "🦊");
  const EMOJI_CHOICES = ["🦊", "🐉", "🦦", "🐧", "🐼", "🦁", "🐝", "🐙"];
  const [code, setCode] = useState(intent?.kind === "join-link" ? intent.code : "");

  if (substep === "pick") {
    return (
      <ConvoStage step={3}>
        <BugsyStage mood="thinking" tint={tint} size={180} animationKey="clan-pick" />
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
          <ChildOption
            emoji="👯"
            title="Join a friend's clan"
            sub="Got a code from them"
            onClick={() => setSubstep("code")}
          />
          <ChildOption
            emoji="👑"
            title="Make my own clan"
            sub="I'll be the leader"
            onClick={() => setSubstep("name")}
          />
          <ChildOption
            emoji="🌍"
            title="Find a clan"
            sub="Show me who's looking for friends"
            onClick={() => setSubstep("open")}
          />
        </div>
        <div style={{ flex: 1 }} />
      </ConvoStage>
    );
  }

  if (substep === "name") {
    const valid = clanName.trim().length >= 3;
    return (
      <ConvoStage step={3}>
        <BugsyStage mood="cheer" tint={tint} size={160} animationKey="clan-name" />
        <SpeechBubble text="Yes! What should we call us?" tail="up" />
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
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
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
            style={{
              width: "100%",
              height: 60,
              boxSizing: "border-box",
              padding: "0 20px",
              borderRadius: 20,
              border: "none",
              background: "rgba(255,255,255,0.95)",
              fontFamily: "var(--font-inter), system-ui",
              fontSize: 18,
              fontWeight: 600,
              color: "var(--ink)",
              outline: "none",
              boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
              textAlign: "center",
            }}
          />
          <div style={{ height: 12 }} />
          <ChunkyButton
            onClick={() => {
              setIntent({ kind: "create", name: clanName.trim(), emoji });
              onNext();
            }}
            disabled={!valid}
          >
            {valid ? `Create ${clanName.trim()}` : "Type at least 3 letters"}
          </ChunkyButton>
        </div>
        <div style={{ flex: 1 }} />
      </ConvoStage>
    );
  }

  if (substep === "code") {
    const valid = code.trim().length >= 4;
    return (
      <ConvoStage step={3}>
        <BugsyStage mood="thinking" tint={tint} size={160} animationKey="clan-code" />
        <SpeechBubble text="Sweet! Type the code your friend gave you." tail="up" />
        <div style={{ marginTop: 14 }}>
          <input
            autoFocus
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="FOXES42"
            maxLength={12}
            style={{
              width: "100%",
              height: 70,
              boxSizing: "border-box",
              padding: "0 22px",
              borderRadius: 22,
              border: "none",
              background: "rgba(255,255,255,0.95)",
              fontFamily: "var(--font-inter), system-ui",
              fontSize: 26,
              fontWeight: 700,
              color: "var(--ink)",
              outline: "none",
              boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
              textAlign: "center",
              letterSpacing: 3,
            }}
          />
          <div style={{ height: 12 }} />
          <ChunkyButton
            onClick={() => {
              setIntent({ kind: "join-link", code: code.trim(), clan: OPEN_CLANS[0] });
              onNext();
            }}
            disabled={!valid}
          >
            Join →
          </ChunkyButton>
        </div>
        <div style={{ flex: 1 }} />
      </ConvoStage>
    );
  }

  // open clans
  return (
    <ConvoStage step={3}>
      <BugsyStage mood="happy" tint={tint} size={140} animationKey="clan-open" />
      <SpeechBubble text="Here's who's looking for friends right now. Pick one!" tail="up" />
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
                borderRadius: 18,
                cursor: "pointer",
                background: active ? "#fff" : "rgba(255,255,255,0.92)",
                color: "var(--ink)",
                border: `2px solid ${active ? "oklch(72% 0.18 320)" : "transparent"}`,
                display: "flex",
                gap: 12,
                alignItems: "center",
                boxShadow: "0 6px 16px rgba(0,0,0,0.10)",
              }}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  background: "oklch(94% 0.04 70)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                  flexShrink: 0,
                }}
              >
                {c.emoji}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "var(--font-inter), system-ui", fontSize: 15, fontWeight: 600 }}>{c.name}</div>
                <div style={{ fontFamily: "var(--font-inter), system-ui", fontSize: 12, color: "var(--ink-50)", marginTop: 1 }}>
                  {c.members} friends · {c.points.toLocaleString()} pts
                </div>
              </div>
            </button>
          );
        })}
      </div>
      <div style={{ flex: 1, minHeight: 8 }} />
      <ChunkyButton onClick={onNext} disabled={intent?.kind !== "join-open"}>
        Join clan →
      </ChunkyButton>
    </ConvoStage>
  );
}

function ChildOption({
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

// ── Step 5: Send-off + enter app ──────────────────────────────
export function ChildSendoff({
  tint,
  childName,
  equippedHat,
  onEnter,
}: Common & { childName: string; equippedHat: string | null; onEnter: () => void }) {
  const [done, setDone] = useState(false);
  const line = `Alright ${childName}, let's do this. Together we're going to take on the WHOLE world. You ready? Because I was BORN ready.`;

  return (
    <ConvoStage step={4}>
      <BugsyStage
        mood="cheer"
        tint={tint}
        hat={equippedHat ?? undefined}
        animationKey="sendoff"
        size={230}
      />
      <div style={{ marginTop: 10 }} />
      <SpeechBubble text={line} onDone={() => setDone(true)} tail="up" />

      <div style={{ flex: 1 }} />

      <ChunkyButton onClick={onEnter} disabled={!done}>
        I&apos;m ready! 🚀
      </ChunkyButton>
    </ConvoStage>
  );
}
