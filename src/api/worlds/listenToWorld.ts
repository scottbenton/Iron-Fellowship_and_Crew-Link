import { onSnapshot, query, Unsubscribe, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { World } from "types/World.type";
import { getErrorMessage } from "../../functions/getErrorMessage";
import { useAuth } from "../../providers/AuthProvider";
import { useSnackbar } from "../../hooks/useSnackbar";
import { useWorldsStore } from "stores/worlds.store";
import { decodeWorld, getWorldCollection, getWorldDoc } from "./_getRef";
import { useCharacterSheetStore } from "features/character-sheet/characterSheet.store";
import { string } from "yup";

export function listenToWorld(
  uid: string | undefined,
  worldId: string,
  onDocChange: (data?: World) => void,
  onError: (error: any) => void
) {
  if (!uid) {
    return;
  }

  return onSnapshot(
    getWorldDoc(uid, worldId),
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

export function useListenToWorld(worldOwnerId?: string, worldId?: string) {
  const [world, setWorld] = useState<World>();

  const uid = useAuth().user?.uid;
  const worlds = useWorldsStore((store) => store.worlds);

  const { error } = useSnackbar();

  useEffect(() => {
    let unsubscribe: Unsubscribe;

    setWorld(undefined);

    if (worldOwnerId && worldId) {
      if (worldOwnerId === uid) {
        setWorld(worlds[worldId]);
      } else {
        listenToWorld(worldOwnerId, worldId, setWorld, (err) => {
          console.error(err);
          const errorMessage = getErrorMessage(error, "Failed to load worlds");
          error(errorMessage);
        });
      }
    }

    return () => {
      unsubscribe && unsubscribe();
    };
  }, [uid, worldOwnerId, worldId]);

  return { world };
}

export function useCharacterSheetListenToWorld() {
  const { error } = useSnackbar();
  const uid = useAuth().user?.uid;

  const worldId = useCharacterSheetStore((store) =>
    store.campaignId ? store.campaign?.worldId : store.character?.worldId
  );
  const worldOwnerId = useCharacterSheetStore((store) =>
    store.campaignId ? store.campaign?.gmId : uid
  );

  const setWorld = useCharacterSheetStore((store) => store.setWorld);
  const usersWorld = useWorldsStore((store) =>
    worldId ? store.worlds[worldId] : undefined
  );

  useEffect(() => {
    let unsubscribe: Unsubscribe | undefined;

    if (worldOwnerId === uid && worldId) {
      setWorld(worldOwnerId, worldId, usersWorld);
    } else if (worldOwnerId !== uid && worldId) {
      unsubscribe = listenToWorld(
        worldOwnerId,
        worldId,
        (world) => setWorld(worldOwnerId, worldId, world),
        (err) => {
          console.error(err);
          const errorMessage = "Failed to load worlds";
          error(errorMessage);
        }
      );
    } else {
      setWorld(worldOwnerId, worldId, undefined);
    }
    return () => {
      unsubscribe && unsubscribe();
    };
  }, [worldId, worldOwnerId, usersWorld]);
}
