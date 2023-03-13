import { useEffect, useState } from "react";
import { useSearch } from "hooks/useSearch";
import { orderedCategories, orderedDelveCategories } from "data/moves";
import { Move, MoveCategory } from "dataforged";
import { useCustomMoves } from "./useCustomMoves";

const categories = [...orderedCategories, ...orderedDelveCategories];

export function useFilterMoves() {
  const { setSearch, debouncedSearch } = useSearch();
  const [filteredMoves, setFilteredMoves] = useState(categories);
  const customMoveCategory = useCustomMoves();

  useEffect(() => {
    const results: MoveCategory[] = [];

    let allCategories = [...categories];
    if (customMoveCategory) {
      allCategories.push(customMoveCategory);
    }

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

      let Moves: { [key: string]: Move } = {};

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
  }, [debouncedSearch, customMoveCategory]);

  return { setSearch, filteredMoves };
}
