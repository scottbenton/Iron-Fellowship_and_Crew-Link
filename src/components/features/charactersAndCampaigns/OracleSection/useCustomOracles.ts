import type { OracleSet, OracleTable, OracleTableRow } from "dataforged";
import { useDataswornId } from "hooks/useDataswornId";
import { useEffect, useMemo, useState } from "react";
import { useStore } from "stores/store";
import { License } from "types/Datasworn";
import { StoredOracle, TableColumnType } from "types/Oracles.type";

function convertStoredOracleToOracle(
  categoryId: string,
  storedOracle: StoredOracle
): OracleTable {
  const table: OracleTableRow[] = [];

  let minAmount = 1;
  storedOracle.table.forEach(({ roll, result }, index) => {
    const floor = minAmount;
    const ceiling = minAmount + roll - 1;

    table.push({
      $id: `${storedOracle.$id}/${index}`,
      Result: result,
      Floor: floor,
      Ceiling: ceiling,
    });

    minAmount += roll;
  });

  return {
    $id: storedOracle.$id,
    Title: {
      $id: `${storedOracle.$id}/title`,
      Short: storedOracle.name,
      Standard: storedOracle.name,
      Canonical: storedOracle.name,
    },
    Description: storedOracle.text,
    Display: {
      $id: `${storedOracle.$id}/display/columns`,
      Columns: [
        {
          $id: `${storedOracle.$id}/display/columns/1`,
          Content: storedOracle.$id,
          Label: "Roll",
          Type: TableColumnType.Range,
        },
        {
          $id: `${storedOracle.$id}/display/columns/2`,
          Content: storedOracle.$id,
          Label: "Result",
          Key: "Result",
          Type: TableColumnType.String,
        },
      ],
    },
    Ancestors: [categoryId],
    Source: {
      Title: "Custom Oracle",
      Authors: ["Campaign GM"],
      License: License.None,
    },
    Table: table,
  };
}

export function useCustomOracles() {
  const customOracleAuthorMap = useStore(
    (store) => store.settings.customOracles
  );
  const hiddenOracleIds = useStore(
    (store) => store.settings.hiddenCustomOracleIds
  );

  const customOracleAuthorNames = useStore((store) => {
    const nameMap: { [key: string]: string } = {};
    Object.keys(customOracleAuthorMap).forEach((authorId) => {
      nameMap[authorId] =
        store.users.userMap[authorId].doc?.displayName ?? "Loading";
    });
    return nameMap;
  });

  const memoizedOracleMap = useMemo(() => {
    return JSON.parse(
      JSON.stringify(customOracleAuthorMap)
    ) as typeof customOracleAuthorMap;
  }, [customOracleAuthorMap]);

  const [customOracleCategories, setCustomOracleCategories] = useState<
    OracleSet[]
  >([]);
  const [allCustomOracleMap, setAllCustomOracleMap] = useState<{
    [oracleId: string]: OracleTable;
  }>({});

  const { getCustomIdPrefix } = useDataswornId();

  useEffect(() => {
    const newOracleCategories: OracleSet[] = [];
    let newCustomOracleMap: { [oracleId: string]: OracleTable } = {};

    const customOracleCategoryPrefix = getCustomIdPrefix("oracles");

    Object.keys(memoizedOracleMap).forEach((creatorId) => {
      const customOracles = memoizedOracleMap[creatorId];

      if (
        customOracles &&
        customOracles.length > 0 &&
        Array.isArray(hiddenOracleIds)
      ) {
        const mappedCustomOracles: { [key: string]: OracleTable } = {};
        const mappedCustomOraclesWithHidden: { [key: string]: OracleTable } =
          {};

        customOracles.forEach((oracle) => {
          const convertedOracle = convertStoredOracleToOracle(
            customOracleCategoryPrefix,
            oracle
          );
          if (!hiddenOracleIds.includes(oracle.$id)) {
            mappedCustomOracles[oracle.$id] = convertedOracle;
          }
          mappedCustomOraclesWithHidden[oracle.$id] = convertedOracle;
        });

        const customOracleCategoryName = `Custom Oracles (${customOracleAuthorNames[creatorId]})`;
        newOracleCategories.push({
          $id: customOracleCategoryPrefix,
          Title: {
            $id: `${customOracleCategoryPrefix}/title`,
            Canonical: customOracleCategoryName,
            Short: customOracleCategoryName,
            Standard: customOracleCategoryName,
          },
          Ancestors: [],
          Display: {
            $id: `${customOracleCategoryPrefix}/display`,
          },
          Source: {
            Title: "Custom Oracle",
            Authors: [],
            License: License.None,
          },
          Tables: mappedCustomOracles,
        });
        newCustomOracleMap = {
          ...newCustomOracleMap,
          ...mappedCustomOraclesWithHidden,
        };
      }
    });

    setCustomOracleCategories(newOracleCategories);
    setAllCustomOracleMap(newCustomOracleMap);
  }, [
    memoizedOracleMap,
    hiddenOracleIds,
    customOracleAuthorNames,
    getCustomIdPrefix,
  ]);

  return { customOracleCategories, allCustomOracleMap };
}
