import { onSnapshot } from "firebase/firestore";
import { StoredRules } from "types/HomebrewCollection.type";
import { getHomebrewRulesDoc } from "./_getRef";

export function listenToHomebrewRules(
  homebrewId: string,
  updateRules: (collectionId: string, rules: Partial<StoredRules>) => void,
  onError: (error: unknown) => void,
  onLoaded: () => void
) {
  return onSnapshot(
    getHomebrewRulesDoc(homebrewId),
    (snapshot) => {
      const doc = snapshot.data();
      if (doc) {
        updateRules(homebrewId, doc);
      } else {
        onLoaded();
      }
    },
    (error) => {
      console.error(error);
      onError(error);
    }
  );
}
