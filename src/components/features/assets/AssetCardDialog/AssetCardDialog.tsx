import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useState } from "react";
// import { companions, paths, combatTalents, rituals } from "../../data/assets";
import { assetGroups } from "data/assets";
import { StoredAsset } from "types/Asset.type";
import { Asset } from "dataforged";
import { AssetCard } from "../AssetCard/AssetCard";
import { CreateCustomAsset } from "./CreateCustomAsset";
import { MarkdownRenderer } from "components/shared/MarkdownRenderer";
import { encodeDataswornId } from "functions/dataswornIdEncoder";

export interface AssetCardDialogProps {
  open: boolean;
  loading?: boolean;
  handleClose: () => void;
  handleAssetSelection: (asset: Omit<StoredAsset, "order">) => void;
}

export function AssetCardDialog(props: AssetCardDialogProps) {
  const { open, loading, handleClose, handleAssetSelection } = props;

  const [selectedTab, setSelectedTab] = useState(0);

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
    <Dialog open={open} onClose={() => handleClose()} maxWidth={"md"} fullWidth>
      <DialogTitle>Select an asset</DialogTitle>
      <DialogContent>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={selectedTab}
            onChange={(evt, value) => setSelectedTab(value)}
            variant={"scrollable"}
            scrollButtons={"auto"}
          >
            {Object.values(assetGroups).map((group, index) => (
              <Tab label={group.Title.Standard} key={index} />
            ))}
            <Tab label={"custom"} />
          </Tabs>
        </Box>
        <Box py={1}>
          {selectedTab < assetGroups.length ? (
            <>
              <MarkdownRenderer
                markdown={assetGroups[selectedTab].Description}
              />
              <Grid container spacing={1} mt={2}>
                {Object.values(assetGroups[selectedTab].Assets).map(
                  (asset, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <AssetCard
                        assetId={asset.$id}
                        readOnly
                        actions={
                          <Button
                            color={"inherit"}
                            onClick={() => onAssetSelect(asset)}
                            disabled={loading}
                          >
                            Select
                          </Button>
                        }
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
