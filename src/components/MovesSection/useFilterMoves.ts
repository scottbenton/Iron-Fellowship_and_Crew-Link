import { useEffect, useState } from "react";
import useSearch from "hooks/useSearch";
import { moves } from "data/moves";
import { useSettingsStore } from "stores/settings.store";

function useFilterMoves(campaignId: string | undefined) {
  const { setSearch, debouncedSearch } = useSearch();
  const [filteredMoves, setFilteredMoves] = useState(moves);

  const customMoves = campaignId
    ? useSettingsStore(
        (store) => store.campaigns[campaignId]?.customMoves || []
      )
    : [];

  const customMoveCategory = {
    categoryName: "Custom Moves",
    moves: customMoves,
  };

  useEffect(() => {
    const results = [...moves, customMoveCategory]
      .filter(
        (moveCategory) =>
          moveCategory.moves.filter((move) =>
            move.name.toLowerCase().includes(debouncedSearch.toLowerCase())
          ).length > 0
      )
      .map((moveCategory) => {
        return {
          categoryName: moveCategory.categoryName,
          moves: moveCategory.moves.filter((move) =>
            move.name.toLowerCase().includes(debouncedSearch.toLowerCase())
          ),
        };
      });
    setFilteredMoves(results);
  }, [debouncedSearch, customMoves]);

  return { setSearch, filteredMoves };
}

export default useFilterMoves;
