import { useWorldPermissions } from "components/features/worlds/useWorldPermissions";
import { Unsubscribe } from "firebase/firestore";
import { useEffect } from "react";
import { useStore } from "stores/store";

export function useListenToSectorLocations() {
  const openWorldId = useStore(
    (store) => store.worlds.currentWorld.currentWorldId
  );
  const openSectorId = useStore(
    (store) => store.worlds.currentWorld.currentWorldSectors.openSectorId
  );
  const subscribe = useStore(
    (store) => store.worlds.currentWorld.currentWorldSectors.locations.subscribe
  );
  const resetStore = useStore(
    (store) =>
      store.worlds.currentWorld.currentWorldSectors.locations.resetStore
  );

  const openSectorLocationId = useStore(
    (store) =>
      store.worlds.currentWorld.currentWorldSectors.locations.openLocationId
  );
  const { isSingleplayer, showGMFields } = useWorldPermissions();
  const subscribeToSectorLocationNotes = useStore(
    (store) =>
      store.worlds.currentWorld.currentWorldSectors.locations
        .subscribeToLocationNotes
  );
  const resetStoreNotes = useStore(
    (store) =>
      store.worlds.currentWorld.currentWorldSectors.locations.resetStoreNotes
  );

  useEffect(() => {
    let unsubscribe: Unsubscribe;
    if (openWorldId && openSectorId) {
      unsubscribe = subscribe(openWorldId, openSectorId);
    }
    return () => {
      unsubscribe && unsubscribe();
      resetStore();
    };
  }, [openWorldId, openSectorId, subscribe, resetStore]);

  useEffect(() => {
    let unsubscribes: Unsubscribe[] = [];
    if (openSectorLocationId) {
      if (showGMFields) {
        unsubscribes.push(
          subscribeToSectorLocationNotes(openSectorLocationId, true)
        );
      }
      if (!isSingleplayer) {
        unsubscribes.push(
          subscribeToSectorLocationNotes(openSectorLocationId, false)
        );
      }
    }
    return () => {
      unsubscribes.forEach((unsubscribe) => unsubscribe());
      resetStoreNotes();
    };
  }, [
    openSectorLocationId,
    showGMFields,
    isSingleplayer,
    subscribeToSectorLocationNotes,
    resetStoreNotes,
  ]);
}
