import type { Datasworn } from "@datasworn/core";
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
import { convertIdPart } from "functions/dataswornIdEncoder";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { OracleTableRollableAutocomplete } from "../../OracleTableRollableAutocomplete";
import { OracleTable } from "./OracleTable";

interface OracleTableBaseFormContents {
  name: string;
  description?: string;
  replacesId?: string;
  showDetails: boolean;
}

export interface OracleTableSimpleFormContents
  extends OracleTableBaseFormContents {
  showDetails: false;
  columnValues: { rollChance: number; result: string }[];
}

export interface OracleTableDetailsFormContents
  extends OracleTableBaseFormContents {
  showDetails: true;
  columnValues: { rollChance: number; result: string; detail: string }[];
}

export type Form =
  | OracleTableSimpleFormContents
  | OracleTableDetailsFormContents;

export interface OracleTableSimpleFormProps {
  homebrewId: string;
  onClose: () => void;
  editingOracle?: {
    key: string;
    table: Datasworn.OracleTableSimple | Datasworn.OracleTableDetails;
  };
  tables: Record<string, Datasworn.OracleTableRollable>;
  dbPath: string;
  parentCollectionKey?: string;
}

export function OracleTableSimpleForm(props: OracleTableSimpleFormProps) {
  const {
    homebrewId,
    onClose,
    editingOracle,
    tables,
    dbPath,
    parentCollectionKey,
  } = props;

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields, disabled },
    control,
    watch,
  } = useForm<Form>({
    disabled: loading,
    values: getDefaultValues(editingOracle?.table),
  });

  const onSubmit: SubmitHandler<Form> = (values) => {
    setLoading(true);
  };

  return (
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
                validate: (value) => {
                  if (!editingOracle?.key && value) {
                    try {
                      const id = convertIdPart(value);
                      if (tables[id]) {
                        return `You already have an oracle table with id ${id}. Please try a different label.`;
                      }
                    } catch (e) {
                      return "Failed to parse a valid ID for your oracle table. Please use at least three letters or numbers in your label.";
                    }
                  }
                },
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
                homebrewId={homebrewId}
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
                    <Checkbox {...field} defaultChecked={false} />
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
  );
}

function getDefaultValues(
  existingOracle?: Datasworn.OracleTableSimple | Datasworn.OracleTableDetails
): Form | undefined {
  if (!existingOracle) {
    return undefined;
  }
  if (existingOracle.oracle_type === "table_simple") {
    return {
      name: existingOracle.name,
      description: existingOracle.description,
      replacesId: existingOracle.replaces,

      showDetails: false,
      columnValues: [],
    };
  } else {
    return {
      name: existingOracle.name,
      description: existingOracle.description,
      replacesId: existingOracle.replaces,
      showDetails: true,
      columnValues: [],
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
