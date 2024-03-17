import { Button, Checkbox, FormControlLabel } from "@mui/material";
import { TRACK_SECTION_PROGRESS_TRACKS } from "types/Track.type";
import { EditOrCreateTrackDialog } from "./EditOrCreateTrackDialog";
import { SectionHeading } from "components/shared/SectionHeading";
import { useState } from "react";
import { useStore } from "stores/store";
import { ProgressTracks } from "./ProgressTracks";

export interface ProgressTrackListProps {
  trackType: TRACK_SECTION_PROGRESS_TRACKS;
  typeLabel: string;
  headingBreakContainer?: boolean;
  readOnly?: boolean;
  isCampaign?: boolean;
}

export function ProgressTrackList(props: ProgressTrackListProps) {
  const { trackType, typeLabel, headingBreakContainer, readOnly, isCampaign } =
    props;

  const setLoadCompletedTracks = useStore((store) =>
    isCampaign
      ? store.campaigns.currentCampaign.tracks.setLoadCompletedTracks
      : store.characters.currentCharacter.tracks.setLoadCompletedTracks
  );
  const [showCompletedTracks, setShowCompletedTracks] = useState(false);
  const toggleShowCompletedTracks = (value: boolean) => {
    if (value) {
      setLoadCompletedTracks();
    }
    setShowCompletedTracks(value);
  };

  const addCampaignProgressTrack = useStore(
    (store) => store.campaigns.currentCampaign.tracks.addTrack
  );
  const addCharacterProgressTrack = useStore(
    (store) => store.characters.currentCharacter.tracks.addTrack
  );

  const [addTrackDialogOpen, setAddTrackDialogOpen] = useState(false);
  return (
    <>
      {!readOnly && (
        <EditOrCreateTrackDialog
          open={addTrackDialogOpen}
          handleClose={() => setAddTrackDialogOpen(false)}
          trackType={trackType}
          trackTypeName={`${typeLabel}`}
          handleTrack={(track) => {
            if (isCampaign) {
              return addCampaignProgressTrack(track);
            } else {
              return addCharacterProgressTrack(track);
            }
          }}
        />
      )}

      <SectionHeading
        label={`${typeLabel}s`}
        action={
          <>
            <FormControlLabel
              control={
                <Checkbox
                  checked={showCompletedTracks}
                  onChange={(evt, checked) =>
                    toggleShowCompletedTracks(checked)
                  }
                />
              }
              label={`Show Completed ${typeLabel}s`}
            />
            {!readOnly && (
              <Button
                color={"inherit"}
                onClick={() => setAddTrackDialogOpen(true)}
              >
                Add {typeLabel}
              </Button>
            )}
          </>
        }
        breakContainer={headingBreakContainer}
      />
      <ProgressTracks
        isCampaign={isCampaign}
        trackType={trackType}
        typeLabel={typeLabel}
        headingBreakContainer={headingBreakContainer}
        readOnly={readOnly}
      />
      {showCompletedTracks && (
        <ProgressTracks
          isCampaign={isCampaign}
          isCompleted
          trackType={trackType}
          typeLabel={typeLabel}
          headingBreakContainer={headingBreakContainer}
          readOnly={readOnly}
        />
      )}
    </>
  );
}
