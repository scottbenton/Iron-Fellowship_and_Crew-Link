import { StoredRules, StoredSpecialTrack } from "types/HomebrewCollection.type";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
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
import { useRules } from "data/hooks/useRules";
import { convertIdPart } from "functions/dataswornIdEncoder";
import { useEffect, useState } from "react";
import { DialogTitleWithCloseButton } from "components/shared/DialogTitleWithCloseButton";
import { MarkdownEditor } from "components/shared/RichTextEditor/MarkdownEditor";

export interface SpecialTrackDialogProps {
  specialTracks: StoredRules["special_tracks"];
  open: boolean;
  onSave: (
    specialTrackId: string,
    specialTrack: StoredSpecialTrack
  ) => Promise<void>;
  onClose: () => void;
  editingSpecialTrackKey?: string;
}

export function SpecialTrackDialog(props: SpecialTrackDialogProps) {
  const { specialTracks, open, onSave, onClose, editingSpecialTrackKey } =
    props;

  const existingSpecialTrack = editingSpecialTrackKey
    ? specialTracks[editingSpecialTrackKey] ?? undefined
    : undefined;
  const { special_tracks: baseSpecialTracks } = useRules();
  const existingSpecialTrackKeys = Object.keys({
    ...specialTracks,
    ...baseSpecialTracks,
  });

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, touchedFields, disabled },
    reset,
  } = useForm<StoredSpecialTrack>({ disabled: loading });

  useEffect(() => {
    if (open) {
      reset(existingSpecialTrack);
    }
  }, [open, reset, existingSpecialTrack]);

  const onSubmit: SubmitHandler<StoredSpecialTrack> = (values) => {
    setLoading(true);
    const id = editingSpecialTrackKey ?? convertIdPart(values.label);
    onSave(id, values)
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
        {existingSpecialTrack ? "Edit Track" : "Add Track"}
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
                defaultValue: existingSpecialTrack?.label ?? "",
                ...register("label", {
                  required: "This field is required.",
                  validate: (value) => {
                    if (!editingSpecialTrackKey && value) {
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
            <FormControl error={touchedFields.shared && !!errors.shared}>
              <FormControlLabel
                disabled={disabled}
                control={
                  <Controller
                    name="shared"
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
                    name="optional"
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
    </Dialog>
  );
}
