import { Unsubscribe } from "firebase/auth";
import { onSnapshot } from "firebase/firestore";
import { getSectorLocationsCollection } from "./_getRef";
import { StarforgedLocation } from "types/LocationStarforged.type";

export function listenToSectorLocations(
  worldId: string,
  sectorId: string,
  updateSectorLocation: (
    locationId: string,
    location: StarforgedLocation
  ) => void,
  removeSectorLocation: (locationId: string) => void,
  onError: (error: string) => void
): Unsubscribe {
  return onSnapshot(
    getSectorLocationsCollection(worldId, sectorId),
    (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "removed") {
          removeSectorLocation(change.doc.id);
        } else {
          updateSectorLocation(change.doc.id, change.doc.data());
        }
      });
    },
    (error) => {
      console.error(error);
      onError("Failed to get locations");
    }
  );
}
