import {
  oracleTablesCollectionMap,
  parseOraclesIntoMaps,
} from "data/oraclesNew";
import { useStore } from "stores/store";

export function useOracleTablesCollectionMap(homebrewIds?: string[]) {
  const collectionMap = useStore((store) => {
    const collections = { ...oracleTablesCollectionMap };

    (homebrewIds ?? []).forEach((homebrewId) => {
      const homebrewOracles =
        store.homebrew.collections[homebrewId]?.dataswornOracles ?? {};
      const homebrewOracleCollections =
        parseOraclesIntoMaps(homebrewOracles).oracleTablesCollectionMap;

      Object.keys(homebrewOracleCollections).forEach((collectionId) => {
        const collection = homebrewOracleCollections[collectionId];
        collections[collection.replaces ?? collectionId] =
          homebrewOracleCollections[collectionId];
      });
    });

    return collections;
  });

  return collectionMap;
}
