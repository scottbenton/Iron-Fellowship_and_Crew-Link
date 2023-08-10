import { arrayUnion, updateDoc } from "firebase/firestore";
import { getCharacterDoc } from "../character/_getRef";
import { getCampaignDoc } from "./_getRef";
import { createApiFunction } from "api-calls/createApiFunction";

export const addCharacterToCampaign = createApiFunction<
  { uid: string; characterId: string; campaignId: string },
  void
>((params) => {
  return new Promise((resolve, reject) => {
    const { uid, characterId, campaignId } = params;

    let updateCampaign = updateDoc(getCampaignDoc(campaignId), {
      characters: arrayUnion({ uid, characterId }),
    });
    let updateCharacter = updateDoc(getCharacterDoc(characterId), {
      campaignId: campaignId,
    });

    Promise.all([updateCampaign, updateCharacter])
      .then(() => {
        resolve();
      })
      .catch((e) => {
        reject(e);
      });
  });
}, "Error adding character to campaign.");
