import { oracles as baseOracles } from "data/oraclesNew";
import { useStore } from "stores/store";

export function useRootOracleIds(homebrewIds?: string[]) {
  const rootOracleIds = useStore((store) => {
    const rootCollectionIds: string[] = [];

    Object.values(baseOracles).forEach((baseOracle) => {
      rootCollectionIds.push(baseOracle.id);
    });

    (homebrewIds ?? []).forEach((homebrewId) => {
      const homebrewOracles =
        store.homebrew.collections[homebrewId]?.oracles?.data ?? {};

      Object.keys(homebrewOracles).forEach((homebrewOracleId) => {
        const oracle = homebrewOracles[homebrewOracleId];
        if (!oracle.replaces) {
          rootCollectionIds.push(homebrewOracleId);
        }
      });
    });
    return rootCollectionIds;
  });

  return rootOracleIds;
}
