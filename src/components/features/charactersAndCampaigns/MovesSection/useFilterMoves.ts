import { useMemo, useState } from "react";
import { useMoves } from "./useMoves";

export enum CATEGORY_VISIBILITY {
  HIDDEN,
  SOME,
  ALL,
}

export function useFilterMoves() {
  const [search, setSearch] = useState("");

  const moveCategories = useMoves();
  const { visibleMoveCategoryIds, visibleMoveIds, isEmpty } = useMemo(() => {
    const visibleCategories: Record<string, CATEGORY_VISIBILITY> = {};
    const visibleMoves: Record<string, boolean> = {};
    let isEmpty: boolean = true;

    moveCategories.forEach((category) => {
      if (
        !search ||
        (category.Title.Standard.toLocaleLowerCase().includes(
          search.toLocaleLowerCase()
        ) &&
          Object.keys(category.Moves).length > 0)
      ) {
        visibleCategories[category.$id] = CATEGORY_VISIBILITY.ALL;
        isEmpty = false;
        return;
      }

      let hasMove = false;

      Object.keys(category.Moves).forEach((moveId) => {
        const move = category.Moves[moveId];

        if (
          move.Title.Standard.toLocaleLowerCase().includes(
            search.toLocaleLowerCase()
          )
        ) {
          hasMove = true;
          visibleMoves[move.$id] = true;
        }
      });

      if (hasMove) {
        isEmpty = false;
        visibleCategories[category.$id] = CATEGORY_VISIBILITY.SOME;
      } else {
        visibleCategories[category.$id] = CATEGORY_VISIBILITY.HIDDEN;
      }
    });

    return {
      visibleMoveCategoryIds: visibleCategories,
      visibleMoveIds: visibleMoves,
      isEmpty,
    };
  }, [moveCategories, search]);

  return {
    moveCategories,
    setSearch,
    visibleMoveCategoryIds,
    visibleMoveIds,
    isSearchActive: !!search,
    isEmpty,
  };
}
