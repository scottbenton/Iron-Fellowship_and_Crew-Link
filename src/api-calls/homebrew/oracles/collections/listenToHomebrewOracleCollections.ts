import { getHomebrewOracleCollectionCollection } from "./_getRef";
import { createHomebrewListenerFunction } from "api-calls/homebrew/homebrewListenerFunction";

export const listenToHomebrewOracleCollections = createHomebrewListenerFunction(
  getHomebrewOracleCollectionCollection()
);
