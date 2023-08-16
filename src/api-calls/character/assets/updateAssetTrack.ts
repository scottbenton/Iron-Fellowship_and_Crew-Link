import { updateDoc } from "firebase/firestore";
import { getCharacterAssetDoc } from "./_getRef";
import { createApiFunction } from "api-calls/createApiFunction";

export const updateAssetTrack = createApiFunction<
  {
    characterId: string;
    assetId: string;
    value: number;
  },
  void
>((params) => {
  const { characterId, assetId, value } = params;

  return new Promise((resolve, reject) => {
    updateDoc(getCharacterAssetDoc(characterId, assetId), {
      trackValue: value,
    })
      .then(() => {
        resolve();
      })
      .catch((e) => {
        reject(e);
      });
  });
}, "Error updating asset track.");
