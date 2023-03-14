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
import { StoredAsset } from "../../types/Asset.type";
import { Asset } from "dataforged";
import { AssetCard } from "../AssetCard/AssetCard";
import { CreateCustomAsset } from "./CreateCustomAsset";
import { MarkdownRenderer } from "components/MarkdownRenderer";

// const assetGroups = [
//   {
//     name: "Companions",
//     description: "Living creatures to assist you on your journey.",
//     assets: companions,
//   },
//   {
//     name: "Paths",
//     description: "Skills gained from your character's background.",
//     assets: paths,
//   },
//   {
//     name: "Combat Talents",
//     description: "Is your character an expert at fighting with any weapons?",
//     assets: combatTalents,
//   },
//   {
//     name: "Rituals",
//     description: "What magic does your character have access to?",
//     assets: rituals,
//   },
// ];

export interface AssetCardDialogProps {
  open: boolean;
  loading?: boolean;
  handleClose: () => void;
  handleAssetSelection: (asset: StoredAsset) => void;
}

export function AssetCardDialog(props: AssetCardDialogProps) {
  const { open, loading, handleClose, handleAssetSelection } = props;

  const [selectedTab, setSelectedTab] = useState(0);

  const onAssetSelect = (asset: Asset) => {
    const inputs: { [key: string]: string } = {};

    Object.values(asset.Inputs ?? {}).forEach((input) => {
      inputs[input.$id] = "";
    });

    const storedAsset: StoredAsset = {
      id: asset.$id,
      enabledAbilities: {
        0: false,
        1: false,
        2: false,
      },
      inputs: inputs,
      trackValue:
        asset?.["Condition meter"]?.Value ?? asset?.["Condition meter"]?.Max,
      customAsset: asset.$id.startsWith("ironsworn/assets/custom")
        ? asset
        : undefined,
    };

    handleAssetSelection(storedAsset);
  };

  const handleCustomAssetCreation = (asset: Asset) => {
    console.debug(asset);
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
                            onClick={() => console.debug(asset)}
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
              handleSelect={(asset) => handleCustomAssetCreation(asset)}
            />
          )}
        </Box>
      </DialogContent>
      <DialogActions
        sx={(theme) => ({
          backgroundColor: theme.palette.primary.main,
          color: "white",
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
