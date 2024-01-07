import { useState } from "react";
import { SelectTableTypeForm, ORACLE_TABLE_TYPE } from "./SelectTableTypeForm";

export interface OracleTableDialogContentsProps {
  onClose: () => void;
}

export function OracleTableDialogContents(
  props: OracleTableDialogContentsProps
) {
  const { onClose } = props;

  const [tableType, setTableType] = useState<ORACLE_TABLE_TYPE>();

  return (
    <>
      {!tableType && (
        <SelectTableTypeForm setTableType={setTableType} onClose={onClose} />
      )}
      {tableType === ORACLE_TABLE_TYPE.SIMPLE && <>Simple Form</>}
      {tableType === ORACLE_TABLE_TYPE.SHARED_RESULTS && (
        <>Shared Results Form</>
      )}
      {tableType === ORACLE_TABLE_TYPE.SHARED_ROLLS && <>Shared Rolls Form</>}
    </>
  );
}
