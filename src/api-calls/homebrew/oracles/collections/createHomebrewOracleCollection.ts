import { createApiFunction } from "api-calls/createApiFunction";
import { addDoc } from "firebase/firestore";
import { StoredOracleCollection } from "types/homebrew/HomebrewOracles.type";
import { getHomebrewOracleCollectionCollection } from "./_getRef";

export const createHomebrewOracleCollection = createApiFunction<
  { oracleCollection: StoredOracleCollection },
  void
>((params) => {
  const { oracleCollection } = params;
  return new Promise((resolve, reject) => {
    addDoc(getHomebrewOracleCollectionCollection(), oracleCollection)
      .then(() => resolve())
      .catch(reject);
  });
}, "Failed to create oracle collection.");
