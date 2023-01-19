import { Box, Stack, Typography } from "@mui/material";
import { AddTrackDialog } from "../../../components/AddTrackDialog/AddTrackDialog";
import { ProgressTrack } from "../../../components/ProgressTrack";
import { TRACK_TYPES } from "../../../types/Track.type";
import { useCharacterSheetStore } from "../characterSheet.store";

export interface ProgressTrackSectionProps {
  type: TRACK_TYPES;
  typeLabel: string;
  showPersonalIfInCampaign?: boolean;
}

export function ProgressTrackSection(props: ProgressTrackSectionProps) {
  const { type, typeLabel, showPersonalIfInCampaign } = props;

  const tracks = useCharacterSheetStore((store) => store[type]);

  const addProgressTrack = useCharacterSheetStore(
    (store) => store.addProgressTrack
  );

  const updateProgressTrackValue = useCharacterSheetStore(
    (store) => store.updateProgressTrackValue
  );
  const removeProgressTrack = useCharacterSheetStore(
    (store) => store.removeProgressTrack
  );

  return (
    <Box pb={2}>
      {Array.isArray(tracks.campaign) && (
        <>
          <Box
            bgcolor={(theme) => theme.palette.grey[200]}
            px={2}
            py={0.5}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Typography
              variant={"h6"}
              fontFamily={(theme) => theme.fontFamilyTitle}
              color={(theme) => theme.palette.text.secondary}
            >
              Shared {typeLabel}s
            </Typography>
            <AddTrackDialog
              trackTypeName={`Shared ${typeLabel}`}
              handleTrackAdd={(track) => addProgressTrack(type, track, true)}
              buttonProps={{
                variant: "text",
              }}
            />
          </Box>
          <Stack px={2} mt={2} spacing={4} mb={4}>
            {Array.isArray(tracks.campaign) &&
              tracks.campaign.map((track, index) => (
                <ProgressTrack
                  key={index}
                  label={track.label}
                  description={track.description}
                  difficulty={track.difficulty}
                  value={track.value}
                  onValueChange={(value) => {
                    updateProgressTrackValue(type, true, track.id, value);
                  }}
                  max={40}
                />
              ))}
          </Stack>
        </>
      )}
      {((Array.isArray(tracks.campaign) && showPersonalIfInCampaign) ||
        !Array.isArray(tracks.campaign)) && (
        <>
          <Box
            bgcolor={(theme) => theme.palette.grey[200]}
            px={2}
            py={0.5}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Typography
              variant={"h6"}
              fontFamily={(theme) => theme.fontFamilyTitle}
              color={(theme) => theme.palette.text.secondary}
            >
              Personal {typeLabel}s
            </Typography>
            <AddTrackDialog
              trackTypeName={`Personal ${typeLabel}`}
              handleTrackAdd={(track) => addProgressTrack(type, track)}
              buttonProps={{
                variant: "text",
              }}
            />
          </Box>
          <Stack px={2} mt={2} spacing={4}>
            {Array.isArray(tracks.character) &&
              tracks.character.map((track, index) => (
                <ProgressTrack
                  key={index}
                  label={track.label}
                  description={track.description}
                  difficulty={track.difficulty}
                  value={track.value}
                  onValueChange={(value) =>
                    updateProgressTrackValue(type, false, track.id, value)
                  }
                  max={40}
                />
              ))}
          </Stack>
        </>
      )}
    </Box>
  );
}
