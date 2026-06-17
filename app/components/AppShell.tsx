"use client";

import type { ReactNode } from "react";
import { Bobo } from "./Mascot";
import type { Mood, Tab } from "../lib/data";

export function TabBar({
  tab,
  setTab,
  lockedTabs = [],
}: {
  tab: Tab;
  setTab: (t: Tab) => void;
  // Tabs that are visible but show a lock badge. Tap still routes
  // there — the destination renders a "locked / progress" state.
  lockedTabs?: Tab[];
}) {
  const icons = {
    home: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M3 11L12 4l9 7v9a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1v-9z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    ),
    projects: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="0.5" fill="currentColor" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
    board: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M5 21V11h4v10M10 21V4h4v17M15 21v-8h4v8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    me: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" />
        <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  } as const;

  const tabs: { key: Tab; label: string; icon: keyof typeof icons }[] = [
    { key: "home", label: "Home", icon: "home" },
    { key: "projects", label: "Projects", icon: "projects" },
    { key: "leaderboard", label: "Clan", icon: "board" },
    { key: "me", label: "Me", icon: "me" },
  ];

  return (
    <div
      style={{
        flexShrink: 0,
        height: 80,
        paddingBottom: 24,
        display: "flex",
        justifyContent: "space-around",
        background: "var(--surface)",
        borderTop: "1px solid var(--ink-08)",
        zIndex: 10,
      }}
    >
      {tabs.map((t) => {
        const active = tab === t.key;
        const locked = lockedTabs.includes(t.key);
        return (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              flex: 1,
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              background: "none",
              border: "none",
              cursor: "pointer",
              color: locked
                ? "var(--ink-muted)"
                : active
                ? "var(--accent)"
                : "var(--ink-50)",
              fontFamily: "var(--font-inter), system-ui",
              fontSize: 10.5,
              fontWeight: 600,
              letterSpacing: 0.2,
              opacity: locked ? 0.7 : 1,
            }}
          >
            <div style={{ position: "relative" }}>
              {icons[t.icon]}
              {locked && (
                <div
                  aria-hidden
                  style={{
                    position: "absolute",
                    top: -6,
                    right: -8,
                    width: 14,
                    height: 14,
                    borderRadius: 999,
                    background: "var(--ink)",
                    color: "var(--canvas)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 9,
                    boxShadow: "0 1px 0 var(--border)",
                  }}
                >
                  🔒
                </div>
              )}
            </div>
            <span>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// Ambient warm motes drifting over the home scene — same polish layer
// the onboarding parent flow uses. Purely decorative, zero interactivity.
function AmbientMotes() {
  const motes = [
    { left: "14%", top: "18%", size: 10, dur: 9, delay: 0, c: "rgba(255,212,128,0.55)" },
    { left: "80%", top: "24%", size: 7, dur: 11, delay: 1.4, c: "rgba(255,180,200,0.5)" },
    { left: "30%", top: "42%", size: 6, dur: 10, delay: 2.6, c: "rgba(255,225,150,0.5)" },
    { left: "68%", top: "50%", size: 9, dur: 12, delay: 0.8, c: "rgba(200,160,255,0.42)" },
    { left: "50%", top: "14%", size: 5, dur: 8.5, delay: 3.2, c: "rgba(255,255,255,0.6)" },
    { left: "88%", top: "60%", size: 6, dur: 10.5, delay: 1.9, c: "rgba(255,200,140,0.48)" },
  ];
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 1,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {motes.map((m, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            left: m.left,
            top: m.top,
            width: m.size,
            height: m.size,
            borderRadius: "50%",
            background: m.c,
            filter: "blur(1px)",
            animation: `parent-mote ${m.dur}s ease-in-out ${m.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

export function AppShell({
  children,
  tab,
  setTab,
  tint,
  title,
  subtitle,
  bugzyMood,
  bugzySize = 44,
  bugzyHat,
  lockedTabs,
  backdrop,
}: {
  children: ReactNode;
  tab: Tab;
  setTab: (t: Tab) => void;
  tint: number;
  title: string;
  subtitle?: string;
  bugzyMood?: Mood;
  bugzySize?: number;
  bugzyHat?: string | null;
  lockedTabs?: Tab[];
  // Optional full-bleed scene rendered behind the content (e.g. the
  // cosy-room backdrop on home). We layer the onboarding's readability
  // scrim + ambient motes over it so cards and text stay legible.
  // Omitted → original plain-canvas look, other screens unaffected.
  backdrop?: ReactNode;
}) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "var(--bg)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {backdrop && (
        <>
          {/* Scene — gently "breathes" so it feels alive without distracting. */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 0,
              transformOrigin: "center",
              animation: "parent-scene-drift 20s ease-in-out infinite",
            }}
          >
            {backdrop}
          </div>
          {/* Readability scrim — light up top (scene shows through behind
              Bugsy), heavier toward the bottom where cards stack up. */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 0,
              pointerEvents: "none",
              background:
                "linear-gradient(180deg, rgba(255,251,245,0.30) 0%, rgba(255,250,244,0.42) 38%, rgba(255,249,242,0.66) 70%, rgba(255,248,240,0.82) 100%)",
            }}
          />
          <AmbientMotes />
        </>
      )}
      <div style={{ flex: 1, overflow: "auto", paddingTop: 60, position: "relative", zIndex: 2 }}>
        <div style={{ padding: "8px 24px 18px", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ flex: 1 }}>
            {subtitle && (
              <div
                style={{
                  fontFamily: "var(--font-inter), system-ui",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "var(--ink-50)",
                  letterSpacing: 0.5,
                  textTransform: "uppercase",
                  marginBottom: 4,
                }}
              >
                {subtitle}
              </div>
            )}
            <div
              style={{
                fontFamily: "var(--font-fraunces), serif",
                fontWeight: 500,
                fontSize: 26,
                letterSpacing: -0.6,
                color: "var(--ink)",
                lineHeight: 1.1,
                fontVariationSettings: "'SOFT' 80, 'WONK' 1",
              }}
            >
              {title}
            </div>
          </div>
          {bugzyMood && <Bobo mood={bugzyMood} tint={tint} size={bugzySize} hat={bugzyHat ?? undefined} />}
        </div>
        <div style={{ padding: "0 24px 24px" }}>{children}</div>
      </div>
      <TabBar tab={tab} setTab={setTab} lockedTabs={lockedTabs} />
    </div>
  );
}
