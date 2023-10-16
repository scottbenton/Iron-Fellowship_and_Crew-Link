import { updateDoc } from "firebase/firestore";
import { getCampaignTracksDoc, getCharacterTracksDoc } from "./_getRef";
import { Track } from "types/Track.type";
import { createApiFunction } from "api-calls/createApiFunction";

export const updateProgressTrack = createApiFunction<
  {
    campaignId?: string;
    characterId?: string;
    trackId: string;
    track: Partial<Track>;
  },
  void
>((params) => {
  const { campaignId, characterId, trackId, track } = params;
  return new Promise((resolve, reject) => {
    if (!campaignId && !characterId) {
      reject(new Error("Either campaign or character ID must be defined."));
      return;
    }

    updateDoc(
      campaignId
        ? getCampaignTracksDoc(campaignId, trackId)
        : getCharacterTracksDoc(characterId as string, trackId),
      track
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
