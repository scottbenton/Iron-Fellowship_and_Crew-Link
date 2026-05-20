import { Datasworn } from "@datasworn/core";
import { MarkdownRenderer } from "components/shared/MarkdownRenderer";
import {
  SimpleTable,
  SimpleTableColumnDefinition,
} from "components/shared/SimpleTable";

export interface OracleRollableTableProps {
  oracle: Datasworn.OracleRollableTable;
}

export function OracleRollableTable(props: OracleRollableTableProps) {
  const { oracle } = props;

  const columns: SimpleTableColumnDefinition<Datasworn.OracleRollableRow>[] = [
    {
      label: oracle.column_labels.roll,
      renderer: (row) =>
        row.roll
          ? row.roll.max - row.roll.min === 0
            ? row.roll.min
            : `${row.roll.min} - ${row.roll.max}`
          : null,
      textColor: "text.secondary",
    },
    {
      label: oracle.column_labels.text,
      renderer: (row) => <MarkdownRenderer markdown={row.text} />,
    },
  ];

  if (
    oracle.oracle_type === "table_text2" ||
    oracle.oracle_type === "table_text3"
  ) {
    columns.push({
      label: oracle.column_labels.text2,
      renderer: (row) =>
        (row as Datasworn.OracleRollableRowText2).text2 ? (
          <MarkdownRenderer
            markdown={(row as Datasworn.OracleRollableRowText3).text2 ?? ""}
          />
        ) : null,
    });
  }

  if (oracle.oracle_type === "table_text3") {
    columns.push({
      label: oracle.column_labels.text3,
      renderer: (row) =>
        (row as Datasworn.OracleRollableRowText3).text3 ? (
          <MarkdownRenderer
            markdown={(row as Datasworn.OracleRollableRowText3).text3 ?? ""}
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
