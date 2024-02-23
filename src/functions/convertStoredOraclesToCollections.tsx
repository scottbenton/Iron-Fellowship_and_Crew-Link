import { Datasworn } from "@datasworn/core";
import { License } from "types/Datasworn";
import {
  StoredOracleCollection,
  StoredOracleTable,
} from "types/homebrew/HomebrewOracles.type";

const DEFAULT_SOURCE: Datasworn.SourceInfo = {
  title: "Homebrew Content",
  authors: [],
  date: "2000-01-01",
  url: "",
  license: License.None,
};

export function convertStoredOraclesToCollections(
  homebrewId: string,
  storedCollections: Record<string, StoredOracleCollection>,
  storedTables: Record<string, StoredOracleTable>
): Record<string, Datasworn.OracleTablesCollection> {
  const collections: Record<string, Datasworn.OracleTablesCollection> = {};

  const collectionParentMap: Record<string, string[]> = {};
  const tableParentMap: Record<string, string[]> = {};

  Object.keys(storedCollections).forEach((collectionId) => {
    const parentId = storedCollections[collectionId].parentOracleCollectionId;
    if (parentId) {
      if (!collectionParentMap[parentId]) {
        collectionParentMap[parentId] = [];
      }
      collectionParentMap[parentId].push(collectionId);
    } else {
      const storedCollection = storedCollections[collectionId];
      collections[collectionId] = {
        id: `${homebrewId}/collections/oracles/${collectionId}`,
        name: storedCollection.label,
        source: DEFAULT_SOURCE,
        description: storedCollection.description,
        enhances: storedCollection.enhancesId,
        replaces: storedCollection.replacesId,
        contents: {},
        collections: {},
        oracle_type: "tables",
      };
    }
  });

  Object.keys(storedTables).forEach((tableId) => {
    const table = storedTables[tableId];
    if (!tableParentMap[table.oracleCollectionId]) {
      tableParentMap[table.oracleCollectionId] = [];
    }
    tableParentMap[table.oracleCollectionId].push(tableId);
  });

  Object.keys(collections).forEach((collectionId) => {
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
  collections: Record<string, StoredOracleCollection>,
  storedCollectionParentMap: Record<string, string[]>,
  tables: Record<string, StoredOracleTable>,
  storedTableParentMap: Record<string, string[]>
): Datasworn.OracleCollection {
  const collectionIds = storedCollectionParentMap[collectionId];

  if (collection.oracle_type === "tables") {
    collectionIds.forEach((subCollectionId) => {
      const subColl = collections[subCollectionId];

      if (!collection.collections) {
        collection.collections = {};
      }
      if (collection.collections) {
        const subCollectionDataswornId = `${collection.id}/${subCollectionId}`;

        const subCollection: Datasworn.OracleTablesCollection = {
          id: subCollectionDataswornId,
          name: subColl.label,
          source: DEFAULT_SOURCE,
          description: subColl.description,
          enhances: subColl.enhancesId,
          replaces: subColl.replacesId,
          contents: {},
          collections: {},
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

  const tableIds = storedTableParentMap[collectionId];

  tableIds.forEach((tableId) => {
    const table = tables[tableId];
    if (!collection.contents) {
      collection.contents = {};
    }
    if (collection.contents) {
      const tableDataswornId = `${collection.id}/${tableId}`;

      const hasDetails = table.columnLabels.detail;
      const tableType: "table_simple" | "table_details" = "table_simple";
      const rows:
        | Datasworn.OracleTableRow[]
        | Datasworn.OracleTableRowDetails[] = [];

      let total = 0;
      let runningMin = 1;

      table.rows.forEach((row) => {
        const min = runningMin;
        const max = runningMin + row.chance - 1;
        rows.push(
          hasDetails
            ? {
                id: `${tableDataswornId}/${min}-${max}`,
                min,
                max,
                result: row.result,
                detail: row.detail ?? null,
              }
            : {
                id: `${tableDataswornId}/${min}-${max}`,
                min,
                max,
                result: row.result,
                detail: null,
              }
        );

        runningMin += row.chance;
        total += row.chance;
      });

      collection.contents[tableId] = {
        id: tableDataswornId,
        name: table.label,
        description: table.description,
        oracle_type: tableType,
        dice: `1d${total}`,
        replaces: table.replaces,
        source: DEFAULT_SOURCE,
        column_labels: table.columnLabels,
        rows,
      };
    }
  });

  return collection;
}
