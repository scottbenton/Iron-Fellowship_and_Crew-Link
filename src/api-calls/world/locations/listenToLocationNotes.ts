import { Unsubscribe } from "firebase/auth";
import { onSnapshot, query, where } from "firebase/firestore";
import { LocationDocument } from "types/Locations.type";
import {
  convertFromDatabase,
  getLocationCollection,
  getPublicNotesLocationDoc,
} from "./_getRef";
import { getErrorMessage } from "functions/getErrorMessage";

export function listenToLocationNotes(
  worldId: string,
  locationId: string,
  updateLocationNotes: (notes: Uint8Array | undefined) => void,
  onError: (error: string) => void
): Unsubscribe {
  return onSnapshot(
    getPublicNotesLocationDoc(worldId, locationId),
    (snapshot) => {
      const notes = snapshot.data()?.notes?.toUint8Array();
      updateLocationNotes(notes);
    },
    (error) => {
      onError(getErrorMessage(error, "Failed to get location notes"));
    }
  );
}
