import { setDoc } from "firebase/firestore";
import {
  constructPrivateDetailsLoreDocPath,
  getPrivateDetailsLoreDoc,
} from "./_getRef";
import { firebaseAuth } from "config/firebase.config";
import { createApiFunction } from "api-calls/createApiFunction";

interface Params {
  worldId: string;
  loreId: string;
  notes: string;
  isBeacon?: boolean;
}

export const updateLoreGMNotes = createApiFunction<Params, void>((params) => {
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

      resolve();
    } else {
      setDoc(
        getPrivateDetailsLoreDoc(worldId, loreId),
        { notes: notes },
        { merge: true }
      )
        .then(() => {
          resolve();
        })
        .catch((e) => {
          reject(e);
        });
    }
  });
}, "Failed to update notes.");