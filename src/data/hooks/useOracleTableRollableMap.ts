import { oracleTableRollableMap, parseOraclesIntoMaps } from "data/oraclesNew";
import { useStore } from "stores/store";

export function useOracleTableRollableMap(homebrewIds?: string[]) {
  const tableRollableMap = useStore((store) => {
    const rollables = { ...oracleTableRollableMap };

    (homebrewIds ?? []).forEach((homebrewId) => {
      const homebrewOracles =
        store.homebrew.collections[homebrewId]?.oracles?.data ?? {};
      const homebrewTableRollables =
        parseOraclesIntoMaps(homebrewOracles).oracleTableRollableMap;

      Object.keys(homebrewTableRollables).forEach((rollableId) => {
        const rollable = homebrewTableRollables[rollableId];
        if (rollable.replaces) {
          rollables[rollable.replaces] = homebrewTableRollables[rollableId];
        }

        rollables[rollableId] = homebrewTableRollables[rollableId];
      });
    });

    return rollables;
  });

  return tableRollableMap;
}
