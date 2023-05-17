import { Card, CardActionArea, Grid, Typography } from "@mui/material";
import {
  LocationDocumentWithGMProperties,
  NPC,
} from "stores/sharedLocationStore";

export interface NPCListProps {
  npcs: { [key: string]: NPC };
  locations: { [key: string]: LocationDocumentWithGMProperties };
  openNPC: (npcId: string) => void;
}

export function NPCList(props: NPCListProps) {
  const { npcs, locations, openNPC } = props;

  const sortedNPCs = Object.keys(npcs).sort((n1, n2) => {
    console.debug(npcs[n1].name, npcs[n1].updatedDate.getTime());
    console.debug(npcs[n2].name, npcs[n2].updatedDate.getTime());
    return npcs[n2].updatedDate.getTime() - npcs[n1].updatedDate.getTime();
  });

  console.debug(sortedNPCs);

  return (
    <Grid container sx={{ p: 2 }} spacing={2}>
      {sortedNPCs.map((npcId) => (
        <Grid item xs={12} sm={6} md={4} key={npcId}>
          <Card variant={"outlined"}>
            <CardActionArea onClick={() => openNPC(npcId)} sx={{ p: 2 }}>
              <Typography>{npcs[npcId].name}</Typography>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
