import { useMemo, useState } from "react";
import { useStore } from "stores/store";

export enum CATEGORY_VISIBILITY {
  HIDDEN,
  SOME,
  ALL,
}

export function useFilterMoves() {
  const [search, setSearch] = useState("");

  const moveCategories = useStore(
    (store) => store.rules.moveMaps.moveCategoryMap
  );

  const moveMap = useStore((store) => store.rules.moveMaps.moveMap);

  const { visibleMoveCategoryIds, visibleMoveIds, isEmpty } = useMemo(() => {
    const visibleCategories: Record<string, CATEGORY_VISIBILITY> = {};
    const visibleMoves: Record<string, boolean> = {};
    let isEmpty: boolean = true;

    Object.values(moveCategories).forEach((category) => {
      if (
        !search ||
        (category.name
          .toLocaleLowerCase()
          .includes(search.toLocaleLowerCase()) &&
          Object.keys(category.contents ?? {}).length > 0)
      ) {
        visibleCategories[category.id] = CATEGORY_VISIBILITY.ALL;
        isEmpty = false;
        return;
      }

      let hasMove = false;

      const contents = category.contents;
      if (contents) {
        Object.keys(contents).forEach((moveId) => {
          const move = contents[moveId];

          if (
            move.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())
          ) {
            hasMove = true;
            visibleMoves[move.id] = true;
          }
        });
      }
      if (hasMove) {
        isEmpty = false;
        visibleCategories[category.id] = CATEGORY_VISIBILITY.SOME;
        if (category.enhances) {
          visibleCategories[category.enhances] = CATEGORY_VISIBILITY.SOME;
        }
      } else {
        visibleCategories[category.id] = CATEGORY_VISIBILITY.HIDDEN;
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
    moveMap,
    setSearch,
    visibleMoveCategoryIds,
    visibleMoveIds,
    isSearchActive: !!search,
    isEmpty,
  };
}
