import { Bytes, setDoc } from "firebase/firestore";
import {
  constructPublicNotesLocationDocPath,
  getPublicNotesLocationDoc,
} from "./_getRef";
import { firebaseAuth, projectId } from "config/firebase.config";
import { createApiFunction } from "api-calls/createApiFunction";

interface Params {
  worldId: string;
  locationId: string;
  notes: Uint8Array;
  isBeacon?: boolean;
}

export const updateLocationNotes = createApiFunction<Params, void>((params) => {
  const { worldId, locationId, notes, isBeacon } = params;

  return new Promise((resolve, reject) => {
    if (isBeacon) {
      const contentPath = `projects/${projectId}/databases/(default)/documents${constructPublicNotesLocationDocPath(
        worldId,
        locationId
      )}`;

      const token = window.sessionStorage.getItem("id-token") ?? "";
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

      resolve();
    } else {
      setDoc(
        getPublicNotesLocationDoc(worldId, locationId),
        { notes: Bytes.fromUint8Array(notes) },
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
}, "Failed to save changes to notes.");
