import {
  Box,
  Button,
  Card,
  CardActionArea,
  Container,
  Divider,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import { useCampaignGMScreenUpdateCampaignWorld } from "api/campaign/updateCampaignWorld";
import { EmptyState } from "components/EmptyState/EmptyState";
import { WorldSheet } from "components/WorldSheet";
import { useConfirm } from "material-ui-confirm";
import { Link } from "react-router-dom";
import { useWorldsStore } from "stores/worlds.store";
import { useCampaignGMScreenStore } from "../campaignGMScreen.store";
import { WORLD_ROUTES, constructWorldPath } from "pages/World/routes";
import { useAuth } from "providers/AuthProvider";
import { WorldEmptyState } from "components/WorldEmptyState";
import { useEffect } from "react";

export function WorldSection() {
  const confirm = useConfirm();
  const uid = useAuth().user?.uid;

  const setWorld = useCampaignGMScreenStore((store) => store.setWorld);
  const worldId = useCampaignGMScreenStore((store) => store.campaign?.worldId);
  const world = useWorldsStore((store) =>
    worldId ? store.worlds[worldId] : undefined
  );
  const worldIds = useWorldsStore((store) =>
    Object.keys(store.worlds)
      .filter((w) => store.worlds[w].ownerId === uid)
      .sort((w1, w2) =>
        store.worlds[w2].name.localeCompare(store.worlds[w1].name)
      )
  );
  const worlds = useWorldsStore((store) => store.worlds);
  const sortedWorlds = worldIds.map((worldId) => worlds[worldId]);

  const { updateCampaignWorld, loading: updateCampaignWorldLoading } =
    useCampaignGMScreenUpdateCampaignWorld();

  const handleWorldRemove = () => {
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
        updateCampaignWorld(undefined).catch(() => {});
      })
      .catch(() => {});
  };

  useEffect(() => {
    setWorld(world?.ownerId, worldId, world);
  }, [worldId, world]);

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
          <WorldSheet worldId={worldId} world={world} canEdit />
        </Container>
      )}
      {worldId && !world && <LinearProgress />}
      {!worldId && !world && (
        <WorldEmptyState
          isGM
          isMultiplayer
          isOnWorldTab
          worldsToChooseFrom={sortedWorlds}
          onChooseWorld={(worldIndex) =>
            updateCampaignWorld(worldIds[worldIndex])
          }
          worldUpdateLoading={updateCampaignWorldLoading}
        />
      )}
    </Box>
  );
}
