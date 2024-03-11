import { CreateSliceType } from "stores/store.type";
import { RulesSlice } from "./rules.slice.type";
import { defaultRulesSlice } from "./rules.slice.default";
import { Datasworn } from "@datasworn/core";
import ironswornDelve from "@datasworn/ironsworn-classic-delve/json/delve.json";
import { parseOraclesIntoMaps } from "./helpers/parseOraclesIntoMaps";
import { parseMovesIntoMaps } from "./helpers/parseMovesIntoMaps";

export const defaultExpansions: Record<string, Datasworn.Expansion> = {
  [ironswornDelve.id]: ironswornDelve as unknown as Datasworn.Expansion,
};

export const createRulesSlice: CreateSliceType<RulesSlice> = (
  set,
  getState
) => ({
  ...defaultRulesSlice,

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
          (oracle) => oracle.id
        );
        const baseRulesetMaps = parseOraclesIntoMaps(baseRuleset.oracles);
        let allOraclesMap = { ...baseRulesetMaps.allOraclesMap };
        let oracleCollectionMap = {
          ...baseRulesetMaps.oracleCollectionMap,
        };
        let oracleRollableMap = { ...baseRulesetMaps.oracleRollableMap };
        let oracleTableRollableMap = {
          ...baseRulesetMaps.oracleTableRollableMap,
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
          const expansionOracleMaps = parseOraclesIntoMaps(expansionOracles);

          allOraclesMap = {
            ...allOraclesMap,
            ...expansionOracleMaps.allOraclesMap,
          };
          oracleCollectionMap = {
            ...oracleCollectionMap,
            ...expansionOracleMaps.oracleCollectionMap,
          };
          oracleRollableMap = {
            ...oracleRollableMap,
            ...expansionOracleMaps.oracleRollableMap,
          };
          oracleTableRollableMap = {
            ...oracleTableRollableMap,
            ...expansionOracleMaps.oracleTableRollableMap,
          };

          Object.values(expansionOracles).forEach((oracle) => {
            if (!oracle.replaces && !oracle.enhances) {
              rootOracleCollectionIds.push(oracle.id);
            }
          });
        });

        store.rules.oracleMaps = {
          allOraclesMap,
          oracleCollectionMap,
          oracleRollableMap,
          oracleTableRollableMap,
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
          (move) => move.id
        );
        const baseRulesetMaps = parseMovesIntoMaps(baseRuleset.moves);

        let moveCategoryMap = { ...baseRulesetMaps.moveCategoryMap };
        let moveMap = { ...baseRulesetMaps.moveMap };

        store.rules.expansionIds.forEach((expansionId) => {
          let expansionMoveCategories: Record<string, Datasworn.MoveCategory>;
          if (defaultExpansions[expansionId]) {
            expansionMoveCategories =
              defaultExpansions[expansionId].moves ?? {};
          } else {
            expansionMoveCategories =
              store.homebrew.collections[expansionId]?.dataswornMoves ?? {};
          }
          const expansionMoveMaps = parseMovesIntoMaps(expansionMoveCategories);

          moveCategoryMap = {
            ...moveCategoryMap,
            ...expansionMoveMaps.moveCategoryMap,
          };
          moveMap = { ...moveMap, ...expansionMoveMaps.moveMap };
        });

        store.rules.moveMaps = {
          moveCategoryMap,
          moveMap,
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
            Object.values(expansionStats).forEach((expansionStat) => {
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
            Object.values(expansionConditionMeters).forEach(
              (conditionMeter) => {
                conditionMeters[conditionMeter.dataswornId] = {
                  label: conditionMeter.label,
                  description: conditionMeter.description ?? "",
                  shared: conditionMeter.shared,
                  value: conditionMeter.value,
                  min: conditionMeter.min,
                  max: conditionMeter.max,
                  rollable: true, // conditionMeter.rollable ?? false
                };
              }
            );
          }
        });

        store.rules.conditionMeters = conditionMeters;
      }
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
            Object.values(expansionSpecialTracks).forEach((specialTrack) => {
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
            Object.keys(expansionImpacts).forEach((impactCategoryId) => {
              const impactCategory = expansionImpacts[impactCategoryId];
              const impactContents: Record<string, Datasworn.ImpactRule> = {};

              Object.keys(impactCategory.contents).forEach((impactKey) => {
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
});
