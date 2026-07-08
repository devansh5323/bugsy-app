# GAME_ROADMAP.md — Phased Path from 2 Games to a Platform

This orders the architecture work so future sessions know what's next and
why, and don't jump ahead to something that depends on an earlier phase.
Nothing here is a commitment to a date — it's a dependency-ordered sequence.

## Phase 0 — Current state (baseline, as of this writing)

- Next.js 16 + React 19 + TypeScript web app, no backend, `localStorage`
  only.
- Two independent games (`BirdSpikeGame.tsx`, `SnackCatchGame.tsx`), each
  with its own RAF loop, audio synth, difficulty ramp, and localStorage keys
  — no shared code between them.
- No analytics, no cross-session difficulty calibration, no formal folder
  structure for games (`/docs` created in this pass; code untouched).
- Onboarding/assessment flow, mascot, care-meter meta-game, and cognitive
  domain taxonomy (`ClanCat`) already exist and are stable — new game work
  should integrate with these, not replace them.

## Phase 1 — Extract the shared engine, retrofit existing games

**Goal**: stop the "every game reinvents the RAF loop" pattern before a
third game makes it worse.

- Build `app/lib/engine/` (`types.ts`, `useGameLoop.ts`, `useCanvas.ts`,
  `audio.ts`, `storage.ts`) per `GAME_ENGINE.md`, extracting the logic
  that's currently duplicated in the two existing games.
- Build `GameShell.tsx` per `GAME_ENGINE.md`, extracting exit/intro/pause/
  results chrome.
- Migrate `BirdSpikeGame.tsx` and `SnackCatchGame.tsx` onto the shared
  engine and into the `app/games/` folder structure (`GAME_FOLDER_STRUCTURE.md`),
  as its own PR — mechanical, low-risk, high-leverage for everything after.
- This phase intentionally does **not** yet include the difficulty engine
  extraction or analytics — keep it scoped to loop/canvas/audio/chrome so
  it's reviewable and low-risk.

**Exit criteria**: both existing games behave identically to a player, but
share ≥80% of their infrastructure code; a third game can be built using
only `app/lib/engine/` + `GameShell` without copy-pasting from either
existing game.

## Phase 2 — Difficulty engine extraction

**Goal**: one shared adaptive difficulty model instead of two divergent
hand-rolled ramps.

- Build `lib/engine/difficulty.ts` per `GAME_DIFFICULTY.md`: normalized
  `DifficultyCurveParams` → level, grace period, rubber-banding.
- Migrate both existing games' `difficultyAt(score)` / `RAMP_MS` logic onto
  it, preserving their current tuned feel (this is a refactor, not a
  rebalance — don't change how either game *feels* to play in this phase).
- Depends on Phase 1 (games already in the shared structure).

**Exit criteria**: rubber-banding (not present in either game today) is live
in at least one game and demonstrably prevents a frustration spiral in
manual testing.

## Phase 3 — Analytics instrumentation

**Goal**: real signal on engagement and difficulty health, replacing
guesswork.

- Implement `lib/engine/analytics.ts` per `GAME_ANALYTICS.md` against a
  chosen backend — evaluate self-hosted/first-party options first given the
  COPPA-adjacent constraints in `AI_RULES.md` (this is a build-vs-buy
  decision that needs explicit sign-off, not a silent library addition).
  Until a backend is chosen, keep it a no-op/console-logging shim so call
  sites in game code don't change later.
- Wire the core event set into both existing games and `GameShell`.
- This phase can run in parallel with Phase 2 (they touch different files),
  but both depend on Phase 1's shared structure existing.

**Exit criteria**: `game_started`/`game_completed`/`difficulty_adjusted`/
`game_exited_early` flowing for every shipped game; a rough manual query can
answer "what's the early-exit rate for game X."

## Phase 4 — Cross-session calibration + parent-facing rollups

**Goal**: difficulty and progress that persist and mean something over time,
not just within one sitting.

- Persisted per-game starting difficulty (layer 2 in `GAME_DIFFICULTY.md`),
  stored via `lib/engine/storage.ts`.
- A parent-facing summary view (likely a new screen alongside
  `CareScreens.tsx`) surfacing per-domain progress trends, built from Phase 3's
  analytics data — aggregate/trend framing only, never a raw session log
  (see privacy constraints in `GAME_ANALYTICS.md`).
- Depends on Phase 2 (calibration needs the shared difficulty model) and
  Phase 3 (rollups need real event data to exist first).

## Phase 5 — Backend & multi-device sync (not started, needs explicit go-ahead)

**Goal**: today everything is single-device `localStorage`; a child who
switches phones or a parent who wants to see progress from their own device
currently can't. This phase is the first point where a backend becomes
justified — don't reach for it earlier just because "most apps have one."

- Would introduce: an account/pairing model (parent + child, no full auth
  system necessarily — could be a lightweight paired-device code rather than
  email/password, given the audience), a sync layer for progress/coins/
  difficulty calibration, and a real analytics collector if Phase 3 chose a
  hosted vendor.
- This is explicitly gated behind product/user decision, not an engineering
  default — `AI_RULES.md`'s hard rule against adding a backend unprompted
  applies most directly here.

## Sequencing summary

```
Phase 0 (now) → Phase 1 (engine extraction) → ┬→ Phase 2 (difficulty engine)
                                                └→ Phase 3 (analytics)
                                                        ↓         ↓
                                                   Phase 4 (calibration + parent rollups)
                                                        ↓
                                                   Phase 5 (backend/sync) — needs explicit go-ahead
```

Adding game #3, #4, #5... can happen at any phase using whatever shared
infrastructure exists at that point — new games are not blocked waiting for
later phases, but each new game should be built against the *current* phase's
engine capabilities rather than each one inventing what a later phase will
formalize anyway (e.g. don't hand-rolled a third divergent difficulty ramp
if Phase 2 is already underway).
