import { getHomebrewMoveCategoryCollection } from "./_getRef";
import { createHomebrewListenerFunction } from "api-calls/homebrew/homebrewListenerFunction";

export const listenToHomebrewMoveCategories = createHomebrewListenerFunction(
  getHomebrewMoveCategoryCollection()
);
