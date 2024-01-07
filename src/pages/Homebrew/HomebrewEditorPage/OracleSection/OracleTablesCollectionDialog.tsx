import { OracleCollection, OracleTablesCollection } from "@datasworn/core";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Stack,
  TextField,
} from "@mui/material";
import { DialogTitleWithCloseButton } from "components/shared/DialogTitleWithCloseButton";
import { MarkdownEditor } from "components/shared/RichTextEditor/MarkdownEditor";
import {
  convertIdPart,
  encodeAndConstructDataswornId,
} from "functions/dataswornIdEncoder";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { OracleCollectionAutocomplete } from "./OracleCollectionAutocomplete";
import { useStore } from "stores/store";

export interface OracleTablesCollectionDialogProps {
  homebrewId: string;
  open: boolean;
  onClose: () => void;

  collections: Record<string, OracleCollection>;
  existingCollection?: { key: string; collection: OracleTablesCollection };

  dbPath: string;
  parentCollectionKey?: string;
}

interface OracleTablesCollectionFormContents {
  name: string;
  description?: string;
  enhancesId?: string;
  replacesId?: string;
}

export function OracleTablesCollectionDialog(
  props: OracleTablesCollectionDialogProps
) {
  const {
    homebrewId,
    open,
    onClose,
    existingCollection,
    collections,
    dbPath,
    parentCollectionKey,
  } = props;

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields, disabled },
    reset,
    control,
  } = useForm<OracleTablesCollectionFormContents>({ disabled: loading });

  useEffect(() => {
    if (open) {
      reset(
        existingCollection
          ? {
              name: existingCollection.collection.name,
              description:
                existingCollection.collection.description ??
                existingCollection.collection.summary,
              enhancesId: existingCollection.collection.enhances,
              replacesId: existingCollection.collection.replaces,
            }
          : {}
      );
    }
  }, [open, reset, existingCollection]);

  const updateOracles = useStore(
    (store) => store.homebrew.updateExpansionOracles
  );

  const handleOracleTableCollectionUpdate = (
    oracleTableId: string,
    table: OracleTablesCollection
  ) => {
    const path =
      (dbPath ?? "") +
      // If we have a parent oracle, we are not editing (we are not at root)
      (parentCollectionKey ? `${parentCollectionKey}.collections.` : "") +
      oracleTableId;

    return updateOracles(homebrewId, {
      [path]: table,
    }).catch(() => {});
  };

  const onSubmit: SubmitHandler<OracleTablesCollectionFormContents> = (
    values
  ) => {
    setLoading(true);
    const firebaseKey = existingCollection?.key ?? convertIdPart(values.name);

    const id =
      existingCollection?.collection.id ??
      encodeAndConstructDataswornId(
        homebrewId,
        "collections/oracles",
        values.name
      );

    const baseTableCollection: OracleTablesCollection = {
      ...existingCollection,
      id,
      name: values.name,
      description: values.description ?? "",
      source: {
        title: "Placeholder",
        authors: [],
        date: "2024-01-01",
        url: "",
        license: "",
      },
      oracle_type: "tables",
    };

    if (values.enhancesId) {
      baseTableCollection.enhances = values.enhancesId;
    }
    if (values.replacesId) {
      baseTableCollection.replaces = values.replacesId;
    }

    handleOracleTableCollectionUpdate(firebaseKey, baseTableCollection)
      .then(() => {
        setLoading(false);
        onClose();
      })
      .catch(() => {
        setLoading(false);
      });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitleWithCloseButton onClose={onClose}>
        {existingCollection
          ? `Edit ${existingCollection.collection.name}`
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
                    if (!existingCollection?.collection.id && value) {
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
              name="description"
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
                  homebrewId={homebrewId}
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
                  homebrewId={homebrewId}
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
    </Dialog>
  );
}
