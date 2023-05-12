import { Bytes, setDoc } from "firebase/firestore";
import { ApiFunction, useApiState } from "hooks/useApiState";
import { constructNPCDocPath, getPublicNotesNPCDoc } from "./_getRef";
import { firebaseAuth } from "config/firebase.config";

interface Params {
  worldOwnerId: string;
  worldId: string;
  npcId: string;
  notes: Uint8Array;
  isBeacon?: boolean;
}

export const updateNPCNotes: ApiFunction<Params, boolean> = (params) => {
  const { worldOwnerId, worldId, npcId, notes, isBeacon } = params;

  return new Promise((resolve, reject) => {
    if (isBeacon) {
      const contentPath = `projects/${
        import.meta.env.VITE_FIREBASE_PROJECTID
      }/databases/(default)/documents${constructNPCDocPath(
        worldOwnerId,
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
        getPublicNotesNPCDoc(worldOwnerId, worldId, npcId),
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

export function useUpdateNPCNotes() {
  const { call, ...rest } = useApiState(updateNPCNotes);

  return {
    updateNPCNotes: call,
    ...rest,
  };
}
