import { createApiFunction } from "api-calls/createApiFunction";
import { PartialWithFieldValue, updateDoc } from "firebase/firestore";
import { StoredOracleCollection } from "types/homebrew/HomebrewOracles.type";
import { getHomebrewOracleCollectionDoc } from "./_getRef";

export const updateHomebrewOracleCollection = createApiFunction<
  {
    oracleCollectionId: string;
    oracleCollection: PartialWithFieldValue<StoredOracleCollection>;
  },
  void
>((params) => {
  const { oracleCollectionId, oracleCollection } = params;
  return new Promise((resolve, reject) => {
    updateDoc(
      getHomebrewOracleCollectionDoc(oracleCollectionId),
      oracleCollection
    )
      .then(() => resolve())
      .catch(reject);
  });
}, "Failed to update oracle collection.");
