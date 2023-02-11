import { CharacterNotFoundException } from "api/error/CharacterNotFoundException";
import { UserNotLoggedInException } from "api/error/UserNotLoggedInException";
import { useCharacterSheetStore } from "features/character-sheet/characterSheet.store";
import { updateDoc } from "firebase/firestore";
import { ApiFunction, useApiState } from "hooks/useApiState";
import { useAuth } from "hooks/useAuth";
import { getCharacterAssetDoc } from "lib/firebase.lib";

export const updateAssetInput: ApiFunction<
  {
    uid?: string;
    characterId?: string;
    assetId: string;
    inputLabel: string;
    inputValue: string;
  },
  boolean
> = function (params) {
  const { uid, characterId, assetId, inputLabel, inputValue } = params;
  return new Promise((resolve, reject) => {
    if (!uid) {
      reject(new UserNotLoggedInException());
      return;
    }
    if (!characterId) {
      reject(new CharacterNotFoundException());
      return;
    }
    //@ts-ignore
    updateDoc(getCharacterAssetDoc(uid, characterId), {
      [`assets.${assetId}.inputs.${inputLabel}`]: inputValue,
    })
      .then(() => {
        resolve(true);
      })
      .catch((e) => {
        console.error(e);
        reject("Error updating asset label");
      });
  });
};

export function useUpdateAssetInput() {
  const { call, loading, error } = useApiState(updateAssetInput);

  return {
    updateAssetInput: call,
    loading,
    error,
  };
}

export function useCharacterSheetUpdateAssetInput() {
  const uid = useAuth().user?.uid;
  const characterId = useCharacterSheetStore((store) => store.characterId);

  const { updateAssetInput, loading, error } = useUpdateAssetInput();

  return {
    updateAssetInput: (params: {
      assetId: string;
      inputLabel: string;
      inputValue: string;
    }) => updateAssetInput({ ...params, uid, characterId }),
    loading,
    error,
  };
}
