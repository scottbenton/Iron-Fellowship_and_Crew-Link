import { useEffect, useMemo, useState } from "react";
import { useSearch } from "hooks/useSearch";
import type { OracleSet, OracleTable } from "dataforged";
import {
  askTheOracleIds,
  askTheOracleSection,
  oracleMap,
  orderedCategories,
} from "data/oracles";
import { License } from "types/Datasworn";
import { useCustomOracles } from "./useCustomOracles";
import { useStore } from "stores/store";
import { useAppName } from "hooks/useAppName";

export function useFilterOracles() {
  const { search, setSearch, debouncedSearch } = useSearch();

  const { customOracleCategories, allCustomOracleMap } = useCustomOracles();
  const pinnedOracles = useStore((store) => store.settings.pinnedOraclesIds);

  const showDelveOracles = useStore(
    (store) => store.settings.delve.showDelveOracles
  );

  const appName = useAppName();

  const combinedOracles = useMemo(() => {
    const pinnedOracleIds = Object.keys(pinnedOracles);

    const pinnedOracleTables: { [tableId: string]: OracleTable } = {};

    pinnedOracleIds.forEach((oracleId) => {
      if (pinnedOracles[oracleId]) {
        pinnedOracleTables[oracleId] =
          oracleMap[oracleId] ?? allCustomOracleMap[oracleId];
      }
    });

    const pinnedOracleSection: OracleSet | undefined =
      Object.keys(pinnedOracleTables).length > 0
        ? {
            $id: "ironsworn/oracles/pinned",
            Title: {
              $id: "ironsworn/oracles/pinned/title",
              Short: "Pinned",
              Standard: "Pinned Oracles",
              Canonical: "Pinned Oracles",
            },
            Tables: pinnedOracleTables,
            Display: {
              $id: "ironsworn/oracles/pinned/display",
            },
            Ancestors: [],
            Source: {
              Title: appName,
              Authors: [],
              License: License.None,
            },
          }
        : undefined;

    return pinnedOracleSection
      ? [pinnedOracleSection, askTheOracleSection, ...orderedCategories]
      : [askTheOracleSection, ...orderedCategories];
  }, [pinnedOracles, appName, allCustomOracleMap]);

  const [filteredOracles, setFilteredOracles] = useState(combinedOracles);

  useEffect(() => {
    let allOracles = [...combinedOracles, ...customOracleCategories].filter(
      (category) =>
        showDelveOracles || category.Source.Title !== "Ironsworn: Delve"
    );

    const results: OracleSet[] = [];

    const filterSet = (set: OracleSet): OracleSet | undefined => {
      if (
        set.Title.Standard.toLocaleLowerCase().includes(
          debouncedSearch.toLocaleLowerCase()
        ) &&
        (Object.keys(set.Tables ?? {}).length > 0 ||
          Object.keys(set.Sets ?? {}).length > 0)
      ) {
        return set;
      } else {
        const filteredSets: { [key: string]: OracleSet } = {};
        Object.keys(set.Sets ?? {}).forEach((setId) => {
          const newSet = filterSet(set.Sets?.[setId] as OracleSet);
          if (newSet) {
            filteredSets[setId] = newSet;
          }
        });
        const filteredTables: { [key: string]: OracleTable } = {};
        Object.keys(set.Tables ?? {}).forEach((tableId) => {
          const table = (set.Tables ?? {})[tableId];
          if (
            table &&
            table.Title.Short.toLocaleLowerCase().includes(
              debouncedSearch.toLocaleLowerCase()
            )
          ) {
            filteredTables[tableId] = table;
          }
        });

        if (
          Object.keys(filteredSets).length > 0 ||
          Object.keys(filteredTables).length > 0
        ) {
          return {
            ...set,
            Sets: filteredSets,
            Tables: filteredTables,
          };
        }
        return undefined;
      }
    };

    allOracles.forEach((oracleSection) => {
      const filteredSection = filterSet(oracleSection);

      if (filteredSection) {
        results.push(filteredSection);
      }
    });
    setFilteredOracles(results);
  }, [
    debouncedSearch,
    combinedOracles,
    customOracleCategories,
    showDelveOracles,
  ]);

  return { search, setSearch, filteredOracles };
}
