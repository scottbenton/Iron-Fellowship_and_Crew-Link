import { Unsubscribe } from "firebase/firestore";
import { useEffect } from "react";
import { useStore } from "stores/store";

export function useListenToLocations() {
  const worldId = useStore((store) => store.worlds.currentWorld.currentWorldId);
  const worldOwnerIds = useStore((store) =>
    store.worlds.currentWorld.currentWorld
      ? store.worlds.currentWorld.currentWorld.ownerIds ?? []
      : undefined
  );
  const listenToLocations = useStore(
    (store) => store.worlds.currentWorld.currentWorldLocations.subscribe
  );

  useEffect(() => {
    let unsubscribe: Unsubscribe;

    if (worldId && worldOwnerIds) {
      unsubscribe = listenToLocations(worldId, worldOwnerIds ?? []);
    }

    return () => {
      unsubscribe && unsubscribe();
    };
  }, [worldId, worldOwnerIds, listenToLocations]);
}
