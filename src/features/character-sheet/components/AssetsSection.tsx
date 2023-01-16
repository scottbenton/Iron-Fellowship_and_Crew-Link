import { Button, Grid } from "@mui/material";
import { useState } from "react";
import { AssetCard } from "../../../components/AssetCard/AssetCard";
import { AssetCardDialog } from "../../../components/AssetCardDialog";
import { assets } from "../../../data/assets";
import { StoredAsset } from "../../../types/Asset.type";
import { addAsset } from "../api/addAsset";
import { removeAsset } from "../api/removeAsset";
import { updateAssetCheckbox } from "../api/updateAssetCheckbox";
import { updateAssetInput } from "../api/updateAssetInput";
import { updateAssetMultiTrack } from "../api/updateAssetMultiTrack";
import { updateAssetTrack } from "../api/updateAssetTrack";

export interface AssetsSectionProps {
  characterId: string;
  assetData: StoredAsset[];
}

export function AssetsSection(props: AssetsSectionProps) {
  const { characterId, assetData } = props;

  const [isAssetDialogOpen, setIsAssetDialogOpen] = useState<boolean>(false);

  const handleAssetAdd = (assetId: string) => {
    const asset = assets[assetId];

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

    addAsset(characterId, storedAsset).finally(() => {
      setIsAssetDialogOpen(false);
    });
  };

  const handleAssetDelete = (assetId: string) => {
    const shouldDelete = confirm("Are you sure you want to remove this asset?");
    if (shouldDelete) {
      removeAsset(characterId, assetId);
    }
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
            asset={assets[storedAsset.id]}
            storedAsset={storedAsset}
            handleInputChange={(label, value) =>
              updateAssetInput(characterId, storedAsset.id, label, value)
            }
            sx={{
              // maxWidth: 380,
              minHeight: 450,
              width: "100%",
            }}
            handleAbilityCheck={(abilityIndex, checked) =>
              updateAssetCheckbox(
                characterId,
                storedAsset.id,
                abilityIndex,
                checked
              )
            }
            handleTrackValueChange={(value) =>
              updateAssetTrack(characterId, storedAsset.id, value)
            }
            handleMultiFieldTrackValueChange={(value) =>
              updateAssetMultiTrack(characterId, storedAsset.id, value)
            }
            handleDeleteClick={() => handleAssetDelete(storedAsset.id)}
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
        handleAssetSelection={(asset) => handleAssetAdd(asset.id)}
      />
    </Grid>
  );
}
