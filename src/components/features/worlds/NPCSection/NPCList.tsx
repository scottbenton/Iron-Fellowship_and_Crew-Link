import { Grid } from "@mui/material";
import { NPCItem } from "./NPCItem";
import { NPCDocumentWithGMProperties } from "stores/world/currentWorld/npcs/npcs.slice.type";
import { LocationDocumentWithGMProperties } from "stores/world/currentWorld/locations/locations.slice.type";
import { Sector } from "types/Sector.type";

export interface NPCListProps {
  filteredNPCIds: string[];
  npcs: { [key: string]: NPCDocumentWithGMProperties };
  locations: { [key: string]: LocationDocumentWithGMProperties };
  sectors: { [key: string]: Sector };
  openNPC: (npcId: string) => void;
  canUseImages: boolean;
  showHiddenTag?: boolean;
}

export function NPCList(props: NPCListProps) {
  const {
    filteredNPCIds,
    npcs,
    locations,
    sectors,
    canUseImages,
    openNPC,
    showHiddenTag,
  } = props;

  return (
    <Grid container sx={{ p: 2 }} spacing={2}>
      {filteredNPCIds.map((npcId) => (
        <Grid item xs={12} sm={6} lg={4} key={npcId}>
          <NPCItem
            npc={npcs[npcId]}
            locations={locations}
            sectors={sectors}
            openNPC={() => openNPC(npcId)}
            canUseImages={canUseImages}
            showHiddenTag={showHiddenTag}
          />
        </Grid>
      ))}
    </Grid>
  );
}
