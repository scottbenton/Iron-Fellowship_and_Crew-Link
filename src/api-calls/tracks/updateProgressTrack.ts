import { updateDoc } from "firebase/firestore";
import { getCampaignTracksDoc, getCharacterTracksDoc } from "./_getRef";
import { StoredTrack, TRACK_TYPES } from "types/Track.type";
import { createApiFunction } from "api-calls/createApiFunction";

export const updateProgressTrack = createApiFunction<
  {
    campaignId?: string;
    characterId?: string;
    type: TRACK_TYPES;
    trackId: string;
    track: StoredTrack;
  },
  void
>((params) => {
  const { campaignId, characterId, type, trackId, track } = params;
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
        [`${type}.${trackId}`]: track,
      }
    )
      .then(() => {
        resolve();
      })
      .catch((e) => {
        console.error(e);
        reject("Failed to update progress track");
      });
  });
}, "Failed to update progress track.");
