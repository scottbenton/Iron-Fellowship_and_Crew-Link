import { Button, Grid } from "@mui/material";
import { useState } from "react";
import { AssetCard } from "components/features/assets/AssetCard";
import { AssetCardDialog } from "components/features/assets/AssetCardDialog";
import { StoredAsset } from "types/Asset.type";
import { useConfirm } from "material-ui-confirm";
import { useStore } from "stores/store";

export function AssetsSection() {
  const assets = useStore(
    (store) => store.characters.currentCharacter.assets.assets ?? {}
  );

  const sortedAssetKeys = Object.keys(assets).sort(
    (k1, k2) => assets[k1].order - assets[k2].order
  );

  const nextAssetIndex =
    sortedAssetKeys.length > 0
      ? (assets[sortedAssetKeys[sortedAssetKeys.length - 1]].order ?? 0) + 1
      : 0;

  const addAsset = useStore(
    (store) => store.characters.currentCharacter.assets.addAsset
  );
  const [addAssetLoading, setAddAssetLoading] = useState(false);

  const removeAsset = useStore(
    (store) => store.characters.currentCharacter.assets.removeAsset
  );
  const updateAssetInput = useStore(
    (store) => store.characters.currentCharacter.assets.updateAssetInput
  );
  const updateAssetCheckbox = useStore(
    (store) => store.characters.currentCharacter.assets.updateAssetCheckbox
  );
  const updateAssetTrack = useStore(
    (store) => store.characters.currentCharacter.assets.updateAssetTrack
  );
  const updateCustomAsset = useStore(
    (store) => store.characters.currentCharacter.assets.updateCustomAsset
  );
  const updateAssetCondition = useStore(
    (store) => store.characters.currentCharacter.assets.updateAssetCondition
  );

  const [isAssetDialogOpen, setIsAssetDialogOpen] = useState<boolean>(false);

  const handleAssetAdd = (asset: StoredAsset) => {
    setAddAssetLoading(true);
    addAsset(asset)
      .catch(() => {})
      .finally(() => {
        setIsAssetDialogOpen(false);
        setAddAssetLoading(false);
      });
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
        removeAsset(assetId).catch(() => {});
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
      {sortedAssetKeys.map((assetId, index) => (
        <Grid
          key={index}
          item
          xs={12}
          sm={6}
          lg={4}
          sx={{ display: "flex", justifyContent: "center" }}
        >
          <AssetCard
            assetId={assets[assetId].id}
            storedAsset={assets[assetId]}
            handleInputChange={(label, value) =>
              updateAssetInput(assetId, label, value).catch(() => {})
            }
            sx={{
              // maxWidth: 380,
              minHeight: 450,
              width: "100%",
            }}
            handleAbilityCheck={(abilityIndex, checked) =>
              updateAssetCheckbox(assetId, abilityIndex, checked)
            }
            handleTrackValueChange={(value) => updateAssetTrack(assetId, value)}
            handleConditionCheck={(condition, checked) =>
              updateAssetCondition(assetId, condition, checked)
            }
            handleDeleteClick={() => handleClick(assetId)}
            handleCustomAssetUpdate={(asset) =>
              updateCustomAsset(assetId, asset)
            }
          />
        </Grid>
      ))}
      <Grid item xs={12}>
        <Button
          variant={"outlined"}
          color={"inherit"}
          onClick={() => setIsAssetDialogOpen(true)}
        >
          Add Asset
        </Button>
      </Grid>

      <AssetCardDialog
        open={isAssetDialogOpen}
        loading={addAssetLoading}
        handleClose={() => setIsAssetDialogOpen(false)}
        handleAssetSelection={(asset) =>
          handleAssetAdd({ ...asset, order: nextAssetIndex })
        }
      />
    </Grid>
  );
}
