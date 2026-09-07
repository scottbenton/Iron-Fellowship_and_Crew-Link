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
import { listenToHomebrewMoveCategories } from "api-calls/homebrew/moves/categories/listenToHomebrewMoveCategories";
import { listenToHomebrewMoves } from "api-calls/homebrew/moves/moves/listenToHomebrewMoves";
import { createHomebrewMoveCategory } from "api-calls/homebrew/moves/categories/createHomebrewMoveCategory";
import { updateHomebrewMoveCategory } from "api-calls/homebrew/moves/categories/updateHomebrewMoveCategory";
import { deleteHomebrewMove } from "api-calls/homebrew/moves/moves/deleteHomebrewMove";
import { deleteHomebrewMoveCategory } from "api-calls/homebrew/moves/categories/deleteHomebrewMoveCategory";
import { createHomebrewMove } from "api-calls/homebrew/moves/moves/createHomebrewMove";
import { updateHomebrewMove } from "api-calls/homebrew/moves/moves/updateHomebrewMove";
import { convertStoredMovesToCategories } from "functions/convertStoredMovesToCategories";
import { findIncludedExpansionConfig } from "data/rulesets";
import { createHomebrewAssetCollection } from "api-calls/homebrew/assets/collections/createHomebrewAssetCollection";
import { updateHomebrewAssetCollection } from "api-calls/homebrew/assets/collections/updateHomebrewAssetCollection";
import { deleteHomebrewAsset } from "api-calls/homebrew/assets/assets/deleteHomebrewAsset";
import { deleteHomebrewAssetCollection } from "api-calls/homebrew/assets/collections/deleteHomebrewAssetCollection";
import { createHomebrewAsset } from "api-calls/homebrew/assets/assets/createHomebrewAsset";
import { updateHomebrewAsset } from "api-calls/homebrew/assets/assets/updateHomebrewAsset";
import { listenToHomebrewAssetCollections } from "api-calls/homebrew/assets/collections/listenToHomebrewAssetCollections";
import { listenToHomebrewAssets } from "api-calls/homebrew/assets/assets/listenToHomebrewAssets";
import { convertHomebrewAssetDocumentsToCollections } from "functions/convertHomebrewAssetDocumentsToCollections";
import { listenToHomebrewNonLinearMeters } from "api-calls/homebrew/rules/nonLinearMeters/listenToHomebrewNonLinearMeters";
import { createHomebrewNonLinearMeter } from "api-calls/homebrew/rules/nonLinearMeters/createHomebrewNonLinearMeter";
import { updateHomebrewNonLinearMeter } from "api-calls/homebrew/rules/nonLinearMeters/updateHomebrewNonLinearMeter";
import { deleteHomebrewNonLinearMeter } from "api-calls/homebrew/rules/nonLinearMeters/deleteHomebrewNonLinearMeter";
import { listenToHomebrewCollection } from "api-calls/homebrew/listenToHomebrewCollection";
import { Datasworn } from "@datasworn-community/core";
import { convertHomebrewToRules } from "functions/convertHomebrewToRules";

enum ListenerRefreshes {
  Oracles,
  Moves,
  Stats,
  ConditionMeters,
  NonLinearConditionMeters,
  SpecialTracks,
  Impacts,
  Assets,
}

type ListenerConfig<T = { collectionId: string }> = {
  listenerFunction: HomebrewListenerFunction<T>;
  sliceKey: keyof HomebrewEntry;
  errorMessage: string;
  refreshes?: ListenerRefreshes;
};

export const createHomebrewSlice: CreateSliceType<HomebrewSlice> = (
  set,
  getState,
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

          store.homebrew.sortedHomebrewCollectionIds = Object.keys(
            store.homebrew.collections,
          )
            .filter((key) => {
              return (
                store.homebrew.collections[key]?.base?.editors.includes(uid) ||
                store.homebrew.collections[key]?.base.viewers?.includes(uid)
              );
            })
            .sort((k1, k2) =>
              (store.homebrew.collections[k1]?.base?.title ?? "").localeCompare(
                store.homebrew.collections[k2]?.base?.title ?? "",
              ),
            );

          store.homebrew.loading = false;
          store.homebrew.error = undefined;
        });
      },
      (collectionId) => {
        set((store) => {
          delete store.homebrew.collections[collectionId];
          store.homebrew.loading = false;
          store.homebrew.error = undefined;
          store.homebrew.sortedHomebrewCollectionIds = Object.keys(
            store.homebrew.collections,
          )
            .filter((key) => {
              const shouldKeep =
                store.homebrew.collections[key]?.base?.editors.includes(
                  store.auth.uid,
                ) ||
                store.homebrew.collections[key]?.base.viewers?.includes(
                  store.auth.uid,
                );
              return shouldKeep;
            })
            .sort((k1, k2) =>
              (store.homebrew.collections[k1]?.base?.title ?? "").localeCompare(
                store.homebrew.collections[k2]?.base?.title ?? "",
              ),
            );
        });
      },
      (error) => {
        set((store) => {
          store.homebrew.loading = false;
          store.homebrew.error = getErrorMessage(
            error,
            "Your homebrew collections failed to load.",
          );
        });
      },
      () => {
        set((store) => {
          store.homebrew.loading = false;
        });
      },
    );
  },

  subscribeToHomebrewContent: (homebrewIds) => {
    getState().rules.setExpansionIds(homebrewIds);
    const defaultHomebrewIds = homebrewIds.filter(
      (homebrewId) => findIncludedExpansionConfig(homebrewId),
    );

    if (defaultHomebrewIds.length > 0) {
      getState().rules.rebuildRules();
    }

    const filteredHomebrewIds = homebrewIds.filter(
      (homebrewId) => !findIncludedExpansionConfig(homebrewId),
    );

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
        listenerFunction: listenToHomebrewNonLinearMeters,
        errorMessage: "Failed to load homebrew non-linear meters",
        sliceKey: "nonLinearMeters",
        refreshes: ListenerRefreshes.NonLinearConditionMeters,
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
      {
        listenerFunction: listenToHomebrewAssetCollections,
        errorMessage: "Failed to load asset collections",
        sliceKey: "assetCollections",
        refreshes: ListenerRefreshes.Assets,
      },
      {
        listenerFunction: listenToHomebrewAssets,
        errorMessage: "Failed to load assets",
        sliceKey: "assets",
        refreshes: ListenerRefreshes.Assets,
      },
    ];

    const unsubscribes: Unsubscribe[] = [];
    filteredHomebrewIds.forEach((homebrewId) => {
      unsubscribes.push(
        listenToHomebrewCollection(
          homebrewId,
          (data) => {
            set((store) => {
              store.homebrew.loading = false;
              store.homebrew.collections[homebrewId] = {
                ...store.homebrew.collections[homebrewId],
                base: data,
              };
              store.homebrew.sortedHomebrewCollectionIds = Object.keys(
                store.homebrew.collections,
              )
                .filter((key) => {
                  const shouldKeep =
                    store.homebrew.collections[key]?.base?.editors.includes(
                      store.auth.uid,
                    ) ||
                    store.homebrew.collections[key]?.base.viewers?.includes(
                      store.auth.uid,
                    );
                  return shouldKeep;
                })
                .sort((k1, k2) =>
                  (
                    store.homebrew.collections[k1]?.base?.title ?? ""
                  ).localeCompare(
                    store.homebrew.collections[k2]?.base?.title ?? "",
                  ),
                );
            });
            getState().homebrew.updateExpansionIfLoaded(homebrewId);
          },
          (error) => {
            set((store) => {
              store.homebrew.loading = false;
              store.homebrew.error = getErrorMessage(
                error,
                "Failed to load homebrew information",
              );
            });
            console.error(error);
          },
          () => {
            set((store) => {
              store.homebrew.loading = false;
            });
          },
        ),
      );
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
              if (
                config.refreshes === ListenerRefreshes.NonLinearConditionMeters
              ) {
                getState().rules.rebuildNonLinearMeters();
              } else {
                getState().homebrew.updateExpansionIfLoaded(homebrewId);
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
            },
          ),
        );
      });
    });

    return () => {
      getState().rules.setExpansionIds([]);
      unsubscribes.forEach((unsubscribe) => unsubscribe());
      getState().rules.rebuildRules();
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

  createNonLinearMeter: (meter) => {
    return createHomebrewNonLinearMeter({ meter });
  },
  updateNonLinearMeter: (meterId, meter) => {
    return updateHomebrewNonLinearMeter({ meterId, meter });
  },
  deleteNonLinearMeter: (meterId) => {
    return deleteHomebrewNonLinearMeter({ meterId });
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
        oracleTables[oracleId]?.oracleCollectionId === oracleCollectionId,
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
      },
    );

    const promises: Promise<void>[] = [];
    filteredOracleTableIds.forEach((oracleTableId) => {
      promises.push(deleteHomebrewOracleTable({ oracleTableId }));
    });
    filteredOracleSubCollectionIds.forEach((subCollectionId) => {
      promises.push(
        getState().homebrew.deleteOracleCollection(homebrewId, subCollectionId),
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
      (moveId) => moves[moveId]?.categoryId === moveCategoryId,
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

  createAssetCollection: (assetCollection) => {
    return createHomebrewAssetCollection({ assetCollection });
  },
  updateAssetCollection: (assetCollectionId, assetCollection) => {
    return updateHomebrewAssetCollection({
      assetCollectionId,
      assetCollection,
    });
  },
  deleteAssetCollection: (homebrewId, assetCollectionId) => {
    const assets =
      getState().homebrew.collections[homebrewId]?.assets?.data ?? {};
    const filteredAssetIds = Object.keys(assets).filter(
      (assetId) => assets[assetId]?.categoryKey === assetCollectionId,
    );

    const promises: Promise<void>[] = [];
    filteredAssetIds.forEach((assetId) => {
      promises.push(getState().homebrew.deleteAsset(assetId));
    });

    return new Promise((resolve, reject) => {
      Promise.all(promises)
        .then(() => {
          deleteHomebrewAssetCollection({
            assetCollectionId,
          })
            .then(() => {
              resolve();
            })
            .catch(reject);
        })
        .catch(reject);
    });
  },
  createAsset: (asset) => {
    return createHomebrewAsset({ asset });
  },
  updateAsset: (assetId, asset) => {
    return updateHomebrewAsset({ assetId, asset });
  },
  deleteAsset: (assetId) => {
    return deleteHomebrewAsset({ assetId });
  },

  updateExpansionIfLoaded: (expansionId) => {
    const expansion = getState().homebrew.collections[expansionId];

    if (
      expansion &&
      expansion.base &&
      expansion.stats?.loaded &&
      expansion.conditionMeters?.loaded &&
      expansion.impactCategories?.loaded &&
      expansion.legacyTracks?.loaded &&
      expansion.oracleCollections?.loaded &&
      expansion.oracleTables?.loaded &&
      expansion.moveCategories?.loaded &&
      expansion.moves?.loaded &&
      expansion.assetCollections?.loaded &&
      expansion.assets?.loaded
    ) {
      const dataswornExpansion: Datasworn.Expansion = {
        _id: expansionId,
        title: expansion.base.title,
        description: expansion.base.description,
        type: "expansion",
        datasworn_version: "0.3.0",
        authors: [],
        date: "2000-01-01",
        url: "",
        license: null,
        ruleset: expansion.base.rulesetId,
        rules: convertHomebrewToRules(
          expansion.stats.data ?? {},
          expansion.conditionMeters.data ?? {},
          expansion.impactCategories.data ?? {},
          expansion.legacyTracks.data ?? {},
        ),
        assets: convertHomebrewAssetDocumentsToCollections(
          expansionId,
          expansion.assetCollections.data ?? {},
          expansion.assets.data ?? {},
        ),
        moves: convertStoredMovesToCategories(
          expansionId,
          expansion.moveCategories.data ?? {},
          expansion.moves.data ?? {},
        ),
        oracles: convertStoredOraclesToCollections(
          expansionId,
          expansion.oracleCollections.data ?? {},
          expansion.oracleTables.data ?? {},
        ),
      };
      set((store) => {
        store.homebrew.expansions[expansionId] = dataswornExpansion;
      });
      getState().rules.rebuildRules();
    }
  },
});
