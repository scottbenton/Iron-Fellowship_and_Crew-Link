import { Bytes, setDoc } from "firebase/firestore";
import { ApiFunction, useApiState } from "hooks/useApiState";
import {
  constructPublicNotesLoreDocPath,
  getPublicNotesLoreDoc,
} from "./_getRef";
import { firebaseAuth } from "config/firebase.config";

interface Params {
  worldId: string;
  loreId: string;
  notes: Uint8Array;
  isBeacon?: boolean;
}

export const updateLoreNotes: ApiFunction<Params, boolean> = (params) => {
  const { worldId, loreId, notes, isBeacon } = params;

  return new Promise((resolve, reject) => {
    if (isBeacon) {
      const contentPath = `projects/${
        import.meta.env.VITE_FIREBASE_PROJECTID
      }/databases/(default)/documents${constructPublicNotesLoreDocPath(
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
                  bytesValue: Bytes.fromUint8Array(notes).toBase64(),
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
        getPublicNotesLoreDoc(worldId, loreId),
        { notes: Bytes.fromUint8Array(notes) },
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

export function useUpdateLoreNotes() {
  const { call, ...rest } = useApiState(updateLoreNotes);

  return {
    updateLoreNotes: call,
    ...rest,
  };
}
