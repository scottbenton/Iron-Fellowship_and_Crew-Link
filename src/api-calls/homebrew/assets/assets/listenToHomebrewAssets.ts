import { getHomebrewAssetCollection } from "./_getRef";
import { createHomebrewListenerFunction } from "api-calls/homebrew/homebrewListenerFunction";

export const listenToHomebrewAssets = createHomebrewListenerFunction(
  getHomebrewAssetCollection()
);
