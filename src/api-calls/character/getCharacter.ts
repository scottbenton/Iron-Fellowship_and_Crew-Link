import { getDoc } from "firebase/firestore";
import { CharacterDocument } from "api-calls/character/_character.type";
import { getCharacterDoc } from "./_getRef";
import { createApiFunction } from "api-calls/createApiFunction";

export const getCharacter = createApiFunction<string, CharacterDocument>(
  (characterId) => {
    return new Promise((resolve, reject) => {
      getDoc(getCharacterDoc(characterId))
        .then((snapshot) => {
          const character = snapshot.data();

          if (character) {
            resolve(character);
          } else {
            reject("Could not find character");
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  "Failed to load character."
);
