import { deleteDoc, getDocs } from "firebase/firestore";
import {
  getCampaignAssetCollection,
  getCampaignAssetDoc,
  getCharacterAssetCollection,
  getCharacterAssetDoc,
} from "./_getRef";
import { createApiFunction } from "api-calls/createApiFunction";

function getAllAssets(
  campaignId: string | undefined,
  characterId: string | undefined
): Promise<string[]> {
  return new Promise<string[]>((resolve, reject) => {
    if (!characterId && !campaignId) {
      reject(new Error("Either character or campaign ID must be defined."));
      return;
    }
    getDocs(
      characterId
        ? getCharacterAssetCollection(characterId)
        : getCampaignAssetCollection(campaignId as string)
    )
      .then((snapshot) => {
        const ids = snapshot.docs.map((doc) => doc.id);
        resolve(ids);
      })
      .catch((e) => {
        reject("Failed to get assets.");
      });
  });
}

export const deleteAllAssets = createApiFunction<
  { characterId?: string; campaignId?: string },
  void
>(({ campaignId, characterId }) => {
  return new Promise<void>((resolve, reject) => {
    if (!campaignId && !characterId) {
      reject("Either campaign or character ID must be defined.");
      return;
    }
    getAllAssets(campaignId, characterId)
      .then((assetIds) => {
        const promises = assetIds.map((assetId) =>
          deleteDoc(
            characterId
              ? getCharacterAssetDoc(characterId, assetId)
              : getCampaignAssetDoc(campaignId as string, assetId)
          )
        );
        Promise.all(promises)
          .then(() => {
            resolve();
          })
          .catch((e) => {
            reject(e);
          });
      })
      .catch((e) => {
        reject(e);
      });
  });
}, "Failed to delete some or all assets.");
