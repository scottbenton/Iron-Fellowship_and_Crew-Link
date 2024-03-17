import { Divider, Stack } from "@mui/material";
import { useState } from "react";
import { useStore } from "stores/store";
import { TRACK_SECTION_PROGRESS_TRACKS, TRACK_STATUS } from "types/Track.type";
import { ProgressTrack } from "./ProgressTrack";
import { EmptyState } from "components/shared/EmptyState";
import { EditOrCreateTrackDialog } from "./EditOrCreateTrackDialog";

export interface ProgressTracksProps {
  isCampaign?: boolean;
  isCompleted?: boolean;
  trackType: TRACK_SECTION_PROGRESS_TRACKS;
  typeLabel: string;
  headingBreakContainer?: boolean;
  readOnly?: boolean;
}

export function ProgressTracks(props: ProgressTracksProps) {
  const {
    isCampaign,
    isCompleted,
    trackType,
    typeLabel,
    headingBreakContainer,
    readOnly,
  } = props;

  const tracks = useStore((store) =>
    isCampaign
      ? store.campaigns.currentCampaign.tracks.trackMap[
          isCompleted ? TRACK_STATUS.COMPLETED : TRACK_STATUS.ACTIVE
        ][trackType]
      : store.characters.currentCharacter.tracks.trackMap[
          isCompleted ? TRACK_STATUS.COMPLETED : TRACK_STATUS.ACTIVE
        ][trackType]
  );

  const orderedTrackIds = Object.keys(tracks).sort((trackId1, trackId2) => {
    const track1 = tracks[trackId1];
    const track2 = tracks[trackId2];

    return track2.createdDate.getTime() - track1.createdDate.getTime();
  });

  const [currentlyEditingTrackId, setCurrentlyEditingTrackId] =
    useState<string>();

  const currentlyEditingTrack =
    currentlyEditingTrackId && tracks
      ? tracks[currentlyEditingTrackId]
      : undefined;

  const updateCampaignProgressTrack = useStore(
    (store) => store.campaigns.currentCampaign.tracks.updateTrack
  );
  const updateCharacterProgressTrack = useStore(
    (store) => store.characters.currentCharacter.tracks.updateTrack
  );

  const updateProgressTrack = isCampaign
    ? updateCampaignProgressTrack
    : updateCharacterProgressTrack;

  const deleteProgressTrack = (trackId: string) => {
    updateProgressTrack(trackId, { status: TRACK_STATUS.COMPLETED }).catch(
      () => {}
    );
  };

  const updateProgressTrackValue = (trackId: string, value: number) => {
    updateProgressTrack(trackId, { value }).catch(() => {});
  };

  return (
    <>
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
        {isCompleted && <Divider>Completed Tracks</Divider>}
        {Array.isArray(orderedTrackIds) && orderedTrackIds.length > 0 ? (
          orderedTrackIds.map((trackId, index) => (
            <ProgressTrack
              key={index}
              status={tracks[trackId].status}
              trackType={trackType}
              label={tracks[trackId].label}
              description={tracks[trackId].description}
              difficulty={tracks[trackId].difficulty}
              value={tracks[trackId].value}
              max={40}
              onValueChange={
                readOnly || isCompleted
                  ? undefined
                  : (value) => updateProgressTrackValue(trackId, value)
              }
              onDelete={
                readOnly || isCompleted
                  ? undefined
                  : () => deleteProgressTrack(trackId)
              }
              onEdit={
                readOnly || isCompleted
                  ? undefined
                  : () => setCurrentlyEditingTrackId(trackId)
              }
              hideRollButton={readOnly || isCompleted}
            />
          ))
        ) : (
          <EmptyState
            message={`No ${isCompleted ? "Completed " : ""}${typeLabel}s found`}
          />
        )}
      </Stack>
      {!readOnly && currentlyEditingTrack && currentlyEditingTrackId && (
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
              ? updateProgressTrack(currentlyEditingTrackId, track)
              : new Promise((res) => res(true))
          }
        />
      )}
    </>
  );
}
