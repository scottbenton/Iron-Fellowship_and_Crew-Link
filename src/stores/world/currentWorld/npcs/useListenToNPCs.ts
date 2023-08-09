import { Unsubscribe } from "firebase/firestore";
import { useEffect } from "react";
import { useStore } from "stores/store";

export function useListenToNPCs() {
  const worldId = useStore((store) => store.worlds.currentWorld.currentWorldId);
  const worldOwnerIds = useStore((store) =>
    store.worlds.currentWorld.currentWorld
      ? store.worlds.currentWorld.currentWorld.ownerIds ?? []
      : undefined
  );
  const listenToNPCs = useStore(
    (store) => store.worlds.currentWorld.currentWorldNPCs.subscribe
  );

  useEffect(() => {
    let unsubscribe: Unsubscribe;

    if (worldId && worldOwnerIds) {
      unsubscribe = listenToNPCs(worldId, worldOwnerIds ?? []);
    }

    return () => {
      unsubscribe && unsubscribe();
    };
  }, [worldId, worldOwnerIds, listenToNPCs]);
}
