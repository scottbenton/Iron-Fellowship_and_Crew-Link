import { Unsubscribe } from "firebase/auth";
import { onSnapshot } from "firebase/firestore";
import { GMLocationDocument } from "types/Locations.type";
import { getPrivateDetailsLocationDoc } from "./_getRef";
import { getErrorMessage } from "functions/getErrorMessage";

export function listenToLocationGMProperties(
  worldId: string,
  locationId: string,
  updateGMProperties: (properties: GMLocationDocument | undefined) => void,
  onError: (error: string) => void
): Unsubscribe {
  return onSnapshot(
    getPrivateDetailsLocationDoc(worldId, locationId),
    (snapshot) => {
      const gmProps = snapshot.data();
      updateGMProperties(gmProps);
    },
    (error) => {
      onError(getErrorMessage(error, "Failed to get location gm notes"));
    }
  );
}
