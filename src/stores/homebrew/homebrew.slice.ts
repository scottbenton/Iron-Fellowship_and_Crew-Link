import { CreateSliceType } from "stores/store.type";
import { HomebrewSlice } from "./homebrew.slice.type";
import { defaultHomebrewSlice } from "./homebrew.slice.default";
import { listenToHomebrewCollections } from "api-calls/homebrew/listenToHomebrewCollections";
import { getErrorMessage } from "functions/getErrorMessage";
import { createHomebrewExpansion } from "api-calls/homebrew/createHomebrewExpansion";
import { updateHomebrewExpansion } from "api-calls/homebrew/updateHomebrewExpansion";
import { deleteHomebrewExpansion } from "api-calls/homebrew/deleteHomebrewExpansion";
import { Unsubscribe } from "firebase/firestore";
import { listenToHomebrewRules } from "api-calls/homebrew/rules/listenToHomebrewRules";
import { updateExpansionRules } from "api-calls/homebrew/rules/updateExpansionRules";
import { updateHomebrewOracles } from "api-calls/homebrew/oracles/updateHomebrewOracles";
import { listenToHomebrewOracles } from "api-calls/homebrew/oracles/listenToHomebrewOracles";

export const createHomebrewSlice: CreateSliceType<HomebrewSlice> = (set) => ({
  ...defaultHomebrewSlice,
  subscribe: (uid) => {
    return listenToHomebrewCollections(
      uid,
      (collectionId, collection) => {
        set((store) => {
          store.homebrew.collections[collectionId] = {
            ...(store.homebrew.collections[collectionId] ?? {}),
            base: collection,
          };
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

  subscribeToHomebrewContent: (homebrewIds) => {
    const unsubscribes: Unsubscribe[] = [];
    homebrewIds.forEach((homebrewId) => {
      unsubscribes.push(
        listenToHomebrewRules(
          homebrewId,
          (id, rules) => {
            set((store) => {
              store.homebrew.collections[homebrewId] = {
                ...(store.homebrew.collections[homebrewId] ?? {}),
                rules: {
                  data: rules,
                  loaded: true,
                },
              };
            });
          },
          (error) => {
            set((store) => {
              store.homebrew.collections[homebrewId] = {
                ...(store.homebrew.collections[homebrewId] ?? {}),
                rules: {
                  ...(store.homebrew.collections[homebrewId].rules ?? {}),
                  loaded: true,
                  error: getErrorMessage(error, "Failed to load rules"),
                },
              };
            });
          },
          () => {
            set((store) => {
              store.homebrew.collections[homebrewId] = {
                ...(store.homebrew.collections[homebrewId] ?? {}),
                rules: {
                  ...(store.homebrew.collections[homebrewId].rules ?? {}),
                  loaded: true,
                },
              };
            });
          }
        )
      );

      unsubscribes.push(
        listenToHomebrewOracles(
          homebrewId,
          (id, oracles) => {
            set((store) => {
              store.homebrew.collections[homebrewId] = {
                ...(store.homebrew.collections[homebrewId] ?? {}),
                oracles: {
                  data: oracles,
                  loaded: true,
                },
              };
            });
          },
          (error) => {
            set((store) => {
              store.homebrew.collections[homebrewId] = {
                ...(store.homebrew.collections[homebrewId] ?? {}),
                oracles: {
                  ...(store.homebrew.collections[homebrewId].oracles ?? {}),
                  loaded: true,
                  error: getErrorMessage(error, "Failed to load oracles"),
                },
              };
            });
          },
          () => {
            set((store) => {
              store.homebrew.collections[homebrewId] = {
                ...(store.homebrew.collections[homebrewId] ?? {}),
                oracles: {
                  ...(store.homebrew.collections[homebrewId].oracles ?? {}),
                  loaded: true,
                },
              };
            });
          }
        )
      );
    });

    return () => {
      unsubscribes.forEach((unsubscribe) => unsubscribe());
    };
  },

  createExpansion: (expansion) => {
    return createHomebrewExpansion(expansion);
  },
  updateExpansion: (id, expansion) => {
    return updateHomebrewExpansion({ id, expansion });
  },
  deleteExpansion: (id) => {
    return deleteHomebrewExpansion({ id });
  },

  updateExpansionRules: (homebrewId, rules) => {
    return updateExpansionRules({ homebrewId, rules });
  },
  updateExpansionOracles: (homebrewId, oracles) => {
    return updateHomebrewOracles({ homebrewId, oracles });
  },
});
