import { onSnapshot, Unsubscribe } from "firebase/firestore";
import {
  convertFromDatabase,
  getCampaignTracksCollection,
  getCharacterTracksCollection,
} from "./_getRef";
import { Track } from "types/Track.type";

export function listenToProgressTracks(
  campaignId: string | undefined,
  characterId: string | undefined,
  onTracks: (tracks: { [trackId: string]: Track }) => void,
  onError: (error: any) => void
): Unsubscribe | undefined {
  if (!campaignId && !characterId) {
    throw new Error("Must provide either a character or campaign ID.");
    return;
  }
  return onSnapshot(
    campaignId
      ? getCampaignTracksCollection(campaignId)
      : getCharacterTracksCollection(characterId as string),
    (snapshot) => {
      const tracks: { [trackId: string]: Track } = {};

      snapshot.docs.forEach((doc) => {
        tracks[doc.id] = convertFromDatabase(doc.data());
      });

      onTracks(tracks);
    },
    (error) => onError(error)
  );
}
