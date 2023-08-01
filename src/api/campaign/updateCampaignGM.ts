import { CampaignNotFoundException } from "api/error/CampaignNotFoundException";
import { arrayUnion, arrayRemove, updateDoc } from "firebase/firestore";
import { ApiFunction, useApiState } from "hooks/useApiState";
import { getCampaignDoc } from "./_getRef";

export const updateCampaignGM: ApiFunction<
  {
    campaignId?: string;
    gmId: string;
    shouldRemove?: boolean;
  },
  boolean
> = function (params) {
  const { campaignId, gmId, shouldRemove } = params;
  return new Promise((resolve, reject) => {
    if (!campaignId) {
      reject(new CampaignNotFoundException());
      return;
    }

    updateDoc(
      getCampaignDoc(campaignId),
      shouldRemove
        ? {
            gmIds: arrayUnion(gmId),
          }
        : {
            gmIds: arrayRemove(gmId),
          }
    )
      .then(() => {
        resolve(true);
      })
      .catch((e) => {
        console.error(e);
        reject(new Error("Failed to update GM."));
      });
  });
};

export function useUpdateCampaignGM() {
  const { call, loading, error } = useApiState(updateCampaignGM);

  return {
    updateCampaignGM: call,
    loading,
    error,
  };
}
