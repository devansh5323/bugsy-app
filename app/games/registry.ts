// The single source of truth for "which games exist"
// (docs/GAME_FOLDER_STRUCTURE.md). Adding a game = one entry here —
// page.tsx launches by registry lookup, so no app-shell edits per game.
//
// Components load through next/dynamic so each game is its own
// code-split chunk: at 20+ games the home screen must not pay for
// every game's canvas/logic up front.
//
// BirdSpike and SnackCatch predate the registry and join it when they
// migrate into app/games/ (GAME_ROADMAP.md Phase 1).

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { GameConfig } from "../lib/engine/types";
import { RIVER_CATCH_CONFIG } from "./river-catch/config";

// The launch contract every registered game component implements.
// `cleared` = some run this session met the game's win condition; the
// app decides whether that completes the project.
//
// `onEarnXp` is optional and callsite-driven, not a fixed reward path:
// the project-tab launch (page.tsx, via getGameByProjectId) credits a
// flat Project.points on clear through completeProject() and omits
// this prop; the onboarding steps (which don't go through project
// completion at all) pass awardXp so the run's dynamic XP
// (GameResult.xpEarned, computed by lib/engine/results.ts) is what
// gets credited. A game only needs to call onEarnXp if it's given.
export type GameLaunchProps = {
  onExit: (cleared: boolean) => void;
  onEarnXp?: (amount: number) => void;
};

export type GameRegistryEntry = {
  config: GameConfig;
  // The matching Project.id in app/lib/data.ts (PROJECTS array) —
  // the key page.tsx launches by.
  projectId: string;
  Component: ComponentType<GameLaunchProps>;
};

export const GAME_REGISTRY: readonly GameRegistryEntry[] = [
  {
    config: RIVER_CATCH_CONFIG,
    projectId: "p10",
    Component: dynamic(
      () => import("./river-catch/RiverCatchGame").then((m) => m.RiverCatchGame),
      { ssr: false },
    ),
  },
];

export function getGameConfig(id: string): GameConfig | undefined {
  return GAME_REGISTRY.find((g) => g.config.id === id)?.config;
}

export function getGameByProjectId(
  projectId: string,
): GameRegistryEntry | undefined {
  return GAME_REGISTRY.find((g) => g.projectId === projectId);
}

// For launch sites that aren't project-driven (onboarding steps play
// a game as a mission beat, not as a Projects-tab completion).
export function getGameById(id: string): GameRegistryEntry | undefined {
  return GAME_REGISTRY.find((g) => g.config.id === id);
}
