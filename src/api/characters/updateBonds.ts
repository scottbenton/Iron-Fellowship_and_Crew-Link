import { CharacterNotFoundException } from "api/error/CharacterNotFoundException";
import { UserNotLoggedInException } from "api/error/UserNotLoggedInException";
import { useCharacterSheetStore } from "pages/Character/CharacterSheetPage/characterSheet.store";
import { updateDoc } from "firebase/firestore";
import { ApiFunction, useApiState } from "hooks/useApiState";
import { useAuth } from "providers/AuthProvider";
import { getCharacterDoc } from "./_getRef";

export const updateBonds: ApiFunction<
  {
    uid?: string;
    characterId?: string;
    value: number;
  },
  boolean
> = function (params) {
  const { uid, characterId, value } = params;

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
      bonds: value,
    })
      .then(() => {
        resolve(true);
      })
      .catch((e) => {
        console.error(e);
        reject("Failed to update bonds");
      });
  });
};

export function useUpdateBonds() {
  const { call, loading, error } = useApiState(updateBonds);

  return {
    updateBonds: call,
    loading,
    error,
  };
}

export function useCharacterSheetUpdateBonds() {
  const uid = useAuth().user?.uid;
  const characterId = useCharacterSheetStore().characterId;
  const { updateBonds, loading, error } = useUpdateBonds();

  return {
    updateBonds: (bonds: number) =>
      updateBonds({ uid, characterId, value: bonds }),
    loading,
    error,
  };
}
