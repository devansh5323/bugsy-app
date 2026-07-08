# AGENTS.md — Operating Manual for This Repo

Practical, day-to-day reference for any agent (AI or human) working in
`bugsy-app`. For product philosophy and hard constraints, read
[`AI_RULES.md`](./AI_RULES.md) first — this file is the "how", that one is
the "must/must-not".

## What this project is

AttentionHero — a mobile-web cognitive-training game platform for kids
(ages 8–15), built as a **Next.js 16 (App Router) + React 19 + TypeScript**
single-page-app-like experience. Mascot/companion character: **Bugsy**, a cat
the child raises by completing games and real-world "projects." Package name
in `package.json` is `child-app` (legacy naming — the product name is
AttentionHero/Bugsy).

There is currently **no backend**: all persistence is `localStorage`, no
`.env`, no API routes, no auth. See `GAME_ROADMAP.md` for when/why that
changes.

## Stack

| Concern | Choice |
|---|---|
| Framework | Next.js 16 (App Router), single real route (`app/page.tsx`) |
| UI runtime | React 19 |
| Language | TypeScript, `strict: true` |
| Styling | Tailwind CSS 4 + inline `style={{}}` objects (existing convention — see `GAME_STANDARDS.md`) |
| Animation | `framer-motion` for UI chrome; hand-rolled `requestAnimationFrame` loops for game canvases (framer-motion is too heavy for 60fps game loops) |
| Rendering (games) | HTML5 Canvas2D, imperative draw calls, no game engine library (no matter-js/PixiJS/Phaser) |
| Audio | Web Audio API, hand-rolled tone synthesis (no sound asset files) |
| State | `useState`/`useReducer`/`useRef` + a `Stage` discriminated-union state machine in `app/page.tsx`; one `ProgressContext` for onboarding |
| Persistence | `localStorage` only, versioned keys (e.g. `bugsy-state-v1`) |
| Package manager | pnpm (pnpm-lock.yaml is authoritative; ignore/remove stray `package-lock.json` if you touch deps) |
| Lint | ESLint (`eslint-config-next`, core-web-vitals + typescript) |
| Testing | None wired up yet. `playwright` is a devDependency but only used by ad-hoc root scripts (`snap.js`, etc.) for manual screenshotting, not an automated suite |

## Commands

```bash
pnpm dev       # start dev server (localhost:3000)
pnpm build     # production build
pnpm start     # run production build
pnpm lint      # eslint
```

There is no `pnpm test` yet — don't invent one silently; if you add real
tests, add the script here in the same change.

## Playing a registered game without going through onboarding

Two ways in, both driven by `app/games/registry.ts` — never by editing
`page.tsx`'s onboarding switch statements or hand-authoring `localStorage`
by guesswork:

- **Dev-only URL shortcut**: with `pnpm dev` running, visit
  `http://localhost:3000/?dev_game=<projectId>` (e.g. `?dev_game=p10` for
  Fumi's River Catch) to jump straight to that game, skipping onboarding and
  any restored `localStorage` state entirely. Implemented in `page.tsx` as a
  `useEffect` gated on `process.env.NODE_ENV !== "production"` — it compiles
  out of production builds, so it's never a backdoor in the shipped app
  (`AI_RULES.md`). `<projectId>` must match a `projectId` in the registry;
  an unknown id logs a console warning and does nothing.
- **Play through the real onboarding flow**: games can be registered as
  onboarding mission steps (not just Projects-tab entries) — see
  `RiverCatchGame` at child-flow step 7 / handover-flow step 5 in
  `page.tsx`, looked up via `getGameById(...)` rather than
  `getGameByProjectId(...)`. This is the actual product path a child
  experiences, so prefer it over the dev shortcut when the thing you're
  verifying is gameplay/UX, not just "does this game run."

## Repository layout (current + target)

See [`GAME_FOLDER_STRUCTURE.md`](./GAME_FOLDER_STRUCTURE.md) for the full
spec and migration plan. Summary of what exists today:

```
app/
  page.tsx              # root route; Stage state machine drives onboarding → home → games
  layout.tsx, globals.css
  lib/
    data.ts             # central types + static data: projects, clans, care meters, cognitive domains
    voice.tsx           # TTS/voice provider
  components/
    AppShell.tsx, AppScreens.tsx, CareScreens.tsx, Mascot.tsx,
    TourOverlay.tsx, Typewriter.tsx, ui.tsx
    BirdSpikeGame.tsx   # game 1 (independent, canvas-based)
    SnackCatchGame.tsx  # game 2 (independent, canvas-based)
    onboarding/         # ~25 files: parent/child onboarding & assessment flow
docs/                   # you are here
```

The shared engine now exists: `app/lib/engine/` (types, loop/canvas hooks,
audio, difficulty, analytics, storage, timer, score, results, assets),
`app/components/games/` (`GameShell.tsx`, `HUD.tsx`), and
`app/games/registry.ts` (one entry today — Fumi's River Catch,
`app/games/river-catch/`). The two legacy games (BirdSpike, SnackCatch)
predate the engine and are still self-contained with duplicated patterns —
migrating them onto it is `GAME_ROADMAP.md` Phase 1's remaining work. New
games build on the engine from day one and register in
`app/games/registry.ts`.

## Conventions

- **File naming**: `PascalCase.tsx` for components, `camelCase.ts` for
  utilities/hooks, matching what's already in `app/components/` and `app/lib/`.
- **No barrel files** (`index.ts` re-export hubs) unless a directory already
  has one — keep imports direct and traceable.
- **Types live near their data.** Domain types (e.g. `Project`, `ClanCat`,
  `CareMeters`) live in `app/lib/data.ts` today; game-engine types will live
  in `app/lib/engine/types.ts` once that exists (`GAME_ENGINE.md`).
- **Cognitive domain taxonomy is canonical** — don't invent new domain names.
  The eight domains are defined as `ClanCat.domain` in `app/lib/data.ts`:
  Visual Attention, Sustained Attention, Selective Attention, Cognitive
  Flexibility, Working Memory, Inhibition Control, Time Management, Auditory
  Attention (plus Bugsy as "Global Captain"). Every game maps to exactly one
  of these when tagged (`GAME_STANDARDS.md`).
- **Commits/PRs**: describe *why*, not *what* (the diff shows what). Small,
  reviewable changes preferred over sweeping refactors bundled with features.
- **Before marking a new game "done"**, run through
  [`GAME_CHECKLIST.md`](./GAME_CHECKLIST.md).

## When you're not sure where something goes

1. Is it specific to exactly one game's visuals/logic? → inside that game's
   own folder (`app/games/<id>/`, per `GAME_FOLDER_STRUCTURE.md`).
2. Is it reusable across ≥2 games (loop timing, audio synth, canvas scaling,
   difficulty curve math, analytics event helpers)? → `app/lib/engine/`.
3. Is it app-wide data/taxonomy (projects list, badges, clans, cognitive
   domains)? → `app/lib/data.ts`.
4. Is it a UI rule (spacing, motion, color, copy tone)? → check
   `GAME_UI_GUIDELINES.md` before inventing a new pattern.

If none of those fit, ask rather than guessing a new top-level convention.
