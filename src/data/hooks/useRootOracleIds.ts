import { oracles as baseOracles } from "data/oraclesNew";
import { useStore } from "stores/store";

export function useRootOracleIds(homebrewIds?: string[]) {
  const rootOracleIds = useStore((store) => {
    const rootCollectionIds: string[] = [];

    Object.values(baseOracles).forEach((baseOracle) => {
      rootCollectionIds.push(baseOracle.id);
    });

    (homebrewIds ?? []).forEach((homebrewId) => {
      const homebrewOracleCollections =
        store.homebrew.collections[homebrewId]?.dataswornOracles ?? {};

      Object.keys(homebrewOracleCollections).filter((collectionId) => {
        const oracle = homebrewOracleCollections[collectionId];
        if (!oracle.replaces && !oracle.enhances) {
          rootCollectionIds.push(homebrewId);
        }
      });
    });
    return rootCollectionIds;
  });

  return rootOracleIds;
}
