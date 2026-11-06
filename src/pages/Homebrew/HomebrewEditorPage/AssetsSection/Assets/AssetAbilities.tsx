import {
  Control,
  Controller,
  UseFormRegister,
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
  Checkbox,
  FormControlLabel,
  Stack,
  TextField,
} from "@mui/material";
import { EmptyState } from "components/shared/EmptyState";
import { MarkdownEditor } from "components/shared/RichTextEditor/MarkdownEditor";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export interface AssetAbilitiesProps {
  control: Control<Form>;
  register: UseFormRegister<Form>;
  disabled: boolean;
}

export function AssetAbilities(props: AssetAbilitiesProps) {
  const { control, register, disabled } = props;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "abilities",
  });

  return (
    <>
      <SectionHeading
        floating
        label={"Abilities"}
        headingComponent={"h3"}
        action={
          <Button
            variant={"outlined"}
            color={"inherit"}
            onClick={() =>
              append({
                text: "",
              })
            }
          >
            Add Ability
          </Button>
        }
      />
      {fields.length === 0 && <EmptyState message={"No Abilities added"} />}
      <div>
        {fields.map((field, index) => (
          <Accordion key={field.id} sx={{ w: "100%" }} variant="outlined">
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              Ability {index + 1}
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={2}>
                <TextField
                  disabled={disabled}
                  label={`Ability ${index + 1} Label`}
                  fullWidth
                  inputProps={{
                    defaultValue: "",
                    ...register(`abilities.${index}.name`),
                  }}
                />
                <Controller
                  name={`abilities.${index}.text`}
                  control={control}
                  render={({ field }) => (
                    <MarkdownEditor
                      label={`Ability ${index + 1} Text`}
                      content={field.value ?? ""}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                    />
                  )}
                />
                <FormControlLabel
                  disabled={disabled}
                  control={
                    <Controller
                      name={`abilities.${index}.defaultEnabled`}
                      control={control}
                      defaultValue={false}
                      render={({ field }) => (
                        <Checkbox
                          {...field}
                          defaultChecked={field.value ?? false}
                        />
                      )}
                    />
                  }
                  label={"Always Enabled?"}
                />
              </Stack>
            </AccordionDetails>
            <AccordionActions>
              <Button
                variant={"outlined"}
                color={"inherit"}
                onClick={() => remove(index)}
                aria-label={`Remove Ability ${index + 1}`}
              >
                Remove Ability
              </Button>
            </AccordionActions>
          </Accordion>
        ))}
      </div>
    </>
  );
}
