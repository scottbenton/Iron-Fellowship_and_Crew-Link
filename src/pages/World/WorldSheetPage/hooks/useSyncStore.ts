import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useStore } from "stores/store";

export function useSyncStore() {
  const { worldId } = useParams();

  const setWorldId = useStore(
    (store) => store.worlds.currentWorld.setCurrentWorldId
  );

  useEffect(() => {
    setWorldId(worldId);
    return () => {
      setWorldId(undefined);
    };
  }, [setWorldId, worldId]);
}
