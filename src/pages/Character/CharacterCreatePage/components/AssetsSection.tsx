import { Grid, Stack, Typography } from "@mui/material";
import { AssetCard } from "components/AssetCard/AssetCard";
import { AddAssetCard } from "./AddAssetCard";
import { useState } from "react";
import { StoredAsset } from "types/Asset.type";
import { AssetCardDialog } from "components/AssetCardDialog";
import { SectionHeading } from "components/SectionHeading";
import { useField } from "formik";
import { AssetArrayType } from "../CharacterCreatePage";

export function AssetsSection() {
  const [field, meta, handlers] = useField<AssetArrayType>("assets");

  const [currentlySelectingAssetIndex, setCurrentlySelectingAssetIndex] =
    useState<number>();

  const selectAsset = (asset: StoredAsset) => {
    if (typeof currentlySelectingAssetIndex === "number") {
      const newAssets = [...field.value];

      newAssets[currentlySelectingAssetIndex] = asset;

      handlers.setValue(newAssets as AssetArrayType);
    }
    setCurrentlySelectingAssetIndex(undefined);
  };

  const removeAsset = (index: number) => {
    const newAssets = [...field.value];

    newAssets[index] = undefined;

    handlers.setValue(newAssets as AssetArrayType);
  };

  return (
    <>
      <SectionHeading breakContainer label={"Assets"} sx={{ mt: 4 }} />
      <Stack>
        <Typography color={"GrayText"}>
          Choose three Assets to start your story!
        </Typography>

        <Grid
          sx={(theme) => ({
            backgroundColor: theme.palette.background.default,
            pr: 2,
            ml: -1,
            pb: 2,
            borderRadius: theme.shape.borderRadius,
            mt: 2,
          })}
          container
          spacing={2}
        >
          {field.value.map((storedAsset, index) => (
            <Grid
              key={index}
              item
              xs={12}
              sm={6}
              lg={4}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              {storedAsset ? (
                <AssetCard
                  assetId={storedAsset.id}
                  storedAsset={storedAsset}
                  sx={{
                    // maxWidth: 380,
                    minHeight: 450,
                    width: "100%",
                  }}
                  handleDeleteClick={() => removeAsset(index)}
                />
              ) : (
                <AddAssetCard
                  onClick={() => setCurrentlySelectingAssetIndex(index)}
                />
              )}
            </Grid>
          ))}
        </Grid>
        {meta.touched && meta.error && (
          <Typography variant={"caption"} color={"error"}>
            {meta.error}
          </Typography>
        )}
        <AssetCardDialog
          open={typeof currentlySelectingAssetIndex === "number"}
          handleClose={() => setCurrentlySelectingAssetIndex(undefined)}
          handleAssetSelection={(asset) =>
            selectAsset({ ...asset, order: currentlySelectingAssetIndex ?? 0 })
          }
        />
      </Stack>
    </>
  );
}
