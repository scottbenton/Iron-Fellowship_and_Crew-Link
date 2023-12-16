import { StoredRules, StoredStat } from "types/HomebrewCollection.type";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Stack,
  TextField,
} from "@mui/material";
import { useRules } from "data/hooks/useRules";
import { convertIdPart } from "functions/dataswornIdEncoder";
import { useEffect, useState } from "react";
import { DialogTitleWithCloseButton } from "components/shared/DialogTitleWithCloseButton";

export interface StatDialogProps {
  stats: StoredRules["stats"];
  open: boolean;
  onSave: (statId: string, stat: StoredStat) => Promise<void>;
  onClose: () => void;
  editingStatKey?: string;
}

interface StatInputs {
  label: string;
  description: string;
}

export function StatDialog(props: StatDialogProps) {
  const { stats, open, onSave, onClose, editingStatKey } = props;

  const existingStat = editingStatKey
    ? stats[editingStatKey] ?? undefined
    : undefined;
  const { stats: baseStats } = useRules();
  const existingStatKeys = Object.keys({ ...stats, ...baseStats });

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields, disabled },
    reset,
  } = useForm<StatInputs>({ disabled: loading });

  useEffect(() => {
    if (open) {
      reset(
        existingStat
          ? {
              label: existingStat.label,
              description: existingStat.description,
            }
          : undefined
      );
    }
  }, [open, reset, existingStat]);

  const onSubmit: SubmitHandler<StatInputs> = (values) => {
    setLoading(true);
    const id = editingStatKey ?? convertIdPart(values.label);
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
        {existingStat ? "Edit Stat" : "Add Stat"}
      </DialogTitleWithCloseButton>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack spacing={2}>
            {/* register your input into the hook by invoking the "register" function */}
            <TextField
              disabled={disabled}
              label={"Stat Label"}
              fullWidth
              error={touchedFields.label && !!errors.label}
              helperText={
                touchedFields.label && errors.label
                  ? errors.label.message
                  : undefined
              }
              inputProps={{
                defaultValue: existingStat?.label ?? "",
                ...register("label", {
                  required: "This field is required.",
                  validate: (value) => {
                    if (!editingStatKey && value) {
                      try {
                        const id = convertIdPart(value);
                        console.debug(id);
                        if (existingStatKeys.includes(id)) {
                          return `You already have a stat with id ${id}. Please try a different label.`;
                        }
                      } catch (e) {
                        return "Failed to parse a valid ID for your stat. Please use at least three letters or numbers in your label.";
                      }
                    }
                  },
                }),
              }}
            />
            <TextField
              disabled={disabled}
              label={"Description"}
              fullWidth
              error={touchedFields.description && !!errors.description}
              helperText={
                touchedFields.description && errors.description
                  ? errors.description.message
                  : undefined
              }
              inputProps={{
                defaultValue: existingStat?.description ?? "",
                ...register("description", {
                  required: "This field is required.",
                }),
              }}
            />
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
