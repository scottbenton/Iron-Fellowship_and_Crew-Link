import { CampaignNotFoundException } from "api/error/CampaignNotFoundException";
import { useCampaignGMScreenStore } from "pages/Campaign/CampaignGMScreenPage/campaignGMScreen.store";
import { arrayRemove, arrayUnion, setDoc } from "firebase/firestore";
import { ApiFunction, useApiState } from "hooks/useApiState";
import { getCampaignSettingsDoc } from "./_getRef";

export const showOrHideCustomOracle: ApiFunction<
  {
    campaignId?: string;
    oracleId: string;
    hidden: boolean;
  },
  boolean
> = (params) => {
  const { campaignId, oracleId, hidden } = params;

  return new Promise((resolve, reject) => {
    if (!campaignId) {
      throw new CampaignNotFoundException();
      return;
    }

    setDoc(
      getCampaignSettingsDoc(campaignId),
      {
        hiddenCustomOraclesIds: hidden
          ? arrayUnion(oracleId)
          : arrayRemove(oracleId),
      },
      { merge: true }
    )
      .then(() => resolve(true))
      .catch((e) => {
        console.error(e);
        reject("Failed to update visibility of custom oracle.");
      });
  });
};

export function useCampaignGMScreenShowOrHideCustomOracle() {
  const campaignId = useCampaignGMScreenStore((store) => store.campaignId);
  const { call, loading, error } = useApiState(showOrHideCustomOracle);

  return {
    showOrHideCustomOracle: (oracleId: string, hidden: boolean) =>
      call({ campaignId, oracleId, hidden }),
    loading,
    error,
  };
}
