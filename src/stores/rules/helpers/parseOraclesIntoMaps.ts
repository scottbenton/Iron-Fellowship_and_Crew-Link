import {
  Datasworn,
  IdParser,
  PrimaryStringId,
} from "@datasworn-community/core";
import { RulesSliceData } from "../rules.slice.type";
import { idMap } from "data/idMap";

export function parseOraclesIntoMaps(
  oracles: Record<string, Datasworn.OracleTablesCollection>,
  sort?: boolean
): RulesSliceData["oracleMaps"] {
  const allOraclesMap: Record<
    string,
    Datasworn.OracleRollable | Datasworn.OracleCollection
  > = {};
  const oracleCollectionMap: Record<string, Datasworn.OracleCollection> = {};
  const nonReplacedOracleCollectionMap: Record<
    string,
    Datasworn.OracleCollection
  > = {};
  const oracleRollableMap: Record<string, Datasworn.OracleRollable> = {};
  const nonReplacedOracleRollableMap: Record<string, Datasworn.OracleRollable> =
    {};
  const oracleTableRollableMap: Record<string, Datasworn.OracleRollableTable> =
    {};
  const nonReplacedOracleTableRollableMap: Record<
    string,
    Datasworn.OracleRollableTable
  > = {};

  const parseOracleTableCollectionIntoMaps = (
    category: Datasworn.OracleCollection
  ) => {
    allOraclesMap[category._id] = category;
    oracleCollectionMap[category._id] = category;
    nonReplacedOracleCollectionMap[category._id] = category;
    // TODO - check and make sure this replaces properly
    if (category.replaces) {
      category.replaces.forEach((replaces) => {
        let replacesId = replaces;
        if (!replacesId.startsWith("oracle_collection:")) {
          replacesId = idMap[replaces] ?? replaces;
        }
        if (replacesId.startsWith("oracle_collection:")) {
          const replaceMatches = IdParser.getMatches(
            replacesId as PrimaryStringId,
            IdParser.tree
          );
          replaceMatches.forEach((val, key) => {
            if (val.type === "oracle_collection") {
              allOraclesMap[key] = category;
              oracleCollectionMap[key] = category;
            }
          });
        }
      });
    }
    if (category.contents) {
      const sortedContents = sort
        ? Object.values(category.contents).sort((a, b) =>
            a.name.localeCompare(b.name)
          )
        : Object.values(category.contents);
      sortedContents.forEach((oracleContent: Datasworn.OracleRollable) => {
        allOraclesMap[oracleContent._id] = oracleContent;
        oracleRollableMap[oracleContent._id] = oracleContent;
        nonReplacedOracleRollableMap[oracleContent._id] = oracleContent;
        if (
          oracleContent.oracle_type === "table_text" ||
          oracleContent.oracle_type === "table_text2" ||
          oracleContent.oracle_type === "table_text3"
        ) {
          oracleTableRollableMap[oracleContent._id] = oracleContent;
          nonReplacedOracleTableRollableMap[oracleContent._id] = oracleContent;
        }
        // TODO - check and make sure this is replaced properly
        if (oracleContent.replaces) {
          oracleContent.replaces.forEach((replaces) => {
            let replacesId = replaces;
            if (!replaces.startsWith("oracle_rollable:")) {
              replacesId = idMap[replaces] ?? replaces;
            }

            if (replacesId.startsWith("oracle_rollable:")) {
              const replaceMatches = IdParser.getMatches(
                replacesId as PrimaryStringId,
                IdParser.tree
              );
              replaceMatches.forEach((val, key) => {
                if (val.type === "oracle_rollable") {
                  oracleRollableMap[key] = oracleContent;
                  allOraclesMap[key] = oracleContent;
                }
                const oracleRollableTableTypes = [
                  "table_text",
                  "table_text2",
                  "table_text3",
                ];
                if (oracleRollableTableTypes.includes(oracleContent.type)) {
                  oracleTableRollableMap[key] =
                    oracleContent as Datasworn.OracleRollableTable;
                }
              });
            }
          });
        }
      });
    }

    if (category.oracle_type === "tables") {
      const sortedCollections = sort
        ? Object.values(category.collections ?? {}).sort((a, b) =>
            a.name.localeCompare(b.name)
          )
        : Object.values(category.collections ?? {});
      sortedCollections.forEach((subCollection) => {
        parseOracleTableCollectionIntoMaps(subCollection);
      });
    }
  };

  const sortedOracleCollections = sort
    ? Object.values(oracles).sort((a, b) => a.name.localeCompare(b.name))
    : Object.values(oracles);

  sortedOracleCollections.forEach((oracleTableCollection) => {
    parseOracleTableCollectionIntoMaps(oracleTableCollection);
  });

  return {
    allOraclesMap,
    oracleCollectionMap,
    nonReplacedOracleCollectionMap,
    oracleRollableMap,
    nonReplacedOracleRollableMap,
    oracleTableRollableMap,
    nonReplacedOracleTableRollableMap,
  };
}
