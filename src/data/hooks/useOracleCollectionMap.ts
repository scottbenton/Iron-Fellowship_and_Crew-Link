import { Datasworn } from "@datasworn/core";
import { oracleCollectionMap } from "data/oraclesNew";
import { useStore } from "stores/store";

export function useOracleCollectionMap(
  homebrewIds?: string[]
): Record<string, Datasworn.OracleCollection> {
  const collectionMap = useStore((store) => {
    const collections = { ...oracleCollectionMap };

    (homebrewIds ?? []).forEach((homebrewId) => {
      const homebrewOracleCollections =
        store.homebrew.collections[homebrewId]?.dataswornOracles ?? {};

      Object.keys(homebrewOracleCollections).forEach((collectionId) => {
        const collection = homebrewOracleCollections[collectionId];
        if (collection.replaces) {
          collections[collection.replaces] =
            homebrewOracleCollections[collectionId];
        }

        collections[collectionId] = homebrewOracleCollections[collectionId];
      });
    });

    return collections;
  });

  return collectionMap;
}
