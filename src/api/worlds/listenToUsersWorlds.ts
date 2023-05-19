import { useEffect } from "react";
import { EncodedWorld, World } from "types/World.type";
import { getErrorMessage } from "../../functions/getErrorMessage";
import { useAuth } from "../../providers/AuthProvider";
import { useSnackbar } from "../../hooks/useSnackbar";
import { useWorldsStore } from "stores/worlds.store";
import { decodeWorld, getWorldCollection } from "./_getRef";
import { useCharacterStore } from "stores/character.store";
import { useCampaignStore } from "stores/campaigns.store";
import {
  onSnapshot,
  query,
  Unsubscribe,
  where,
  Query,
} from "firebase/firestore";
import { listenToWorld } from "./listenToWorld";

export function listenToUsersWorlds(
  uid: string | undefined,
  dataHandler: {
    onDocChange: (id: string, data: World) => void;
    onDocRemove: (id: string) => void;
    onLoaded: () => void;
  },
  onError: (error: any) => void
) {
  if (!uid) {
    return;
  }

  return onSnapshot(
    query(getWorldCollection(), where("ownerId", "==", uid ?? "")),
    (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "removed") {
          dataHandler.onDocRemove(change.doc.id);
        } else {
          dataHandler.onDocChange(
            change.doc.id,
            decodeWorld(change.doc.data())
          );
        }
      });
      dataHandler.onLoaded();
    },
    (error) => onError(error)
  );
}

export function useListenToUsersWorlds() {
  const uid = useAuth().user?.uid;

  const campaignWorlds = useCampaignStore((store) => {
    const worldIds: string[] = [];

    Object.values(store.campaigns).map((campaign) => {
      if (campaign.worldId && campaign.gmId !== uid) {
        worldIds.push(campaign.worldId);
      }
    });
    return Array.from(new Set(worldIds));
  });

  const setWorld = useWorldsStore((state) => state.setWorld);
  const removeWorld = useWorldsStore((state) => state.removeWorld);
  const setLoading = useWorldsStore((state) => state.setLoading);

  const { error } = useSnackbar();

  useEffect(() => {
    let unsubscribe: Unsubscribe;
    let unsubscribes: Unsubscribe[];

    listenToUsersWorlds(
      uid,
      {
        onDocChange: (id, doc) => setWorld(id, doc),
        onDocRemove: (id) => removeWorld(id),
        onLoaded: () => setLoading(false),
      },
      (err) => {
        console.error(err);
        const errorMessage = getErrorMessage(error, "Failed to load worlds");
        error(errorMessage);
      }
    );

    unsubscribes = campaignWorlds.map((worldId) => {
      return listenToWorld(
        worldId,
        (world) => (world ? setWorld(worldId, world) : removeWorld(worldId)),
        (err) => {
          console.error(err);
          const errorMessage = getErrorMessage(error, "Failed to load worlds");
          error(errorMessage);
        }
      );
    });

    return () => {
      unsubscribe && unsubscribe();
      unsubscribes.forEach((unsubscribe) => unsubscribe());
    };
  }, [uid, campaignWorlds]);
}
