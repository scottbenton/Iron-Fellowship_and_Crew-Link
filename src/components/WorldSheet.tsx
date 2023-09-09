import { Alert, Grid, Typography } from "@mui/material";
import { truthIds } from "data/truths";
import { TRUTH_IDS } from "types/World.type";
import { SectionHeading } from "./SectionHeading";
import { WorldNameSection } from "pages/World/WorldSheetPage/components/WorldNameSection";
import { TruthCard } from "pages/World/WorldSheetPage/components/TruthCard";
import { useStore } from "stores/store";
import { RtcRichTextEditor } from "./RichTextEditor/RtcRichTextEditor";
import { useCallback } from "react";

export interface WorldSheetProps {
  canEdit: boolean;
  hideCampaignHints?: boolean;
}

export function WorldSheet(props: WorldSheetProps) {
  const { canEdit, hideCampaignHints } = props;

  const world = useStore((store) => store.worlds.currentWorld.currentWorld);
  const worldId = useStore((store) => store.worlds.currentWorld.currentWorldId);

  const updateWorldDescription = useStore(
    (store) => store.worlds.currentWorld.updateCurrentWorldDescription
  );

  const updateWorldDescriptionCallback = useCallback(
    (documentId: string, content: Uint8Array, isBeaconRequest?: boolean) =>
      worldId
        ? updateWorldDescription(worldId, content, isBeaconRequest)
        : new Promise<void>((res) => res()),
    [updateWorldDescription, worldId]
  );

  if (!world || !worldId) return null;

  return (
    <>
      {canEdit ? (
        <WorldNameSection />
      ) : (
        <Typography
          variant={"h5"}
          sx={(theme) => ({ py: 2, fontFamily: theme.fontFamilyTitle })}
        >
          {world.name}
        </Typography>
      )}
      {(canEdit || world.worldDescription) && (
        <>
          <SectionHeading
            breakContainer
            label={"World Description"}
            sx={{ mt: canEdit ? 4 : 0, mb: 2 }}
          />
          {canEdit && !hideCampaignHints && (
            <Alert severity={"info"} sx={{ mb: 2 }}>
              If you add this world to your campaign, this information will be
              shared with your players.
            </Alert>
          )}
          <RtcRichTextEditor
            id={worldId}
            roomPrefix={`worlds-${worldId}-description-`}
            documentPassword={worldId}
            onSave={canEdit ? updateWorldDescriptionCallback : undefined}
            initialValue={world.worldDescription}
          />
        </>
      )}
      <SectionHeading
        breakContainer
        label={"World Truths"}
        sx={{ mt: canEdit ? 4 : 2 }}
      />
      {canEdit && !hideCampaignHints && (
        <Alert severity={"info"} sx={{ mt: 2 }}>
          If you add this world to a campaign, the world truths will be shared
          with your players, but the quest starters will not.
        </Alert>
      )}
      <Grid container spacing={2} mt={0}>
        {truthIds.map((truthId) => (
          <Grid item xs={12} md={6} lg={4} key={truthId}>
            <TruthCard
              truthId={truthId as TRUTH_IDS}
              storedTruth={world.truths[truthId as TRUTH_IDS]}
              canEdit={canEdit}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
}
