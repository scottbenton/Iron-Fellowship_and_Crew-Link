import { CharacterNotFoundException } from "api/error/CharacterNotFoundException";
import { UserNotLoggedInException } from "api/error/UserNotLoggedInException";
import { useCharacterSheetStore } from "features/character-sheet/characterSheet.store";
import { updateDoc } from "firebase/firestore";
import { encodeDataswornId } from "functions/dataswornIdEncoder";
import { ApiFunction, useApiState } from "hooks/useApiState";
import { useAuth } from "providers/AuthProvider";
import { getCharacterAssetDoc } from "./_getRef";

export const updateAssetCheckbox: ApiFunction<
  {
    uid?: string;
    characterId?: string;
    assetId: string;
    abilityIndex: number;
    checked: boolean;
  },
  boolean
> = function (params) {
  const { uid, characterId, assetId, abilityIndex, checked } = params;
  return new Promise<boolean>((resolve, reject) => {
    if (!uid) {
      reject(new UserNotLoggedInException());
      return;
    }
    if (!characterId) {
      reject(new CharacterNotFoundException());
      return;
    }

    if (uid && characterId) {
      const encodedId = encodeDataswornId(assetId);

      //@ts-ignore
      updateDoc(getCharacterAssetDoc(uid, characterId), {
        [`assets.${encodedId}.enabledAbilities.${abilityIndex}`]: checked,
      })
        .then(() => {
          resolve(true);
        })
        .catch((e) => {
          console.error(e);
          reject("Error updating asset ability");
        });
    } else {
    }
  });
};

export function useUpdateAssetCheckbox() {
  const { call, loading, error } = useApiState(updateAssetCheckbox);

  return {
    updateAssetCheckbox: call,
    loading,
    error,
  };
}

export function useCharacterSheetUpdateAssetCheckbox() {
  const uid = useAuth().user?.uid;
  const characterId = useCharacterSheetStore((store) => store.characterId);

  const { updateAssetCheckbox, loading, error } = useUpdateAssetCheckbox();

  return {
    updateAssetCheckbox: (params: {
      assetId: string;
      abilityIndex: number;
      checked: boolean;
    }) => updateAssetCheckbox({ ...params, uid, characterId }),
    loading,
    error,
  };
}
