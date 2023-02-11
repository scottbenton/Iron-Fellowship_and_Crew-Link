import { getDoc } from "firebase/firestore";
import { ApiFunction, useApiState } from "../../hooks/useApiState";
import { getCharacterDoc } from "../../lib/firebase.lib";
import { CharacterDocument } from "../../types/Character.type";

export const getCharacter: ApiFunction<
  {
    uid: string;
    characterId: string;
  },
  CharacterDocument
> = function (params) {
  return new Promise((resolve, reject) => {
    const { uid, characterId } = params;

    getDoc(getCharacterDoc(uid, characterId))
      .then((doc) => {
        const data = doc.data();

        if (data) {
          resolve(data);
        } else {
          reject("Character not found");
        }
      })
      .catch((e) => {
        console.error(e);
        reject("Failed to load character");
      });
  });
};

export function useGetCharacter() {
  const { call, loading, error, data } = useApiState(getCharacter);

  return {
    getCharacter: call,
    data,
    loading,
    error,
  };
}
