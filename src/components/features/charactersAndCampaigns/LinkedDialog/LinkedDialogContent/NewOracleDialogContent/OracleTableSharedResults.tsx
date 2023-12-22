import {
  OracleTableSharedResults as IOracleTableSharedResults,
  OracleTableSharedDetails as IOracleTableSharedDetails,
  OracleTableRowSimple,
  OracleColumnSimple,
  OracleColumnDetails,
  OracleTableRowDetails,
} from "@datasworn/core";
import { MarkdownRenderer } from "components/shared/MarkdownRenderer";
import {
  SimpleTable,
  SimpleTableColumnDefinition,
} from "components/shared/SimpleTable";

export interface OracleTableSharedResultsProps {
  oracle: IOracleTableSharedResults | IOracleTableSharedDetails;
}

export function OracleTableSharedResults(props: OracleTableSharedResultsProps) {
  const { oracle } = props;

  const contentArr = Object.values(oracle.contents ?? {});
  const rows = contentArr.length > 0 ? contentArr[0].rows : undefined;

  if (!rows) {
    return null;
  }

  const columns: SimpleTableColumnDefinition<OracleTableRowSimple>[] = [];

  const contentValues:
    | (OracleColumnSimple | OracleColumnDetails)[]
    | undefined = oracle.contents ? Object.values(oracle.contents) : undefined;

  contentValues?.forEach((subOracle) => {
    columns.push({
      label: subOracle.name,
      renderer: (_, index) => {
        const row = subOracle.rows[index];

        return row.min !== null && row.max !== null
          ? row.max - row.min === 0
            ? row.min
            : `${row.min} - ${row.max}`
          : null;
      },
      textColor: "text.secondary",
    });
  });

  columns.push({
    label: oracle.column_labels.result,
    renderer: (row) => <MarkdownRenderer markdown={row.result} />,
  });

  if (oracle.oracle_type === "table_shared_details") {
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

  return <SimpleTable columns={columns} rows={rows} />;
}
