import { useRules } from "data/hooks/useRules";
import { useState } from "react";
import { StoredImpactCategory } from "types/homebrew/HomebrewRules.type";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  Button,
  DialogActions,
  DialogContent,
  Stack,
  TextField,
} from "@mui/material";
import { DialogTitleWithCloseButton } from "components/shared/DialogTitleWithCloseButton";
import { convertIdPart } from "functions/dataswornIdEncoder";
import { MarkdownEditor } from "components/shared/RichTextEditor/MarkdownEditor";

export interface ImpactCategoryDialogFormProps {
  homebrewId: string;
  onClose: () => void;
  onSave: (impactCategory: StoredImpactCategory) => Promise<void>;
  impactCategories: Record<string, StoredImpactCategory>;
  editingCategoryKey?: string;
}

export interface Form {
  label: string;
  description?: string;
}

export function ImpactCategoryDialogForm(props: ImpactCategoryDialogFormProps) {
  const { homebrewId, onClose, onSave, impactCategories, editingCategoryKey } =
    props;

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
    control,
  } = useForm<Form>({
    disabled: loading,
    values: existingCategory
      ? {
          label: existingCategory.label,
          description: existingCategory.description,
        }
      : undefined,
  });

  const onSubmit: SubmitHandler<Form> = (values) => {
    setLoading(true);
    onSave({
      contents: {},
      ...existingCategory,
      collectionId: homebrewId,
      label: values.label,
      description: values.description,
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
