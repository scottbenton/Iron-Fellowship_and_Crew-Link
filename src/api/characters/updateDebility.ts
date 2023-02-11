import { CharacterNotFoundException } from "api/error/CharacterNotFoundException";
import { UserNotLoggedInException } from "api/error/UserNotLoggedInException";
import { useCharacterSheetStore } from "features/character-sheet/characterSheet.store";
import { updateDoc } from "firebase/firestore";
import { ApiFunction, useApiState } from "hooks/useApiState";
import { useAuth } from "hooks/useAuth";
import { getCharacterDoc } from "lib/firebase.lib";
import { DEBILITIES } from "types/debilities.enum";

export const updateDebility: ApiFunction<
  {
    uid?: string;
    characterId?: string;
    debility: DEBILITIES;
    active: boolean;
    newMomentum?: number;
  },
  boolean
> = function (params) {
  const { uid, characterId, debility, active, newMomentum } = params;

  return new Promise((resolve, reject) => {
    if (!uid) {
      reject(new UserNotLoggedInException());
      return;
    }
    if (!characterId) {
      reject(new CharacterNotFoundException());
      return;
    }

    updateDoc(getCharacterDoc(uid, characterId), {
      [`debilities.${debility}`]: active,
      momentum: newMomentum,
    })
      .then(() => {
        resolve(true);
      })
      .catch((e) => {
        console.error(e);
        reject("Failed to update debilities");
      });
  });
};

export function useUpdateDebility() {
  const { call, loading, error } = useApiState(updateDebility);

  return {
    updateDebility: call,
    loading,
    error,
  };
}

export function useCharacterSheetUpdateDebility() {
  const uid = useAuth().user?.uid;
  const characterId = useCharacterSheetStore((store) => store.characterId);
  const momentum = useCharacterSheetStore((store) => store.character?.momentum);
  const maxMomentum = useCharacterSheetStore((store) => store.maxMomentum);

  const { updateDebility, loading, error } = useUpdateDebility();

  return {
    updateDebility: (params: { debility: DEBILITIES; active: boolean }) => {
      let newMomentum = momentum;
      if (
        params.active === true &&
        typeof momentum === "number" &&
        maxMomentum &&
        maxMomentum - 1 < momentum
      ) {
        newMomentum = maxMomentum - 1;
      }
      updateDebility({ uid, characterId, newMomentum, ...params }),
        loading,
        error;
    },
  };
}
