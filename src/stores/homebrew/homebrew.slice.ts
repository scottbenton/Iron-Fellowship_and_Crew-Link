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
import { listenToHomebrewMoveCategories } from "api-calls/homebrew/moves/collections/listenToHomebrewMoveCategories";
import { listenToHomebrewMoves } from "api-calls/homebrew/moves/moves/listenToHomebrewMoves";
import { createHomebrewMoveCategory } from "api-calls/homebrew/moves/collections/createHomebrewMoveCategory";
import { updateHomebrewMoveCategory } from "api-calls/homebrew/moves/collections/updateHomebrewMoveCategory";
import { deleteHomebrewMove } from "api-calls/homebrew/moves/moves/deleteHomebrewMove";
import { deleteHomebrewMoveCategory } from "api-calls/homebrew/moves/collections/deleteHomebrewMoveCategory";
import { createHomebrewMove } from "api-calls/homebrew/moves/moves/createHomebrewMove";
import { updateHomebrewMove } from "api-calls/homebrew/moves/moves/updateHomebrewMove";
import { convertStoredMovesToCategories } from "functions/convertStoredMovesToCategories";

enum ListenerRefreshes {
  Oracles,
  Moves,
  Stats,
  ConditionMeters,
  SpecialTracks,
  Impacts,
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
    getState().rules.setExpansionIds(homebrewIds);
    const listenerConfigs: ListenerConfig[] = [
      {
        listenerFunction: listenToHomebrewStats,
        errorMessage: "Failed to load homebrew stats",
        sliceKey: "stats",
        refreshes: ListenerRefreshes.Stats,
      },
      {
        listenerFunction: listenToHomebrewConditionMeters,
        errorMessage: "Failed to load homebrew condition meters",
        sliceKey: "conditionMeters",
        refreshes: ListenerRefreshes.ConditionMeters,
      },
      {
        listenerFunction: listenToHomebrewImpacts,
        errorMessage: "Failed to load homebrew impacts",
        sliceKey: "impactCategories",
        refreshes: ListenerRefreshes.Impacts,
      },
      {
        listenerFunction: listenToHomebrewLegacyTracks,
        errorMessage: "Failed to load legacy tracks",
        sliceKey: "legacyTracks",
        refreshes: ListenerRefreshes.SpecialTracks,
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
      {
        listenerFunction: listenToHomebrewMoveCategories,
        errorMessage: "Failed to load move categories",
        sliceKey: "moveCategories",
        refreshes: ListenerRefreshes.Moves,
      },
      {
        listenerFunction: listenToHomebrewMoves,
        errorMessage: "Failed to load moves",
        sliceKey: "moves",
        refreshes: ListenerRefreshes.Moves,
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
              switch (config.refreshes) {
                case ListenerRefreshes.Oracles:
                  getState().homebrew.updateDataswornOracles(homebrewId);
                  break;
                case ListenerRefreshes.Moves:
                  getState().homebrew.updateDataswornMoves(homebrewId);
                  break;
                case ListenerRefreshes.Stats:
                  getState().rules.rebuildStats();
                  break;
                case ListenerRefreshes.ConditionMeters:
                  getState().rules.rebuildConditionMeters();
                  break;
                case ListenerRefreshes.SpecialTracks:
                  getState().rules.rebuildSpecialTracks();
                  break;
                case ListenerRefreshes.Impacts:
                  getState().rules.rebuildImpacts();
                  break;
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
      getState().rules.setExpansionIds([]);
      unsubscribes.forEach((unsubscribe) => unsubscribe());
      getState().rules.rebuildOracles();
      getState().rules.rebuildMoves();
      getState().rules.rebuildStats();
      getState().rules.rebuildConditionMeters();
      getState().rules.rebuildSpecialTracks();
      getState().rules.rebuildImpacts();
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

    const subCollections =
      getState().homebrew.collections[homebrewId]?.oracleCollections?.data ??
      {};
    const filteredOracleSubCollectionIds = Object.keys(subCollections).filter(
      (oracleId) => {
        return (
          subCollections[oracleId]?.parentOracleCollectionId ===
          oracleCollectionId
        );
      }
    );

    const promises: Promise<void>[] = [];
    filteredOracleTableIds.forEach((oracleTableId) => {
      promises.push(deleteHomebrewOracleTable({ oracleTableId }));
    });
    filteredOracleSubCollectionIds.forEach((subCollectionId) => {
      promises.push(
        getState().homebrew.deleteOracleCollection(homebrewId, subCollectionId)
      );
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
      getState().rules.rebuildOracles();
    }
  },

  createMoveCategory: (moveCategory) => {
    return createHomebrewMoveCategory({ moveCategory });
  },
  updateMoveCategory: (moveCategoryId, moveCategory) => {
    return updateHomebrewMoveCategory({
      moveCategoryId,
      moveCategory,
    });
  },
  deleteMoveCategory: (homebrewId, moveCategoryId) => {
    const moves =
      getState().homebrew.collections[homebrewId]?.moves?.data ?? {};
    const filteredMoveIds = Object.keys(moves).filter(
      (moveId) => moves[moveId]?.categoryId === moveCategoryId
    );

    const promises: Promise<void>[] = [];
    filteredMoveIds.forEach((moveId) => {
      promises.push(getState().homebrew.deleteMove(moveId));
    });

    return new Promise((resolve, reject) => {
      Promise.all(promises)
        .then(() => {
          deleteHomebrewMoveCategory({
            moveCategoryId,
          })
            .then(() => {
              resolve();
            })
            .catch(reject);
        })
        .catch(reject);
    });
  },

  createMove: (move) => {
    return createHomebrewMove({ move });
  },
  updateMove: (moveId, move) => {
    return updateHomebrewMove({ moveId, move });
  },
  deleteMove: (moveId) => {
    return deleteHomebrewMove({ moveId });
  },

  updateDataswornMoves: (homebrewId) => {
    const homebrewCollection = getState().homebrew.collections[homebrewId];

    const moveCategories = homebrewCollection?.moveCategories?.data;
    const moves = homebrewCollection?.moves?.data;

    if (moveCategories && moves) {
      const categories = convertStoredMovesToCategories(
        homebrewId,
        moveCategories,
        moves
      );
      set((store) => {
        store.homebrew.collections[homebrewId].dataswornMoves = categories;
      });
      getState().rules.rebuildMoves();
    }
  },
});
