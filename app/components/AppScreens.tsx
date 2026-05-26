"use client";

import { useEffect, useState } from "react";
import { Bobo } from "./Mascot";
import { AppShell } from "./AppShell";
import { PrimaryButton, SectionLabel } from "./ui";
import {
  CATEGORIES,
  CLAN_BOARD,
  HATS,
  INDIVIDUAL_BOARD,
  OPEN_CLANS,
  PROJECTS,
  bugsyLines,
  nextHatToUnlock,
  type Hat,
  type Project,
  type ProjectCategory,
  type Tab,
} from "../lib/data";

type ClanInfo = { name: string; emoji: string };

// ── Home ──────────────────────────────────────────────────────
// Bond-first home: Bugsy is the hero, no clan UI. Tap Bugsy to
// cycle through personality lines / moods. The mood card at the
// bottom previews where the care mechanic will live. The guided
// tour now lives at page-level (TourOverlay), so this screen no
// longer renders a tour modal — it just shows underneath.
export function ScreenHome({
  tint,
  name,
  completedProjects,
  totalPoints,
  streak,
  equippedHat,
  tab,
  setTab,
  onOpenProject,
  onSeeAllProjects,
  lockedTabs,
}: {
  tint: number;
  name: string;
  completedProjects: number;
  totalPoints: number;
  streak: number;
  equippedHat: string | null;
  tab: Tab;
  setTab: (t: Tab) => void;
  onOpenProject: (id: string) => void;
  onSeeAllProjects: () => void;
  lockedTabs?: Tab[];
}) {
  void completedProjects;
  void totalPoints;
  const lines = bugsyLines({
    name: name || "friend",
    completedToday: 0,
    streak,
  });

  const [lineIdx, setLineIdx] = useState(0);
  const [bumpKey, setBumpKey] = useState(0);

  const current = lines[lineIdx % lines.length];

  const handleBugsyTap = () => {
    setBumpKey((k) => k + 1);
    setLineIdx((i) => (i + 1) % lines.length);
  };

  const games = PROJECTS.filter((p) => p.kind === "game").slice(0, 2);
  const featured = PROJECTS.find((p) => p.kind === "project") ?? PROJECTS[0];

  const nextHat = nextHatToUnlock(completedProjects);
  const togo = nextHat ? nextHat.unlockAt - completedProjects : 0;
  // progress for the next-hat meter — start from the previous hat threshold
  const prevHat = [...HATS].reverse().find((h) => h.unlockAt <= completedProjects);
  const meterFrom = prevHat?.unlockAt ?? 0;
  const meterTo = nextHat?.unlockAt ?? completedProjects;
  const meterPct = meterTo > meterFrom
    ? Math.max(0, Math.min(1, (completedProjects - meterFrom) / (meterTo - meterFrom)))
    : 1;

  return (
    <AppShell
      title={`Hey, ${name || "friend"}`}
      subtitle={streak > 0 ? `🔥 ${streak} day streak` : "Today"}
      tab={tab}
      setTab={setTab}
      tint={tint}
      lockedTabs={lockedTabs}
    >
      {/* Bugsy hero */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: -8,
          marginBottom: 18,
        }}
      >
        <button
          onClick={handleBugsyTap}
          aria-label="Tap Bugsy"
          style={{
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
            outline: "none",
          }}
        >
          <div key={bumpKey} style={{ animation: "bobo-bump 0.55s cubic-bezier(0.22, 1.5, 0.36, 1)" }}>
            <Bobo
              mood={current.mood}
              tint={tint}
              size={200}
              hat={equippedHat ?? undefined}
            />
          </div>
        </button>

        {/* Speech bubble */}
        <div
          key={lineIdx}
          style={{
            position: "relative",
            marginTop: -8,
            padding: "12px 18px",
            borderRadius: 20,
            background: "var(--surface)",
            border: "1.5px solid var(--ink-08)",
            boxShadow: "0 4px 14px rgba(20, 14, 24, 0.05)",
            fontFamily: "var(--font-inter), system-ui",
            fontSize: 14.5,
            lineHeight: 1.4,
            color: "var(--ink-80)",
            letterSpacing: -0.1,
            maxWidth: 320,
            textAlign: "center",
            animation: "fade-up 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          {/* tail */}
          <span
            aria-hidden
            style={{
              position: "absolute",
              top: -8,
              left: "50%",
              width: 16,
              height: 16,
              transform: "translateX(-50%) rotate(45deg)",
              background: "var(--surface)",
              borderLeft: "1.5px solid var(--ink-08)",
              borderTop: "1.5px solid var(--ink-08)",
            }}
          />
          <span style={{ color: "var(--ink)" }}>{current.text}</span>
        </div>

        <div
          style={{
            fontFamily: "var(--font-inter), system-ui",
            fontSize: 10.5,
            color: "var(--ink-50)",
            marginTop: 8,
            letterSpacing: 0.5,
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          Tap Bugsy to chat
        </div>
      </div>

      {/* Bugsy growth meter */}
      {nextHat ? (
        <div
          style={{
            padding: "12px 14px",
            borderRadius: 18,
            background: "var(--accent-soft)",
            marginBottom: 18,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div
              style={{
                fontFamily: "var(--font-inter), system-ui",
                fontSize: 13,
                fontWeight: 600,
                color: "var(--ink-80)",
                letterSpacing: -0.1,
              }}
            >
              <span style={{ marginRight: 6 }}>✨</span>
              {togo === 0
                ? `Unlocking ${nextHat.name}!`
                : `${togo} more ${togo === 1 ? "project" : "projects"} → ${nextHat.name}`}
            </div>
            <div
              style={{
                fontFamily: "var(--font-inter), system-ui",
                fontSize: 11,
                fontWeight: 700,
                color: "var(--accent)",
                letterSpacing: 0.5,
                textTransform: "uppercase",
              }}
            >
              {completedProjects}/{nextHat.unlockAt}
            </div>
          </div>
          <div
            style={{
              height: 6,
              background: "rgba(255,255,255,0.55)",
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${meterPct * 100}%`,
                height: "100%",
                background: "var(--accent)",
                borderRadius: 3,
                transition: "width 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            />
          </div>
        </div>
      ) : (
        <div
          style={{
            padding: "12px 14px",
            borderRadius: 18,
            background: "var(--accent-soft)",
            marginBottom: 18,
            fontFamily: "var(--font-inter), system-ui",
            fontSize: 13,
            color: "var(--ink-80)",
            textAlign: "center",
          }}
        >
          ✨ All looks unlocked — Bugsy is fully styled!
        </div>
      )}

      {/* Quick games */}
      <SectionRow label="Quick games" onSeeAll={onSeeAllProjects} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
        {games.map((g) => (
          <GameCard key={g.id} project={g} onClick={() => onOpenProject(g.id)} />
        ))}
      </div>

      {/* Today's project */}
      <SectionRow label="Today's project" onSeeAll={onSeeAllProjects} />
      <button
        onClick={() => onOpenProject(featured.id)}
        style={{
          width: "100%",
          padding: 18,
          borderRadius: 22,
          background: "linear-gradient(135deg, var(--accent) 0%, oklch(60% 0.17 295) 100%)",
          color: "#fff",
          border: "none",
          textAlign: "left",
          cursor: "pointer",
          marginBottom: 14,
          boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: "rgba(255,255,255,0.22)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 26,
              flexShrink: 0,
            }}
          >
            {featured.emoji}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontFamily: "var(--font-inter), system-ui",
                fontSize: 11,
                fontWeight: 700,
                opacity: 0.85,
                textTransform: "uppercase",
                letterSpacing: 0.8,
              }}
            >
              Project · {featured.mins} min · +{featured.points} pts
            </div>
            <div
              style={{
                fontFamily: "var(--font-fraunces), serif",
                fontSize: 22,
                fontWeight: 500,
                marginTop: 2,
                letterSpacing: -0.4,
                lineHeight: 1.15,
                fontVariationSettings: "'SOFT' 80, 'WONK' 1",
              }}
            >
              {featured.title}
            </div>
          </div>
        </div>
      </button>

      {/* Bugsy mood card — care mechanic preview.
          Mood derives from streak; eventually it'll derive from
          last-seen timestamp + projects completed. */}
      <BugsyMoodCard tint={tint} streak={streak} equippedHat={equippedHat} />
    </AppShell>
  );
}

function BugsyMoodCard({
  tint,
  streak,
  equippedHat,
}: {
  tint: number;
  streak: number;
  equippedHat: string | null;
}) {
  // Demo mood derivation. When time-tracking lands, mood will come
  // from hours-since-last-seen instead.
  const state: { mood: import("../lib/data").Mood; label: string; text: string } =
    streak >= 3
      ? { mood: "excited", label: "loved", text: "Bugsy feels loved. Keep coming back!" }
      : streak >= 1
      ? { mood: "happy", label: "happy", text: "Bugsy is happy to see you today." }
      : { mood: "sleepy", label: "sleepy", text: "Bugsy is dozing. A quick visit will wake them up." };

  return (
    <div
      style={{
        marginTop: 18,
        padding: "12px 14px",
        borderRadius: 18,
        background: "var(--surface)",
        border: "2px solid var(--border)",
        boxShadow: "0 2px 0 var(--border)",
        display: "flex",
        gap: 12,
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 16,
          background: "var(--accent-soft)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          overflow: "hidden",
        }}
      >
        <Bobo mood={state.mood} tint={tint} size={64} animate={false} hat={equippedHat ?? undefined} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: "var(--font-nunito), system-ui",
            fontSize: 11,
            fontWeight: 800,
            color: "var(--primary)",
            textTransform: "uppercase",
            letterSpacing: 0.8,
          }}
        >
          Bugsy is feeling {state.label}
        </div>
        <div
          style={{
            fontFamily: "var(--font-nunito), system-ui",
            fontSize: 13,
            fontWeight: 700,
            color: "var(--ink)",
            marginTop: 2,
            letterSpacing: -0.1,
          }}
        >
          {state.text}
        </div>
      </div>
    </div>
  );
}

// ── HomeTour ──────────────────────────────────────────────────
// Modal overlay that runs once, on the first home visit after the
// child's first project completion. 4-bubble walkthrough: where
// we are → what Bugsy does → what's locked → habit cue.
function HomeTour({
  tint,
  name,
  unlockThreshold,
  completedProjects,
  onDismiss,
}: {
  tint: number;
  name: string;
  unlockThreshold: number;
  completedProjects: number;
  onDismiss: () => void;
}) {
  const friend = name?.trim() || "friend";
  const remaining = Math.max(0, unlockThreshold - completedProjects);
  const bubbles = [
    `Welcome home, ${friend}!`,
    "Tap me here anytime — I love hanging out.",
    remaining > 0
      ? `See the Clan lock? It opens after ${unlockThreshold} projects.`
      : "Almost there — one more project unlocks the Clan!",
    "Come back tomorrow. Bring me one more project.",
  ];

  const [phase, setPhase] = useState(0);
  const [bubbleDone, setBubbleDone] = useState(false);

  // useEffect-style re-key the bubble when phase changes — the
  // Typewriter re-runs because text changes.

  const advance = () => {
    if (phase + 1 >= bubbles.length) {
      onDismiss();
      return;
    }
    setBubbleDone(false);
    setPhase((p) => p + 1);
  };

  const moodFor = (idx: number): import("../lib/data").Mood => {
    if (idx === 0) return "excited";
    if (idx === 1) return "waving";
    if (idx === 2) return remaining > 0 ? "thinking" : "cheer";
    return "happy";
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        background: "rgba(20, 16, 30, 0.45)",
        backdropFilter: "blur(2px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: 20,
        paddingBottom: 100,
      }}
      role="dialog"
      aria-label="Bugsy's home tour"
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 440,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div style={{ animation: "bobo-enter 0.5s cubic-bezier(0.22, 1, 0.36, 1)" }}>
          <Bobo mood={moodFor(phase)} tint={tint} size={150} />
        </div>

        {/* Speech bubble */}
        <div
          key={phase}
          style={{
            position: "relative",
            marginTop: -4,
            padding: "16px 20px",
            background: "var(--surface)",
            border: "2px solid var(--border)",
            boxShadow: "0 4px 0 var(--border)",
            borderRadius: 22,
            color: "var(--ink)",
            fontFamily: "var(--font-nunito), system-ui",
            fontSize: 17,
            fontWeight: 700,
            letterSpacing: -0.1,
            textAlign: "center",
            maxWidth: 360,
            animation: "bubble-pop 0.35s cubic-bezier(0.22, 1.5, 0.36, 1)",
          }}
        >
          <span
            aria-hidden
            style={{
              position: "absolute",
              top: -10,
              left: "50%",
              transform: "translateX(-50%) rotate(45deg)",
              width: 16,
              height: 16,
              background: "var(--surface)",
              borderLeft: "2px solid var(--border)",
              borderTop: "2px solid var(--border)",
            }}
          />
          <HomeTourTypewriter text={bubbles[phase]} onDone={() => setBubbleDone(true)} />
        </div>

        {/* Dots indicating progress through tour */}
        <div style={{ display: "flex", gap: 6, marginTop: 14, marginBottom: 14 }}>
          {bubbles.map((_, i) => (
            <span
              key={i}
              style={{
                width: i === phase ? 18 : 8,
                height: 8,
                borderRadius: 999,
                background: i === phase ? "var(--primary)" : "var(--border)",
                transition: "width 0.2s ease, background 0.2s ease",
              }}
            />
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={advance}
          disabled={!bubbleDone}
          className="btn-3d"
          style={{ width: "100%", maxWidth: 360 }}
        >
          {phase + 1 < bubbles.length ? "Next" : "Let's go!"}
        </button>
      </div>
    </div>
  );
}

// Local typewriter (mirrors the Onboarding one) — char-by-char
// reveal with longer pauses on punctuation. Click to skip.
function HomeTourTypewriter({
  text,
  onDone,
}: {
  text: string;
  onDone: () => void;
}) {
  const [shown, setShown] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setShown("");
    setDone(false);
    let i = 0;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      if (cancelled) return;
      if (i >= text.length) {
        setDone(true);
        onDone();
        return;
      }
      i += 1;
      setShown(text.slice(0, i));
      const ch = text.charAt(i - 1);
      const delay = ch === "." || ch === "!" || ch === "?" ? 280 : ch === "," ? 160 : 26;
      timer = setTimeout(tick, delay);
    };
    timer = setTimeout(tick, 220);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [text, onDone]);

  return (
    <span
      onClick={() => {
        setShown(text);
        setDone(true);
        onDone();
      }}
      style={{ cursor: done ? "default" : "pointer" }}
    >
      {shown}
    </span>
  );
}

function SectionRow({ label, onSeeAll }: { label: string; onSeeAll: () => void }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between",
        margin: "4px 0 10px",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-inter), system-ui",
          fontSize: 11,
          fontWeight: 700,
          color: "var(--ink-50)",
          textTransform: "uppercase",
          letterSpacing: 0.8,
        }}
      >
        {label}
      </span>
      <button
        onClick={onSeeAll}
        style={{
          fontFamily: "var(--font-inter), system-ui",
          fontSize: 12,
          fontWeight: 600,
          color: "var(--accent)",
          background: "none",
          border: "none",
          cursor: "pointer",
          letterSpacing: -0.1,
        }}
      >
        See all →
      </button>
    </div>
  );
}

function GameCard({ project, onClick }: { project: Project; onClick: () => void }) {
  const cat = CATEGORIES.find((c) => c.key === project.category)!;
  return (
    <button
      onClick={onClick}
      style={{
        textAlign: "left",
        padding: 14,
        borderRadius: 18,
        background: "var(--surface)",
        border: "1px solid var(--ink-08)",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        minHeight: 130,
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: cat.color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 22,
        }}
      >
        {project.emoji}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: "var(--font-inter), system-ui",
            fontSize: 14,
            fontWeight: 600,
            color: "var(--ink)",
            letterSpacing: -0.15,
          }}
        >
          {project.title}
        </div>
        <div
          style={{
            fontFamily: "var(--font-inter), system-ui",
            fontSize: 11.5,
            color: "var(--ink-50)",
            marginTop: 2,
          }}
        >
          {project.mins} min · +{project.points} pts
        </div>
      </div>
    </button>
  );
}

function StatCard({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div
      style={{
        flex: 1,
        padding: "10px 12px",
        borderRadius: 14,
        background: accent ? "var(--accent-soft)" : "var(--surface)",
        border: accent ? "none" : "1px solid var(--ink-08)",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-inter), system-ui",
          fontSize: 10,
          fontWeight: 600,
          color: "var(--ink-50)",
          textTransform: "uppercase",
          letterSpacing: 0.5,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: "var(--font-fraunces), serif",
          fontSize: 16,
          fontWeight: 500,
          color: accent ? "var(--accent)" : "var(--ink)",
          marginTop: 2,
          fontVariationSettings: "'SOFT' 80, 'WONK' 1",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {value}
      </div>
    </div>
  );
}

// ── Projects browser ──────────────────────────────────────────
export function ScreenProjects({
  tint,
  tab,
  setTab,
  completedIds,
  equippedHat,
  onOpenProject,
  lockedTabs,
}: {
  tint: number;
  tab: Tab;
  setTab: (t: Tab) => void;
  completedIds: string[];
  equippedHat: string | null;
  onOpenProject: (id: string) => void;
  lockedTabs?: Tab[];
}) {
  return (
    <AppShell
      title="Projects"
      subtitle="Today's quests"
      tab={tab}
      setTab={setTab}
      tint={tint}
      bugzyMood="thinking"
      bugzySize={50}
      bugzyHat={equippedHat}
      lockedTabs={lockedTabs}
    >
      {CATEGORIES.map((cat) => {
        const items = PROJECTS.filter((p) => p.category === cat.key);
        return (
          <div key={cat.key} style={{ marginBottom: 22 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 10,
              }}
            >
              <span style={{ fontSize: 18 }}>{cat.icon}</span>
              <span
                style={{
                  fontFamily: "var(--font-inter), system-ui",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "var(--ink)",
                  textTransform: "uppercase",
                  letterSpacing: 0.8,
                }}
              >
                {cat.label}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-inter), system-ui",
                  fontSize: 12,
                  color: "var(--ink-50)",
                  marginLeft: "auto",
                }}
              >
                {items.length} today
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {items.map((p) => {
                const done = completedIds.includes(p.id);
                return (
                  <button
                    key={p.id}
                    onClick={() => onOpenProject(p.id)}
                    disabled={done}
                    style={{
                      textAlign: "left",
                      display: "flex",
                      gap: 14,
                      alignItems: "center",
                      padding: "14px 14px",
                      borderRadius: 18,
                      cursor: done ? "default" : "pointer",
                      background: "var(--surface)",
                      border: `1px solid ${done ? "var(--ink-08)" : "var(--ink-08)"}`,
                      opacity: done ? 0.55 : 1,
                    }}
                  >
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        flexShrink: 0,
                        background: cat.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 22,
                      }}
                    >
                      {p.emoji}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontFamily: "var(--font-inter), system-ui",
                          fontSize: 14.5,
                          fontWeight: 600,
                          color: "var(--ink)",
                          letterSpacing: -0.15,
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        {p.title}
                        {done && (
                          <span
                            style={{
                              fontSize: 10,
                              padding: "2px 6px",
                              borderRadius: 999,
                              background: "var(--ink-10)",
                              color: "var(--ink-60)",
                              fontWeight: 700,
                              letterSpacing: 0.3,
                              textTransform: "uppercase",
                            }}
                          >
                            done
                          </span>
                        )}
                      </div>
                      <div
                        style={{
                          fontFamily: "var(--font-inter), system-ui",
                          fontSize: 12,
                          color: "var(--ink-50)",
                          marginTop: 2,
                        }}
                      >
                        +{p.points} pts · {p.mins} min
                      </div>
                    </div>
                    {!done && (
                      <svg width="8" height="14" viewBox="0 0 8 14">
                        <path d="M1 1l6 6-6 6" stroke="var(--ink-40)" strokeWidth="2" fill="none" strokeLinecap="round" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </AppShell>
  );
}

// ── Project detail / completion ───────────────────────────────
export function ScreenProjectDetail({
  tint,
  project,
  onBack,
  onComplete,
}: {
  tint: number;
  project: Project;
  onBack: () => void;
  onComplete: () => void;
}) {
  const [started, setStarted] = useState(false);
  const cat = CATEGORIES.find((c) => c.key === project.category)!;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "var(--bg)",
        display: "flex",
        flexDirection: "column",
        paddingTop: 60,
        paddingBottom: 28,
        paddingLeft: 24,
        paddingRight: 24,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
        <button
          onClick={onBack}
          style={{
            width: 36,
            height: 36,
            borderRadius: 999,
            border: "none",
            cursor: "pointer",
            background: "var(--ink-08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14">
            <path d="M9 1L3 7l6 6" stroke="var(--ink)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div style={{ flex: 1 }} />
        <Bobo mood={started ? "cheer" : "thinking"} tint={tint} size={56} />
      </div>

      <div
        style={{
          padding: "26px 22px",
          borderRadius: 26,
          background: cat.color,
          color: "#fff",
          marginBottom: 18,
        }}
      >
        <div style={{ fontSize: 56, lineHeight: 1, marginBottom: 14 }}>{project.emoji}</div>
        <div
          style={{
            fontFamily: "var(--font-inter), system-ui",
            fontSize: 11,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: 1,
            opacity: 0.85,
          }}
        >
          {cat.label} · {project.mins} min · +{project.points} pts
        </div>
        <h1
          style={{
            fontFamily: "var(--font-fraunces), serif",
            fontSize: 32,
            fontWeight: 500,
            margin: "4px 0 0",
            letterSpacing: -0.6,
            lineHeight: 1.1,
            fontVariationSettings: "'SOFT' 80, 'WONK' 1",
          }}
        >
          {project.title}
        </h1>
      </div>

      <p
        style={{
          fontFamily: "var(--font-inter), system-ui",
          fontSize: 15,
          lineHeight: 1.5,
          color: "var(--ink-70)",
          margin: 0,
          letterSpacing: -0.1,
        }}
      >
        {project.blurb}
      </p>

      {started && (
        <div
          style={{
            marginTop: 18,
            padding: "16px 18px",
            borderRadius: 18,
            background: "var(--accent-soft)",
            display: "flex",
            gap: 12,
            alignItems: "flex-start",
            animation: "fade-up 0.4s ease",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-inter), system-ui",
              fontSize: 13,
              color: "var(--ink-80)",
              lineHeight: 1.4,
            }}
          >
            <b style={{ color: "var(--ink)" }}>You&apos;ve got this!</b> When you finish, hit
            {project.proof === "photo" ? " Submit photo " : " Mark done "}
            and I&apos;ll log your points.
          </div>
        </div>
      )}

      <div style={{ flex: 1 }} />

      {!started ? (
        <PrimaryButton onClick={() => setStarted(true)}>Start project</PrimaryButton>
      ) : (
        <PrimaryButton onClick={onComplete}>
          {project.proof === "photo" ? "Submit photo & finish" : "Mark done"}
        </PrimaryButton>
      )}
    </div>
  );
}

// ── Reward (after completing a project) ───────────────────────
// Progressive reveal designed to feel like an achievement ceremony:
//   beat 1: 🔥 streak chip pops in
//   beat 2: big "+N points" pops in
//   beat 3: score cards reveal, numbers tween up (deposits into You + Clan)
//   beat 4: hat unlock card (only if a hat was unlocked)
//   beat 5: habit-loop hook + Continue
export function ScreenReward({
  tint,
  project,
  childName,
  unlockedHat,
  equippedHat,
  streakBefore,
  streakAfter,
  personalBefore,
  personalAfter,
  clanBefore,
  clanAfter,
  clanName,
  onContinue,
}: {
  tint: number;
  project: Project;
  childName: string;
  unlockedHat: Hat | null;
  equippedHat: string | null;
  streakBefore: number;
  streakAfter: number;
  personalBefore: number;
  personalAfter: number;
  clanBefore: number;
  clanAfter: number;
  clanName: string | null;
  onContinue: () => void;
}) {
  const [beat, setBeat] = useState(0);
  const hasHat = unlockedHat !== null;

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    const at = (ms: number, b: number) =>
      timers.push(setTimeout(() => setBeat(b), ms));

    at(700, 1);  // streak chip
    at(1600, 2); // big +N points
    at(2500, 3); // score deposits start counting up
    const hatTime = 3700;
    if (hasHat) at(hatTime, 4);
    at(hasHat ? hatTime + 1000 : 3700, 5); // habit hook + Continue

    return () => timers.forEach((t) => clearTimeout(t));
  }, [hasHat]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "radial-gradient(ellipse at top, var(--accent-soft) 0%, var(--bg) 70%)",
        display: "flex",
        flexDirection: "column",
        paddingTop: 56,
        paddingBottom: 32,
        paddingLeft: 24,
        paddingRight: 24,
        overflowY: "auto",
      }}
    >
      <svg
        width="100%"
        height="80"
        style={{ position: "absolute", top: 60, left: 0, pointerEvents: "none" }}
        viewBox="0 0 400 80"
      >
        {[
          [30, 30, "oklch(72% 0.17 30)"],
          [80, 50, "oklch(72% 0.15 160)"],
          [150, 20, "oklch(72% 0.15 295)"],
          [220, 40, "oklch(72% 0.15 75)"],
          [300, 25, "oklch(72% 0.15 235)"],
          [360, 50, "oklch(72% 0.17 30)"],
        ].map(([x, y, c], i) => (
          <circle key={i} cx={x as number} cy={y as number} r="4" fill={c as string} opacity="0.8" />
        ))}
      </svg>

      {/* Header — Bugsy reacting to the kid's win, in his own voice.
          The speech bubble is the load-bearing emotional beat: it
          explicitly names the cause/effect ("you did this →
          I'm stronger"), so the rest of the reward stats below
          read as evidence rather than abstract numbers. */}
      <div style={{ textAlign: "center" }}>
        <div style={{ animation: "pop-in 0.6s cubic-bezier(0.22, 1.5, 0.36, 1)" }}>
          <Bobo
            mood="cheer"
            tint={tint}
            size={130}
            hat={unlockedHat ? unlockedHat.key : equippedHat ?? undefined}
          />
        </div>
        {/* Bugsy speech bubble — first-person reaction, with a
            down-pointing tail tying it back to the mascot above.
            Inlined here (not imported from ConvoUI) so the reward
            screen stays self-contained from the onboarding flow. */}
        <div
          style={{
            position: "relative",
            display: "inline-block",
            margin: "10px auto 0",
            padding: "12px 18px",
            maxWidth: 300,
            borderRadius: 20,
            background: "var(--surface)",
            border: "1px solid var(--border-strong)",
            color: "var(--ink)",
            fontFamily: "var(--font-nunito), system-ui",
            fontSize: 15,
            fontWeight: 800,
            lineHeight: 1.4,
            textAlign: "center",
            boxShadow: "0 4px 14px rgba(0,0,0,0.10)",
            animation: "bubble-pop 0.45s cubic-bezier(0.22, 1.5, 0.36, 1) 0.15s backwards",
          }}
        >
          {`YESSS${childName ? `, ${childName}` : ""}! You pulled me right out of sad. I can feel the power!`}
          <span
            aria-hidden
            style={{
              position: "absolute",
              top: -8,
              left: "50%",
              transform: "translateX(-50%) rotate(45deg)",
              width: 14,
              height: 14,
              background: "var(--surface)",
              borderTop: "1px solid var(--border-strong)",
              borderLeft: "1px solid var(--border-strong)",
              borderRadius: 2,
            }}
          />
        </div>
        <div
          style={{
            fontFamily: "var(--font-inter), system-ui",
            fontSize: 11,
            fontWeight: 700,
            color: "var(--accent)",
            textTransform: "uppercase",
            letterSpacing: 1.2,
            marginTop: 14,
          }}
        >
          Bugsy leveled up
        </div>
        <div
          style={{
            fontFamily: "var(--font-inter), system-ui",
            fontSize: 13.5,
            color: "var(--ink-60)",
            letterSpacing: -0.1,
            marginTop: 4,
          }}
        >
          Because you finished <b style={{ color: "var(--ink)" }}>{project.title}</b>.
        </div>
      </div>

      {/* Beat 1: Streak chip */}
      <div
        style={{
          marginTop: 18,
          minHeight: 44,
          display: "flex",
          justifyContent: "center",
        }}
      >
        {beat >= 1 && (
          <StreakChip streak={streakAfter} bumped={streakAfter > streakBefore} />
        )}
      </div>

      {/* Beat 2: Big +N points */}
      <div
        style={{
          marginTop: 8,
          minHeight: 76,
          display: "flex",
          justifyContent: "center",
        }}
      >
        {beat >= 2 && <BigPoints points={project.points} />}
      </div>

      {/* Beat 3: Score deposits */}
      <div
        style={{
          marginTop: 12,
          minHeight: 80,
          display: "flex",
          gap: 10,
        }}
      >
        {beat >= 3 && (
          <>
            <ScoreCard
              label="You"
              from={personalBefore}
              to={personalAfter}
              delta={project.points}
              accent
            />
            <ScoreCard
              label={clanName ?? "Clan"}
              from={clanBefore}
              to={clanAfter}
              delta={project.points}
              dimmed={clanName === null}
            />
          </>
        )}
      </div>

      {/* Beat 4: Hat unlock (only if applicable) */}
      {beat >= 4 && unlockedHat && (
        <div
          style={{
            marginTop: 14,
            padding: "12px 14px",
            borderRadius: 16,
            background:
              "linear-gradient(135deg, oklch(82% 0.16 80) 0%, oklch(76% 0.16 50) 100%)",
            color: "#fff",
            display: "flex",
            gap: 12,
            alignItems: "center",
            animation: "reveal-pop 0.55s cubic-bezier(0.22, 1.5, 0.36, 1)",
            boxShadow: "0 12px 30px rgba(0,0,0,0.18)",
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: "rgba(255,255,255,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              flexShrink: 0,
            }}
          >
            ✨
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontFamily: "var(--font-inter), system-ui",
                fontSize: 10,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: 1,
                opacity: 0.9,
              }}
            >
              New look unlocked
            </div>
            <div
              style={{
                fontFamily: "var(--font-fraunces), serif",
                fontSize: 18,
                fontWeight: 500,
                marginTop: 2,
                fontVariationSettings: "'SOFT' 80",
              }}
            >
              {unlockedHat.name}
            </div>
          </div>
        </div>
      )}

      <div style={{ flex: 1, minHeight: 12 }} />

      {/* Beat 5: Habit hook + Continue */}
      {beat >= 5 && (
        <div style={{ animation: "fade-up 0.4s ease" }}>
          <div
            style={{
              padding: "12px 14px",
              borderRadius: 16,
              background: "var(--accent-soft)",
              display: "flex",
              gap: 12,
              alignItems: "center",
              marginBottom: 14,
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 12,
                background: "var(--accent)",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                flexShrink: 0,
              }}
            >
              🌅
            </div>
            <div
              style={{
                flex: 1,
                fontFamily: "var(--font-inter), system-ui",
                fontSize: 13,
                lineHeight: 1.4,
                color: "var(--ink-80)",
                letterSpacing: -0.05,
              }}
            >
              <b style={{ color: "var(--ink)" }}>Come back tomorrow?</b> If you skip a day, the sad creeps back in. Every quest holds it off.
            </div>
          </div>
          <PrimaryButton onClick={onContinue}>Continue</PrimaryButton>
        </div>
      )}
    </div>
  );
}

function StreakChip({ streak, bumped }: { streak: number; bumped: boolean }) {
  return (
    <div
      style={{
        padding: "10px 18px",
        borderRadius: 999,
        background:
          "linear-gradient(135deg, oklch(76% 0.18 35) 0%, oklch(72% 0.18 25) 100%)",
        color: "#fff",
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        fontFamily: "var(--font-inter), system-ui",
        fontSize: 15,
        fontWeight: 700,
        letterSpacing: -0.15,
        boxShadow: "0 8px 22px rgba(214, 78, 30, 0.32)",
        animation: "reveal-pop 0.55s cubic-bezier(0.22, 1.5, 0.36, 1)",
      }}
    >
      <span style={{ fontSize: 20 }}>🔥</span>
      <span>
        Day {streak} streak
        {bumped && (
          <span
            style={{
              marginLeft: 8,
              padding: "2px 8px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.28)",
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: 0.5,
            }}
          >
            +1
          </span>
        )}
      </span>
    </div>
  );
}

function BigPoints({ points }: { points: number }) {
  return (
    <div
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        animation: "reveal-pop 0.6s cubic-bezier(0.22, 1.5, 0.36, 1)",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-fraunces), serif",
          fontSize: 56,
          fontWeight: 500,
          lineHeight: 1,
          color: "var(--accent)",
          letterSpacing: -2,
          fontVariationSettings: "'SOFT' 100, 'WONK' 1",
          textShadow: "0 6px 22px rgba(140, 60, 200, 0.22)",
        }}
      >
        +{points}
      </div>
      <div
        style={{
          fontFamily: "var(--font-inter), system-ui",
          fontSize: 11,
          fontWeight: 700,
          color: "var(--accent)",
          letterSpacing: 2,
          textTransform: "uppercase",
          marginTop: 2,
        }}
      >
        Bugsy power
      </div>
    </div>
  );
}

function ScoreCard({
  label,
  from,
  to,
  delta,
  accent,
  dimmed,
}: {
  label: string;
  from: number;
  to: number;
  delta: number;
  accent?: boolean;
  dimmed?: boolean;
}) {
  return (
    <div
      style={{
        flex: 1,
        padding: "12px 14px",
        borderRadius: 18,
        background: accent ? "var(--accent-soft)" : "var(--surface)",
        border: accent ? "1px solid var(--accent)" : "1px solid var(--ink-08)",
        animation: "reveal-pop 0.5s cubic-bezier(0.22, 1.5, 0.36, 1)",
        opacity: dimmed ? 0.55 : 1,
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-inter), system-ui",
          fontSize: 10,
          fontWeight: 700,
          color: accent ? "var(--accent)" : "var(--ink-50)",
          textTransform: "uppercase",
          letterSpacing: 0.6,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: "var(--font-fraunces), serif",
          fontSize: 22,
          fontWeight: 500,
          color: "var(--ink)",
          lineHeight: 1.1,
          marginTop: 2,
          fontVariationSettings: "'SOFT' 80, 'WONK' 1",
        }}
      >
        <CountUp from={from} to={to} />
      </div>
      <div
        style={{
          fontFamily: "var(--font-inter), system-ui",
          fontSize: 12,
          fontWeight: 700,
          color: "oklch(60% 0.15 145)",
          marginTop: 2,
          letterSpacing: -0.05,
        }}
      >
        +{delta}
      </div>
    </div>
  );
}

function CountUp({
  from,
  to,
  duration = 900,
}: {
  from: number;
  to: number;
  duration?: number;
}) {
  const [v, setV] = useState(from);
  useEffect(() => {
    if (from === to) {
      setV(to);
      return;
    }
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setV(Math.round(from + (to - from) * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [from, to, duration]);
  return <>{v.toLocaleString()}</>;
}

// ── Leaderboard ───────────────────────────────────────────────
export function ScreenLeaderboard({
  tint,
  tab,
  setTab,
  name,
  clan,
  clanScore,
  hasClan,
  totalPoints,
  completedProjects,
  equippedHat,
  unlocked,
  unlockThreshold,
  lockedTabs,
}: {
  tint: number;
  tab: Tab;
  setTab: (t: Tab) => void;
  name: string;
  clan: ClanInfo;
  clanScore: number;
  hasClan: boolean;
  totalPoints: number;
  completedProjects: number;
  equippedHat: string | null;
  unlocked: boolean;
  unlockThreshold: number;
  lockedTabs?: Tab[];
}) {
  const [view, setView] = useState<"individual" | "clan">("individual");

  if (!unlocked) {
    return (
      <ClanLockedScreen
        tint={tint}
        tab={tab}
        setTab={setTab}
        completedProjects={completedProjects}
        unlockThreshold={unlockThreshold}
        equippedHat={equippedHat}
        lockedTabs={lockedTabs}
      />
    );
  }

  return (
    <AppShell
      title="Leaderboard"
      subtitle="This season"
      tab={tab}
      setTab={setTab}
      tint={tint}
      bugzyMood="happy"
      bugzySize={50}
      bugzyHat={equippedHat}
      lockedTabs={lockedTabs}
    >
      {/* Clan vs Clan battle card — anchors the page */}
      {hasClan && (
        <ClanBattle yourClan={clan} yourScore={clanScore} />
      )}

      {/* Toggle */}
      <div
        style={{
          display: "flex",
          padding: 4,
          borderRadius: 999,
          background: "var(--ink-08)",
          marginBottom: 18,
        }}
      >
        {(["individual", "clan"] as const).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            style={{
              flex: 1,
              height: 38,
              borderRadius: 999,
              border: "none",
              cursor: "pointer",
              background: view === v ? "var(--bg)" : "transparent",
              color: view === v ? "var(--ink)" : "var(--ink-50)",
              fontFamily: "var(--font-inter), system-ui",
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: -0.1,
              boxShadow: view === v ? "0 2px 6px rgba(0,0,0,0.06)" : "none",
            }}
          >
            {v === "individual" ? "Individuals" : "Clans"}
          </button>
        ))}
      </div>

      {view === "individual" ? (
        <>
          <YourRankPill
            label="You"
            sub={clan.name}
            rank={"—"}
            points={totalPoints}
            extra={`${completedProjects} projects`}
            emoji={null}
          />
          <SectionLabel>Top this season</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {INDIVIDUAL_BOARD.map((row) => (
              <BoardRow
                key={row.rank}
                rank={row.rank}
                title={row.name}
                sub={row.clan}
                points={row.points}
                emoji={null}
              />
            ))}
          </div>
        </>
      ) : (
        <>
          <YourRankPill
            label="Your clan"
            sub={`${clan.emoji} ${clan.name}`}
            rank={"—"}
            points={totalPoints}
            extra="contributing"
            emoji={clan.emoji}
          />
          <SectionLabel>Worldwide clans</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {CLAN_BOARD.map((row) => (
              <BoardRow
                key={row.clan.id}
                rank={row.rank}
                title={row.clan.name}
                sub={`${row.clan.members} members`}
                points={row.clan.points}
                emoji={row.clan.emoji}
                trend={row.trend}
              />
            ))}
          </div>
        </>
      )}
    </AppShell>
  );
}

// ── Locked Clan screen ───────────────────────────────────────
// Shows when the user opens the Clan tab before crossing the
// CLAN_UNLOCK_THRESHOLD. Bugsy explains; a progress meter shows
// how close they are. Mirrors Duolingo's leaderboard gate.
function ClanLockedScreen({
  tint,
  tab,
  setTab,
  completedProjects,
  unlockThreshold,
  equippedHat,
  lockedTabs,
}: {
  tint: number;
  tab: Tab;
  setTab: (t: Tab) => void;
  completedProjects: number;
  unlockThreshold: number;
  equippedHat: string | null;
  lockedTabs?: Tab[];
}) {
  const remaining = Math.max(0, unlockThreshold - completedProjects);
  const pct = Math.min(1, completedProjects / unlockThreshold);

  return (
    <AppShell
      title="Clan"
      subtitle="Locked"
      tab={tab}
      setTab={setTab}
      tint={tint}
      lockedTabs={lockedTabs}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          padding: "8px 4px 0",
        }}
      >
        {/* Big lock */}
        <div
          style={{
            width: 88,
            height: 88,
            borderRadius: 28,
            background: "var(--surface)",
            border: "2px solid var(--border)",
            boxShadow: "0 4px 0 var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 44,
            marginTop: 8,
            marginBottom: 16,
          }}
          aria-hidden
        >
          🔒
        </div>
        <h2
          style={{
            fontFamily: "var(--font-nunito), system-ui",
            fontSize: 22,
            fontWeight: 900,
            color: "var(--ink)",
            letterSpacing: -0.4,
            margin: "0 0 6px",
          }}
        >
          Clan unlocks soon
        </h2>
        <p
          style={{
            fontFamily: "var(--font-nunito), system-ui",
            fontSize: 14,
            fontWeight: 700,
            color: "var(--ink-muted)",
            letterSpacing: -0.1,
            margin: "0 12px 20px",
            lineHeight: 1.45,
            maxWidth: 320,
          }}
        >
          Finish {unlockThreshold} projects with me first. The bond
          comes before the competition.
        </p>

        {/* Progress meter */}
        <div
          style={{
            width: "100%",
            maxWidth: 320,
            padding: "14px 16px",
            borderRadius: 18,
            background: "var(--surface)",
            border: "2px solid var(--border)",
            boxShadow: "0 2px 0 var(--border)",
            marginBottom: 18,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              marginBottom: 8,
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-nunito), system-ui",
                fontSize: 12,
                fontWeight: 800,
                color: "var(--ink-muted)",
                textTransform: "uppercase",
                letterSpacing: 0.6,
              }}
            >
              Progress
            </div>
            <div
              style={{
                fontFamily: "var(--font-nunito), system-ui",
                fontSize: 14,
                fontWeight: 900,
                color: "var(--primary)",
              }}
            >
              {completedProjects} / {unlockThreshold}
            </div>
          </div>
          <div
            style={{
              height: 10,
              borderRadius: 6,
              background: "var(--surface-2)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${pct * 100}%`,
                height: "100%",
                background: "var(--primary)",
                borderRadius: 6,
                transition: "width 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            />
          </div>
        </div>

        {/* Bugsy with bubble */}
        <div style={{ marginTop: 4 }}>
          <Bobo
            mood={completedProjects > 0 ? "thinking" : "sleepy"}
            tint={tint}
            size={120}
            hat={equippedHat ?? undefined}
          />
        </div>
        <div
          style={{
            position: "relative",
            marginTop: -4,
            padding: "12px 16px",
            background: "var(--surface)",
            border: "2px solid var(--border)",
            boxShadow: "0 2px 0 var(--border)",
            borderRadius: 18,
            maxWidth: 320,
            color: "var(--ink)",
            fontFamily: "var(--font-nunito), system-ui",
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: -0.1,
            textAlign: "center",
          }}
        >
          {/* tail */}
          <span
            aria-hidden
            style={{
              position: "absolute",
              top: -10,
              left: "50%",
              transform: "translateX(-50%) rotate(45deg)",
              width: 16,
              height: 16,
              background: "var(--surface)",
              borderLeft: "2px solid var(--border)",
              borderTop: "2px solid var(--border)",
            }}
          />
          {remaining === 0
            ? "You did it! Clan opens any second now…"
            : remaining === 1
            ? "One more project and we're in!"
            : `${remaining} more projects and we're in!`}
        </div>

        {/* CTA back to projects */}
        <div style={{ width: "100%", maxWidth: 320, marginTop: 24 }}>
          <button
            onClick={() => setTab("projects")}
            className="btn-3d"
          >
            Pick a project
          </button>
        </div>
      </div>
    </AppShell>
  );
}

function ClanBattle({
  yourClan,
  yourScore,
}: {
  yourClan: ClanInfo;
  yourScore: number;
}) {
  // Pick the next rival above you (smallest score that's still > yours).
  // Falls back to top clan if user has surpassed all sample clans.
  const ahead = [...OPEN_CLANS]
    .filter((c) => c.points > yourScore)
    .sort((a, b) => a.points - b.points)[0];

  const leading = !ahead;
  const rival = ahead ?? [...OPEN_CLANS].sort((a, b) => b.points - a.points)[0];

  const gap = leading ? yourScore - rival.points : rival.points - yourScore;
  const total = leading ? yourScore : rival.points;
  const yourPct = Math.max(0.05, Math.min(1, yourScore / total));

  return (
    <div
      style={{
        position: "relative",
        padding: 16,
        borderRadius: 22,
        marginBottom: 18,
        color: "#fff",
        background:
          "linear-gradient(135deg, oklch(32% 0.12 295) 0%, oklch(38% 0.14 320) 60%, oklch(36% 0.16 25) 100%)",
        boxShadow: "0 14px 36px rgba(20, 14, 50, 0.30)",
        overflow: "hidden",
      }}
    >
      {/* eyebrow */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div
          style={{
            fontFamily: "var(--font-inter), system-ui",
            fontSize: 10.5,
            fontWeight: 800,
            letterSpacing: 1.2,
            textTransform: "uppercase",
            opacity: 0.85,
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          ⚔️ Clan battle
        </div>
        <div
          style={{
            fontFamily: "var(--font-inter), system-ui",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: 0.8,
            textTransform: "uppercase",
            opacity: 0.65,
          }}
        >
          {leading ? "Defending" : "Live"}
        </div>
      </div>

      {/* two clans head to head */}
      <div
        style={{
          marginTop: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
        }}
      >
        <BattleTile
          name={yourClan.name}
          emoji={yourClan.emoji}
          score={yourScore}
          side="you"
        />
        <div
          style={{
            fontFamily: "var(--font-fraunces), serif",
            fontSize: 16,
            fontWeight: 600,
            color: "rgba(255,255,255,0.6)",
            letterSpacing: 1.5,
            fontVariationSettings: "'SOFT' 80, 'WONK' 1",
            padding: "0 4px",
          }}
        >
          VS
        </div>
        <BattleTile
          name={rival.name}
          emoji={rival.emoji}
          score={rival.points}
          side="them"
        />
      </div>

      {/* progress bar */}
      <div
        style={{
          marginTop: 14,
          height: 8,
          borderRadius: 4,
          background: "rgba(255,255,255,0.16)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            width: `${yourPct * 100}%`,
            background:
              "linear-gradient(90deg, oklch(80% 0.18 30) 0%, oklch(78% 0.16 55) 100%)",
            borderRadius: 4,
            transition: "width 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        />
      </div>

      {/* status line */}
      <div
        style={{
          marginTop: 10,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-inter), system-ui",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: -0.1,
            color: "#fff",
          }}
        >
          {leading
            ? `${gap.toLocaleString()} pts ahead — hold the line!`
            : gap <= 50
            ? `${gap.toLocaleString()} pts behind — push! 🔥`
            : `${gap.toLocaleString()} pts behind — close the gap`}
        </div>
        <div
          style={{
            fontFamily: "var(--font-inter), system-ui",
            fontSize: 11,
            fontWeight: 700,
            opacity: 0.7,
          }}
        >
          {Math.round(yourPct * 100)}%
        </div>
      </div>
    </div>
  );
}

function BattleTile({
  name,
  emoji,
  score,
  side,
}: {
  name: string;
  emoji: string;
  score: number;
  side: "you" | "them";
}) {
  return (
    <div
      style={{
        flex: 1,
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: side === "you" ? "flex-start" : "flex-end",
        textAlign: side === "you" ? "left" : "right",
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 14,
          background:
            side === "you"
              ? "linear-gradient(135deg, oklch(80% 0.16 60), oklch(72% 0.18 30))"
              : "rgba(255,255,255,0.16)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 22,
          marginBottom: 6,
          boxShadow: side === "you" ? "0 6px 14px rgba(0,0,0,0.18)" : "none",
        }}
      >
        {emoji}
      </div>
      <div
        style={{
          fontFamily: "var(--font-inter), system-ui",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: 0.5,
          textTransform: "uppercase",
          opacity: side === "you" ? 1 : 0.75,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          maxWidth: "100%",
        }}
      >
        {side === "you" ? "Your clan" : name}
      </div>
      <div
        style={{
          fontFamily: "var(--font-fraunces), serif",
          fontSize: 20,
          fontWeight: 500,
          marginTop: 2,
          letterSpacing: -0.3,
          fontVariationSettings: "'SOFT' 80, 'WONK' 1",
          whiteSpace: "nowrap",
        }}
      >
        {score.toLocaleString()}
      </div>
    </div>
  );
}

function YourRankPill({
  label,
  sub,
  rank,
  points,
  extra,
  emoji,
}: {
  label: string;
  sub: string;
  rank: number | string;
  points: number;
  extra?: string;
  emoji: string | null;
}) {
  return (
    <div
      style={{
        padding: "14px 16px",
        borderRadius: 20,
        background: "var(--accent-soft)",
        border: "1px solid var(--accent)",
        display: "flex",
        alignItems: "center",
        gap: 14,
        marginBottom: 18,
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 14,
          background: "var(--surface)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 22,
          fontFamily: "var(--font-fraunces), serif",
          color: "var(--accent)",
          fontWeight: 600,
          fontVariationSettings: "'SOFT' 80",
          flexShrink: 0,
        }}
      >
        {emoji ?? "★"}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: "var(--font-inter), system-ui",
            fontSize: 11,
            fontWeight: 700,
            color: "var(--accent)",
            textTransform: "uppercase",
            letterSpacing: 0.8,
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontFamily: "var(--font-inter), system-ui",
            fontSize: 15,
            fontWeight: 600,
            color: "var(--ink)",
            letterSpacing: -0.1,
            marginTop: 2,
          }}
        >
          {sub}
        </div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div
          style={{
            fontFamily: "var(--font-fraunces), serif",
            fontSize: 20,
            fontWeight: 500,
            color: "var(--ink)",
            lineHeight: 1,
            fontVariationSettings: "'SOFT' 80, 'WONK' 1",
          }}
        >
          {points.toLocaleString()}
        </div>
        <div
          style={{
            fontFamily: "var(--font-inter), system-ui",
            fontSize: 11,
            color: "var(--ink-50)",
            marginTop: 2,
          }}
        >
          {extra ?? `rank ${rank}`}
        </div>
      </div>
    </div>
  );
}

function BoardRow({
  rank,
  title,
  sub,
  points,
  emoji,
  trend,
}: {
  rank: number;
  title: string;
  sub: string;
  points: number;
  emoji: string | null;
  trend?: "up" | "down" | "flat";
}) {
  const medal =
    rank === 1
      ? "oklch(80% 0.16 80)"
      : rank === 2
      ? "oklch(80% 0.04 250)"
      : rank === 3
      ? "oklch(68% 0.10 50)"
      : "var(--ink-08)";
  const medalText = rank <= 3 ? "#fff" : "var(--ink-60)";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 14px",
        borderRadius: 16,
        background: "var(--surface)",
        border: "1px solid var(--ink-08)",
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 10,
          background: medal,
          color: medalText,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "var(--font-fraunces), serif",
          fontSize: 14,
          fontWeight: 600,
          fontVariationSettings: "'SOFT' 80",
          flexShrink: 0,
        }}
      >
        {rank}
      </div>
      {emoji && (
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            background: "oklch(94% 0.04 70)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
            flexShrink: 0,
          }}
        >
          {emoji}
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: "var(--font-inter), system-ui",
            fontSize: 14,
            fontWeight: 600,
            color: "var(--ink)",
            letterSpacing: -0.1,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontFamily: "var(--font-inter), system-ui",
            fontSize: 12,
            color: "var(--ink-50)",
            marginTop: 1,
          }}
        >
          {sub}
        </div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div
          style={{
            fontFamily: "var(--font-inter), system-ui",
            fontSize: 14,
            fontWeight: 600,
            color: "var(--ink)",
          }}
        >
          {points.toLocaleString()}
        </div>
        {trend && (
          <div
            style={{
              fontFamily: "var(--font-inter), system-ui",
              fontSize: 11,
              color:
                trend === "up"
                  ? "oklch(60% 0.15 145)"
                  : trend === "down"
                  ? "oklch(60% 0.18 25)"
                  : "var(--ink-50)",
              marginTop: 1,
            }}
          >
            {trend === "up" ? "↗" : trend === "down" ? "↘" : "→"}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Profile (with Bugsy wardrobe) ─────────────────────────────
export function ScreenProfile({
  tint,
  name,
  age,
  clan,
  totalPoints,
  completedProjects,
  streak,
  equippedHat,
  setEquippedHat,
  tab,
  setTab,
  onLogout,
  lockedTabs,
}: {
  tint: number;
  name: string;
  age: number | null;
  clan: ClanInfo;
  totalPoints: number;
  completedProjects: number;
  streak: number;
  equippedHat: string | null;
  setEquippedHat: (h: string | null) => void;
  tab: Tab;
  setTab: (t: Tab) => void;
  onLogout: () => void;
  lockedTabs?: Tab[];
}) {
  return (
    <AppShell title={name || "You"} subtitle="Profile" tab={tab} setTab={setTab} tint={tint} lockedTabs={lockedTabs}>
      {/* Bugsy avatar */}
      <div
        style={{
          padding: 20,
          borderRadius: 24,
          marginBottom: 18,
          background: "linear-gradient(135deg, var(--accent-soft), var(--surface))",
          border: "1px solid var(--ink-08)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Bobo mood="happy" tint={tint} size={140} hat={equippedHat ?? undefined} />
        <div
          style={{
            fontFamily: "var(--font-fraunces), serif",
            fontSize: 22,
            fontWeight: 500,
            color: "var(--ink)",
            letterSpacing: -0.4,
            marginTop: 6,
            fontVariationSettings: "'SOFT' 80, 'WONK' 1",
          }}
        >
          Bugsy
        </div>
        <div
          style={{
            fontFamily: "var(--font-inter), system-ui",
            fontSize: 12.5,
            color: "var(--ink-60)",
            marginTop: 2,
          }}
        >
          {age ? `Companion to ${name || "you"} · age ${age}` : `Companion to ${name || "you"}`}
        </div>
      </div>

      {/* Clan card */}
      <div
        style={{
          padding: "14px 16px",
          borderRadius: 18,
          background: "var(--surface)",
          border: "1px solid var(--ink-08)",
          display: "flex",
          alignItems: "center",
          gap: 14,
          marginBottom: 18,
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 14,
            background: "oklch(94% 0.04 70)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
            flexShrink: 0,
          }}
        >
          {clan.emoji}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontFamily: "var(--font-inter), system-ui",
              fontSize: 11,
              fontWeight: 700,
              color: "var(--ink-50)",
              textTransform: "uppercase",
              letterSpacing: 0.8,
            }}
          >
            Clan
          </div>
          <div
            style={{
              fontFamily: "var(--font-inter), system-ui",
              fontSize: 15,
              fontWeight: 600,
              color: "var(--ink)",
              marginTop: 2,
            }}
          >
            {clan.name}
          </div>
        </div>
        <button
          style={{
            padding: "8px 14px",
            borderRadius: 999,
            cursor: "pointer",
            background: "var(--ink)",
            color: "var(--bg)",
            border: "none",
            fontFamily: "var(--font-inter), system-ui",
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          Invite
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 22 }}>
        {[
          { label: "Points", value: totalPoints.toLocaleString() },
          { label: "Projects", value: completedProjects.toString() },
          { label: "Streak", value: `${streak}d` },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              padding: "12px 10px",
              borderRadius: 16,
              textAlign: "center",
              background: "var(--surface)",
              border: "1px solid var(--ink-08)",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-fraunces), serif",
                fontSize: 22,
                fontWeight: 500,
                color: "var(--ink)",
                lineHeight: 1,
                fontVariationSettings: "'SOFT' 80, 'WONK' 1",
              }}
            >
              {s.value}
            </div>
            <div
              style={{
                fontFamily: "var(--font-inter), system-ui",
                fontSize: 10.5,
                color: "var(--ink-50)",
                textTransform: "uppercase",
                letterSpacing: 0.5,
                marginTop: 4,
                fontWeight: 600,
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Wardrobe */}
      <SectionLabel>Bugsy&apos;s wardrobe</SectionLabel>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        <WardrobeSlot
          name="None"
          locked={false}
          equipped={equippedHat === null}
          onClick={() => setEquippedHat(null)}
          tint={tint}
          hat={null}
        />
        {HATS.map((h) => {
          const locked = completedProjects < h.unlockAt;
          const equipped = equippedHat === h.key;
          return (
            <WardrobeSlot
              key={h.key}
              name={h.name}
              locked={locked}
              unlockAt={h.unlockAt}
              equipped={equipped}
              onClick={() => !locked && setEquippedHat(h.key)}
              tint={tint}
              hat={h.key}
            />
          );
        })}
      </div>

      <SectionLabel>Settings</SectionLabel>
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--ink-08)",
          borderRadius: 18,
          overflow: "hidden",
        }}
      >
        {["Notifications", "Parent portal", "Log out"].map((s, i, a) => {
          const isLogout = s === "Log out";
          return (
            <button
              key={s}
              onClick={isLogout ? onLogout : undefined}
              style={{
                width: "100%",
                padding: "14px 16px",
                borderBottom: i < a.length - 1 ? "1px solid var(--ink-08)" : "none",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontFamily: "var(--font-inter), system-ui",
                fontSize: 14,
                color: isLogout ? "oklch(58% 0.18 25)" : "var(--ink)",
                fontWeight: isLogout ? 600 : 400,
                letterSpacing: -0.1,
                background: "transparent",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <span>{s}</span>
              {!isLogout && (
                <svg width="6" height="10" viewBox="0 0 6 10">
                  <path d="M1 1l4 4-4 4" stroke="var(--ink-40)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                </svg>
              )}
            </button>
          );
        })}
      </div>
    </AppShell>
  );
}

function WardrobeSlot({
  name,
  locked,
  unlockAt,
  equipped,
  onClick,
  tint,
  hat,
}: {
  name: string;
  locked: boolean;
  unlockAt?: number;
  equipped: boolean;
  onClick: () => void;
  tint: number;
  hat: string | null;
}) {
  return (
    <button
      onClick={onClick}
      disabled={locked}
      style={{
        padding: 10,
        borderRadius: 16,
        textAlign: "center",
        background: equipped ? "var(--accent-soft)" : "var(--surface)",
        border: `2px solid ${equipped ? "var(--accent)" : "var(--ink-08)"}`,
        cursor: locked ? "default" : "pointer",
        opacity: locked ? 0.5 : 1,
        transition: "all 0.15s ease",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div style={{ height: 64, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
        <Bobo mood="happy" tint={tint} size={64} animate={false} hat={hat ?? undefined} />
      </div>
      <div
        style={{
          fontFamily: "var(--font-inter), system-ui",
          fontSize: 11,
          fontWeight: 600,
          color: equipped ? "var(--accent)" : "var(--ink-70)",
          marginTop: 6,
        }}
      >
        {name}
      </div>
      {locked && unlockAt && (
        <div
          style={{
            fontFamily: "var(--font-inter), system-ui",
            fontSize: 10,
            color: "var(--ink-50)",
            marginTop: 2,
            letterSpacing: 0.3,
            textTransform: "uppercase",
          }}
        >
          {unlockAt} projects
        </div>
      )}
    </button>
  );
}

// expose categories type for callers
export type { ProjectCategory };
