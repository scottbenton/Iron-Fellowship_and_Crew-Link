import { CreateSliceType } from "stores/store.type";
import { HomebrewSlice } from "./homebrew.slice.type";
import { defaultHomebrewSlice } from "./homebrew.slice.default";
import { listenToHomebrewCollections } from "api-calls/homebrew/listenToHomebrewCollections";
import { getErrorMessage } from "functions/getErrorMessage";
import { createHomebrewExpansion } from "api-calls/homebrew/createHomebrewExpansion";

export const createHomebrewSlice: CreateSliceType<HomebrewSlice> = (set) => ({
  ...defaultHomebrewSlice,
  subscribe: (uid) => {
    return listenToHomebrewCollections(
      uid,
      (collectionId, collection) => {
        set((store) => {
          store.homebrew.collections[collectionId] = collection;
          store.homebrew.loading = false;
          store.homebrew.error = undefined;
        });
      },
      (collectionId) => {
        set((store) => {
          delete store.homebrew.collections[collectionId];
          store.homebrew.loading = false;
          store.homebrew.error = undefined;
        });
      },
      (error) => {
        set((store) => {
          store.homebrew.loading = false;
          store.homebrew.error = getErrorMessage(
            error,
            "Your homebrew collections failed to load."
          );
        });
      },
      () => {
        set((store) => {
          store.homebrew.loading = false;
        });
      }
    );
  },
  createExpansion: (expansion) => {
    return createHomebrewExpansion(expansion);
  },
});
