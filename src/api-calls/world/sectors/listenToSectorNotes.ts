import { Unsubscribe } from "firebase/auth";
import { onSnapshot } from "firebase/firestore";
import { getPublicSectorNotesDoc, getPrivateSectorNotesDoc } from "./_getRef";
import { getErrorMessage } from "functions/getErrorMessage";

export function listenToSectorNotes(
  worldId: string,
  sectorId: string,
  updateNotes: (notes: Uint8Array | undefined) => void,
  onError: (error: string) => void,
  isPrivate?: boolean
): Unsubscribe {
  return onSnapshot(
    isPrivate
      ? getPrivateSectorNotesDoc(worldId, sectorId)
      : getPublicSectorNotesDoc(worldId, sectorId),
    (snapshot) => {
      const notes = snapshot.data()?.notes?.toUint8Array();
      updateNotes(notes);
    },
    (error) => {
      onError(getErrorMessage(error, "Failed to get sector notes"));
    }
  );
}
