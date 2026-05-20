import { Datasworn } from "@datasworn/core";
import { useMemo, useState } from "react";
import { useStore } from "stores/store";
import { License } from "types/Datasworn";

export enum CATEGORY_VISIBILITY {
  HIDDEN,
  SOME,
  ALL,
}

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
  const [search, setSearch] = useState("");
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
    visibleOracleCollectionIds,
    visibleOracleIds,
    isEmpty,
    enhancesCollections,
  } = useMemo(() => {
    const visibleCollections: Record<string, CATEGORY_VISIBILITY> = {};
    const visibleOracles: Record<string, boolean> = {};
    let isEmpty: boolean = true;

    const enhancesCollections: Record<string, string[]> = {};

    const filterCollection = (collection: CombinedCollectionType): boolean => {
      // TODO -double check this
      // if (collection.enhances) {
      //   enhancesCollections[collection.enhances] = [
      //     ...(enhancesCollections[collection.enhances] ?? []),
      //     collection._id,
      //   ];
      // }

      const hasChildren =
        (collection.oracle_type === "tables" &&
          Object.keys(
            (collection as unknown as Datasworn.OracleTablesCollection)
              .collections ?? {}
          ).length > 0) ||
        Object.keys(collection.contents ?? {}).length > 0;

      const searchIncludesCollectionName =
        !search ||
        collection.name
          .toLocaleLowerCase()
          .includes(search.toLocaleLowerCase());

      if (hasChildren && searchIncludesCollectionName) {
        isEmpty = false;
        visibleCollections[collection._id] = CATEGORY_VISIBILITY.ALL;
        return true;
      }

      let hasOracles = false;

      if (collection.oracle_type === "tables" && collection.collections) {
        Object.values(collection.collections).forEach((subCollection) => {
          if (filterCollection(subCollection)) {
            hasOracles = true;
          }
        });
      }
      if (collection.contents) {
        Object.values(collection.contents).forEach(
          (table: Datasworn.OracleRollable) => {
            if (
              table &&
              table.name
                .toLocaleLowerCase()
                .includes(search.toLocaleLowerCase())
            ) {
              visibleOracles[table._id] = true;
              hasOracles = true;
            }
          }
        );
      }

      if (hasOracles) {
        isEmpty = false;
        visibleCollections[collection._id] = CATEGORY_VISIBILITY.SOME;
        // TODO - check this
        // if (collection.enhances) {
        //   visibleCollections[collection.enhances] = CATEGORY_VISIBILITY.SOME;
        // }
      } else {
        visibleCollections[collection._id] = CATEGORY_VISIBILITY.HIDDEN;
      }

      return hasOracles;
    };
    Object.values(oracleCollections).forEach((collection) => {
      filterCollection(collection);
    });

    return {
      visibleOracleCollectionIds: visibleCollections,
      visibleOracleIds: visibleOracles,
      isEmpty,
      enhancesCollections,
    };
  }, [oracleCollections, search]);

  return {
    oracleCollections,
    oracles,
    setSearch,
    visibleOracleCollectionIds,
    visibleOracleIds,
    isSearchActive: !!search,
    isEmpty,
    rootOracles,
    enhancesCollections,
  };
}
