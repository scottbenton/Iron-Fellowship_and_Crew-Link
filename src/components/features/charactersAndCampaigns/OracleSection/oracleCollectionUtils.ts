import type { CombinedCollectionType } from "./useFilterOracles";

export function getOracleSubCollections(collection: CombinedCollectionType) {
  if (collection.oracle_type !== "tables") {
    return [];
  }

  return Object.values(collection.collections ?? {}) as CombinedCollectionType[];
}

export function getOracleIdsForCollection(collection: CombinedCollectionType) {
  return {
    oracleIds: Object.values(collection.contents ?? {}).map(
      (oracle) => oracle._id,
    ),
    subCollectionIds: getOracleSubCollections(collection).map(
      (subCollection) => subCollection._id,
    ),
  };
}
