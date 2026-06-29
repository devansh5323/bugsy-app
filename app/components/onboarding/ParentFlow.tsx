"use client";

import { useEffect, useState } from "react";
import { BackChevron, BugsyStage, ChunkyButton, ConvoStage, SpeechBubble } from "./ConvoUI";
import { RoomBackdrop, FamilyBackdrop } from "./ChildMeet";
import { BoboHead } from "../Mascot";
import { Typewriter } from "../Typewriter";
import { LoginScreen } from "./LoginScreen";
import {
  AGE_MAX,
  AGE_MIN,
  NOTICING_OPTIONS,
  OPEN_CLANS,
  PARENT_GOAL_OPTIONS,
  RELATIONSHIP_OPTIONS,
  type ChipOption,
  type Clan,
  type ClanIntent,
  type Mood,
  type Relationship,
} from "../../lib/data";

// 8 screens after the shared "Who are you?" branch:
//   0 ParentWelcome   — Bugsy greets the grown-up + pet beat
//   1 WhoIsBugsy       — missions / growth / emotional support
//   2 ParentName       — "Tell me about you" (name + relationship)
//   3 ParentChildSetup — child name → age
//   4 ParentNoticing   — what they're noticing
//   5 ParentGoals      — what they'd love to improve
//   6 ParentLogin      — sign in
//   7 ParentDone       — handoff to the child
export const PARENT_STEPS = 12;

type Common = { tint: number; onBack?: () => void };

// ── P0: parent name + relationship (ask → react) ──────────────
// Phase 1: "Great. Tell me about you." (name input + Mom/Dad/Guardian chips)
// Phase 2: "Lovely to meet you, [Name]." (auto-advances)
export function ParentName({
  tint,
  parentName,
  setParentName,
  relationship,
  setRelationship,
  onNext,
  onBack,
}: Common & {
  parentName: string;
  setParentName: (s: string) => void;
  relationship: Relationship | null;
  setRelationship: (r: Relationship) => void;
  onNext: () => void;
}) {
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
      ? "Tell me about you."
      : `Lovely to meet you, ${parentName.trim()}.`;

  return (
    <ConvoStage step={5} backdrop={<RoomBackdrop chairs />}>
      {onBack && <BackChevron onBack={onBack} />}
      <BugsyStage
        mood={phase === "react" ? "cheer" : "happy"}
        tint={tint}
        size={140}
        animationKey={phase}
      />
      <div style={{ marginTop: 8 }} />
      <SpeechBubble
        key={phase}
        text={text}
        onDone={() => setBubbleDone(true)}
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
          <div style={{ height: 14 }} />
          <FieldLabel>I'm their…</FieldLabel>
          <RelationshipChips value={relationship} onChange={setRelationship} />
          <div style={{ height: 14 }} />
          <ChunkyButton
            onClick={() => {
              setBubbleDone(false);
              setPhase("react");
            }}
            disabled={!bubbleDone || !parentName.trim() || relationship === null}
          >
            Continue
          </ChunkyButton>
        </div>
      )}

      <div style={{ flex: 1 }} />
    </ConvoStage>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
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
      {children}
    </div>
  );
}

export function RelationshipChips({
  value,
  onChange,
}: {
  value: Relationship | null;
  onChange: (r: Relationship) => void;
}) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
      {RELATIONSHIP_OPTIONS.map((opt) => {
        const active = value === opt.key;
        return (
          <button
            key={opt.key}
            onClick={() => onChange(opt.key)}
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
              transition: "transform 0.12s ease, box-shadow 0.12s ease, background 0.15s ease",
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
  );
}

// ── SCREEN 2: Parent selection response ───────────────────────
// Three-beat dialogue: Bugsy welcomes the grown-up, asks to be
// petted (tap him), then explains his developmental purpose.
export function ParentWelcome({
  tint,
  onNext,
  onBack,
}: Common & { onNext: () => void }) {
  const [phase, setPhase] = useState<"good" | "petme" | "missions">("good");
  const [bubbleDone, setBubbleDone] = useState(false);
  const [petKey, setPetKey] = useState(0);

  // After the opening line lands, pause then invite the pet.
  useEffect(() => {
    if (phase === "good" && bubbleDone) {
      const t = setTimeout(() => {
        setBubbleDone(false);
        setPhase("petme");
      }, 1100);
      return () => clearTimeout(t);
    }
  }, [phase, bubbleDone]);

  const text =
    phase === "good"
      ? "Good! Grown-ups help me understand children better."
      : phase === "petme"
      ? "I'm your child's pet and friend — I grow with them every day. Pet me!"
      : "I help kids practice focus and calm thinking through little adventures and missions.";
  const mood: Mood = phase === "missions" ? "cheer" : "happy";

  const pet = () => {
    if (phase !== "petme") return;
    setPetKey((k) => k + 1);
    setBubbleDone(false);
    setPhase("missions");
  };

  return (
    <ConvoStage step={2 /* sky */} backdrop={<RoomBackdrop chairs />}>
      {onBack && <BackChevron onBack={onBack} />}
      <div
        onPointerDown={pet}
        role={phase === "petme" ? "button" : undefined}
        aria-label={phase === "petme" ? "Pet Bugsy" : undefined}
        style={{
          cursor: phase === "petme" ? "pointer" : "default",
          touchAction: "manipulation",
        }}
      >
        <div
          key={petKey}
          style={{
            animation: petKey > 0 ? "bugsy-wiggle 0.5s ease-in-out" : undefined,
            transformOrigin: "bottom center",
          }}
        >
          <BugsyStage mood={mood} tint={tint} size={150} animationKey={phase} />
        </div>
      </div>
      <div style={{ marginTop: 8 }} />
      <SpeechBubble key={phase} text={text} onDone={() => setBubbleDone(true)} />

      {phase === "petme" && bubbleDone && (
        <div
          style={{
            marginTop: 14,
            textAlign: "center",
            fontFamily: "var(--font-nunito), system-ui",
            fontSize: 13,
            fontWeight: 800,
            color: "var(--primary)",
            letterSpacing: 0.3,
            animation: "tap-pulse 1.2s ease-in-out infinite",
          }}
        >
          👆 Tap Bugsy to pet him
        </div>
      )}

      <div style={{ flex: 1 }} />
      {phase === "missions" && (
        <ChunkyButton onClick={onNext} disabled={!bubbleDone}>
          Ready to know more
        </ChunkyButton>
      )}
    </ConvoStage>
  );
}

// ── SCREEN 3: "Who is Bugsy?" ─────────────────────────────────
// Bugsy on the left, three tappable facets on the right. Each
// facet swaps Bugsy's mood + a little prop animation and explains
// one pillar: missions (attention), growth (retention), emotional
// support (companionship). Continue unlocks after exploring.
type BugsyFacet = "missions" | "growth" | "emotional";
const FACETS: {
  key: BugsyFacet;
  emoji: string;
  title: string;
  mood: Mood;
  prop: string;
  line: string;
}[] = [
  {
    key: "missions",
    emoji: "🎯",
    title: "Missions",
    mood: "excited",
    prop: "🐠",
    line: "I guide kids through missions that build attention. Finish one? I light up — and earn a treat!",
  },
  {
    key: "growth",
    emoji: "🌱",
    title: "Growth",
    mood: "cheer",
    prop: "🏅",
    line: "As they practice, I grow with them. Every visit I get a little stronger — badges, collectibles, new places.",
  },
  {
    key: "emotional",
    emoji: "💛",
    title: "Emotional support",
    mood: "happy",
    prop: "🧶",
    line: "I'm a great friend, too — we all need companionship. I need attention daily: cuddles and food.",
  },
];

export function WhoIsBugsy({
  tint,
  onNext,
  onBack,
}: Common & { onNext: () => void }) {
  const [facet, setFacet] = useState<BugsyFacet>("missions");
  const [seen, setSeen] = useState<BugsyFacet[]>(["missions"]);
  const [bubbleDone, setBubbleDone] = useState(false);

  const current = FACETS.find((f) => f.key === facet)!;
  const allSeen = seen.length === FACETS.length;

  const pick = (k: BugsyFacet) => {
    setFacet(k);
    setBubbleDone(false);
    setSeen((prev) => (prev.includes(k) ? prev : [...prev, k]));
  };

  return (
    <ConvoStage step={1 /* lavender */} backdrop={<RoomBackdrop chairs />}>
      {onBack && <BackChevron onBack={onBack} />}

      {/* Bugsy + dialogue side by side — reads as him speaking */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
        <div
          style={{
            position: "relative",
            width: 116,
            flexShrink: 0,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <BugsyStage
            mood={current.mood}
            tint={tint}
            size={106}
            animationKey={facet}
          />
          {/* Facet prop — bobs next to Bugsy */}
          <span
            key={`prop-${facet}`}
            aria-hidden
            style={{
              position: "absolute",
              bottom: 12,
              right: 0,
              fontSize: 26,
              animation: "prop-bob 1.4s ease-in-out infinite",
              filter: "drop-shadow(0 2px 0 rgba(0,0,0,0.12))",
            }}
          >
            {current.prop}
          </span>
        </div>

        {/* Dialogue bubble with a left-pointing tail toward Bugsy */}
        <div
          style={{
            position: "relative",
            flex: 1,
            padding: "14px 16px",
            borderRadius: 18,
            background: "var(--surface)",
            border: "1px solid var(--border-strong)",
            color: "var(--ink)",
            fontFamily: "var(--font-nunito), system-ui",
            fontSize: 14.5,
            fontWeight: 700,
            lineHeight: 1.4,
            boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
            minHeight: 84,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typewriter
            key={facet}
            text={current.line}
            onDone={() => setBubbleDone(true)}
          />
          <span
            aria-hidden
            style={{
              position: "absolute",
              left: -7,
              top: "50%",
              transform: "translateY(-50%) rotate(45deg)",
              width: 14,
              height: 14,
              background: "var(--surface)",
              borderLeft: "1px solid var(--border-strong)",
              borderBottom: "1px solid var(--border-strong)",
              borderRadius: 2,
            }}
          />
        </div>
      </div>

      {/* Facet cards — a row below, 3-up */}
      <div
        style={{
          marginTop: 22,
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 8,
        }}
      >
        {FACETS.map((f) => {
          const active = f.key === facet;
          const visited = seen.includes(f.key);
          return (
            <button
              key={f.key}
              onClick={() => pick(f.key)}
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-start",
                gap: 6,
                padding: "12px 6px 10px",
                borderRadius: 16,
                cursor: "pointer",
                background: active ? "var(--accent-soft)" : "var(--surface)",
                border: active
                  ? "3px solid var(--primary)"
                  : "2px solid var(--border)",
                boxShadow: active
                  ? "0 3px 0 var(--primary-shadow)"
                  : "0 3px 0 var(--border)",
                transform: active ? "translateY(-2px)" : "none",
                transition:
                  "transform 0.12s ease, box-shadow 0.12s ease, background 0.15s ease",
                minHeight: 92,
              }}
            >
              <span style={{ fontSize: 26, lineHeight: 1 }}>{f.emoji}</span>
              <span
                style={{
                  fontFamily: "var(--font-nunito), system-ui",
                  fontSize: 12,
                  fontWeight: 800,
                  color: active ? "var(--primary)" : "var(--ink)",
                  letterSpacing: -0.1,
                  lineHeight: 1.2,
                  textAlign: "center",
                }}
              >
                {f.title}
              </span>
              {visited && !active && (
                <span
                  style={{
                    position: "absolute",
                    top: 6,
                    right: 6,
                    fontSize: 11,
                    color: "var(--correct)",
                  }}
                >
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div style={{ flex: 1, minHeight: 8 }} />
      <ChunkyButton onClick={onNext} disabled={!bubbleDone}>
        {allSeen ? "Continue" : "Tap each to learn more"}
      </ChunkyButton>
    </ConvoStage>
  );
}

// ── P8: Achievements — Bugsy's answer to "What are you noticing?"
// Sits right after ParentNoticing so it reads as a response, not
// a generic preview: parent shares concerns → Bugsy responds with
// three concrete things their child will get out of this.
export function ParentAchieve({
  tint,
  onNext,
  onBack,
}: Common & { onNext: () => void }) {
  const [done, setDone] = useState(false);
  return (
    <ConvoStage step={3 /* purple wash */} backdrop={<RoomBackdrop chairs dusk />}>
      {onBack && <BackChevron onBack={onBack} />}
      <BugsyStage mood="cheer" tint={tint} size={140} animationKey="p-achieve" />
      <div style={{ marginTop: 8 }} />
      <SpeechBubble
        text="Got it! Here's what we'll do together."
        onDone={() => setDone(true)}
      />

      <div
        style={{
          marginTop: 24,
          display: "flex",
          flexDirection: "column",
          // Solid card so the rows stay legible over the room scene.
          background: "var(--surface)",
          border: "1px solid var(--border-strong)",
          borderRadius: 20,
          padding: "8px 16px",
          boxShadow: "0 6px 20px rgba(80,50,20,0.10)",
          opacity: done ? 1 : 0,
          transition: "opacity 0.4s ease",
        }}
      >
        <AchievementRow
          icon={
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src="/achievements/assignment.svg"
              alt=""
              width={32}
              height={32}
              style={{ display: "block" }}
            />
          }
          tint="rgba(206, 130, 255, 0.18)"
          title="Build creative confidence"
          sub="Real skills through hands-on challenges"
        />
        <AchievementDivider />
        <AchievementRow
          icon={
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src="/achievements/win.svg"
              alt=""
              width={32}
              height={32}
              style={{ display: "block" }}
            />
          }
          tint="rgba(255, 200, 0, 0.22)"
          title="Stay curious every day"
          sub="Small wins that turn into a habit"
        />
        <AchievementDivider />
        <AchievementRow
          icon={<BoboHead mood="cheer" tint={tint} size={40} />}
          tint="rgba(255, 92, 138, 0.18)"
          title="Grow alongside Bugsy"
          sub="A buddy who needs them, too"
        />
      </div>

      <div style={{ flex: 1 }} />
      <ChunkyButton onClick={onNext} disabled={!done}>
        Continue
      </ChunkyButton>
    </ConvoStage>
  );
}

function AchievementRow({
  icon,
  tint,
  title,
  sub,
}: {
  icon: React.ReactNode;
  tint: string;
  title: string;
  sub: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: 14,
        alignItems: "center",
        padding: "14px 4px",
      }}
    >
      <div
        style={{
          width: 46,
          height: 46,
          borderRadius: 13,
          background: tint,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          overflow: "hidden",
        }}
      >
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: "var(--font-nunito), system-ui",
            fontSize: 15.5,
            fontWeight: 800,
            color: "var(--ink)",
            letterSpacing: -0.15,
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
            lineHeight: 1.4,
          }}
        >
          {sub}
        </div>
      </div>
    </div>
  );
}

function AchievementDivider() {
  return (
    <div
      style={{
        height: 1,
        background: "var(--border)",
        margin: "0 4px",
      }}
    />
  );
}

// ── P4 (NEW): Bond — daily visits make Bugsy grow ─────────────
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
  parentName,
  childName,
  setChildName,
  childAge,
  setChildAge,
  onNext,
  onBack,
}: Common & {
  parentName: string;
  childName: string;
  setChildName: (s: string) => void;
  childAge: number | null;
  setChildAge: (n: number) => void;
  onNext: () => void;
}) {
  const [phase, setPhase] = useState<"name" | "age">("name");
  const [bubbleDone, setBubbleDone] = useState(false);
  const ages = Array.from({ length: AGE_MAX - AGE_MIN + 1 }, (_, i) => AGE_MIN + i);

  const parent = parentName.trim();
  const text =
    phase === "name"
      ? `Nice to meet you${parent ? `, ${parent}` : ""}! What's your child's name?`
      : `How old is ${childName.trim()}?`;

  return (
    <ConvoStage step={3 /* mint */} backdrop={<RoomBackdrop chairs />}>
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
        <SpeechBubble text="Pick a crest and a name." />
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
      <SpeechBubble text="Pop in the invite code." />
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
    <ConvoStage step={1} backdrop={<RoomBackdrop chairs dusk />}>
      {onBack && <BackChevron onBack={onBack} />}
      <BugsyStage mood="thinking" tint={tint} size={130} animationKey="p-notice" />
      <div style={{ marginTop: 8 }} />
      <SpeechBubble
        text={`What are you noticing about ${friend}?`}
        onDone={() => setDone(true)}
      />

      <ChipGrid options={NOTICING_OPTIONS} selected={noticing} onToggle={toggle} ready={done} />

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

// Shared 3-column emoji chip grid for the multi-select screens
// (noticing + goals). Selection is conveyed by the coral border +
// soft-pink fill + slight lift — no separate checkbox needed.
function ChipGrid({
  options,
  selected,
  onToggle,
  ready,
}: {
  options: ChipOption[];
  selected: string[];
  onToggle: (key: string) => void;
  ready: boolean;
}) {
  return (
    <div
      style={{
        marginTop: 14,
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 8,
        opacity: ready ? 1 : 0,
        transition: "opacity 0.4s ease",
        pointerEvents: ready ? "auto" : "none",
      }}
    >
      {options.map((opt) => {
        const active = selected.includes(opt.key);
        return (
          <button
            key={opt.key}
            onClick={() => onToggle(opt.key)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-start",
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
              minHeight: 92,
            }}
          >
            <span style={{ fontSize: 28, lineHeight: 1, flexShrink: 0 }}>
              {opt.emoji}
            </span>
            <div
              style={{
                fontFamily: "var(--font-nunito), system-ui",
                fontSize: 12.5,
                fontWeight: 800,
                color: active ? "var(--primary)" : "var(--ink)",
                letterSpacing: -0.1,
                lineHeight: 1.2,
                textAlign: "center",
              }}
            >
              {opt.title}
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ── SCREEN 8: Parent goals ────────────────────────────────────
// "What would you love to see improve over time?" Multi-select,
// sets up the "here's what we'll work on together" beat next.
export function ParentGoals({
  tint,
  childName,
  goals,
  setGoals,
  onNext,
  onBack,
}: Common & {
  childName: string;
  goals: string[];
  setGoals: (g: string[]) => void;
  onNext: () => void;
}) {
  const [done, setDone] = useState(false);
  const friend = childName.trim() || "your child";
  const toggle = (key: string) => {
    if (goals.includes(key)) setGoals(goals.filter((k) => k !== key));
    else setGoals([...goals, key]);
  };

  return (
    <ConvoStage step={2 /* yellow — hopeful */} backdrop={<RoomBackdrop chairs dusk />}>
      {onBack && <BackChevron onBack={onBack} />}
      <BugsyStage mood="cheer" tint={tint} size={130} animationKey="p-goals" />
      <div style={{ marginTop: 8 }} />
      <SpeechBubble
        text={`What would you love to see improve for ${friend}?`}
        onDone={() => setDone(true)}
      />

      <ChipGrid options={PARENT_GOAL_OPTIONS} selected={goals} onToggle={toggle} ready={done} />

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
        {goals.length === 0 ? "Pick at least one" : `${goals.length} chosen`}
      </div>
      <ChunkyButton onClick={onNext} disabled={!done || goals.length === 0}>
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

  const friend = childName.trim() || "your child";
  const text =
    phase === "meet"
      ? `I'm ready to meet ${friend} now. Can we play together?`
      : "Hand me over whenever you're ready — I'll take great care of them.";

  return (
    <ConvoStage step={4 /* rainbow finale */} backdrop={<FamilyBackdrop />}>
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
      />
      <div style={{ flex: 1 }} />
      <ChunkyButton
        onClick={onHandOver}
        disabled={phase !== "reassure" || !bubbleDone}
      >
        Hand the device to your child
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
