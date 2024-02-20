import { onSnapshot, query, where } from "firebase/firestore";
import { StoredImpactCategory } from "types/homebrew/HomebrewRules.type";
import { getHomebrewImpactsCollection } from "./_getRef";

export function listenToHomebrewImpacts(
  homebrewId: string,
  updateImpacts: (
    homebrewId: string,
    impacts: Record<string, StoredImpactCategory>
  ) => void,
  onError: (error: unknown) => void
) {
  return onSnapshot(
    query(
      getHomebrewImpactsCollection(),
      where("collectionId", "==", homebrewId)
    ),
    (snapshot) => {
      const impactCategories: Record<string, StoredImpactCategory> = {};
      snapshot.docs.forEach((doc) => {
        impactCategories[doc.id] = doc.data();
      });
      updateImpacts(homebrewId, impactCategories);
    },
    (error) => {
      console.error(error);
      onError(error);
    }
  );
}
