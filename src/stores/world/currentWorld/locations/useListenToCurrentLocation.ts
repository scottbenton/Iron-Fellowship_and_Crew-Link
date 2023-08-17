import { useEffect } from "react";
import { useStore } from "stores/store";

export function useListenToCurrentLocation(locationId: string) {
  const worldId = useStore((store) => store.worlds.currentWorld.currentWorldId);
  const worldOwnerIds = useStore((store) =>
    store.worlds.currentWorld.currentWorld
      ? store.worlds.currentWorld.currentWorld.ownerIds ?? []
      : undefined
  );
  const listenToCurrentLocation = useStore(
    (store) =>
      store.worlds.currentWorld.currentWorldLocations.subscribeToOpenLocation
  );

  useEffect(() => {
    const unsubscribe = listenToCurrentLocation(locationId);

    return () => {
      unsubscribe();
    };
  }, [worldId, worldOwnerIds, listenToCurrentLocation, locationId]);
}
