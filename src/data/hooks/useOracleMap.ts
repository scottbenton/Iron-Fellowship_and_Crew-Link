import { oracleMap, parseOraclesIntoMaps } from "data/oraclesNew";
import { useStore } from "stores/store";

export function useOracleMap(homebrewIds: string[] = []) {
  const map = useStore((store) => {
    const oracles = { ...oracleMap };

    homebrewIds.forEach((homebrewId) => {
      const homebrewOracles =
        store.homebrew.collections[homebrewId]?.dataswornOracles ?? {};

      const homebrewOracleMap = parseOraclesIntoMaps(homebrewOracles).oracleMap;

      Object.keys(homebrewOracleMap).forEach((oracleId) => {
        const oracle = homebrewOracleMap[oracleId];
        if (oracle.replaces) {
          oracles[oracle.replaces] = homebrewOracleMap[oracleId];
        }
        oracles[oracle.id] = homebrewOracleMap[oracleId];
      });
    });

    return oracles;
  });

  return map;
}
