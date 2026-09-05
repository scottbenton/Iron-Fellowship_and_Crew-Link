import { Datasworn } from "@datasworn/core";
import { OracleRollableColumn } from "../charactersAndCampaigns/LinkedDialog/LinkedDialogContent/OracleDialogContent/OracleRollableColumn";
import { OracleRollableTable } from "../charactersAndCampaigns/LinkedDialog/LinkedDialogContent/OracleDialogContent/OracleRollableTable";

export interface MoveOracleContentProps {
  oracle: Datasworn.EmbeddedOracleRollable;
}

/** Picks the renderer for one of a move's embedded oracle tables. */
export function MoveOracleContent(props: MoveOracleContentProps) {
  const { oracle } = props;

  if (
    oracle.oracle_type === "column_text" ||
    oracle.oracle_type === "column_text2" ||
    oracle.oracle_type === "column_text3"
  ) {
    return <OracleRollableColumn oracle={oracle} />;
  }

  if (
    oracle.oracle_type === "table_text" ||
    oracle.oracle_type === "table_text2" ||
    oracle.oracle_type === "table_text3"
  ) {
    return <OracleRollableTable oracle={oracle} />;
  }

  return null;
}
