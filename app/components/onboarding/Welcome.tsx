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

// ── Splash / teaser screen (shown before Welcome) ────────────────
export function Splash({ onEnter }: { onEnter: () => void }) {
  const { on: musicOn, toggle: toggleMusic } = useAmbientMusic();

  const LETTERS = [
    { char: "F", color: "#FF9F1C", shadow: "#B35300" },
    { char: "U", color: "#FF3D79", shadow: "#990038" },
    { char: "M", color: "#00C8BE", shadow: "#006E6A" },
    { char: "I", color: "#5B8CF8", shadow: "#1A42B0", hasStar: true },
  ];

  const make3D = (shadowColor: string) =>
    `0 2px 0 ${shadowColor}, 0 4px 0 ${shadowColor}, 0 6px 0 ${shadowColor}, 0 8px 0 ${shadowColor}, 0 10px 22px rgba(0,0,0,0.55)`;

  const SPARKLES = [
    { top: 124, left: "16%",  color: "#FCD34D", size: 16 },
    { top: 134, right: "12%", color: "#FF8AD8", size: 13 },
    { top: 230, left: "10%",  color: "#FCD34D", size: 12 },
    { top: 224, right: "8%",  color: "#A78BFA", size: 18 },
  ];

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <NightRoomBackdrop minimal hideRug hideFloor />

      {/* ── music toggle ── */}
      <div
        role="button"
        aria-label={musicOn ? "Mute music" : "Play music"}
        onClick={toggleMusic}
        style={{
          position: "absolute", top: 52, right: 20, zIndex: 10,
          width: 46, height: 46, borderRadius: "50%",
          background: "#5B21B6",
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
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "absolute", top: 130, left: 0, right: 0, zIndex: 5,
          display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 8,
        }}
      >
        {LETTERS.map((l, i) => (
          <motion.div
            key={l.char}
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 + i * 0.09, type: "spring", stiffness: 300, damping: 24 }}
            style={{ position: "relative" }}
          >
            <span style={{
              fontFamily: "var(--font-nunito), system-ui",
              fontSize: 96, fontWeight: 900, lineHeight: 1,
              color: l.color, display: "inline-block",
              textShadow: make3D(l.shadow),
              WebkitTextStroke: "1px rgba(255,255,255,0.15)",
            }}>
              {l.char}
            </span>
            {l.hasStar && (
              <span style={{
                position: "absolute", top: -20, right: -16,
                fontSize: 26, lineHeight: 1, pointerEvents: "none",
              }}>⭐</span>
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* ── Scattered sparkle marks around FUMI ── */}
      {SPARKLES.map((s, i) => (
        <motion.span
          key={i}
          animate={{ scale: [1, 1.35, 1], opacity: [0.65, 1, 0.65] }}
          transition={{ duration: 2.2 + i * 0.3, repeat: Infinity, ease: "easeInOut", delay: i * 0.55 }}
          style={{
            position: "absolute",
            top: s.top,
            left: (s as { top: number; color: string; size: number; left?: string; right?: string }).left,
            right: (s as { top: number; color: string; size: number; left?: string; right?: string }).right,
            color: s.color, fontSize: s.size,
            zIndex: 6, pointerEvents: "none", lineHeight: 1,
          }}
        >✦</motion.span>
      ))}

      {/* ── Small purple star ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.58, type: "spring", stiffness: 280, damping: 20 }}
        style={{
          position: "absolute", top: 262, left: 0, right: 0, zIndex: 5,
          textAlign: "center", color: "#A78BFA", fontSize: 24, lineHeight: 1,
        }}
      >★</motion.div>

      {/* ── Tagline ── */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.48, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "absolute", top: 296, left: 16, right: 16, zIndex: 5,
          textAlign: "center", fontFamily: "var(--font-nunito), system-ui",
        }}
      >
        <div style={{ fontSize: 23, fontWeight: 800, color: "#fff", lineHeight: 1.4, marginBottom: 2 }}>
          Small adventures.
        </div>
        <div style={{ fontSize: 23, fontWeight: 800, lineHeight: 1.4 }}>
          <span style={{ color: "#FCD34D" }}>Big </span>
          <span style={{ color: "#C084FC" }}>life </span>
          <span style={{ color: "#34D399" }}>skills.</span>
        </div>
      </motion.div>

      {/* ── Garden ground ── */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        height: 210, zIndex: 2, pointerEvents: "none",
        background: "linear-gradient(180deg, transparent 0%, rgba(6,18,10,0.88) 28%, #080f0a 100%)",
      }}>
        {/* Moonlit circular stone path */}
        <div style={{
          position: "absolute", bottom: 28, left: "50%",
          transform: "translateX(-50%)",
          width: 280, height: 100, borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(80,90,110,0.55) 0%, rgba(30,36,50,0.3) 60%, transparent 100%)",
        }} />
        <div style={{
          position: "absolute", bottom: 36, left: "50%",
          transform: "translateX(-50%)",
          width: 240, height: 82, borderRadius: "50%",
          border: "1.5px solid rgba(140,150,180,0.22)",
          boxSizing: "border-box" as const,
        }} />
        {/* Side foliage */}
        {[
          { bottom: 88, left:  10 }, { bottom: 68, left:  28 }, { bottom: 78, left:   0 },
          { bottom: 88, right: 10 }, { bottom: 68, right: 28 }, { bottom: 78, right:  0 },
        ].map((pos, i) => (
          <span key={i} style={{
            position: "absolute",
            bottom: pos.bottom,
            left:  (pos as { bottom: number; left?: number; right?: number }).left,
            right: (pos as { bottom: number; left?: number; right?: number }).right,
            fontSize: i % 3 === 0 ? 22 : 18,
            lineHeight: 1, userSelect: "none",
          }}>{i % 2 === 0 ? "🌸" : "🌿"}</span>
        ))}
      </div>

      {/* ── Bobo cat on the path ── */}
      <div style={{
        position: "absolute", bottom: 148, left: "50%",
        transform: "translateX(-50%)",
        zIndex: 5,
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.82, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 210, damping: 20, delay: 0.35 }}
          style={{ position: "relative" }}
        >
          {/* Cast shadow — shrinks as cat floats up */}
          <motion.div
            animate={{ scaleX: [1, 0.78, 1], opacity: [0.55, 0.3, 0.55] }}
            transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut", delay: 1.4 }}
            style={{
              position: "absolute", bottom: -2, left: "50%",
              transform: "translateX(-50%)",
              width: 140, height: 22, borderRadius: "50%",
              background: "rgba(0,0,0,0.65)",
              filter: "blur(8px)",
              zIndex: 0,
              pointerEvents: "none",
            }}
          />

          {/* Floating cat with 3D drop-shadow + purple glow */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut", delay: 1.4 }}
            style={{
              position: "relative", zIndex: 1,
              filter: "drop-shadow(0 12px 20px rgba(0,0,0,0.65)) drop-shadow(0 0 16px rgba(167,139,250,0.45))",
            }}
          >
            <Bobo mood="happy" tint={280} size={205} animate tailWag />
          </motion.div>
        </motion.div>
      </div>

      {/* ── CTA button ── */}
      <div style={{
        position: "absolute", bottom: 46, left: 20, right: 20, zIndex: 10,
      }}>
        <motion.button
          onClick={onEnter}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.68, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          whileTap={{ scale: 0.975 }}
          style={{
            position: "relative", overflow: "hidden",
            width: "100%", height: 62, borderRadius: 31,
            background: "linear-gradient(180deg, #9D6FE8 0%, #7C3AED 100%)",
            border: "none", cursor: "pointer",
            fontFamily: "var(--font-nunito), system-ui",
            fontSize: 19, fontWeight: 900, color: "#fff",
            letterSpacing: "0.02em",
            boxShadow: "0 6px 0 #5B21B6, 0 10px 32px rgba(109,40,217,0.55)",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            touchAction: "manipulation",
          }}
        >
          <motion.span
            aria-hidden
            animate={{ x: ["-120%", "220%"] }}
            transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 2.0, ease: "easeInOut" }}
            style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.22) 50%, transparent 65%)",
              borderRadius: 31, pointerEvents: "none",
            }}
          />
          <span style={{ color: "#FCD34D", fontSize: 14, letterSpacing: "0.05em" }}>✦✦</span>
          Start Your Adventure
          <motion.span
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 0.9, repeat: Infinity, repeatDelay: 1.2, ease: "easeInOut" }}
            style={{ fontSize: 20, lineHeight: 1, fontWeight: 400, display: "inline-block" }}
          >→</motion.span>
        </motion.button>
      </div>

      {/* ── Pagination dots ── */}
      <div style={{
        position: "absolute", bottom: 16, left: 0, right: 0, zIndex: 10,
        display: "flex", justifyContent: "center", alignItems: "center", gap: 7,
      }}>
        {[0, 1, 2, 3].map(i => (
          <div key={i} style={{
            width: i === 0 ? 22 : 7, height: 7, borderRadius: 4,
            background: i === 0 ? "#fff" : "rgba(255,255,255,0.32)",
          }} />
        ))}
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
