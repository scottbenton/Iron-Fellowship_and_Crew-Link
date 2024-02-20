import { onSnapshot, query, where } from "firebase/firestore";
import { StoredConditionMeter } from "types/homebrew/HomebrewRules.type";
import { getHomebrewConditionMeterCollection } from "./_getRef";

export function listenToHomebrewConditionMeters(
  homebrewId: string,
  updateConditionMeters: (
    homebrewId: string,
    conditionMeters: Record<string, StoredConditionMeter>
  ) => void,
  onError: (error: unknown) => void
) {
  return onSnapshot(
    query(
      getHomebrewConditionMeterCollection(),
      where("collectionId", "==", homebrewId)
    ),
    (snapshot) => {
      const conditionMeters: Record<string, StoredConditionMeter> = {};
      snapshot.docs.forEach((doc) => {
        conditionMeters[doc.id] = doc.data();
      });
      updateConditionMeters(homebrewId, conditionMeters);
    },
    (error) => {
      console.error(error);
      onError(error);
    }
  );
}
