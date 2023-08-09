import { useEffect } from "react";
import { useStore } from "stores/store";

export function useListenToCurrentNPC(npcId: string) {
  const worldId = useStore((store) => store.worlds.currentWorld.currentWorldId);
  const worldOwnerIds = useStore((store) =>
    store.worlds.currentWorld.currentWorld
      ? store.worlds.currentWorld.currentWorld.ownerIds ?? []
      : undefined
  );
  const listenToCurrentNPC = useStore(
    (store) => store.worlds.currentWorld.currentWorldNPCs.subscribeToOpenNPC
  );

  useEffect(() => {
    const unsubscribe = listenToCurrentNPC(npcId);

    return () => {
      unsubscribe();
    };
  }, [worldId, worldOwnerIds, listenToCurrentNPC, npcId]);
}
