import { Unsubscribe } from "firebase/auth";
import { onSnapshot, query, where } from "firebase/firestore";
import { LocationDocument } from "types/Locations.type";
import {
  constructLocationImagePath,
  convertFromDatabase,
  getLocationCollection,
} from "./_getRef";
import { getImageUrl } from "lib/storage.lib";

export function listenToLocations(
  worldId: string,
  isWorldOwner: boolean,
  updateLocation: (locationId: string, location: LocationDocument) => void,
  updateLocationImage: (locationId: string, imageUrl: string) => void,
  removeLocation: (locationId: string) => void,
  onError: (error: string) => void
): Unsubscribe {
  const locationCollectionRef = getLocationCollection(worldId);

  return onSnapshot(
    isWorldOwner
      ? locationCollectionRef
      : query(locationCollectionRef, where("sharedWithPlayers", "==", true)),
    (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "removed") {
          removeLocation(change.doc.id);
        } else {
          const convertedDoc = convertFromDatabase(change.doc.data());
          updateLocation(change.doc.id, convertedDoc);
          if (
            Array.isArray(convertedDoc.imageFilenames) &&
            convertedDoc.imageFilenames.length > 0
          ) {
            getImageUrl(
              constructLocationImagePath(
                worldId,
                change.doc.id,
                convertedDoc.imageFilenames[0]
              )
            ).then((url) => {
              updateLocationImage(change.doc.id, url);
            });
          }
        }
      });
    },
    (error) => {
      console.error(error);
      onError("Failed to get locations");
    }
  );
}
