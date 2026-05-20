import { arrayUnion, arrayRemove, updateDoc } from "firebase/firestore";
import { getCampaignDoc } from "./_getRef";
import { createApiFunction } from "api-calls/createApiFunction";

export const updateCampaignHiddenAssets = createApiFunction<
  {
    campaignId: string;
    assetId: string;
    isHidden: boolean;
  },
  void
>((params) => {
  const { campaignId, assetId, isHidden } = params;

  return new Promise((resolve, reject) => {
    updateDoc(
      getCampaignDoc(campaignId),
      isHidden
        ? {
            hiddenAssetIds: arrayUnion(assetId),
          }
        : {
            hiddenAssetIds: arrayRemove(assetId),
          }
    )
      .then(() => {
        resolve();
      })
      .catch((e) => {
        reject(e);
      });
  });
}, "Failed to update hidden assets.");
