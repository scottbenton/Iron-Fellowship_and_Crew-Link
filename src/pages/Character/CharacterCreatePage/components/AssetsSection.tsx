import { Alert, Box, Button, Grid, Typography } from "@mui/material";
import { AssetCard } from "components/features/assets/AssetCard";
import { useState } from "react";
import { StoredAsset } from "types/Asset.type";
import { AssetCardDialog } from "components/features/assets/AssetCardDialog";
import { SectionHeading } from "components/shared/SectionHeading";
import { useField } from "formik";
import { EmptyState } from "components/shared/EmptyState/EmptyState";
import { Asset } from "dataforged";
import { useGameSystemValue } from "hooks/useGameSystemValue";
import { GAME_SYSTEMS } from "types/GameSystems.type";

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

  const handleConditionChecked = (
    index: number,
    condition: string,
    checked: boolean
  ) => {
    const newAssets = [...field.value];
    const newAsset = { ...newAssets[index] };
    const newAssetConditions = { ...newAsset.conditions };
    newAssetConditions[condition] = checked;
    newAsset.conditions = newAssetConditions;
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

  const defaultRuleAlertText = useGameSystemValue({
    [GAME_SYSTEMS.IRONSWORN]:
      "When playing with the default rules, you should choose three assets when creating your character.",
    [GAME_SYSTEMS.STARFORGED]:
      "When playing with the default rules, you should choose the Starship asset, two path assets, and one other non-deed asset when creating your character.",
  });

  return (
    <>
      <SectionHeading breakContainer label={"Assets"} sx={{ mt: 4 }} />
      <Box>
        <Alert severity="info" sx={{ mt: 2 }}>
          {defaultRuleAlertText}
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
                    handleConditionCheck={(condition, checked) =>
                      handleConditionChecked(index, condition, checked)
                    }
                    handleCustomAssetUpdate={(asset) =>
                      handleCustomAssetUpdate(index, asset)
                    }
                  />
                </Grid>
              ))}
            </Grid>
            <Button
              color={"inherit"}
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
                color={"inherit"}
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
          showSharedAssetWarning
        />
      </Box>
    </>
  );
}
