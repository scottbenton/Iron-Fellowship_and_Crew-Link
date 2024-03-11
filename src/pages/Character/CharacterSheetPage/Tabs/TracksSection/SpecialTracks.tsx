import { Box, Stack } from "@mui/material";
import { SectionHeading } from "components/shared/SectionHeading";
import { useGameSystem } from "hooks/useGameSystem";
import { useStore } from "stores/store";
import { GAME_SYSTEMS } from "types/GameSystems.type";
import { ExperienceTrack } from "./ExperienceTrack";
import { ProgressTrack } from "components/features/ProgressTrack";
import { LegacyTrack as ILegacyTrack } from "types/LegacyTrack.type";
import { LegacyTrack } from "./LegacyTrack";

export function SpecialTracks() {
  const specialTracksRules = useStore((store) => store.rules.specialTracks);

  const isInCampaign = useStore(
    (store) => store.characters.currentCharacter.currentCharacter?.campaignId
  );
  const specialTracksCharacterValues = useStore(
    (store) => store.characters.currentCharacter.currentCharacter?.specialTracks
  );
  const specialTracksCampaignValues = useStore(
    (store) => store.campaigns.currentCampaign.currentCampaign?.specialTracks
  );

  const getSpecialTrackValue = (
    specialTrackKey: string
  ): ILegacyTrack | undefined => {
    const specialTrack = specialTracksRules[specialTrackKey];
    if (isInCampaign && specialTracksCampaignValues && specialTrack.shared) {
      return specialTracksCampaignValues[specialTrackKey];
    } else if (
      (!isInCampaign || !specialTrack.shared) &&
      specialTracksCharacterValues
    ) {
      return specialTracksCharacterValues[specialTrackKey];
    }
    return undefined;
  };

  const updateCharacter = useStore(
    (store) => store.characters.currentCharacter.updateCurrentCharacter
  );
  const updateCampaign = useStore(
    (store) => store.campaigns.currentCampaign.updateCampaign
  );

  const updateSpecialTrackValue = (
    specialTrackKey: string,
    newValue: number
  ) => {
    const specialTrack = specialTracksRules[specialTrackKey];

    if (specialTrack.shared && isInCampaign) {
      return updateCampaign({
        [`specialTracks.${specialTrackKey}.value`]: newValue,
      });
    } else {
      return updateCharacter({
        [`specialTracks.${specialTrackKey}.value`]: newValue,
      });
    }
  };

  const updateSpecialTrackExperienceChecked = (
    specialTrackKey: string,
    index: number,
    checked: boolean
  ) => {
    const specialTrack = specialTracksRules[specialTrackKey];

    if (specialTrack.shared && isInCampaign) {
      return updateCampaign({
        [`specialTracks.${specialTrackKey}.spentExperience.${index}`]: checked,
      });
    } else {
      return updateCharacter({
        [`specialTracks.${specialTrackKey}.spentExperience.${index}`]: checked,
      });
    }
  };

  const updateSpecialTrackIsLegacy = (
    specialTrackKey: string,
    checked: boolean
  ) => {
    const specialTrack = specialTracksRules[specialTrackKey];

    const newTrack: ILegacyTrack = {
      value: 0,
      isLegacy: checked,
      spentExperience: {},
    };

    if (specialTrack.shared && isInCampaign) {
      return updateCampaign({
        [`specialTracks.${specialTrackKey}`]: newTrack,
      });
    } else {
      return updateCharacter({
        [`specialTracks.${specialTrackKey}`]: newTrack,
      });
    }
  };

  const isIronsworn = useGameSystem().gameSystem === GAME_SYSTEMS.IRONSWORN;

  if (isIronsworn) {
    return (
      <>
        <SectionHeading label={"Experience"} />
        <Box px={2}>
          <ExperienceTrack />
        </Box>
        <SectionHeading label={"Legacy Tracks"} />
        <Stack spacing={2} px={2}>
          {Object.keys(specialTracksRules).map((specialTrackKey) => (
            <ProgressTrack
              label={specialTracksRules[specialTrackKey].label}
              key={specialTrackKey}
              value={getSpecialTrackValue(specialTrackKey)?.value ?? 0}
              max={40}
              onValueChange={(value) =>
                updateSpecialTrackValue(specialTrackKey, value)
              }
            />
          ))}
        </Stack>
      </>
    );
  }
  return (
    <>
      <SectionHeading label={"Legacy Tracks"} />
      <Stack spacing={2} px={2} sx={{ overflowX: "auto" }}>
        {Object.keys(specialTracksRules).map((specialTrackKey) => {
          const specialTrackValue = getSpecialTrackValue(specialTrackKey);
          return (
            <LegacyTrack
              key={specialTrackKey}
              label={specialTracksRules[specialTrackKey].label}
              value={specialTrackValue?.value ?? 0}
              checkedExperience={specialTrackValue?.spentExperience ?? {}}
              onValueChange={(value) =>
                updateSpecialTrackValue(specialTrackKey, value)
              }
              onExperienceChecked={(index, checked) =>
                updateSpecialTrackExperienceChecked(
                  specialTrackKey,
                  index,
                  checked
                )
              }
              isLegacy={specialTrackValue?.isLegacy ?? false}
              onIsLegacyChecked={(checked) =>
                updateSpecialTrackIsLegacy(specialTrackKey, checked)
              }
            />
          );
        })}
      </Stack>
    </>
  );
}
