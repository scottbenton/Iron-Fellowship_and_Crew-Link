import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useStore } from "stores/store";
import { useListenToLocations } from "stores/world/currentWorld/locations/useListenToLocations";
import { useListenToLoreDocuments } from "stores/world/currentWorld/lore/useListenToLoreDocuments";
import { useListenToNPCs } from "stores/world/currentWorld/npcs/useListenToNPCs";
import { useListenToSectorLocations } from "stores/world/currentWorld/sector/sectorLocations/useListenToSectorLocations";
import { useListenToSectors } from "stores/world/currentWorld/sector/useListenToSectors";

export function useSyncStore() {
  const { worldId } = useParams();

  const setWorldId = useStore(
    (store) => store.worlds.currentWorld.setCurrentWorldId
  );

  useEffect(() => {
    setWorldId(worldId);
    return () => {
      setWorldId(undefined);
    };
  }, [setWorldId, worldId]);

  useListenToSectorLocations();
  useListenToLocations();
  useListenToNPCs();
  useListenToLoreDocuments();
  useListenToSectors();
}
