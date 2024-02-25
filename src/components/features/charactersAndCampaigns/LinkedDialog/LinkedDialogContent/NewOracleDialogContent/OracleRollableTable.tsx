import { Datasworn } from "@datasworn/core";
import { MarkdownRenderer } from "components/shared/MarkdownRenderer";
import {
  SimpleTable,
  SimpleTableColumnDefinition,
} from "components/shared/SimpleTable";

export interface OracleRollableTableProps {
  oracle:
    | Datasworn.OracleTableSimple
    | Datasworn.OracleColumnSimple
    | Datasworn.OracleTableDetails
    | Datasworn.OracleColumnDetails;
}

export function OracleRollableTable(props: OracleRollableTableProps) {
  const { oracle } = props;

  const columns: SimpleTableColumnDefinition<(typeof oracle)["rows"][0]>[] = [
    {
      label: oracle.column_labels.roll,
      renderer: (row) =>
        row.min !== null && row.max !== null
          ? row.max - row.min === 0
            ? row.min
            : `${row.min} - ${row.max}`
          : null,
      textColor: "text.secondary",
    },
    {
      label: oracle.column_labels.result,
      renderer: (row) => <MarkdownRenderer markdown={row.result} />,
    },
  ];

  if (
    oracle.oracle_type === "table_details" ||
    oracle.oracle_type === "column_details"
  ) {
    columns.push({
      label: oracle.column_labels.detail,
      renderer: (row) =>
        (row as Datasworn.OracleTableRowDetails).detail ? (
          <MarkdownRenderer
            markdown={(row as Datasworn.OracleTableRowDetails).detail ?? ""}
          />
        ) : null,
    });
  }

  return (
    <>
      <SimpleTable columns={columns} rows={oracle.rows} />
    </>
  );
}
