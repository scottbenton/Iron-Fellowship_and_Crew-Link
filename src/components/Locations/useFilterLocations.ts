import { useSearchNoState } from "hooks/useSearch";
import { useMemo } from "react";
import { LocationDocumentWithGMProperties } from "stores/sharedLocationStore";

export function useFilterLocations(
  locations: {
    [key: string]: LocationDocumentWithGMProperties;
  },
  search: string
) {
  const { debouncedSearch } = useSearchNoState(search);

  const sortedLocationIds = useMemo(
    () =>
      Object.keys(locations).sort(
        (l1, l2) =>
          locations[l2].createdDate.getTime() -
          locations[l1].createdDate.getTime()
      ),
    [locations]
  );

  const filteredLocationIds = useMemo(
    () =>
      sortedLocationIds.filter((locationId) =>
        locations[locationId].name
          .toLowerCase()
          .includes(debouncedSearch.toLowerCase())
      ),
    [sortedLocationIds, locations, debouncedSearch]
  );

  return { filteredLocationIds, sortedLocationIds };
}
