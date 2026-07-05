"use client";

import { Bobo } from "../Mascot";

const F = "var(--font-nunito), system-ui, sans-serif";

function ArcGauge({ value, max }: { value: number; max: number }) {
  const r = 42;
  const arcLen = Math.PI * r;
  const filled = (value / max) * arcLen;
  return (
    <svg width="100%" viewBox="0 0 100 56" style={{ display: "block" }}>
      <defs>
        <linearGradient id="pd-arc-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
      </defs>
      <path d="M 8,50 A 42,42 0 0 1 92,50" fill="none"
        stroke="rgba(255,255,255,0.09)" strokeWidth="10" strokeLinecap="round" />
      <path d="M 8,50 A 42,42 0 0 1 92,50" fill="none"
        stroke="url(#pd-arc-grad)" strokeWidth="10" strokeLinecap="round"
        strokeDasharray={`${filled.toFixed(1)} ${(arcLen + 20).toFixed(1)}`} />
    </svg>
  );
}

export function ParentDashboard({
  tint,
  childName,
  onNext,
}: {
  tint: number;
  childName?: string;
  onNext: () => void;
}) {
  const name = (childName?.trim() || "your child");
  const Name = name.charAt(0).toUpperCase() + name.slice(1);

  const CARD: React.CSSProperties = {
    background: "rgba(16,12,42,0.85)",
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

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
            <div style={{ flexShrink: 0 }}>
              <Bobo mood="happy" tint={tint} size={70} animate={false} armsDown />
            </div>
            <div>
              <p style={{ margin: 0, color: "#fff", fontSize: 19, fontWeight: 900, lineHeight: 1.1 }}>
                Hi, {Name}&apos;s Parent! 🤚
              </p>
              <p style={{ margin: "4px 0 0", color: "rgba(255,255,255,0.55)", fontSize: 12, lineHeight: 1.4 }}>
                Great to see you here.<br />Let&apos;s help {Name} grow together! 💜
              </p>
            </div>
          </div>
          {/* Switch to child */}
          <button onClick={onNext} style={{
            flexShrink: 0, cursor: "pointer",
            background: "rgba(70,40,140,0.5)",
            border: "1px solid rgba(120,80,220,0.35)",
            borderRadius: 16, padding: "10px 11px",
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "linear-gradient(135deg, #5B32B8, #3D1E8A)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 19,
            }}>👧</div>
            <div>
              <p style={{ margin: 0, color: "rgba(255,255,255,0.8)", fontSize: 11.5, fontWeight: 700, lineHeight: 1.25 }}>Switch to</p>
              <p style={{ margin: 0, color: "rgba(255,255,255,0.8)", fontSize: 11.5, fontWeight: 700, lineHeight: 1.25 }}>Child Dashboard</p>
            </div>
            <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 18 }}>›</span>
          </button>
        </div>

        {/* ── TODAY'S HIGHLIGHT ── */}
        <div style={{
          ...CARD,
          border: "1.5px solid rgba(200,155,0,0.38)",
          boxShadow: "0 0 28px rgba(180,130,0,0.1)",
          padding: "16px 14px",
          overflow: "hidden", position: "relative",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
            <span style={{ fontSize: 15 }}>⭐</span>
            <span style={{
              color: "rgba(255,255,255,0.5)", fontSize: 10.5, fontWeight: 700,
              letterSpacing: "0.9px", textTransform: "uppercase",
            }}>TODAY&apos;S HIGHLIGHT.</span>
          </div>

          <div style={{ display: "flex", alignItems: "flex-end" }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: "0 0 7px", color: "#FFD700", fontSize: 25, fontWeight: 900, lineHeight: 1.1 }}>
                Consistency Hero!
              </p>
              <p style={{ margin: "0 0 12px", color: "rgba(255,255,255,0.62)", fontSize: 12.5, lineHeight: 1.5 }}>
                {Name} showed up every day this week. That&apos;s the magic! 💜
              </p>
              {/* Sub-card */}
              <div style={{
                background: "rgba(160,30,70,0.2)", borderRadius: 12,
                border: "1px solid rgba(220,60,100,0.25)",
                padding: "8px 11px",
                display: "flex", alignItems: "center", gap: 9,
              }}>
                <div style={{
                  width: 30, height: 30, borderRadius: 9, flexShrink: 0,
                  background: "linear-gradient(135deg, #D63068, #A0204A)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 14,
                }}>⭐</div>
                <div>
                  <p style={{ margin: 0, color: "#fff", fontSize: 12.5, fontWeight: 700 }}>
                    Focus improved by <span style={{ color: "#FF7A35" }}>15%</span>
                  </p>
                  <p style={{ margin: "2px 0 0", color: "rgba(255,255,255,0.48)", fontSize: 11 }}>Great progress!</p>
                </div>
              </div>
            </div>

            {/* Bobo with stars */}
            <div style={{ flexShrink: 0, position: "relative", marginBottom: -14, marginRight: -6, marginLeft: 6 }}>
              <span style={{
                position: "absolute", top: -8, left: "30%",
                fontSize: 20, animation: "pd-float 2.3s ease-in-out infinite",
              }}>⭐</span>
              <span style={{
                position: "absolute", top: 14, right: -6,
                fontSize: 15, animation: "pd-float 2.1s ease-in-out 0.6s infinite",
              }}>✦</span>
              <span style={{
                position: "absolute", bottom: 26, right: -2,
                fontSize: 18, animation: "pd-float 2.5s ease-in-out 1s infinite",
              }}>⭐</span>
              <span style={{
                position: "absolute", bottom: 20, left: -10,
                fontSize: 14, animation: "pd-float 2.0s ease-in-out 0.4s infinite",
              }}>✦</span>
              <Bobo mood="excited" tint={tint} size={130} animate tailWag armsDown />
            </div>
          </div>
        </div>

        {/* ── TODAY'S JOURNEY ── */}
        <div style={{ ...CARD, padding: "16px 14px" }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <span style={{ fontSize: 15 }}>🚀</span>
              <span style={{
                color: "rgba(255,255,255,0.5)", fontSize: 10.5, fontWeight: 700,
                letterSpacing: "0.9px", textTransform: "uppercase",
              }}>TODAY&apos;S JOURNEY.</span>
            </div>
            <div style={{
              width: 26, height: 26, borderRadius: "50%",
              border: "1.5px solid rgba(255,255,255,0.22)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "rgba(255,255,255,0.45)", fontSize: 13, fontStyle: "italic",
              fontFamily: "Georgia, serif",
            }}>i</div>
          </div>

          {/* Content row */}
          <div style={{ display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 14 }}>
            {/* Circular scene */}
            <div style={{
              width: 92, height: 92, flexShrink: 0, borderRadius: "50%",
              background: "radial-gradient(ellipse at 40% 35%, #1C1450 0%, #07051A 100%)",
              border: "2px solid rgba(90,60,180,0.4)",
              overflow: "hidden", position: "relative",
            }}>
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0, height: 22,
                background: "linear-gradient(180deg, #1A3D18 0%, #0D2210 100%)",
              }} />
              <div style={{ position: "absolute", bottom: 6, left: 2 }}>
                <Bobo mood="happy" tint={tint} size={54} animate={false} armsDown />
              </div>
              <div style={{
                position: "absolute", bottom: 8, right: 4,
                fontSize: 34, lineHeight: 1,
                filter: "drop-shadow(0 0 8px rgba(255,220,0,0.9))",
                animation: "pd-float 2.2s ease-in-out infinite",
              }}>⭐</div>
            </div>

            {/* Details */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: "0 0 5px", color: "#fff", fontSize: 18, fontWeight: 900, lineHeight: 1.2 }}>
                Focus Explorer
              </p>
              <p style={{ margin: "0 0 12px", color: "rgba(255,255,255,0.52)", fontSize: 12, lineHeight: 1.45 }}>
                Help Fumi collect all the stars by staying focused!
              </p>
              {/* Stats row */}
              <div style={{ display: "flex" }}>
                {[
                  { icon: "🕐", val: "10 min", label: "Est. Time" },
                  { icon: "🎯", val: "Not Started", label: "Status" },
                  { icon: "⭐", val: "Collect 5 stars", label: "Goal" },
                ].map((s, i) => (
                  <div key={i} style={{
                    flex: 1,
                    borderLeft: i > 0 ? "1px solid rgba(255,255,255,0.1)" : "none",
                    paddingLeft: i > 0 ? 7 : 0,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 3, marginBottom: 2 }}>
                      <span style={{ fontSize: 12 }}>{s.icon}</span>
                      <span style={{ color: "#fff", fontSize: 10.5, fontWeight: 700, lineHeight: 1.2 }}>{s.val}</span>
                    </div>
                    <p style={{ margin: 0, color: "rgba(255,255,255,0.38)", fontSize: 9.5, fontWeight: 600 }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* ── 3 Stat Cards ── */}
        <div style={{ display: "flex", gap: 8, marginBottom: 11, alignItems: "stretch" }}>

          {/* Streak */}
          <div style={{
            flex: 1, background: "rgba(16,12,42,0.85)", borderRadius: 16,
            border: "1px solid rgba(90,60,160,0.28)", padding: "13px 10px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 8 }}>
              <span style={{ fontSize: 18 }}>🔥</span>
              <span style={{ color: "rgba(255,255,255,0.48)", fontSize: 9.5, fontWeight: 700, lineHeight: 1.2 }}>
                Current<br />Streak
              </span>
            </div>
            <p style={{ margin: 0, color: "#FF4D8F", fontSize: 34, fontWeight: 900, lineHeight: 1 }}>7</p>
            <p style={{ margin: "1px 0 6px", color: "#FF4D8F", fontSize: 12, fontWeight: 700 }}>days</p>
            <div style={{ display: "flex", gap: 1, marginBottom: 3 }}>
              {Array.from({ length: 7 }).map((_, i) => (
                <span key={i} style={{ flex: 1, textAlign: "center", color: "#FF4D8F", fontSize: 13 }}>★</span>
              ))}
            </div>
            <div style={{ display: "flex", gap: 1, marginBottom: 6 }}>
              {["M","T","W","T","F","S","S"].map((d, i) => (
                <span key={i} style={{ flex: 1, textAlign: "center", color: "rgba(255,255,255,0.38)", fontSize: 8, fontWeight: 600 }}>{d}</span>
              ))}
            </div>
            <p style={{ margin: 0, color: "rgba(255,255,255,0.48)", fontSize: 9.5 }}>Amazing! Keep it up! 🔥</p>
          </div>

          {/* Focus Score */}
          <div style={{
            flex: 1, background: "rgba(16,12,42,0.85)", borderRadius: 16,
            border: "1px solid rgba(90,60,160,0.28)", padding: "13px 10px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 6 }}>
              <span style={{ fontSize: 18 }}>🎯</span>
              <span style={{ color: "rgba(255,255,255,0.48)", fontSize: 9.5, fontWeight: 700, lineHeight: 1.2 }}>
                Current<br />Focus Score
              </span>
            </div>
            <ArcGauge value={78} max={100} />
            <div style={{ textAlign: "center", marginTop: -2 }}>
              <span style={{ color: "#06B6D4", fontSize: 24, fontWeight: 900 }}>78</span>
              <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>/100</span>
            </div>
            <p style={{ margin: "3px 0 2px", textAlign: "center", color: "rgba(255,255,255,0.55)", fontSize: 9.5, fontWeight: 600 }}>Above average! 🎉</p>
            <p style={{ margin: 0, textAlign: "center", color: "#4ADE80", fontSize: 9.5, fontWeight: 700 }}>↑ 12 pts vs last week</p>
          </div>

          {/* Missions */}
          <div style={{
            flex: 1, background: "rgba(16,12,42,0.85)", borderRadius: 16,
            border: "1px solid rgba(90,60,160,0.28)", padding: "13px 10px",
            position: "relative", overflow: "hidden",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 8 }}>
              <span style={{ fontSize: 18 }}>📋</span>
              <span style={{ color: "rgba(255,255,255,0.48)", fontSize: 9.5, fontWeight: 700, lineHeight: 1.2 }}>
                Missions<br />Completed
              </span>
            </div>
            <p style={{ margin: 0, color: "#9B59E8", fontSize: 34, fontWeight: 900, lineHeight: 1 }}>23</p>
            <p style={{ margin: "1px 0 4px", color: "#9B59E8", fontSize: 12, fontWeight: 700 }}>missions</p>
            <p style={{ margin: 0, color: "rgba(255,255,255,0.38)", fontSize: 9.5, lineHeight: 1.35 }}>
              Total adventures you&apos;ve completed
            </p>
            <div style={{ position: "absolute", bottom: -10, right: -6, opacity: 0.72 }}>
              <Bobo mood="happy" tint={tint} size={54} animate={false} armsDown />
            </div>
          </div>
        </div>

        {/* ── Coming Tomorrow ── */}
        <div style={{
          ...CARD,
          display: "flex", alignItems: "center", gap: 12,
          padding: "13px 14px",
        }}>
          {/* Calendar icon with star badge */}
          <div style={{ position: "relative", flexShrink: 0 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14,
              background: "linear-gradient(135deg, #7C3AED, #5420B0)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 26,
            }}>📅</div>
            <div style={{
              position: "absolute", top: -7, right: -7,
              width: 22, height: 22, borderRadius: "50%",
              background: "linear-gradient(135deg, #FFD700, #FF9900)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, boxShadow: "0 2px 6px rgba(0,0,0,0.35)",
            }}>⭐</div>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: "0 0 2px", color: "#A78BFA", fontSize: 13, fontWeight: 800 }}>Coming Tomorrow</p>
            <p style={{ margin: "0 0 2px", color: "rgba(255,255,255,0.5)", fontSize: 11.5 }}>Fumi unlocks a new skill:</p>
            <p style={{ margin: 0, color: "#FFD700", fontSize: 13, fontWeight: 800 }}>Calm Breathing</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
            <span style={{ fontSize: 18 }}>⭐</span>
            <span style={{ color: "rgba(255,255,255,0.45)", fontSize: 20 }}>›</span>
          </div>
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
        @keyframes pd-float   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
      `}</style>
    </div>
  );
}
