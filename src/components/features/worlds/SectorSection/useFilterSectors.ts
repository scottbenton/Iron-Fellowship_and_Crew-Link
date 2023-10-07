import { useSearchNoState } from "hooks/useSearch";
import { useMemo } from "react";
import { Sector } from "types/Sector.type";

export function useFilterSectors(
  sectors: { [key: string]: Sector },
  search: string
) {
  const { debouncedSearch } = useSearchNoState(search);

  const sortedSectorIds = useMemo(
    () =>
      Object.keys(sectors).sort(
        (l1, l2) =>
          sectors[l2].createdDate.getTime() - sectors[l1].createdDate.getTime()
      ),
    [sectors]
  );

  const filteredSectorIds = useMemo(() => {
    return sortedSectorIds.filter((sectorId) => {
      const sector = sectors[sectorId];
      return sector.name.toLowerCase().includes(debouncedSearch.toLowerCase());
    });
  }, [sectors, sortedSectorIds, debouncedSearch]);

  return { sortedSectorIds, filteredSectorIds };
}
