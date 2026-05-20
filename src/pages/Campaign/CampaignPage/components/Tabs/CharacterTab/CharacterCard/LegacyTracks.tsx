import { Stack } from "@mui/material";
import { LegacyTrack } from "pages/Character/CharacterSheetPage/Tabs/TracksSection/LegacyTrack";
import { useStore } from "stores/store";
import { useIsMobile } from "hooks/useIsMobile";

export interface LegacyTracksProps {
  characterId: string;
}

export function LegacyTracks(props: LegacyTracksProps) {
  const { characterId } = props;

  const specialTracks = useStore((store) => store.rules.specialTracks);
  const specialTrackValues = useStore(
    (store) =>
      store.campaigns.currentCampaign.characters.characterMap[characterId]
        .specialTracks ?? {}
  );

  const isMobile = useIsMobile();

  return (
    <Stack spacing={2} sx={{ overflowX: "auto", alignItems: isMobile ? "center" : undefined }}>
      {Object.keys(specialTracks)
        .filter((st) => !specialTracks[st].shared)
        .map((st) => (
          <LegacyTrack
            key={st}
            label={specialTracks[st].label}
            value={specialTrackValues[st]?.value}
            checkedExperience={specialTrackValues[st]?.spentExperience ?? {}}
            isLegacy={specialTrackValues[st]?.isLegacy ?? false}
          />
        ))}
    </Stack>
  );
}
