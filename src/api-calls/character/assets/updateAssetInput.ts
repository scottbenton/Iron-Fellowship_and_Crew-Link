import { updateDoc } from "firebase/firestore";
import { getCharacterAssetDoc } from "./_getRef";
import { createApiFunction } from "api-calls/createApiFunction";

export const updateAssetInput = createApiFunction<
  {
    characterId: string;
    assetId: string;
    inputLabel: string;
    inputValue: string;
  },
  void
>((params) => {
  const { characterId, assetId, inputLabel, inputValue } = params;
  return new Promise((resolve, reject) => {
    //@ts-ignore
    updateDoc(getCharacterAssetDoc(characterId, assetId), {
      [`inputs.${inputLabel}`]: inputValue,
    })
      .then(() => {
        resolve();
      })
      .catch((e) => {
        reject(e);
      });
  });
}, "Error updating asset input");
