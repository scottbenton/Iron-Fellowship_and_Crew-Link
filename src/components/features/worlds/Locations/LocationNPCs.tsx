import { Grid } from "@mui/material";
import { NPCCard } from "components/features/worlds/NPCSection/NPCCard";
import { EmptyState } from "components/shared/EmptyState";
import { SectionHeading } from "components/shared/SectionHeading";
import { useStore } from "stores/store";

export interface LocationNPCProps {
  locationId: string;
  showHiddenTag?: boolean;
  openNPCTab: () => void;
}

export function LocationNPCs(props: LocationNPCProps) {
  const { locationId, showHiddenTag, openNPCTab } = props;

  const npcs = useStore(
    (store) => store.worlds.currentWorld.currentWorldNPCs.npcMap
  );
  const locations = useStore(
    (store) => store.worlds.currentWorld.currentWorldLocations.locationMap
  );

  const filteredNPCs = Object.keys(npcs).filter(
    (npcId) => npcs[npcId].lastLocationId === locationId
  );

  const openNPC = useStore(
    (store) => store.worlds.currentWorld.currentWorldNPCs.setOpenNPCId
  );

  if (filteredNPCs.length <= 0) {
    return (
      <Grid item xs={12}>
        <EmptyState message="No NPCs added to this location yet." />
      </Grid>
    );
  }

  return (
    <>
      <Grid item xs={12}>
        <SectionHeading label="Location NPCs" breakContainer />
      </Grid>
      {filteredNPCs.map((npcId) => (
        <Grid key={npcId} item xs={12} lg={6} xl={4}>
          <NPCCard
            npc={npcs[npcId]}
            locations={locations}
            openNPC={() => {
              openNPC(npcId);
              openNPCTab();
            }}
            showHiddenTag={showHiddenTag}
          />
        </Grid>
      ))}
    </>
  );
}
