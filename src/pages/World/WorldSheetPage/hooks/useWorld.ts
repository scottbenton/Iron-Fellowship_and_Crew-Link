import { useGetWorld } from "api/worlds/getWorld";
import { useAuth } from "providers/AuthProvider";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useWorldsStore } from "stores/worlds.store";
import { useWorldSheetStore } from "../worldSheet.store";

export function useWorld() {
  const { worldId } = useParams();

  const worlds = useWorldsStore((store) => store.worlds);
  const isLoading = useWorldsStore((store) => store.loading);
  const setWorld = useWorldSheetStore((store) => store.setWorld);

  const uid = useAuth().user?.uid;
  const worldOwnerId = worldId ? worlds[worldId]?.ownerId : undefined;
  const world = worldId ? worlds[worldId] : undefined;

  useEffect(() => {
    setWorld(worldOwnerId, worldId, world);
  }, [worldId, worldOwnerId, world]);

  return {
    worldOwnerId,
    worldId,
    world,
    isLoading,
    canEdit: !!uid && uid === worldOwnerId,
  };
}
