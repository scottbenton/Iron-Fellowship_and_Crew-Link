import { CharacterNotFoundException } from "api/error/CharacterNotFoundException";
import { UserNotLoggedInException } from "api/error/UserNotLoggedInException";
import { useCharacterSheetStore } from "features/character-sheet/characterSheet.store";
import { updateDoc } from "firebase/firestore";
import { encodeDataswornId } from "functions/dataswornIdEncoder";
import { ApiFunction, useApiState } from "hooks/useApiState";
import { useAuth } from "providers/AuthProvider";
import { getCharacterAssetDoc } from "./_getRef";

export const updateAssetTrack: ApiFunction<
  {
    uid?: string;
    characterId?: string;
    assetId: string;
    value: number;
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

    const encodedId = encodeDataswornId(assetId);

    //@ts-ignore
    updateDoc(getCharacterAssetDoc(uid, characterId), {
      [`assets.${encodedId}.trackValue`]: value,
    })
      .then(() => {
        resolve(true);
      })
      .catch((e) => {
        console.error(e);
        reject("Error updating asset track");
      });
  });
};

export function useUpdateAssetTrack() {
  const { call, loading, error } = useApiState(updateAssetTrack);

  return {
    updateAssetTrack: call,
    loading,
    error,
  };
}

export function useCharacterSheetUpdateAssetTrack() {
  const uid = useAuth().user?.uid;
  const characterId = useCharacterSheetStore((store) => store.characterId);

  const { updateAssetTrack, loading, error } = useUpdateAssetTrack();

  return {
    updateAssetTrack: (params: { assetId: string; value: number }) =>
      updateAssetTrack({ ...params, uid, characterId }),
    loading,
    error,
  };
}
