import { Datasworn } from "@datasworn-community/core";
import { License } from "types/Datasworn";
import { HomebrewOracleTableDocument } from "api-calls/homebrew/oracles/tables/_homebrewOracleTable.type";
import { HomebrewOracleCollectionDocument } from "api-calls/homebrew/oracles/collections/_homebrewOracleCollection.type";

const DEFAULT_SOURCE: Datasworn.SourceInfo = {
  title: "Homebrew Content",
  authors: [],
  date: "2000-01-01",
  url: "",
  license: License.None,
};

export function convertStoredOraclesToCollections(
  homebrewId: string,
  storedCollections: Record<string, HomebrewOracleCollectionDocument>,
  storedTables: Record<string, HomebrewOracleTableDocument>
): Record<string, Datasworn.OracleTablesCollection> {
  const collections: Record<string, Datasworn.OracleTablesCollection> = {};

  const collectionParentMap: Record<string, string[]> = {};
  const tableParentMap: Record<string, string[]> = {};

  Object.keys(storedCollections)
    .sort((c1, c2) =>
      storedCollections[c1].label.localeCompare(storedCollections[c2].label)
    )
    .forEach((collectionId) => {
      const parentId = storedCollections[collectionId].parentOracleCollectionId;
      if (parentId) {
        if (!collectionParentMap[parentId]) {
          collectionParentMap[parentId] = [];
        }
        collectionParentMap[parentId].push(collectionId);
      } else {
        const storedCollection = storedCollections[collectionId];
        collections[collectionId] = {
          _id: `oracle_collection:${homebrewId}/${collectionId}`,
          type: "oracle_collection",
          name: storedCollection.label,
          _source: DEFAULT_SOURCE,
          description: storedCollection.description,
          enhances: storedCollection.enhancesId
            ? [storedCollection.enhancesId]
            : undefined,
          replaces: storedCollection.replacesId
            ? [storedCollection.replacesId]
            : undefined,
          contents: {},
          collections: {},
          oracle_type: "tables",
        };
      }
    });

  Object.keys(storedTables)
    .sort((t1, t2) =>
      storedTables[t1].label.localeCompare(storedTables[t2].label)
    )
    .forEach((tableId) => {
      const table = storedTables[tableId];
      if (!tableParentMap[table.oracleCollectionId]) {
        tableParentMap[table.oracleCollectionId] = [];
      }
      tableParentMap[table.oracleCollectionId].push(tableId);
    });

  Object.keys(collections)
    .sort((c1, c2) => collections[c1].name.localeCompare(collections[c2].name))
    .forEach((collectionId) => {
      populateCollection(
        collectionId,
        collections[collectionId],
        storedCollections,
        collectionParentMap,
        storedTables,
        tableParentMap
      );
    });

  return collections;
}

function populateCollection(
  collectionId: string,
  collection: Datasworn.OracleCollection,
  collections: Record<string, HomebrewOracleCollectionDocument>,
  storedCollectionParentMap: Record<string, string[]>,
  tables: Record<string, HomebrewOracleTableDocument>,
  storedTableParentMap: Record<string, string[]>
): Datasworn.OracleCollection {
  const collectionIds = storedCollectionParentMap[collectionId] ?? [];

  if (collection.oracle_type === "tables") {
    collectionIds
      .sort((c1, c2) =>
        collections[c1].label.localeCompare(collections[c2].label)
      )
      .forEach((subCollectionId) => {
        const subColl = collections[subCollectionId];

        if (!collection.collections) {
          collection.collections = {};
        }
        if (collection.collections) {
          const subCollectionDataswornId = `${collection._id}/${subCollectionId}`;

          const subCollection: Datasworn.OracleTablesCollection = {
            _id: subCollectionDataswornId,
            name: subColl.label,
            _source: DEFAULT_SOURCE,
            description: subColl.description,
            enhances: subColl.enhancesId ? [subColl.enhancesId] : undefined,
            replaces: subColl.replacesId ? [subColl.replacesId] : undefined,
            contents: {},
            collections: {},
            type: "oracle_collection",
            oracle_type: "tables",
          };

          populateCollection(
            subCollectionId,
            subCollection,
            collections,
            storedCollectionParentMap,
            tables,
            storedTableParentMap
          );

          collection.collections[subCollectionId] = subCollection;
        }
      });
  }

  const tableIds = storedTableParentMap[collectionId] ?? [];

  tableIds
    .sort((t1, t2) => tables[t1].label.localeCompare(tables[t2].label))
    .forEach((tableId) => {
      const table = tables[tableId];
      if (!collection.contents) {
        collection.contents = {};
      }
      if (collection.contents) {
        const tableDataswornId = `${collection._id.replace(
          "oracle_collection",
          "oracle_rollable"
        )}/${tableId}`;

        const hasDetails = table.columnLabels.detail;
        const tableType: "table_text" | "table_text2" = hasDetails
          ? "table_text2"
          : "table_text";
        const rows: Datasworn.OracleRollableRow[] = [];

        let total = 0;
        let runningMin = 1;

        table.rows.forEach((row, index) => {
          const min = runningMin;
          const max = runningMin + row.chance - 1;
          rows.push(
            hasDetails
              ? {
                  _id: `${tableDataswornId}.${index}`,
                  roll: {
                    min,
                    max,
                  },
                  text: row.result,
                  text2: row.detail ?? null,
                }
              : {
                  _id: `${tableDataswornId}.${index}`,
                  roll: {
                    min,
                    max,
                  },
                  text: row.result,
                }
          );

          runningMin += row.chance;
          total += row.chance;
        });

        const columnLabels = hasDetails
          ? {
              roll: table.columnLabels.roll,
              text: table.columnLabels.result,
              text2: table.columnLabels.detail,
            }
          : {
              roll: table.columnLabels.roll,
              text: table.columnLabels.result,
            };

        const oracle = {
          _id: tableDataswornId,
          type: "oracle_rollable",
          name: table.label,
          description: table.description,
          oracle_type: tableType,
          dice: `1d${total}`,
          replaces: table.replaces ? [table.replaces] : undefined,
          _source: DEFAULT_SOURCE,
          column_labels: columnLabels,
          rows,
        } as Datasworn.OracleRollable;

        collection.contents[tableId] = oracle;
      }
    });

  return collection;
}
