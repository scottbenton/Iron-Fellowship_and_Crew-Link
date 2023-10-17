import { addDoc } from "firebase/firestore";
import {
  convertToDatabase,
  getCampaignTracksCollection,
  getCharacterTracksCollection,
} from "./_getRef";
import { Track } from "types/Track.type";
import { createApiFunction } from "api-calls/createApiFunction";

export const addProgressTrack = createApiFunction<
  {
    campaignId?: string;
    characterId?: string;
    track: Track;
  },
  void
>((params) => {
  const { campaignId, characterId, track } = params;

  const storedTrack = convertToDatabase(track);

  return new Promise((resolve, reject) => {
    if (!campaignId && !characterId) {
      reject("Must provide either a character or a campaign ID");
      return;
    }

    addDoc(
      campaignId
        ? getCampaignTracksCollection(campaignId)
        : getCharacterTracksCollection(characterId as string),
      storedTrack
    )
      .then(() => {
        resolve();
      })
      .catch((e) => {
        reject(e);
      });
  });
}, "Failed to add progress track.");
