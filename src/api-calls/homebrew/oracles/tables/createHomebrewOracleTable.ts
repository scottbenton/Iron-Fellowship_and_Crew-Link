import { createApiFunction } from "api-calls/createApiFunction";
import { addDoc } from "firebase/firestore";
import { StoredOracleTable } from "types/homebrew/HomebrewOracles.type";
import { getHomebrewOracleTableCollection } from "./_getRef";

export const createHomebrewOracleTable = createApiFunction<
  { oracleTable: StoredOracleTable },
  void
>((params) => {
  const { oracleTable } = params;
  return new Promise((resolve, reject) => {
    addDoc(getHomebrewOracleTableCollection(), oracleTable)
      .then(() => resolve())
      .catch(reject);
  });
}, "Failed to create oracle table.");
