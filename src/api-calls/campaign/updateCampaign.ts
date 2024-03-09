import { UpdateData, updateDoc } from "firebase/firestore";
import { getCampaignDoc } from "./_getRef";
import { createApiFunction } from "api-calls/createApiFunction";
import { StoredCampaign } from "types/Campaign.type";

export const updateCampaign = createApiFunction<
  {
    campaignId: string;
    campaign: UpdateData<StoredCampaign>;
  },
  void
>((params) => {
  const { campaignId, campaign } = params;
  return new Promise((resolve, reject) => {
    updateDoc(getCampaignDoc(campaignId), campaign)
      .then(() => {
        resolve();
      })
      .catch((e) => {
        reject(e);
      });
  });
}, "Failed to update campaign.");
