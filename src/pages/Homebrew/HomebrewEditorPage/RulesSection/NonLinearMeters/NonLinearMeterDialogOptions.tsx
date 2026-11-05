import {
  Button,
  Checkbox,
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
} from "@mui/material";
import {
  Control,
  Controller,
  UseFormRegister,
  UseFormReturn,
  useFieldArray,
} from "react-hook-form";
import { Form } from "./NonLinearMeterDialogForm";
import DeleteIcon from "@mui/icons-material/Delete";

export interface NonLinearMeterDialogOptionsProps {
  control: Control<Form>;
  register: UseFormRegister<Form>;
  formState: UseFormReturn<Form>["formState"];
}

export function NonLinearMeterDialogOptions(
  props: NonLinearMeterDialogOptionsProps
) {
  const { control, formState, register } = props;

  const { disabled, touchedFields, errors } = formState;
  const { append, remove, fields } = useFieldArray({
    control,
    name: "options",
  });

  return (
    <TableContainer component={Paper} variant={"outlined"}>
      <Table size={"small"}>
        <TableHead>
          <TableRow>
            <TableCell>Cell Name</TableCell>
            <TableCell>Read Only</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {fields.map((option, index) => (
            <TableRow key={option.id}>
              <TableCell>
                <TextField
                  disabled={disabled}
                  variant={"standard"}
                  placeholder={"Cell Value"}
                  fullWidth
                  error={
                    touchedFields.options?.[index]?.value &&
                    !!errors.options?.[index]?.value
                  }
                  helperText={
                    touchedFields.options?.[index]?.value &&
                    !!errors.options?.[index]?.value
                      ? errors.options[index]?.value?.message
                      : undefined
                  }
                  inputProps={{
                    defaultValue: "",
                    ...register(`options.${index}.value`, {
                      required: "This field is required.",
                    }),
                  }}
                />
              </TableCell>

              <TableCell>
                <Controller
                  name={`options.${index}.readOnly`}
                  control={control}
                  defaultValue={false}
                  render={({ field }) => (
                    <Checkbox
                      {...field}
                      defaultChecked={field.value ?? false}
                      inputProps={{
                        "aria-label": `Cell ${index + 1} Read Only`,
                      }}
                    />
                  )}
                />
              </TableCell>
              <TableCell sx={{ width: 0, minWidth: "fit-content" }}>
                <IconButton
                  aria-label={`Delete Cell ${index + 1}`}
                  onClick={() => remove(index)}
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>

        <TableFooter>
          <TableRow>
            <TableCell>
              <Button
                color={"inherit"}
                onClick={() => {
                  append({
                    value: "",
                    readOnly: false,
                  });
                }}
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
