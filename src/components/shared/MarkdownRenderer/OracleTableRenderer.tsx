import { Datasworn } from "@datasworn-community/core";
import { OracleCollection } from "components/features/charactersAndCampaigns/LinkedDialog/LinkedDialogContent/OracleDialogContent/OracleCollection";
import { OracleRollableTable } from "components/features/charactersAndCampaigns/LinkedDialog/LinkedDialogContent/OracleDialogContent/OracleRollableTable";
import { OracleTableSharedResults } from "components/features/charactersAndCampaigns/LinkedDialog/LinkedDialogContent/OracleDialogContent/OracleTableSharedResults";
import { OracleTableSharedRolls } from "components/features/charactersAndCampaigns/LinkedDialog/LinkedDialogContent/OracleDialogContent/OracleTableSharedRolls";
import { OracleButton } from "components/features/charactersAndCampaigns/OracleSection/OracleButton";
import { Box } from "@mui/material";

export interface OracleTableRendererProps {
  oracle: Datasworn.OracleCollection | Datasworn.OracleRollable;
}

/**
 * A table that text places inline with a {{table>id}} or {{table:id}}
 * directive (Pay the Price, Reveal a Danger). A rollable table gets its roll
 * button above it, so a screen reader user reaches the button before stepping
 * through every cell.
 */
export function OracleTableRenderer(props: OracleTableRendererProps) {
  const { oracle } = props;

  if (
    oracle.oracle_type === "table_text" ||
    oracle.oracle_type === "table_text2" ||
    oracle.oracle_type === "table_text3"
  ) {
    return (
      <Box mt={1}>
        <OracleButton
          color={"inherit"}
          variant={"outlined"}
          oracleId={oracle._id}
        >
          Roll {oracle.name}
        </OracleButton>
        <OracleRollableTable oracle={oracle} />
      </Box>
    );
  } else if (oracle.oracle_type === "table_shared_rolls") {
    return <OracleTableSharedRolls oracle={oracle} />;
  } else if (
    oracle.oracle_type === "table_shared_text" ||
    oracle.oracle_type === "table_shared_text2" ||
    oracle.oracle_type === "table_shared_text3"
  ) {
    return <OracleTableSharedResults oracle={oracle} />;
  } else if (oracle.oracle_type === "tables") {
    return <OracleCollection collection={oracle} />;
  }
  return null;
}
