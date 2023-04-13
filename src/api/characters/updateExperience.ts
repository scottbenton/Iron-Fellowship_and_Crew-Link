import { CharacterNotFoundException } from "api/error/CharacterNotFoundException";
import { UserNotLoggedInException } from "api/error/UserNotLoggedInException";
import { useCharacterSheetStore } from "features/character-sheet/characterSheet.store";
import { updateDoc } from "firebase/firestore";
import { ApiFunction, useApiState } from "hooks/useApiState";
import { useAuth } from "providers/AuthProvider";
import { getCharacterDoc } from "./_getRef";

export const updateExperience: ApiFunction<
  {
    uid?: string;
    characterId?: string;
    type: "spent" | "earned";
    value: number;
  },
  boolean
> = function (params) {
  const { uid, characterId, type, value } = params;
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
      [`experience.${type}`]: value,
    })
      .then(() => {
        resolve(true);
      })
      .catch((e) => {
        console.error(e);
        reject("Failed to update experience");
      });
  });
};

export function useUpdateExperience() {
  const { call, loading, error } = useApiState(updateExperience);

  return {
    updateExperience: call,
    loading,
    error,
  };
}

export function useCharacterSheetUpdateExperience() {
  const uid = useAuth().user?.uid;
  const characterId = useCharacterSheetStore((store) => store.characterId);

  const { updateExperience, loading, error } = useUpdateExperience();

  return {
    updateExperience: (params: { type: "spent" | "earned"; value: number }) =>
      updateExperience({ uid, characterId, ...params }),
    loading,
    error,
  };
}
