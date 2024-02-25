import {
  Button,
  Checkbox,
  DialogActions,
  DialogContent,
  FormControl,
  FormControlLabel,
  Stack,
  TextField,
} from "@mui/material";
import { MarkdownEditor } from "components/shared/RichTextEditor/MarkdownEditor";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { OracleTableRollableAutocomplete } from "../../OracleTableRollableAutocomplete";
import { OracleTable } from "./OracleTable";
import { StoredOracleTable } from "types/homebrew/HomebrewOracles.type";
import { useStore } from "stores/store";
import { DialogTitleWithCloseButton } from "components/shared/DialogTitleWithCloseButton";

interface OracleTableBaseFormContents {
  name: string;
  description?: string;
  replacesId?: string;
  showDetails?: boolean;
}

export interface OracleTableSimpleFormContents
  extends OracleTableBaseFormContents {
  showDetails: false;
  columnValues: { rollChance: number; result: string }[];
}

export interface OracleTableDetailsFormContents
  extends OracleTableBaseFormContents {
  showDetails: true;
  columnValues: { rollChance: number; result: string; detail?: string }[];
}

export type Form =
  | OracleTableSimpleFormContents
  | OracleTableDetailsFormContents;

export interface OracleTableSimpleFormProps {
  homebrewId: string;
  parentCollectionId: string;
  onClose: () => void;
  tables: Record<string, StoredOracleTable>;
  editingOracleTableId?: string;
}

export function OracleTableSimpleForm(props: OracleTableSimpleFormProps) {
  const {
    homebrewId,
    parentCollectionId,
    onClose,
    tables,
    editingOracleTableId,
  } = props;

  const existingTable = editingOracleTableId
    ? tables[editingOracleTableId]
    : undefined;

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields, disabled },
    control,
    watch,
  } = useForm<Form>({
    disabled: loading,
    values: getDefaultValues(existingTable),
  });

  const createTable = useStore((store) => store.homebrew.createOracleTable);
  const updateTable = useStore((store) => store.homebrew.updateOracleTable);

  const onSubmit: SubmitHandler<Form> = (values) => {
    setLoading(true);

    const oracleTable: StoredOracleTable = {
      collectionId: homebrewId,
      oracleCollectionId: parentCollectionId,
      label: values.name,
      columnLabels: {
        roll: "Roll",
        result: "Result",
      },
      rows: values.columnValues.map((row) => {
        const newRow: { result: string; chance: number; detail?: string } = {
          result: row.result,
          chance: row.rollChance,
        };
        if (
          values.showDetails &&
          (row as { rollChance: number; result: string; detail?: string })
            .detail
        ) {
          newRow.detail = (
            row as { rollChance: number; result: string; detail?: string }
          ).detail;
        }
        return newRow;
      }),
    };
    if (values.description) {
      oracleTable.description = values.description;
    }

    if (values.showDetails) {
      oracleTable.columnLabels.detail = "Details";
    }

    if (values.replacesId) {
      oracleTable.replaces = values.replacesId;
    }

    if (editingOracleTableId) {
      updateTable(editingOracleTableId, oracleTable)
        .catch(() => {})
        .finally(() => {
          onClose();
          setLoading(false);
        });
    } else {
      createTable(oracleTable)
        .catch(() => {})
        .finally(() => {
          onClose();
          setLoading(false);
        });
    }
  };

  return (
    <>
      <DialogTitleWithCloseButton onClose={onClose}>
        {existingTable ? `Edit ${existingTable.label}` : "Create Table"}
      </DialogTitleWithCloseButton>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack spacing={2}>
            <TextField
              disabled={disabled}
              label={"Oracle Name"}
              fullWidth
              error={touchedFields.name && !!errors.name}
              helperText={
                touchedFields.name && errors.name
                  ? errors.name.message
                  : undefined
              }
              inputProps={{
                defaultValue: "",
                ...register("name", {
                  required: "This field is required.",
                }),
              }}
            />
            <Controller
              name='description'
              control={control}
              render={({ field }) => (
                <MarkdownEditor
                  label={"Description"}
                  content={field.value ?? ""}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
              )}
            />
            <Controller
              name={"replacesId"}
              control={control}
              render={({ field }) => (
                <OracleTableRollableAutocomplete
                  label={"Replaces Table"}
                  value={field.value}
                  onChange={(ids) => field.onChange(ids)}
                  onBlur={field.onBlur}
                  helperText={"Replaces an existing oracle table with this one"}
                />
              )}
            />
            <FormControl
              error={touchedFields.showDetails && !!errors.showDetails}
            >
              <FormControlLabel
                disabled={disabled}
                control={
                  <Controller
                    name='showDetails'
                    control={control}
                    defaultValue={false}
                    render={({ field }) => (
                      <Checkbox
                        {...field}
                        defaultChecked={field.value ?? false}
                      />
                    )}
                  />
                }
                label={"Add a details column?"}
              />
            </FormControl>
            <OracleTable
              control={control}
              disabled={disabled}
              touchedFields={touchedFields}
              errors={errors}
              register={register}
              watch={watch}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button color={"inherit"} type={"reset"} onClick={onClose}>
            Cancel
          </Button>
          <Button variant={"contained"} type={"submit"}>
            Save
          </Button>
        </DialogActions>
      </form>
    </>
  );
}

function getDefaultValues(
  existingOracle?: StoredOracleTable
): Form | undefined {
  if (!existingOracle) {
    return undefined;
  }
  if (!existingOracle.columnLabels.detail) {
    const columnValues: {
      rollChance: number;
      result: string;
    }[] = existingOracle.rows.map((row) => ({
      result: row.result,
      rollChance: row.chance,
    }));

    return {
      name: existingOracle.label,
      description: existingOracle.description,
      replacesId: existingOracle.replaces,

      showDetails: false,
      columnValues,
    };
  } else {
    const columnValues: {
      rollChance: number;
      result: string;
      detail?: string;
    }[] = existingOracle.rows.map((row) => ({
      result: row.result,
      rollChance: row.chance,
      detail: row.detail,
    }));

    return {
      name: existingOracle.label,
      description: existingOracle.description,
      replacesId: existingOracle.replaces,
      showDetails: true,
      columnValues,
    };
  }
}

// function parseFieldsIntoTable(form: Form): OracleTableSimple | OracleTableDetails | undefined {
//   if (form.showDetails) {
//     const tableDetails: OracleTableDetails = {
//       id:
//     };
//   }
// }
