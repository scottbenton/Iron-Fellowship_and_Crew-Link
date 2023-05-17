import { setDoc } from "firebase/firestore";
import { ApiFunction, useApiState } from "hooks/useApiState";
import { GMLocationDocument } from "types/Locations.type";
import { getPrivateDetailsLocationDoc } from "./_getRef";

interface Params {
  worldId: string;
  locationId: string;
  locationGMProperties: Partial<GMLocationDocument>;
}

export const updateLocationGMProperties: ApiFunction<Params, boolean> = (
  params
) => {
  const { worldId, locationId, locationGMProperties } = params;

  return new Promise((resolve, reject) => {
    setDoc(
      getPrivateDetailsLocationDoc(worldId, locationId),
      locationGMProperties,
      { merge: true }
    )
      .then(() => {
        resolve(true);
      })
      .catch((e) => {
        console.error(e);
        reject("Failed to update location.");
      });
  });
};

export function useUpdateLocationGMProperties() {
  const { call, ...rest } = useApiState(updateLocationGMProperties);

  return {
    updateLocationGMProperties: call,
    ...rest,
  };
}
