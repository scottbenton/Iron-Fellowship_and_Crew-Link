import { Box, Card, CardActionArea, Grid, Typography } from "@mui/material";
import {
  LocationDocumentWithGMProperties,
  NPC,
} from "stores/sharedLocationStore";
import { NPCItem } from "./NPCItem";

export interface NPCListProps {
  npcs: { [key: string]: NPC };
  locations: { [key: string]: LocationDocumentWithGMProperties };
  openNPC: (npcId: string) => void;
}

export function NPCList(props: NPCListProps) {
  const { npcs, locations, openNPC } = props;

  const sortedNPCs = Object.keys(npcs).sort((n1, n2) => {
    return npcs[n2].updatedDate.getTime() - npcs[n1].updatedDate.getTime();
  });

  return (
    <Grid container sx={{ p: 2 }} spacing={2}>
      {sortedNPCs.map((npcId) => (
        <Grid item xs={12} sm={6} md={4} key={npcId}>
          <NPCItem
            npc={npcs[npcId]}
            locations={locations}
            openNPC={() => openNPC(npcId)}
          />
        </Grid>
      ))}
    </Grid>
  );
}
