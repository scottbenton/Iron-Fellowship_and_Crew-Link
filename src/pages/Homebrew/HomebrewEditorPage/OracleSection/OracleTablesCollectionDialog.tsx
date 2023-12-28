import { OracleTablesCollection } from "@datasworn/core";
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
import { convertIdPart } from "functions/dataswornIdEncoder";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

export interface OracleTablesCollectionDialogProps {
  open: boolean;
  onClose: () => void;

  collections: Record<string, OracleTablesCollection>;
  existingCollection?: OracleTablesCollection;
  saveCollection: (
    id: string,
    collection: OracleTablesCollection
  ) => Promise<void>;
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
  const { open, onClose, existingCollection, saveCollection, collections } =
    props;

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
              name: existingCollection.name,
              description:
                existingCollection.description ?? existingCollection.summary,
              enhancesId: existingCollection.enhances,
              replacesId: existingCollection.replaces,
            }
          : undefined
      );
    }
  }, [open, reset, existingCollection]);

  const onSubmit: SubmitHandler<OracleTablesCollectionFormContents> = (
    values
  ) => {
    setLoading(true);
    const id = existingCollection?.id ?? convertIdPart(values.name);

    const baseTableCollection: OracleTablesCollection = {
      ...existingCollection,
      id,
      name: values.name,
      description: values.description,
      enhances: values.enhancesId,
      replaces: values.replacesId,
      source: {
        title: "Placeholder",
        authors: [],
        date: "2024-01-01",
        url: "",
        license: "",
      },
      oracle_type: "tables",
    };

    saveCollection(id, baseTableCollection)
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
          ? `Edit ${existingCollection.name}`
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
                    if (!existingCollection?.id && value) {
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
            {/* <FormControl
              error={touchedFields.replacesId && !!errors.replacesId}
            >
              <FormControlLabel
                disabled={disabled}
                control={
                  <Controller
                    name="replacesId"
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
            </FormControl> */}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button type={"reset"} onClick={onClose}>
            Cancel
          </Button>
          <Button type={"submit"} onClick={() => {}}>
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
