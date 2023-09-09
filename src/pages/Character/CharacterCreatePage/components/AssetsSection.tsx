import { Alert, Box, Button, Grid, Typography } from "@mui/material";
import { AssetCard } from "components/AssetCard/AssetCard";
import { useState } from "react";
import { StoredAsset } from "types/Asset.type";
import { AssetCardDialog } from "components/AssetCardDialog";
import { SectionHeading } from "components/SectionHeading";
import { useField } from "formik";
import { EmptyState } from "components/EmptyState/EmptyState";
import { Asset } from "dataforged";

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

  const handleAbilityCheck = (
    index: number,
    abilityIndex: number,
    checked: boolean
  ) => {
    const newAssets = [...field.value];
    const newAsset = { ...newAssets[index] };
    const newAssetAbilities = { ...newAsset.enabledAbilities };
    newAssetAbilities[abilityIndex] = checked;
    newAsset.enabledAbilities = newAssetAbilities;
    newAssets[index] = newAsset;
    handlers.setValue(newAssets);
  };

  const handleInputChange = (index: number, label: string, value: string) => {
    const newAssets = [...field.value];
    const newAsset = { ...newAssets[index] };
    const newAssetInputs = { ...newAsset.inputs };
    newAssetInputs[label] = value;
    newAsset.inputs = newAssetInputs;
    newAssets[index] = newAsset;
    handlers.setValue(newAssets);
    return new Promise<void>((res) => res());
  };

  const handleCustomAssetUpdate = (index: number, customAsset: Asset) => {
    const newAssets = [...field.value];
    const newAsset = { ...newAssets[index], customAsset };
    newAssets[index] = newAsset;
    handlers.setValue(newAssets);
    return new Promise<void>((res) => res());
  };

  return (
    <>
      <SectionHeading breakContainer label={"Assets"} sx={{ mt: 4 }} />
      <Box>
        <Alert severity="info" sx={{ mt: 2 }}>
          When playing with the default rules, you should choose three assets
          when creating your character.
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
                    handleAbilityCheck={(abilityIndex, checked) =>
                      handleAbilityCheck(index, abilityIndex, checked)
                    }
                    handleInputChange={(label, value) =>
                      handleInputChange(index, label, value)
                    }
                    handleCustomAssetUpdate={(asset) =>
                      handleCustomAssetUpdate(index, asset)
                    }
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
