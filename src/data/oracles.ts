import { ironswornOracleCategories } from "./dataforged";
import type {
  OracleSet,
  OracleTable as DataforgedOracleTable,
  Title,
} from "dataforged";

const oracleCategoryOrder = [
  "ironsworn/oracles/moves",
  "ironsworn/oracles/character",
  "ironsworn/oracles/name",
  "ironsworn/oracles/action_and_theme",
  "ironsworn/oracles/combat_event",
  "ironsworn/oracles/feature",
  "ironsworn/oracles/place",
  "ironsworn/oracles/settlement",
  "ironsworn/oracles/site_name",
  "ironsworn/oracles/site_nature",
  "ironsworn/oracles/monstrosity",
  "ironsworn/oracles/threat",
  "ironsworn/oracles/trap",
  "ironsworn/oracles/turning_point",
];

export let oracleCategoryMap: { [categoryId: string]: OracleSet } = {};
export let oracleMap: { [tableId: string]: DataforgedOracleTable } = {};

function flattenOracleTables(
  set: OracleSet,
  subsetTitlePrefix?: Title
): {
  [tableId: string]: DataforgedOracleTable;
} {
  let newSetTables: { [tableId: string]: DataforgedOracleTable } = {};
  Object.values(set.Tables ?? {}).forEach((table) => {
    if (!subsetTitlePrefix) {
      newSetTables[table.$id] = table;
    } else {
      newSetTables[table.$id] = {
        ...table,
        Title: {
          $id: table.Title.$id,
          Short: `${subsetTitlePrefix.Short}: ${table.Title.Short}`,
          Canonical: `${subsetTitlePrefix.Canonical}: ${table.Title.Canonical}`,
          Standard: `${subsetTitlePrefix.Standard}: ${table.Title.Standard}`,
        },
      };
    }
  });

  Object.values(set.Sets ?? {}).forEach((subSet) => {
    newSetTables = {
      ...newSetTables,
      ...flattenOracleTables(subSet, subSet.Title),
    };
  });

  return newSetTables;
}

Object.values(ironswornOracleCategories).forEach((oracleCategory) => {
  const flattenedTables = flattenOracleTables(oracleCategory);
  oracleMap = { ...oracleMap, ...flattenedTables };

  oracleCategoryMap[oracleCategory.$id] = {
    ...oracleCategory,
    Tables: flattenedTables,
  };
});

export const orderedOracleCategories = oracleCategoryOrder.map(
  (oracleId) => oracleCategoryMap[oracleId]
);

export const hiddenOracleIds: { [oracleId: string]: boolean } = {
  "ironsworn/oracles/moves/ask_the_oracle/almost_certain": true,
  "ironsworn/oracles/moves/ask_the_oracle/likely": true,
  "ironsworn/oracles/moves/ask_the_oracle/50_50": true,
  "ironsworn/oracles/moves/ask_the_oracle/unlikely": true,
  "ironsworn/oracles/moves/ask_the_oracle/small_chance": true,
};

console.debug(Object.keys(oracleMap));
