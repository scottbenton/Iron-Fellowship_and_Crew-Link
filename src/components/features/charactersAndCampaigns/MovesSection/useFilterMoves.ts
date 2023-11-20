import { useEffect, useState } from "react";
import { useSearch } from "hooks/useSearch";
import { orderedCategories } from "data/moves";
import { Move, MoveCategory } from "dataforged";
import { useCustomMoves } from "./useCustomMoves";
import { useStore } from "stores/store";

export function useFilterMoves() {
  const { setSearch, debouncedSearch } = useSearch();
  const [filteredMoves, setFilteredMoves] = useState(orderedCategories);
  const { customMoveCategories } = useCustomMoves();

  const showDelveMoves = useStore(
    (store) => store.settings.delve.showDelveMoves
  );

  useEffect(() => {
    const results: MoveCategory[] = [];

    const allCategories = [
      ...orderedCategories,
      ...customMoveCategories,
    ].filter(
      (category) =>
        showDelveMoves || category.Source.Title !== "Ironsworn: Delve"
    );

    allCategories.forEach((category) => {
      if (
        category.Title.Standard.toLocaleLowerCase().includes(
          debouncedSearch.toLocaleLowerCase()
        ) &&
        Object.keys(category.Moves).length > 0
      ) {
        results.push(category);
        return;
      }

      const Moves: { [key: string]: Move } = {};

      Object.keys(category.Moves).forEach((moveId) => {
        const move = category.Moves[moveId];

        if (
          move.Title.Standard.toLocaleLowerCase().includes(
            debouncedSearch.toLocaleLowerCase()
          )
        ) {
          Moves[moveId] = move;
        }
      });

      if (Object.keys(Moves).length > 0) {
        results.push({ ...category, Moves });
      }
    });

    setFilteredMoves(results);
  }, [debouncedSearch, customMoveCategories, showDelveMoves]);

  return { setSearch, filteredMoves };
}
