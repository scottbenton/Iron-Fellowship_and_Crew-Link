import { deleteDoc } from "firebase/firestore";
import { getCampaignTracksDoc, getCharacterTracksDoc } from "./_getRef";
import { createApiFunction } from "api-calls/createApiFunction";

export const removeProgressTrack = createApiFunction<
  {
    campaignId?: string;
    characterId?: string;
    id: string;
  },
  void
>((params) => {
  const { campaignId, characterId, id } = params;

  return new Promise((resolve, reject) => {
    if (!campaignId && !characterId) {
      reject(new Error("Either campaign or character ID must be defined."));
      return;
    }

    deleteDoc(
      campaignId
        ? getCampaignTracksDoc(campaignId, id)
        : getCharacterTracksDoc(characterId as string, id)
    )
      .then(() => {
        resolve();
      })
      .catch((e) => {
        reject(e);
      });
  });
}, "Failed to remove progress track.");
