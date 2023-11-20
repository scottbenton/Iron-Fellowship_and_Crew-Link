import { Unsubscribe } from "firebase/auth";
import { onSnapshot } from "firebase/firestore";
import { getPublicNotesNPCDoc } from "./_getRef";
import { getErrorMessage } from "functions/getErrorMessage";

export function listenToNPCNotes(
  worldId: string,
  npcId: string,
  updateNPCNotes: (notes: Uint8Array | undefined) => void,
  onError: (error: string) => void
): Unsubscribe {
  return onSnapshot(
    getPublicNotesNPCDoc(worldId, npcId),
    (snapshot) => {
      const notes = snapshot.data()?.notes?.toUint8Array();
      updateNPCNotes(notes);
    },
    (error) => {
      onError(getErrorMessage(error, "Failed to get npc notes"));
    }
  );
}
