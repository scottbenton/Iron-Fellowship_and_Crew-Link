import {
  Button,
  DialogActions,
  DialogContent,
  Stack,
  TextField,
} from "@mui/material";
import { DialogTitleWithCloseButton } from "components/shared/DialogTitleWithCloseButton";
import { MarkdownEditor } from "components/shared/RichTextEditor/MarkdownEditor";
import { convertIdPart } from "functions/dataswornIdEncoder";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useStore } from "stores/store";
import { StoredMoveCategory } from "types/homebrew/HomebrewMoves.type";
import { MoveCategoryAutocomplete } from "../MoveCategoryAutocomplete";

export interface MoveCategoryFormDialogProps {
  homebrewId: string;
  existingMoveCategoryId?: string;
  onClose: () => void;
}

interface Form {
  label: string;
  description?: string;
  enhancesId?: string;
  replacesId?: string;
}

export function MoveCategoryDialogForm(props: MoveCategoryFormDialogProps) {
  const { homebrewId, existingMoveCategoryId, onClose } = props;

  const moveCategories = useStore(
    (store) =>
      store.homebrew.collections[homebrewId]?.moveCategories?.data ?? {}
  );

  const existingMoveCategory = existingMoveCategoryId
    ? moveCategories[existingMoveCategoryId]
    : undefined;

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields, disabled },
    control,
  } = useForm<Form>({
    disabled: loading,
    defaultValues: existingMoveCategory
      ? {
          label: existingMoveCategory.label,
          description: existingMoveCategory.description,
          enhancesId: existingMoveCategory.enhancesId,
          replacesId: existingMoveCategory.replacesId,
        }
      : {},
  });

  const createMoveCategory = useStore(
    (store) => store.homebrew.createMoveCategory
  );
  const updateMoveCategory = useStore(
    (store) => store.homebrew.updateMoveCategory
  );

  const onSubmit: SubmitHandler<Form> = (values) => {
    setLoading(true);

    const moveCategory: StoredMoveCategory = {
      collectionId: homebrewId,
      label: values.label,
    };

    if (values.description) {
      moveCategory.description = values.description;
    }
    if (values.enhancesId) {
      moveCategory.enhancesId = values.enhancesId;
    }
    if (values.replacesId) {
      moveCategory.replacesId = values.replacesId;
    }

    if (existingMoveCategoryId) {
      updateMoveCategory(existingMoveCategoryId, moveCategory)
        .then(() => {
          setLoading(false);
          onClose();
        })
        .catch(() => {
          setLoading(false);
        });
    } else {
      createMoveCategory(moveCategory)
        .then(() => {
          setLoading(false);
          onClose();
        })
        .catch(() => {
          setLoading(false);
        });
    }
  };

  return (
    <>
      <DialogTitleWithCloseButton onClose={onClose}>
        {existingMoveCategory
          ? `Edit ${existingMoveCategory.label}`
          : "Create Move Category"}
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
                    if (!existingMoveCategoryId && value) {
                      try {
                        const id = convertIdPart(value);
                        if (moveCategories[id]) {
                          return `You already have a move category with id ${id}. Please try a different label.`;
                        }
                      } catch (e) {
                        return "Failed to parse a valid ID for your Move Category. Please use at least three letters or numbers in your label.";
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
                <MoveCategoryAutocomplete
                  label={"Replaces Category"}
                  value={field.value}
                  onChange={(ids) => field.onChange(ids)}
                  onBlur={field.onBlur}
                  helperText={
                    "Replaces the category (and all moves within) with this category"
                  }
                />
              )}
            />
            <Controller
              name={"enhancesId"}
              control={control}
              render={({ field }) => (
                <MoveCategoryAutocomplete
                  label={"Enhances Category"}
                  value={field.value}
                  onChange={(ids) => field.onChange(ids)}
                  onBlur={field.onBlur}
                  helperText={
                    "Adds moves in this category to the entered category"
                  }
                />
              )}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button type={"reset"} color={"inherit"} onClick={onClose}>
            Cancel
          </Button>
          <Button type={"submit"} variant={"contained"} onClick={() => {}}>
            Save
          </Button>
        </DialogActions>
      </form>
    </>
  );
}
