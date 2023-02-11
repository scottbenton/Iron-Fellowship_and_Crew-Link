import { Button, Grid } from "@mui/material";
import { useCharacterSheetAddAsset } from "api/characters/assets/addAsset";
import { useListenToCharacterSheetAssets } from "api/characters/assets/listenToAssets";
import { useCharacterSheetRemoveAsset } from "api/characters/assets/removeAsset";
import { useCharacterSheetUpdateAssetCheckbox } from "api/characters/assets/updateAssetCheckbox";
import { useCharacterSheetUpdateAssetInput } from "api/characters/assets/updateAssetInput";
import { useCharacterSheetUpdateAssetMultiTrack } from "api/characters/assets/updateAssetMultiTrack";
import { useCharacterSheetUpdateAssetTrack } from "api/characters/assets/updateAssetTrack";
import { useCharacterSheetUpdateCustomAsset } from "api/characters/assets/updateCustomAsset";
import { useState } from "react";
import { AssetCard } from "../../../components/AssetCard/AssetCard";
import { AssetCardDialog } from "../../../components/AssetCardDialog";
import { assets } from "../../../data/assets";
import { Asset, StoredAsset } from "../../../types/Asset.type";
import { useCharacterSheetStore } from "../characterSheet.store";

import { useConfirm } from "material-ui-confirm";

export function AssetsSection() {
  const assetData = useCharacterSheetStore((store) => store.assets) ?? [];
  useListenToCharacterSheetAssets();

  const { addAsset, loading } = useCharacterSheetAddAsset();
  const { removeAsset } = useCharacterSheetRemoveAsset();
  const { updateAssetInput } = useCharacterSheetUpdateAssetInput();
  const { updateAssetCheckbox } = useCharacterSheetUpdateAssetCheckbox();
  const { updateAssetTrack } = useCharacterSheetUpdateAssetTrack();
  const { updateAssetMultiTrack } = useCharacterSheetUpdateAssetMultiTrack();

  const { updateCustomAsset } = useCharacterSheetUpdateCustomAsset();

  const [isAssetDialogOpen, setIsAssetDialogOpen] = useState<boolean>(false);

  const handleAssetAdd = (asset: Asset) => {
    const assetId = asset.id;

    let inputs: StoredAsset["inputs"];
    asset.inputs?.forEach((input) => {
      if (!inputs) {
        inputs = {};
      }
      inputs[input] = "";
    });

    const storedAsset: StoredAsset = {
      id: assetId,
      enabledAbilities: asset.abilities.map(
        (ability) => ability.startsEnabled ?? false
      ),
    };

    if (inputs) {
      storedAsset.inputs = inputs;
    }
    if (asset.track) {
      storedAsset.trackValue = asset.track.startingValue ?? asset.track.max;
    }

    if (assetId.startsWith("custom-")) {
      storedAsset.customAsset = asset;
    }

    addAsset(storedAsset).finally(() => {
      setIsAssetDialogOpen(false);
    });
  };

  const handleAssetDelete = (assetId: string) => {
    removeAsset(assetId);
  };

  const confirm = useConfirm();

  const handleClick = (assetId: string) => {
    confirm({
      title: "Delete Asset",
      description: "Are you sure you want to remove this asset?",
      confirmationText: "Delete",
      confirmationButtonProps: {
        variant: "contained",
        color: "error",
      },
    })
      .then(() => {
        handleAssetDelete(assetId);
      })
      .catch(() => {});
  };

  return (
    <Grid
      sx={(theme) => ({
        p: 2,
      })}
      container
      spacing={2}
    >
      {assetData.map((storedAsset, index) => (
        <Grid
          key={index}
          item
          xs={12}
          sm={6}
          lg={4}
          sx={{ display: "flex", justifyContent: "center" }}
        >
          <AssetCard
            asset={storedAsset.customAsset ?? assets[storedAsset.id]}
            storedAsset={storedAsset}
            handleInputChange={(label, value) =>
              updateAssetInput({
                assetId: storedAsset.id,
                inputLabel: label,
                inputValue: value,
              })
            }
            sx={{
              // maxWidth: 380,
              minHeight: 450,
              width: "100%",
            }}
            handleAbilityCheck={(abilityIndex, checked) =>
              updateAssetCheckbox({
                assetId: storedAsset.id,
                abilityIndex,
                checked,
              })
            }
            handleTrackValueChange={(value) =>
              updateAssetTrack({ assetId: storedAsset.id, value })
            }
            handleMultiFieldTrackValueChange={(value) =>
              updateAssetMultiTrack({ assetId: storedAsset.id, value })
            }
            handleDeleteClick={() => handleClick(storedAsset.id)}
            handleCustomAssetUpdate={(asset) =>
              updateCustomAsset({ assetId: storedAsset.id, asset })
            }
          />
        </Grid>
      ))}
      <Grid item xs={12}>
        <Button
          variant={"outlined"}
          color={"primary"}
          onClick={() => setIsAssetDialogOpen(true)}
        >
          Add Asset
        </Button>
      </Grid>

      <AssetCardDialog
        open={isAssetDialogOpen}
        loading={loading}
        handleClose={() => setIsAssetDialogOpen(false)}
        handleAssetSelection={(asset) => handleAssetAdd(asset)}
      />
    </Grid>
  );
}
