import { WorldStoreProperties } from "stores/world.slice";
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
import { useAuth } from "providers/AuthProvider";
import { WorldEmptyState } from "components/WorldEmptyState";
import { useCreateNPC } from "api/worlds/npcs/createNPC";
import AddNPCIcon from "@mui/icons-material/PersonAdd";
import { useCanUploadWorldImages } from "hooks/featureFlags/useCanUploadWorldImages";
import { StoreApi, UseBoundStore } from "zustand";

export interface NPCSectionProps {
  worldOwnerId: string;
  worldId: string;
  isSinglePlayer?: boolean;
  showHiddenTag?: boolean;
  useStore: UseBoundStore<StoreApi<WorldStoreProperties>>;
}

export function NPCSection(props: NPCSectionProps) {
  const { worldOwnerId, worldId, isSinglePlayer, showHiddenTag, useStore } =
    props;

  const {
    locations,
    npcs,
    openNPCId,
    setOpenNPCId,
    doAnyDocsHaveImages,
    search,
    setSearch,
  } = useStore((store) => ({
    locations: store.locations,
    npcs: store.npcs,
    openNPCId: store.openNPCId,
    setOpenNPCId: store.setOpenNPCId,
    doAnyDocsHaveImages: store.doAnyDocsHaveImages,
    search: store.npcSearch,
    setSearch: store.setNPCSearch,
  }));

  const uid = useAuth().user?.uid;
  const isWorldOwner = worldOwnerId === uid;

  const userCanUploadImages = useCanUploadWorldImages() ?? false;
  const canShowImages = doAnyDocsHaveImages || userCanUploadImages;

  const { filteredNPCIds, sortedNPCIds } = useFilterNPCs(
    locations,
    npcs,
    search
  );

  const { createNPC, loading } = useCreateNPC();

  if (!worldId || !worldOwnerId) {
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
          worldOwnerId={worldOwnerId}
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
            disabled={loading}
            sx={{ flexShrink: 0 }}
            endIcon={<AddNPCIcon />}
            onClick={() =>
              createNPC(worldId)
                .then((npcId) => setOpenNPCId(npcId))
                .catch(() => {})
            }
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
