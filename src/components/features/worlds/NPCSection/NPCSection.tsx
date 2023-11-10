import { FilterBar } from "components/features/worlds/FilterBar";
import { NPCList } from "./NPCList";
import { useFilterNPCs } from "./useFilterNPCs";
import { OpenNPC } from "./OpenNPC";
import {
  Box,
  Button,
  Hidden,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { WorldEmptyState } from "components/features/worlds/WorldEmptyState";
import AddNPCIcon from "@mui/icons-material/PersonAdd";
import { useCanUploadWorldImages } from "hooks/featureFlags/useCanUploadWorldImages";
import { useStore } from "stores/store";
import { useState } from "react";
import { useGameSystemValue } from "hooks/useGameSystemValue";
import { GAME_SYSTEMS } from "types/GameSystems.type";
import { NPCDocument, NPC_SPECIES } from "types/NPCs.type";

export interface NPCSectionProps {
  isSinglePlayer?: boolean;
  showHiddenTag?: boolean;
}

export function NPCSection(props: NPCSectionProps) {
  const { isSinglePlayer, showHiddenTag } = props;

  const defaultNPC = useGameSystemValue<Partial<NPCDocument>>({
    [GAME_SYSTEMS.IRONSWORN]: { species: NPC_SPECIES.IRONLANDER },
    [GAME_SYSTEMS.STARFORGED]: {},
  });
  const searchPlaceholder = useGameSystemValue({
    [GAME_SYSTEMS.IRONSWORN]: "Search by name or location",
    [GAME_SYSTEMS.STARFORGED]: "Search by name or sector",
  });

  const worldId = useStore((store) => store.worlds.currentWorld.currentWorldId);
  const isWorldOwner = useStore(
    (store) =>
      store.worlds.currentWorld.currentWorld?.ownerIds?.includes(
        store.auth.uid
      ) ?? false
  );
  const locations = useStore(
    (store) => store.worlds.currentWorld.currentWorldLocations.locationMap
  );
  const sectors = useStore(
    (store) => store.worlds.currentWorld.currentWorldSectors.sectors
  );
  const npcs = useStore(
    (store) => store.worlds.currentWorld.currentWorldNPCs.npcMap
  );
  const openNPCId = useStore(
    (store) => store.worlds.currentWorld.currentWorldNPCs.openNPCId
  );
  const setOpenNPCId = useStore(
    (store) => store.worlds.currentWorld.currentWorldNPCs.setOpenNPCId
  );
  const search = useStore(
    (store) => store.worlds.currentWorld.currentWorldNPCs.npcSearch
  );
  const setSearch = useStore(
    (store) => store.worlds.currentWorld.currentWorldNPCs.setNPCSearch
  );

  const canShowImages = useCanUploadWorldImages();

  const { filteredNPCIds, sortedNPCIds } = useFilterNPCs(
    locations,
    sectors,
    npcs,
    search
  );

  const [createNPCLoading, setCreateNPCLoading] = useState<boolean>(false);
  const createNPC = useStore(
    (store) => store.worlds.currentWorld.currentWorldNPCs.createNPC
  );
  const handleCreateNPC = () => {
    setCreateNPCLoading(true);
    createNPC(defaultNPC)
      .then((npcId) => setOpenNPCId(npcId))
      .catch(() => {})
      .finally(() => setCreateNPCLoading(false));
  };

  if (!worldId) {
    return (
      <WorldEmptyState isMultiplayer={!isSinglePlayer} isGM={isWorldOwner} />
    );
  }

  const openNPC = openNPCId ? npcs[openNPCId] : undefined;

  if (openNPCId && openNPC) {
    return (
      <Box
        display={"flex"}
        alignItems={"stretch"}
        maxHeight={"100%"}
        height={"100%"}
      >
        <Hidden smDown>
          <Box overflow={"auto"} flexGrow={1} minWidth={200} maxWidth={400}>
            <List>
              {sortedNPCIds.map((npcId) => (
                <ListItem key={npcId} disablePadding>
                  <ListItemButton
                    selected={npcId === openNPCId}
                    onClick={() => setOpenNPCId(npcId)}
                  >
                    <ListItemText
                      primary={npcs[npcId].name}
                      secondary={
                        !isSinglePlayer &&
                        isWorldOwner &&
                        showHiddenTag &&
                        (!npcs[npcId].sharedWithPlayers ? "Hidden" : "Shared")
                      }
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Hidden>

        <OpenNPC
          worldId={worldId}
          npcId={openNPCId}
          npc={openNPC}
          locations={locations}
          sectors={sectors}
          closeNPC={() => setOpenNPCId()}
          canUseImages={canShowImages}
        />
      </Box>
    );
  }

  return (
    <>
      <FilterBar
        search={search}
        setSearch={setSearch}
        action={
          <Button
            variant={"contained"}
            disabled={createNPCLoading}
            sx={{ flexShrink: 0 }}
            endIcon={<AddNPCIcon />}
            onClick={handleCreateNPC}
          >
            Add NPC
          </Button>
        }
        searchPlaceholder={searchPlaceholder}
      />
      <NPCList
        filteredNPCIds={filteredNPCIds}
        npcs={npcs}
        locations={locations}
        sectors={sectors}
        openNPC={setOpenNPCId}
        canUseImages={canShowImages}
        showHiddenTag={showHiddenTag}
      />
    </>
  );
}
