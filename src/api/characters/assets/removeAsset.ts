import { CharacterNotFoundException } from "api/error/CharacterNotFoundException";
import { UserNotLoggedInException } from "api/error/UserNotLoggedInException";
import { useCharacterSheetStore } from "features/character-sheet/characterSheet.store";
import { arrayRemove, deleteField, updateDoc } from "firebase/firestore";
import { encodeDataswornId } from "functions/dataswornIdEncoder";
import { ApiFunction, useApiState } from "hooks/useApiState";
import { useAuth } from "providers/AuthProvider";
import { getCharacterAssetDoc } from "./_getRef";

export const removeAsset: ApiFunction<
  {
    uid?: string;
    characterId?: string;
    assetId: string;
  },
  boolean
> = function (params) {
  const { uid, characterId, assetId } = params;

  return new Promise<boolean>((resolve, reject) => {
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
      assetOrder: arrayRemove(encodedId),
      [`assets.${encodedId}`]: deleteField(),
    })
      .then(() => {
        resolve(true);
      })
      .catch((e) => {
        console.error(e);
        reject("Error removing asset");
      });
  });
};

export function useRemoveAsset() {
  const { call, loading, error } = useApiState(removeAsset);

  return {
    removeAsset: call,
    loading,
    error,
  };
}

export function useCharacterSheetRemoveAsset() {
  const uid = useAuth().user?.uid;
  const characterId = useCharacterSheetStore((store) => store.characterId);

  const { removeAsset, loading, error } = useRemoveAsset();

  return {
    removeAsset: (assetId: string) =>
      removeAsset({ uid, characterId, assetId }),
    loading,
    error,
  };
}
