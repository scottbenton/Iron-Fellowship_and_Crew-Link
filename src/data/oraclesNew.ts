import {
  OracleColumnDetails,
  OracleColumnSimple,
  OracleRollable,
  OracleTableDetails,
  OracleTableSharedDetails,
  OracleTableSharedResults,
  OracleTableSharedRolls,
  OracleTableSimple,
  OracleTablesCollection,
} from "@datasworn/core";
import { oracles as ironswornOracles } from "@datasworn/ironsworn-classic/json/classic.json";
import { oracles as starforgedOracles } from "@datasworn/starforged/json/starforged.json";
import { getSystem } from "hooks/useGameSystem";
import { GAME_SYSTEMS, GameSystemChooser } from "types/GameSystems.type";

const gameSystem = getSystem();
const gameSystemOracles: GameSystemChooser<
  Record<string, OracleTablesCollection>
> = {
  [GAME_SYSTEMS.IRONSWORN]: ironswornOracles as Record<
    string,
    OracleTablesCollection
  >,
  [GAME_SYSTEMS.STARFORGED]: starforgedOracles as Record<
    string,
    OracleTablesCollection
  >,
};

export const oracles = gameSystemOracles[gameSystem];

/** ORACLES MAP - ALL ORACLES / TABLES THAT COULD POSSIBLY END UP BEING OPENED IN A DIALOG */
export const oracleMap: Record<
  string,
  | OracleRollable
  | OracleTableSharedRolls
  | OracleTableSharedResults
  | OracleTableSharedDetails
  | OracleTablesCollection
  | OracleTableSimple
  | OracleTableDetails
  | OracleColumnSimple
  | OracleColumnDetails
> = {};

function parseOracleTablesCollectionIntoRollableOracleMap(
  category: OracleTablesCollection
) {
  Object.values(category.contents ?? {}).forEach((oracleContent) => {
    oracleMap[oracleContent.id] = oracleContent;
  });
  Object.values(category.collections ?? {}).forEach((subCollection) => {
    if (subCollection.oracle_type === "tables") {
      oracleMap[subCollection.id] = subCollection;
      parseOracleTablesCollectionIntoRollableOracleMap(subCollection);
    } else if (
      subCollection.oracle_type === "table_shared_rolls" ||
      subCollection.oracle_type === "table_shared_results" ||
      subCollection.oracle_type === "table_shared_details"
    ) {
      oracleMap[subCollection.id] = subCollection;
      Object.values(subCollection.contents ?? {}).forEach(
        (content: OracleColumnSimple | OracleColumnDetails) => {
          oracleMap[content.id] = content;
        }
      );
    }
  });
}

Object.values(oracles).forEach((oracleCategory) => {
  parseOracleTablesCollectionIntoRollableOracleMap(oracleCategory);
});
