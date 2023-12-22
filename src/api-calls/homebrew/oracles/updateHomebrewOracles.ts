import { OracleTablesCollection } from "@datasworn/core";
import { createApiFunction } from "api-calls/createApiFunction";
import { PartialWithFieldValue, setDoc } from "firebase/firestore";
import { getHomebrewOraclesDoc } from "./_getRef";

export const updateHomebrewOracles = createApiFunction<
  {
    homebrewId: string;
    oracles: PartialWithFieldValue<Record<string, OracleTablesCollection>>;
  },
  void
>((params) => {
  const { homebrewId, oracles } = params;

  return new Promise((resolve, reject) => {
    setDoc(getHomebrewOraclesDoc(homebrewId), oracles, { merge: true })
      .then(() => {
        resolve();
      })
      .catch(reject);
  });
}, "Failed to update oracles.");
