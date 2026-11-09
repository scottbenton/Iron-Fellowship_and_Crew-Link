import { Datasworn } from "@datasworn-community/core";
import { useMemo, useState } from "react";
import { useStore } from "stores/store";
import { useAnnounceSearchResults } from "hooks/useAnnounceSearchResults";

export enum CATEGORY_VISIBILITY {
  HIDDEN,
  SOME,
  ALL,
}

/** How many moves the filtered list shows, counted the way MoveCategory draws them. */
export function countVisibleMoves(
  rootCategoryIds: string[],
  categories: Record<string, Datasworn.MoveCategory>,
  visibleCategories: Record<string, CATEGORY_VISIBILITY>,
  visibleMoves: Record<string, boolean>
): number {
  return rootCategoryIds.reduce((total, categoryId) => {
    const category = categories[categoryId];
    const visibility = visibleCategories[categoryId];
    if (!category || visibility === CATEGORY_VISIBILITY.HIDDEN) {
      return total;
    }
    const moveIds = Object.values(category.contents ?? {}).map(
      (move) => move._id
    );
    return (
      total +
      moveIds.filter(
        (moveId) =>
          visibility === CATEGORY_VISIBILITY.ALL || visibleMoves[moveId]
      ).length
    );
  }, 0);
}

export function useFilterMoves() {
  const [search, setSearch] = useState("");

  const moveCategories = useStore(
    (store) => store.rules.moveMaps.moveCategoryMap,
  );
  const rootMoveCategories = useStore(
    (store) => store.rules.rootMoveCollectionIds,
  );

  const moveMap = useStore((store) => store.rules.moveMaps.moveMap);

  const {
    visibleMoveCategoryIds,
    visibleMoveIds,
    isEmpty,
  } = useMemo(() => {
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
        visibleCategories[category._id] = CATEGORY_VISIBILITY.ALL;
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
            visibleMoves[move._id] = true;
          }
        });
      }
      if (hasMove) {
        isEmpty = false;
        visibleCategories[category._id] = CATEGORY_VISIBILITY.SOME;
        // TODO - double check this
        // if (category.enhances) {
        //   visibleCategories[category.enhances] = CATEGORY_VISIBILITY.SOME;
        // }
      } else {
        visibleCategories[category._id] = CATEGORY_VISIBILITY.HIDDEN;
      }
    });

    return {
      visibleMoveCategoryIds: visibleCategories,
      visibleMoveIds: visibleMoves,
      isEmpty,
    };
  }, [moveCategories, search]);

  const resultCount = useMemo(
    () =>
      countVisibleMoves(
        rootMoveCategories,
        moveCategories,
        visibleMoveCategoryIds,
        visibleMoveIds
      ),
    [rootMoveCategories, moveCategories, visibleMoveCategoryIds, visibleMoveIds]
  );
  useAnnounceSearchResults(search, resultCount, "move", "moves");

  return {
    moveCategories,
    moveMap,
    setSearch,
    visibleMoveCategoryIds,
    visibleMoveIds,
    isSearchActive: !!search,
    isEmpty,
    rootMoveCategories,
  };
}
