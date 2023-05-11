import { CharacterNotFoundException } from "api/error/CharacterNotFoundException";
import { UserNotLoggedInException } from "api/error/UserNotLoggedInException";
import { useCharacterSheetStore } from "pages/Character/CharacterSheetPage/characterSheet.store";
import { updateDoc } from "firebase/firestore";
import { ApiFunction, useApiState } from "hooks/useApiState";
import { useAuth } from "providers/AuthProvider";
import { getCharacterDoc } from "./_getRef";
import { DEBILITIES } from "types/debilities.enum";

export const updateShareNotesWithGMSetting: ApiFunction<
  {
    uid?: string;
    characterId?: string;
    shouldShare: boolean;
  },
  boolean
> = function (params) {
  const { uid, characterId, shouldShare } = params;

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
      shareNotesWithGM: shouldShare,
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

export function useUpdateShareNotesWithGMSetting() {
  const { call, loading, error } = useApiState(updateShareNotesWithGMSetting);

  return {
    updateShareNotesWithGMSetting: call,
    loading,
    error,
  };
}

export function useCharacterSheetUpdateShareNotesWithGMSetting() {
  const uid = useAuth().user?.uid;
  const characterId = useCharacterSheetStore((store) => store.characterId);
  const momentum = useCharacterSheetStore((store) => store.character?.momentum);
  const maxMomentum = useCharacterSheetStore((store) => store.maxMomentum);

  const { updateShareNotesWithGMSetting, loading, error } =
    useUpdateShareNotesWithGMSetting();

  return {
    updateShareNotesWithGMSetting: (shouldShare: boolean) =>
      updateShareNotesWithGMSetting({ uid, characterId, shouldShare }),
    loading,
    error,
  };
}
