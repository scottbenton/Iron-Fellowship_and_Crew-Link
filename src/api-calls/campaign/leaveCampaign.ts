import { arrayRemove, updateDoc } from "firebase/firestore";
import { StoredCampaign } from "types/Campaign.type";
import { getCampaignDoc } from "./_getRef";
import { updateCampaignGM } from "./updateCampaignGM";
import { removeCharacterFromCampaign } from "./removeCharacterFromCampaign";
import { createApiFunction } from "api-calls/createApiFunction";

export const leaveCampaign = createApiFunction<
  { uid: string; campaignId: string; campaign: StoredCampaign },
  void
>(async (params) => {
  const { uid, campaignId, campaign } = params;
  return new Promise((resolve, reject) => {
    const allPromises: Promise<unknown>[] = [];

    if (campaign.gmIds?.includes(uid)) {
      allPromises.push(
        updateCampaignGM({ campaignId, gmId: uid, shouldRemove: true })
      );
    }
    Object.values(campaign.characters).forEach((character) => {
      if (character.uid === uid) {
        allPromises.push(
          removeCharacterFromCampaign({
            uid,
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

    Promise.all(allPromises)
      .then(() => resolve())
      .catch(reject);
    return;
  });
}, "Failed to remove user from campaign.");
