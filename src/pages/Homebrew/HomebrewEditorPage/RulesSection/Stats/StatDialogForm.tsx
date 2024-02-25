import { StoredStat } from "types/homebrew/HomebrewRules.type";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import {
  Button,
  DialogActions,
  DialogContent,
  Stack,
  TextField,
} from "@mui/material";
import { useRules } from "data/hooks/useRules";
import { convertIdPart } from "functions/dataswornIdEncoder";
import { useState } from "react";
import { DialogTitleWithCloseButton } from "components/shared/DialogTitleWithCloseButton";
import { Preview } from "../../Preview";
import { StatPreviewComponent } from "./StatPreviewComponent";
import { MarkdownEditor } from "components/shared/RichTextEditor/MarkdownEditor";

export interface StatDialogFormProps {
  homebrewId: string;
  stats: Record<string, StoredStat>;
  onSave: (stat: StoredStat) => Promise<void>;
  onClose: () => void;
  editingStatKey?: string;
}

export interface Form {
  label: string;
  description?: string;
}

export function StatDialogForm(props: StatDialogFormProps) {
  const { homebrewId, stats, onSave, onClose, editingStatKey } = props;

  const existingStat = editingStatKey
    ? stats[editingStatKey] ?? undefined
    : undefined;
  const { stats: baseStats } = useRules();
  const existingStatKeys = Object.keys({ ...baseStats });
  Object.values(stats).forEach((stat) =>
    existingStatKeys.push(stat.dataswornId)
  );

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, touchedFields, disabled },
  } = useForm<Form>({
    disabled: loading,
    values: existingStat
      ? {
          label: existingStat.label,
          description: existingStat.description,
        }
      : undefined,
  });

  const onSubmit: SubmitHandler<Form> = (values) => {
    setLoading(true);
    const id = editingStatKey ?? convertIdPart(values.label);
    onSave({
      dataswornId: id,
      label: values.label,
      description: values.description,
      collectionId: homebrewId,
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
            <Preview>
              <StatPreviewComponent control={control} />
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
