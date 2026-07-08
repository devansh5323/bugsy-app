# AI_RULES.md — Constitution for AI Sessions Working on AttentionHero

This file is the top-level contract for any AI agent (Claude Code, Codex, Copilot
Workspace, or a human pairing with one) working in this repository. If a
recommendation elsewhere in `/docs` conflicts with this file, this file wins.
If this file conflicts with direct, explicit instructions from the user in the
current session, the user wins — but say so out loud before deviating.

Read order for a fresh session touching game code:
1. `AI_RULES.md` (this file)
2. `AGENTS.md` (commands, repo layout, day-to-day conventions)
3. `GAME_FOLDER_STRUCTURE.md` + `GAME_ENGINE.md` (where things live, how they connect)
4. Whichever of `GAME_STANDARDS.md`, `GAME_ANALYTICS.md`, `GAME_UI_GUIDELINES.md`,
   `GAME_DIFFICULTY.md` is relevant to the task
5. `GAME_CHECKLIST.md` before declaring a new game "done"

## Who this product is for

AttentionHero (internal package name `child-app`, mascot "Bugsy") is a
cognitive-training game platform for children roughly **ages 8–15**, used by a
parent and child together. That audience shapes every rule below more than
typical engineering judgment would: kids are the players, parents are partly
the audience, and there is no adult "advanced settings" escape hatch. When in
doubt, default to the simpler, kinder, more forgiving behavior.

## Hard rules (do not do these without explicit user sign-off)

- **No PII, no behavioral profiling beyond what's needed for gameplay.** This
  is a children's app. Do not add analytics fields, third-party SDKs, ad
  trackers, or fingerprinting that could identify a specific child or capture
  more than gameplay/performance data. See `GAME_ANALYTICS.md` for the
  allowed event shape. If a feature seems to require PII, stop and ask.
- **No new backend, database, or account system** without discussion. The app
  is currently 100% client-side (Next.js + `localStorage`, no `.env`, no API
  routes). That is a deliberate current state, not an oversight — see
  `GAME_ROADMAP.md` Phase 5. Don't silently introduce Supabase/Firebase/a
  custom API to solve a local problem.
- **No new state-management or navigation library** (Redux, Zustand, Recoil,
  React Router, React Navigation, etc.) to replace the existing `Stage`
  discriminated-union state machine in `app/page.tsx` and plain
  `useState`/`useContext`. If the state machine is genuinely outstripped,
  raise it as an architecture decision, don't route around it quietly.
- **Never weaken TypeScript strictness.** `tsconfig.json` is `strict: true`.
  Do not add `any`, `// @ts-ignore`, or loosen compiler options to make a
  change compile faster.
- **Never ship content that shames failure.** No losing-streak callouts,
  no "you're behind," no red/angry failure states aimed at the child. Bugsy's
  worst reaction to a bad round is gentle disappointment, never anger at the
  player (anger is reserved for Bugsy's own neglected-care state, not for the
  child's performance — see `GAME_UI_GUIDELINES.md`).
- **Never silently change the difficulty model's safety rails** (grace
  periods, rubber-banding floor) documented in `GAME_DIFFICULTY.md`. These
  exist to prevent frustration spirals in young players; loosening them is a
  product decision, not a refactor.
- **Don't add production code before this docs pass is read.** This specific
  documentation task ships no application code — if you're picking up
  mid-task, confirm code is still untouched before writing any.

## Standing engineering defaults

- TypeScript everywhere, strict mode, no implicit `any`.
- Mobile-web-first: assume a ~390×844 viewport, touch input, no hover states
  as the primary affordance.
- Prefer editing/extending the existing patterns (canvas + `requestAnimationFrame`
  + refs for hot state) over introducing a new rendering paradigm (WebGL,
  React Three Fiber, DOM-heavy game boards) without discussion.
- Comments only where the *why* is non-obvious (a workaround, a perf hack, a
  safety rail). Don't restate what the code already says.
- Don't add tests/tooling infra (Jest, Vitest, Detox) speculatively; if you
  add one, wire it into `AGENTS.md`'s command list in the same change.
- Keep `/docs` in sync with reality. If a change makes one of these documents
  wrong, update the doc in the same PR/session — stale architecture docs are
  worse than none.

## How to disagree with these rules

If a task genuinely requires breaking one of the hard rules above, say so
explicitly to the user, explain the tradeoff in one or two sentences, and get
confirmation before proceeding. Don't reinterpret a hard rule into
non-existence to avoid an awkward pause.
