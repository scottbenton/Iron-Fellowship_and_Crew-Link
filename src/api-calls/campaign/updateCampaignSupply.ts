import { updateDoc } from "firebase/firestore";
import { getCampaignDoc } from "./_getRef";
import { createApiFunction } from "api-calls/createApiFunction";

export const updateCampaignSupply = createApiFunction<
  {
    campaignId: string;
    supply: number;
  },
  void
>((params) => {
  const { campaignId, supply } = params;
  return new Promise((resolve, reject) => {
    updateDoc(getCampaignDoc(campaignId), {
      supply,
    })
      .then(() => {
        resolve();
      })
      .catch((e) => {
        reject(e);
      });
  });
}, "Failed to update supply.");
