import { CampaignNotFoundException } from "api/error/CampaignNotFoundException";
import { useCampaignGMScreenStore } from "features/campaign-gm-screen/campaignGMScreen.store";
import { arrayRemove, arrayUnion, setDoc } from "firebase/firestore";
import { ApiFunction, useApiState } from "hooks/useApiState";
import { getCampaignSettingsDoc } from "./_getRef";

export const showOrHideCustomMove: ApiFunction<
  {
    campaignId?: string;
    moveId: string;
    hidden: boolean;
  },
  boolean
> = (params) => {
  const { campaignId, moveId, hidden } = params;

  return new Promise((resolve, reject) => {
    if (!campaignId) {
      throw new CampaignNotFoundException();
      return;
    }

    setDoc(
      getCampaignSettingsDoc(campaignId),
      {
        hiddenCustomMoveIds: hidden ? arrayUnion(moveId) : arrayRemove(moveId),
      },
      { merge: true }
    )
      .then(() => resolve(true))
      .catch((e) => {
        console.error(e);
        reject("Failed to update visibility of custom move.");
      });
  });
};

export function useCampaignGMScreenShowOrHideCustomMove() {
  const campaignId = useCampaignGMScreenStore((store) => store.campaignId);
  const { call, loading, error } = useApiState(showOrHideCustomMove);

  return {
    showOrHideCustomMove: (moveId: string, hidden: boolean) =>
      call({ campaignId, moveId, hidden }),
    loading,
    error,
  };
}
