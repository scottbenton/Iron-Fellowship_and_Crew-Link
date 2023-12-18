import { useRules } from "data/hooks/useRules";
import { useEffect, useState } from "react";
import {
  StoredImpactCategory,
  StoredRules,
} from "types/HomebrewCollection.type";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Stack,
  TextField,
} from "@mui/material";
import { DialogTitleWithCloseButton } from "components/shared/DialogTitleWithCloseButton";
import { convertIdPart } from "functions/dataswornIdEncoder";

export interface ImpactCategoryDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (
    impactCategoryId: string,
    impactCategory: StoredImpactCategory
  ) => Promise<void>;
  impactCategories: StoredRules["impacts"];
  editingCategoryKey?: string;
}

type CategoryWithoutImpacts = Omit<StoredImpactCategory, "contents">;

export function ImpactCategoryDialog(props: ImpactCategoryDialogProps) {
  const { open, onClose, onSave, impactCategories, editingCategoryKey } = props;

  const existingCategory = editingCategoryKey
    ? impactCategories[editingCategoryKey] ?? undefined
    : undefined;

  const { impacts } = useRules();
  const allImpactCategories = { ...impacts, ...impactCategories };

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields, disabled },
    reset,
  } = useForm<CategoryWithoutImpacts>({ disabled: loading });

  useEffect(() => {
    if (open) {
      reset(
        existingCategory
          ? {
              label: existingCategory.label,
              description: existingCategory.description,
            }
          : undefined
      );
    }
  }, [open, reset, existingCategory]);

  const onSubmit: SubmitHandler<CategoryWithoutImpacts> = (values) => {
    setLoading(true);
    const id = editingCategoryKey ?? convertIdPart(values.label);
    onSave(id, { ...values, contents: existingCategory?.contents ?? {} })
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
        {editingCategoryKey ? "Edit Impact Category" : "Add Impact Category"}
      </DialogTitleWithCloseButton>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack spacing={2}>
            <TextField
              disabled={disabled}
              label={"Category Label"}
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
                    if (!editingCategoryKey && value) {
                      try {
                        const id = convertIdPart(value);
                        if (allImpactCategories[id]) {
                          return `You already have an impact category with id ${id}. Please try a different label.`;
                        }
                      } catch (e) {
                        return "Failed to parse a valid ID for your impact category. Please use at least three letters or numbers in your label.";
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
                defaultValue: "",
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
