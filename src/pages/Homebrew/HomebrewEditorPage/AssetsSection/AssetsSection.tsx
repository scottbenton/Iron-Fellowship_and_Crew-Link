import { Box, Button, Grid, Stack } from "@mui/material";
import { AssetCard } from "components/features/assets/NewAssetCard";
import { AssetCardDialog } from "components/features/assets/NewAssetCardDialog";
import { SectionHeading } from "components/shared/SectionHeading";
import { useState } from "react";

export interface AssetsSectionProps {
  homebrewId: string;
}

export function AssetsSection(props: AssetsSectionProps) {
  const { homebrewId } = props;
  console.debug(homebrewId);

  const [open, setOpen] = useState(false);

  return (
    <>
      <SectionHeading
        label={"Custom Assets"}
        sx={{ mt: 2 }}
        floating
        action={
          <Button variant={"outlined"} color={"inherit"}>
            Add Asset
          </Button>
        }
      />
      <Grid container spacing={2}></Grid>
      <Stack direction={"row"} spacing={2} sx={{ mt: 2 }} flexWrap={"wrap"}>
        <Box sx={{ mt: 2, maxWidth: 300, width: "100%" }}>
          <AssetCard
            showSharedIcon
            onAssetRemove={() => {}}
            assetId='starforged/assets/command_vehicle/starship'
          />
        </Box>
        <Box sx={{ mt: 2, maxWidth: 300, width: "100%" }}>
          <AssetCard assetId='starforged/assets/companion/sprite' />
        </Box>
        {/* <Box sx={{ mt: 2, maxWidth: 300, width: "100%" }}>
        <AssetCard assetId='starforged/assets/deed/bonded' />
      </Box> */}
        <Box sx={{ mt: 2, maxWidth: 300, width: "100%" }}>
          <AssetCard assetId='starforged/assets/path/blademaster' />
        </Box>
        <Button onClick={() => setOpen(true)}>Open dialog</Button>
        <AssetCardDialog
          open={open}
          handleClose={() => setOpen(false)}
          handleAssetSelection={() => {}}
        />
      </Stack>
    </>
  );
}
