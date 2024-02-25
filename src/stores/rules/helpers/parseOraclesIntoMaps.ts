import { Datasworn } from "@datasworn/core";
import { RulesSliceData } from "../rules.slice.type";

export function parseOraclesIntoMaps(
  oracles: Record<string, Datasworn.OracleTablesCollection>
): RulesSliceData["oracleMaps"] {
  const allOraclesMap: Record<
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
    allOraclesMap[category.id] = category;
    oracleCollectionMap[category.id] = category;
    Object.values(category.contents ?? {}).forEach((oracleContent) => {
      allOraclesMap[oracleContent.id] = oracleContent;
      oracleRollableMap[oracleContent.id] = oracleContent;
      oracleTableRollableMap[oracleContent.id] = oracleContent;
    });
    Object.values(category.collections ?? {}).forEach((subCollection) => {
      oracleCollectionMap[subCollection.id] = subCollection;
      if (subCollection.replaces) {
        oracleCollectionMap[subCollection.replaces] = subCollection;
      }
      if (subCollection.oracle_type === "tables") {
        allOraclesMap[subCollection.id] = subCollection;
        parseOracleTableCollectionIntoMaps(subCollection);
      } else if (
        subCollection.oracle_type === "table_shared_rolls" ||
        subCollection.oracle_type === "table_shared_results" ||
        subCollection.oracle_type === "table_shared_details"
      ) {
        allOraclesMap[subCollection.id] = subCollection;
        Object.values(subCollection.contents ?? {}).forEach(
          (
            content:
              | Datasworn.OracleColumnSimple
              | Datasworn.OracleColumnDetails
          ) => {
            allOraclesMap[content.id] = content;
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
    allOraclesMap,
    oracleCollectionMap,
    oracleRollableMap,
    oracleTableRollableMap,
  };
}
