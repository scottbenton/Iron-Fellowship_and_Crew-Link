import {
  Alert,
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import {
  Control,
  FormState,
  UseFormRegister,
  UseFormWatch,
  useFieldArray,
} from "react-hook-form";
import { Form } from "./OracleTableSimpleForm";
import DeleteIcon from "@mui/icons-material/Delete";
import { OracleTableSum } from "./OracleTableSum";
import { OptionalDetailsColumn } from "./OptionalDetailsColumn";

export interface OracleTableProps {
  control: Control<Form>;
  disabled?: boolean;
  touchedFields: FormState<Form>["touchedFields"];
  errors: FormState<Form>["errors"];
  register: UseFormRegister<Form>;
  watch: UseFormWatch<Form>;
}

export function OracleTable(props: OracleTableProps) {
  const { control, disabled, touchedFields, errors, register, watch } = props;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "columnValues",
    rules: {
      validate: (values) => {
        const total = values.reduce(
          (acc, row) => (acc += row.rollChance ?? 0),
          0
        );

        if (total !== 100) {
          return "Total roll chance must sum to 100%";
        }
      },
    },
  });

  return (
    <TableContainer component={Paper} variant={"outlined"}>
      {errors.columnValues?.root?.message && (
        <Alert severity='error'>{errors.columnValues.root.message}</Alert>
      )}
      <Table size={"small"}>
        <TableHead>
          <TableRow>
            <TableCell>
              Chance (%)
              <Typography
                component={"div"}
                variant={"caption"}
                color={"textSecondary"}
              >
                Must sum to 100
              </Typography>
            </TableCell>
            <TableCell>Result</TableCell>
            <OptionalDetailsColumn control={control}>
              <TableCell>Details</TableCell>
            </OptionalDetailsColumn>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {fields.map((row, index) => (
            <TableRow key={index}>
              <TableCell>
                <TextField
                  disabled={disabled}
                  variant={"standard"}
                  placeholder={"Roll"}
                  fullWidth
                  error={
                    touchedFields.columnValues?.[index]?.rollChance &&
                    !!errors.columnValues?.[index]?.rollChance
                  }
                  helperText={
                    touchedFields.columnValues?.[index]?.rollChance &&
                    !!errors.columnValues?.[index]?.rollChance
                      ? errors.columnValues[index]?.rollChance?.message
                      : undefined
                  }
                  inputProps={{
                    defaultValue: "",
                    ...register(`columnValues.${index}.rollChance`, {
                      required: "This field is required.",
                      valueAsNumber: true,
                    }),
                  }}
                />
              </TableCell>

              <TableCell>
                <TextField
                  disabled={disabled}
                  variant={"standard"}
                  placeholder={"Result"}
                  fullWidth
                  error={
                    touchedFields.columnValues?.[index]?.result &&
                    !!errors.columnValues?.[index]?.result
                  }
                  helperText={
                    touchedFields.columnValues?.[index]?.result &&
                    !!errors.columnValues?.[index]?.result
                      ? errors.columnValues[index]?.result?.message
                      : undefined
                  }
                  inputProps={{
                    defaultValue: "",
                    ...register(`columnValues.${index}.result`, {
                      required: "This field is required.",
                    }),
                  }}
                />
              </TableCell>
              <OptionalDetailsColumn control={control}>
                <TableCell>
                  <TextField
                    disabled={disabled}
                    variant={"standard"}
                    placeholder={"Details"}
                    fullWidth
                    error={
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      (touchedFields.columnValues?.[index] as any)?.detail &&
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      (!!errors.columnValues?.[index] as any)?.detail
                    }
                    helperText={
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      (touchedFields.columnValues?.[index] as any)?.detail &&
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      !!(errors.columnValues?.[index] as any)?.detail
                        ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          (errors.columnValues?.[index] as any)?.result?.message
                        : undefined
                    }
                    inputProps={{
                      defaultValue: "",
                      ...register(`columnValues.${index}.detail`),
                    }}
                  />
                </TableCell>
              </OptionalDetailsColumn>
              <TableCell sx={{ width: 0, minWidth: "fit-content" }}>
                <IconButton onClick={() => remove(index)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>
              <OracleTableSum watch={watch} fields={fields} />
            </TableCell>
            <TableCell>
              <Button
                color={"inherit"}
                onClick={() => append({ rollChance: 0, result: "" })}
              >
                Add Row
              </Button>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}
