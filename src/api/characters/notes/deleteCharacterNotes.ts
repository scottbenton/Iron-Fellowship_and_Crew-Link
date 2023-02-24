import { getDocs } from "firebase/firestore";
import { removeCharacterNote } from "./removeCharacterNote";
import { getCharacterNoteCollection } from "./_getRef";

function getAllCharacterNotes(
  uid: string,
  characterId: string
): Promise<string[]> {
  return new Promise<string[]>((resolve, reject) => {
    getDocs(getCharacterNoteCollection(uid, characterId))
      .then((snapshot) => {
        const ids = snapshot.docs.map((doc) => doc.id);
        resolve(ids);
      })
      .catch((e) => {
        reject("Failed to get character notes");
      });
  });
}

export function deleteCharacterNotes(uid: string, characterId: string) {
  return new Promise<boolean>((resolve, reject) => {
    getAllCharacterNotes(uid, characterId)
      .then((noteIds) => {
        const promises = noteIds.map((noteId) =>
          removeCharacterNote({ uid, characterId, noteId })
        );
        Promise.all(promises)
          .then(() => {
            resolve(true);
          })
          .catch((e) => {
            console.error(e);
            reject("Failed to delete some or all notes.");
          });
      })
      .catch(() => {
        reject("Failed to get character notes");
      });
  });
}
