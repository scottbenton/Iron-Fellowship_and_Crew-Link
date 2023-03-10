import type { Move } from "dataforged";
import { ironswornMoveCategories } from "./dataforged";

const categoryOrder = [
  "Adventure",
  "Relationship",
  "Combat",
  "Suffer",
  "Quest",
  "Fate",
];
const delveCategoryOrder = ["Delve", "Threat", "Failure", "Rarity"];

export const orderedCategories = categoryOrder.map(
  (categoryId) => ironswornMoveCategories[categoryId]
);
export const orderedDelveCategories = delveCategoryOrder.map(
  (categoryId) => ironswornMoveCategories[categoryId]
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
