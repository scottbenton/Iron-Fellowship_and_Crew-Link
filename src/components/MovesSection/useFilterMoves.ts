import { useEffect, useState } from "react";
import useSearch from "hooks/useSearch";
import { orderedCategories, orderedDelveCategories } from "data/moves";
import { Move, MoveCategory } from "dataforged";

const categories = [...orderedCategories, ...orderedDelveCategories];

export function useFilterMoves() {
  const { setSearch, debouncedSearch } = useSearch();
  const [filteredMoves, setFilteredMoves] = useState(categories);

  // const customMoves = campaignId
  //   ? useSettingsStore(
  //       (store) => store.campaigns[campaignId]?.customMoves || []
  //     )
  //   : [];

  // const customMoveCategory = {
  //   categoryName: "Custom Moves",
  //   moves: customMoves,
  // };

  useEffect(() => {
    const results: MoveCategory[] = [];

    categories.forEach((category) => {
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
  }, [debouncedSearch]);

  return { setSearch, filteredMoves };
}
