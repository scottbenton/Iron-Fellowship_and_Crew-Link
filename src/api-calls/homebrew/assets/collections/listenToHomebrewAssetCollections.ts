import { getHomebrewAssetCollectionCollection } from "./_getRef";
import { createHomebrewListenerFunction } from "api-calls/homebrew/homebrewListenerFunction";

export const listenToHomebrewAssetCollections = createHomebrewListenerFunction(
  getHomebrewAssetCollectionCollection()
);
