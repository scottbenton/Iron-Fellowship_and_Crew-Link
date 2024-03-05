import { Datasworn } from "@datasworn/core";
import { OracleCollection } from "components/features/charactersAndCampaigns/LinkedDialog/LinkedDialogContent/NewOracleDialogContent/OracleCollection";
import { OracleRollableTable } from "components/features/charactersAndCampaigns/LinkedDialog/LinkedDialogContent/NewOracleDialogContent/OracleRollableTable";
import { OracleTableSharedResults } from "components/features/charactersAndCampaigns/LinkedDialog/LinkedDialogContent/NewOracleDialogContent/OracleTableSharedResults";
import { OracleTableSharedRolls } from "components/features/charactersAndCampaigns/LinkedDialog/LinkedDialogContent/NewOracleDialogContent/OracleTableSharedRolls";

export interface OracleTableRendererProps {
  oracle: Datasworn.OracleCollection | Datasworn.OracleRollable;
}

export function OracleTableRenderer(props: OracleTableRendererProps) {
  const { oracle } = props;

  if (
    oracle.oracle_type === "table_simple" ||
    oracle.oracle_type === "column_simple" ||
    oracle.oracle_type === "table_details" ||
    oracle.oracle_type === "column_details"
  ) {
    return <OracleRollableTable oracle={oracle} />;
  } else if (oracle.oracle_type === "table_shared_rolls") {
    return <OracleTableSharedRolls oracle={oracle} />;
  } else if (
    oracle.oracle_type === "table_shared_results" ||
    oracle.oracle_type === "table_shared_details"
  ) {
    return <OracleTableSharedResults oracle={oracle} />;
  } else if (oracle.oracle_type === "tables") {
    return <OracleCollection collection={oracle} />;
  }
  return null;
}
