import { getSystem } from "hooks/useGameSystem";
import {
  ironswornOracleCategories,
  starforgedOracleCategories,
} from "./dataforged";
import type {
  OracleSet,
  OracleTable as DataforgedOracleTable,
  Title,
} from "dataforged";
import { GAME_SYSTEMS, GameSystemChooser } from "types/GameSystems.type";

const gameSystem = getSystem();
const moveCategories: GameSystemChooser<typeof ironswornOracleCategories> = {
  [GAME_SYSTEMS.IRONSWORN]: ironswornOracleCategories,
  [GAME_SYSTEMS.STARFORGED]: starforgedOracleCategories,
};
const categoryOrders: GameSystemChooser<string[]> = {
  [GAME_SYSTEMS.IRONSWORN]: [
    "Moves",
    "Character",
    "Name",
    "Action and Theme",
    "Combat Event",
    "Feature",
    "Place",
    "Settlement",
    "Site Name",
    "Site Nature",
    "Monstrosity",
    "Threat",
    "Trap",
    "Turning Point",
  ],
  [GAME_SYSTEMS.STARFORGED]: [
    "Campaign",
    "Characters",
    "Core",
    "Creatures",
    "Derelicts",
    "Factions",
    "Location themes",
    "Misc",
    "Moves",
    "Planets",
    "Settlements",
    "Space",
    "Starships",
    "Vaults",
    "Location Themes",
  ],
};
const category = moveCategories[gameSystem];
const categoryOrder = categoryOrders[gameSystem];

export const orderedCategories = categoryOrder.map(
  (categoryId) => category[categoryId]
);

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

Object.values(orderedCategories).forEach((oracleCategory) => {
  const flattenedTables = flattenOracleTables(oracleCategory);
  oracleMap = { ...oracleMap, ...flattenedTables };

  oracleCategoryMap[oracleCategory.$id] = {
    ...oracleCategory,
    Tables: flattenedTables,
  };
});

export const hiddenOracleIds: { [oracleId: string]: boolean } = {
  "ironsworn/oracles/moves/ask_the_oracle/almost_certain": true,
  "ironsworn/oracles/moves/ask_the_oracle/likely": true,
  "ironsworn/oracles/moves/ask_the_oracle/50_50": true,
  "ironsworn/oracles/moves/ask_the_oracle/unlikely": true,
  "ironsworn/oracles/moves/ask_the_oracle/small_chance": true,
};
