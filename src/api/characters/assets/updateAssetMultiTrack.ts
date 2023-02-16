import { CharacterNotFoundException } from "api/error/CharacterNotFoundException";
import { UserNotLoggedInException } from "api/error/UserNotLoggedInException";
import { useCharacterSheetStore } from "features/character-sheet/characterSheet.store";
import { updateDoc } from "firebase/firestore";
import { ApiFunction, useApiState } from "hooks/useApiState";
import { useAuth } from "hooks/useAuth";
import { getCharacterAssetDoc } from "./_getRef";

export const updateAssetMultiTrack: ApiFunction<
  {
    uid?: string;
    characterId?: string;
    assetId: string;
    value: string;
  },
  boolean
> = function (params) {
  const { uid, characterId, assetId, value } = params;
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
      [`assets.${assetId}.multiFieldTrackValue`]: value,
    })
      .then(() => {
        resolve(true);
      })
      .catch((e) => {
        console.error(e);
        reject("Error updating asset value");
      });
  });
};

export function useUpdateAssetTrack() {
  const { call, loading, error } = useApiState(updateAssetMultiTrack);

  return {
    updateAssetMultiTrack: call,
    loading,
    error,
  };
}

export function useCharacterSheetUpdateAssetMultiTrack() {
  const uid = useAuth().user?.uid;
  const characterId = useCharacterSheetStore((store) => store.characterId);

  const { updateAssetMultiTrack, loading, error } = useUpdateAssetTrack();

  return {
    updateAssetMultiTrack: (params: { assetId: string; value: string }) =>
      updateAssetMultiTrack({ ...params, uid, characterId }),
    loading,
    error,
  };
}
