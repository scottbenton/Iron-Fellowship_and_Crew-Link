import { useMemo } from "react";
import { orderedCategories } from "data/moves";
import { useCustomMoves } from "./useCustomMoves";
import { useStore } from "stores/store";

export function useMoves() {
  const { customMoveCategories } = useCustomMoves();

  const showDelveMoves = useStore(
    (store) => store.settings.delve.showDelveMoves
  );

  const moveCategories = useMemo(() => {
    return [...orderedCategories, ...customMoveCategories].filter(
      (category) =>
        showDelveMoves || category.Source.Title !== "Ironsworn: Delve"
    );
  }, [customMoveCategories, showDelveMoves]);

  return moveCategories;
}
