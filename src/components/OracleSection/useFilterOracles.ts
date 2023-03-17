import { useEffect, useMemo, useState } from "react";
import { useSearch } from "hooks/useSearch";
import type { OracleSet, OracleTable } from "dataforged";
import { oracleMap, orderedOracleCategories } from "data/oracles";
import { useSettingsStore } from "stores/settings.store";
import { License } from "types/Datasworn";
import { useCustomOracles } from "./useCustomOracles";

export function useFilterOracles() {
  const { search, setSearch, debouncedSearch } = useSearch();

  const { customOracleCategory } = useCustomOracles();
  const settings = useSettingsStore((store) => store.oracleSettings);

  const combinedOracles = useMemo(() => {
    const pinnedOracleIds = Object.keys(settings?.pinnedOracleSections ?? {});

    const pinnedOracleTables: { [tableId: string]: OracleTable } = {};

    pinnedOracleIds.forEach((oracleId) => {
      if (settings?.pinnedOracleSections?.[oracleId]) {
        pinnedOracleTables[oracleId] =
          oracleMap[oracleId] ?? customOracleCategory?.Tables?.[oracleId];
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
      ? [pinnedOracleSection, ...orderedOracleCategories]
      : orderedOracleCategories;
  }, [settings]);

  const [filteredOracles, setFilteredOracles] = useState(combinedOracles);

  useEffect(() => {
    let allOracles = [...combinedOracles];
    if (customOracleCategory) {
      allOracles.push(customOracleCategory);
    }

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
  }, [debouncedSearch, combinedOracles, customOracleCategory]);

  return { search, setSearch, filteredOracles };
}
