import { Bytes, setDoc } from "firebase/firestore";
import {
  constructPublicNotesNPCDocPath,
  getPublicNotesNPCDoc,
} from "./_getRef";
import { firebaseAuth, projectId } from "config/firebase.config";
import { createApiFunction } from "api-calls/createApiFunction";

interface Params {
  worldId: string;
  npcId: string;
  notes: Uint8Array;
  isBeacon?: boolean;
}

export const updateNPCNotes = createApiFunction<Params, void>((params) => {
  const { worldId, npcId, notes, isBeacon } = params;

  return new Promise((resolve, reject) => {
    if (isBeacon) {
      const contentPath = `projects/${projectId}/databases/(default)/documents${constructPublicNotesNPCDocPath(
        worldId,
        npcId
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
        getPublicNotesNPCDoc(worldId, npcId),
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
