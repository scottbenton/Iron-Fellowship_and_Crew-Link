import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Stack,
  TextField,
} from "@mui/material";
import { DialogTitleWithCloseButton } from "components/shared/DialogTitleWithCloseButton";
import { convertIdPart } from "functions/dataswornIdEncoder";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  StoredConditionMeter,
  StoredImpact,
  StoredImpactCategory,
} from "types/homebrew/HomebrewRules.type";
import { ConditionMeterAutocomplete } from "../ConditionMeters/ConditionMeterAutocomplete";
import { MarkdownEditor } from "components/shared/RichTextEditor/MarkdownEditor";

export interface ImpactDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (
    impactCategoryId: string,
    impactId: string,
    impact: StoredImpact
  ) => Promise<void>;
  impacts: StoredImpactCategory["contents"];
  editingCategoryKey: string;
  editingImpactKey?: string;
  conditionMeters: Record<string, StoredConditionMeter>;
}

export function ImpactDialog(props: ImpactDialogProps) {
  const {
    open,
    onClose,
    onSave,
    impacts,
    editingCategoryKey,
    editingImpactKey,
    conditionMeters,
  } = props;

  const existingImpact =
    editingCategoryKey && editingImpactKey
      ? impacts[editingImpactKey] ?? undefined
      : undefined;

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields, disabled },
    reset,
    control,
  } = useForm<StoredImpact>({ disabled: loading });

  useEffect(() => {
    if (open) {
      reset(existingImpact);
    }
  }, [open, reset, existingImpact]);

  const onSubmit: SubmitHandler<StoredImpact> = (values) => {
    setLoading(true);
    const id = editingImpactKey ?? convertIdPart(values.label);
    onSave(editingCategoryKey, id, values)
      .then(() => {
        setLoading(false);
        onClose();
      })
      .catch(() => {
        setLoading(false);
      });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth={"xs"} fullWidth>
      <DialogTitleWithCloseButton onClose={onClose}>
        {editingImpactKey ? "Edit Impact" : "Add Impact"}
      </DialogTitleWithCloseButton>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack spacing={2}>
            <TextField
              disabled={disabled}
              label={"Impact Label"}
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
                    if (!editingImpactKey && value) {
                      try {
                        const id = convertIdPart(value);
                        if (impacts[id]) {
                          return `You already have an impact with id ${id}. Please try a different label.`;
                        }
                      } catch (e) {
                        return "Failed to parse a valid ID for your impact. Please use at least three letters or numbers in your label.";
                      }
                    }
                  },
                }),
              }}
            />
            <Controller
              name="description"
              control={control}
              defaultValue={""}
              render={({ field }) => (
                <MarkdownEditor
                  label={"Description"}
                  content={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
              )}
            />
            <FormControl error={touchedFields.permanent && !!errors.permanent}>
              <FormControlLabel
                disabled={disabled}
                control={
                  <Controller
                    name="permanent"
                    control={control}
                    defaultValue={false}
                    render={({ field }) => (
                      <Checkbox
                        {...field}
                        checked={field.value}
                        defaultChecked={false}
                      />
                    )}
                  />
                }
                label={"Permanent Impact?"}
              />
              {touchedFields.permanent && errors.permanent && (
                <FormHelperText>{errors.permanent.message}</FormHelperText>
              )}
            </FormControl>
            <Controller
              name={"prevents_recovery"}
              control={control}
              defaultValue={[]}
              render={({ field }) => (
                <ConditionMeterAutocomplete
                  label={"Prevents Recovery on"}
                  value={field.value}
                  conditionMeters={conditionMeters}
                  onChange={(ids) => field.onChange(ids)}
                  onBlur={field.onBlur}
                />
              )}
            />
            <FormControl error={touchedFields.shared && !!errors.shared}>
              <FormControlLabel
                disabled={disabled}
                control={
                  <Controller
                    name="shared"
                    control={control}
                    defaultValue={false}
                    render={({ field }) => (
                      <Checkbox
                        {...field}
                        checked={field.value}
                        defaultChecked={false}
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
    </Dialog>
  );
}
