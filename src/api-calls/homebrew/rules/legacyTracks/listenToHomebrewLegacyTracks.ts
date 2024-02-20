import { onSnapshot, query, where } from "firebase/firestore";
import { StoredLegacyTrack } from "types/homebrew/HomebrewRules.type";
import { getHomebrewLegacyTrackCollection } from "./_getRef";

export function listenToHomebrewLegacyTracks(
  homebrewId: string,
  updateLegacyTracks: (
    homebrewId: string,
    legacyTracks: Record<string, StoredLegacyTrack>
  ) => void,
  onError: (error: unknown) => void
) {
  return onSnapshot(
    query(
      getHomebrewLegacyTrackCollection(),
      where("collectionId", "==", homebrewId)
    ),
    (snapshot) => {
      const legacyTracks: Record<string, StoredLegacyTrack> = {};
      snapshot.docs.forEach((doc) => {
        legacyTracks[doc.id] = doc.data();
      });
      updateLegacyTracks(homebrewId, legacyTracks);
    },
    (error) => {
      console.error(error);
      onError(error);
    }
  );
}
