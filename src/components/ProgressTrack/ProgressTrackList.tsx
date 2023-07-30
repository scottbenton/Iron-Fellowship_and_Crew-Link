import { Button, Stack } from "@mui/material";
import { TrackWithId } from "../../pages/Character/CharacterSheetPage/characterSheet.store";
import { StoredTrack, TRACK_TYPES } from "../../types/Track.type";
import { EditOrCreateTrackDialog } from "./EditOrCreateTrackDialog";
import { ProgressTrack } from "./ProgressTrack";
import { SectionHeading } from "../SectionHeading";
import { EmptyState } from "../EmptyState/EmptyState";
import { useState } from "react";

export interface ProgressTrackListProps {
  trackType: TRACK_TYPES;
  tracks?: TrackWithId[];
  typeLabel: string;
  handleAdd?: (newTrack: StoredTrack) => Promise<boolean>;
  handleUpdateValue: (trackId: string, value: number) => Promise<boolean>;
  handleDeleteTrack?: (trackId: string) => Promise<boolean>;
  handleUpdateTrack?: (trackId: string, track: StoredTrack) => Promise<boolean>;
  headingBreakContainer?: boolean;
}

export function ProgressTrackList(props: ProgressTrackListProps) {
  const {
    tracks,
    trackType,
    typeLabel,
    handleAdd,
    handleUpdateValue,
    handleDeleteTrack,
    handleUpdateTrack,
    headingBreakContainer,
  } = props;

  const [addTrackDialogOpen, setAddTrackDialogOpen] = useState<boolean>(false);
  const [currentlyEditingTrack, setCurrentlyEditingTrack] =
    useState<TrackWithId>();

  return (
    <>
      <EditOrCreateTrackDialog
        open={addTrackDialogOpen}
        handleClose={() => setAddTrackDialogOpen(false)}
        trackTypeName={`${typeLabel}`}
        handleTrack={(track) =>
          handleAdd ? handleAdd(track) : new Promise((res) => res(true))
        }
        buttonProps={{
          variant: "text",
        }}
      />

      {handleUpdateTrack && currentlyEditingTrack && (
        <EditOrCreateTrackDialog
          open={!!currentlyEditingTrack}
          handleClose={() => setCurrentlyEditingTrack(undefined)}
          trackTypeName={`${typeLabel}`}
          initialTrack={currentlyEditingTrack}
          handleTrack={(track) =>
            currentlyEditingTrack
              ? handleUpdateTrack(currentlyEditingTrack?.id, track)
              : new Promise((res) => res(true))
          }
          buttonProps={{
            variant: "text",
          }}
        />
      )}

      <SectionHeading
        label={`${typeLabel}s`}
        action={
          handleAdd && (
            <Button onClick={() => setAddTrackDialogOpen(true)}>
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
        {Array.isArray(tracks) && tracks.length > 0 ? (
          tracks.map((track, index) => (
            <ProgressTrack
              key={index}
              trackType={trackType}
              label={track.label}
              description={track.description}
              difficulty={track.difficulty}
              value={track.value}
              onValueChange={(value) => handleUpdateValue(track.id, value)}
              onDelete={
                handleDeleteTrack
                  ? () => {
                      handleDeleteTrack(track.id);
                    }
                  : undefined
              }
              max={40}
              onEdit={
                handleUpdateTrack
                  ? () => setCurrentlyEditingTrack(track)
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
