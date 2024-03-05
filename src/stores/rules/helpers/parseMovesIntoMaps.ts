import { Datasworn } from "@datasworn/core";
import { RulesSliceData } from "../rules.slice.type";

export function parseMovesIntoMaps(
  moveCategories: Record<string, Datasworn.MoveCategory>
): RulesSliceData["moveMaps"] {
  const moveCategoryMap: Record<string, Datasworn.MoveCategory> = {};
  const moveMap: Record<string, Datasworn.Move> = {};

  Object.values(moveCategories).forEach((category) => {
    if (category.contents) {
      if (category.replaces) {
        moveCategoryMap[category.replaces] = category;
      }
      moveCategoryMap[category.id] = category;
      Object.values(category.contents).forEach((move) => {
        if (move.replaces) {
          moveMap[move.replaces] = move;
        }
        moveMap[move.id] = move;
      });
    }
  });

  return {
    moveCategoryMap,
    moveMap,
  };
}
