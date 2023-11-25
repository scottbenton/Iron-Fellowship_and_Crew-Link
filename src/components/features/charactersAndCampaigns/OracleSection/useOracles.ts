import { useStore } from "stores/store";
import { useCustomOracles } from "./useCustomOracles";
import { useMemo } from "react";
import { orderedCategories, oracleMap } from "data/oracles";
import { OracleSet, OracleTable } from "dataforged";
import { License } from "types/Datasworn";
import { useAppName } from "hooks/useAppName";

export function useOracles() {
  const appName = useAppName();
  const { customOracleCategories, allCustomOracleMap } = useCustomOracles();

  const pinnedOracles = useStore((store) => store.settings.pinnedOraclesIds);

  const oracleCategories = useMemo(() => {
    const pinnedOracleTables: { [tableId: string]: OracleTable } = {};
    Object.keys(pinnedOracles).forEach((id) => {
      if (pinnedOracles[id] && (oracleMap[id] ?? allCustomOracleMap[id])) {
        pinnedOracleTables[id] = oracleMap[id] ?? allCustomOracleMap[id];
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

    let categories: OracleSet[] = [
      ...orderedCategories,
      ...customOracleCategories,
    ];
    if (pinnedOracleSection) {
      categories = [pinnedOracleSection, ...categories];
    }

    return categories;
  }, [customOracleCategories, pinnedOracles, allCustomOracleMap, appName]);

  return oracleCategories;
}
