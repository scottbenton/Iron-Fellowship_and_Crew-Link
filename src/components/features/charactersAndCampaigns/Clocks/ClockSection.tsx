import { Button, Checkbox, FormControlLabel } from "@mui/material";
import { SectionHeading } from "components/shared/SectionHeading";
import { useState } from "react";
import { useStore } from "stores/store";
import { Clock as IClock } from "types/Track.type";
import { ClockDialog } from "./ClockDialog";
import { Clocks } from "./Clocks";

export interface ClockSectionProps {
  headingBreakContainer?: boolean;
}

export function ClockSection(props: ClockSectionProps) {
  const { headingBreakContainer } = props;

  const setLoadCompletedCharacterTracks = useStore(
    (store) => store.characters.currentCharacter.tracks.setLoadCompletedTracks
  );
  const setLoadCompletedCampaignTracks = useStore(
    (store) => store.campaigns.currentCampaign.tracks.setLoadCompletedTracks
  );
  const [showCompletedCharacterClocks, setShowCompletedCharacterClocks] =
    useState(false);
  const toggleShowCompletedCharacterClocks = (value: boolean) => {
    if (value) {
      setLoadCompletedCharacterTracks();
    }
    setShowCompletedCharacterClocks(value);
  };
  const [showCompletedCampaignClocks, setShowCompletedCampaignClocks] =
    useState(false);
  const toggleShowCompletedCampaignClocks = (value: boolean) => {
    if (value) {
      setLoadCompletedCampaignTracks();
    }
    setShowCompletedCampaignClocks(value);
  };

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

  const addCharacterClock = useStore(
    (store) => store.characters.currentCharacter.tracks.addTrack
  );
  const addCampaignClock = useStore(
    (store) => store.campaigns.currentCampaign.tracks.addTrack
  );

  const handleAddClock = (clock: IClock, shared?: boolean) => {
    const addFn = shared ? addCampaignClock : addCharacterClock;
    return addFn(clock);
  };

  return (
    <>
      {isInCampaign && (
        <>
          <SectionHeading
            breakContainer={headingBreakContainer}
            label={"Shared Clocks"}
            action={
              <>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={showCompletedCampaignClocks}
                      onChange={(evt, checked) =>
                        toggleShowCompletedCampaignClocks(checked)
                      }
                    />
                  }
                  label={"Show Completed Clocks"}
                />
                <Button
                  color={"inherit"}
                  onClick={() =>
                    setAddClockDialogOpen({ open: true, shared: true })
                  }
                >
                  Add Shared Clock
                </Button>
              </>
            }
          />
          <Clocks
            isCampaignSection
            headingBreakContainer={headingBreakContainer}
          />
          {showCompletedCampaignClocks && (
            <Clocks isCampaignSection isCompleted />
          )}
        </>
      )}
      {isInCharacterSheet && !isInCampaign && (
        <>
          <SectionHeading
            breakContainer={headingBreakContainer}
            label={"Character Clocks"}
            action={
              <>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={showCompletedCharacterClocks}
                      onChange={(evt, checked) =>
                        toggleShowCompletedCharacterClocks(checked)
                      }
                    />
                  }
                  label={"Show Completed Clocks"}
                />
                <Button
                  color={"inherit"}
                  onClick={() => setAddClockDialogOpen({ open: true })}
                >
                  Add Character Clock
                </Button>
              </>
            }
          />

          <Clocks />
          {showCompletedCharacterClocks && (
            <Clocks isCompleted headingBreakContainer={headingBreakContainer} />
          )}
        </>
      )}
      <ClockDialog
        open={addClockDialogOpen.open}
        handleClose={() => setAddClockDialogOpen({ open: false })}
        shared={addClockDialogOpen.shared}
        onClock={(clock) => handleAddClock(clock, addClockDialogOpen.shared)}
      />
    </>
  );
}
