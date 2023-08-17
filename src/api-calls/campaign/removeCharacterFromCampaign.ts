import { arrayRemove, deleteField, updateDoc } from "firebase/firestore";
import { getCharacterDoc } from "../character/_getRef";
import { getCampaignDoc } from "./_getRef";
import { createApiFunction } from "api-calls/createApiFunction";

export const removeCharacterFromCampaign = createApiFunction<
  { uid: string; campaignId: string; characterId: string },
  void
>(async (params) => {
  const { uid, campaignId, characterId } = params;

  try {
    let campaignPromise = updateDoc(getCampaignDoc(campaignId), {
      characters: arrayRemove({ characterId, uid }),
    });
    let characterPromise = updateDoc(getCharacterDoc(characterId), {
      campaignId: deleteField(),
    });

    await Promise.all([campaignPromise, characterPromise]);
    return;
  } catch (e) {
    throw e;
  }
}, "Failed to remove character from campaign");
