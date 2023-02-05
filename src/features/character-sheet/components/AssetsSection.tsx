import { Button, Grid } from "@mui/material";
import { useState } from "react";
import { AssetCard } from "../../../components/AssetCard/AssetCard";
import { AssetCardDialog } from "../../../components/AssetCardDialog";
import { assets } from "../../../data/assets";
import { Asset, StoredAsset } from "../../../types/Asset.type";
import { useCharacterSheetStore } from "../characterSheet.store";

import { useConfirm } from "material-ui-confirm";

export function AssetsSection() {
  const assetData = useCharacterSheetStore((store) => store.assets) ?? [];
  const characterId = useCharacterSheetStore(
    (store) => store.characterId ?? ""
  );

  const addAsset = useCharacterSheetStore((store) => store.addAsset);
  const removeAsset = useCharacterSheetStore((store) => store.removeAsset);
  const updateAssetInput = useCharacterSheetStore(
    (store) => store.updateAssetInput
  );
  const updateAssetCheckbox = useCharacterSheetStore(
    (store) => store.updateAssetAbilityCheckbox
  );
  const updateAssetTrack = useCharacterSheetStore(
    (store) => store.updateAssetTrack
  );
  const updateAssetMultiTrack = useCharacterSheetStore(
    (store) => store.updateAssetMultiTrack
  );

  const updateCustomAsset = useCharacterSheetStore(
    (store) => store.updateCustomAsset
  );

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
              updateAssetInput(storedAsset.id, label, value)
            }
            sx={{
              // maxWidth: 380,
              minHeight: 450,
              width: "100%",
            }}
            handleAbilityCheck={(abilityIndex, checked) =>
              updateAssetCheckbox(storedAsset.id, abilityIndex, checked)
            }
            handleTrackValueChange={(value) =>
              updateAssetTrack(storedAsset.id, value)
            }
            handleMultiFieldTrackValueChange={(value) =>
              updateAssetMultiTrack(storedAsset.id, value)
            }
            handleDeleteClick={() => handleClick(storedAsset.id)}
            handleCustomAssetUpdate={(asset) =>
              updateCustomAsset(storedAsset.id, asset)
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
        handleClose={() => setIsAssetDialogOpen(false)}
        handleAssetSelection={(asset) => handleAssetAdd(asset)}
      />
    </Grid>
  );
}
