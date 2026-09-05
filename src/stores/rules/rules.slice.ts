import { CreateSliceType } from "stores/store.type";
import { RulesSlice, RulesSliceData } from "./rules.slice.type";
import { defaultRulesSlice } from "./rules.slice.default";
import { Datasworn, IdParser } from "@datasworn/core";
import { parseOraclesIntoMaps } from "./helpers/parseOraclesIntoMaps";
import { parseMovesIntoMaps } from "./helpers/parseMovesIntoMaps";
import { parseAssetsIntoMaps } from "./helpers/parseAssetsIntoMaps";
import { isFullyReplacingMoveCategory } from "./helpers/isFullyReplacingMoveCategory";
import { collectEmbeddedContent } from "./helpers/collectEmbeddedContent";
import { HomebrewNonLinearMeterDocument } from "api-calls/homebrew/rules/nonLinearMeters/_homebrewNonLinearMeter.type";
import {
  defaultExpansions,
  loadIncludedExpansion,
  loadIncludedRuleset,
  thirdPartyExpansions,
} from "data/rulesets";
import { Primary } from "@datasworn/core/dist/StringId";
import { idMap } from "data/idMap";

export const createRulesSlice: CreateSliceType<RulesSlice> = (
  set,
  getState,
) => {
  return {
    ...defaultRulesSlice,

    setBaseRuleset: (ruleset) => {
      set((store) => {
        store.rules.baseRuleset = ruleset;
      });

      const state = getState();
      state.rules.rebuildRules();
    },

    setExpansionIds: (expansionIds) => {
      set((store) => {
        store.rules.expansionIds = expansionIds;
      });
      getState().rules.rebuildRules();
      getState().rules.loadIncludedExpansions(expansionIds).catch(console.error);
    },

    loadBaseRuleset: async () => {
      const ruleset = await loadIncludedRuleset();
      getState().rules.setBaseRuleset(ruleset);
    },

    loadIncludedExpansions: async (expansionIds) => {
      const loadedExpansions = await Promise.all(
        expansionIds.map((expansionId) => loadIncludedExpansion(expansionId)),
      );

      if (loadedExpansions.some(Boolean)) {
        getState().rules.rebuildRules();
      }
    },

    rebuildNonLinearMeters: () => {
      set((store) => {
        let nonLinearMeters: Record<string, HomebrewNonLinearMeterDocument> =
          {};

        store.rules.expansionIds.forEach((expansionId) => {
          if (
            !defaultExpansions[expansionId] &&
            !thirdPartyExpansions[expansionId]
          ) {
            const expansionNonLinearMeters =
              store.homebrew.collections[expansionId]?.nonLinearMeters?.data ??
              {};
            nonLinearMeters = { ...nonLinearMeters };
            Object.keys(expansionNonLinearMeters)
              .sort((m1, m2) =>
                expansionNonLinearMeters[m1].label.localeCompare(
                  expansionNonLinearMeters[m2].label,
                ),
              )
              .forEach((meterKey) => {
                nonLinearMeters[meterKey] = expansionNonLinearMeters[meterKey];
              });
          }
        });
        store.rules.nonLinearMeters = nonLinearMeters;
      });
    },

    rebuildWorldTruths: () => {
      set((store) => {
        const baseRulesetTruths = store.rules.baseRuleset?.truths;
        if (baseRulesetTruths) {
          store.rules.worldTruths = baseRulesetTruths;
        }
      });
    },
    rebuildRules: () => {
      const state = getState();
      const expansionIds = state.rules.expansionIds;
      const baseRuleset = state.rules.baseRuleset;

      if (baseRuleset) {
        const tree: Record<string, Datasworn.RulesPackage> = {
          [baseRuleset._id]: baseRuleset,
        };
        IdParser.tree = tree;

        let oracleMaps: RulesSliceData["oracleMaps"] = parseOraclesIntoMaps(
          baseRuleset.oracles,
        );
        let rootOracleCollectionIds = Object.values(baseRuleset.oracles).map(
          (oracle) => oracle._id,
        );

        let moveMaps: RulesSliceData["moveMaps"] = parseMovesIntoMaps(
          baseRuleset.moves,
        );
        let rootMoveCollectionIds = Object.values(baseRuleset.moves).map(
          (move) => move._id,
        );

        let assetMaps: RulesSliceData["assetMaps"] = parseAssetsIntoMaps(
          baseRuleset.assets,
        );
        let stats = baseRuleset.rules.stats;
        let conditionMeters = baseRuleset.rules.condition_meters;
        let specialTracks = baseRuleset.rules.special_tracks;
        let impacts = baseRuleset.rules.impacts;
        let worldTruths = baseRuleset.truths ?? {};

        expansionIds.forEach((expansionId) => {
          let expansion: Datasworn.Expansion;
          let isHomebrewExpansion = false;
          if (defaultExpansions[expansionId]) {
            expansion = defaultExpansions[expansionId];
            // merge expansion with base ruleset
          } else if (thirdPartyExpansions[expansionId]) {
            expansion = thirdPartyExpansions[expansionId];
          } else {
            expansion = state.homebrew.expansions[expansionId];
            isHomebrewExpansion = true;
          }
          if (expansion) {
            tree[expansion._id] = expansion;

            const expansionOracleMaps = parseOraclesIntoMaps(expansion.oracles);
            const expansionMoveMaps = parseMovesIntoMaps(expansion.moves);
            const expansionAssetMaps = parseAssetsIntoMaps(expansion.assets);

            oracleMaps = mergeOracleMaps(oracleMaps, expansionOracleMaps);
            rootOracleCollectionIds = rootOracleCollectionIds.concat(
              Object.values(expansion.oracles)
                .filter((oracle) => !oracle.replaces && !oracle.enhances)
                .map((oracle) => oracle._id),
            );

            moveMaps = mergeMoveMaps(moveMaps, expansionMoveMaps);
            rootMoveCollectionIds = rootMoveCollectionIds.concat(
              Object.values(expansion.moves)
                .filter(
                  (move) =>
                    !move.enhances &&
                    !move.replaces &&
                    // Homebrew keeps its headings. An author named that
                    // collection deliberately, and while they are still
                    // building it, it can hold nothing but replacements.
                    (isHomebrewExpansion ||
                      !isFullyReplacingMoveCategory(
                        move,
                        moveMaps.nonReplacedMoveMap,
                      )),
                )
                .map((move) => move._id),
            );

            assetMaps = mergeAssetMaps(assetMaps, expansionAssetMaps);

            stats = { ...stats, ...expansion.rules?.stats };
            conditionMeters = {
              ...conditionMeters,
              ...expansion.rules?.condition_meters,
            };
            specialTracks = {
              ...specialTracks,
              ...expansion.rules?.special_tracks,
            };
            impacts = { ...impacts, ...expansion.rules?.impacts };
            worldTruths = { ...worldTruths, ...expansion.truths };
          }
        });

        ({ moveMaps, oracleMaps } = collectEmbeddedContent(
          moveMaps,
          assetMaps,
          oracleMaps,
        ));

        set((store) => {
          store.rules.oracleMaps = oracleMaps;
          store.rules.rootOracleCollectionIds = rootOracleCollectionIds;

          store.rules.moveMaps = moveMaps;
          store.rules.rootMoveCollectionIds = rootMoveCollectionIds;

          store.rules.assetMaps = assetMaps;

          store.rules.stats = stats;
          store.rules.conditionMeters = conditionMeters;
          store.rules.specialTracks = specialTracks;
          store.rules.impacts = impacts;
          store.rules.worldTruths = worldTruths;
        });
      }
    },
  };
};

function mergeOracleMaps(
  base: RulesSliceData["oracleMaps"],
  expansion: RulesSliceData["oracleMaps"],
): RulesSliceData["oracleMaps"] {
  const allOraclesMap = {
    ...base.allOraclesMap,
    ...expansion.allOraclesMap,
  };
  const oracleCollectionMap = {
    ...base.oracleCollectionMap,
    ...expansion.oracleCollectionMap,
  };
  const nonReplacedOracleCollectionMap = {
    ...base.nonReplacedOracleCollectionMap,
    ...expansion.nonReplacedOracleCollectionMap,
  };
  const oracleRollableMap = {
    ...base.oracleRollableMap,
    ...expansion.oracleRollableMap,
  };
  const nonReplacedOracleRollableMap = {
    ...base.nonReplacedOracleRollableMap,
    ...expansion.nonReplacedOracleRollableMap,
  };
  const oracleTableRollableMap = {
    ...base.oracleTableRollableMap,
    ...expansion.oracleTableRollableMap,
  };
  const nonReplacedOracleTableRollableMap = {
    ...base.nonReplacedOracleTableRollableMap,
    ...expansion.nonReplacedOracleTableRollableMap,
  };

  Object.keys(expansion.oracleCollectionMap).forEach((collectionKey) => {
    const collection = expansion.oracleCollectionMap[collectionKey];
    if (collection.enhances) {
      collection.enhances.forEach((enhances) => {
        let enhancesId = enhances;
        if (!enhancesId.startsWith("oracle_collection")) {
          enhancesId = idMap[enhancesId] ?? enhancesId;
        }
        if (enhancesId.startsWith("oracle_collection")) {
          const replaceMatches = IdParser.getMatches(
            enhancesId as Primary,
            IdParser.tree,
          );
          replaceMatches.forEach((val, key) => {
            if (val.type === "oracle_collection") {
              const newContents: Record<string, Datasworn.OracleRollable> = {
                ...oracleCollectionMap[key].contents,
              };
              Object.entries(collection.contents)
                .filter(([, oracle]) => !oracle.replaces)
                .forEach(([oracleKey, oracle]) => {
                  newContents[oracleKey] = oracle;
                });

              oracleCollectionMap[key] = {
                ...oracleCollectionMap[key],
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                contents: newContents as any,
              };

              if (val.oracle_type !== "table_shared_rolls") {
                const newCollections: Record<
                  string,
                  Datasworn.OracleCollection
                > = {
                  ...((
                    oracleCollectionMap[key] as Datasworn.OracleTablesCollection
                  ).collections ?? {}),
                };
                Object.entries(
                  (collection as Datasworn.OracleTablesCollection)
                    .collections ?? {},
                )
                  .filter(([, oracle]) => !oracle.replaces && !oracle.enhances)
                  .forEach(([oracleKey, oracle]) => {
                    newCollections[oracleKey] = oracle;
                  });
                oracleCollectionMap[key] = {
                  ...oracleCollectionMap[key],
                  collections: newCollections,
                } as Datasworn.OracleTablesCollection;
              }
            }
          });
        }
      });
    }
  });

  return {
    allOraclesMap,
    oracleCollectionMap,
    nonReplacedOracleCollectionMap,
    oracleRollableMap,
    nonReplacedOracleRollableMap,
    oracleTableRollableMap,
    nonReplacedOracleTableRollableMap,
  };
}

function mergeMoveMaps(
  base: RulesSliceData["moveMaps"],
  expansion: RulesSliceData["moveMaps"],
): RulesSliceData["moveMaps"] {
  const moveCategoryMap = {
    ...base.moveCategoryMap,
    ...expansion.moveCategoryMap,
  };
  const nonReplacedMoveCategoryMap = {
    ...base.nonReplacedMoveCategoryMap,
    ...expansion.nonReplacedMoveCategoryMap,
  };
  const moveMap = {
    ...base.moveMap,
    ...expansion.moveMap,
  };
  const nonReplacedMoveMap = {
    ...base.nonReplacedMoveMap,
    ...expansion.nonReplacedMoveMap,
  };

  Object.keys(expansion.moveCategoryMap).forEach((collectionKey) => {
    const collection = expansion.moveCategoryMap[collectionKey];
    if (collection.enhances) {
      collection.enhances.forEach((enhances) => {
        let enhancesId = enhances;
        if (!enhancesId.startsWith("move_category")) {
          enhancesId = idMap[enhancesId] ?? enhancesId;
        }
        if (enhancesId.startsWith("move_category")) {
          const replaceMatches = IdParser.getMatches(
            enhancesId as Primary,
            IdParser.tree,
          );
          replaceMatches.forEach((val, key) => {
            if (val.type === "move_category") {
              const newContents: Record<string, Datasworn.Move> = {
                ...moveCategoryMap[key].contents,
              };
              Object.entries(collection.contents)
                .filter(([, move]) => !move.replaces)
                .forEach(([moveKey, move]) => {
                  newContents[moveKey] = move;
                });

              const newCategories: Record<string, Datasworn.MoveCategory> = {
                ...moveCategoryMap[key].collections,
              };
              Object.entries(collection.collections)
                .filter(([, move]) => !move.replaces && !move.enhances)
                .forEach(([moveKey, move]) => {
                  newCategories[moveKey] = move;
                });

              moveCategoryMap[key] = {
                ...moveCategoryMap[key],
                contents: newContents,
                collections: newCategories,
              };
            }
          });
        }
      });
    }
  });

  return {
    moveCategoryMap,
    nonReplacedMoveCategoryMap,
    moveMap,
    nonReplacedMoveMap,
  };
}

function mergeAssetMaps(
  base: RulesSliceData["assetMaps"],
  expansion: RulesSliceData["assetMaps"],
): RulesSliceData["assetMaps"] {
  const combinedAssetCollectionMap = {
    ...base.assetCollectionMap,
    ...expansion.assetCollectionMap,
  };
  const combinedNonReplacedAssetCollectionMap = {
    ...base.nonReplacedAssetCollectionMap,
    ...expansion.nonReplacedAssetCollectionMap,
  };
  const combinedAssetMap = {
    ...base.assetMap,
    ...expansion.assetMap,
  };

  Object.keys(expansion.assetCollectionMap).forEach((collectionKey) => {
    const collection = expansion.assetCollectionMap[collectionKey];
    if (collection.enhances) {
      collection.enhances.forEach((enhances) => {
        let enhancesId = enhances;
        if (!enhancesId.startsWith("asset_collection")) {
          enhancesId = idMap[enhancesId] ?? enhancesId;
        }
        if (enhancesId.startsWith("asset_collection")) {
          const replaceMatches = IdParser.getMatches(
            enhancesId as Primary,
            IdParser.tree,
          );
          replaceMatches.forEach((val, key) => {
            if (val.type === "asset_collection") {
              const newContents: Record<string, Datasworn.Asset> = {
                ...combinedAssetCollectionMap[key].contents,
              };
              Object.entries(collection.contents)
                .filter(([, asset]) => !asset.replaces)
                .forEach(([assetKey, asset]) => {
                  newContents[assetKey] = {
                    ...asset,
                    category: val.name.replace("Assets", ""),
                  };
                });

              combinedAssetCollectionMap[key] = {
                ...combinedAssetCollectionMap[key],
                contents: newContents,
              };
            }
          });
        }
      });
    }
  });

  return {
    assetCollectionMap: combinedAssetCollectionMap,
    nonReplacedAssetCollectionMap: combinedNonReplacedAssetCollectionMap,
    assetMap: combinedAssetMap,
  };
}
