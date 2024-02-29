import { Datasworn } from "@datasworn/core";
import { useMemo, useState } from "react";
import { useStore } from "stores/store";

export enum CATEGORY_VISIBILITY {
  HIDDEN,
  SOME,
  ALL,
}

export function useFilterOracles() {
  const [search, setSearch] = useState("");
  const oracleCollections = useStore(
    (store) => store.rules.oracleMaps.oracleCollectionMap
  );
  const oracles = useStore((store) => store.rules.oracleMaps.oracleRollableMap);
  const rootOracles = useStore((store) => store.rules.rootOracleCollectionIds);

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

    const filterCollection = (
      collection: Datasworn.OracleCollection
    ): boolean => {
      if (collection.enhances) {
        enhancesCollections[collection.enhances] = [
          ...(enhancesCollections[collection.enhances] ?? []),
          collection.id,
        ];
      }

      const hasChildren =
        (collection.oracle_type === "tables" &&
          Object.keys(collection.collections ?? {}).length > 0) ||
        Object.keys(collection.contents ?? {}).length > 0;

      const searchIncludesCollectionName =
        !search ||
        collection.name
          .toLocaleLowerCase()
          .includes(search.toLocaleLowerCase());

      if (hasChildren && searchIncludesCollectionName) {
        isEmpty = false;
        visibleCollections[collection.id] = CATEGORY_VISIBILITY.ALL;
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
          (
            table:
              | Datasworn.OracleTableRollable
              | Datasworn.OracleColumnSimple
              | Datasworn.OracleColumnDetails
          ) => {
            if (
              table &&
              table.name
                .toLocaleLowerCase()
                .includes(search.toLocaleLowerCase())
            ) {
              visibleOracles[table.id] = true;
              hasOracles = true;
            }
          }
        );
      }

      if (hasOracles) {
        isEmpty = false;
        visibleCollections[collection.id] = CATEGORY_VISIBILITY.SOME;
      } else {
        visibleCollections[collection.id] = CATEGORY_VISIBILITY.HIDDEN;
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

  console.debug(visibleOracleCollectionIds, visibleOracleIds);
  console.count("Reran use filter oracles");
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
