// The single source of truth for "which games exist"
// (docs/GAME_FOLDER_STRUCTURE.md). Adding a game = one entry here;
// menus, pickers, and analytics rollups enumerate from this registry,
// never by hand.
//
// Empty on purpose: the engine ships first, games register as they're
// built (or migrated — BirdSpike and SnackCatch predate the registry
// and join it when they move into app/games/, GAME_ROADMAP.md Phase 1).

import type { GameConfig } from "../lib/engine/types";

export const GAME_REGISTRY: readonly GameConfig[] = [];

export function getGameConfig(id: string): GameConfig | undefined {
  return GAME_REGISTRY.find((g) => g.id === id);
}
