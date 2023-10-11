import { useWorldPermissions } from "components/features/worlds/useWorldPermissions";
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

  const openSectorId = useStore(
    (store) => store.worlds.currentWorld.currentWorldSectors.openSectorId
  );
  const listenToSectorNotes = useStore(
    (store) =>
      store.worlds.currentWorld.currentWorldSectors.subscribeToSectorNotes
  );
  const resetStoreNotes = useStore(
    (store) => store.worlds.currentWorld.currentWorldSectors.resetStoreNotes
  );
  const { isSingleplayer, showGMFields } = useWorldPermissions();

  useEffect(() => {
    let unsubscribe: Unsubscribe;

    if (worldId && worldOwnerIds) {
      unsubscribe = listenToSectors(worldId, worldOwnerIds ?? []);
    }

    return () => {
      unsubscribe && unsubscribe();
    };
  }, [worldId, worldOwnerIds, listenToSectors]);

  useEffect(() => {
    let unsubscribes: Unsubscribe[] = [];
    if (openSectorId) {
      if (showGMFields) {
        unsubscribes.push(listenToSectorNotes(openSectorId, true));
      }
      if (!isSingleplayer) {
        unsubscribes.push(listenToSectorNotes(openSectorId, false));
      }
    }
    return () => {
      unsubscribes.forEach((unsubscribe) => unsubscribe());
      resetStoreNotes();
    };
  }, [
    openSectorId,
    showGMFields,
    isSingleplayer,
    listenToSectorNotes,
    resetStoreNotes,
  ]);
}
