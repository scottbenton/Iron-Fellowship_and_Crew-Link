import { Unsubscribe } from "firebase/auth";
import { onSnapshot } from "firebase/firestore";
import {
  getPublicSectorLocationNotesDoc,
  getPrivateSectorLocationNotesDoc,
} from "./_getRef";
import { getErrorMessage } from "functions/getErrorMessage";

export function listenToSectorLocationNotes(
  worldId: string,
  sectorId: string,
  locationId: string,
  updateNotes: (notes: Uint8Array | undefined) => void,
  onError: (error: string) => void,
  isPrivate?: boolean
): Unsubscribe {
  return onSnapshot(
    isPrivate
      ? getPrivateSectorLocationNotesDoc(worldId, sectorId, locationId)
      : getPublicSectorLocationNotesDoc(worldId, sectorId, locationId),
    (snapshot) => {
      const notes = snapshot.data()?.notes?.toUint8Array();
      updateNotes(notes);
    },
    (error) => {
      onError(getErrorMessage(error, "Failed to get location notes"));
    }
  );
}
