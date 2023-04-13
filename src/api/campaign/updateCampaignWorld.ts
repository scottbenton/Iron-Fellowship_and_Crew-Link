import { CampaignNotFoundException } from "api/error/CampaignNotFoundException";
import { useCampaignGMScreenStore } from "features/campaign-gm-screen/campaignGMScreen.store";
import { deleteField, updateDoc } from "firebase/firestore";
import { ApiFunction, useApiState } from "hooks/useApiState";
import { getCampaignDoc } from "./_getRef";

export const updateCampaignWorld: ApiFunction<
  { campaignId?: string; worldId?: string },
  boolean
> = (params) => {
  const { campaignId, worldId } = params;
  return new Promise((resolve, reject) => {
    if (!campaignId) {
      reject(new CampaignNotFoundException());
      return;
    }

    updateDoc(getCampaignDoc(campaignId), {
      worldId: worldId ? worldId : deleteField(),
    })
      .then(() => {
        resolve(true);
      })
      .catch((e) => {
        console.error(e);
        reject(new Error("Failed to update campaign world."));
      });
  });
};

export function useUpdateCampaignWorld() {
  const { call, loading } = useApiState(updateCampaignWorld);

  return {
    updateCampaignWorld: (campaignId: string, worldId?: string) =>
      call({ campaignId, worldId }),
    loading,
  };
}

export function useCampaignGMScreenUpdateCampaignWorld() {
  const campaignId = useCampaignGMScreenStore((store) => store.campaignId);

  const { call, loading } = useApiState(updateCampaignWorld);

  return {
    updateCampaignWorld: (worldId?: string) => call({ campaignId, worldId }),
    loading,
  };
}
