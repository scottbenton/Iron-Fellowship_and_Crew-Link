import {
  Control,
  Controller,
  UseFormRegister,
  UseFormReturn,
  useFieldArray,
} from "react-hook-form";
import { Form } from "./AssetDialogForm";
import { SectionHeading } from "components/shared/SectionHeading";
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Button,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { EmptyState } from "components/shared/EmptyState";
import { OptionalFieldWrapper } from "./OptionalFieldWrapper";
import { convertIdPart } from "functions/dataswornIdEncoder";

export interface AssetOptionsProps {
  control: Control<Form>;
  register: UseFormRegister<Form>;
  formState: UseFormReturn<Form>["formState"];
}

export function AssetOptions(props: AssetOptionsProps) {
  const { control, register, formState } = props;

  const { touchedFields, errors, disabled } = formState;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "options",
  });

  return (
    <>
      <SectionHeading
        floating
        label={"Options"}
        headingComponent={"h3"}
        action={
          <Button
            variant={"outlined"}
            color={"inherit"}
            onClick={() => append({ type: "text", label: "" })}
          >
            Add Option
          </Button>
        }
      />
      {fields.length === 0 && <EmptyState message={"No Options added"} />}

      <div>
        {fields.map((field, index) => (
          <Accordion key={field.id} sx={{ w: "100%" }} variant="outlined">
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              Option {index + 1}
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={2}>
                <TextField
                  disabled={disabled}
                  label={`Option Label`}
                  fullWidth
                  required
                  error={
                    touchedFields.options?.[index]?.label &&
                    !!errors.options?.[index]?.label
                  }
                  helperText={
                    touchedFields.options?.[index]?.label &&
                    errors.options?.[index]?.label
                      ? errors.options?.[index]?.label?.message ?? ""
                      : "Each option must have a unique label"
                  }
                  inputProps={{
                    defaultValue: "",
                    ...register(`options.${index}.label`, {
                      required: "This field is required.",
                      validate: (value) => {
                        try {
                          convertIdPart(value);
                        } catch (e) {
                          return "Failed to parse a valid ID for your option. Please use at least three letters or numbers in your label.";
                        }
                      },
                    }),
                  }}
                />
                <Controller
                  name={`options.${index}.type`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      disabled={disabled}
                      label={`Option Type`}
                      select
                      fullWidth
                      required
                      value={field.value ?? ""}
                      onChange={(evt) => field.onChange(evt.target.value)}
                      onBlur={() => field.onBlur()}
                    >
                      <MenuItem value={"text"}>Text</MenuItem>
                      <MenuItem value={"select"}>Select</MenuItem>
                    </TextField>
                  )}
                />
                <OptionalFieldWrapper
                  control={control}
                  when={{
                    field: `options.${index}.type`,
                    is: "select",
                  }}
                >
                  <Controller
                    name={`options.${index}.options`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        label={"Select Options"}
                        required
                        value={field.value?.join(",") ?? ""}
                        onChange={(evt) =>
                          field.onChange(evt.currentTarget.value.split(","))
                        }
                        helperText={
                          "Enter options as a comma separated list, ex: Health,Spirit,Supply"
                        }
                        fullWidth
                      />
                    )}
                  />
                </OptionalFieldWrapper>
              </Stack>
            </AccordionDetails>
            <AccordionActions>
              <Button
                variant={"outlined"}
                color={"inherit"}
                onClick={() => remove(index)}
              >
                Remove Option
              </Button>
            </AccordionActions>
          </Accordion>
        ))}
      </div>
    </>
  );
}
