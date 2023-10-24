import { Bytes, setDoc } from "firebase/firestore";
import {
  constructPublicNotesLoreDocPath,
  getPublicNotesLoreDoc,
} from "./_getRef";
import { firebaseAuth, projectId } from "config/firebase.config";
import { createApiFunction } from "api-calls/createApiFunction";

interface Params {
  worldId: string;
  loreId: string;
  notes: Uint8Array;
  isBeacon?: boolean;
}

export const updateLoreNotes = createApiFunction<Params, void>((params) => {
  const { worldId, loreId, notes, isBeacon } = params;

  return new Promise((resolve, reject) => {
    if (isBeacon) {
      const contentPath = `projects/${projectId}/databases/(default)/documents${constructPublicNotesLoreDocPath(
        worldId,
        loreId
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
        getPublicNotesLoreDoc(worldId, loreId),
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
