import { MoveOracle } from "../types/Moves.type";
import jsonMoveOracles from "./move-oracles.json";
import { ironsworn, Move } from "dataforged";

export const moveCategories = ironsworn["Move categories"];

const categoryOrder = [
  "Adventure",
  "Relationship",
  "Combat",
  "Suffer",
  "Quest",
  "Fate",
];
const delveCategoryOrder = ["Delve", "Threat", "Failure", "Rarity"];

const moveOracles: { [key: string]: MoveOracle } = {};
jsonMoveOracles.Oracles.map((oracle) => {
  moveOracles[oracle.Move] = {
    table: oracle["Oracle Table"].map((table) => ({
      chance: table.Chance,
      description: table.Description,
    })),
  };
});

export const orderedCategories = categoryOrder.map(
  (categoryId) => moveCategories[categoryId]
);
export const orderedDelveCategories = delveCategoryOrder.map(
  (categoryId) => moveCategories[categoryId]
);

export const allMoveCategories = [
  ...orderedCategories,
  ...orderedDelveCategories,
];

export const moveMap: { [key: string]: Move } = {};
allMoveCategories.forEach((category) => {
  Object.values(category.Moves).forEach((move) => {
    moveMap[move.$id] = move;
  });
});
