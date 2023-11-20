import { arrayRemove, deleteField, updateDoc } from "firebase/firestore";
import { getCharacterDoc } from "../character/_getRef";
import { getCampaignDoc } from "./_getRef";
import { createApiFunction } from "api-calls/createApiFunction";

export const removeCharacterFromCampaign = createApiFunction<
  { uid: string; campaignId: string; characterId: string },
  void
>((params) => {
  const { uid, campaignId, characterId } = params;
  return new Promise((resolve, reject) => {
    const campaignPromise = updateDoc(getCampaignDoc(campaignId), {
      characters: arrayRemove({ characterId, uid }),
    });
    const characterPromise = updateDoc(getCharacterDoc(characterId), {
      campaignId: deleteField(),
    });

    Promise.all([campaignPromise, characterPromise])
      .then(() => resolve())
      .catch(reject);
  });
}, "Failed to remove character from campaign");
