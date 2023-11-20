import { Bytes, setDoc } from "firebase/firestore";
import {
  constructPrivateDetailsLoreDocPath,
  getPrivateDetailsLoreDoc,
} from "./_getRef";
import { projectId } from "config/firebase.config";
import { createApiFunction } from "api-calls/createApiFunction";

interface Params {
  worldId: string;
  loreId: string;
  notes: Uint8Array;
  isBeacon?: boolean;
}

export const updateLoreGMNotes = createApiFunction<Params, void>((params) => {
  const { worldId, loreId, notes, isBeacon } = params;

  return new Promise((resolve, reject) => {
    if (isBeacon) {
      const contentPath = `projects/${projectId}/databases/(default)/documents${constructPrivateDetailsLoreDocPath(
        worldId,
        loreId
      )}`;

      const token = window.sessionStorage.getItem("id-token") ?? "";
      if (notes) {
        fetch(
          `https://firestore.googleapis.com/v1/${contentPath}?updateMask.fieldPaths=gmNotes`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              name: contentPath,
              fields: {
                gmNotes: {
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
        getPrivateDetailsLoreDoc(worldId, loreId),
        { gmNotes: Bytes.fromUint8Array(notes) },
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
