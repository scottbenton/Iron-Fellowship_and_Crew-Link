import { useState } from "react";
import { SelectTableTypeForm, ORACLE_TABLE_TYPE } from "./SelectTableTypeForm";
import { OracleTableSimpleForm } from "./OracleTableSimpleForm";
import { Datasworn } from "@datasworn/core";

export interface OracleTableDialogContentsProps {
  homebrewId: string;
  onClose: () => void;
  tables: Record<string, Datasworn.OracleTableRollable>;
  dbPath: string;
  parentCollectionKey?: string;
}

export function OracleTableDialogContents(
  props: OracleTableDialogContentsProps
) {
  const { homebrewId, onClose, tables, dbPath, parentCollectionKey } = props;

  // TODO - Support other oracle table types
  const [tableType, setTableType] = useState<ORACLE_TABLE_TYPE>(
    ORACLE_TABLE_TYPE.SIMPLE
  );

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
          dbPath={dbPath}
          parentCollectionKey={parentCollectionKey}
        />
      )}
      {tableType === ORACLE_TABLE_TYPE.SHARED_RESULTS && (
        <>Shared Results Form</>
      )}
      {tableType === ORACLE_TABLE_TYPE.SHARED_ROLLS && <>Shared Rolls Form</>}
    </>
  );
}
