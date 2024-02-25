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
import { OracleCollectionAutocomplete } from "../../OracleCollectionAutocomplete";
import { useStore } from "stores/store";
import { StoredOracleCollection } from "types/homebrew/HomebrewOracles.type";

export interface OracleTablesCollectionDialogFormProps {
  homebrewId: string;
  onClose: () => void;

  collections: Record<string, StoredOracleCollection>;
  existingCollectionId?: string;

  parentCollectionId?: string;
}

interface OracleTablesCollectionFormContents {
  name: string;
  description?: string;
  enhancesId?: string;
  replacesId?: string;
}

export function OracleTablesCollectionDialogForm(
  props: OracleTablesCollectionDialogFormProps
) {
  const {
    homebrewId,
    onClose,
    existingCollectionId,
    collections,
    parentCollectionId,
  } = props;

  const existingCollection = existingCollectionId
    ? collections[existingCollectionId]
    : undefined;

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields, disabled },
    control,
  } = useForm<OracleTablesCollectionFormContents>({
    disabled: loading,
    defaultValues: existingCollection
      ? {
          name: existingCollection.label,
          description: existingCollection.description,
          enhancesId: existingCollection.enhancesId,
          replacesId: existingCollection.replacesId,
        }
      : {},
  });

  const createOracleCollection = useStore(
    (store) => store.homebrew.createOracleCollection
  );
  const updateOracleCollection = useStore(
    (store) => store.homebrew.updateOracleCollection
  );

  const onSubmit: SubmitHandler<OracleTablesCollectionFormContents> = (
    values
  ) => {
    setLoading(true);

    const oracleCollection: StoredOracleCollection = {
      collectionId: homebrewId,
      label: values.name,
    };

    const newParentCollection = existingCollection
      ? existingCollection.parentOracleCollectionId
      : parentCollectionId;

    if (newParentCollection) {
      oracleCollection.parentOracleCollectionId = newParentCollection;
    }

    if (values.description) {
      oracleCollection.description = values.description;
    }
    if (values.enhancesId) {
      oracleCollection.enhancesId = values.enhancesId;
    }
    if (values.replacesId) {
      oracleCollection.replacesId = values.replacesId;
    }

    if (existingCollectionId) {
      updateOracleCollection(existingCollectionId, oracleCollection)
        .then(() => {
          setLoading(false);
          onClose();
        })
        .catch(() => {
          setLoading(false);
        });
    } else {
      createOracleCollection(oracleCollection)
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
        {existingCollection
          ? `Edit ${existingCollection.label}`
          : "Create Oracle Collection"}
      </DialogTitleWithCloseButton>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack spacing={2}>
            <TextField
              disabled={disabled}
              label={"Collection Label"}
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
                    if (!existingCollectionId && value) {
                      try {
                        const id = convertIdPart(value);
                        if (collections[id]) {
                          return `You already have an oracle collection with id ${id}. Please try a different label.`;
                        }
                      } catch (e) {
                        return "Failed to parse a valid ID for your Oracle Collection. Please use at least three letters or numbers in your label.";
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
                <OracleCollectionAutocomplete
                  label={"Replaces Collection"}
                  value={field.value}
                  onChange={(ids) => field.onChange(ids)}
                  onBlur={field.onBlur}
                  helperText={
                    "Replaces all oracles within the given collection"
                  }
                />
              )}
            />
            <Controller
              name={"enhancesId"}
              control={control}
              render={({ field }) => (
                <OracleCollectionAutocomplete
                  label={"Enhances Collection"}
                  value={field.value}
                  onChange={(ids) => field.onChange(ids)}
                  onBlur={field.onBlur}
                  helperText={
                    "Adds oracles in this collection to the entered collection"
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
