"use client";

import { useEffect, useRef, useState } from "react";
import { BackChevron, BugsyStage, ChunkyButton, ConvoStage, SpeechBubble } from "./ConvoUI";
import { LoginScreen } from "./LoginScreen";
import {
  AGE_MAX,
  AGE_MIN,
  OPEN_CLANS,
  PROJECTS,
  RELATIONSHIP_OPTIONS,
  type ClanIntent,
  type Mood,
  type Project,
  type Relationship,
} from "../../lib/data";

// 14 screens after the shared "Who are you?" branch.
// The standalone "I'm a child" path now opens with the same
// "meet Bugsy in his room" experience as the parent-handover
// path (doorway → hide-and-seek → first contact → pet), defined
// in ChildMeet.tsx. ChildHideSeek collects the name first, then
// the cuddle (belly tap → adventure) leads into the age question
// (park, no football), the kitchen mission setup, then the SnackCatch
// drag-to-feed mini-game, the thunderstorm box-breathing soothe
// beat, and finally the usual grown-up steps.
// (BirdSpikeGame is kept in the codebase — it's used elsewhere and
// can come back as a future mission.) Steps here:
//   0 ChildDoorway       5 SnackCatchGame   10 ChildAdultLogin
//   1 ChildHideSeek      6 ChildCalmBugsy   11 ChildParentDetails
//   2 ChildPetMeet       7 ChildPromise     12 ParentNoticing
//   3 ChildAgeQuestion   8 ChildDailyGoal
//   4 ChildKitchen       9 ChildAlmostDone
export const CHILD_STEPS = 13;

type Common = { tint: number };

// ── C0: Bugsy says hi (no name ask) ──────────────────────────
// Story opener — Bugsy makes a big entrance and seeds emotional
// stakes: he's been waiting, and today's been rough. That sets
// up the soothe gesture (next screen) so it doesn't feel like a
// sudden mood swing. Name collection happens later, after the
// bond beats have landed.
export function ChildIntro({
  tint,
  onNext,
  onBack,
}: Common & { onNext: () => void; onBack?: () => void }) {
  const [done, setDone] = useState(false);
  return (
    <ConvoStage step={1}>
      {onBack && <BackChevron onBack={onBack} />}
      <BugsyStage mood="cheer" tint={tint} size={200} animationKey="c-intro" />
      <div style={{ marginTop: 8 }} />
      <SpeechBubble
        text="Oh. My. Goodness. You're HERE. I'm Bugsy — I've been waiting forever…"
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
  onBack,
}: Common & {
  childName: string;
  setChildName: (s: string) => void;
  onNext: () => void;
  onBack?: () => void;
}) {
  const [done, setDone] = useState(false);
  return (
    <ConvoStage step={5 /* soft coral wash */}>
      {onBack && <BackChevron onBack={onBack} />}
      <BugsyStage mood="happy" tint={tint} size={170} animationKey="c-name" />
      <div style={{ marginTop: 8 }} />
      <SpeechBubble
        text="Hold up — what should I even call you?"
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
  onBack,
}: Common & {
  childName: string;
  childAge: number | null;
  setChildAge: (n: number) => void;
  onNext: () => void;
  onBack?: () => void;
}) {
  const ages = Array.from({ length: AGE_MAX - AGE_MIN + 1 }, (_, i) => AGE_MIN + i);
  const [done, setDone] = useState(false);
  const line = `${childName}! That is such a cool name. How old are you, ${childName}?`;

  return (
    <ConvoStage step={3 /* mint */}>
      {onBack && <BackChevron onBack={onBack} />}
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

// ── C2 (gesture): cool down an angry Bugsy ───────────────────
// Replaces the old passive "team-up" beat. Bugsy starts furious
// (messy fur, red tint, steam). Each tap calms him a step. The
// child can see and feel that their touch matters to Bugsy —
// the bond is built through interaction, not assertion.
//
// Anger drains through a continuous angerLevel that's smoothly
// animated between tap states, so the body tint, brows, steam,
// and tremble all cool down over ~700ms after each tap rather
// than snapping at threshold mood changes.
const SOOTHE_TAPS_TO_CALM = 6;
// Storytelling beat. First line names the *cause* explicitly —
// Bugsy is grumpy because no challenge has powered him up — so
// the kid understands the rule before they ever do a quest.
// Last line names the *bond*: "every tap, we're connected", which
// is the mechanic the rest of the flow keeps amplifying.
const SOOTHE_LINES = [
  "Ugh — too long without a challenge. That's why I'm like THIS. Tap to cool me down?",
  "ugh… still grumpy.",
  "okay… a little better.",
  "phew… that's helping.",
  "almost there…",
  "much better. seriously, thanks.",
  "you're the best. But honestly? Touches like this only hold me for a bit. I need more.",
];
type Ripple = { id: number; x: number; y: number };

// Tween a numeric value smoothly toward each new target over `durationMs`.
// Used to animate angerLevel between tap-state snapshots so the color and
// overlays cool down rather than popping. ease-out cubic feels best for
// this kind of decay — early motion is dramatic, settles softly.
function useSmoothValue(target: number, durationMs: number) {
  const [value, setValue] = useState(target);
  const valueRef = useRef(target);
  valueRef.current = value;
  useEffect(() => {
    if (value === target) return;
    let raf = 0;
    const start = valueRef.current;
    const startTime = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - startTime) / durationMs);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(start + (target - start) * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // value is captured via ref; intentionally not a dep
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, durationMs]);
  return value;
}

export function ChildSootheBugsy({
  tint,
  onNext,
  onBack,
}: Common & { onNext: () => void; onBack?: () => void }) {
  const [taps, setTaps] = useState(0);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const calmed = taps >= SOOTHE_TAPS_TO_CALM;

  // Mood stays "happy" the whole time and only flips to "cheer"
  // when fully calm — angerLevel does the heavy visual lifting so
  // there are no mid-flow snaps between mood overlays.
  const mood: Mood = calmed ? "cheer" : "happy";
  const targetAnger = calmed ? 0 : Math.max(0, 1 - taps / SOOTHE_TAPS_TO_CALM);
  const smoothAnger = useSmoothValue(targetAnger, 700);

  const line = SOOTHE_LINES[Math.min(taps, SOOTHE_LINES.length - 1)];

  const handleTap = (e: React.PointerEvent<HTMLDivElement>) => {
    if (calmed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now() + Math.random();
    setRipples((prev) => [...prev, { id, x, y }]);
    setTaps((t) => t + 1);
    // Clean up ripple after its animation finishes
    window.setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 700);
  };

  return (
    <ConvoStage step={0 /* coral wash */}>
      {onBack && <BackChevron onBack={onBack} />}
      <div
        onPointerDown={handleTap}
        style={{
          position: "relative",
          cursor: calmed ? "default" : "pointer",
          userSelect: "none",
          touchAction: "manipulation",
        }}
        role="button"
        aria-label={calmed ? "Bugsy is calm" : "Tap Bugsy to soothe him"}
      >
        <BugsyStage
          mood={mood}
          tint={tint}
          size={200}
          animationKey="soothe"
          angerLevel={smoothAnger}
        />
        {ripples.map((r) => (
          <span
            key={r.id}
            aria-hidden
            style={{
              position: "absolute",
              left: r.x,
              top: r.y,
              width: 120,
              height: 120,
              borderRadius: 9999,
              background: "rgba(255, 92, 138, 0.35)",
              animation: "tap-ripple 0.65s ease-out forwards",
              pointerEvents: "none",
            }}
          />
        ))}
      </div>

      <div style={{ marginTop: 8 }} />
      <SpeechBubble key={`soothe-line-${taps}`} text={line} />

      {/* Rule chip — names the cause/effect outright so the kid
          isn't left guessing why Bugsy is angry. Fades out once
          they've fully calmed Bugsy down (the lesson has landed). */}
      <div
        aria-hidden
        style={{
          margin: "12px auto 0",
          padding: "7px 14px",
          borderRadius: 9999,
          background: "rgba(255, 200, 0, 0.20)",
          color: "var(--ink-muted)",
          fontFamily: "var(--font-nunito), system-ui",
          fontSize: 11.5,
          fontWeight: 800,
          textAlign: "center",
          letterSpacing: 0.5,
          textTransform: "uppercase",
          opacity: calmed ? 0 : 1,
          transition: "opacity 0.5s ease",
        }}
      >
        💡 No challenges = grumpy Bugsy
      </div>

      {/* Progress dots — show the kid how many more taps to go */}
      <div
        aria-hidden
        style={{
          marginTop: 18,
          display: "flex",
          gap: 8,
          justifyContent: "center",
        }}
      >
        {Array.from({ length: SOOTHE_TAPS_TO_CALM }).map((_, i) => (
          <span
            key={i}
            style={{
              width: 10,
              height: 10,
              borderRadius: 9999,
              background:
                i < taps
                  ? "var(--primary)"
                  : "var(--surface-2)",
              transition: "background 0.2s ease",
            }}
          />
        ))}
      </div>

      <div style={{ flex: 1 }} />
      <ChunkyButton onClick={onNext} disabled={!calmed}>
        {calmed ? "Whoa — that worked" : `Tap Bugsy ${SOOTHE_TAPS_TO_CALM - taps} more`}
      </ChunkyButton>
    </ConvoStage>
  );
}

// ── C3 (gesture): feed Bugsy snacks ──────────────────────────
// Replaces the old "level up + hat" beat. After cooling Bugsy
// down, he's now hungry. Each tap drops a berry from above into
// his mouth. Around the 5th feed, a hat pops on — visualising
// the "you take care of me → I level up" loop as one fluid beat
// that ties food (care) to growth (hats).
const FEED_TAPS_TO_FULL = 5;
// Picks up from "we're connected now" — the bond is established,
// now we show that *care* (feeding) makes Bugsy grow. The final
// line foreshadows the ChildPowerSecret beat: snacks are nice,
// but there's something even bigger powering Bugsy up.
const FEED_LINES = [
  "Whew, thanks. Funny thing — now I'm STARVING. Snacks make me grow. Tap?",
  "mmm 🍓",
  "more please…",
  "wow, you're really good at this!",
  "I'm SO full now.",
  "I LEVELED UP! ✨ …but snacks wear off, and the sad creeps back. Listen — there's a real fix.",
];
const BERRIES = ["🍓", "🫐", "🍒", "🍇", "🥝"];
type Berry = { id: number; emoji: string; xOffset: number };
export function ChildFeedBugsy({
  tint,
  onNext,
  onBack,
}: Common & { onNext: () => void; onBack?: () => void }) {
  const [taps, setTaps] = useState(0);
  const [berries, setBerries] = useState<Berry[]>([]);
  const full = taps >= FEED_TAPS_TO_FULL;

  // Mood ladder: hungry → happy at tap 3 → cheer at full
  const mood: Mood = taps === 0 ? "hungry" : taps < 3 ? "hungry" : taps < FEED_TAPS_TO_FULL ? "happy" : "cheer";
  // Hat pops on at the final tap — the "level up" moment
  const hat = full ? "crown" : undefined;

  const line = FEED_LINES[Math.min(taps, FEED_LINES.length - 1)];

  const handleTap = () => {
    if (full) return;
    const id = Date.now() + Math.random();
    const emoji = BERRIES[Math.floor(Math.random() * BERRIES.length)];
    // Slight horizontal jitter so successive berries don't stack
    const xOffset = (Math.random() - 0.5) * 36;
    setBerries((prev) => [...prev, { id, emoji, xOffset }]);
    setTaps((t) => t + 1);
    window.setTimeout(() => {
      setBerries((prev) => prev.filter((b) => b.id !== id));
    }, 900);
  };

  return (
    <ConvoStage step={4 /* rainbow */}>
      {onBack && <BackChevron onBack={onBack} />}
      <div
        onPointerDown={handleTap}
        style={{
          position: "relative",
          cursor: full ? "default" : "pointer",
          userSelect: "none",
          touchAction: "manipulation",
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
        role="button"
        aria-label={full ? "Bugsy is full" : "Tap to feed Bugsy a berry"}
      >
        <BugsyStage
          mood={mood}
          tint={tint}
          hat={hat}
          size={200}
          animationKey={`feed-${mood}-${hat ?? "x"}`}
        />
        {/* Falling berries — positioned at center, animated downward */}
        {berries.map((b) => (
          <span
            key={b.id}
            aria-hidden
            style={{
              position: "absolute",
              left: `calc(50% + ${b.xOffset}px)`,
              top: 0,
              fontSize: 28,
              animation: "berry-drop 0.85s ease-in forwards",
              pointerEvents: "none",
              filter: "drop-shadow(0 2px 0 rgba(0,0,0,0.12))",
            }}
          >
            {b.emoji}
          </span>
        ))}
        {/* "+1 Crown" floats up the moment Bugsy gets full */}
        {full && (
          <div
            aria-hidden
            style={{
              position: "absolute",
              top: "20%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontFamily: "var(--font-nunito), sans-serif",
              fontSize: 18,
              fontWeight: 800,
              color: "var(--primary)",
              animation: "float-up 1.4s ease-out forwards",
              pointerEvents: "none",
              whiteSpace: "nowrap",
            }}
          >
            ✨ +1 Crown
          </div>
        )}
      </div>

      <div style={{ marginTop: 8 }} />
      <SpeechBubble key={`feed-line-${taps}`} text={line} />

      <div
        aria-hidden
        style={{
          marginTop: 18,
          display: "flex",
          gap: 8,
          justifyContent: "center",
        }}
      >
        {Array.from({ length: FEED_TAPS_TO_FULL }).map((_, i) => (
          <span
            key={i}
            style={{
              width: 10,
              height: 10,
              borderRadius: 9999,
              background:
                i < taps
                  ? "var(--accent-yellow)"
                  : "var(--surface-2)",
              transition: "background 0.2s ease",
            }}
          />
        ))}
      </div>

      <div style={{ flex: 1 }} />
      <ChunkyButton onClick={onNext} disabled={!full}>
        {full ? "Whoa, you leveled me up!" : `Feed me ${FEED_TAPS_TO_FULL - taps} more`}
      </ChunkyButton>
    </ConvoStage>
  );
}

// ── C4 (story): the secret of real power ─────────────────────
// The crucial narrative bridge: snacks were nice, but Bugsy's
// REAL power-up comes from the kid doing something brave in the
// real world. This is the screen that makes "play a quest" feel
// like part of the same emotional contract as the soothe + feed
// gestures, rather than a sudden product feature.
export function ChildPowerSecret({
  tint,
  onNext,
  onBack,
}: Common & { onNext: () => void; onBack?: () => void }) {
  const [done, setDone] = useState(false);
  return (
    <ConvoStage step={4 /* rainbow */}>
      {onBack && <BackChevron onBack={onBack} />}
      <BugsyStage
        mood="excited"
        tint={tint}
        hat="crown"
        size={180}
        animationKey="c-secret"
      />
      <div style={{ marginTop: 8 }} />
      <SpeechBubble
        text="Real talk: snacks fade. Touches fade. The ONE thing that keeps me from sliding back into sad? You doing real quests with me. That's our deal."
        onDone={() => setDone(true)}
      />
      <div style={{ flex: 1 }} />
      <ChunkyButton onClick={onNext} disabled={!done}>
        Show me how
      </ChunkyButton>
    </ConvoStage>
  );
}

// ── C5 (story): pick the first real quest and play it ───────
// Replaces the prior slide-to-plant demo. The kid sees three
// real games (fastest to start, same picker as the handover's
// FirstAction screen), Bugsy nudges them with a sad face if
// they hesitate, and tapping "Play this quest" launches the
// actual project flow. After completion the reward screen
// shows the points landing in the clan, and they're routed
// back here so the rest of onboarding continues.
export function ChildPlantQuest({
  tint,
  childName,
  onPlay,
  onSkip,
  onBack,
}: Common & {
  childName: string;
  onPlay: (projectId: string) => void;
  onSkip: () => void;
  onBack?: () => void;
}) {
  const [bubbleDone, setBubbleDone] = useState(false);
  const [idleNudge, setIdleNudge] = useState(false);

  // After ~7 seconds without tapping, Bugsy droops further — the
  // bubble already opens with a vulnerable plea, but if the kid
  // stalls Bugsy slips toward "really sad" so the emotional cost
  // of waiting is obvious.
  useEffect(() => {
    const t = window.setTimeout(() => setIdleNudge(true), 7000);
    return () => window.clearTimeout(t);
  }, []);

  // Hard-coded single-task featured quest. Falls back to the
  // fastest available game if Bird Spike ever gets removed
  // from PROJECTS so onboarding never lands on an empty card.
  const task: Project | null =
    PROJECTS.find((p) => p.id === "p9") ??
    PROJECTS.filter((p) => p.kind === "game").sort((a, b) => a.mins - b.mins)[0] ??
    null;

  const friend = childName.trim() || "friend";
  // Always sad here — this is the emotional climax of onboarding.
  // The kid sees sad Bugsy, hears the cause/effect, and is asked
  // to play the rescue quest. Idle nudge just tightens the screws.
  const mood: Mood = "sad";
  const line = idleNudge
    ? `…still waiting, ${friend}. The longer you wait, the heavier this gets. Please?`
    : `See me? This is what no-quests-played looks like. Will you play Bird Spike with me, ${friend}? Each quest pulls me back.`;

  return (
    <ConvoStage step={3 /* mint */}>
      {onBack && <BackChevron onBack={onBack} />}
      <BugsyStage mood={mood} tint={tint} size={130} animationKey={`pq-${mood}`} />
      <div style={{ marginTop: 8 }} />
      <SpeechBubble
        key={`pq-line-${mood}`}
        text={line}
        onDone={() => setBubbleDone(true)}
      />

      {/* Featured quest card — a gamified RPG-style task tile.
          Dark surface, inset coral edge glow, "NEW QUEST" ribbon,
          icon framed with sparkle accents, difficulty stars,
          diamond divider, and stat chips with iconography. The
          subtle shimmer overlay sweeps across every few seconds
          to hint at "freshly unlocked" energy. */}
      {task && (
        <div
          style={{
            marginTop: 18,
            position: "relative",
            borderRadius: 22,
            background:
              "linear-gradient(140deg, #2a1028 0%, #1a1420 100%)",
            color: "#fff",
            padding: "22px 22px 20px",
            overflow: "hidden",
            boxShadow:
              "0 18px 36px rgba(42, 16, 40, 0.40), 0 4px 0 #0e0a12, inset 0 0 0 1px rgba(255, 92, 138, 0.22)",
            opacity: bubbleDone ? 1 : 0,
            transform: bubbleDone ? "translateY(0)" : "translateY(6px)",
            transition: "opacity 0.4s ease, transform 0.4s ease",
          }}
        >
          {/* Decorative dot-grid pattern for that quest-screen depth */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "radial-gradient(circle, rgba(255,255,255,0.045) 1px, transparent 1px)",
              backgroundSize: "12px 12px",
              pointerEvents: "none",
            }}
          />
          {/* Coral halo in the upper-right corner — pulls the eye
              to the brand color and adds depth. */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              top: -40,
              right: -40,
              width: 160,
              height: 160,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(255, 92, 138, 0.55) 0%, rgba(255, 92, 138, 0) 70%)",
              pointerEvents: "none",
            }}
          />
          {/* Slow diagonal shimmer sweep — subtle, ~6s loop, sells
              the "freshly unlocked" quest-card energy. */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              top: 0,
              left: "-40%",
              width: "40%",
              height: "100%",
              background:
                "linear-gradient(110deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)",
              animation: "card-shimmer 6s ease-in-out infinite",
              pointerEvents: "none",
            }}
          />

          {/* "NEW QUEST" ribbon — top-right, gold accent */}
          <div
            style={{
              position: "absolute",
              top: 14,
              right: 14,
              padding: "4px 10px 4px 8px",
              borderRadius: 999,
              background: "rgba(255, 200, 0, 0.18)",
              color: "#FFC800",
              fontFamily: "var(--font-nunito), system-ui",
              fontSize: 9.5,
              fontWeight: 900,
              letterSpacing: 1.2,
              textTransform: "uppercase",
              border: "1px solid rgba(255, 200, 0, 0.45)",
              boxShadow: "0 0 12px rgba(255, 200, 0, 0.18)",
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              zIndex: 2,
              animation: "tap-pulse 2.4s ease-in-out infinite",
            }}
          >
            New Quest
          </div>

          <div
            style={{
              display: "flex",
              gap: 14,
              alignItems: "center",
              marginBottom: 14,
              position: "relative",
            }}
          >
            {/* Icon frame with glowing coral ring + sparkle */}
            <div
              style={{
                position: "relative",
                width: 60,
                height: 60,
                borderRadius: 16,
                background: "rgba(255, 92, 138, 0.18)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 32,
                flexShrink: 0,
                boxShadow:
                  "inset 0 0 0 1px rgba(255, 92, 138, 0.55), 0 0 18px rgba(255, 92, 138, 0.35)",
              }}
            >
              {task.emoji}
            </div>
            <div style={{ flex: 1, minWidth: 0, paddingRight: 88 /* clear the ribbon */ }}>
              <div
                style={{
                  fontFamily: "var(--font-nunito), system-ui",
                  fontSize: 10.5,
                  fontWeight: 900,
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                  color: "#FF5C8A",
                  marginBottom: 4,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <span>⚔</span> Help Bugsy power up
              </div>
              <div
                style={{
                  fontFamily: "var(--font-nunito), system-ui",
                  fontSize: 22,
                  fontWeight: 900,
                  color: "#fff",
                  letterSpacing: -0.4,
                  lineHeight: 1.1,
                  textShadow: "0 2px 14px rgba(255, 92, 138, 0.30)",
                }}
              >
                {task.title}
              </div>
            </div>
          </div>

          {/* Difficulty row */}
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 14,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-nunito), system-ui",
                fontSize: 9.5,
                fontWeight: 900,
                letterSpacing: 1.4,
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.55)",
              }}
            >
              Difficulty
            </span>
            <span
              style={{
                fontSize: 16,
                letterSpacing: 2,
                color: "#FFC800",
                textShadow: "0 0 8px rgba(255, 200, 0, 0.45)",
                lineHeight: 1,
              }}
            >
              ★<span style={{ opacity: 0.22 }}>★★</span>
            </span>
            <span
              style={{
                marginLeft: "auto",
                padding: "3px 9px",
                borderRadius: 6,
                background: "rgba(76, 199, 107, 0.18)",
                color: "#7BE198",
                border: "1px solid rgba(76, 199, 107, 0.40)",
                fontFamily: "var(--font-nunito), system-ui",
                fontSize: 9.5,
                fontWeight: 900,
                letterSpacing: 1.2,
                textTransform: "uppercase",
              }}
            >
              Easy
            </span>
          </div>

          <div
            style={{
              fontFamily: "var(--font-nunito), system-ui",
              fontSize: 13.5,
              fontWeight: 600,
              lineHeight: 1.5,
              color: "rgba(255, 255, 255, 0.78)",
              marginBottom: 14,
              position: "relative",
            }}
          >
            {task.blurb}
          </div>

          {/* Diamond divider — visual cue between flavor and stats */}
          <div
            aria-hidden
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 14,
            }}
          >
            <div
              style={{
                flex: 1,
                height: 1,
                background:
                  "linear-gradient(90deg, transparent, rgba(255, 92, 138, 0.35), transparent)",
              }}
            />
            <span style={{ fontSize: 8, color: "#FF5C8A", letterSpacing: 3 }}>◆ ◆ ◆</span>
            <div
              style={{
                flex: 1,
                height: 1,
                background:
                  "linear-gradient(90deg, transparent, rgba(255, 92, 138, 0.35), transparent)",
              }}
            />
          </div>

          {/* Stat chips — duration + reward, with iconography */}
          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              position: "relative",
            }}
          >
            <span
              style={{
                padding: "8px 14px",
                borderRadius: 10,
                background: "rgba(255, 255, 255, 0.07)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                fontFamily: "var(--font-nunito), system-ui",
                fontSize: 12,
                fontWeight: 900,
                color: "#fff",
                letterSpacing: 0.5,
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span style={{ fontSize: 14 }}>⏱</span> {task.mins} MIN
            </span>
            <span
              style={{
                padding: "8px 14px",
                borderRadius: 10,
                background: "rgba(255, 92, 138, 0.20)",
                border: "1px solid rgba(255, 92, 138, 0.45)",
                fontFamily: "var(--font-nunito), system-ui",
                fontSize: 12,
                fontWeight: 900,
                color: "#FFB8CC",
                letterSpacing: 0.5,
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                boxShadow: "0 0 14px rgba(255, 92, 138, 0.28)",
              }}
            >
              <span style={{ fontSize: 14 }}>⚡</span> +{task.points} POWER
            </span>
          </div>
        </div>
      )}

      <div style={{ flex: 1, minHeight: 8 }} />
      <ChunkyButton
        onClick={() => task && onPlay(task.id)}
        disabled={!task}
      >
        Play this quest →
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

// ── C5: clan choice ───────────────────────────────────────────
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

// ── C5: promise — moved to ChildMeet.tsx (ChildPromise), where it
// reuses the cosy living room rendered at dusk. ──────────────────

// ── C7 (NEW): adult-consent login ─────────────────────────────
export function ChildAdultLogin({
  tint,
  childName,
  onNext,
  onBack,
}: Common & {
  childName: string;
  onNext: () => void;
  onBack?: () => void;
}) {
  const friend = childName.trim() || "your kiddo";
  return (
    <LoginScreen
      tint={tint}
      mood="happy"
      step={1 /* lavender — calm parent moment */}
      bubbleText={`Grown-up — sign in to keep ${friend}'s progress safe.`}
      ctaLabel="Grown-up sign in"
      onContinue={() => onNext()}
      onBack={onBack}
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
  onBack,
}: Common & {
  childName: string;
  parentName: string;
  setParentName: (s: string) => void;
  relationship: Relationship | null;
  setRelationship: (r: Relationship) => void;
  onNext: () => void;
  onBack?: () => void;
}) {
  const friend = childName.trim() || "your kiddo";
  const [bubbleDone, setBubbleDone] = useState(false);
  const valid = parentName.trim().length > 0 && relationship !== null;

  return (
    <ConvoStage step={1 /* lavender — same wash as adult login */}>
      {onBack && <BackChevron onBack={onBack} />}
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
