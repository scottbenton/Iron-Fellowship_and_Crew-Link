import { StoredLegacyTrack } from "types/homebrew/HomebrewRules.type";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
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
import { useRules } from "data/hooks/useRules";
import { convertIdPart } from "functions/dataswornIdEncoder";
import { useState } from "react";
import { DialogTitleWithCloseButton } from "components/shared/DialogTitleWithCloseButton";
import { MarkdownEditor } from "components/shared/RichTextEditor/MarkdownEditor";

export interface LegacyTrackDialogFormProps {
  homebrewId: string;
  legacyTracks: Record<string, StoredLegacyTrack>;
  onSave: (legacyTrack: StoredLegacyTrack) => Promise<void>;
  onClose: () => void;
  editingLegacyTrackKey?: string;
}

export interface Form {
  label: string;
  description?: string;
  shared: boolean;
  optional: boolean;
}

export function LegacyTrackDialogForm(props: LegacyTrackDialogFormProps) {
  const { homebrewId, legacyTracks, onSave, onClose, editingLegacyTrackKey } =
    props;

  const existingLegacyTrack = editingLegacyTrackKey
    ? legacyTracks[editingLegacyTrackKey] ?? undefined
    : undefined;
  const { special_tracks: baseSpecialTracks } = useRules();
  const existingSpecialTrackKeys = Object.keys({
    ...legacyTracks,
    ...baseSpecialTracks,
  });

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, touchedFields, disabled },
  } = useForm<Form>({
    disabled: loading,
    values: existingLegacyTrack
      ? {
          label: existingLegacyTrack.label,
          description: existingLegacyTrack.description,
          shared: existingLegacyTrack.shared,
          optional: existingLegacyTrack.optional,
        }
      : undefined,
  });

  const onSubmit: SubmitHandler<Form> = (values) => {
    setLoading(true);
    const dataswornId = convertIdPart(values.label);
    onSave({
      label: values.label,
      description: values.description,
      shared: values.shared,
      optional: values.optional,
      collectionId: homebrewId,
      dataswornId,
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
      {" "}
      <DialogTitleWithCloseButton onClose={onClose}>
        {existingLegacyTrack ? "Edit Track" : "Add Track"}
      </DialogTitleWithCloseButton>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack spacing={2}>
            {/* register your input into the hook by invoking the "register" function */}
            <TextField
              disabled={disabled}
              label={"Track Label"}
              fullWidth
              error={touchedFields.label && !!errors.label}
              helperText={
                touchedFields.label && errors.label
                  ? errors.label.message
                  : undefined
              }
              inputProps={{
                ...register("label", {
                  required: "This field is required.",
                  validate: (value) => {
                    if (!editingLegacyTrackKey && value) {
                      try {
                        const id = convertIdPart(value);
                        if (existingSpecialTrackKeys.includes(id)) {
                          return `You already have a track with id ${id}. Please try a different label.`;
                        }
                      } catch (e) {
                        return "Failed to parse a valid ID for your track. Please use at least three letters or numbers in your label.";
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
            <FormControl error={touchedFields.shared && !!errors.shared}>
              <FormControlLabel
                disabled={disabled}
                control={
                  <Controller
                    name='shared'
                    control={control}
                    defaultValue={false}
                    render={({ field }) => (
                      <Checkbox {...field} defaultChecked={false} />
                    )}
                  />
                }
                label={"Shared across all players?"}
              />
              {touchedFields.shared && errors.shared && (
                <FormHelperText>{errors.shared.message}</FormHelperText>
              )}
            </FormControl>
            <FormControl error={touchedFields.optional && !!errors.optional}>
              <FormControlLabel
                disabled={disabled}
                control={
                  <Controller
                    name='optional'
                    control={control}
                    defaultValue={false}
                    render={({ field }) => (
                      <Checkbox {...field} defaultChecked={false} />
                    )}
                  />
                }
                label={"Optional?"}
              />
              {touchedFields.optional && errors.optional && (
                <FormHelperText>{errors.optional.message}</FormHelperText>
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
    </>
  );
}
