import { Box, Stack } from "@mui/material";
import { SectionHeading } from "components/SectionHeading";
import { ExperienceTrack } from "../components/ExperienceTrack";
import { ProgressTrack } from "components/ProgressTrack";
import { useCharacterSheetStore } from "../characterSheet.store";
import { useCharacterSheetUpdateBonds } from "api/characters/updateBonds";
import { ProgressTrackSection } from "./ProgressTrackSection";
import { TRACK_TYPES } from "types/Track.type";

export function TracksSection() {
  const bondValue = useCharacterSheetStore(
    (store) => store.character?.bonds ?? 0
  );
  const { updateBonds } = useCharacterSheetUpdateBonds();

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
