import {
  OracleColumnDetails,
  OracleColumnSimple,
  OracleTableDetails,
  OracleTableRowDetails,
  OracleTableSimple,
} from "@datasworn/core";
import { MarkdownRenderer } from "components/shared/MarkdownRenderer";
import {
  SimpleTable,
  SimpleTableColumnDefinition,
} from "components/shared/SimpleTable";

export interface OracleRollableTableProps {
  oracle:
    | OracleTableSimple
    | OracleColumnSimple
    | OracleTableDetails
    | OracleColumnDetails;
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
        (row as OracleTableRowDetails).detail ? (
          <MarkdownRenderer
            markdown={(row as OracleTableRowDetails).detail ?? ""}
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
