import {deleteDoc } from "firebase/firestore";
import { getCharacterAssetDoc } from "./_getRef";
import { createApiFunction } from "api-calls/createApiFunction";

export const removeAsset = createApiFunction<
  {
    characterId: string;
    assetId: string;
  },
  void
>((params) => {
  const { characterId, assetId } = params;

  return new Promise((resolve, reject) => {
    deleteDoc(getCharacterAssetDoc(characterId, assetId))
      .then(() => {
        resolve();
      })
      .catch((e) => {
        reject(e);
      });
  });
}, "Error removing assets");
