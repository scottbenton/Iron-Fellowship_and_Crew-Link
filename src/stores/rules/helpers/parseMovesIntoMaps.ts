import {
  Datasworn,
  IdParser,
  PrimaryStringId,
} from "@datasworn-community/core";
import { RulesSliceData } from "../rules.slice.type";
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
      const sortedContents = sort
        ? Object.values(category.contents).sort((a, b) =>
            a.name.localeCompare(b.name)
          )
        : Object.values(category.contents);

      // Ids replaced by a move that lives in this same collection. Datasworn
      // allows a move to replace a sibling (Delve's alternate Reveal a Danger
      // replaces the original beside it). Both keys then resolve through
      // moveMap to the replacement, so the collection has to drop the original
      // or the replacement renders twice and the original disappears.
      const siblingReplacedIds = new Set<string>();

      sortedContents.forEach((move) => {
        if (move.replaces) {
          move.replaces.forEach((replaces) => {
            let replacesId = replaces;
            if (!replacesId.startsWith("move")) {
              replacesId = idMap[replacesId] ?? replacesId;
            }
            if (replacesId.startsWith("move")) {
              const replaceMatches = IdParser.getMatches(
                replacesId as PrimaryStringId,
                IdParser.tree
              );
              replaceMatches.forEach((val, key) => {
                if (val.type === "move") {
                  moveMap[key] = move;
                  siblingReplacedIds.add(key);
                }
              });
            }
          });
        }
        moveMap[move._id] = move;
        nonReplacedMoveMap[move._id] = move;
      });

      // Only entries of this collection are dropped. A move replacing one in a
      // different collection (Sundered Isles, Lodestar) leaves that collection
      // intact, so it keeps rendering its full list with the replacement
      // substituted in via moveMap.
      const visibleCategory = removeReplacedContents(
        category,
        siblingReplacedIds
      );

      if (category.replaces) {
        category.replaces.forEach((replaces) => {
          let replacesId = replaces;
          if (!replacesId.startsWith("move_category")) {
            replacesId = idMap[replacesId] ?? replacesId;
          }
          if (replacesId.startsWith("move_category")) {
            const replaceMatches = IdParser.getMatches(
              replacesId as PrimaryStringId,
              IdParser.tree
            );
            replaceMatches.forEach((val, key) => {
              if (val.type === "move_category") {
                moveCategoryMap[key] = visibleCategory;
              }
            });
          }
        });
      } else {
        moveCategoryMap[category._id] = visibleCategory;
      }
      nonReplacedMoveCategoryMap[category._id] = visibleCategory;
    }
  });

  return {
    moveCategoryMap,
    nonReplacedMoveCategoryMap,
    moveMap,
    nonReplacedMoveMap,
  };
}

function removeReplacedContents(
  category: Datasworn.MoveCategory,
  replacedIds: Set<string>
): Datasworn.MoveCategory {
  if (replacedIds.size === 0) {
    return category;
  }

  const contents: Record<string, Datasworn.Move> = {};
  Object.entries(category.contents ?? {}).forEach(([key, move]) => {
    if (!replacedIds.has(move._id)) {
      contents[key] = move;
    }
  });

  return { ...category, contents };
}
