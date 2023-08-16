import { onSnapshot, Unsubscribe } from "firebase/firestore";
import { getCharacterNoteContentDocument } from "./_getRef";

export function listenToNoteContent(
  characterId: string,
  noteId: string,
  onContent: (content?: string) => void,
  onError: (error: any) => void
): Unsubscribe {
  return onSnapshot(
    getCharacterNoteContentDocument(characterId, noteId),
    (snapshot) => {
      onContent(snapshot.data()?.content ?? "");
    },
    (error) => onError(error)
  );
}
