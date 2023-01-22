import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageBanner } from "../../components/Layout/PageBanner";
import { SectionHeading } from "../../components/SectionHeading";
import { useSnackbar } from "../../hooks/useSnackbar";
import { constructCharacterSheetUrl } from "../../routes";
import { StoredAsset } from "../../types/Asset.type";
import { STATS } from "../../types/stats.enum";
import { AssetsSection } from "./components/AssetsSection";
import { StatsField } from "./components/StatsField";
import { createFirebaseCharacter } from "./api/createCharacter";
import { StatsMap } from "../../types/Character.type";

export type AssetArrayType = [
  StoredAsset | undefined,
  StoredAsset | undefined,
  StoredAsset | undefined
];

type CharacterCreateFormValues = {
  name: string;
  stats: { [key in STATS]: number | undefined };
  assets: AssetArrayType;
};
type Keys = keyof CharacterCreateFormValues;

export function CharacterCreatePage() {
  const navigate = useNavigate();
  const { error } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);

  const validate = (values: CharacterCreateFormValues) => {
    const errors: { [key in keyof CharacterCreateFormValues]?: string } = {};

    if (!values.name) {
      errors.name = "Name is required";
    }

    if (
      !values.stats[STATS.EDGE] ||
      !values.stats[STATS.IRON] ||
      !values.stats[STATS.HEART] ||
      !values.stats[STATS.SHADOW] ||
      !values.stats[STATS.WITS]
    ) {
      errors.stats = "Stats are required";
    }

    if (!values.assets[0] || !values.assets[1] || !values.assets[2]) {
      errors.assets = "Assets are required";
    }

    return errors;
  };

  const handleSubmit = (values: CharacterCreateFormValues) => {
    setIsLoading(true);
    createFirebaseCharacter(
      values.name,
      values.stats as StatsMap,
      values.assets as [StoredAsset, StoredAsset, StoredAsset]
    )
      .then((characterId) => {
        navigate(constructCharacterSheetUrl(characterId));
      })
      .catch((e) => {
        console.error(e);
        error("Failed to create character");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <PageBanner>Create your Character</PageBanner>
      <Formik
        initialValues={{
          name: "",
          stats: {
            [STATS.EDGE]: undefined,
            [STATS.HEART]: undefined,
            [STATS.IRON]: undefined,
            [STATS.SHADOW]: undefined,
            [STATS.WITS]: undefined,
          },
          assets: [undefined, undefined, undefined],
        }}
        validate={validate}
        onSubmit={handleSubmit}
      >
        {(form) => (
          <form onSubmit={form.handleSubmit}>
            <SectionHeading breakContainer label={"Character Details"} />
            <div>
              <TextField
                label={"Name"}
                name={"name"}
                value={form.values.name}
                onChange={form.handleChange}
                error={form.touched.name && !!form.errors.name}
                helperText={form.touched.name && form.errors.name}
                sx={{ maxWidth: 350, mt: 2 }}
                fullWidth
              />
            </div>
            <StatsField />
            <AssetsSection />
            <Box display={"flex"} justifyContent={"flex-end"} mt={2}>
              <Button
                type={"submit"}
                variant={"contained"}
                disabled={isLoading}
              >
                Create Character
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </>
  );
}
