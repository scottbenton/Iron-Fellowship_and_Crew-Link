import { useEffect, useMemo, useState } from "react";
import { World } from "types/World.type";
import { getErrorMessage } from "../../functions/getErrorMessage";
import { useAuth } from "../../providers/AuthProvider";
import { useSnackbar } from "../../hooks/useSnackbar";
import { useWorldsStore } from "stores/worlds.store";
import { decodeWorld, getWorldCollection } from "./_getRef";
import { useCampaignStore } from "stores/campaigns.store";
import { onSnapshot, query, Unsubscribe, where } from "firebase/firestore";
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

  const [worldsUserOwns, setWorldsUserOwns] = useState<string[]>([]);

  const campaignWorlds = useCampaignStore((store) => {
    const worldIds: Set<string> = new Set();

    Object.values(store.campaigns).forEach((campaign) => {
      if (campaign.worldId && !worldsUserOwns.includes(campaign.worldId)) {
        worldIds.add(campaign.worldId);
      }
    });
    return Array.from(worldIds);
  });

  const serializedCampaignWorlds = JSON.stringify(campaignWorlds);

  const memoizedCampaignWorlds = useMemo(
    () => JSON.parse(serializedCampaignWorlds) as string[],
    [serializedCampaignWorlds]
  );

  const setWorld = useWorldsStore((state) => state.setWorld);
  const removeWorld = useWorldsStore((state) => state.removeWorld);
  const setLoading = useWorldsStore((state) => state.setLoading);

  const { error } = useSnackbar();

  useEffect(() => {
    let unsubscribe: Unsubscribe;
    let unsubscribes: Unsubscribe[];

    console.debug("CREATING LISTENER FOR USERS WORLDS");

    listenToUsersWorlds(
      uid,
      {
        onDocChange: (id, doc) => {
          setWorld(id, doc);
          setWorldsUserOwns((prevWorlds) => {
            const worldsSet = new Set(prevWorlds);
            worldsSet.add(id);
            return Array.from(worldsSet);
          });
        },
        onDocRemove: (id) => {
          removeWorld(id);
          setWorldsUserOwns((prevWorlds) => {
            const worldsSet = new Set(prevWorlds);
            worldsSet.delete(id);
            return Array.from(worldsSet);
          });
        },
        onLoaded: () => setLoading(false),
      },
      (err) => {
        console.error(err);
        const errorMessage = getErrorMessage(error, "Failed to load worlds");
        error(errorMessage);
      }
    );

    unsubscribes = memoizedCampaignWorlds.map((worldId) => {
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
  }, [uid, memoizedCampaignWorlds]);
}
