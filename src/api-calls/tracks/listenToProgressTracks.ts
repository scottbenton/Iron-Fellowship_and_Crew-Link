import { onSnapshot, Unsubscribe } from "firebase/firestore";
import { getCampaignTracksDoc, getCharacterTracksDoc } from "./_getRef";
import { StoredTrack, TRACK_TYPES } from "types/Track.type";

export function listenToProgressTracks(
  campaignId: string | undefined,
  characterId: string | undefined,
  onTracks: (
    vows: TrackWithId[],
    journeys: TrackWithId[],
    frays: TrackWithId[]
  ) => void,
  onError: (error: any) => void
): Unsubscribe | undefined {
  if (!campaignId && !characterId) {
    throw new Error("Must provide either a character or campaign ID.");
    return;
  }
  return onSnapshot(
    campaignId
      ? getCampaignTracksDoc(campaignId)
      : getCharacterTracksDoc(characterId as string),
    (snapshot) => {
      const data = snapshot.data();

      const vows = convertTrackMapToArray(data?.[TRACK_TYPES.VOW] ?? {});
      const journeys = convertTrackMapToArray(
        data?.[TRACK_TYPES.JOURNEY] ?? {}
      );
      const frays = convertTrackMapToArray(data?.[TRACK_TYPES.FRAY] ?? {});

      onTracks(vows, journeys, frays);
    },
    (error) => onError(error)
  );
}

export type TrackWithId = StoredTrack & { id: string };

export const convertTrackMapToArray = (trackMap: {
  [id: string]: StoredTrack;
}): TrackWithId[] => {
  return Object.keys(trackMap)
    .map((trackId) => {
      return {
        ...trackMap[trackId],
        id: trackId,
      };
    })
    .sort((t1, t2) => {
      const t1Millis = t1.createdTimestamp.toMillis();
      const t2Millis = t2.createdTimestamp.toMillis();
      if (t1Millis < t2Millis) {
        return -1;
      } else if (t1Millis > t2Millis) {
        return 1;
      } else {
        return 0;
      }
    });
};
