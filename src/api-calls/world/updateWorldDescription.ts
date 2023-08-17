import { updateDoc } from "firebase/firestore";
import { constructWorldDocPath, getWorldDoc } from "./_getRef";
import { firebaseAuth } from "config/firebase.config";
import { createApiFunction } from "api-calls/createApiFunction";

export const updateWorldDescription = createApiFunction<
  {
    worldId: string;
    description: string;
    isBeaconRequest?: boolean;
  },
  void
>((params) => {
  const { worldId, description, isBeaconRequest } = params;

  return new Promise((resolve, reject) => {
    // If we are making this call when closing the page, we want to use a fetch call with keepalive
    if (isBeaconRequest) {
      const worldDocPath = `projects/${
        import.meta.env.VITE_FIREBASE_PROJECTID
      }/databases/(default)/documents${constructWorldDocPath(worldId)}`;

      const token = (firebaseAuth.currentUser?.toJSON() as any).stsTokenManager
        .accessToken;
      if (description) {
        fetch(
          `https://firestore.googleapis.com/v1/${worldDocPath}?updateMask.fieldPaths=description`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              name: worldDocPath,
              fields: {
                description: {
                  stringValue: description,
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
        description,
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
