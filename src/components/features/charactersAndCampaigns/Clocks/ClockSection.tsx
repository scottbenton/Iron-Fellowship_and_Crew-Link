import { Box, Button, Stack } from "@mui/material";
import { SectionHeading } from "components/shared/SectionHeading";
import { useState } from "react";
import { useStore } from "stores/store";
import { Clock as IClock, TRACK_STATUS, TRACK_TYPES } from "types/Track.type";
import { ClockDialog } from "./ClockDialog";
import { EmptyState } from "components/shared/EmptyState";
import { Clock } from "./Clock";

export interface ClockSectionProps {
  headingBreakContainer?: boolean;
}

export function ClockSection(props: ClockSectionProps) {
  const { headingBreakContainer } = props;

  const isInCampaign = useStore(
    (store) => !!store.campaigns.currentCampaign.currentCampaignId
  );
  const isInCharacterSheet = useStore(
    (store) => !!store.characters.currentCharacter.currentCharacterId
  );

  const [addClockDialogOpen, setAddClockDialogOpen] = useState<{
    open: boolean;
    shared?: boolean;
  }>({ open: false });

  const [editingClock, setEditingClock] = useState<{
    clock: { id: string; clock: IClock } | undefined;
    shared?: boolean;
  }>({ clock: undefined });

  const characterClocks = useStore(
    (store) =>
      store.characters.currentCharacter.tracks.trackMap[TRACK_TYPES.CLOCK]
  );
  const addClock = useStore(
    (store) => store.characters.currentCharacter.tracks.addTrack
  );
  const updateClock = useStore(
    (store) => store.characters.currentCharacter.tracks.updateTrack
  );
  const orderedCharacterClockIds = characterClocks
    ? Object.keys(characterClocks).sort((clockId1, clockId2) => {
        const clock1 = characterClocks[clockId1];
        const clock2 = characterClocks[clockId2];

        return clock2.createdDate.getTime() - clock1.createdDate.getTime();
      })
    : [];

  const campaignClocks = useStore(
    (store) =>
      store.campaigns.currentCampaign.tracks.trackMap[TRACK_TYPES.CLOCK]
  );
  const addCampaignClock = useStore(
    (store) => store.campaigns.currentCampaign.tracks.addTrack
  );
  const updateCampaignClock = useStore(
    (store) => store.campaigns.currentCampaign.tracks.updateTrack
  );
  const orderedCampaignClockIds = campaignClocks
    ? Object.keys(campaignClocks).sort((clockId1, clockId2) => {
        const clock1 = campaignClocks[clockId1];
        const clock2 = campaignClocks[clockId2];

        return clock2.createdDate.getTime() - clock1.createdDate.getTime();
      })
    : [];

  const handleAddClock = (clock: IClock, shared?: boolean) => {
    const addFn = shared ? addCampaignClock : addClock;
    return addFn(clock);
  };

  const handleEditClock = (
    clockId: string,
    clock: IClock,
    shared?: boolean
  ) => {
    const editFn = shared ? updateCampaignClock : updateClock;
    return editFn(clockId, clock);
  };

  return (
    <>
      {isInCampaign && (
        <>
          <SectionHeading
            breakContainer={headingBreakContainer}
            label={"Shared Clocks"}
            action={
              <Button
                color={"inherit"}
                onClick={() =>
                  setAddClockDialogOpen({ open: true, shared: true })
                }
              >
                Add Shared Clock
              </Button>
            }
          />
          {orderedCampaignClockIds.length > 0 ? (
            <Stack
              spacing={4}
              sx={(theme) => ({
                px: headingBreakContainer ? 0 : 2,
                [theme.breakpoints.up("md")]: {
                  px: headingBreakContainer ? 0 : 3,
                },
              })}
            >
              {orderedCampaignClockIds.map((clockId) => (
                <Clock
                  key={clockId}
                  clock={campaignClocks[clockId]}
                  onEdit={() =>
                    setEditingClock({
                      clock: {
                        id: clockId,
                        clock: campaignClocks[clockId],
                      },
                      shared: true,
                    })
                  }
                  onSelectedOracleChange={(oracleKey) =>
                    updateCampaignClock(clockId, {
                      oracleKey,
                    }).catch(() => {})
                  }
                  onComplete={() =>
                    updateCampaignClock(clockId, {
                      status: TRACK_STATUS.COMPLETED,
                    }).catch(() => {})
                  }
                  onValueChange={(value) =>
                    updateCampaignClock(clockId, { value }).catch(() => {})
                  }
                />
              ))}
            </Stack>
          ) : (
            <EmptyState message={`No Shared Clocks found`} />
          )}
        </>
      )}
      {isInCharacterSheet && !isInCampaign && (
        <>
          <SectionHeading
            breakContainer={headingBreakContainer}
            label={"Character Clocks"}
            action={
              <Button
                color={"inherit"}
                onClick={() => setAddClockDialogOpen({ open: true })}
              >
                Add Character Clock
              </Button>
            }
          />
          {orderedCharacterClockIds.length > 0 ? (
            <Stack
              spacing={4}
              sx={(theme) => ({
                px: headingBreakContainer ? 0 : 2,
                [theme.breakpoints.up("md")]: {
                  px: headingBreakContainer ? 0 : 3,
                },
              })}
            >
              {orderedCharacterClockIds.map((clockId) => (
                <Clock
                  key={clockId}
                  clock={characterClocks[clockId]}
                  onEdit={() =>
                    setEditingClock({
                      clock: {
                        id: clockId,
                        clock: characterClocks[clockId],
                      },
                    })
                  }
                  onSelectedOracleChange={(oracleKey) =>
                    updateClock(clockId, {
                      oracleKey,
                    }).catch(() => {})
                  }
                  onComplete={() =>
                    updateClock(clockId, {
                      status: TRACK_STATUS.COMPLETED,
                    }).catch(() => {})
                  }
                  onValueChange={(value) =>
                    updateClock(clockId, { value }).catch(() => {})
                  }
                />
              ))}
            </Stack>
          ) : (
            <EmptyState message={`No Character Clocks found`} />
          )}
        </>
      )}
      <ClockDialog
        open={addClockDialogOpen.open}
        handleClose={() => setAddClockDialogOpen({ open: false })}
        shared={addClockDialogOpen.shared}
        onClock={(clock) => handleAddClock(clock, addClockDialogOpen.shared)}
      />
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
              addClockDialogOpen.shared
            )
          }
        />
      )}
    </>
  );
}
