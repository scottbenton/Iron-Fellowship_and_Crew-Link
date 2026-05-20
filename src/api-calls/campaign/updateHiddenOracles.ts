import { arrayUnion, arrayRemove, updateDoc } from "firebase/firestore";
import { getCampaignDoc } from "./_getRef";
import { createApiFunction } from "api-calls/createApiFunction";

export const updateCampaignHiddenOracles = createApiFunction<
  {
    campaignId: string;
    oracleId: string;
    hidden: boolean;
  },
  void
>((params) => {
  const { campaignId, oracleId, hidden } = params;

  return new Promise((resolve, reject) => {
    updateDoc(
      getCampaignDoc(campaignId),
      hidden
        ? {
            hiddenOracleIds: arrayUnion(oracleId),
          }
        : {
            hiddenOracleIds: arrayRemove(oracleId),
          }
    )
      .then(() => {
        resolve();
      })
      .catch((e) => {
        reject(e);
      });
  });
}, "Failed to update hidden oracles.");
