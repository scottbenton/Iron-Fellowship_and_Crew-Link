import { useSearch } from "hooks/useSearch";
import { useEffect, useState } from "react";
import {
  LocationDocumentWithGMProperties,
  NPC,
} from "stores/sharedLocationStore";

export function useFilterNPCs(
  locations: { [key: string]: LocationDocumentWithGMProperties },
  npcs: { [key: string]: NPC }
) {
  const { search, setSearch, debouncedSearch } = useSearch();

  const [filteredNPCs, setFilteredNPCs] = useState<{ [key: string]: NPC }>({});

  useEffect(() => {
    let tmpNPCs: typeof filteredNPCs = {};
    const filteredLocationIds = Object.keys(locations).filter((locationKey) => {
      return locations[locationKey].name
        .toLowerCase()
        .includes(debouncedSearch.toLowerCase());
    });

    Object.keys(npcs).forEach((npcId) => {
      const npc = npcs[npcId];
      if (
        npc.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        (npc.lastLocationId && filteredLocationIds.includes(npc.lastLocationId))
      ) {
        tmpNPCs[npcId] = npc;
      }
    });

    setFilteredNPCs(tmpNPCs);
  }, [debouncedSearch, locations, npcs]);

  return { search, setSearch, filteredNPCs };
}
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
