import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import {
  companions,
  paths,
  combatTalents,
  rituals,
} from "../../../data/assets";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { AssetCard } from "../../../components/AssetCard/AssetCard";
import { AddAssetCard } from "./AddAssetCard";
import { useState } from "react";
import { Asset } from "../../../types/Asset.type";
import { AssetCardDialog } from "../../../components/AssetCardDialog";

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

export function AssetsSection() {
  const [currentlySelectedAssets, setCurrentlySelectedAssets] = useState<
    (Asset | undefined)[]
  >([undefined, undefined, undefined]);
  const [currentlySelectingAssetIndex, setCurrentlySelectingAssetIndex] =
    useState<number>();

  return (
    <Stack>
      <Typography variant={"h6"}>Assets</Typography>
      <Typography color={"GrayText"}>
        Choose three Assets to start your story!
      </Typography>

      <Grid
        sx={(theme) => ({
          backgroundColor: theme.palette.background.default,
          padding: 2,
          borderRadius: theme.shape.borderRadius,
          mt: 2,
        })}
        container
        spacing={2}
      >
        <AddAssetCard onClick={() => setCurrentlySelectingAssetIndex(0)} />
        <AddAssetCard onClick={() => setCurrentlySelectingAssetIndex(1)} />
        <AddAssetCard onClick={() => setCurrentlySelectingAssetIndex(2)} />
      </Grid>
      <AssetCardDialog
        open={typeof currentlySelectingAssetIndex === "number"}
        handleClose={() => setCurrentlySelectingAssetIndex(undefined)}
        handleAssetSelection={() => {}}
      />

      {assetGroups.map((group) => (
        <Accordion variant={"outlined"}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box>
              <Typography variant={"h6"}>{group.name}</Typography>
              <Typography color={"GrayText"}>{group.description}</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              {group.assets.map((asset, index) => (
                <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
                  <AssetCard
                    asset={asset}
                    hideTracks={true}
                    actions={<Button>Select</Button>}
                  />
                </Grid>
              ))}
            </Grid>
          </AccordionDetails>
        </Accordion>
      ))}
    </Stack>
  );
}
