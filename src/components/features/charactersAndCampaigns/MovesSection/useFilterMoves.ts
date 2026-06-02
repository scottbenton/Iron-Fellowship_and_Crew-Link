import { Datasworn } from "@datasworn/core";
import {
  CATEGORY_VISIBILITY,
  useDataswornCollectionFilter,
} from "hooks/useDataswornCollectionFilter";
import { useStore } from "stores/store";

export { CATEGORY_VISIBILITY };

export function useFilterMoves() {
  const moveCategories = useStore(
    (store) => store.rules.moveMaps.moveCategoryMap,
  );
  const rootMoveCategories = useStore(
    (store) => store.rules.rootMoveCollectionIds,
  );

  const moveMap = useStore((store) => store.rules.moveMaps.moveMap);

  const {
    setSearch,
    visibleCollectionIds,
    visibleItemIds,
    isSearchActive,
    isEmpty,
  } = useDataswornCollectionFilter<Datasworn.MoveCategory, Datasworn.Move>({
    collections: moveCategories,
    rootCollectionIds: rootMoveCategories,
  });

  return {
    moveCategories,
    moveMap,
    setSearch,
    visibleMoveCategoryIds: visibleCollectionIds,
    visibleMoveIds: visibleItemIds,
    isSearchActive,
    isEmpty,
    rootMoveCategories,
  };
}
