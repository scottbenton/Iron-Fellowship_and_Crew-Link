import { createApiFunction } from "api-calls/createApiFunction";
import { FieldValue, updateDoc } from "firebase/firestore";
import { getHomebrewOraclesDoc } from "./_getRef";
import { OracleTablesCollection } from "@datasworn/core";

export const updateHomebrewOracles = createApiFunction<
  {
    homebrewId: string;
    oracles: Record<string, OracleTablesCollection | FieldValue>;
  },
  void
>((params) => {
  const { homebrewId, oracles } = params;

  return new Promise((resolve, reject) => {
    updateDoc(getHomebrewOraclesDoc(homebrewId), oracles)
      .then(() => {
        resolve();
      })
      .catch(reject);
  });
}, "Failed to update oracles.");
