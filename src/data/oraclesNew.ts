import { Datasworn } from "@datasworn/core";
import { oracles as ironswornOracles } from "@datasworn/ironsworn-classic/json/classic.json";
import { oracles as starforgedOracles } from "@datasworn/starforged/json/starforged.json";
import { getSystem } from "hooks/useGameSystem";
import { GAME_SYSTEMS, GameSystemChooser } from "types/GameSystems.type";

const gameSystem = getSystem();
const gameSystemOracles: GameSystemChooser<
  Record<string, Datasworn.OracleTablesCollection>
> = {
  [GAME_SYSTEMS.IRONSWORN]: ironswornOracles as Record<
    string,
    Datasworn.OracleTablesCollection
  >,
  [GAME_SYSTEMS.STARFORGED]: starforgedOracles as Record<
    string,
    Datasworn.OracleTablesCollection
  >,
};

export const oracles = gameSystemOracles[gameSystem];

export function parseOraclesIntoMaps(
  oracles: Record<string, Datasworn.OracleTablesCollection>
): {
  oracleMap: Record<
    string,
    Datasworn.OracleRollable | Datasworn.OracleCollection
  >;
  oracleCollectionMap: Record<string, Datasworn.OracleCollection>;
  oracleTablesCollectionMap: Record<string, Datasworn.OracleTablesCollection>;
  oracleRollableMap: Record<string, Datasworn.OracleRollable>;
  oracleTableRollableMap: Record<string, Datasworn.OracleTableRollable>;
} {
  const oracleMap: Record<
    string,
    Datasworn.OracleRollable | Datasworn.OracleCollection
  > = {};
  const oracleCollectionMap: Record<string, Datasworn.OracleCollection> = {};
  const oracleRollableMap: Record<string, Datasworn.OracleRollable> = {};
  const oracleTablesCollectionMap: Record<
    string,
    Datasworn.OracleTablesCollection
  > = {};
  const oracleTableRollableMap: Record<string, Datasworn.OracleTableRollable> =
    {};

  const parseOracleTableCollectionIntoMaps = (
    category: Datasworn.OracleTablesCollection
  ) => {
    oracleTablesCollectionMap[category.id] = category;
    oracleMap[category.id] = category;
    oracleCollectionMap[category.id] = category;
    Object.values(category.contents ?? {}).forEach((oracleContent) => {
      oracleMap[oracleContent.id] = oracleContent;
      oracleRollableMap[oracleContent.id] = oracleContent;
      oracleTableRollableMap[oracleContent.id] = oracleContent;
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
          (
            content:
              | Datasworn.OracleColumnSimple
              | Datasworn.OracleColumnDetails
          ) => {
            oracleMap[content.id] = content;
            oracleRollableMap[content.id] = content;
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
    oracleTableRollableMap,
  };
}

const maps = parseOraclesIntoMaps(oracles);
/** ORACLES MAP - ALL ORACLES / TABLES THAT COULD POSSIBLY END UP BEING OPENED IN A DIALOG */
export const oracleMap: Record<
  string,
  | Datasworn.OracleRollable
  | Datasworn.OracleTableSharedRolls
  | Datasworn.OracleTableSharedResults
  | Datasworn.OracleTableSharedDetails
  | Datasworn.OracleTablesCollection
  | Datasworn.OracleTableSimple
  | Datasworn.OracleTableDetails
  | Datasworn.OracleColumnSimple
  | Datasworn.OracleColumnDetails
> = maps.oracleMap;

export const oracleCollectionMap: Record<
  string,
  | Datasworn.OracleTablesCollection
  | Datasworn.OracleTableSharedRolls
  | Datasworn.OracleTableSharedDetails
  | Datasworn.OracleTableSharedResults
> = maps.oracleCollectionMap;

export const oracleRollableMap = maps.oracleRollableMap;

export const oracleTablesCollectionMap = maps.oracleTablesCollectionMap;
export const oracleTableRollableMap = maps.oracleTableRollableMap;
