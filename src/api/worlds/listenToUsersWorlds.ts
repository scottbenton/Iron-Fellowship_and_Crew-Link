import { onSnapshot, query, Unsubscribe, where } from "firebase/firestore";
import { useEffect } from "react";
import { World } from "types/World.type";
import { getErrorMessage } from "../../functions/getErrorMessage";
import { useAuth } from "../../providers/AuthProvider";
import { useSnackbar } from "../../hooks/useSnackbar";
import { useWorldsStore } from "stores/worlds.store";
import { decodeWorld, getWorldCollection } from "./_getRef";

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
  const worldQuery = query(
    getWorldCollection(uid),
    where("authorId", "==", uid)
  );
  return onSnapshot(
    worldQuery,
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
  const setWorld = useWorldsStore((state) => state.setWorld);
  const removeWorld = useWorldsStore((state) => state.removeWorld);
  const setLoading = useWorldsStore((state) => state.setLoading);

  const { error } = useSnackbar();

  const uid = useAuth().user?.uid;

  useEffect(() => {
    let unsubscribe: Unsubscribe;

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

    return () => {
      unsubscribe && unsubscribe();
    };
  }, [uid]);
}
