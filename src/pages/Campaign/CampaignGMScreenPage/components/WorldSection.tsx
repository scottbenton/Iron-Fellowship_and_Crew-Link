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

export function WorldSection() {
  const confirm = useConfirm();
  const uid = useAuth().user?.uid;

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
        <>
          {worldIds.length > 0 ? (
            <Stack spacing={2} sx={{ p: 2 }}>
              <Typography
                sx={{ mb: 1 }}
                color={(theme) => theme.palette.text.secondary}
              >
                Add an existing world
              </Typography>

              {worldIds.map((worldId) => (
                <Card variant={"outlined"} key={worldId}>
                  <CardActionArea
                    onClick={() => updateCampaignWorld(worldId)}
                    sx={{ p: 2 }}
                    disabled={updateCampaignWorldLoading}
                  >
                    {worlds[worldId].name}
                  </CardActionArea>
                </Card>
              ))}
              <Divider sx={{ my: 3 }}>OR</Divider>
              <Box
                display={"flex"}
                alignItems={"center"}
                justifyContent={"center"}
              >
                <Button
                  variant={"contained"}
                  component={Link}
                  to={constructWorldPath(WORLD_ROUTES.CREATE)}
                  disabled={updateCampaignWorldLoading}
                >
                  Create a new World
                </Button>
              </Box>
            </Stack>
          ) : (
            <EmptyState
              imageSrc={"/assets/nature.svg"}
              title={"No Worlds Found"}
              message={
                "Worlds allow you to share locations, NPCs, and world truths in your campaigns."
              }
              callToAction={
                <Button
                  variant={"contained"}
                  color={"primary"}
                  component={Link}
                  to={constructWorldPath(WORLD_ROUTES.CREATE)}
                >
                  Create a World
                </Button>
              }
            />
          )}
        </>
      )}
    </Box>
  );
}
