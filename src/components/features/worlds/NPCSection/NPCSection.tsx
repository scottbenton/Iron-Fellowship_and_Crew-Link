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
import { useStore } from "stores/store";
import { useState } from "react";
import { useGameSystemValue } from "hooks/useGameSystemValue";
import { GAME_SYSTEMS } from "types/GameSystems.type";
import { DefaultNPCSpecies, NPC } from "types/NPCs.type";

export interface NPCSectionProps {
  isSinglePlayer?: boolean;
  showHiddenTag?: boolean;
  hideSidebar?: boolean;
}

export function NPCSection(props: NPCSectionProps) {
  const { isSinglePlayer, showHiddenTag, hideSidebar } = props;

  const defaultNPC = useGameSystemValue<Partial<NPC>>({
    [GAME_SYSTEMS.IRONSWORN]: { species: DefaultNPCSpecies.Ironlander },
    [GAME_SYSTEMS.STARFORGED]: {},
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

  const { filteredNPCIds, sortedNPCIds } = useFilterNPCs(
    locations,
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
    return <WorldEmptyState />;
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
        {!hideSidebar && (
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
        )}

        <OpenNPC
          worldId={worldId}
          npcId={openNPCId}
          npc={openNPC}
          locations={locations}
          closeNPC={() => setOpenNPCId()}
          hideBorder={hideSidebar}
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
        searchPlaceholder={"Search by name or location"}
      />
      <NPCList
        filteredNPCIds={filteredNPCIds}
        npcs={npcs}
        locations={locations}
        openNPC={setOpenNPCId}
        showHiddenTag={showHiddenTag}
      />
    </>
  );
}
