import {
  Box,
  Button,
  Container,
  LinearProgress,
  Typography,
} from "@mui/material";
import { WorldSheet } from "components/WorldSheet";
import { useConfirm } from "material-ui-confirm";
import { WorldEmptyState } from "components/WorldEmptyState";
import { useStore } from "stores/store";
import { useState } from "react";

export function WorldSection() {
  const confirm = useConfirm();
  const uid = useStore((store) => store.auth.uid);

  const worldId = useStore((store) => store.worlds.currentWorld.currentWorldId);
  const world = useStore((store) => store.worlds.currentWorld.currentWorld);

  const worldIds = useStore((store) =>
    Object.keys(store.worlds.worldMap)
      .filter((w) => store.worlds.worldMap[w].ownerIds.includes(uid))
      .sort((w1, w2) =>
        store.worlds.worldMap[w2].name.localeCompare(
          store.worlds.worldMap[w1].name
        )
      )
  );
  const worlds = useStore((store) => store.worlds.worldMap);
  const sortedWorlds = worldIds.map((worldId) => worlds[worldId]);

  const updateCampaignWorld = useStore(
    (store) => store.campaigns.currentCampaign.updateCampaignWorld
  );
  const [updateCampaignWorldLoading, setUpdateCampaignWorldLoading] =
    useState(false);

  const handleWorldRemove = () => {
    setUpdateCampaignWorldLoading(true);
    confirm({
      title: `Remove ${world?.name}`,
      description:
        "Are you sure you want to remove this world from the campaign? You will not be able to access locations or NPCs until you add another world.",
      confirmationText: "Remove",
      confirmationButtonProps: {
        variant: "contained",
        color: "error",
      },
    })
      .then(() => {
        updateCampaignWorld(undefined)
          .catch(() => {})
          .finally(() => {
            setUpdateCampaignWorldLoading(false);
          });
      })
      .catch(() => {
        setUpdateCampaignWorldLoading(false);
      });
  };

  return (
    <Box>
      {worldId && world && (
        <Container sx={{ pb: 2 }}>
          <Box
            sx={{
              py: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant={"h6"}>{world.name}</Typography>
            <Button onClick={() => handleWorldRemove()}>Remove World</Button>
          </Box>
          <WorldSheet canEdit />
        </Container>
      )}
      {worldId && !world && <LinearProgress />}
      {!worldId && !world && (
        <WorldEmptyState
          isGM
          isMultiplayer
          isOnWorldTab
          worldsToChooseFrom={sortedWorlds}
          onChooseWorld={(worldIndex) => {
            setUpdateCampaignWorldLoading(true);
            updateCampaignWorld(worldIds[worldIndex])
              .catch(() => {})
              .finally(() => setUpdateCampaignWorldLoading(false));
          }}
          worldUpdateLoading={updateCampaignWorldLoading}
        />
      )}
    </Box>
  );
}
