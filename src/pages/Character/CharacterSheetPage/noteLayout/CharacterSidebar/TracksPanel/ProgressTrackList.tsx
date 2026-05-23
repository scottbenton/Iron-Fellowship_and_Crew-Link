import { Button } from "@mui/material";
import { TrackSectionProgressTracks, TrackTypes } from "types/Track.type";
import { useEffect, useState } from "react";
import { useStore } from "stores/store";
import { ProgressTracks } from "./ProgressTracks";
import { EditOrCreateTrackDialog } from "components/features/ProgressTrack";
import { SidebarHeading } from "./SidebarHeading";

export interface ProgressTrackListProps {
  trackType: TrackSectionProgressTracks | TrackTypes.SceneChallenge;
  typeLabel: string;
  readOnly?: boolean;
  isCampaign?: boolean;
  showCompletedTracks?: boolean;
}

export function ProgressTrackList(props: ProgressTrackListProps) {
  const { trackType, typeLabel, readOnly, isCampaign, showCompletedTracks } =
    props;

  const setLoadCompletedTracks = useStore((store) =>
    isCampaign
      ? store.campaigns.currentCampaign.tracks.setLoadCompletedTracks
      : store.characters.currentCharacter.tracks.setLoadCompletedTracks
  );

  useEffect(() => {
    if (showCompletedTracks) {
      setLoadCompletedTracks();
    }
  }, [showCompletedTracks, setLoadCompletedTracks]);

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
          key={`${trackType}-${addTrackDialogOpen ? "open" : "closed"}`}
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

      <SidebarHeading
        label={`${typeLabel}s`}
        action={
          !readOnly && (
            <Button
              color={"inherit"}
              onClick={() => setAddTrackDialogOpen(true)}
            >
              Add {typeLabel}
            </Button>
          )
        }
      />
      <ProgressTracks
        isCampaign={isCampaign}
        trackType={trackType}
        typeLabel={typeLabel}
        readOnly={readOnly}
      />
      {showCompletedTracks && (
        <ProgressTracks
          isCampaign={isCampaign}
          isCompleted
          trackType={trackType}
          typeLabel={typeLabel}
          readOnly={readOnly}
        />
      )}
    </>
  );
}
