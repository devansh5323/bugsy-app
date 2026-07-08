# GAME_ANALYTICS.md — Event Model & Gameplay Metrics

## Current state (be honest about this)

**No analytics is wired up today.** No Amplitude/Mixpanel/PostHog/Segment/
Firebase/GA — nothing. This document defines the event model *now*, ahead of
implementation, so that when instrumentation is added, it's added
consistently and by every game, rather than each game inventing its own
shape. Until a backend/collector exists, `app/lib/engine/analytics.ts`
(`GAME_ENGINE.md`) should implement these functions as no-ops or
`console.debug` logging — the call sites in game code should not change when
a real backend is plugged in later.

## Privacy constraints (read `AI_RULES.md` first)

This is a children's app. The event model below is designed to be
**COPPA-compatible by construction**:

- No name, email, birthdate, precise location, device identifiers, or
  free-text input is ever an event property.
- The only identifier is a locally-generated, non-resettable-to-a-person
  anonymous `session_id` / `device_id` (a random UUID stored in
  `localStorage`, not tied to any account — there are no accounts).
- No cross-app or cross-site tracking SDKs (no ad pixels, no fingerprinting
  libraries). If a future analytics vendor is chosen, prefer one with a
  first-party, no-ad-network mode (e.g. self-hosted PostHog, Plausible-style)
  over ad-tech-adjacent tools.
- Parents, not children, are the audience for any aggregate reporting built
  from this data (see `GAME_ROADMAP.md` Phase 4 parent dashboard) — the
  event model should support "how is my child progressing" rollups, not
  individual-round replay/surveillance.

## Naming convention

- Event names: `snake_case`, `<noun>_<past-tense-verb>` (`game_started`,
  `game_completed`, `round_completed`, `difficulty_adjusted`).
- Property names: `snake_case`.
- Every event carries a common envelope (below) plus event-specific
  properties — never invent a one-off property name for something the
  envelope already covers.

## Common envelope (every event)

| Property | Type | Notes |
|---|---|---|
| `event` | string | event name |
| `timestamp` | number (epoch ms) | injected by the caller, not generated inside a testable engine function |
| `session_id` | string (uuid) | rotates per app session, `localStorage`-backed |
| `game_id` | string | matches `GameConfig.id`; `null`/omitted for non-game events |
| `domain` | `CognitiveDomain` | the game's tagged cognitive domain, denormalized onto every game event for easy rollup without a join |
| `app_version` | string | from `package.json` at build time |

## Core event set

| Event | When | Extra properties |
|---|---|---|
| `game_started` | game transitions `intro → playing` | `difficulty_level_start` |
| `round_completed` | one discrete unit of play finishes (a jump cleared, a memory sequence solved) — granularity is game-defined | `round_index`, `success` (bool), `reaction_time_ms` (if applicable) |
| `difficulty_adjusted` | the adaptive engine changes level (see `GAME_DIFFICULTY.md`) | `previous_level`, `new_level`, `reason`: `"ramp"` \| `"rubber_band_up"` \| `"rubber_band_down"` |
| `game_paused` / `game_resumed` | pause overlay opened/closed | — |
| `game_completed` | game reaches `results` status, i.e. `GameResult` produced | `score`, `duration_ms`, `outcome` (`"cleared"`\|`"failed"`\|`"quit"`), `difficulty_level_end`, `xp_earned` |
| `game_exited_early` | player exits via `GameShell` exit button before completion | `elapsed_ms`, `difficulty_level_at_exit` |

Games may add game-specific events beyond this set (e.g. a memory game
emitting `sequence_recalled`), but must not duplicate what the core set
already captures, and new event names must follow the same
envelope+naming convention.

## Gameplay metrics derived from these events

These are the rollups the event model exists to support — useful as a sanity
check that a new event captures what's actually needed:

- **Engagement**: sessions/day, games played/session, `game_exited_early`
  rate per game (a high early-exit rate signals a game is too hard/boring
  before completion — feed this back into difficulty tuning, not just
  product review).
- **Per-domain progress**: rolling average `score`/`difficulty_level_end`
  over time, grouped by `domain` — this is the basis for any future
  "your child's focus is improving" parent-facing summary.
- **Difficulty health**: ratio of `rubber_band_down` to `rubber_band_up`
  adjustments per game — persistently high `rubber_band_down` means a game's
  base curve is miscalibrated too hard for its target age range (see
  `GAME_DIFFICULTY.md`).
- **Retention proxy**: return sessions per device_id over 7/30 days (no
  identity needed beyond the anonymous device id already described).

## Adding a new event

1. Does an existing event already cover this with an extra property? Prefer
   extending over adding a new event name.
2. Does it need any property not in the common envelope's allowed set (no
   PII — see above)? If it does, stop and reconsider.
3. Document it in the Core event set table above in the same change that
   adds the `trackX()` call in `lib/engine/analytics.ts` or a game's own
   code — this table must stay authoritative.
