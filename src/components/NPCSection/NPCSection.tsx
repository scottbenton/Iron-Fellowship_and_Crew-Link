import {
  LocationDocumentWithGMProperties,
  NPC,
} from "stores/sharedLocationStore";
import { FilterBar } from "./FilterBar";
import { NPCList } from "./NPCList";
import { useFilterNPCs } from "./useFilterNPCs";
import { OpenNPC } from "./OpenNPC";

export interface NPCSectionProps {
  worldOwnerId: string;
  worldId: string;
  locations: { [key: string]: LocationDocumentWithGMProperties };
  npcs: { [key: string]: NPC };
  openNPCId?: string;
  setOpenNPCId: (npcId?: string) => void;
}

export function NPCSection(props: NPCSectionProps) {
  const { worldOwnerId, worldId, locations, npcs, openNPCId, setOpenNPCId } =
    props;

  const { search, setSearch, filteredNPCs } = useFilterNPCs(locations, npcs);

  console.debug(filteredNPCs);

  const openNPC = openNPCId ? npcs[openNPCId] : undefined;

  if (openNPCId && openNPC) {
    return (
      <OpenNPC
        worldOwnerId={worldOwnerId}
        worldId={worldId}
        npcId={openNPCId}
        npc={openNPC}
        locations={locations}
        closeNPC={() => setOpenNPCId()}
      />
    );
  }

  return (
    <>
      <FilterBar
        worldOwnerId={worldOwnerId}
        worldId={worldId}
        search={search}
        setSearch={setSearch}
        openNPC={setOpenNPCId}
      />
      <NPCList
        npcs={filteredNPCs}
        locations={locations}
        openNPC={setOpenNPCId}
      />
    </>
  );
}
