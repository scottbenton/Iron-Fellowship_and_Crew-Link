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
import { assetGroupMap, assetGroups } from "data/assets";
import { StoredAsset } from "types/Asset.type";
import { Asset } from "dataforged";
import { CreateCustomAsset } from "./CreateCustomAsset";
import { MarkdownRenderer } from "components/shared/MarkdownRenderer";
import { encodeDataswornId } from "functions/dataswornIdEncoder";
import { DialogTitleWithCloseButton } from "components/shared/DialogTitleWithCloseButton";
import { AssetCardSearch } from "./AssetCardSearch";
import { AssetCardDialogCard } from "./AssetCardDialogCard";

export interface AssetCardDialogProps {
  open: boolean;
  loading?: boolean;
  handleClose: () => void;
  handleAssetSelection: (asset: Omit<StoredAsset, "order">) => void;
  showSharedAssetWarning?: boolean;
}

const groups: { name: string; id: string }[] = assetGroups.map((group) => ({
  id: group.$id,
  name: group.Title.Standard,
}));

export function AssetCardDialog(props: AssetCardDialogProps) {
  const {
    open,
    loading,
    handleClose,
    handleAssetSelection,
    showSharedAssetWarning,
  } = props;

  const [selectedTabId, setSelectedTabId] = useState<string>(groups[0].id);
  const [searchedAssetId, setSearchedAssetId] = useState<string>();
  const handleSearch = useCallback((groupId: string, assetId: string) => {
    setSelectedTabId(groupId);
    setSearchedAssetId(assetId);
  }, []);
  const clearSearch = useCallback(() => setSearchedAssetId(undefined), []);

  const onAssetSelect = (asset: Asset, isCustom?: boolean) => {
    const inputs: { [key: string]: string } = {};

    Object.values(asset.Inputs ?? {}).forEach((input) => {
      inputs[encodeDataswornId(input.$id)] = "";
    });

    const enabledAbilities: { [key: number]: boolean } = {};
    asset.Abilities.map((ability, index) => {
      enabledAbilities[index] = ability.Enabled;
    });

    const storedAsset: Omit<StoredAsset, "order"> = {
      id: asset.$id,
      enabledAbilities,
      inputs: Object.keys(inputs).length > 0 ? inputs : null,
      trackValue:
        asset?.["Condition meter"]?.Value ??
        asset?.["Condition meter"]?.Max ??
        null,
      customAsset: isCustom ? asset : null,
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
            {groups.map((group, index) => (
              <Tab label={group.name} value={group.id} key={index} />
            ))}
            <Tab label={"custom"} value={"custom"} />
          </Tabs>
        </Box>
        <Box py={1}>
          {selectedTabId !== "custom" ? (
            <>
              {showSharedAssetWarning &&
                assetGroupMap[selectedTabId].Usage.Shared && (
                  <Alert severity={"warning"}>
                    <AlertTitle>Shared Assets</AlertTitle>
                    These assets are shared amongst characters playing together
                    in a campaign. If you plan on playing with multiple
                    characters, add these assets to your campaign, instead of to
                    your character.
                  </Alert>
                )}
              <MarkdownRenderer
                markdown={assetGroupMap[selectedTabId].Description}
              />
              <Grid container spacing={1} mt={2}>
                {Object.values(assetGroupMap[selectedTabId].Assets).map(
                  (asset, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <AssetCardDialogCard
                        asset={asset}
                        selectAsset={() => onAssetSelect(asset)}
                        loading={loading}
                        searched={asset.$id === searchedAssetId}
                        clearSearched={clearSearch}
                      />
                    </Grid>
                  )
                )}
              </Grid>
            </>
          ) : (
            <CreateCustomAsset
              handleSelect={(asset) => onAssetSelect(asset, true)}
            />
          )}
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
