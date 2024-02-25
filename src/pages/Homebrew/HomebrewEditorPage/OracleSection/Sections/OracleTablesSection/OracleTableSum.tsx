import { Typography } from "@mui/material";
import { FieldArrayWithId, UseFormWatch } from "react-hook-form";
import { Form } from "./OracleTableSimpleForm";

export interface OracleTableSumProps {
  watch: UseFormWatch<Form>;
  fields: FieldArrayWithId<Form, "columnValues", "id">[];
}

export function OracleTableSum(props: OracleTableSumProps) {
  const { watch, fields } = props;

  const watchFieldArray = watch("columnValues");
  const controlledFields = fields.map((field, index) => {
    return {
      ...field,
      ...watchFieldArray[index],
    };
  });

  const sum = controlledFields.reduce(
    (acc, row) => (acc += isNaN(row.rollChance) ? 0 : row.rollChance ?? 0),
    0
  );

  return (
    <>
      <Typography variant={"caption"} component={"span"}>
        Sum:{" "}
      </Typography>
      <Typography component={"span"}>{sum}</Typography>
    </>
  );
}
