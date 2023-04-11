import { Alert, Grid } from "@mui/material";
import { useUpdateWorldDescription } from "api/worlds/updateWorldDescription";
import { truthIds } from "data/truths";
import { TruthCard } from "features/world-sheet/components/TruthCard";
import { WorldNameSection } from "features/world-sheet/components/WorldNameSection";
import { TRUTH_IDS, World } from "types/World.type";
import { RichTextEditorNoTitle } from "./RichTextEditor";
import { SectionHeading } from "./SectionHeading";

export interface WorldSheetProps {
  worldId: string;
  world: World;
  canEdit: boolean;
}

export function WorldSheet(props: WorldSheetProps) {
  const { worldId, world, canEdit } = props;

  const { updateWorldDescription } = useUpdateWorldDescription();

  return (
    <>
      {canEdit && <WorldNameSection worldId={worldId} worldName={world.name} />}
      <SectionHeading
        breakContainer
        label={"World Truths"}
        sx={{ mt: canEdit ? 4 : 0 }}
      />
      {canEdit && (
        <Alert severity={"info"} sx={{ mt: 2 }}>
          If you add this world to a campaign, the world truths will be shared
          with your players, but the quest starters will not.
        </Alert>
      )}
      <Grid container spacing={2} mt={0}>
        {truthIds.map((truthId) => (
          <Grid item xs={12} md={6} lg={4} key={truthId}>
            <TruthCard
              worldId={worldId}
              truthId={truthId as TRUTH_IDS}
              storedTruth={world.truths[truthId as TRUTH_IDS]}
              canEdit={canEdit}
            />
          </Grid>
        ))}
      </Grid>
      <SectionHeading
        breakContainer
        label={"World Description"}
        sx={{ mt: 4, mb: 2 }}
      />
      {canEdit && (
        <Alert severity={"info"} sx={{ mb: 2 }}>
          If you add this world to your campaign, this information will be
          shared with your players.
        </Alert>
      )}
      <RichTextEditorNoTitle
        content={world.description ?? ""}
        onSave={
          canEdit
            ? ({ content, isBeaconRequest }) =>
                updateWorldDescription(worldId, content, isBeaconRequest)
            : undefined
        }
      />
    </>
  );
}
