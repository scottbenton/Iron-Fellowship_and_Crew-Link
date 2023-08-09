import { useSearchNoState } from "hooks/useSearch";
import { useMemo } from "react";
import { LocationDocumentWithGMProperties } from "stores/world/currentWorld/locations/locations.slice.type";
import { NPCDocumentWithGMProperties } from "stores/world/currentWorld/npcs/npcs.slice.type";

export function useFilterNPCs(
  locations: { [key: string]: LocationDocumentWithGMProperties },
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

    return sortedNPCIds.filter((npcId) => {
      const npc = npcs[npcId];
      return (
        (npc.lastLocationId &&
          filteredLocationIds.includes(npc.lastLocationId)) ||
        npc.name.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    });
  }, [sortedNPCIds, npcs, locations, debouncedSearch]);

  return { sortedNPCIds, filteredNPCIds };
}
