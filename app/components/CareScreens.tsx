"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Bobo } from "./Mascot";
import { AppShell } from "./AppShell";
import { RoomBackdrop } from "./onboarding/ChildMeet";
import {
  CARE_METERS,
  CAT_BADGES,
  CLAN_CATS,
  catBadge,
  healthFromMeters,
  healthStatus,
  lowestMeter,
  nextClanCat,
  type CareMeterKey,
  type CareMeters,
  type ClanCat,
  type Project,
  type Tab,
} from "../lib/data";

// Colour for a given health score (matches the status bands).
function healthColor(score: number): string {
  if (score >= 80) return "#2BB673"; // Strong — green
  if (score >= 60) return "#4CC76B"; // Healthy — light green
  if (score >= 40) return "#FFB020"; // Growing — amber
  if (score >= 20) return "#FF8A4C"; // Needs attention — orange
  return "#FF4B4B"; // Neglected — red
}

// ── Small shared bits ─────────────────────────────────────────
function CoinPill({ coins, onClick }: { coins: number; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "7px 12px",
        borderRadius: 999,
        background: "linear-gradient(180deg, #FFE9A8 0%, #FFD45E 100%)",
        border: "2px solid #E0A42A",
        boxShadow: "0 2px 0 #C68A1E",
        cursor: onClick ? "pointer" : "default",
        fontFamily: "var(--font-inter), system-ui",
        fontWeight: 800,
        fontSize: 15,
        color: "#8a5a00",
      }}
    >
      <span style={{ fontSize: 16 }}>🪙</span>
      {coins.toLocaleString()}
    </button>
  );
}

function BadgeChip({ name }: { name: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "6px 12px",
        borderRadius: 999,
        background: "var(--accent-soft)",
        color: "var(--accent)",
        fontFamily: "var(--font-inter), system-ui",
        fontWeight: 800,
        fontSize: 13,
      }}
    >
      🏅 {name}
    </span>
  );
}

// Circular health ring with the score in the middle.
function HealthRing({
  score,
  size = 120,
  stroke = 11,
  children,
}: {
  score: number;
  size?: number;
  stroke?: number;
  children?: ReactNode;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, score)) / 100;
  const col = healthColor(score);
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--ink-08)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={col}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
          style={{ transition: "stroke-dashoffset 0.7s cubic-bezier(0.22,1,0.36,1)" }}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {children}
      </div>
    </div>
  );
}

// Mini cat portrait — full colour when unlocked, dim silhouette + lock
// when not. `animate={false}` keeps the grid light (no per-cat blink).
function CatAvatar({ cat, unlocked, size = 58 }: { cat: ClanCat; unlocked: boolean; size?: number }) {
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <div
        style={{
          width: size,
          height: size,
          filter: unlocked ? "none" : "grayscale(0.9) brightness(0.45)",
          opacity: unlocked ? 1 : 0.55,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Bobo mood="happy" tint={cat.tint} size={size} animate={false} />
      </div>
      {!unlocked && (
        <span
          aria-hidden
          style={{
            position: "absolute",
            right: -2,
            bottom: -2,
            width: 22,
            height: 22,
            borderRadius: "50%",
            background: "var(--surface)",
            border: "1.5px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 11,
            boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
          }}
        >
          🔒
        </span>
      )}
    </div>
  );
}

// One behaviour meter row with a Go CTA.
function MeterBar({
  meter,
  value,
  onGo,
}: {
  meter: (typeof CARE_METERS)[number];
  value: number;
  onGo: () => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 12px",
        borderRadius: 16,
        background: "var(--surface)",
        border: "1.5px solid var(--ink-08)",
      }}
    >
      <span style={{ fontSize: 22, width: 26, textAlign: "center" }}>{meter.emoji}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontFamily: "var(--font-inter), system-ui",
            fontSize: 13,
            fontWeight: 700,
            color: "var(--ink-80)",
            marginBottom: 5,
          }}
        >
          <span>{meter.label}</span>
          <span style={{ color: meter.tint }}>{value}%</span>
        </div>
        <div style={{ height: 8, borderRadius: 4, background: "var(--ink-08)", overflow: "hidden" }}>
          <div
            style={{
              width: `${value}%`,
              height: "100%",
              borderRadius: 4,
              background: meter.tint,
              boxShadow: `0 0 8px ${meter.tint}99`,
              transition: "width 0.6s cubic-bezier(0.22,1,0.36,1)",
            }}
          />
        </div>
      </div>
      <button
        onClick={onGo}
        disabled={value >= 100}
        style={{
          flexShrink: 0,
          padding: "8px 14px",
          borderRadius: 12,
          border: "none",
          background: value >= 100 ? "var(--ink-10)" : meter.tint,
          color: value >= 100 ? "var(--ink-50)" : "#fff",
          fontFamily: "var(--font-inter), system-ui",
          fontWeight: 800,
          fontSize: 13,
          cursor: value >= 100 ? "default" : "pointer",
          boxShadow: value >= 100 ? "none" : "0 3px 0 rgba(0,0,0,0.18)",
        }}
      >
        {value >= 100 ? "Full" : "Go"}
      </button>
    </div>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        fontFamily: "var(--font-fraunces), serif",
        fontSize: 18,
        fontWeight: 500,
        letterSpacing: -0.3,
        color: "var(--ink)",
        margin: "22px 0 12px",
        fontVariationSettings: "'SOFT' 80, 'WONK' 1",
      }}
    >
      {children}
    </div>
  );
}

// ── Layer 1: Home ─────────────────────────────────────────────
export function ScreenHomeCare({
  tint,
  name,
  coins,
  meters,
  streak,
  equippedHat,
  missions,
  tab,
  setTab,
  onOpenProject,
  onOpenCatometer,
  onSpendSnack,
  nextFightLabel,
  lockedTabs,
}: {
  tint: number;
  name: string;
  coins: number;
  meters: CareMeters;
  streak: number;
  equippedHat: string | null;
  missions: Project[];
  tab: Tab;
  setTab: (t: Tab) => void;
  onOpenProject: (id: string) => void;
  onOpenCatometer: () => void;
  onSpendSnack: () => void;
  nextFightLabel: string;
  lockedTabs?: Tab[];
}) {
  const health = healthFromMeters(meters);
  const status = healthStatus(health);
  const { current: badge } = catBadge(coins);
  const low = lowestMeter(meters);
  const heroMood = health >= 60 ? "happy" : health >= 40 ? "thinking" : "hungry";

  // Time-of-day for the room scene — sunny by day, sunset at dusk,
  // moon + stars at night. Set after mount (not at render) so the
  // server and client markup agree during hydration.
  const [daypart, setDaypart] = useState<"day" | "dusk" | "night">("day");
  useEffect(() => {
    const hour = new Date().getHours();
    setDaypart(hour >= 20 || hour < 6 ? "night" : hour >= 17 ? "dusk" : "day");
  }, []);

  return (
    <AppShell
      title={`Hey, ${name || "friend"}`}
      subtitle={streak > 0 ? `🔥 ${streak} day streak` : "Today"}
      tab={tab}
      setTab={setTab}
      tint={tint}
      lockedTabs={lockedTabs}
      backdrop={
        // Same cosy room the child met Bugsy in during onboarding —
        // home *is* Bugsy's room. Chairs off keeps the wall clear
        // behind the cards; the window follows the child's real clock.
        <>
          <RoomBackdrop
            chairs={false}
            dusk={daypart === "dusk"}
            night={daypart === "night"}
          />
          {/* The window (moon + stars) hides behind the cards, so give
              the whole room a gentle lamplight-indigo dim at night. */}
          {daypart === "night" && (
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(180deg, rgba(42,46,90,0.22) 0%, rgba(58,52,112,0.12) 55%, rgba(255,177,94,0.10) 100%)",
              }}
            />
          )}
        </>
      }
    >
      {/* Coins + badge */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <CoinPill coins={coins} />
        <BadgeChip name={badge.name} />
      </div>

      {/* Health / Catometer card */}
      <button
        onClick={onOpenCatometer}
        style={{
          width: "100%",
          textAlign: "left",
          border: "none",
          cursor: "pointer",
          padding: 16,
          borderRadius: 22,
          background: "var(--surface)",
          boxShadow: "0 4px 18px rgba(20,14,24,0.06)",
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 16,
        }}
      >
        <HealthRing score={health} size={104}>
          <div style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 28, fontWeight: 600, color: "var(--ink)", lineHeight: 1 }}>
            {health}
          </div>
          <div style={{ fontFamily: "var(--font-inter), system-ui", fontSize: 9.5, fontWeight: 700, color: "var(--ink-50)", letterSpacing: 0.5, textTransform: "uppercase" }}>
            health
          </div>
        </HealthRing>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "var(--font-inter), system-ui", fontSize: 11, fontWeight: 700, color: "var(--ink-50)", textTransform: "uppercase", letterSpacing: 0.6 }}>
            Bugsy is
          </div>
          <div style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 22, fontWeight: 600, color: healthColor(health), letterSpacing: -0.3, lineHeight: 1.1, margin: "1px 0 8px" }}>
            {status}
          </div>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontFamily: "var(--font-inter), system-ui",
              fontSize: 13,
              fontWeight: 700,
              color: "var(--accent)",
            }}
          >
            View Catometer →
          </span>
        </div>
      </button>

      {/* Care prompt — Bugsy + the lowest-meter desire */}
      <button
        onClick={onOpenCatometer}
        style={{
          width: "100%",
          textAlign: "left",
          cursor: "pointer",
          border: "none",
          padding: "14px 16px",
          borderRadius: 20,
          background: "linear-gradient(135deg, var(--accent) 0%, oklch(60% 0.17 295) 100%)",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 4,
          boxShadow: "0 10px 26px rgba(0,0,0,0.12)",
        }}
      >
        <div style={{ flexShrink: 0, filter: "drop-shadow(0 6px 8px rgba(0,0,0,0.2))" }}>
          <Bobo mood={heroMood} tint={tint} size={64} hat={equippedHat ?? undefined} animate={false} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "var(--font-inter), system-ui", fontSize: 16, fontWeight: 800, lineHeight: 1.25 }}>
            {`Bugsy ${low.desire}!`}
          </div>
          <div style={{ fontFamily: "var(--font-inter), system-ui", fontSize: 13, fontWeight: 600, opacity: 0.9, marginTop: 2 }}>
            Complete a care mission → {low.emoji} {low.label}
          </div>
        </div>
      </button>

      {/* Missions of the day */}
      <SectionTitle>Missions of the day</SectionTitle>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {missions.map((m) => (
          <button
            key={m.id}
            onClick={() => onOpenProject(m.id)}
            style={{
              width: "100%",
              textAlign: "left",
              cursor: "pointer",
              border: "1.5px solid var(--ink-08)",
              background: "var(--surface)",
              borderRadius: 18,
              padding: 14,
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: "var(--accent-soft)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
                flexShrink: 0,
              }}
            >
              {m.emoji}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "var(--font-inter), system-ui", fontSize: 15.5, fontWeight: 800, color: "var(--ink)", letterSpacing: -0.2 }}>
                {m.title}
              </div>
              <div style={{ fontFamily: "var(--font-inter), system-ui", fontSize: 12, fontWeight: 600, color: "var(--ink-50)", marginTop: 2 }}>
                {m.mins} min · +{m.points} 🪙
              </div>
            </div>
            <span style={{ fontSize: 18, color: "var(--accent)", flexShrink: 0 }}>→</span>
          </button>
        ))}
      </div>

      {/* Spend your coins */}
      <SectionTitle>Spend your coins</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <SpendCard
          emoji="🍰"
          title="Special snack"
          sub="30 🪙 · fills Feeding"
          disabled={coins < 30}
          onClick={onSpendSnack}
        />
        <SpendCard
          emoji="🎀"
          title="Accessories"
          sub="Customise Bugsy"
          onClick={() => setTab("me")}
        />
      </div>

      {/* Next clan fight */}
      <SectionTitle>Clan</SectionTitle>
      <div
        style={{
          padding: "14px 16px",
          borderRadius: 18,
          background: "linear-gradient(135deg, #5a4b8a 0%, #34344f 100%)",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <span style={{ fontSize: 26 }}>⚔️</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "var(--font-inter), system-ui", fontSize: 14.5, fontWeight: 800 }}>
            Next clan fight
          </div>
          <div style={{ fontFamily: "var(--font-inter), system-ui", fontSize: 12.5, fontWeight: 600, opacity: 0.85 }}>
            {nextFightLabel}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function SpendCard({
  emoji,
  title,
  sub,
  disabled,
  onClick,
}: {
  emoji: string;
  title: string;
  sub: string;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        textAlign: "left",
        cursor: disabled ? "default" : "pointer",
        border: "1.5px solid var(--ink-08)",
        background: "var(--surface)",
        borderRadius: 18,
        padding: 14,
        opacity: disabled ? 0.5 : 1,
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
    >
      <span style={{ fontSize: 26 }}>{emoji}</span>
      <div style={{ fontFamily: "var(--font-inter), system-ui", fontSize: 14, fontWeight: 800, color: "var(--ink)" }}>{title}</div>
      <div style={{ fontFamily: "var(--font-inter), system-ui", fontSize: 11.5, fontWeight: 600, color: "var(--ink-50)" }}>{sub}</div>
    </button>
  );
}

// ── Layer 2: Catometer ────────────────────────────────────────
export function ScreenCatometer({
  tint,
  coins,
  meters,
  equippedHat,
  nextFightLabel,
  onBack,
  onCare,
}: {
  tint: number;
  coins: number;
  meters: CareMeters;
  equippedHat: string | null;
  nextFightLabel: string;
  onBack: () => void;
  onCare: (key: CareMeterKey) => void;
}) {
  const health = healthFromMeters(meters);
  const status = healthStatus(health);
  const { current: badge, next: nextBadge } = catBadge(coins);
  const nextCat = nextClanCat(coins);
  const [selected, setSelected] = useState<string>("bugsy");
  const selectedCat = CLAN_CATS.find((c) => c.key === selected) ?? CLAN_CATS[0];
  const selectedUnlocked = coins >= selectedCat.unlockAt;

  return (
    <div style={{ position: "absolute", inset: 0, background: "var(--bg)", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div
        style={{
          flexShrink: 0,
          paddingTop: 54,
          padding: "54px 20px 12px",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <button
          onClick={onBack}
          aria-label="Back"
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            border: "1.5px solid var(--ink-10)",
            background: "var(--surface)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "var(--ink-80)",
            flexShrink: 0,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14">
            <path d="M9 1L3 7l6 6" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div
          style={{
            flex: 1,
            fontFamily: "var(--font-fraunces), serif",
            fontSize: 24,
            fontWeight: 500,
            letterSpacing: -0.5,
            color: "var(--ink)",
            fontVariationSettings: "'SOFT' 80, 'WONK' 1",
          }}
        >
          Catometer
        </div>
        <CoinPill coins={coins} />
      </div>

      <div style={{ flex: 1, overflow: "auto", padding: "4px 20px 32px" }}>
        {/* Bugsy + health */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "8px 0 4px",
          }}
        >
          <HealthRing score={health} size={150} stroke={13}>
            <div style={{ filter: "drop-shadow(0 6px 8px rgba(0,0,0,0.15))" }}>
              <Bobo mood={health >= 60 ? "happy" : health >= 40 ? "thinking" : "hungry"} tint={tint} size={104} hat={equippedHat ?? undefined} animate={false} />
            </div>
          </HealthRing>
          <div style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 26, fontWeight: 600, color: "var(--ink)", marginTop: 8 }}>
            {health}/100
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
            <span style={{ fontFamily: "var(--font-inter), system-ui", fontSize: 14, fontWeight: 800, color: healthColor(health) }}>{status}</span>
            <BadgeChip name={badge.name} />
          </div>
        </div>

        {/* Behaviour meters */}
        <SectionTitle>Care meters</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {CARE_METERS.map((m) => (
            <MeterBar key={m.key} meter={m} value={meters[m.key]} onGo={() => onCare(m.key)} />
          ))}
        </div>

        {/* Clan cats */}
        <SectionTitle>Your clan</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {CLAN_CATS.map((cat) => {
            const unlocked = coins >= cat.unlockAt;
            const active = selected === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setSelected(cat.key)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                  padding: "12px 6px 10px",
                  borderRadius: 16,
                  cursor: "pointer",
                  border: active ? "2px solid var(--accent)" : "1.5px solid var(--ink-08)",
                  background: active ? "var(--accent-soft)" : "var(--surface)",
                }}
              >
                <CatAvatar cat={cat} unlocked={unlocked} />
                <div style={{ fontFamily: "var(--font-inter), system-ui", fontSize: 12.5, fontWeight: 800, color: "var(--ink)" }}>
                  {cat.name}
                </div>
                <div style={{ fontFamily: "var(--font-inter), system-ui", fontSize: 10, fontWeight: 700, color: unlocked ? "var(--accent)" : "var(--ink-50)" }}>
                  {cat.captain ? "Captain" : unlocked ? "Unlocked" : `${cat.unlockAt} 🪙`}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected cat detail */}
        <div
          style={{
            marginTop: 14,
            padding: 16,
            borderRadius: 18,
            background: "var(--surface)",
            border: "1.5px solid var(--ink-08)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <CatAvatar cat={selectedCat} unlocked={selectedUnlocked} size={50} />
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 19, fontWeight: 600, color: "var(--ink)" }}>
                {selectedCat.name}
              </div>
              <div style={{ fontFamily: "var(--font-inter), system-ui", fontSize: 12.5, fontWeight: 700, color: "var(--ink-60)" }}>
                {selectedCat.domain}
              </div>
            </div>
            {selectedUnlocked && <BadgeChip name={selectedCat.captain ? "Champion" : "Kitten"} />}
          </div>
          <div style={{ fontFamily: "var(--font-inter), system-ui", fontSize: 13, fontWeight: 600, color: "var(--ink-70)", marginTop: 10, lineHeight: 1.4 }}>
            {selectedCat.role}.
          </div>
          {!selectedUnlocked && (
            <div style={{ marginTop: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-inter), system-ui", fontSize: 12, fontWeight: 700, color: "var(--ink-60)", marginBottom: 5 }}>
                <span>{Math.max(0, selectedCat.unlockAt - coins)} more 🪙 to unlock</span>
                <span>{Math.min(100, Math.round((coins / selectedCat.unlockAt) * 100))}%</span>
              </div>
              <div style={{ height: 8, borderRadius: 4, background: "var(--ink-08)", overflow: "hidden" }}>
                <div
                  style={{
                    width: `${Math.min(100, (coins / selectedCat.unlockAt) * 100)}%`,
                    height: "100%",
                    borderRadius: 4,
                    background: "var(--accent)",
                    transition: "width 0.6s cubic-bezier(0.22,1,0.36,1)",
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Next unlock nudge */}
        {nextCat && (
          <div
            style={{
              marginTop: 12,
              padding: "12px 16px",
              borderRadius: 16,
              background: "var(--accent-soft)",
              fontFamily: "var(--font-inter), system-ui",
              fontSize: 13,
              fontWeight: 700,
              color: "var(--accent)",
              textAlign: "center",
            }}
          >
            {Math.max(0, nextCat.unlockAt - coins)} more 🪙 to unlock {nextCat.name} ({nextCat.domain})
          </div>
        )}

        {/* Badge ladder */}
        <SectionTitle>Badge ladder</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {CAT_BADGES.map((b) => {
            const reached = coins >= b.coins;
            const isCurrent = badge.name === b.name;
            return (
              <div
                key={b.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 14px",
                  borderRadius: 14,
                  background: isCurrent ? "var(--accent-soft)" : "var(--surface)",
                  border: isCurrent ? "2px solid var(--accent)" : "1.5px solid var(--ink-08)",
                  opacity: reached || isCurrent ? 1 : 0.7,
                }}
              >
                <span style={{ fontSize: 18 }}>{reached ? "🏅" : "🔒"}</span>
                <span style={{ flex: 1, fontFamily: "var(--font-inter), system-ui", fontSize: 14, fontWeight: 800, color: "var(--ink)" }}>{b.name}</span>
                <span style={{ fontFamily: "var(--font-inter), system-ui", fontSize: 12.5, fontWeight: 700, color: "var(--ink-50)" }}>
                  {b.coins.toLocaleString()} 🪙
                </span>
              </div>
            );
          })}
        </div>
        {nextBadge && (
          <div style={{ fontFamily: "var(--font-inter), system-ui", fontSize: 12, fontWeight: 600, color: "var(--ink-50)", textAlign: "center", marginTop: 8 }}>
            {nextBadge.coins - coins} more 🪙 → {nextBadge.name}
          </div>
        )}

        {/* Next clan fight */}
        <SectionTitle>Clan fight</SectionTitle>
        <div
          style={{
            padding: "14px 16px",
            borderRadius: 18,
            background: "linear-gradient(135deg, #5a4b8a 0%, #34344f 100%)",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <span style={{ fontSize: 26 }}>⚔️</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "var(--font-inter), system-ui", fontSize: 14.5, fontWeight: 800 }}>Next clan fight</div>
            <div style={{ fontFamily: "var(--font-inter), system-ui", fontSize: 12.5, fontWeight: 600, opacity: 0.85 }}>{nextFightLabel}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
