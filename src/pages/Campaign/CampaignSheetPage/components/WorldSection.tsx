import { LinearProgress } from "@mui/material";
import { useListenToWorld } from "api/worlds/listenToWorld";
import { WorldSheet } from "components/WorldSheet";

export interface WorldSectionProps {
  worldOwnerId: string;
  worldId: string;
}

export function WorldSection(props: WorldSectionProps) {
  const { worldOwnerId, worldId } = props;

  const { world } = useListenToWorld(worldOwnerId, worldId);
  if (!world) {
    return <LinearProgress />;
  }

  return <WorldSheet worldId={worldId} world={world} canEdit={false} />;
}
