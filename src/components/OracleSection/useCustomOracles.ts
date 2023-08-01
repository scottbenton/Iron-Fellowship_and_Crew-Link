import type { OracleSet, OracleTable, OracleTableRow } from "dataforged";
import { useCampaignGMScreenStore } from "pages/Campaign/CampaignGMScreenPage/campaignGMScreen.store";
import { useCharacterSheetStore } from "pages/Character/CharacterSheetPage/characterSheet.store";
import { useEffect, useState } from "react";
import { License } from "types/Datasworn";
import {
  customOracleCategoryPrefix,
  StoredOracle,
  TableColumnType,
} from "types/Oracles.type";

function convertStoredOracleToOracle(storedOracle: StoredOracle): OracleTable {
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
    Ancestors: [customOracleCategoryPrefix],
    Source: {
      Title: "Custom Oracle",
      Authors: ["Campaign GM"],
      License: License.None,
    },
    Table: table,
  };
}

export function useCustomOracles() {
  const characterSheetOracles = useCharacterSheetStore(
    (store) => store.customOracles
  );
  const gmScreenOracles = useCampaignGMScreenStore(
    (store) => store.customOracles
  );

  const hiddenCampaignOracleIds = useCampaignGMScreenStore(
    (store) => store.campaignSettings?.hiddenCustomOraclesIds
  );
  const hiddenCharacterOracleIds = useCharacterSheetStore(
    (store) => store.characterSettings?.hiddenCustomOraclesIds
  );

  const [customOracleCategories, setCustomOracleCategories] = useState<
    OracleSet[]
  >([]);
  const [allCustomOracleMap, setAllCustomOracleMap] = useState<{
    [oracleId: string]: OracleTable;
  }>({});

  useEffect(() => {
    const customStoredOracles = gmScreenOracles ?? characterSheetOracles;
    const hiddenOracleIds = hiddenCampaignOracleIds ?? hiddenCharacterOracleIds;

    const newOracleCategories: OracleSet[] = [];
    let newCustomOracleMap: { [oracleId: string]: OracleTable } = {};

    Object.keys(customStoredOracles).forEach((creatorId) => {
      const customOracles = customStoredOracles[creatorId];

      if (
        customOracles &&
        customOracles.length > 0 &&
        Array.isArray(hiddenOracleIds)
      ) {
        const mappedCustomOracles: { [key: string]: OracleTable } = {};
        const mappedCustomOraclesWithHidden: { [key: string]: OracleTable } =
          {};

        customOracles.forEach((oracle) => {
          const convertedOracle = convertStoredOracleToOracle(oracle);
          if (!hiddenOracleIds.includes(oracle.$id)) {
            mappedCustomOracles[oracle.$id] = convertedOracle;
          }
          mappedCustomOraclesWithHidden[oracle.$id] = convertedOracle;
        });

        newOracleCategories.push({
          $id: customOracleCategoryPrefix,
          Title: {
            $id: `${customOracleCategoryPrefix}/title`,
            Canonical: "Custom Oracles",
            Short: "Custom Oracles",
            Standard: "Custom Oracles",
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
    characterSheetOracles,
    gmScreenOracles,
    hiddenCampaignOracleIds,
    hiddenCharacterOracleIds,
  ]);

  return { customOracleCategories, allCustomOracleMap };
}
