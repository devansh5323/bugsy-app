"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

const F = "var(--font-nunito), system-ui, sans-serif";
const PURPLE = "#7C3AED";

// ── Small line-icon glyphs — purple-on-lavender, matching the reference. ──

function BarChartIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="4" y="12" width="4" height="8" rx="1.2" fill={PURPLE} />
      <rect x="10" y="7" width="4" height="13" rx="1.2" fill={PURPLE} />
      <rect x="16" y="3" width="4" height="17" rx="1.2" fill={PURPLE} opacity="0.55" />
    </svg>
  );
}

function FilledHeartIcon({ size = 20, color = "#DC2626" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 20.5s-8-4.9-8-11A4.8 4.8 0 0 1 12 6.2 4.8 4.8 0 0 1 20 9.5c0 6.1-8 11-8 11Z" fill={color} />
    </svg>
  );
}


function PeopleIcon({ size = 20, color = PURPLE }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="8" r="3" stroke={color} strokeWidth="1.7" />
      <circle cx="16" cy="9" r="2.6" stroke={color} strokeWidth="1.7" />
      <path d="M3 20c0-3.5 2.7-6 6-6s6 2.5 6 6" stroke={color} strokeWidth="1.7" strokeLinecap="round" fill="none" />
      <path d="M14.5 14.2c2.5.3 4.5 2.4 4.5 5.3" stroke={color} strokeWidth="1.7" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function TargetRingIcon({ size = 20, color = PURPLE }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.8" />
      <circle cx="12" cy="12" r="5.2" stroke={color} strokeWidth="1.8" />
      <circle cx="12" cy="12" r="1.8" fill={color} />
    </svg>
  );
}

function StarIcon({ size = 16, color = "#16A34A" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2l2.9 6.3 6.9.7-5.2 4.6 1.6 6.8L12 16.9 5.8 20.4l1.6-6.8L2.2 9l6.9-.7L12 2Z" fill={color} />
    </svg>
  );
}

function BellIcon({ size = 20, color = "#fff" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 3a6 6 0 0 0-6 6v3.5c0 .6-.2 1.2-.6 1.7L4 16.5c-.5.6-.1 1.5.7 1.5h14.6c.8 0 1.2-.9.7-1.5l-1.4-2.3c-.4-.5-.6-1.1-.6-1.7V9a6 6 0 0 0-6-6Z"
        stroke={color} strokeWidth="1.7" strokeLinejoin="round" fill="none" />
      <path d="M9.5 20a2.5 2.5 0 0 0 5 0" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function CalendarPillIcon({ size = 16, color = "#fff" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="5" width="18" height="16" rx="2.5" stroke={color} strokeWidth="1.7" />
      <path d="M7 3v4M17 3v4M3 9.5h18" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

// ── Daily Life Impact glyphs — simple purple line icons, matching the
// reference's lavender-circle icon style used throughout the report. ──

function OpenBookIcon({ size = 20, color = PURPLE }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 5C10 3.5 6 3 3 4v14c3-1 7-.5 9 1 2-1.5 6-2 9-1V4c-3-1-7-.5-9 1Z" stroke={color} strokeWidth="1.6" strokeLinejoin="round" fill="none" />
      <path d="M12 5v14" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function MountainFlagIcon({ size = 20, color = PURPLE }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M3 20 9 8l4 6 2-3 6 9Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" fill="none" />
      <path d="M9 8V3M9 3l4 1.5L9 6" stroke={color} strokeWidth="1.4" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function PhoneIcon({ size = 20, color = PURPLE }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="7" y="2" width="10" height="20" rx="2.5" stroke={color} strokeWidth="1.6" />
      <path d="M11 19h2" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function CalendarClockIcon({ size = 20, color = PURPLE }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="4.5" width="14" height="15" rx="2" stroke={color} strokeWidth="1.5" />
      <path d="M6 2.5v4M14 2.5v4M3 9h14" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="17.5" cy="16" r="5" fill="#fff" stroke={color} strokeWidth="1.5" />
      <path d="M17.5 13.3v2.7l1.8 1" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function RunningPersonIcon({ size = 20, color = PURPLE }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="14" cy="4" r="2" fill={color} />
      <path d="M9 21l2-5 2 1 3 4M13 16l-2-4 3-3 3 2 3-1M11 12L8 10l-3 1"
        stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function ChatBubblesIcon({ size = 20, color = PURPLE }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M3 5.5A2.5 2.5 0 0 1 5.5 3h7A2.5 2.5 0 0 1 15 5.5v4A2.5 2.5 0 0 1 12.5 12H8l-3 2.5V12h-.5A2.5 2.5 0 0 1 2 9.5v-4Z"
        stroke={color} strokeWidth="1.4" strokeLinejoin="round" fill="#fff" />
      <path d="M13 9h6a2 2 0 0 1 2 2v3.5a2 2 0 0 1-2 2h-.5V19l-2.7-2.5H13a2 2 0 0 1-2-2V11a2 2 0 0 1 2-2Z"
        stroke={color} strokeWidth="1.4" strokeLinejoin="round" fill="#fff" />
    </svg>
  );
}

function CheckSquareIcon({ size = 20, color = PURPLE }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke={color} strokeWidth="1.8" />
      <path d="M7.5 12.5l3 3 6-6.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function SproutIcon({ size = 20, color = PURPLE }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 21v-9" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 12c0-4 3-6 7-6 0 4-3 6-7 6Z" fill={color} />
      <path d="M12 15c0-3.4-2.6-5.2-6-5.2 0 3.4 2.6 5.2 6 5.2Z" fill={color} opacity="0.7" />
    </svg>
  );
}

function BrainIcon({ size = 20, color = PURPLE }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M9 4a3 3 0 0 0-3 3c-1.7.3-3 1.8-3 3.6 0 1.3.7 2.4 1.7 3-.1.3-.1.6-.1.9 0 2.2 1.8 4 4 4h.5V4H9Z" fill={color} opacity="0.85" />
      <path d="M15 4a3 3 0 0 1 3 3c1.7.3 3 1.8 3 3.6 0 1.3-.7 2.4-1.7 3 .1.3.1.6.1.9 0 2.2-1.8 4-4 4h-.5V4h.1Z" fill={color} opacity="0.6" />
      <circle cx="7.2" cy="10" r="0.9" fill="#fff" />
      <circle cx="16.8" cy="10" r="0.9" fill="#fff" />
    </svg>
  );
}

function MiniGauge({ percent, color, track = "#EDE7FE", size = 52 }: { percent: number; color: string; track?: string; size?: number }) {
  const R = 20;
  const C = 2 * Math.PI * R;
  const offset = C * (1 - percent / 100);
  return (
    <svg width={size} height={size} viewBox="0 0 52 52">
      <circle cx="26" cy="26" r={R} fill="none" stroke={track} strokeWidth="5" />
      <circle
        cx="26" cy="26" r={R} fill="none" stroke={color} strokeWidth="5" strokeLinecap="round"
        strokeDasharray={C} strokeDashoffset={offset} transform="rotate(-90 26 26)"
      />
      <text x="26" y="30" textAnchor="middle" fontSize="11" fontWeight="900" fill="#1E1B3A" fontFamily={F}>{percent}%</text>
    </svg>
  );
}

// ── Icons + donut chart used only by card 01's special "Attention
// Profile" detail page (matches its reference design exactly). ──────────

function EyeGlyph({ size = 20, color = PURPLE }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12Z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" fill="none" />
      <circle cx="12" cy="12" r="3" fill={color} />
    </svg>
  );
}

function TrophyGlyph({ size = 20, color = PURPLE }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M7 4h10v5a5 5 0 0 1-10 0V4Z" fill={color} />
      <path d="M7 5H4a3 3 0 0 0 3 4.5M17 5h3a3 3 0 0 1-3 4.5" stroke={color} strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <rect x="10.5" y="14" width="3" height="4" fill={color} />
      <rect x="7.5" y="18" width="9" height="2.4" rx="1.2" fill={color} />
    </svg>
  );
}

function RefreshGlyph({ size = 20, color = PURPLE }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M4 12a8 8 0 0 1 13.66-5.66L20 8" stroke={color} strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M20 4v4h-4" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M20 12a8 8 0 0 1-13.66 5.66L4 16" stroke={color} strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M4 20v-4h4" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function EarGlyph({ size = 20, color = PURPLE }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M8 14c-1-3 0-6 3-8 3.5-2.3 8-.6 9 3.3 1 4-1.5 7-4.5 7.7-1.6.4-2.5-.6-2.5-1.8v-2.7c0-1.4-1-2.5-2.4-2.6-1.5-.1-2.6 1.3-2.1 2.7l.5 1.4"
        stroke={color} strokeWidth="1.7" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function FunnelGlyph({ size = 20, color = PURPLE }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M4 5h16l-6.5 9v6h-3v-6Z" fill={color} />
    </svg>
  );
}

function LightningGlyph({ size = 20, color = PURPLE }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M13 2 4 14h6l-1 8 9-12h-6Z" fill={color} />
    </svg>
  );
}

function GridGlyph({ size = 20, color = PURPLE }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="8" height="8" rx="1.5" fill={color} />
      <rect x="13" y="3" width="8" height="8" rx="1.5" fill={color} />
      <rect x="3" y="13" width="8" height="8" rx="1.5" fill={color} />
      <rect x="13" y="13" width="8" height="8" rx="1.5" fill={color} />
    </svg>
  );
}

const SUBDOMAIN_STATUS_STYLE = {
  Strong:          { bg: "#DCFCE7", text: "#16A34A", ring: "#16A34A" },
  Developed:       { bg: "#DCFCE7", text: "#16A34A", ring: "#4ADE80" },
  Emerging:        { bg: "#FEF3C7", text: "#D97706", ring: "#F59E0B" },
  "Needs Support": { bg: "#FEE2E2", text: "#DC2626", ring: "#EF4444" },
} as const;

const ATTENTION_SUBDOMAINS = [
  { key: "visual",    label: "Visual Attention",     score: 82, status: "Strong" as const,        Icon: EyeGlyph },
  { key: "auditory",  label: "Auditory Attention",   score: 60, status: "Developed" as const,     Icon: EarGlyph },
  { key: "sustained", label: "Sustained Attention",  score: 78, status: "Developed" as const,     Icon: TargetRingIcon },
  { key: "selective", label: "Selective Attention",  score: 50, status: "Emerging" as const,      Icon: FunnelGlyph },
  { key: "impulse",   label: "Impulse Control",      score: 45, status: "Emerging" as const,      Icon: LightningGlyph },
  { key: "shifting",  label: "Attention Shifting",   score: 30, status: "Emerging" as const,      Icon: RefreshGlyph },
  { key: "divided",   label: "Divided Attention",    score: 48, status: "Emerging" as const,      Icon: GridGlyph },
  { key: "emotional", label: "Emotional Regulation", score: 25, status: "Needs Support" as const, Icon: FilledHeartIcon },
];

// Donut chart — 8 equal wedges around a ring, icon+score inside each
// wedge, domain label outside connected by a short tick line.
function AttentionDonutChart({ domains }: { domains: typeof ATTENTION_SUBDOMAINS }) {
  const CX = 150, CY = 150, OUTER = 100, INNER = 52, LABEL_R = 132;
  const n = domains.length;
  const wedgeAngle = 360 / n;

  const toXY = (angleDeg: number, r: number) => {
    const rad = (angleDeg * Math.PI) / 180;
    return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) };
  };

  return (
    <svg viewBox="0 0 300 300" width="100%" style={{ display: "block", overflow: "visible" }}>
      {domains.map((d, i) => {
        const start = -90 + i * wedgeAngle;
        const end = start + wedgeAngle;
        const st = SUBDOMAIN_STATUS_STYLE[d.status];
        const p0 = toXY(start, OUTER);
        const p1 = toXY(end, OUTER);
        const p2 = toXY(end, INNER);
        const p3 = toXY(start, INNER);
        const path = `M ${p0.x} ${p0.y} A ${OUTER} ${OUTER} 0 0 1 ${p1.x} ${p1.y} L ${p2.x} ${p2.y} A ${INNER} ${INNER} 0 0 0 ${p3.x} ${p3.y} Z`;
        const mid = start + wedgeAngle / 2;
        const iconPos = toXY(mid, (OUTER + INNER) / 2);
        const labelPos = toXY(mid, LABEL_R);
        const tickOuter = toXY(mid, OUTER + 3);
        const tickInner = toXY(mid, OUTER + 12);
        return (
          <g key={d.key}>
            <path d={path} fill={st.ring} stroke="#fff" strokeWidth="2" />
            <foreignObject x={iconPos.x - 20} y={iconPos.y - 22} width={40} height={44}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                <d.Icon size={15} color="#fff" />
                <span style={{ fontFamily: F, fontSize: 11.5, fontWeight: 900, color: "#fff" }}>{d.score}%</span>
              </div>
            </foreignObject>
            <line x1={tickOuter.x} y1={tickOuter.y} x2={tickInner.x} y2={tickInner.y} stroke="#D1D5DB" strokeWidth="1" />
            <foreignObject x={labelPos.x - 40} y={labelPos.y - 18} width={80} height={36}>
              <div style={{
                width: "100%", height: "100%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: F, fontSize: 10, fontWeight: 700, color: "#4B5563",
                textAlign: "center", lineHeight: 1.25,
              }}>
                {d.label}
              </div>
            </foreignObject>
          </g>
        );
      })}
      <circle cx={CX} cy={CY} r={INNER - 2} fill="#fff" />
    </svg>
  );
}

function AttentionProfileContent({ name }: { name: string }) {
  const STRENGTH_ITEMS = [
    { label: "Visual Attention", desc: "Notices details easily · Spots patterns · Follows visual cues · Looks carefully before responding", Icon: EyeGlyph },
    { label: "Sustained Attention", desc: "Completes structured activities · Creates clear goals · Returns after distraction", Icon: TargetRingIcon },
  ];
  const FOCUS_ITEMS = [
    { label: "Attention Switching", desc: "Takes time to shift tasks · does not adapt to new rules", Icon: RefreshGlyph },
    { label: "Emotional regulation", desc: "Needs help calming · Takes time to recover · Reacts strongly to frustration", Icon: FilledHeartIcon },
  ];

  return (
    <>
      <p style={{ margin: "0 0 6px", fontFamily: F, fontSize: 22, fontWeight: 800, color: "#0F2419" }}>
        How is {name}&apos;s focus shaping up?
      </p>
      <p style={{ margin: "0 0 22px", fontFamily: F, fontSize: 13, fontWeight: 500, color: "#7B7F8C" }}>
        8 core attention domains analyzed
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 }}>
        <div style={{ background: "#F0FDF4", border: "1px solid #DCF3E3", borderRadius: 18, padding: "16px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <div style={{ flexShrink: 0, width: 40, height: 40, borderRadius: "50%", background: "#DCFCE7", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <TrophyGlyph size={20} color="#16A34A" />
            </div>
            <span style={{ fontFamily: F, fontSize: 17, fontWeight: 800, color: "#16A34A" }}>Strengths</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {STRENGTH_ITEMS.map((item, i) => (
              <div key={item.label} style={{ display: "flex", gap: 12, padding: "12px 0", borderTop: i > 0 ? "1px solid rgba(22,163,74,0.15)" : "none" }}>
                <div style={{ flexShrink: 0, width: 40, height: 40, borderRadius: "50%", background: "#DCFCE7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <item.Icon size={19} color="#16A34A" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: "0 0 3px", fontFamily: F, fontSize: 14, fontWeight: 800, color: "#1E1B3A" }}>{item.label}</p>
                  <p style={{ margin: 0, fontFamily: F, fontSize: 12, fontWeight: 500, color: "#5B6472", lineHeight: 1.5 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "#FFF7ED", border: "1px solid #FED7AA", borderRadius: 18, padding: "16px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <div style={{ flexShrink: 0, width: 40, height: 40, borderRadius: "50%", background: "#FEE9D6", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <MountainFlagIcon size={20} color="#EA580C" />
            </div>
            <span style={{ fontFamily: F, fontSize: 17, fontWeight: 800, color: "#EA580C" }}>Focus Areas</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {FOCUS_ITEMS.map((item, i) => (
              <div key={item.label} style={{ display: "flex", gap: 12, padding: "12px 0", borderTop: i > 0 ? "1px solid rgba(234,88,12,0.15)" : "none" }}>
                <div style={{ flexShrink: 0, width: 40, height: 40, borderRadius: "50%", background: "#FEE9D6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <item.Icon size={19} color="#EA580C" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: "0 0 3px", fontFamily: F, fontSize: 14, fontWeight: 800, color: "#1E1B3A" }}>{item.label}</p>
                  <p style={{ margin: 0, fontFamily: F, fontSize: 12, fontWeight: 500, color: "#5B6472", lineHeight: 1.5 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12, background: "#F0FDF4", border: "1px solid #DCF3E3", borderRadius: 18, padding: "16px 16px" }}>
          <div style={{ flexShrink: 0, width: 36, height: 36, borderRadius: "50%", background: "#DCFCE7", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <FilledHeartIcon size={17} color="#16A34A" />
          </div>
          <p style={{ margin: 0, fontFamily: F, fontSize: 13, fontWeight: 500, color: "#1E1B3A", lineHeight: 1.55 }}>
            Every child grows at their own pace. With Fumi's missions, {name} can continue to strengthen these skills.
          </p>
        </div>
      </div>

      <p style={{ margin: "0 0 12px", fontFamily: F, fontSize: 16, fontWeight: 800, color: "#1E1B3A" }}>
        Attention Profile
      </p>

      <div style={{ background: "#fff", border: "1px solid #EEF0F4", borderRadius: 18, padding: "16px 12px", marginBottom: 12 }}>
        <AttentionDonutChart domains={ATTENTION_SUBDOMAINS} />

        <div style={{ display: "flex", flexDirection: "column", marginTop: 8 }}>
          {ATTENTION_SUBDOMAINS.map((d, i) => {
            const st = SUBDOMAIN_STATUS_STYLE[d.status];
            return (
              <div key={d.key} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 2px", borderTop: i > 0 ? "1px solid #EEF0F4" : "none" }}>
                <span style={{ flexShrink: 0, width: 8, height: 8, borderRadius: "50%", background: st.ring }} />
                <span style={{ flex: 1, minWidth: 0, fontFamily: F, fontSize: 13, fontWeight: 700, color: "#1E1B3A" }}>{d.label}</span>
                <span style={{ flexShrink: 0, fontFamily: F, fontSize: 11, fontWeight: 700, color: st.text, background: st.bg, borderRadius: 999, padding: "4px 11px" }}>
                  {d.status}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {(["Strong", "Developed", "Emerging", "Needs Support"] as const).map((s) => {
          const st = SUBDOMAIN_STATUS_STYLE[s];
          const range = s === "Strong" ? "80-100%" : s === "Developed" ? "60-79%" : s === "Emerging" ? "30-59%" : "0-29%";
          return (
            <div key={s} style={{ flex: "1 1 45%", border: "1px solid #EEF0F4", borderRadius: 14, padding: "10px 12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                <span style={{ flexShrink: 0, width: 8, height: 8, borderRadius: "50%", background: st.ring }} />
                <span style={{ fontFamily: F, fontSize: 12, fontWeight: 800, color: "#1E1B3A" }}>{s}</span>
              </div>
              <span style={{ fontFamily: F, fontSize: 11, fontWeight: 500, color: "#8A8FA3" }}>{range}</span>
            </div>
          );
        })}
      </div>
    </>
  );
}

// Illustrated child avatar for the report header — dark tousled hair,
// blue hoodie, warm skin tone, soft blue gradient backdrop.
function ChildAvatarGlyph({ size = 86 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block" }}>
      <defs>
        <radialGradient id="cag-bg" cx="0.35" cy="0.3" r="0.9">
          <stop offset="0%" stopColor="#DCEBFF" />
          <stop offset="100%" stopColor="#6C9CE0" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="50" fill="url(#cag-bg)" />
      {/* hoodie / shoulders */}
      <path d="M14 100 C14 80 30 72 50 72 C70 72 86 80 86 100 Z" fill="#3454C9" />
      <path d="M40 76 Q50 84 60 76 L58 92 Q50 98 42 92 Z" fill="#2A44AE" />
      {/* neck */}
      <rect x="43" y="62" width="14" height="14" rx="6" fill="#D89A6A" />
      {/* ears */}
      <circle cx="27" cy="54" r="4.5" fill="#D89A6A" />
      <circle cx="73" cy="54" r="4.5" fill="#D89A6A" />
      {/* face */}
      <ellipse cx="50" cy="50" rx="20" ry="22" fill="#E4AC79" />
      {/* hair */}
      <path d="M28 46 C26 26 34 14 50 14 C66 14 74 26 72 46 C70 38 64 34 64 34 C60 40 54 32 50 32 C46 32 40 40 36 34 C36 34 30 38 28 46 Z" fill="#1D2333" />
      <path d="M30 40 C30 36 33 33 33 33 M70 40 C70 36 67 33 67 33" stroke="#1D2333" strokeWidth="3" strokeLinecap="round" fill="none" />
      {/* eyebrows */}
      <path d="M39 44 Q43 41 47 43" stroke="#1D2333" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M53 43 Q57 41 61 44" stroke="#1D2333" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      {/* eyes */}
      <ellipse cx="43" cy="49" rx="2.6" ry="3.2" fill="#1D2333" />
      <ellipse cx="57" cy="49" rx="2.6" ry="3.2" fill="#1D2333" />
      <circle cx="44" cy="47.5" r="0.8" fill="#fff" />
      <circle cx="58" cy="47.5" r="0.8" fill="#fff" />
      {/* cheeks */}
      <ellipse cx="38" cy="56" rx="3.5" ry="2.2" fill="#E8836B" opacity="0.35" />
      <ellipse cx="62" cy="56" rx="3.5" ry="2.2" fill="#E8836B" opacity="0.35" />
      {/* nose */}
      <path d="M49 51 Q48 55 50 56" stroke="#C4875A" strokeWidth="1.4" strokeLinecap="round" fill="none" />
      {/* smile */}
      <path d="M44 59 Q50 63.5 56 59" stroke="#8A4B2E" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function AttentionReportScreen({
  childName,
  childAge,
  onHome,
  onProfile,
}: {
  childName?: string;
  childAge?: number | null;
  onHome: () => void;
  onProfile?: () => void;
}) {
  const name = childName?.trim() || "Your child";

  const TOPICS: { label: string; Icon: (p: { size?: number; color?: string }) => React.ReactElement }[] = [
    { label: `How is ${name}'s focus shaping up?`, Icon: TargetRingIcon },
    { label: `Understand ${name}'s learning patterns.`, Icon: BarChartIcon },
    { label: `${name}'s ability to follow through on tasks.`, Icon: CheckSquareIcon },
    { label: `How does ${name} handle challenges?`, Icon: MountainFlagIcon },
    { label: `How does ${name} regulate screen habits?`, Icon: PhoneIcon },
    { label: `Look into ${name}'s emotional intelligence.`, Icon: FilledHeartIcon },
    { label: `Can ${name} independently follow routines?`, Icon: CalendarClockIcon },
    { label: `${name} in social situations.`, Icon: PeopleIcon },
    { label: `${name}'s ability to maintain friends and relationships.`, Icon: PeopleIcon },
    { label: `Dive into ${name}'s impulse control ability.`, Icon: RunningPersonIcon },
    { label: `Understand ${name}'s communication style.`, Icon: ChatBubblesIcon },
    { label: `How ${name} shows leadership and responsibility.`, Icon: StarIcon },
  ];

  // These topics unlock as more assessment data is collected: learning
  // patterns, follow-through on tasks, handling challenges, following
  // routines independently, and impulse control.
  const LOCKED_INDICES = new Set([1, 2, 3, 6, 9]);

  // Display order for the grid — unlocked topics first (in their original
  // order), locked topics pushed to the end (also in their original order).
  const TOPIC_ORDER = TOPICS.map((_, i) => i).sort(
    (a, b) => Number(LOCKED_INDICES.has(a)) - Number(LOCKED_INDICES.has(b))
  );

  // Category theming — each topic belongs to one of these three groupings,
  // which colors its label, section cards, and accent throughout the page.
  const CATEGORY_STYLE = {
    attention: { label: "Attention Profile", color: "#7C3AED", sectionBg: "#F5F3FF", sectionBorder: "#E4D9FC", iconBg: "#EDE7FE", Icon: TargetRingIcon },
    skills: { label: "Skills in Everyday Life", color: "#16A34A", sectionBg: "#F0FDF4", sectionBorder: "#DCF3E3", iconBg: "#DCFCE7", Icon: SproutIcon },
    academic: { label: "Academic Performance", color: "#2563EB", sectionBg: "#EFF6FF", sectionBorder: "#DBEAFE", iconBg: "#DBEAFE", Icon: OpenBookIcon },
  } as const;

  // Status theming — every card is colored by its status tier, not its
  // category: Strong (green), Developed (blue), Emerging (orange),
  // Needs Support (red).
  const STATUS_STYLE = {
    Strong:          { color: "#16A34A", bg: "#DCFCE7", cardBg: "#F0FDF4", cardBorder: "#DCF3E3", iconBg: "#DCFCE7", pillIcon: "★" },
    Developed:       { color: "#2563EB", bg: "#DBEAFE", cardBg: "#EFF6FF", cardBorder: "#DBEAFE", iconBg: "#DBEAFE", pillIcon: "↗" },
    Emerging:        { color: "#D97706", bg: "#FEF3C7", cardBg: "#FFF7ED", cardBorder: "#FED7AA", iconBg: "#FFEDD5", pillIcon: "↗" },
    "Needs Support": { color: "#DC2626", bg: "#FEE2E2", cardBg: "#FEF2F2", cardBorder: "#FECACA", iconBg: "#FEE2E2", pillIcon: "↓" },
  } as const;

  // Rich, fully-worked-out detail content for every card — matches the
  // reference design's structure exactly (category, status, two explainer
  // sections, a scored breakdown, and Fumi's support ideas).
  const DETAILS: {
    categoryKey: keyof typeof CATEGORY_STYLE;
    status: keyof typeof STATUS_STYLE;
    section1: { title: string; desc: string };
    section2: { title: string; desc: string };
    breakdown: { title: string; desc: string; score: number; status: string; statusColor: string; statusBg: string; ring: string; skills: string[] }[];
    support: { icon: string; label: string }[];
  }[] = [
    {
      categoryKey: "attention", status: "Strong",
      section1: { title: "How this relates to attention", desc: `Focus reflects ${name}'s ability to concentrate on a task, notice details, and stay engaged without drifting off. This area looks at how ${name} sustains attention across different activities.` },
      section2: { title: "Patterns we are noticing", desc: `${name} focuses well during hands-on or highly engaging tasks. Attention dips more during longer, repetitive, or less interesting activities.` },
      breakdown: [
        { title: "Stays on task during activities", desc: `${name} keeps working on an activity for a good stretch before needing a break.`, score: 72, status: "Developed", statusColor: "#16A34A", statusBg: "#DCFCE7", ring: "#16A34A", skills: ["Sustained attention", "Task persistence"] },
        { title: "Notices details easily", desc: `${name} spots small details and patterns without needing extra prompting.`, score: 68, status: "Developed", statusColor: "#16A34A", statusBg: "#DCFCE7", ring: "#16A34A", skills: ["Visual attention", "Pattern recognition"] },
        { title: "Returns to task after distraction", desc: `${name} may need a nudge to get back on track after something pulls attention away.`, score: 55, status: "Emerging", statusColor: "#D97706", statusBg: "#FEF3C7", ring: "#F59E0B", skills: ["Self-monitoring", "Attention shifting"] },
      ],
      support: [{ icon: "⏱️", label: "Focus Timers" }, { icon: "🎯", label: "Goal Missions" }, { icon: "🧩", label: "Engaging Tasks" }, { icon: "🔄", label: "Refocus Cues" }],
    },
    {
      categoryKey: "attention", status: "Developed",
      section1: { title: "How this relates to attention", desc: "Your child's ability to listen, follow classroom expectations, and stay engaged during school activities." },
      section2: { title: "Patterns we are noticing", desc: `${name} tends to learn best through hands-on, visual activities, and benefits from information broken into smaller, clear steps.` },
      breakdown: [
        { title: "Understands visual instructions", desc: `${name} follows along well when instructions are shown, not just spoken.`, score: 74, status: "Developed", statusColor: "#16A34A", statusBg: "#DCFCE7", ring: "#16A34A", skills: ["Visual processing", "Comprehension"] },
        { title: "Retains information over time", desc: `${name} remembers what was learned after some time has passed.`, score: 60, status: "Developed", statusColor: "#16A34A", statusBg: "#DCFCE7", ring: "#16A34A", skills: ["Working memory", "Recall"] },
        { title: "Adapts to new teaching styles", desc: `${name} may need extra time adjusting when a new way of teaching is introduced.`, score: 48, status: "Emerging", statusColor: "#D97706", statusBg: "#FEF3C7", ring: "#F59E0B", skills: ["Flexibility", "Adaptation"] },
      ],
      support: [{ icon: "🖼️", label: "Visual Guides" }, { icon: "🔁", label: "Repeat & Recall" }, { icon: "📚", label: "Step-by-step Tasks" }, { icon: "🎨", label: "Hands-on Missions" }],
    },
    {
      categoryKey: "attention", status: "Emerging",
      section1: { title: "How this relates to attention", desc: "Your child's persistence to finish homework, assignments, classwork, and exams." },
      section2: { title: "Patterns we are noticing", desc: `${name} starts tasks eagerly but may need reminders or encouragement to complete longer or multi-step activities.` },
      breakdown: [
        { title: "Starts tasks independently", desc: `${name} gets going on a task without much prompting.`, score: 66, status: "Developed", statusColor: "#16A34A", statusBg: "#DCFCE7", ring: "#16A34A", skills: ["Initiative", "Motivation"] },
        { title: "Completes multi-step tasks", desc: `${name} may lose track partway through tasks with several steps.`, score: 42, status: "Emerging", statusColor: "#D97706", statusBg: "#FEF3C7", ring: "#F59E0B", skills: ["Planning", "Working memory"] },
        { title: "Finishes without reminders", desc: `${name} often needs a prompt to return to and finish a task.`, score: 38, status: "Emerging", statusColor: "#D97706", statusBg: "#FEF3C7", ring: "#F59E0B", skills: ["Self-monitoring", "Persistence"] },
      ],
      support: [{ icon: "✅", label: "Checklist Missions" }, { icon: "⏳", label: "Timed Challenges" }, { icon: "🏁", label: "Finish-line Rewards" }, { icon: "🔔", label: "Gentle Reminders" }],
    },
    {
      categoryKey: "skills", status: "Emerging",
      section1: { title: "How this relates to attention", desc: "Solve problems, cope with setbacks, and make choices independently." },
      section2: { title: "Patterns we are noticing", desc: `${name} is willing to try again with encouragement, but may need support staying calm through the first moment of frustration.` },
      breakdown: [
        { title: "Tries a different approach after failing", desc: `${name} can be encouraged to try again in a new way.`, score: 50, status: "Emerging", statusColor: "#D97706", statusBg: "#FEF3C7", ring: "#F59E0B", skills: ["Problem-solving", "Flexibility"] },
        { title: "Stays calm when things go wrong", desc: `${name} may need help managing the first reaction to a setback.`, score: 40, status: "Emerging", statusColor: "#D97706", statusBg: "#FEF3C7", ring: "#F59E0B", skills: ["Emotional regulation", "Coping"] },
        { title: "Asks for help when stuck", desc: `${name} is willing to reach out for support when needed.`, score: 58, status: "Emerging", statusColor: "#D97706", statusBg: "#FEF3C7", ring: "#F59E0B", skills: ["Self-advocacy", "Communication"] },
      ],
      support: [{ icon: "🧗", label: "Try-again Missions" }, { icon: "🧠", label: "Problem-solving Games" }, { icon: "🤝", label: "Ask-for-help Cues" }, { icon: "🌈", label: "Calm-down Tools" }],
    },
    {
      categoryKey: "skills", status: "Emerging",
      section1: { title: "How this relates to attention", desc: "How your child manages or limits screen use when needed." },
      section2: { title: "Patterns we are noticing", desc: `${name} enjoys screen time and follows agreed limits with reminders, though endings can still bring some pushback.` },
      breakdown: [
        { title: "Follows agreed screen-time limits", desc: `${name} sticks to limits when they're set clearly in advance.`, score: 55, status: "Emerging", statusColor: "#D97706", statusBg: "#FEF3C7", ring: "#F59E0B", skills: ["Self-monitoring", "Rule-following"] },
        { title: "Transitions away calmly", desc: `${name} may protest a little when screen time ends.`, score: 41, status: "Emerging", statusColor: "#D97706", statusBg: "#FEF3C7", ring: "#F59E0B", skills: ["Impulse control", "Emotional regulation"] },
        { title: "Chooses other activities independently", desc: `${name} can be encouraged to pick another activity after screens.`, score: 47, status: "Emerging", statusColor: "#D97706", statusBg: "#FEF3C7", ring: "#F59E0B", skills: ["Initiative", "Self-regulation"] },
      ],
      support: [{ icon: "⏰", label: "Screen Timers" }, { icon: "🔄", label: "Wind-down Missions" }, { icon: "🧸", label: "Offline Play Ideas" }, { icon: "⭐", label: "Reward Charts" }],
    },
    {
      categoryKey: "skills", status: "Emerging",
      section1: { title: "How this relates to attention", desc: "How your child expresses emotions, and copes with anger, worry or emotional overwhelm." },
      section2: { title: "Patterns we are noticing", desc: `${name} is beginning to recognize emotions, especially when calm or supported. In the moment, ${name} may still need help slowing down, using calming tools, and recovering after frustration.` },
      breakdown: [
        { title: "Names feelings when supported", desc: `${name} may be able to identify how they feel when given time, simple choices, or emotion words.`, score: 64, status: "Developed", statusColor: "#16A34A", statusBg: "#DCFCE7", ring: "#16A34A", skills: ["Emotional regulation", "Self-awareness"] },
        { title: "Uses calming tools when upset", desc: `${name} may need reminders to use a calming strategy when feeling frustrated, worried, disappointed, or overstimulated.`, score: 46, status: "Emerging", statusColor: "#D97706", statusBg: "#FEF3C7", ring: "#F59E0B", skills: ["Emotional regulation", "Frustration tolerance"] },
        { title: "Settles after excitement or overload", desc: `${name} may take time to settle after excitement, a difficult task, a mistake, or a sudden change in routine.`, score: 44, status: "Emerging", statusColor: "#D97706", statusBg: "#FEF3C7", ring: "#F59E0B", skills: ["Emotional regulation", "Inhibition / impulse control"] },
      ],
      support: [{ icon: "🧸", label: "Cuddle missions" }, { icon: "🌬️", label: "Breathing tasks" }, { icon: "✋", label: "Tactile care" }, { icon: "🚩", label: "Try-again missions" }],
    },
    {
      categoryKey: "skills", status: "Developed",
      section1: { title: "How this relates to attention", desc: "Following everyday routines such as getting ready, organizing belongings, starting homework, or preparing for the next day." },
      section2: { title: "Patterns we are noticing", desc: `${name} follows familiar routines well and is beginning to manage them with less supervision.` },
      breakdown: [
        { title: "Follows morning and bedtime routines", desc: `${name} moves through familiar routines with little prompting.`, score: 70, status: "Developed", statusColor: "#16A34A", statusBg: "#DCFCE7", ring: "#16A34A", skills: ["Sequencing", "Memory"] },
        { title: "Manages routines with fewer reminders", desc: `${name} is starting to need fewer check-ins along the way.`, score: 58, status: "Emerging", statusColor: "#D97706", statusBg: "#FEF3C7", ring: "#F59E0B", skills: ["Independence", "Self-monitoring"] },
        { title: "Adapts routines when they change", desc: `${name} may need extra support when a routine changes unexpectedly.`, score: 45, status: "Emerging", statusColor: "#D97706", statusBg: "#FEF3C7", ring: "#F59E0B", skills: ["Flexibility", "Adaptation"] },
      ],
      support: [{ icon: "📋", label: "Routine Charts" }, { icon: "⏱️", label: "Step Timers" }, { icon: "🌟", label: "Independence Badges" }, { icon: "🔔", label: "Visual Reminders" }],
    },
    {
      categoryKey: "skills", status: "Strong",
      section1: { title: "How this relates to attention", desc: "Understanding social rules, boundaries, and appropriate behavior." },
      section2: { title: "Patterns we are noticing", desc: `${name} generally follows social norms well and adjusts behavior when guided, especially in familiar settings.` },
      breakdown: [
        { title: "Follows social rules and boundaries", desc: `${name} respects personal space and takes turns well.`, score: 78, status: "Developed", statusColor: "#16A34A", statusBg: "#DCFCE7", ring: "#16A34A", skills: ["Social awareness", "Self-regulation"] },
        { title: "Adjusts behavior to the setting", desc: `${name} shifts behavior appropriately between settings like home and school.`, score: 65, status: "Developed", statusColor: "#16A34A", statusBg: "#DCFCE7", ring: "#16A34A", skills: ["Flexibility", "Observation"] },
        { title: "Reads unfamiliar social cues", desc: `${name} may need help interpreting cues in new social situations.`, score: 50, status: "Emerging", statusColor: "#D97706", statusBg: "#FEF3C7", ring: "#F59E0B", skills: ["Social perception", "Interpretation"] },
      ],
      support: [{ icon: "🎭", label: "Role-play Missions" }, { icon: "👀", label: "Cue-spotting Games" }, { icon: "🤝", label: "Practice Playdates" }, { icon: "💬", label: "Social Scripts" }],
    },
    {
      categoryKey: "skills", status: "Developed",
      section1: { title: "How this relates to attention", desc: "How your child connects with peers, handles disagreements, and maintains friendships." },
      section2: { title: "Patterns we are noticing", desc: `${name} makes friends easily and enjoys playing with others, with some support needed when disagreements come up.` },
      breakdown: [
        { title: "Initiates play with peers", desc: `${name} approaches other children and starts play with confidence.`, score: 75, status: "Developed", statusColor: "#16A34A", statusBg: "#DCFCE7", ring: "#16A34A", skills: ["Initiative", "Social confidence"] },
        { title: "Maintains ongoing friendships", desc: `${name} keeps friendships going over time.`, score: 68, status: "Developed", statusColor: "#16A34A", statusBg: "#DCFCE7", ring: "#16A34A", skills: ["Relationship building", "Consistency"] },
        { title: "Resolves disagreements calmly", desc: `${name} may need support working through disagreements without escalation.`, score: 47, status: "Emerging", statusColor: "#D97706", statusBg: "#FEF3C7", ring: "#F59E0B", skills: ["Conflict resolution", "Emotional regulation"] },
      ],
      support: [{ icon: "🧩", label: "Team Missions" }, { icon: "🤗", label: "Friendship Badges" }, { icon: "🕊️", label: "Peace-making Cards" }, { icon: "🎲", label: "Turn-taking Games" }],
    },
    {
      categoryKey: "attention", status: "Needs Support",
      section1: { title: "How this relates to attention", desc: "Managing restlessness, movement, interrupting others, or acting before thinking." },
      section2: { title: "Patterns we are noticing", desc: `${name} shows growing self-control in calm settings, but may act before thinking when excited, rushed, or overstimulated.` },
      breakdown: [
        { title: "Waits for their turn", desc: `${name} manages waiting reasonably well with a little support.`, score: 52, status: "Emerging", statusColor: "#D97706", statusBg: "#FEF3C7", ring: "#F59E0B", skills: ["Impulse control", "Patience"] },
        { title: "Pauses before reacting", desc: `${name} may react quickly before considering other options.`, score: 44, status: "Emerging", statusColor: "#D97706", statusBg: "#FEF3C7", ring: "#F59E0B", skills: ["Self-regulation", "Reflection"] },
        { title: "Manages excitement in the moment", desc: `${name} may need help settling down when very excited.`, score: 40, status: "Emerging", statusColor: "#D97706", statusBg: "#FEF3C7", ring: "#F59E0B", skills: ["Emotional regulation", "Self-control"] },
      ],
      support: [{ icon: "🛑", label: "Stop & Think Cues" }, { icon: "🎲", label: "Turn-taking Missions" }, { icon: "🧘", label: "Calm-body Breaks" }, { icon: "⭐", label: "Patience Rewards" }],
    },
    {
      categoryKey: "skills", status: "Developed",
      section1: { title: "How this relates to attention", desc: "How your child shares thoughts, feelings, and ideas clearly with others." },
      section2: { title: "Patterns we are noticing", desc: `${name} communicates ideas well in comfortable settings, and is developing confidence expressing feelings more clearly.` },
      breakdown: [
        { title: "Expresses thoughts clearly", desc: `${name} shares ideas in a way that's easy to follow.`, score: 70, status: "Developed", statusColor: "#16A34A", statusBg: "#DCFCE7", ring: "#16A34A", skills: ["Verbal expression", "Vocabulary"] },
        { title: "Shares feelings with others", desc: `${name} is building confidence talking about feelings.`, score: 55, status: "Emerging", statusColor: "#D97706", statusBg: "#FEF3C7", ring: "#F59E0B", skills: ["Emotional expression", "Trust"] },
        { title: "Listens and responds in conversation", desc: `${name} follows conversations and responds appropriately.`, score: 62, status: "Developed", statusColor: "#16A34A", statusBg: "#DCFCE7", ring: "#16A34A", skills: ["Active listening", "Turn-taking"] },
      ],
      support: [{ icon: "💬", label: "Talk-time Missions" }, { icon: "📖", label: "Feelings Vocabulary" }, { icon: "👂", label: "Listening Games" }, { icon: "🎤", label: "Share-your-day Prompts" }],
    },
    {
      categoryKey: "skills", status: "Developed",
      section1: { title: "How this relates to attention", desc: "Taking responsibility, contributing ideas, and stepping up in group activities." },
      section2: { title: "Patterns we are noticing", desc: `${name} enjoys contributing ideas and is building confidence taking ownership of tasks and small responsibilities.` },
      breakdown: [
        { title: "Contributes ideas in group activities", desc: `${name} offers suggestions during group tasks.`, score: 66, status: "Developed", statusColor: "#16A34A", statusBg: "#DCFCE7", ring: "#16A34A", skills: ["Collaboration", "Confidence"] },
        { title: "Takes responsibility for tasks", desc: `${name} is building consistency following through on assigned roles.`, score: 58, status: "Emerging", statusColor: "#D97706", statusBg: "#FEF3C7", ring: "#F59E0B", skills: ["Ownership", "Follow-through"] },
        { title: "Encourages others", desc: `${name} is starting to notice and support other children.`, score: 50, status: "Emerging", statusColor: "#D97706", statusBg: "#FEF3C7", ring: "#F59E0B", skills: ["Empathy", "Social leadership"] },
      ],
      support: [{ icon: "🌟", label: "Helper Missions" }, { icon: "📋", label: "Responsibility Charts" }, { icon: "🗣️", label: "Idea-sharing Circles" }, { icon: "🏆", label: "Leadership Badges" }],
    },
  ];

  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [flipped, setFlipped] = useState(false);
  const [prevOpenIdx, setPrevOpenIdx] = useState<number | null>(null);
  const activeTopic = openIdx !== null ? TOPICS[openIdx] : null;

  // Reset to the un-flipped front face whenever a (new) card opens or the
  // page closes — adjusting state during render, per React's guidance, so
  // the reset is synchronous with the openIdx change rather than trailing
  // a render behind (which is what triggered the lint error before).
  if (openIdx !== prevOpenIdx) {
    setPrevOpenIdx(openIdx);
    setFlipped(false);
  }

  // Show the front face first, then flip to the content side a beat later —
  // so the rotation is actually visible instead of the content just
  // appearing mid-spin.
  useEffect(() => {
    if (openIdx === null) return;
    const t = setTimeout(() => setFlipped(true), 380);
    return () => clearTimeout(t);
  }, [openIdx]);

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", background: "#fff" }}>

      {/* ── Header ── */}
      <div style={{
        flexShrink: 0, position: "relative", overflow: "visible",
        background: "linear-gradient(135deg, #0B0A1F 0%, #241B5C 55%, #3B2E82 100%)",
        padding: "56px 18px 30px",
      }}>
        {/* sparkles */}
        <span style={{ position: "absolute", top: 26, left: "22%", color: "rgba(255,255,255,0.7)", fontSize: 14 }}>✦</span>
        <span style={{ position: "absolute", top: 74, left: "58%", color: "rgba(255,255,255,0.5)", fontSize: 10 }}>✦</span>
        <span style={{ position: "absolute", top: 18, left: "80%", color: "rgba(255,255,255,0.45)", fontSize: 11 }}>✦</span>

        {/* notification bell */}
        <div style={{
          position: "absolute", top: 18, right: 18, width: 38, height: 38, borderRadius: "50%",
          background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <BellIcon size={17} />
          <span style={{
            position: "absolute", top: 5, right: 6, width: 8, height: 8, borderRadius: "50%",
            background: "#A78BFA", border: "1.5px solid #14122B",
          }} />
        </div>

        {/* wavy bottom decoration */}
        <svg width="100%" height="42" viewBox="0 0 400 42" preserveAspectRatio="none" style={{ position: "absolute", left: 0, right: 0, bottom: 0, display: "block" }}>
          <path d="M0 22 Q50 6 100 20 T200 18 T300 24 T400 14 V42 H0 Z" fill="rgba(139,124,246,0.16)" />
          <path d="M0 30 Q60 14 120 28 T240 26 T360 30 T400 24 V42 H0 Z" fill="rgba(139,124,246,0.10)" />
        </svg>

        <div style={{ display: "flex", gap: 16, position: "relative", zIndex: 1 }}>
          <div style={{ flexShrink: 0, position: "relative", width: 94, height: 94 }}>
            <div style={{ position: "absolute", inset: -6, borderRadius: "50%", border: "1.5px solid rgba(167,139,250,0.5)" }} />
            <div style={{
              position: "absolute", inset: 0, borderRadius: "50%",
              border: "3px solid rgba(255,255,255,0.85)",
              boxShadow: "0 4px 18px rgba(0,0,0,0.4)", overflow: "hidden",
            }}>
              <ChildAvatarGlyph size={88} />
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 0, paddingTop: 2 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9, flexWrap: "wrap" }}>
              <span style={{ fontFamily: F, fontSize: 25, fontWeight: 900, color: "#fff" }}>{name}</span>
              {typeof childAge === "number" && (
                <span style={{
                  fontFamily: F, fontSize: 12.5, fontWeight: 700, color: "#fff",
                  background: "linear-gradient(180deg, #7C6FEE, #5B4FE0)",
                  borderRadius: 999,
                  padding: "3px 12px",
                }}>
                  Age {childAge}
                </span>
              )}
            </div>

            <p style={{
              margin: "8px 0 0",
              fontFamily: F, fontSize: 16, fontWeight: 800, lineHeight: 1.3,
              color: "#fff", display: "flex", alignItems: "center", gap: 6,
            }}>
              Growing with focus, every day
              <StarIcon size={15} color="#FBBF24" />
            </p>

            <p style={{
              margin: "6px 0 0",
              fontFamily: F, fontSize: 13, fontWeight: 500, lineHeight: 1.45,
              color: "rgba(222,218,248,0.8)",
            }}>
              Discover how {name}&apos;s attention<br />supports learning and daily life.
            </p>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16, position: "relative", zIndex: 3 }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 7,
            fontFamily: F, fontSize: 12, fontWeight: 700, color: "#fff",
            background: "linear-gradient(180deg, #5B4FE0 0%, #3E30B0 100%)",
            border: "1.5px solid rgba(160,150,255,0.55)",
            borderRadius: 999, padding: "10px 16px", lineHeight: 1.3,
            boxShadow: "0 0 14px rgba(120,110,240,0.5)",
          }}>
            <CalendarPillIcon size={15} />
            Baseline
          </div>
        </div>
      </div>

      {/* ── Book panel — open-book frame around the report content ── */}
      <div style={{
        flex: 1, minHeight: 0, position: "relative", zIndex: 1,
        margin: "-14px 10px 10px",
      }}>
        {/* purple cover */}
        <div style={{
          height: "100%", borderRadius: 28, padding: 11,
          background: "linear-gradient(180deg, #7C5FE0 0%, #4C3A9E 100%)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.35), inset 0 1.5px 0 rgba(255,255,255,0.35)",
          display: "flex", flexDirection: "column", overflow: "hidden",
        }}>
          {/* gold sliver */}
          <div style={{
            flex: 1, minHeight: 0, borderRadius: 20, padding: 2.5,
            background: "linear-gradient(180deg, #E8C766, #C9A227)",
            display: "flex", flexDirection: "column", overflow: "hidden",
          }}>
            {/* cream pages */}
            <div style={{
              flex: 1, minHeight: 0, borderRadius: 18, background: "#F7F0DD",
              display: "flex", flexDirection: "column", overflow: "hidden", position: "relative",
            }}>
              <div style={{
                flex: 1, minHeight: 0, display: "flex", flexDirection: "column",
                position: "relative",
              }}>
              {/* spine crease shadow down the center */}
              <div style={{
                position: "absolute", top: 0, bottom: 0, left: "50%", width: 18, marginLeft: -9,
                background: "linear-gradient(90deg, transparent, rgba(0,0,0,0.06), transparent)",
                pointerEvents: "none", zIndex: 0,
              }} />

              {/* Bookmark ribbon sticking up from the center of the spine */}
              <div style={{
                position: "absolute", top: -18, left: "50%", marginLeft: -17,
                width: 34, height: 40, background: PURPLE,
                clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 78%, 0 100%)",
                boxShadow: "0 3px 8px rgba(0,0,0,0.3)", zIndex: 2,
              }} />

              {/* Scrollable body — topic list, unlocked cards first, locked
                  cards pushed to the end (still keeping each card's original
                  number badge). */}
              <div className="ars-scroll" style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "26px 12px 16px", position: "relative", zIndex: 1 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {TOPIC_ORDER.map((i, pos) => {
                    const t = TOPICS[i];
                    const locked = LOCKED_INDICES.has(i);
                    const detail = DETAILS[i];

                    if (locked) {
                      return (
                        <motion.div
                          key={t.label}
                          whileHover={{ scale: 1.03, y: -3 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          style={{
                            background: "linear-gradient(180deg, #FAFAFB 0%, #F3F4F6 100%)", borderRadius: 22, padding: "16px 14px",
                            boxShadow: "0 3px 0 rgba(0,0,0,0.06), 0 14px 28px rgba(0,0,0,0.14), inset 0 1.5px 0 rgba(255,255,255,0.8)",
                            display: "flex", flexDirection: "column", gap: 10,
                          }}
                        >
                          <p style={{ margin: 0, fontFamily: F, color: "#9CA3AF", fontSize: 12, fontWeight: 800 }}>
                            {String(pos + 1).padStart(2, "0")}
                          </p>
                          <div style={{
                            flexShrink: 0, width: 64, height: 64, borderRadius: "50%", position: "relative",
                            background: "radial-gradient(circle at 35% 28%, #F1EBFE, #C4B5FD 75%)",
                            boxShadow: "inset 0 2px 5px rgba(255,255,255,0.85), inset 0 -5px 8px rgba(0,0,0,0.14), 0 5px 10px rgba(0,0,0,0.18)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}>
                            <span style={{
                              position: "absolute", top: 8, left: 13, width: 20, height: 11, borderRadius: "50%",
                              background: "rgba(255,255,255,0.6)", filter: "blur(2px)",
                            }} />
                            <span style={{ fontSize: 26, lineHeight: 1, position: "relative" }}>🔒</span>
                          </div>
                          <p style={{ margin: 0, fontFamily: F, color: "#1E1B3A", fontSize: 15, fontWeight: 800, lineHeight: 1.3 }}>
                            {t.label}
                          </p>
                          <p style={{ margin: 0, fontFamily: F, color: PURPLE, fontSize: 12, fontWeight: 700 }}>
                            Unlocks after mission
                          </p>
                        </motion.div>
                      );
                    }

                    const score = Math.round(
                      detail.breakdown.reduce((s, b) => s + b.score, 0) / detail.breakdown.length
                    );
                    const tier = STATUS_STYLE[detail.status];

                    return (
                      <motion.button
                        key={t.label}
                        onClick={() => setOpenIdx(i)}
                        whileHover={{ scale: 1.03, y: -4, boxShadow: `0 3px 0 ${tier.cardBorder}, 0 18px 34px rgba(0,0,0,0.18), inset 0 1.5px 0 rgba(255,255,255,0.85)` }}
                        whileTap={{ scale: 0.97, y: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        style={{
                          background: `linear-gradient(180deg, #fff 0%, ${tier.cardBg} 100%)`, border: `1px solid ${tier.cardBorder}`, borderRadius: 22, padding: "16px 14px",
                          boxShadow: `0 3px 0 ${tier.cardBorder}, 0 14px 28px rgba(0,0,0,0.13), inset 0 1.5px 0 rgba(255,255,255,0.85)`,
                          display: "flex", flexDirection: "column", gap: 10,
                          cursor: "pointer", textAlign: "left", touchAction: "manipulation",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <span style={{ fontFamily: F, color: tier.color, fontSize: 12, fontWeight: 800 }}>
                            {String(pos + 1).padStart(2, "0")}
                          </span>
                          <span style={{ color: "#B0B4C0", fontSize: 17, lineHeight: 1 }}>›</span>
                        </div>

                        <div style={{
                          flexShrink: 0, width: 64, height: 64, borderRadius: "50%", position: "relative",
                          background: `radial-gradient(circle at 35% 28%, #fff, ${tier.iconBg} 75%)`,
                          boxShadow: "inset 0 2px 5px rgba(255,255,255,0.9), inset 0 -5px 8px rgba(0,0,0,0.1), 0 5px 10px rgba(0,0,0,0.16)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          <span style={{
                            position: "absolute", top: 8, left: 13, width: 20, height: 11, borderRadius: "50%",
                            background: "rgba(255,255,255,0.75)", filter: "blur(2px)",
                          }} />
                          <t.Icon size={28} color={tier.color} />
                        </div>

                        <p style={{ margin: 0, fontFamily: F, color: "#1E1B3A", fontSize: 15, fontWeight: 800, lineHeight: 1.28 }}>
                          {t.label}
                        </p>

                        <span style={{
                          alignSelf: "flex-start", display: "flex", alignItems: "center", gap: 4,
                          fontFamily: F, fontSize: 11.5, fontWeight: 700,
                          color: tier.color, background: tier.bg, borderRadius: 999, padding: "4px 12px",
                        }}>
                          <span>{tier.pillIcon}</span>
                          {detail.status}
                        </span>

                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ flex: 1, height: 6, borderRadius: 999, background: "rgba(0,0,0,0.07)", overflow: "hidden" }}>
                            <div style={{
                              width: `${score}%`, height: "100%", borderRadius: 999,
                              background: `linear-gradient(90deg, ${tier.color}99, ${tier.color})`,
                            }} />
                          </div>
                          <span style={{ flexShrink: 0, fontFamily: F, fontSize: 12.5, fontWeight: 800, color: "#1E1B3A" }}>
                            {score}%
                          </span>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
              </div>
            </div>
          </div>
        </div>

        {/* floating star bookmark badge, sticking out past the cover's right edge */}
          <div style={{
            position: "absolute", top: "40%", right: -14, zIndex: 5,
            width: 50, height: 56, borderRadius: 16,
            background: "linear-gradient(180deg, #8B6FE8, #6D4FD1)",
            border: "2px solid rgba(255,255,255,0.25)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
          }}>
            <StarIcon size={24} color="#FBBF24" />
          </div>
      </div>

      {/* ── Card detail — tapping a topic pops the card up in the middle,
          glows, then flips over to reveal its full content; the X returns
          to the grid. ── */}
      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {activeTopic && openIdx !== null && (() => {
            const detail = DETAILS[openIdx];
            const cat = CATEGORY_STYLE[detail.categoryKey];
            const tier = STATUS_STYLE[detail.status];
            const displayNumber = TOPIC_ORDER.indexOf(openIdx) + 1;
            return (
              <motion.div
                key="backdrop"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setOpenIdx(null)}
                style={{
                  position: "fixed", inset: 0, zIndex: 200,
                  background: "rgba(15,10,35,0.55)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  padding: 18,
                }}
              >
                <motion.div
                  key="card"
                  onClick={(e) => e.stopPropagation()}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  style={{ width: "100%", maxWidth: 400, height: "min(88vh, 760px)", perspective: 1400 }}
                >
                  {/* The actual flip: rotates 0→180 about the Y axis so the
                      front (cover) visibly turns away as the back (content)
                      turns into view — a real page-turn, not a spin. */}
                  <motion.div
                    animate={{
                      rotateY: flipped ? 180 : 0,
                      boxShadow: flipped
                        ? ["0 24px 60px rgba(0,0,0,0.35)", "0 0 60px 14px rgba(251,191,36,0.75)", "0 24px 60px rgba(0,0,0,0.35)"]
                        : "0 24px 60px rgba(0,0,0,0.35)",
                    }}
                    transition={{
                      rotateY: { duration: 0.85, ease: [0.45, 0, 0.55, 1] },
                      boxShadow: { duration: 0.85, times: [0, 0.5, 1] },
                    }}
                    style={{
                      position: "relative", width: "100%", height: "100%",
                      transformStyle: "preserve-3d", borderRadius: 26,
                    }}
                  >
                    {/* FRONT face — the closed "cover" for this topic */}
                    <div style={{
                      position: "absolute", inset: 0,
                      backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden",
                      background: "#fff", borderRadius: 26,
                      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                      textAlign: "center", gap: 12, padding: "0 32px",
                    }}>
                      <div style={{
                        flexShrink: 0, width: 72, height: 72, borderRadius: "50%",
                        background: tier.iconBg, display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <activeTopic.Icon size={34} color={tier.color} />
                      </div>
                      <p style={{ margin: 0, fontFamily: F, fontSize: 12, fontWeight: 800, color: tier.color }}>
                        {String(displayNumber).padStart(2, "0")}
                      </p>
                      <p style={{ margin: 0, fontFamily: F, fontSize: 19, fontWeight: 900, color: "#1E1B3A", lineHeight: 1.3 }}>
                        {activeTopic.label}
                      </p>
                    </div>

                    {/* BACK face — the revealed content, mirrored 180° so it
                        reads correctly once the flip passes the halfway mark */}
                    <div style={{
                      position: "absolute", inset: 0, transform: "rotateY(180deg)",
                      backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden",
                      background: "#fff", borderRadius: 26,
                      display: "flex", flexDirection: "column", overflow: "hidden",
                    }}>
                      <button
                        onClick={() => setOpenIdx(null)}
                        style={{
                          position: "absolute", top: 14, right: 14, zIndex: 10,
                          width: 34, height: 34, borderRadius: "50%",
                          background: "rgba(30,27,58,0.08)", border: "none", cursor: "pointer",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          color: "#1E1B3A", fontSize: 15, fontWeight: 700,
                          touchAction: "manipulation",
                        }}
                      >✕</button>

                      <div className="ars-scroll" style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "24px 18px 24px" }}>
                        {openIdx === 0 ? (
                          <AttentionProfileContent name={name} />
                        ) : (
                        <>
                        {/* category label */}
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                          <cat.Icon size={16} color={cat.color} />
                          <span style={{ fontFamily: F, fontSize: 12.5, fontWeight: 800, color: cat.color }}>
                            {cat.label}
                          </span>
                        </div>

                        {/* heading + status pill */}
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 20, paddingRight: 26 }}>
                          <p style={{ margin: 0, flex: 1, minWidth: 0, fontFamily: F, fontSize: 21, fontWeight: 900, color: "#1E1B3A", lineHeight: 1.3 }}>
                            {activeTopic.label}
                          </p>
                          <span style={{
                            flexShrink: 0, display: "flex", alignItems: "center", gap: 4,
                            fontFamily: F, fontSize: 12, fontWeight: 700,
                            color: tier.color, background: tier.bg,
                            borderRadius: 999, padding: "6px 14px",
                          }}>
                            <span>{tier.pillIcon}</span>
                            {detail.status}
                          </span>
                        </div>

                        {/* Section 1 */}
                        <div style={{ background: cat.sectionBg, border: `1px solid ${cat.sectionBorder}`, borderRadius: 18, padding: "16px 16px", marginBottom: 12 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                            <div style={{ flexShrink: 0, width: 36, height: 36, borderRadius: "50%", background: cat.iconBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <BrainIcon size={18} color={cat.color} />
                            </div>
                            <span style={{ flex: 1, minWidth: 0, fontFamily: F, fontSize: 14.5, fontWeight: 800, color: cat.color }}>
                              1. {detail.section1.title}
                            </span>
                            <span style={{ flexShrink: 0, color: "#9CA3AF", fontSize: 13 }}>⌄</span>
                          </div>
                          <p style={{ margin: 0, fontFamily: F, fontSize: 12.5, fontWeight: 500, color: "#3D3A55", lineHeight: 1.6 }}>
                            {detail.section1.desc}
                          </p>
                        </div>

                        {/* Section 2 */}
                        <div style={{ background: cat.sectionBg, border: `1px solid ${cat.sectionBorder}`, borderRadius: 18, padding: "16px 16px", marginBottom: 16 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                            <div style={{ flexShrink: 0, width: 36, height: 36, borderRadius: "50%", background: cat.iconBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <FilledHeartIcon size={17} color={cat.color} />
                            </div>
                            <span style={{ flex: 1, minWidth: 0, fontFamily: F, fontSize: 14.5, fontWeight: 800, color: cat.color }}>
                              2. {detail.section2.title}
                            </span>
                            <span style={{ flexShrink: 0, color: "#9CA3AF", fontSize: 13 }}>⌄</span>
                          </div>
                          <p style={{ margin: 0, fontFamily: F, fontSize: 12.5, fontWeight: 500, color: "#3D3A55", lineHeight: 1.6 }}>
                            {detail.section2.desc}
                          </p>
                        </div>

                        {/* Section 3 */}
                        <p style={{ margin: "0 0 10px", fontFamily: F, fontSize: 14.5, fontWeight: 800, color: cat.color }}>
                          3. What may be behind this
                        </p>
                        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
                          {detail.breakdown.map((item) => (
                            <div key={item.title} style={{
                              background: "#fff", border: "1px solid #EEF0F4", borderRadius: 16,
                              boxShadow: "0 2px 8px rgba(0,0,0,0.05)", padding: "14px 14px",
                            }}>
                              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                                <MiniGauge percent={item.score} color={item.ring} />
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                                    <p style={{ margin: "0 0 3px", fontFamily: F, fontSize: 13.5, fontWeight: 800, color: "#1E1B3A", lineHeight: 1.3 }}>
                                      {item.title}
                                    </p>
                                    <span style={{
                                      flexShrink: 0, fontFamily: F, fontSize: 10.5, fontWeight: 700,
                                      color: item.statusColor, background: item.statusBg, borderRadius: 999, padding: "3px 10px",
                                    }}>
                                      {item.status}
                                    </span>
                                  </div>
                                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                                    {item.skills.map((sk) => (
                                      <span key={sk} style={{ fontFamily: F, fontSize: 10.5, fontWeight: 700, color: PURPLE, background: "#F1EBFE", borderRadius: 999, padding: "4px 10px" }}>
                                        {sk}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Section 4 */}
                        <div style={{ background: "#FFF7ED", border: "1px solid #FED7AA", borderRadius: 18, padding: "16px 16px" }}>
                          <p style={{ margin: "0 0 12px", fontFamily: F, fontSize: 14.5, fontWeight: 800, color: "#EA580C" }}>
                            4. How Fumi will support
                          </p>
                          <div style={{ display: "flex", gap: 8 }}>
                            {detail.support.map((s) => (
                              <div key={s.label} style={{
                                flex: 1, minWidth: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                                background: "#fff", borderRadius: 14, padding: "12px 6px",
                              }}>
                                <span style={{ fontSize: 22 }}>{s.icon}</span>
                                <span style={{ fontFamily: F, fontSize: 10, fontWeight: 700, color: "#1E1B3A", textAlign: "center", lineHeight: 1.25 }}>
                                  {s.label}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                        </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            );
          })()}
        </AnimatePresence>,
        document.body
      )}

      {/* ── Bottom Tab Bar — matches ParentDashboard's dark tab bar exactly,
          just with Reports (not Home) as the active tab. ── */}
      <div style={{
        flexShrink: 0, height: 74,
        background: "rgba(6,4,20,0.97)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        display: "flex", alignItems: "center",
        position: "relative",
      }}>
        {/* Home */}
        <motion.button
          onClick={onHome}
          whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.92 }}
          style={{
            flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
            background: "none", border: "none", cursor: "pointer",
          }}
        >
          <div style={{ width: 46, height: 46, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 22 }}>🏠</span>
          </div>
          <span style={{ fontFamily: F, color: "#fff", fontSize: 11, fontWeight: 600 }}>Home</span>
        </motion.button>

        {/* Reports — active */}
        <motion.div
          whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.92 }}
          style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2, cursor: "pointer" }}
        >
          <div style={{
            width: 46, height: 46, borderRadius: "50%",
            background: PURPLE,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ fontSize: 22 }}>📊</span>
          </div>
          <span style={{ fontFamily: F, color: "#fff", fontSize: 11, fontWeight: 800 }}>Reports</span>
          <div style={{
            position: "absolute", bottom: 0, left: "calc(50% - 20px)", width: 40, height: 3,
            background: PURPLE, borderRadius: 2,
          }} />
        </motion.div>

        {/* Profile */}
        <motion.div
          onClick={onProfile}
          whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.92 }}
          style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2, cursor: "pointer" }}
        >
          <div style={{ width: 46, height: 46, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 22 }}>👤</span>
          </div>
          <span style={{ fontFamily: F, color: "#fff", fontSize: 11, fontWeight: 600 }}>Profile</span>
        </motion.div>
      </div>

      <style>{`
        .ars-scroll::-webkit-scrollbar { display: none; }
        .ars-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
