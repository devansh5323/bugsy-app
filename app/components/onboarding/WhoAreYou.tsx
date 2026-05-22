"use client";

import { Bobo } from "../Mascot";
import type { UserType } from "../../lib/data";

export function WhoAreYou({
  tint,
  onPick,
}: {
  tint: number;
  onPick: (t: UserType) => void;
}) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "var(--bg)",
        display: "flex",
        flexDirection: "column",
        paddingTop: 80,
        paddingBottom: 40,
        paddingLeft: 28,
        paddingRight: 28,
        boxSizing: "border-box",
      }}
    >
      <div className="bg-blobs" aria-hidden>
        <div style={{ width: 240, height: 240, top: -60, right: -60, background: "var(--accent)", opacity: 0.15 }} />
        <div style={{ width: 200, height: 200, bottom: 120, left: -80, background: "var(--accent)", opacity: 0.10 }} />
      </div>

      <div style={{ position: "relative", display: "flex", justifyContent: "center", marginTop: 20 }}>
        <div style={{ animation: "bobo-enter 0.7s cubic-bezier(0.22, 1, 0.36, 1)" }}>
          <Bobo mood="waving" tint={tint} size={180} />
        </div>
      </div>

      <h1
        style={{
          fontFamily: "var(--font-fraunces), Georgia, serif",
          fontWeight: 500,
          fontSize: 38,
          lineHeight: 1.05,
          letterSpacing: -1.2,
          textAlign: "center",
          margin: "24px 0 8px",
          color: "var(--ink)",
          fontVariationSettings: "'SOFT' 80, 'WONK' 1",
          position: "relative",
        }}
      >
        Who are you?
      </h1>
      <p
        style={{
          fontFamily: "var(--font-inter), system-ui",
          fontSize: 16,
          lineHeight: 1.4,
          color: "var(--ink-60)",
          textAlign: "center",
          margin: "0 auto 28px",
          maxWidth: 280,
          letterSpacing: -0.1,
          position: "relative",
        }}
      >
        Pick the one that&apos;s you — we&apos;ll set things up differently.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, position: "relative" }}>
        <PickerCard
          emoji="👋"
          title="I am a Parent"
          sub="Set up your child's profile."
          tone="calm"
          onClick={() => onPick("parent")}
        />
        <PickerCard
          emoji="🚀"
          title="I am a Child"
          sub="Meet Bugsy and start playing."
          tone="kid"
          onClick={() => onPick("child")}
        />
      </div>
    </div>
  );
}

function PickerCard({
  emoji,
  title,
  sub,
  tone,
  onClick,
}: {
  emoji: string;
  title: string;
  sub: string;
  tone: "calm" | "kid";
  onClick: () => void;
}) {
  const kid = tone === "kid";
  return (
    <button
      onClick={onClick}
      style={{
        textAlign: "left",
        padding: "18px 18px",
        borderRadius: 22,
        cursor: "pointer",
        background: kid
          ? "linear-gradient(135deg, oklch(82% 0.16 30) 0%, oklch(75% 0.18 320) 100%)"
          : "var(--surface)",
        color: kid ? "#fff" : "var(--ink)",
        border: kid ? "none" : "1.5px solid var(--ink-08)",
        boxShadow: kid ? "0 10px 28px rgba(0,0,0,0.18)" : "0 2px 8px rgba(0,0,0,0.03)",
        display: "flex",
        gap: 16,
        alignItems: "center",
        transition: "transform 0.1s ease",
      }}
      onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.985)")}
      onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      <div
        style={{
          width: 54,
          height: 54,
          borderRadius: 16,
          background: kid ? "rgba(255,255,255,0.22)" : "var(--accent-soft)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 28,
          flexShrink: 0,
        }}
      >
        {emoji}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: "var(--font-fraunces), serif",
            fontSize: 20,
            fontWeight: 500,
            letterSpacing: -0.3,
            lineHeight: 1.1,
            fontVariationSettings: "'SOFT' 80, 'WONK' 1",
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontFamily: "var(--font-inter), system-ui",
            fontSize: 13,
            color: kid ? "rgba(255,255,255,0.9)" : "var(--ink-60)",
            marginTop: 2,
            letterSpacing: -0.05,
          }}
        >
          {sub}
        </div>
      </div>
      <svg width="10" height="16" viewBox="0 0 10 16">
        <path
          d="M2 1l6 7-6 7"
          stroke={kid ? "rgba(255,255,255,0.9)" : "var(--ink-40)"}
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
}
