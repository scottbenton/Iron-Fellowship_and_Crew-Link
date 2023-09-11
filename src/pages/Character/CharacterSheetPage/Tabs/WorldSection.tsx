import {
  Box,
  Button,
  Container,
  LinearProgress,
  Typography,
} from "@mui/material";
import { WorldSheet } from "components/WorldSheet";
import { WorldEmptyState } from "components/WorldEmptyState";
import { useStore } from "stores/store";
import { useState } from "react";

export function WorldSection() {
  const uid = useStore((store) => store.auth.uid);

  const worldId = useStore((store) => store.worlds.currentWorld.currentWorldId);
  const world = useStore((store) => store.worlds.currentWorld.currentWorld);

  const campaignId = useStore(
    (store) => store.characters.currentCharacter.currentCharacter?.campaignId
  );
  const isWorldOwner = useStore(
    (store) =>
      store.worlds.currentWorld.currentWorld?.ownerIds.includes(
        store.auth.uid
      ) ?? false
  );
  const isGM = useStore(
    (store) =>
      store.campaigns.currentCampaign.currentCampaign?.gmIds?.includes(
        store.auth.uid
      ) ?? false
  );

  const canEdit = !campaignId || isWorldOwner;

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

  const updateCharacter = useStore(
    (store) => store.characters.currentCharacter.updateCurrentCharacter
  );

  const [updateCharacterWorldLoading, setUpdateCharacterWorldLoading] =
    useState(false);
  const updateCharacterWorld = (worldId?: string) => {
    setUpdateCharacterWorldLoading(true);
    updateCharacter({ worldId: worldId ?? null })
      .catch(() => {})
      .finally(() => {
        setUpdateCharacterWorldLoading(false);
      });
  };

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
              {!campaignId && (
                <Button
                  color={"inherit"}
                  onClick={() => updateCharacterWorld(undefined)}
                >
                  Remove World
                </Button>
              )}
            </Box>
          )}
          <WorldSheet canEdit={canEdit} hideCampaignHints />
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
