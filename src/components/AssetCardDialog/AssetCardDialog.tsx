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
import { companions, paths, combatTalents, rituals } from "../../data/assets";
import { Asset } from "../../types/Asset.type";
import { AssetCard } from "../AssetCard/AssetCard";

const assetGroups = [
  {
    name: "Companions",
    description: "Living creatures to assist you on your journey.",
    assets: companions,
  },
  {
    name: "Paths",
    description: "Skills gained from your character's background.",
    assets: paths,
  },
  {
    name: "Combat Talents",
    description: "Is your character an expert at fighting with any weapons?",
    assets: combatTalents,
  },
  {
    name: "Rituals",
    description: "What magic does your character have access to?",
    assets: rituals,
  },
];

export interface AssetCardDialogProps {
  open: boolean;
  handleClose: () => void;
  handleAssetSelection: (assetId: Asset) => void;
}

export function AssetCardDialog(props: AssetCardDialogProps) {
  const { open, handleClose, handleAssetSelection } = props;

  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <Dialog open={open} onClose={() => handleClose()} maxWidth={"md"}>
      <DialogTitle>Select an asset</DialogTitle>
      <DialogContent>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={selectedTab}
            onChange={(evt, value) => setSelectedTab(value)}
            variant={"scrollable"}
            scrollButtons={"auto"}
          >
            {assetGroups.map((group, index) => (
              <Tab label={group.name} key={index} />
            ))}
          </Tabs>
        </Box>
        <Box py={1}>
          <Typography color={"GrayText"}>
            {assetGroups[selectedTab].description}
          </Typography>
          <Grid container spacing={1} mt={2}>
            {assetGroups[selectedTab].assets.map((asset, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <AssetCard
                  asset={asset}
                  readOnly
                  actions={
                    <Button onClick={() => handleAssetSelection(asset)}>
                      Select
                    </Button>
                  }
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions
        sx={(theme) => ({
          backgroundColor: theme.palette.primary.main,
          color: "white",
        })}
      >
        <Button onClick={() => handleClose()} color={"inherit"}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
