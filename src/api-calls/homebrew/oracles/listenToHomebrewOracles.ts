import { OracleTablesCollection } from "@datasworn/core";
import { getHomebrewOraclesDoc } from "./_getRef";
import { onSnapshot } from "firebase/firestore";

export function listenToHomebrewOracles(
  homebrewId: string,
  updateOracles: (
    homebrewId: string,
    oracles: Record<string, OracleTablesCollection>
  ) => void,
  onError: (error: unknown) => void,
  onLoaded: () => void
) {
  return onSnapshot(
    getHomebrewOraclesDoc(homebrewId),
    (snapshot) => {
      const doc = snapshot.data();
      if (doc) {
        updateOracles(homebrewId, doc);
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
