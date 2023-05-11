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
import { useCharacterSheetUpdateCharacterWorld } from "api/characters/updateCharacterWorld";
import { EmptyState } from "components/EmptyState/EmptyState";
import { WorldSheet } from "components/WorldSheet";
import { useAuth } from "providers/AuthProvider";
import { Link } from "react-router-dom";
// import { paths, ROUTES } from "routes";
import { useWorldsStore } from "stores/worlds.store";
import { useCharacterSheetStore } from "../characterSheet.store";
import { WORLD_ROUTES, constructWorldPath } from "pages/World/routes";

export function WorldSection() {
  const uid = useAuth().user?.uid;

  const campaignId = useCharacterSheetStore((store) => store.campaignId);
  const worldId = useCharacterSheetStore((store) => store.worldId);
  const worldOwnerId = useCharacterSheetStore((store) => store.worldOwnerId);
  const world = useCharacterSheetStore((store) => store.world);

  const canEdit = !campaignId && uid === worldOwnerId;

  const { updateCharacterWorld, loading: updateCharacterWorldLoading } =
    useCharacterSheetUpdateCharacterWorld();

  const worldIds = useWorldsStore((store) =>
    Object.keys(store.worlds).sort((w1, w2) =>
      store.worlds[w2].name.localeCompare(store.worlds[w1].name)
    )
  );
  const worlds = useWorldsStore((store) => store.worlds);

  return (
    <Box>
      {worldId && world && (
        <Container sx={{ pb: 2 }}>
          {canEdit && (
            <Box
              sx={{
                py: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography variant={"h6"}>{world.name}</Typography>
              <Button
                onClick={() => updateCharacterWorld(undefined).catch(() => {})}
              >
                Remove World
              </Button>
            </Box>
          )}
          <WorldSheet
            worldId={worldId}
            world={world}
            canEdit={canEdit}
            hideCampaignHints
          />
        </Container>
      )}
      {worldId && !world && <LinearProgress />}
      {!worldId && !world && !campaignId && (
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
                    onClick={() =>
                      updateCharacterWorld(worldId).catch(() => {})
                    }
                    sx={{ p: 2 }}
                    disabled={updateCharacterWorldLoading}
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
                  disabled={updateCharacterWorldLoading}
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
                "Worlds allow you to view locations, NPCs, and world truths in your character sheet."
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
      {!worldId && !world && campaignId && (
        <EmptyState
          imageSrc={"/assets/nature.svg"}
          title={"No World Found"}
          message={"Your GM has not yet added a world to this campaign."}
        />
      )}
    </Box>
  );
}
