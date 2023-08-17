import { FilterBar } from "components/FilterBar";
import { NPCList } from "./NPCList";
import { useFilterNPCs } from "./useFilterNPCs";
import { OpenNPC } from "./OpenNPC";
import {
  Box,
  Button,
  Hidden,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { WorldEmptyState } from "components/WorldEmptyState";
import AddNPCIcon from "@mui/icons-material/PersonAdd";
import { useCanUploadWorldImages } from "hooks/featureFlags/useCanUploadWorldImages";
import { useStore } from "stores/store";
import { useState } from "react";

export interface NPCSectionProps {
  isSinglePlayer?: boolean;
  showHiddenTag?: boolean;
}

export function NPCSection(props: NPCSectionProps) {
  const { isSinglePlayer, showHiddenTag } = props;

  const worldId = useStore((store) => store.worlds.currentWorld.currentWorldId);
  const isWorldOwner = useStore(
    (store) =>
      store.worlds.currentWorld.currentWorld?.ownerIds?.includes(
        store.auth.uid
      ) ?? false
  );
  const doAnyDocsHaveImages = useStore(
    (store) => store.worlds.currentWorld.doAnyDocsHaveImages
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

  const userCanUploadImages = useCanUploadWorldImages();
  const canShowImages = doAnyDocsHaveImages || userCanUploadImages;

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
    createNPC()
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
                <ListItemButton
                  key={npcId}
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
              ))}
            </List>
          </Box>
        </Hidden>

        <OpenNPC
          isWorldOwner={isWorldOwner}
          worldId={worldId}
          npcId={openNPCId}
          npc={openNPC}
          locations={locations}
          closeNPC={() => setOpenNPCId()}
          isSinglePlayer={isSinglePlayer}
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
        searchPlaceholder="Search by name or location"
      />
      <NPCList
        filteredNPCIds={filteredNPCIds}
        npcs={npcs}
        locations={locations}
        openNPC={setOpenNPCId}
        canUseImages={canShowImages}
        showHiddenTag={showHiddenTag}
      />
    </>
  );
}
