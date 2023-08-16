import {
  Dialog,
  DialogContent,
  Stack,
  TextField,
  Button,
  DialogActions,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Typography,
  TableFooter,
  IconButton,
  Paper,
  Box,
} from "@mui/material";
import { DialogTitleWithCloseButton } from "components/DialogTitleWithCloseButton";
import { FieldArray, Formik } from "formik";
import { generateCustomDataswornId } from "functions/dataswornIdEncoder";
import { useState } from "react";
import { StoredOracle } from "types/Oracles.type";
import DeleteIcon from "@mui/icons-material/Delete";

interface FormValues {
  name: string;
  description: string;
  table: {
    roll?: number;
    result?: string;
  }[];
}

export interface CustomOracleDialogProps {
  open: boolean;
  onClose: () => void;

  createCustomOracle: (move: StoredOracle) => Promise<boolean | void>;
  updateCustomOracle: (moveId: string, move: StoredOracle) => Promise<boolean | void>;
  oracle?: StoredOracle;
}

export function CustomOracleDialog(props: CustomOracleDialogProps) {
  const { open, onClose, oracle, createCustomOracle, updateCustomOracle } =
    props;

  const [loading, setLoading] = useState<boolean>(false);

  const initialValues: FormValues = {
    name: oracle?.name ?? "",
    description: oracle?.text ?? "",
    table: oracle?.table ?? [{}],
  };

  const handleCancel = () => {
    onClose();
  };
  const handleValidate = (values: FormValues) => {
    const errors: {
      [key in keyof FormValues]?: string;
    } = {};
    if (!values.name) {
      errors.name = "Move name is required";
    }
    if (!values.description) {
      errors.description = "Move description is required";
    }

    let total = 0;

    for (const row of values.table) {
      if (!row.roll || !row.result) {
        errors.table = "All fields are required";
        return errors;
      }
      total += row.roll;
    }

    if (total !== 100) {
      errors.table = "Roll chance of all oracle results must sum to 100";
    }

    return errors;
  };
  const handleSubmit = (values: FormValues) => {
    const customOracleDocument: StoredOracle = {
      $id: generateCustomDataswornId("ironsworn/oracles", values.name),
      name: values.name,
      text: values.description,
      table: values.table as { roll: number; result: string }[],
    };

    if (!oracle) {
      setLoading(true);
      createCustomOracle(customOracleDocument)
        .then(() => {
          setLoading(false);
          onClose();
        })
        .catch((e) => {
          setLoading(false);
        });
    } else {
      setLoading(true);
      updateCustomOracle(oracle.$id, customOracleDocument)
        .then(() => {
          setLoading(false);
          onClose();
        })
        .catch((e) => {
          setLoading(false);
        });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth={"md"} fullWidth>
      <DialogTitleWithCloseButton onClose={onClose}>
        {oracle ? `Edit ${oracle.name}` : "Add Custom Oracle"}
      </DialogTitleWithCloseButton>
      <Formik
        initialValues={initialValues}
        validate={handleValidate}
        onSubmit={handleSubmit}
      >
        {(form) => (
          <form onSubmit={form.handleSubmit}>
            <DialogContent>
              <Stack spacing={2}>
                <TextField
                  label={"Oracle Name"}
                  name={"name"}
                  value={form.values.name}
                  onChange={form.handleChange}
                  error={form.touched.name && !!form.errors.name}
                  helperText={form.touched.name && form.errors.name}
                />
                <TextField
                  label={"Oracle Description"}
                  name={"description"}
                  value={form.values.description}
                  onChange={form.handleChange}
                  error={form.touched.description && !!form.errors.description}
                  helperText={
                    form.touched.description && !!form.errors.description
                      ? form.errors.description
                      : "You can use markdown to add rich text to your description "
                  }
                  multiline
                  minRows={3}
                />

                <FieldArray name="table">
                  {({ remove, push }) => (
                    <Box>
                      <TableContainer component={Paper} variant={"outlined"}>
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
                              <TableCell />
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {form.values.table.map((row, index) => (
                              <TableRow key={index}>
                                <TableCell>
                                  <TextField
                                    value={row.roll ?? ""}
                                    onChange={(evt) => {
                                      const numericValue =
                                        evt.currentTarget.value.replace(
                                          /\D/g,
                                          ""
                                        );
                                      form.setFieldValue(
                                        `table[${index}].roll`,
                                        numericValue
                                          ? parseInt(numericValue)
                                          : ""
                                      );
                                    }}
                                    variant={"standard"}
                                    placeholder={"Roll"}
                                    inputProps={{
                                      inputMode: "numeric",
                                      pattern: "\\d{0,3}",
                                    }}
                                    sx={{
                                      maxWidth: "5ch",
                                      "& input": {
                                        textAlign: "center",
                                      },
                                    }}
                                    error={
                                      form.touched.table &&
                                      !form.values.table[index].roll
                                    }
                                  />
                                </TableCell>

                                <TableCell>
                                  <TextField
                                    value={row.result ?? ""}
                                    onChange={(evt) => {
                                      form.setFieldValue(
                                        `table[${index}].result`,
                                        evt.currentTarget.value
                                      );
                                    }}
                                    variant={"standard"}
                                    placeholder={"Result"}
                                    fullWidth
                                    error={
                                      form.touched.table &&
                                      !form.values.table[index].result
                                    }
                                  />
                                </TableCell>
                                <TableCell
                                  sx={{ width: 0, minWidth: "fit-content" }}
                                >
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
                                <Typography
                                  variant={"caption"}
                                  component={"span"}
                                >
                                  Sum:{" "}
                                </Typography>
                                <Typography component={"span"}>
                                  {form.values.table.reduce(
                                    (acc, row) => (acc += row.roll ?? 0),
                                    0
                                  )}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Button onClick={() => push({})}>
                                  Add Row
                                </Button>
                              </TableCell>
                            </TableRow>
                          </TableFooter>
                        </Table>
                      </TableContainer>
                      {form.touched.table && form.errors.table && (
                        <Typography variant={"caption"} color={"error"} pl={2}>
                          {typeof form.errors.table === "string"
                            ? form.errors.table
                            : null}
                        </Typography>
                      )}
                    </Box>
                  )}
                </FieldArray>
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button
                type={"button"}
                onClick={() => {
                  form.resetForm();
                  handleCancel();
                }}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type={"submit"} variant={"contained"} disabled={loading}>
                {oracle ? "Save Changes" : "Create Oracle"}
              </Button>
            </DialogActions>
          </form>
        )}
      </Formik>
    </Dialog>
  );
}
