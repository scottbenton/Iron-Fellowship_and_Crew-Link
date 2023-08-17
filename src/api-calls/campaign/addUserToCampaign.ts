import { arrayUnion, updateDoc } from "firebase/firestore";
import { getCampaignDoc } from "./_getRef";
import { createApiFunction } from "api-calls/createApiFunction";

export const addUserToCampaign = createApiFunction<
  { campaignId: string; userId: string },
  void
>((params) => {
  return new Promise((resolve, reject) => {
    const { campaignId, userId } = params;

    updateDoc(getCampaignDoc(campaignId), {
      users: arrayUnion(userId),
    })
      .then(() => {
        resolve();
      })
      .catch((e) => {
        reject(e);
      });
  });
}, "Error adding user to campaign.");
