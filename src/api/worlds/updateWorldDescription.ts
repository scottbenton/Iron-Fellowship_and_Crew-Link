import { updateDoc } from "firebase/firestore";
import { ApiFunction, useApiState } from "hooks/useApiState";
import { constructWorldDocPath, getWorldDoc } from "./_getRef";
import { firebaseAuth } from "config/firebase.config";

export const updateWorldDescription: ApiFunction<
  {
    worldId: string;
    description: string;
    isBeaconRequest?: boolean;
  },
  boolean
> = function (params) {
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
        ).catch((e) => console.error(e));
      }

      resolve(true);
    } else {
      updateDoc(getWorldDoc(worldId), {
        description,
      })
        .then(() => {
          resolve(true);
        })
        .catch((e) => {
          console.error(e);
          reject("Failed to update world description");
        });
    }
  });
};

export function useUpdateWorldDescription() {
  const { call, loading, error } = useApiState(updateWorldDescription);
  return {
    updateWorldDescription: (
      worldId: string,
      description: string,
      isBeaconRequest?: boolean
    ) => {
      return call({ worldId, description, isBeaconRequest });
    },
    loading,
    error,
  };
}
