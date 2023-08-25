import { onSnapshot, Unsubscribe } from "firebase/firestore";
import {
  getCampaignNoteContentDocument,
  getCharacterNoteContentDocument,
} from "./_getRef";

export function listenToNoteContent(
  campaignId: string | undefined,
  characterId: string | undefined,
  noteId: string,
  onContent: (content?: Uint8Array) => void,
  onError: (error: any) => void
): Unsubscribe {
  if (!characterId && !campaignId) {
    onError("Either campaign or character ID is required.");
    return () => {};
  }
  return onSnapshot(
    characterId
      ? getCharacterNoteContentDocument(characterId, noteId)
      : getCampaignNoteContentDocument(campaignId as string, noteId),
    (snapshot) => {
      const data = snapshot.data();
      if (data?.notes) {
        onContent(data.notes.toUint8Array());
      } else {
        onContent(undefined);
      }
    },
    (error) => onError(error)
  );
}
