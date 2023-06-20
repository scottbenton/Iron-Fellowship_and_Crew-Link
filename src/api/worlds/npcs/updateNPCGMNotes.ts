import { setDoc } from "firebase/firestore";
import { ApiFunction, useApiState } from "hooks/useApiState";
import {
  constructPrivateDetailsNPCDocPath,
  getPrivateDetailsNPCDoc,
} from "./_getRef";
import { firebaseAuth } from "config/firebase.config";

interface Params {
  worldOwnerId: string;
  worldId: string;
  npcId: string;
  notes: string;
  isBeacon?: boolean;
}

export const updateNPCGMNotes: ApiFunction<Params, boolean> = (params) => {
  const { worldId, npcId, notes, isBeacon } = params;

  return new Promise((resolve, reject) => {
    if (isBeacon) {
      const contentPath = `projects/${
        import.meta.env.VITE_FIREBASE_PROJECTID
      }/databases/(default)/documents${constructPrivateDetailsNPCDocPath(
        worldId,
        npcId
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
        getPrivateDetailsNPCDoc(worldId, npcId),
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

export function useUpdateNPCGMNotes() {
  const { call, ...rest } = useApiState(updateNPCGMNotes);

  return {
    updateNPCGMNotes: call,
    ...rest,
  };
}
