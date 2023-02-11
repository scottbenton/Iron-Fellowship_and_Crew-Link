import { CharacterNotFoundException } from "api/error/CharacterNotFoundException";
import { UserNotLoggedInException } from "api/error/UserNotLoggedInException";
import { TRACK_KEYS } from "features/character-sheet/characterSheet.store";
import { updateDoc } from "firebase/firestore";
import { ApiFunction, useApiState } from "../../hooks/useApiState";
import { getCharacterDoc } from "../../lib/firebase.lib";

export const updateCharacterTrack: ApiFunction<
  { uid?: string; characterId?: string; trackKey: TRACK_KEYS; value: number },
  boolean
> = function (params) {
  return new Promise((resolve, reject) => {
    const { uid, characterId, trackKey, value } = params;

    if (!uid) {
      reject(new UserNotLoggedInException());
      return;
    }
    if (!characterId) {
      reject(new CharacterNotFoundException());
      return;
    }

    updateDoc(getCharacterDoc(uid, characterId), {
      [trackKey]: value,
    })
      .then(() => {
        resolve(true);
      })
      .catch((error) => {
        console.error(error);
        reject("Failed to update character.");
      });
  });
};

export function useUpdateCharacterTrack() {
  const { loading, error, call } = useApiState(updateCharacterTrack);

  return {
    updateCharacterTrack: call,
    loading,
    error,
  };
}
