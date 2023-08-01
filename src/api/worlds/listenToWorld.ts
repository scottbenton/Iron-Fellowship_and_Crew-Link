import { onSnapshot, query, Unsubscribe, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { World } from "types/World.type";
import { getErrorMessage } from "../../functions/getErrorMessage";
import { useAuth } from "../../providers/AuthProvider";
import { useSnackbar } from "../../hooks/useSnackbar";
import { useWorldsStore } from "stores/worlds.store";
import { decodeWorld, getWorldDoc } from "./_getRef";
import { useCharacterSheetStore } from "pages/Character/CharacterSheetPage/characterSheet.store";

export function listenToWorld(
  worldId: string,
  onDocChange: (data?: World) => void,
  onError: (error: any) => void
) {
  return onSnapshot(
    getWorldDoc(worldId),
    (snapshot) => {
      const encodedWorld = snapshot.data();
      if (encodedWorld) {
        onDocChange(decodeWorld(encodedWorld));
      } else {
        onDocChange(undefined);
      }
    },
    (error) => onError(error)
  );
}

export function useListenToWorld(worldId?: string) {
  const [world, setWorld] = useState<World>();

  const worlds = useWorldsStore((store) => store.worlds);

  useEffect(() => {
    let unsubscribe: Unsubscribe;

    if (worldId) {
      setWorld(worlds[worldId]);
    } else {
      setWorld(undefined);
    }
    return () => {
      unsubscribe && unsubscribe();
    };
  }, [worldId, worlds]);

  return { world };
}

export function useCharacterSheetListenToWorld() {
  const worldId = useCharacterSheetStore((store) =>
    store.campaignId ? store.campaign?.worldId : store.character?.worldId
  );

  const setWorld = useCharacterSheetStore((store) => store.setWorld);
  const usersWorld = useWorldsStore((store) =>
    worldId ? store.worlds[worldId] : undefined
  );

  useEffect(() => {
    let unsubscribe: Unsubscribe | undefined;

    if (worldId && usersWorld) {
      setWorld(usersWorld.ownerId, worldId, usersWorld);
    } else {
      setWorld(undefined, undefined, undefined);
    }
    return () => {
      unsubscribe && unsubscribe();
    };
  }, [worldId, usersWorld]);
}
