import { getDoc } from "firebase/firestore";
import { ApiFunction, useApiState } from "../../hooks/useApiState";
import { getCampaignDoc } from "../../lib/firebase.lib";
import { StoredCampaign } from "../../types/Campaign.type";

export const getCampaign: ApiFunction<string, StoredCampaign> = function (
  campaignId
) {
  return new Promise((resolve, reject) => {
    getDoc(getCampaignDoc(campaignId))
      .then((snapshot) => {
        const campaign = snapshot.data();

        if (campaign) {
          resolve(campaign);
        } else {
          reject("Could not find campaign");
        }
      })
      .catch((err) => {
        console.error(err);
        reject(new Error("Failed to load campaign."));
      });
  });
};

export function useGetCampaign() {
  const { call, data, loading, error } = useApiState(getCampaign);

  return {
    getCampaign: call,
    campaign: data,
    loading,
    error,
  };
}
