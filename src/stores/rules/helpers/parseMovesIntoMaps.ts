import { Datasworn } from "@datasworn/core";
import { RulesSliceData } from "../rules.slice.type";

export function parseMovesIntoMaps(
  moveCategories: Record<string, Datasworn.MoveCategory>
): RulesSliceData["moveMaps"] {
  const moveMap: Record<string, Datasworn.Move> = {};

  Object.values(moveCategories).forEach((category) => {
    if (category.contents) {
      Object.values(category.contents).forEach((move) => {
        moveMap[move.id] = move;
      });
    }
  });

  return {
    moveCategoryMap: moveCategories,
    moveMap,
  };
}
