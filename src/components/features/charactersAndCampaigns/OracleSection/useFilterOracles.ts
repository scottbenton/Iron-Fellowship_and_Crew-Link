import { useEffect, useMemo, useState } from "react";
import { useSearch } from "hooks/useSearch";
import type { OracleSet, OracleTable } from "dataforged";
import { oracleMap, orderedCategories } from "data/oracles";
import { License } from "types/Datasworn";
import { useCustomOracles } from "./useCustomOracles";
import { useStore } from "stores/store";

export function useFilterOracles() {
  const { search, setSearch, debouncedSearch } = useSearch();

  const { customOracleCategories, allCustomOracleMap } = useCustomOracles();
  const pinnedOracles = useStore((store) => store.settings.pinnedOraclesIds);

  const showDelveOracles = useStore(
    (store) => store.settings.delve.showDelveOracles
  );

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
              Title: "Iron Fellowship",
              Authors: [],
              License: License.None,
            },
          }
        : undefined;

    return pinnedOracleSection
      ? [pinnedOracleSection, ...orderedCategories]
      : orderedCategories;
  }, [pinnedOracles]);

  const [filteredOracles, setFilteredOracles] = useState(combinedOracles);

  useEffect(() => {
    let allOracles = [...combinedOracles, ...customOracleCategories].filter(
      (category) =>
        showDelveOracles || category.Source.Title !== "Ironsworn: Delve"
    );

    const results: OracleSet[] = [];

    allOracles.forEach((oracleSection) => {
      if (
        oracleSection.Title.Standard.toLocaleLowerCase().includes(
          debouncedSearch.toLocaleLowerCase()
        ) &&
        Object.keys(oracleSection.Tables ?? {}).length > 0
      ) {
        results.push(oracleSection);
        return;
      }
      const matchedOracles: { [key: string]: OracleTable } = {};

      Object.keys(oracleSection.Tables ?? {}).forEach((oracleKey: string) => {
        const oracle = oracleSection.Tables?.[oracleKey];
        if (
          oracle &&
          oracle.Title.Short.toLocaleLowerCase().includes(
            debouncedSearch.toLocaleLowerCase()
          )
        ) {
          matchedOracles[oracleKey] = oracle;
        }
      });

      if (Object.keys(matchedOracles).length > 0) {
        results.push({ ...oracleSection, Tables: matchedOracles });
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
