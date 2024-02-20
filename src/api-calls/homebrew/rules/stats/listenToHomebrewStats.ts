import { onSnapshot, query, where } from "firebase/firestore";
import { StoredStat } from "types/homebrew/HomebrewRules.type";
import { getHomebrewStatsCollection } from "./_getRef";

export function listenToHomebrewStats(
  homebrewId: string,
  updateStats: (homebrewId: string, stats: Record<string, StoredStat>) => void,
  onError: (error: unknown) => void
) {
  return onSnapshot(
    query(
      getHomebrewStatsCollection(),
      where("collectionId", "==", homebrewId)
    ),
    (snapshot) => {
      const stats: Record<string, StoredStat> = {};
      snapshot.docs.forEach((doc) => {
        stats[doc.id] = doc.data();
      });
      updateStats(homebrewId, stats);
    },
    (error) => {
      console.error(error);
      onError(error);
    }
  );
}
