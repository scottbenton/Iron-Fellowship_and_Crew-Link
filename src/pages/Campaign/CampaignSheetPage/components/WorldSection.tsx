import { LinearProgress } from "@mui/material";
import { WorldSheet } from "components/WorldSheet";
import { useStore } from "stores/store";

export function WorldSection() {
  const world = useStore((store) => store.worlds.currentWorld.currentWorld);

  if (!world) {
    return <LinearProgress />;
  }

  return <WorldSheet canEdit={false} />;
}
