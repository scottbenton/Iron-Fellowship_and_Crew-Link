import { useSearch } from "hooks/useSearch";
import { useEffect, useState } from "react";
import { LocationDocumentWithGMProperties } from "stores/sharedLocationStore";

export function useFilterLocations(locations: {
  [key: string]: LocationDocumentWithGMProperties;
}) {
  const { search, setSearch, debouncedSearch } = useSearch();

  const [filteredLocations, setFilteredLocations] = useState<{
    [key: string]: LocationDocumentWithGMProperties;
  }>({});

  useEffect(() => {
    let tmpLocations: { [key: string]: LocationDocumentWithGMProperties } = {};
    Object.keys(locations).forEach((locationKey) => {
      if (
        locations[locationKey].name
          .toLowerCase()
          .includes(debouncedSearch.toLowerCase())
      ) {
        tmpLocations[locationKey] = locations[locationKey];
      }
    });

    setFilteredLocations(tmpLocations);
  }, [debouncedSearch, locations]);

  return { search, setSearch, filteredLocations };
}
