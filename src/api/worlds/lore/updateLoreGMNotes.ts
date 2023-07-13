import { setDoc } from "firebase/firestore";
import { ApiFunction, useApiState } from "hooks/useApiState";
import {
  constructPrivateDetailsLoreDocPath,
  getPrivateDetailsLoreDoc,
} from "./_getRef";
import { firebaseAuth } from "config/firebase.config";

interface Params {
  worldId: string;
  loreId: string;
  notes: string;
  isBeacon?: boolean;
}

export const updateLoreGMNotes: ApiFunction<Params, boolean> = (params) => {
  const { worldId, loreId, notes, isBeacon } = params;

  return new Promise((resolve, reject) => {
    if (isBeacon) {
      const contentPath = `projects/${
        import.meta.env.VITE_FIREBASE_PROJECTID
      }/databases/(default)/documents${constructPrivateDetailsLoreDocPath(
        worldId,
        loreId
      )}`;

      const token = (firebaseAuth.currentUser?.toJSON() as any).stsTokenManager
        .accessToken;
      if (notes) {
        fetch(
          `https://firestore.googleapis.com/v1/${contentPath}?updateMask.fieldPaths=notes`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              name: contentPath,
              fields: {
                notes: {
                  stringValue: notes,
                },
              },
            }),
            keepalive: true,
          }
        ).catch((e) => console.error(e));
      }

      resolve(true);
    } else {
      setDoc(
        getPrivateDetailsLoreDoc(worldId, loreId),
        { notes: notes },
        { merge: true }
      )
        .then(() => {
          resolve(true);
        })
        .catch((e) => {
          console.error(e);
          reject("Failed to save note updates.");
        });
    }
  });
};

export function useUpdateLoreGMNotes() {
  const { call, ...rest } = useApiState(updateLoreGMNotes);

  return {
    updateLoreGMNotes: call,
    ...rest,
  };
}
