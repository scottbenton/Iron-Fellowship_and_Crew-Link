import { CharacterNotFoundException } from "api/error/CharacterNotFoundException";
import { UserNotLoggedInException } from "api/error/UserNotLoggedInException";
import { useCharacterSheetStore } from "pages/Character/CharacterSheetPage/characterSheet.store";
import { updateDoc } from "firebase/firestore";
import { ApiFunction, useApiState } from "hooks/useApiState";
import { useAuth } from "providers/AuthProvider";
import { getCharacterDoc } from "./_getRef";

export const updateName: ApiFunction<
  {
    uid?: string;
    characterId?: string;
    name: string;
  },
  boolean
> = function (params) {
  const { uid, characterId, name } = params;

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
      name,
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

export function useUpdateName() {
  const { call, loading, error } = useApiState(updateName);
  return {
    updateName: call,
    loading,
    error,
  };
}

export function useCharacterSheetUpdateName() {
  const uid = useAuth().user?.uid;
  const characterId = useCharacterSheetStore((store) => store.characterId);

  const { updateName, loading, error } = useUpdateName();

  return {
    updateName: (name: string) => updateName({ uid, characterId, name }),
    loading,
    error,
  };
}
