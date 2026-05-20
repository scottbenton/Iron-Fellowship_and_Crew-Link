import { Datasworn } from "@datasworn/core";
import { MarkdownRenderer } from "components/shared/MarkdownRenderer";
import {
  SimpleTable,
  SimpleTableColumnDefinition,
} from "components/shared/SimpleTable";

export interface OracleRollableColumnProps {
  oracle:
    | Datasworn.OracleColumnText
    | Datasworn.OracleColumnText2
    | Datasworn.OracleColumnText3;
}

export function OracleRollableColumn(props: OracleRollableColumnProps) {
  const { oracle } = props;

  const columns: SimpleTableColumnDefinition<Datasworn.OracleRollableRow>[] = [
    {
      label: "Roll",
      renderer: (row) =>
        row.roll
          ? row.roll.max - row.roll.min === 0
            ? row.roll.min
            : `${row.roll.min} - ${row.roll.max}`
          : null,
      textColor: "text.secondary",
    },
    {
      label: "Result",
      renderer: (row) => <MarkdownRenderer markdown={row.text} />,
    },
  ];

  if (
    oracle.oracle_type === "column_text2" ||
    oracle.oracle_type === "column_text3"
  ) {
    columns.push({
      label: "Details",
      renderer: (row) =>
        (row as Datasworn.OracleRollableRowText2).text2 ? (
          <MarkdownRenderer
            markdown={(row as Datasworn.OracleRollableRowText2).text2 ?? ""}
          />
        ) : null,
    });
  }

  if (oracle.oracle_type === "column_text3") {
    columns.push({
      label: "",
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
