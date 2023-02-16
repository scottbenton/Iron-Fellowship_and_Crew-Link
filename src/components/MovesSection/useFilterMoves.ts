import { useEffect, useState } from "react";
import useSearch from "hooks/useSearch";
import { moves } from "data/moves";

function useFilterMoves() {
  const { setSearch, debouncedSearch } = useSearch();
  const [filteredMoves, setFilteredMoves] = useState(moves);

  useEffect(() => {
    const results = moves
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
  }, [debouncedSearch]);

  return { setSearch, filteredMoves };
}

export default useFilterMoves;
