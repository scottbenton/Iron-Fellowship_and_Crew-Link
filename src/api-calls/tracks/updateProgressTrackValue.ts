import { updateDoc } from "firebase/firestore";
import { getCampaignTracksDoc, getCharacterTracksDoc } from "./_getRef";
import { TRACK_TYPES } from "types/Track.type";
import { createApiFunction } from "api-calls/createApiFunction";

export const updateProgressTrackValue = createApiFunction<
  {
    campaignId?: string;
    characterId?: string;
    type: TRACK_TYPES;
    trackId: string;
    value: number;
  },
  void
>((params) => {
  const { campaignId, characterId, type, trackId, value } = params;
  return new Promise((resolve, reject) => {
    if (!campaignId && !characterId) {
      reject(new Error("Either campaign or character ID must be defined."));
      return;
    }

    updateDoc(
      campaignId
        ? getCampaignTracksDoc(campaignId)
        : getCharacterTracksDoc(characterId as string),
      //@ts-ignore
      {
        [`${type}.${trackId}.value`]: value,
      }
    )
      .then(() => {
        resolve();
      })
      .catch((e) => {
        reject(e);
      });
  });
}, "Failed to update progress track value.");
