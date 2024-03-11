import { Stack } from "@mui/material";
import { useNewCustomContentPage } from "hooks/featureFlags/useNewCustomContentPage";
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

  const showNewExpansions = useNewCustomContentPage();
  const specialTracks = useStore((store) => store.rules.specialTracks);
  const specialTrackValues = useStore(
    (store) =>
      store.campaigns.currentCampaign.characters.characterMap[characterId]
        .specialTracks ?? {}
  );

  return (
    <Stack spacing={2} px={2} sx={{ overflowX: "auto" }}>
      {showNewExpansions ? (
        <>
          {Object.keys(specialTracks)
            .filter((st) => !specialTracks[st].shared)
            .map((st) => (
              <LegacyTrack
                key={st}
                label={specialTracks[st].label}
                value={specialTrackValues[st]?.value}
                checkedExperience={
                  specialTrackValues[st]?.spentExperience ?? {}
                }
                isLegacy={specialTrackValues[st]?.isLegacy ?? false}
              />
            ))}
        </>
      ) : (
        <>
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
        </>
      )}
    </Stack>
  );
}
