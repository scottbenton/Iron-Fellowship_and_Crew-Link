import { CampaignNotFoundException } from "api/error/CampaignNotFoundException";
import { deleteField, updateDoc } from "firebase/firestore";
import { ApiFunction, useApiState } from "hooks/useApiState";
import { getCampaignDoc } from "lib/firebase.lib";

export const updateCampaignGM: ApiFunction<
  {
    campaignId?: string;
    gmId?: string;
  },
  boolean
> = function (params) {
  const { campaignId, gmId } = params;
  return new Promise((resolve, reject) => {
    if (!campaignId) {
      reject(new CampaignNotFoundException());
      return;
    }

    updateDoc(getCampaignDoc(campaignId), {
      gmId: gmId ?? deleteField(),
    })
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
