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
import { NumberField } from "components/shared/NumberField";
import { convertIdPart } from "functions/dataswornIdEncoder";

export interface AssetControlsProps {
  control: Control<Form>;
  register: UseFormRegister<Form>;
  formState: UseFormReturn<Form>["formState"];
}

export function AssetControls(props: AssetControlsProps) {
  const { control, register, formState } = props;

  const { touchedFields, errors, disabled } = formState;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "controls",
  });

  return (
    <>
      <SectionHeading
        floating
        label={"Controls"}
        headingComponent={"h3"}
        action={
          <Button
            variant={"outlined"}
            color={"inherit"}
            onClick={() =>
              append({ type: "conditionMeter", label: "", min: 0, max: 5 })
            }
          >
            Add Control
          </Button>
        }
      />
      {fields.length === 0 && <EmptyState message={"No Controls added"} />}

      <div>
        {fields.map((field, index) => (
          <Accordion key={field.id} sx={{ w: "100%" }} variant="outlined">
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              Control {index + 1}
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={2}>
                <TextField
                  disabled={disabled}
                  label={`Control Label`}
                  fullWidth
                  required
                  error={
                    touchedFields.controls?.[index]?.label &&
                    !!errors.controls?.[index]?.label
                  }
                  helperText={
                    touchedFields.controls?.[index]?.label &&
                    errors.controls?.[index]?.label
                      ? errors.controls?.[index]?.label?.message ?? ""
                      : "Each control must have a unique label"
                  }
                  inputProps={{
                    defaultValue: "",
                    ...register(`controls.${index}.label`, {
                      required: "This field is required.",
                      validate: (value) => {
                        try {
                          convertIdPart(value);
                        } catch (e) {
                          return "Failed to parse a valid ID for your control. Please use at least three letters or numbers in your label.";
                        }
                      },
                    }),
                  }}
                />
                <Controller
                  name={`controls.${index}.type`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      disabled={disabled}
                      label={`Control Type`}
                      select
                      fullWidth
                      required
                      value={field.value ?? ""}
                      onChange={(evt) => field.onChange(evt.target.value)}
                      onBlur={() => field.onBlur()}
                    >
                      <MenuItem value={"conditionMeter"}>
                        Condition Meter
                      </MenuItem>
                      <MenuItem value={"select"}>Select</MenuItem>
                      <MenuItem value={"checkbox"}>Checkbox</MenuItem>
                    </TextField>
                  )}
                />
                <OptionalFieldWrapper
                  control={control}
                  when={{
                    field: `controls.${index}.type`,
                    is: "select",
                  }}
                >
                  <Controller
                    name={`controls.${index}.options`}
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
                        disabled={disabled}
                      />
                    )}
                  />
                </OptionalFieldWrapper>
                <OptionalFieldWrapper
                  control={control}
                  when={{
                    field: `controls.${index}.type`,
                    is: "conditionMeter",
                  }}
                >
                  <Controller
                    name={`controls.${index}.min`}
                    control={control}
                    render={({ field }) => (
                      <NumberField
                        fullWidth
                        disabled={disabled}
                        label={"Min"}
                        required
                        value={field.value}
                        onChange={(min) => field.onChange(min)}
                      />
                    )}
                  />
                  <Controller
                    name={`controls.${index}.max`}
                    control={control}
                    render={({ field }) => (
                      <NumberField
                        fullWidth
                        disabled={disabled}
                        label={"Max"}
                        required
                        value={field.value}
                        onChange={(min) => field.onChange(min)}
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
                Remove Control
              </Button>
            </AccordionActions>
          </Accordion>
        ))}
      </div>
    </>
  );
}
