"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Bobo } from "../Mascot";
import type { UserType } from "../../lib/data";

// First real moment with Bugsy. The box opens, he rises out and
// stretches awake, types out a greeting, and only then do the CTAs
// appear. Tapping him gives a purr + happy wiggle. A gentle ambient
// pad fades in on the first touch (browser autoplay rules mean we
// can't start audio before a gesture).

// closed:   box sealed (brief)
// sleeping: flaps open, Bugsy VISIBLE asleep with z's (~2s dwell)
// waking:   sits up, sleepy
// stretch:  stretches awake, happy
// greeting: types the hello line
// ready:    CTAs appear
type Phase = "closed" | "sleeping" | "waking" | "stretch" | "greeting" | "ready";
const RANK: Record<Phase, number> = {
  closed: 0,
  sleeping: 1,
  waking: 2,
  stretch: 3,
  greeting: 4,
  ready: 5,
};



// ── Magical nighttime children's room backdrop ───────────────────
export function NightRoomBackdrop({ minimal = false, hideRug = false }: { minimal?: boolean; hideRug?: boolean } = {}) {
  const star5 = (cx: number, cy: number, r: number, fill: string, op: number, key: string) => {
    const ri = r * 0.42;
    let pts = "";
    for (let i = 0; i < 5; i++) {
      const oa = ((i * 72 - 90) * Math.PI) / 180;
      const ia = ((i * 72 - 54) * Math.PI) / 180;
      pts += `${cx + r * Math.cos(oa)},${cy + r * Math.sin(oa)} ${cx + ri * Math.cos(ia)},${cy + ri * Math.sin(ia)} `;
    }
    return <polygon key={key} points={pts.trim()} fill={fill} opacity={op} filter="url(#nr-stk-glow)" />;
  };

  return (
    <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
      <svg width="100%" height="100%" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice"
        style={{ position: "absolute", inset: 0, display: "block" }}>
        <defs>
          {/* Backgrounds */}
          <linearGradient id="nr-bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#16103a" />
            <stop offset="52%"  stopColor="#231648" />
            <stop offset="100%" stopColor="#341e58" />
          </linearGradient>
          <linearGradient id="nr-floor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#3E1E0C" />
            <stop offset="100%" stopColor="#261208" />
          </linearGradient>
          {/* Window sky */}
          <linearGradient id="nr-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#040115" />
            <stop offset="100%" stopColor="#0a0526" />
          </linearGradient>
          {/* Lamp cone */}
          <radialGradient id="nr-lamp-cone" cx="50%" cy="0%" r="100%" fx="50%" fy="0%">
            <stop offset="0%"   stopColor="#FFE580" stopOpacity="0.58" />
            <stop offset="40%"  stopColor="#FFD060" stopOpacity="0.24" />
            <stop offset="100%" stopColor="#FFD060" stopOpacity="0" />
          </radialGradient>
          {/* Moonlight cone */}
          <linearGradient id="nr-moonlight-cone" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#B0D0FF" stopOpacity="0.24" />
            <stop offset="55%"  stopColor="#90B8F0" stopOpacity="0.07" />
            <stop offset="100%" stopColor="#90B8F0" stopOpacity="0" />
          </linearGradient>
          {/* Moon */}
          <radialGradient id="nr-moon" cx="38%" cy="38%" r="65%">
            <stop offset="0%"   stopColor="#FFFAE0" />
            <stop offset="100%" stopColor="#EDD850" />
          </radialGradient>
          {/* Rug rings */}
          <radialGradient id="nr-rug" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#C89EF0" />
            <stop offset="100%" stopColor="#6840A0" />
          </radialGradient>
          {/* Filters */}
          <filter id="nr-warm-blur" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="22" />
          </filter>
          <filter id="nr-glow-md" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="7" />
          </filter>
          <filter id="nr-stk-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="2.8" />
          </filter>
          <filter id="nr-ff-warm">
            <feDropShadow dx="0" dy="0" stdDeviation="3.2" floodColor="#FFE060" floodOpacity="0.85" />
          </filter>
          <filter id="nr-ff-cool">
            <feDropShadow dx="0" dy="0" stdDeviation="3.2" floodColor="#90C0FF" floodOpacity="0.75" />
          </filter>
          <filter id="nr-lamp-blur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
        </defs>

        {/* ── Background + floor ── */}
        <rect x="0" y="0" width="400" height="800" fill="url(#nr-bg)" />
        <rect x="0" y="658" width="400" height="142" fill="url(#nr-floor)" />
        <line x1="0" y1="658" x2="400" y2="658" stroke="#5a3090" strokeWidth="1" opacity="0.18" />
        {/* Floor wood planks */}
        <line x1="0" y1="674" x2="400" y2="674" stroke="#1A0A04" strokeWidth="1.2" opacity="0.55" />
        <line x1="0" y1="692" x2="400" y2="692" stroke="#1A0A04" strokeWidth="1.2" opacity="0.55" />
        <line x1="0" y1="712" x2="400" y2="712" stroke="#1A0A04" strokeWidth="1.2" opacity="0.55" />
        <line x1="130" y1="658" x2="110" y2="800" stroke="#1A0A04" strokeWidth="0.8" opacity="0.28" />
        <line x1="270" y1="658" x2="290" y2="800" stroke="#1A0A04" strokeWidth="0.8" opacity="0.28" />
        {/* Ambient light */}
        {minimal ? (
          <ellipse cx="200" cy="140" rx="240" ry="320"
            fill="rgba(160,200,255,0.06)" filter="url(#nr-warm-blur)" />
        ) : (
          <ellipse cx="200" cy="200" rx="240" ry="310"
            fill="rgba(255,210,60,0.05)" filter="url(#nr-warm-blur)" />
        )}

        {/* ══ WINDOW — top-right (hidden in minimal mode) ══ */}
        {!minimal && (<>
        <rect x="284" y="30" width="112" height="138" rx="14"
          fill="rgba(0,0,0,0.50)" transform="translate(3,3)" />
        <rect x="281" y="27" width="112" height="138" rx="14" fill="#3a2468" />
        <rect x="285" y="31" width="104" height="130" rx="11" fill="url(#nr-sky)" />
        {/* Cross bars */}
        <line x1="337" y1="31" x2="337" y2="161" stroke="#3a2468" strokeWidth="4.5" />
        <line x1="285" y1="96" x2="389" y2="96"  stroke="#3a2468" strokeWidth="4.5" />
        {/* Frame border */}
        <rect x="281" y="27" width="112" height="138" rx="14"
          fill="none" stroke="#5840A0" strokeWidth="4" />
        {/* Sill */}
        <rect x="275" y="161" width="124" height="13" rx="6" fill="#4a3280" />
        {/* Moon glow halo */}
        <circle cx="347" cy="114" r="32" fill="rgba(255,240,140,0.14)" filter="url(#nr-glow-md)" />
        {/* Crescent moon */}
        <circle cx="345" cy="116" r="22" fill="url(#nr-moon)" />
        <circle cx="358" cy="110" r="19" fill="url(#nr-sky)" />
        {/* Curtains */}
        <path d="M281 27 Q268 96 281 165 L296 165 Q281 96 296 27 Z" fill="#7048B8" opacity="0.52" />
        <path d="M393 27 Q406 96 393 165 L378 165 Q393 96 378 27 Z" fill="#7048B8" opacity="0.52" />
        {/* Stars outside window */}
        {[{x:296,y:50,r:1.2,d:6.8,dl:0.4},{x:352,y:44,r:0.9,d:8.2,dl:1.3},
          {x:378,y:62,r:1.1,d:7.0,dl:0.9},{x:316,y:74,r:0.8,d:9.0,dl:2.2},
          {x:372,y:80,r:0.7,d:6.2,dl:3.1},{x:298,y:128,r:1.0,d:7.6,dl:1.7}].map((s,i)=>(
          <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="white" opacity="0.90"
            style={{ animation:`firefly ${s.d}s ease-in-out ${s.dl}s infinite` }} />
        ))}
        </>)}

        {/* ══ HANGING LAMP — top-center (hidden in minimal mode) ══ */}
        {!minimal && (<>
        <line x1="200" y1="0" x2="200" y2="52"
          stroke="#A090C0" strokeWidth="2.2" strokeLinecap="round" opacity="0.62" />
        <ellipse cx="200" cy="53" rx="19" ry="7.5" fill="#D4A830" />
        <path d="M181 53 Q173 75 169 98 Q183 109 200 110 Q217 109 231 98 Q227 75 219 53 Z"
          fill="#F5CA50" />
        <ellipse cx="200" cy="102" rx="31" ry="9.5" fill="#D4A830" />
        {/* Bulb glow */}
        <ellipse cx="200" cy="102" rx="13" ry="6.5" fill="#FFFCB0" opacity="0.95"
          style={{ transformBox:"fill-box", transformOrigin:"center",
            animation:"breath-glow 3.5s ease-in-out infinite" }} />
        {/* Lamp shine */}
        <path d="M186 60 Q195 57 200 60 Q195 72 186 71 Z"
          fill="rgba(255,255,200,0.34)" />
        {/* Light cone — wide warm spotlight to floor */}
        <path d="M172 106 Q100 330 54 590 L346 590 Q374 330 228 106 Z"
          fill="url(#nr-lamp-cone)" />
        <circle cx="200" cy="76" r="58"
          fill="rgba(255,215,60,0.09)" filter="url(#nr-lamp-blur)" />
        </>)}

        {/* ══ MOONLIGHT + BACKGROUND STARS — minimal mode only ══ */}
        {minimal && (<>
        {/* Moonlight cone */}
        <path d="M166 58 Q96 380 60 658 L340 658 Q374 380 234 58 Z"
          fill="url(#nr-moonlight-cone)" />
        {/* Moon outer halo */}
        <circle cx="200" cy="55" r="85" fill="rgba(180,220,255,0.09)" filter="url(#nr-glow-md)" />
        <circle cx="200" cy="55" r="52" fill="rgba(210,235,255,0.07)" filter="url(#nr-glow-md)" />
        {/* Crescent moon */}
        <circle cx="200" cy="55" r="34" fill="#FFF6D8" />
        <circle cx="218" cy="48" r="29" fill="#16103a" />
        {/* Moon surface craters */}
        <circle cx="188" cy="46" r="4.5" fill="rgba(210,195,155,0.30)" />
        <circle cx="196" cy="63" r="3"   fill="rgba(210,195,155,0.24)" />
        {/* Background stars scattered across sky */}
        {[
          {x: 18,y: 82,r:1.5,d:7.2,dl:0.2},{x: 52,y: 38,r:1.1,d:8.8,dl:1.5},
          {x: 88,y: 60,r:1.7,d:6.5,dl:0.8},{x:132,y: 34,r:1.0,d:9.2,dl:2.3},
          {x:158,y: 72,r:1.3,d:7.8,dl:1.1},{x:248,y: 50,r:1.6,d:8.0,dl:0.5},
          {x:280,y: 30,r:1.0,d:7.4,dl:3.0},{x:316,y: 64,r:1.4,d:6.8,dl:1.8},
          {x:358,y: 42,r:1.7,d:9.0,dl:0.3},{x:384,y: 80,r:1.0,d:8.2,dl:2.6},
          {x: 28,y:154,r:1.2,d:7.6,dl:1.4},{x: 72,y:194,r:1.5,d:8.4,dl:0.7},
          {x:118,y:136,r:0.9,d:6.8,dl:3.2},{x:164,y:174,r:1.3,d:7.2,dl:1.9},
          {x:224,y:124,r:1.7,d:8.8,dl:0.6},{x:268,y:160,r:1.1,d:7.0,dl:2.4},
          {x:320,y:114,r:1.4,d:9.4,dl:1.1},{x:370,y:150,r:1.0,d:7.8,dl:3.5},
          {x: 48,y:264,r:1.2,d:8.0,dl:2.0},{x:142,y:300,r:1.5,d:7.4,dl:0.9},
          {x:354,y:246,r:1.3,d:6.6,dl:1.6},{x:390,y:294,r:0.9,d:8.6,dl:2.8},
          {x:100,y:352,r:1.1,d:7.2,dl:1.3},{x:300,y:344,r:1.4,d:8.4,dl:0.4},
          {x: 22,y:420,r:1.0,d:9.0,dl:2.1},{x:380,y:410,r:1.2,d:7.6,dl:1.0},
        ].map((s,i)=>(
          <circle key={`bgs-${i}`} cx={s.x} cy={s.y} r={s.r} fill="white" opacity="0.80"
            filter="url(#nr-ff-cool)"
            style={{ animation:`firefly ${s.d}s ease-in-out ${s.dl}s infinite` }} />
        ))}
        {/* ══ CLOUDS — animated drift ══ */}
        {/* Cloud 1 — upper-left corner, half off-screen */}
        <g style={{ animation:"cloud-drift 9s ease-in-out 0s infinite" }} opacity="0.42">
          <ellipse cx="14"  cy="162" rx="38" ry="14" fill="#cde0f2" />
          <circle cx="-8"   cy="150" r="14" fill="#cde0f2" />
          <circle cx="14"   cy="145" r="19" fill="#cde0f2" />
          <circle cx="38"   cy="151" r="14" fill="#cde0f2" />
        </g>
        {/* Cloud 2 — upper-right corner, half off-screen */}
        <g style={{ animation:"cloud-drift 13s ease-in-out 2.8s infinite" }} opacity="0.44">
          <ellipse cx="390" cy="108" rx="58" ry="21" fill="#cde0f2" />
          <circle cx="356"  cy="91"  r="19" fill="#cde0f2" />
          <circle cx="382"  cy="85"  r="27" fill="#cde0f2" />
          <circle cx="412"  cy="92"  r="21" fill="#cde0f2" />
        </g>
        {/* Cloud 3 — lower-left corner, above CTA */}
        <g style={{ animation:"cloud-drift 11s ease-in-out 5s infinite" }} opacity="0.38">
          <ellipse cx="8"   cy="622" rx="50" ry="18" fill="#c8dcea" />
          <circle cx="-18"  cy="608" r="18" fill="#c8dcea" />
          <circle cx="6"    cy="602" r="24" fill="#c8dcea" />
          <circle cx="34"   cy="609" r="18" fill="#c8dcea" />
        </g>
        </>)}

        {/* ══ CAT POSTER — upper-left ══ */}
        {!minimal && (<>
        <rect x="18" y="106" width="76" height="92" rx="9"
          fill="rgba(0,0,0,0.45)" transform="translate(4,4)" />
        <rect x="18" y="106" width="76" height="92" rx="9" fill="#4A3898" />
        <rect x="22" y="110" width="68" height="84" rx="7" fill="#6A58B8" />
        <rect x="25" y="113" width="62" height="78" rx="6" fill="#F5EAD8" />
        <circle cx="56" cy="145" r="23" fill="#F0C898" />
        <polygon points="37,131 42,114 52,128" fill="#F0C898" />
        <polygon points="60,128 70,114 75,131" fill="#F0C898" />
        <polygon points="39,130 43,117 50,128" fill="#FFB6C1" />
        <polygon points="62,128 69,117 73,130" fill="#FFB6C1" />
        <ellipse cx="48" cy="141" rx="4.2" ry="4.8" fill="#2a1a40" />
        <ellipse cx="64" cy="141" rx="4.2" ry="4.8" fill="#2a1a40" />
        <circle cx="49.5" cy="139" r="1.6" fill="white" />
        <circle cx="65.5" cy="139" r="1.6" fill="white" />
        <path d="M53 148 L56 151 L59 148 L56 146 Z" fill="#FF9999" />
        <path d="M53 151 Q56 155 59 151" stroke="#D08080" strokeWidth="1.2"
          fill="none" strokeLinecap="round" />
        <line x1="33" y1="147" x2="50" y2="148" stroke="#B09070" strokeWidth="0.9" opacity="0.56" />
        <line x1="33" y1="150" x2="50" y2="150" stroke="#B09070" strokeWidth="0.9" opacity="0.56" />
        <line x1="62" y1="148" x2="79" y2="147" stroke="#B09070" strokeWidth="0.9" opacity="0.56" />
        <line x1="62" y1="150" x2="79" y2="150" stroke="#B09070" strokeWidth="0.9" opacity="0.56" />
        <circle cx="41" cy="146" r="5.5" fill="#FFB6C1" opacity="0.32" />
        <circle cx="71" cy="146" r="5.5" fill="#FFB6C1" opacity="0.32" />
        </>)}

        {/* ══ WALL STAR STICKERS ══ */}
        {!minimal && (<>
        {star5(12,  258, 8,  "#FFE060", 0.54, "ws1")}
        {star5( 8,  348, 6,  "#C0A0FF", 0.44, "ws2")}
        {star5(14,  464, 7,  "#80D8FF", 0.38, "ws3")}
        {star5(386, 222, 8,  "#FFE060", 0.54, "ws4")}
        {star5(388, 354, 6,  "#FF90C0", 0.44, "ws5")}
        {star5(390, 490, 7,  "#90FF90", 0.38, "ws6")}
        {star5( 46,  44, 5,  "#FFE4A0", 0.32, "ws7")}
        {star5(162,  28, 4,  "#B6D4FF", 0.28, "ws8")}
        {star5(240,  24, 5,  "#FFB6C1", 0.30, "ws9")}
        </>)}

        {/* ══ ROUND RUG — center floor ══ */}
        {!hideRug && (<>
        <ellipse cx="200" cy="655" rx="170" ry="65" fill="#4A0810" opacity="0.92" />
        <ellipse cx="200" cy="653" rx="153" ry="59" fill="#720F18" opacity="0.92" />
        <ellipse cx="200" cy="651" rx="136" ry="53" fill="#921820" opacity="0.90" />
        <ellipse cx="200" cy="649" rx="119" ry="46" fill="#AE2028" opacity="0.88" />
        <ellipse cx="200" cy="647" rx="103" ry="40" fill="#C43040" opacity="0.86" />
        <ellipse cx="200" cy="646" rx="86"  ry="34" fill="#D44858" opacity="0.84" />
        <ellipse cx="200" cy="645" rx="69"  ry="28" fill="#E06070" opacity="0.82" />
        <ellipse cx="200" cy="644" rx="53"  ry="21" fill="#E87888" opacity="0.80" />
        <ellipse cx="200" cy="643" rx="36"  ry="15" fill="#F098A8" opacity="0.78" />
        <ellipse cx="200" cy="642" rx="19"  ry="9"  fill="#F8BEC8" opacity="0.74" />
        </>)}

        {/* ══ BOOKSHELF, CAT TREE, TOY BLOCKS — hidden in minimal mode ══ */}
        {!minimal && (<>
        <g transform="translate(18, -60)">
        <rect x="0" y="548" width="88" height="152" rx="6" fill="#1e1240" opacity="0.90" />
        <rect x="0" y="597" width="88" height="8" rx="2" fill="#3e2870" />
        <rect x="0" y="652" width="88" height="8" rx="2" fill="#3e2870" />
        {[{x:3,y:556,w:15,h:41,c:"#FF7E7E"},{x:20,y:558,w:13,h:39,c:"#7EC8FF"},
          {x:35,y:553,w:17,h:44,c:"#FFD080"},{x:54,y:556,w:14,h:41,c:"#80FFA0"},
          {x:70,y:554,w:16,h:43,c:"#D080FF"}].map((b,i)=>(
          <rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} rx="2.5" fill={b.c} />
        ))}
        {[{x:3,y:609,w:13,h:43,c:"#FF90C0"},{x:18,y:606,w:16,h:46,c:"#60D8F0"},
          {x:36,y:610,w:14,h:42,c:"#FFA060"},{x:52,y:607,w:15,h:45,c:"#90E080"},
          {x:69,y:609,w:17,h:43,c:"#C8A0FF"}].map((b,i)=>(
          <rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} rx="2.5" fill={b.c} />
        ))}
        <path d="M26 554 Q23 536 28 531 L52 531 Q57 536 52 554 Z" fill="#D4580A" />
        <rect x="20" y="548" width="38" height="8" rx="4" fill="#E86818" />
        <ellipse cx="38" cy="531" rx="12" ry="4" fill="#6B2C00" />
        <path d="M38 530 Q58 506 66 514 Q59 526 38 530 Z" fill="#4CAF50" opacity="0.92" />
        <path d="M38 526 Q16 502 8 512 Q16 524 38 526 Z" fill="#388E3C" opacity="0.92" />
        <path d="M40 518 Q52 492 40 482 Q32 502 40 518 Z" fill="#66BB6A" opacity="0.88" />
        <path d="M36 520 Q20 494 26 482 Q34 502 36 520 Z" fill="#81C784" opacity="0.75" />
        </g>
        <g transform="translate(-28, -35)">
        <rect x="320" y="649" width="80" height="15" rx="7" fill="#5A2080" />
        <rect x="343" y="464" width="24" height="185" rx="8" fill="#8B6040" />
        {Array.from({ length: 15 }).map((_, i) => (
          <rect key={`rope-${i}`} x="343" y={464 + i * 12} width="24" height="6" rx="2" fill="#6B4030" opacity="0.55" />
        ))}
        <ellipse cx="355" cy="480" rx="48" ry="17" fill="#7A18A0" opacity="0.90" />
        <ellipse cx="355" cy="475" rx="48" ry="15" fill="#B040C8" />
        <ellipse cx="347" cy="468" rx="18" ry="5" fill="rgba(255,255,255,0.18)" />
        <circle cx="308" cy="650" r="22" fill="#5030B0" />
        <circle cx="300" cy="642" r="8" fill="rgba(255,255,255,0.22)" />
        </g>
        <rect x="80"  y="594" width="30" height="30" rx="6" fill="#FFD080" />
        <path d="M80 594 L88 584 L110 584 L110 594 Z" fill="#FFE4A0" />
        <text x="95" y="614" textAnchor="middle" fill="white" fontSize="13"
          fontWeight="800" fontFamily="sans-serif" opacity="0.88">C</text>
        <rect x="70"  y="622" width="42" height="42" rx="7" fill="#FF8A65" />
        <path d="M70 622 L84 611 L112 611 L112 622 Z" fill="#FFA082" />
        <text x="91" y="649" textAnchor="middle" fill="white" fontSize="17"
          fontWeight="800" fontFamily="sans-serif" opacity="0.88">A</text>
        <rect x="50"  y="640" width="34" height="34" rx="6" fill="#7EC8FF" />
        <path d="M50 640 L60 629 L84 629 L84 640 Z" fill="#A0DAFF" />
        <text x="67" y="662" textAnchor="middle" fill="white" fontSize="14"
          fontWeight="800" fontFamily="sans-serif" opacity="0.88">B</text>
        </>)}


        {/* ══ FLOATING STAR PARTICLES ══ */}
        {[
          {x: 76,y:148,r:3.8,f:"#FFE27A",fi:"nr-ff-warm",d:7.0,dl:0.0},
          {x:134,y:220,r:3.2,f:"#FFE27A",fi:"nr-ff-warm",d:8.2,dl:1.4},
          {x:190,y:108,r:2.8,f:"#C0E4FF",fi:"nr-ff-cool",d:6.8,dl:2.6},
          {x:248,y:172,r:4.2,f:"#FFE27A",fi:"nr-ff-warm",d:9.0,dl:0.8},
          {x:308,y:132,r:3.4,f:"#E0C0FF",fi:"nr-ff-cool",d:7.8,dl:3.2},
          {x:106,y:332,r:2.8,f:"#FFE27A",fi:"nr-ff-warm",d:8.4,dl:2.0},
          {x:282,y:308,r:3.2,f:"#C0FFE0",fi:"nr-ff-cool",d:7.2,dl:1.1},
          {x:206,y:268,r:2.4,f:"#FFE27A",fi:"nr-ff-warm",d:9.2,dl:3.6},
          {x: 48,y:420,r:3.2,f:"#FFD0A0",fi:"nr-ff-warm",d:8.8,dl:0.5},
          {x:352,y:396,r:2.4,f:"#C0E0FF",fi:"nr-ff-cool",d:7.5,dl:2.9},
          {x:166,y:396,r:2.8,f:"#FFE27A",fi:"nr-ff-warm",d:9.6,dl:4.0},
          {x:242,y:444,r:3.2,f:"#FFB0D0",fi:"nr-ff-cool",d:6.9,dl:1.8},
          {x:354,y:190,r:2.8,f:"#FFE27A",fi:"nr-ff-warm",d:7.4,dl:0.9},
          {x: 30,y:284,r:2.4,f:"#C0FFFF",fi:"nr-ff-cool",d:8.2,dl:1.7},
          {x:368,y:264,r:2.4,f:"#FFE060",fi:"nr-ff-warm",d:6.8,dl:3.5},
          {x:118,y:494,r:2.8,f:"#FFE27A",fi:"nr-ff-warm",d:7.6,dl:2.3},
          {x:298,y:504,r:2.4,f:"#D0C0FF",fi:"nr-ff-cool",d:8.6,dl:0.7},
        ].map((p,i)=>(
          <circle key={i} cx={p.x} cy={p.y} r={p.r} fill={p.f}
            filter={`url(#${p.fi})`}
            style={{ animation:`firefly ${p.d}s ease-in-out ${p.dl}s infinite` }} />
        ))}
      </svg>
    </div>
  );
}


export function WhoAreYou({
  tint,
  onPick,
}: {
  tint: number;
  onPick: (t: UserType) => void;
}) {
  const [phase, setPhase] = useState<Phase>("closed");
  const [wiggleKey, setWiggleKey] = useState(0);
  const [showLine2, setShowLine2] = useState(false);
  const audioRef = useRef<AudioContext | null>(null);
  const padRef = useRef<{ stop: () => void } | null>(null);

  // Staggered reveal: header(0.1s) → bugsy(1.4s) → bubble line1(2.4s) → line2(3.1s) → CTA(4.4s)
  useEffect(() => {
    const t1  = window.setTimeout(() => setPhase("greeting"), 2400);
    const t1b = window.setTimeout(() => setShowLine2(true),   3100);
    const t2  = window.setTimeout(() => setPhase("ready"),    4400);
    return () => { clearTimeout(t1); clearTimeout(t1b); clearTimeout(t2); };
  }, []);

  // Auto-bounce Bugsy when he starts speaking
  useEffect(() => {
    if (phase === "greeting") setWiggleKey((k) => k + 1);
  }, [phase]);

  const rank = RANK[phase];
  const showText = rank >= RANK.greeting;
  const showCTA = phase === "ready";

  // ── Audio ────────────────────────────────────────────────
  const ensureAudio = useCallback(() => {
    if (audioRef.current) return audioRef.current;
    try {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      audioRef.current = new AC();
    } catch {
      // audio optional
    }
    return audioRef.current;
  }, []);

  const playPurr = useCallback(() => {
    const ctx = ensureAudio();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.value = 58;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 220;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.07, now + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.1);
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 22;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.04;
    lfo.connect(lfoGain).connect(gain.gain);
    osc.connect(filter).connect(gain).connect(ctx.destination);
    osc.start(now);
    lfo.start(now);
    osc.stop(now + 1.15);
    lfo.stop(now + 1.15);
  }, [ensureAudio]);

  const startPad = useCallback(() => {
    const ctx = ensureAudio();
    if (!ctx || padRef.current) return;
    const now = ctx.currentTime;
    const master = ctx.createGain();
    master.gain.setValueAtTime(0.0001, now);
    master.gain.exponentialRampToValueAtTime(0.045, now + 2.5);
    master.connect(ctx.destination);
    const oscs = [220, 277.2, 329.6].map((f) => {
      const o = ctx.createOscillator();
      o.type = "sine";
      o.frequency.value = f;
      const g = ctx.createGain();
      g.gain.value = 0.33;
      o.connect(g).connect(master);
      o.start(now);
      return o;
    });
    padRef.current = {
      stop: () => {
        const t = ctx.currentTime;
        master.gain.exponentialRampToValueAtTime(0.0001, t + 1);
        oscs.forEach((o) => o.stop(t + 1.1));
      },
    };
  }, [ensureAudio]);

  useEffect(() => {
    return () => {
      padRef.current?.stop();
      const ctx = audioRef.current;
      if (ctx && ctx.state !== "closed") {
        window.setTimeout(() => ctx.close().catch(() => {}), 1300);
      }
    };
  }, []);

  const onPet = useCallback(() => {
    // Tapping early skips Bugsy straight to greeting (text types,
    // then CTAs). Always purr + wiggle + kick off the ambient pad.
    setPhase((p) => (RANK[p] < RANK.greeting ? "greeting" : p));
    ensureAudio();
    startPad();
    playPurr();
    setWiggleKey((k) => k + 1);
  }, [ensureAudio, startPad, playPurr]);

  const pick = (t: UserType) => {
    padRef.current?.stop();
    onPick(t);
  };

  const bugsyWiggleAnim = wiggleKey > 0
    ? "bugsy-wiggle 0.6s ease-in-out"
    : "bobo-enter 1.0s cubic-bezier(0.22, 1, 0.36, 1) 1.4s both";

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        boxSizing: "border-box",
        color: "#fff",
      }}
    >
      <NightRoomBackdrop minimal hideRug />


      {/* ── HEADER ─────────────────────────────────────────────── */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          textAlign: "center",
          padding: "110px 24px 0",
          width: "100%",
          animation: "fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both",
        }}
      >
        {/* Stars flanking "Yay!" */}
        <div style={{ position: "relative", display: "inline-block" }}>
          <span aria-hidden style={{
            position: "absolute",
            left: -36,
            top: "10%",
            fontSize: 26,
            animation: "float-gentle 2.8s ease-in-out infinite",
            filter: "drop-shadow(0 0 6px rgba(255,210,50,0.9))",
          }}>⭐</span>
          <h1
            style={{
              fontFamily: "var(--font-nunito), system-ui",
              fontSize: 56,
              fontWeight: 900,
              color: "#FFD234",
              margin: "0 0 8px",
              letterSpacing: "0.02em",
              textShadow:
                "0 0 8px rgba(255,200,30,1), 0 0 22px rgba(255,180,0,0.90), 0 0 48px rgba(255,160,0,0.60), 0 4px 0 rgba(160,80,0,0.35)",
              animation: "yay-glow-pulse 2.4s ease-in-out infinite",
              lineHeight: 1,
            }}
          >
            Yay!
          </h1>
          <span aria-hidden style={{
            position: "absolute",
            right: -32,
            top: "10%",
            fontSize: 22,
            animation: "float-gentle 3.2s ease-in-out 0.5s infinite",
            filter: "drop-shadow(0 0 6px rgba(255,210,50,0.9))",
          }}>⭐</span>
        </div>
        <p
          style={{
            fontFamily: "var(--font-nunito), system-ui",
            fontSize: 20,
            fontWeight: 700,
            color: "#ffffff",
            margin: 0,
            lineHeight: 1.35,
            textShadow: "0 1px 12px rgba(180,160,255,0.45)",
          }}
        >
          Bugsy is so happy<br />you said hello!
        </p>
      </div>

      {/* ── MIDDLE SCENE ────────────────────────────────────────── */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          flex: 1,
          width: "100%",
          minHeight: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Floating hearts — positions matching reference */}
        <span aria-hidden style={{ position: "absolute", top: "12%", right: "10%", fontSize: 32, animation: "float-gentle 2.6s ease-in-out infinite",         zIndex: 3, pointerEvents: "none" }}>🩷</span>
        <span aria-hidden style={{ position: "absolute", top: "36%", right: "6%",  fontSize: 20, animation: "float-gentle 3.1s ease-in-out 0.6s infinite",   zIndex: 3, pointerEvents: "none" }}>💗</span>
        <span aria-hidden style={{ position: "absolute", top: "58%", right: "14%", fontSize: 14, animation: "float-gentle 2.8s ease-in-out 1.1s infinite",   zIndex: 3, pointerEvents: "none" }}>🩷</span>
        <span aria-hidden style={{ position: "absolute", top: "50%", left:  "7%",  fontSize: 14, animation: "float-gentle 3.3s ease-in-out 0.3s infinite",   zIndex: 3, pointerEvents: "none" }}>💗</span>
        <span aria-hidden style={{ position: "absolute", top: "68%", left:  "12%", fontSize: 11, animation: "float-gentle 2.9s ease-in-out 1.5s infinite",   zIndex: 3, pointerEvents: "none" }}>🩷</span>

        {/* Circular glow mat under Bugsy */}
        <div aria-hidden style={{
          position: "absolute",
          bottom: "8%",
          left: "50%",
          transform: "translateX(-10%)",
          width: 220,
          height: 72,
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(210,30,55,0.82) 0%, rgba(170,15,38,0.58) 42%, rgba(130,0,25,0.18) 72%, transparent 100%)",
          zIndex: 0,
          pointerEvents: "none",
          filter: "blur(2px)",
        }} />


        {/* Speech bubble + Bugsy in a centered flex row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, zIndex: 2, position: "relative" }}>

          {/* Speech bubble on the left */}
          {showText && (
            <div
              style={{
                flexShrink: 0,
                maxWidth: 148,
                padding: "14px 18px 12px",
                borderRadius: 22,
                background: "#fff8f0",
                boxShadow: "0 8px 28px rgba(0,0,0,0.32), 0 2px 8px rgba(0,0,0,0.14)",
                animation: "bubble-pop 0.4s cubic-bezier(0.22, 1.5, 0.36, 1)",
                position: "relative",
                marginRight: 8,
              }}
            >
              <p style={{ fontFamily: "var(--font-nunito), system-ui", fontSize: 19, fontWeight: 800, color: "#7C3AED", margin: "0 0 2px", lineHeight: 1.3 }}>Yay! 💜</p>
              <p style={{ fontFamily: "var(--font-nunito), system-ui", fontSize: 19, fontWeight: 800, color: "#1e1430", margin: "0 0 6px", lineHeight: 1.3 }}>
                {["Let's", "play", "together!"].map((word, i) => (
                  <span
                    key={i}
                    style={{
                      display: "inline-block",
                      marginRight: i < 2 ? "0.28em" : 0,
                      opacity: 0,
                      animation: showLine2
                        ? `word-pop 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 220}ms forwards`
                        : "none",
                    }}
                  >
                    {word}
                  </span>
                ))}
              </p>
              <p style={{ textAlign: "center", margin: 0, fontSize: 22, lineHeight: 1, opacity: 0, animation: showLine2 ? `word-pop 0.4s ease ${3 * 220}ms forwards` : "none" }}>💜</p>
              {/* Triangle tail pointing right toward Bugsy */}
              <div style={{
                position: "absolute",
                right: -13,
                top: "50%",
                transform: "translateY(-50%)",
                width: 0,
                height: 0,
                borderTop: "11px solid transparent",
                borderBottom: "11px solid transparent",
                borderLeft: "14px solid #fff8f0",
              }} />
            </div>
          )}

          {/* Bugsy */}
          <div
            onPointerDown={onPet}
            role="button"
            aria-label="Pet Bugsy"
            style={{ flexShrink: 0, cursor: "pointer", touchAction: "manipulation" }}
          >
            <div
              key={`bugsy-${wiggleKey}`}
              style={{ animation: bugsyWiggleAnim, transformOrigin: "bottom center" }}
            >
              <Bobo mood="excited" tint={tint} size={200} tailWag />
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM CARD ─────────────────────────────────────────── */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          background: "#f2ede4",
          borderRadius: "26px 26px 0 0",
          padding: "16px 12px 20px",
          boxSizing: "border-box",
          opacity: showCTA ? 1 : 0,
          transform: showCTA ? "translateY(0)" : "translateY(28px)",
          transition: "opacity 0.5s ease, transform 0.5s ease",
          pointerEvents: showCTA ? "auto" : "none",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-nunito), system-ui",
            fontSize: 17,
            fontWeight: 800,
            color: "#1e1430",
            textAlign: "center",
            margin: "0 0 12px",
          }}
        >
          Who&apos;s joining me today? 💜
        </p>

        <div style={{ display: "flex", gap: 10 }}>

          {/* ── It's Me (child) ── */}
          <button
            onClick={() => pick("child")}
            style={{
              flex: 1,
              borderRadius: 18,
              background: "linear-gradient(168deg, #7C52D9 0%, #5A24C0 100%)",
              border: "none",
              cursor: "pointer",
              padding: "12px 8px 10px",
              minHeight: 188,
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 6px 22px rgba(90,36,192,0.50)",
              touchAction: "manipulation",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <span aria-hidden style={{ position: "absolute", top: 10, left: 14, fontSize: 14, opacity: 0.90 }}>⭐</span>
            <span aria-hidden style={{ position: "absolute", top: 28, right: 12, fontSize: 10, opacity: 0.82 }}>⭐</span>
            <span aria-hidden style={{ position: "absolute", top: 12, right: 30, fontSize: 11, opacity: 0.76 }}>⭐</span>
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{
                width: 68, height: 68, borderRadius: "50%",
                background: "#F5EFE6",
                boxShadow: "0 4px 14px rgba(0,0,0,0.18)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 42, lineHeight: 1,
              }}>👧</div>
            </div>
            <div style={{ width: "100%", background: "#4A18A8", borderRadius: 13, padding: "10px 8px", marginTop: 2 }}>
              <span style={{ fontFamily: "var(--font-nunito), system-ui", fontSize: 17, fontWeight: 900, color: "white" }}>It&apos;s Me</span>
            </div>
          </button>

          {/* ── A Grown-up Is Helping (parent) ── */}
          <button
            onClick={() => pick("parent")}
            style={{
              flex: 1,
              borderRadius: 18,
              background: "linear-gradient(168deg, #F5BA20 0%, #D99000 100%)",
              border: "none",
              cursor: "pointer",
              padding: "12px 6px 10px",
              minHeight: 188,
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 6px 22px rgba(217,144,0,0.50)",
              touchAction: "manipulation",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <span aria-hidden style={{ position: "absolute", top: 10, left: 14, fontSize: 14, opacity: 0.90 }}>⭐</span>
            <span aria-hidden style={{ position: "absolute", top: 26, right: 12, fontSize: 10, opacity: 0.82 }}>⭐</span>
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
              <div style={{
                width: 68, height: 68, borderRadius: "50%",
                background: "#F5EFE6",
                boxShadow: "0 4px 14px rgba(0,0,0,0.18)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 42, lineHeight: 1,
              }}>👩</div>
              <div style={{ fontSize: 18, opacity: 0.85 }}>💛</div>
              <div style={{
                width: 68, height: 68, borderRadius: "50%",
                background: "#F5EFE6",
                boxShadow: "0 4px 14px rgba(0,0,0,0.18)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 42, lineHeight: 1,
              }}>👨</div>
            </div>
            <div style={{ width: "100%", background: "#C07800", borderRadius: 13, padding: "8px 6px", marginTop: 2 }}>
              <span style={{ fontFamily: "var(--font-nunito), system-ui", fontSize: 14, fontWeight: 900, color: "white", lineHeight: 1.35, display: "block" }}>
                A Grown-up<br />Is Helping
              </span>
            </div>
          </button>
        </div>

        {/* Pagination dots */}
      </div>
    </div>
  );
}
