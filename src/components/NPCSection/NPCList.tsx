import { Box, Card, CardActionArea, Grid, Typography } from "@mui/material";
import { LocationDocumentWithGMProperties, NPC } from "stores/world.slice";
import { NPCItem } from "./NPCItem";

export interface NPCListProps {
  filteredNPCIds: string[];
  npcs: { [key: string]: NPC };
  locations: { [key: string]: LocationDocumentWithGMProperties };
  openNPC: (npcId: string) => void;
  canUseImages: boolean;
  showHiddenTag?: boolean;
}

export function NPCList(props: NPCListProps) {
  const {
    filteredNPCIds,
    npcs,
    locations,
    canUseImages,
    openNPC,
    showHiddenTag,
  } = props;

  return (
    <Grid container sx={{ p: 2 }} spacing={2}>
      {filteredNPCIds.map((npcId) => (
        <Grid item xs={12} sm={6} md={4} key={npcId}>
          <NPCItem
            npc={npcs[npcId]}
            locations={locations}
            openNPC={() => openNPC(npcId)}
            canUseImages={canUseImages}
            showHiddenTag={showHiddenTag}
          />
        </Grid>
      ))}
    </Grid>
  );
}
