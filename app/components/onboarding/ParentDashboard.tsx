"use client";

import { Bobo } from "../Mascot";

const F = "var(--font-nunito), system-ui, sans-serif";

export function ParentDashboard({
  tint,
  parentName,
  onNext,
}: {
  tint: number;
  parentName?: string;
  onNext: () => void;
}) {
  const PName = parentName?.trim() || "Parent";

  const CARD: React.CSSProperties = {
    background: "rgba(16,12,42,0.9)",
    borderRadius: 20,
    border: "1px solid rgba(90,60,160,0.28)",
    padding: "16px 14px",
    marginBottom: 11,
  };

  return (
    <div style={{
      position: "absolute", inset: 0,
      background: "linear-gradient(180deg, #080620 0%, #0D0A28 55%, #090722 100%)",
      display: "flex", flexDirection: "column",
      fontFamily: F,
    }}>

      {/* Background stars */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
        {([
          [8,5],[22,2],[38,9],[55,3],[72,8],[88,1],[96,12],
          [14,20],[30,16],[50,22],[66,17],[84,24],
          [6,38],[20,42],[44,35],[62,40],[80,36],[93,44],
          [10,60],[28,55],[48,63],[70,57],[90,65],
          [4,78],[18,82],[40,76],[60,80],[78,74],[94,85],
        ] as [number,number][]).map(([l, t], i) => (
          <div key={i} style={{
            position: "absolute", left: `${l}%`, top: `${t}%`,
            width: i % 5 === 0 ? 2.5 : 1.5, height: i % 5 === 0 ? 2.5 : 1.5,
            borderRadius: "50%",
            background: i % 6 === 0 ? "rgba(210,170,255,0.65)" : "rgba(255,255,255,0.4)",
            animation: `pd-twinkle ${1.4 + (i % 4) * 0.55}s ease-in-out ${(i * 0.22) % 2.2}s infinite`,
          }} />
        ))}
      </div>

{/* ── Scrollable content ── */}
      <div className="pd-scroll" style={{
        flex: 1, overflowY: "auto", overflowX: "hidden",
        padding: "52px 14px 0",
        position: "relative", zIndex: 1,
      }}>

        {/* ── Header ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 0 }}>
            <div style={{ flexShrink: 0 }}>
              <Bobo mood="excited" tint={tint} size={100} animate tailWag armsDown />
            </div>
            <div>
              <p style={{ margin: 0, color: "#fff", fontSize: 22, fontWeight: 900, lineHeight: 1.1 }}>
                Hi, {PName}! 👋
              </p>
              <p style={{ margin: "5px 0 0", color: "rgba(255,255,255,0.72)", fontSize: 12, fontWeight: 400, lineHeight: 1.5 }}>
                Great to see you here.<br />Let&apos;s help your child grow<br />together. 💜
              </p>
            </div>
          </div>
          {/* Switch to child */}
          <button onClick={onNext} style={{
            flexShrink: 0, cursor: "pointer",
            background: "rgba(35,20,80,0.88)",
            border: "1px solid rgba(100,70,200,0.38)",
            borderRadius: 18, padding: "10px 12px",
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: "50%",
              background: "linear-gradient(135deg, #5B32B8, #3D1E8A)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20,
            }}>👧</div>
            <div>
              <p style={{ margin: 0, color: "rgba(255,255,255,0.68)", fontSize: 11, fontWeight: 500, lineHeight: 1.3 }}>Switch to</p>
              <p style={{ margin: 0, color: "#fff", fontSize: 12, fontWeight: 800, lineHeight: 1.3 }}>Child Dashboard</p>
            </div>
            <span style={{ color: "rgba(255,255,255,0.45)", fontSize: 18 }}>›</span>
          </button>
        </div>

        {/* ── Stats Row — single card, 3 columns ── */}
        <div style={{ ...CARD, display: "flex", padding: "16px 10px" }}>
          {/* Streak */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
            <div style={{
              width: 38, height: 38, borderRadius: "50%",
              background: "rgba(255,100,30,0.15)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
            }}>🔥</div>
            <p style={{ margin: 0, color: "#FF6B1A", fontSize: 30, fontWeight: 900, lineHeight: 1 }}>7</p>
            <p style={{ margin: 0, color: "#fff", fontSize: 11, fontWeight: 700, textAlign: "center" }}>Day Streak</p>
            <p style={{ margin: 0, color: "rgba(255,255,255,0.42)", fontSize: 10.5, textAlign: "center" }}>Keep it up!</p>
          </div>
          {/* Divider */}
          <div style={{ width: 1, background: "rgba(255,255,255,0.08)", margin: "4px 2px" }} />
          {/* Focus Score */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
            <div style={{
              width: 38, height: 38, borderRadius: "50%",
              background: "rgba(120,60,220,0.18)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
            }}>🎯</div>
            <p style={{ margin: 0, color: "#A855F7", fontSize: 30, fontWeight: 900, lineHeight: 1 }}>78</p>
            <p style={{ margin: 0, color: "#fff", fontSize: 11, fontWeight: 700, textAlign: "center" }}>Focus Score</p>
            <p style={{ margin: 0, color: "#22C55E", fontSize: 10.5, fontWeight: 600, textAlign: "center" }}>Above average</p>
          </div>
          {/* Divider */}
          <div style={{ width: 1, background: "rgba(255,255,255,0.08)", margin: "4px 2px" }} />
          {/* Missions */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
            <div style={{
              width: 38, height: 38, borderRadius: "50%",
              background: "rgba(34,197,94,0.14)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
            }}>✅</div>
            <p style={{ margin: 0, color: "#22C55E", fontSize: 30, fontWeight: 900, lineHeight: 1 }}>23</p>
            <p style={{ margin: 0, color: "#fff", fontSize: 11, fontWeight: 700, textAlign: "center" }}>Missions Completed</p>
            <p style={{ margin: 0, color: "rgba(255,255,255,0.42)", fontSize: 10.5, textAlign: "center" }}>This week</p>
          </div>
        </div>

        {/* ── TODAY'S JOURNEY ── */}
        <div style={{ ...CARD }}>
          <p style={{ margin: "0 0 14px", color: "#A78BFA", fontSize: 10.5, fontWeight: 800, letterSpacing: "1.2px", textTransform: "uppercase" }}>Today&apos;s Journey</p>

          {/* Content row */}
          <div style={{ display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 16 }}>
            {/* Circular rocket scene */}
            <div style={{
              width: 96, height: 96, flexShrink: 0, borderRadius: "50%",
              background: "radial-gradient(ellipse at 40% 30%, #2D1B6B 0%, #0D0820 100%)",
              border: "2px solid rgba(100,70,200,0.5)",
              overflow: "hidden", position: "relative",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {/* Purple cloud puffs */}
              <div style={{ position: "absolute", bottom: -6, left: -14, width: 64, height: 30, borderRadius: "50%", background: "rgba(80,40,180,0.55)" }} />
              <div style={{ position: "absolute", bottom: -6, right: -12, width: 54, height: 26, borderRadius: "50%", background: "rgba(80,40,180,0.45)" }} />
              <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: 46, height: 20, borderRadius: "50%", background: "rgba(100,50,200,0.65)" }} />
              {/* Rocket flying upward */}
              <span style={{ fontSize: 38, position: "relative", zIndex: 2, display: "block", animation: "pd-rocket 1.8s ease-in-out infinite" }}>🚀</span>
              {/* Tiny stars */}
              <span style={{ position: "absolute", top: 10, right: 14, color: "#FFD700", fontSize: 8, opacity: 0.85 }}>✦</span>
              <span style={{ position: "absolute", top: 22, left: 11, color: "#FFD700", fontSize: 6, opacity: 0.7 }}>✦</span>
            </div>

            {/* Details */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: "0 0 7px", color: "#fff", fontSize: 19, fontWeight: 900, lineHeight: 1.2 }}>Focus Explorer</p>
              {/* Time chip */}
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 4,
                background: "rgba(60,40,120,0.65)", borderRadius: 20,
                padding: "4px 10px", marginBottom: 9,
              }}>
                <span style={{ fontSize: 11 }}>🕐</span>
                <span style={{ color: "rgba(255,255,255,0.85)", fontSize: 11, fontWeight: 600 }}>10 min activity</span>
              </div>
              <p style={{ margin: "0 0 12px", color: "rgba(255,255,255,0.58)", fontSize: 12, lineHeight: 1.5 }}>
                A 10-minute adventure to build focus and collect stars!
              </p>
              {/* Stats row */}
              <div style={{ display: "flex" }}>
                {[
                  { icon: "🕐", val: "10 min",        label: "Est. Time" },
                  { icon: "🎯", val: "Not Started",    label: "Status" },
                  { icon: "🚩", val: "Collect 5 stars", label: "Goal" },
                ].map((s, i) => (
                  <div key={i} style={{
                    flex: 1,
                    borderLeft: i > 0 ? "1px solid rgba(255,255,255,0.1)" : "none",
                    paddingLeft: i > 0 ? 8 : 0,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 3, marginBottom: 2 }}>
                      <span style={{ fontSize: 10 }}>{s.icon}</span>
                      <span style={{ color: "#fff", fontSize: 9.5, fontWeight: 700, lineHeight: 1.2 }}>{s.val}</span>
                    </div>
                    <p style={{ margin: 0, color: "rgba(255,255,255,0.38)", fontSize: 9.5 }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* ── THIS WEEK'S HIGHLIGHT ── */}
        <div style={{ ...CARD, overflow: "hidden", position: "relative" }}>
          <p style={{ margin: "0 0 10px", color: "#A78BFA", fontSize: 10.5, fontWeight: 800, letterSpacing: "1.2px", textTransform: "uppercase" }}>This Week&apos;s Highlight</p>

          <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: "0 0 8px", color: "#fff", fontSize: 22, fontWeight: 900, lineHeight: 1.2 }}>Consistency is key!</p>
              <p style={{ margin: "0 0 14px", color: "rgba(255,255,255,0.62)", fontSize: 12.5, lineHeight: 1.55 }}>
                Your child showed up every day this week. That&apos;s amazing! Small steps, big growth. 💜
              </p>
              {/* Green stat badge */}
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "rgba(16,50,26,0.6)", borderRadius: 12,
                border: "1px solid rgba(34,197,94,0.22)",
                padding: "7px 12px",
              }}>
                <span style={{ color: "#22C55E", fontSize: 18, lineHeight: 1 }}>📈</span>
                <div>
                  <p style={{ margin: 0, color: "#fff", fontSize: 12, fontWeight: 700, lineHeight: 1.3 }}>
                    Focus improved by <span style={{ color: "#22C55E" }}>12%</span>
                  </p>
                  <p style={{ margin: 0, color: "rgba(255,255,255,0.42)", fontSize: 10 }}>Compared to last week</p>
                </div>
              </div>
            </div>

            {/* Plant illustration */}
            <div style={{ flexShrink: 0, width: 94, height: 94, position: "relative" }}>
              <span style={{ position: "absolute", top: 0, right: 8, color: "#FFD700", fontSize: 8, opacity: 0.9 }}>✦</span>
              <span style={{ position: "absolute", top: 12, left: 2, color: "#FFD700", fontSize: 6, opacity: 0.7 }}>✦</span>
              <span style={{ position: "absolute", bottom: 4, right: 2, color: "#FFD700", fontSize: 10, opacity: 0.8 }}>✦</span>
              <svg width="94" height="94" viewBox="0 0 94 94">
                <defs>
                  <radialGradient id="pd-plant-glow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="rgba(120,50,200,0.55)" />
                    <stop offset="100%" stopColor="rgba(60,20,120,0)" />
                  </radialGradient>
                </defs>
                <circle cx="47" cy="52" r="38" fill="url(#pd-plant-glow)" />
                <circle cx="47" cy="52" r="36" fill="none" stroke="rgba(120,60,200,0.38)" strokeWidth="1.5" />
                {/* Soil mound */}
                <ellipse cx="47" cy="76" rx="22" ry="8" fill="#5B3A1A" />
                <ellipse cx="47" cy="74" rx="18" ry="6" fill="#7A4E2A" />
                {/* Stem */}
                <line x1="47" y1="74" x2="47" y2="40" stroke="#4CAF50" strokeWidth="3.5" strokeLinecap="round" />
                {/* Left leaf */}
                <path d="M 47 56 C 30 48 22 32 33 23 C 41 18 47 32 47 56Z" fill="#4CAF50" />
                {/* Right leaf */}
                <path d="M 47 50 C 64 40 74 26 61 18 C 52 13 47 28 47 50Z" fill="#66BB6A" />
                {/* Leaf veins */}
                <path d="M 47 56 C 38 44 34 30 35 24" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="0.9" />
                <path d="M 47 50 C 56 40 62 28 60 20" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="0.9" />
              </svg>
            </div>
          </div>
        </div>

        {/* ── Coming Tomorrow ── */}
        <div style={{
          borderRadius: 18,
          background: "rgba(16,12,42,0.9)",
          border: "1px solid rgba(90,60,160,0.28)",
          display: "flex", alignItems: "center",
          padding: "14px 14px",
          overflow: "hidden", position: "relative",
        }}>
          {/* Calendar-star icon tile */}
          <div style={{ flexShrink: 0, marginRight: 12, position: "relative" }}>
            <div style={{
              width: 54, height: 54, borderRadius: 14,
              background: "linear-gradient(145deg, #5B32C8, #3D1E99)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 28,
            }}>📅</div>
            <div style={{
              position: "absolute", top: -7, right: -7,
              width: 22, height: 22, borderRadius: "50%",
              background: "linear-gradient(135deg, #FFD700, #FF9900)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
            }}>⭐</div>
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: "0 0 2px", color: "#F59E0B", fontSize: 10, fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase" }}>Coming Tomorrow</p>
            <p style={{ margin: "0 0 3px", color: "rgba(255,255,255,0.85)", fontSize: 13, fontWeight: 400, lineHeight: 1.3 }}>New Adventure Unlocks</p>
            <p style={{ margin: 0, color: "#F59E0B", fontSize: 14, fontWeight: 400 }}>Emotional Balance Builder</p>
          </div>

          {/* Moon + cloud illustration */}
          <div style={{ flexShrink: 0, position: "relative", width: 76, height: 56 }}>
            <span style={{ position: "absolute", top: 2, left: 6, color: "#FFD700", fontSize: 9, opacity: 0.85 }}>✦</span>
            <span style={{ position: "absolute", top: 12, left: 26, color: "#FFD700", fontSize: 7, opacity: 0.7 }}>✦</span>
            <svg width="68" height="56" viewBox="0 0 68 56" style={{ position: "absolute", right: 0, top: 0 }}>
              <defs>
                <radialGradient id="ct-mg" cx="40%" cy="35%" r="60%">
                  <stop offset="0%" stopColor="#FDE68A" />
                  <stop offset="100%" stopColor="#F59E0B" />
                </radialGradient>
              </defs>
              <circle cx="46" cy="18" r="14" fill="url(#ct-mg)" />
              <circle cx="38" cy="13" r="11" fill="#0f0b2e" />
              <ellipse cx="32" cy="44" rx="22" ry="11" fill="#1a1050" />
              <ellipse cx="54" cy="46" rx="17" ry="9" fill="#1a1050" />
              <ellipse cx="14" cy="47" rx="12" ry="8" fill="#1a1050" />
            </svg>
          </div>

          <span style={{ color: "rgba(255,255,255,0.38)", fontSize: 20, flexShrink: 0, marginLeft: 2 }}>›</span>
        </div>

        {/* Spacer */}
        <div style={{ height: 82 }} />
      </div>

      {/* ── Bottom Tab Bar ── */}
      <div style={{
        flexShrink: 0, height: 74,
        background: "rgba(6,4,20,0.97)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        display: "flex", alignItems: "center",
        position: "relative",
      }}>
        {/* Home — active */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
          <div style={{
            width: 46, height: 46, borderRadius: "50%",
            background: "#7C3AED",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ fontSize: 22 }}>🏠</span>
          </div>
          <span style={{ color: "#fff", fontSize: 11, fontWeight: 800 }}>Home</span>
          <div style={{
            position: "absolute", bottom: 0, left: "calc(25% - 20px)", width: 40, height: 3,
            background: "#7C3AED", borderRadius: 2,
          }} />
        </div>

        {/* Reports — inactive */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
          <div style={{ width: 46, height: 46, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 22, opacity: 0.4 }}>📊</span>
          </div>
          <span style={{ color: "rgba(255,255,255,0.36)", fontSize: 11, fontWeight: 600 }}>Reports</span>
        </div>
      </div>

      <style>{`
        .pd-scroll::-webkit-scrollbar { display: none; }
        .pd-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes pd-twinkle { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.2;transform:scale(0.5)} }
        @keyframes pd-rocket  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
      `}</style>
    </div>
  );
}
