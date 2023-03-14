import { Box, Button, Grid, MenuItem, Stack, TextField } from "@mui/material";
import { useSnackbar } from "../../hooks/useSnackbar";
import type { Asset, InputSelectOption } from "dataforged";
import { InputType, License } from "types/Datasworn";
import {
  AssetType,
  assetTypeToIdMap,
  getAssetType,
  StoredAsset,
} from "../../types/Asset.type";
import { SectionHeading } from "../SectionHeading";
import { FieldArray, Formik, getIn, yupToFormErrors } from "formik";
import * as Yup from "yup";
import { NumberField } from "components/NumberField";
import {
  encodeContents,
  generateAssetDataswornId,
  generateCustomDataswornId,
} from "functions/dataswornIdEncoder";

export interface CreateCustomAssetProps {
  handleSelect: (asset: Asset) => void;
  startingAsset?: Asset;
}

type FormAssetInput =
  | {
      type: InputType.Text;
      label: string;
    }
  | {
      type: InputType.Select;
      label: string;
      options: string[];
    };

interface FormAssetTrack {
  label: string;
  min: number;
  max: number;
  startingValue: number;
}
2;
interface FormValues {
  assetType: AssetType;
  name: string;
  description?: string;

  inputs?: FormAssetInput[];
  track?: FormAssetTrack;

  ability1Name?: string;
  ability1Description: string;
  ability2Name?: string;
  ability2Description: string;
  ability3Name?: string;
  ability3Description: string;
}

const formSchema = Yup.object().shape({
  assetType: Yup.string().required("Category is required"),
  name: Yup.string().required("Asset name is required"),
  inputs: Yup.array(
    Yup.object().shape({
      type: Yup.string().required("Input type is required"),
      label: Yup.string().required("Input label is required"),
    })
  ).optional(),
  track: Yup.object()
    .shape({
      label: Yup.string().required("Track label is required"),
      min: Yup.number().required("Minimum value is required"),
      max: Yup.number().required("Maximum value is required"),
      startingValue: Yup.number().required("Starting value is required"),
    })
    .default(undefined),
  ability1Description: Yup.string().required("Description is required"),
  ability2Description: Yup.string().required("Description is required"),
  ability3Description: Yup.string().required("Description is required"),
});

function convertAssetToFormValue(asset?: Asset) {
  const inputs: FormAssetInput[] = [];
  Object.values(asset?.Inputs ?? {}).forEach((input) => {
    if (input["Input type"] === InputType.Text) {
      inputs.push({
        type: InputType.Text,
        label: input.Label ?? "",
      });
    } else if (input["Input type"] === InputType.Select) {
      inputs.push({
        type: InputType.Select,
        label: input.Label ?? "",
        options: Object.values(input.Options ?? {}).map(
          (option) => option.Label
        ),
      });
    }
  });

  const initialValues: FormValues = {
    assetType: getAssetType(asset?.["Asset type"]) ?? AssetType.Companion,
    name: asset?.Title.Standard ?? "",
    description: asset?.Requirement,

    inputs,
    track: asset?.["Condition meter"] && {
      label: asset["Condition meter"].Label,
      min: asset["Condition meter"].Min,
      max: asset["Condition meter"].Max,
      startingValue: asset["Condition meter"].Value,
    },

    ability1Name: asset?.Abilities[0].Label,
    ability1Description: asset?.Abilities[0].Text ?? "",
    ability2Name: asset?.Abilities[1].Label,
    ability2Description: asset?.Abilities[1].Text ?? "",
    ability3Name: asset?.Abilities[2].Label,
    ability3Description: asset?.Abilities[2].Text ?? "",
  };

  return initialValues;
}

function convertFormValuesToAsset(values: FormValues) {
  const assetCategoryId = assetTypeToIdMap[values.assetType ?? AssetType.Path];
  const assetId = generateAssetDataswornId(
    values.assetType ?? AssetType.Path,
    values.name
  );

  let inputs: Asset["Inputs"];

  values.inputs?.forEach((input) => {
    if (!inputs) {
      inputs = {};
    }

    switch (input.type) {
      case InputType.Text:
        inputs[input.label] = {
          $id: `${assetId}/inputs/${encodeContents(input.label)}`,
          "Input type": InputType.Text,
          Label: input.label,
          Adjustable: false,
        };
        break;
      case InputType.Select:
        const selectId = `${assetId}/inputs/${encodeContents(input.label)}`;

        const options: { [key: string]: InputSelectOption } = {};
        input.options.forEach((option) => {
          options[option] = {
            $id: `${selectId}/options/${encodeContents(option)}`,
            Label: option,
            "Set attributes": {},
          };
        });

        inputs[input.label] = {
          $id: selectId,
          "Input type": InputType.Select,
          Label: input.label,
          Adjustable: false,
          Options: options,
          "Sets attributes": {},
        };
        break;
    }
  });

  const asset: Asset = {
    $id: assetId,
    Title: {
      $id: `${assetId}/title`,
      Short: values.name,
      Standard: values.name,
      Canonical: values.name,
    },
    Inputs: inputs,
    Display: {},
    "Asset type": assetCategoryId,
    Usage: {
      Shared: false,
    },
    Requirement: values.description || undefined,
    Source: {
      Title: "Custom Asset",
      Authors: [],
      License: License.None,
    },
    Abilities: [
      {
        $id: `${assetId}/1`,
        Label: values.ability1Name || undefined,
        Text: values.ability1Description,
        Enabled: false,
      },
      {
        $id: `${assetId}/2`,
        Label: values.ability2Name || undefined,
        Text: values.ability2Description,
        Enabled: false,
      },
      {
        $id: `${assetId}/3`,
        Label: values.ability3Name || undefined,
        Text: values.ability3Description,
        Enabled: false,
      },
    ],
    "Condition meter": values.track
      ? {
          $id: `${assetId}/condition_meter`,
          Label: values.track.label,
          Min: values.track.min,
          Max: values.track.max,
          Value: values.track.startingValue,
          Rollable: false,
          Conditions: [],
        }
      : undefined,
  };

  return asset;
}

export function CreateCustomAsset(props: CreateCustomAssetProps) {
  const { handleSelect, startingAsset } = props;
  const { error } = useSnackbar();

  const initialValues = convertAssetToFormValue(startingAsset);

  const handleSubmit = (values: FormValues) => {
    const asset = convertFormValuesToAsset(values);
    handleSelect(asset);
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={formSchema}
        onSubmit={handleSubmit}
      >
        {(form) => (
          <form onSubmit={form.handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <SectionHeading label={"Asset Basics"} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  name={"assetType"}
                  label={"Category"}
                  required
                  value={form.values.assetType ?? ""}
                  onChange={(evt) => form.handleChange(evt)}
                  select
                  error={form.touched.assetType && !!form.errors.assetType}
                  helperText={form.touched.assetType && form.errors.assetType}
                  fullWidth
                >
                  <MenuItem value={AssetType.Companion}>Companion</MenuItem>
                  <MenuItem value={AssetType.Path}>Path</MenuItem>
                  <MenuItem value={AssetType.CombatTalent}>
                    Combat Talent
                  </MenuItem>
                  <MenuItem value={AssetType.Ritual}>Ritual</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  name={"name"}
                  label={"Asset Name"}
                  required
                  value={form.values.name}
                  onChange={(evt) => form.handleChange(evt)}
                  error={form.touched.assetType && !!form.errors.name}
                  helperText={form.touched.assetType && form.errors.name}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  name={"description"}
                  label={"Description"}
                  value={form.values.description}
                  onChange={(evt) => form.handleChange(evt)}
                  error={form.touched.description && !!form.errors.description}
                  helperText={
                    form.touched.description && form.errors.description
                  }
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <SectionHeading label={"Asset Inputs"} />
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack spacing={2}>
                  <FieldArray name={"inputs"}>
                    {({ remove, push }) => (
                      <>
                        {form.values.inputs?.map((input, index) => (
                          <Stack spacing={2} key={index}>
                            <SectionHeading
                              label={`Input ${index + 1}`}
                              key={index}
                              action={
                                <Button onClick={() => remove(index)}>
                                  Remove
                                </Button>
                              }
                            />
                            <TextField
                              name={`inputs[${index}].label`}
                              label={"Input Label"}
                              required
                              value={input.label ?? ""}
                              onChange={form.handleChange}
                              error={
                                getIn(form.touched, `inputs[${index}].type`) &&
                                !!getIn(form.errors, `inputs[${index}].type`)
                              }
                              helperText={
                                getIn(form.touched, `inputs[${index}].type`) &&
                                getIn(form.errors, `inputs[${index}].type`)
                              }
                              fullWidth
                            />
                            <TextField
                              name={`inputs[${index}].type` ?? ""}
                              label={"Input Type"}
                              required
                              value={input.type ?? ""}
                              onChange={(evt) => {
                                form.setFieldValue(
                                  `inputs[${index}].type`,
                                  evt.target.value
                                );
                              }}
                              select
                              error={
                                getIn(form.touched, `inputs[${index}].type`) &&
                                !!getIn(form.errors, `inputs[${index}].type`)
                              }
                              helperText={
                                getIn(form.touched, `inputs[${index}].type`) &&
                                getIn(form.errors, `inputs[${index}].type`)
                              }
                              fullWidth
                            >
                              <MenuItem value={InputType.Text}>Text</MenuItem>
                              <MenuItem value={InputType.Select}>
                                Select
                              </MenuItem>
                            </TextField>
                            {input.type === InputType.Select && (
                              <TextField
                                name={`inputs[${index}].options`}
                                label={"Input Options"}
                                required
                                value={input.options?.join(",") ?? ""}
                                onChange={(evt) =>
                                  form.setFieldValue(
                                    `inputs[${index}].options`,
                                    evt.currentTarget.value.split(",")
                                  )
                                }
                                helperText={
                                  "Enter options as a comma separated list, ex: Health,Spirit,Supply"
                                }
                                fullWidth
                              />
                            )}
                          </Stack>
                        ))}
                        <div>
                          <Button variant={"outlined"} onClick={() => push({})}>
                            Add Input
                          </Button>
                        </div>
                      </>
                    )}
                  </FieldArray>
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack spacing={2}>
                  {form.values.track && (
                    <>
                      <TextField
                        name={"track.label"}
                        label={"Track Label"}
                        required
                        value={form.values.track.label ?? ""}
                        onChange={(evt) => form.handleChange(evt)}
                        error={
                          getIn(form.touched, "track.label") &&
                          getIn(form.errors, "track.label")
                        }
                        helperText={
                          getIn(form.touched, "track.label") &&
                          getIn(form.errors, "track.label")
                            ? getIn(form.errors, "track.label")
                            : 'For companion health, please label this field "companion health"'
                        }
                      />
                      <NumberField
                        name={"track.min"}
                        label={"Min"}
                        required
                        value={form.values.track.min}
                        onChange={(min) => form.setFieldValue("track.min", min)}
                        error={
                          getIn(form.touched, "track.min") &&
                          getIn(form.errors, "track.min")
                        }
                      />
                      <NumberField
                        name={"track.max"}
                        label={"Max"}
                        required
                        value={form.values.track.max}
                        onChange={(max) => form.setFieldValue("track.max", max)}
                        error={
                          getIn(form.touched, "track.max") &&
                          getIn(form.errors, "track.max")
                        }
                      />
                      <NumberField
                        name={"track.startingValue"}
                        label={"Starting Value"}
                        required
                        value={form.values.track.startingValue}
                        onChange={(max) =>
                          form.setFieldValue("track.startingValue", max)
                        }
                        error={
                          getIn(form.touched, "track.startingValue") &&
                          getIn(form.errors, "track.startingValue")
                        }
                      />
                    </>
                  )}
                  <div>
                    <Button
                      variant={"outlined"}
                      onClick={() =>
                        form.setFieldValue(
                          "track",
                          form.values.track ? undefined : {}
                        )
                      }
                    >
                      {form.values.track ? "Remove Track" : "Add Track"}
                    </Button>
                  </div>
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <SectionHeading label={"Asset Abilities"} />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  name={"ability1Name"}
                  label={"Ability 1 Name"}
                  value={form.values.ability1Name ?? ""}
                  onChange={form.handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={8}>
                <TextField
                  name={"ability1Description"}
                  label={"Ability 1 Description"}
                  value={form.values.ability1Description ?? ""}
                  onChange={form.handleChange}
                  fullWidth
                  error={
                    form.touched.ability1Description &&
                    !!form.errors.ability1Description
                  }
                  helperText={
                    form.touched.ability1Description &&
                    form.errors.ability1Description
                  }
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  name={"ability2Name"}
                  label={"Ability 2 Name"}
                  value={form.values.ability2Name ?? ""}
                  onChange={form.handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={8}>
                <TextField
                  name={"ability2Description"}
                  label={"Ability 2 Description"}
                  value={form.values.ability2Description ?? ""}
                  onChange={form.handleChange}
                  fullWidth
                  error={
                    form.touched.ability2Description &&
                    !!form.errors.ability2Description
                  }
                  helperText={
                    form.touched.ability2Description &&
                    form.errors.ability2Description
                  }
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  name={"ability3Name"}
                  label={"Ability 3 Name"}
                  value={form.values.ability3Name ?? ""}
                  onChange={form.handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={8}>
                <TextField
                  name={"ability3Description"}
                  label={"Ability 3 Description"}
                  value={form.values.ability3Description ?? ""}
                  onChange={form.handleChange}
                  fullWidth
                  error={
                    form.touched.ability3Description &&
                    !!form.errors.ability3Description
                  }
                  helperText={
                    form.touched.ability3Description &&
                    form.errors.ability3Description
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <Box display={"flex"} justifyContent={"flex-end"}>
                  <Button variant={"contained"} type={"submit"}>
                    {startingAsset
                      ? "Update Custom Asset"
                      : "Select Custom Asset"}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
}
