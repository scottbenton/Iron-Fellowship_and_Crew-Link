import { onSnapshot, Unsubscribe } from "firebase/firestore";
import { getCharacterNoteCollection } from "./_getRef";
import { Note } from "types/Notes.type";

export function listenToNotes(
  characterId: string,
  onNotes: (notes: Note[]) => void,
  onError: (error: any) => void
): Unsubscribe {
  return onSnapshot(
    getCharacterNoteCollection(characterId),
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
