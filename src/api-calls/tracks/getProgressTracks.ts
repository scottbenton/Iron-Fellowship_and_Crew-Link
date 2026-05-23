import { getDocs } from "firebase/firestore";
import {
  getCampaignTracksCollection,
  getCharacterTracksCollection,
} from "./_getRef";
import { createApiFunction } from "api-calls/createApiFunction";
import { Track } from "types/Track.type";

interface GetProgressTracksParams {
  campaignId?: string;
  characterId?: string;
  status?: string;
}

export const getProgressTracks = createApiFunction<GetProgressTracksParams, Track[]>(async (params) => {
  const { campaignId, characterId, status } = params;

  if (!campaignId && !characterId) {
    throw new Error("Must provide either a character or a campaign ID");
  }

  const collectionRef = campaignId
    ? getCampaignTracksCollection(campaignId)
    : getCharacterTracksCollection(characterId as string);

  const querySnapshot = await getDocs(collectionRef);
  return querySnapshot.docs
    .map(doc => doc.data() as Track)
    .filter(track => !status || track.status === status);
}, "Failed to fetch progress tracks.");
