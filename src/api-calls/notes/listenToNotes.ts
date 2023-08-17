import { onSnapshot, Unsubscribe } from "firebase/firestore";
import {
  getCampaignNoteCollection,
  getCharacterNoteCollection,
} from "./_getRef";
import { Note } from "types/Notes.type";

export function listenToNotes(
  campaignId: string | undefined,
  characterId: string | undefined,
  onNotes: (notes: Note[]) => void,
  onError: (error: any) => void
): Unsubscribe {
  if (!campaignId && !characterId) {
    onError("Either character or campaign ID must be defined.");
    return () => {};
  }
  return onSnapshot(
    characterId
      ? getCharacterNoteCollection(characterId)
      : getCampaignNoteCollection(campaignId as string),
    (snapshot) => {
      const notes: Note[] = snapshot.docs
        .map((doc) => {
          const noteDoc = doc.data();

          return {
            noteId: doc.id,
            ...noteDoc,
          };
        })
        .sort((n1, n2) => n1.order - n2.order);

      onNotes(notes);
    },
    (error) => onError(error)
  );
}
