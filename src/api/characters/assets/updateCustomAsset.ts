import { useCharacterSheetStore } from "features/character-sheet/characterSheet.store";
import { updateDoc } from "firebase/firestore";
import { ApiFunction, useApiState } from "hooks/useApiState";
import { useAuth } from "hooks/useAuth";
import { getCharacterAssetDoc } from "./_getRef";
import { Asset } from "dataforged";
import { encodeDataswornId } from "functions/dataswornIdEncoder";

export const updateCustomAsset: ApiFunction<
  {
    uid?: string;
    characterId?: string;
    assetId: string;
    asset: Asset;
  },
  boolean
> = function (params) {
  const { uid, characterId, assetId, asset } = params;

  return new Promise<boolean>((resolve, reject) => {
    if (!uid) {
      reject("No user found");
      return;
    }
    if (!characterId) {
      reject("Character not found");
      return;
    }

    const encodedId = encodeDataswornId(assetId);

    //@ts-ignore
    updateDoc(getCharacterAssetDoc(uid, characterId), {
      [`assets.${encodedId}.customAsset`]: asset,
    })
      .then(() => {
        resolve(true);
      })
      .catch((e) => {
        console.error(e);
        reject("Error updating custom asset");
      });
  });
};

export function useUpdateCustomAsset() {
  const { call, loading, error } = useApiState(updateCustomAsset);

  return {
    updateCustomAsset: call,
    loading,
    error,
  };
}

export function useCharacterSheetUpdateCustomAsset() {
  const uid = useAuth().user?.uid;
  const characterId = useCharacterSheetStore((store) => store.characterId);

  const { updateCustomAsset, loading, error } = useUpdateCustomAsset();

  return {
    updateCustomAsset: (params: { assetId: string; asset: Asset }) =>
      updateCustomAsset({
        uid,
        characterId,
        assetId: params.assetId,
        asset: params.asset,
      }),
    loading,
    error,
  };
}
