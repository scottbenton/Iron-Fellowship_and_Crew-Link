import { Box, Button, Stack } from "@mui/material";
import { AssetCard } from "components/features/assets/NewAssetCard";
import { AssetCardDialog } from "components/features/assets/NewAssetCardDialog";
import { useState } from "react";

export function AssetsSection() {
  const [open, setOpen] = useState(false);

  return (
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
  );
}
