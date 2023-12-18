import { Rules } from "@datasworn/core";
import { rules as ironswornRules } from "@datasworn/ironsworn-classic/json/classic.json";
import { rules as starforgedRules } from "@datasworn/starforged/json/starforged.json";
import { getGameSystem } from "functions/getGameSystem";
import { GAME_SYSTEMS, GameSystemChooser } from "types/GameSystems.type";

const gameSystem = getGameSystem();
const rulesMap: GameSystemChooser<Rules> = {
  [GAME_SYSTEMS.IRONSWORN]: ironswornRules as Rules,
  [GAME_SYSTEMS.STARFORGED]: starforgedRules as Rules,
};

export const rules = rulesMap[gameSystem];
