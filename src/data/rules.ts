import { Datasworn } from "@datasworn/core";
import { rules as ironswornRules } from "@datasworn/ironsworn-classic/json/classic.json";
import { rules as starforgedRules } from "@datasworn/starforged/json/starforged.json";
import { getSystem } from "hooks/useGameSystem";
import { GAME_SYSTEMS, GameSystemChooser } from "types/GameSystems.type";

const gameSystem = getSystem();
const rulesMap: GameSystemChooser<Datasworn.Rules> = {
  [GAME_SYSTEMS.IRONSWORN]: ironswornRules as Datasworn.Rules,
  [GAME_SYSTEMS.STARFORGED]: starforgedRules as Datasworn.Rules,
};

export const rules = rulesMap[gameSystem];
