import { Unsubscribe } from "firebase/firestore";
import { useEffect } from "react";
import { useStore } from "stores/store";

export function useListenToSectors() {
  const worldId = useStore((store) => store.worlds.currentWorld.currentWorldId);
  const worldOwnerIds = useStore((store) =>
    store.worlds.currentWorld.currentWorld
      ? store.worlds.currentWorld.currentWorld.ownerIds ?? []
      : undefined
  );
  const listenToSectors = useStore(
    (store) => store.worlds.currentWorld.currentWorldSectors.subscribe
  );

  useEffect(() => {
    let unsubscribe: Unsubscribe;

    if (worldId && worldOwnerIds) {
      unsubscribe = listenToSectors(worldId, worldOwnerIds ?? []);
    }

    return () => {
      unsubscribe && unsubscribe();
    };
  }, [worldId, worldOwnerIds, listenToSectors]);
}
