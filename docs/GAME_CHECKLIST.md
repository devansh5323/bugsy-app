# GAME_CHECKLIST.md — Definition of Done for a New Game

Run through this before calling a new game "done." It exists so quality bar
and integration steps don't rely on memory across sessions/agents. Each item
links to the doc that explains the *why*.

## 1. Structure & config (`GAME_FOLDER_STRUCTURE.md`, `GAME_ENGINE.md`)

- [ ] Lives in its own folder under `app/games/<kebab-case-id>/`
- [ ] Exports a `GameConfig` from `config.ts` (id, title, domain,
      difficulty params, estimated minutes)
- [ ] `GameConfig.id` matches the folder name and the corresponding
      `Project.id`/title used in `app/lib/data.ts`
- [ ] Registered in `app/games/registry.ts` with `config`, `projectId`, and
      a `next/dynamic` `Component` implementing `GameLaunchProps` — this is
      the only wiring step; `page.tsx` launches by registry lookup and must
      not gain a per-game special case
- [ ] Added an entry to `PROJECTS` in `app/lib/data.ts` (category, kind:
      `"game"`, blurb, points, mins, emoji, proof) whose `id` matches the
      registry entry's `projectId`
- [ ] If this game will also appear as an onboarding mission step (not just
      a Projects-tab entry), call `onEarnXp?.(result.xpEarned)` from
      `onComplete` — see `RiverCatchGame` and `AGENTS.md`'s dev-testing
      section for the two different launch/reward paths
- [ ] Uses shared engine pieces where applicable (`useGameLoop`, `useCanvas`,
      `audio.ts`, `storage.ts`) rather than reimplementing them

## 2. Coding standards (`GAME_STANDARDS.md`)

- [ ] No `useState` mutation inside the RAF loop for per-frame values (refs
      used instead)
- [ ] Canvas DPR scaling handled once at resize, not per frame
- [ ] RAF loop is cancelled on unmount and on pause
- [ ] No new `AudioContext` created outside the shared singleton
- [ ] Difficulty/tuning constants are named and centralized in `config.ts`,
      not scattered magic numbers
- [ ] Score/completion reported via callback props (`onComplete`, `onExit`),
      not by reaching into global state directly

## 3. Difficulty (`GAME_DIFFICULTY.md`)

- [ ] Has a genuine grace period before ramping begins
- [ ] Has a defined `rubberBandFloor` — a bad run doesn't spiral to
      unplayable within one session
- [ ] Has a `maxLevel` ceiling — doesn't ramp into unfair territory on a
      great run
- [ ] Difficulty level maps sensibly onto the mechanic that represents
      "harder" for this game's cognitive domain

## 4. Analytics (`GAME_ANALYTICS.md`)

- [ ] Emits `game_started`, `game_completed` at minimum, via
      `lib/engine/analytics.ts` helpers (not a raw SDK call)
- [ ] Emits `difficulty_adjusted` if the difficulty engine rubber-bands
- [ ] Emits `game_exited_early` from the `GameShell` exit path
- [ ] No PII, no free-text, no new identifier types added to event
      properties beyond the documented envelope

## 5. UI/UX (`GAME_UI_GUIDELINES.md`)

- [ ] Wrapped in `GameShell` for intro/exit/pause/results chrome
- [ ] Bugsy intro line + results-screen reaction line present, tone is warm
      regardless of outcome (no shaming on failure)
- [ ] Accent color matches the game's `Project.category`; domain tag (if
      shown) uses the matching `ClanCat` tint
- [ ] All tappable UI (not canvas-internal gameplay) ≥44×44px
- [ ] Fully playable and comprehensible with sound muted
- [ ] No color-only state signaling; no comparative/shaming copy in-game

## 6. Economy integration

- [ ] Awards XP/coins through the existing mechanism (mirrors
      `SnackCatchGame`'s `onEarnXp` pattern) rather than a parallel currency
- [ ] Points/timing values in `PROJECTS` are proportionate to comparable
      existing games (check `mins`/`points` ratio against current entries)

## 7. Manual verification

- [ ] Played end-to-end at the ~390×844 mobile viewport
- [ ] Played through a full failure path (quit mid-game, lose) and a full
      success path (complete/high score) — both feel appropriate per the UI
      guidelines above
- [ ] `pnpm lint` passes with no new warnings
- [ ] `pnpm build` succeeds

## 8. Docs

- [ ] If this game needed a new engine capability, it's documented in
      `GAME_ENGINE.md` in the same change
- [ ] If this game's difficulty mechanic doesn't fit the existing per-domain
      table in `GAME_DIFFICULTY.md`, that table is updated
- [ ] If this game introduces a genuinely new analytics event beyond the
      core set, it's added to the table in `GAME_ANALYTICS.md`
