import { useSearchNoState } from "hooks/useSearch";
import { useMemo } from "react";
import { LocationDocumentWithGMProperties } from "stores/world/currentWorld/locations/locations.slice.type";
import { NPCDocumentWithGMProperties } from "stores/world/currentWorld/npcs/npcs.slice.type";
import { Sector } from "types/Sector.type";

export function useFilterNPCs(
  locations: { [key: string]: LocationDocumentWithGMProperties },
  sectors: { [key: string]: Sector },
  npcs: { [key: string]: NPCDocumentWithGMProperties },
  search: string
) {
  const { debouncedSearch } = useSearchNoState(search);

  const sortedNPCIds = useMemo(
    () =>
      Object.keys(npcs).sort(
        (l1, l2) =>
          npcs[l2].createdDate.getTime() - npcs[l1].createdDate.getTime()
      ),
    [npcs]
  );

  const filteredNPCIds = useMemo(() => {
    const filteredLocationIds = Object.keys(locations).filter((locationKey) => {
      return locations[locationKey].name
        .toLowerCase()
        .includes(debouncedSearch.toLowerCase());
    });

    const filteredSectorIds = Object.keys(sectors).filter((sectorId) => {
      return sectors[sectorId].name
        .toLocaleLowerCase()
        .includes(debouncedSearch.toLocaleLowerCase());
    });

    return sortedNPCIds.filter((npcId) => {
      const npc = npcs[npcId];
      return (
        (npc.lastLocationId &&
          filteredLocationIds.includes(npc.lastLocationId)) ||
        (npc.lastSectorId && filteredSectorIds.includes(npc.lastSectorId)) ||
        npc.name.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    });
  }, [sortedNPCIds, npcs, locations, debouncedSearch, sectors]);

  return { sortedNPCIds, filteredNPCIds };
}
