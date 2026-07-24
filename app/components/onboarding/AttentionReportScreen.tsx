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
      <path d="M12 20.5s    -8-4.9-8-11A4.8 4.8 0 0 1 12 6.2 4.8 4.8 0 0 1 20 9.5c0 6.1-8 11-8 11Z" fill={color} />
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

// Filled parent+child silhouette — used only by the "Parent Activities"
// tab at the end of each card's flipped detail.
function FamilyIcon({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none">
      <circle cx="16" cy="14" r="7.5" fill="#6D28D9" />
      <path d="M4 35c0-6.6 5.4-12 12-12s12 5.4 12 12Z" fill="#6D28D9" />
      <circle cx="29" cy="19" r="5.5" fill="#A78BFA" />
      <path d="M19 35c0-5.5 4.5-10 10-10s10 4.5 10 10Z" fill="#A78BFA" />
    </svg>
  );
}

// Calendar-with-checkmark — pairs with FamilyIcon in the same tab.
function CalendarCheckIcon({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none">
      <rect x="5" y="8" width="34" height="30" rx="6" fill="#F1EBFE" />
      <rect x="5" y="8" width="34" height="10" rx="6" fill="#8B5CF6" />
      <rect x="13" y="3" width="3.5" height="9" rx="1.5" fill="#6D28D9" />
      <rect x="27.5" y="3" width="3.5" height="9" rx="1.5" fill="#6D28D9" />
      <rect x="11" y="23" width="6" height="6" rx="1.5" fill="#C4B5FD" />
      <rect x="20" y="23" width="6" height="6" rx="1.5" fill="#C4B5FD" />
      <rect x="11" y="32" width="6" height="4" rx="1.5" fill="#C4B5FD" />
      <circle cx="31" cy="32" r="8" fill="#fff" />
      <circle cx="31" cy="32" r="8" fill="#8B5CF6" opacity="0.15" />
      <circle cx="31" cy="32" r="7" fill="#8B5CF6" />
      <path d="M27.5 32l2.4 2.4 4.6-4.8" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

// Clipboard-with-checklist — the "What does this mean?" explainer icon on
// the Brain Health Score hero card.
function ClipboardCheckIcon({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none">
      <rect x="8" y="6" width="26" height="34" rx="4" fill="#fff" />
      <rect x="15" y="2" width="12" height="8" rx="2.5" fill="#8B5CF6" />
      <rect x="17.5" y="4.5" width="7" height="3" rx="1.2" fill="#C4B5FD" />
      <path d="M14 19l2.2 2.2L20.5 17" stroke="#8B5CF6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <rect x="23" y="18" width="7" height="2" rx="1" fill="#C4B5FD" />
      <path d="M14 27l2.2 2.2 4.3-4.4" stroke="#8B5CF6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <rect x="23" y="26" width="7" height="2" rx="1" fill="#C4B5FD" />
      <rect x="14" y="33" width="9" height="2" rx="1" fill="#EDE7FE" />
      <circle cx="32" cy="32" r="9" fill="#8B5CF6" />
      <path d="M28 32.2l2.6 2.6 5.4-5.6" stroke="#fff" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
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

function ChevronDownIcon({ size = 14, color = "#fff" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M6 9l6 6 6-6" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
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

function SeedlingIcon({ size = 20, color = PURPLE }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 20v-7" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 13c0-2.8-2-4.2-5-4.2 0 2.8 2 4.2 5 4.2Z" fill={color} />
    </svg>
  );
}

function PlantIcon({ size = 20, color = PURPLE }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 21V9" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 9c0-3.5 3-5 6-5 0 3.5-3 5-6 5Z" fill={color} />
      <path d="M12 13c0-3-2.6-4.5-6-4.5 0 3 2.6 4.5 6 4.5Z" fill={color} opacity="0.8" />
      <path d="M12 17c0-2.4-2-3.6-4.6-3.6 0 2.4 2 3.6 4.6 3.6Z" fill={color} opacity="0.6" />
    </svg>
  );
}

function TreeIcon({ size = 20, color = PURPLE }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 21v-6" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 4 6 12h3l-3.5 5h13L15 12h3Z" fill={color} />
    </svg>
  );
}

function InfoIcon({ size = 14, color = "#9CA3AF" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9.5" stroke={color} strokeWidth="1.6" />
      <path d="M12 11v5.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="7.7" r="1" fill={color} />
    </svg>
  );
}

function Sparkle({ size = 10, color = "#fff", style }: { size?: number; color?: string; style?: React.CSSProperties }) {
  return (
    <span aria-hidden style={{ position: "absolute", fontSize: size, color, lineHeight: 1, pointerEvents: "none", ...style }}>
      ✦
    </span>
  );
}

// Thin line-art brain glyph — used only in the Brain Health Score hero
// card's small header icon box, matching the reference's outline style.
function BrainOutlineIcon({ size = 22, color = PURPLE }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M9.6 3.2c-1.9 0-3.4 1.4-3.6 3.2C4.4 6.9 3 8.6 3 10.5c0 1.5.8 2.7 2 3.3-.1.3-.1.6-.1.9 0 2 1.6 3.6 3.6 3.6.4 0 .8-.1 1.1-.2.5 1.2 1.6 2.1 3 2.1V3.2H9.6Z"
        stroke={color} strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round" fill="none" />
      <path d="M14.4 3.2c1.9 0 3.4 1.4 3.6 3.2 1.6.4 3 2.1 3 4 0 1.5-.8 2.7-2 3.3.1.3.1.6.1.9 0 2-1.6 3.6-3.6 3.6-.4 0-.8-.1-1.1-.2-.5 1.2-1.6 2.1-3 2.1V3.2h3Z"
        stroke={color} strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round" fill="none" />
      <path d="M8 9.3c.8.4 1.6.4 2.2 0M8 12.7c.8.4 1.6.4 2.2 0M13.8 9.3c.8.4 1.6.4 2.2 0M13.8 12.7c.8.4 1.6.4 2.2 0"
        stroke={color} strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}

// Bigger duotone brain, with soft embossed fold lines — sits inside the
// hero card's ring gauge, matching the reference's illustrated brain.
function BrainDetailedIcon({ size = 52 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <path d="M19 6c-3.8 0-6.9 2.8-7.4 6.6C8.8 13.6 6 16.8 6 20.6c0 2.8 1.6 5.2 4 6.4-.1.5-.2 1.1-.2 1.7 0 4 3.2 7.2 7.2 7.2.8 0 1.6-.1 2.3-.4C20.3 38.1 22.5 40 25 40V6h-6Z" fill="#DDD6FE" />
      <path d="M29 6c3.8 0 6.9 2.8 7.4 6.6 2.7 1 5.4 4.2 5.4 8 0 2.8-1.6 5.2-4 6.4.1.5.2 1.1.2 1.7 0 4-3.2 7.2-7.2 7.2-.8 0-1.6-.1-2.3-.4C27.7 38.1 25.5 40 23 40V6h6Z" fill="#C4B5FD" />
      <path d="M24 12v27" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" opacity="0.5" />
      <path d="M16 16c1.6.9 3.2.9 4.4 0M16 21c1.6.9 3.2.9 4.4 0M16 26c1.6.9 3.2.9 4.4 0M27.6 16c1.6.9 3.2.9 4.4 0M27.6 21c1.6.9 3.2.9 4.4 0M27.6 26c1.6.9 3.2.9 4.4 0"
        stroke="#fff" strokeWidth="1.3" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

// Potted sprout illustration — the "What this means" graphic, matching
// the reference's soil-mound-and-leaves art instead of a plain line icon.
function PottedSproutIllustration({ size = 56 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <ellipse cx="24" cy="40" rx="15" ry="6" fill="#8B5A2B" />
      <ellipse cx="24" cy="38" rx="13" ry="5" fill="#A56A35" />
      <path d="M24 38V21" stroke="#15803D" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M24 24c-7 1-11-5-10-14 7 2 11 8 10 14Z" fill="#22C55E" />
      <path d="M24 22c7 3 12-3 11-13-8 2-13 7-11 13Z" fill="#16A34A" />
      <path d="M8 9l1.4 1.4M7 13.5h2M16 3.5l1 6-6-1Z" stroke="#FBBF24" strokeWidth="1.5" strokeLinecap="round" fill="#FBBF24" />
      <path d="M38 12l1.3 1.3M39.5 16h1.8" stroke="#FBBF24" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// Larger ring-only gauge (no inner text) — used by the Brain Health Score
// hero card, which shows a big icon inside the ring and the percent as its
// own big number off to the side, matching the reference layout.
function BigRingGauge({ percent, colorFrom, colorTo, track = "#EDE7FE", size = 112 }: { percent: number; colorFrom: string; colorTo: string; track?: string; size?: number }) {
  const R = size / 2 - 9;
  const C = 2 * Math.PI * R;
  const offset = C * (1 - percent / 100);
  const cx = size / 2, cy = size / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <linearGradient id="heroRingGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={colorFrom} />
          <stop offset="100%" stopColor={colorTo} />
        </linearGradient>
      </defs>
      <circle cx={cx} cy={cy} r={R} fill="none" stroke={track} strokeWidth="10" />
      <circle
        cx={cx} cy={cy} r={R} fill="none" stroke="url(#heroRingGrad)" strokeWidth="10" strokeLinecap="round"
        strokeDasharray={C} strokeDashoffset={offset} transform={`rotate(-90 ${cx} ${cy})`}
      />
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
  const WORKING_ITEMS = [
    { label: "Visual Attention", statusWord: "strong", manifestations: ["Notices details easily", "Spots patterns", "Follows visual cues", "Looks carefully before responding"], Icon: EyeGlyph },
    { label: "Sustained Attention", statusWord: "developed", manifestations: ["Completes structured activities", "Creates clear goals", "Returns after distraction"], Icon: TargetRingIcon },
  ];
  const SUPPORT_ITEMS = [
    { label: "Attention Switching", statusWord: "emerging", manifestations: ["Takes time to shift tasks", "Does not adapt to new rules"], Icon: RefreshGlyph },
    { label: "Emotional regulation", statusWord: "needs support", manifestations: ["Needs help calming", "Takes time to recover", "Reacts strongly to frustration"], Icon: FilledHeartIcon },
  ];

  const pfiScore = Math.round(
    ATTENTION_SUBDOMAINS.reduce((s, d) => s + d.score, 0) / ATTENTION_SUBDOMAINS.length
  );

  return (
    <>
      <div style={{
        display: "flex", alignItems: "center", gap: 14, marginBottom: 20,
        background: "#F5F3FF", border: "1px solid #E4D9FC", borderRadius: 18, padding: "14px 16px",
      }}>
        <div style={{ position: "relative", width: 60, height: 60, flexShrink: 0 }}>
          <BigRingGauge percent={pfiScore} colorFrom="#A78BFA" colorTo="#7C3AED" track="#E4D9FC" size={60} />
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: F, fontSize: 14, fontWeight: 900, color: "#1E1B3A" }}>{pfiScore}%</span>
          </div>
        </div>
        <div>
          <p style={{ margin: 0, fontFamily: F, fontSize: 12, fontWeight: 800, color: "#7C3AED", letterSpacing: 0.5 }}>
            PFI SCORE
          </p>
          <p style={{ margin: "2px 0 0", fontFamily: F, fontSize: 12.5, fontWeight: 500, color: "#5B6472" }}>
            Based on {ATTENTION_SUBDOMAINS.length} attention domains
          </p>
        </div>
      </div>

      <p style={{ margin: "0 0 6px", maxWidth: "82%", fontFamily: F, fontSize: 22, fontWeight: 800, color: "#0F2419" }}>
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
            <span style={{ fontFamily: F, fontSize: 17, fontWeight: 800, color: "#16A34A" }}>What&apos;s working</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {WORKING_ITEMS.map((item, i) => (
              <div key={item.label} style={{ display: "flex", gap: 12, padding: "12px 0", borderTop: i > 0 ? "1px solid rgba(22,163,74,0.15)" : "none" }}>
                <div style={{ flexShrink: 0, width: 40, height: 40, borderRadius: "50%", background: "#DCFCE7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <item.Icon size={19} color="#16A34A" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: "0 0 4px", fontFamily: F, fontSize: 14, fontWeight: 800, color: "#1E1B3A" }}>{item.label}</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    {item.manifestations.map((m, mi) => (
                      <p key={mi} style={{ margin: 0, fontFamily: F, fontSize: 12, fontWeight: 500, color: "#5B6472", lineHeight: 1.5 }}>
                        <span style={{ fontWeight: 800, color: "#1E1B3A" }}>Manifestation {mi + 1}:</span> {m}
                      </p>
                    ))}
                    <p style={{ margin: "4px 0 0", fontFamily: F, fontSize: 12, fontWeight: 600, fontStyle: "italic", color: "#16A34A" }}>
                      Impacted by {item.label} is {item.statusWord}
                    </p>
                  </div>
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
            <span style={{ fontFamily: F, fontSize: 17, fontWeight: 800, color: "#EA580C" }}>What needs support</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {SUPPORT_ITEMS.map((item, i) => (
              <div key={item.label} style={{ display: "flex", gap: 12, padding: "12px 0", borderTop: i > 0 ? "1px solid rgba(234,88,12,0.15)" : "none" }}>
                <div style={{ flexShrink: 0, width: 40, height: 40, borderRadius: "50%", background: "#FEE9D6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <item.Icon size={19} color="#EA580C" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: "0 0 4px", fontFamily: F, fontSize: 14, fontWeight: 800, color: "#1E1B3A" }}>{item.label}</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    {item.manifestations.map((m, mi) => (
                      <p key={mi} style={{ margin: 0, fontFamily: F, fontSize: 12, fontWeight: 500, color: "#5B6472", lineHeight: 1.5 }}>
                        <span style={{ fontWeight: 800, color: "#1E1B3A" }}>Manifestation {mi + 1}:</span> {m}
                      </p>
                    ))}
                    <p style={{ margin: "4px 0 0", fontFamily: F, fontSize: 12, fontWeight: 600, fontStyle: "italic", color: "#EA580C" }}>
                      Impacted by {item.label} is {item.statusWord}
                    </p>
                  </div>
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
    { label: `How does attention impact ${name}'s math learning?`, Icon: BarChartIcon },
    { label: `How does attention impact ${name}'s language learning?`, Icon: OpenBookIcon },
    { label: `How does attention impact ${name}'s science learning?`, Icon: BrainIcon },
  ];

  // These topics unlock as more assessment data is collected: learning
  // patterns, follow-through on tasks, handling challenges, following
  // routines independently, impulse control, and the language/science
  // subject breakdowns — math has already unlocked.
  const LOCKED_INDICES = new Set([1, 2, 3, 6, 9, 13, 14]);

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
  // category: Thriving (green), Growing Steadily (blue), Emerging (orange),
  // Needs Support (red).
  const STATUS_STYLE = {
    "Thriving": { color: "#16A34A", bg: "#DCFCE7", cardBg: "#F0FDF4", cardBorder: "#DCF3E3", iconBg: "#DCFCE7", pillIcon: "★" },
    "Growing Steadily":          { color: "#2563EB", bg: "#DBEAFE", cardBg: "#EFF6FF", cardBorder: "#DBEAFE", iconBg: "#DBEAFE", pillIcon: "↗" },
    Emerging:             { color: "#D97706", bg: "#FEF3C7", cardBg: "#FFF7ED", cardBorder: "#FED7AA", iconBg: "#FFEDD5", pillIcon: "↗" },
    "Needs Support":      { color: "#DC2626", bg: "#FEE2E2", cardBg: "#FEF2F2", cardBorder: "#FECACA", iconBg: "#FEE2E2", pillIcon: "↓" },
  } as const;

  // Rich, fully-worked-out detail content for every card — matches the
  // reference design's structure exactly (category, status, two explainer
  // sections, a scored breakdown, and Fumi's support ideas).
  const DETAILS: {
    categoryKey: keyof typeof CATEGORY_STYLE;
    status: keyof typeof STATUS_STYLE;
    // How this topic's score shifts when viewing the monthly average
    // instead of the current week — a longer window tends to smooth out
    // short-term dips, though not every topic trends the same way.
    monthlyOffset: number;
    section1: { title: string; desc: string };
    section2: { title: string; desc: string };
    breakdown: { title: string; desc: string; score: number; status: string; statusColor: string; statusBg: string; ring: string; skills: string[] }[];
    support: { icon: string; label: string }[];
  }[] = [
    {
      categoryKey: "attention", status: "Thriving", monthlyOffset: 4,
      section1: { title: "How this relates to attention", desc: `Focus reflects ${name}'s ability to concentrate on a task, notice details, and stay engaged without drifting off. This area looks at how ${name} sustains attention across different activities.` },
      section2: { title: "Patterns we are noticing", desc: `${name} focuses well during hands-on or highly engaging tasks. Attention dips more during longer, repetitive, or less interesting activities.` },
      breakdown: [
        { title: "Stays on task during activities", desc: `${name} keeps working on an activity for a good stretch before needing a break.`, score: 72, status: "Growing Steadily", statusColor: "#16A34A", statusBg: "#DCFCE7", ring: "#16A34A", skills: ["Sustained attention", "Task persistence"] },
        { title: "Notices details easily", desc: `${name} spots small details and patterns without needing extra prompting.`, score: 68, status: "Growing Steadily", statusColor: "#16A34A", statusBg: "#DCFCE7", ring: "#16A34A", skills: ["Visual attention", "Pattern recognition"] },
        { title: "Returns to task after distraction", desc: `${name} may need a nudge to get back on track after something pulls attention away.`, score: 55, status: "Emerging", statusColor: "#D97706", statusBg: "#FEF3C7", ring: "#F59E0B", skills: ["Self-monitoring", "Attention shifting"] },
      ],
      support: [{ icon: "⏱️", label: "Focus Timers" }, { icon: "🎯", label: "Goal Missions" }, { icon: "🧩", label: "Engaging Tasks" }, { icon: "🔄", label: "Refocus Cues" }],
    },
    {
      categoryKey: "attention", status: "Growing Steadily", monthlyOffset: 6,
      section1: { title: "How this relates to attention", desc: "Your child's ability to listen, follow classroom expectations, and stay engaged during school activities." },
      section2: { title: "Patterns we are noticing", desc: `${name} tends to learn best through hands-on, visual activities, and benefits from information broken into smaller, clear steps.` },
      breakdown: [
        { title: "Understands visual instructions", desc: `${name} follows along well when instructions are shown, not just spoken.`, score: 74, status: "Growing Steadily", statusColor: "#16A34A", statusBg: "#DCFCE7", ring: "#16A34A", skills: ["Visual processing", "Comprehension"] },
        { title: "Retains information over time", desc: `${name} remembers what was learned after some time has passed.`, score: 60, status: "Growing Steadily", statusColor: "#16A34A", statusBg: "#DCFCE7", ring: "#16A34A", skills: ["Working memory", "Recall"] },
        { title: "Adapts to new teaching styles", desc: `${name} may need extra time adjusting when a new way of teaching is introduced.`, score: 48, status: "Emerging", statusColor: "#D97706", statusBg: "#FEF3C7", ring: "#F59E0B", skills: ["Flexibility", "Adaptation"] },
      ],
      support: [{ icon: "🖼️", label: "Visual Guides" }, { icon: "🔁", label: "Repeat & Recall" }, { icon: "📚", label: "Step-by-step Tasks" }, { icon: "🎨", label: "Hands-on Missions" }],
    },
    {
      categoryKey: "attention", status: "Emerging", monthlyOffset: -3,
      section1: { title: "How this relates to attention", desc: "Your child's persistence to finish homework, assignments, classwork, and exams." },
      section2: { title: "Patterns we are noticing", desc: `${name} starts tasks eagerly but may need reminders or encouragement to complete longer or multi-step activities.` },
      breakdown: [
        { title: "Starts tasks independently", desc: `${name} gets going on a task without much prompting.`, score: 66, status: "Growing Steadily", statusColor: "#16A34A", statusBg: "#DCFCE7", ring: "#16A34A", skills: ["Initiative", "Motivation"] },
        { title: "Completes multi-step tasks", desc: `${name} may lose track partway through tasks with several steps.`, score: 42, status: "Emerging", statusColor: "#D97706", statusBg: "#FEF3C7", ring: "#F59E0B", skills: ["Planning", "Working memory"] },
        { title: "Finishes without reminders", desc: `${name} often needs a prompt to return to and finish a task.`, score: 38, status: "Emerging", statusColor: "#D97706", statusBg: "#FEF3C7", ring: "#F59E0B", skills: ["Self-monitoring", "Persistence"] },
      ],
      support: [{ icon: "✅", label: "Checklist Missions" }, { icon: "⏳", label: "Timed Challenges" }, { icon: "🏁", label: "Finish-line Rewards" }, { icon: "🔔", label: "Gentle Reminders" }],
    },
    {
      categoryKey: "skills", status: "Emerging", monthlyOffset: 5,
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
      categoryKey: "skills", status: "Thriving", monthlyOffset: 7,
      section1: { title: "How this relates to attention", desc: "How your child manages or limits screen use when needed." },
      section2: { title: "Patterns we are noticing", desc: `${name} enjoys screen time and follows agreed limits with reminders, though endings can still bring some pushback.` },
      breakdown: [
        { title: "Follows agreed screen-time limits", desc: `${name} sticks to limits when they're set clearly in advance.`, score: 85, status: "Thriving", statusColor: "#16A34A", statusBg: "#DCFCE7", ring: "#16A34A", skills: ["Self-monitoring", "Rule-following"] },
        { title: "Transitions away calmly", desc: `${name} may protest a little when screen time ends.`, score: 82, status: "Thriving", statusColor: "#16A34A", statusBg: "#DCFCE7", ring: "#16A34A", skills: ["Impulse control", "Emotional regulation"] },
        { title: "Chooses other activities independently", desc: `${name} can be encouraged to pick another activity after screens.`, score: 79, status: "Growing Steadily", statusColor: "#16A34A", statusBg: "#DCFCE7", ring: "#16A34A", skills: ["Initiative", "Self-regulation"] },
      ],
      support: [{ icon: "⏰", label: "Screen Timers" }, { icon: "🔄", label: "Wind-down Missions" }, { icon: "🧸", label: "Offline Play Ideas" }, { icon: "⭐", label: "Reward Charts" }],
    },
    {
      categoryKey: "skills", status: "Emerging", monthlyOffset: 3,
      section1: { title: "How this relates to attention", desc: "How your child expresses emotions, and copes with anger, worry or emotional overwhelm." },
      section2: { title: "Patterns we are noticing", desc: `${name} is beginning to recognize emotions, especially when calm or supported. In the moment, ${name} may still need help slowing down, using calming tools, and recovering after frustration.` },
      breakdown: [
        { title: "Names feelings when supported", desc: `${name} may be able to identify how they feel when given time, simple choices, or emotion words.`, score: 64, status: "Growing Steadily", statusColor: "#16A34A", statusBg: "#DCFCE7", ring: "#16A34A", skills: ["Emotional regulation", "Self-awareness"] },
        { title: "Uses calming tools when upset", desc: `${name} may need reminders to use a calming strategy when feeling frustrated, worried, disappointed, or overstimulated.`, score: 46, status: "Emerging", statusColor: "#D97706", statusBg: "#FEF3C7", ring: "#F59E0B", skills: ["Emotional regulation", "Frustration tolerance"] },
        { title: "Settles after excitement or overload", desc: `${name} may take time to settle after excitement, a difficult task, a mistake, or a sudden change in routine.`, score: 44, status: "Emerging", statusColor: "#D97706", statusBg: "#FEF3C7", ring: "#F59E0B", skills: ["Emotional regulation", "Inhibition / impulse control"] },
      ],
      support: [{ icon: "🧸", label: "Cuddle missions" }, { icon: "🌬️", label: "Breathing tasks" }, { icon: "✋", label: "Tactile care" }, { icon: "🚩", label: "Try-again missions" }],
    },
    {
      categoryKey: "skills", status: "Growing Steadily", monthlyOffset: 4,
      section1: { title: "How this relates to attention", desc: "Following everyday routines such as getting ready, organizing belongings, starting homework, or preparing for the next day." },
      section2: { title: "Patterns we are noticing", desc: `${name} follows familiar routines well and is beginning to manage them with less supervision.` },
      breakdown: [
        { title: "Follows morning and bedtime routines", desc: `${name} moves through familiar routines with little prompting.`, score: 70, status: "Growing Steadily", statusColor: "#16A34A", statusBg: "#DCFCE7", ring: "#16A34A", skills: ["Sequencing", "Memory"] },
        { title: "Manages routines with fewer reminders", desc: `${name} is starting to need fewer check-ins along the way.`, score: 58, status: "Emerging", statusColor: "#D97706", statusBg: "#FEF3C7", ring: "#F59E0B", skills: ["Independence", "Self-monitoring"] },
        { title: "Adapts routines when they change", desc: `${name} may need extra support when a routine changes unexpectedly.`, score: 45, status: "Emerging", statusColor: "#D97706", statusBg: "#FEF3C7", ring: "#F59E0B", skills: ["Flexibility", "Adaptation"] },
      ],
      support: [{ icon: "📋", label: "Routine Charts" }, { icon: "⏱️", label: "Step Timers" }, { icon: "🌟", label: "Independence Badges" }, { icon: "🔔", label: "Visual Reminders" }],
    },
    {
      categoryKey: "skills", status: "Needs Support", monthlyOffset: 2,
      section1: { title: "How this relates to attention", desc: "Understanding social rules, boundaries, and appropriate behavior." },
      section2: { title: "Patterns we are noticing", desc: `${name} generally follows social norms well and adjusts behavior when guided, especially in familiar settings.` },
      breakdown: [
        { title: "Follows social rules and boundaries", desc: `${name} respects personal space and takes turns well.`, score: 25, status: "Needs Support", statusColor: "#DC2626", statusBg: "#FEE2E2", ring: "#EF4444", skills: ["Social awareness", "Self-regulation"] },
        { title: "Adjusts behavior to the setting", desc: `${name} shifts behavior appropriately between settings like home and school.`, score: 20, status: "Needs Support", statusColor: "#DC2626", statusBg: "#FEE2E2", ring: "#EF4444", skills: ["Flexibility", "Observation"] },
        { title: "Reads unfamiliar social cues", desc: `${name} may need help interpreting cues in new social situations.`, score: 18, status: "Needs Support", statusColor: "#DC2626", statusBg: "#FEE2E2", ring: "#EF4444", skills: ["Social perception", "Interpretation"] },
      ],
      support: [{ icon: "🎭", label: "Role-play Missions" }, { icon: "👀", label: "Cue-spotting Games" }, { icon: "🤝", label: "Practice Playdates" }, { icon: "💬", label: "Social Scripts" }],
    },
    {
      categoryKey: "skills", status: "Growing Steadily", monthlyOffset: 5,
      section1: { title: "How this relates to attention", desc: "How your child connects with peers, handles disagreements, and maintains friendships." },
      section2: { title: "Patterns we are noticing", desc: `${name} makes friends easily and enjoys playing with others, with some support needed when disagreements come up.` },
      breakdown: [
        { title: "Initiates play with peers", desc: `${name} approaches other children and starts play with confidence.`, score: 75, status: "Growing Steadily", statusColor: "#16A34A", statusBg: "#DCFCE7", ring: "#16A34A", skills: ["Initiative", "Social confidence"] },
        { title: "Maintains ongoing friendships", desc: `${name} keeps friendships going over time.`, score: 68, status: "Growing Steadily", statusColor: "#16A34A", statusBg: "#DCFCE7", ring: "#16A34A", skills: ["Relationship building", "Consistency"] },
        { title: "Resolves disagreements calmly", desc: `${name} may need support working through disagreements without escalation.`, score: 47, status: "Emerging", statusColor: "#D97706", statusBg: "#FEF3C7", ring: "#F59E0B", skills: ["Conflict resolution", "Emotional regulation"] },
      ],
      support: [{ icon: "🧩", label: "Team Missions" }, { icon: "🤗", label: "Friendship Badges" }, { icon: "🕊️", label: "Peace-making Cards" }, { icon: "🎲", label: "Turn-taking Games" }],
    },
    {
      categoryKey: "attention", status: "Needs Support", monthlyOffset: -2,
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
      categoryKey: "skills", status: "Growing Steadily", monthlyOffset: 6,
      section1: { title: "How this relates to attention", desc: "How your child shares thoughts, feelings, and ideas clearly with others." },
      section2: { title: "Patterns we are noticing", desc: `${name} communicates ideas well in comfortable settings, and is developing confidence expressing feelings more clearly.` },
      breakdown: [
        { title: "Expresses thoughts clearly", desc: `${name} shares ideas in a way that's easy to follow.`, score: 70, status: "Growing Steadily", statusColor: "#16A34A", statusBg: "#DCFCE7", ring: "#16A34A", skills: ["Verbal expression", "Vocabulary"] },
        { title: "Shares feelings with others", desc: `${name} is building confidence talking about feelings.`, score: 55, status: "Emerging", statusColor: "#D97706", statusBg: "#FEF3C7", ring: "#F59E0B", skills: ["Emotional expression", "Trust"] },
        { title: "Listens and responds in conversation", desc: `${name} follows conversations and responds appropriately.`, score: 62, status: "Growing Steadily", statusColor: "#16A34A", statusBg: "#DCFCE7", ring: "#16A34A", skills: ["Active listening", "Turn-taking"] },
      ],
      support: [{ icon: "💬", label: "Talk-time Missions" }, { icon: "📖", label: "Feelings Vocabulary" }, { icon: "👂", label: "Listening Games" }, { icon: "🎤", label: "Share-your-day Prompts" }],
    },
    {
      categoryKey: "skills", status: "Growing Steadily", monthlyOffset: 3,
      section1: { title: "How this relates to attention", desc: "Taking responsibility, contributing ideas, and stepping up in group activities." },
      section2: { title: "Patterns we are noticing", desc: `${name} enjoys contributing ideas and is building confidence taking ownership of tasks and small responsibilities.` },
      breakdown: [
        { title: "Contributes ideas in group activities", desc: `${name} offers suggestions during group tasks.`, score: 66, status: "Growing Steadily", statusColor: "#16A34A", statusBg: "#DCFCE7", ring: "#16A34A", skills: ["Collaboration", "Confidence"] },
        { title: "Takes responsibility for tasks", desc: `${name} is building consistency following through on assigned roles.`, score: 58, status: "Emerging", statusColor: "#D97706", statusBg: "#FEF3C7", ring: "#F59E0B", skills: ["Ownership", "Follow-through"] },
        { title: "Encourages others", desc: `${name} is starting to notice and support other children.`, score: 50, status: "Emerging", statusColor: "#D97706", statusBg: "#FEF3C7", ring: "#F59E0B", skills: ["Empathy", "Social leadership"] },
      ],
      support: [{ icon: "🌟", label: "Helper Missions" }, { icon: "📋", label: "Responsibility Charts" }, { icon: "🗣️", label: "Idea-sharing Circles" }, { icon: "🏆", label: "Leadership Badges" }],
    },
    {
      categoryKey: "academic", status: "Emerging", monthlyOffset: 8,
      section1: { title: "How this relates to attention", desc: "How attention and focus shape the way your child approaches math problems and number sense." },
      section2: { title: "Patterns we are noticing", desc: `${name} engages well with hands-on math activities but may lose focus during longer problem sets or multi-step calculations.` },
      breakdown: [
        { title: "Follows multi-step problems", desc: `${name} may need support keeping track of each step in a longer math problem.`, score: 48, status: "Emerging", statusColor: "#D97706", statusBg: "#FEF3C7", ring: "#F59E0B", skills: ["Sequencing", "Working memory"] },
        { title: "Stays engaged with number activities", desc: `${name} focuses well during hands-on or game-based math practice.`, score: 62, status: "Growing Steadily", statusColor: "#16A34A", statusBg: "#DCFCE7", ring: "#16A34A", skills: ["Sustained attention", "Engagement"] },
        { title: "Checks work before moving on", desc: `${name} is still building the habit of double-checking answers.`, score: 40, status: "Emerging", statusColor: "#D97706", statusBg: "#FEF3C7", ring: "#F59E0B", skills: ["Self-monitoring", "Accuracy"] },
      ],
      support: [{ icon: "🔢", label: "Number Games" }, { icon: "🧮", label: "Hands-on Math" }, { icon: "📝", label: "Step-by-step Practice" }, { icon: "✅", label: "Check-your-work Habits" }],
    },
  ];

  // "Try this at home" activities — shared across every card's flipped
  // detail (not topic-specific), reached via a horizontal slide instead
  // of the flip used for the topic cards themselves.
  const ACTIVITIES: {
    title: string;
    skill: string;
    Icon: (p: { size?: number; color?: string }) => React.ReactElement;
    color: string;
    colorDark: string;
    tint: string;
    objective: string;
    materials: string;
    instructions: string[];
    reflectiveQuestions?: string[];
  }[] = [
    {
      title: "Focus Tracker", skill: "Self-regulation", Icon: TargetRingIcon,
      color: "#8B5CF6", colorDark: "#6D28D9", tint: "#F1EBFE",
      objective: `Help ${name} recognize and differentiate between relevant and distracting thoughts during a task.`,
      materials: "Paper and pen",
      instructions: [
        "Provide a task that requires focus (for example, reading a short story, solving a puzzle, or completing a drawing).",
        `Ask ${name} to create two columns: "Helpful Thoughts" (thoughts that help complete the task) and "Distracting Thoughts" (thoughts that pull attention away).`,
        "Have them write down any thoughts that come up while they're working.",
        "Set a timer for how long the task should take.",
        "After the time ends, discuss three reflective questions:",
      ],
      reflectiveQuestions: [
        "Which thoughts helped you stay focused?",
        "Which thoughts made it harder to focus and why?",
        "How could you handle these distractions next time?",
      ],
    },
    {
      title: "Emotion Detective", skill: "Emotional awareness", Icon: FilledHeartIcon,
      color: "#EC4899", colorDark: "#BE185D", tint: "#FCE7F3",
      objective: `Help ${name} notice and name emotions as they come up throughout the day.`,
      materials: "Emotion cards or a printed emotion wheel",
      instructions: [
        "Place the emotion cards where your child can see them.",
        "At a few set checkpoints during the day, pause and ask them to point to how they feel.",
        "Encourage them to say why they feel that way.",
        "Keep a simple tally of the feelings noticed throughout the day.",
        "At bedtime, review the tally together and talk about the biggest feeling of the day.",
      ],
    },
    {
      title: "Step-by-Step Sorter", skill: "Task planning", Icon: CheckSquareIcon,
      color: "#3B82F6", colorDark: "#1D4ED8", tint: "#DBEAFE",
      objective: `Build ${name}'s ability to break a task into smaller, manageable steps before starting.`,
      materials: "Sticky notes and a pen",
      instructions: [
        "Pick a task your child needs to do (for example, tidying a room or packing a bag).",
        "Ask them to write each step of the task on a separate sticky note.",
        "Have them arrange the notes in the order the steps should happen.",
        "Let them follow their own order to complete the task.",
        "Afterward, ask if any steps were missing or out of order.",
      ],
    },
    {
      title: "Calm Countdown", skill: "Impulse control", Icon: CalendarClockIcon,
      color: "#10B981", colorDark: "#047857", tint: "#D1FAE5",
      objective: `Give ${name} a simple tool to pause and calm down before reacting in the moment.`,
      materials: "None",
      instructions: [
        "Teach the \"5-4-3-2-1\" countdown: take 5 deep breaths while counting down.",
        "Practice it together during a calm moment first.",
        "Encourage your child to use it whenever they feel frustrated or overwhelmed.",
        "Praise them each time they use it, even if a grown-up has to remind them.",
        "Check in at the end of the day about when they used it.",
      ],
    },
  ];

  const [viewMode, setViewMode] = useState<"weekly" | "monthly">("weekly");

  // Derives a topic's displayed status tier from a score, and adjusts a
  // topic's base (weekly) score to its monthly one — a longer window
  // smooths out short-term dips, per that topic's monthlyOffset. Shared by
  // the hero card, the grid cards, and the flipped detail so switching
  // Weekly/Monthly view changes every score and status consistently.
  const statusForScore = (score: number): keyof typeof STATUS_STYLE =>
    score >= 80 ? "Thriving" : score >= 60 ? "Growing Steadily" : score >= 30 ? "Emerging" : "Needs Support";
  const scoreForView = (baseScore: number, monthlyOffset: number) =>
    viewMode === "monthly" ? Math.max(0, Math.min(100, baseScore + monthlyOffset)) : baseScore;

  // Card 1's data, promoted out of the grid into its own "Brain Health
  // Score" hero card — the score/tier here are derived from the same
  // breakdown scores so the ring, the number, and the status pill always
  // agree with each other.
  const heroDetail = DETAILS[0];
  const heroBaseScore = Math.round(
    heroDetail.breakdown.reduce((s, b) => s + b.score, 0) / heroDetail.breakdown.length
  );
  const heroScore = scoreForView(heroBaseScore, heroDetail.monthlyOffset);
  const heroStatus = statusForScore(heroScore);
  const heroTier = STATUS_STYLE[heroStatus];
  const RING_GRADIENTS: Record<keyof typeof STATUS_STYLE, [string, string]> = {
    "Thriving": ["#6EE7B7", "#16A34A"],
    "Growing Steadily": ["#5EEAD4", "#3B82F6"],
    Emerging: ["#FCD34D", "#D97706"],
    "Needs Support": ["#FCA5A5", "#DC2626"],
  };
  const [heroRingFrom, heroRingTo] = RING_GRADIENTS[heroStatus];

  // The four-stage growth journey shown under the score, matching the
  // Label/Score legend shown from the info icon.
  const JOURNEY_STAGES = [
    { key: "needs-support", label: "Needs support", scoreRange: "Below 35%", Icon: SeedlingIcon },
    { key: "emerging", label: "Emerging", scoreRange: "35-60", Icon: SproutIcon },
    { key: "typical", label: "Growing Steadily", scoreRange: "60-79%", Icon: PlantIcon },
    { key: "strong", label: "Thriving", scoreRange: "80-100%", Icon: TreeIcon },
  ];
  const journeyActiveIdx =
    heroScore >= 80 ? 3 : heroScore >= 60 ? 2 : heroScore >= 35 ? 1 : 0;

  const [viewMenuOpen, setViewMenuOpen] = useState(false);
  const [journeyInfoOpen, setJourneyInfoOpen] = useState(false);
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [flipped, setFlipped] = useState(false);
  const [prevOpenIdx, setPrevOpenIdx] = useState<number | null>(null);
  const [showActivities, setShowActivities] = useState(false);
  const [activeActivityIdx, setActiveActivityIdx] = useState<number | null>(null);
  const [activityDone, setActivityDone] = useState(false);
  const [prevActiveActivityIdx, setPrevActiveActivityIdx] = useState<number | null>(null);
  const activeTopic = openIdx !== null ? TOPICS[openIdx] : null;

  // Reset to the un-flipped front face whenever a (new) card opens or the
  // page closes — adjusting state during render, per React's guidance, so
  // the reset is synchronous with the openIdx change rather than trailing
  // a render behind (which is what triggered the lint error before).
  if (openIdx !== prevOpenIdx) {
    setPrevOpenIdx(openIdx);
    setFlipped(false);
    setShowActivities(false);
    setActiveActivityIdx(null);
  }

  // Reset the "done" state whenever a (new) activity popup opens or closes.
  if (activeActivityIdx !== prevActiveActivityIdx) {
    setPrevActiveActivityIdx(activeActivityIdx);
    setActivityDone(false);
  }

  // After marking an activity done, hold the confirmed state on screen for
  // a beat so it's visible, then close the popup on its own.
  useEffect(() => {
    if (!activityDone) return;
    const t = setTimeout(() => setActiveActivityIdx(null), 1100);
    return () => clearTimeout(t);
  }, [activityDone]);

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
          
            </p>

            <p style={{
              margin: "6px 0 0",
              fontFamily: F, fontSize: 15, fontWeight: 500, lineHeight: 1.45,
              color: "rgba(222,218,248,0.8)",
            }}>
              Discover how {name}&apos;s attention<br />supports learning and daily life.
            </p>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16, position: "relative", zIndex: 3 }}>
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setViewMenuOpen((v) => !v)}
              style={{
                display: "flex", alignItems: "center", gap: 7,
                fontFamily: F, fontSize: 12.5, fontWeight: 700, color: "#fff",
                background: "linear-gradient(180deg, #5B4FE0 0%, #3E30B0 100%)",
                border: "1.5px solid rgba(160,150,255,0.55)",
                borderRadius: 999, padding: "10px 14px",
                cursor: "pointer", touchAction: "manipulation",
                boxShadow: "0 0 14px rgba(120,110,240,0.5)",
              }}
            >
              {viewMode === "weekly" ? "Weekly view" : "Monthly view"}
              <motion.span
                aria-hidden
                animate={{ rotate: viewMenuOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                style={{ display: "flex" }}
              >
                <ChevronDownIcon size={13} />
              </motion.span>
            </button>

            <AnimatePresence>
              {viewMenuOpen && (
                <>
                  <div
                    onClick={() => setViewMenuOpen(false)}
                    style={{ position: "fixed", inset: 0, zIndex: 10 }}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    style={{
                      position: "absolute", top: "calc(100% + 8px)", right: 0, zIndex: 20,
                      minWidth: 140, background: "#231C4E",
                      border: "1px solid rgba(160,150,255,0.35)",
                      borderRadius: 16, padding: 5,
                      boxShadow: "0 10px 24px rgba(0,0,0,0.35)",
                    }}
                  >
                    {(["weekly", "monthly"] as const).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => { setViewMode(mode); setViewMenuOpen(false); }}
                        style={{
                          width: "100%", textAlign: "left",
                          fontFamily: F, fontSize: 13, fontWeight: 700,
                          color: viewMode === mode ? "#fff" : "rgba(222,218,248,0.75)",
                          background: viewMode === mode ? "rgba(139,124,246,0.35)" : "transparent",
                          border: "none", borderRadius: 11, padding: "10px 12px",
                          cursor: "pointer", touchAction: "manipulation",
                        }}
                      >
                        {mode === "weekly" ? "Weekly view" : "Monthly view"}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
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

              {/* Scrollable body — the Brain Health Score hero (card 1),
                  then the remaining topics in a 2-up grid, unlocked first
                  and locked pushed to the end. */}
              <div className="ars-scroll" style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "26px 12px 16px", position: "relative", zIndex: 1 }}>
                <div style={{
                  position: "relative", overflow: "hidden",
                  background: "radial-gradient(120% 100% at 50% 0%, #ffffff 0%, #F3F1FE 55%, #EAF9F0 100%)",
                  border: "1px solid #EDE9FE", borderRadius: 24, padding: "18px 18px 20px",
                  marginBottom: 14, boxShadow: "0 4px 16px rgba(124,58,237,0.08)",
                }}>
                  <Sparkle size={9} color="#C4B5FD" style={{ top: 14, right: 22 }} />
                  <Sparkle size={7} color="#A7F3D0" style={{ top: 40, right: 8 }} />

                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
                    <div style={{
                      flexShrink: 0, width: 48, height: 48, borderRadius: 14,
                      background: "#fff", boxShadow: "0 2px 8px rgba(124,58,237,0.18)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <BrainOutlineIcon size={26} color={PURPLE} />
                    </div>
                    <span style={{ fontFamily: F, fontSize: 14.5, fontWeight: 800, color: PURPLE, letterSpacing: 0.5 }}>
                      BRAIN HEALTH SCORE
                    </span>
                  </div>

                  {/* Primary component — the ring, percentage, and status
                      are the main focus now that the heading is gone;
                      centered as a group within the card. */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20, marginBottom: 16, paddingLeft: 24 }}>
                    <div style={{ position: "relative", width: 132, height: 132, flexShrink: 0 }}>
                      <div style={{
                        position: "absolute", inset: -9, borderRadius: "50%",
                        background: `radial-gradient(circle, ${heroRingTo}55 0%, transparent 70%)`,
                        filter: "blur(6px)",
                      }} />
                      <div style={{ position: "absolute", inset: -6, borderRadius: "50%", border: "1.5px solid rgba(255,255,255,0.85)" }} />
                      <BigRingGauge percent={heroScore} colorFrom={heroRingFrom} colorTo={heroRingTo} size={132} />
                      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <BrainDetailedIcon size={60} />
                        <Sparkle size={16} color="#fff" style={{ top: 4, right: 2 }} />
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 8 }}>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
                        <span style={{ fontFamily: F, fontSize: 36, fontWeight: 900, color: "#1E1B3A" }}>{heroScore}</span>
                        <span style={{ fontFamily: F, fontSize: 18, fontWeight: 800, color: "#1E1B3A" }}>%</span>
                      </div>
                      <span style={{
                        display: "inline-flex", alignItems: "center", gap: 4, whiteSpace: "nowrap",
                        fontFamily: F, fontSize: 12.5, fontWeight: 700, color: heroTier.color, background: heroTier.bg,
                        borderRadius: 999, padding: "6px 14px",
                      }}>
                        {heroTier.pillIcon} {heroStatus}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 16 }}>
                    <div style={{
                      flexShrink: 0, width: 30, height: 30, borderRadius: "50%",
                      background: "rgba(139,92,246,0.14)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <FamilyIcon size={16} />
                    </div>
                    <p style={{ margin: 0, fontFamily: F, fontSize: 12, fontWeight: 700, color: "#1E1B3A", lineHeight: 1.35 }}>
                      Based on <span style={{ color: PURPLE, fontWeight: 900 }}>30</span> everyday behaviors analysed
                    </p>
                  </div>

                  <div style={{
                    display: "flex", alignItems: "center", gap: 14,
                    background: "rgba(139,92,246,0.08)", borderRadius: 18, padding: "14px 16px", marginBottom: 18,
                  }}>
                    <div style={{
                      flexShrink: 0, width: 64, height: 64, borderRadius: "50%",
                      background: "rgba(139,92,246,0.14)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <ClipboardCheckIcon size={34} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontFamily: F, fontSize: 12, fontWeight: 500, color: "#5B6472", lineHeight: 1.55 }}>
                        This profile shows how {name} is doing across learning, emotional regulation, thinking skills, and everyday behavior — shaping their daily routines, schoolwork, and relationships.
                      </p>
                    </div>
                  </div>

                  <div style={{
                    position: "relative",
                    background: "linear-gradient(180deg, rgba(124,58,237,0.05) 0%, rgba(124,58,237,0.08) 100%)",
                    borderRadius: 16, padding: "14px 14px 16px", marginBottom: 14,
                    boxShadow: "0 1px 0 rgba(255,255,255,0.7) inset, 0 6px 14px rgba(76,41,168,0.10)",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
                      <span style={{ fontFamily: F, fontSize: 12, fontWeight: 800, color: "#1E1B3A", letterSpacing: 0.5 }}>
                        GROWING JOURNEY
                      </span>
                      <button
                        onClick={() => setJourneyInfoOpen((v) => !v)}
                        aria-label="What do these stages mean?"
                        style={{ display: "flex", alignItems: "center", gap: 2, background: "none", border: "none", padding: 2, cursor: "pointer", touchAction: "manipulation" }}
                      >
                        <InfoIcon size={13} />
                        <span style={{ color: "#B0AEC4", fontSize: 14, lineHeight: 1, marginLeft: 2 }}>›</span>
                      </button>
                    </div>

                    <AnimatePresence>
                      {journeyInfoOpen && (
                        <>
                          <div onClick={() => setJourneyInfoOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 30 }} />
                          <motion.div
                            initial={{ opacity: 0, y: -6, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -6, scale: 0.97 }}
                            transition={{ duration: 0.15 }}
                            style={{
                              position: "absolute", top: 34, left: 14, right: 14, zIndex: 31,
                              background: "#fff", borderRadius: 14, overflow: "hidden",
                              border: "1px solid #EEF0F4", boxShadow: "0 12px 28px rgba(0,0,0,0.18)",
                            }}
                          >
                            <div style={{ display: "flex", background: "#F8F7FC", borderBottom: "1px solid #EEF0F4" }}>
                              <span style={{ flex: 1, fontFamily: F, fontSize: 12, fontWeight: 800, color: "#1E1B3A", padding: "10px 14px" }}>Label</span>
                              <span style={{ flex: 1, fontFamily: F, fontSize: 12, fontWeight: 800, color: "#1E1B3A", padding: "10px 14px" }}>Score</span>
                            </div>
                            {JOURNEY_STAGES.map((s, i) => (
                              <div key={s.key} style={{ display: "flex", borderTop: i > 0 ? "1px solid #EEF0F4" : "none" }}>
                                <span style={{ flex: 1, fontFamily: F, fontSize: 12.5, fontWeight: 600, color: "#1E1B3A", padding: "10px 14px" }}>{s.label}</span>
                                <span style={{ flex: 1, fontFamily: F, fontSize: 12.5, fontWeight: 500, color: "#5B6472", padding: "10px 14px" }}>{s.scoreRange}</span>
                              </div>
                            ))}
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>

                    <div style={{ position: "relative" }}>
                      <div style={{ position: "absolute", top: 21, left: "10%", right: "10%", borderTop: "2px dashed rgba(124,58,237,0.22)", zIndex: 0 }} />
                      <div style={{ display: "flex", justifyContent: "space-between", position: "relative", zIndex: 1 }}>
                        {JOURNEY_STAGES.map((s, i) => {
                          const active = i === journeyActiveIdx;
                          return (
                            <div key={s.key} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flex: 1 }}>
                              <div style={{
                                width: active ? 48 : 42, height: active ? 48 : 42, borderRadius: "50%",
                                background: active ? "#fff" : "radial-gradient(circle at 35% 30%, #F3FBF6, #DFF0E6)",
                                border: active ? "2px solid #22C55E" : "none",
                                boxShadow: active ? "0 0 14px rgba(34,197,94,0.4)" : "inset 0 1px 2px rgba(255,255,255,0.8), inset 0 -2px 4px rgba(22,101,52,0.06)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                              }}>
                                <s.Icon size={active ? 22 : 18} color={active ? "#22C55E" : "#8FAE97"} />
                              </div>
                              <span style={{ fontFamily: F, fontSize: 10.5, fontWeight: 700, color: active ? "#16A34A" : "#41465B", textAlign: "center" }}>
                                {s.label}
                              </span>
                              {active && <span style={{ width: 16, height: 3, borderRadius: 2, background: "#22C55E" }} />}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div style={{
                    display: "flex", gap: 14,
                    background: "linear-gradient(180deg, rgba(124,58,237,0.05) 0%, rgba(124,58,237,0.08) 100%)",
                    borderRadius: 20, padding: "18px 14px",
                    boxShadow: "0 1px 0 rgba(255,255,255,0.7) inset, 0 6px 14px rgba(76,41,168,0.10)",
                  }}>
                    <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ position: "relative", flexShrink: 0 }}>
                          <PottedSproutIllustration size={36} />
                          <Sparkle size={8} color={PURPLE} style={{ top: -4, right: -6 }} />
                          <Sparkle size={5} color="#C4B5FD" style={{ top: 4, right: -10 }} />
                        </div>
                        <p style={{ margin: 0, fontFamily: F, fontSize: 15.5, fontWeight: 900, color: PURPLE, lineHeight: 1.2 }}>
                          What&apos;s standing out
                        </p>
                      </div>

                      <div style={{ background: "rgba(139,92,246,0.08)", borderRadius: 14, padding: "10px 12px", display: "flex", alignItems: "flex-start", gap: 8 }}>
                        <PeopleIcon size={17} color={PURPLE} />
                        <p style={{ margin: 0, fontFamily: F, fontSize: 11.5, fontWeight: 500, color: "#1E1B3A", lineHeight: 1.45 }}>
                          <span style={{ fontWeight: 800 }}>Life area:</span> Peer interaction and relationships
                        </p>
                      </div>

                      <div style={{ background: "#F0FDF4", border: "1px solid #DCF3E3", borderRadius: 14, padding: "10px 12px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                          <div style={{ flexShrink: 0, width: 20, height: 20, borderRadius: "50%", background: "#DCFCE7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                              <path d="M5 13l4.5 4.5L19 7" stroke="#16A34A" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                            </svg>
                          </div>
                          <span style={{ fontFamily: F, fontSize: 12.5, fontWeight: 800, color: "#16A34A" }}>Highlight</span>
                        </div>
                        <p style={{ margin: 0, fontFamily: F, fontSize: 11.5, fontWeight: 500, color: "#3D3A55", lineHeight: 1.55 }}>
                          {name} is showing strong signs of positive peer interaction. They may be able to connect well with others, understand social situations, and manage small conflicts with confidence.
                        </p>
                      </div>
                    </div>

                    <div style={{ width: 1, background: "rgba(124,58,237,0.15)" }} />

                    <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{
                          flexShrink: 0, width: 36, height: 36, borderRadius: "50%",
                          background: "radial-gradient(circle at 35% 28%, #FFF3E0, #FDECD1)",
                          boxShadow: "inset 0 2px 4px rgba(255,255,255,0.8), inset 0 -3px 6px rgba(0,0,0,0.06)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          <FilledHeartIcon size={16} color="#F87171" />
                        </div>
                        <p style={{ margin: 0, fontFamily: F, fontSize: 15.5, fontWeight: 900, color: PURPLE, lineHeight: 1.2 }}>
                          Fumi&apos;s Starting point
                        </p>
                      </div>

                      <p style={{ margin: 0, fontFamily: F, fontSize: 11.5, fontWeight: 500, color: "#1E1B3A", lineHeight: 1.5 }}>
                        Fumi will first support skills of self-regulation and impulse control.
                      </p>
                      <p style={{ margin: 0, fontFamily: F, fontSize: 11.5, fontWeight: 500, color: "#1E1B3A", lineHeight: 1.5 }}>
                        These missions will help <span style={{ fontWeight: 800 }}>{name}</span> practice:
                      </p>

                      {[
                        { n: 1, text: "Pausing, calming down, waiting" },
                        { n: 2, text: "Making thoughtful choices in everyday situations" },
                      ].map((item) => (
                        <div key={item.n} style={{
                          display: "flex", alignItems: "center", gap: 8,
                          background: "#fff", border: "1px solid #EEF0F4", borderRadius: 14,
                          boxShadow: "0 2px 6px rgba(0,0,0,0.05)", padding: "10px 10px",
                        }}>
                          <span style={{
                            flexShrink: 0, width: 24, height: 24, borderRadius: "50%",
                            background: "#EDE7FE", color: PURPLE, fontFamily: F, fontSize: 11.5, fontWeight: 800,
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}>
                            {item.n}
                          </span>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ margin: "0 0 2px", fontFamily: F, fontSize: 11, fontWeight: 800, color: PURPLE }}>
                              Manifestation {item.n}
                            </p>
                            <p style={{ margin: 0, fontFamily: F, fontSize: 11, fontWeight: 500, color: "#3D3A55", lineHeight: 1.4 }}>
                              {item.text}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <motion.button
                    onClick={() => setOpenIdx(0)}
                    whileTap={{ scale: 0.97 }}
                    style={{
                      width: "100%", marginTop: 14, height: 50, borderRadius: 25, border: "none", cursor: "pointer",
                      background: "linear-gradient(90deg, #8B7CF0 0%, #7C5CE0 100%)",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      fontFamily: F, fontSize: 15, fontWeight: 800, color: "#fff",
                      boxShadow: "0 4px 0 #5B21B6, 0 8px 18px rgba(109,40,217,0.35)",
                      touchAction: "manipulation",
                    }}
                  >
                    See {name}&apos;s focus profile <span aria-hidden>›</span>
                  </motion.button>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {TOPIC_ORDER.filter((i) => i !== 0).map((i) => {
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

                    const baseScore = Math.round(
                      detail.breakdown.reduce((s, b) => s + b.score, 0) / detail.breakdown.length
                    );
                    const score = scoreForView(baseScore, detail.monthlyOffset);
                    const status = statusForScore(score);
                    const tier = STATUS_STYLE[status];

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
                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
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
                          {status}
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
            const modalBaseScore = Math.round(
              detail.breakdown.reduce((s, b) => s + b.score, 0) / detail.breakdown.length
            );
            const modalScore = scoreForView(modalBaseScore, detail.monthlyOffset);
            const modalStatus = statusForScore(modalScore);
            const tier = STATUS_STYLE[modalStatus];
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

                      <div className="ars-scroll" style={{ flex: 1, minHeight: 0, overflowY: "auto", overflowX: "hidden", padding: "24px 18px 24px" }}>
                        {openIdx === 0 ? (
                          <AttentionProfileContent name={name} />
                        ) : (
                        <AnimatePresence mode="wait" initial={false}>
                        {showActivities ? (
                          <motion.div
                            key="activities"
                            initial={{ opacity: 0, x: 32 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -32 }}
                            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                          >
                            <button
                              onClick={() => setShowActivities(false)}
                              style={{
                                display: "flex", alignItems: "center", gap: 4, marginBottom: 16,
                                background: "none", border: "none", padding: 0, cursor: "pointer", touchAction: "manipulation",
                              }}
                            >
                              <span style={{ fontSize: 18, color: PURPLE, lineHeight: 1 }}>‹</span>
                              <span style={{ fontFamily: F, fontSize: 13, fontWeight: 700, color: PURPLE }}>Back</span>
                            </button>

                            <p style={{ margin: "0 0 4px", fontFamily: F, fontSize: 20, fontWeight: 900, color: "#1E1B3A" }}>
                              Try this at home
                            </p>
                            <p style={{ margin: "0 0 18px", fontFamily: F, fontSize: 13, fontWeight: 500, color: "#7B7F8C" }}>
                              Simple daily activities to support {name}&apos;s growth
                            </p>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                              {ACTIVITIES.map((a, i) => (
                                <motion.button
                                  key={a.title}
                                  onClick={() => setActiveActivityIdx(i)}
                                  whileHover={{ scale: 1.03, y: -3 }}
                                  whileTap={{ scale: 0.97, y: 0 }}
                                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                  style={{
                                    position: "relative",
                                    textAlign: "left", cursor: "pointer", touchAction: "manipulation",
                                    background: `linear-gradient(180deg, #fff 0%, ${a.tint} 100%)`,
                                    border: `1px solid ${a.tint}`, borderRadius: 18,
                                    boxShadow: `0 3px 0 ${a.tint}, 0 10px 20px rgba(0,0,0,0.10), inset 0 1.5px 0 rgba(255,255,255,0.9)`,
                                    padding: "14px 14px", display: "flex", flexDirection: "column", gap: 10,
                                  }}
                                >
                                  <span style={{
                                    position: "absolute", top: 12, right: 12,
                                    width: 22, height: 22, borderRadius: "50%",
                                    background: "rgba(255,255,255,0.75)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    color: a.colorDark, fontSize: 14, lineHeight: 1,
                                  }}>›</span>

                                  <div style={{
                                    width: 38, height: 38, borderRadius: "50%", position: "relative",
                                    background: `radial-gradient(circle at 35% 28%, ${a.color}, ${a.colorDark})`,
                                    boxShadow: `inset 0 2px 3px rgba(255,255,255,0.5), inset 0 -3px 5px rgba(0,0,0,0.15), 0 3px 6px ${a.color}55`,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                  }}>
                                    <a.Icon size={19} color="#fff" />
                                  </div>
                                  <div>
                                    <p style={{ margin: "0 0 2px", fontFamily: F, fontSize: 10, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 0.4 }}>
                                      Activity
                                    </p>
                                    <p style={{ margin: 0, fontFamily: F, fontSize: 13.5, fontWeight: 800, color: "#1E1B3A", lineHeight: 1.25, paddingRight: 20 }}>
                                      {a.title}
                                    </p>
                                  </div>
                                  <div>
                                    <p style={{ margin: "0 0 2px", fontFamily: F, fontSize: 10, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 0.4 }}>
                                      Skill
                                    </p>
                                    <p style={{ margin: 0, fontFamily: F, fontSize: 12.5, fontWeight: 700, color: a.colorDark }}>
                                      {a.skill}
                                    </p>
                                  </div>

                                  <p style={{ margin: 0, fontFamily: F, fontSize: 10.5, fontWeight: 700, color: a.colorDark, opacity: 0.75 }}>
                                    Tap to view →
                                  </p>
                                </motion.button>
                              ))}
                            </div>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="detail"
                            initial={{ opacity: 0, x: -32 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 32 }}
                            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                          >
                        {/* category label */}
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                          <cat.Icon size={16} color={cat.color} />
                          <span style={{ fontFamily: F, fontSize: 12.5, fontWeight: 800, color: cat.color }}>
                            {cat.label}
                          </span>
                        </div>

                        {/* heading + status pill */}
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 10, paddingRight: 26 }}>
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
                            {modalStatus}
                          </span>
                        </div>

                        {/* Subtext — section1's content, folded in as plain
                            text under the title. */}
                        <p style={{ margin: "0 0 16px", fontFamily: F, fontSize: 13, fontWeight: 500, color: "#5B6472", lineHeight: 1.6 }}>
                          {detail.section1.desc}
                        </p>

                        {/* "Patterns we are noticing" — kept as its own
                            numbered green tab, matching the reference. */}
                        <div style={{ background: "#F0FDF4", border: "1px solid #DCF3E3", borderRadius: 18, padding: "16px 16px", marginBottom: 16 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                            <div style={{ flexShrink: 0, width: 36, height: 36, borderRadius: "50%", background: "#DCFCE7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <FilledHeartIcon size={17} color="#16A34A" />
                            </div>
                            <span style={{ flex: 1, minWidth: 0, fontFamily: F, fontSize: 14.5, fontWeight: 800, color: "#16A34A" }}>
                              {detail.section2.title}
                            </span>
                            <span style={{ flexShrink: 0, color: "#9CA3AF", fontSize: 13 }}>⌄</span>
                          </div>
                          <p style={{ margin: 0, fontFamily: F, fontSize: 12.5, fontWeight: 500, color: "#3D3A55", lineHeight: 1.6 }}>
                            {detail.section2.desc}
                          </p>
                        </div>

                        {/* Section 3 */}
                        <p style={{ margin: "0 0 10px", fontFamily: F, fontSize: 14.5, fontWeight: 800, color: cat.color }}>
                          Key behaviours in this area
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
                            How Fumi will support
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

                        {/* "Try this at home" tab — slides to the activities grid */}
                        <button
                          onClick={() => setShowActivities(true)}
                          style={{
                            width: "100%", display: "flex", alignItems: "center", gap: 12, marginTop: 16,
                            background: "linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)",
                            border: "1px solid #E4D9FC", borderRadius: 20, padding: "14px 16px",
                            cursor: "pointer", textAlign: "left", touchAction: "manipulation",
                          }}
                        >
                          <FamilyIcon size={40} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ margin: "0 0 3px", fontFamily: F, fontSize: 15, fontWeight: 800, color: "#4C1D95" }}>
                              Try this at home
                            </p>
                            <p style={{ margin: 0, fontFamily: F, fontSize: 12.5, fontWeight: 500, color: "#5B6472", lineHeight: 1.4 }}>
                              Simple daily activities to support {name}&apos;s growth
                            </p>
                          </div>
                          <CalendarCheckIcon size={40} />
                          <span style={{ flexShrink: 0, color: PURPLE, fontSize: 18, lineHeight: 1 }}>›</span>
                        </button>
                          </motion.div>
                        )}
                        </AnimatePresence>)}
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

      {/* ── Activity detail popup — opened from the activities grid,
          layered above the card-flip modal with a higher z-index. ── */}
      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {activeActivityIdx !== null && (() => {
            const activity = ACTIVITIES[activeActivityIdx];
            return (
              <motion.div
                key="activity-backdrop"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setActiveActivityIdx(null)}
                style={{
                  position: "fixed", inset: 0, zIndex: 300,
                  background: "rgba(15,10,35,0.6)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  padding: 18,
                }}
              >
                <motion.div
                  key="activity-card"
                  onClick={(e) => e.stopPropagation()}
                  initial={{ opacity: 0, scale: 0.9, y: 16 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 16 }}
                  transition={{ type: "spring", stiffness: 260, damping: 24 }}
                  style={{
                    width: "100%", maxWidth: 400, maxHeight: "85vh",
                    background: "#fff", borderRadius: 26, boxShadow: "0 24px 60px rgba(0,0,0,0.35)",
                    display: "flex", flexDirection: "column", overflow: "hidden", position: "relative",
                  }}
                >
                  <button
                    onClick={() => setActiveActivityIdx(null)}
                    style={{
                      position: "absolute", top: 14, right: 14, zIndex: 10,
                      width: 34, height: 34, borderRadius: "50%",
                      background: "rgba(30,27,58,0.08)", border: "none", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#1E1B3A", fontSize: 15, fontWeight: 700,
                      touchAction: "manipulation",
                    }}
                  >✕</button>

                  <div className="ars-scroll" style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "24px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, paddingRight: 26 }}>
                      <div style={{
                        flexShrink: 0, width: 46, height: 46, borderRadius: "50%",
                        background: `radial-gradient(circle at 35% 28%, ${activity.color}, ${activity.colorDark})`,
                        boxShadow: `inset 0 2px 3px rgba(255,255,255,0.5), inset 0 -3px 5px rgba(0,0,0,0.15), 0 3px 6px ${activity.color}55`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <activity.Icon size={22} color="#fff" />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ margin: "0 0 4px", fontFamily: F, fontSize: 18, fontWeight: 900, color: "#1E1B3A", lineHeight: 1.25 }}>
                          {activity.title}
                        </p>
                        <span style={{
                          display: "inline-flex", fontFamily: F, fontSize: 11.5, fontWeight: 700,
                          color: activity.colorDark, background: activity.tint, borderRadius: 999, padding: "3px 10px",
                        }}>
                          {activity.skill}
                        </span>
                      </div>
                    </div>

                    <p style={{ margin: "0 0 4px", fontFamily: F, fontSize: 13, fontWeight: 800, color: activity.colorDark }}>
                      Objective
                    </p>
                    <p style={{ margin: "0 0 16px", fontFamily: F, fontSize: 13, fontWeight: 500, color: "#3D3A55", lineHeight: 1.6 }}>
                      {activity.objective}
                    </p>

                    <p style={{ margin: "0 0 4px", fontFamily: F, fontSize: 13, fontWeight: 800, color: activity.colorDark }}>
                      Materials needed
                    </p>
                    <p style={{ margin: "0 0 16px", fontFamily: F, fontSize: 13, fontWeight: 500, color: "#3D3A55", lineHeight: 1.6 }}>
                      {activity.materials}
                    </p>

                    <p style={{ margin: "0 0 8px", fontFamily: F, fontSize: 13, fontWeight: 800, color: activity.colorDark }}>
                      Instructions
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: activity.reflectiveQuestions ? 8 : 16 }}>
                      {activity.instructions.map((step, i) => (
                        <div key={i} style={{ display: "flex", gap: 10 }}>
                          <span style={{
                            flexShrink: 0, width: 20, height: 20, borderRadius: "50%",
                            background: activity.tint, color: activity.colorDark, fontFamily: F, fontSize: 11, fontWeight: 800,
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}>
                            {i + 1}
                          </span>
                          <p style={{ margin: 0, flex: 1, minWidth: 0, fontFamily: F, fontSize: 12.5, fontWeight: 500, color: "#3D3A55", lineHeight: 1.55 }}>
                            {step}
                          </p>
                        </div>
                      ))}
                    </div>

                    {activity.reflectiveQuestions && (
                      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginLeft: 30 }}>
                        {activity.reflectiveQuestions.map((q, i) => (
                          <p key={i} style={{ margin: 0, fontFamily: F, fontSize: 12.5, fontWeight: 500, color: "#5B6472", lineHeight: 1.55 }}>
                            • {q}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>

                  <div style={{ flexShrink: 0, padding: "12px 20px 20px" }}>
                    <motion.button
                      onClick={() => !activityDone && setActivityDone(true)}
                      disabled={activityDone}
                      whileTap={activityDone ? undefined : { scale: 0.97 }}
                      animate={activityDone ? { scale: [1, 1.05, 1] } : { scale: 1 }}
                      transition={{ duration: 0.35 }}
                      style={{
                        width: "100%", height: 50, borderRadius: 25, border: "none",
                        cursor: activityDone ? "default" : "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                        background: activityDone
                          ? "linear-gradient(90deg, #34D399 0%, #059669 100%)"
                          : `linear-gradient(90deg, ${activity.color} 0%, ${activity.colorDark} 100%)`,
                        fontFamily: F, fontSize: 15, fontWeight: 800, color: "#fff",
                        boxShadow: activityDone
                          ? "0 4px 0 #047857, 0 8px 18px rgba(5,150,105,0.35)"
                          : `0 4px 0 ${activity.colorDark}, 0 8px 18px ${activity.color}55`,
                        touchAction: "manipulation",
                      }}
                    >
                      {activityDone && <span aria-hidden>✓</span>}
                      {activityDone ? "Done!" : "Mark as done"}
                    </motion.button>
                  </div>
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
