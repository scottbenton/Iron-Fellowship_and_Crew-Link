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
  ];

  Object.values(oracle.contents ?? {}).forEach((subOracle) => {
    columns.push({
      label: subOracle.name,
      renderer: (_, index) => (
        <MarkdownRenderer markdown={subOracle.rows[index].text} />
      ),
    });
  });

  return <SimpleTable columns={columns} rows={rows} />;
}
