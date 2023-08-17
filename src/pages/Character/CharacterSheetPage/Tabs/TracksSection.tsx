import { Box, Stack } from "@mui/material";
import { SectionHeading } from "components/SectionHeading";
import { ExperienceTrack } from "./ExperienceTrack";
import { ProgressTrack } from "components/ProgressTrack";
import { ProgressTrackSection } from "./ProgressTrackSection";
import { TRACK_TYPES } from "types/Track.type";
import { useStore } from "stores/store";

export function TracksSection() {
  const bondValue = useStore(
    (store) => store.characters.currentCharacter.currentCharacter?.bonds ?? 0
  );
  const updateCharacter = useStore(
    (store) => store.characters.currentCharacter.updateCurrentCharacter
  );

  const updateBonds = (bonds: number) => {
    return updateCharacter({ bonds });
  };

  return (
    <Stack spacing={2}>
      <SectionHeading label={"Experience"} />
      <Box px={2}>
        <ExperienceTrack />
      </Box>
      <SectionHeading label={"Bonds"} />
      <Box px={2}>
        <ProgressTrack
          value={bondValue}
          max={40}
          onValueChange={(value) => updateBonds(value)}
        />
      </Box>
      <ProgressTrackSection
        type={TRACK_TYPES.FRAY}
        typeLabel={"Combat Track"}
      />
      <ProgressTrackSection
        type={TRACK_TYPES.VOW}
        typeLabel={"Vow"}
        showPersonalIfInCampaign
      />
      <ProgressTrackSection type={TRACK_TYPES.JOURNEY} typeLabel={"Journey"} />
    </Stack>
  );
}
