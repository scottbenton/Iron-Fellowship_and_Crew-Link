import { CampaignNotFoundException } from "api/error/CampaignNotFoundException";
import { updateDoc } from "firebase/firestore";
import { ApiFunction, useApiState } from "hooks/useApiState";
import { getCampaignDoc } from "lib/firebase.lib";

export const updateCampaignSupply: ApiFunction<
  {
    campaignId?: string;
    supply: number;
  },
  boolean
> = function (params) {
  const { campaignId, supply } = params;
  return new Promise((resolve, reject) => {
    if (!campaignId) {
      reject(new CampaignNotFoundException());
      return;
    }

    updateDoc(getCampaignDoc(campaignId), {
      supply,
    })
      .then(() => {
        resolve(true);
      })
      .catch((e) => {
        console.error(e);
        reject(new Error("Failed to update supply."));
      });
  });
};

export function useUpdateCampaignSupply() {
  const { call, loading, error } = useApiState(updateCampaignSupply);

  return {
    updateCampaignSupply: call,
    loading,
    error,
  };
}
