import { Bytes, updateDoc } from "firebase/firestore";
import { constructWorldDocPath, getWorldDoc } from "./_getRef";
import { projectId } from "config/firebase.config";
import { createApiFunction } from "api-calls/createApiFunction";

export const updateWorldDescription = createApiFunction<
  {
    worldId: string;
    description: Uint8Array;
    isBeaconRequest?: boolean;
  },
  void
>((params) => {
  const { worldId, description, isBeaconRequest } = params;

  return new Promise((resolve, reject) => {
    // If we are making this call when closing the page, we want to use a fetch call with keepalive
    if (isBeaconRequest) {
      const worldDocPath = `projects/${projectId}/databases/(default)/documents${constructWorldDocPath(
        worldId
      )}`;

      const token = window.sessionStorage.getItem("id-token") ?? "";
      if (description) {
        fetch(
          `https://firestore.googleapis.com/v1/${worldDocPath}?updateMask.fieldPaths=worldDescription`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              name: worldDocPath,
              fields: {
                worldDescription: {
                  bytesValue: Bytes.fromUint8Array(description).toBase64(),
                },
              },
            }),
            keepalive: true,
          }
        ).catch((e) => reject(e));
      }

      resolve();
    } else {
      updateDoc(getWorldDoc(worldId), {
        worldDescription: Bytes.fromUint8Array(description),
      })
        .then(() => {
          resolve();
        })
        .catch((e) => {
          reject(e);
        });
    }
  });
}, "Failed to update world description.");
