import {
  LocationDocumentWithGMProperties,
  NPC,
} from "stores/sharedLocationStore";
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

export interface NPCSectionProps {
  worldOwnerId: string;
  worldId: string;
  locations: { [key: string]: LocationDocumentWithGMProperties };
  npcs: { [key: string]: NPC };
  openNPCId?: string;
  setOpenNPCId: (npcId?: string) => void;
  isSinglePlayer?: boolean;
  showHiddenTag?: boolean;
  doAnyDocsHaveImages: boolean;
}

export function NPCSection(props: NPCSectionProps) {
  const {
    worldOwnerId,
    worldId,
    locations,
    npcs,
    openNPCId,
    setOpenNPCId,
    isSinglePlayer,
    showHiddenTag,
    doAnyDocsHaveImages,
  } = props;

  const uid = useAuth().user?.uid;
  const isWorldOwner = worldOwnerId === uid;

  const userCanUploadImages = useCanUploadWorldImages() ?? false;
  const canShowImages = doAnyDocsHaveImages || userCanUploadImages;

  const { search, setSearch, filteredNPCs } = useFilterNPCs(locations, npcs);

  const { createNPC, loading } = useCreateNPC();

  if (!worldId || !worldOwnerId) {
    return (
      <WorldEmptyState isMultiplayer={!isSinglePlayer} isGM={isWorldOwner} />
    );
  }

  const sortedNPCs = Object.keys(filteredNPCs).sort(
    (l1, l2) =>
      filteredNPCs[l2].createdDate.getTime() -
      filteredNPCs[l1].createdDate.getTime()
  );

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
              {sortedNPCs.map((npcId) => (
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
        sortedNPCs={sortedNPCs}
        npcs={filteredNPCs}
        locations={locations}
        openNPC={setOpenNPCId}
        canUseImages={canShowImages}
        showHiddenTag={showHiddenTag}
      />
    </>
  );
}
