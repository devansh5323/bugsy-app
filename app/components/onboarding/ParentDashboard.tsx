"use client";

import { Bobo } from "../Mascot";

const F = "var(--font-nunito), system-ui, sans-serif";

function ArcGauge({ value, max }: { value: number; max: number }) {
  const r = 44;
  const arcLen = Math.PI * r;
  const filled = (value / max) * arcLen;
  return (
    <svg width="100%" viewBox="0 0 104 60" style={{ display: "block" }}>
      <defs>
        <linearGradient id="pd-arc-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
      </defs>
      <path d="M 8,52 A 44,44 0 0 1 96,52" fill="none" stroke="rgba(255,255,255,0.12)"
        strokeWidth="9" strokeLinecap="round" />
      <path d="M 8,52 A 44,44 0 0 1 96,52" fill="none" stroke="url(#pd-arc-grad)"
        strokeWidth="9" strokeLinecap="round"
        strokeDasharray={`${filled.toFixed(1)} ${(arcLen - filled + 20).toFixed(1)}`} />
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
  return (
    <div style={{
      position: "absolute", inset: 0,
      background: "linear-gradient(160deg, #0C0927 0%, #100D2E 55%, #0D0A26 100%)",
      display: "flex", flexDirection: "column",
      fontFamily: F,
    }}>

      {/* Background stars */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
        {([
          [8,12],[25,4],[42,18],[60,7],[78,14],[92,3],
          [15,35],[30,28],[55,40],[70,25],[88,32],
          [5,55],[20,62],[38,50],[62,58],[80,45],[95,60],
          [12,75],[28,80],[50,72],[68,82],[85,70],
          [3,88],[22,92],[44,85],[66,90],[83,86],
        ] as [number,number][]).map(([l, t], i) => (
          <div key={i} style={{
            position: "absolute",
            left: `${l}%`, top: `${t}%`,
            width: i % 4 === 0 ? 3 : 1.5,
            height: i % 4 === 0 ? 3 : 1.5,
            borderRadius: "50%",
            background: i % 5 === 0 ? "rgba(200,160,255,0.6)" : "rgba(255,255,255,0.42)",
            animation: `pd-twinkle ${1.5 + (i % 3) * 0.7}s ease-in-out ${(i * 0.28) % 2}s infinite`,
          }} />
        ))}
      </div>

      {/* Scrollable content */}
      <div className="pd-scroll" style={{
        flex: 1, overflowY: "auto", overflowX: "hidden",
        padding: "52px 14px 0",
        position: "relative", zIndex: 1,
      }}>

        {/* ── Header ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 0 }}>
            <div style={{ flexShrink: 0 }}>
              <Bobo mood="happy" tint={tint} size={62} animate={false} />
            </div>
            <div>
              <p style={{ margin: 0, color: "#fff", fontSize: 20, fontWeight: 900, lineHeight: 1.1 }}>
                Hi Parent! 👋
              </p>
              <p style={{ margin: "3px 0 0", color: "rgba(255,255,255,0.58)", fontSize: 11.5, fontWeight: 500, lineHeight: 1.35 }}>
                Great to see you here. Let&apos;s help<br />your child grow together! 💜
              </p>
            </div>
          </div>

          {/* Switch to Child Dashboard */}
          <button onClick={onNext} style={{
            flexShrink: 0, cursor: "pointer",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 14, padding: "8px 10px",
            display: "flex", alignItems: "center", gap: 6,
          }}>
            <div style={{
              width: 30, height: 30, borderRadius: "50%",
              background: "linear-gradient(135deg, #a78bfa, #7c3aed)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 15,
            }}>👧</div>
            <div style={{ textAlign: "left" }}>
              <p style={{ margin: 0, color: "rgba(255,255,255,0.65)", fontSize: 10, fontWeight: 700 }}>Switch to</p>
              <p style={{ margin: 0, color: "#a78bfa", fontSize: 10, fontWeight: 700 }}>Child Dashboard</p>
            </div>
            <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 14 }}>›</span>
          </button>
        </div>

        {/* ── 3 Stat Cards ── */}
        <div style={{ display: "flex", gap: 8, marginBottom: 12, alignItems: "stretch" }}>

          {/* Card 1: Current Streak */}
          <div style={{
            flex: 1, background: "rgba(255,255,255,0.05)", borderRadius: 16,
            border: "1px solid rgba(255,255,255,0.09)", padding: "12px 10px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 8 }}>
              <span style={{ fontSize: 16 }}>🔥</span>
              <span style={{ color: "rgba(255,255,255,0.48)", fontSize: 9.5, fontWeight: 700, lineHeight: 1.2 }}>Current<br/>Streak</span>
            </div>
            <p style={{ margin: 0, color: "#FF7A35", fontSize: 28, fontWeight: 900, lineHeight: 1 }}>7</p>
            <p style={{ margin: "1px 0 3px", color: "rgba(255,255,255,0.48)", fontSize: 9.5, fontWeight: 600 }}>days</p>
            <p style={{ margin: "0 0 6px", color: "rgba(255,255,255,0.42)", fontSize: 8.5, lineHeight: 1.3 }}>Amazing! Keep it up!</p>
            <div style={{ display: "flex", gap: 1 }}>
              {["M","T","W","T","F","S","S"].map((d, i) => (
                <div key={i} style={{ flex: 1, textAlign: "center" }}>
                  <div style={{ color: "#FF6B9D", fontSize: 10, lineHeight: 1 }}>★</div>
                  <div style={{ color: "rgba(255,255,255,0.38)", fontSize: 7, fontWeight: 600 }}>{d}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Missions Completed */}
          <div style={{
            flex: 1, background: "rgba(255,255,255,0.05)", borderRadius: 16,
            border: "1px solid rgba(255,255,255,0.09)", padding: "12px 10px",
            position: "relative", overflow: "hidden",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 8 }}>
              <span style={{ fontSize: 16 }}>📋</span>
              <span style={{ color: "rgba(255,255,255,0.48)", fontSize: 9.5, fontWeight: 700, lineHeight: 1.2 }}>Missions<br/>Completed</span>
            </div>
            <p style={{ margin: 0, color: "#A78BFA", fontSize: 28, fontWeight: 900, lineHeight: 1 }}>23</p>
            <p style={{ margin: "1px 0 3px", color: "rgba(255,255,255,0.48)", fontSize: 9.5, fontWeight: 600 }}>missions</p>
            <p style={{ margin: 0, color: "rgba(255,255,255,0.36)", fontSize: 8.5, lineHeight: 1.3 }}>Total adventures you&apos;ve completed</p>
            <div style={{ position: "absolute", bottom: -10, right: -8, opacity: 0.6 }}>
              <Bobo mood="happy" tint={tint} size={52} animate={false} />
            </div>
          </div>

          {/* Card 3: Current Focus Score */}
          <div style={{
            flex: 1, background: "rgba(255,255,255,0.05)", borderRadius: 16,
            border: "1px solid rgba(255,255,255,0.09)", padding: "12px 10px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 6 }}>
              <span style={{ fontSize: 16 }}>🎯</span>
              <span style={{ color: "rgba(255,255,255,0.48)", fontSize: 9.5, fontWeight: 700, lineHeight: 1.2 }}>Current<br/>Focus Score</span>
            </div>
            <ArcGauge value={78} max={100} />
            <p style={{ margin: "-2px 0 0", textAlign: "center", color: "#fff", fontSize: 15, fontWeight: 900, lineHeight: 1 }}>
              78<span style={{ color: "rgba(255,255,255,0.4)", fontSize: 10 }}>/100</span>
            </p>
            <p style={{ margin: "3px 0 1px", textAlign: "center", color: "rgba(255,255,255,0.48)", fontSize: 8.5, fontWeight: 600 }}>Awesome focus!</p>
            <p style={{ margin: 0, textAlign: "center", color: "#4ADE80", fontSize: 8, fontWeight: 700 }}>↑ 12 pts vs last week</p>
          </div>
        </div>

        {/* ── This Week's Highlight ── */}
        <div style={{
          background: "rgba(255,255,255,0.04)", borderRadius: 18,
          border: "1px solid rgba(255,210,0,0.14)",
          padding: "16px 14px 8px",
          marginBottom: 12,
          position: "relative", overflow: "hidden",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
            <span style={{ fontSize: 17 }}>⭐</span>
            <span style={{ color: "rgba(255,255,255,0.62)", fontSize: 13, fontWeight: 700 }}>This Week&apos;s Highlight</span>
          </div>

          <div style={{ display: "flex", alignItems: "flex-end" }}>
            <div style={{ flex: 1, marginRight: 8 }}>
              <p style={{ margin: "0 0 7px", color: "#FFD700", fontSize: 24, fontWeight: 900, lineHeight: 1.1 }}>
                Consistency Hero!
              </p>
              <p style={{ margin: "0 0 10px", color: "rgba(255,255,255,0.58)", fontSize: 12, lineHeight: 1.5 }}>
                Your child showed up every day this week. That&apos;s the magic! 💜
              </p>
              {/* Sub-card */}
              <div style={{
                background: "rgba(255,100,150,0.1)", borderRadius: 10,
                border: "1px solid rgba(255,100,150,0.18)",
                padding: "7px 11px",
                display: "flex", alignItems: "center", gap: 8,
              }}>
                <span style={{ fontSize: 15, flexShrink: 0 }}>⭐</span>
                <div>
                  <p style={{ margin: 0, color: "#fff", fontSize: 12, fontWeight: 700 }}>
                    Focus improved by <span style={{ color: "#FF7A35" }}>15%</span>
                  </p>
                  <p style={{ margin: "2px 0 0", color: "rgba(255,255,255,0.48)", fontSize: 10.5 }}>Great progress!</p>
                </div>
              </div>
            </div>

            {/* Celebrating cat with star decorations */}
            <div style={{ flexShrink: 0, position: "relative", marginBottom: -8, marginRight: -6 }}>
              <span style={{
                position: "absolute", top: -10, left: "40%",
                fontSize: 16, animation: "pd-float 2.4s ease-in-out infinite",
              }}>⭐</span>
              <span style={{
                position: "absolute", top: 8, right: -4,
                fontSize: 13, animation: "pd-float 2s ease-in-out 0.5s infinite",
              }}>✨</span>
              <span style={{
                position: "absolute", bottom: 28, left: -8,
                fontSize: 13, animation: "pd-float 2.2s ease-in-out 0.9s infinite",
              }}>⭐</span>
              <Bobo mood="excited" tint={tint} size={110} animate tailWag />
            </div>
          </div>
        </div>

        {/* ── Today's Mission ── */}
        <div style={{
          background: "rgba(255,255,255,0.04)", borderRadius: 18,
          border: "1px solid rgba(255,255,255,0.08)",
          padding: "16px 14px",
          marginBottom: 14,
        }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <span style={{ fontSize: 17 }}>🚀</span>
              <span style={{ color: "#fff", fontSize: 14, fontWeight: 800 }}>Today&apos;s Mission</span>
            </div>
            <div style={{
              background: "rgba(255,255,255,0.07)", borderRadius: 20,
              padding: "4px 10px", display: "flex", alignItems: "center", gap: 4,
              border: "1px solid rgba(255,255,255,0.08)",
            }}>
              <span style={{ fontSize: 11 }}>⏱</span>
              <span style={{ color: "rgba(255,255,255,0.62)", fontSize: 11, fontWeight: 700 }}>10 min</span>
            </div>
          </div>

          <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
            {/* Circular mission image */}
            <div style={{
              width: 78, height: 78, flexShrink: 0, borderRadius: "50%",
              background: "linear-gradient(135deg, #180E40 0%, #291660 100%)",
              border: "2.5px solid rgba(167,139,250,0.38)",
              overflow: "hidden", position: "relative",
              display: "flex", alignItems: "flex-end", justifyContent: "center",
            }}>
              <div style={{ marginBottom: -10 }}>
                <Bobo mood="happy" tint={tint} size={66} animate={false} />
              </div>
              <span style={{ position: "absolute", top: 6, right: 8, fontSize: 16 }}>⭐</span>
            </div>

            {/* Mission details */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: "0 0 4px", color: "#fff", fontSize: 15.5, fontWeight: 900, lineHeight: 1.2 }}>
                Focus Explorer
              </p>
              <p style={{ margin: "0 0 10px", color: "rgba(255,255,255,0.48)", fontSize: 11.5, lineHeight: 1.4 }}>
                Help Fumi collect all the stars by staying focused!
              </p>

              <p style={{ margin: "0 0 5px", color: "rgba(255,255,255,0.38)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.4px" }}>Rewards</p>
              <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                <div style={{
                  background: "rgba(255,200,0,0.09)", borderRadius: 8,
                  padding: "4px 9px", display: "flex", alignItems: "center", gap: 4,
                  border: "1px solid rgba(255,200,0,0.14)",
                }}>
                  <span style={{ fontSize: 11 }}>⭐</span>
                  <span style={{ color: "#FFD700", fontSize: 11, fontWeight: 700 }}>+20 XP</span>
                </div>
                <div style={{
                  background: "rgba(100,200,255,0.09)", borderRadius: 8,
                  padding: "4px 9px", display: "flex", alignItems: "center", gap: 4,
                  border: "1px solid rgba(100,200,255,0.14)",
                }}>
                  <span style={{ fontSize: 11 }}>💎</span>
                  <span style={{ color: "#7DD3FC", fontSize: 11, fontWeight: 700 }}>+1 Gem</span>
                </div>
              </div>

              <button onClick={onNext} style={{
                width: "100%", height: 44, borderRadius: 22,
                background: "linear-gradient(180deg, #9D6FE8 0%, #7C3AED 100%)",
                border: "none", cursor: "pointer",
                fontFamily: F, fontSize: 14, fontWeight: 800, color: "#fff",
                boxShadow: "0 4px 0 #5B21B6, 0 8px 20px rgba(109,40,217,0.38)",
                touchAction: "manipulation",
              }}>
                Start Mission
              </button>
            </div>
          </div>
        </div>

        {/* Spacer for tab bar */}
        <div style={{ height: 80 }} />
      </div>

      {/* ── Bottom Tab Bar ── */}
      <div style={{
        flexShrink: 0, height: 72,
        background: "rgba(8,6,26,0.96)",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        display: "flex", alignItems: "center",
      }}>
        {/* Home — active */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
          <div style={{
            width: 44, height: 44, borderRadius: "50%",
            background: "rgba(124,58,237,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ fontSize: 20 }}>🏠</span>
          </div>
          <span style={{ color: "#A78BFA", fontSize: 10.5, fontWeight: 700 }}>Home</span>
        </div>

        {/* Reports — inactive */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
          <div style={{
            width: 44, height: 44, borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ fontSize: 20, opacity: 0.45 }}>📊</span>
          </div>
          <span style={{ color: "rgba(255,255,255,0.36)", fontSize: 10.5, fontWeight: 600 }}>Reports</span>
        </div>
      </div>

      <style>{`
        .pd-scroll::-webkit-scrollbar { display: none; }
        @keyframes pd-twinkle { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.22;transform:scale(0.6)} }
        @keyframes pd-float   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
      `}</style>
    </div>
  );
}
