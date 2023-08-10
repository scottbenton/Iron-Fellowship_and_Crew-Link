import { arrayUnion, arrayRemove, updateDoc } from "firebase/firestore";
import { getCampaignDoc } from "./_getRef";
import { createApiFunction } from "api-calls/createApiFunction";

export const updateCampaignGM = createApiFunction<
  {
    campaignId: string;
    gmId: string;
    shouldRemove?: boolean;
  },
  void
>((params) => {
  const { campaignId, gmId, shouldRemove } = params;
  return new Promise((resolve, reject) => {
    updateDoc(
      getCampaignDoc(campaignId),
      !shouldRemove
        ? {
            gmIds: arrayUnion(gmId),
          }
        : {
            gmIds: arrayRemove(gmId),
          }
    )
      .then(() => {
        resolve();
      })
      .catch((e) => {
        reject(e);
      });
  });
}, "Failed to update GM.");
