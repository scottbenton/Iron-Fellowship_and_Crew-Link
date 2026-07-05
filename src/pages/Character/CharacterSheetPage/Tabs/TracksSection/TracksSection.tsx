import { Stack } from "@mui/material";
import { UnifiedTracksSection } from "components/features/ProgressTrack";
import { SpecialTracks } from "./SpecialTracks";

export function TracksSection() {
  return (
    <Stack spacing={2} sx={{ pb: 2 }}>
      <SpecialTracks />
      <UnifiedTracksSection mode={"character"} />
    </Stack>
  );
}
