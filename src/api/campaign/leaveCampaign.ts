import { UserNotLoggedInException } from "api/error/UserNotLoggedInException";
import { arrayRemove, updateDoc } from "firebase/firestore";
import { StoredCampaign } from "types/Campaign.type";
import { ApiFunction, useApiState } from "../../hooks/useApiState";
import { getCampaignDoc } from "./_getRef";
import { updateCampaignGM } from "./updateCampaignGM";
import { removeCharacterFromCampaign } from "./removeCharacterFromCampaign";

export const leaveCampaign: ApiFunction<
  { uid?: string; campaignId: string; campaign: StoredCampaign },
  boolean | undefined
> = async function (params) {
  const { uid, campaignId, campaign } = params;

  if (!uid) {
    throw new UserNotLoggedInException();
    return;
  }

  try {
    const allPromises: Promise<any>[] = [];

    if (uid === campaign.gmId) {
      allPromises.push(updateCampaignGM({ campaignId }));
    }
    Object.values(campaign.characters).forEach((character) => {
      if (character.uid === uid) {
        allPromises.push(
          removeCharacterFromCampaign({
            campaignId,
            characterId: character.characterId,
          })
        );
      }
    });

    allPromises.push(
      updateDoc(getCampaignDoc(campaignId), {
        users: arrayRemove(uid),
      })
    );

    await Promise.all(allPromises);
    return true;
  } catch (e) {
    console.error(e);
    throw new Error("Failed to remove user from campaign");
    return;
  }
};

export function useLeaveCampaign() {
  const { call, loading, error } = useApiState(leaveCampaign);

  return {
    leaveCampaign: call,
    loading,
    error,
  };
}
