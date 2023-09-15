import type { Move } from "dataforged";
import {
  ironswornMoveCategories,
  starforgedMoveCategories,
} from "./dataforged";
import { getSystem } from "hooks/useGameSystem";
import { GAME_SYSTEMS, GameSystemChooser } from "types/GameSystems.type";

const gameSystem = getSystem();
const moveCategories: GameSystemChooser<typeof ironswornMoveCategories> = {
  [GAME_SYSTEMS.IRONSWORN]: ironswornMoveCategories,
  [GAME_SYSTEMS.STARFORGED]: starforgedMoveCategories,
};
const categoryOrders: GameSystemChooser<string[]> = {
  [GAME_SYSTEMS.IRONSWORN]: [
    "Adventure",
    "Relationship",
    "Combat",
    "Suffer",
    "Quest",
    "Fate",
    "Delve",
    "Threat",
    "Failure",
    "Rarity",
  ],
  [GAME_SYSTEMS.STARFORGED]: [
    "Session",
    "Adventure",
    "Quest",
    "Connection",
    "Exploration",
    "Combat",
    "Suffer",
    "Recover",
    "Threshold",
    "Legacy",
    "Fate",
    "Scene challenge",
  ],
};
const category = moveCategories[gameSystem];
const categoryOrder = categoryOrders[gameSystem];

export const orderedCategories = categoryOrder.map(
  (categoryId) => category[categoryId]
);

export const moveMap: { [key: string]: Move } = {};
orderedCategories.forEach((category) => {
  Object.values(category.Moves).forEach((move) => {
    moveMap[move.$id] = move;
  });
});
