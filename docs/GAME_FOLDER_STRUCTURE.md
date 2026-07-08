# GAME_FOLDER_STRUCTURE.md — Where Things Live

This is the concrete filesystem spec. `GAME_ENGINE.md` describes what the
shared engine *does*; this document describes *where its files live* and
where a new game's files go. Both existing games (`BirdSpikeGame.tsx`,
`SnackCatchGame.tsx`) currently violate this spec — they predate it. Treat
this as the target structure for all new work, and migrate the two existing
games opportunistically (tracked in `GAME_ROADMAP.md` Phase 1), not as a
blocking prerequisite for adding game #3.

## Target layout

```
app/
├── page.tsx                    # root route — Stage state machine (unchanged)
├── layout.tsx
├── globals.css
│
├── games/                      # one folder per game, self-contained
│   ├── registry.ts             # GameConfig[] — every game registers here
│   ├── river-catch/            # Fumi's River Catch — BUILT (first
│   │   ├── RiverCatchGame.tsx  # engine-based game; go/no-go fishing)
│   │   ├── config.ts           # GameConfig + rule stages + level→tuning
│   │   ├── entities.ts         # pure spawn/step/hit-test logic
│   │   └── metrics.ts          # research metrics (hit rate, RT, ...)
│   ├── bird-spike/             # planned — migration of the legacy game
│   │   ├── BirdSpikeGame.tsx
│   │   └── config.ts
│   ├── snack-catch/            # planned — migration of the legacy game
│   │   ├── SnackCatchGame.tsx
│   │   └── config.ts
│   └── <new-game-id>/
│       ├── <GameName>Game.tsx
│       └── config.ts
│
├── lib/
│   ├── data.ts                 # existing — app-wide static data & types
│   ├── voice.tsx                # existing — TTS provider
│   └── engine/                 # shared game engine (GAME_ENGINE.md) — BUILT
│       ├── types.ts            # GameConfig, GameResult, DifficultyCurveParams, ...
│       ├── useGameLoop.ts      # requestAnimationFrame hook
│       ├── useCanvas.ts        # DPR-aware canvas setup hook
│       ├── audio.ts            # sound manager: Web Audio tone-synth + presets
│       ├── difficulty.ts       # adaptive difficulty engine (GAME_DIFFICULTY.md)
│       ├── analytics.ts        # analytics manager (GAME_ANALYTICS.md)
│       ├── storage.ts          # namespaced/versioned localStorage helpers
│       ├── timer.ts            # frame-driven timers + countdown + formatMs
│       ├── score.ts            # score manager (streaks, best-score persistence)
│       ├── results.ts          # result calculator (GameResult + XP formula)
│       └── assets.ts           # asset loader (image preload/cache, svgToDataUrl)
│
└── components/
    ├── AppShell.tsx, AppScreens.tsx, CareScreens.tsx, Mascot.tsx,
    │   TourOverlay.tsx, Typewriter.tsx, ui.tsx   # existing, unchanged
    ├── games/
    │   ├── GameShell.tsx        # shared chrome: exit, intro bubble, pause,
    │   │                         # results screen — BUILT
    │   └── HUD.tsx              # shared in-game HUD (score/lives/timer) — BUILT
    └── onboarding/               # existing, unchanged
```

## Rules

1. **One folder per game under `app/games/`.** Folder name is the game's
   kebab-case `id` (must match `GameConfig.id` and the `Project.id` used in
   `app/lib/data.ts`'s `PROJECTS` array, e.g. game folder `bird-spike` ↔
   project id `p9`, title "Bird Spike").
2. **A game folder owns everything specific to that game**: its component,
   its `config.ts`, any bespoke visual/audio assets. It must not export
   anything another game imports directly — cross-game reuse goes through
   `app/lib/engine/`, never game-to-game.
3. **`app/lib/engine/` owns everything shared by ≥2 games.** If you find
   yourself copy-pasting a function from one game file into a new one,
   that's the signal to promote it into `engine/` instead.
4. **`registry.ts` is the single source of truth for "which games exist."**
   Adding a game means adding one entry here — nothing else should need to
   enumerate games by hand (menus, routers, analytics dashboards all read
   from this registry).
5. **No nested game nesting.** A game can't contain another game's folder.
   Sub-levels/variants of one game (e.g. easy/hard mode assets) live inside
   that game's own folder, not as siblings under `app/games/`.
6. **Non-game shared UI stays in `app/components/`, not `app/games/`.**
   `GameShell.tsx` is the one exception living under `app/components/games/`
   because it's chrome *around* games, not part of the engine's runtime
   logic — keep the engine (`lib/engine/`) free of JSX.

## Migration note (existing games)

`BirdSpikeGame.tsx` and `SnackCatchGame.tsx` currently live flat in
`app/components/`. Moving them into `app/games/bird-spike/` and
`app/games/snack-catch/` is a mechanical move + import-path update, best done
as its own PR rather than bundled with an unrelated feature. Until that move
happens, new shared engine code in `app/lib/engine/` should still be written
so both old-style and new-style game files can adopt it incrementally — don't
block engine extraction on the folder move happening first.

## Naming conventions

- Game id: kebab-case, matches folder name and `Project.id`'s title slug
  (not the `p9`-style short id — that's a separate legacy identifier used
  only in `PROJECTS`).
- Component file: `PascalCase` matching the game name + `Game.tsx` suffix
  (`BirdSpikeGame.tsx`), default-exported.
- Config file: always `config.ts`, default-exported `GameConfig` object.
- Engine hooks: `useX.ts`, one hook per file.
- Engine utilities: plain `camelCase.ts`, named exports only (no default
  exports in `lib/engine/`, so imports are self-documenting at call sites).
