"use client";

// Snack Catch — the kitchen mission mini-game.
//
// Cat sits at the bottom and the child drags him left/right. Snacks
// fall from the sky: good ones (meat, fish, fruit) → score. Rotten
// ones (greyed/green with vapours) → cost a life. First to TARGET_SCORE
// wins and we advance; three lives lost → retry / exit.
//
// World rendering is on a Canvas2D layer for performance (same trick
// as BirdSpikeGame). The cat itself stays as a DOM <Bobo> overlay so
// we don't redraw the mascot pixel-by-pixel.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Bobo } from "./Mascot";
import { KitchenBackdrop } from "./onboarding/ChildMeet";
import { Typewriter } from "./Typewriter";

const GAME_W = 400;
const GAME_H = 800;
// Catch zone is at the basket on Bugsy's head, not on his belly.
const CAT_Y = 612; // canvas y of the basket mouth (top of his head area)
const CATCH_HALF_W = 56; // half of basket-catch box width (canvas px)
const TARGET_SCORE = 8;
const START_LIVES = 3;
const SPAWN_MIN = 36; // frames between spawns (min), pre-ramp
const SPAWN_VAR = 32;
const SNACK_VY_MIN = 0.85; // initial fall speed — gentle so kids learn
const SNACK_VY_VAR = 0.6;
const SNACK_GRAVITY = 0.030; // mild accel as they fall
const SNACK_VY_MAX = 5.6;
// Difficulty ramps from ~55 % → ~145 % over this window (ms).
const RAMP_MS = 30000;
// Time (ms) the snack takes to dive into the basket after being caught.
const CATCH_ANIM_MS = 320;

type SnackKind = "good" | "bad";
type Snack = {
  id: number;
  x: number;
  y: number;
  vy: number;
  rot: number;
  vRot: number;
  kind: SnackKind;
  emoji: string;
  // Catch-into-basket animation state. When `eaten` flips true the snack
  // is no longer updated by physics — it tweens from (catchX, catchY) to
  // the basket centre and is removed when its progress hits 1.
  eaten?: boolean;
  eatenAt?: number;
  catchX?: number;
  catchY?: number;
};

const GOOD_SNACKS = ["🥩", "🐟", "🍎", "🍌", "🍇", "🍗", "🥕", "🧀"];
// "Bad" snacks are now bombs — drawn from the BOMB_SVG below. We keep
// a single-entry pool so the spawn code below stays uniform.
const BAD_SNACKS = ["💣"];
const EMOJI_FONT =
  '60px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", "Twemoji Mozilla", serif';

// Cartoon bomb illustration used for "bad" snacks. Rendered into an
// <img> once at mount and then ctx.drawImage'd each frame so we get a
// crisp, branded sprite (with a lit-fuse sparkle) instead of a rotten
// emoji + slime wash.
const BOMB_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1080" width="1080" height="1080"><g><g transform="matrix(1.515439748764038,0.11878582835197449,-0.11564631760120392,1.4753865003585815,-144.10012817382812,-282.0439147949219)"><g transform="matrix(1,0,0,1,471.2170104980469,696.9010009765625)"><path fill="rgb(31,34,37)" d="M157.27999877929688,0 C157.27999877929688,86.86499786376953 86.85700225830078,157.28799438476562 -0.00800000037997961,157.28799438476562 C-86.875,157.28799438476562 -157.27999877929688,86.86499786376953 -157.27999877929688,0 C-157.27999877929688,-86.86699676513672 -86.875,-157.28799438476562 -0.00800000037997961,-157.28799438476562 C86.85700225830078,-157.28799438476562 157.27999877929688,-86.86699676513672 157.27999877929688,0z"/></g><g transform="matrix(1,0,0,1,471.21600341796875,539.6199951171875)"><path fill="rgb(31,34,37)" d="M50.527000427246094,29.79199981689453 C50.527000427246094,29.79199981689453 -50.527000427246094,29.79199981689453 -50.527000427246094,29.79199981689453 C-50.527000427246094,29.79199981689453 -50.527000427246094,-29.79199981689453 -50.527000427246094,-29.79199981689453 C-50.527000427246094,-29.79199981689453 50.527000427246094,-29.79199981689453 50.527000427246094,-29.79199981689453 C50.527000427246094,-29.79199981689453 50.527000427246094,29.79199981689453 50.527000427246094,29.79199981689453z"/></g></g><g transform="matrix(1.5172317028045654,-0.08060772716999054,0.08910253643989563,1.477964162826538,624.19970703125,439.0814208984375)"><path fill="rgb(31,34,37)" d="M-84.6240005493164,85.58599853515625 C-88.76200103759766,85.58599853515625 -92.38500213623047,82.53900146484375 -92.97599792480469,78.30899810791016 C-93.33899688720703,75.73200225830078 -101.2959976196289,14.78600025177002 -60.03799819946289,-32.625999450683594 C-29.465999603271484,-67.76100158691406 19.459999084472656,-85.58599853515625 85.37999725341797,-85.58599853515625 C90.03299713134766,-85.58599853515625 93.8219985961914,-81.7969970703125 93.8219985961914,-77.12799835205078 C93.8219985961914,-72.4749984741211 90.03299713134766,-68.68599700927734 85.37999725341797,-68.68599700927734 C24.56800079345703,-68.68599700927734 -20.06800079345703,-52.832000732421875 -47.305999755859375,-21.531999588012695 C-83.56300354003906,20.13599967956543 -76.31800079345703,75.43000030517578 -76.24199676513672,75.9749984741211 C-75.60600280761719,80.5989990234375 -78.81900024414062,84.85800170898438 -83.44300079345703,85.51000213623047 C-83.83599853515625,85.55500030517578 -84.2300033569336,85.58599853515625 -84.6240005493164,85.58599853515625z"/></g><g transform="matrix(1.5357344150543213,0.1203766018152237,-0.11409757286310196,1.4556281566619873,405.82177734375,688.3280029296875)"><path fill="rgb(161,163,164)" d="M34.316001892089844,-0.007000000216066837 C34.316001892089844,18.954999923706055 18.947999954223633,34.308998107910156 0.0010000000474974513,34.308998107910156 C-18.945999145507812,34.308998107910156 -34.316001892089844,18.954999923706055 -34.316001892089844,-0.007000000216066837 C-34.316001892089844,-18.95400047302246 -18.945999145507812,-34.308998107910156 0.0010000000474974513,-34.308998107910156 C18.947999954223633,-34.308998107910156 34.316001892089844,-18.95400047302246 34.316001892089844,-0.007000000216066837z"/></g><g transform="matrix(-1.0785160064697266,0.8618829846382141,-0.8895007967948914,-1.0539610385894775,733.6663818359375,294.58001708984375)"><path fill="rgb(244,162,0)" d="M34.77899932861328,-36.46099853515625 C34.77899932861328,-36.46099853515625 131.40699768066406,-62.54600143432617 131.40699768066406,-62.54600143432617 C131.40699768066406,-62.54600143432617 53.042999267578125,-0.29600000381469727 53.042999267578125,-0.29600000381469727 C53.042999267578125,-0.29600000381469727 133.69500732421875,58.986000061035156 133.69500732421875,58.986000061035156 C133.69500732421875,58.986000061035156 36.159000396728516,36.5369987487793 36.159000396728516,36.5369987487793 C36.159000396728516,36.5369987487793 40.099998474121094,136.5449981689453 40.099998474121094,136.5449981689453 C40.099998474121094,136.5449981689453 -3.1589999198913574,46.29899978637695 -3.1589999198913574,46.29899978637695 C-3.1589999198913574,46.29899978637695 -78.88700103759766,111.73300170898438 -78.88700103759766,111.73300170898438 C-78.88700103759766,111.73300170898438 -35.30799865722656,21.636999130249023 -35.30799865722656,21.636999130249023 C-35.30799865722656,21.636999130249023 -133.69500732421875,3.236999988555908 -133.69500732421875,3.236999988555908 C-133.69500732421875,3.236999988555908 -36.08100128173828,-18.86400032043457 -36.08100128173828,-18.86400032043457 C-36.08100128173828,-18.86400032043457 -83.0250015258789,-107.26100158691406 -83.0250015258789,-107.26100158691406 C-83.0250015258789,-107.26100158691406 -4.888000011444092,-44.72200012207031 -4.888000011444092,-44.72200012207031 C-4.888000011444092,-44.72200012207031 34.96099853515625,-136.5449981689453 34.96099853515625,-136.5449981689453 C34.96099853515625,-136.5449981689453 34.77899932861328,-36.46099853515625 34.77899932861328,-36.46099853515625z"/></g></g></svg>`;
const BOMB_DATA_URL = `data:image/svg+xml;utf8,${encodeURIComponent(BOMB_SVG)}`;
// Bomb body sits at viewBox (471, 696) within the 1080² canvas — these
// fractions let us offset drawImage so the body lands at the snack's
// (0, 0) local origin (which is also the collision centre).
const BOMB_BODY_FX = 471 / 1080;
const BOMB_BODY_FY = 696 / 1080;
// Drawn size of the bomb sprite, in canvas pixels. The body itself ends
// up at roughly the same diameter as a good-snack emoji glyph.
const BOMB_SPRITE_SIZE = 88;

export function SnackCatchGame({
  tint,
  onExit,
  onEarnXp,
}: {
  tint: number;
  onExit: () => void;
  // Credits earned XP (mission + bomb-quiz bonus) to the app's balance.
  // Optional so the game can still be rendered standalone in dev.
  onEarnXp?: (amount: number) => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const catRef = useRef<HTMLDivElement>(null);

  const [state, setState] = useState<"idle" | "playing" | "won" | "lost">(
    "idle",
  );
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(START_LIVES);
  // How many bombs appeared during the current play — latched into state
  // on a win so the post-mission "how many bombs did you spot?" quiz can
  // grade the child's guess.
  const [bombsSeen, setBombsSeen] = useState(0);
  // Tracks when the intro speech bubble has finished typing.
  const [introDone, setIntroDone] = useState(false);
  // The intro plays two lines: 0 = what the goal is, 1 = how to play.
  const [introStep, setIntroStep] = useState<0 | 1>(0);

  // Reset the intro typewriter every time we (re)land on the idle screen.
  useEffect(() => {
    if (state === "idle") {
      setIntroDone(false);
      setIntroStep(0);
    }
  }, [state]);

  // Triggers a brief shake animation on the whole stage on bad catches.
  const [shakeKey, setShakeKey] = useState(0);
  const [hudPopKey, setHudPopKey] = useState(0);

  // Mutable game data — kept in refs so the RAF loop doesn't churn React.
  const snacksRef = useRef<Snack[]>([]);
  const catXRef = useRef(GAME_W / 2);
  const lastTimeRef = useRef(0);
  const spawnTimerRef = useRef(SPAWN_MIN);
  // Running tally of bombs spawned this play (drives the post-win quiz).
  const bombsRef = useRef(0);
  // rAF timestamp of the first frame in the current play session, used to
  // ramp difficulty (spawn rate, gravity, vy) over RAMP_MS.
  const playStartRef = useRef(0);
  const rafRef = useRef(0);
  const draggingRef = useRef(false);
  const audioRef = useRef<AudioContext | null>(null);
  const flashRef = useRef<{ until: number; color: string } | null>(null);
  const shakeRef = useRef<HTMLDivElement>(null);
  // Floating "+1 / -1" labels and sparkle particles drawn on canvas.
  const popupsRef = useRef<
    { x: number; y: number; text: string; color: string; born: number }[]
  >([]);
  const particlesRef = useRef<
    { x: number; y: number; vx: number; vy: number; life: number; color: string }[]
  >([]);
  // Preloaded bomb sprite used to render "bad" snacks on the canvas.
  const bombImgRef = useRef<HTMLImageElement | null>(null);
  useEffect(() => {
    const img = new Image();
    img.src = BOMB_DATA_URL;
    bombImgRef.current = img;
  }, []);

  // ── Audio ──────────────────────────────────────────────────
  const ensureAudio = useCallback(() => {
    if (!audioRef.current) {
      const AC = (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext) as typeof AudioContext;
      audioRef.current = new AC();
    }
    return audioRef.current;
  }, []);
  const tone = useCallback(
    (freq: number, dur: number, type: OscillatorType = "sine", gainV = 0.18) => {
      try {
        const ac = ensureAudio();
        const osc = ac.createOscillator();
        const g = ac.createGain();
        osc.type = type;
        osc.frequency.value = freq;
        g.gain.setValueAtTime(gainV, ac.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + dur);
        osc.connect(g);
        g.connect(ac.destination);
        osc.start();
        osc.stop(ac.currentTime + dur);
      } catch {
        /* no-op if audio blocked */
      }
    },
    [ensureAudio],
  );
  const goodBlip = useCallback(() => tone(720, 0.12, "triangle"), [tone]);
  const badBlip = useCallback(() => tone(160, 0.28, "sawtooth", 0.16), [tone]);

  // ── Cat position helpers ───────────────────────────────────
  const setCatXFromClientX = (clientX: number) => {
    const w = wrapRef.current;
    if (!w) return;
    const rect = w.getBoundingClientRect();
    const ratio = (clientX - rect.left) / rect.width;
    const x = Math.max(
      CATCH_HALF_W,
      Math.min(GAME_W - CATCH_HALF_W, ratio * GAME_W),
    );
    catXRef.current = x;
    const cat = catRef.current;
    if (cat) cat.style.left = `${(x / GAME_W) * 100}%`;
  };

  // ── Game lifecycle ─────────────────────────────────────────
  const startGame = useCallback(() => {
    snacksRef.current = [];
    catXRef.current = GAME_W / 2;
    spawnTimerRef.current = SPAWN_MIN;
    bombsRef.current = 0;
    lastTimeRef.current = 0;
    playStartRef.current = 0; // will latch on the first rAF frame
    flashRef.current = null;
    setScore(0);
    setLives(START_LIVES);
    setState("playing");
    // place the cat back at centre
    const cat = catRef.current;
    if (cat) cat.style.left = "50%";
  }, []);

  // ── RAF loop ───────────────────────────────────────────────
  useEffect(() => {
    if (state !== "playing") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const loop = (t: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = t;
      if (!playStartRef.current) playStartRef.current = t;
      const dt = Math.min(3, (t - lastTimeRef.current) / 16.67);
      lastTimeRef.current = t;

      // Ramp 0 → 1 over RAMP_MS, then a multiplier that scales fall speed
      // and spawn rate from ~55 % at the start to ~145 % later in.
      const ramp = Math.min(1, (t - playStartRef.current) / RAMP_MS);
      const speedMul = 0.55 + ramp * 0.9;

      // ── Spawn snacks ──
      spawnTimerRef.current -= dt;
      if (spawnTimerRef.current <= 0) {
        // Snacks arrive a touch faster as the ramp climbs (smaller interval).
        spawnTimerRef.current =
          (SPAWN_MIN + Math.random() * SPAWN_VAR) / (0.75 + ramp * 0.55);
        const isBad = Math.random() < 0.32;
        if (isBad) bombsRef.current += 1;
        const pool = isBad ? BAD_SNACKS : GOOD_SNACKS;
        snacksRef.current.push({
          id: Date.now() + Math.random(),
          x: 40 + Math.random() * (GAME_W - 80),
          y: -30,
          vy: (SNACK_VY_MIN + Math.random() * SNACK_VY_VAR) * speedMul,
          rot: Math.random() * 360,
          vRot: (Math.random() - 0.5) * 4,
          kind: isBad ? "bad" : "good",
          emoji: pool[Math.floor(Math.random() * pool.length)],
        });
      }

      // ── Update + collide ──
      const cx = catXRef.current;
      const next: Snack[] = [];
      let scoreDelta = 0;
      let liveDelta = 0;
      for (const s of snacksRef.current) {
        // Eaten snacks freeze in place (no physics) — they're animating
        // into the basket and get removed once their tween completes.
        if (!s.eaten) {
          s.vy = Math.min(SNACK_VY_MAX, s.vy + SNACK_GRAVITY * speedMul * dt);
          s.y += s.vy * dt;
          s.rot += s.vRot * dt;

          const inY = s.y > CAT_Y - 30 && s.y < CAT_Y + 18;
          const inX = Math.abs(s.x - cx) < CATCH_HALF_W;
          if (inY && inX) {
            // Mark as eaten — keeps the snack alive so the render pass
            // can tween it into the basket. Score/lives still happen now.
            s.eaten = true;
            s.eatenAt = t;
            s.catchX = s.x;
            s.catchY = s.y;
            if (s.kind === "bad") {
              liveDelta -= 1;
              badBlip();
              flashRef.current = { until: t + 220, color: "rgba(180,80,80,0.22)" };
              popupsRef.current.push({
                x: s.x,
                y: CAT_Y - 30,
                text: "−1 ❤️",
                color: "#d23b3b",
                born: t,
              });
              setShakeKey((k) => k + 1);
            } else {
              scoreDelta += 1;
              goodBlip();
              flashRef.current = { until: t + 180, color: "rgba(255,236,140,0.32)" };
              popupsRef.current.push({
                x: s.x,
                y: CAT_Y - 30,
                text: "+1",
                color: "#f4a02a",
                born: t,
              });
              const burstColors = ["#ffd76a", "#ff9d5c", "#f59ac0", "#7cc46f"];
              for (let i = 0; i < 10; i++) {
                const angle = (Math.PI * 2 * i) / 10 + Math.random() * 0.4;
                const speed = 1.4 + Math.random() * 2.2;
                particlesRef.current.push({
                  x: s.x,
                  y: CAT_Y - 18,
                  vx: Math.cos(angle) * speed,
                  vy: Math.sin(angle) * speed - 1,
                  life: 0,
                  color: burstColors[i % burstColors.length],
                });
              }
              setHudPopKey((k) => k + 1);
            }
          }
        }

        // Keep this snack alive?
        if (s.eaten) {
          if (t - (s.eatenAt ?? 0) > CATCH_ANIM_MS) continue;
        } else if (s.y > GAME_H + 40) {
          continue; // fell off the bottom uncaught
        }
        next.push(s);
      }
      snacksRef.current = next;

      if (scoreDelta) setScore((p) => p + scoreDelta);
      if (liveDelta) setLives((p) => Math.max(0, p + liveDelta));

      // ── Render ──
      ctx.clearRect(0, 0, GAME_W, GAME_H);

      // Flash (good catch / bad catch)
      if (flashRef.current) {
        if (t < flashRef.current.until) {
          ctx.fillStyle = flashRef.current.color;
          ctx.fillRect(0, 0, GAME_W, GAME_H);
        } else {
          flashRef.current = null;
        }
      }

      ctx.font = EMOJI_FONT;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      // Approx vertical centre of the basket mouth in canvas coords —
      // caught snacks tween here so they look like they're dropping in.
      const basketDropY = CAT_Y + 22;
      for (const s of snacksRef.current) {
        // Default draw transform = the snack's live position. Eaten
        // snacks override these to ease toward the basket while shrinking
        // and fading slightly (so the catch reads as "going in", not "poof").
        let drawX = s.x;
        let drawY = s.y;
        let drawScale = 1;
        let drawAlpha = 1;
        if (s.eaten) {
          const k = Math.min(1, (t - (s.eatenAt ?? t)) / CATCH_ANIM_MS);
          const e = 1 - (1 - k) ** 3; // ease-out cubic
          const fromX = s.catchX ?? s.x;
          const fromY = s.catchY ?? s.y;
          // Aim at the live basket position so the snack tracks the cat
          // even if the child keeps dragging during the dive-in.
          drawX = fromX + (catXRef.current - fromX) * e;
          drawY = fromY + (basketDropY - fromY) * e;
          drawScale = 1 - 0.92 * e;
          drawAlpha = 1 - 0.5 * e;
        }
        ctx.save();
        ctx.globalAlpha = drawAlpha;
        ctx.translate(drawX, drawY);
        // Good snacks tumble; bombs stay upright so the lit fuse + spark
        // keep reading the right way up.
        if (s.kind !== "bad") ctx.rotate((s.rot * Math.PI) / 180);
        if (drawScale !== 1) ctx.scale(drawScale, drawScale);
        if (s.kind === "bad") {
          // Dark "danger" puff under the bomb so it pops against the
          // warm kitchen backdrop.
          const danger = ctx.createRadialGradient(0, 4, 3, 0, 4, 26);
          danger.addColorStop(0, "rgba(40,15,25,0.45)");
          danger.addColorStop(1, "rgba(40,15,25,0)");
          ctx.fillStyle = danger;
          ctx.beginPath();
          ctx.arc(0, 4, 26, 0, Math.PI * 2);
          ctx.fill();
          const bomb = bombImgRef.current;
          if (bomb && bomb.complete && bomb.naturalWidth > 0) {
            // Offset the SVG so its bomb body lands at local (0, 0) —
            // matches the collision centre and the catch-tween target.
            const W = BOMB_SPRITE_SIZE;
            const H = BOMB_SPRITE_SIZE;
            ctx.drawImage(bomb, -BOMB_BODY_FX * W, -BOMB_BODY_FY * H, W, H);
          } else {
            // Fallback circle while the sprite finishes loading.
            ctx.fillStyle = "#1f2225";
            ctx.beginPath();
            ctx.arc(0, 0, 26, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "#a1a3a4";
            ctx.beginPath();
            ctx.arc(-9, -3, 6, 0, Math.PI * 2);
            ctx.fill();
          }
        } else {
          // Soft drop shadow grounds the food without a halo glow.
          ctx.globalAlpha = 0.22 * drawAlpha;
          ctx.fillStyle = "rgba(40,20,10,0.7)";
          ctx.fillText(s.emoji, 1.5, 4);
          ctx.globalAlpha = drawAlpha;
          // Crisp white outline keeps the emoji readable against the
          // busy kitchen backdrop now that the glow is gone.
          ctx.lineWidth = 7;
          ctx.strokeStyle = "rgba(255,255,255,0.95)";
          ctx.lineJoin = "round";
          ctx.strokeText(s.emoji, 0, 0);
          ctx.fillText(s.emoji, 0, 0);
        }
        ctx.restore();
      }

      // ── Sparkle particles (fade + gravity) ──
      const liveParticles: typeof particlesRef.current = [];
      for (const p of particlesRef.current) {
        p.life += dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += 0.18 * dt;
        if (p.life < 28) {
          const a = 1 - p.life / 28;
          ctx.globalAlpha = a;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 3 + (1 - a) * 2, 0, Math.PI * 2);
          ctx.fill();
          liveParticles.push(p);
        }
      }
      particlesRef.current = liveParticles;
      ctx.globalAlpha = 1;

      // ── Floating "+1 / -1 ❤" labels ──
      const livePopups: typeof popupsRef.current = [];
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      for (const p of popupsRef.current) {
        const age = (t - p.born) / 1000; // seconds
        if (age < 0.9) {
          const a = 1 - age / 0.9;
          const lift = age * 50;
          ctx.globalAlpha = a;
          ctx.font = 'bold 28px "Nunito", system-ui, sans-serif';
          // text stroke for contrast
          ctx.lineWidth = 5;
          ctx.strokeStyle = "rgba(255,255,255,0.95)";
          ctx.strokeText(p.text, p.x, p.y - lift);
          ctx.fillStyle = p.color;
          ctx.fillText(p.text, p.x, p.y - lift);
          livePopups.push(p);
        }
      }
      popupsRef.current = livePopups;
      ctx.globalAlpha = 1;

      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [state, goodBlip, badBlip]);

  // Re-trigger the shake CSS animation whenever shakeKey bumps.
  useEffect(() => {
    if (shakeKey === 0) return;
    const el = shakeRef.current;
    if (!el) return;
    el.style.animation = "none";
    void el.offsetWidth; // force reflow so the next assignment restarts it
    el.style.animation = "game-shake 0.36s ease";
  }, [shakeKey]);

  // ── Win / lose detection ───────────────────────────────────
  useEffect(() => {
    if (state === "playing" && score >= TARGET_SCORE) {
      setBombsSeen(bombsRef.current);
      setState("won");
    }
  }, [score, state]);
  useEffect(() => {
    if (state === "playing" && lives <= 0) setState("lost");
  }, [lives, state]);

  // ── Pointer drag ───────────────────────────────────────────
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (state !== "playing") return;
    draggingRef.current = true;
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
    setCatXFromClientX(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (state !== "playing" || !draggingRef.current) return;
    setCatXFromClientX(e.clientX);
  };
  const onPointerUp = () => {
    draggingRef.current = false;
  };

  return (
    <div
      ref={wrapRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        background: "#fcd286",
        touchAction: "none",
        userSelect: "none",
      }}
    >
      {/* Subtle kitchen backdrop (slightly muted so the falling snacks
          remain the focus). */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.55,
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        <KitchenBackdrop />
      </div>
      {/* Warm haze on top of the kitchen so snacks pop. */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(255,239,200,0.28) 0%, rgba(255,239,200,0) 35%, rgba(255,239,200,0) 75%, rgba(252,210,134,0.35) 100%)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      {/* shake stage — wraps the canvas + cat so they shake together on
          bad catches. Animation is triggered imperatively (via the
          shakeKey effect below) so we never re-mount the canvas. */}
      <div
        ref={shakeRef}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          pointerEvents: "none",
        }}
      >
        <canvas
          ref={canvasRef}
          width={GAME_W}
          height={GAME_H}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
          }}
        />

        {/* Playing cat lives inside the shake stage so it shakes too. */}
        {state !== "idle" && (
          <div
            ref={catRef}
            style={{
              position: "absolute",
              bottom: 50,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 3,
              pointerEvents: "none",
              filter: "drop-shadow(0 6px 8px rgba(60,40,20,0.32))",
            }}
          >
            {/* gentle bob on the cat while playing — basket bobs with him */}
            <div
              style={{
                position: "relative",
                animation:
                  state === "playing"
                    ? "cat-bob 1.4s ease-in-out infinite"
                    : undefined,
              }}
            >
              <Bobo
                mood={state === "playing" ? "happy" : "hungry"}
                tint={tint}
                size={120}
              />
              {/* Wicker catch basket on Bugsy's head */}
              <Basket />
            </div>
          </div>
        )}
      </div>

      {/* back / exit button */}
      <button
        onClick={onExit}
        aria-label="Exit game"
        style={{
          position: "absolute",
          top: 14,
          left: 14,
          width: 40,
          height: 40,
          borderRadius: 12,
          border: "2px solid rgba(0,0,0,0.12)",
          background: "rgba(255,255,255,0.85)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: "#7a5a44",
          zIndex: 6,
        }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14">
          <path
            d="M9 1L3 7l6 6"
            stroke="currentColor"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* HUD — two stat pills (stars + hearts) sitting in the top right.
          Glass-white pill, chunky blue number, hex icon on the right. */}
      <div
        style={{
          position: "absolute",
          top: 16,
          right: 14,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: 10,
          zIndex: 6,
          pointerEvents: "none",
          fontFamily: "var(--font-nunito), system-ui",
        }}
      >
        <div style={{ display: "flex", flexDirection: "row", gap: 10, alignItems: "center" }}>
          <StatPill
            value={score}
            suffix={`/${TARGET_SCORE}`}
            icon="🍇"
            popKey={hudPopKey}
          />
          <StatPill value={lives} icon="❤️" />
        </div>
      </div>

      {/* ── Idle: Bugsy explains the game as a speech bubble ── */}
      {state === "idle" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(252,234,221,0.45) 0%, rgba(252,234,221,0.85) 60%, rgba(252,234,221,0.95) 100%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 14,
            padding: "0 24px 180px",
            zIndex: 5,
          }}
        >
          <IntroBubble
            key={introStep}
            text={
              introStep === 0
                ? "Feed me all the yummy snacks and avoid the bombs!"
                : "Drag me left and right to move me. Collect yummy snacks."
            }
            onDone={() => {
              if (introStep === 0) {
                // brief pause, then explain how to play
                window.setTimeout(() => setIntroStep(1), 900);
              } else {
                setIntroDone(true);
              }
            }}
          />
          <div style={{ filter: "drop-shadow(0 12px 12px rgba(80,50,20,0.28))" }}>
            <Bobo mood="happy" tint={tint} size={150} tailWag />
          </div>
        </div>
      )}

      {/* Idle CTA — appears once Bugsy finishes his line */}
      {state === "idle" && (
        <div
          style={{
            position: "absolute",
            left: 20,
            right: 20,
            bottom: 28,
            opacity: introDone ? 1 : 0,
            transform: introDone ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 0.4s ease, transform 0.4s ease",
            pointerEvents: introDone ? "auto" : "none",
            zIndex: 6,
          }}
        >
          <button
            onClick={startGame}
            style={ctaStyle("--primary", "var(--primary-shadow)")}
          >
            Let&apos;s catch snacks! →
          </button>
        </div>
      )}

      {/* ── Won — achievement card pops with score + stars ── */}
      {state === "won" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(252,234,221,0.55) 0%, rgba(252,234,221,0.92) 60%, rgba(252,234,221,0.96) 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 22px",
            zIndex: 5,
          }}
        >
          {/* Confetti burst behind the card — same shapes + palette as the
              Lottie file (crosses, diamonds, stars, circles, zigzags). */}
          <Confetti />
          <MissionQuizCard
            score={score}
            stars={Math.max(1, lives)}
            bombsSeen={bombsSeen}
            tint={tint}
            onEarnXp={onEarnXp}
            onContinue={onExit}
            onReplay={startGame}
          />
        </div>
      )}

      {/* ── Lost overlay (kept as a clear retry / skip prompt) ── */}
      {state === "lost" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(252,234,221,0.78)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            padding: "0 32px 140px",
            zIndex: 5,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-nunito), system-ui",
              fontWeight: 900,
              fontSize: 26,
              color: "#5b3a1f",
              maxWidth: 320,
              lineHeight: 1.2,
            }}
          >
            Oh no — too many gross snacks!
          </div>
          <div style={{ fontSize: 38 }}>🤢🥦💨</div>
          <div style={{ width: "100%", maxWidth: 320, display: "flex", flexDirection: "column", gap: 10 }}>
            <button onClick={startGame} style={ctaStyle("--primary", "var(--primary-shadow)")}>
              Try again
            </button>
            <button
              onClick={onExit}
              style={{
                ...ctaStyle("var(--surface)", "var(--border)"),
                color: "var(--ink)",
              }}
            >
              Skip
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// XP awarded just for finishing the mission, plus the bonus the child
// earns for each quiz question they remember correctly.
const MISSION_XP = 50;
const QUIZ_BONUS_XP = 10;

// Second quiz question: "which snack did NOT fall?" Cheese / grape / fish
// are all in GOOD_SNACKS; orange never spawns, so it's the answer.
const SNACK_Q_OPTIONS: { label: string; emoji: string }[] = [
  { label: "Cheese", emoji: "🧀" },
  { label: "Grape", emoji: "🍇" },
  { label: "Fish", emoji: "🐟" },
  { label: "Orange", emoji: "🍊" },
];
const SNACK_Q_ANSWER = "Orange";

// Builds 4 distinct, non-negative multiple-choice options that always
// include the true bomb count, then shuffles so the answer isn't always
// in the same slot.
function buildBombOptions(answer: number): number[] {
  const opts = new Set<number>([answer]);
  // Plausible near-misses first, then wider spread if we need more.
  for (const d of [-2, -1, 1, 2, 3, -3, 4]) {
    if (opts.size >= 4) break;
    const v = answer + d;
    if (v >= 0) opts.add(v);
  }
  // Top up when the answer sits near zero and the negatives were dropped.
  for (let n = answer + 1; opts.size < 4; n++) opts.add(n);
  const arr = Array.from(opts);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Post-mission reward card. Bugsy is full, the score is saved, and the
// child plays a two-question "Mission Memory Check": how many bombs flew
// past, and which snack never fell. Each correct answer earns a bonus on
// top of the mission XP. Question 2 only appears once Q1 is answered, and
// the Continue / Play again CTAs only appear once both are done.
// Persists the play to localStorage so the score is still saved.
function MissionQuizCard({
  score,
  stars,
  bombsSeen,
  tint,
  onEarnXp,
  onContinue,
  onReplay,
}: {
  score: number;
  stars: number; // 0..3
  bombsSeen: number;
  tint: number;
  onEarnXp?: (amount: number) => void;
  onContinue: () => void;
  onReplay: () => void;
}) {
  useEffect(() => {
    try {
      const key = "bugsy-snack-scores";
      const prev: { score: number; stars: number; when: number }[] = JSON.parse(
        window.localStorage.getItem(key) ?? "[]",
      );
      prev.push({ score, stars, when: Date.now() });
      window.localStorage.setItem(key, JSON.stringify(prev.slice(-50)));
    } catch {
      /* localStorage unavailable — quietly skip */
    }
  }, [score, stars]);

  // Ask just ONE memory question, picked at random per play. A replay
  // mounts a fresh card, so a new question is rolled each time.
  const [whichQ] = useState<"bombs" | "snack">(() =>
    Math.random() < 0.5 ? "bombs" : "snack",
  );
  const bombOptions = useMemo(() => buildBombOptions(bombsSeen), [bombsSeen]);
  const [bombPick, setBombPick] = useState<number | null>(null);
  const [snackPick, setSnackPick] = useState<string | null>(null);

  const answered = whichQ === "bombs" ? bombPick !== null : snackPick !== null;
  const correct =
    whichQ === "bombs" ? bombPick === bombsSeen : snackPick === SNACK_Q_ANSWER;
  const done = answered;

  const earnedXp = MISSION_XP + (answered && correct ? QUIZ_BONUS_XP : 0);

  // Bugsy looks pleased until a wrong answer lands.
  const mascotMood = !answered ? "thinking" : correct ? "cheer" : "sad";

  // Mission XP + the quiz bonus (if correct) are credited on the single
  // answer. A replay mounts a fresh card, so this fires once per play.
  const pickBomb = (opt: number) => {
    if (bombPick !== null) return;
    setBombPick(opt);
    onEarnXp?.(MISSION_XP + (opt === bombsSeen ? QUIZ_BONUS_XP : 0));
  };
  const pickSnack = (label: string) => {
    if (snackPick !== null) return;
    setSnackPick(label);
    onEarnXp?.(MISSION_XP + (label === SNACK_Q_ANSWER ? QUIZ_BONUS_XP : 0));
  };

  return (
    <div
      style={{
        position: "relative",
        background: "linear-gradient(180deg, #fff6e0 0%, #fde0b2 100%)",
        border: "3px solid #cf8b43",
        borderRadius: 28,
        boxShadow:
          "0 8px 0 #8a5b22, 0 16px 32px rgba(80,50,20,0.28), inset 0 2px 0 rgba(255,255,255,0.7)",
        padding: "22px 22px 22px",
        width: "100%",
        maxWidth: 340,
        maxHeight: "88vh",
        overflowY: "auto",
        textAlign: "center",
        fontFamily: "var(--font-nunito), system-ui",
        color: "#5b3a1f",
        animation: "bubble-pop 0.5s cubic-bezier(0.22, 1.5, 0.36, 1)",
      }}
    >
      {/* ── Mascot — mood reacts to the answers ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: "0 auto 6px",
          filter: "drop-shadow(0 6px 6px rgba(80,50,20,0.25))",
        }}
      >
        <Bobo mood={mascotMood} tint={tint} size={96} tailWag={!answered || correct} />
      </div>

      {/* ── Headline + score ── */}
      <div
        style={{
          fontSize: 23,
          fontWeight: 900,
          lineHeight: 1.15,
          letterSpacing: 0.2,
        }}
      >
        Bugsy is full!
      </div>
      <div style={{ fontSize: 14, fontWeight: 800, marginTop: 4, opacity: 0.85 }}>
        You fed him {score} snack{score === 1 ? "" : "s"}
      </div>
      <div style={{ fontSize: 18, marginTop: 4, letterSpacing: 2 }}>
        {"⭐".repeat(Math.max(1, Math.min(3, stars)))}
      </div>

      {/* ── XP pill — grows as bonuses land ── */}
      <div
        key={earnedXp}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          marginTop: 8,
          padding: "5px 14px",
          borderRadius: 999,
          background:
            earnedXp > MISSION_XP
              ? "linear-gradient(180deg, #ffe9a8 0%, #ffd45e 100%)"
              : "linear-gradient(180deg, #fffdf5 0%, #fdeccb 100%)",
          border: `2px solid ${earnedXp > MISSION_XP ? "#e0942a" : "#ead7b6"}`,
          boxShadow: "0 2px 0 #d8c098",
          fontWeight: 900,
          fontSize: 16,
          color: "#a35a00",
          animation: answered
            ? "hud-pop 0.4s cubic-bezier(0.22, 1.5, 0.36, 1)"
            : undefined,
        }}
      >
        <span style={{ fontSize: 16 }}>⚡</span>+{earnedXp} XP
        {earnedXp > MISSION_XP && (
          <span style={{ fontSize: 12, fontWeight: 800, opacity: 0.85 }}>
            (+{earnedXp - MISSION_XP} bonus!)
          </span>
        )}
      </div>

      {/* ── Quiz banner ── */}
      <div
        style={{
          marginTop: 16,
          fontSize: 16,
          fontWeight: 900,
          color: "#a35a00",
          letterSpacing: 0.3,
        }}
      >
        🧠 Mission Memory Check
      </div>
      <div style={{ fontSize: 12.5, fontWeight: 800, opacity: 0.8, marginTop: 2 }}>
        +{QUIZ_BONUS_XP} XP if you remember!
      </div>

      {/* ── One random memory question ── */}
      {whichQ === "bombs" ? (
        <div key="q-bombs" style={{ animation: "bubble-pop 0.4s cubic-bezier(0.22, 1.5, 0.36, 1)" }}>
          <QuizPrompt
            prompt="How many 💣 bombs came on the screen?"
            answered={answered}
            correct={correct}
            rightText={`Yes! ${bombsSeen} bomb${bombsSeen === 1 ? "" : "s"} flew past 🎉`}
            wrongText={`It was ${bombsSeen} bomb${bombsSeen === 1 ? "" : "s"}.`}
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
              marginTop: 12,
            }}
          >
            {bombOptions.map((opt) => (
              <QuizChip
                key={opt}
                answered={answered}
                isAnswer={opt === bombsSeen}
                isPicked={opt === bombPick}
                onClick={() => pickBomb(opt)}
              >
                {opt}
              </QuizChip>
            ))}
          </div>
        </div>
      ) : (
        <div key="q-snack" style={{ animation: "bubble-pop 0.4s cubic-bezier(0.22, 1.5, 0.36, 1)" }}>
          <QuizPrompt
            prompt="Which snack did NOT fall?"
            answered={answered}
            correct={correct}
            rightText={`Right! ${SNACK_Q_ANSWER}s never dropped 🎉`}
            wrongText={`Nope — it was the ${SNACK_Q_ANSWER.toLowerCase()}.`}
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
              marginTop: 12,
            }}
          >
            {SNACK_Q_OPTIONS.map((o) => (
              <QuizChip
                key={o.label}
                answered={answered}
                isAnswer={o.label === SNACK_Q_ANSWER}
                isPicked={o.label === snackPick}
                onClick={() => pickSnack(o.label)}
              >
                <span style={{ fontSize: 22 }}>{o.emoji}</span>
                <span style={{ fontSize: 15 }}>{o.label}</span>
              </QuizChip>
            ))}
          </div>
        </div>
      )}

      {/* ── Footer CTAs — only once both questions are answered ── */}
      {done && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            marginTop: 18,
          }}
        >
          <button
            onClick={onContinue}
            style={ctaStyle("--primary", "var(--primary-shadow)")}
          >
            Continue →
          </button>
          <button
            onClick={onReplay}
            style={{
              ...ctaStyle("var(--surface)", "var(--border)"),
              color: "var(--ink)",
            }}
          >
            Play once more
          </button>
        </div>
      )}
    </div>
  );
}

// One quiz question's prompt line — shows the question, or right/wrong
// feedback once it's been answered.
function QuizPrompt({
  prompt,
  answered,
  correct,
  rightText,
  wrongText,
}: {
  prompt: string;
  answered: boolean;
  correct: boolean;
  rightText: string;
  wrongText: string;
}) {
  return (
    <div
      style={{
        fontSize: 15,
        fontWeight: 800,
        lineHeight: 1.3,
        marginTop: 16,
        padding: "0 4px",
      }}
    >
      {answered ? (
        <span style={{ color: correct ? "#2f9e44" : "#d23b3b" }}>
          {correct ? rightText : wrongText}
        </span>
      ) : (
        prompt
      )}
    </div>
  );
}

// A single answer chip. Cream before answering; green for the right
// answer and red for a wrong pick afterward.
function QuizChip({
  children,
  answered,
  isAnswer,
  isPicked,
  onClick,
}: {
  children: ReactNode;
  answered: boolean;
  isAnswer: boolean;
  isPicked: boolean;
  onClick: () => void;
}) {
  let bg = "linear-gradient(180deg, #fffdf5 0%, #fde0b2 100%)";
  let border = "#cf8b43";
  let shadow = "#8a5b22";
  let color = "#5b3a1f";
  if (answered) {
    if (isAnswer) {
      bg = "linear-gradient(180deg, #b6f0c2 0%, #6fd98a 100%)";
      border = "#2f9e44";
      shadow = "#1f7a32";
      color = "#0f5a23";
    } else if (isPicked) {
      bg = "linear-gradient(180deg, #ffc2c2 0%, #f08a8a 100%)";
      border = "#d23b3b";
      shadow = "#a02525";
      color = "#7a1414";
    } else {
      bg = "#f3ead8";
      border = "#e0d2b4";
      shadow = "#d8c79f";
      color = "#9a8367";
    }
  }
  return (
    <button
      onClick={onClick}
      disabled={answered}
      style={{
        minHeight: 52,
        borderRadius: 16,
        border: `2px solid ${border}`,
        background: bg,
        color,
        fontFamily: "var(--font-nunito), system-ui",
        fontWeight: 900,
        fontSize: 22,
        cursor: answered ? "default" : "pointer",
        boxShadow: `0 4px 0 ${shadow}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        transition: "background 0.2s ease",
      }}
    >
      {children}
      {answered && isAnswer && <span style={{ fontSize: 18 }}>✓</span>}
      {answered && isPicked && !isAnswer && <span style={{ fontSize: 18 }}>✕</span>}
    </button>
  );
}

// Confetti burst — shapes + palette mirror the provided Lottie file
// (crosses, diamonds, stars, circles, zigzags). Each particle has a
// random target offset / rotation / size baked into CSS variables and
// flies outward via the `confetti-burst` keyframe in globals.css. We
// skip Lottie itself because the runtime npm install is broken on this
// machine; the visual result is the same celebratory burst.
type ConfettiShapeKind = "cross" | "diamond" | "star" | "circle" | "zigzag";
const CONFETTI_PALETTE: Record<ConfettiShapeKind, string> = {
  cross: "#ff37c6",
  diamond: "#56afff",
  star: "#ff8748",
  circle: "#ffd30c",
  zigzag: "#fff8ef",
};

function Confetti({ count = 52 }: { count?: number }) {
  // Particle layout is memoised so the parent re-rendering doesn't reset
  // the burst mid-animation. The component is fresh-mounted with the
  // "won" overlay, so every win still gets a new layout.
  const particles = useMemo(() => {
    const kinds: ConfettiShapeKind[] = ["cross", "diamond", "star", "circle", "zigzag"];
    return Array.from({ length: count }, (_, i) => {
      const kind = kinds[i % kinds.length];
      // Even angular spread + a touch of jitter so the burst isn't
      // perfectly radial.
      const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
      const distance = 280 + Math.random() * 340;
      return {
        key: i,
        kind,
        tx: Math.cos(angle) * distance,
        ty: Math.sin(angle) * distance - 60, // slight upward bias
        rot: (Math.random() - 0.5) * 1080,
        delay: Math.random() * 180,
        duration: 1700 + Math.random() * 500,
        size: 16 + Math.random() * 14,
      };
    });
  }, [count]);

  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
        zIndex: 7,
      }}
    >
      {particles.map((p) => (
        <ConfettiParticle
          key={p.key}
          kind={p.kind}
          size={p.size}
          tx={p.tx}
          ty={p.ty}
          rot={p.rot}
          delay={p.delay}
          duration={p.duration}
        />
      ))}
    </div>
  );
}

// One confetti speck. Uses Web Animations API so each particle owns its
// concrete transform values — no CSS-variable plumbing, no shared
// keyframe that can go stale in Turbopack.
function ConfettiParticle({
  kind,
  size,
  tx,
  ty,
  rot,
  delay,
  duration,
}: {
  kind: ConfettiShapeKind;
  size: number;
  tx: number;
  ty: number;
  rot: number;
  delay: number;
  duration: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof el.animate !== "function") return;
    const anim = el.animate(
      [
        {
          transform: "translate(-50%, -50%) translate(0, 0) rotate(0deg) scale(0.35)",
          opacity: 0,
          offset: 0,
        },
        {
          transform: "translate(-50%, -50%) translate(0, 0) rotate(0deg) scale(0.85)",
          opacity: 1,
          offset: 0.08,
        },
        {
          transform: `translate(-50%, -50%) translate(${tx * 0.85}px, ${ty * 0.7}px) rotate(${rot * 0.55}deg) scale(1.08)`,
          opacity: 1,
          offset: 0.55,
        },
        {
          transform: `translate(-50%, -50%) translate(${tx}px, ${ty + 200}px) rotate(${rot}deg) scale(0.95)`,
          opacity: 0,
          offset: 1,
        },
      ],
      {
        duration,
        delay,
        easing: "cubic-bezier(0.22, 0.7, 0.36, 1)",
        fill: "forwards",
      },
    );
    return () => anim.cancel();
  }, [tx, ty, rot, delay, duration]);

  return (
    <span
      ref={ref}
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: size,
        height: size,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        willChange: "transform, opacity",
        // Hidden until the WAAPI animation kicks in so we never flash a
        // stack of particles at the centre.
        opacity: 0,
        transform: "translate(-50%, -50%) scale(0.35)",
      }}
    >
      <ConfettiShape kind={kind} size={size} />
    </span>
  );
}

function ConfettiShape({ kind, size }: { kind: ConfettiShapeKind; size: number }) {
  const color = CONFETTI_PALETTE[kind];
  switch (kind) {
    case "circle":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9" fill={color} />
        </svg>
      );
    case "diamond":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24">
          <rect
            x="5"
            y="5"
            width="14"
            height="14"
            rx="3"
            fill={color}
            transform="rotate(45 12 12)"
          />
        </svg>
      );
    case "star":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24">
          <path
            d="M12 2l2.8 6.4 6.7.6-5.1 4.5 1.6 6.5L12 16.7 5.9 20l1.6-6.5L2.5 9l6.7-.6L12 2z"
            fill={color}
          />
        </svg>
      );
    case "cross":
      // 4-petal sparkle — matches the pink "cross" shape in the Lottie.
      return (
        <svg width={size} height={size} viewBox="0 0 24 24">
          <path
            d="M12 2 L14 9 L21 12 L14 15 L12 22 L10 15 L3 12 L10 9 Z"
            fill={color}
          />
        </svg>
      );
    case "zigzag":
    default:
      return (
        <svg width={size} height={size * 0.5} viewBox="0 0 32 16">
          <path
            d="M2 8 L8 2 L14 8 L20 2 L26 8 L30 2"
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
  }
}

// Stat pill — tactile cream/amber button chip that matches the rest of
// Bugsy's warm onboarding palette (same colours the IntroBubble and the
// in-game CTAs use). The solid bottom shadow gives the pill its
// "button" depth; both numerals in "0/8" render at the same size.
function StatPill({
  value,
  suffix,
  icon,
  popKey,
}: {
  value: number;
  suffix?: string;
  icon: string;
  popKey?: number;
}) {
  return (
    <div
      key={popKey !== undefined ? `pill-${popKey}` : undefined}
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        gap: 8,
        // Warm cream face + amber border + brown 3D base — matches
        // IntroBubble (#fff6e0 / #cf8b43 / #8a5b22) used elsewhere here.
        background: "linear-gradient(180deg, #fff6e0 0%, #fde0b2 100%)",
        border: "2px solid #cf8b43",
        borderRadius: 999,
        padding: "6px 16px",
        height: 44,
        minWidth: 78,
        boxShadow:
          "0 4px 0 #8a5b22, 0 6px 14px rgba(80,50,20,0.18), inset 0 1.5px 0 rgba(255,255,255,0.7)",
        fontFamily: "var(--font-nunito), system-ui",
        color: "#5b3a1f",
        animation:
          popKey && popKey > 0
            ? "hud-pop 0.35s cubic-bezier(0.22, 1.5, 0.36, 1)"
            : undefined,
      }}
    >
      <span
        style={{
          color: "#5b3a1f",
          fontWeight: 900,
          fontSize: 22,
          lineHeight: 1,
          letterSpacing: 0.3,
          textShadow: "0 1px 0 rgba(255,255,255,0.55)",
        }}
      >
        {value}
        {suffix ?? ""}
      </span>
      <span
        style={{
          fontSize: 22,
          lineHeight: 1,
          filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.25))",
        }}
      >
        {icon}
      </span>
    </div>
  );
}

// Wicker basket Bugsy wears on his head — snacks land in here.
function Basket() {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        top: -28,
        left: "50%",
        transform: "translateX(-50%)",
        width: 112,
        pointerEvents: "none",
      }}
    >
      <svg
        viewBox="0 0 120 80"
        width="100%"
        style={{ display: "block", filter: "drop-shadow(0 4px 3px rgba(60,30,10,0.32))" }}
      >
        {/* handle */}
        <path
          d="M30 32 Q60 -10 90 32"
          fill="none"
          stroke="#8a5b22"
          strokeWidth="6"
          strokeLinecap="round"
        />
        {/* basket body */}
        <path
          d="M12 32 L108 32 L98 72 Q60 82 22 72 Z"
          fill="#d6904a"
          stroke="#8a5b22"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        {/* rim */}
        <rect x="10" y="26" width="100" height="10" rx="3" fill="#e7a662" stroke="#8a5b22" strokeWidth="2" />
        {/* horizontal weave */}
        <line x1="20" y1="46" x2="100" y2="46" stroke="#8a5b22" strokeWidth="1.5" opacity="0.6" />
        <line x1="22" y1="56" x2="98" y2="56" stroke="#8a5b22" strokeWidth="1.5" opacity="0.6" />
        <line x1="24" y1="66" x2="96" y2="66" stroke="#8a5b22" strokeWidth="1.5" opacity="0.6" />
        {/* vertical weave */}
        <line x1="42" y1="36" x2="40" y2="72" stroke="#8a5b22" strokeWidth="1.5" opacity="0.55" />
        <line x1="60" y1="36" x2="60" y2="74" stroke="#8a5b22" strokeWidth="1.5" opacity="0.55" />
        <line x1="78" y1="36" x2="80" y2="72" stroke="#8a5b22" strokeWidth="1.5" opacity="0.55" />
      </svg>
    </div>
  );
}

// Speech-bubble style intro line (warm cream paper, brown border, tail
// pointing down to Bugsy). Mirrors the look used in the onboarding
// screens but kept local so this file stays self-contained.
function IntroBubble({ text, onDone }: { text: string; onDone?: () => void }) {
  return (
    <div
      style={{
        position: "relative",
        maxWidth: 320,
        padding: "16px 22px",
        borderRadius: 22,
        background: "#fff6e0",
        border: "2px solid #cf8b43",
        color: "#5b3a1f",
        fontFamily: "var(--font-nunito), system-ui",
        fontSize: 16.5,
        fontWeight: 800,
        lineHeight: 1.4,
        textAlign: "center",
        boxShadow: "0 8px 22px rgba(60,40,20,0.25)",
        animation: "bubble-pop 0.4s cubic-bezier(0.22, 1.5, 0.36, 1)",
      }}
    >
      <Typewriter text={text} onDone={onDone} speedMultiplier={1.15} />
      <span
        aria-hidden
        style={{
          position: "absolute",
          left: "50%",
          bottom: -8,
          transform: "translateX(-50%) rotate(45deg)",
          width: 16,
          height: 16,
          background: "#fff6e0",
          borderRadius: 3,
          borderRight: "2px solid #cf8b43",
          borderBottom: "2px solid #cf8b43",
        }}
      />
    </div>
  );
}

function ctaStyle(bg: string, shadowBg: string): React.CSSProperties {
  return {
    width: "100%",
    minHeight: 56,
    borderRadius: 16,
    border: "none",
    background: bg.startsWith("--") ? `var(${bg})` : bg,
    color: "#fff",
    fontFamily: "var(--font-nunito), system-ui",
    fontWeight: 900,
    fontSize: 17,
    letterSpacing: 0.4,
    textTransform: "uppercase",
    cursor: "pointer",
    boxShadow: `0 4px 0 ${shadowBg.startsWith("--") ? `var(${shadowBg})` : shadowBg}`,
  };
}
