"use client";

import { useId } from "react";
import type { Mood } from "../lib/data";

type BoboProps = {
  mood?: Mood;
  tint?: number;
  size?: number;
  animate?: boolean;
  hat?: string | null;
};

// Hats sit above the ears — y centred around -120
function Hat({ kind }: { kind: string }) {
  switch (kind) {
    case "acorn":
      return (
        <g>
          <ellipse cx="0" cy="-118" rx="42" ry="22" fill="oklch(45% 0.08 50)"/>
          <path d="M -42 -118 Q 0 -150 42 -118 Q 30 -108 0 -108 Q -30 -108 -42 -118" fill="oklch(55% 0.11 50)"/>
          <path d="M -5 -148 Q 0 -160 5 -148" stroke="oklch(35% 0.06 50)" strokeWidth="3" strokeLinecap="round" fill="none"/>
        </g>
      );
    case "crown":
      return (
        <g>
          <path d="M -42 -100 L -42 -135 L -22 -118 L 0 -148 L 22 -118 L 42 -135 L 42 -100 Z" fill="oklch(82% 0.16 80)" stroke="oklch(55% 0.14 70)" strokeWidth="2.5" strokeLinejoin="round"/>
          <circle cx="-22" cy="-119" r="4" fill="oklch(60% 0.20 25)"/>
          <circle cx="0"   cy="-138" r="4" fill="oklch(60% 0.20 25)"/>
          <circle cx="22"  cy="-119" r="4" fill="oklch(60% 0.20 25)"/>
          <rect x="-44" y="-100" width="88" height="6" fill="oklch(72% 0.14 70)"/>
        </g>
      );
    case "wizard":
      return (
        <g>
          <path d="M -36 -100 L 0 -180 L 36 -100 Z" fill="oklch(38% 0.13 295)" stroke="oklch(28% 0.10 295)" strokeWidth="2.5" strokeLinejoin="round"/>
          <circle cx="-14" cy="-130" r="3" fill="oklch(85% 0.16 90)"/>
          <circle cx="10"  cy="-152" r="2.5" fill="oklch(85% 0.16 90)"/>
          <circle cx="-6"  cy="-160" r="2" fill="oklch(85% 0.16 90)"/>
          <rect x="-44" y="-102" width="88" height="10" fill="oklch(48% 0.12 295)" rx="2"/>
          <rect x="-44" y="-100" width="88" height="3" fill="oklch(85% 0.16 90)"/>
        </g>
      );
    case "graduate":
      return (
        <g>
          <rect x="-32" y="-110" width="64" height="20" fill="oklch(22% 0.02 280)" rx="3"/>
          <polygon points="-52,-114 0,-138 52,-114 0,-90" fill="oklch(22% 0.02 280)" stroke="oklch(10% 0 0)" strokeWidth="1.5"/>
          <line x1="0" y1="-116" x2="42" y2="-92" stroke="oklch(60% 0.20 25)" strokeWidth="2.5" strokeLinecap="round"/>
          <circle cx="44" cy="-90" r="6" fill="oklch(60% 0.20 25)"/>
        </g>
      );
    case "party":
      return (
        <g>
          <path d="M -28 -100 L 0 -170 L 28 -100 Z" fill="oklch(72% 0.18 25)" stroke="oklch(50% 0.16 25)" strokeWidth="2"/>
          <path d="M -28 -100 L 28 -100" stroke="oklch(40% 0.12 25)" strokeWidth="2" strokeLinecap="round"/>
          <path d="M -22 -118 L 22 -118" stroke="oklch(85% 0.18 90)" strokeWidth="3" strokeLinecap="round" strokeDasharray="4 4"/>
          <path d="M -14 -140 L 14 -140" stroke="oklch(72% 0.16 160)" strokeWidth="3" strokeLinecap="round" strokeDasharray="4 4"/>
          <circle cx="0" cy="-172" r="6" fill="oklch(85% 0.16 90)"/>
          <path d="M 0 -178 L 0 -190 M -6 -184 L 6 -184" stroke="oklch(85% 0.16 90)" strokeWidth="2" strokeLinecap="round"/>
        </g>
      );
    case "star":
      return (
        <g>
          <rect x="-50" y="-112" width="100" height="14" rx="7" fill="oklch(68% 0.18 28)" stroke="oklch(48% 0.16 28)" strokeWidth="2"/>
          <g transform="translate(0,-118)">
            <path d="M 0 -16 L 5 -5 L 17 -5 L 7 2 L 11 13 L 0 6 L -11 13 L -7 2 L -17 -5 L -5 -5 Z"
                  fill="oklch(88% 0.16 90)" stroke="oklch(60% 0.16 70)" strokeWidth="1.5" strokeLinejoin="round"/>
          </g>
        </g>
      );
    default:
      return null;
  }
}

export function Bobo({ mood = "happy", tint = 18, size = 220, animate = true, hat }: BoboProps) {
  const h = tint;
  const bodyTop = `oklch(88% 0.10 ${h})`;
  const bodyMid = `oklch(76% 0.15 ${h})`;
  const bodyBottom = `oklch(58% 0.17 ${h})`;
  const earInner = `oklch(78% 0.14 ${(h + 20) % 360})`;
  const cheek = `oklch(72% 0.17 ${(h + 12) % 360})`;
  const highlight = `oklch(97% 0.03 ${h})`;
  const shadow = `oklch(28% 0.08 ${h} / 0.3)`;
  const nose = "oklch(68% 0.14 20)";
  const tummy = `oklch(93% 0.05 ${h})`;

  const id = useId().replace(/:/g, "_");

  type EyeCfg = {
    lx: number; rx: number; y: number; r: number;
    curve?: boolean; happyArc?: boolean; closed?: boolean;
  };
  const eyesMap: Record<Mood, EyeCfg> = {
    happy:    { lx: -18, rx: 18, y: -2, r: 6 },
    waving:   { lx: -18, rx: 18, y: -2, r: 6 },
    thinking: { lx: -20, rx: 16, y: -2, r: 5, curve: true },
    cheer:    { lx: -18, rx: 18, y: -4, r: 0, happyArc: true },
    sleep:    { lx: -18, rx: 18, y: 0,  r: 0, closed: true },
    blink:    { lx: -18, rx: 18, y: 0,  r: 0, closed: true },
  };
  const eyes = eyesMap[mood] ?? eyesMap.happy;

  const mouthMap: Record<Mood, React.ReactNode> = {
    happy:    <path d="M 0 16 Q -6 22 -10 18 M 0 16 Q 6 22 10 18" stroke="#2a1028" strokeWidth="2.8" fill="none" strokeLinecap="round"/>,
    waving:   <path d="M 0 16 Q -6 22 -10 18 M 0 16 Q 6 22 10 18" stroke="#2a1028" strokeWidth="2.8" fill="none" strokeLinecap="round"/>,
    thinking: <path d="M -5 19 Q 0 17 5 19" stroke="#2a1028" strokeWidth="2.8" fill="none" strokeLinecap="round"/>,
    cheer:    <path d="M -12 14 Q 0 30 12 14 Z" fill="#2a1028"/>,
    sleep:    <path d="M -4 19 Q 0 21 4 19" stroke="#2a1028" strokeWidth="2.5" fill="none" strokeLinecap="round"/>,
    blink:    <path d="M 0 16 Q -6 22 -10 18 M 0 16 Q 6 22 10 18" stroke="#2a1028" strokeWidth="2.8" fill="none" strokeLinecap="round"/>,
  };

  return (
    <div
      style={{
        width: size,
        height: size,
        position: "relative",
        display: "inline-block",
        animation: animate ? "bobo-float 4.2s ease-in-out infinite" : "none",
      }}
    >
      <svg viewBox="-120 -140 240 260" width={size} height={size} style={{ overflow: "visible" }}>
        <defs>
          <radialGradient id={`${id}-body`} cx="0.35" cy="0.25" r="0.9">
            <stop offset="0%" stopColor={highlight}/>
            <stop offset="35%" stopColor={bodyTop}/>
            <stop offset="75%" stopColor={bodyMid}/>
            <stop offset="100%" stopColor={bodyBottom}/>
          </radialGradient>
          <radialGradient id={`${id}-ear`} cx="0.4" cy="0.3" r="0.9">
            <stop offset="0%" stopColor={bodyTop}/>
            <stop offset="100%" stopColor={bodyMid}/>
          </radialGradient>
          <radialGradient id={`${id}-cheek`} cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor={cheek} stopOpacity="0.85"/>
            <stop offset="100%" stopColor={cheek} stopOpacity="0"/>
          </radialGradient>
          <radialGradient id={`${id}-shine`} cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.95"/>
            <stop offset="100%" stopColor="#fff" stopOpacity="0"/>
          </radialGradient>
        </defs>

        <ellipse cx="0" cy="96" rx="72" ry="10" fill={shadow}/>

        <g
          style={{
            animation: animate ? "bobo-tail 3.4s ease-in-out infinite" : "none",
            transformOrigin: "58px 60px",
          }}
        >
          <path d="M 58 60 C 90 48 102 20 96 -12 C 94 -24 82 -28 78 -16 C 76 -4 86 6 76 22 C 68 38 56 48 44 56 Z" fill={`url(#${id}-body)`}/>
          <path d="M 62 58 C 85 48 96 26 92 0" stroke={highlight} strokeWidth="3" fill="none" opacity="0.4" strokeLinecap="round"/>
        </g>

        <g
          style={{
            animation: animate ? "bobo-squish 3.6s ease-in-out infinite" : "none",
            transformOrigin: "center",
          }}
        >
          <g>
            <path d="M -72 -52 L -88 -108 Q -88 -112 -82 -110 L -44 -82 Z" fill={`url(#${id}-ear)`}/>
            <path d="M -72 -56 L -80 -96 Q -80 -98 -76 -96 L -52 -78 Z" fill={earInner} opacity="0.75"/>
            <path d="M 72 -52 L 88 -108 Q 88 -112 82 -110 L 44 -82 Z" fill={`url(#${id}-ear)`}/>
            <path d="M 72 -56 L 80 -96 Q 80 -98 76 -96 L 52 -78 Z" fill={earInner} opacity="0.75"/>
          </g>

          <path
            d="M 0 -88
               C 56 -88  94 -52  94 -4
               C 94 48  60 90  0  90
               C -60 90 -94 48 -94 -4
               C -94 -52 -56 -88 0 -88 Z"
            fill={`url(#${id}-body)`}
          />

          <ellipse cx="0" cy="56" rx="42" ry="26" fill={tummy} opacity="0.55"/>

          <path d="M -72 -48 C -55 -82 -20 -92 10 -90" stroke={highlight} strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.55"/>
          <ellipse cx="-24" cy="-58" rx="30" ry="14" fill={`url(#${id}-shine)`} opacity="0.9"/>

          <ellipse cx="-48" cy="14" rx="16" ry="10" fill={`url(#${id}-cheek)`}/>
          <ellipse cx="48" cy="14" rx="16" ry="10" fill={`url(#${id}-cheek)`}/>

          {eyes.closed ? (
            <>
              <path d={`M ${eyes.lx - 9} ${eyes.y} Q ${eyes.lx} ${eyes.y + 5} ${eyes.lx + 9} ${eyes.y}`} stroke="#1a1420" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
              <path d={`M ${eyes.rx - 9} ${eyes.y} Q ${eyes.rx} ${eyes.y + 5} ${eyes.rx + 9} ${eyes.y}`} stroke="#1a1420" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
            </>
          ) : eyes.happyArc ? (
            <>
              <path d={`M ${eyes.lx - 9} ${eyes.y + 2} Q ${eyes.lx} ${eyes.y - 6} ${eyes.lx + 9} ${eyes.y + 2}`} stroke="#1a1420" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
              <path d={`M ${eyes.rx - 9} ${eyes.y + 2} Q ${eyes.rx} ${eyes.y - 6} ${eyes.rx + 9} ${eyes.y + 2}`} stroke="#1a1420" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
            </>
          ) : eyes.curve ? (
            <>
              <ellipse cx={eyes.lx} cy={eyes.y} rx={eyes.r} ry={eyes.r + 1.5} fill="#1a1420"/>
              <circle cx={eyes.lx + 2} cy={eyes.y - 2} r="1.8" fill="#fff"/>
              <path d={`M ${eyes.rx - 8} ${eyes.y - 2} Q ${eyes.rx} ${eyes.y - 9} ${eyes.rx + 8} ${eyes.y - 2}`} stroke="#1a1420" strokeWidth="3" fill="none" strokeLinecap="round"/>
            </>
          ) : (
            <>
              <ellipse cx={eyes.lx} cy={eyes.y} rx={eyes.r} ry={eyes.r + 1.5} fill="#1a1420"/>
              <ellipse cx={eyes.rx} cy={eyes.y} rx={eyes.r} ry={eyes.r + 1.5} fill="#1a1420"/>
              <circle cx={eyes.lx + 2} cy={eyes.y - 3} r="2" fill="#fff"/>
              <circle cx={eyes.rx + 2} cy={eyes.y - 3} r="2" fill="#fff"/>
            </>
          )}

          <path d="M 0 8 L -6 14 Q 0 18 6 14 Z" fill={nose} stroke="#2a1028" strokeWidth="1.2" strokeLinejoin="round"/>
          <path d="M 0 15 L 0 17" stroke="#2a1028" strokeWidth="2" strokeLinecap="round"/>
          {mouthMap[mood]}

          {!eyes.closed && (
            <g stroke="#2a1028" strokeWidth="1.6" strokeLinecap="round" opacity="0.7" fill="none">
              <path d="M -22 14 L -58 10"/>
              <path d="M -22 18 L -58 20"/>
              <path d="M 22 14 L 58 10"/>
              <path d="M 22 18 L 58 20"/>
            </g>
          )}

          {mood === "cheer" && (
            <path d="M -5 20 Q 0 28 5 20 Q 5 24 0 26 Q -5 24 -5 20 Z" fill={nose}/>
          )}

          {mood === "waving" && (
            <g
              style={{
                animation: animate ? "bobo-wave 1.6s ease-in-out infinite" : "none",
                transformOrigin: "78px 0px",
              }}
            >
              <path d="M 78 14 Q 102 -12 108 -42" stroke={bodyMid} strokeWidth="22" fill="none" strokeLinecap="round"/>
              <circle cx="108" cy="-44" r="16" fill={bodyMid}/>
              <circle cx="103" cy="-50" r="2.5" fill={nose}/>
              <circle cx="113" cy="-50" r="2.5" fill={nose}/>
              <circle cx="108" cy="-36" r="3" fill={nose}/>
            </g>
          )}

          {mood === "thinking" && (
            <g>
              <circle cx="76" cy="-86" r="16" fill="#fff" stroke="#1a1420" strokeWidth="2"/>
              <circle cx="58" cy="-64" r="6" fill="#fff" stroke="#1a1420" strokeWidth="2"/>
              <circle cx="48" cy="-50" r="3" fill="#fff" stroke="#1a1420" strokeWidth="2"/>
              <text x="76" y="-80" textAnchor="middle" fontSize="17" fontWeight="700" fill="#1a1420" fontFamily="system-ui">?</text>
            </g>
          )}

          {mood === "sleep" && (
            <g fill="#1a1420" fontFamily="system-ui" fontWeight="700">
              <text x="64" y="-68" fontSize="22">z</text>
              <text x="86" y="-88" fontSize="15">z</text>
            </g>
          )}

          {hat && <Hat kind={hat} />}
        </g>
      </svg>
    </div>
  );
}

export function BoboHead({ mood = "happy", tint = 18, size = 40, hat }: BoboProps) {
  return <Bobo mood={mood} tint={tint} size={size} animate={false} hat={hat}/>;
}
