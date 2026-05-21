import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useStore } from "stores/store";
import { useListenToLocations } from "stores/world/currentWorld/locations/useListenToLocations";
import { useListenToLoreDocuments } from "stores/world/currentWorld/lore/useListenToLoreDocuments";
import { useListenToNPCs } from "stores/world/currentWorld/npcs/useListenToNPCs";

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

  useListenToLocations();
  useListenToNPCs();
  useListenToLoreDocuments();
}
