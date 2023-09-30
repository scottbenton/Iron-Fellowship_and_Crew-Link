import { Alert, Typography } from "@mui/material";
import { SectionHeading } from "components/shared/SectionHeading";
import { WorldNameSection } from "pages/World/WorldSheetPage/components/WorldNameSection";
import { useStore } from "stores/store";
import { RtcRichTextEditor } from "components/shared/RichTextEditor/RtcRichTextEditor";
import { useCallback } from "react";
import { GAME_SYSTEMS, GameSystemChooser } from "types/GameSystems.type";
import { IronswornWorldTruthsSection } from "components/features/worlds/IronswornWorldTruthsSection";
import { useGameSystemValue } from "hooks/useGameSystemValue";
import { StarforgedWorldTruthsSection } from "components/features/worlds/StarforgedWorldTruthsSection";

export interface WorldSheetProps {
  canEdit: boolean;
  hideCampaignHints?: boolean;
}

const truthSection: GameSystemChooser<
  (props: { canEdit: boolean; hideCampaignHints?: boolean }) => JSX.Element
> = {
  [GAME_SYSTEMS.IRONSWORN]: IronswornWorldTruthsSection,
  [GAME_SYSTEMS.STARFORGED]: StarforgedWorldTruthsSection,
};

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

  const TruthSection = useGameSystemValue(truthSection);

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
      <TruthSection canEdit={canEdit} hideCampaignHints={hideCampaignHints} />
    </>
  );
}
