import { useState } from "react";
import { SelectTableTypeForm, ORACLE_TABLE_TYPE } from "./SelectTableTypeForm";
import { OracleTableSimpleForm } from "./OracleTableSimpleForm";
import { OracleTableRollable } from "@datasworn/core";

export interface OracleTableDialogContentsProps {
  homebrewId: string;
  onClose: () => void;
  tables: Record<string, OracleTableRollable>;
}

export function OracleTableDialogContents(
  props: OracleTableDialogContentsProps
) {
  const { homebrewId, onClose, tables } = props;

  const [tableType, setTableType] = useState<ORACLE_TABLE_TYPE>();

  return (
    <>
      {!tableType && (
        <SelectTableTypeForm setTableType={setTableType} onClose={onClose} />
      )}
      {tableType === ORACLE_TABLE_TYPE.SIMPLE && (
        <OracleTableSimpleForm
          homebrewId={homebrewId}
          onClose={onClose}
          tables={tables}
        />
      )}
      {tableType === ORACLE_TABLE_TYPE.SHARED_RESULTS && (
        <>Shared Results Form</>
      )}
      {tableType === ORACLE_TABLE_TYPE.SHARED_ROLLS && <>Shared Rolls Form</>}
    </>
  );
}
