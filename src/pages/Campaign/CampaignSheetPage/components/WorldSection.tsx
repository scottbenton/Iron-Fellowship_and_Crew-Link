import { LinearProgress } from "@mui/material";
import { useListenToWorld } from "api/worlds/listenToWorld";
import { WorldSheet } from "components/WorldSheet";

export interface WorldSectionProps {
  worldId: string;
}

export function WorldSection(props: WorldSectionProps) {
  const { worldId } = props;

  const { world } = useListenToWorld(worldId);
  if (!world) {
    return <LinearProgress />;
  }

  return <WorldSheet worldId={worldId} world={world} canEdit={false} />;
}
