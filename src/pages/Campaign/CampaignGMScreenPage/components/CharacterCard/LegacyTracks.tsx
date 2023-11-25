import { Stack } from "@mui/material";
import { LegacyTrack } from "pages/Character/CharacterSheetPage/Tabs/TracksSection/LegacyTrack";
import { useStore } from "stores/store";

export interface LegacyTracksProps {
  characterId: string;
}

export function LegacyTracks(props: LegacyTracksProps) {
  const { characterId } = props;

  const legacyTracks = useStore(
    (store) =>
      store.campaigns.currentCampaign.characters.characterMap[characterId]
        .legacyTracks ?? {}
  );

  return (
    <Stack spacing={2} px={2} sx={{ overflowX: "auto" }}>
      <LegacyTrack
        label={"Quests"}
        value={legacyTracks.quests?.value ?? 0}
        checkedExperience={legacyTracks.quests?.spentExperience ?? {}}
        isLegacy={legacyTracks.quests?.isLegacy ?? false}
      />
      <LegacyTrack
        label={"Bonds"}
        value={legacyTracks.bonds?.value ?? 0}
        checkedExperience={legacyTracks.bonds?.spentExperience ?? {}}
        isLegacy={legacyTracks.bonds?.isLegacy ?? false}
      />
      <LegacyTrack
        label={"Discoveries"}
        value={legacyTracks.discoveries?.value ?? 0}
        checkedExperience={legacyTracks.discoveries?.spentExperience ?? {}}
        isLegacy={legacyTracks.discoveries?.isLegacy ?? false}
      />
    </Stack>
  );
}
