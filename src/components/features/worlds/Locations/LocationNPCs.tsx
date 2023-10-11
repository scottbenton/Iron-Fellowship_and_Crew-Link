import { Card, Grid } from "@mui/material";
import { NPCItem } from "components/features/worlds/NPCSection/NPCItem";
import { SectionHeading } from "components/shared/SectionHeading";
import { useStore } from "stores/store";

export interface LocationNPCProps {
  locationId: string;
  canUseImages: boolean;
  showHiddenTag?: boolean;
  openNPCTab: () => void;
}

export function LocationNPCs(props: LocationNPCProps) {
  const { locationId, canUseImages, showHiddenTag, openNPCTab } = props;

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
    return null;
  }

  return (
    <>
      <Grid item xs={12}>
        <SectionHeading label="Location NPCs" breakContainer />
      </Grid>
      {filteredNPCs.map((npcId) => (
        <Grid key={npcId} item xs={12} lg={6} xl={4}>
          <NPCItem
            npc={npcs[npcId]}
            locations={locations}
            openNPC={() => {
              openNPC(npcId);
              openNPCTab();
            }}
            canUseImages={canUseImages}
            showHiddenTag={showHiddenTag}
          />
        </Grid>
      ))}
    </>
  );
}
