import {
  Box,
  Button,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import type { Asset, AssetAbility, InputSelectOption } from "dataforged";
import { InputType, License } from "types/Datasworn";
import { SectionHeading } from "components/shared/SectionHeading";
import { FieldArray, Formik, getIn } from "formik";
import * as Yup from "yup";
import { NumberField } from "components/shared/NumberField";
import {
  encodeContents,
  generateAssetDataswornId,
} from "functions/dataswornIdEncoder";
import DeleteIcon from "@mui/icons-material/Delete";
import { assetGroups } from "data/assets";
import { useDataswornId } from "hooks/useDataswornId";
import { useGameSystem } from "hooks/useGameSystem";
import { GAME_SYSTEMS } from "types/GameSystems.type";

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
  assetType?: string;
  name: string;
  description?: string;

  inputs?: FormAssetInput[];
  track?: FormAssetTrack;

  abilities: {
    name?: string;
    description: string;
  }[];
}

type AssetWithCorrectedAbilities = Omit<Asset, "Abilities"> & {
  Abilities: AssetAbility[];
};

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
  abilities: Yup.array(
    Yup.object().shape({
      description: Yup.string().required("Description is required"),
    })
  ),
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
    assetType: asset?.["Asset type"],
    name: asset?.Title.Standard ?? "",
    description: asset?.Requirement,

    inputs,
    track: asset?.["Condition meter"] && {
      label: asset["Condition meter"].Label,
      min: asset["Condition meter"].Min,
      max: asset["Condition meter"].Max,
      startingValue: asset["Condition meter"].Value,
    },

    abilities: asset?.Abilities.map((ability) => ({
      name: ability.Label,
      description: ability.Text,
    })) ?? [{ description: "" }, { description: "" }, { description: "" }],
  };

  return initialValues;
}

function convertFormValuesToAsset(values: FormValues) {
  if (!values.assetType) {
    throw new Error("Asset type must be defined");
    return;
  }

  const assetId = generateAssetDataswornId(values.assetType, values.name);

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

  const asset: AssetWithCorrectedAbilities = {
    $id: assetId,
    Title: {
      $id: `${assetId}/title`,
      Short: values.name,
      Standard: values.name,
      Canonical: values.name,
    },
    Display: {},
    "Asset type": values.assetType,
    Usage: {
      Shared: false,
    },
    Requirement: values.description || "",
    Source: {
      Title: "Custom Asset",
      Authors: [],
      License: License.None,
    },
    Abilities: values.abilities.map((ability, index) => ({
      $id: `${assetId}/${index}`,
      Label: ability.name || "",
      Text: ability.description,
      Enabled: false,
    })),
  };

  if (values.track) {
    asset["Condition meter"] = {
      $id: `${assetId}/condition_meter`,
      Label: values.track.label,
      Min: values.track.min,
      Max: values.track.max,
      Value: values.track.startingValue,
      Rollable: false,
      Conditions: [],
    };
  }

  if (inputs) {
    asset.Inputs = inputs;
  }

  return asset;
}

export function CreateCustomAsset(props: CreateCustomAssetProps) {
  const { handleSelect, startingAsset } = props;

  const initialValues = convertAssetToFormValue(startingAsset);
  const { getId } = useDataswornId();

  const handleSubmit = (values: FormValues) => {
    try {
      const asset = convertFormValuesToAsset(values);
      handleSelect(asset as unknown as Asset);
    } catch (e) {
      console.error(e);
    }
  };

  const isStarforged = useGameSystem().gameSystem === GAME_SYSTEMS.STARFORGED;

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
                  {Object.values(assetGroups).map((group) => (
                    <MenuItem value={group.$id} key={group.$id}>
                      {group.Title.Standard}
                    </MenuItem>
                  ))}
                  <MenuItem value={getId("assets", "role")}>Role</MenuItem>
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
                  value={form.values.description ?? ""}
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
                                <Button
                                  color="inherit"
                                  onClick={() => remove(index)}
                                >
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
                          <Button
                            color={"inherit"}
                            variant={"outlined"}
                            onClick={() => push({})}
                          >
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
                            : `For companion health, please label this field "companion health"${
                                isStarforged
                                  ? ". For integrity, please label this field integrity."
                                  : ""
                              }`
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
                      color={"inherit"}
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
              <Grid item xs={12}>
                <FieldArray name="abilities">
                  {({ remove, push }) => (
                    <TableContainer component={Paper} variant={"outlined"}>
                      <Table size={"small"}>
                        <TableHead>
                          <TableRow>
                            <TableCell>Ability Name</TableCell>
                            <TableCell>Ability Description</TableCell>
                            <TableCell />
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {form.values.abilities.map((ability, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                <TextField
                                  value={ability.name ?? ""}
                                  onChange={(evt) => {
                                    form.setFieldValue(
                                      `abilities[${index}].name`,
                                      evt.currentTarget.value ?? undefined
                                    );
                                  }}
                                  variant={"standard"}
                                  placeholder={"Ability Name"}
                                />
                              </TableCell>

                              <TableCell>
                                <TextField
                                  value={ability.description ?? ""}
                                  onChange={(evt) => {
                                    form.setFieldValue(
                                      `abilities[${index}].description`,
                                      evt.currentTarget.value
                                    );
                                  }}
                                  variant={"standard"}
                                  placeholder={"Description"}
                                  fullWidth
                                  error={
                                    form.touched.abilities &&
                                    !form.values.abilities[index].description
                                  }
                                />
                              </TableCell>
                              <TableCell
                                sx={{ width: 0, minWidth: "fit-content" }}
                              >
                                <IconButton onClick={() => remove(index)}>
                                  <DeleteIcon />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                        <TableFooter>
                          <TableRow>
                            <TableCell>
                              <Button
                                color={"inherit"}
                                onClick={() => push({})}
                              >
                                Add Row
                              </Button>
                            </TableCell>
                          </TableRow>
                        </TableFooter>
                      </Table>
                    </TableContainer>
                  )}
                </FieldArray>
              </Grid>
              <Grid item xs={12}>
                <Box display={"flex"} justifyContent={"flex-end"}>
                  <Button
                    color={"primary"}
                    variant={"contained"}
                    type={"submit"}
                  >
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
