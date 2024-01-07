import { oracleRollableMap, parseOraclesIntoMaps } from "data/oraclesNew";
import { useStore } from "stores/store";

export function useOracleRollableMap(homebrewIds: string[] = []) {
  const rollableMap = useStore((store) => {
    const rollables = { ...oracleRollableMap };

    homebrewIds.forEach((homebrewId) => {
      const homebrewOracles =
        store.homebrew.collections[homebrewId]?.oracles?.data ?? {};
      const homebrewOracleRollables =
        parseOraclesIntoMaps(homebrewOracles).oracleRollableMap;

      Object.keys(homebrewOracleRollables).forEach((rollableId) => {
        const collection = homebrewOracleRollables[rollableId];
        rollables[collection.replaces ?? rollableId] =
          homebrewOracleRollables[rollableId];
      });
    });

    return rollables;
  });

  return rollableMap;
}
