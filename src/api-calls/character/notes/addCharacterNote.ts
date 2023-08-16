import { addDoc } from "firebase/firestore";
import { getCharacterNoteCollection } from "./_getRef";
import { createApiFunction } from "api-calls/createApiFunction";

export const addCharacterNote = createApiFunction<
  {
    characterId: string;
    order: number;
  },
  string
>((params) => {
  const { characterId, order } = params;

  return new Promise((resolve, reject) => {
    addDoc(getCharacterNoteCollection(characterId), {
      order,
      title: "New Page",
    })
      .then((doc) => {
        resolve(doc.id);
      })
      .catch((e) => {
        reject(e);
      });
  });
}, "Failed to add note.");
