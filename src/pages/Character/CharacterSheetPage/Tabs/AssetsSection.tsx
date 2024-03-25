import { Box, Button, Grid, Typography, LinearProgress } from "@mui/material";
import { useState } from "react";
import { AssetCard as OldAssetCard } from "components/features/assets/AssetCard";
import { AssetCard } from "components/features/assets/NewAssetCard";
import { AssetCardDialog as OldAssetCardDialog } from "components/features/assets/AssetCardDialog";
import { AssetCardDialog } from "components/features/assets/NewAssetCardDialog";
import { StoredAsset } from "types/Asset.type";
import { useConfirm } from "material-ui-confirm";
import { useStore } from "stores/store";
import { SectionHeading } from "components/shared/SectionHeading";
import { useGameSystem } from "hooks/useGameSystem";
import { GAME_SYSTEMS } from "types/GameSystems.type";
import { useNewCustomContentPage } from "hooks/featureFlags/useNewCustomContentPage";
import { getNewDataswornId, getOldDataswornId } from "data/assets";

export function AssetsSection() {
  const isStarforged = useGameSystem().gameSystem === GAME_SYSTEMS.STARFORGED;

  const isInCampaign = useStore(
    (store) => !!store.characters.currentCharacter.currentCharacter?.campaignId
  );

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

  const assetsLoading = useStore(
    (store) => store.characters.currentCharacter.assets.loading
  );
  const addAsset = useStore(
    (store) => store.characters.currentCharacter.assets.addAsset
  );
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

  const [isAssetDialogOpen, setIsAssetDialogOpen] = useState<{
    open: boolean;
    addToCampaign?: boolean;
  }>({ open: false });

  const handleAssetAdd = (asset: StoredAsset) => {
    const shouldAddToCampaign = isAssetDialogOpen.addToCampaign;
    setAddAssetLoading(true);
    const promise = shouldAddToCampaign
      ? addSharedAsset(asset)
      : addAsset(asset);
    promise
      .catch(() => {})
      .finally(() => {
        setIsAssetDialogOpen({ open: false });
        setAddAssetLoading(false);
      });
  };

  const confirm = useConfirm();

  const handleClick = (assetId: string, isShared: boolean) => {
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
        if (isShared) {
          removeSharedAsset(assetId).catch(() => {});
        } else {
          removeAsset(assetId).catch(() => {});
        }
      })
      .catch(() => {});
  };

  const showNewAssetCards = useNewCustomContentPage();

  const updateAssetOption = useStore(
    (store) => store.characters.currentCharacter.assets.updateAssetOption
  );
  const updateAssetControl = useStore(
    (store) => store.characters.currentCharacter.assets.updateAssetControl
  );
  const updateSharedAssetOption = useStore(
    (store) => store.campaigns.currentCampaign.assets.updateAssetOption
  );
  const updateSharedAssetControl = useStore(
    (store) => store.campaigns.currentCampaign.assets.updateAssetControl
  );

  return (
    <>
      {isInCampaign && isStarforged && (
        <>
          <SectionHeading
            label={"Shared Assets"}
            action={
              <Button
                variant={"outlined"}
                color={"inherit"}
                onClick={() =>
                  setIsAssetDialogOpen({ open: true, addToCampaign: true })
                }
              >
                Add Shared Asset
              </Button>
            }
          />
          {sortedSharedAssetKeys.length > 0 ? (
            <Grid
              sx={{
                p: 2,
              }}
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
                  {showNewAssetCards ? (
                    <AssetCard
                      assetId={getNewDataswornId(sharedAssets[assetId].id)}
                      storedAsset={sharedAssets[assetId]}
                      onAssetRemove={() => handleClick(assetId, true)}
                      onAssetAbilityToggle={(abilityIndex, checked) =>
                        updateSharedAssetCheckbox(
                          assetId,
                          abilityIndex,
                          checked
                        )
                      }
                      onAssetOptionChange={(optionKey, value) =>
                        updateSharedAssetOption(assetId, optionKey, value)
                      }
                      onAssetControlChange={(controlKey, value) =>
                        updateSharedAssetControl(assetId, controlKey, value)
                      }
                      sx={{
                        minHeight: 450,
                        width: "100%",
                      }}
                    />
                  ) : (
                    <OldAssetCard
                      assetId={getOldDataswornId(sharedAssets[assetId].id)}
                      storedAsset={sharedAssets[assetId]}
                      handleInputChange={(label, inputKey, value) =>
                        updateSharedAssetInput(
                          assetId,
                          label,
                          inputKey,
                          value
                        ).catch(() => {})
                      }
                      sx={{
                        // maxWidth: 380,
                        minHeight: 450,
                        width: "100%",
                      }}
                      handleAbilityCheck={(abilityIndex, checked) =>
                        updateSharedAssetCheckbox(
                          assetId,
                          abilityIndex,
                          checked
                        )
                      }
                      handleTrackValueChange={(value) =>
                        updateSharedAssetTrack(assetId, value)
                      }
                      handleConditionCheck={(condition, checked) =>
                        updateSharedAssetCondition(assetId, condition, checked)
                      }
                      handleDeleteClick={() => handleClick(assetId, true)}
                      handleCustomAssetUpdate={(asset) =>
                        updateSharedCustomAsset(assetId, asset)
                      }
                    />
                  )}
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
        </>
      )}
      <SectionHeading
        label={"Character Assets"}
        action={
          <Button
            variant={"outlined"}
            color={"inherit"}
            onClick={() => setIsAssetDialogOpen({ open: true })}
          >
            Add Asset
          </Button>
        }
      />
      {sortedAssetKeys.length > 0 ? (
        <Grid
          sx={{
            p: 2,
          }}
          container
          spacing={2}
        >
          {sortedAssetKeys.map((assetId, index) => (
            <Grid
              key={index}
              item
              xs={12}
              sm={6}
              xl={4}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              {showNewAssetCards ? (
                <AssetCard
                  assetId={getNewDataswornId(assets[assetId].id)}
                  storedAsset={assets[assetId]}
                  onAssetRemove={() => handleClick(assetId, false)}
                  onAssetAbilityToggle={(abilityIndex, checked) =>
                    updateAssetCheckbox(assetId, abilityIndex, checked)
                  }
                  onAssetOptionChange={(optionKey, value) =>
                    updateAssetOption(assetId, optionKey, value)
                  }
                  onAssetControlChange={(controlKey, value) =>
                    updateAssetControl(assetId, controlKey, value)
                  }
                  sx={{
                    minHeight: 450,
                    width: "100%",
                  }}
                />
              ) : (
                <OldAssetCard
                  assetId={getOldDataswornId(assets[assetId].id)}
                  storedAsset={assets[assetId]}
                  handleInputChange={(label, inputKey, value) =>
                    updateAssetInput(assetId, label, inputKey, value).catch(
                      () => {}
                    )
                  }
                  sx={{
                    // maxWidth: 380,
                    minHeight: 450,
                    width: "100%",
                  }}
                  handleAbilityCheck={(abilityIndex, checked) =>
                    updateAssetCheckbox(assetId, abilityIndex, checked)
                  }
                  handleTrackValueChange={(value) =>
                    updateAssetTrack(assetId, value)
                  }
                  handleConditionCheck={(condition, checked) =>
                    updateAssetCondition(assetId, condition, checked)
                  }
                  handleDeleteClick={() => handleClick(assetId, false)}
                  handleCustomAssetUpdate={(asset) =>
                    updateCustomAsset(assetId, asset)
                  }
                />
              )}
            </Grid>
          ))}
        </Grid>
      ) : assetsLoading ? (
        <LinearProgress sx={{ mb: 4 }} />
      ) : (
        <Box p={2} display={"flex"} justifyContent={"center"}>
          <Typography>No Assets Found</Typography>
        </Box>
      )}
      {showNewAssetCards ? (
        <AssetCardDialog
          open={isAssetDialogOpen.open}
          loading={addAssetLoading}
          handleClose={() => setIsAssetDialogOpen({ open: false })}
          handleAssetSelection={(asset) =>
            handleAssetAdd({
              ...asset,
              order: isAssetDialogOpen.addToCampaign
                ? nextSharedAssetIndex
                : nextAssetIndex,
            })
          }
          showSharedAssetWarning={
            isInCampaign && !isAssetDialogOpen.addToCampaign
          }
        />
      ) : (
        <OldAssetCardDialog
          open={isAssetDialogOpen.open}
          loading={addAssetLoading}
          handleClose={() => setIsAssetDialogOpen({ open: false })}
          handleAssetSelection={(asset) =>
            handleAssetAdd({
              ...asset,
              order: isAssetDialogOpen.addToCampaign
                ? nextSharedAssetIndex
                : nextAssetIndex,
            })
          }
          showSharedAssetWarning={
            isInCampaign && !isAssetDialogOpen.addToCampaign
          }
        />
      )}
    </>
  );
}
