import { updateDoc } from "firebase/firestore";
import { getCharacterNoteDocument } from "./_getRef";
import { createApiFunction } from "api-calls/createApiFunction";

export const updateCharacterNoteOrder = createApiFunction<
  {
    characterId: string;
    noteId: string;
    order: number;
  },
  void
>((params) => {
  const { characterId, noteId, order } = params;
  return new Promise((resolve, reject) => {
    updateDoc(getCharacterNoteDocument(characterId, noteId), {
      order,
    })
      .then(() => {
        resolve();
      })
      .catch((e) => {
        reject(e);
      });
  });
}, "Failed to move note.");
