import { Unsubscribe } from "firebase/firestore";
import { useEffect } from "react";
import { useStore } from "stores/store";

export function useListenToLoreDocuments() {
  const worldId = useStore((store) => store.worlds.currentWorld.currentWorldId);
  const worldOwnerIds = useStore((store) =>
    store.worlds.currentWorld.currentWorld
      ? store.worlds.currentWorld.currentWorld.ownerIds ?? []
      : undefined
  );
  const listenToLoreDocuments = useStore(
    (store) => store.worlds.currentWorld.currentWorldLore.subscribe
  );

  useEffect(() => {
    let unsubscribe: Unsubscribe;

    if (worldId && worldOwnerIds) {
      unsubscribe = listenToLoreDocuments(worldId, worldOwnerIds ?? []);
    }

    return () => {
      unsubscribe && unsubscribe();
    };
  }, [worldId, worldOwnerIds, listenToLoreDocuments]);
}
