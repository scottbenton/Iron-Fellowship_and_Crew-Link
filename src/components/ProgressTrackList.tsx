import { Box, Stack, Typography } from "@mui/material";
import { TrackWithId } from "../features/character-sheet/characterSheet.store";
import { StoredTrack } from "../types/Track.type";
import { AddTrackDialog } from "./AddTrackDialog/AddTrackDialog";
import { ProgressTrack } from "./ProgressTrack/ProgressTrack";
import { SectionHeading } from "./SectionHeading";

export interface ProgressTrackListProps {
  tracks?: TrackWithId[];
  typeLabel: string;
  handleAdd: (newTrack: StoredTrack) => Promise<boolean>;
  handleUpdateValue: (trackId: string, value: number) => Promise<boolean>;
  handleDeleteTrack: (trackId: string) => Promise<boolean>;
  headingBreakContainer?: boolean;
}

export function ProgressTrackList(props: ProgressTrackListProps) {
  const {
    tracks,
    typeLabel,
    handleAdd,
    handleUpdateValue,
    handleDeleteTrack,
    headingBreakContainer,
  } = props;

  return (
    <>
      <SectionHeading
        label={`${typeLabel}s`}
        action={
          <AddTrackDialog
            trackTypeName={`${typeLabel}`}
            handleTrackAdd={(track) => handleAdd(track)}
            buttonProps={{
              variant: "text",
            }}
          />
        }
        breakContainer={headingBreakContainer}
      />
      <Stack
        mt={2}
        spacing={4}
        mb={4}
        sx={(theme) => ({
          px: headingBreakContainer ? 0 : 2,
          [theme.breakpoints.up("md")]: {
            px: headingBreakContainer ? 0 : 3,
          },
        })}
      >
        {Array.isArray(tracks) &&
          tracks.map((track, index) => (
            <ProgressTrack
              key={index}
              label={track.label}
              description={track.description}
              difficulty={track.difficulty}
              value={track.value}
              onValueChange={(value) => handleUpdateValue(track.id, value)}
              onDelete={() => {
                handleDeleteTrack(track.id);
              }}
              max={40}
            />
          ))}
      </Stack>
    </>
  );
}
