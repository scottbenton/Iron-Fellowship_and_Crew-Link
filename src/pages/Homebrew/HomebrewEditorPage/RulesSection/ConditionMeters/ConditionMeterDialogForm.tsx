import {
  Button,
  Checkbox,
  DialogActions,
  DialogContent,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Stack,
  TextField,
} from "@mui/material";
import { DialogTitleWithCloseButton } from "components/shared/DialogTitleWithCloseButton";
import { useRules } from "data/hooks/useRules";
import { useState } from "react";
import { StoredConditionMeter } from "types/homebrew/HomebrewRules.type";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { convertIdPart } from "functions/dataswornIdEncoder";
import { Preview } from "../../Preview";
import { ConditionMeterPreview } from "./ConditionMeterPreview";
import { MarkdownEditor } from "components/shared/RichTextEditor/MarkdownEditor";

export interface ConditionMeterDialogFormProps {
  homebrewId: string;
  conditionMeters: Record<string, StoredConditionMeter>;
  onSave: (conditionMeter: StoredConditionMeter) => Promise<void>;
  onClose: () => void;
  editingConditionMeterKey?: string;
}

export interface Form {
  label: string;
  description?: string;
  min: number;
  max: number;
  defaultValue: number;
  shared: boolean;
  rollable: boolean;
}

export function ConditionMeterDialogForm(props: ConditionMeterDialogFormProps) {
  const {
    homebrewId,
    onClose,
    onSave,
    conditionMeters,
    editingConditionMeterKey,
  } = props;

  const existingConditionMeter = editingConditionMeterKey
    ? conditionMeters[editingConditionMeterKey] ?? undefined
    : undefined;

  const { condition_meters: baseConditionMeters } = useRules();
  const allConditionMeters = { ...baseConditionMeters, ...conditionMeters };

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields, disabled },
    control,
  } = useForm<Form>({
    disabled: loading,
    values: existingConditionMeter
      ? {
          label: existingConditionMeter.label,
          description: existingConditionMeter.description,
          min: existingConditionMeter.min,
          max: existingConditionMeter.max,
          defaultValue: existingConditionMeter.value,
          shared: existingConditionMeter.shared,
          rollable: existingConditionMeter.rollable,
        }
      : undefined,
  });

  const onSubmit: SubmitHandler<Form> = (values) => {
    setLoading(true);
    const id = editingConditionMeterKey ?? convertIdPart(values.label);
    onSave({
      dataswornId: id,
      collectionId: homebrewId,
      description: values.description,
      shared: values.shared,
      label: values.label,
      value: values.defaultValue,
      min: values.min,
      max: values.max,
      rollable: values.rollable,
    })
      .then(() => {
        setLoading(false);
        onClose();
      })
      .catch(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <DialogTitleWithCloseButton onClose={onClose}>
        {editingConditionMeterKey
          ? "Edit Condition Meter"
          : "Add Condition Meter"}
      </DialogTitleWithCloseButton>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack spacing={2}>
            <TextField
              disabled={disabled}
              label={"Meter Label"}
              fullWidth
              error={touchedFields.label && !!errors.label}
              helperText={
                touchedFields.label && errors.label
                  ? errors.label.message
                  : undefined
              }
              inputProps={{
                defaultValue: "",
                ...register("label", {
                  required: "This field is required.",
                  validate: (value) => {
                    if (!editingConditionMeterKey && value) {
                      try {
                        const id = convertIdPart(value);
                        if (allConditionMeters[id]) {
                          return `You already have a condition meter with id ${id}. Please try a different label.`;
                        }
                      } catch (e) {
                        return "Failed to parse a valid ID for your condition meter. Please use at least three letters or numbers in your label.";
                      }
                    }
                  },
                }),
              }}
            />
            <Controller
              name='description'
              control={control}
              defaultValue={""}
              render={({ field }) => (
                <MarkdownEditor
                  label={"Description"}
                  content={field.value ?? ""}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
              )}
            />
            <TextField
              disabled={disabled}
              label={"Min"}
              fullWidth
              error={touchedFields.min && !!errors.min}
              helperText={
                touchedFields.min && errors.min ? errors.min.message : undefined
              }
              type={"number"}
              inputProps={{
                defaultValue: "",
                ...register("min", {
                  required: "This field is required.",
                  valueAsNumber: true,
                  validate: (value, formValues) => {
                    if (
                      typeof formValues.max === "number" &&
                      formValues.max < formValues.min
                    ) {
                      return "Min should be less than the max";
                    }
                  },
                }),
              }}
            />
            <TextField
              disabled={disabled}
              label={"Max"}
              fullWidth
              error={touchedFields.max && !!errors.max}
              helperText={
                touchedFields.max && errors.max ? errors.max.message : undefined
              }
              type={"number"}
              inputProps={{
                defaultValue: "",
                ...register("max", {
                  required: "This field is required.",
                  valueAsNumber: true,
                  validate: (value, formValues) => {
                    if (
                      typeof formValues.min === "number" &&
                      formValues.max < formValues.min
                    ) {
                      return "Max should be greater than than the min";
                    }
                  },
                }),
              }}
            />
            <TextField
              disabled={disabled}
              label={"Default Value"}
              fullWidth
              error={touchedFields.defaultValue && !!errors.defaultValue}
              helperText={
                touchedFields.defaultValue && errors.defaultValue
                  ? errors.defaultValue.message
                  : undefined
              }
              type={"number"}
              inputProps={{
                defaultValue: "",
                ...register("defaultValue", {
                  required: "This field is required.",
                  valueAsNumber: true,
                  validate: (defaultValue, formValues) => {
                    if (
                      typeof formValues.max === "number" &&
                      typeof formValues.min === "number" &&
                      (formValues.min > defaultValue ||
                        formValues.max < defaultValue)
                    ) {
                      return `Default value must be between ${formValues.min} and ${formValues.max}`;
                    }
                  },
                }),
              }}
            />
            <FormControl error={touchedFields.shared && !!errors.shared}>
              <FormControlLabel
                disabled={disabled}
                control={
                  <Controller
                    name='shared'
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
                label={"Shared across all players?"}
              />
              {touchedFields.shared && errors.shared && (
                <FormHelperText>{errors.shared.message}</FormHelperText>
              )}
            </FormControl>
            <FormControl error={touchedFields.rollable && !!errors.rollable}>
              <FormControlLabel
                disabled={disabled}
                control={
                  <Controller
                    name='rollable'
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
                label={"Add a roller for this stat?"}
              />
              {touchedFields.rollable && errors.rollable && (
                <FormHelperText>{errors.rollable.message}</FormHelperText>
              )}
            </FormControl>
            <Preview>
              <ConditionMeterPreview control={control} />
            </Preview>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            type={"reset"}
            onClick={onClose}
            color={"inherit"}
            disabled={disabled}
          >
            Cancel
          </Button>
          <Button type={"submit"} variant={"contained"} disabled={disabled}>
            Save Changes
          </Button>
        </DialogActions>
      </form>
    </>
  );
}
