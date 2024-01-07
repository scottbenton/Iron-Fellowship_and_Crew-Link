import {
  OracleCollection,
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

export function parseOraclesIntoMaps(
  oracles: Record<string, OracleTablesCollection>
): {
  oracleMap: Record<string, OracleRollable | OracleCollection>;
  oracleCollectionMap: Record<string, OracleCollection>;
  oracleTablesCollectionMap: Record<string, OracleTablesCollection>;
  oracleRollableMap: Record<string, OracleRollable>;
} {
  const oracleMap: Record<string, OracleRollable | OracleCollection> = {};
  const oracleCollectionMap: Record<string, OracleCollection> = {};
  const oracleRollableMap: Record<string, OracleRollable> = {};
  const oracleTablesCollectionMap: Record<string, OracleTablesCollection> = {};

  const parseOracleTableCollectionIntoMaps = (
    category: OracleTablesCollection
  ) => {
    oracleTablesCollectionMap[category.id] = category;
    oracleMap[category.id] = category;
    oracleCollectionMap[category.id] = category;
    Object.values(category.contents ?? {}).forEach((oracleContent) => {
      oracleMap[oracleContent.id] = oracleContent;
      oracleRollableMap[oracleContent.id] = oracleContent;
    });
    Object.values(category.collections ?? {}).forEach((subCollection) => {
      oracleCollectionMap[subCollection.id] = subCollection;
      if (subCollection.oracle_type === "tables") {
        oracleMap[subCollection.id] = subCollection;
        parseOracleTableCollectionIntoMaps(subCollection);
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
  };

  Object.values(oracles).forEach((oracleTableCollection) => {
    parseOracleTableCollectionIntoMaps(oracleTableCollection);
  });

  return {
    oracleMap,
    oracleCollectionMap,
    oracleRollableMap,
    oracleTablesCollectionMap,
  };
}

const maps = parseOraclesIntoMaps(oracles);
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
> = maps.oracleMap;

export const oracleCollectionMap: Record<
  string,
  | OracleTablesCollection
  | OracleTableSharedRolls
  | OracleTableSharedDetails
  | OracleTableSharedResults
> = maps.oracleCollectionMap;

export const oracleRollableMap: Record<
  string,
  | OracleRollable
  | OracleTableSimple
  | OracleTableDetails
  | OracleColumnSimple
  | OracleColumnDetails
> = maps.oracleRollableMap;

export const oracleTablesCollectionMap = maps.oracleTablesCollectionMap;
