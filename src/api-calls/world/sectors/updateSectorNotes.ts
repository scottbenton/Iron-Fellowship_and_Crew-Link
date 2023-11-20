import { Bytes, setDoc } from "firebase/firestore";
import {
  constructPrivateSectorNotesDocPath,
  constructPublicSectorNotesDocPath,
  getPrivateSectorNotesDoc,
  getPublicSectorNotesDoc,
} from "./_getRef";
import { projectId } from "config/firebase.config";
import { createApiFunction } from "api-calls/createApiFunction";

interface Params {
  worldId: string;
  sectorId: string;
  notes: Uint8Array;
  isPrivate?: boolean;
  isBeacon?: boolean;
}

export const updateSectorNotes = createApiFunction<Params, void>((params) => {
  const { worldId, sectorId, notes, isBeacon, isPrivate } = params;

  const path = isPrivate
    ? constructPrivateSectorNotesDocPath(worldId, sectorId)
    : constructPublicSectorNotesDocPath(worldId, sectorId);

  return new Promise((resolve, reject) => {
    if (isBeacon) {
      const contentPath = `projects/${projectId}/databases/(default)/documents${path}`;

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
        isPrivate
          ? getPrivateSectorNotesDoc(worldId, sectorId)
          : getPublicSectorNotesDoc(worldId, sectorId),
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
