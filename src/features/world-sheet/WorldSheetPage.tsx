import { LinearProgress } from "@mui/material";
import { useUpdateWorldDescription } from "api/worlds/updateWorldDescription";
import { PageBanner } from "components/Layout/PageBanner";
import { WorldSheet } from "components/WorldSheet";
import { useWorld } from "./hooks/useWorld";

export function WorldSheetPage() {
  const { worldId, world, canEdit, isLoading } = useWorld();
  const { updateWorldDescription } = useUpdateWorldDescription();

  if (isLoading) {
    return <LinearProgress />;
  }

  if (!world || !worldId) {
    return null;
  }

  return (
    <>
      <PageBanner>{world.name}</PageBanner>
      <WorldSheet worldId={worldId} world={world} canEdit={canEdit} />
    </>
  );
}
