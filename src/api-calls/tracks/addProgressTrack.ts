import { setDoc } from "firebase/firestore";
import { getCampaignTracksDoc, getCharacterTracksDoc } from "./_getRef";
import { StoredTrack, TRACK_TYPES } from "types/Track.type";
import { createApiFunction } from "api-calls/createApiFunction";

export const addProgressTrack = createApiFunction<
  {
    campaignId?: string;
    characterId?: string;
    type: TRACK_TYPES;
    track: StoredTrack;
  },
  void
>((params) => {
  const { campaignId, characterId, type, track } = params;

  return new Promise((resolve, reject) => {
    if (!campaignId && !characterId) {
      reject("Must provide either a character or a campaign ID");
      return;
    }

    setDoc(
      campaignId
        ? getCampaignTracksDoc(campaignId)
        : getCharacterTracksDoc(characterId as string),
      {
        [type]: {
          [track.label + track.createdTimestamp.toString()]: track,
        },
      },
      { merge: true }
    )
      .then(() => {
        resolve();
      })
      .catch((e) => {
        reject(e);
      });
  });
}, "Failed to add progress track.");
