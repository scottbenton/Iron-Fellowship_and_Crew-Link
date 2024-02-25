import { getHomebrewOracleTableCollection } from "./_getRef";
import { createHomebrewListenerFunction } from "api-calls/homebrew/homebrewListenerFunction";

export const listenToHomebrewOracleTables = createHomebrewListenerFunction(
  getHomebrewOracleTableCollection()
);
