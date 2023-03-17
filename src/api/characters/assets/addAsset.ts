import { CharacterNotFoundException } from "api/error/CharacterNotFoundException";
import { UserNotLoggedInException } from "api/error/UserNotLoggedInException";
import { useCharacterSheetStore } from "features/character-sheet/characterSheet.store";
import { arrayUnion, updateDoc } from "firebase/firestore";
import { ApiFunction, useApiState } from "hooks/useApiState";
import { useAuth } from "hooks/useAuth";
import { getCharacterAssetDoc } from "./_getRef";
import { StoredAsset } from "types/Asset.type";
import { encodeDataswornId } from "functions/dataswornIdEncoder";

interface AddAssetParams {
  uid?: string;
  characterId?: string;
  asset: StoredAsset;
}

export const addAsset: ApiFunction<AddAssetParams, boolean> = function (
  params
) {
  const { uid, characterId, asset } = params;
  return new Promise((resolve, reject) => {
    if (!uid) {
      reject(new UserNotLoggedInException());
      return;
    }
    if (!characterId) {
      reject(new CharacterNotFoundException());
      return;
    }
    const encodedId = encodeDataswornId(asset.id);
    // @ts-ignore
    updateDoc(getCharacterAssetDoc(uid, characterId), {
      assetOrder: arrayUnion(encodedId),
      [`assets.${encodedId}`]: asset,
    })
      .then(() => {
        resolve(true);
      })
      .catch((e) => {
        console.error(e);
        reject("Error adding asset");
      });
  });
};

export function useAddAsset() {
  const { error, call, loading } = useApiState(addAsset);

  return {
    addAsset: call,
    loading,
    error,
  };
}

export function useCharacterSheetAddAsset() {
  const uid = useAuth().user?.uid;
  const characterId = useCharacterSheetStore((store) => store.characterId);

  const { addAsset, loading, error } = useAddAsset();

  return {
    addAsset: (asset: StoredAsset) => addAsset({ uid, characterId, asset }),
    loading,
    error,
  };
}
