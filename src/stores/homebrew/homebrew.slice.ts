import { CreateSliceType } from "stores/store.type";
import { HomebrewSlice } from "./homebrew.slice.type";
import { defaultHomebrewSlice } from "./homebrew.slice.default";
import { listenToHomebrewCollections } from "api-calls/homebrew/listenToHomebrewCollections";
import { getErrorMessage } from "functions/getErrorMessage";
import { createHomebrewExpansion } from "api-calls/homebrew/createHomebrewExpansion";
import { updateHomebrewExpansion } from "api-calls/homebrew/updateHomebrewExpansion";
import { deleteHomebrewExpansion } from "api-calls/homebrew/deleteHomebrewExpansion";
import { Unsubscribe } from "firebase/firestore";
import { listenToHomebrewStats } from "api-calls/homebrew/rules/stats/listenToHomebrewStats";
import { createHomebrewStat } from "api-calls/homebrew/rules/stats/createHomebrewStat";
import { updateHomebrewStat } from "api-calls/homebrew/rules/stats/updateHomebrewStat";
import { deleteHomebrewStat } from "api-calls/homebrew/rules/stats/deleteHomebrewStat";
import { createHomebrewConditionMeter } from "api-calls/homebrew/rules/conditionMeters/createHomebrewConditionMeter";
import { updateHomebrewConditionMeter } from "api-calls/homebrew/rules/conditionMeters/updateHomebrewStat";
import { deleteHomebrewConditionMeter } from "api-calls/homebrew/rules/conditionMeters/deleteHomebrewConditionMeter";
import { listenToHomebrewConditionMeters } from "api-calls/homebrew/rules/conditionMeters/listenToHomebrewConditionMeters";
import { createHomebrewImpactCategory } from "api-calls/homebrew/rules/impacts/createHomebrewImpactCategory";
import { updateHomebrewImpactCategory } from "api-calls/homebrew/rules/impacts/updateHomebrewImpactCategory";
import { deleteHomebrewImpactCategory } from "api-calls/homebrew/rules/impacts/deleteHomebrewImpactCategory";
import { listenToHomebrewImpacts } from "api-calls/homebrew/rules/impacts/listenToHomebrewImpacts";
import { updateHomebrewImpact } from "api-calls/homebrew/rules/impacts/updateHomebrewImpact";
import { deleteHomebrewImpact } from "api-calls/homebrew/rules/impacts/deleteHomebrewImpact";
import { createHomebrewLegacyTrack } from "api-calls/homebrew/rules/legacyTracks/createHomebrewLegacyTrack";
import { updateHomebrewLegacyTrack } from "api-calls/homebrew/rules/legacyTracks/updateHomebrewLegacyTrack";
import { deleteHomebrewLegacyTrack } from "api-calls/homebrew/rules/legacyTracks/deleteHomebrewLegacyTrack";
import { listenToHomebrewLegacyTracks } from "api-calls/homebrew/rules/legacyTracks/listenToHomebrewLegacyTracks";

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
        listenToHomebrewStats(
          homebrewId,
          (id, stats) => {
            set((store) => {
              store.homebrew.collections[homebrewId] = {
                ...(store.homebrew.collections[homebrewId] ?? {}),
                stats: {
                  data: stats,
                  loaded: true,
                },
              };
            });
          },
          (error) => {
            set((store) => {
              store.homebrew.collections[homebrewId] = {
                ...(store.homebrew.collections[homebrewId] ?? {}),
                stats: {
                  ...(store.homebrew.collections[homebrewId].stats ?? {}),
                  loaded: true,
                  error: getErrorMessage(error, "Failed to load stats"),
                },
              };
            });
          }
        )
      );
      unsubscribes.push(
        listenToHomebrewConditionMeters(
          homebrewId,
          (id, conditionMeters) => {
            set((store) => {
              store.homebrew.collections[homebrewId] = {
                ...(store.homebrew.collections[homebrewId] ?? {}),
                conditionMeters: {
                  data: conditionMeters,
                  loaded: true,
                },
              };
            });
          },
          (error) => {
            set((store) => {
              store.homebrew.collections[homebrewId] = {
                ...(store.homebrew.collections[homebrewId] ?? {}),
                stats: {
                  ...(store.homebrew.collections[homebrewId].conditionMeters ??
                    {}),
                  loaded: true,
                  error: getErrorMessage(
                    error,
                    "Failed to load condition meters."
                  ),
                },
              };
            });
          }
        )
      );
      unsubscribes.push(
        listenToHomebrewImpacts(
          homebrewId,
          (id, impactCategories) => {
            set((store) => {
              store.homebrew.collections[homebrewId] = {
                ...(store.homebrew.collections[homebrewId] ?? {}),
                impactCategories: {
                  data: impactCategories,
                  loaded: true,
                },
              };
            });
          },
          (error) => {
            set((store) => {
              store.homebrew.collections[homebrewId] = {
                ...(store.homebrew.collections[homebrewId] ?? {}),
                impactCategories: {
                  ...(store.homebrew.collections[homebrewId].impactCategories ??
                    {}),
                  loaded: true,
                  error: getErrorMessage(error, "Failed to load impacts."),
                },
              };
            });
          }
        )
      );
      unsubscribes.push(
        listenToHomebrewLegacyTracks(
          homebrewId,
          (id, legacyTracks) => {
            set((store) => {
              store.homebrew.collections[homebrewId] = {
                ...(store.homebrew.collections[homebrewId] ?? {}),
                legacyTracks: {
                  data: legacyTracks,
                  loaded: true,
                },
              };
            });
          },
          (error) => {
            set((store) => {
              store.homebrew.collections[homebrewId] = {
                ...(store.homebrew.collections[homebrewId] ?? {}),
                legacyTracks: {
                  ...(store.homebrew.collections[homebrewId].legacyTracks ??
                    {}),
                  loaded: true,
                  error: getErrorMessage(
                    error,
                    "Failed to load legacy tracks."
                  ),
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

  createStat: (stat) => {
    return createHomebrewStat({ stat });
  },
  updateStat: (statId, stat) => {
    return updateHomebrewStat({ statId, stat });
  },
  deleteStat: (statId) => {
    return deleteHomebrewStat({ statId });
  },

  createConditionMeter: (conditionMeter) => {
    return createHomebrewConditionMeter({ conditionMeter });
  },
  updateConditionMeter: (conditionMeterId, conditionMeter) => {
    return updateHomebrewConditionMeter({ conditionMeterId, conditionMeter });
  },
  deleteConditionMeter: (conditionMeterId) => {
    return deleteHomebrewConditionMeter({ conditionMeterId });
  },

  createImpactCategory: (impactCategory) => {
    return createHomebrewImpactCategory({ impactCategory });
  },
  updateImpactCategory: (impactCategoryId, impactCategory) => {
    return updateHomebrewImpactCategory({ impactCategoryId, impactCategory });
  },
  deleteImpactCategory: (impactCategoryId) => {
    return deleteHomebrewImpactCategory({ impactCategoryId });
  },
  updateImpact: (impactCategoryId, impact) => {
    return updateHomebrewImpact({ impactCategoryId, impact });
  },
  deleteImpact: (impactCategoryId, impactId) => {
    return deleteHomebrewImpact({ impactCategoryId, impactId });
  },

  createLegacyTrack: (legacyTrack) => {
    return createHomebrewLegacyTrack({ legacyTrack });
  },
  updateLegacyTrack: (legacyTrackId, legacyTrack) => {
    return updateHomebrewLegacyTrack({ legacyTrackId, legacyTrack });
  },
  deleteLegacyTrack: (legacyTrackId) => {
    return deleteHomebrewLegacyTrack({ legacyTrackId });
  },
});
