import { arrayUnion, updateDoc } from "firebase/firestore";
import { ApiFunction, useApiState } from "../../hooks/useApiState";
import { getCampaignDoc } from "../../lib/firebase.lib";

export const addUserToCampaign: ApiFunction<
  { campaignId: string; userId: string },
  boolean
> = function (params) {
  return new Promise((resolve, reject) => {
    const { campaignId, userId } = params;

    updateDoc(getCampaignDoc(campaignId), {
      users: arrayUnion(userId),
    })
      .then(() => {
        resolve(true);
      })
      .catch((e) => {
        console.error(e);
        reject("Error adding user to campaign");
      });
  });
};

export function useAddUserToCampaign() {
  const { loading, error, call } = useApiState(addUserToCampaign);
  return {
    loading,
    error,
    addUserToCampaign: call,
  };
}
