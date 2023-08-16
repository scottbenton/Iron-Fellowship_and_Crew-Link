import { deleteField, updateDoc } from "firebase/firestore";
import { getCampaignDoc } from "./_getRef";
import { createApiFunction } from "api-calls/createApiFunction";

export const updateCampaignWorld = createApiFunction<
  { campaignId: string; worldId?: string },
  void
>((params) => {
  const { campaignId, worldId } = params;
  return new Promise((resolve, reject) => {
    updateDoc(getCampaignDoc(campaignId), {
      worldId: worldId ? worldId : deleteField(),
    })
      .then(() => {
        resolve();
      })
      .catch((e) => {
        reject(e);
      });
  });
}, "Failed to update campaign world.");
