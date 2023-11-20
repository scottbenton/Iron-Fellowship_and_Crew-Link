import { getDocs } from "firebase/firestore";
import { removeProgressTrack } from "./removeProgressTrack";
import {
  getCampaignTracksCollection,
  getCharacterTracksCollection,
} from "./_getRef";
import { createApiFunction } from "api-calls/createApiFunction";

function getAllProgressTracks(
  campaignId: string | undefined,
  characterId: string | undefined
): Promise<string[]> {
  return new Promise<string[]>((resolve, reject) => {
    if (!characterId && !campaignId) {
      reject(new Error("Either character or campaign ID must be defined."));
      return;
    }
    getDocs(
      characterId
        ? getCharacterTracksCollection(characterId)
        : getCampaignTracksCollection(campaignId as string)
    )
      .then((snapshot) => {
        const ids = snapshot.docs.map((doc) => doc.id);
        resolve(ids);
      })
      .catch(() => {
        reject("Failed to get tracks.");
      });
  });
}

export const deleteAllProgressTracks = createApiFunction<
  { characterId?: string; campaignId?: string },
  void
>(({ campaignId, characterId }) => {
  return new Promise<void>((resolve, reject) => {
    if (!campaignId && !characterId) {
      reject("Either campaign or character ID must be defined.");
      return;
    }
    getAllProgressTracks(campaignId, characterId)
      .then((trackIds) => {
        const promises = trackIds.map((trackId) =>
          removeProgressTrack({ campaignId, characterId, id: trackId })
        );
        Promise.all(promises)
          .then(() => {
            resolve();
          })
          .catch((e) => {
            reject(e);
          });
      })
      .catch((e) => {
        reject(e);
      });
  });
}, "Failed to delete some or all tracks.");
