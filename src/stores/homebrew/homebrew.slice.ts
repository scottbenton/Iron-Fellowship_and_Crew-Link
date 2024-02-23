import { CreateSliceType } from "stores/store.type";
import { HomebrewEntry, HomebrewSlice } from "./homebrew.slice.type";
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
import { listenToHomebrewOracleCollections } from "api-calls/homebrew/oracles/collections/listenToHomebrewOracleCollections";
import { listenToHomebrewOracleTables } from "api-calls/homebrew/oracles/tables/listenToHomebrewOracleTables";
import { HomebrewListenerFunction } from "api-calls/homebrew/homebrewListenerFunction";
import { createHomebrewOracleCollection } from "api-calls/homebrew/oracles/collections/createHomebrewOracleCollection";
import { updateHomebrewOracleCollection } from "api-calls/homebrew/oracles/collections/updateHomebrewOracleCollection";
import { deleteHomebrewOracleTable } from "api-calls/homebrew/oracles/tables/deleteHomebrewOracleTable";
import { deleteHomebrewOracleCollection } from "api-calls/homebrew/oracles/collections/deleteHomebrewOracleCollection";
import { createHomebrewOracleTable } from "api-calls/homebrew/oracles/tables/createHomebrewOracleTable";
import { updateHomebrewOracleTable } from "api-calls/homebrew/oracles/tables/updateHomebrewOracleTable";
import { convertStoredOraclesToCollections } from "functions/convertStoredOraclesToCollections";

enum ListenerRefreshes {
  Oracles,
}

type ListenerConfig<T = { collectionId: string }> = {
  listenerFunction: HomebrewListenerFunction<T>;
  sliceKey: keyof HomebrewEntry;
  errorMessage: string;
  refreshes?: ListenerRefreshes;
};

export const createHomebrewSlice: CreateSliceType<HomebrewSlice> = (
  set,
  getState
) => ({
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
    const listenerConfigs: ListenerConfig[] = [
      {
        listenerFunction: listenToHomebrewStats,
        errorMessage: "Failed to load homebrew stats",
        sliceKey: "stats",
      },
      {
        listenerFunction: listenToHomebrewConditionMeters,
        errorMessage: "Failed to load homebrew condition meters",
        sliceKey: "conditionMeters",
      },
      {
        listenerFunction: listenToHomebrewImpacts,
        errorMessage: "Failed to load homebrew impacts",
        sliceKey: "impactCategories",
      },
      {
        listenerFunction: listenToHomebrewLegacyTracks,
        errorMessage: "Failed to load legacy tracks",
        sliceKey: "legacyTracks",
      },
      {
        listenerFunction: listenToHomebrewOracleCollections,
        errorMessage: "Failed to load oracle collections",
        sliceKey: "oracleCollections",
        refreshes: ListenerRefreshes.Oracles,
      },
      {
        listenerFunction: listenToHomebrewOracleTables,
        errorMessage: "Failed to load oracle tables",
        sliceKey: "oracleTables",
        refreshes: ListenerRefreshes.Oracles,
      },
    ];

    const unsubscribes: Unsubscribe[] = [];
    homebrewIds.forEach((homebrewId) => {
      listenerConfigs.forEach((config) => {
        unsubscribes.push(
          config.listenerFunction(
            homebrewId,
            (data) => {
              set((store) => {
                store.homebrew.collections[homebrewId] = {
                  ...store.homebrew.collections[homebrewId],
                  [config.sliceKey]: {
                    data,
                    loaded: true,
                  },
                };
              });
              if (config.refreshes === ListenerRefreshes.Oracles) {
                getState().homebrew.updateDataswornOracles(homebrewId);
              }
            },
            () => {
              set((store) => {
                store.homebrew.collections[homebrewId] = {
                  ...store.homebrew.collections[homebrewId],
                  [config.sliceKey]: {
                    ...(store.homebrew.collections[homebrewId][
                      config.sliceKey
                    ] ?? {}),
                    error: config.errorMessage,
                    loaded: true,
                  },
                };
              });
            }
          )
        );
      });
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

  createOracleCollection: (oracleCollection) => {
    return createHomebrewOracleCollection({ oracleCollection });
  },
  updateOracleCollection: (oracleCollectionId, oracleCollection) => {
    return updateHomebrewOracleCollection({
      oracleCollectionId,
      oracleCollection,
    });
  },
  deleteOracleCollection: (homebrewId, oracleCollectionId) => {
    const oracleTables =
      getState().homebrew.collections[homebrewId]?.oracleTables?.data ?? {};
    const filteredOracleTableIds = Object.keys(oracleTables).filter(
      (oracleId) =>
        oracleTables[oracleId]?.oracleCollectionId === oracleCollectionId
    );

    const promises: Promise<void>[] = [];
    filteredOracleTableIds.forEach((oracleTableId) => {
      promises.push(deleteHomebrewOracleTable({ oracleTableId }));
    });

    return new Promise((resolve, reject) => {
      Promise.all(promises)
        .then(() => {
          deleteHomebrewOracleCollection({
            oracleCollectionId,
          })
            .then(() => {
              resolve();
            })
            .catch(reject);
        })
        .catch(reject);
    });
  },

  createOracleTable: (oracleTable) => {
    return createHomebrewOracleTable({ oracleTable });
  },
  updateOracleTable: (oracleTableId, oracleTable) => {
    return updateHomebrewOracleTable({ oracleTableId, oracleTable });
  },
  deleteOracleTable: (oracleTableId) => {
    return deleteHomebrewOracleTable({ oracleTableId });
  },

  updateDataswornOracles: (homebrewId) => {
    const homebrewCollection = getState().homebrew.collections[homebrewId];

    const oracles = homebrewCollection?.oracleCollections?.data;
    const oracleTables = homebrewCollection?.oracleTables?.data;

    if (oracles && oracleTables) {
      const collections = convertStoredOraclesToCollections(
        homebrewId,
        oracles,
        oracleTables
      );
      set((store) => {
        store.homebrew.collections[homebrewId].dataswornOracles = collections;
      });
    }
  },
});
