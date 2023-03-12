import { OracleSet, OracleTable, OracleTableRow } from "dataforged";
import { useCampaignGMScreenStore } from "features/campaign-gm-screen/campaignGMScreen.store";
import { useCharacterSheetStore } from "features/character-sheet/characterSheet.store";
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

  const [customOracleCategory, setCustomOracleCategory] = useState<OracleSet>();

  useEffect(() => {
    const customStoredOracles = gmScreenOracles ?? characterSheetOracles;

    if (customStoredOracles && customStoredOracles.length > 0) {
      const mappedCustomOracles: { [key: string]: OracleTable } = {};

      customStoredOracles.forEach((oracle) => {
        mappedCustomOracles[oracle.$id] = convertStoredOracleToOracle(oracle);
      });

      setCustomOracleCategory({
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
    } else {
      setCustomOracleCategory(undefined);
    }
  }, [characterSheetOracles, gmScreenOracles]);

  return customOracleCategory;
}
