import { setDoc } from "firebase/firestore";
import {
  constructPrivateDetailsLocationDocPath,
  getPrivateDetailsLocationDoc,
} from "./_getRef";
import { firebaseAuth } from "config/firebase.config";
import { createApiFunction } from "api-calls/createApiFunction";

interface Params {
  worldId: string;
  locationId: string;
  notes: string;
  isBeacon?: boolean;
}

export const updateLocationGMNotes = createApiFunction<Params, void>(
  (params) => {
    const { worldId, locationId, notes, isBeacon } = params;

    return new Promise((resolve, reject) => {
      if (isBeacon) {
        const contentPath = `projects/${
          import.meta.env.VITE_FIREBASE_PROJECTID
        }/databases/(default)/documents${constructPrivateDetailsLocationDocPath(
          worldId,
          locationId
        )}`;

        const token = (firebaseAuth.currentUser?.toJSON() as any)
          .stsTokenManager.accessToken;
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
          getPrivateDetailsLocationDoc(worldId, locationId),
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
  },
  "Failed to update notes."
);
