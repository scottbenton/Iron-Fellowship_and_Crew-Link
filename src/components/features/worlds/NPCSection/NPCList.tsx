import { Grid } from "@mui/material";
import { NPCCard } from "./NPCCard";
import { NPCDocumentWithGMProperties } from "stores/world/currentWorld/npcs/npcs.slice.type";
import { LocationWithGMProperties } from "stores/world/currentWorld/locations/locations.slice.type";

export interface NPCListProps {
  filteredNPCIds: string[];
  npcs: { [key: string]: NPCDocumentWithGMProperties };
  locations: { [key: string]: LocationWithGMProperties };
  openNPC: (npcId: string) => void;
  showHiddenTag?: boolean;
}

export function NPCList(props: NPCListProps) {
  const { filteredNPCIds, npcs, locations, openNPC, showHiddenTag } = props;

  return (
    <Grid container sx={{ p: 2 }} spacing={2}>
      {filteredNPCIds.map((npcId) => (
        <Grid item xs={12} sm={6} lg={4} key={npcId}>
          <NPCCard
            npc={npcs[npcId]}
            locations={locations}
            openNPC={() => openNPC(npcId)}
            showHiddenTag={showHiddenTag}
          />
        </Grid>
      ))}
    </Grid>
  );
}
