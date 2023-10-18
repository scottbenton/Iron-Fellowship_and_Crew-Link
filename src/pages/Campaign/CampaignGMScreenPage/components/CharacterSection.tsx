import { Box, Button, Grid, LinearProgress, Typography } from "@mui/material";
import { CharacterCard } from "./CharacterCard";
import { useStore } from "stores/store";
import { useGameSystem } from "hooks/useGameSystem";
import { GAME_SYSTEMS } from "types/GameSystems.type";
import { SectionHeading } from "components/shared/SectionHeading";
import { useConfirm } from "material-ui-confirm";
import { StoredAsset } from "types/Asset.type";
import { useState } from "react";
import { AssetCardDialog } from "components/features/assets/AssetCardDialog";
import { AssetCard } from "components/features/assets/AssetCard";

export function CharacterSection() {
  const isStarforged = useGameSystem().gameSystem === GAME_SYSTEMS.STARFORGED;

  const campaignCharacters = useStore(
    (store) => store.campaigns.currentCampaign.characters.characterMap
  );

  const findUidFromCharacterId = (characterId: string) => {
    return campaignCharacters[characterId].uid;
  };

  const sharedAssets = useStore(
    (store) => store.campaigns.currentCampaign.assets.assets
  );
  const sortedSharedAssetKeys = Object.keys(sharedAssets).sort(
    (k1, k2) => sharedAssets[k1].order - sharedAssets[k2].order
  );
  const nextSharedAssetIndex =
    sortedSharedAssetKeys.length > 0
      ? (sharedAssets[sortedSharedAssetKeys[sortedSharedAssetKeys.length - 1]]
          .order ?? 0) + 1
      : 0;

  const sharedAssetsLoading = useStore(
    (store) => store.characters.currentCharacter.assets.loading
  );
  const addSharedAsset = useStore(
    (store) => store.campaigns.currentCampaign.assets.addAsset
  );
  const removeSharedAsset = useStore(
    (store) => store.campaigns.currentCampaign.assets.removeAsset
  );
  const updateSharedAssetInput = useStore(
    (store) => store.campaigns.currentCampaign.assets.updateAssetInput
  );
  const updateSharedAssetCheckbox = useStore(
    (store) => store.campaigns.currentCampaign.assets.updateAssetCheckbox
  );
  const updateSharedAssetTrack = useStore(
    (store) => store.campaigns.currentCampaign.assets.updateAssetTrack
  );
  const updateSharedCustomAsset = useStore(
    (store) => store.campaigns.currentCampaign.assets.updateCustomAsset
  );
  const updateSharedAssetCondition = useStore(
    (store) => store.campaigns.currentCampaign.assets.updateAssetCondition
  );

  const [addAssetLoading, setAddAssetLoading] = useState(false);

  const [isAssetDialogOpen, setIsAssetDialogOpen] = useState(false);

  const handleAssetAdd = (asset: StoredAsset) => {
    setAddAssetLoading(true);
    addSharedAsset(asset)
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
        removeSharedAsset(assetId).catch(() => {});
      })
      .catch(() => {});
  };

  return (
    <>
      {isStarforged && (
        <>
          <SectionHeading
            label={"Shared Assets"}
            action={
              <Button
                variant={"outlined"}
                color={"inherit"}
                onClick={() => setIsAssetDialogOpen(true)}
              >
                Add Shared Asset
              </Button>
            }
          />
          {sortedSharedAssetKeys.length > 0 ? (
            <Grid
              sx={(theme) => ({
                p: 2,
              })}
              container
              spacing={2}
            >
              {sortedSharedAssetKeys.map((assetId, index) => (
                <Grid
                  key={index}
                  item
                  xs={12}
                  sm={6}
                  xl={4}
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <AssetCard
                    assetId={sharedAssets[assetId].id}
                    storedAsset={sharedAssets[assetId]}
                    handleInputChange={(label, value) =>
                      updateSharedAssetInput(assetId, label, value).catch(
                        () => {}
                      )
                    }
                    sx={{
                      // maxWidth: 380,
                      minHeight: 450,
                      width: "100%",
                    }}
                    handleAbilityCheck={(abilityIndex, checked) =>
                      updateSharedAssetCheckbox(assetId, abilityIndex, checked)
                    }
                    handleTrackValueChange={(value) =>
                      updateSharedAssetTrack(assetId, value)
                    }
                    handleConditionCheck={(condition, checked) =>
                      updateSharedAssetCondition(assetId, condition, checked)
                    }
                    handleDeleteClick={() => handleClick(assetId)}
                    handleCustomAssetUpdate={(asset) =>
                      updateSharedCustomAsset(assetId, asset)
                    }
                  />
                </Grid>
              ))}
            </Grid>
          ) : sharedAssetsLoading ? (
            <LinearProgress sx={{ mb: 4 }} />
          ) : (
            <Box p={2} pb={4} display={"flex"} justifyContent={"center"}>
              <Typography>No Assets Found</Typography>
            </Box>
          )}

          <AssetCardDialog
            open={isAssetDialogOpen}
            loading={addAssetLoading}
            handleClose={() => setIsAssetDialogOpen(false)}
            handleAssetSelection={(asset) =>
              handleAssetAdd({
                ...asset,
                order: nextSharedAssetIndex,
              })
            }
          />
          <SectionHeading label={"Characters"} />
        </>
      )}

      <Grid container spacing={2} p={2}>
        {Object.keys(campaignCharacters).map((characterId) => (
          <Grid item key={characterId} xs={12} md={12} lg={6}>
            <CharacterCard
              uid={findUidFromCharacterId(characterId) ?? ""}
              characterId={characterId}
              character={campaignCharacters[characterId]}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
}
