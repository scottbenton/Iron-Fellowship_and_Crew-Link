import { Divider, Stack } from "@mui/material";
import { useStore } from "stores/store";
import { Clock as IClock, TRACK_STATUS, TRACK_TYPES } from "types/Track.type";
import { Clock } from "./Clock";
import { useState } from "react";
import { EmptyState } from "components/shared/EmptyState";
import { ClockDialog } from "./ClockDialog";

export interface ClocksProps {
  isCampaignSection?: boolean;
  isCompleted?: boolean;
  headingBreakContainer?: boolean;
}

export function Clocks(props: ClocksProps) {
  const { isCampaignSection, isCompleted, headingBreakContainer } = props;

  const clocks = useStore((store) =>
    isCampaignSection
      ? store.campaigns.currentCampaign.tracks.trackMap[
          isCompleted ? TRACK_STATUS.COMPLETED : TRACK_STATUS.ACTIVE
        ][TRACK_TYPES.CLOCK]
      : store.characters.currentCharacter.tracks.trackMap[
          isCompleted ? TRACK_STATUS.COMPLETED : TRACK_STATUS.ACTIVE
        ][TRACK_TYPES.CLOCK]
  );
  const sortedClockIds = getSortedClockIds(clocks);

  const [editingClock, setEditingClock] = useState<{
    clock: { id: string; clock: IClock } | undefined;
    shared?: boolean;
  }>({ clock: undefined });

  const updateCharacterClock = useStore(
    (store) => store.characters.currentCharacter.tracks.updateTrack
  );
  const updateCampaignClock = useStore(
    (store) => store.campaigns.currentCampaign.tracks.updateTrack
  );

  const handleEditClock = (
    clockId: string,
    clock: IClock,
    shared?: boolean
  ) => {
    const editFn = shared ? updateCampaignClock : updateCharacterClock;
    return editFn(clockId, clock);
  };

  const updateClock = isCampaignSection
    ? updateCampaignClock
    : updateCharacterClock;

  return (
    <>
      {sortedClockIds.length > 0 ? (
        <Stack
          spacing={4}
          sx={(theme) => ({
            px: headingBreakContainer ? 0 : 2,
            [theme.breakpoints.up("md")]: {
              px: headingBreakContainer ? 0 : 3,
            },
            mt: isCompleted ? 4 : undefined,
          })}
        >
          {isCompleted && <Divider>Completed Clocks</Divider>}
          {sortedClockIds.map((clockId) => (
            <Clock
              key={clockId}
              clock={clocks[clockId]}
              onEdit={
                isCompleted
                  ? undefined
                  : () =>
                      setEditingClock({
                        clock: {
                          id: clockId,
                          clock: clocks[clockId],
                        },
                      })
              }
              onSelectedOracleChange={
                isCompleted
                  ? undefined
                  : (oracleKey) =>
                      updateClock(clockId, {
                        oracleKey,
                      }).catch(() => {})
              }
              onComplete={
                isCompleted
                  ? undefined
                  : () =>
                      updateClock(clockId, {
                        status: TRACK_STATUS.COMPLETED,
                      }).catch(() => {})
              }
              onValueChange={
                isCompleted
                  ? undefined
                  : (value) => updateClock(clockId, { value }).catch(() => {})
              }
            />
          ))}
        </Stack>
      ) : (
        <EmptyState
          message={`No ${isCompleted ? "Completed " : ""}${
            isCampaignSection ? "Campaign" : "Character"
          } Clocks found`}
        />
      )}
      {editingClock.clock && (
        <ClockDialog
          initialClock={editingClock.clock.clock}
          open={!!editingClock.clock}
          handleClose={() => setEditingClock({ clock: undefined })}
          shared={editingClock.shared}
          onClock={(clock) =>
            handleEditClock(
              editingClock.clock?.id ?? "",
              clock,
              editingClock.shared
            )
          }
        />
      )}
    </>
  );
}

function getSortedClockIds(clocks: Record<string, IClock>): string[] {
  return Object.keys(clocks).sort((clockId1, clockId2) => {
    const clock1 = clocks[clockId1];
    const clock2 = clocks[clockId2];

    return clock2.createdDate.getTime() - clock1.createdDate.getTime();
  });
}
