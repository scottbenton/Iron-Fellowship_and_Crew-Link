import { CreateSliceType } from "stores/store.type";
import { RulesSlice } from "./rules.slice.type";
import { defaultRulesSlice } from "./rules.slice.default";
import { Datasworn } from "@datasworn/core";
import ironswornDelve from "@datasworn/ironsworn-classic-delve/json/delve.json";
import { parseOraclesIntoMaps } from "./helpers/parseOraclesIntoMaps";

const defaultExpansions: Record<string, Datasworn.Expansion> = {
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
});
