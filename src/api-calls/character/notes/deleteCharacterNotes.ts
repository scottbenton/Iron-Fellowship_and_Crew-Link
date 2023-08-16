import { getDocs } from "firebase/firestore";
import { removeCharacterNote } from "./removeCharacterNote";
import { getCharacterNoteCollection } from "./_getRef";
import { createApiFunction } from "api-calls/createApiFunction";

function getAllCharacterNotes(characterId: string): Promise<string[]> {
  return new Promise<string[]>((resolve, reject) => {
    getDocs(getCharacterNoteCollection(characterId))
      .then((snapshot) => {
        const ids = snapshot.docs.map((doc) => doc.id);
        resolve(ids);
      })
      .catch((e) => {
        reject("Failed to get character notes");
      });
  });
}

export const deleteCharacterNotes = createApiFunction<string, void>(
  (characterId) => {
    return new Promise<void>((resolve, reject) => {
      getAllCharacterNotes(characterId)
        .then((noteIds) => {
          const promises = noteIds.map((noteId) =>
            removeCharacterNote({ characterId, noteId })
          );
          Promise.all(promises)
            .then(() => {
              resolve();
            })
            .catch((e) => {
              reject(e);
            });
        })
        .catch((e) => {
          reject(e);
        });
    });
  },
  "Failed to delete character notes."
);
