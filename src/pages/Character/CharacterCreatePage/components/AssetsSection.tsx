import { Alert, Box, Button, Grid, Stack, Typography } from "@mui/material";
import { AssetCard } from "components/AssetCard/AssetCard";
import { AddAssetCard } from "./AddAssetCard";
import { useState } from "react";
import { StoredAsset } from "types/Asset.type";
import { AssetCardDialog } from "components/AssetCardDialog";
import { SectionHeading } from "components/SectionHeading";
import { useField } from "formik";
import { EmptyState } from "components/EmptyState/EmptyState";

export function AssetsSection() {
  const [field, meta, handlers] = useField<StoredAsset[]>("assets");

  const [isAddAssetDialogOpen, setIsAddAssetDialogOpen] = useState(false);

  const selectAsset = (asset: StoredAsset) => {
    const newAssets = [...field.value];
    newAssets.push(asset);
    handlers.setValue(newAssets);
  };

  const removeAsset = (index: number) => {
    const newAssets = [...field.value];
    newAssets.splice(index, 1);
    handlers.setValue(newAssets);
  };

  return (
    <>
      <SectionHeading breakContainer label={"Assets"} sx={{ mt: 4 }} />
      <Box>
        <Alert severity="info" sx={{ mt: 2 }}>
          By the default rules, you should choose three assets when creating
          your character.
        </Alert>
        {field.value.length > 0 ? (
          <>
            <Grid
              sx={(theme) => ({
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
                </Grid>
              ))}
            </Grid>
            <Button
              variant={"outlined"}
              onClick={() => setIsAddAssetDialogOpen(true)}
              sx={{ mt: 1 }}
            >
              Add Asset
            </Button>
          </>
        ) : (
          <EmptyState
            title={"Add Assets"}
            message={"Assets can also be added later from the Character Sheet."}
            imageSrc={"/assets/nature.svg"}
            callToAction={
              <Button
                variant={"outlined"}
                onClick={() => setIsAddAssetDialogOpen(true)}
              >
                Add Asset
              </Button>
            }
          />
        )}
        {meta.touched && meta.error && (
          <Typography variant={"caption"} color={"error"}>
            {meta.error}
          </Typography>
        )}
        <AssetCardDialog
          open={isAddAssetDialogOpen}
          handleClose={() => setIsAddAssetDialogOpen(false)}
          handleAssetSelection={(asset) => {
            selectAsset({
              ...asset,
              order:
                field.value.length > 0
                  ? field.value[field.value.length - 1].order + 1
                  : 0,
            });
            setIsAddAssetDialogOpen(false);
          }}
        />
      </Box>
    </>
  );
}
