import {
  Box,
  Button,
  Container,
  LinearProgress,
  Typography,
} from "@mui/material";
import { useCharacterSheetUpdateCharacterWorld } from "api/characters/updateCharacterWorld";
import { WorldSheet } from "components/WorldSheet";
import { useAuth } from "providers/AuthProvider";
import { useWorldsStore } from "stores/worlds.store";
import { useCharacterSheetStore } from "../characterSheet.store";
import { WorldEmptyState } from "components/WorldEmptyState";

export function WorldSection() {
  const uid = useAuth().user?.uid;

  const campaignId = useCharacterSheetStore((store) => store.campaignId);
  const worldId = useCharacterSheetStore((store) => store.worldId);
  const worldOwnerId = useCharacterSheetStore((store) => store.worldOwnerId);
  const world = useCharacterSheetStore((store) => store.world);

  const isGM = useCharacterSheetStore((store) => store.campaign?.gmId === uid);

  const canEdit = !campaignId && uid === worldOwnerId;

  const { updateCharacterWorld, loading: updateCharacterWorldLoading } =
    useCharacterSheetUpdateCharacterWorld();

  const worldIds = useWorldsStore((store) =>
    Object.keys(store.worlds)
      .filter((w) => store.worlds[w].ownerId === uid)
      .sort((w1, w2) =>
        store.worlds[w2].name.localeCompare(store.worlds[w1].name)
      )
  );
  const worlds = useWorldsStore((store) => store.worlds);
  const sortedWorlds = worldIds.map((worldId) => worlds[worldId]);

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
      {!worldId && !world && (
        <WorldEmptyState
          worldsToChooseFrom={canEdit ? sortedWorlds : undefined}
          onChooseWorld={(worldIndex) =>
            canEdit && updateCharacterWorld(worldIds[worldIndex])
          }
          worldUpdateLoading={updateCharacterWorldLoading}
          isMultiplayer={!!campaignId}
          isGM={isGM}
          isOnWorldTab={canEdit}
        />
      )}
    </Box>
  );
}
