import { CreateSliceType } from "stores/store.type";
import { RulesSlice } from "./rules.slice.type";
import { defaultRulesSlice } from "./rules.slice.default";
import { Datasworn } from "@datasworn/core";
import { parseOraclesIntoMaps } from "./helpers/parseOraclesIntoMaps";
import { parseMovesIntoMaps } from "./helpers/parseMovesIntoMaps";
import { parseAssetsIntoMaps } from "./helpers/parseAssetsIntoMaps";
import { HomebrewNonLinearMeterDocument } from "api-calls/homebrew/rules/nonLinearMeters/_homebrewNonLinearMeter.type";
import { defaultExpansions } from "data/rulesets";

export const createRulesSlice: CreateSliceType<RulesSlice> = (
  set,
  getState,
) => ({
  ...defaultRulesSlice,

  setBaseRuleset: (ruleset) => {
    set((store) => {
      store.rules.baseRuleset = ruleset;
    });

    const state = getState();
    state.rules.rebuildOracles();
    state.rules.rebuildMoves();
    state.rules.rebuildStats();
    state.rules.rebuildConditionMeters();
    state.rules.rebuildNonLinearMeters();
    state.rules.rebuildSpecialTracks();
    state.rules.rebuildImpacts();
    state.rules.rebuildAssets();
    state.rules.rebuildWorldTruths();
  },

  setExpansionIds: (expansionIds) => {
    set((store) => {
      store.rules.expansionIds = expansionIds;
    });

    const state = getState();
    state.rules.rebuildOracles();
  },

  rebuildOracles: () => {
    set((store) => {
      const baseRuleset = store.rules.baseRuleset;
      if (baseRuleset) {
        const rootOracleCollectionIds = Object.values(baseRuleset.oracles).map(
          (oracle) => oracle._id,
        );
        const baseRulesetMaps = parseOraclesIntoMaps(baseRuleset.oracles);
        let allOraclesMap = { ...baseRulesetMaps.allOraclesMap };
        let oracleCollectionMap = {
          ...baseRulesetMaps.oracleCollectionMap,
        };
        let nonReplacedOracleCollectionMap = {
          ...baseRulesetMaps.nonReplacedOracleCollectionMap,
        };
        let oracleRollableMap = { ...baseRulesetMaps.oracleRollableMap };
        let nonReplacedOracleRollableMap = {
          ...baseRulesetMaps.nonReplacedOracleRollableMap,
        };
        let oracleTableRollableMap = {
          ...baseRulesetMaps.oracleTableRollableMap,
        };
        let nonReplacedOracleTableRollableMap = {
          ...baseRulesetMaps.nonReplacedOracleTableRollableMap,
        };

        store.rules.expansionIds.forEach((expansionId) => {
          let expansionOracles: Record<
            string,
            Datasworn.OracleTablesCollection
          >;
          if (defaultExpansions[expansionId]) {
            expansionOracles = defaultExpansions[expansionId].oracles ?? {};
          } else {
            expansionOracles =
              store.homebrew.collections[expansionId]?.dataswornOracles ?? {};
          }
          const expansionOracleMaps = parseOraclesIntoMaps(
            expansionOracles,
            !defaultExpansions[expansionId],
          );

          allOraclesMap = {
            ...allOraclesMap,
            ...expansionOracleMaps.allOraclesMap,
          };
          oracleCollectionMap = {
            ...oracleCollectionMap,
            ...expansionOracleMaps.oracleCollectionMap,
          };
          nonReplacedOracleCollectionMap = {
            ...nonReplacedOracleCollectionMap,
            ...expansionOracleMaps.nonReplacedOracleCollectionMap,
          };
          oracleRollableMap = {
            ...oracleRollableMap,
            ...expansionOracleMaps.oracleRollableMap,
          };
          nonReplacedOracleRollableMap = {
            ...nonReplacedOracleRollableMap,
            ...expansionOracleMaps.nonReplacedOracleRollableMap,
          };
          oracleTableRollableMap = {
            ...oracleTableRollableMap,
            ...expansionOracleMaps.oracleTableRollableMap,
          };
          nonReplacedOracleTableRollableMap = {
            ...nonReplacedOracleTableRollableMap,
            ...expansionOracleMaps.nonReplacedOracleTableRollableMap,
          };

          Object.values(expansionOracles).forEach((oracle) => {
            if (!oracle.replaces && !oracle.enhances) {
              rootOracleCollectionIds.push(oracle._id);
            }
          });
        });

        store.rules.oracleMaps = {
          allOraclesMap,
          oracleCollectionMap,
          nonReplacedOracleCollectionMap,
          oracleRollableMap,
          nonReplacedOracleRollableMap,
          oracleTableRollableMap,
          nonReplacedOracleTableRollableMap,
        };
        store.rules.rootOracleCollectionIds = rootOracleCollectionIds;
      }
    });
  },

  rebuildMoves: () => {
    set((store) => {
      const baseRuleset = store.rules.baseRuleset;
      if (baseRuleset) {
        const rootMoveCollectionIds = Object.values(baseRuleset.moves).map(
          (move) => move._id,
        );
        const baseRulesetMaps = parseMovesIntoMaps(baseRuleset.moves);

        let moveCategoryMap = { ...baseRulesetMaps.moveCategoryMap };
        let moveMap = { ...baseRulesetMaps.moveMap };
        let nonReplacedMoveCategoryMap = {
          ...baseRulesetMaps.nonReplacedMoveCategoryMap,
        };
        let nonReplacedMoveMap = {
          ...baseRulesetMaps.nonReplacedMoveMap,
        };

        store.rules.expansionIds.forEach((expansionId) => {
          let expansionMoveCategories: Record<string, Datasworn.MoveCategory>;
          if (defaultExpansions[expansionId]) {
            expansionMoveCategories =
              defaultExpansions[expansionId].moves ?? {};
          } else {
            expansionMoveCategories =
              store.homebrew.collections[expansionId]?.dataswornMoves ?? {};
          }
          const expansionMoveMaps = parseMovesIntoMaps(
            expansionMoveCategories,
            !defaultExpansions[expansionId],
          );

          // TODO -
          Object.values(expansionMoveCategories).forEach((moveCategory) => {
            if (!moveCategory.replaces && !moveCategory.enhances) {
              rootMoveCollectionIds.push(moveCategory._id);
            }
          });

          moveCategoryMap = {
            ...moveCategoryMap,
            ...expansionMoveMaps.moveCategoryMap,
          };
          moveMap = { ...moveMap, ...expansionMoveMaps.moveMap };
          nonReplacedMoveCategoryMap = {
            ...nonReplacedMoveCategoryMap,
            ...expansionMoveMaps.nonReplacedMoveCategoryMap,
          };
          nonReplacedMoveMap = {
            ...nonReplacedMoveMap,
            ...expansionMoveMaps.nonReplacedMoveMap,
          };
        });

        store.rules.moveMaps = {
          moveCategoryMap,
          moveMap,
          nonReplacedMoveCategoryMap,
          nonReplacedMoveMap,
        };
        store.rules.rootMoveCollectionIds = rootMoveCollectionIds;
      }
    });
  },
  rebuildStats: () => {
    set((store) => {
      const baseRuleset = store.rules.baseRuleset;
      if (baseRuleset) {
        const rootStats = baseRuleset.rules.stats;

        let statMap = { ...rootStats };

        store.rules.expansionIds.forEach((expansionId) => {
          if (defaultExpansions[expansionId]) {
            statMap = {
              ...statMap,
              ...(defaultExpansions[expansionId].rules?.stats ?? {}),
            };
          } else {
            const expansionStats =
              store.homebrew.collections[expansionId]?.stats?.data ?? {};
            Object.values(expansionStats)
              .sort((s1, s2) => s1.label.localeCompare(s2.label))
              .forEach((expansionStat) => {
                statMap[expansionStat.dataswornId] = {
                  label: expansionStat.label,
                  description: expansionStat.description ?? "",
                };
              });
          }
        });

        store.rules.stats = statMap;
      }
    });
  },
  rebuildConditionMeters: () => {
    set((store) => {
      const baseRuleset = store.rules.baseRuleset;
      if (baseRuleset) {
        const rootConditionMeters = baseRuleset.rules.condition_meters;

        let conditionMeters = { ...rootConditionMeters };

        store.rules.expansionIds.forEach((expansionId) => {
          if (defaultExpansions[expansionId]) {
            conditionMeters = {
              ...conditionMeters,
              ...(defaultExpansions[expansionId].rules?.condition_meters ?? {}),
            };
          } else {
            const expansionConditionMeters =
              store.homebrew.collections[expansionId]?.conditionMeters?.data ??
              {};
            Object.values(expansionConditionMeters)
              .sort((c1, c2) => c1.label.localeCompare(c2.label))
              .forEach((conditionMeter) => {
                conditionMeters[conditionMeter.dataswornId] = {
                  label: conditionMeter.label,
                  description: conditionMeter.description ?? "",
                  shared: conditionMeter.shared,
                  value: conditionMeter.value,
                  min: conditionMeter.min,
                  max: conditionMeter.max,
                  rollable: true,
                };
              });
          }
        });

        store.rules.conditionMeters = conditionMeters;
      }
    });
  },
  rebuildNonLinearMeters: () => {
    set((store) => {
      let nonLinearMeters: Record<string, HomebrewNonLinearMeterDocument> = {};

      store.rules.expansionIds.forEach((expansionId) => {
        if (!defaultExpansions[expansionId]) {
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
  rebuildSpecialTracks: () => {
    set((store) => {
      const baseRuleset = store.rules.baseRuleset;
      if (baseRuleset) {
        const rootSpecialTracks = baseRuleset.rules.special_tracks;

        let specialTracks = { ...rootSpecialTracks };

        store.rules.expansionIds.forEach((expansionId) => {
          if (defaultExpansions[expansionId]) {
            specialTracks = {
              ...specialTracks,
              ...(defaultExpansions[expansionId].rules?.special_tracks ?? {}),
            };
          } else {
            const expansionSpecialTracks =
              store.homebrew.collections[expansionId]?.legacyTracks?.data ?? {};
            Object.values(expansionSpecialTracks)
              .sort((s1, s2) => s1.label.localeCompare(s2.label))
              .forEach((specialTrack) => {
                specialTracks[specialTrack.dataswornId] = {
                  label: specialTrack.label,
                  description: specialTrack.description ?? "",
                  shared: specialTrack.shared,
                  optional: specialTrack.optional,
                };
              });
          }
        });

        store.rules.specialTracks = specialTracks;
      }
    });
  },
  rebuildImpacts: () => {
    set((store) => {
      const baseRuleset = store.rules.baseRuleset;
      if (baseRuleset) {
        const rootImpacts = baseRuleset.rules.impacts;

        let impacts = { ...rootImpacts };

        store.rules.expansionIds.forEach((expansionId) => {
          if (defaultExpansions[expansionId]) {
            impacts = {
              ...impacts,
              ...(defaultExpansions[expansionId].rules?.impacts ?? {}),
            };
          } else {
            const expansionImpacts =
              store.homebrew.collections[expansionId]?.impactCategories?.data ??
              {};
            Object.keys(expansionImpacts)
              .sort((c1, c2) =>
                expansionImpacts[c1].label.localeCompare(
                  expansionImpacts[c2].label,
                ),
              )
              .forEach((impactCategoryId) => {
                const impactCategory = expansionImpacts[impactCategoryId];
                const impactContents: Record<string, Datasworn.ImpactRule> = {};

                Object.keys(impactCategory.contents)
                  .sort((i1, i2) =>
                    impactCategory.contents[i1].label.localeCompare(
                      impactCategory.contents[i2].label,
                    ),
                  )
                  .forEach((impactKey) => {
                    const impact = impactCategory.contents[impactKey];
                    impactContents[impact.dataswornId] = {
                      label: impact.label,
                      description: impact.description ?? "",
                      shared: impact.shared,
                      prevents_recovery: impact.preventsRecovery,
                      permanent: impact.permanent,
                    };
                  });

                impacts[impactCategoryId] = {
                  label: impactCategory.label,
                  description: impactCategory.description ?? "",
                  contents: impactContents,
                };
              });
          }
        });

        store.rules.impacts = impacts;
      }
    });
  },
  rebuildAssets: () => {
    set((store) => {
      const baseRuleset = store.rules.baseRuleset;
      if (baseRuleset) {
        const baseRulesetMaps = parseAssetsIntoMaps(baseRuleset.assets);

        let assetCollectionMap = { ...baseRulesetMaps.assetCollectionMap };
        let assetMap = { ...baseRulesetMaps.assetMap };
        let nonReplacedAssetCollectionMap = {
          ...baseRulesetMaps.nonReplacedAssetCollectionMap,
        };

        store.rules.expansionIds.forEach((expansionId) => {
          let expansionAssetCollections: Record<
            string,
            Datasworn.AssetCollection
          >;
          if (defaultExpansions[expansionId]) {
            expansionAssetCollections =
              defaultExpansions[expansionId].assets ?? {};
          } else {
            expansionAssetCollections =
              store.homebrew.collections[expansionId]?.dataswornAssets ?? {};
          }
          const expansionAssetMaps = parseAssetsIntoMaps(
            expansionAssetCollections,
          );

          assetCollectionMap = {
            ...assetCollectionMap,
            ...expansionAssetMaps.assetCollectionMap,
          };
          assetMap = { ...assetMap, ...expansionAssetMaps.assetMap };
          nonReplacedAssetCollectionMap = {
            ...nonReplacedAssetCollectionMap,
            ...expansionAssetMaps.nonReplacedAssetCollectionMap,
          };

          Object.keys(expansionAssetMaps.assetCollectionMap).forEach(
            (collectionKey) => {
              const collection =
                expansionAssetMaps.assetCollectionMap[collectionKey];
              if (collection.replaces) {
                assetCollectionMap[collection.replaces] = collection;
              } else if (collection.enhances) {
                const original = assetCollectionMap[collection.enhances];
                if (original) {
                  const newContents: Record<string, Datasworn.Asset> = {};
                  const oldContents = collection.contents;
                  if (oldContents) {
                    Object.keys(oldContents).forEach((assetKey) => {
                      const asset = oldContents[assetKey];
                      newContents[assetKey] = {
                        ...asset,
                        category: original.name.replace("Assets", ""),
                      };
                      assetMap[asset._id] = newContents[assetKey];
                    });
                  }
                  assetCollectionMap[collection.enhances] = {
                    ...original,
                    contents: { ...original.contents, ...newContents },
                  };
                }
              }
            },
          );
        });

        store.rules.assetMaps = {
          assetCollectionMap,
          assetMap,
          nonReplacedAssetCollectionMap,
        };
      }
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
});
