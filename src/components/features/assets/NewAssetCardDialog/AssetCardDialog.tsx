import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  Tab,
  Tabs,
} from "@mui/material";
import { useCallback, useState } from "react";
import { StoredAsset } from "types/Asset.type";
import { MarkdownRenderer } from "components/shared/MarkdownRenderer";
import { DialogTitleWithCloseButton } from "components/shared/DialogTitleWithCloseButton";
import { AssetCardSearch } from "./AssetCardSearch";
import { AssetCardDialogCard } from "./AssetCardDialogCard";
import { Datasworn } from "@datasworn/core";
import { useStore } from "stores/store";

export interface AssetCardDialogProps {
  open: boolean;
  loading?: boolean;
  handleClose: () => void;
  handleAssetSelection: (asset: Omit<StoredAsset, "order">) => void;
  showSharedAssetWarning?: boolean;
}

export function AssetCardDialog(props: AssetCardDialogProps) {
  const {
    open,
    loading,
    handleClose,
    handleAssetSelection,
    showSharedAssetWarning,
  } = props;

  const assetGroups = useStore(
    (store) => store.rules.assetMaps.assetCollectionMap
  );

  const [selectedTabId, setSelectedTabId] = useState<string>(
    Object.keys(assetGroups)[0]
  );
  const [searchedAssetId, setSearchedAssetId] = useState<string>();
  const handleSearch = useCallback((groupId: string, assetId: string) => {
    setSelectedTabId(groupId);
    setSearchedAssetId(assetId);
  }, []);
  const clearSearch = useCallback(() => setSearchedAssetId(undefined), []);

  const onAssetSelect = (asset: Datasworn.Asset) => {
    const enabledAbilities: Record<number, boolean> = {};
    asset.abilities.map((ability, index) => {
      enabledAbilities[index] = ability.enabled;
    });
    const storedAsset: Omit<StoredAsset, "order"> = {
      id: asset.id,
      enabledAbilities,
    };
    handleAssetSelection(storedAsset);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth={"md"} fullWidth>
      <DialogTitleWithCloseButton
        onClose={handleClose}
        actions={
          <Box display={{ xs: "none", sm: "block" }}>
            <AssetCardSearch handleSearch={handleSearch} />
          </Box>
        }
      >
        Select an asset
      </DialogTitleWithCloseButton>
      <DialogContent>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Box display={{ xs: "block", sm: "none" }}>
            <AssetCardSearch handleSearch={handleSearch} />
          </Box>
          <Tabs
            value={selectedTabId}
            onChange={(evt, value) => setSelectedTabId(value)}
            variant={"scrollable"}
            scrollButtons={"auto"}
          >
            {Object.keys(assetGroups).map((groupKey, index) => (
              <Tab
                label={assetGroups[groupKey].name}
                value={groupKey}
                key={index}
              />
            ))}
          </Tabs>
        </Box>
        <Box py={1}>
          {showSharedAssetWarning && (
            <Alert severity={"warning"}>
              <AlertTitle>Shared Assets</AlertTitle>
              These assets are shared amongst characters playing together in a
              campaign. If you plan on playing with multiple characters, add
              these assets to your campaign, instead of to your character.
            </Alert>
          )}
          <MarkdownRenderer
            markdown={assetGroups[selectedTabId]?.description ?? ""}
          />
          <Grid container spacing={1} mt={2}>
            {Object.values(assetGroups[selectedTabId]?.contents ?? {}).map(
              (asset, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <AssetCardDialogCard
                    assetId={asset.id}
                    selectAsset={() => onAssetSelect(asset)}
                    loading={loading}
                    searched={asset.id === searchedAssetId}
                    clearSearched={clearSearch}
                  />
                </Grid>
              )
            )}
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions
        sx={(theme) => ({
          backgroundColor: theme.palette.darkGrey.main,
          color: theme.palette.darkGrey.contrastText,
        })}
      >
        <Button
          onClick={() => handleClose()}
          color={"inherit"}
          disabled={loading}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
