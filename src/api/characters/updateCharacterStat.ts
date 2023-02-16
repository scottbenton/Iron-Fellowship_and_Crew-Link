import { CharacterNotFoundException } from "api/error/CharacterNotFoundException";
import { UserNotLoggedInException } from "api/error/UserNotLoggedInException";
import { firebaseAuth } from "config/firebase.config";
import { updateDoc } from "firebase/firestore";
import { ApiFunction, useApiState } from "hooks/useApiState";
import { getCharacterDoc } from "./_getRef";
import { STATS } from "types/stats.enum";

export const updateCharacterStat: ApiFunction<
  { characterId?: string; stat: STATS; value: number },
  boolean
> = function (params) {
  const { characterId, stat, value } = params;
  return new Promise((resolve, reject) => {
    const uid = firebaseAuth.currentUser?.uid;

    const statKey = `stats.${stat}`;

    if (!uid) {
      reject(new UserNotLoggedInException());
      return;
    }
    if (!characterId) {
      reject(new CharacterNotFoundException());
      return;
    }

    updateDoc(getCharacterDoc(uid, characterId), {
      [statKey]: value,
    })
      .then(() => {
        resolve(true);
      })
      .catch((e) => {
        console.error(e);
        reject("Failed to update " + stat);
      });
  });
};

export function useUpdateCharacterStat() {
  const { call, error, loading } = useApiState(updateCharacterStat);

  return {
    updateCharacterStat: call,
    error,
    loading,
  };
}
