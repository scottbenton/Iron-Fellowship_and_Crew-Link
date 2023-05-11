import { useGetWorld } from "api/worlds/getWorld";
import { useAuth } from "providers/AuthProvider";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useWorldsStore } from "stores/worlds.store";

export function useWorld() {
  const { userId, worldId } = useParams();
  const uid = useAuth().user?.uid;

  const isAdmin = uid === userId;

  const worlds = useWorldsStore((store) => store.worlds);
  const areUsersWorldsLoading = useWorldsStore((store) => store.loading);

  const {
    getWorld,
    data: readOnlyWorld,
    loading: readOnlyWorldLoading,
  } = useGetWorld();

  useEffect(() => {
    if (!isAdmin && uid && userId && worldId) {
      getWorld({ uid: userId, worldId }).catch(() => {});
    }
  }, [isAdmin, uid, userId, worldId]);

  return {
    worldOwnerId: userId,
    worldId,
    world: isAdmin ? (worldId ? worlds[worldId] : undefined) : readOnlyWorld,
    isLoading: isAdmin ? areUsersWorldsLoading : readOnlyWorldLoading,
    canEdit: isAdmin,
  };
}
