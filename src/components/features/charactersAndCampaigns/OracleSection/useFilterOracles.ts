import { Datasworn } from "@datasworn/core";
import { useMemo } from "react";
import {
  CATEGORY_VISIBILITY,
  useDataswornCollectionFilter,
} from "hooks/useDataswornCollectionFilter";
import { useStore } from "stores/store";
import { License } from "types/Datasworn";
import { getOracleSubCollections } from "./oracleCollectionUtils";

export { CATEGORY_VISIBILITY };

type omittedKeys = "oracle_type" | "contents";
export interface IPinnedOracleCollection
  extends Omit<Datasworn.OracleTablesCollection, omittedKeys> {
  oracle_type: "pinned_oracles";
  contents: Record<string, Datasworn.OracleRollable>;
}

export type CombinedCollectionType =
  | Datasworn.OracleCollection
  | IPinnedOracleCollection;

export function useFilterOracles() {
  const oracleCollectionsWithoutPinnedOracles = useStore(
    (store) => store.rules.oracleMaps.oracleCollectionMap
  );
  const oracles = useStore((store) => store.rules.oracleMaps.oracleRollableMap);
  const rootOraclesWithoutPinnedOracles = useStore(
    (store) => store.rules.rootOracleCollectionIds
  );

  const pinnedOracles = useStore((store) => store.settings.pinnedOraclesIds);

  const { oracleCollections, rootOracles } = useMemo<{
    oracleCollections: Record<string, CombinedCollectionType>;
    rootOracles: string[];
  }>(() => {
    const pinnedOracleRollables: Record<string, Datasworn.OracleRollable> = {};

    Object.keys(pinnedOracles).forEach((id) => {
      const oracle = oracles[id];
      if (pinnedOracles[id] && oracle) {
        pinnedOracleRollables[id] = oracle;
      }
    });

    if (Object.keys(pinnedOracleRollables).length > 0) {
      const pinnedOracleId = "app/collections/oracles/pinned";

      const collection: IPinnedOracleCollection = {
        collections: {},
        _id: pinnedOracleId,
        name: "Pinned Oracles",
        type: "oracle_collection",
        _source: {
          title: "Pinned Oracles",
          authors: [],
          date: "2000-01-01",
          url: "",
          license: License.None,
        },
        contents: pinnedOracleRollables,
        oracle_type: "pinned_oracles",
      };

      return {
        oracleCollections: {
          [pinnedOracleId]: collection,
          ...oracleCollectionsWithoutPinnedOracles,
        },
        rootOracles: [pinnedOracleId, ...rootOraclesWithoutPinnedOracles],
      };
    }
    return {
      oracleCollections: oracleCollectionsWithoutPinnedOracles,
      rootOracles: rootOraclesWithoutPinnedOracles,
    };
  }, [
    oracles,
    pinnedOracles,
    oracleCollectionsWithoutPinnedOracles,
    rootOraclesWithoutPinnedOracles,
  ]);

  const {
    setSearch,
    visibleCollectionIds,
    visibleItemIds,
    isSearchActive,
    isEmpty,
  } = useDataswornCollectionFilter<
    CombinedCollectionType,
    Datasworn.OracleRollable
  >({
    collections: oracleCollections,
    rootCollectionIds: rootOracles,
    getSubCollections: getOracleSubCollections,
  });

  return {
    oracleCollections,
    oracles,
    setSearch,
    visibleOracleCollectionIds: visibleCollectionIds,
    visibleOracleIds: visibleItemIds,
    isSearchActive,
    isEmpty,
    rootOracles,
  };
}
