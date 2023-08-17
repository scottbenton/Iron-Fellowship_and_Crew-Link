import { deleteDoc } from "firebase/firestore";
import {
  getCharacterNoteContentDocument,
  getCharacterNoteDocument,
} from "./_getRef";
import { createApiFunction } from "api-calls/createApiFunction";

export const removeCharacterNote = createApiFunction<
  {
    characterId: string;
    noteId: string;
  },
  void
>((params) => {
  const { characterId, noteId } = params;
  return new Promise((resolve, reject) => {
    const deleteNotePromise = deleteDoc(
      getCharacterNoteDocument(characterId, noteId)
    );

    const deleteContentPromise = deleteDoc(
      getCharacterNoteContentDocument(characterId, noteId)
    );

    Promise.all([deleteNotePromise, deleteContentPromise])
      .then(() => {
        resolve();
      })
      .catch((e) => {
        reject(e);
      });
  });
}, "Failed to delete note.");
