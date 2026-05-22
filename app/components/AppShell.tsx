"use client";

import type { ReactNode } from "react";
import { Bobo } from "./Mascot";
import type { Mood, Tab } from "../lib/data";

export function TabBar({
  tab,
  setTab,
}: {
  tab: Tab;
  setTab: (t: Tab) => void;
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
    { key: "leaderboard", label: "Ranks", icon: "board" },
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
        return (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              background: "none",
              border: "none",
              cursor: "pointer",
              color: active ? "var(--accent)" : "var(--ink-50)",
              fontFamily: "var(--font-inter), system-ui",
              fontSize: 10.5,
              fontWeight: 600,
              letterSpacing: 0.2,
            }}
          >
            {icons[t.icon]}
            <span>{t.label}</span>
          </button>
        );
      })}
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
      <div style={{ flex: 1, overflow: "auto", paddingTop: 60 }}>
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
      <TabBar tab={tab} setTab={setTab} />
    </div>
  );
}
