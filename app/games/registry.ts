// The single source of truth for "which games exist"
// (docs/GAME_FOLDER_STRUCTURE.md). Adding a game = one entry here;
// menus, pickers, and analytics rollups enumerate from this registry,
// never by hand.
//
// BirdSpike and SnackCatch predate the registry and join it when they
// migrate into app/games/ (GAME_ROADMAP.md Phase 1).

import type { GameConfig } from "../lib/engine/types";
import { RIVER_CATCH_CONFIG } from "./river-catch/config";

export const GAME_REGISTRY: readonly GameConfig[] = [RIVER_CATCH_CONFIG];

export function getGameConfig(id: string): GameConfig | undefined {
  return GAME_REGISTRY.find((g) => g.id === id);
}
