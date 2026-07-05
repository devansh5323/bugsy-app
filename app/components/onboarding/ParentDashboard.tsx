"use client";

import { Bobo } from "../Mascot";

const F = "var(--font-nunito), system-ui, sans-serif";

function ArcGauge({ value, max }: { value: number; max: number }) {
  const r = 40;
  const arcLen = Math.PI * r;
  const filled = (value / max) * arcLen;
  return (
    <svg width="100%" viewBox="0 0 100 54" style={{ display: "block" }}>
      <defs>
        <linearGradient id="pd-arc-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="55%" stopColor="#0EA5E9" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
      </defs>
      <path d="M 10,50 A 40,40 0 0 1 90,50" fill="none"
        stroke="rgba(255,255,255,0.08)" strokeWidth="13" strokeLinecap="round" />
      <path d="M 10,50 A 40,40 0 0 1 90,50" fill="none"
        stroke="url(#pd-arc-grad)" strokeWidth="13" strokeLinecap="round"
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

        {/* ── Header ── */}
        <div style={{ position: "relative", marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>

            {/* Bobo with sparkles */}
            <div style={{ flexShrink: 0, position: "relative", marginBottom: -8 }}>
              <span style={{ position: "absolute", top: 6, right: -4, fontSize: 18, color: "#FFD700", filter: "drop-shadow(0 0 4px rgba(255,215,0,0.8))", animation: "pd-float 2.4s ease-in-out infinite" }}>✦</span>
              <span style={{ position: "absolute", top: -6, left: 14, fontSize: 14, color: "#FFD700", filter: "drop-shadow(0 0 4px rgba(255,215,0,0.7))", animation: "pd-float 2s ease-in-out 0.5s infinite" }}>✦</span>
              <span style={{ position: "absolute", bottom: 22, left: -6, fontSize: 12, color: "#FFD700", filter: "drop-shadow(0 0 4px rgba(255,215,0,0.6))", animation: "pd-float 2.6s ease-in-out 0.9s infinite" }}>✦</span>
              <Bobo mood="happy" tint={tint} size={130} animate tailWag armsDown />
            </div>

            {/* Greeting */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, color: "#fff", fontSize: 20, fontWeight: 900, lineHeight: 1.15 }}>
                Hi, {Name}&apos;s
              </p>
              <p style={{ margin: "0 0 7px", lineHeight: 1.15 }}>
                <span style={{ color: "#A78BFA", fontSize: 22, fontWeight: 900 }}>Parent!</span>
                <span style={{ fontSize: 20 }}> 🤚</span>
              </p>
              <p style={{ margin: 0, color: "rgba(255,255,255,0.52)", fontSize: 12, lineHeight: 1.5 }}>
                Great to see you here.<br />Let&apos;s help your child grow together! 💜
              </p>
            </div>

            {/* Switch button */}
            <button onClick={onNext} style={{
              flexShrink: 0, cursor: "pointer",
              background: "rgba(18,10,50,0.85)",
              border: "1.5px solid rgba(110,70,210,0.5)",
              borderRadius: 18, padding: "12px 13px",
              display: "flex", alignItems: "center", gap: 10,
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: "50%",
                background: "linear-gradient(135deg, #6D28D9, #4C1D95)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 24, flexShrink: 0,
              }}>👦</div>
              <div style={{ textAlign: "left" }}>
                <p style={{ margin: 0, color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 600, lineHeight: 1.35 }}>Switch to</p>
                <p style={{ margin: 0, color: "#A78BFA", fontSize: 13, fontWeight: 800, lineHeight: 1.35 }}>Child Dashboard</p>
              </div>
              <span style={{ color: "rgba(255,255,255,0.45)", fontSize: 18 }}>›</span>
            </button>
          </div>

          {/* Wave divider */}
          <svg viewBox="0 0 360 36" preserveAspectRatio="none"
            style={{ display: "block", width: "calc(100% + 28px)", marginLeft: -14, marginTop: 4, height: 36 }}>
            <path d="M0,18 Q45,0 90,14 Q135,28 180,10 Q225,0 270,16 Q315,30 360,12 L360,36 L0,36 Z"
              fill="rgba(22,12,55,0.75)" />
          </svg>
        </div>

        {/* ── Daily summary bar ── */}
        <div style={{
          background: "rgba(14,9,38,0.9)",
          border: "1px solid rgba(80,50,150,0.3)",
          borderRadius: 18, padding: "12px 14px",
          display: "flex", alignItems: "center",
          marginBottom: 12, gap: 0,
        }}>
          {/* Today */}
          <div style={{ flex: 1.4, display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12, flexShrink: 0,
              background: "linear-gradient(135deg, #7C3AED, #5B21B6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20,
            }}>📅</div>
            <div style={{ minWidth: 0 }}>
              <p style={{ margin: 0, color: "#fff", fontSize: 11.5, fontWeight: 800, lineHeight: 1.25 }}>Today is a great day</p>
              <p style={{ margin: 0, color: "rgba(255,255,255,0.45)", fontSize: 10.5, lineHeight: 1.3 }}>for learning and growing!</p>
            </div>
            <span style={{ fontSize: 16, flexShrink: 0, filter: "drop-shadow(0 0 4px rgba(255,215,0,0.7))" }}>⭐</span>
          </div>

          {/* Divider */}
          <div style={{ width: 1, height: 34, background: "rgba(255,255,255,0.1)", marginInline: 10, flexShrink: 0 }} />

          {/* 10 min */}
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
            <div style={{
              width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
              background: "rgba(80,50,160,0.5)",
              border: "1.5px solid rgba(120,80,200,0.5)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 17,
            }}>🕐</div>
            <div>
              <p style={{ margin: 0, color: "#fff", fontSize: 13, fontWeight: 900, lineHeight: 1.2 }}>10 min</p>
              <p style={{ margin: 0, color: "rgba(255,255,255,0.45)", fontSize: 10, lineHeight: 1.2 }}>Daily goal</p>
            </div>
          </div>

          {/* Divider */}
          <div style={{ width: 1, height: 34, background: "rgba(255,255,255,0.1)", marginInline: 10, flexShrink: 0 }} />

          {/* Missions */}
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
            <div style={{
              width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
              background: "rgba(22,101,52,0.6)",
              border: "1.5px solid rgba(34,197,94,0.5)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16,
            }}>✅</div>
            <div>
              <p style={{ margin: 0, color: "#fff", fontSize: 13, fontWeight: 900, lineHeight: 1.2 }}>0</p>
              <p style={{ margin: 0, color: "rgba(255,255,255,0.45)", fontSize: 10, lineHeight: 1.2 }}>Missions today</p>
            </div>
          </div>
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
            flex: 1, borderRadius: 18, padding: "13px 10px",
            background: "rgba(10,7,30,0.95)",
            border: "1.5px solid rgba(80,50,160,0.35)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
              <span style={{ fontSize: 20 }}>🔥</span>
              <span style={{ color: "#fff", fontSize: 9.5, fontWeight: 800, letterSpacing: "0.5px", textTransform: "uppercase" }}>Current Streak</span>
            </div>
            <p style={{ margin: 0, color: "#FF3D8B", fontSize: 38, fontWeight: 900, lineHeight: 1 }}>7</p>
            <p style={{ margin: "2px 0 9px", color: "#FF3D8B", fontSize: 13, fontWeight: 700 }}>days</p>
            <div style={{ display: "flex", gap: 1, marginBottom: 3 }}>
              {Array.from({ length: 7 }).map((_, i) => (
                <span key={i} style={{
                  flex: 1, textAlign: "center", color: "#FF3D8B", fontSize: 14,
                  textShadow: "0 0 8px rgba(255,61,139,0.7)",
                }}>★</span>
              ))}
            </div>
            <div style={{ display: "flex", gap: 1, marginBottom: 9 }}>
              {["M","T","W","T","F","S","S"].map((d, i) => (
                <span key={i} style={{ flex: 1, textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: 8, fontWeight: 600 }}>{d}</span>
              ))}
            </div>
            <p style={{ margin: 0, color: "rgba(255,255,255,0.6)", fontSize: 10 }}>Amazing! Keep it up! 🔥</p>
          </div>

          {/* Focus Score */}
          <div style={{
            flex: 1, borderRadius: 18, padding: "13px 10px",
            background: "rgba(10,7,30,0.95)",
            border: "1.5px solid rgba(80,50,160,0.35)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
              <span style={{ fontSize: 20 }}>🎯</span>
              <span style={{ color: "#fff", fontSize: 9.5, fontWeight: 800, letterSpacing: "0.5px", textTransform: "uppercase" }}>Current Focus Score</span>
            </div>
            <ArcGauge value={78} max={100} />
            <div style={{ textAlign: "center", marginTop: -6 }}>
              <span style={{ color: "#06B6D4", fontSize: 28, fontWeight: 900 }}>78</span>
              <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, fontWeight: 600 }}> /100</span>
            </div>
            <p style={{ margin: "5px 0 7px", textAlign: "center", color: "#06B6D4", fontSize: 10.5, fontWeight: 600 }}>Above average! 🎉</p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
              <div style={{
                width: 17, height: 17, borderRadius: "50%",
                background: "#22C55E",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <span style={{ color: "#fff", fontSize: 9, fontWeight: 900, lineHeight: 1 }}>↑</span>
              </div>
              <span style={{ color: "#22C55E", fontSize: 10.5, fontWeight: 700 }}>12 pts</span>
              <span style={{ color: "rgba(255,255,255,0.42)", fontSize: 10 }}>vs last week</span>
            </div>
          </div>

          {/* Missions Completed */}
          <div style={{
            flex: 1, borderRadius: 18, padding: "13px 10px",
            background: "rgba(10,7,30,0.95)",
            border: "1.5px solid rgba(80,50,160,0.35)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
              <span style={{ fontSize: 20 }}>📋</span>
              <span style={{ color: "#fff", fontSize: 9.5, fontWeight: 800, letterSpacing: "0.5px", textTransform: "uppercase" }}>Missions Completed</span>
            </div>
            <p style={{ margin: 0, color: "#A855F7", fontSize: 38, fontWeight: 900, lineHeight: 1 }}>23</p>
            <p style={{ margin: "2px 0 9px", color: "#A855F7", fontSize: 13, fontWeight: 700 }}>missions</p>
            <p style={{ margin: 0, color: "rgba(255,255,255,0.5)", fontSize: 10.5, lineHeight: 1.5 }}>
              Total adventures<br />you&apos;ve completed
            </p>
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
