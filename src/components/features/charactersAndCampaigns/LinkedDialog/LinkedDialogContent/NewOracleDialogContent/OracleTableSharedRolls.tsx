import { Datasworn } from "@datasworn/core";
import { MarkdownRenderer } from "components/shared/MarkdownRenderer";
import {
  SimpleTable,
  SimpleTableColumnDefinition,
} from "components/shared/SimpleTable";

export interface OracleTableSharedRollsDialogContentProps {
  oracle: Datasworn.OracleTableSharedRolls;
}

export function OracleTableSharedRolls(
  props: OracleTableSharedRollsDialogContentProps
) {
  const { oracle } = props;

  const contentArr = Object.values(oracle.contents ?? {});
  const rows = contentArr.length > 0 ? contentArr[0].rows : undefined;

  if (!rows) {
    return null;
  }

  const columns: SimpleTableColumnDefinition<Datasworn.OracleTableRowSimple>[] =
    [
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
    ];

  Object.values(oracle.contents ?? {}).forEach((subOracle) => {
    columns.push({
      label: subOracle.name,
      renderer: (_, index) => (
        <MarkdownRenderer markdown={subOracle.rows[index].result} />
      ),
    });
  });

  return <SimpleTable columns={columns} rows={rows} />;
}
