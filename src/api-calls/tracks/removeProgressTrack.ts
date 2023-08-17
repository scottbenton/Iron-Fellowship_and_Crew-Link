import { deleteField, updateDoc } from "firebase/firestore";
import { getCampaignTracksDoc, getCharacterTracksDoc } from "./_getRef";
import { TRACK_TYPES } from "types/Track.type";
import { createApiFunction } from "api-calls/createApiFunction";

export const removeProgressTrack = createApiFunction<
  {
    campaignId?: string;
    characterId?: string;
    type: TRACK_TYPES;
    id: string;
  },
  void
>((params) => {
  const { campaignId, characterId, type, id } = params;

  return new Promise((resolve, reject) => {
    if (!campaignId && !characterId) {
      reject(new Error("Either campaign or character ID must be defined."));
      return;
    }

    updateDoc(
      campaignId
        ? getCampaignTracksDoc(campaignId)
        : getCharacterTracksDoc(characterId as string),
      {
        [`${type}.${id}`]: deleteField(),
      }
    )
      .then(() => {
        resolve();
      })
      .catch((e) => {
        reject(e);
      });
  });
}, "Failed to remove progress track.");
