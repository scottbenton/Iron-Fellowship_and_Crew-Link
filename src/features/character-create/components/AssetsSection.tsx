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
  assets,
} from "../../../data/assets";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { AssetCard } from "../../../components/AssetCard/AssetCard";
import { AddAssetCard } from "./AddAssetCard";
import { useState } from "react";
import { Asset } from "../../../types/Asset.type";
import { AssetCardDialog } from "../../../components/AssetCardDialog";
import { useCharacterCreateStore } from "../store/characterCreate.store";

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
  const selectedAssets = useCharacterCreateStore((store) => store.assets);
  const setSelectedAsset = useCharacterCreateStore(
    (store) => store.selectAsset
  );

  // const [currentlySelectedAssets, setCurrentlySelectedAssets] = useState<
  //   (Asset | undefined)[]
  // >([undefined, undefined, undefined]);
  const [currentlySelectingAssetIndex, setCurrentlySelectingAssetIndex] =
    useState<number>();

  const selectAsset = (assetId: string) => {
    if (typeof currentlySelectingAssetIndex === "number") {
      setSelectedAsset(currentlySelectingAssetIndex, assetId);
    }
    setCurrentlySelectingAssetIndex(undefined);
  };

  const removeAsset = (index: number) => {
    setSelectedAsset(index);
  };

  return (
    <Stack>
      <Typography variant={"h6"}>Assets</Typography>
      <Typography color={"GrayText"}>
        Choose three Assets to start your story!
      </Typography>

      <Grid
        sx={(theme) => ({
          backgroundColor: theme.palette.background.default,
          pr: 2,
          pb: 2,
          borderRadius: theme.shape.borderRadius,
          mt: 2,
        })}
        container
        spacing={2}
      >
        {selectedAssets.map((storedAsset, index) => (
          <Grid
            key={index}
            item
            xs={12}
            sm={6}
            lg={4}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            {storedAsset ? (
              <AssetCard
                asset={assets[storedAsset.id]}
                sx={{
                  // maxWidth: 380,
                  minHeight: 450,
                  width: "100%",
                }}
                actions={
                  <Button color={"error"} onClick={() => removeAsset(index)}>
                    Remove
                  </Button>
                }
              />
            ) : (
              <AddAssetCard
                onClick={() => setCurrentlySelectingAssetIndex(index)}
              />
            )}
          </Grid>
        ))}
      </Grid>
      <AssetCardDialog
        open={typeof currentlySelectingAssetIndex === "number"}
        handleClose={() => setCurrentlySelectingAssetIndex(undefined)}
        handleAssetSelection={(asset) => selectAsset(asset.id)}
      />
    </Stack>
  );
}
