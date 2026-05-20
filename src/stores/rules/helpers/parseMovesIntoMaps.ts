import { Datasworn, IdParser } from "@datasworn/core";
import { RulesSliceData } from "../rules.slice.type";
import { Primary } from "@datasworn/core/dist/StringId";
import { idMap } from "data/idMap";

export function parseMovesIntoMaps(
  moveCategories: Record<string, Datasworn.MoveCategory>,
  sort?: boolean
): RulesSliceData["moveMaps"] {
  const moveCategoryMap: Record<string, Datasworn.MoveCategory> = {};
  const nonReplacedMoveCategoryMap: Record<string, Datasworn.MoveCategory> = {};
  const moveMap: Record<string, Datasworn.Move> = {};
  const nonReplacedMoveMap: Record<string, Datasworn.Move> = {};

  const sortedCategories = sort
    ? Object.values(moveCategories).sort((a, b) => a.name.localeCompare(b.name))
    : Object.values(moveCategories);

  sortedCategories.forEach((category) => {
    if (category.contents) {
      if (category.replaces) {
        category.replaces.forEach((replaces) => {
          let replacesId = replaces;
          if (!replacesId.startsWith("move_category")) {
            replacesId = idMap[replacesId] ?? replacesId;
          }
          if (replacesId.startsWith("move_category")) {
            const replaceMatches = IdParser.getMatches(
              replacesId as Primary,
              IdParser.tree
            );
            replaceMatches.forEach((val, key) => {
              if (val.type === "move_category") {
                moveCategoryMap[key] = category;
              }
            });
          }
        });
      } else {
        moveCategoryMap[category._id] = category;
      }
      nonReplacedMoveCategoryMap[category._id] = category;

      const sortedContents = sort
        ? Object.values(category.contents).sort((a, b) =>
            a.name.localeCompare(b.name)
          )
        : Object.values(category.contents);

      sortedContents.forEach((move) => {
        if (move.replaces) {
          move.replaces.forEach((replaces) => {
            let replacesId = replaces;
            if (!replacesId.startsWith("move")) {
              replacesId = idMap[replacesId] ?? replacesId;
            }
            if (replacesId.startsWith("move")) {
              const replaceMatches = IdParser.getMatches(
                replacesId as Primary,
                IdParser.tree
              );
              replaceMatches.forEach((val, key) => {
                if (val.type === "move") {
                  moveMap[key] = move;
                }
              });
            }
          });
        }
        moveMap[move._id] = move;
        nonReplacedMoveMap[move._id] = move;
      });
    }
  });

  return {
    moveCategoryMap,
    nonReplacedMoveCategoryMap,
    moveMap,
    nonReplacedMoveMap,
  };
}
