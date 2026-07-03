"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Bobo } from "../Mascot";
import { NightRoomBackdrop } from "./WhoAreYou";
import { Typewriter } from "../Typewriter";

// ── Ambient music via Web Audio API ─────────────────────────────
function useAmbientMusic() {
  const ctxRef     = useRef<AudioContext | null>(null);
  const masterRef  = useRef<GainNode | null>(null);
  const startedRef = useRef(false);
  const [on, setOn] = useState(true);

  const startAudio = useCallback(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const AudioCtx = (window as any).AudioContext ?? (window as any).webkitAudioContext;
    if (!AudioCtx) return;

    const ctx: AudioContext = new AudioCtx();
    ctxRef.current = ctx;

    const master = ctx.createGain();
    master.gain.setValueAtTime(0, ctx.currentTime);
    master.gain.linearRampToValueAtTime(0.22, ctx.currentTime + 4);
    master.connect(ctx.destination);
    masterRef.current = master;

    // Slow breathing LFO — gentle volume swell
    const lfo     = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.07;
    lfoGain.gain.value  = 0.025;
    lfo.connect(lfoGain);
    lfoGain.connect(master.gain);
    lfo.start();

    // A-minor ambient pad: A2 E3 A3 C4 E4 A4
    ([ [110, 0.12], [164.81, 0.08], [220, 0.07],
       [261.63, 0.05], [329.63, 0.04], [440, 0.025] ] as [number, number][])
      .forEach(([freq, vol]) => {
        const osc = ctx.createOscillator();
        const g   = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;
        g.gain.value = vol;
        osc.connect(g);
        g.connect(master);
        osc.start();
      });
  }, []);

  // Auto-start on first user gesture (browser autoplay policy)
  useEffect(() => {
    const handler = () => startAudio();
    document.addEventListener("pointerdown", handler, { once: true });
    return () => document.removeEventListener("pointerdown", handler);
  }, [startAudio]);

  const toggle = useCallback(() => {
    startAudio(); // no-op if already running
    setOn(prev => {
      const next = !prev;
      if (masterRef.current && ctxRef.current) {
        const t = ctxRef.current.currentTime;
        masterRef.current.gain.cancelScheduledValues(t);
        masterRef.current.gain.setValueAtTime(masterRef.current.gain.value, t);
        masterRef.current.gain.linearRampToValueAtTime(
          next ? 0.22 : 0,
          t + (next ? 1.2 : 0.8),
        );
      }
      return next;
    });
  }, [startAudio]);

  // Cleanup on unmount
  useEffect(() => () => { try { ctxRef.current?.close(); } catch (_) {} }, []);

  return { on, toggle };
}

// ── Purple cloud shape ───────────────────────────────────────────
function Cloud({ size = 1, opacity = 1 }: { size?: number; opacity?: number }) {
  const w = 130 * size, h = 56 * size;
  const c = `rgba(82,68,155,${(0.82 * opacity).toFixed(2)})`;
  const d = `rgba(62,50,128,${(0.88 * opacity).toFixed(2)})`;
  return (
    <div style={{ position: "relative", width: w, height: h, pointerEvents: "none" }}>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: h * 0.56, borderRadius: h * 0.28, background: d }} />
      <div style={{ position: "absolute", bottom: h * 0.34, left: w * 0.06, width: w * 0.35, height: w * 0.35, borderRadius: "50%", background: c }} />
      <div style={{ position: "absolute", bottom: h * 0.42, left: w * 0.24, width: w * 0.46, height: w * 0.46, borderRadius: "50%", background: `rgba(95,80,168,${(0.9 * opacity).toFixed(2)})` }} />
      <div style={{ position: "absolute", bottom: h * 0.34, left: w * 0.58, width: w * 0.32, height: w * 0.32, borderRadius: "50%", background: c }} />
    </div>
  );
}

// ── Splash / teaser screen (shown before Welcome) ────────────────
export function Splash({ onEnter }: { onEnter: () => void }) {
  const { on: musicOn, toggle: toggleMusic } = useAmbientMusic();
  const FF = "var(--font-nunito), system-ui";

  // Each letter: main face color + 5 depth-wall colors (darkest → closest)
  const LETTERS = [
    { char: "F", main: "#FFBA15",
      depths: ["#3D1800", "#5A2400", "#7A3200", "#A04400", "#C45600"] },
    { char: "U", main: "#FF3D72",
      depths: ["#280010", "#44001E", "#680030", "#900040", "#B80050"] },
    { char: "M", main: "#00D4BE",
      depths: ["#001A18", "#002E2A", "#004840", "#006656", "#008470"] },
    { char: "I", main: "#7EB8FF", hasStar: true,
      depths: ["#040E2C", "#0A1A4E", "#122870", "#1C3C98", "#2850C2"] },
  ];

  const STARS = [
    { top: 178, left: "7%",   size: 24, color: "#FFD700", delay: 0.0 },
    { top: 190, right: "5%",  size: 20, color: "#FFD700", delay: 0.3 },
    { top: 290, left: "4%",   size: 13, color: "#FCD34D", delay: 0.6 },
    { top: 278, right: "3%",  size: 16, color: "#C4B5FD", delay: 0.9 },
    { top: 390, left: "12%",  size: 10, color: "#FFF9C4", delay: 0.4 },
    { top: 372, right: "11%", size: 10, color: "#FFF9C4", delay: 0.7 },
  ];

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <NightRoomBackdrop minimal hideRug hideFloor />



      {/* ── Clouds ── */}
      <div style={{ position: "absolute", top: 188, left: -28, zIndex: 3 }}>
        <Cloud size={0.92} opacity={0.78} />
      </div>
      <div style={{ position: "absolute", top: 248, right: -36, zIndex: 3 }}>
        <Cloud size={0.82} opacity={0.68} />
      </div>
      <div style={{ position: "absolute", bottom: 190, left: -44, zIndex: 3 }}>
        <Cloud size={1.05} opacity={0.60} />
      </div>

      {/* ── Music toggle ── */}
      <div
        role="button"
        aria-label={musicOn ? "Mute music" : "Play music"}
        onClick={toggleMusic}
        style={{
          position: "absolute", top: 52, right: 20, zIndex: 10,
          width: 46, height: 46, borderRadius: "50%",
          background: "#6D28D9",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 4px 16px rgba(91,33,182,0.55)",
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
          stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="16" r="3" />
          {!musicOn && <line x1="3" y1="3" x2="21" y2="21" />}
        </svg>
      </div>

      {/* ── FUMI 3D bubble letters ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "absolute", top: 165, left: 0, right: 0, zIndex: 5,
          display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 6,
        }}
      >
        {LETTERS.map((l, i) => (
          <motion.div
            key={l.char}
            initial={{ opacity: 0, y: 44, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.16 + i * 0.09, type: "spring", stiffness: 280, damping: 22 }}
            style={{ position: "relative", display: "inline-block" }}
          >
            {/* 3D wall layers — darkest first (deepest), lightest last (closest face) */}
            {l.depths.map((depthColor, n) => (
              <span
                key={n}
                aria-hidden
                style={{
                  position: "absolute",
                  top: (l.depths.length - n) * 2,
                  left: 0,
                  fontFamily: FF, fontSize: 96, fontWeight: 900, lineHeight: 1,
                  color: depthColor,
                  display: "block", userSelect: "none", pointerEvents: "none",
                  whiteSpace: "nowrap",
                }}
              >{l.char}</span>
            ))}
            {/* Main face with highlight */}
            <span style={{
              position: "relative", zIndex: 6,
              fontFamily: FF, fontSize: 96, fontWeight: 900, lineHeight: 1,
              color: l.main, display: "block",
              textShadow: "-2px -3px 0 rgba(255,255,255,0.32), 1px 1px 0 rgba(255,255,255,0.10)",
              whiteSpace: "nowrap",
            }}>{l.char}</span>
            {l.hasStar && (
              <span style={{
                position: "absolute", top: -22, right: -18,
                fontSize: 26, lineHeight: 1, zIndex: 7, pointerEvents: "none",
              }}>⭐</span>
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* ── Scattered gold / purple stars ── */}
      {STARS.map((s, i) => (
        <motion.span
          key={i}
          animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2.4 + i * 0.25, repeat: Infinity, ease: "easeInOut", delay: s.delay }}
          style={{
            position: "absolute", top: s.top,
            left: (s as { top: number; size: number; color: string; delay: number; left?: string; right?: string }).left,
            right: (s as { top: number; size: number; color: string; delay: number; left?: string; right?: string }).right,
            color: s.color, fontSize: s.size,
            zIndex: 6, pointerEvents: "none", lineHeight: 1,
          }}
        >✦</motion.span>
      ))}

      {/* ── Purple star divider ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.55, type: "spring", stiffness: 280, damping: 18 }}
        style={{
          position: "absolute", top: 278, left: 0, right: 0, zIndex: 5,
          textAlign: "center", color: "#A78BFA", fontSize: 22, lineHeight: 1,
        }}
      >★</motion.div>

      {/* ── Tagline ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.44, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "absolute", top: 308, left: 16, right: 16, zIndex: 5,
          textAlign: "center", fontFamily: FF,
        }}
      >
        <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", lineHeight: 1.45, marginBottom: 3 }}>
          Small adventures.
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.45 }}>
          <span style={{ color: "#FCD34D" }}>Big </span>
          <span style={{ color: "#C084FC" }}>life </span>
          <span style={{ color: "#34D399" }}>skills.</span>
        </div>
      </motion.div>

      {/* ── Gold star between tagline and cat ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, type: "spring", stiffness: 260, damping: 18 }}
        style={{
          position: "absolute", top: 388, left: 0, right: 0, zIndex: 5,
          textAlign: "center", fontSize: 26, lineHeight: 1,
        }}
      >⭐</motion.div>

      {/* ── Ground glow (moonbeam pool) ── */}
      <div style={{
        position: "absolute", bottom: 136, left: "50%",
        transform: "translateX(-50%)",
        width: 240, height: 64, borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(185,165,255,0.38) 0%, rgba(160,140,240,0.14) 55%, transparent 100%)",
        filter: "blur(12px)",
        zIndex: 4, pointerEvents: "none",
      }} />

      {/* ── Bobo cat ── */}
      <div style={{
        position: "absolute", bottom: 140, left: "50%",
        transform: "translateX(-50%)",
        zIndex: 5,
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.78, y: 22 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.32 }}
          style={{ position: "relative" }}
        >
          {/* Cast shadow */}
          <motion.div
            animate={{ scaleX: [1, 0.76, 1], opacity: [0.55, 0.28, 0.55] }}
            transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 1.4 }}
            style={{
              position: "absolute", bottom: 0, left: "50%",
              transform: "translateX(-50%)",
              width: 148, height: 24, borderRadius: "50%",
              background: "rgba(0,0,0,0.62)", filter: "blur(9px)",
              zIndex: 0, pointerEvents: "none",
            }}
          />
          {/* Floating cat with 3D filter */}
          <motion.div
            animate={{ y: [0, -11, 0] }}
            transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 1.4 }}
            style={{
              position: "relative", zIndex: 1,
              filter: "drop-shadow(0 14px 22px rgba(0,0,0,0.68)) drop-shadow(0 0 18px rgba(167,139,250,0.48))",
            }}
          >
            <Bobo mood="happy" tint={280} size={220} animate tailWag />
          </motion.div>
        </motion.div>
      </div>

      {/* ── CTA button ── */}
      <div style={{
        position: "absolute", bottom: 42, left: 20, right: 20, zIndex: 10,
      }}>
        <motion.button
          onClick={onEnter}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.66, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          whileTap={{ scale: 0.975 }}
          style={{
            position: "relative", overflow: "hidden",
            width: "100%", height: 64, borderRadius: 32,
            background: "linear-gradient(180deg, #9A6CE6 0%, #7C3AED 100%)",
            border: "none", cursor: "pointer",
            fontFamily: FF, fontSize: 19, fontWeight: 900, color: "#fff",
            letterSpacing: "0.02em",
            boxShadow: "0 7px 0 #5018B8, 0 12px 36px rgba(109,40,217,0.58)",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            touchAction: "manipulation",
          }}
        >
          <motion.span
            aria-hidden
            animate={{ x: ["-120%", "220%"] }}
            transition={{ duration: 1.7, repeat: Infinity, repeatDelay: 2.2, ease: "easeInOut" }}
            style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.20) 50%, transparent 65%)",
              borderRadius: 32, pointerEvents: "none",
            }}
          />
          Start Your Adventure
          <motion.span
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1.0, repeat: Infinity, repeatDelay: 1.2, ease: "easeInOut" }}
            style={{ fontSize: 20, lineHeight: 1, fontWeight: 400, display: "inline-block" }}
          >→</motion.span>
        </motion.button>
      </div>

    </div>
  );
}

// ── The welcome screen ───────────────────────────────────────────
export function Welcome({
  tint,
  onGetStarted,
  onHaveAccount,
}: {
  tint: number;
  onGetStarted: () => void;
  onHaveAccount: () => void;
}) {
  void onHaveAccount;
  const [introPhase, setIntroPhase] = useState(0);
  const [burstActive, setBurstActive] = useState(false);
  const { on: musicOn, toggle: toggleMusic } = useAmbientMusic();

  useEffect(() => {
    const t = setTimeout(() => setIntroPhase(1), 1150);
    return () => clearTimeout(t);
  }, []);

  // paw tapped → play high-five burst, then navigate after 950ms
  const handlePawTap = useCallback(() => {
    if (introPhase !== 4 || burstActive) return;
    setBurstActive(true);
    setTimeout(() => onGetStarted(), 950);
  }, [introPhase, burstActive, onGetStarted]);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <NightRoomBackdrop minimal />

      {/* Music toggle button — top-right */}
      <div
        role="button"
        aria-label={musicOn ? "Mute music" : "Play music"}
        onClick={toggleMusic}
        style={{
          position: "absolute", top: 18, right: 20, zIndex: 4,
          width: 48, height: 48, borderRadius: "50%",
          background: musicOn ? "#5B21B6" : "rgba(60,20,100,0.55)",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer",
          boxShadow: musicOn ? "0 4px 16px rgba(91,33,182,0.50)" : "none",
          transition: "background 0.3s ease, box-shadow 0.3s ease",
          opacity: musicOn ? 1 : 0.65,
        }}
      >
        {/* Pulsing ring when music is on */}
        {musicOn && (
          <div style={{
            position: "absolute", inset: -5, borderRadius: "50%",
            border: "2px solid rgba(147,51,234,0.55)",
            animation: "say-hi-ping 2.6s ease-out 0.4s infinite",
            pointerEvents: "none",
          }} />
        )}
        {musicOn ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
            stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
            stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
            <line x1="3" y1="3" x2="21" y2="21" />
          </svg>
        )}
      </div>

      {/* ── Main column ── */}
      <div style={{
        position: "relative", zIndex: 1,
        height: "100%", display: "flex", flexDirection: "column",
        padding: "60px 20px 32px",
        boxSizing: "border-box",
      }}>

        {/* ── Scene: cat centered, bubble floats above ── */}
        <div style={{
          flex: 1, minHeight: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: 0,
        }}>
          {/* Speech bubble — above cat, tail points down to its head.
              minHeight locks it to the fully-expanded size so Bugsy
              never shifts as new lines appear. */}
          <div style={{
            position: "relative",
            width: 220,
            minHeight: 168,
            background: "#fff9f0",
            borderRadius: 22,
            padding: "12px 16px 10px",
            boxShadow: "0 10px 36px rgba(0,0,0,0.28)",
            marginBottom: 4,
            boxSizing: "border-box",
            animation: "pop-in 0.45s cubic-bezier(0.22, 1.5, 0.36, 1) 0.6s backwards",
          }}>
            {/* Tail pointing down toward cat head */}
            <div style={{
              position: "absolute",
              bottom: -13, left: "38%",
              width: 0, height: 0,
              borderLeft: "12px solid transparent",
              borderRight: "12px solid transparent",
              borderTop: "15px solid #fff9f0",
            }} />

            <p style={{ textAlign: "center", margin: "0 0 5px", fontSize: 18, lineHeight: 1 }}>♥</p>

            {introPhase >= 1 && (
              <p style={{
                fontFamily: "var(--font-nunito), system-ui",
                fontSize: 17, fontWeight: 800, color: "#1e1430", margin: "0 0 2px",
              }}>
                <Typewriter text="Hi..." onDone={() => setIntroPhase(2)} speedMultiplier={1.4} />
              </p>
            )}

            {introPhase >= 2 && (
              <p style={{
                fontFamily: "var(--font-nunito), system-ui",
                fontSize: 17, fontWeight: 800, color: "#1e1430", margin: "0 0 8px",
              }}>
                I&apos;m{" "}
                <span style={{ color: "#FF5C8A" }}>
                  <Typewriter text="Bugsy." onDone={() => setIntroPhase(3)} speedMultiplier={1.0} />
                </span>
              </p>
            )}

            {introPhase >= 3 && (
              <p style={{
                fontFamily: "var(--font-nunito), system-ui",
                fontSize: 13, fontWeight: 600, color: "#5a4070",
                lineHeight: 1.5, margin: "0 0 7px",
              }}>
                <Typewriter
                  text="I get a little shy when meeting new friends."
                  onDone={() => setIntroPhase(4)}
                  speedMultiplier={0.8}
                />
              </p>
            )}

            {introPhase >= 4 && (
              <p style={{
                textAlign: "center", margin: 0, fontSize: 17, lineHeight: 1,
                animation: "fade-up 0.3s ease backwards",
              }}>💜</p>
            )}

          </div>

          {/* Bugsy — sits at bottom; right paw glows at phase 4 */}
          <div style={{
            position: "relative",
            animation: "bobo-enter 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.2s backwards",
          }}>
            <Bobo
              mood="shy"
              tint={tint}
              size={240}
              glowRightPaw={introPhase === 4 && !burstActive}
            />

            {/* Click target on Bugsy's right paw + two expanding ping rings */}
            {introPhase === 4 && !burstActive && (
              <div
                onClick={handlePawTap}
                style={{
                  position: "absolute",
                  left: 120, top: 133,
                  width: 48, height: 48,
                  borderRadius: "50%",
                  cursor: "pointer",
                  zIndex: 10,
                }}
              >
                <div style={{
                  position: "absolute", inset: -10,
                  borderRadius: "50%",
                  border: "2.5px solid rgba(192,132,252,0.70)",
                  animation: "paw-ring-ping 1.6s ease-out infinite",
                  pointerEvents: "none",
                }} />
                <div style={{
                  position: "absolute", inset: -10,
                  borderRadius: "50%",
                  border: "2.5px solid rgba(192,132,252,0.50)",
                  animation: "paw-ring-ping 1.6s ease-out 0.8s infinite",
                  pointerEvents: "none",
                }} />
              </div>
            )}
          </div>

          {/* Hint text — bold, gold sparkles, MY PAW uppercase */}
          {introPhase === 4 && !burstActive && (
            <div style={{
              marginTop: 6,
              textAlign: "center",
              animation: "fade-up 0.5s ease 0.2s backwards",
              userSelect: "none",
            }}>
              <p style={{
                fontFamily: "var(--font-nunito), system-ui",
                fontSize: 20, fontWeight: 900,
                color: "#f0e6ff",
                margin: 0,
                letterSpacing: "0.03em",
                WebkitTextStroke: "0.4px rgba(240,230,255,0.6)",
                animation: "hint-pulse 2s ease-in-out infinite",
                display: "inline-block",
              }}>
                <span style={{ color: "#FFD166" }}>✦</span>
                {" "}Tap on{" "}
                <span style={{
                  color: "#FFD166",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}>my paw</span>
                {" "}to say hello!{" "}
                <span style={{ color: "#FFD166" }}>✦</span>
              </p>
            </div>
          )}
        </div>

      </div>

      {/* ── High-five burst overlay ── */}
      {burstActive && (
        <div style={{
          position: "absolute", inset: 0,
          pointerEvents: "none", zIndex: 20,
          overflow: "hidden",
        }}>
          {/* Expanding bloom — covers screen just before Trust appears */}
          <div style={{
            position: "absolute",
            left: "50%", top: "60%",
            width: 80, height: 80,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(220,160,255,0.95) 0%, rgba(167,100,255,0.80) 45%, rgba(109,40,217,0.60) 100%)",
            animation: "screen-bloom 0.95s cubic-bezier(0.22, 1, 0.36, 1) 0s both",
            pointerEvents: "none",
          }} />

          {/* Spark particles radiating from Bugsy's right paw */}
          {([
            { e: "⭐", x: -72, y: -95,  delay: 0  },
            { e: "✨", x:   4, y: -108, delay: 35  },
            { e: "🌟", x:  78, y: -90,  delay: 15  },
            { e: "⭐", x: -98, y: -28,  delay: 55  },
            { e: "✨", x:  98, y: -32,  delay: 10  },
            { e: "🌟", x: -58, y:  58,  delay: 45  },
            { e: "⭐", x:  64, y:  62,  delay: 25  },
            { e: "✨", x:   4, y:  82,  delay: 65  },
            { e: "💜", x: -38, y: -130, delay: 20  },
            { e: "💜", x:  42, y: -128, delay: 50  },
          ] as { e: string; x: number; y: number; delay: number }[]).map((p, i) => (
            <div key={i} style={{
              position: "absolute",
              left: "50%", top: "60%",
              fontSize: 22, lineHeight: 1,
              ["--tx" as string]: `${p.x}px`,
              ["--ty" as string]: `${p.y}px`,
              animation: `burst-out 0.82s ease-out ${p.delay}ms both`,
            }}>{p.e}</div>
          ))}

        </div>
      )}
    </div>
  );
}
