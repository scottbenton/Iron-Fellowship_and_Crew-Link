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
import { TableColumnType } from "types/Oracles.type";
import { License } from "types/Datasworn";

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
export const category = moveCategories[gameSystem];
export const categoryOrder = categoryOrders[gameSystem];

export const orderedCategories = categoryOrder.map(
  (oracleCategoryId) => category[oracleCategoryId]
);

export let oracleCategoryMap: { [categoryId: string]: OracleSet } = {};
export let oracleMap: { [tableId: string]: DataforgedOracleTable } = {};

export const planetDescriptions: { [key: string]: string } = {};

function flattenOracleTables(
  set: OracleSet,
  subsetTitlePrefix?: Title
): {
  [tableId: string]: DataforgedOracleTable;
} {
  if (set.$id.match(/starforged\/oracles\/planets\/[a-z]+$/gi)) {
    const type = set.$id.replace("starforged/oracles/planets/", "");
    planetDescriptions[type] = set.Summary ?? "";
  }

  let newSetTables: { [tableId: string]: DataforgedOracleTable } = {};

  const sampleNames = set["Sample Names" as "Sample names"];
  if (Array.isArray(sampleNames) && sampleNames.length > 0) {
    const id = set.$id + "/sample_names";
    const size = Math.floor(100 / sampleNames.length);
    newSetTables[id] = {
      $id: id,
      Title: {
        $id: id + "/title",
        Canonical: "Sample Names",
        Standard: "Sample Names",
        Short: "Sample Names",
      },
      Display: {
        $id: id + "/display",
        Columns: [
          {
            $id: id + "/display/columns/1",
            Label: "Roll",
            Type: TableColumnType.Range,
            Content: id,
          },
          {
            $id: id + "/display/columns/2",
            Label: "Result",
            Type: TableColumnType.String,
            Content: id,
            Key: "Result",
          },
        ],
      },
      Ancestors: [],
      Source: {
        Title: "Iron Fellowship",
        Authors: [],
        License: License.None,
      },
      Table: sampleNames.map((name, index) => ({
        $id: id + "/" + index,
        Floor: index * size + 1,
        Ceiling: index * size + size,
        Result: name,
      })),
    };
  }

  Object.values(set.Tables ?? {}).forEach((table) => {
    const regex = new RegExp(/(\[⏵)|(\]\([^\)]*\))/, "gi"); //"([⏵)|(]([^)]*))"
    const fixedTable = table.Table.map((tableRow) => {
      const newRow = { ...tableRow };
      newRow.Result = tableRow.Result.replaceAll(regex, "");
      return newRow;
    });
    if (!subsetTitlePrefix) {
      newSetTables[table.$id] = {
        ...table,
        Table: fixedTable,
      };
    } else {
      newSetTables[table.$id] = {
        ...table,
        Table: fixedTable,
        Title: {
          $id: table.Title.$id,
          Short: `${subsetTitlePrefix.Short} ꞏ ${table.Title.Short}`,
          Canonical: `${subsetTitlePrefix.Canonical} ꞏ ${table.Title.Canonical}`,
          Standard: `${subsetTitlePrefix.Standard} ꞏ ${table.Title.Standard}`,
        },
      };
    }
  });

  Object.values(set.Sets ?? {}).forEach((subSet) => {
    const flattenedSets = flattenOracleTables(
      subSet,
      subsetTitlePrefix
        ? {
            $id: subSet.Title.$id,
            Short: `${subsetTitlePrefix.Short} ꞏ ${subSet.Title.Short}`,
            Canonical: `${subsetTitlePrefix.Canonical} ꞏ ${subSet.Title.Canonical}`,
            Standard: `${subsetTitlePrefix.Standard} ꞏ ${subSet.Title.Standard}`,
          }
        : subSet.Title
    );
    newSetTables = {
      ...newSetTables,
      ...flattenedSets,
    };
  });

  return newSetTables;
}

Object.keys(category).forEach((oracleCategoryId) => {
  const oracleCategory = category[oracleCategoryId];
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
