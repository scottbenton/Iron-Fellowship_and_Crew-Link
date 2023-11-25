import { useMemo, useState } from "react";
import type { OracleSet } from "dataforged";
import { useOracles } from "./useOracles";
import { useStore } from "stores/store";

export enum CATEGORY_VISIBILITY {
  HIDDEN,
  SOME,
  ALL,
}

export function useFilterOracles() {
  const [search, setSearch] = useState("");
  const oracleCategories = useOracles();
  const showDelveOracles = useStore(
    (store) => store.settings.delve.showDelveOracles
  );

  const { visibleOracleCategoryIds, visibleOracleIds, isEmpty } =
    useMemo(() => {
      const visibleCategories: Record<string, CATEGORY_VISIBILITY> = {};
      const visibleOracles: Record<string, boolean> = {};
      let isEmpty: boolean = true;

      const isDelveSet = (set: OracleSet): boolean => {
        return set.Source.Title === "Ironsworn: Delve";
      };

      const hideRemainingDelveSets = (set: OracleSet): void => {
        if (isDelveSet(set)) {
          visibleCategories[set.$id] = CATEGORY_VISIBILITY.HIDDEN;
        } else {
          Object.values(set.Sets ?? {}).forEach((set) => {
            hideRemainingDelveSets(set);
          });
        }
      };

      const filterSet = (set: OracleSet): boolean => {
        if (!showDelveOracles && isDelveSet(set)) {
          visibleCategories[set.$id] = CATEGORY_VISIBILITY.HIDDEN;
          return false;
        }

        if (
          (Object.keys(set.Tables ?? {}).length > 0 ||
            Object.keys(set.Sets ?? {}).length > 0) &&
          (!search ||
            set.Title.Standard.toLocaleLowerCase().includes(
              search.toLocaleLowerCase()
            ))
        ) {
          isEmpty = false;
          visibleCategories[set.$id] = CATEGORY_VISIBILITY.ALL;
          if (!showDelveOracles) {
            hideRemainingDelveSets(set);
          }
          return true;
        }
        let hasOracles = false;

        Object.values(set.Sets ?? {}).forEach((set) => {
          if (filterSet(set)) {
            hasOracles = true;
          }
        });
        Object.values(set.Tables ?? {}).forEach((table) => {
          if (
            table &&
            table.Title.Short.toLocaleLowerCase().includes(
              search.toLocaleLowerCase()
            )
          ) {
            visibleOracles[table.$id] = true;
            hasOracles = true;
          }
        });

        if (hasOracles) {
          isEmpty = false;
          visibleCategories[set.$id] = CATEGORY_VISIBILITY.SOME;
        } else {
          visibleCategories[set.$id] = CATEGORY_VISIBILITY.HIDDEN;
        }

        return hasOracles;
      };
      oracleCategories.forEach((category) => {
        filterSet(category);
      });

      return {
        visibleOracleCategoryIds: visibleCategories,
        visibleOracleIds: visibleOracles,
        isEmpty,
      };
    }, [oracleCategories, search, showDelveOracles]);

  return {
    oracleCategories,
    setSearch,
    visibleOracleCategoryIds,
    visibleOracleIds,
    isSearchActive: !!search,
    isEmpty,
  };
}
