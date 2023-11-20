import { onSnapshot, query, Unsubscribe, where } from "firebase/firestore";
import {
  convertFromDatabase,
  getCampaignTracksCollection,
  getCharacterTracksCollection,
} from "./_getRef";
import { Track, TRACK_TYPES } from "types/Track.type";

export function listenToProgressTracks(
  campaignId: string | undefined,
  characterId: string | undefined,
  status: string,
  addOrUpdateTracks: (tracks: { [trackId: string]: Track }) => void,
  removeTrack: (
    trackId: string,
    trackType: TRACK_TYPES.FRAY | TRACK_TYPES.JOURNEY | TRACK_TYPES.VOW
  ) => void,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onError: (error: any) => void
): Unsubscribe | undefined {
  if (!campaignId && !characterId) {
    throw new Error("Must provide either a character or campaign ID.");
    return;
  }
  const q = query(
    campaignId
      ? getCampaignTracksCollection(campaignId)
      : getCharacterTracksCollection(characterId as string),
    where("status", "==", status)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const addOrUpdateChanges: { [trackId: string]: Track } = {};

      snapshot.docChanges().forEach((change) => {
        if (change.type === "removed") {
          removeTrack(
            change.doc.id,
            change.doc.data().type as
              | TRACK_TYPES.FRAY
              | TRACK_TYPES.JOURNEY
              | TRACK_TYPES.VOW
          );
        } else {
          addOrUpdateChanges[change.doc.id] = convertFromDatabase(
            change.doc.data()
          );
        }
      });
      addOrUpdateTracks(addOrUpdateChanges);
    },
    (error) => onError(error)
  );
}
