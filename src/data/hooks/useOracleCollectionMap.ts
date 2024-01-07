import { oracleCollectionMap, parseOraclesIntoMaps } from "data/oraclesNew";
import { useStore } from "stores/store";

export function useOracleCollectionMap(homebrewIds?: string[]) {
  const collectionMap = useStore((store) => {
    const collections = { ...oracleCollectionMap };

    (homebrewIds ?? []).forEach((homebrewId) => {
      const homebrewOracles =
        store.homebrew.collections[homebrewId]?.oracles?.data ?? {};
      const homebrewOracleCollections =
        parseOraclesIntoMaps(homebrewOracles).oracleCollectionMap;

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
