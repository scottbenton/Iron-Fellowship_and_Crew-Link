import { Button, Stack } from "@mui/material";
import {
  ProgressTrack as IProgressTrack,
  TRACK_SECTION_PROGRESS_TRACKS,
} from "types/Track.type";
import { EditOrCreateTrackDialog } from "./EditOrCreateTrackDialog";
import { ProgressTrack } from "./ProgressTrack";
import { SectionHeading } from "components/shared/SectionHeading";
import { EmptyState } from "components/shared/EmptyState";
import { useState } from "react";

export interface ProgressTrackListProps {
  trackType: TRACK_SECTION_PROGRESS_TRACKS;
  tracks?: { [trackId: string]: IProgressTrack };
  typeLabel: string;
  handleAdd?: (newTrack: IProgressTrack) => Promise<boolean | void>;
  handleUpdateValue: (
    trackId: string,
    value: number
  ) => Promise<boolean | void>;
  handleDeleteTrack?: (trackId: string) => Promise<boolean | void>;
  handleUpdateTrack?: (
    trackId: string,
    track: IProgressTrack
  ) => Promise<boolean | void>;
  headingBreakContainer?: boolean;
}

export function ProgressTrackList(props: ProgressTrackListProps) {
  const {
    tracks = {},
    trackType,
    typeLabel,
    handleAdd,
    handleUpdateValue,
    handleDeleteTrack,
    handleUpdateTrack,
    headingBreakContainer,
  } = props;

  const orderedTrackIds = tracks
    ? Object.keys(tracks).sort((trackId1, trackId2) => {
        const track1 = tracks[trackId1];
        const track2 = tracks[trackId2];

        return track2.createdDate.getTime() - track1.createdDate.getTime();
      })
    : [];

  const [addTrackDialogOpen, setAddTrackDialogOpen] = useState<boolean>(false);
  const [currentlyEditingTrackId, setCurrentlyEditingTrackId] =
    useState<string>();

  const currentlyEditingTrack =
    currentlyEditingTrackId && tracks
      ? tracks[currentlyEditingTrackId]
      : undefined;

  return (
    <>
      <EditOrCreateTrackDialog
        open={addTrackDialogOpen}
        handleClose={() => setAddTrackDialogOpen(false)}
        trackType={trackType}
        trackTypeName={`${typeLabel}`}
        handleTrack={(track) =>
          handleAdd ? handleAdd(track) : new Promise((res) => res(true))
        }
      />

      {handleUpdateTrack &&
        currentlyEditingTrack &&
        currentlyEditingTrackId && (
          <EditOrCreateTrackDialog
            open={!!currentlyEditingTrack}
            handleClose={() => setCurrentlyEditingTrackId(undefined)}
            trackType={
              currentlyEditingTrack.type as TRACK_SECTION_PROGRESS_TRACKS
            }
            trackTypeName={`${typeLabel}`}
            initialTrack={currentlyEditingTrack}
            handleTrack={(track) =>
              currentlyEditingTrack
                ? handleUpdateTrack(currentlyEditingTrackId, track)
                : new Promise((res) => res(true))
            }
          />
        )}

      <SectionHeading
        label={`${typeLabel}s`}
        action={
          handleAdd && (
            <Button
              color={"inherit"}
              onClick={() => setAddTrackDialogOpen(true)}
            >
              Add {typeLabel}
            </Button>
          )
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
        {Array.isArray(orderedTrackIds) && orderedTrackIds.length > 0 ? (
          orderedTrackIds.map((trackId, index) => (
            <ProgressTrack
              key={index}
              trackType={trackType}
              label={tracks[trackId].label}
              description={tracks[trackId].description}
              difficulty={tracks[trackId].difficulty}
              value={tracks[trackId].value}
              onValueChange={(value) => handleUpdateValue(trackId, value)}
              onDelete={
                handleDeleteTrack
                  ? () => {
                      handleDeleteTrack(trackId);
                    }
                  : undefined
              }
              max={40}
              onEdit={
                handleUpdateTrack
                  ? () => setCurrentlyEditingTrackId(trackId)
                  : undefined
              }
            />
          ))
        ) : (
          <EmptyState message={`No ${typeLabel}s found`} />
        )}
      </Stack>
    </>
  );
}
